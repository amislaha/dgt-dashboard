import { FieldConfig } from '../models/field-config.model';
import { WilayahChildConfig, WilayahChildKey, WilayahChildRecord } from '../models/wilayah-child.model';

/**
 * Tabs of the Wilayah editor after "Umum", one per per-kawasan record list (ERD wilayah_category_mapping,
 * wilayah_hpl, wilayah_shm, wilayah_kk, wilayah_profil, produk_unggulan, wilayah_psu, iku_result,
 * recommendation, wilayah_target). Each tab is a table; a row opens a detail page with these `fields`.
 */

export const HPL_STATUS = ['Menunggu', 'Diproses', 'Terbit'];

const num = (value: any, digits = 1): string =>
  value == null || value === '' ? '—' : Number(value).toLocaleString('id-ID', { maximumFractionDigits: digits });

const distinct = (rows: WilayahChildRecord[], key: string): number => new Set(rows.map(row => row[key]).filter(v => v != null && v !== '')).size;

/** "3 sertifikat · 1.240 ha" — empty parts dropped. */
const parts = (...items: Array<string | false>): string => items.filter(Boolean).join(' · ');

const sum = (rows: WilayahChildRecord[], key: string): number => rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);

const dateLabel = (value: string | undefined): string => {
  if (!value) {
    return '—';
  }
  const d = new Date(value + 'T00:00:00');
  return isNaN(d.getTime()) ? value : d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const yearOf = (value: string | undefined): string => (value ? value.slice(0, 4) : '');

const rupiah = (value: any): string => (value == null || value === '' ? '—' : 'Rp ' + Number(value).toLocaleString('id-ID'));

const newestFirst = (a: WilayahChildRecord, b: WilayahChildRecord): number => String(b.reportingDate || '').localeCompare(String(a.reportingDate || ''));

const REPORTING_DATE: FieldConfig = { name: 'reportingDate', label: 'Tanggal pelaporan', type: 'date' };
const GEOMETRY: FieldConfig = { name: 'geometry', label: 'Geometri', type: 'geometry' };
const COLOR: FieldConfig = { name: 'color', label: 'Warna di peta', type: 'color', defaultValue: '#b2293d' };

const certificate = (key: 'hpl' | 'shm', noun: string, heading: string, withStatus: boolean): WilayahChildConfig => ({
  key,
  tab: noun,
  noun,
  heading,
  summary: rows => {
    const terbit = rows.filter(row => row.status === 'Terbit').length;
    return parts(`${rows.length} sertifikat`, rows.length > 0 && `${num(sum(rows, 'luas'))} ha`, withStatus && rows.length > 0 && `${terbit} terbit`);
  },
  title: row => row.nomor || '(tanpa nomor)',
  mono: true,
  colorField: 'color',
  statusField: withStatus ? 'status' : undefined,
  sort: newestFirst,
  columns: [
    { label: 'Nomor', primary: true, value: row => row.nomor || '—' },
    { label: 'Luas', numeric: true, value: row => (row.luas != null ? `${num(row.luas)} ha` : '—') },
    { label: 'Tgl pelaporan', muted: true, value: row => dateLabel(row.reportingDate) },
    ...(withStatus ? [{ label: 'Status', status: true, value: (row: WilayahChildRecord) => row.status || '—' }] : [])
  ],
  fields: [
    { name: 'nomor', label: 'Nomor sertifikat', type: 'text', required: true, mono: true, placeholder: key === 'hpl' ? '01/HPL/MRK/2019' : '01/SHM/MRK/2019', row: 'a' },
    { ...REPORTING_DATE, row: 'a' },
    { name: 'luas', label: 'Luas (ha)', type: 'number', min: 0, step: 0.01, areaFrom: 'geometry', row: withStatus ? 'b' : undefined },
    ...(withStatus ? [{ name: 'status', label: 'Status', type: 'select', options: HPL_STATUS, defaultValue: 'Menunggu', row: 'b' } as FieldConfig] : []),
    GEOMETRY,
    COLOR
  ]
});

export const WILAYAH_CHILD_CONFIGS: WilayahChildConfig[] = [
  {
    key: 'kategori',
    tab: 'Kategori',
    noun: 'kategori',
    heading: 'Kategori kawasan',
    summary: rows => `${rows.length} kategori`,
    title: (row, r) => r.name('wilayahCategory', row.categoryId),
    columns: [{ label: 'Kategori', primary: true, value: (row, r) => r.name('wilayahCategory', row.categoryId) }],
    fields: [{ name: 'categoryId', label: 'Kategori', type: 'fk', fkEntity: 'wilayahCategory', required: true }]
  },
  certificate('hpl', 'HPL', 'Hak pengelolaan lahan', true),
  certificate('shm', 'SHM', 'Sertifikat hak milik', false),
  {
    key: 'kk',
    tab: 'KK',
    noun: 'KK',
    heading: 'Kepala keluarga',
    summary: rows => parts(`${rows.length} KK`, rows.length > 0 && `${num(sum(rows, 'population'), 0)} jiwa`),
    title: row => row.nomor || '(tanpa nomor)',
    subtitle: (row, r) => {
      const shm = r.child('shm', row.shmId);
      return shm ? `SHM ${shm.nomor}` : '';
    },
    mono: true,
    sort: newestFirst,
    columns: [
      { label: 'Nomor KK', primary: true, value: row => row.nomor || '—' },
      { label: 'SHM', muted: true, value: (row, r) => (r.child('shm', row.shmId) || { nomor: '—' }).nomor },
      { label: 'Jiwa', numeric: true, value: row => num(row.population, 0) },
      { label: 'Tgl pelaporan', muted: true, value: row => dateLabel(row.reportingDate) }
    ],
    fields: [
      { name: 'nomor', label: 'Nomor KK', type: 'text', required: true, mono: true, row: 'a' },
      { ...REPORTING_DATE, row: 'a' },
      { name: 'shmId', label: 'SHM', type: 'select', placeholder: 'Pilih SHM', hint: 'Daftar SHM kawasan ini (tab SHM).', row: 'b' },
      { name: 'population', label: 'Jumlah jiwa', type: 'number', min: 0, step: 1, row: 'b' }
    ]
  },
  {
    key: 'profil',
    tab: 'Profil',
    noun: 'profil',
    heading: 'Profil kawasan',
    summary: rows => parts(`${rows.length} indikator`, distinct(rows, 'profilGroupId') > 0 && `${distinct(rows, 'profilGroupId')} grup`),
    title: row => row.name || '(tanpa nama)',
    subtitle: (row, r) => [r.name('profilGroup', row.profilGroupId), yearOf(row.reportingDate)].filter(Boolean).join(' · '),
    year: row => yearOf(row.reportingDate),
    sort: newestFirst,
    columns: [
      { label: 'Kode', muted: true, value: row => row.code || '—' },
      { label: 'Indikator', primary: true, value: row => row.name || '—', secondary: (row, r) => r.name('profilGroup', row.profilGroupId) },
      {
        label: 'Nilai',
        numeric: true,
        value: row => {
          const unit = row.measure ? ` ${row.measure}` : '';
          switch (row.valueType) {
            case 'TEXT':
              return row.valueText || '—';
            case 'DATE':
              return dateLabel(row.valueDate);
            case 'BOOLEAN':
              return row.valueBoolean ? 'Ya' : 'Tidak';
            default:
              return row.valueNumeric != null ? num(row.valueNumeric, 2) + unit : '—';
          }
        }
      },
      { label: 'Tgl pelaporan', muted: true, value: row => dateLabel(row.reportingDate) }
    ],
    fields: [
      { name: 'profilGroupId', label: 'Grup profil', type: 'fk', fkEntity: 'profilGroup', row: 'a' },
      { ...REPORTING_DATE, row: 'a' },
      { name: 'code', label: 'Kode', type: 'text', mono: true, row: 'b' },
      { name: 'name', label: 'Nama indikator', type: 'text', required: true, row: 'b' },
      { name: 'description', label: 'Deskripsi', type: 'textarea' },
      { name: 'unit', label: 'Unit', type: 'text', row: 'c' },
      { name: 'measure', label: 'Satuan ukur', type: 'text', placeholder: 'Jiwa, ha, %', row: 'c' },
      { name: 'valueType', label: 'Tipe nilai', type: 'select', required: true, defaultValue: 'NUMERIC', choices: [
        { value: 'NUMERIC', label: 'Angka' },
        { value: 'TEXT', label: 'Teks' },
        { value: 'DATE', label: 'Tanggal' },
        { value: 'BOOLEAN', label: 'Ya/Tidak' }
      ], row: 'd' },
      { name: 'valueNumeric', label: 'Nilai', type: 'number', step: 0.01, showWhen: { field: 'valueType', equals: ['NUMERIC'] }, row: 'd' },
      { name: 'valueText', label: 'Nilai', type: 'text', showWhen: { field: 'valueType', equals: ['TEXT'] }, row: 'd' },
      { name: 'valueDate', label: 'Nilai', type: 'date', showWhen: { field: 'valueType', equals: ['DATE'] }, row: 'd' },
      { name: 'valueBoolean', label: 'Ya', type: 'boolean', showWhen: { field: 'valueType', equals: ['BOOLEAN'] }, row: 'd' }
    ]
  },
  {
    key: 'produk',
    tab: 'Produk',
    noun: 'produk',
    heading: 'Produk unggulan',
    summary: rows => `${rows.length} komoditas`,
    title: (row, r) => r.name('komoditi', row.komoditiId),
    subtitle: row => [row.sektor, yearOf(row.reportingDate)].filter(Boolean).join(' · '),
    year: row => yearOf(row.reportingDate),
    sort: newestFirst,
    columns: [
      { label: 'Tahun', muted: true, value: row => yearOf(row.reportingDate) || '—' },
      { label: 'Komoditas', primary: true, value: (row, r) => r.name('komoditi', row.komoditiId), secondary: row => row.sektor || '' },
      { label: 'Luas', numeric: true, value: row => (row.areaSize != null ? `${num(row.areaSize)} ${row.areaUnit || ''}`.trim() : '—') },
      { label: 'Produksi', numeric: true, value: row => (row.value != null ? `${num(row.value)} ${row.valueUnit || ''}`.trim() : '—') }
    ],
    fields: [
      { name: 'komoditiId', label: 'Komoditas', type: 'fk', fkEntity: 'komoditi', required: true, row: 'a' },
      { ...REPORTING_DATE, row: 'a' },
      { name: 'areaSize', label: 'Luas lahan', type: 'number', min: 0, step: 0.01, unit: { name: 'areaUnit', options: ['ha', 'm²'] }, row: 'b' },
      { name: 'value', label: 'Produksi', type: 'number', min: 0, step: 0.01, unit: { name: 'valueUnit', options: ['kg', 'ton', 'ekor', 'liter'] }, row: 'b' },
      { name: 'periode', label: 'Periode produksi', type: 'select', defaultValue: 'Per tahun', options: ['Per tahun', 'Per musim', 'Per bulan'], row: 'c' },
      { name: 'sektor', label: 'Sektor', type: 'select', options: ['Pertanian', 'Perkebunan', 'Peternakan', 'Perikanan', 'Kehutanan', 'Pertambangan'], row: 'c' }
    ]
  },
  {
    key: 'psu',
    tab: 'PSU',
    noun: 'PSU',
    heading: 'Prasarana, sarana & utilitas',
    summary: rows => parts(`${rows.length} PSU`, rows.length > 0 && `anggaran ${rupiah(sum(rows, 'anggaran'))}`),
    title: row => row.name || '(tanpa nama)',
    subtitle: row => [row.psuType, yearOf(row.reportingDate)].filter(Boolean).join(' · '),
    colorField: 'color',
    sort: newestFirst,
    columns: [
      { label: 'Nama', primary: true, value: row => row.name || '—', secondary: row => row.psuType || '' },
      { label: 'Anggaran', numeric: true, value: row => rupiah(row.anggaran) },
      { label: 'Pelaksana', muted: true, value: row => row.vendorName || '—' },
      { label: 'Selesai', muted: true, value: row => dateLabel(row.finishDate) }
    ],
    fields: [
      { name: 'psuType', label: 'Tipe PSU', type: 'select', required: true, options: ['Jalan', 'Jembatan', 'Air bersih', 'Listrik', 'Drainase', 'Fasilitas umum', 'Lainnya'], row: 'a' },
      { ...REPORTING_DATE, row: 'a' },
      { name: 'name', label: 'Nama', type: 'text', required: true, placeholder: 'Jalan poros SP 1' },
      { name: 'description', label: 'Deskripsi', type: 'textarea' },
      { name: 'anggaran', label: 'Anggaran (Rp)', type: 'number', min: 0, step: 1, row: 'b' },
      { name: 'vendorName', label: 'Pelaksana', type: 'text', placeholder: 'PT. Bangun Abadi', row: 'b' },
      { name: 'startDate', label: 'Tanggal mulai', type: 'date', row: 'c' },
      { name: 'finishDate', label: 'Tanggal selesai', type: 'date', row: 'c' },
      GEOMETRY,
      COLOR
    ]
  },
  {
    key: 'iku',
    tab: 'IKU',
    noun: 'IKU',
    heading: 'Indikator kinerja utama',
    summary: rows => {
      const scored = rows.filter(row => row.achievementPercentage != null && row.achievementPercentage !== '');
      return parts(`${rows.length} indikator`, scored.length > 0 && `rata-rata capaian ${num(sum(scored, 'achievementPercentage') / scored.length)}%`);
    },
    title: (row, r) => r.name('ikuDefinition', row.ikuDefinitionId),
    subtitle: row => yearOf(row.reportingDate),
    year: row => yearOf(row.reportingDate),
    sort: newestFirst,
    columns: [
      { label: 'Indikator', primary: true, value: (row, r) => r.name('ikuDefinition', row.ikuDefinitionId) },
      { label: 'Target', numeric: true, value: row => num(row.targetValue, 2) },
      { label: 'Realisasi', numeric: true, value: row => num(row.actualValueNumeric, 2) },
      { label: 'Capaian', numeric: true, value: row => (row.achievementPercentage != null ? `${num(row.achievementPercentage)}%` : '—') }
    ],
    fields: [
      { name: 'ikuDefinitionId', label: 'Definisi IKU', type: 'select', required: true, placeholder: 'Pilih IKU', hint: 'Dari menu Data Master → IKU Definition.' },
      { ...REPORTING_DATE, row: 'a' },
      { name: 'targetValue', label: 'Target', type: 'number', step: 0.01, row: 'a' },
      { name: 'actualValueNumeric', label: 'Realisasi', type: 'number', step: 0.01, row: 'b' },
      { name: 'achievementPercentage', label: 'Capaian (%)', type: 'number', min: 0, step: 0.01, row: 'b' }
    ]
  },
  {
    key: 'rekomendasi',
    tab: 'Rekomendasi',
    noun: 'rekomendasi',
    heading: 'Rekomendasi',
    summary: rows => parts(`${rows.length} rekomendasi`, distinct(rows, 'recommendationCategoryId') > 0 && `${distinct(rows, 'recommendationCategoryId')} kategori`),
    title: (row, r) => r.name('recommendationCategory', row.recommendationCategoryId),
    subtitle: row => String(row.referenceYear || ''),
    year: row => String(row.referenceYear || ''),
    sort: (a, b) => (Number(b.referenceYear) || 0) - (Number(a.referenceYear) || 0) || (Number(a.sequence) || 0) - (Number(b.sequence) || 0),
    columns: [
      { label: 'No', muted: true, value: row => (row.sequence != null ? String(row.sequence) : '—') },
      { label: 'Rekomendasi', primary: true, value: row => truncate(row.content, 80), secondary: (row, r) => r.name('recommendationCategory', row.recommendationCategoryId) },
      { label: 'Tahun', numeric: true, value: row => String(row.referenceYear || '—') }
    ],
    fields: [
      { name: 'recommendationCategoryId', label: 'Kategori rekomendasi', type: 'fk', fkEntity: 'recommendationCategory', required: true },
      { name: 'referenceYear', label: 'Tahun acuan', type: 'number', min: 2000, step: 1, defaultValue: new Date().getFullYear(), row: 'a' },
      { name: 'sequence', label: 'Urutan', type: 'number', min: 1, step: 1, row: 'a' },
      { name: 'content', label: 'Isi rekomendasi', type: 'textarea', required: true }
    ]
  },
  {
    key: 'target',
    tab: 'Target',
    noun: 'target',
    heading: 'Target & anggaran',
    entity: 'wilayahTarget',
    summary: rows => parts(`${rows.length} target`, rows.length > 0 && `anggaran ${rupiah(sum(rows, 'budgetTarget'))}`),
    title: row => row.targetType || '(tanpa tipe)',
    subtitle: row => String(row.targetYear || ''),
    year: row => String(row.targetYear || ''),
    sort: (a, b) => (Number(b.targetYear) || 0) - (Number(a.targetYear) || 0),
    columns: [
      { label: 'Tahun', muted: true, value: row => String(row.targetYear || '—') },
      { label: 'Target', primary: true, value: row => row.targetType || '—' },
      { label: 'Nilai', numeric: true, value: row => (row.targetValue != null ? `${num(row.targetValue, 2)} ${row.unit || ''}`.trim() : '—') },
      { label: 'Realisasi anggaran', numeric: true, value: row => (row.budgetPercentage != null ? `${num(row.budgetPercentage)}%` : '—') }
    ],
    fields: [
      { name: 'targetType', label: 'Tipe target', type: 'select', required: true, options: ['HPL', 'SHM', 'KK', 'PSU', 'Produk', 'IKU', 'Lainnya'], row: 'a' },
      { name: 'targetYear', label: 'Tahun target', type: 'number', min: 2000, step: 1, defaultValue: new Date().getFullYear(), row: 'a' },
      { name: 'targetValue', label: 'Nilai target', type: 'number', step: 0.01, row: 'b' },
      { name: 'unit', label: 'Satuan', type: 'text', placeholder: 'Jiwa, ha, unit', row: 'b' },
      { name: 'budgetTarget', label: 'Target anggaran (Rp)', type: 'number', min: 0, step: 1, row: 'c' },
      { name: 'budgetRealization', label: 'Realisasi anggaran (Rp)', type: 'number', min: 0, step: 1, row: 'c' },
      { name: 'budgetPercentage', label: 'Persentase realisasi (%)', type: 'number', min: 0, step: 0.01, hint: 'Dihitung otomatis dari target dan realisasi bila dikosongkan.' }
    ]
  }
];

export const WILAYAH_CHILD_CONFIG_MAP: { [key in WilayahChildKey]: WilayahChildConfig } = WILAYAH_CHILD_CONFIGS.reduce(
  (map, config) => ({ ...map, [config.key]: config }),
  {} as { [key in WilayahChildKey]: WilayahChildConfig }
);

function truncate(value: string | undefined, max: number): string {
  if (!value) {
    return '—';
  }
  return value.length > max ? value.slice(0, max - 1) + '…' : value;
}
