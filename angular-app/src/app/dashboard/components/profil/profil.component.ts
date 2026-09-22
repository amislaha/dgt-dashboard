import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  basemapPct,
  DashboardDataService,
  Kawasan,
  NationalKPI,
  ProfilDetail,
  profilBucketIndeks,
  profilBucketTahap,
  profilDetailData,
  Province,
  STAGE_BADGE_CLASS,
  STAGE_COLOR_HEX,
  STAGES,
  Tahap
} from '../../services/dashboard-data.service';
import { DonutSegment } from '../../../shared/components/charts/chart.model';

type DetailTab = 'ekonomi' | 'sosial' | 'perencanaan' | 'patriot' | 'media';

const BUCKET_COLOR: { [key: string]: string } = {
  Mandiri: 'var(--good)',
  Berkembang: 'var(--series-2)',
  Tertinggal: 'var(--critical)'
};
const BUCKET_ORDER = ['Mandiri', 'Tertinggal', 'Berkembang'];

/** Ports `renderProfil()` (legacy-static/dashboard/index.html) — "Data Induk & Profil Kawasan":
 *  a searchable/filterable landing list plus a per-kawasan drill-down with Ekonomi/Sosial/
 *  Perencanaan/Patriot/Media tabs. See profilDetailData() in dashboard-data.service.ts for how the
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
  readonly stageBadgeClass = STAGE_BADGE_CLASS;

  // landing view state
  view: 'list' | 'detail' = 'list';
  areaFilter = 'Semua';
  statusFilter = 'Semua';
  search = '';
  intransSegments: DonutSegment[] = [];
  kinerjaSegments: DonutSegment[] = [];
  intransCounts: { [key: string]: number } = {};
  kinerjaCounts: { [key: string]: number } = {};
  readonly bucketOrder = BUCKET_ORDER;

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
    this.kinerjaCounts = this.bucketCounts(pool, k => profilBucketTahap(k.tahap));
    this.intransSegments = this.toSegments(this.intransCounts);
    this.kinerjaSegments = this.toSegments(this.kinerjaCounts);
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
