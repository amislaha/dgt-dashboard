/**
 * Ports geomapping/index.html's data model (search `DEFAULT_CLASSIFICATIONS`, `DEFAULT_FEATURES`,
 * etc.) — see repo-root CLAUDE.md and the source file's own top comment for the PRD this follows.
 * All seeded data is fabricated/illustrative, same as the source.
 */

export type GeometryType = 'Point' | 'LineString' | 'Polygon';

/** Minimal GeoJSON-shaped geometry — matches the source's own `f.geometry` exactly (lon,lat
 *  coordinate order per GeoJSON, not lat,lon). */
export interface GeomappingGeometry {
  type: GeometryType;
  /** Point: [lon,lat]. LineString: [lon,lat][]. Polygon: [[lon,lat][]] (one outer ring, closed). */
  coordinates: any;
}

export interface Classification {
  id: string;
  group?: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
}

export interface Compartment {
  id: string;
  name: string;
  desc: string;
  thumb: string;
  createdAt: string;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ApprovalHistoryEntry {
  action: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RESET';
  by: string;
  at: string;
  note: string;
}

export interface ApprovalRecord {
  status: ApprovalStatus;
  submittedBy: string;
  submittedAt: string;
  reviewer: string | null;
  reviewedAt: string | null;
  note: string;
  history: ApprovalHistoryEntry[];
}

export type FeaturePrivilege = 'PUBLIC' | 'RESTRICTED';

export interface GeomappingFeature {
  id: string;
  classificationId: string;
  compartmentId: string | null;
  title: string;
  description: string;
  address: string;
  images: string[];
  privilege: FeaturePrivilege;
  geometry: GeomappingGeometry;
  /** Structured survey answers keyed by question id — group questions (e.g. "hours", "addr")
   *  nest one level: questionnaire[groupId][itemId]. See QUESTIONNAIRE (Phase 2, not ported yet). */
  questionnaire: { [key: string]: any };
  createdAt: string;
  updatedAt: string;
  approval: ApprovalRecord;
}

export interface Poi {
  id: string;
  name: string;
  kind: string;
  lat: number;
  lng: number;
}

export interface GeomappingTask {
  id: string;
  title: string;
  desc: string;
  done: boolean;
}

export interface ActivityEntry {
  id: string;
  ts: number;
  action: string;
}

export interface BasemapDef {
  key: string;
  name: string;
  group: 'Klikpeta' | 'MapBox';
  url: string;
  options: { [key: string]: any };
}

export interface BoundaryLevel {
  key: string;
  label: string;
  /** The illustrative grid is div×div cells across BND_BBOX — not real administrative polygons. */
  div: number;
  color: string;
  weight: number;
}

/** ---------------- seed data (all fabricated/illustrative, ported verbatim) ---------------- */

export const DEFAULT_CLASSIFICATIONS: Classification[] = [
  { id: 'cls-perusahaan', group: 'Bisnis', name: 'Perusahaan', desc: 'Badan usaha, kantor, pabrik', color: '#33809c', icon: 'building' },
  { id: 'cls-konsumen', group: 'Bisnis', name: 'Konsumen', desc: 'Customer, agen, distributor', color: '#5b8fb0', icon: 'users' },
  { id: 'cls-pasar', name: 'Pasar', desc: 'Pasar rakyat & grosir', color: '#c9974a', icon: 'store' },
  { id: 'cls-ekonomi', name: 'Ekonomi', desc: 'Bank, keuangan, koperasi', color: '#2c755b', icon: 'coins' },
  { id: 'cls-hotel', name: 'Hotel', desc: 'Penginapan & akomodasi', color: '#8e5aa8', icon: 'bed' },
  { id: 'cls-properti', name: 'Properti', desc: 'Perumahan, kavling, gedung', color: '#163b54', icon: 'home' },
  { id: 'cls-otomotif', name: 'Otomotif', desc: 'Bengkel, dealer, SPBU', color: '#b5563f', icon: 'car' },
  { id: 'cls-edukasi', name: 'Edukasi', desc: 'Sekolah, kampus, kursus', color: '#3f7cac', icon: 'book' },
  { id: 'cls-restoran', name: 'Restoran dan Cafe', desc: 'Rumah makan, kafe, kuliner', color: '#cf7b3a', icon: 'utensils' },
  { id: 'cls-pariwisata', name: 'Pariwisata dan Hiburan', desc: 'Wisata, taman, tempat hiburan', color: '#7a9e3b', icon: 'camera' },
  { id: 'cls-kesehatan', name: 'Kesehatan dan Kecantikan', desc: 'Klinik, apotek, salon', color: '#c65b7c', icon: 'heart' },
  { id: 'cls-transportasi', name: 'Transportasi dan Kurir', desc: 'Terminal, ekspedisi, logistik', color: '#4a7f9e', icon: 'route' },
  { id: 'cls-agama', name: 'Agama dan Sosial', desc: 'Rumah ibadah & lembaga sosial', color: '#6a7fb0', icon: 'dome' },
  { id: 'cls-pemerintahan', name: 'Kantor Pemerintahan', desc: 'Instansi & pelayanan publik', color: '#4a5a6a', icon: 'landmark' },
  { id: 'cls-olahraga', name: 'Olahraga', desc: 'Lapangan, GOR, gym', color: '#2f8f6f', icon: 'target' },
  { id: 'cls-utilitas', name: 'Utilitas', desc: 'Air, listrik, telekomunikasi', color: '#c0803a', icon: 'bolt' },
  { id: 'cls-objek-peta', name: 'Objek Peta', desc: 'Objek pemetaan umum lainnya', color: '#7c8a94', icon: 'layers' }
];

export const DEFAULT_COMPARTMENTS: Compartment[] = [
  { id: 'wc-seed-1', name: 'Survei Kawasan SP-2 2026', desc: 'Pendataan batas & fasilitas satuan permukiman SP-2.', thumb: '🏘️', createdAt: '2026-08-28T02:00:00.000Z' },
  { id: 'wc-seed-2', name: 'Inventarisasi Jalan Poros', desc: 'Tracking jaringan jalan penghubung antar-SP.', thumb: '🛣️', createdAt: '2026-08-29T02:00:00.000Z' }
];

export const WC_THUMBS: string[] = ['🏘️', '🛣️', '🌾', '🏥', '🏫', '🕌', '💧', '⚡', '🌉', '🏞️', '📍', '🗺️'];

export const DEFAULT_FEATURES: GeomappingFeature[] = [
  {
    id: 'ft-seed-1', classificationId: 'cls-properti', compartmentId: 'wc-seed-1', title: 'Blok Permukiman Kemang Selatan',
    description: 'Delineasi indikatif blok hunian hasil pemetaan partisipatif warga.',
    address: 'Kemang Selatan, Jakarta Selatan', images: [], privilege: 'PUBLIC',
    geometry: {
      type: 'Polygon', coordinates: [[
        [106.8205, -6.2695], [106.8330, -6.2680], [106.8402, -6.2762],
        [106.8352, -6.2851], [106.8221, -6.2833], [106.8205, -6.2695]
      ]]
    },
    questionnaire: {},
    createdAt: '2026-08-30T04:10:00.000Z', updatedAt: '2026-08-30T04:10:00.000Z',
    approval: {
      status: 'APPROVED', submittedBy: 'surveyor01', submittedAt: '2026-08-30T04:10:00.000Z',
      reviewer: 'koordinator', reviewedAt: '2026-08-31T02:20:00.000Z', note: 'Delineasi sesuai patok lapangan.',
      history: [
        { action: 'APPROVED', by: 'koordinator', at: '2026-08-31T02:20:00.000Z', note: 'Delineasi sesuai patok lapangan.' },
        { action: 'SUBMITTED', by: 'surveyor01', at: '2026-08-30T04:10:00.000Z', note: '' }
      ]
    }
  },
  {
    id: 'ft-seed-2', classificationId: 'cls-transportasi', compartmentId: 'wc-seed-2', title: 'Ruas Jalan Poros SP-2',
    description: 'Segmen jalan penghubung menuju pusat satuan permukiman.',
    address: 'Poros SP-2', images: [], privilege: 'PUBLIC',
    geometry: {
      type: 'LineString', coordinates: [
        [106.8100, -6.3010], [106.8185, -6.2955], [106.8258, -6.2902], [106.8305, -6.2840]
      ]
    },
    questionnaire: {},
    createdAt: '2026-08-30T04:12:00.000Z', updatedAt: '2026-08-30T04:12:00.000Z',
    approval: {
      status: 'PENDING', submittedBy: 'surveyor01', submittedAt: '2026-08-30T04:12:00.000Z',
      reviewer: null, reviewedAt: null, note: '',
      history: [{ action: 'SUBMITTED', by: 'surveyor01', at: '2026-08-30T04:12:00.000Z', note: '' }]
    }
  },
  {
    id: 'ft-seed-3', classificationId: 'cls-kesehatan', compartmentId: 'wc-seed-1', title: 'Puskesmas Kawasan Blok C',
    description: 'Titik layanan kesehatan tingkat kawasan.',
    address: 'Blok C', images: [], privilege: 'RESTRICTED',
    geometry: { type: 'Point', coordinates: [106.8281, -6.2921] },
    questionnaire: {
      owner: 'Dinas Kesehatan Kabupaten',
      hours: { mon: '08:00–14:00', tue: '08:00–14:00', wed: '08:00–14:00', thu: '08:00–14:00', fri: '08:00–11:00', sat: 'Tutup', sun: 'Tutup' },
      phone: '(021) 555-0142',
      founded: '2019-05-02',
      addr: { street: 'Jl. Poros Blok C No. 4', rtrw: '003/002', kel: 'Sukamaju', kec: 'Kawasan Timur', kota: 'Kabupaten Transmigrasi', prov: 'Ilustratif', pos: '16810' }
    },
    createdAt: '2026-08-30T04:14:00.000Z', updatedAt: '2026-08-30T04:14:00.000Z',
    approval: {
      status: 'REJECTED', submittedBy: 'surveyor01', submittedAt: '2026-08-30T04:14:00.000Z',
      reviewer: 'koordinator', reviewedAt: '2026-08-31T03:05:00.000Z', note: 'Koordinat perlu diambil ulang dengan GPS presisi.',
      history: [
        { action: 'REJECTED', by: 'koordinator', at: '2026-08-31T03:05:00.000Z', note: 'Koordinat perlu diambil ulang dengan GPS presisi.' },
        { action: 'SUBMITTED', by: 'surveyor01', at: '2026-08-30T04:14:00.000Z', note: '' }
      ]
    }
  }
];

/** Point of Interest layer (PRD F-4.5/F-4.6) — illustrative. */
export const POIS: Poi[] = [
  { id: 'poi-1', name: 'SDN Kawasan 01', kind: 'Pendidikan', lat: -6.2760, lng: 106.8300 },
  { id: 'poi-2', name: 'Puskesmas Pembantu Blok B', kind: 'Kesehatan', lat: -6.2900, lng: 106.8220 },
  { id: 'poi-3', name: 'Pasar Kawasan', kind: 'Ekonomi', lat: -6.2830, lng: 106.8400 },
  { id: 'poi-4', name: 'Kantor Desa SP-2', kind: 'Pemerintahan', lat: -6.2980, lng: 106.8150 },
  { id: 'poi-5', name: 'Masjid Jami Kawasan', kind: 'Peribadatan', lat: -6.2720, lng: 106.8180 },
  { id: 'poi-6', name: 'Balai Pertemuan Warga', kind: 'Fasilitas Umum', lat: -6.2880, lng: 106.8350 },
  { id: 'poi-7', name: 'Sumur Bor Komunal', kind: 'Air Bersih', lat: -6.3010, lng: 106.8280 },
  { id: 'poi-8', name: 'Gudang Logistik', kind: 'Infrastruktur', lat: -6.2670, lng: 106.8260 }
];

export const DEFAULT_TASKS: GeomappingTask[] = [
  { id: 'tsk-1', title: 'Verifikasi batas Blok Permukiman Kemang Selatan', desc: 'Cek delineasi poligon terhadap patok lapangan.', done: false },
  { id: 'tsk-2', title: 'Rekam titik fasilitas kesehatan SP-2', desc: 'Tracking Point Puskesmas Pembantu + isi General Info & Questionnaire.', done: false },
  { id: 'tsk-3', title: 'Tracking ruas jalan poros SP-2 s/d SP-3', desc: 'Tracking Line mengikuti as jalan, lampirkan foto perkerasan.', done: true },
  { id: 'tsk-4', title: 'Pendataan POI pasar kawasan', desc: 'Ambil My Location di pintu utama pasar, lalu rekam titik.', done: false }
];

/** Base maps (PRD F-3.1: 7 opsi). The Klikpeta/MapBox names are the PRD's; the tiles are KEYLESS
 *  stand-ins (OSM / OpenTopoMap / Esri / CARTO) because the real providers need API keys (PRD §8,
 *  out of front-end scope). */
export const BASEMAPS: { [key: string]: BasemapDef } = {
  kp_street: {
    key: 'kp_street', name: 'Klikpeta Street3', group: 'Klikpeta', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }
  },
  kp_topo: {
    key: 'kp_topo', name: 'Klikpeta Topografi', group: 'Klikpeta', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    options: { maxZoom: 17, subdomains: 'abc', attribution: '&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap (CC-BY-SA)' }
  },
  kp_gray: {
    key: 'kp_gray', name: 'Klikpeta Gray Scale', group: 'Klikpeta', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 16, attribution: 'Tiles &copy; Esri' }
  },
  mb_street: {
    key: 'mb_street', name: 'MapBox Street', group: 'MapBox', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 20, subdomains: 'abcd', attribution: '&copy; OpenStreetMap contributors &copy; CARTO' }
  },
  mb_sat: {
    key: 'mb_sat', name: 'MapBox Satellite', group: 'MapBox', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: { maxZoom: 19, attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics' }
  },
  mb_light: {
    key: 'mb_light', name: 'MapBox Light', group: 'MapBox', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 20, subdomains: 'abcd', attribution: '&copy; OpenStreetMap contributors &copy; CARTO' }
  },
  mb_dark: {
    key: 'mb_dark', name: 'MapBox Dark', group: 'MapBox', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: { maxZoom: 20, subdomains: 'abcd', attribution: '&copy; OpenStreetMap contributors &copy; CARTO' }
  }
};
export const DEFAULT_BASEMAP = 'kp_street';

/** Illustrative administrative-boundary overlay (PRD F-3.3) — a fabricated nested grid around the
 *  Jakarta seed area, NOT real BPS/Dukcapil polygons. */
export const BND_BBOX = { s: -6.400, n: -6.160, w: 106.700, e: 106.960 };
export const BND_LEVELS: BoundaryLevel[] = [
  { key: 'provinsi', label: 'Provinsi', div: 1, color: '#163b54', weight: 2.4 },
  { key: 'kota', label: 'Kota / Kabupaten', div: 2, color: '#33809c', weight: 2 },
  { key: 'kecamatan', label: 'Kecamatan', div: 4, color: '#c9974a', weight: 1.6 },
  { key: 'kelurahan', label: 'Kelurahan / Desa', div: 8, color: '#2c755b', weight: 1.2 }
];

export const APPROVAL_META: { [key in ApprovalStatus]: { label: string; color: string } } = {
  PENDING: { label: 'Menunggu', color: 'var(--warn)' },
  APPROVED: { label: 'Disetujui', color: 'var(--good)' },
  REJECTED: { label: 'Ditolak', color: 'var(--critical)' }
};
