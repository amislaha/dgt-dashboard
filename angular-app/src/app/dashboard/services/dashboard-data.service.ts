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

/** Status legalitas lahan (HPL/SHM) — the options of the "Semua status" filter on Geospasial and Profil. */
export const STATUS_HPL = [
  'Ada SK HPL', 'Bersertifikat HPL', 'Terinventarisasi Ulang', 'Tervaluasi HPL', 'Tersertifikat SHM'
] as const;
export type StatusHpl = typeof STATUS_HPL[number];

export interface Kawasan {
  id: string;
  nama: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: number;
  desa: number;
  tipe: 'SKP' | 'KPB';
  tahap: Tahap;
  populasi: number;
  indeks5t: number;
  hplHa: number;
  shmHa: number;
  /** Land-legality status; derived from the SHM share of HPL so it agrees with `shmHa`/`hplHa`. */
  statusHpl: StatusHpl;
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

export interface IndeksTrend {
  labels: string[];
  values: number[];
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
  totalProvinsi: number;
  totalKabupaten: number;
  totalKecamatan: number;
  totalDesa: number;
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

/** Shared ring-generator behind `kawasanAreaLatLngs()`/`kawasanShmLatLngs()` below — an irregular
 *  polygon "blob" deterministically seeded from the kawasan's own id plus a suffix (so the two
 *  layers don't trace an identical outline just scaled) and sized by whichever hectare figure is
 *  passed in. Longitude is corrected by cos(latitude) so the ring isn't visibly stretched east-west. */
function kawasanRing(k: Kawasan, hectares: number, seedSuffix: string): [number, number][] {
  // `k.nama` mixed in for the same reason `deriveKawasan()` does — `k.id` alone ('k1'..'k45') is too
  // short/sequential for seededRandom()'s hash to diffuse well, which would otherwise make every
  // kawasan's polygon come out a similarly-shaped blob instead of a distinct one.
  const rnd = seededRandom(k.id + '-' + k.nama + seedSuffix);
  const points = 10;
  const baseDeg = 0.5 + Math.sqrt(hectares) / 350;
  const lonScale = 1 / Math.max(0.15, Math.cos((k.lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = baseDeg * (0.65 + rnd() * 0.7);
    ring.push([k.lat + Math.sin(angle) * r, k.lon + Math.cos(angle) * r * lonScale]);
  }
  return ring;
}

/** Ports `kawasanAreaLatLngs()` — a fabricated per-kawasan boundary "blob" (no real cadastral/HPL
 *  polygon data exists, see CLAUDE.md "Data layer"), roughly sized by the kawasan's total HPL
 *  extent. Replaces a single-point circle marker with an actual area per kawasan on the live
 *  Leaflet map. */
export function kawasanAreaLatLngs(k: Kawasan): [number, number][] {
  return kawasanRing(k, k.hplHa, '-area');
}

/** The certified-SHM subset of the same HPL area — its own ring (not a literal sub-polygon of
 *  `kawasanAreaLatLngs()`'s ring, since neither is real cadastral data anyway) sized by `shmHa`
 *  instead of `hplHa`. Since `shmHa <= hplHa` always, this ring is always the smaller of the two,
 *  which is enough for an illustrative "how much of the area is actually certified" overlay without
 *  claiming a real sub-boundary. Backs `KawasanMapComponent`'s optional SHM layer. */
export function kawasanShmLatLngs(k: Kawasan): [number, number][] {
  return kawasanRing(k, k.shmHa, '-shm-area');
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

/** `nama`/`kabupaten`/`provinsi`/`kpb` below are real, copied verbatim from the user-provided
 *  "Matriks 45 Kawasan Transmigrasi Prioritas Nasional Tahun 2025" spreadsheet (its `KAWASAN`/
 *  `KABUPATEN`/`PROVINSI`/`KPB?` columns — `Y` in that last column means the kawasan has its own
 *  KPB, otherwise it's SKP-only; a couple of provinces were spelled out from the sheet's
 *  abbreviations, "NTB"/"NTT"/"Bangka Belitung" → their official full names, for consistency with
 *  how every other province in this file is written). `lat`/`lon` are NOT from that spreadsheet
 *  (it has none) — they're this port's own approximate kabupaten-level coordinate estimates, real
 *  enough to place a pin in roughly the right spot on the basemap but not surveyed. Every other
 *  field below (`tahap`/`populasi`/`indeks5t`/`hplHa`/`shmHa`/`anggaranPct`/`risiko`/`kecamatan`/
 *  `desa`) is still fabricated/illustrative, same as the rest of this file's "Data layer" — derived
 *  deterministically by `deriveKawasan()` below rather than hand-authored per row, the same
 *  `seededRandom(id)` approach `profilDetailData()` already uses, so the numbers stay internally
 *  consistent (shmHa <= hplHa, risiko trending down as tahap matures) without 45 rows of hand-tuned
 *  figures to keep in sync. */
interface KawasanSeed {
  id: string;
  nama: string;
  kabupaten: string;
  provinsi: string;
  kpb: boolean;
  lat: number;
  lon: number;
}

const KAWASAN_SEEDS: KawasanSeed[] = [
  { id: 'k1', nama: 'Rasau Jaya', kabupaten: 'Kubu Raya', provinsi: 'Kalimantan Barat', kpb: true, lat: -0.20, lon: 109.40 },
  { id: 'k2', nama: 'Lagita', kabupaten: 'Bengkulu Utara', provinsi: 'Bengkulu', kpb: true, lat: -3.35, lon: 102.20 },
  { id: 'k3', nama: 'Cahaya Baru', kabupaten: 'Barito Kuala', provinsi: 'Kalimantan Selatan', kpb: false, lat: -3.15, lon: 114.55 },
  { id: 'k4', nama: 'Mahalona', kabupaten: 'Luwu Timur', provinsi: 'Sulawesi Selatan', kpb: false, lat: -2.55, lon: 121.35 },
  { id: 'k5', nama: 'Tobadak', kabupaten: 'Mamuju Tengah', provinsi: 'Sulawesi Barat', kpb: false, lat: -2.32, lon: 119.15 },
  { id: 'k6', nama: 'Lunang Silaut', kabupaten: 'Pesisir Selatan', provinsi: 'Sumatera Barat', kpb: true, lat: -2.15, lon: 101.15 },
  { id: 'k7', nama: 'Telang', kabupaten: 'Banyuasin', provinsi: 'Sumatera Selatan', kpb: false, lat: -2.60, lon: 104.95 },
  { id: 'k8', nama: 'Salor', kabupaten: 'Merauke', provinsi: 'Papua Selatan', kpb: false, lat: -8.40, lon: 140.40 },
  { id: 'k9', nama: 'Jelai (Pulau Nibung)', kabupaten: 'Sukamara', provinsi: 'Kalimantan Tengah', kpb: false, lat: -2.65, lon: 111.15 },
  { id: 'k10', nama: 'Pituriase', kabupaten: 'Sidenreng Rappang', provinsi: 'Sulawesi Selatan', kpb: true, lat: -3.75, lon: 119.85 },
  { id: 'k11', nama: 'Petata', kabupaten: 'PALI', provinsi: 'Sumatera Selatan', kpb: true, lat: -3.35, lon: 103.85 },
  { id: 'k12', nama: 'Parit Rambutan', kabupaten: 'Ogan Ilir', provinsi: 'Sumatera Selatan', kpb: false, lat: -3.30, lon: 104.60 },
  { id: 'k13', nama: 'Tasifeto - Mandeu', kabupaten: 'Belu', provinsi: 'Nusa Tenggara Timur', kpb: true, lat: -9.10, lon: 124.90 },
  { id: 'k14', nama: 'Selaut', kabupaten: 'Simeulue', provinsi: 'Aceh', kpb: true, lat: 2.55, lon: 96.10 },
  { id: 'k15', nama: 'Selaparang', kabupaten: 'Lombok Timur', provinsi: 'Nusa Tenggara Barat', kpb: true, lat: -8.55, lon: 116.55 },
  { id: 'k16', nama: 'Batu Betumpang', kabupaten: 'Bangka Selatan', provinsi: 'Kepulauan Bangka Belitung', kpb: false, lat: -2.90, lon: 106.30 },
  { id: 'k17', nama: 'Sarudu Baras', kabupaten: 'Mamuju Utara', provinsi: 'Sulawesi Barat', kpb: true, lat: -1.15, lon: 119.65 },
  { id: 'k18', nama: 'Bungku', kabupaten: 'Morowali', provinsi: 'Sulawesi Tengah', kpb: false, lat: -2.65, lon: 121.90 },
  { id: 'k19', nama: 'Mutiara', kabupaten: 'Muna', provinsi: 'Sulawesi Tenggara', kpb: true, lat: -4.85, lon: 122.55 },
  { id: 'k20', nama: 'Sumalata', kabupaten: 'Gorontalo Utara', provinsi: 'Gorontalo', kpb: true, lat: 0.95, lon: 122.15 },
  { id: 'k21', nama: 'Salim Batu', kabupaten: 'Bulungan', provinsi: 'Kalimantan Utara', kpb: false, lat: 2.85, lon: 117.35 },
  { id: 'k22', nama: 'Palolo', kabupaten: 'Sigi', provinsi: 'Sulawesi Tengah', kpb: true, lat: -1.15, lon: 120.15 },
  { id: 'k23', nama: 'Gerbang Masperkasa', kabupaten: 'Sambas', provinsi: 'Kalimantan Barat', kpb: true, lat: 1.35, lon: 109.30 },
  { id: 'k24', nama: 'Asinua/Routa', kabupaten: 'Konawe', provinsi: 'Sulawesi Tenggara', kpb: true, lat: -3.35, lon: 121.90 },
  { id: 'k25', nama: 'Tampolere', kabupaten: 'Poso', provinsi: 'Sulawesi Tengah', kpb: false, lat: -1.60, lon: 120.85 },
  { id: 'k26', nama: 'Kikim', kabupaten: 'Lahat', provinsi: 'Sumatera Selatan', kpb: false, lat: -3.65, lon: 103.35 },
  { id: 'k27', nama: 'Ponu', kabupaten: 'Timor Tengah Utara', provinsi: 'Nusa Tenggara Timur', kpb: false, lat: -9.25, lon: 124.35 },
  { id: 'k28', nama: 'Pulau Morotai', kabupaten: 'Morotai', provinsi: 'Maluku Utara', kpb: true, lat: 2.05, lon: 128.35 },
  { id: 'k29', nama: 'Kobalima Timur', kabupaten: 'Malaka', provinsi: 'Nusa Tenggara Timur', kpb: true, lat: -9.30, lon: 124.75 },
  { id: 'k30', nama: 'Kerang', kabupaten: 'Paser', provinsi: 'Kalimantan Timur', kpb: false, lat: -1.85, lon: 116.10 },
  { id: 'k31', nama: 'Muting', kabupaten: 'Merauke', provinsi: 'Papua Selatan', kpb: true, lat: -7.85, lon: 140.35 },
  { id: 'k32', nama: 'Senggi', kabupaten: 'Keerom', provinsi: 'Papua', kpb: false, lat: -3.05, lon: 140.75 },
  { id: 'k33', nama: 'Tubbi Taramanu', kabupaten: 'Polewali Mandar', provinsi: 'Sulawesi Barat', kpb: false, lat: -3.20, lon: 119.15 },
  { id: 'k34', nama: 'Anawua', kabupaten: 'Kolaka', provinsi: 'Sulawesi Tenggara', kpb: true, lat: -4.05, lon: 121.60 },
  { id: 'k35', nama: 'Lamunti - Dadahup', kabupaten: 'Kapuas', provinsi: 'Kalimantan Tengah', kpb: true, lat: -2.85, lon: 114.45 },
  { id: 'k36', nama: 'Ulumanda', kabupaten: 'Majene', provinsi: 'Sulawesi Barat', kpb: true, lat: -3.25, lon: 118.85 },
  { id: 'k37', nama: 'Patlean', kabupaten: 'Halmahera Timur', provinsi: 'Maluku Utara', kpb: true, lat: 0.85, lon: 128.35 },
  { id: 'k38', nama: 'Mambi Mehalaan', kabupaten: 'Mamasa', provinsi: 'Sulawesi Barat', kpb: false, lat: -2.90, lon: 119.30 },
  { id: 'k39', nama: 'Sekayam - Entikong', kabupaten: 'Sanggau', provinsi: 'Kalimantan Barat', kpb: false, lat: 0.90, lon: 110.15 },
  { id: 'k40', nama: 'Ketungau Hulu', kabupaten: 'Sintang', provinsi: 'Kalimantan Barat', kpb: false, lat: 0.85, lon: 112.25 },
  { id: 'k41', nama: 'Sagea Waleh', kabupaten: 'Halmahera Tengah', provinsi: 'Maluku Utara', kpb: false, lat: 0.55, lon: 128.15 },
  { id: 'k42', nama: 'Muara Takung - Kamang Baru', kabupaten: 'Sijunjung', provinsi: 'Sumatera Barat', kpb: false, lat: -0.60, lon: 100.95 },
  { id: 'k43', nama: 'Pulau Bacan', kabupaten: 'Halmahera Selatan', provinsi: 'Maluku Utara', kpb: false, lat: -0.55, lon: 127.55 },
  { id: 'k44', nama: 'Klamono - Segun', kabupaten: 'Sorong', provinsi: 'Papua Barat Daya', kpb: false, lat: -0.95, lon: 131.65 },
  { id: 'k45', nama: 'Arut Selatan dan Kota Waringin Lama', kabupaten: 'Kota Waringin Barat', provinsi: 'Kalimantan Tengah', kpb: false, lat: -2.75, lon: 111.65 }
];

/** Deterministically fabricates every field the spreadsheet doesn't provide, seeded off the
 *  kawasan's own id so a given kawasan always gets the same numbers across reloads. `tahap` is
 *  drawn first and every other field is band-derived from it (higher tahap → higher indeks5t/
 *  anggaranPct/shmHa-share, lower risiko), so the fabricated figures at least read as internally
 *  consistent with each other, the same property `profilDetailData()` maintains elsewhere in this
 *  file. */
function deriveKawasan(seed: KawasanSeed): Kawasan {
  // `seed.id` alone ('k1'..'k45') isn't enough entropy to seed with — seededRandom()'s hash has weak
  // avalanche behaviour for short, near-sequential keys, so every kawasan's *first* rnd() draw came
  // out within the same ~0.2-wide band (empirically verified: all 45 landed in the same `tahap`
  // bucket). Mixing in the kawasan's own name fixes this without changing seededRandom() itself
  // (which is also used elsewhere with longer/varied seeds where this was never an issue).
  const rnd = seededRandom(seed.id + '-' + seed.nama);
  const tahapRoll = rnd();
  const tahap: Tahap = tahapRoll < 0.22 ? 'Rintisan' : tahapRoll < 0.52 ? 'Tumbuh' : tahapRoll < 0.82 ? 'Berkembang' : 'Mandiri';
  const t = STAGES.indexOf(tahap);

  const indeks5t = Math.max(15, Math.min(98, Math.round([30, 50, 68, 85][t] + (rnd() * 16 - 8))));
  const populasi = Math.round(1800 + t * 2600 + rnd() * 4200);
  const hplHa = Math.round(3200 + rnd() * 10800);
  const shmShare = Math.min(0.97, Math.max(0.05, [0.18, 0.38, 0.62, 0.88][t] + (rnd() * 0.12 - 0.06)));
  const shmHa = Math.round(hplHa * shmShare);
  const anggaranPct = Math.max(8, Math.min(97, Math.round([20, 42, 66, 88][t] + (rnd() * 16 - 8))));
  const riskRoll = rnd();
  const risiko: Risiko =
    t === 0 ? (riskRoll < 0.7 ? 'high' : 'med') :
    t === 1 ? (riskRoll < 0.45 ? 'med' : riskRoll < 0.8 ? 'high' : 'low') :
    t === 2 ? (riskRoll < 0.6 ? 'low' : 'med') :
    riskRoll < 0.85 ? 'low' : 'med';

  const kecamatan = 2 + Math.round(rnd() * 7);
  const desa = 3 + Math.round(rnd() * 12);
  // Drawn after every other field so adding it doesn't shift any existing kawasan's numbers.
  const statusRoll = rnd();
  const statusHpl: StatusHpl =
    shmShare >= 0.7 ? 'Tersertifikat SHM' :
    shmShare >= 0.5 ? 'Bersertifikat HPL' :
    shmShare >= 0.3 ? (statusRoll < 0.5 ? 'Tervaluasi HPL' : 'Terinventarisasi Ulang') :
    (statusRoll < 0.5 ? 'Ada SK HPL' : 'Terinventarisasi Ulang');

  return {
    id: seed.id,
    nama: seed.nama,
    provinsi: seed.provinsi,
    kabupaten: seed.kabupaten,
    kecamatan,
    desa,
    tipe: seed.kpb ? 'KPB' : 'SKP',
    tahap,
    populasi,
    indeks5t,
    hplHa,
    shmHa,
    statusHpl,
    anggaranPct,
    risiko,
    lat: seed.lat,
    lon: seed.lon
  };
}

const KAWASAN: Kawasan[] = KAWASAN_SEEDS.map(deriveKawasan);

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

  /** National average Indeks 5T over the last 12 months — computed from the current per-kawasan
   *  `indeks5t` values (via `getNationalKPI().avgIndeks` as the Desember/current point) rather than
   *  stored as its own hand-authored series, so it can't drift out of sync with the real dataset.
   *  The 11 months before it are a smooth, deterministically-seeded ramp up to that current value —
   *  there's no real historical time series behind this (the source data is a single snapshot), so
   *  this is illustrative trend shape only, same "fabricated but internally consistent" treatment
   *  as `profilDetailData()`. */
  getIndeksTrend(): IndeksTrend {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const current = this.getNationalKPI().avgIndeks;
    const rnd = seededRandom('national-indeks-trend');
    const start = Math.max(10, current - 16 - rnd() * 6);
    const values = labels.map((_, i) => {
      if (i === labels.length - 1) {
        return current;
      }
      const frac = i / (labels.length - 1);
      const eased = start + (current - start) * frac;
      return Math.round(Math.max(0, Math.min(100, eased + (rnd() * 3 - 1.5))));
    });
    return { labels, values };
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
    const provSet = new Set(KAWASAN.map(k => k.provinsi));
    const kabSet = new Set(KAWASAN.map(k => k.kabupaten));
    return {
      totalKawasan: KAWASAN.length,
      totalSKP: KAWASAN.filter(k => k.tipe === 'SKP').length,
      totalKPB: KAWASAN.filter(k => k.tipe === 'KPB').length,
      totalPopulasi,
      avgIndeks,
      hplTotal: KAWASAN.reduce((s, k) => s + k.hplHa, 0),
      shmTotal: KAWASAN.reduce((s, k) => s + k.shmHa, 0),
      totalProvinsi: provSet.size,
      totalKabupaten: kabSet.size,
      totalKecamatan: KAWASAN.reduce((s, k) => s + k.kecamatan, 0),
      totalDesa: KAWASAN.reduce((s, k) => s + k.desa, 0)
    };
  }
}

/* ---------- Data Induk & Profil Kawasan: per-kawasan Ekonomi/Sosial/Perencanaan detail ----------
   Ports profilDetailData() (legacy-static/dashboard/index.html) — computed on demand from the base
   Kawasan fields plus seededRandom(k.id + '-' + k.nama) rather than stored as extra hand-authored
   literals per kawasan, so the numbers stay internally consistent (e.g. the SHM-certified share ties back to the
   same hplHa/shmHa pair the Geospasial legality layer already uses) and vary deterministically. */
export type ProfilKategori = 'Pangan' | 'Peternakan' | 'Perkebunan' | 'Pertambangan';

export interface ProfilProduk {
  kategori: ProfilKategori;
  komoditas: string;
  perHa: string;
  tahun: number;
}

export interface ProfilMataPencaharian {
  jenis: string;
  jumlah: number;
}

export interface ProfilDetail {
  pendudukJiwa: number;
  luasHa: number;
  dayaTampungKK: number;
  nilaiIntrans: string;
  kepadatan: string;
  kategoriIntrans: string;
  produkUnggulan: ProfilProduk[];
  pasar: number;
  kios: number;
  bumdes: number;
  lembagaLain: number;
  pendapatanPerKapita: number;
  mataPencaharian: ProfilMataPencaharian[];
  strukturUsia: { produktif: number; produktifPct: number; muda: number; mudaPct: number; tua: number; tuaPct: number };
  pendidikan: { sd: number; smp: number; sma: number };
  kesehatan: { puskesmas: number; pustu: number; mandiri: number };
  faskesMissing: string[];
  statusDesa: { maju: number; berkembang: number; tertinggal: number };
  dokumen: { rkt: boolean; rtsp: boolean; rskp: boolean };
  statusLahan: string;
  konektivitas: string;
  sertifikasi: { total: number; terbit: number; menunggu: number; pct: number };
  indeksInfra: string;
  indeksKelembagaan: string;
  indeksDukungan: string;
  dukunganLabel: string;
  produksiTon: number;
  deskripsiInvestasi: string;
}

const PRODUK_POOL: { [key in ProfilKategori]: string[] } = {
  Pangan: ['Padi Sawah', 'Jagung', 'Ubi Kayu', 'Kedelai'],
  Peternakan: ['Sapi Potong', 'Ayam Petelur', 'Kambing', 'Itik'],
  Perkebunan: ['Kelapa Sawit', 'Karet', 'Kopi', 'Kakao'],
  Pertambangan: ['Batu Gamping', 'Pasir Kuarsa', 'Nikel Laterit', 'Emas Rakyat']
};
const MATA_PENCAHARIAN_POOL = ['Petani', 'Peternak', 'Pekebun', 'Nelayan', 'Pedagang', 'Pengrajin'];
const FASKES_POOL = ['Rumah Sakit', 'Posyandu', 'Klinik', 'Apotik', 'Posbindu', 'Polindes'];

/** "Indeks Intrans"/"Indeks Kinerja Utama" on the landing page bucket every kawasan into the same
 *  Mandiri/Berkembang/Tertinggal 3-way classification used nationally for transmigration areas —
 *  distinct from the finer 4-stage `tahap` field used elsewhere, so two different source fields are
 *  bucketed into it for two donuts that read as related but not identical. */
export function profilBucketIndeks(v: number): string {
  return v >= 75 ? 'Mandiri' : v >= 45 ? 'Berkembang' : 'Tertinggal';
}
/** Which index the Data Induk donut buckets kawasan by. `intrans` is the real `indeks5t`; the other
 *  three have no per-kawasan field in the dataset, so they are fabricated deterministically (IKU/SS
 *  from `indeks5t` plus seeded noise, IDI from the detail page's `indeksDukungan` rescaled 1-5 -> 0-100). */
export type ProfilIndeksJenis = 'intrans' | 'iku' | 'ss' | 'idi';
export function profilIndeksScore(k: Kawasan, jenis: ProfilIndeksJenis): number {
  if (jenis === 'intrans') {
    return k.indeks5t;
  }
  if (jenis === 'idi') {
    return ((parseFloat(profilDetailData(k).indeksDukungan) - 1) / 4) * 100;
  }
  const rnd = seededRandom(k.id + '-' + k.nama + '-' + jenis);
  return Math.max(10, Math.min(98, k.indeks5t + (rnd() * 24 - 12)));
}
export function profilBucketTahap(t: Tahap): string {
  return t === 'Mandiri' ? 'Mandiri' : t === 'Berkembang' ? 'Berkembang' : 'Tertinggal';
}

export function profilDetailData(k: Kawasan): ProfilDetail {
  // `k.id` alone mixed in with `k.nama` for the same reason `deriveKawasan()`/`kawasanRing()` do —
  // seededRandom()'s hash doesn't diffuse well for short, near-sequential ids like 'k1'..'k45', which
  // otherwise clusters every kawasan's early rnd() draws (produktifPct/tuaPct here) into the same
  // narrow band instead of spreading them out.
  const rnd = seededRandom(k.id + '-' + k.nama);
  const totalJiwa = k.populasi;
  const produktifPct = 60 + Math.round(rnd() * 8);
  const tuaPct = 2 + Math.round(rnd() * 3);
  const mudaPct = 100 - produktifPct - tuaPct;
  const produktifJiwa = Math.round((totalJiwa * produktifPct) / 100);
  const tuaJiwa = Math.round((totalJiwa * tuaPct) / 100);
  const mudaJiwa = totalJiwa - produktifJiwa - tuaJiwa;

  const bidangTotal = Math.max(20, Math.round(k.populasi / 40));
  const bidangTerbit = Math.round(bidangTotal * (k.shmHa / k.hplHa));
  const bidangMenunggu = bidangTotal - bidangTerbit;

  const maju = Math.max(0, Math.round(k.desa * (k.tahap === 'Mandiri' ? 0.2 : 0.05)));
  const berkembang = Math.round(k.desa * (k.tahap === 'Rintisan' ? 0.35 : 0.55));
  const tertinggal = Math.max(0, k.desa - maju - berkembang);

  const produkUnggulan: ProfilProduk[] = (['Pangan', 'Peternakan', 'Perkebunan', 'Pertambangan'] as ProfilKategori[]).map(kat => {
    const pool = PRODUK_POOL[kat];
    return { kategori: kat, komoditas: pool[Math.floor(rnd() * pool.length)], perHa: (6 + rnd() * 24).toFixed(1), tahun: 2026 };
  });

  const mpShuffled = MATA_PENCAHARIAN_POOL.slice().sort(() => rnd() - 0.5);
  const fracs = [0.16, 0.06, 0.03];
  const mataPencaharian: ProfilMataPencaharian[] = mpShuffled.slice(0, 3).map((jenis, i) => ({
    jenis,
    jumlah: Math.max(5, Math.round(k.populasi * fracs[i]))
  }));

  const faskesMissingCount = k.indeks5t >= 70 ? 2 : k.indeks5t >= 45 ? 4 : 6;

  /* ---- investment-profile fields (Ekonomi & Investasi Kawasan module) ---- */
  const tahapBase: { [key in Tahap]: number } = { Mandiri: 4.2, Berkembang: 3.2, Tumbuh: 2.2, Rintisan: 1.2 };
  const indeksInfraNum = Math.min(5, Math.max(1, (k.indeks5t / 100) * 4 + rnd() * 1));
  const indeksKelembagaanNum = Math.min(5, Math.max(1, tahapBase[k.tahap] + rnd() * 0.8));
  const indeksDukunganNum = Math.min(5, Math.max(1, (indeksInfraNum + indeksKelembagaanNum) / 2 + (rnd() * 0.6 - 0.3)));
  const dukunganLabel =
    indeksDukunganNum >= 3.5 ? 'sangat mendukung' : indeksDukunganNum >= 2 ? 'mendukung' : indeksDukunganNum >= 1 ? 'netral' : 'kurang mendukung';
  const produksiTon = Math.round(800 + rnd() * 9000);
  const top2 = produkUnggulan.slice(0, 2);
  const lahan1 = Math.round(k.hplHa * 0.18);
  const lahan2 = Math.round(k.hplHa * 0.12);
  const produksi2 = Math.round(produksiTon * 0.35 + rnd() * 500);
  const deskripsiInvestasi =
    `Komoditas unggulan yang dicantumkan adalah ${top2[0].komoditas.toLowerCase()} dan ${top2[1].komoditas.toLowerCase()}. ` +
    `${top2[0].komoditas} menghasilkan produksi sebesar ${produksiTon.toLocaleString('id-ID')} ton per tahun dari luas lahan ${lahan1.toLocaleString('id-ID')} hektare. ` +
    `Sementara itu, ${top2[1].komoditas} mencatatkan produksi sebesar ${produksi2.toLocaleString('id-ID')} ton per tahun dengan luas lahan ${lahan2.toLocaleString('id-ID')} hektare.`;

  return {
    pendudukJiwa: totalJiwa,
    luasHa: k.hplHa,
    dayaTampungKK: Math.max(20, Math.round(k.populasi * 0.028)),
    nilaiIntrans: (k.indeks5t + (rnd() * 4 - 2)).toFixed(2),
    kepadatan: (totalJiwa / k.hplHa).toFixed(2),
    kategoriIntrans: profilBucketIndeks(k.indeks5t),
    produkUnggulan,
    pasar: Math.max(1, Math.round(k.desa / 3)),
    kios: Math.round(k.populasi / 45),
    bumdes: k.desa,
    lembagaLain: Math.round(k.populasi / 220),
    pendapatanPerKapita: 700000 + k.indeks5t * 6200 + Math.round(rnd() * 40000),
    mataPencaharian,
    strukturUsia: { produktif: produktifJiwa, produktifPct, muda: mudaJiwa, mudaPct, tua: tuaJiwa, tuaPct },
    pendidikan: { sd: k.desa + Math.round(rnd() * 3), smp: Math.round(k.desa * 0.6) + 1, sma: Math.round(k.desa * 0.35) + 1 },
    kesehatan: { puskesmas: Math.max(1, k.kecamatan - Math.round(rnd() * 2)), pustu: Math.round(k.desa * 0.85), mandiri: Math.round(rnd() * 3) },
    faskesMissing: FASKES_POOL.slice(0, faskesMissingCount),
    statusDesa: { maju, berkembang, tertinggal },
    dokumen: { rkt: true, rtsp: k.tahap === 'Mandiri' || k.tahap === 'Berkembang', rskp: k.tahap === 'Mandiri' },
    statusLahan: 'HPL',
    konektivitas: k.risiko === 'high' ? 'Belum ada' : 'Internet',
    sertifikasi: { total: bidangTotal, terbit: bidangTerbit, menunggu: bidangMenunggu, pct: Math.round((bidangTerbit / bidangTotal) * 100) },
    indeksInfra: indeksInfraNum.toFixed(2),
    indeksKelembagaan: indeksKelembagaanNum.toFixed(2),
    indeksDukungan: indeksDukunganNum.toFixed(2),
    dukunganLabel,
    produksiTon,
    deskripsiInvestasi
  };
}

/* ---------- Ekonomi & Investasi Kawasan: national wilayah grouping ----------
   "Wilayah Indonesia Bagian Barat/Tengah/Timur" is a standard 3-way regional classification
   (Sumatra+Jawa+Kalimantan Barat / rest of Kalimantan+Sulawesi+Bali-Nusra / Maluku+Papua) — looked
   up by provinsi rather than derived from raw longitude, since a couple of these provinces
   (Kalimantan Tengah especially) sit at a longitude that would otherwise misclassify them. */
export type Wilayah = 'Barat' | 'Tengah' | 'Timur';
const WILAYAH_BY_PROVINSI: { [provinsi: string]: Wilayah } = {
  'Sumatera Selatan': 'Barat', Jambi: 'Barat', Bengkulu: 'Barat', 'Sumatera Barat': 'Barat', Aceh: 'Barat',
  'Kalimantan Barat': 'Barat', 'Kepulauan Bangka Belitung': 'Barat',
  'Sulawesi Tengah': 'Tengah', 'Sulawesi Barat': 'Tengah', 'Sulawesi Selatan': 'Tengah', 'Sulawesi Tenggara': 'Tengah',
  Gorontalo: 'Tengah', 'Kalimantan Utara': 'Tengah', 'Kalimantan Tengah': 'Tengah', 'Kalimantan Selatan': 'Tengah',
  'Kalimantan Timur': 'Tengah', 'Nusa Tenggara Barat': 'Tengah', 'Nusa Tenggara Timur': 'Tengah',
  'Papua Selatan': 'Timur', 'Maluku Utara': 'Timur', Papua: 'Timur', 'Papua Barat Daya': 'Timur'
};
export const WILAYAH_COLOR_HEX: { [key in Wilayah]: string } = { Barat: '#c09546', Tengah: '#8e3b96', Timur: '#6b7a3a' };
export function wilayahOf(k: Kawasan): Wilayah {
  return WILAYAH_BY_PROVINSI[k.provinsi] || 'Tengah';
}
