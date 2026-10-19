import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hpl, HPL_GENERASI } from '../../data-manager/models/hpl.model';
import { HplCrudService } from '../../data-manager/services/hpl-crud.service';

/**
 * Aggregates for the "HPL Transmigrasi" overview. Reads the HPL lokasi entered on the Data
 * Manager's "HPL" page (same HplCrudService, same `dgt-data-manager:hpl` localStorage key), so
 * edits there show up here on the next visit. Seeded with illustrative data until real records
 * are entered.
 */
export interface HplRow {
  sid: string;
  prov: string;
  kab: string;
  gen: string;
  luas: number;
  /** Certified area, capped at `luas`. */
  ls: number;
  dok: boolean;
  nsert: number;
  hilang: number;
  peta: boolean;
  inv: string;
  prio: string;
}

export interface HplAgg {
  lok: number;
  luas: number;
  ls: number;
  peta: number;
  lpeta: number;
  inv: number;
  linv: number;
  rinv: number;
  sk: number;
  skdok: number;
  tinggi: number;
  sedang: number;
  nsert: number;
  hilang: number;
}

export interface HplGroup {
  label: string;
  full: string;
  luas: number;
  ls: number;
}

@Injectable({ providedIn: 'root' })
export class HplOverviewService {
  constructor(private readonly crud: HplCrudService) {}

  rows(): Observable<HplRow[]> {
    return this.crud.changes.pipe(map(list => list.map(toRow)));
  }

  provinsiOf(rows: HplRow[]): string[] {
    return Array.from(new Set(rows.map(r => r.prov).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id'));
  }

  kabupatenOf(rows: HplRow[], prov: string): string[] {
    const set = new Set(rows.filter(r => !prov || r.prov === prov).map(r => r.kab).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }

  agg(rows: HplRow[]): HplAgg {
    const o: HplAgg = { lok: rows.length, luas: 0, ls: 0, peta: 0, lpeta: 0, inv: 0, linv: 0, rinv: 0, sk: 0, skdok: 0, tinggi: 0, sedang: 0, nsert: 0, hilang: 0 };
    const sks = new Map<string, boolean>();
    rows.forEach(r => {
      o.luas += r.luas;
      o.ls += r.ls;
      if (r.peta) {
        o.peta++;
        o.lpeta += r.luas;
      }
      if (r.inv === 'Sudah') {
        o.inv++;
        o.linv += r.luas;
      }
      if (r.inv === 'Rencana 2026') {
        o.rinv += r.luas;
      }
      if (r.prio === 'Tinggi') {
        o.tinggi++;
      }
      if (r.prio === 'Sedang') {
        o.sedang++;
      }
      o.nsert += r.nsert;
      o.hilang += r.hilang;
      sks.set(r.sid, r.dok);
    });
    o.sk = sks.size;
    sks.forEach(v => {
      if (v) {
        o.skdok++;
      }
    });
    return o;
  }

  /** Top 12 provinces (or kabupaten, once a province is chosen) by area. */
  byWilayah(rows: HplRow[], byKab: boolean): HplGroup[] {
    const m = new Map<string, HplGroup>();
    rows.forEach(r => {
      const k = (byKab ? r.kab : r.prov) || '(tanpa nama)';
      const g = m.get(k) || { label: k, full: k, luas: 0, ls: 0 };
      g.luas += r.luas;
      g.ls += r.ls;
      m.set(k, g);
    });
    return Array.from(m.values()).sort((a, b) => b.luas - a.luas).slice(0, 12);
  }

  byGenerasi(rows: HplRow[]): HplGroup[] {
    return HPL_GENERASI.map(g => {
      const rr = rows.filter(r => r.gen === g);
      return { label: g.split(' (')[0], full: g, luas: rr.reduce((a, r) => a + r.luas, 0), ls: rr.reduce((a, r) => a + r.ls, 0) };
    }).filter(g => g.luas > 0);
  }
}

function toRow(h: Hpl): HplRow {
  const luas = Number(h.luas) || 0;
  return {
    // One SK per record unless two records share a nomor (counted once, like the Daftar Induk).
    sid: (h.nomorSk || h.id).trim(),
    prov: h.provinsi || '',
    kab: h.kabupaten || '',
    gen: h.generasi || 'Tidak diketahui',
    luas,
    ls: Math.min(Number(h.luasSertifikat) || 0, luas),
    dok: h.dokumenSk === 'Ada',
    nsert: Number(h.jumlahSertifikat) || 0,
    hilang: Number(h.sertifikatAsliHilang) || 0,
    peta: !!h.adaPeta,
    inv: h.inventarisasi || 'Belum',
    prio: h.prioritas || ''
  };
}
