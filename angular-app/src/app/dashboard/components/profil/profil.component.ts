import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  basemapPct,
  DashboardDataService,
  Kawasan,
  NationalKPI,
  ProfilDetail,
  profilBucketIndeks,
  profilDetailData,
  Province,
  STAGE_BADGE_CLASS,
  STAGE_COLOR_HEX,
  STAGES,
  STATUS_HPL,
  Tahap
} from '../../services/dashboard-data.service';
import { DonutSegment } from '../../../shared/components/charts/chart.model';

interface Dokumen {
  judul: string;
  jenis: string;
  tahun: number;
  output: string;
  lokus: string;
  judulKajian: string;
  cover: string;
}

/** Documents attached to a kawasan, keyed by kawasan name. Only Salor has one so far. */
const DOKUMEN_BY_KAWASAN: { [nama: string]: Dokumen[] } = {
  Salor: [{
    judul: 'Rekomendasi Kebijakan Ekspedisi Patriot 2025',
    jenis: 'Laporan Akhir',
    tahun: 2025,
    output: 'Desain Model Kolaborasi Kelembagaan Ekonomi Kawasan Transmigrasi',
    lokus: 'Salor, Merauke, Papua Selatan',
    judulKajian: 'Desain Model Kolaborasi Kelembagaan Ekonomi Kawasan Transmigrasi Salor Merauke Papua Selatan',
    cover: 'assets/dokumen/laporan-ekspedisi-patriot-2025-salor.png'
  }]
};

type DetailTab = 'ekonomi' | 'sosial' | 'perencanaan' | 'media';

/** Literal hex (not CSS vars) so each legend row can derive its own tint by appending an alpha
 *  byte — see `LegendRow.bg`. Palette from the "Design system colors updated" bundle. */
const BUCKET_COLOR: { [key: string]: string } = {
  Mandiri: '#106d30',
  Berkembang: '#0b98b8',
  Tertinggal: '#e8981c'
};
/** Darker text twin of each legend colour (the bright fills are too light for text). */
const LEGEND_FG: { [key: string]: string } = {
  Mandiri: '#106d30',
  Berkembang: '#0b7f99',
  Tertinggal: '#a8620a',
  Rintisan: '#ce1126',
  Tumbuh: '#a8620a'
};
const BUCKET_ORDER = ['Mandiri', 'Berkembang', 'Tertinggal'];

export interface LegendRow {
  label: string;
  count: number;
  pct: number;
  color: string;
  fg: string;
  bg: string;
}

/** Ports `renderProfil()` (legacy-static/dashboard/index.html) — "Data Induk & Profil Kawasan":
 *  a searchable/filterable landing list plus a per-kawasan drill-down with Ekonomi/Sosial/
 *  Perencanaan/Media tabs. See profilDetailData() in dashboard-data.service.ts for how the
 *  detail page's numbers are derived. */
@Component({
  selector: 'dgt-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  kawasan: Kawasan[] = [];
  provinces: Province[] = [];
  nationalKPI!: NationalKPI;
  readonly stages = STAGES;
  readonly statusHplOptions = STATUS_HPL;
  readonly stageBadgeClass = STAGE_BADGE_CLASS;

  // landing view state
  view: 'list' | 'detail' = 'list';
  areaFilter = 'Semua';
  statusFilter = 'Semua';
  statusHplFilter = 'Semua';
  search = '';
  intransSegments: DonutSegment[] = [];
  intransCounts: { [key: string]: number } = {};
  readonly bucketOrder = BUCKET_ORDER;
  intransLegend: LegendRow[] = [];

  /** "Peringkat kinerja kawasan" card: top or bottom 5 by Indeks 5T, within the area filter. */
  rankMode: 'top' | 'bottom' = 'top';

  // detail view state
  selectedId: string | null = null;
  detailTab: DetailTab = 'ekonomi';
  detail?: ProfilDetail;
  produkFilter = '';

  constructor(private readonly data: DashboardDataService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.kawasan = this.data.getKawasan();
    this.provinces = this.data.getProvinces();
    this.nationalKPI = this.data.getNationalKPI();
    this.rebuildDonuts();

    /* Ekonomi & Investasi Kawasan's map pins and "Lihat Detail" cards deep-link here via
       ?kawasan=<id> instead of duplicating a second kawasan-profile page — see EkonomiComponent's
       goToKawasanProfile(). */
    const kawasanId = this.route.snapshot.queryParamMap.get('kawasan');
    if (kawasanId && this.kawasan.some(k => k.id === kawasanId)) {
      this.openDetail(kawasanId);
    }
  }

  get filteredRows(): Kawasan[] {
    const q = this.search.trim().toLowerCase();
    return this.kawasan.filter(k => {
      if (this.areaFilter !== 'Semua' && k.provinsi !== this.areaFilter) {
        return false;
      }
      if (this.statusFilter !== 'Semua' && k.tahap !== this.statusFilter) {
        return false;
      }
      if (this.statusHplFilter !== 'Semua' && k.statusHpl !== this.statusHplFilter) {
        return false;
      }
      if (q) {
        const d = this.detailFor(k);
        const hay = (k.nama + ' ' + k.provinsi + ' ' + d.produkUnggulan.map(p => p.komoditas).join(' ')).toLowerCase();
        if (hay.indexOf(q) === -1) {
          return false;
        }
      }
      return true;
    });
  }

  detailFor(k: Kawasan): ProfilDetail {
    return profilDetailData(k);
  }

  rowSubLabel(k: Kawasan): string {
    return this.detailFor(k).produkUnggulan[2].komoditas;
  }

  onAreaChange(): void {
    this.rebuildDonuts();
  }

  private rebuildDonuts(): void {
    const pool = this.kawasan.filter(k => this.areaFilter === 'Semua' || k.provinsi === this.areaFilter);
    this.intransCounts = this.bucketCounts(pool, k => profilBucketIndeks(k.indeks5t));
    this.intransSegments = this.toSegments(this.intransCounts);
    this.intransLegend = this.legendRows(this.intransCounts, BUCKET_ORDER, BUCKET_COLOR);
  }

  private legendRows(counts: { [key: string]: number }, order: string[], colors: { [key: string]: string }): LegendRow[] {
    const total = order.reduce((s, k) => s + counts[k], 0) || 1;
    return order.map(label => ({
      label,
      count: counts[label],
      pct: Math.round((counts[label] / total) * 100),
      color: colors[label],
      fg: LEGEND_FG[label] || colors[label],
      bg: colors[label] + '1f'
    }));
  }

  get rankRows(): Kawasan[] {
    const pool = this.kawasan.filter(k => this.areaFilter === 'Semua' || k.provinsi === this.areaFilter);
    const sorted = pool.slice().sort((a, b) => (this.rankMode === 'top' ? b.indeks5t - a.indeks5t : a.indeks5t - b.indeks5t));
    return sorted.slice(0, 5);
  }

  setRankMode(m: 'top' | 'bottom'): void {
    this.rankMode = m;
  }

  private bucketCounts(pool: Kawasan[], bucketFn: (k: Kawasan) => string): { [key: string]: number } {
    const counts: { [key: string]: number } = { Mandiri: 0, Berkembang: 0, Tertinggal: 0 };
    pool.forEach(k => counts[bucketFn(k)]++);
    return counts;
  }

  private toSegments(counts: { [key: string]: number }): DonutSegment[] {
    return BUCKET_ORDER.map(s => ({ label: s, value: counts[s], color: BUCKET_COLOR[s] }));
  }

  get donutTotal(): number {
    return this.kawasan.filter(k => this.areaFilter === 'Semua' || k.provinsi === this.areaFilter).length;
  }

  bucketColor(bucket: string): string {
    return BUCKET_COLOR[bucket];
  }

  openDetail(id: string): void {
    this.selectedId = id;
    this.detailTab = 'ekonomi';
    this.detail = profilDetailData(this.kawasan.find(k => k.id === id) as Kawasan);
    this.view = 'detail';
  }

  backToList(): void {
    this.view = 'list';
  }

  setDetailTab(tab: DetailTab): void {
    this.detailTab = tab;
  }

  /** Placeholder photos shown for every kawasan until real per-kawasan photos are uploaded. */
  readonly fotoPlaceholder = ['assets/galeri/foto-1.jpg', 'assets/galeri/foto-2.jpg', 'assets/galeri/foto-3.jpg'];

  dokumenFor(k: Kawasan): Dokumen[] {
    return DOKUMEN_BY_KAWASAN[k.nama] || [];
  }

  lightbox: { src: string; alt: string } | null = null;

  openLightbox(src: string, alt: string): void {
    this.lightbox = { src, alt };
  }

  closeLightbox(): void {
    this.lightbox = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.lightbox = null;
  }

  get selected(): Kawasan | undefined {
    return this.kawasan.find(k => k.id === this.selectedId);
  }

  get produkRows() {
    if (!this.detail) {
      return [];
    }
    const q = this.produkFilter.trim().toLowerCase();
    return this.detail.produkUnggulan.filter(p => !q || (p.kategori + ' ' + p.komoditas).toLowerCase().indexOf(q) > -1);
  }

  get usiaSegments(): DonutSegment[] {
    if (!this.detail) {
      return [];
    }
    const su = this.detail.strukturUsia;
    return [
      { label: 'Usia produktif (15-65)', value: su.produktif, color: 'var(--primary)' },
      { label: 'Usia < 15 tahun', value: su.muda, color: 'var(--series-2)' },
      { label: 'Usia > 65 tahun', value: su.tua, color: 'var(--warn)' }
    ];
  }

  get desaSegments(): DonutSegment[] {
    if (!this.detail) {
      return [];
    }
    const sd = this.detail.statusDesa;
    return [
      { label: 'Desa maju', value: sd.maju, color: 'var(--good)' },
      { label: 'Berkembang', value: sd.berkembang, color: 'var(--series-2)' },
      { label: 'Tertinggal', value: sd.tertinggal, color: 'var(--warn)' }
    ];
  }

  get totalDesaIdm(): number {
    if (!this.detail) {
      return 0;
    }
    const sd = this.detail.statusDesa;
    return sd.maju + sd.berkembang + sd.tertinggal;
  }

  get shmSegments(): DonutSegment[] {
    if (!this.detail) {
      return [];
    }
    const s = this.detail.sertifikasi;
    return [
      { label: 'Sertifikat terbit (SHM)', value: s.terbit, color: 'var(--good)' },
      { label: 'Menunggu penerbitan', value: s.menunggu, color: 'var(--warn)' }
    ];
  }

  pctOf(value: number, total: number): number {
    return total ? Math.round((value / total) * 100) : 0;
  }

  locatorPos(k: Kawasan): { xPct: number; yPct: number } {
    return basemapPct(k.lon, k.lat);
  }

  stageColor(tahap: Tahap): string {
    return STAGE_COLOR_HEX[tahap];
  }
}
