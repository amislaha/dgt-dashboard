import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataTableColumn } from '../../shared/components/data-table/data-table.model';
import { ToastService } from '../../shared/services/toast.service';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { DrawGeometryType, DrawnGeometry } from '../models/drawn-geometry.model';
import { EntityKey, MASTER_DATA_ORDER } from '../models/entity-key.model';
import { Submission, SubmissionMode, SUBMISSION_MODE_LABEL, SUBMISSION_STATUS_META } from '../models/submission.model';
import { EntityRegistryService } from '../services/entity-registry.service';
import { MapDrawService } from '../services/map-draw.service';
import { SubmissionService } from '../services/submission.service';

/** Mirrors the header nav's "Wilayah" + "Data Master" grouping (`wpt` first, then
 *  `MASTER_DATA_ORDER` — see entity-key.model.ts), not the raw `ENTITY_ORDER`: the 3 Settings-group
 *  entities (Profil Measure, Application Settings, Approval Flow) aren't sensible things to propose
 *  a create/update/delete against, so they're excluded here even though they're still real,
 *  independently-manageable `EntityConfig`s reachable from the header's Settings dropdown. */
const SUBMITTABLE_ENTITY_ORDER: EntityKey[] = ['wpt', ...MASTER_DATA_ORDER];

/**
 * "Pengajuan Data" — lets anyone propose a create/update/delete on a master-data entity, attach
 * photo evidence, optionally draw a location/boundary on the shared map, and see the resulting
 * queue. Review/approve lives on the separate Approval tab (submission-approval.component.ts); this
 * page only creates and lists.
 *
 * The map lives in the sibling `SubmissionHubComponent`, not here — drawing is mediated through
 * `MapDrawService` (`start()` from this form's buttons, `result$` completes the shape) rather than
 * an `@Input`/`@Output` chain, since this component and the map are siblings, not parent/child.
 */
@Component({
  selector: 'dgt-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnDestroy {
  readonly entityOptions = SUBMITTABLE_ENTITY_ORDER.map(key => ({ key, label: ENTITY_CONFIGS[key].label }));
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
  draftEntityKey: EntityKey = SUBMITTABLE_ENTITY_ORDER[0];
  draftMode: SubmissionMode = 'create';
  draftTargetId = '';
  draftTargetLabel = '';
  draftSummary = '';
  draftSubmittedBy = '';
  draftImages: string[] = [];
  draftGeometry: DrawnGeometry | null = null;

  private readonly subs: Subscription[] = [];

  constructor(
    private readonly submissions: SubmissionService,
    private readonly registry: EntityRegistryService,
    private readonly mapDraw: MapDrawService,
    private readonly toast: ToastService
  ) {
    this.subs.push(this.submissions.changes.subscribe(list => (this.rows = list)));
    // Only accepted while the create/edit drawer is actually open — the map is shared with the
    // Approval tab's read-only preview, but that never calls `mapDraw.start()`, so in practice a
    // result only ever arrives here when this form asked for it.
    this.subs.push(this.mapDraw.result$.subscribe(geometry => {
      if (this.drawerOpen) {
        this.draftGeometry = geometry;
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.mapDraw.cancel();
  }

  get targetOptions(): Array<{ id: string; label: string }> {
    const entry = this.registry.get(this.draftEntityKey);
    return entry.service.list().map(record => ({ id: record.id, label: String(record[entry.config.titleField]) }));
  }

  get needsTargetPicker(): boolean {
    return this.draftMode !== 'create';
  }

  openCreate(): void {
    this.draftEntityKey = SUBMITTABLE_ENTITY_ORDER[0];
    this.draftMode = 'create';
    this.draftTargetId = '';
    this.draftTargetLabel = '';
    this.draftSummary = '';
    this.draftSubmittedBy = '';
    this.draftImages = [];
    this.draftGeometry = null;
    this.drawerOpen = true;
  }

  closeDrawer(): void {
    this.drawerOpen = false;
    this.mapDraw.cancel();
  }

  startDraw(type: DrawGeometryType): void {
    this.mapDraw.start(type);
  }

  clearGeometry(): void {
    this.draftGeometry = null;
    this.mapDraw.cancel();
  }

  get geometrySummary(): string {
    if (!this.draftGeometry) {
      return '';
    }
    if (this.draftGeometry.type === 'Point') {
      return 'Titik ditandai di peta.';
    }
    if (this.draftGeometry.type === 'LineString') {
      return `Garis digambar (${this.draftGeometry.coordinates.length} titik).`;
    }
    return `Area digambar (${this.draftGeometry.coordinates[0].length - 1} titik).`;
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
      geometry: this.draftGeometry,
      submittedBy
    });
    this.toast.show('Pengajuan dikirim, menunggu persetujuan.', 'success');
    this.closeDrawer();
  }
}
