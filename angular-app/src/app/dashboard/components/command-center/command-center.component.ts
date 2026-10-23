import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  DashboardDataService,
  IkuItem,
  Kawasan,
  PAGU_TOTAL_MILIAR,
  STAGES,
  STAGE_COLOR_HEX,
  Tahap,
  anggaranPerKawasan,
  basemapPct
} from '../../services/dashboard-data.service';
import { EwsAlert, EwsService } from '../../services/ews.service';
import { HplAgg, HplOverviewService } from '../../services/hpl-overview.service';
import { SibarduktransService } from '../../services/sibarduktrans.service';
import { moduleIconSvg } from '../../config/module-icons';

interface MapDot {
  id: string;
  nama: string;
  tahap: Tahap;
  risiko: string;
  x: number;
  y: number;
  color: string;
}

interface TahapStat {
  tahap: Tahap;
  label: string;
  count: number;
  color: string;
}

interface GovTile {
  label: string;
  sub: string;
  value: number;
  trend: number;
  icon: string;
}

interface ProgramCard {
  id: string;
  title: string;
  tagline: string;
  photo: string;
  icon: string;
  route: string;
  points: string[];
  target: { label: string; value: number };
}

interface Rekomendasi {
  text: string;
  /** Number of kawasan the action applies to; null for a national-level item. */
  count: number | null;
}

interface Prioritas {
  kawasan: Kawasan;
  isu: string;
  tindakan: string;
}

interface TickerItem {
  text: string;
  tone: 'high' | 'med' | 'low' | 'info';
}

interface QuickLink {
  route: string;
  label: string;
  icon: string;
}

const TAHAP_LABEL: { [key in Tahap]: string } = {
  Mandiri: 'Mandiri',
  Berkembang: 'Berkembang',
  Tumbuh: 'Tumbuh',
  Rintisan: 'Rintisan'
};

const RISIKO_LABEL: { [key: string]: string } = { high: 'Risiko tinggi', med: 'Risiko sedang', low: 'Risiko rendah' };

/** 24x24 line icons for the program and governance cards, same stroke convention as module-icons.ts. */
const ICON = {
  scale: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 0 0 6 0Z"/><path d="M19 7l-3 6a3 3 0 0 0 6 0Z"/>',
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V5h4v16Z"/><path d="M7 17h2M13 17h2"/>',
  handshake: '<path d="M2 12l4-4 4 2 4-3 4 1 4 4"/><path d="M6 8v6l5 4 3-2 4-3"/><path d="M11 18l-2-2"/>',
  building: '<path d="M3 21h18"/><path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.2 7.6 8 9 4.8-1.4 8-4.5 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  archive: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9"/><path d="M10 13h4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>'
};

function lineIcon(paths: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

/**
 * "Command Center" — a single-screen executive overview for the large-format display (LED wall /
 * 4K), laid out after the "Transmigration Digital Transformation Command Centre" reference: map +
 * index + land legality + governance across the top, the five 5T programs in the middle, and EWS /
 * recommendations / intervention priorities below. Every card links to the module that holds its
 * detail.
 *
 * It holds no data of its own: every figure is read from the same services the other modules use
 * (DashboardDataService, EwsService, HplOverviewService, SibarduktransService), so it agrees with
 * them, and like them it is illustrative (see DashboardDataService). The recommendations are rules
 * over that data, not model output.
 */
@Component({
  selector: 'dgt-command-center',
  templateUrl: './command-center.component.html',
  styleUrls: ['./command-center.component.scss']
})
export class CommandCenterComponent implements OnInit, OnDestroy {
  now = new Date();

  totalKawasan = 0;
  totalKpb = 0;
  totalSkp = 0;
  totalProvinsi = 0;
  totalPopulasi = 0;

  mapDots: MapDot[] = [];
  tahapStats: TahapStat[] = [];

  ikuUtama!: IkuItem;
  ikuPrioritas!: IkuItem;

  hplHa = 0;
  shmHa = 0;
  shmPct = 0;
  hplAgg: HplAgg | null = null;

  govTiles: GovTile[] = [];
  paguMiliar = PAGU_TOTAL_MILIAR;
  realisasiMiliar = 0;
  penyerapanPct = 0;

  programs: ProgramCard[] = [];
  alerts: EwsAlert[] = [];
  rekomendasi: Rekomendasi[] = [];
  prioritas: Prioritas[] = [];
  quickLinks: QuickLink[] = [];
  ticker: TickerItem[] = [];
  isFullscreen = false;

  private animoKk = 0;
  private clock?: number;
  private subs: Subscription[] = [];

  constructor(
    private readonly data: DashboardDataService,
    private readonly ews: EwsService,
    private readonly hplOverview: HplOverviewService,
    private readonly sib: SibarduktransService
  ) {}

  ngOnInit(): void {
    const kawasan = this.data.getKawasan();
    const kpi = this.data.getNationalKPI();
    const iku = this.data.getIkuList();
    const ikuNo = (no: number) => iku.find(i => i.no === no) as IkuItem;

    this.totalKawasan = kpi.totalKawasan;
    this.totalKpb = kpi.totalKPB;
    this.totalSkp = kpi.totalSKP;
    this.totalProvinsi = kpi.totalProvinsi;
    this.totalPopulasi = kpi.totalPopulasi;

    this.mapDots = kawasan.map(k => {
      const p = basemapPct(k.lon, k.lat);
      return { id: k.id, nama: k.nama, tahap: k.tahap, risiko: k.risiko, x: p.xPct, y: p.yPct, color: STAGE_COLOR_HEX[k.tahap] };
    });
    this.tahapStats = STAGES.slice()
      .reverse()
      .map(t => ({ tahap: t, label: TAHAP_LABEL[t], count: kawasan.filter(k => k.tahap === t).length, color: STAGE_COLOR_HEX[t] }));

    this.ikuUtama = ikuNo(1);
    this.ikuPrioritas = ikuNo(6);

    this.hplHa = kpi.hplTotal;
    this.shmHa = kpi.shmTotal;
    this.shmPct = Math.round((kpi.shmTotal / kpi.hplTotal) * 100);

    this.govTiles = [
      { label: 'Reformasi Birokrasi', sub: 'IKU 14', value: ikuNo(14).nilai, trend: ikuNo(14).trend, icon: lineIcon(ICON.building) },
      { label: 'SAKIP', sub: 'IKU 17', value: ikuNo(17).nilai, trend: ikuNo(17).trend, icon: lineIcon(ICON.check) },
      { label: 'Pengendalian Intern', sub: 'IKU 16', value: ikuNo(16).nilai, trend: ikuNo(16).trend, icon: lineIcon(ICON.shield) },
      { label: 'Pengawasan Kearsipan', sub: 'IKU 15', value: ikuNo(15).nilai, trend: ikuNo(15).trend, icon: lineIcon(ICON.archive) }
    ];

    const anggaran = anggaranPerKawasan(kawasan);
    this.realisasiMiliar = anggaran.reduce((s, a) => s + a.realisasi, 0);
    this.penyerapanPct = Math.round((this.realisasiMiliar / PAGU_TOTAL_MILIAR) * 100);

    this.buildPrioritas(kawasan);
    this.buildRekomendasi(kawasan);
    this.buildQuickLinks();

    this.subs.push(
      this.ews.alerts$.subscribe(list => {
        this.alerts = list.filter(a => !a.ack);
        this.buildTicker();
      }),
      this.hplOverview.rows().subscribe(rows => (this.hplAgg = this.hplOverview.agg(rows))),
      // The program cards wait on this one async figure (animo KK), so they're built here.
      this.sib.getJumlahAnimo('KK').subscribe(n => {
        this.animoKk = n;
        this.buildPrograms(kawasan, ikuNo);
      })
    );

    this.clock = window.setInterval(() => (this.now = new Date()), 1000);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    if (this.clock) {
      window.clearInterval(this.clock);
    }
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  /** For the wall display: hides the browser chrome. Esc also exits (handled by the browser). */
  toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }

  get tanggal(): string {
    return this.now.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric' });
  }

  get jam(): string {
    return this.now.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  fmt(n: number): string {
    return Math.round(n).toLocaleString('id-ID');
  }

  ribu(n: number): string {
    return (n / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 });
  }

  /** Stroke-dasharray for a full-circle progress ring of radius 16 (circumference ≈ 100.53). */
  ring(pct: number): string {
    const c = 2 * Math.PI * 16;
    const v = (Math.max(0, Math.min(100, pct)) / 100) * c;
    return `${v.toFixed(2)} ${c.toFixed(2)}`;
  }

  sevLabel(a: EwsAlert): string {
    return a.sev === 'high' ? 'Tinggi' : a.sev === 'med' ? 'Sedang' : 'Rendah';
  }

  trackById(_: number, item: { id: string }): string {
    return item.id;
  }

  /** Same ranking as Analitik's priority table (lowest Indeks 5T first). */
  private buildPrioritas(kawasan: Kawasan[]): void {
    this.prioritas = kawasan
      .slice()
      .sort((a, b) => a.indeks5t - b.indeks5t)
      .slice(0, 3)
      .map(k => ({
        kawasan: k,
        isu: `${TAHAP_LABEL[k.tahap]} · ${RISIKO_LABEL[k.risiko]}`,
        tindakan:
          k.statusHpl === 'Ada SK HPL' || k.statusHpl === 'Terinventarisasi Ulang'
            ? 'Percepatan legalisasi lahan'
            : k.anggaranPct < 25
            ? 'Percepatan serapan anggaran'
            : 'Penguatan prasarana & ekonomi'
      }));
  }

  private buildRekomendasi(kawasan: Kawasan[]): void {
    const legal = kawasan.filter(k => k.statusHpl === 'Ada SK HPL' || k.statusHpl === 'Terinventarisasi Ulang').length;
    const serapan = kawasan.filter(k => k.anggaranPct < 25).length;
    const risiko = kawasan.filter(k => k.risiko === 'high').length;
    const naik = kawasan.filter(k => k.tahap === 'Berkembang' && k.indeks5t >= 70).length;
    const komoditas = this.data.getKomoditas().slice().sort((a, b) => b.nilai - a.nilai)[0];
    this.rekomendasi = [
      { text: 'kawasan perlu percepatan legalisasi lahan', count: legal },
      { text: 'kawasan dengan serapan anggaran di bawah 25%', count: serapan },
      { text: 'kawasan berisiko tinggi perlu mitigasi sosial & lahan', count: risiko },
      { text: 'kawasan Berkembang siap didorong menuju Mandiri', count: naik },
      { text: `Prioritaskan hilirisasi ${komoditas.nama}, komoditas dengan indeks tertinggi`, count: null }
    ];
  }

  private buildPrograms(kawasan: Kawasan[], ikuNo: (no: number) => IkuItem): void {
    const desa = kawasan.reduce((s, k) => s + k.desa, 0);
    const kecamatan = kawasan.reduce((s, k) => s + k.kecamatan, 0);
    const shmKawasan = kawasan.filter(k => k.statusHpl === 'Tersertifikat SHM').length;
    const asal = this.data.getAsalDaerah().slice().sort((a, b) => b.jml - a.jml)[0];
    const komoditas = this.data.getKomoditas().slice().sort((a, b) => b.nilai - a.nilai).slice(0, 3);
    const kl = this.data.getKlCollab();
    const klKawasan = kl.reduce((s, c) => s + c.kawasanCount, 0);
    const infra = this.data.getInfraKategori();
    const infraAvg = Math.round(infra.reduce((s, c) => s + c.capaian, 0) / infra.length);

    this.programs = [
      {
        id: 'tuntas',
        title: 'Trans Tuntas',
        tagline: 'Kepastian hukum atas tanah',
        photo: 'assets/galeri/foto-2.jpg',
        icon: lineIcon(ICON.scale),
        route: '/dashboard/hpl',
        points: [
          `${this.ribu(this.hplHa)} ribu Ha lahan HPL`,
          `${this.ribu(this.shmHa)} ribu Ha bersertifikat SHM`,
          `${shmKawasan} kawasan tersertifikat SHM`
        ],
        target: { label: ikuNo(2).indikator, value: ikuNo(2).nilai }
      },
      {
        id: 'lokal',
        title: 'Trans Lokal',
        tagline: 'Penguatan kawasan & masyarakat lokal',
        photo: 'assets/hero-kawasan.jpg',
        icon: lineIcon(ICON.home),
        route: '/dashboard/profil',
        points: [
          `${this.fmt(this.totalPopulasi)} jiwa di ${this.totalKawasan} kawasan`,
          `${this.fmt(desa)} desa · ${this.fmt(kecamatan)} kecamatan`,
          `${this.totalProvinsi} provinsi penempatan`
        ],
        target: { label: ikuNo(9).indikator, value: ikuNo(9).nilai }
      },
      {
        id: 'patriot',
        title: 'Trans Patriot',
        tagline: 'SDM unggul & berdaya saing',
        photo: 'assets/hero-transmigran.png',
        icon: lineIcon(ICON.cap),
        route: '/dashboard/sibarduktrans',
        points: [
          `${this.fmt(this.animoKk)} KK animo transmigrasi`,
          `Asal terbanyak: ${asal.asal}`,
          `${this.fmt(asal.jml)} transmigran dari ${asal.asal}`
        ],
        target: { label: ikuNo(4).indikator, value: ikuNo(4).nilai }
      },
      {
        id: 'karya-nusa',
        title: 'Trans Karya Nusa',
        tagline: 'Ekonomi produktif & hilirisasi',
        photo: 'assets/galeri/foto-3.jpg',
        icon: lineIcon(ICON.factory),
        route: '/dashboard/ekonomi',
        points: komoditas.map(c => `${c.nama} — indeks ${c.nilai}`),
        target: { label: ikuNo(5).indikator, value: ikuNo(5).nilai }
      },
      {
        id: 'gotong-royong',
        title: 'Trans Gotong Royong',
        tagline: 'Kolaborasi & sinergi multipihak',
        photo: 'assets/galeri/foto-1.jpg',
        icon: lineIcon(ICON.handshake),
        route: '/dashboard/monitoring',
        points: [
          `${kl.length} K/L mitra program`,
          `${klKawasan} keterlibatan di kawasan`,
          `${kl.filter(c => c.status === 'Selesai').length} program selesai · ${kl.filter(c => c.status === 'Berjalan').length} berjalan`
        ],
        target: { label: 'Rata-rata capaian infrastruktur dasar kawasan', value: infraAvg }
      }
    ];
  }

  private buildTicker(): void {
    const items: TickerItem[] = this.alerts.map(a => ({ text: `${a.title}: ${a.detail}`, tone: a.sev }));
    if (!items.length) {
      items.push({ text: 'Tidak ada peringatan dini aktif', tone: 'low' });
    }
    items.push(
      { text: `Penyerapan anggaran ${this.penyerapanPct}% dari pagu Rp ${this.fmt(this.paguMiliar)} M`, tone: 'info' },
      { text: `${this.shmPct}% lahan HPL sudah bersertifikat SHM`, tone: 'info' },
      { text: `Indeks Transformasi 45 kawasan: ${this.ikuUtama.nilai} (${this.ikuUtama.trend >= 0 ? '+' : ''}${this.ikuUtama.trend})`, tone: 'info' }
    );
    this.ticker = items;
  }

  private buildQuickLinks(): void {
    this.quickLinks = [
      { route: '/dashboard/geospasial', label: 'Geospasial', icon: moduleIconSvg('geospasial') },
      { route: '/dashboard/profil', label: 'Data Induk', icon: moduleIconSvg('profil') },
      { route: '/dashboard/hpl', label: 'HPL', icon: moduleIconSvg('hpl') },
      { route: '/dashboard/sibarduktrans', label: 'Transmigran', icon: moduleIconSvg('sibarduktrans') },
      { route: '/dashboard/monitoring', label: 'Anggaran', icon: moduleIconSvg('monitoring') },
      { route: '/dashboard/ekonomi', label: 'Ekonomi', icon: moduleIconSvg('ekonomi') },
      { route: '/dashboard/analitik', label: 'Analitik & EWS', icon: moduleIconSvg('analitik') },
      { route: '/dashboard/intelijen', label: 'Laporan', icon: moduleIconSvg('laporan') }
    ];
  }
}
