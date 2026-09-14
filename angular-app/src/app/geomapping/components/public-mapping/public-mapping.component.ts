import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Compartment, GeomappingFeature, WC_THUMBS } from '../../models/geomapping.model';
import { GeomappingDataService } from '../../services/geomapping-data.service';
import { GeomappingToastService } from '../../services/geomapping-toast.service';

/**
 * Ports `renderPublicPanel()` (geomapping/index.html:2749) — "Main Menu → Public Mapping
 * (WorkCompartment)", PRD F-4.1–F-4.4. Create/activate/exit/delete a WorkCompartment; features
 * recorded while one is active get tagged with it (wired in Phase 2's editor, not yet in this
 * read-only pass — see the module's PORT_NOTES.md).
 */
@Component({
  selector: 'dgt-public-mapping',
  templateUrl: './public-mapping.component.html',
  styleUrls: ['./public-mapping.component.scss']
})
export class PublicMappingComponent implements OnInit, OnDestroy {
  compartments: Compartment[] = [];
  features: GeomappingFeature[] = [];
  activeCompartmentId: string | null = null;

  wcCreating = false;
  wcDraft = { name: '', desc: '', thumb: WC_THUMBS[0] };
  wcNameInvalid = false;
  readonly wcThumbs = WC_THUMBS;

  deleteArmedId: string | null = null;

  private readonly subs: Subscription[] = [];

  constructor(readonly data: GeomappingDataService, private readonly toast: GeomappingToastService) {}

  ngOnInit(): void {
    this.subs.push(this.data.compartments$.subscribe(c => (this.compartments = c)));
    this.subs.push(this.data.features$.subscribe(f => (this.features = f)));
    this.subs.push(this.data.activeCompartment$.subscribe(id => (this.activeCompartmentId = id)));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  get activeCompartment(): Compartment | null {
    return this.data.wcById(this.activeCompartmentId);
  }

  featureCount(compartmentId: string): number {
    return this.features.filter(f => f.compartmentId === compartmentId).length;
  }

  startCreate(): void {
    this.wcCreating = true;
    this.wcDraft = { name: '', desc: '', thumb: WC_THUMBS[0] };
    this.wcNameInvalid = false;
  }

  cancelCreate(): void {
    this.wcCreating = false;
  }

  saveCreate(): void {
    const name = (this.wcDraft.name || '').trim();
    if (!name) {
      this.wcNameInvalid = true;
      this.toast.show('Nama wajib diisi', 'err');
      return;
    }
    this.data.createCompartment(name, (this.wcDraft.desc || '').trim(), this.wcDraft.thumb);
    this.wcCreating = false;
    this.toast.show('WorkCompartment dibuat & diaktifkan', 'ok');
  }

  toggleActive(c: Compartment): void {
    const next = this.activeCompartmentId === c.id ? null : c.id;
    this.data.setActiveCompartment(next);
    this.data.logActivity(next ? 'Aktifkan WorkCompartment: ' + c.name : 'Kembali ke Public Mapping default');
    this.toast.show(next ? 'Kompartemen aktif: ' + c.name : 'Kembali ke Public Mapping', 'ok');
  }

  exitCompartment(): void {
    this.data.exitCompartment();
    this.toast.show('Kembali ke Public Mapping', 'ok');
  }

  armDelete(id: string, ev: Event): void {
    ev.stopPropagation();
    if (this.deleteArmedId !== id) {
      this.deleteArmedId = id;
      setTimeout(() => {
        if (this.deleteArmedId === id) {
          this.deleteArmedId = null;
        }
      }, 2600);
      return;
    }
    this.data.deleteCompartment(id);
    this.deleteArmedId = null;
    this.toast.show('WorkCompartment dihapus', 'ok');
  }
}
