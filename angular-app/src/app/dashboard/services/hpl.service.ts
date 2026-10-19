import { Injectable } from '@angular/core';
import { HPL_GENERASI, HPL_INVENTARISASI, HPL_LOKASI, HPL_META, HPL_TEMUAN } from '../components/hpl/hpl.data';

/**
 * Data + aggregation for the "HPL Transmigrasi" module — a port of Panel A ("Executive Overview")
 * of the standalone "Pusat Kendali HPL Transmigrasi" page. The aggregation rules (`agg()`,
 * certified area capped at each location's own area, SK counted once per id_sk) are copied from
 * that page so the numbers match it exactly.
 *
 * Unlike the rest of the dashboard this is real Daftar Induk HPL data, not illustrative — see
 * hpl.data.ts for its source. Findings carry no follow-up status here (the source page reads that
 * from a shared store this app doesn't have), so every finding counts as open.
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

export interface HplTemuan {
  prov: string;
  kab: string;
  pr: string;
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
  nsert: number;
  hilang: number;
}

export interface HplGroup {
  label: string;
  full: string;
  luas: number;
  ls: number;
}

export const HPL_META_INFO = HPL_META;

@Injectable({ providedIn: 'root' })
export class HplService {
  readonly rows: HplRow[] = HPL_LOKASI.map(r => {
    const luas = +r[4] || 0;
    return {
      sid: r[0],
      prov: r[1],
      kab: r[2],
      gen: HPL_GENERASI[r[3]],
      luas,
      ls: Math.min(+r[7] || 0, luas),
      dok: r[5] === 1,
      nsert: r[6],
      hilang: r[8],
      peta: r[9] === 1,
      inv: HPL_INVENTARISASI[r[10]],
      prio: r[11]
    };
  });

  readonly temuan: HplTemuan[] = HPL_TEMUAN.map(t => ({ prov: t[0], kab: t[1], pr: t[2] }));

  readonly provinsi: string[] = Array.from(new Set(this.rows.map(r => r.prov))).sort((a, b) => a.localeCompare(b, 'id'));

  kabupatenOf(prov: string): string[] {
    const set = new Set(this.rows.filter(r => !prov || r.prov === prov).map(r => r.kab).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }

  rowsIn(prov: string, kab: string): HplRow[] {
    return this.rows.filter(r => (!prov || r.prov === prov) && (!kab || r.kab === kab));
  }

  temuanIn(prov: string, kab: string): HplTemuan[] {
    return this.temuan.filter(t => (!prov || t.prov === prov) && (!kab || t.kab === kab));
  }

  agg(rows: HplRow[]): HplAgg {
    const o: HplAgg = { lok: rows.length, luas: 0, ls: 0, peta: 0, lpeta: 0, inv: 0, linv: 0, rinv: 0, sk: 0, skdok: 0, tinggi: 0, nsert: 0, hilang: 0 };
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
