import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataTableColumn } from '../../shared/components/data-table/data-table.model';
import { ToastService } from '../../shared/services/toast.service';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { EntityKey, ENTITY_ORDER } from '../models/entity-key.model';
import { Submission, SubmissionMode, SUBMISSION_MODE_LABEL, SUBMISSION_STATUS_META } from '../models/submission.model';
import { EntityRegistryService } from '../services/entity-registry.service';
import { SubmissionService } from '../services/submission.service';

/**
 * "Pengajuan Data" — lets anyone propose a create/update/delete on one of the 8 master-data
 * entities, attach photo evidence, and see the resulting queue. Review/approve lives on the
 * separate Approval page (submission-approval.component.ts); this page only creates and lists.
 */
@Component({
  selector: 'dgt-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnDestroy {
  readonly entityOptions = ENTITY_ORDER.map(key => ({ key, label: ENTITY_CONFIGS[key].label }));
  readonly modeOptions: [SubmissionMode, string][] = [
    ['create', SUBMISSION_MODE_LABEL.create],
    ['update', SUBMISSION_MODE_LABEL.update],
    ['delete', SUBMISSION_MODE_LABEL.delete]
  ];
  readonly statusMeta = SUBMISSION_STATUS_META;
  readonly modeLabel = SUBMISSION_MODE_LABEL;

  // sortable omitted (defaults to false in dgt-data-table's own model) — this list has no
  // sortChange handler wired up, unlike entity-list's, so a sortable header here would be a
  // dead affordance.
  columns: DataTableColumn<Submission>[] = [
    { key: 'entityKey', label: 'Entitas', format: row => ENTITY_CONFIGS[row.entityKey].label },
    { key: 'mode', label: 'Jenis', format: row => SUBMISSION_MODE_LABEL[row.mode] },
    { key: 'targetLabel', label: 'Target/Usulan' },
    { key: 'submittedBy', label: 'Diajukan oleh' },
    { key: 'submittedAt', label: 'Tanggal', format: row => new Date(row.submittedAt).toLocaleString('id-ID') },
    { key: 'status', label: 'Status', format: row => this.statusMeta[row.status].label }
  ];
  rows: Submission[] = [];

  drawerOpen = false;
  draftEntityKey: EntityKey = ENTITY_ORDER[0];
  draftMode: SubmissionMode = 'create';
  draftTargetId = '';
  draftTargetLabel = '';
  draftSummary = '';
  draftSubmittedBy = '';
  draftImages: string[] = [];

  private readonly sub: Subscription;

  constructor(private readonly submissions: SubmissionService, private readonly registry: EntityRegistryService, private readonly toast: ToastService) {
    this.sub = this.submissions.changes.subscribe(list => (this.rows = list));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get targetOptions(): Array<{ id: string; label: string }> {
    const entry = this.registry.get(this.draftEntityKey);
    return entry.service.list().map(record => ({ id: record.id, label: String(record[entry.config.titleField]) }));
  }

  get needsTargetPicker(): boolean {
    return this.draftMode !== 'create';
  }

  openCreate(): void {
    this.draftEntityKey = ENTITY_ORDER[0];
    this.draftMode = 'create';
    this.draftTargetId = '';
    this.draftTargetLabel = '';
    this.draftSummary = '';
    this.draftSubmittedBy = '';
    this.draftImages = [];
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
  }

  onFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.draftImages.push(String(reader.result));
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeImage(index: number): void {
    this.draftImages.splice(index, 1);
  }

  submitDraft(): void {
    const submittedBy = this.draftSubmittedBy.trim();
    const summary = this.draftSummary.trim();
    if (!submittedBy || !summary) {
      this.toast.show('Isi "Diajukan oleh" dan ringkasan perubahan terlebih dahulu.', 'danger');
      return;
    }
    if (this.needsTargetPicker && !this.draftTargetId) {
      this.toast.show('Pilih data target untuk diubah/dihapus.', 'danger');
      return;
    }

    const targetLabel = this.needsTargetPicker
      ? this.targetOptions.find(o => o.id === this.draftTargetId)!.label
      : this.draftTargetLabel.trim() || '(tanpa nama)';

    this.submissions.submit({
      entityKey: this.draftEntityKey,
      mode: this.draftMode,
      targetId: this.needsTargetPicker ? this.draftTargetId : null,
      targetLabel,
      summary,
      images: this.draftImages,
      submittedBy
    });
    this.toast.show('Pengajuan dikirim, menunggu persetujuan.', 'success');
    this.closeDrawer();
  }
}
