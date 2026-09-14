import { Iku } from '../models/iku.model';
import { Komoditi } from '../models/komoditi.model';
import { Personel } from '../models/personel.model';
import { Program } from '../models/program.model';
import { Satker } from '../models/satker.model';
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

export const WPT_SEED: Wpt[] = [
  { id: 'wpt1', nama: 'WPT Lunang Silaut', provinsi: 'Sumatera Barat', kabupaten: 'Pesisir Selatan' },
  { id: 'wpt2', nama: 'WPT Mesuji', provinsi: 'Lampung', kabupaten: 'Mesuji' },
  { id: 'wpt3', nama: 'WPT Rasau Jaya', provinsi: 'Kalimantan Barat', kabupaten: 'Kubu Raya' },
  { id: 'wpt4', nama: 'WPT Teluk Dalam', provinsi: 'Kalimantan Timur', kabupaten: 'Kutai Kartanegara' },
  { id: 'wpt5', nama: 'WPT Batulicin', provinsi: 'Kalimantan Selatan', kabupaten: 'Tanah Bumbu' },
  { id: 'wpt6', nama: 'WPT Maluku Tengah', provinsi: 'Maluku', kabupaten: 'Maluku Tengah' },
  { id: 'wpt7', nama: 'WPT Tobadak', provinsi: 'Sulawesi Barat', kabupaten: 'Mamuju Tengah' },
  { id: 'wpt8', nama: 'WPT Salor / Merauke', provinsi: 'Papua Selatan', kabupaten: 'Merauke' },
  { id: 'wpt9', nama: 'WPT Timika / SP-Jagamin', provinsi: 'Papua Tengah', kabupaten: 'Mimika' },
  { id: 'wpt10', nama: 'WPT Labuan Uki', provinsi: 'Sulawesi Utara', kabupaten: 'Bolaang Mongondow' }
];

export const SKP_SEED: Skp[] = [
  { id: 'skp1', nama: 'SKP A Lunang', provinsi: 'Sumatera Barat', kabupaten: 'Pesisir Selatan', indukWptId: 'wpt1', cakupanSp: 'SP 1 Lunang, SP 2 Lunang, SP 3 Lunang' },
  { id: 'skp2', nama: 'SKP B Silaut', provinsi: 'Sumatera Barat', kabupaten: 'Pesisir Selatan', indukWptId: 'wpt1', cakupanSp: 'SP 1 Silaut, SP 2 Silaut, SP 3 Silaut' },
  { id: 'skp3', nama: 'SKP C Mesuji Pusat', provinsi: 'Lampung', kabupaten: 'Mesuji', indukWptId: 'wpt2', cakupanSp: 'SP 1 Mesuji, SP 2 Mesuji, SP Kota Terpadu Mandiri' },
  { id: 'skp4', nama: 'SKP A Rasau', provinsi: 'Kalimantan Barat', kabupaten: 'Kubu Raya', indukWptId: 'wpt3', cakupanSp: 'SP 1 Rasau Jaya I, SP 2 Rasau Jaya II' },
  { id: 'skp5', nama: 'SKP B Sungai Raya', provinsi: 'Kalimantan Barat', kabupaten: 'Kubu Raya', indukWptId: 'wpt3', cakupanSp: 'SP 3 Rasau Jaya III, SP 4 Sungai Raya' },
  { id: 'skp6', nama: 'SKP A Tenggarong', provinsi: 'Kalimantan Timur', kabupaten: 'Kutai Kartanegara', indukWptId: 'wpt4', cakupanSp: 'SP 1 Tenggarong Seberang, SP 2 Tenggarong Seberang' },
  { id: 'skp7', nama: 'SKP B Sebulu', provinsi: 'Kalimantan Timur', kabupaten: 'Kutai Kartanegara', indukWptId: 'wpt4', cakupanSp: 'SP 1 Sebulu, SP 2 Sebulu' },
  { id: 'skp8', nama: 'SKP A Tobadak', provinsi: 'Sulawesi Barat', kabupaten: 'Mamuju Tengah', indukWptId: 'wpt7', cakupanSp: 'SP 1 Tobadak, SP 2 Tobadak, SP 3 Tobadak' },
  { id: 'skp9', nama: 'SKP A Salor', provinsi: 'Papua Selatan', kabupaten: 'Merauke', indukWptId: 'wpt8', cakupanSp: 'SP 1 Salor, SP 2 Salor' },
  { id: 'skp10', nama: 'SKP B Kurik', provinsi: 'Papua Selatan', kabupaten: 'Merauke', indukWptId: 'wpt8', cakupanSp: 'SP 3 Kurik, SP 4 Kurik' }
];

export const SP_SEED: Sp[] = [
  { id: 'sp1', nama: 'SP 1 Lunang', jenisStatus: 'SP Bina / PUG', provinsi: 'Sumatera Barat', kabupaten: 'Pesisir Selatan', indukSkpId: 'skp1', indukWptId: 'wpt1', kk: 500 },
  { id: 'sp2', nama: 'SP 2 Silaut', jenisStatus: 'SP Mandiri', provinsi: 'Sumatera Barat', kabupaten: 'Pesisir Selatan', indukSkpId: 'skp2', indukWptId: 'wpt1' },
  { id: 'sp3', nama: 'SP 1 Mesuji', jenisStatus: 'SP Bina', provinsi: 'Lampung', kabupaten: 'Mesuji', indukSkpId: 'skp3', indukWptId: 'wpt2' },
  { id: 'sp4', nama: 'SP KTM Mesuji', jenisStatus: 'SP Kota Terpadu', provinsi: 'Lampung', kabupaten: 'Mesuji', indukSkpId: 'skp3', indukWptId: 'wpt2' },
  { id: 'sp5', nama: 'SP 1 Rasau Jaya I', jenisStatus: 'SP Swakarsa', provinsi: 'Kalimantan Barat', kabupaten: 'Kubu Raya', indukSkpId: 'skp4', indukWptId: 'wpt3' },
  { id: 'sp6', nama: 'SP 2 Rasau Jaya II', jenisStatus: 'SP Mandiri', provinsi: 'Kalimantan Barat', kabupaten: 'Kubu Raya', indukSkpId: 'skp4', indukWptId: 'wpt3' },
  { id: 'sp7', nama: 'SP 1 Tenggarong Seberang', jenisStatus: 'SP Mandiri', provinsi: 'Kalimantan Timur', kabupaten: 'Kutai Kartanegara', indukSkpId: 'skp6', indukWptId: 'wpt4' },
  { id: 'sp8', nama: 'SP 2 Sebulu', jenisStatus: 'SP Bina', provinsi: 'Kalimantan Timur', kabupaten: 'Kutai Kartanegara', indukSkpId: 'skp7', indukWptId: 'wpt4' },
  { id: 'sp9', nama: 'SP 1 Tobadak', jenisStatus: 'SP Bina', provinsi: 'Sulawesi Barat', kabupaten: 'Mamuju Tengah', indukSkpId: 'skp8', indukWptId: 'wpt7' },
  { id: 'sp10', nama: 'SP 1 Salor', jenisStatus: 'SP Mandiri', provinsi: 'Papua Selatan', kabupaten: 'Merauke', indukSkpId: 'skp9', indukWptId: 'wpt8' },
  { id: 'sp11', nama: 'SP 3 Kurik', jenisStatus: 'SP Bina', provinsi: 'Papua Selatan', kabupaten: 'Merauke', indukSkpId: 'skp10', indukWptId: 'wpt8' },
  // Dangling in the source ERD: references "SKP A Timika" / "WPT Timika", neither of which exists
  // as a record (the WPT sheet only has "WPT Timika / SP-Jagamin" = wpt9). Left null rather than
  // guessed — see Sp.indukSkpId doc comment and data-manager/README.md.
  { id: 'sp12', nama: 'SP 1 Timika', jenisStatus: 'SP Bina', provinsi: 'Papua Tengah', kabupaten: 'Mimika', indukSkpId: null, indukWptId: null }
];

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
