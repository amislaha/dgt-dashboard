import { Injectable } from '@angular/core';

/**
 * All data below is fabricated/illustrative — ported verbatim in shape and
 * spirit from dashboard/index.html's mock dataset (`kawasan`, `provinces`,
 * `sCurve`, `komoditas`, `nationalKPI`, `ikuList`). None of it is real
 * ministry data. See CLAUDE.md "Data layer" and PORT_NOTES.md for what was
 * ported vs. trimmed. (`infraKategori`/`klCollab`/`asalDaerah` backed the
 * Infrastruktur & Kolaborasi K/L and Demografi & Pembauran modules, removed
 * on request — see PORT_NOTES.md.)
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

/** Ports `seededRandom()` — a small deterministic PRNG keyed off a string seed, used so the
 *  same kawasan always generates the same fabricated area shape across renders/reloads. */
export function seededRandom(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) {
    s = (Math.imul(s, 31) + seed.charCodeAt(i)) >>> 0;
  }
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Ports `kawasanAreaLatLngs()` — a fabricated per-kawasan boundary "blob" (no real cadastral/HPL
 *  polygon data exists, see CLAUDE.md "Data layer"), an irregular ring generated deterministically
 *  from the kawasan's own id, roughly sized by its HPL extent. Longitude is corrected by
 *  cos(latitude) so the ring isn't visibly stretched east-west. Replaces a single-point circle
 *  marker with an actual area per kawasan on the live Leaflet map. */
export function kawasanAreaLatLngs(k: Kawasan): [number, number][] {
  const rnd = seededRandom(k.id + '-area');
  const points = 10;
  const baseDeg = 0.5 + Math.sqrt(k.hplHa) / 350;
  const lonScale = 1 / Math.max(0.15, Math.cos((k.lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = baseDeg * (0.65 + rnd() * 0.7);
    ring.push([k.lat + Math.sin(angle) * r, k.lon + Math.cos(angle) * r * lonScale]);
  }
  return ring;
}

/** Ports `BASEMAP_BBOX`/`mercatorPx()`/`basemapPct()` — the Web Mercator projection math used to
 *  place a dot over the static `assets/basemap-indonesia.jpg` mosaic (a real OSM tile snapshot,
 *  zoom 5, extracted from the original's baked-in base64 `BASEMAP_STATIC_SRC`) for the map panel's
 *  "you are here" locator inset. Must stay in sync with the bounding box the image was cropped to. */
export const BASEMAP_BBOX = { lonMin: 93.5, lonMax: 141.5, latMin: -11.5, latMax: 7.0, zoom: 5 };

function mercatorPx(lon: number, lat: number, zoom: number): [number, number] {
  const n = Math.pow(2, zoom);
  const x = ((lon + 180) / 360) * n * 256;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * 256;
  return [x, y];
}

const bmTopLeft = mercatorPx(BASEMAP_BBOX.lonMin, BASEMAP_BBOX.latMax, BASEMAP_BBOX.zoom);
const bmBotRight = mercatorPx(BASEMAP_BBOX.lonMax, BASEMAP_BBOX.latMin, BASEMAP_BBOX.zoom);

export function basemapPct(lon: number, lat: number): { xPct: number; yPct: number } {
  const p = mercatorPx(lon, lat, BASEMAP_BBOX.zoom);
  return {
    xPct: ((p[0] - bmTopLeft[0]) / (bmBotRight[0] - bmTopLeft[0])) * 100,
    yPct: ((p[1] - bmTopLeft[1]) / (bmBotRight[1] - bmTopLeft[1])) * 100
  };
}

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

/** All 17 IKU (Renstra Kementerian Transmigrasi) — previously ported as a representative 7-item
 *  subset (see PORT_NOTES.md); the full list is needed for a 1:1 IKU-chip strip. */
const IKU_LIST: IkuItem[] = [
  { no: 1, satuan: 'Indeks', nilai: 72, trend: 2.4, indikator: 'Nilai rata-rata Indeks Transformasi 45 Kawasan Transmigrasi.', pic: 'Elis Sampe Andi, S.E, M.M' },
  { no: 2, satuan: 'Persen', nilai: 61, trend: 1.8, indikator: 'Persentase kepastian hukum status lahan yang terselesaikan, termasuk dukungan fasilitasi legalisasi tanah transmigrasi.', pic: 'La Ode Muhajirin, S.IP, M.Si' },
  { no: 3, satuan: 'Persen', nilai: 58, trend: -0.9, indikator: 'Persentase pembangunan prasarana, sarana & utilitas serta penempatan transmigran lokal.', pic: 'Robi Suherman Ponglabba, ST, MT / Ria Fajarianti, S.E., M.M' },
  { no: 4, satuan: 'Persen', nilai: 64, trend: 3.1, indikator: 'Persentase pembangunan prasarana, sarana & utilitas umum untuk transmigran patriot.', pic: 'Robi Suherman Ponglabba, ST, MT' },
  { no: 5, satuan: 'Persen', nilai: 55, trend: -1.4, indikator: 'Persentase pembangunan PSU dan penempatan transmigran Karya Nusantara.', pic: 'Robi Suherman Ponglabba, ST, MT / Ria Fajarianti, S.E., M.M' },
  { no: 6, satuan: 'Indeks', nilai: 69, trend: 1.2, indikator: 'Nilai rata-rata indeks transformasi Kawasan Transmigrasi Prioritas Kementerian.', pic: 'Elis Sampe Andi, S.E, M.M' },
  { no: 7, satuan: 'Persen', nilai: 47, trend: 2.0, indikator: 'Persentase lahan transmigrasi yang telah terbit SK & Sertipikat HPL, serta SHM.', pic: 'La Ode Muhajirin, S.IP, M.Si / Edy Wibowo, S.T., M.M' },
  { no: 8, satuan: 'Persen', nilai: 66, trend: -0.6, indikator: 'Persentase SP/PSP/Kawasan Perkotaan Baru yang dibangun PSU untuk transmigrasi lokal.', pic: 'Robi Suherman Ponglabba, ST, MT' },
  { no: 9, satuan: 'Persen', nilai: 52, trend: 1.5, indikator: 'Persentase Kepala Keluarga (KK) transmigran lokal yang ditempatkan di SP transmigrasi.', pic: 'Ria Fajarianti, S.E., M.M' },
  { no: 10, satuan: 'Persen', nilai: 60, trend: 2.7, indikator: 'Persentase SP/PSP/Kawasan Perkotaan Baru transmigrasi patriot yang dibangun PSU.', pic: 'Robi Suherman Ponglabba, ST, MT' },
  { no: 11, satuan: 'Persen', nilai: 57, trend: 0.8, indikator: 'Persentase SP/PSP/Kawasan Perkotaan Baru transmigrasi Karya Nusantara yang dibangun PSU.', pic: 'Robi Suherman Ponglabba, ST, MT' },
  { no: 12, satuan: 'Persen', nilai: 49, trend: -1.1, indikator: 'Persentase KK transmigran Karya Nusantara yang difasilitasi penempatannya.', pic: 'Ria Fajarianti, S.E., M.M' },
  { no: 13, satuan: 'Persen', nilai: 63, trend: 1.9, indikator: 'Persentase meningkatnya jumlah kawasan yang berdaya saing dan mandiri (45 kawasan & kawasan prioritas kementerian).', pic: 'Elis Sampe Andi, S.E, M.M' },
  { no: 14, satuan: 'Persen', nilai: 71, trend: 3.4, indikator: 'Persentase realisasi implementasi Rencana Aksi Reformasi Birokrasi & Transformasi Digital.', pic: 'Ir. Rajumber Prihatin, M.Si' },
  { no: 15, satuan: 'Nilai', nilai: 82, trend: 0.5, indikator: 'Nilai Pengawasan Kearsipan Ditjen PPK Transmigrasi.', pic: 'Ir. Rajumber Prihatin, M.Si' },
  { no: 16, satuan: 'Nilai', nilai: 78, trend: -0.7, indikator: 'Tingkat penerapan pengendalian intern Ditjen PPK Transmigrasi.', pic: 'Ir. Rajumber Prihatin, M.Si' },
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
