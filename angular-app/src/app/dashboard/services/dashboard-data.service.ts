import { Injectable } from '@angular/core';

/**
 * All data below is fabricated/illustrative — ported verbatim in shape and
 * spirit from dashboard/index.html's mock dataset (`kawasan`, `provinces`,
 * `sCurve`, `komoditas`, `infraKategori`, `klCollab`, `asalDaerah`,
 * `nationalKPI`, `ikuList`). None of it is real ministry data. See
 * CLAUDE.md "Data layer" and PORT_NOTES.md for what was ported vs. trimmed.
 */

export type Tahap = 'Rintisan' | 'Tumbuh' | 'Berkembang' | 'Mandiri';
export type Risiko = 'low' | 'med' | 'high';

export interface Kawasan {
  id: string;
  nama: string;
  provinsi: string;
  tipe: 'SKP' | 'KPB';
  tahap: Tahap;
  populasi: number;
  indeks5t: number;
  hplHa: number;
  shmHa: number;
  anggaranPct: number;
  risiko: Risiko;
  lat: number;
  lon: number;
  /** Relative path into assets/kawasan/<slug>/ on the original site; not carried over here — see PORT_NOTES.md. */
  foto?: string;
}

export interface Province {
  nama: string;
  count: number;
  hpl: number;
  shm: number;
}

export interface SCurve {
  labels: string[];
  rencana: number[];
  realisasi: (number | null)[];
}

export interface Komoditas {
  nama: string;
  nilai: number;
}

export interface InfraKategori {
  nama: string;
  capaian: number;
}

export interface KlCollab {
  kl: string;
  program: string;
  kawasanCount: number;
  status: string;
}

export interface AsalDaerah {
  asal: string;
  jml: number;
}

export interface IkuItem {
  no: number;
  satuan: string;
  nilai: number;
  trend: number;
  indikator: string;
  pic: string;
}

export interface NationalKPI {
  totalKawasan: number;
  totalSKP: number;
  totalKPB: number;
  totalPopulasi: number;
  avgIndeks: number;
  hplTotal: number;
  shmTotal: number;
}

/** Same STAGES / stage colour maps as the original (`STAGES`, `STAGE_COLOR_HEX`). */
export const STAGES: Tahap[] = ['Rintisan', 'Tumbuh', 'Berkembang', 'Mandiri'];

export const STAGE_COLOR_HEX: { [key in Tahap]: string } = {
  Rintisan: '#ce1126',
  Tumbuh: '#c09546',
  Berkembang: '#33809c',
  Mandiri: '#2c755b'
};

export const STAGE_BADGE_CLASS: { [key in Tahap]: string } = {
  Rintisan: 'rintisan',
  Tumbuh: 'tumbuh',
  Berkembang: 'berkembang',
  Mandiri: 'mandiri'
};

const KAWASAN: Kawasan[] = [
  { id: 'k1', nama: 'SKP Salor', provinsi: 'Papua Selatan', tipe: 'SKP', tahap: 'Berkembang', populasi: 8420, indeks5t: 74, hplHa: 12500, shmHa: 9800, anggaranPct: 68, risiko: 'med', lat: -8.40, lon: 140.40 },
  { id: 'k2', nama: 'KPB Rambutan', provinsi: 'Sumatera Selatan', tipe: 'KPB', tahap: 'Mandiri', populasi: 15230, indeks5t: 88, hplHa: 9800, shmHa: 9450, anggaranPct: 91, risiko: 'low', lat: -3.05, lon: 104.75 },
  { id: 'k3', nama: 'SKP Towuti', provinsi: 'Sulawesi Tengah', tipe: 'SKP', tahap: 'Tumbuh', populasi: 5610, indeks5t: 58, hplHa: 7600, shmHa: 4100, anggaranPct: 45, risiko: 'high', lat: -1.50, lon: 120.70 },
  { id: 'k4', nama: 'KPB Malinau', provinsi: 'Kalimantan Utara', tipe: 'KPB', tahap: 'Berkembang', populasi: 9870, indeks5t: 71, hplHa: 11200, shmHa: 8300, anggaranPct: 63, risiko: 'med', lat: 3.58, lon: 116.63 },
  { id: 'k5', nama: 'SKP Tobadak', provinsi: 'Sulawesi Barat', tipe: 'SKP', tahap: 'Rintisan', populasi: 2340, indeks5t: 39, hplHa: 5400, shmHa: 1200, anggaranPct: 22, risiko: 'high', lat: -2.32, lon: 119.15 },
  { id: 'k6', nama: 'KPB Bathin III', provinsi: 'Jambi', tipe: 'KPB', tahap: 'Mandiri', populasi: 18110, indeks5t: 92, hplHa: 8900, shmHa: 8850, anggaranPct: 95, risiko: 'low', lat: -1.60, lon: 102.10 },
  { id: 'k7', nama: 'SKP Bina Buay', provinsi: 'Bengkulu', tipe: 'SKP', tahap: 'Tumbuh', populasi: 4390, indeks5t: 55, hplHa: 6100, shmHa: 3200, anggaranPct: 41, risiko: 'med', lat: -3.80, lon: 102.30 },
  { id: 'k8', nama: 'KPB Pulau Rimau', provinsi: 'Sumatera Selatan', tipe: 'KPB', tahap: 'Berkembang', populasi: 11040, indeks5t: 76, hplHa: 9400, shmHa: 7700, anggaranPct: 70, risiko: 'low', lat: -2.85, lon: 104.55 },
  { id: 'k9', nama: 'SKP Kobisonta', provinsi: 'Maluku Utara', tipe: 'SKP', tahap: 'Rintisan', populasi: 1980, indeks5t: 34, hplHa: 4800, shmHa: 900, anggaranPct: 18, risiko: 'high', lat: -0.35, lon: 127.95 },
  { id: 'k10', nama: 'KPB Air Terang', provinsi: 'Kalimantan Tengah', tipe: 'KPB', tahap: 'Tumbuh', populasi: 6720, indeks5t: 61, hplHa: 8200, shmHa: 4600, anggaranPct: 48, risiko: 'med', lat: -1.50, lon: 113.50 }
];

const S_CURVE: SCurve = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
  rencana: [4, 9, 15, 22, 30, 39, 49, 59, 69, 80, 91, 100],
  realisasi: [3, 7, 12, 18, 24, 31, 40, 49, 57, 66, 74, null]
};

const KOMODITAS: Komoditas[] = [
  { nama: 'Kelapa Sawit', nilai: 82 }, { nama: 'Karet', nilai: 61 },
  { nama: 'Kakao', nilai: 47 }, { nama: 'Padi', nilai: 74 },
  { nama: 'Perikanan Tambak', nilai: 39 }, { nama: 'Rumput Laut', nilai: 28 }
];

const INFRA_KATEGORI: InfraKategori[] = [
  { nama: 'Jalan Poros & Jembatan', capaian: 71 },
  { nama: 'Sarana Ibadah', capaian: 88 },
  { nama: 'Sekolah & PAUD', capaian: 64 },
  { nama: 'Fasilitas Kesehatan', capaian: 57 },
  { nama: 'Air Bersih & Sanitasi', capaian: 49 }
];

const KL_COLLAB: KlCollab[] = [
  { kl: 'Kementerian PU', program: 'Jalan Poros Kawasan', kawasanCount: 6, status: 'Berjalan' },
  { kl: 'Kementerian Kesehatan', program: 'Puskesmas Pembantu', kawasanCount: 4, status: 'Berjalan' },
  { kl: 'Kementerian Pendidikan', program: 'Rehabilitasi Sekolah', kawasanCount: 5, status: 'Perencanaan' },
  { kl: 'Kementerian Pertanian', program: 'Optimalisasi Lahan Sawah', kawasanCount: 3, status: 'Berjalan' },
  { kl: 'Kementerian ESDM', program: 'Elektrifikasi Desa', kawasanCount: 7, status: 'Selesai' }
];

const ASAL_DAERAH: AsalDaerah[] = [
  { asal: 'Jawa Tengah', jml: 3120 }, { asal: 'Jawa Timur', jml: 2870 },
  { asal: 'Jawa Barat', jml: 2140 }, { asal: 'NTB', jml: 1380 }, { asal: 'Bali', jml: 690 }
];

/** 7 of the source's 17 IKU (Renstra Kementerian Transmigrasi) — a representative subset, see PORT_NOTES.md. */
const IKU_LIST: IkuItem[] = [
  { no: 1, satuan: 'Indeks', nilai: 72, trend: 2.4, indikator: 'Nilai rata-rata Indeks Transformasi 45 Kawasan Transmigrasi.', pic: 'Elis Sampe Andi, S.E, M.M' },
  { no: 2, satuan: 'Persen', nilai: 61, trend: 1.8, indikator: 'Persentase kepastian hukum status lahan yang terselesaikan, termasuk dukungan fasilitasi legalisasi tanah transmigrasi.', pic: 'La Ode Muhajirin, S.IP, M.Si' },
  { no: 3, satuan: 'Persen', nilai: 58, trend: -0.9, indikator: 'Persentase pembangunan prasarana, sarana & utilitas serta penempatan transmigran lokal.', pic: 'Robi Suherman Ponglabba, ST, MT / Ria Fajarianti, S.E., M.M' },
  { no: 7, satuan: 'Persen', nilai: 47, trend: 2.0, indikator: 'Persentase lahan transmigrasi yang telah terbit SK & Sertipikat HPL, serta SHM.', pic: 'La Ode Muhajirin, S.IP, M.Si / Edy Wibowo, S.T., M.M' },
  { no: 13, satuan: 'Persen', nilai: 63, trend: 1.9, indikator: 'Persentase meningkatnya jumlah kawasan yang berdaya saing dan mandiri (45 kawasan & kawasan prioritas kementerian).', pic: 'Elis Sampe Andi, S.E, M.M' },
  { no: 14, satuan: 'Persen', nilai: 71, trend: 3.4, indikator: 'Persentase realisasi implementasi Rencana Aksi Reformasi Birokrasi & Transformasi Digital.', pic: 'Ir. Rajumber Prihatin, M.Si' },
  { no: 17, satuan: 'Nilai', nilai: 85, trend: 2.2, indikator: 'Nilai SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) Ditjen PPK Transmigrasi.', pic: 'Ir. Rajumber Prihatin, M.Si' }
];

@Injectable({ providedIn: 'root' })
export class DashboardDataService {
  getKawasan(): Kawasan[] {
    return KAWASAN;
  }

  getKawasanById(id: string): Kawasan | undefined {
    return KAWASAN.find(k => k.id === id);
  }

  /** Same on-the-fly aggregation the original IIFE does over `kawasan` at load time. */
  getProvinces(): Province[] {
    const map: { [nama: string]: Province } = {};
    KAWASAN.forEach(k => {
      if (!map[k.provinsi]) {
        map[k.provinsi] = { nama: k.provinsi, count: 0, hpl: 0, shm: 0 };
      }
      map[k.provinsi].count++;
      map[k.provinsi].hpl += k.hplHa;
      map[k.provinsi].shm += k.shmHa;
    });
    return Object.keys(map).map(key => map[key]);
  }

  getSCurve(): SCurve {
    return S_CURVE;
  }

  getKomoditas(): Komoditas[] {
    return KOMODITAS;
  }

  getInfraKategori(): InfraKategori[] {
    return INFRA_KATEGORI;
  }

  getKlCollab(): KlCollab[] {
    return KL_COLLAB;
  }

  getAsalDaerah(): AsalDaerah[] {
    return ASAL_DAERAH;
  }

  getIkuList(): IkuItem[] {
    return IKU_LIST;
  }

  /** Same derived shape as the original's `nationalKPI` object literal. */
  getNationalKPI(): NationalKPI {
    const totalPopulasi = KAWASAN.reduce((s, k) => s + k.populasi, 0);
    const avgIndeks = Math.round(KAWASAN.reduce((s, k) => s + k.indeks5t, 0) / KAWASAN.length);
    return {
      totalKawasan: KAWASAN.length,
      totalSKP: KAWASAN.filter(k => k.tipe === 'SKP').length,
      totalKPB: KAWASAN.filter(k => k.tipe === 'KPB').length,
      totalPopulasi,
      avgIndeks,
      hplTotal: KAWASAN.reduce((s, k) => s + k.hplHa, 0),
      shmTotal: KAWASAN.reduce((s, k) => s + k.shmHa, 0)
    };
  }
}
