import { Injectable } from '@angular/core';
import { PRODUK_WILAYAH_TUPLES, PROFIL_WILAYAH_TUPLES } from '../data/profil-master.data';
import { buildProdukWilayahSeed, buildProfilWilayahSeed } from '../data/profil-master.defs';
import { ProdukWilayah } from '../models/produk-wilayah.model';
import { ProfilWilayah } from '../models/profil-wilayah.model';
import { EntityCrudService } from './entity-crud.service';

@Injectable({ providedIn: 'root' })
export class ProfilWilayahCrudService extends EntityCrudService<ProfilWilayah> {
  constructor() {
    super('profilWilayah', buildProfilWilayahSeed(PROFIL_WILAYAH_TUPLES), 'pfw');
  }
}

@Injectable({ providedIn: 'root' })
export class ProdukWilayahCrudService extends EntityCrudService<ProdukWilayah> {
  constructor() {
    super('produkWilayah', buildProdukWilayahSeed(PRODUK_WILAYAH_TUPLES), 'pdw');
  }
}
