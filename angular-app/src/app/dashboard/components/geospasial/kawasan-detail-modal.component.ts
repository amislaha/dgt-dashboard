import { Component, EventEmitter, HostListener, Input, OnChanges, Output } from '@angular/core';
import { Kawasan, ProfilDetail, profilDetailData, seededRandom } from '../../services/dashboard-data.service';

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

interface KomoditasTab {
  nama: string;
  luasHa: number;
  produksiTon: number;
  produktivitas: string;
  pelaku: number;
}

const TABS = [
  'Ringkasan',
  'Indeks Kinerja',
  'Kelapa Sawit',
  'Kopi',
  'Rambutan',
  'Sapi Potong',
  'Padi & jagung',
  'Demografi',
  'Fisik & ekologi',
  'Tanya AI'
];
const KOMODITAS_TABS = ['Kelapa Sawit', 'Kopi', 'Rambutan', 'Sapi Potong', 'Padi & jagung'];

/**
 * The "KAWASAN DETAIL" modal (reference screenshot): hero banner with the kawasan name, four tinted
 * KPI cards, a tab strip, and a white chart panel over a blurred, dimmed page. Replaces the old
 * "Detail Kawasan" tab of the Geospasial right panel. Opened from a kawasan's name in the layer
 * tree or the popup's "Lihat profil kawasan" link; closes on ✕, backdrop click or Escape.
 *
 * Everything shown is derived deterministically from the kawasan's own fields plus
 * `profilDetailData()`/`seededRandom()` — illustrative like the rest of the dataset, not real
 * PDRB/SP2023/TEP figures.
 */
@Component({
  selector: 'dgt-kawasan-detail-modal',
  templateUrl: './kawasan-detail-modal.component.html',
  styleUrls: ['./kawasan-detail-modal.component.scss']
})
export class KawasanDetailModalComponent implements OnChanges {
  @Input() kawasan!: Kawasan;
  @Output() closed = new EventEmitter<void>();

  readonly tabs = TABS;
  activeTab = 'Ringkasan';

  kpis: Kpi[] = [];
  usahaBars: UsahaBar[] = [];
  detail!: ProfilDetail;
  komoditas: KomoditasTab | null = null;

  ngOnChanges(): void {
    if (!this.kawasan) {
      return;
    }
    const k = this.kawasan;
    const rnd = seededRandom('modal-' + k.id + '-' + k.nama);
    this.detail = profilDetailData(k);
    this.activeTab = 'Ringkasan';

    this.kpis = [
      { tone: 'green', value: this.dec(14 + rnd() * 16, 2) + '%', label: `Kontribusi sektor PDRB ke ${k.kabupaten}`, icon: 'chart' },
      { tone: 'cyan', value: 'Rp ' + this.dec(1.5 + rnd() * 6, 2) + ' T', label: 'Nilai Sektor Pertanian, Kehutanan & Perikanan', icon: 'tag' },
      { tone: 'blue', value: Math.round(k.populasi / 5.2).toLocaleString('id-ID'), label: 'Unit Usaha Perorangan (SP 2023)', icon: 'building' },
      { tone: 'amber', value: String(5 + Math.floor(rnd() * 6)), label: 'Komoditas Unggulan Utama', icon: 'wheat' }
    ];

    // [label, base t/Ha, national average t/Ha, bar colour]
    const defs: Array<[string, number, number, string]> = [
      ['Pertanian', 5.2, 4.2, '#106d30'],
      ['Perkebunan', 3.6, 3.1, '#0b98b8'],
      ['Pangan', 3.0, 2.9, '#0868ad'],
      ['Perikanan', 2.0, 2.4, '#cfa460'],
      ['Kehutanan', 1.0, 1.6, '#e8981c']
    ];
    this.usahaBars = defs.map(([label, base, nasional, color]) => {
      const value = Math.max(0.4, base + (rnd() * 0.6 - 0.3));
      const diff = value - nasional;
      return {
        label,
        value,
        display: this.dec(value, 1) + ' t/Ha',
        color,
        above: diff > 0,
        deltaText: diff > 0 ? `+${this.dec(diff, 1)} t/Ha dari rata-rata nasional` : 'Di bawah rata-rata nasional'
      };
    });
  }

  get maxUsaha(): number {
    return Math.max(...this.usahaBars.map(b => b.value));
  }

  get isKomoditasTab(): boolean {
    return KOMODITAS_TABS.indexOf(this.activeTab) !== -1;
  }

  selectTab(t: string): void {
    this.activeTab = t;
    if (this.isKomoditasTab) {
      const k = this.kawasan;
      const rnd = seededRandom('kom-' + k.id + '-' + t);
      const luasHa = Math.max(40, Math.round(k.hplHa * (0.06 + rnd() * 0.16)));
      const prod = 2 + rnd() * 9;
      this.komoditas = {
        nama: t,
        luasHa,
        produksiTon: Math.round(luasHa * prod),
        produktivitas: this.dec(prod, 1),
        pelaku: Math.max(12, Math.round(k.populasi / (6 + rnd() * 8)))
      };
    }
  }

  /** The 5T score bars of the "Indeks Kinerja" tab (0–100). */
  get indeksBars(): Array<{ label: string; value: number }> {
    const d = this.detail;
    return [
      { label: 'Indeks 5T', value: this.kawasan.indeks5t },
      { label: 'Infrastruktur', value: Math.round((parseFloat(d.indeksInfra) / 5) * 100) },
      { label: 'Kelembagaan', value: Math.round((parseFloat(d.indeksKelembagaan) / 5) * 100) },
      { label: 'Dukungan', value: Math.round((parseFloat(d.indeksDukungan) / 5) * 100) },
      { label: 'Realisasi anggaran', value: this.kawasan.anggaranPct },
      { label: 'Legalitas lahan (SHM/HPL)', value: Math.round((this.kawasan.shmHa / this.kawasan.hplHa) * 100) }
    ];
  }

  get sumber(): string {
    return `Laporan TEP ${this.kawasan.nama} 2025`;
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
