import { Iku } from '../models/iku.model';
import { Komoditi } from '../models/komoditi.model';
import { Personel } from '../models/personel.model';
import { Program } from '../models/program.model';
import { Satker } from '../models/satker.model';
import { SimpleMaster } from '../models/simple-master.model';
import { Skp } from '../models/skp.model';
import { Sp } from '../models/sp.model';
import { Wpt } from '../models/wpt.model';

/**
 * Seed data transcribed from the original data-manager/index.html `SEED`
 * object (itself transcribed from "ERD DTG 2026 (1).xlsx" — see
 * data-manager/README.md). Record shapes and values are otherwise unchanged;
 * the only deliberate edit is replacing name-string parent references
 * (`indukWpt: "WPT Lunang Silaut"`) with real id references (`indukWptId:
 * "wpt1"`) per the FK fix described in PORT_NOTES.md. Ids are kept identical
 * to the original so cross-referencing against the source file is easy.
 */

/**
 * Replaced with the real "Matriks 45 Kawasan Transmigrasi Prioritas Nasional Tahun 2025" source
 * spreadsheet (user-provided .xlsx, 45 rows: NO/KAWASAN/KABUPATEN/PROVINSI/WPT/SKP/SP/KPB?/Pusat
 * SKP?) — this is real government data, not the earlier 10-row illustrative placeholder. `nama`
 * transcribes the sheet's own "WPT" column verbatim (inconsistent casing and all — e.g. "Mahalona"
 * vs "RASAU JAYA" — same "transcribe as-is" policy as IKU_SEED below); a sheet cell of "-" (meaning
 * "no data") is normalized to `undefined` rather than kept as a literal dash, the one presentation
 * liberty taken.
 *
 * `lat`/`lon` are NOT from the source (it has no coordinates) — they're illustrative per-kabupaten
 * approximations added only so WilayahMapComponent's pins have somewhere to sit, same fabrication
 * convention as the dashboard's `kawasan` array. Treat them as roughly-the-right-area, not surveyed.
 */
export const WPT_SEED: Wpt[] = [
  { id: 'wpt1', nama: 'RASAU JAYA', kawasan: 'Rasau Jaya', provinsi: 'Kalimantan Barat', kabupaten: 'Kubu Raya', skpRingkasan: 'SKP (A, B, C, D), KPB', spRingkasan: 'Sei bulan c (SKP A)', kpb: 'Y', lat: -0.05, lon: 109.35 },
  { id: 'wpt2', nama: 'LAGITA', kawasan: 'Lagita', provinsi: 'Bengkulu', kabupaten: 'Bengkulu Utara', skpRingkasan: 'SKP I, II, III, KPB', kpb: 'Y', lat: -3.5, lon: 102.25 },
  { id: 'wpt3', nama: 'CAHAYA BARU', kawasan: 'Cahaya Baru', provinsi: 'Kalimantan Selatan', kabupaten: 'Barito Kuala', skpRingkasan: 'SKP 1, 2, 3, 4, 5, Pengembangan', spRingkasan: 'Jejangkit timur (SKP 1)', lat: -3.15, lon: 114.6 },
  { id: 'wpt4', nama: 'Mahalona', kawasan: 'Mahalona', provinsi: 'Sulawesi Selatan', kabupaten: 'Luwu Timur', skpRingkasan: 'SKP (A,B,C)', spRingkasan: 'Mahalona SKP c1, SP 2 Mahalona, SP 3 MAHALONA, SP 4 Mahalona', lat: -2.55, lon: 121.2 },
  { id: 'wpt5', nama: 'TOBADAK', kawasan: 'Tobadak', provinsi: 'Sulawesi Barat', kabupaten: 'Mamuju Tengah', skpRingkasan: 'SKP (A,B,C)', lat: -1.9, lon: 119.35 },
  { id: 'wpt6', nama: 'LUNANG SILAUT', kawasan: 'Lunang Silaut', provinsi: 'Sumatera Barat', kabupaten: 'Pesisir Selatan', skpRingkasan: 'SKP I, II, III, KPB', kpb: 'Y', lat: -1.99, lon: 101.28 },
  { id: 'wpt7', nama: 'TELANG', kawasan: 'Telang', provinsi: 'Sumatera Selatan', kabupaten: 'Banyuasin', lat: -2.75, lon: 104.75 },
  { id: 'wpt8', nama: 'SALOR', kawasan: 'Salor', provinsi: 'Papua Selatan', kabupaten: 'Merauke', skpRingkasan: 'SKP (A,B,C,D,E)', spRingkasan: 'SP 4 SALOR', lat: -8.47, lon: 140.4 },
  { id: 'wpt9', nama: 'JELAI', kawasan: 'Jelai (Pulau Nibung)', provinsi: 'Kalimantan Tengah', kabupaten: 'Sukamara', skpRingkasan: 'SKP (A,B,C)', spRingkasan: 'Jelai (SKP B)', lat: -2.63, lon: 111.15 },
  { id: 'wpt10', nama: 'PITURIASE', kawasan: 'Pituriase', provinsi: 'Sulawesi Selatan', kabupaten: 'Sidenreng Rappang', skpRingkasan: 'SKP (A,B,C), KPB', kpb: 'Y', lat: -3.75, lon: 119.75 },
  { id: 'wpt11', nama: 'PETATA', kawasan: 'Petata', provinsi: 'Sumatera Selatan', kabupaten: 'PALI', skpRingkasan: 'SKP (A/KPB, B,C,D,E)', kpb: 'Y', lat: -3.35, lon: 103.85 },
  { id: 'wpt12', nama: 'PARIT RAMBUTAN', kawasan: 'Parit Rambutan', provinsi: 'Sumatera Selatan', kabupaten: 'Ogan Ilir', skpRingkasan: 'SKP (I,II,III)', spRingkasan: 'SP 3 PARIT RAMBUTAN', lat: -3.3, lon: 104.65 },
  { id: 'wpt13', nama: 'Tasifeto - Mandeu', kawasan: 'Tasifeto - Mandeu', provinsi: 'NTT', kabupaten: 'Belu', skpRingkasan: 'SKP (A,B,C,D), KPB', kpb: 'Y', lat: -9.15, lon: 124.95 },
  { id: 'wpt14', nama: 'SELAUT', kawasan: 'Selaut', provinsi: 'Aceh', kabupaten: 'Simeulue', skpRingkasan: 'SKP (A,B,C), KPB', spRingkasan: 'SIGULAI SKP D (SKP A)', kpb: 'Y', lat: 2.6, lon: 96.1 },
  { id: 'wpt15', nama: 'SELAPARANG', kawasan: 'Selaparang', provinsi: 'NTB', kabupaten: 'Lombok Timur', skpRingkasan: 'SKP (1,2,3), KPB', spRingkasan: 'SP 1 JERINGO (SKP 1)', kpb: 'Y', lat: -8.55, lon: 116.55 },
  { id: 'wpt16', nama: 'BATU BETUMPANG', kawasan: 'Batu Betumpang', provinsi: 'Bangka Belitung', kabupaten: 'Bangka Selatan', skpRingkasan: 'SKP PAYUNG, AIR GEGAS, SIMPANG RIMBA, KPB', lat: -2.8, lon: 106.4 },
  { id: 'wpt17', nama: 'SARUDU BARAS', kawasan: 'Sarudu Baras', provinsi: 'Sulawesi Barat', kabupaten: 'Mamuju Utara', skpRingkasan: 'SKP (A,B,C,D), KPB', spRingkasan: 'TANJUNG CINA (KPB), SP 11 BARAS, SP 12 BARAS)', kpb: 'Y', lat: 0.7, lon: 119.65 },
  { id: 'wpt18', nama: 'BUNGKU', kawasan: 'Bungku', provinsi: 'Sulawesi Tengah', kabupaten: 'Morowali', skpRingkasan: 'SKP (I,II,III,IV)', spRingkasan: 'UMPANGA,KABERA', lat: -2.3, lon: 121.7 },
  { id: 'wpt19', nama: 'MUTIARA', kawasan: 'Mutiara', provinsi: 'Sulawesi Tenggara', kabupaten: 'Muna', skpRingkasan: 'SKP (I,II,III), ENCLAVE, KPB', spRingkasan: 'LANKORONI, RAIMUNA, POHORUA', kpb: 'Y', pusatSkp: 'Y', lat: -4.9, lon: 122.7 },
  { id: 'wpt20', nama: 'SUMALATA', kawasan: 'Sumalata', provinsi: 'Gorontalo', kabupaten: 'Gorontalo Utara', skpRingkasan: 'SKP (A, B/KPB, C,D)', spRingkasan: 'MOTIHELUMO, SUMALATA IV/DS. BOLONTIO', kpb: 'Y', lat: 0.9, lon: 122.4 },
  { id: 'wpt21', nama: 'SALIM BATU', kawasan: 'Salim Batu', provinsi: 'Kalimantan Utara', kabupaten: 'Bulungan', skpRingkasan: 'SKP (A,B,C)', spRingkasan: 'SEPUNGGUR, SP 3 TANJUNG BUKA, SP 5 TANJUNG BUKA, SP 5A TANJUNG BUKA, SP 6 TANJUNG BUKA, SP 8 TANJUNG BUKA, SP 9 TANJUNG BUKA', lat: 3.05, lon: 117.3 },
  { id: 'wpt22', nama: 'PALOLO', kawasan: 'Palolo', provinsi: 'Sulawesi Tengah', kabupaten: 'Sigi', skpRingkasan: 'SKP (A,B,C,), KPB', spRingkasan: 'SP 1 LEMBAN TONGOA, SP 2 LEMBAN TONGOA', kpb: 'Y', lat: -1.35, lon: 120.0 },
  { id: 'wpt23', nama: 'Gerbang Masperkasa', kawasan: 'Gerbang Masperkasa', provinsi: 'Kalimantan Barat', kabupaten: 'Sambas', skpRingkasan: 'SKP (A,B,C,D)', spRingkasan: 'SP 1 SEBUNGA', kpb: 'Y', pusatSkp: 'Y', lat: 1.35, lon: 109.3 },
  { id: 'wpt24', nama: 'Asinua/Routa', kawasan: 'Asinua/Routa', provinsi: 'Sulawesi Tenggara', kabupaten: 'Konawe', skpRingkasan: 'SKP (A, B/KPB ,C,D)', spRingkasan: 'SP 1 PARUDONGKA, WATUTINAU, AWUA JAYA', kpb: 'Y', lat: -3.7, lon: 122.15 },
  { id: 'wpt25', nama: 'TAMPOLERE', kawasan: 'Tampolere', provinsi: 'Sulawesi Tengah', kabupaten: 'Poso', skpRingkasan: 'SKP (A,B,C)', spRingkasan: 'SP 2 WATUTAU(GARKIM), TALABOSA/WATUTAU', lat: -1.4, lon: 120.75 },
  { id: 'wpt26', nama: 'KIKIM', kawasan: 'Kikim', provinsi: 'Sumatera Selatan', kabupaten: 'Lahat', skpRingkasan: 'SKP (A,B,C,D,E)', spRingkasan: 'KEBAN AGUNG', lat: -3.8, lon: 103.55 },
  { id: 'wpt27', nama: 'PONU', kawasan: 'Ponu', provinsi: 'NTT', kabupaten: 'Timor Tengah Utara', skpRingkasan: 'SKP (1,2,3,4)', lat: -9.2, lon: 124.35 },
  { id: 'wpt28', nama: 'PULAU MOROTAI', kawasan: 'Pulau Morotai', provinsi: 'Maluku Utara', kabupaten: 'Morotai', skpRingkasan: 'SKP (A,B,C,D), KPB', spRingkasan: 'SP 3 DARUBA, SP 4 DEHEGILA', kpb: 'Y', lat: 2.35, lon: 128.35 },
  { id: 'wpt29', nama: 'Kobalima Timur', kawasan: 'Kobalima Timur', provinsi: 'NTT', kabupaten: 'Malaka', skpRingkasan: 'SKP (A,B, C/KPB, D,E,F) ENCLAVE', spRingkasan: 'ULUKLUBUK, KAPITAN MEO', kpb: 'Y', lat: -9.55, lon: 124.85 },
  { id: 'wpt30', nama: 'KERANG', kawasan: 'Kerang', provinsi: 'Kalimantan Timur', kabupaten: 'Paser', skpRingkasan: 'SKP (A,B,C,D,E)', spRingkasan: 'KELADEN', lat: -1.9, lon: 116.1 },
  { id: 'wpt31', nama: 'MUTING', kawasan: 'Muting', provinsi: 'Papua Selatan', kabupaten: 'Merauke', skpRingkasan: 'SKP (A,B, C/KPB, D,E)', spRingkasan: 'SP 12 MUTING', kpb: 'Y', lat: -7.8, lon: 139.6 },
  { id: 'wpt32', nama: 'SENGGI', kawasan: 'Senggi', provinsi: 'Papua', kabupaten: 'Keerom', skpRingkasan: 'SKP (A,B,C,D)', spRingkasan: 'SP 1 SENGGI, SP 2 SENGGI', lat: -3.05, lon: 140.75 },
  { id: 'wpt33', nama: 'Tubbi Taramanu', kawasan: 'Tubbi Taramanu', provinsi: 'Sulawesi Barat', kabupaten: 'Polewali Mandar', skpRingkasan: 'SKP (A,B,C,D,)', spRingkasan: 'PIRIAN TIPIKO', lat: -3.35, lon: 119.3 },
  { id: 'wpt34', nama: 'ANAWUA', kawasan: 'Anawua', provinsi: 'Sulawesi Tenggara', kabupaten: 'Kolaka', skpRingkasan: 'SKP (A/KPB, B,C,D)', spRingkasan: 'ANAWUA', kpb: 'Y', lat: -4.05, lon: 121.6 },
  { id: 'wpt35', nama: 'Lamunti - Dadahup', kawasan: 'Lamunti - Dadahup', provinsi: 'Kalimantan Tengah', kabupaten: 'Kapuas', skpRingkasan: 'SKP (L1,L2,L3,D1,D2,D3/KPB, D4,D5), KPB L', spRingkasan: 'DADAHUP B4, C4, C3, A6', kpb: 'Y', lat: -2.5, lon: 114.35 },
  { id: 'wpt36', nama: 'ULUMANDA', kawasan: 'Ulumanda', provinsi: 'Sulawesi Barat', kabupaten: 'Majene', skpRingkasan: 'SKP (A,B,C), KPB', spRingkasan: 'TANDEALLO ULUMANDA,', kpb: 'Y', lat: -3.3, lon: 118.85 },
  { id: 'wpt37', nama: 'PATLEAN', kawasan: 'Patlean', provinsi: 'Maluku Utara', kabupaten: 'Halmahera Timur', skpRingkasan: 'SKP (A,B,C/KPB), ENCLAVE', spRingkasan: 'SP 4 PATLEAN, SP 5 PATLEAN,', kpb: 'Y', lat: 0.9, lon: 128.3 },
  { id: 'wpt38', nama: 'Mambi Mehalaan', kawasan: 'Mambi Mehalaan', provinsi: 'Sulawesi Barat', kabupaten: 'Mamasa', skpRingkasan: 'SKP (A,B,C,D), KPB', spRingkasan: 'BOTTENG PASEMBUK', lat: -2.95, lon: 119.35 },
  { id: 'wpt39', nama: 'SEKAYAM-ENTIKONG', kawasan: 'Sekayam - Entikong', provinsi: 'Kalimantan Barat', kabupaten: 'Sanggau', skpRingkasan: 'SKP (A,B,C)', lat: 0.05, lon: 110.6 },
  { id: 'wpt40', nama: 'KETUNGAU HULU', kawasan: 'Ketungau Hulu', provinsi: 'Kalimantan Barat', kabupaten: 'Sintang', skpRingkasan: 'SKP (A,B,C,D)', spRingkasan: 'SEBETUNG PALUK', lat: 0.05, lon: 111.65 },
  { id: 'wpt41', nama: 'SAGEA WALEH', kawasan: 'Sagea Waleh', provinsi: 'Maluku Utara', kabupaten: 'Halmahera Tengah', skpRingkasan: 'SKP (A,B,C,D)', spRingkasan: 'SP 2 WALEH, SP 3 WALEH', lat: -0.05, lon: 128.05 },
  { id: 'wpt42', nama: 'MUARA TAKUNG-KAMANG BARU', kawasan: 'Muara Takung - Kamang Baru', provinsi: 'Sumatera Barat', kabupaten: 'Sijunjung', skpRingkasan: 'KPB, SKP (A,B,C,D)', spRingkasan: 'SP 1 PADANG TAROK', lat: -0.6, lon: 100.95 },
  { id: 'wpt43', nama: 'PULAU BACAN', kawasan: 'Pulau Bacan', provinsi: 'Maluku Utara', kabupaten: 'Halmahera Selatan', skpRingkasan: 'KPB, SKP (A,B,C)', lat: -0.9, lon: 127.6 },
  { id: 'wpt44', nama: 'KLAMONO-SEGUN', kawasan: 'Klamono - Segun', provinsi: 'Papua Barat Daya', kabupaten: 'Sorong', skpRingkasan: 'KPB, SKP (A,B,C,D,E,F,G)', lat: -0.95, lon: 131.7 },
  { id: 'wpt45', nama: 'ARSEL KOLAM', kawasan: 'Arut Selatan dan Kota Waringin Lama', provinsi: 'Kalimantan Tengah', kabupaten: 'Kota Waringin Barat', skpRingkasan: 'SKP A RANGDA, SKP B RUNGUN, SKP C TANJUNG PUTRI', lat: -2.55, lon: 111.65 }
];

/**
 * Cleared rather than kept alongside the real WPT_SEED above: these were fully fabricated
 * illustrative sub-units (see git history) invented for the old 10-WPT placeholder, and none of
 * them correspond to any real SKP/SP in the Matriks 45 Kawasan source (which only has free-text
 * summaries — see Wpt.skpRingkasan/spRingkasan — not structured per-record data). Leaving them in
 * place with their old `indukWptId`s would just show as broken-FK rows against the new ids; an
 * empty list (same as the 16 placeholder masters' `EMPTY_SIMPLE_MASTER_SEED`) is the honest state
 * until someone provides real SKP/SP-level source data.
 */
export const SKP_SEED: Skp[] = [];

export const SP_SEED: Sp[] = [];

export const KOMODITI_SEED: Komoditi[] = [
  { id: 'kom1', nama: 'Padi' },
  { id: 'kom2', nama: 'Perkebunan' },
  { id: 'kom3', nama: 'Industri' }
];

export const PROGRAM_SEED: Program[] = [
  { id: 'prog1', jenisTransmigrasi: 'TRANSMIGRASI TUNTAS', singkatan: 'T2', keterangan: 'Trans Tuntas (kepastian hukum lahan): Fokus menyelesaikan sengketa, pendataan ulang, dan penerbitan sertifikat tanah agar status lahan di kawasan transmigrasi benar-benar jelas (clean and clear).' },
  { id: 'prog2', jenisTransmigrasi: 'TRANSMIGRASI LOKAL', singkatan: 'Lokal', keterangan: 'Trans Lokal (warga lokal sebagai pelaku utama): Menjadikan penduduk lokal di sekitar kawasan sebagai pelaku utama agar ikut merasakan manfaat pemerataan pembangunan.' },
  { id: 'prog3', jenisTransmigrasi: 'TRANSMIGRASI PATRIOT', singkatan: 'Patriot', keterangan: 'Trans Patriot (agen perubahan dari anak muda): Melibatkan generasi muda dan kaum terpelajar untuk membawa teknologi serta inovasi ke daerah transmigrasi.' },
  { id: 'prog4', jenisTransmigrasi: 'TRANSMIGRASI KARYA NUSA', singkatan: 'Karya Nusa', keterangan: 'Trans Karya Nusa (pertumbuhan ekonomi kawasan): Bertujuan menumbuhkan pusat-pusat ekonomi baru dan membuka lapangan kerja di wilayah transmigrasi.' },
  { id: 'prog5', jenisTransmigrasi: 'TRANSMIGRASI GOTONG ROYONG', singkatan: 'Gotorng Royong', keterangan: 'Trans Gotong Royong (kolaborasi lintas sektor): Membangun kerja sama yang kuat antara pemerintah pusat, daerah, masyarakat, dan dunia usaha atau swasta.' }
];

export const SATKER_SEED: Satker[] = [
  { id: 'sat1', nama: 'Menteri Transmigrasi', level: 1, eselon: 'Non-Eselon', keterangan: 'Pejabat Negara (Muhammad Iftitah Sulaiman Suryanagara)' },
  { id: 'sat2', nama: 'Wakil Menteri Transmigrasi', level: 2, eselon: 'Non-Eselon', keterangan: 'Pejabat Negara (Viva Yoga Mauladi)' },
  { id: 'sat3', nama: 'Sekretariat Jenderal', level: 3, eselon: 'Eselon I.a', keterangan: 'Unsur Pembina / Pendukung Administrasi' },
  { id: 'sat4', nama: 'Biro Perencanaan, Kerja Sama, dan Humas', level: 5, eselon: 'Eselon II.a', keterangan: 'Unsur Pelaksana Admin / Program' },
  { id: 'sat5', nama: 'Biro Keuangan dan BMN', level: 5, eselon: 'Eselon II.a', keterangan: 'Unsur Pengelolaan Keuangan & Aset' },
  { id: 'sat6', nama: 'Biro Organisasi, SDM, dan RB', level: 5, eselon: 'Eselon II.a', keterangan: 'Unsur Pengelolaan Kelembagaan & ASN' },
  { id: 'sat7', nama: 'Biro Hukum', level: 5, eselon: 'Eselon II.a', keterangan: 'Unsur Layanan Perundang-undangan' },
  { id: 'sat8', nama: 'Biro Umum dan Layanan Pengadaan', level: 5, eselon: 'Eselon II.a', keterangan: 'Unsur Rumah Tangga & Pengadaan' },
  { id: 'sat9', nama: 'Inspektorat Jenderal', level: 3, eselon: 'Eselon I.a', keterangan: 'Unsur Pengawas Internal' },
  { id: 'sat10', nama: 'Sekretariat Inspektorat Jenderal', level: 5, eselon: 'Eselon II.a', keterangan: 'Support Pengawasan' },
  { id: 'sat11', nama: 'Inspektorat I', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Audit & Pengawasan' },
  { id: 'sat12', nama: 'Inspektorat II', level: 6, eselon: 'Eselon II.a', keterangan: 'Pelaksana Audit & Pengawasan' },
  { id: 'sat13', nama: 'Ditjen Pembangunan & Pengembangan Kawasan Transmigrasi (PPK Transmigrasi)', level: 3, eselon: 'Eselon I.a', keterangan: 'Unsur Pelaksana Teknis Kawasan' },
  { id: 'sat14', nama: 'Sekretariat Direktorat Jenderal', level: 5, eselon: 'Eselon II.a', keterangan: 'Support Administrasi Ditjen' },
  { id: 'sat15', nama: 'Direktorat Perencanaan Perwujudan Kawasan Transmigrasi', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Perencanaan' },
  { id: 'sat16', nama: 'Direktorat Pembangunan Kawasan Transmigrasi', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Pembangunan' },
  { id: 'sat17', nama: 'Direktorat Fasilitas Penataan Persebaran Penduduk', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Sebaran Penduduk' },
  { id: 'sat18', nama: 'Direktorat Pengembangan Satuan Permukiman', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Permukiman' },
  { id: 'sat19', nama: 'Direktorat Pengembangan Kawasan Permukiman', level: 6, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Permukiman' },
  { id: 'sat20', nama: 'Ditjen Pengembangan Ekonomi & Pemberdayaan Masyarakat Transmigrasi (PEM Transmigrasi)', level: 3, eselon: 'Eselon I.a', keterangan: 'Unsur Pelaksana Teknis Pemberdayaan' },
  { id: 'sat21', nama: 'Sekretariat Direktorat Jenderal (PEM)', level: 5, eselon: 'Eselon II.a', keterangan: 'Support Administrasi Ditjen' },
  { id: 'sat22', nama: 'Direktorat Perencanaan Teknis Pengembangan Ekonomi dan Pemberdayaan', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Pengembangan' },
  { id: 'sat23', nama: 'Direktorat Pengembangan Kelembagaan & Ekonomi', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Pengembangan' },
  { id: 'sat24', nama: 'Direktorat Pengembangan Produk Unggulan', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Pengembangan' },
  { id: 'sat25', nama: 'Direktorat Promosi & Pemasaran', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Produk & Pemasaran' },
  { id: 'sat26', nama: 'Direktorat Pemberdayaan Masyarakat Transmigrasi', level: 5, eselon: 'Eselon II.a', keterangan: 'Pelaksana Teknis Pemberdayaan' },
  { id: 'sat27', nama: 'Staf Ahli Menteri', level: 4, eselon: 'Eselon I.b', keterangan: 'Unsur Pembantu Pimpinan (Bidang Teknis)' },
  { id: 'sat28', nama: 'Pusat Setrategi Kebijakan Transmigrasi', level: 3, eselon: 'Eselon II.a' },
  { id: 'sat29', nama: 'Pusat Pengembangan SDM', level: 3, eselon: 'Eselon II.a' },
  { id: 'sat30', nama: 'Pusat Data dan Informasi', level: 3, eselon: 'Eselon II.a' },
  { id: 'sat31', nama: 'Balai Besar Pelatihan', level: 6, eselon: 'Eselon I.b' },
  { id: 'sat32', nama: 'Balai Pelatihan', level: 6, eselon: 'Eselon III.a' }
];

export const PERSONEL_SEED: Personel[] = [
  // All 3 rows are the same person ("Suherman") with different Jabatan values — a known
  // data-quality gap inherited as-is from the ERD (data-manager/README.md).
  { id: 'per1', nama: 'Suherman', nip: '123456789012', golongan: 'IV-a', jabatan: 'Kepala', satkerId: 'sat14' },
  { id: 'per2', nama: 'Suherman', nip: '123456789012', golongan: 'IV-a', jabatan: 'Wakil Kepala', satkerId: 'sat14' },
  { id: 'per3', nama: 'Suherman', nip: '123456789012', golongan: 'IV-a', jabatan: 'Kepala', satkerId: 'sat14' }
];

export const IKU_SEED: Iku[] = [
  { id: 'iku1', kode: '1-CP', satkerLabel: 'Direktorat Pengembangan Kawasan Transmigrasi', satuan: 'Indeks', programId: 'prog1', indikator: 'Nilai rata-rata Indeks Transformasi 45 Kawasan Transmigrasi', pic: 'Elis Sampe Andi, S.E, M.M', sasaranStrategis: 'SS.1 Terwujudnya transformasi Kawasan transmigrasi menjadi pusat pertumbuhan lokal' },
  { id: 'iku2', kode: '2a-CP', satkerLabel: 'Direktur Fasilitas Penataan Persebaran Penduduk di Kawasan Transmigrasi (FP3KT)', satuan: 'Persen', programId: 'prog1', indikator: 'Persentase kepastian hukum status lahan yang terselesaikan', pic: 'La Ode Muhajirin, S.IP, M.Si', sasaranStrategis: 'SS.2 Meningkatnya persentase lahan transmigrasi yang tersertifikasi dan dimanfaatkan secara produktif' },
  { id: 'iku3', kode: '2b-CP', satkerLabel: 'Direktur Fasilitas Penataan Persebaran Penduduk di Kawasan Transmigrasi (FP3KT)', satuan: 'Persen', indikator: 'Persentase dukungan fasilitasi legalisasi tanah Transmigrasi', pic: 'La Ode Muhajirin, S.IP, M.Si', sasaranStrategis: 'SS.2 Meningkatnya persentase lahan transmigrasi yang tersertifikasi dan dimanfaatkan secara produktif' },
  { id: 'iku4', kode: '3a-CP', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase pembangunan prasarana, sarana, dan utilitas untuk transmigran lokal', pic: 'Robi Suherman Ponglabba, ST, MT', sasaranStrategis: 'SS.3 Terciptanya ekosistem dalam pengembangan kawasan yang berbasis potensi lokal dan penguatan kapasitas masyarakat transmigran' },
  { id: 'iku5', kode: '3b-CP', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase transmigran lokal yang ditempatkan', pic: 'Ria Fajarianti, S.E., M.M', sasaranStrategis: 'SS.3 Terciptanya ekosistem dalam pengembangan kawasan yang berbasis potensi lokal dan penguatan kapasitas masyarakat transmigran' },
  { id: 'iku6', kode: '4-CP', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase pembangunan prasarana, sarana, dan utilitas umum untuk transmigran patriot', pic: 'Robi Suherman Ponglabba, ST, MT', sasaranStrategis: 'SS.4 Terwujudnya SDM yang unggul melalui pendampingan dan transfer pengetahuan untuk mendukung kemandirian kawasan transmigrasi' },
  { id: 'iku7', kode: '5a-CP', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase pembangunan prasarana, sarana, dan utilitas umum untuk transmigran Karya Nusantara', pic: 'Robi Suherman Ponglabba, ST, MT', sasaranStrategis: 'SS.5 Terwujudnya pemerataan perekonomian di Indonesia melalui pengembangan kawasan ekonomi transmigrasi terintegrasi yang berdaya saing' },
  { id: 'iku8', kode: '5b-CP', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase transmigran yang ditempatkan melalui program Trans Karya Nusantara', pic: 'Ria Fajarianti, S.E., M.M', sasaranStrategis: 'SS.5 Terwujudnya pemerataan perekonomian di Indonesia melalui pengembangan kawasan ekonomi transmigrasi terintegrasi yang berdaya saing' },
  { id: 'iku9', kode: '6-CP', satkerLabel: 'Direktur Pengembangan Kawasan Transmigrasi', satuan: 'Indeks', indikator: 'Nilai rata-rata indeks transformasi Kawasan Transmigrasi Prioritas Kementerian', pic: 'Elis Sampe Andi, S.E, M.M', sasaranStrategis: 'SS.6 Terwujudnya kawasan transmigrasi yang mandiri dan berdaya saing melalui percepatan pembangunan infrastruktur dasar, penguatan ekonomi berbasis potensi daerah, serta integrasi sosial yang harmonis' },
  { id: 'iku10', kode: '7a-N', satkerLabel: 'Direktur Fasilitas Penataan Persebaran Penduduk di Kawasan Transmigrasi (FP3KT)', satuan: 'Persen', indikator: 'Persentase lahan transmigrasi yang telah terbit SK dan Sertipikat HPL Transmigrasi', pic: 'La Ode Muhajirin, S.IP, M.Si', sasaranStrategis: 'SS.7 Terselenggaranya legalisasi dan pemanfaatan lahan transmigrasi secara optimal guna menjamin kepastian hukum dan mendukung produktivitas kawasan transmigrasi' },
  { id: 'iku11', kode: '7b-N', satkerLabel: 'Direktur Fasilitas Penataan Persebaran Penduduk di Kawasan Transmigrasi (FP3KT)', satuan: 'Persen', indikator: 'Persentase tanah transmigrasi yang telah terbit sertipikat hak milik (SHM)', pic: 'Edy Wibowo, S.T., M.M', sasaranStrategis: 'SS.7 Terselenggaranya legalisasi dan pemanfaatan lahan transmigrasi secara optimal guna menjamin kepastian hukum dan mendukung produktivitas kawasan transmigrasi' },
  { id: 'iku12', kode: '8-N', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase Satuan Permukiman/Pusat Satuan Pengembangan/Kawasan Perkotaan Baru yang dibangun prasarana, sarana, dan utilitas umum untuk transmigrasi lokal', pic: 'Robi Suherman Ponglabba, ST, MT', sasaranStrategis: 'SS.8 Terwujudnya pembangunan Sarana, Prasarana dan Utilitas Umum dalam rangka penguatan pengembangan potensi lokal' },
  { id: 'iku13', satuan: 'Persen', indikator: 'Persentase Kepala Keluarga (KK) transmigran lokal yang ditempatkan di SP transmigrasi', pic: 'Ria Fajarianti, S.E., M.M', sasaranStrategis: 'SS.9 Terselenggaranya migrasi buatan dalam rangka penguatan pengembangan potensi lokal' },
  { id: 'iku14', kode: '10-N', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase Satuan Permukiman/Pusat Satuan Pengembangan/Kawasan Perkotaan Baru transmigrasi patriot yang dibangun prasarana, sarana, dan utilitas umum', pic: 'Robi Suherman Ponglabba, ST, MT', sasaranStrategis: 'SS.10 Terwujudnya pembangunan Sarana, Prasarana dan Utilitas Umum dalam rangka meningkatkan kualitas SDM di kawasan transmigrasi yang unggul, terampil, dan berdaya saing serta mampu mempercepat pembangunan dan kemandirian kawasan transmigrasi' },
  { id: 'iku15', kode: '11-N', satkerLabel: 'Direktur Pembangunan Kawasan Transmigrasi (PKT)', satuan: 'Persen', indikator: 'Persentase Satuan Permukiman/Pusat Satuan Pengembangan/Kawasan Perkotaan Baru transmigrasi Karya Nusantara yang dibangun prasarana, sarana, dan utilitas umum', pic: 'Robi Suherman Ponglabba, ST, MT', sasaranStrategis: 'SS.11 Terwujudnya pembangunan Sarana, Prasarana dan Utilitas Umum dalam rangka penguatan pengembangan kawasan ekonomi transmigrasi terintegrasi' },
  { id: 'iku16', satuan: 'Persen', indikator: 'Persentase jumlah Kepala Keluarga (KK) transmigran Karya Nusantara yang difasilitasi penempatannya', pic: 'Ria Fajarianti, S.E., M.M', sasaranStrategis: 'SS.12 Terselenggaranya migrasi buatan dalam rangka penguatan pengembangan kawasan ekonomi transmigrasi terintegrasi' },
  { id: 'iku17', kode: '13a-N', satkerLabel: 'Direktur Pengembangan Kawasan Transmigrasi', satuan: 'Persen', indikator: 'Persentase meningkatnya jumlah kawasan yang berdaya saing dan mandiri di 45 kawasan transmigrasi', pic: 'Elis Sampe Andi, S.E, M.M', sasaranStrategis: 'SS.13 Terwujudnya Kawasan transmigrasi yang mandiri melalui SDM yang berkualitas unggul' },
  { id: 'iku18', kode: '13b-N', satkerLabel: 'Direktur Pengembangan Kawasan Transmigrasi', satuan: 'Persen', indikator: 'Persentase meningkatnya jumlah kawasan yang berdaya saing dan mandiri di kawasan transmigrasi prioritas kementerian', pic: 'Elis Sampe Andi, S.E, M.M' },
  { id: 'iku19', kode: '14-N', satuan: 'Persen', indikator: 'Persentase realisasi implementasi Rencana Aksi Reformasi Birokrasi General, Tematik dan Transformasi Digital Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi', pic: 'Ir. Rajumber Prihatin, M.Si', sasaranStrategis: 'SS.14 Meningkatnya kualitas reformasi birokrasi dan kapasitas organisasi Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi' },
  { id: 'iku20', kode: '15-N', satuan: 'Nilai', indikator: 'Nilai Pengawasan Kearsipan Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi', pic: 'Ir. Rajumber Prihatin, M.Si', sasaranStrategis: 'SS.15 Meningkatnya layanan kearsipan Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi' },
  { id: 'iku21', kode: '16-N', satuan: 'Nilai', indikator: 'Tingkat penerapan pengendalian intern Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi', pic: 'Ir. Rajumber Prihatin, M.Si', sasaranStrategis: 'SS.16 Meningkatnya Penerapan Pengendalian Internal Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi' },
  { id: 'iku22', kode: '17-N', satuan: 'Nilai', indikator: 'Nilai SAKIP Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi', pic: 'Ir. Rajumber Prihatin, M.Si', sasaranStrategis: 'SS.17 Meningkatnya Akuntabilitas Kinerja Direktorat Jenderal Pembangunan dan Pengembangan Kawasan Transmigrasi' },
  // Source's own "unlabeled final row" — no kode/satker/satuan in the ERD, and indikator/
  // sasaranStrategis read as if their content were swapped. Transcribed as-is (not silently fixed),
  // same policy the original file's own header comment states.
  { id: 'iku23', pic: 'Ir. Rajumber Prihatin, M.Si', sasaranStrategis: 'Persentase pemenuhan program pembangunan dan pengembangan kawasan transmigrasi', indikator: '(belum diberi kode/satker di sumber ERD — lengkapi saat diverifikasi)' }
];

/**
 * No seed rows for the 16 "Data Master"/"Settings" entities added later (see entity-key.model.ts,
 * entity-configs.ts) — there's no source spreadsheet for these yet, unlike the 8 above, so an empty
 * list is more honest than inventing illustrative rows for a schema (SimpleMaster: nama + optional
 * keterangan) that's itself a placeholder pending real field requirements.
 */
export const EMPTY_SIMPLE_MASTER_SEED: SimpleMaster[] = [];
