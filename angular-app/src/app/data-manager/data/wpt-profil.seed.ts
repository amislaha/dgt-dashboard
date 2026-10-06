import { Komoditi } from '../models/komoditi.model';
import { Wpt } from '../models/wpt.model';

/**
 * Master-data fields filled from the dashboard's Profil Kawasan figures (profilDetailData()), one
 * entry per WPT id in the same order as the 45 kawasan. A static snapshot on purpose: Data Manager
 * has no runtime link to the dashboard (see CLAUDE.md), so re-generate this file if the Profil
 * figures change. Illustrative like the rest of the dashboard data, not surveyed values (Salor:
 * from the TEP 2025 reports).
 *
 * Merged OVER the real spreadsheet columns in WPT_SEED (seed-data.ts), which stay untouched; it
 * only adds fields the spreadsheet does not have. SHM figures are certificate counts (bidang), as
 * the form's "total / terbit / belum terbit" fields are; the land areas (ha) live in Profil Wilayah.
 */
export const WPT_PROFIL_FIELDS: { [wptId: string]: Partial<Wpt> } = {
  wpt1: { luasKawasanHa: 7853, jumlahPenduduk: 5792, jumlahDesa: 5, kapasitasMaksimum: 162, shmTotal: 145, shmTerbit: 60, shmBelumTerbit: 85, shmPersentase: 41, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt2: { luasKawasanHa: 8821, jumlahPenduduk: 2920, jumlahDesa: 15, kapasitasMaksimum: 82, shmTotal: 73, shmTerbit: 9, shmBelumTerbit: 64, shmPersentase: 12, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom8' },
  wpt3: { luasKawasanHa: 10876, jumlahPenduduk: 7342, jumlahDesa: 9, kapasitasMaksimum: 206, shmTotal: 184, shmTerbit: 63, shmBelumTerbit: 121, shmPersentase: 34, wilayahStatusId: 'wst4', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt4: { luasKawasanHa: 5962, jumlahPenduduk: 11027, jumlahDesa: 12, kapasitasMaksimum: 309, shmTotal: 276, shmTerbit: 160, shmBelumTerbit: 116, shmPersentase: 58, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom8' },
  wpt5: { luasKawasanHa: 7784, jumlahPenduduk: 6385, jumlahDesa: 10, kapasitasMaksimum: 179, shmTotal: 160, shmTerbit: 63, shmBelumTerbit: 97, shmPersentase: 39, wilayahStatusId: 'wst4', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom10' },
  wpt6: { luasKawasanHa: 5697, jumlahPenduduk: 3194, jumlahDesa: 5, kapasitasMaksimum: 89, shmTotal: 80, shmTerbit: 10, shmBelumTerbit: 70, shmPersentase: 13, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom8' },
  wpt7: { luasKawasanHa: 3269, jumlahPenduduk: 7853, jumlahDesa: 14, kapasitasMaksimum: 220, shmTotal: 196, shmTerbit: 133, shmBelumTerbit: 63, shmPersentase: 68, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom11' },
  wpt8: { luasKawasanHa: 616699, jumlahPenduduk: 78507, jumlahDesa: 64, kapasitasMaksimum: 2198, shmTotal: 1963, shmTerbit: 1325, shmBelumTerbit: 638, shmPersentase: 67, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom8' },
  wpt9: { luasKawasanHa: 11683, jumlahPenduduk: 10011, jumlahDesa: 10, kapasitasMaksimum: 280, shmTotal: 250, shmTerbit: 144, shmBelumTerbit: 106, shmPersentase: 58, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt10: { luasKawasanHa: 6850, jumlahPenduduk: 6857, jumlahDesa: 12, kapasitasMaksimum: 192, shmTotal: 171, shmTerbit: 56, shmBelumTerbit: 115, shmPersentase: 33, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt11: { luasKawasanHa: 13094, jumlahPenduduk: 5616, jumlahDesa: 8, kapasitasMaksimum: 157, shmTotal: 140, shmTerbit: 59, shmBelumTerbit: 81, shmPersentase: 42, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt12: { luasKawasanHa: 10862, jumlahPenduduk: 4454, jumlahDesa: 15, kapasitasMaksimum: 125, shmTotal: 111, shmTerbit: 23, shmBelumTerbit: 88, shmPersentase: 21, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt13: { luasKawasanHa: 5356, jumlahPenduduk: 8015, jumlahDesa: 9, kapasitasMaksimum: 224, shmTotal: 200, shmTerbit: 112, shmBelumTerbit: 88, shmPersentase: 56, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom8' },
  wpt14: { luasKawasanHa: 6805, jumlahPenduduk: 11332, jumlahDesa: 5, kapasitasMaksimum: 317, shmTotal: 283, shmTerbit: 262, shmBelumTerbit: 21, shmPersentase: 93, wilayahStatusId: 'wst5', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt15: { luasKawasanHa: 8977, jumlahPenduduk: 3204, jumlahDesa: 6, kapasitasMaksimum: 90, shmTotal: 80, shmTerbit: 17, shmBelumTerbit: 63, shmPersentase: 21, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt16: { luasKawasanHa: 6059, jumlahPenduduk: 7348, jumlahDesa: 11, kapasitasMaksimum: 206, shmTotal: 184, shmTerbit: 63, shmBelumTerbit: 121, shmPersentase: 34, wilayahStatusId: 'wst4', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt17: { luasKawasanHa: 5802, jumlahPenduduk: 8398, jumlahDesa: 14, kapasitasMaksimum: 235, shmTotal: 210, shmTerbit: 127, shmBelumTerbit: 83, shmPersentase: 60, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
  wpt18: { luasKawasanHa: 5302, jumlahPenduduk: 5105, jumlahDesa: 6, kapasitasMaksimum: 143, shmTotal: 128, shmTerbit: 18, shmBelumTerbit: 110, shmPersentase: 14, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom8' },
  wpt19: { luasKawasanHa: 8946, jumlahPenduduk: 7607, jumlahDesa: 13, kapasitasMaksimum: 213, shmTotal: 190, shmTerbit: 122, shmBelumTerbit: 68, shmPersentase: 64, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom10' },
  wpt20: { luasKawasanHa: 3757, jumlahPenduduk: 4679, jumlahDesa: 4, kapasitasMaksimum: 131, shmTotal: 117, shmTerbit: 19, shmBelumTerbit: 98, shmPersentase: 16, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom9' },
  wpt21: { luasKawasanHa: 6309, jumlahPenduduk: 10970, jumlahDesa: 5, kapasitasMaksimum: 307, shmTotal: 274, shmTerbit: 183, shmBelumTerbit: 91, shmPersentase: 67, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt22: { luasKawasanHa: 13730, jumlahPenduduk: 8207, jumlahDesa: 14, kapasitasMaksimum: 230, shmTotal: 205, shmTerbit: 79, shmBelumTerbit: 126, shmPersentase: 39, wilayahStatusId: 'wst4', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt23: { luasKawasanHa: 7901, jumlahPenduduk: 5692, jumlahDesa: 4, kapasitasMaksimum: 159, shmTotal: 142, shmTerbit: 24, shmBelumTerbit: 118, shmPersentase: 17, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom9' },
  wpt24: { luasKawasanHa: 12577, jumlahPenduduk: 6599, jumlahDesa: 12, kapasitasMaksimum: 185, shmTotal: 165, shmTerbit: 69, shmBelumTerbit: 96, shmPersentase: 42, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom11' },
  wpt25: { luasKawasanHa: 6279, jumlahPenduduk: 5705, jumlahDesa: 7, kapasitasMaksimum: 160, shmTotal: 143, shmTerbit: 53, shmBelumTerbit: 90, shmPersentase: 37, wilayahStatusId: 'wst4', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
  wpt26: { luasKawasanHa: 7601, jumlahPenduduk: 8148, jumlahDesa: 4, kapasitasMaksimum: 228, shmTotal: 204, shmTerbit: 78, shmBelumTerbit: 126, shmPersentase: 38, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt27: { luasKawasanHa: 10650, jumlahPenduduk: 8450, jumlahDesa: 9, kapasitasMaksimum: 237, shmTotal: 211, shmTerbit: 87, shmBelumTerbit: 124, shmPersentase: 41, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt28: { luasKawasanHa: 12347, jumlahPenduduk: 9300, jumlahDesa: 9, kapasitasMaksimum: 260, shmTotal: 233, shmTerbit: 151, shmBelumTerbit: 82, shmPersentase: 65, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt29: { luasKawasanHa: 6059, jumlahPenduduk: 4255, jumlahDesa: 7, kapasitasMaksimum: 119, shmTotal: 106, shmTerbit: 24, shmBelumTerbit: 82, shmPersentase: 23, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom11' },
  wpt30: { luasKawasanHa: 8498, jumlahPenduduk: 5551, jumlahDesa: 3, kapasitasMaksimum: 155, shmTotal: 139, shmTerbit: 58, shmBelumTerbit: 81, shmPersentase: 42, wilayahStatusId: 'wst4', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt31: { luasKawasanHa: 5057, jumlahPenduduk: 4433, jumlahDesa: 13, kapasitasMaksimum: 124, shmTotal: 111, shmTerbit: 21, shmBelumTerbit: 90, shmPersentase: 19, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt32: { luasKawasanHa: 4572, jumlahPenduduk: 9767, jumlahDesa: 9, kapasitasMaksimum: 273, shmTotal: 244, shmTerbit: 152, shmBelumTerbit: 92, shmPersentase: 62, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt33: { luasKawasanHa: 6661, jumlahPenduduk: 9626, jumlahDesa: 15, kapasitasMaksimum: 270, shmTotal: 241, shmTerbit: 162, shmBelumTerbit: 79, shmPersentase: 67, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom11' },
  wpt34: { luasKawasanHa: 9592, jumlahPenduduk: 6048, jumlahDesa: 3, kapasitasMaksimum: 169, shmTotal: 151, shmTerbit: 63, shmBelumTerbit: 88, shmPersentase: 42, wilayahStatusId: 'wst4', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt35: { luasKawasanHa: 8728, jumlahPenduduk: 13015, jumlahDesa: 11, kapasitasMaksimum: 364, shmTotal: 325, shmTerbit: 305, shmBelumTerbit: 20, shmPersentase: 94, wilayahStatusId: 'wst5', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt36: { luasKawasanHa: 12021, jumlahPenduduk: 7749, jumlahDesa: 14, kapasitasMaksimum: 217, shmTotal: 194, shmTerbit: 79, shmBelumTerbit: 115, shmPersentase: 41, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt37: { luasKawasanHa: 7589, jumlahPenduduk: 8538, jumlahDesa: 4, kapasitasMaksimum: 239, shmTotal: 213, shmTerbit: 71, shmBelumTerbit: 142, shmPersentase: 33, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom8' },
  wpt38: { luasKawasanHa: 8758, jumlahPenduduk: 5889, jumlahDesa: 8, kapasitasMaksimum: 165, shmTotal: 147, shmTerbit: 26, shmBelumTerbit: 121, shmPersentase: 18, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom9' },
  wpt39: { luasKawasanHa: 10936, jumlahPenduduk: 7613, jumlahDesa: 4, kapasitasMaksimum: 213, shmTotal: 190, shmTerbit: 107, shmBelumTerbit: 83, shmPersentase: 56, wilayahStatusId: 'wst2', komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom8' },
  wpt40: { luasKawasanHa: 11551, jumlahPenduduk: 5773, jumlahDesa: 7, kapasitasMaksimum: 162, shmTotal: 144, shmTerbit: 29, shmBelumTerbit: 115, shmPersentase: 20, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt41: { luasKawasanHa: 7859, jumlahPenduduk: 5441, jumlahDesa: 4, kapasitasMaksimum: 152, shmTotal: 136, shmTerbit: 30, shmBelumTerbit: 106, shmPersentase: 22, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt42: { luasKawasanHa: 9482, jumlahPenduduk: 5186, jumlahDesa: 9, kapasitasMaksimum: 145, shmTotal: 130, shmTerbit: 25, shmBelumTerbit: 105, shmPersentase: 19, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt43: { luasKawasanHa: 7665, jumlahPenduduk: 3729, jumlahDesa: 14, kapasitasMaksimum: 104, shmTotal: 93, shmTerbit: 15, shmBelumTerbit: 78, shmPersentase: 16, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
  wpt44: { luasKawasanHa: 7030, jumlahPenduduk: 5724, jumlahDesa: 10, kapasitasMaksimum: 160, shmTotal: 143, shmTerbit: 33, shmBelumTerbit: 110, shmPersentase: 23, wilayahStatusId: 'wst1', komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt45: { luasKawasanHa: 7657, jumlahPenduduk: 3797, jumlahDesa: 6, kapasitasMaksimum: 106, shmTotal: 95, shmTerbit: 15, shmBelumTerbit: 80, shmPersentase: 16, wilayahStatusId: 'wst3', komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
};

/** Commodities the Profil Kawasan page can name as a kawasan's produk unggulan. */
export const KOMODITI_PROFIL_SEED: Komoditi[] = [
  { id: 'kom4', code: 'PGN-01', nama: 'Padi Sawah', description: 'Pangan', sequence: 1, active: true },
  { id: 'kom5', code: 'PGN-02', nama: 'Jagung', description: 'Pangan', sequence: 2, active: true },
  { id: 'kom6', code: 'PGN-03', nama: 'Ubi Kayu', description: 'Pangan', sequence: 3, active: true },
  { id: 'kom7', code: 'PGN-04', nama: 'Kedelai', description: 'Pangan', sequence: 4, active: true },
  { id: 'kom8', code: 'PTN-01', nama: 'Sapi Potong', description: 'Peternakan', sequence: 5, active: true },
  { id: 'kom9', code: 'PTN-02', nama: 'Ayam Petelur', description: 'Peternakan', sequence: 6, active: true },
  { id: 'kom10', code: 'PTN-03', nama: 'Kambing', description: 'Peternakan', sequence: 7, active: true },
  { id: 'kom11', code: 'PTN-04', nama: 'Itik', description: 'Peternakan', sequence: 8, active: true },
  { id: 'kom12', code: 'PKB-01', nama: 'Kelapa Sawit', description: 'Perkebunan', sequence: 9, active: true },
  { id: 'kom13', code: 'PKB-02', nama: 'Karet', description: 'Perkebunan', sequence: 10, active: true },
  { id: 'kom14', code: 'PKB-03', nama: 'Kopi', description: 'Perkebunan', sequence: 11, active: true },
  { id: 'kom15', code: 'PKB-04', nama: 'Kakao', description: 'Perkebunan', sequence: 12, active: true },
  { id: 'kom16', code: 'PTB-01', nama: 'Batu Gamping', description: 'Pertambangan', sequence: 13, active: true },
  { id: 'kom17', code: 'PTB-02', nama: 'Pasir Kuarsa', description: 'Pertambangan', sequence: 14, active: true },
  { id: 'kom18', code: 'PTB-03', nama: 'Nikel Laterit', description: 'Pertambangan', sequence: 15, active: true },
  { id: 'kom19', code: 'PTB-04', nama: 'Emas Rakyat', description: 'Pertambangan', sequence: 16, active: true },
  { id: 'kom20', code: 'PKB-05', nama: 'Sagu', description: 'Perkebunan', sequence: 17, active: true },
];
