import { Component, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { Kawasan, PROFIL_DIPERBARUI, profilSumber, ProfilDetail, ProfilProduk, profilDetailData } from '../../services/dashboard-data.service';
import { FISIK_BY_KAWASAN, FisikBlok } from '../profil/profil-fisik.data';

interface Kpi {
  tone: 'green' | 'cyan' | 'blue' | 'amber';
  value: string;
  label: string;
  icon: 'chart' | 'tag' | 'building' | 'wheat';
}

interface UsahaBar {
  label: string;
  value: number;
  display: string;
  color: string;
  deltaText: string;
  above: boolean;
}

interface IndeksBar {
  label: string;
  /** Bar fill, 0-100. */
  pct: number;
  display: string;
}

const TABS_AWAL = ['Ringkasan', 'Indeks Kinerja'];
const TABS_AKHIR = ['Demografi', 'Perencanaan', 'Fisik & ekologi', 'Tanya AI'];

const SEKTOR_COLOR: { [label: string]: string } = {
  Pertanian: '#106d30',
  Perkebunan: '#0b98b8',
  Pangan: '#0868ad',
  Perikanan: '#cfa460',
  Kehutanan: '#e8981c'
};

/**
 * The "KAWASAN DETAIL" modal (reference screenshot): hero banner with the kawasan name, four tinted
 * KPI cards, a tab strip, and a white chart panel over a blurred, dimmed page. Opened from a
 * kawasan's name in the layer tree or the popup's "Lihat profil kawasan" link; closes on ✕,
 * backdrop click or Escape.
 *
 * Every figure comes from `profilDetailData()` (and the shared Fisik & Ekologi data), the same
 * source the Profil page uses, and labels follow the Profil page — so the two views cannot drift
 * apart. The only per-kawasan fields read straight from `Kawasan` are the ones Profil also reads.
 */
@Component({
  selector: 'dgt-kawasan-detail-modal',
  templateUrl: './kawasan-detail-modal.component.html',
  styleUrls: ['./kawasan-detail-modal.component.scss']
})
export class KawasanDetailModalComponent implements OnChanges {
  @Input() kawasan!: Kawasan;
  @Output() closed = new EventEmitter<void>();

  tabs: string[] = [];
  activeTab = 'Ringkasan';

  kpis: Kpi[] = [];
  usahaBars: UsahaBar[] = [];
  indeksBars: IndeksBar[] = [];
  fisik: FisikBlok[] = [];
  detail!: ProfilDetail;
  komoditas: ProfilProduk | null = null;

  readonly diperbarui = PROFIL_DIPERBARUI;

  get sumber(): string {
    return profilSumber(this.kawasan.nama);
  }

  ngOnChanges(): void {
    if (!this.kawasan) {
      return;
    }
    const k = this.kawasan;
    const d = profilDetailData(k);
    this.detail = d;
    this.activeTab = 'Ringkasan';
    this.komoditas = null;
    this.tabs = [...TABS_AWAL, ...d.produkUnggulan.map(p => p.komoditas), ...TABS_AKHIR];
    this.fisik = FISIK_BY_KAWASAN[k.nama] || [];

    const e = d.ekonomiSektor;
    this.kpis = [
      { tone: 'green', value: this.dec(e.kontribusiPdrbPct, 2) + '%', label: `Kontribusi sektor PDRB ke ${k.kabupaten}`, icon: 'chart' },
      { tone: 'cyan', value: 'Rp ' + this.dec(e.nilaiSektorT, 2) + ' T', label: 'Nilai Sektor Pertanian, Kehutanan & Perikanan', icon: 'tag' },
      { tone: 'blue', value: this.fmt(e.unitUsaha), label: 'Unit Usaha Perorangan (SP 2023)', icon: 'building' },
      { tone: 'amber', value: String(d.produkUnggulan.length), label: 'Produk Unggulan Kawasan', icon: 'wheat' }
    ];

    this.usahaBars = e.sektor.map(s => {
      const diff = s.tHa - s.nasional;
      return {
        label: s.label,
        value: s.tHa,
        display: this.dec(s.tHa, 1) + ' t/Ha',
        color: SEKTOR_COLOR[s.label] || '#33809c',
        above: diff > 0,
        deltaText: diff > 0 ? `+${this.dec(diff, 1)} t/Ha dari rata-rata nasional` : 'Di bawah rata-rata nasional'
      };
    });

    this.indeksBars = [
      { label: 'Nilai Intrans', pct: parseFloat(d.nilaiIntrans), display: d.nilaiIntrans + ' / 100' },
      { label: 'Indeks kesiapan infrastruktur', pct: (parseFloat(d.indeksInfra) / 5) * 100, display: d.indeksInfra + ' / 5' },
      { label: 'Indeks kelembagaan', pct: (parseFloat(d.indeksKelembagaan) / 5) * 100, display: d.indeksKelembagaan + ' / 5' },
      { label: 'Indeks dukungan investasi', pct: (parseFloat(d.indeksDukungan) / 5) * 100, display: d.indeksDukungan + ' / 5' },
      { label: 'Realisasi anggaran', pct: k.anggaranPct, display: k.anggaranPct + '%' },
      { label: 'Legalitas lahan (SHM/HPL)', pct: Math.round((k.shmHa / k.hplHa) * 100), display: Math.round((k.shmHa / k.hplHa) * 100) + '%' }
    ];
  }

  get maxUsaha(): number {
    return Math.max(...this.usahaBars.map(b => b.value));
  }

  get isKomoditasTab(): boolean {
    return this.detail.produkUnggulan.some(p => p.komoditas === this.activeTab);
  }

  selectTab(t: string): void {
    this.activeTab = t;
    this.komoditas = this.detail.produkUnggulan.find(p => p.komoditas === t) || null;
  }

  fmt(n: number): string {
    return n.toLocaleString('id-ID');
  }

  dec(n: number, frac: number): string {
    return n.toLocaleString('id-ID', { minimumFractionDigits: frac, maximumFractionDigits: frac });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }

  onBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this.closed.emit();
    }
  }
}
