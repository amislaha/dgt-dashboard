import { EntityConfig } from '../models/entity-config.model';
import { EntityKey } from '../models/entity-key.model';
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

const WPT_CONFIG: EntityConfig<Wpt> = {
  key: 'wpt',
  label: 'WPT',
  sub: 'Wilayah Pengembangan Transmigrasi — kawasan induk tingkat tertinggi',
  idPrefix: 'wpt',
  titleField: 'nama',
  columns: [
    { key: 'nama', label: 'Nama WPT', sortable: true },
    { key: 'provinsi', label: 'Provinsi', sortable: true },
    { key: 'kabupaten', label: 'Kabupaten/Kota', sortable: true }
  ],
  fields: [
    { name: 'nama', label: 'Nama WPT', type: 'text', required: true, placeholder: 'cth. WPT Lunang Silaut' },
    { name: 'provinsi', label: 'Provinsi', type: 'text', required: true },
    { name: 'kabupaten', label: 'Kabupaten/Kota', type: 'text', required: true },
    { name: 'geo', label: 'Koordinat/Geo (opsional)', type: 'text', required: false, hint: 'Kolom ini ada di ERD sumber tapi belum berisi data pada baris manapun.' }
  ]
};

const SKP_CONFIG: EntityConfig<Skp> = {
  key: 'skp',
  label: 'SKP',
  sub: 'Satuan Kawasan Pengembangan — sub-kawasan di bawah satu WPT',
  idPrefix: 'skp',
  titleField: 'nama',
  columns: [
    { key: 'nama', label: 'Nama SKP', sortable: true },
    { key: 'provinsi', label: 'Provinsi', sortable: true },
    { key: 'kabupaten', label: 'Kabupaten', sortable: true },
    { key: 'indukWptId', label: 'Induk WPT', fk: 'wpt' }
  ],
  fields: [
    { name: 'nama', label: 'Nama SKP', type: 'text', required: true, placeholder: 'cth. SKP A Lunang' },
    { name: 'provinsi', label: 'Provinsi', type: 'text', required: true },
    { name: 'kabupaten', label: 'Kabupaten', type: 'text', required: true },
    { name: 'indukWptId', label: 'Induk WPT', type: 'fk', required: true, fkEntity: 'wpt' },
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
    { name: 'indukWptId', label: 'Induk WPT', type: 'fk', required: true, fkEntity: 'wpt' },
    { name: 'kk', label: 'Jumlah KK (opsional)', type: 'number', required: false, min: 0 }
  ]
};

const KOMODITI_CONFIG: EntityConfig<Komoditi> = {
  key: 'komoditi',
  label: 'Komoditi',
  sub: 'Kategori komoditi unggulan kawasan',
  idPrefix: 'kom',
  titleField: 'nama',
  columns: [{ key: 'nama', label: 'Komoditi', sortable: true }],
  fields: [{ name: 'nama', label: 'Nama komoditi', type: 'text', required: true, placeholder: 'cth. Padi' }]
};

const PROGRAM_CONFIG: EntityConfig<Program> = {
  key: 'program',
  label: 'Program',
  sub: '5 program utama transmigrasi (Tuntas, Lokal, Patriot, Karya Nusa, Gotong Royong)',
  idPrefix: 'prog',
  titleField: 'jenisTransmigrasi',
  columns: [
    { key: 'jenisTransmigrasi', label: 'Jenis Transmigrasi', sortable: true },
    { key: 'singkatan', label: 'Singkatan', sortable: true }
  ],
  fields: [
    { name: 'jenisTransmigrasi', label: 'Jenis Transmigrasi', type: 'text', required: true, placeholder: 'cth. TRANSMIGRASI TUNTAS' },
    { name: 'singkatan', label: 'Singkatan', type: 'text', required: true },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea', required: true }
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
    { key: 'eselon', label: 'Eselon', sortable: true }
  ],
  fields: [
    { name: 'nama', label: 'Unit Kerja / Jabatan', type: 'text', required: true },
    { name: 'level', label: 'Level', type: 'number', required: true, min: 1, row: 'a' },
    { name: 'eselon', label: 'Eselon', type: 'text', required: true, placeholder: 'cth. Eselon II.a', row: 'a' },
    { name: 'keterangan', label: 'Keterangan / Fungsi (opsional)', type: 'textarea', required: false }
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
  label: 'IKU',
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
    { name: 'sasaranStrategis', label: 'Sasaran Strategis (opsional)', type: 'textarea', required: false }
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
  iku: IKU_CONFIG
};

/**
 * Small hand-drawn line-icon set, one per entity, ported from the original's
 * `ENTITY_ICONS`/`railIcon()` (24x24 viewBox, `currentColor` stroke) — purely
 * decorative, no bearing on the data model.
 */
export const ENTITY_ICON_PATHS: { [key in EntityKey]: string } = {
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
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ENTITY_ICON_PATHS[key] + '</svg>';
}
