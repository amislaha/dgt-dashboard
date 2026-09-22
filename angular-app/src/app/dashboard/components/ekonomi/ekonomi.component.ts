import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DashboardDataService,
  Kawasan,
  Komoditas,
  ProfilDetail,
  profilDetailData,
  Province,
  Wilayah,
  WILAYAH_COLOR_HEX,
  wilayahOf
} from '../../services/dashboard-data.service';

interface KomoditasCard {
  nama: string;
  kategori: string;
  ids: string[];
}

interface ProductivityRow {
  nama: string;
  val: number;
  pct: number;
  delta: number;
  color: string;
}

/** Ports `renderEkonomi()` (legacy-static/dashboard/index.html) — "Ekonomi & Investasi Kawasan".
 *  Rebuilt (per a later wireframe) from a bar-chart/stepper/static-table page into a national
 *  investment-discovery portal: commodity shortcut cards, a filter sidebar + wilayah-colored map,
 *  national productivity bars, and two summary tables, plus a per-commodity kawasan card grid.
 *  There's no third, separate "kawasan investment profile" page — a card or map-pin click
 *  navigates to the Data Induk & Profil Kawasan detail page's Ekonomi tab (see
 *  goToKawasanProfile()) via a `?kawasan=<id>` query param, rather than duplicating
 *  luas/penduduk/pendapatan a third time. */
@Component({
  selector: 'dgt-ekonomi',
  templateUrl: './ekonomi.component.html',
  styleUrls: ['./ekonomi.component.scss']
})
export class EkonomiComponent implements OnInit {
  kawasan: Kawasan[] = [];
  provinces: Province[] = [];
  komoditasNasional: Komoditas[] = [];

  readonly wilayahColor = WILAYAH_COLOR_HEX;
  readonly infrastrukturList = ['Penggilingan', 'Lumbung', 'Combine harvester', 'Grain dryer'];

  view: 'landing' | 'grid' = 'landing';
  komoditasCards: KomoditasCard[] = [];
  selectedKomoditas: KomoditasCard | null = null;

  areaFilter = 'Semua';
  wilayahFilter: 'Semua' | Wilayah = 'Semua';
  kategoriFilter = 'Semua';
  search = '';

  private detailCache = new Map<string, ProfilDetail>();

  constructor(private readonly data: DashboardDataService, private readonly router: Router) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
    this.provinces = this.data.getProvinces();
    this.komoditasNasional = this.data.getKomoditas();
    this.rebuildKomoditasCards();
  }

  detailFor(k: Kawasan): ProfilDetail {
    let d = this.detailCache.get(k.id);
    if (!d) {
      d = profilDetailData(k);
      this.detailCache.set(k.id, d);
    }
    return d;
  }

  /* every kawasan's produkUnggulan (from profilDetailData(), shared with Data Induk) always has one
     entry per of the 4 fixed categories — Kategori Sektor filters which commodities surface as
     shortcut cards, not which kawasan appear (every kawasan "has" all 4 categories in this
     fabricated model, so filtering the kawasan pool by sector would be a no-op either way). */
  private komoditasFreq(kategoriFilter: string): { [nama: string]: KomoditasCard } {
    const freq: { [nama: string]: KomoditasCard } = {};
    this.kawasan.forEach(k => {
      this.detailFor(k).produkUnggulan.forEach(p => {
        if (kategoriFilter !== 'Semua' && p.kategori !== kategoriFilter) {
          return;
        }
        if (!freq[p.komoditas]) {
          freq[p.komoditas] = { nama: p.komoditas, kategori: p.kategori, ids: [] };
        }
        freq[p.komoditas].ids.push(k.id);
      });
    });
    return freq;
  }

  rebuildKomoditasCards(): void {
    const freq = this.komoditasFreq(this.kategoriFilter);
    this.komoditasCards = Object.keys(freq)
      .map(nm => freq[nm])
      .sort((a, b) => b.ids.length - a.ids.length)
      .slice(0, 5);
  }

  openKomoditas(nama: string): void {
    const freq = this.komoditasFreq('Semua');
    this.selectedKomoditas = freq[nama] || { nama, kategori: '', ids: [] };
    this.view = 'grid';
  }

  backToLanding(): void {
    this.view = 'landing';
  }

  get gridKawasan(): Kawasan[] {
    if (!this.selectedKomoditas) {
      return [];
    }
    const pool = this.selectedKomoditas.ids.map(id => this.kawasan.find(k => k.id === id)).filter((k): k is Kawasan => !!k);
    return this.areaFilter === 'Semua' ? pool : pool.filter(k => k.provinsi === this.areaFilter);
  }

  get filteredKawasan(): Kawasan[] {
    const q = this.search.trim().toLowerCase();
    return this.kawasan.filter(k => {
      if (this.wilayahFilter !== 'Semua' && wilayahOf(k) !== this.wilayahFilter) {
        return false;
      }
      if (this.areaFilter !== 'Semua' && k.provinsi !== this.areaFilter) {
        return false;
      }
      if (q && (k.nama + ' ' + k.provinsi + ' ' + k.kabupaten).toLowerCase().indexOf(q) === -1) {
        return false;
      }
      return true;
    });
  }

  get topProduksi(): { k: Kawasan; d: ProfilDetail }[] {
    return this.filteredKawasan
      .map(k => ({ k, d: this.detailFor(k) }))
      .sort((a, b) => b.d.produksiTon - a.d.produksiTon)
      .slice(0, 4);
  }

  get productivityRows(): ProductivityRow[] {
    const rows = this.komoditasNasional.map(k => ({ nama: k.nama, val: Math.round((k.nilai / 15) * 10) / 10 }));
    const avg = rows.reduce((s, r) => s + r.val, 0) / rows.length;
    const max = Math.max(...rows.map(r => r.val));
    return rows.map(r => {
      const delta = r.val - avg;
      const color = delta >= 0.3 ? 'var(--good)' : delta <= -0.3 ? 'var(--critical)' : 'var(--warn)';
      return { nama: r.nama, val: r.val, pct: (r.val / max) * 100, delta, color };
    });
  }

  fillColorOf = (k: Kawasan): string => WILAYAH_COLOR_HEX[wilayahOf(k)];
  popupOf = (k: Kawasan): string => `<b>${k.nama}</b><br/>${k.provinsi}<br/>Wilayah: ${wilayahOf(k)}`;

  goToKawasanProfile(id: string): void {
    this.router.navigate(['/dashboard/profil'], { queryParams: { kawasan: id } });
  }
}
