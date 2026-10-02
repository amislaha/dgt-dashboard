import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DashboardDataService,
  Kawasan,
  Komoditas,
  ProfilDetail,
  profilDetailData,
  Province,
  seededRandom,
  Wilayah,
  WILAYAH_COLOR_HEX,
  wilayahOf
} from '../../services/dashboard-data.service';

const BAR_COLORS = ['#106d30', '#0b98b8', '#0868ad', '#cfa460', '#e8981c', '#7a5cff'];

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
  /** "Kawasan dengan Produksi Terbesar" filter — narrows the ranking to kawasan that list this commodity. */
  komoditasFilter = 'Semua';
  komoditasOptions: string[] = [];

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
    this.komoditasOptions = Object.keys(freq).sort();
    if (this.komoditasFilter !== 'Semua' && this.komoditasOptions.indexOf(this.komoditasFilter) === -1) {
      this.komoditasFilter = 'Semua';
    }
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

  /** Top kawasan by production. With a commodity selected, only kawasan that list it are ranked,
   *  and its tonnage is a seeded share of the kawasan's total (illustrative, like all of this data). */
  get topProduksi(): { k: Kawasan; d: ProfilDetail; ton: number; komoditas: string }[] {
    const sel = this.komoditasFilter;
    return this.filteredKawasan
      .filter(k => sel === 'Semua' || this.detailFor(k).produkUnggulan.some(p => p.komoditas === sel))
      .map(k => {
        const d = this.detailFor(k);
        const ton = sel === 'Semua' ? d.produksiTon : Math.round(d.produksiTon * (0.35 + seededRandom(k.id + '-' + sel)() * 0.65));
        return { k, d, ton, komoditas: sel === 'Semua' ? d.produkUnggulan[2].komoditas : sel };
      })
      .sort((a, b) => b.ton - a.ton)
      .slice(0, 5);
  }

  get productivityRows(): ProductivityRow[] {
    const rows = this.komoditasNasional.map(k => ({ nama: k.nama, val: Math.round((k.nilai / 15) * 10) / 10 }));
    const avg = rows.reduce((s, r) => s + r.val, 0) / rows.length;
    const max = Math.max(...rows.map(r => r.val));
    // One palette colour per commodity (same order as the Kawasan detail modal's bars), so every
    // bar is filled with its own colour instead of a good/bad traffic-light shade.
    return rows.map((r, i) => {
      const delta = r.val - avg;
      return { nama: r.nama, val: r.val, pct: (r.val / max) * 100, delta, color: BAR_COLORS[i % BAR_COLORS.length] };
    });
  }

  /** 24×24 line icon (inner SVG markup, rendered with `currentColor`) for a commodity name. */
  komoditasIcon(nama: string): string {
    const n = nama.toLowerCase();
    let paths: string;
    if (n.indexOf('sawit') > -1 || n.indexOf('kelapa') > -1) {
      paths = '<path d="M12 22V11"/><path d="M12 11C11 7 7 6 4 7c3 0 5 1.5 6 4"/><path d="M12 11c1-4 5-5 8-4-3 0-5 1.5-6 4"/><path d="M12 11c-3-1-5 0-7 2 3-1 5 0 7 0"/><path d="M12 11c3-1 5 0 7 2-3-1-5 0-7 0"/>';
    } else if (n.indexOf('karet') > -1) {
      paths = '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/>';
    } else if (n.indexOf('kakao') > -1 || n.indexOf('kopi') > -1) {
      paths = '<ellipse cx="12" cy="12" rx="5" ry="8.5" transform="rotate(30 12 12)"/><path d="M9 6.5c3 3 6 7 6 11M12.5 5c2 4 3 9 2 13"/>';
    } else if (n.indexOf('padi') > -1 || n.indexOf('jagung') > -1 || n.indexOf('kedelai') > -1 || n.indexOf('ubi') > -1) {
      paths = '<path d="M12 22V9"/><path d="M12 9c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Zm0 0c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z"/><path d="M12 15c-2.5 0-4-1.5-4-4 2.5 0 4 1.5 4 4Zm0 0c2.5 0 4-1.5 4-4-2.5 0-4 1.5-4 4Z"/>';
    } else if (n.indexOf('ikan') > -1 || n.indexOf('tambak') > -1 || n.indexOf('udang') > -1) {
      paths = '<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2Z"/><circle cx="8" cy="11" r=".8" fill="currentColor" stroke="none"/>';
    } else if (n.indexOf('rumput laut') > -1 || n.indexOf('laut') > -1) {
      paths = '<path d="M8 21c0-5 3-5 3-9s-3-4-3-9"/><path d="M15 21c0-5 3-5 3-9s-3-4-3-9"/><path d="M4 21h16"/>';
    } else if (n.indexOf('sapi') > -1 || n.indexOf('kambing') > -1 || n.indexOf('ayam') > -1 || n.indexOf('itik') > -1) {
      paths = '<path d="M5 9c0-2 1.500-3 3-3h8c1.500 0 3 1 3 3v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z"/><path d="M5 9 3 6M19 9l2-3"/><circle cx="9.500" cy="11" r=".8" fill="currentColor" stroke="none"/><circle cx="14.500" cy="11" r=".8" fill="currentColor" stroke="none"/>';
    } else {
      paths = '<path d="M5 21c0-9 5-15 15-16 0 10-6 15-15 16Z"/><path d="M5 21c2-5 5-8 9-10"/>';
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  }

  fillColorOf = (k: Kawasan): string => WILAYAH_COLOR_HEX[wilayahOf(k)];
  popupOf = (k: Kawasan): string => `<b>${k.nama}</b><br/>${k.provinsi}<br/>Wilayah: ${wilayahOf(k)}`;

  goToKawasanProfile(id: string): void {
    this.router.navigate(['/dashboard/profil'], { queryParams: { kawasan: id } });
  }
}
