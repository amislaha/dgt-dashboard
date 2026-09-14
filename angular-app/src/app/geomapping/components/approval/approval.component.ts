import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { geomappingSvg } from '../../config/icons';
import { APPROVAL_ACTION_LABEL, APPROVAL_META, ApprovalHistoryEntry, ApprovalStatus, Classification, Compartment, GeomappingFeature } from '../../models/geomapping.model';
import { fmtWhen, geomLabel } from '../../services/geo-math';
import { GeomappingDataService } from '../../services/geomapping-data.service';
import { GeomappingToastService } from '../../services/geomapping-toast.service';

type ApprFilter = 'all' | ApprovalStatus;

/**
 * Ports `renderApprovalPanel()`/`apprRowHtml()`/`approvalMetaHtml()`/`apprHistoryHtml()`/
 * `apprChip()` (geomapping/index.html:3043-3145) — "Approval", PRD open question #2. Any signed-in
 * user may act as reviewer (front-end prototype, no real role check — same as the original).
 *
 * `zoomToFeature()`/`openEditor()` (the "Buka di peta / editor" link) are disabled here: Edit Mode
 * hasn't been ported yet (see PORT_NOTES.md) and the shell owns the persistent map this panel has
 * no reference to, so there's nowhere for that link to actually go until both land.
 */
@Component({
  selector: 'dgt-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit, OnDestroy {
  features: GeomappingFeature[] = [];
  classifications: Classification[] = [];

  filter: ApprFilter = 'all';
  openId: { [id: string]: boolean } = {};
  noteDraft: { [id: string]: string } = {};

  readonly filterOptions: [ApprFilter, string][] = [
    ['all', 'Semua'],
    ['PENDING', 'Menunggu'],
    ['APPROVED', 'Disetujui'],
    ['REJECTED', 'Ditolak']
  ];

  private readonly subs: Subscription[] = [];

  constructor(readonly data: GeomappingDataService, private readonly toast: GeomappingToastService, private readonly router: Router) {}

  ngOnInit(): void {
    this.subs.push(this.data.features$.subscribe(f => (this.features = f)));
    this.subs.push(this.data.classifications$.subscribe(c => (this.classifications = c)));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  count(status: ApprFilter): number {
    return status === 'all' ? this.features.length : this.data.apprCount(status);
  }

  get pool(): GeomappingFeature[] {
    const filtered = this.features.filter(f => this.filter === 'all' || f.approval.status === this.filter);
    const rank: { [key in ApprovalStatus]: number } = { PENDING: 0, REJECTED: 1, APPROVED: 2 };
    return filtered.slice().sort((x, y) => {
      const d = rank[x.approval.status] - rank[y.approval.status];
      return d || (y.approval.submittedAt || '').localeCompare(x.approval.submittedAt || '');
    });
  }

  setFilter(f: ApprFilter): void {
    this.filter = f;
  }

  toggleOpen(id: string): void {
    this.openId[id] = !this.openId[id];
  }

  clsOf(f: GeomappingFeature): Classification {
    return this.data.clsById(f.classificationId);
  }
  wcOf(f: GeomappingFeature): Compartment | null {
    return f.compartmentId ? this.data.wcById(f.compartmentId) : null;
  }
  geomLabel(f: GeomappingFeature): string {
    return geomLabel(f.geometry.type);
  }
  statusMeta(status: ApprovalStatus): { label: string; color: string } {
    return APPROVAL_META[status] || APPROVAL_META.PENDING;
  }
  actionLabel(action: ApprovalHistoryEntry['action']): string {
    return APPROVAL_ACTION_LABEL[action] || action;
  }
  /** Ports `(APPROVAL_META[h.action] || {}).color || 'var(--series-2)'` — history entries can be
   *  SUBMITTED/RESET, which have no APPROVAL_META entry of their own (only PENDING/APPROVED/
   *  REJECTED do), so those fall back to the series-2 colour rather than borrowing PENDING's. */
  historyDotColor(action: ApprovalHistoryEntry['action']): string {
    const meta = (APPROVAL_META as { [key: string]: { label: string; color: string } })[action];
    return meta ? meta.color : 'var(--series-2)';
  }
  fmtWhen(iso: string | null): string {
    return iso ? fmtWhen(Date.parse(iso)) : '-';
  }
  iconSvg(name: string): string {
    return geomappingSvg(name);
  }

  /** "Buka di peta / editor" — the original pans the map + opens the feature editor
   *  (`zoomToFeature()`/`openEditor()`). Neither exists in this port yet (Edit Mode isn't ported —
   *  see PORT_NOTES.md — and the shell's persistent map isn't reachable from a routed panel like
   *  this one), so this just routes to Edit Mode's placeholder for now rather than doing nothing. */
  goToEditor(): void {
    this.router.navigateByUrl('/geomapping/edit');
  }

  act(f: GeomappingFeature, status: ApprovalStatus): void {
    const note = (this.noteDraft[f.id] || '').trim();
    if (status === 'REJECTED' && !note) {
      this.toast.show('Beri catatan alasan penolakan', 'err');
      return;
    }
    this.data.setApproval(f.id, status, note);
    this.toast.show('Status diperbarui: ' + this.statusMeta(status).label, 'ok');
  }
}
