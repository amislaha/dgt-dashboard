import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { describeGeometry } from '../models/drawn-geometry.model';
import { FieldConfig } from '../models/field-config.model';
import {
  Submission,
  SubmissionHistoryEntry,
  SubmissionStatus,
  SUBMISSION_ACTION_LABEL,
  SUBMISSION_MODE_LABEL,
  SUBMISSION_STATUS_META
} from '../models/submission.model';
import { getOperator } from '../services/entity-crud.service';
import { EntityRegistryService } from '../services/entity-registry.service';
import { MapDrawService } from '../services/map-draw.service';
import { SubmissionService } from '../services/submission.service';

type ApprFilter = 'all' | SubmissionStatus;

interface ChangeEntry {
  label: string;
  /** null when there is no "old" side to show (create, or an update whose previous values are unknown). */
  before: string | null;
  /** null for a delete. */
  after: string | null;
}

interface ChangeSection {
  label: string;
  entries: ChangeEntry[];
}

const PAGE_SIZE = 10;
const TZ = 'Asia/Jakarta';

/**
 * "Persetujuan" — reviews Submissions in two views inside the hub's side panel: a paged, searchable
 * table (status tabs with counts), and a detail page for one submission whose changed fields are
 * grouped into the target entity's form sections (`FieldConfig.section`), each shown as old value
 * (struck through) → new value.
 *
 * "Old" comes from `Submission.previousValues` (snapshotted at submit time); older submissions
 * without it fall back to the live record while still PENDING, and to new-values-only afterwards.
 * Opening a submission that carries a `geometry` previews it on the hub's shared map via
 * `MapDrawService.showPreview()`.
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
  query = '';
  page = 1;

  selected: Submission | null = null;
  sections: ChangeSection[] = [];
  activeSection = 0;
  noteDraft = '';
  reviewerDraft = getOperator();

  private readonly sub: Subscription;

  constructor(
    private readonly submissions: SubmissionService,
    private readonly registry: EntityRegistryService,
    private readonly mapDraw: MapDrawService,
    private readonly toast: ToastService
  ) {
    this.sub = this.submissions.changes.subscribe(list => {
      this.items = list;
      if (this.selected) {
        const id = this.selected.id;
        this.selected = list.find(s => s.id === id) || null;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.mapDraw.clearPreview();
  }

  // ---- list ----

  count(status: ApprFilter): number {
    return this.submissions.count(status);
  }

  get filtered(): Submission[] {
    const q = this.query.trim().toLowerCase();
    const rank: { [key in SubmissionStatus]: number } = { PENDING: 0, REJECTED: 1, APPROVED: 2 };
    return this.items
      .filter(s => this.filter === 'all' || s.status === this.filter)
      .filter(s => !q || [s.targetLabel, s.submittedBy, this.entityLabel(s.entityKey), s.summary].some(v => (v || '').toLowerCase().indexOf(q) !== -1))
      .sort((a, b) => rank[a.status] - rank[b.status] || b.submittedAt.localeCompare(a.submittedAt));
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.filtered.length / PAGE_SIZE));
  }

  get pageItems(): Submission[] {
    const start = (Math.min(this.page, this.pageCount) - 1) * PAGE_SIZE;
    return this.filtered.slice(start, start + PAGE_SIZE);
  }

  get pages(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }

  setFilter(f: ApprFilter): void {
    this.filter = f;
    this.page = 1;
  }

  onSearch(value: string): void {
    this.query = value;
    this.page = 1;
  }

  goPage(p: number): void {
    this.page = Math.max(1, Math.min(this.pageCount, p));
  }

  initial(name: string): string {
    return (name || '?').trim().charAt(0).toUpperCase();
  }

  fmtDate(iso: string | null): string {
    return iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ }) : '—';
  }

  fmtTime(iso: string | null): string {
    return iso ? new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: TZ }) + ' WIB' : '';
  }

  // ---- detail ----

  open(s: Submission): void {
    this.selected = s;
    this.sections = this.buildSections(s);
    this.activeSection = 0;
    this.noteDraft = '';
    this.mapDraw.showPreview(s.geometry || (s.fieldValues && s.fieldValues.geometry) || null);
  }

  close(): void {
    this.selected = null;
    this.mapDraw.clearPreview();
  }

  historyColor(action: SubmissionHistoryEntry['action']): 'good' | 'warn' | 'critical' | 'neutral' {
    if (action === 'APPROVED') return 'good';
    if (action === 'REJECTED') return 'critical';
    return 'neutral';
  }

  act(status: SubmissionStatus): void {
    const s = this.selected;
    if (!s) {
      return;
    }
    const reviewer = (this.reviewerDraft || '').trim();
    const note = this.noteDraft.trim();
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
    this.noteDraft = '';
    if (this.selected) {
      this.sections = this.buildSections(this.selected);
    }
    this.toast.show(
      status === 'APPROVED' ? 'Pengajuan disetujui dan diterapkan ke data.' : 'Status pengajuan diperbarui: ' + this.statusMeta[status].label,
      'success'
    );
  }

  private buildSections(s: Submission): ChangeSection[] {
    const config = ENTITY_CONFIGS[s.entityKey];
    const live = s.status === 'PENDING' && s.targetId ? this.registry.get(s.entityKey).service.get(s.targetId) : null;
    const previous = s.previousValues || live || null;
    const next = s.fieldValues || {};

    const sections: ChangeSection[] = [];
    config.fields.forEach(field => {
      if (field.section || !sections.length) {
        sections.push({ label: field.section || 'Data', entries: [] });
      }
      const before = previous ? this.formatFieldValue(field, previous[field.name]) : '';
      const after = this.formatFieldValue(field, next[field.name]);
      let entry: ChangeEntry | null = null;
      if (s.mode === 'delete') {
        entry = before ? { label: field.label, before, after: null } : null;
      } else if (s.mode === 'update' && previous) {
        entry = before !== after ? { label: field.label, before: before || '—', after: after || '—' } : null;
      } else {
        entry = after ? { label: field.label, before: null, after } : null;
      }
      if (entry) {
        sections[sections.length - 1].entries.push(entry);
      }
    });
    return sections.filter(section => section.entries.length);
  }

  private formatFieldValue(field: FieldConfig, value: any): string {
    if (value == null || value === '') {
      return '';
    }
    if (field.type === 'fk' && field.fkEntity) {
      const entry = this.registry.get(field.fkEntity);
      const record = entry.service.get(value);
      return record ? String(record[entry.config.titleField]) : `⚠ tidak ditemukan (${value})`;
    }
    if (field.type === 'geometry') {
      return describeGeometry(value);
    }
    if (field.type === 'boolean') {
      return value ? 'Ya' : 'Tidak';
    }
    return String(value);
  }
}
