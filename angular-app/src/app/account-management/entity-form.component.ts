import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ENTITY_LABELS, EntityKind, EntityStoreService, SimpleEntity } from './entity-store.service';
import { ToastService } from '../shared/services/toast.service';

/** Create/edit page for the Entities menu: `<kind>/new` or `<kind>/:id/edit`. */
@Component({
  selector: 'dgt-am-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class EntityFormComponent {
  readonly kind: EntityKind;
  readonly label: string;
  form: Partial<SimpleEntity> = { name: '', description: '' };
  nameError = '';

  constructor(route: ActivatedRoute, private readonly router: Router,
              private readonly store: EntityStoreService, private readonly toast: ToastService) {
    this.kind = route.snapshot.data.kind;
    this.label = ENTITY_LABELS[this.kind];
    const id = Number(route.snapshot.paramMap.get('id'));
    if (id) {
      const existing = this.store.get(this.kind, id);
      if (existing) {
        this.form = { ...existing };
      } else {
        this.router.navigate(['/account-management', this.kind]);
      }
    }
  }

  get title(): string {
    return (this.form.id ? 'Ubah ' : 'Tambah ') + this.label;
  }

  submit(): void {
    const name = (this.form.name || '').trim();
    this.nameError = '';
    if (!name) { this.nameError = 'Nama wajib diisi.'; }
    else if (this.store.isTaken(this.kind, name, this.form.id)) { this.nameError = 'Nama sudah dipakai.'; }
    if (this.nameError) { return; }
    this.store.save(this.kind, { ...this.form, name });
    this.toast.show(this.label + ' disimpan');
    this.router.navigate(['/account-management', this.kind]);
  }
}
