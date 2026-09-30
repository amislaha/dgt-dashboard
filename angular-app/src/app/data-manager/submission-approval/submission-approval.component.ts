import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { FieldConfig } from '../models/field-config.model';
import {
  Submission,
  SubmissionHistoryEntry,
  SubmissionStatus,
  SUBMISSION_ACTION_LABEL,
  SUBMISSION_MODE_LABEL,
  SUBMISSION_STATUS_META
} from '../models/submission.model';
import { EntityRegistryService } from '../services/entity-registry.service';
import { MapDrawService } from '../services/map-draw.service';
import { SubmissionService } from '../services/submission.service';

type ApprFilter = 'all' | SubmissionStatus;

/**
 * "Approval" — reviews pending/approved/rejected Submissions with their photo evidence. Ports the
 * shape of geomapping's ApprovalComponent (status filter chips, expandable rows, approve/reject/
 * reset with a required rejection note, history log) but against Submission instead of
 * GeomappingFeature, and with no "buka di editor" link — there's no separate editor to jump to, but
 * expanding a row that has a `geometry` does show it on the shared map (`SubmissionHubComponent`'s
 * `<dgt-wilayah-map>`) via `MapDrawService.showPreview()`, the same mediator `SubmissionComponent`
 * uses to draw one in the first place.
 *
 * `fieldEntries()` renders a submission's `fieldValues` (the target entity's own fields, captured
 * via `<dgt-entity-form>` on the submitting side — see SubmissionComponent) as label/value pairs,
 * resolving `fk`-typed fields to their referenced record's display label the same way
 * `EntityListComponent.resolveFkLabel()` does, so a reviewer sees names, not raw ids.
 */
@Component({
  selector: 'dgt-submission-approval',
  templateUrl: './submission-approval.component.html',
  styleUrls: ['./submission-approval.component.scss']
})
export class SubmissionApprovalComponent implements OnDestroy {
  readonly filterOptions: [ApprFilter, string][] = [
    ['all', 'Semua'],
    ['PENDING', 'Menunggu'],
    ['APPROVED', 'Disetujui'],
    ['REJECTED', 'Ditolak']
  ];
  readonly statusMeta = SUBMISSION_STATUS_META;
  readonly modeLabel = SUBMISSION_MODE_LABEL;
  readonly actionLabel = SUBMISSION_ACTION_LABEL;
  readonly entityLabel = (key: Submission['entityKey']) => ENTITY_CONFIGS[key].label;

  items: Submission[] = [];
  filter: ApprFilter = 'all';
  openId: { [id: string]: boolean } = {};
  noteDraft: { [id: string]: string } = {};
  reviewerDraft = '';

  private readonly sub: Subscription;

  constructor(
    private readonly submissions: SubmissionService,
    private readonly registry: EntityRegistryService,
    private readonly mapDraw: MapDrawService,
    private readonly toast: ToastService
  ) {
    this.sub = this.submissions.changes.subscribe(list => (this.items = list));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.mapDraw.clearPreview();
  }

  count(status: ApprFilter): number {
    return this.submissions.count(status);
  }

  get pool(): Submission[] {
    const filtered = this.items.filter(s => this.filter === 'all' || s.status === this.filter);
    const rank: { [key in SubmissionStatus]: number } = { PENDING: 0, REJECTED: 1, APPROVED: 2 };
    return filtered.slice().sort((a, b) => rank[a.status] - rank[b.status] || b.submittedAt.localeCompare(a.submittedAt));
  }

  setFilter(f: ApprFilter): void {
    this.filter = f;
  }

  toggleOpen(id: string): void {
    this.openId[id] = !this.openId[id];
    if (this.openId[id]) {
      const submission = this.items.find(s => s.id === id);
      this.mapDraw.showPreview((submission && submission.geometry) || null);
    } else {
      this.mapDraw.clearPreview();
    }
  }

  fmtWhen(iso: string | null): string {
    return iso ? new Date(iso).toLocaleString('id-ID') : '-';
  }

  fieldEntries(s: Submission): Array<{ label: string; value: string }> {
    if (!s.fieldValues) {
      return [];
    }
    const config = ENTITY_CONFIGS[s.entityKey];
    return config.fields
      .filter(f => s.fieldValues![f.name] != null && s.fieldValues![f.name] !== '')
      .map(f => ({ label: f.label, value: this.formatFieldValue(f, s.fieldValues![f.name]) }));
  }

  private formatFieldValue(field: FieldConfig, value: any): string {
    if (field.type === 'fk' && field.fkEntity) {
      const entry = this.registry.get(field.fkEntity);
      const record = entry.service.get(value);
      return record ? String(record[entry.config.titleField]) : `⚠ tidak ditemukan (${value})`;
    }
    if (field.type === 'boolean') {
      return value ? 'Ya' : 'Tidak';
    }
    return String(value);
  }

  historyColor(action: SubmissionHistoryEntry['action']): 'good' | 'warn' | 'critical' | 'neutral' {
    if (action === 'APPROVED') return 'good';
    if (action === 'REJECTED') return 'critical';
    return 'neutral';
  }

  act(s: Submission, status: SubmissionStatus): void {
    const reviewer = this.reviewerDraft.trim();
    const note = (this.noteDraft[s.id] || '').trim();
    if (!reviewer && status !== 'PENDING') {
      this.toast.show('Isi nama reviewer terlebih dahulu.', 'danger');
      return;
    }
    if (status === 'REJECTED' && !note) {
      this.toast.show('Beri catatan alasan penolakan.', 'danger');
      return;
    }
    const error = this.submissions.review(s.id, status, reviewer, note);
    if (error) {
      this.toast.show(error, 'danger');
      return;
    }
    this.toast.show(
      status === 'APPROVED' ? 'Pengajuan disetujui dan diterapkan ke data.' : 'Status pengajuan diperbarui: ' + this.statusMeta[status].label,
      'success'
    );
  }
}
