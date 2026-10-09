import { EntityColumnConfig, EntityConfig } from '../models/entity-config.model';
import { EntityKey } from '../models/entity-key.model';
import {
  ApplicationSetting, ApprovalFlow, IkuDefinition, IkuNko, IkuStatus, ProdukJenis, ProfilCategory, ProfilGroup, ProfilMeasure,
  Project, RecommendationCategory, SatkerType, StrategicTarget, WilayahCategory, WilayahStatus, WilayahTarget
} from '../models/erd-master.model';
import { FieldConfig } from '../models/field-config.model';
import { Iku } from '../models/iku.model';
import { Komoditi } from '../models/komoditi.model';
import { Personel } from '../models/personel.model';
import { Program } from '../models/program.model';
import { Satker } from '../models/satker.model';
import { Skp } from '../models/skp.model';
import { Sp } from '../models/sp.model';
import { Wpt } from '../models/wpt.model';

/**
 * Direct port of the original `ENTITIES` config object (data-manager/index.html
 * lines ~438-568) plus `ENTITY_ICONS`. Every `columns`/`fields` entry mirrors
 * the source field-for-field, with `fk`-typed fields switched from a free-text
 * autocomplete to a real id reference (see PORT_NOTES.md "FK fix").
 *
 * `EntityListComponent`/`EntityFormComponent` are driven entirely by these
 * configs plus `EntityRegistryService` — there is one generic component pair
 * for all 8 entities, not 8 hand-written ones.
 */

/** Shared ERD field builders (used by the ERD-backed masters further down and by the older entities that gained ERD columns). */
const CODE_FIELD = (required: boolean): FieldConfig<any> => ({ name: 'code', label: 'Kode', type: 'text', required, row: 'ck' });
const SEQUENCE_FIELD: FieldConfig<any> = { name: 'sequence', label: 'Urutan (sequence)', type: 'number', required: false, min: 0, step: 1, row: 'ck' };
const DESCRIPTION_FIELD: FieldConfig<any> = { name: 'description', label: 'Deskripsi', type: 'textarea', required: false };
const ACTIVE_FIELD: FieldConfig<any> = { name: 'active', label: 'Aktif', type: 'boolean', defaultValue: true };
const DECIMAL = (name: string, label: string, extra: Partial<FieldConfig<any>> = {}): FieldConfig<any> => ({ name, label, type: 'number', required: false, step: 0.01, ...extra });

const WPT_CONFIG: EntityConfig<Wpt> = {
  key: 'wpt',
  label: 'Wilayah',
  sub: '',
  idPrefix: 'wpt',
  titleField: 'nama',
  headerField: 'kawasan',
  columns: [
    { key: 'nama', label: 'Nama KT', sortable: true },
    { key: 'kawasan', label: 'Kawasan', sortable: true },
    { key: 'provinsi', label: 'Provinsi', sortable: true },
    { key: 'kabupaten', label: 'Kabupaten/Kota', sortable: true }
  ],
  fields: [
    { name: 'nama', label: 'Nama KT', type: 'text', required: true, placeholder: 'cth. LUNANG SILAUT', section: 'Identitas' },
    { name: 'kawasan', label: 'Nama kawasan', type: 'text', required: false, hint: 'Nama singkat sesuai Matriks 45 Kawasan. Boleh berbeda dari Nama KT.' },
    { name: 'wilayahType', label: 'Tipe wilayah', type: 'select', required: false, options: ['Kawasan Transmigrasi'], row: 'id' },
    { name: 'dasarPenetapan', label: 'Dasar penetapan', type: 'text', required: false, placeholder: 'Contoh: Kepmen No. 12/2019', row: 'id' },
    { name: 'geometry', label: 'Gambar di Peta', type: 'geometry', required: false, section: 'Lokasi & Peta', hint: 'Panel akan menyingkir saat Anda menggambar di peta, lalu kembali dengan bentuknya terisi.' },
    DECIMAL('lat', 'Latitude', { row: 'geo', step: 0.000001 }),
    DECIMAL('lon', 'Longitude', { row: 'geo', step: 0.000001 }),
    { name: 'geo', label: 'Koordinat/Geo (opsional, teks bebas dari ERD)', type: 'text', required: false, hint: 'Kolom ini ada di ERD sumber tapi belum berisi data pada baris manapun.' },
    { name: 'address', label: 'Alamat', type: 'textarea', required: false, section: 'Administratif' },
    { name: 'provinsi', label: 'Provinsi', type: 'text', required: true, row: 'adm1' },
    { name: 'kodeProp', label: 'Kode Provinsi', type: 'text', required: false, row: 'adm1' },
    { name: 'kabupaten', label: 'Kabupaten/Kota', type: 'text', required: true, row: 'adm2' },
    { name: 'kodeKab', label: 'Kode Kabupaten', type: 'text', required: false, row: 'adm2' },
    { name: 'kecamatan', label: 'Kecamatan', type: 'text', required: false, row: 'adm3' },
    { name: 'kodeKec', label: 'Kode Kecamatan', type: 'text', required: false, row: 'adm3' },
    { name: 'kelurahan', label: 'Kelurahan/Desa', type: 'text', required: false, row: 'adm4' },
    { name: 'kodeKel', label: 'Kode Kelurahan', type: 'text', required: false, row: 'adm4' },
    { name: 'wilayahStatusId', label: 'Wilayah Status', type: 'fk', required: false, fkEntity: 'wilayahStatus', section: 'Status & Kapasitas', row: 'cls' },
    { name: 'wilayahCategoryId', label: 'Wilayah Category', type: 'fk', required: false, fkEntity: 'wilayahCategory', row: 'cls', hint: 'ERD memakai tabel pemetaan (banyak kategori); di sini satu kategori.' },
    { name: 'k1', label: 'K1', type: 'boolean', row: 'k' },
    { name: 'k2', label: 'K2', type: 'boolean', row: 'k' },
    { name: 'k3', label: 'K3', type: 'boolean', row: 'k' },
    { name: 'kapasitasMaksimum', label: 'Kapasitas Maksimum', type: 'number', required: false, min: 0, step: 1, row: 'cap' },
    { name: 'kkTotal', label: 'Total KK', type: 'number', required: false, min: 0, step: 1, row: 'cap' },
    { name: 'hplTotal', label: 'HPL Total', type: 'number', required: false, min: 0, step: 1, section: 'Legalitas Lahan', row: 'hpl1' },
    { name: 'hplTerbit', label: 'HPL Terbit', type: 'number', required: false, min: 0, step: 1, row: 'hpl1' },
    { name: 'hplBelumTerbit', label: 'HPL Belum Terbit', type: 'number', required: false, min: 0, step: 1, row: 'hpl2' },
    DECIMAL('hplPersentase', 'HPL Persentase (%)', { row: 'hpl2' }),
    { name: 'shmTotal', label: 'SHM Total', type: 'number', required: false, min: 0, step: 1, row: 'shm1' },
    { name: 'shmTerbit', label: 'SHM Terbit', type: 'number', required: false, min: 0, step: 1, row: 'shm1' },
    { name: 'shmBelumTerbit', label: 'SHM Belum Terbit', type: 'number', required: false, min: 0, step: 1, row: 'shm2' },
    DECIMAL('shmPersentase', 'SHM Persentase (%)', { row: 'shm2' }),
    DECIMAL('luasHplHa', 'Luas HPL (ha)', { min: 0, row: 'luasleg' }),
    DECIMAL('luasShmHa', 'Luas SHM (ha)', { min: 0, row: 'luasleg' }),
    { name: 'programId', label: 'Program (Jenis Transmigrasi)', type: 'fk', required: false, fkEntity: 'program', section: 'Program & Kawasan', row: 'prog' },
    { name: 'satkerId', label: 'Satker Penanggung Jawab', type: 'fk', required: false, fkEntity: 'satker', row: 'prog' },
    { name: 'tanggalPenetapan', label: 'Tanggal Penetapan', type: 'date', required: false, row: 'tp' },
    { name: 'tahunPenetapan', label: 'Tahun Penetapan', type: 'number', required: false, min: 1900, step: 1, row: 'tp' },
    DECIMAL('luasKawasanHa', 'Luas Kawasan (ha)', { min: 0, row: 'luas' }),
    DECIMAL('luasLahanSiapHa', 'Luas Lahan Siap (ha)', { min: 0, row: 'luas' }),
    { name: 'jumlahPenduduk', label: 'Jumlah Penduduk', type: 'number', required: false, min: 0, step: 1, row: 'pop' },
    { name: 'jumlahDesa', label: 'Jumlah Desa/SP', type: 'number', required: false, min: 0, step: 1, row: 'pop' },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea', required: false },
    { name: 'jumlahKecamatan', label: 'Jumlah Kecamatan/Distrik', type: 'number', required: false, min: 0, step: 1, section: 'Demografi', row: 'dm1' },
    { name: 'pendapatanPerKapita', label: 'Pendapatan per Kapita (Rp/bulan)', type: 'number', required: false, min: 0, step: 1, row: 'dm1' },
    { name: 'usiaProduktif', label: 'Penduduk Usia Produktif (15-65 tahun)', type: 'number', required: false, min: 0, step: 1, row: 'dm2' },
    { name: 'usiaMuda', label: 'Penduduk Usia < 15 tahun', type: 'number', required: false, min: 0, step: 1, row: 'dm2' },
    { name: 'usiaTua', label: 'Penduduk Usia > 65 tahun', type: 'number', required: false, min: 0, step: 1, row: 'dm3' },
    { name: 'pasar', label: 'Jumlah Pasar', type: 'number', required: false, min: 0, step: 1, section: 'Ekonomi', row: 'e1' },
    { name: 'kios', label: 'Jumlah Kios', type: 'number', required: false, min: 0, step: 1, row: 'e1' },
    { name: 'bumdes', label: 'Jumlah Bumdes', type: 'number', required: false, min: 0, step: 1, row: 'e2' },
    { name: 'lembagaEkonomiLain', label: 'Jumlah Lembaga Ekonomi Lain', type: 'number', required: false, min: 0, step: 1, row: 'e2' },
    DECIMAL('kontribusiPdrbPct', 'Kontribusi Sektor PDRB ke Kabupaten (%)', { min: 0, row: 'e3' }),
    DECIMAL('nilaiSektorPertanianT', 'Nilai Sektor Pertanian, Kehutanan & Perikanan (Rp T)', { min: 0, row: 'e3' }),
    { name: 'unitUsahaPerorangan', label: 'Unit Usaha Perorangan (SP 2023)', type: 'number', required: false, min: 0, step: 1, row: 'e4' },
    DECIMAL('prodPertanian', 'Produktivitas Pertanian (t/Ha)', { min: 0, row: 'e5' }),
    DECIMAL('prodPerkebunan', 'Produktivitas Perkebunan (t/Ha)', { min: 0, row: 'e5' }),
    DECIMAL('prodPangan', 'Produktivitas Pangan (t/Ha)', { min: 0, row: 'e6' }),
    DECIMAL('prodPerikanan', 'Produktivitas Perikanan (t/Ha)', { min: 0, row: 'e6' }),
    DECIMAL('prodKehutanan', 'Produktivitas Kehutanan (t/Ha)', { min: 0, row: 'e7' }),
    { name: 'mataPencaharian1Jenis', label: 'Mata Pencaharian 1 - Jenis', type: 'text', required: false, row: 'mp1' },
    { name: 'mataPencaharian1Jumlah', label: 'Mata Pencaharian 1 - Jumlah (orang)', type: 'number', required: false, min: 0, step: 1, row: 'mp1' },
    { name: 'mataPencaharian2Jenis', label: 'Mata Pencaharian 2 - Jenis', type: 'text', required: false, row: 'mp2' },
    { name: 'mataPencaharian2Jumlah', label: 'Mata Pencaharian 2 - Jumlah (orang)', type: 'number', required: false, min: 0, step: 1, row: 'mp2' },
    { name: 'mataPencaharian3Jenis', label: 'Mata Pencaharian 3 - Jenis', type: 'text', required: false, row: 'mp3' },
    { name: 'mataPencaharian3Jumlah', label: 'Mata Pencaharian 3 - Jumlah (orang)', type: 'number', required: false, min: 0, step: 1, row: 'mp3' },
    { name: 'pendidikanSd', label: 'Jumlah SD', type: 'number', required: false, min: 0, step: 1, section: 'Sosial', row: 's1' },
    { name: 'pendidikanSmp', label: 'Jumlah SMP/setara', type: 'number', required: false, min: 0, step: 1, row: 's1' },
    { name: 'pendidikanSma', label: 'Jumlah SMA/setara', type: 'number', required: false, min: 0, step: 1, row: 's2' },
    { name: 'puskesmas', label: 'Jumlah Puskesmas', type: 'number', required: false, min: 0, step: 1, row: 's2' },
    { name: 'pustu', label: 'Jumlah Pustu', type: 'number', required: false, min: 0, step: 1, row: 's3' },
    { name: 'faskesMandiri', label: 'Jumlah Fasilitas Kesehatan Mandiri', type: 'number', required: false, min: 0, step: 1, row: 's3' },
    { name: 'faskesBelumTersedia', label: 'Fasilitas Kesehatan yang Belum Tersedia', type: 'text', required: false, hint: 'Daftar jenis fasilitas, dipisah koma (cth. Rumah Sakit, Posyandu).' },
    { name: 'desaMaju', label: 'Jumlah Desa Maju (IDM)', type: 'number', required: false, min: 0, step: 1, row: 's4' },
    { name: 'desaBerkembang', label: 'Jumlah Desa Berkembang (IDM)', type: 'number', required: false, min: 0, step: 1, row: 's4' },
    { name: 'desaTertinggal', label: 'Jumlah Desa Tertinggal (IDM)', type: 'number', required: false, min: 0, step: 1, row: 's5' },
    { name: 'dokumenRkt', label: 'Dokumen RKT tersedia', type: 'boolean', section: 'Perencanaan & Indeks', row: 'd1' },
    { name: 'dokumenRtsp', label: 'Dokumen RTSP tersedia', type: 'boolean', row: 'd1' },
    { name: 'dokumenRskp', label: 'Dokumen RSKP tersedia', type: 'boolean', row: 'd2' },
    { name: 'konektivitasInternet', label: 'Konektivitas internet tersedia', type: 'boolean', row: 'd2' },
    DECIMAL('nilaiIntrans', 'Nilai Intrans (0-100)', { min: 0, row: 'i1' }),
    DECIMAL('indeksInfrastruktur', 'Indeks Kesiapan Infrastruktur (1-5)', { min: 0, row: 'i1' }),
    DECIMAL('indeksKelembagaan', 'Indeks Kelembagaan (1-5)', { min: 0, row: 'i2' }),
    DECIMAL('indeksDukungan', 'Indeks Dukungan Investasi (1-5)', { min: 0, row: 'i2' }),
    { name: 'komoditiUnggulanId', label: 'Produk Unggulan 1 - Komoditas', type: 'fk', required: false, fkEntity: 'komoditi', hint: 'Sektor mengikuti kategori komoditas (Pangan, Peternakan, Perkebunan, Pertambangan).', section: 'Produk Unggulan' },
    { name: 'produk1Tahun', label: 'Produk Unggulan 1 - Tahun', type: 'text', required: false, placeholder: 'cth. 2025', row: 'produk1a' },
    DECIMAL('produk1LuasHa', 'Produk Unggulan 1 - Luas Area (ha)', { min: 0, row: 'produk1a' }),
    DECIMAL('produk1Produksi', 'Produk Unggulan 1 - Produksi per Tahun', { min: 0, row: 'produk1b' }),
    { name: 'produk1Satuan', label: 'Produk Unggulan 1 - Satuan Produksi', type: 'select', required: false, options: ['TON', 'KG', 'EKOR'], row: 'produk1b' },
    { name: 'produk1Pelaku', label: 'Produk Unggulan 1 - Pelaku Usaha (orang)', type: 'number', required: false, min: 0, step: 1 },
    { name: 'komoditiPendukungId', label: 'Produk Unggulan 2 - Komoditas', type: 'fk', required: false, fkEntity: 'komoditi' },
    { name: 'produk2Tahun', label: 'Produk Unggulan 2 - Tahun', type: 'text', required: false, placeholder: 'cth. 2025', row: 'produk2a' },
    DECIMAL('produk2LuasHa', 'Produk Unggulan 2 - Luas Area (ha)', { min: 0, row: 'produk2a' }),
    DECIMAL('produk2Produksi', 'Produk Unggulan 2 - Produksi per Tahun', { min: 0, row: 'produk2b' }),
    { name: 'produk2Satuan', label: 'Produk Unggulan 2 - Satuan Produksi', type: 'select', required: false, options: ['TON', 'KG', 'EKOR'], row: 'produk2b' },
    { name: 'produk2Pelaku', label: 'Produk Unggulan 2 - Pelaku Usaha (orang)', type: 'number', required: false, min: 0, step: 1 },
    { name: 'produk3KomoditiId', label: 'Produk Unggulan 3 - Komoditas', type: 'fk', required: false, fkEntity: 'komoditi' },
    { name: 'produk3Tahun', label: 'Produk Unggulan 3 - Tahun', type: 'text', required: false, placeholder: 'cth. 2025', row: 'produk3a' },
    DECIMAL('produk3LuasHa', 'Produk Unggulan 3 - Luas Area (ha)', { min: 0, row: 'produk3a' }),
    DECIMAL('produk3Produksi', 'Produk Unggulan 3 - Produksi per Tahun', { min: 0, row: 'produk3b' }),
    { name: 'produk3Satuan', label: 'Produk Unggulan 3 - Satuan Produksi', type: 'select', required: false, options: ['TON', 'KG', 'EKOR'], row: 'produk3b' },
    { name: 'produk3Pelaku', label: 'Produk Unggulan 3 - Pelaku Usaha (orang)', type: 'number', required: false, min: 0, step: 1 },
    { name: 'produk4KomoditiId', label: 'Produk Unggulan 4 - Komoditas', type: 'fk', required: false, fkEntity: 'komoditi' },
    { name: 'produk4Tahun', label: 'Produk Unggulan 4 - Tahun', type: 'text', required: false, placeholder: 'cth. 2025', row: 'produk4a' },
    DECIMAL('produk4LuasHa', 'Produk Unggulan 4 - Luas Area (ha)', { min: 0, row: 'produk4a' }),
    DECIMAL('produk4Produksi', 'Produk Unggulan 4 - Produksi per Tahun', { min: 0, row: 'produk4b' }),
    { name: 'produk4Satuan', label: 'Produk Unggulan 4 - Satuan Produksi', type: 'select', required: false, options: ['TON', 'KG', 'EKOR'], row: 'produk4b' },
    { name: 'produk4Pelaku', label: 'Produk Unggulan 4 - Pelaku Usaha (orang)', type: 'number', required: false, min: 0, step: 1 },
    { name: 'skpRingkasan', label: 'Ringkasan SKP', type: 'textarea', required: false, section: 'Ringkasan', hint: 'Ringkasan bebas teks dari Matriks 45 Kawasan — bukan daftar SKP yang tertaut (lihat menu SKP untuk data SKP yang sebenarnya).' },
    { name: 'spRingkasan', label: 'Ringkasan SP', type: 'textarea', required: false, hint: 'Ringkasan bebas teks dari Matriks 45 Kawasan — bukan daftar SP yang tertaut (lihat menu SP untuk data SP yang sebenarnya).' },
    { name: 'kpb', label: 'KPB? (isi "Y" jika ya)', type: 'text', required: false, row: 'flags' },
    { name: 'pusatSkp', label: 'Pusat SKP? (isi "Y" jika ya)', type: 'text', required: false, row: 'flags' },
    ACTIVE_FIELD
  ]
};

const SKP_CONFIG: EntityConfig<Skp> = {
  key: 'skp',
  label: 'SKP',
  sub: 'Satuan Kawasan Pengembangan — sub-kawasan di bawah satu KT',
  idPrefix: 'skp',
  titleField: 'nama',
  columns: [
    { key: 'nama', label: 'Nama SKP', sortable: true },
    { key: 'provinsi', label: 'Provinsi', sortable: true },
    { key: 'kabupaten', label: 'Kabupaten', sortable: true },
    { key: 'indukWptId', label: 'Induk KT', fk: 'wpt' }
  ],
  fields: [
    { name: 'nama', label: 'Nama SKP', type: 'text', required: true, placeholder: 'cth. SKP A Lunang' },
    { name: 'provinsi', label: 'Provinsi', type: 'text', required: true },
    { name: 'kabupaten', label: 'Kabupaten', type: 'text', required: true },
    { name: 'indukWptId', label: 'Induk KT', type: 'fk', required: true, fkEntity: 'wpt' },
    { name: 'cakupanSp', label: 'Cakupan SP (ringkasan)', type: 'textarea', required: false, hint: 'Ringkasan bebas teks dari ERD sumber. Keterkaitan sebenarnya ada di field "Induk SKP" pada setiap entri SP.' }
  ]
};

const SP_CONFIG: EntityConfig<Sp> = {
  key: 'sp',
  label: 'SP',
  sub: 'Satuan Permukiman — unit permukiman di bawah satu SKP',
  idPrefix: 'sp',
  titleField: 'nama',
  columns: [
    { key: 'nama', label: 'Nama SP', sortable: true },
    { key: 'jenisStatus', label: 'Jenis/Status', sortable: true },
    { key: 'kabupaten', label: 'Kabupaten', sortable: true },
    { key: 'indukSkpId', label: 'Induk SKP', fk: 'skp' },
    { key: 'kk', label: 'KK', numeric: true, sortable: true }
  ],
  fields: [
    { name: 'nama', label: 'Nama SP', type: 'text', required: true, placeholder: 'cth. SP 1 Lunang' },
    { name: 'jenisStatus', label: 'Jenis/Status SP', type: 'select', required: true, options: ['SP Bina', 'SP Bina / PUG', 'SP Mandiri', 'SP Swakarsa', 'SP Kota Terpadu'] },
    { name: 'provinsi', label: 'Provinsi', type: 'text', required: true },
    { name: 'kabupaten', label: 'Kabupaten', type: 'text', required: true },
    { name: 'indukSkpId', label: 'Induk SKP', type: 'fk', required: true, fkEntity: 'skp' },
    { name: 'indukWptId', label: 'Induk KT', type: 'fk', required: true, fkEntity: 'wpt' },
    { name: 'kk', label: 'Jumlah KK (opsional)', type: 'number', required: false, min: 0, step: 1 }
  ]
};

const KOMODITI_CONFIG: EntityConfig<Komoditi> = {
  key: 'komoditi',
  label: 'Komoditas',
  sub: 'Kategori komoditi unggulan kawasan',
  idPrefix: 'kom',
  titleField: 'nama',
  columns: [
    { key: 'code', label: 'Kode', sortable: true },
    { key: 'nama', label: 'Komoditi', sortable: true },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [
    CODE_FIELD(false),
    SEQUENCE_FIELD,
    { name: 'nama', label: 'Nama komoditi', type: 'text', required: true, placeholder: 'cth. Padi' },
    { name: 'description', label: 'Deskripsi', type: 'textarea', required: false },
    ACTIVE_FIELD
  ]
};

const PROGRAM_CONFIG: EntityConfig<Program> = {
  key: 'program',
  label: 'Transmigration Program',
  sub: '5 program utama transmigrasi (Tuntas, Lokal, Patriot, Karya Nusa, Gotong Royong)',
  idPrefix: 'prog',
  titleField: 'jenisTransmigrasi',
  columns: [
    { key: 'jenisTransmigrasi', label: 'Jenis Transmigrasi', sortable: true },
    { key: 'singkatan', label: 'Singkatan', sortable: true },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [
    CODE_FIELD(false),
    SEQUENCE_FIELD,
    { name: 'jenisTransmigrasi', label: 'Jenis Transmigrasi', type: 'text', required: true, placeholder: 'cth. TRANSMIGRASI TUNTAS' },
    { name: 'singkatan', label: 'Singkatan', type: 'text', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea', required: true },
    ACTIVE_FIELD
  ]
};

const SATKER_CONFIG: EntityConfig<Satker> = {
  key: 'satker',
  label: 'Satker',
  sub: 'Struktur unit kerja / jabatan Kementerian Transmigrasi',
  idPrefix: 'sat',
  titleField: 'nama',
  columns: [
    { key: 'nama', label: 'Unit Kerja / Jabatan', sortable: true },
    { key: 'level', label: 'Level', numeric: true, sortable: true },
    { key: 'eselon', label: 'Eselon', sortable: true },
    { key: 'parentId', label: 'Induk', fk: 'satker' },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [
    { name: 'nama', label: 'Unit Kerja / Jabatan', type: 'text', required: true },
    { name: 'level', label: 'Level', type: 'number', required: true, min: 1, step: 1, row: 'a' },
    { name: 'eselon', label: 'Eselon', type: 'text', required: true, placeholder: 'cth. Eselon II.a', row: 'a' },
    { name: 'parentId', label: 'Induk Satker (opsional)', type: 'fk', required: false, fkEntity: 'satker', hint: 'ERD satker.parent_id — unit di atasnya dalam struktur organisasi.' },
    { name: 'keterangan', label: 'Keterangan / Fungsi (opsional)', type: 'textarea', required: false },
    ACTIVE_FIELD
  ]
};

const PERSONEL_CONFIG: EntityConfig<Personel> = {
  key: 'personel',
  label: 'Personel',
  sub: 'Data personel dan penempatan satker',
  idPrefix: 'per',
  titleField: 'nama',
  columns: [
    { key: 'nama', label: 'Nama', sortable: true },
    { key: 'nip', label: 'NIP', sortable: true },
    { key: 'jabatan', label: 'Jabatan', sortable: true },
    { key: 'satkerId', label: 'Satker', fk: 'satker' }
  ],
  fields: [
    { name: 'nama', label: 'Nama', type: 'text', required: true },
    { name: 'nip', label: 'NIP', type: 'text', required: true, row: 'a' },
    { name: 'golongan', label: 'Golongan', type: 'text', required: true, placeholder: 'cth. IV-a', row: 'a' },
    { name: 'jabatan', label: 'Jabatan', type: 'text', required: true },
    { name: 'satkerId', label: 'Satker', type: 'fk', required: true, fkEntity: 'satker' }
  ]
};

const IKU_CONFIG: EntityConfig<Iku> = {
  key: 'iku',
  label: 'IKU Indicator',
  sub: 'Indikator Kinerja Utama per satker/direktorat',
  idPrefix: 'iku',
  titleField: 'indikator',
  columns: [
    { key: 'kode', label: 'Kode', sortable: true },
    { key: 'satkerLabel', label: 'Satker (ERD)', sortable: true },
    { key: 'satuan', label: 'Satuan', sortable: true },
    { key: 'indikator', label: 'Indikator', sortable: true },
    { key: 'pic', label: 'PIC', sortable: true }
  ],
  fields: [
    { name: 'kode', label: 'Kode (opsional)', type: 'text', required: false, placeholder: 'cth. 1-CP', row: 'a' },
    { name: 'satuan', label: 'Satuan', type: 'select', required: true, options: ['Indeks', 'Persen', 'Nilai'], row: 'a' },
    {
      name: 'satkerId', label: 'Satker (unit penanggung jawab)', type: 'fk', required: true, fkEntity: 'satker',
      hint: 'Wajib dipilih ulang di sini — kolom "Satker" asli dari ERD (di bawah) memakai nama jabatan yang tidak cocok dengan data Satker manapun. Lihat README data-manager untuk detail.'
    },
    { name: 'satkerLabel', label: 'Satker (teks asli dari ERD, opsional)', type: 'text', required: false, hint: 'Disimpan hanya untuk referensi/rekonsiliasi — bukan field yang ditautkan.' },
    { name: 'programId', label: 'Jenis Program Transmigrasi (opsional)', type: 'fk', required: false, fkEntity: 'program' },
    { name: 'indikator', label: 'Indikator Kinerja Utama', type: 'textarea', required: true },
    { name: 'pic', label: 'PIC', type: 'text', required: true },
    { name: 'sasaranStrategis', label: 'Sasaran Strategis (opsional)', type: 'textarea', required: false },
    { name: 'strategicTargetId', label: 'Strategic Target (opsional)', type: 'fk', required: false, fkEntity: 'strategicTarget', hint: 'ERD iku_indicator.strategic_target_id — tautan nyata ke menu Strategic Target.' },
    { name: 'description', label: 'Deskripsi (opsional)', type: 'textarea', required: false },
    { name: 'sequence', label: 'Urutan (sequence)', type: 'number', required: false, min: 0, step: 1, row: 'sq' },
    ACTIVE_FIELD
  ]
};

/**
 * Configs for the ERD-backed master tables (see models/erd-master.model.ts). Field labels keep the
 * ERD's column names recognisable; `active` defaults to true on new records and audit columns are
 * not editable (see the model file's header).
 */
/** code + name + description + sequence + active — the ERD's plain lookup-table shape. */
function lookupConfig<T extends { id: string }>(
  key: EntityKey, label: string, sub: string, idPrefix: string, extraFields: FieldConfig<any>[] = [], extraColumns: EntityColumnConfig<any>[] = []
): EntityConfig<T> {
  return {
    key,
    label,
    sub,
    idPrefix,
    titleField: 'name' as any,
    columns: [
      { key: 'code', label: 'Kode', sortable: true },
      { key: 'name', label: 'Nama', sortable: true },
      ...extraColumns,
      { key: 'sequence', label: 'Urutan', numeric: true, sortable: true },
      { key: 'active', label: 'Aktif', boolean: true, sortable: true }
    ] as EntityColumnConfig<any>[],
    fields: [
      CODE_FIELD(true),
      SEQUENCE_FIELD,
      { name: 'name', label: 'Nama', type: 'text', required: true },
      DESCRIPTION_FIELD,
      ...extraFields,
      ACTIVE_FIELD
    ]
  };
}

const WILAYAH_STATUS_CONFIG = lookupConfig<WilayahStatus>('wilayahStatus', 'Wilayah Status', 'Status klasifikasi wilayah (tabel wilayah_status)', 'wst');
const PROFIL_CATEGORY_CONFIG = lookupConfig<ProfilCategory>('profilCategory', 'Profil Category', 'Kategori profil kawasan (tabel profil_category)', 'pfc');
const PROFIL_MEASURE_CONFIG = lookupConfig<ProfilMeasure>('profilMeasure', 'Profil Measure', 'Ukuran/indikator profil kawasan (tabel profil_measure)', 'pfm');
const PRODUK_JENIS_CONFIG = lookupConfig<ProdukJenis>('produkJenis', 'Produk Jenis', 'Jenis produk unggulan (tabel produk_jenis)', 'pdj');
const PROFIL_GROUP_CONFIG = lookupConfig<ProfilGroup>(
  'profilGroup', 'Profil Group', 'Pengelompokan profil kawasan di bawah satu kategori (tabel profil_group)', 'pfg',
  [{ name: 'categoryId', label: 'Profil Category', type: 'fk', required: true, fkEntity: 'profilCategory' }],
  [{ key: 'categoryId', label: 'Kategori', fk: 'profilCategory' }]
);
const RECOMMENDATION_CATEGORY_CONFIG = lookupConfig<RecommendationCategory>(
  'recommendationCategory', 'Recommendation Category', 'Kategori rekomendasi kebijakan per tipe satker (tabel recommendation_category)', 'rec',
  [{ name: 'satkerTypeId', label: 'Satker Type', type: 'fk', required: true, fkEntity: 'satkerType' }],
  [{ key: 'satkerTypeId', label: 'Satker Type', fk: 'satkerType' }]
);
const STRATEGIC_TARGET_CONFIG = lookupConfig<StrategicTarget>(
  'strategicTarget', 'Strategic Target', 'Sasaran strategis per program transmigrasi dan satker (tabel strategic_target)', 'sgt',
  [
    { name: 'transmigrationProgramId', label: 'Transmigration Program', type: 'fk', required: true, fkEntity: 'program' },
    { name: 'satkerId', label: 'Satker', type: 'fk', required: true, fkEntity: 'satker' }
  ],
  [
    { key: 'transmigrationProgramId', label: 'Program', fk: 'program' },
    { key: 'satkerId', label: 'Satker', fk: 'satker' }
  ]
);

const SATKER_TYPE_CONFIG: EntityConfig<SatkerType> = {
  key: 'satkerType',
  label: 'Satker Type',
  sub: 'Jenis/tipe satuan kerja (tabel satker_type)',
  idPrefix: 'stp',
  titleField: 'name',
  columns: [
    { key: 'code', label: 'Kode', sortable: true },
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [CODE_FIELD(true), { name: 'name', label: 'Nama', type: 'text', required: true }, DESCRIPTION_FIELD, ACTIVE_FIELD]
};

const WILAYAH_CATEGORY_CONFIG: EntityConfig<WilayahCategory> = {
  key: 'wilayahCategory',
  label: 'Wilayah Category',
  sub: 'Kategori klasifikasi wilayah (tabel wilayah_category)',
  idPrefix: 'wct',
  titleField: 'name',
  columns: [
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [{ name: 'name', label: 'Nama', type: 'text', required: true }, ACTIVE_FIELD]
};

const WILAYAH_TARGET_CONFIG: EntityConfig<WilayahTarget> = {
  key: 'wilayahTarget',
  label: 'Wilayah Target',
  sub: 'Target dan realisasi anggaran per wilayah (tabel wilayah_target)',
  idPrefix: 'wtg',
  titleField: 'targetType',
  columns: [
    { key: 'wilayahId', label: 'Wilayah', fk: 'wpt' },
    { key: 'targetType', label: 'Tipe Target', sortable: true },
    { key: 'targetYear', label: 'Tahun', numeric: true, sortable: true },
    { key: 'targetValue', label: 'Nilai Target', numeric: true, sortable: true },
    { key: 'unit', label: 'Satuan', sortable: true }
  ],
  fields: [
    { name: 'wilayahId', label: 'Wilayah (KT)', type: 'fk', required: true, fkEntity: 'wpt', hint: 'Tabel wilayah di ERD mencakup KT/SKP/SP; di sini baru KT yang bisa dipilih.' },
    { name: 'targetType', label: 'Tipe Target', type: 'text', required: true, hint: 'Enum target_type di ERD — isi nilainya tidak terbaca pada gambar, jadi teks bebas.', row: 'a' },
    { name: 'targetYear', label: 'Tahun Target', type: 'number', required: false, min: 2000, step: 1, row: 'a' },
    DECIMAL('targetValue', 'Nilai Target', { row: 'b' }),
    { name: 'unit', label: 'Satuan', type: 'text', required: false, row: 'b' },
    DECIMAL('budgetTarget', 'Target Anggaran'),
    DECIMAL('budgetRealization', 'Realisasi Anggaran', { row: 'c' }),
    DECIMAL('budgetPercentage', 'Persentase Anggaran (%)', { row: 'c' })
  ]
};

const PROJECT_CONFIG: EntityConfig<Project> = {
  key: 'project',
  label: 'Project',
  sub: 'Proyek/kegiatan per satker beserta anggarannya (tabel project)',
  idPrefix: 'prj',
  titleField: 'name',
  columns: [
    { key: 'code', label: 'Kode', sortable: true },
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'satkerId', label: 'Satker', fk: 'satker' },
    { key: 'tahunAnggaran', label: 'Tahun Anggaran', numeric: true, sortable: true },
    { key: 'budgetAllocation', label: 'Alokasi', numeric: true, sortable: true },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [
    { name: 'code', label: 'Kode', type: 'text', required: false, row: 'ck' },
    { name: 'sequence', label: 'Urutan (sequence)', type: 'number', required: false, min: 0, step: 1, row: 'ck' },
    { name: 'name', label: 'Nama', type: 'text', required: true },
    DESCRIPTION_FIELD,
    { name: 'satkerId', label: 'Satker', type: 'fk', required: true, fkEntity: 'satker' },
    { name: 'reportingDate', label: 'Tanggal Pelaporan', type: 'date', required: false, row: 'd' },
    { name: 'tahunAnggaran', label: 'Tahun Anggaran', type: 'number', required: false, step: 1, row: 'd' },
    DECIMAL('budgetAllocation', 'Alokasi Anggaran', { row: 'e' }),
    DECIMAL('budgetRealization', 'Realisasi Anggaran', { row: 'e' }),
    DECIMAL('budgetRealizationPercentage', 'Persentase Realisasi (%)'),
    { name: 'startDate', label: 'Tanggal Mulai', type: 'date', required: false, row: 'f' },
    { name: 'finishDate', label: 'Tanggal Selesai', type: 'date', required: false, row: 'f' },
    ACTIVE_FIELD
  ]
};

const IKU_DEFINITION_CONFIG: EntityConfig<IkuDefinition> = {
  key: 'ikuDefinition',
  label: 'IKU Definition',
  sub: 'Target, realisasi, dan capaian per indikator IKU (tabel iku_definition)',
  idPrefix: 'ikd',
  titleField: 'ikuIndicatorId',
  columns: [
    { key: 'ikuIndicatorId', label: 'Indikator', fk: 'iku' },
    { key: 'referenceYear', label: 'Tahun', numeric: true, sortable: true },
    { key: 'targetValue', label: 'Target', numeric: true, sortable: true },
    { key: 'actualValueNumeric', label: 'Realisasi', numeric: true, sortable: true },
    { key: 'achievementPercentage', label: 'Capaian (%)', numeric: true, sortable: true },
    { key: 'approvalStatus', label: 'Approval', sortable: true }
  ],
  fields: [
    { name: 'ikuIndicatorId', label: 'IKU Indicator', type: 'fk', required: true, fkEntity: 'iku' },
    { name: 'reportingDate', label: 'Tanggal Pelaporan', type: 'date', required: false, row: 'a' },
    { name: 'referenceYear', label: 'Tahun Referensi', type: 'number', required: false, step: 1, row: 'a' },
    DECIMAL('targetValue', 'Nilai Target', { row: 'b' }),
    DECIMAL('actualValueNumeric', 'Nilai Realisasi', { row: 'b' }),
    { name: 'unit', label: 'Satuan (iku_unit)', type: 'text', required: false, row: 'c', hint: 'Enum di ERD — isinya tidak terbaca pada gambar.' },
    DECIMAL('achievementPercentage', 'Capaian (%)', { row: 'c' }),
    { name: 'aggregationType', label: 'Tipe Agregasi', type: 'text', required: false, row: 'd', hint: 'Enum aggregation_type di ERD.' },
    { name: 'valueDirection', label: 'Arah Nilai', type: 'text', required: false, row: 'd', hint: 'Enum value_direction di ERD.' },
    { name: 'reportingFrequency', label: 'Frekuensi Pelaporan', type: 'text', required: false, hint: 'Enum reporting_frequency di ERD.' },
    DECIMAL('budgetAllocation', 'Alokasi Anggaran', { row: 'e' }),
    DECIMAL('budgetRealization', 'Realisasi Anggaran', { row: 'e' }),
    DECIMAL('budgetRealizationPercentage', 'Persentase Realisasi (%)', { row: 'f' }),
    DECIMAL('weight', 'Bobot', { row: 'f' }),
    { name: 'pic', label: 'PIC', type: 'text', required: false, row: 'g' },
    { name: 'sequence', label: 'Urutan (sequence)', type: 'number', required: false, min: 0, step: 1, row: 'g' },
    { name: 'approvalStatus', label: 'Approval Status', type: 'select', required: false, options: ['PENDING', 'APPROVED', 'REJECTED'], hint: 'Enum approval_status di ERD; nilai yang dipakai di sini mengikuti alur Submission & Approval.' },
    { name: 'approvalNote', label: 'Catatan Approval', type: 'textarea', required: false },
    ACTIVE_FIELD
  ]
};

const IKU_BAND_FIELDS: FieldConfig<any>[] = [
  CODE_FIELD(false),
  SEQUENCE_FIELD,
  { name: 'name', label: 'Nama', type: 'text', required: true },
  DESCRIPTION_FIELD,
  DECIMAL('minAchievementPercentage', 'Capaian Minimum (%)', { row: 'mm' }),
  DECIMAL('maxAchievementPercentage', 'Capaian Maksimum (%)', { row: 'mm' }),
  ACTIVE_FIELD
];
const IKU_BAND_COLUMNS: EntityColumnConfig<any>[] = [
  { key: 'code', label: 'Kode', sortable: true },
  { key: 'name', label: 'Nama', sortable: true },
  { key: 'minAchievementPercentage', label: 'Min (%)', numeric: true, sortable: true },
  { key: 'maxAchievementPercentage', label: 'Maks (%)', numeric: true, sortable: true },
  { key: 'active', label: 'Aktif', boolean: true, sortable: true }
];
const IKU_NKO_CONFIG: EntityConfig<IkuNko> = {
  key: 'ikuNko', label: 'IKU NKO', sub: 'Pita capaian untuk Nilai Kinerja Organisasi (tabel iku_nko)', idPrefix: 'ikn',
  titleField: 'name', columns: IKU_BAND_COLUMNS, fields: IKU_BAND_FIELDS
};
const IKU_STATUS_CONFIG: EntityConfig<IkuStatus> = {
  key: 'ikuStatus', label: 'IKU Status', sub: 'Pita capaian untuk status pencapaian IKU (tabel iku_status)', idPrefix: 'iks',
  titleField: 'name', columns: IKU_BAND_COLUMNS, fields: IKU_BAND_FIELDS
};

const APPROVAL_FLOW_CONFIG: EntityConfig<ApprovalFlow> = {
  key: 'approvalFlow',
  label: 'Approval Flow',
  sub: 'Alur/tahapan approval berjenjang (tabel approval_flow)',
  idPrefix: 'apf',
  titleField: 'role',
  columns: [
    { key: 'role', label: 'Role', sortable: true },
    { key: 'reviewer', label: 'Reviewer', sortable: true },
    { key: 'selfApproval', label: 'Self Approval', boolean: true },
    { key: 'terminate', label: 'Terminate', boolean: true },
    { key: 'nextApprovalFlowId', label: 'Tahap Berikutnya', fk: 'approvalFlow' },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [
    { name: 'role', label: 'Role', type: 'text', required: true, row: 'a' },
    { name: 'reviewer', label: 'Reviewer', type: 'text', required: false, row: 'a' },
    { name: 'selfApproval', label: 'Self Approval', type: 'boolean', row: 'b' },
    { name: 'terminate', label: 'Terminate (akhir alur)', type: 'boolean', row: 'b' },
    { name: 'nextApprovalFlowId', label: 'Tahap Approval Berikutnya', type: 'fk', required: false, fkEntity: 'approvalFlow' },
    ACTIVE_FIELD
  ]
};

const APPLICATION_SETTINGS_CONFIG: EntityConfig<ApplicationSetting> = {
  key: 'applicationSettings',
  label: 'Application Settings',
  sub: 'Pengaturan aplikasi berbasis pasangan judul/nilai (tabel application_settings)',
  idPrefix: 'aps',
  titleField: 'title',
  columns: [
    { key: 'title', label: 'Judul', sortable: true },
    { key: 'prefix', label: 'Prefix', sortable: true },
    { key: 'values', label: 'Values' },
    { key: 'active', label: 'Aktif', boolean: true, sortable: true }
  ],
  fields: [
    { name: 'title', label: 'Judul', type: 'text', required: true, row: 'a' },
    { name: 'prefix', label: 'Prefix', type: 'text', required: false, row: 'a' },
    DESCRIPTION_FIELD,
    { name: 'values', label: 'Values', type: 'textarea', required: false },
    ACTIVE_FIELD
  ]
};

export const ENTITY_CONFIGS: { [key in EntityKey]: EntityConfig } = {
  wpt: WPT_CONFIG,
  skp: SKP_CONFIG,
  sp: SP_CONFIG,
  komoditi: KOMODITI_CONFIG,
  program: PROGRAM_CONFIG,
  satker: SATKER_CONFIG,
  personel: PERSONEL_CONFIG,
  iku: IKU_CONFIG,
  wilayahStatus: WILAYAH_STATUS_CONFIG,
  wilayahCategory: WILAYAH_CATEGORY_CONFIG,
  wilayahTarget: WILAYAH_TARGET_CONFIG,
  project: PROJECT_CONFIG,
  satkerType: SATKER_TYPE_CONFIG,
  strategicTarget: STRATEGIC_TARGET_CONFIG,
  ikuDefinition: IKU_DEFINITION_CONFIG,
  ikuNko: IKU_NKO_CONFIG,
  ikuStatus: IKU_STATUS_CONFIG,
  produkJenis: PRODUK_JENIS_CONFIG,
  recommendationCategory: RECOMMENDATION_CATEGORY_CONFIG,
  profilCategory: PROFIL_CATEGORY_CONFIG,
  profilGroup: PROFIL_GROUP_CONFIG,
  profilMeasure: PROFIL_MEASURE_CONFIG,
  applicationSettings: APPLICATION_SETTINGS_CONFIG,
  approvalFlow: APPROVAL_FLOW_CONFIG
};

/**
 * Small hand-drawn line-icon set, one per entity, ported from the original's
 * `ENTITY_ICONS`/`railIcon()` (24x24 viewBox, `currentColor` stroke) — purely
 * decorative, no bearing on the data model. `Partial` (not one entry per
 * `EntityKey`) because the header nav's dropdown rows (see
 * DataManagerShellComponent) are plain text, not icon+label rail buttons —
 * the 16 keys added for "Data Master"/"Settings" have no icon here, and
 * `entityIconSvg()` falls back to '' rather than requiring one.
 */
export const ENTITY_ICON_PATHS: Partial<{ [key in EntityKey]: string }> = {
  wpt: '<path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><path d="M8 2v16"/><path d="M16 6v16"/>',
  skp: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  sp: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v11a1 1 0 0 0 1 1h3v-6h6v6h3a1 1 0 0 0 1-1V9"/>',
  komoditi: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
  program: '<path d="M4 22V4"/><path d="M4 4h14l-3 5 3 5H4"/>',
  satker: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 21v-4h6v4"/><path d="M9 7h1"/><path d="M14 7h1"/><path d="M9 11h1"/><path d="M14 11h1"/><path d="M9 15h1"/><path d="M14 15h1"/>',
  personel: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  iku: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
};

export function entityIconSvg(key: EntityKey): string {
  const pathData = ENTITY_ICON_PATHS[key];
  if (!pathData) {
    return '';
  }
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + pathData + '</svg>';
}
