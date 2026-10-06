import { Komoditi } from '../models/komoditi.model';
import { Wpt } from '../models/wpt.model';

/**
 * Master-data fields filled from the dashboard's Profil Kawasan figures (profilDetailData()), one
 * entry per WPT id in the same order as the 45 kawasan. A static snapshot on purpose: Data Manager
 * has no runtime link to the dashboard (see CLAUDE.md), so re-generate this file if the Profil
 * figures change. Illustrative like the rest of the dashboard data, not surveyed values.
 *
 * Merged OVER the real spreadsheet columns in WPT_SEED (seed-data.ts), which stay untouched; it
 * only adds fields the spreadsheet does not have (area, population, villages, SHM, commodities).
 */
export const WPT_PROFIL_FIELDS: { [wptId: string]: Partial<Wpt> } = {
  wpt1: { luasKawasanHa: 7853, hplTotal: 7853, shmTotal: 3238, shmPersentase: 41.2, jumlahPenduduk: 5792, jumlahDesa: 5, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt2: { luasKawasanHa: 8821, hplTotal: 8821, shmTotal: 1125, shmPersentase: 12.8, jumlahPenduduk: 2920, jumlahDesa: 15, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom8' },
  wpt3: { luasKawasanHa: 10876, hplTotal: 10876, shmTotal: 3740, shmPersentase: 34.4, jumlahPenduduk: 7342, jumlahDesa: 9, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt4: { luasKawasanHa: 5962, hplTotal: 5962, shmTotal: 3459, shmPersentase: 58, jumlahPenduduk: 11027, jumlahDesa: 12, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom8' },
  wpt5: { luasKawasanHa: 7784, hplTotal: 7784, shmTotal: 3063, shmPersentase: 39.3, jumlahPenduduk: 6385, jumlahDesa: 10, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom10' },
  wpt6: { luasKawasanHa: 5697, hplTotal: 5697, shmTotal: 709, shmPersentase: 12.4, jumlahPenduduk: 3194, jumlahDesa: 5, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom8' },
  wpt7: { luasKawasanHa: 3269, hplTotal: 3269, shmTotal: 2223, shmPersentase: 68, jumlahPenduduk: 7853, jumlahDesa: 14, komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom11' },
  wpt8: { luasKawasanHa: 616699, hplTotal: 7804, shmTotal: 5266, shmPersentase: 67.5, jumlahPenduduk: 78507, jumlahDesa: 64, komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom8' },
  wpt9: { luasKawasanHa: 11683, hplTotal: 11683, shmTotal: 6719, shmPersentase: 57.5, jumlahPenduduk: 10011, jumlahDesa: 10, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt10: { luasKawasanHa: 6850, hplTotal: 6850, shmTotal: 2246, shmPersentase: 32.8, jumlahPenduduk: 6857, jumlahDesa: 12, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt11: { luasKawasanHa: 13094, hplTotal: 13094, shmTotal: 5513, shmPersentase: 42.1, jumlahPenduduk: 5616, jumlahDesa: 8, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt12: { luasKawasanHa: 10862, hplTotal: 10862, shmTotal: 2232, shmPersentase: 20.5, jumlahPenduduk: 4454, jumlahDesa: 15, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt13: { luasKawasanHa: 5356, hplTotal: 5356, shmTotal: 3002, shmPersentase: 56, jumlahPenduduk: 8015, jumlahDesa: 9, komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom8' },
  wpt14: { luasKawasanHa: 6805, hplTotal: 6805, shmTotal: 6302, shmPersentase: 92.6, jumlahPenduduk: 11332, jumlahDesa: 5, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt15: { luasKawasanHa: 8977, hplTotal: 8977, shmTotal: 1950, shmPersentase: 21.7, jumlahPenduduk: 3204, jumlahDesa: 6, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt16: { luasKawasanHa: 6059, hplTotal: 6059, shmTotal: 2068, shmPersentase: 34.1, jumlahPenduduk: 7348, jumlahDesa: 11, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom8' },
  wpt17: { luasKawasanHa: 5802, hplTotal: 5802, shmTotal: 3512, shmPersentase: 60.5, jumlahPenduduk: 8398, jumlahDesa: 14, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
  wpt18: { luasKawasanHa: 5302, hplTotal: 5302, shmTotal: 761, shmPersentase: 14.4, jumlahPenduduk: 5105, jumlahDesa: 6, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom8' },
  wpt19: { luasKawasanHa: 8946, hplTotal: 8946, shmTotal: 5737, shmPersentase: 64.1, jumlahPenduduk: 7607, jumlahDesa: 13, komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom10' },
  wpt20: { luasKawasanHa: 3757, hplTotal: 3757, shmTotal: 620, shmPersentase: 16.5, jumlahPenduduk: 4679, jumlahDesa: 4, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom9' },
  wpt21: { luasKawasanHa: 6309, hplTotal: 6309, shmTotal: 4215, shmPersentase: 66.8, jumlahPenduduk: 10970, jumlahDesa: 5, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt22: { luasKawasanHa: 13730, hplTotal: 13730, shmTotal: 5286, shmPersentase: 38.5, jumlahPenduduk: 8207, jumlahDesa: 14, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt23: { luasKawasanHa: 7901, hplTotal: 7901, shmTotal: 1329, shmPersentase: 16.8, jumlahPenduduk: 5692, jumlahDesa: 4, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom9' },
  wpt24: { luasKawasanHa: 12577, hplTotal: 12577, shmTotal: 5290, shmPersentase: 42.1, jumlahPenduduk: 6599, jumlahDesa: 12, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom11' },
  wpt25: { luasKawasanHa: 6279, hplTotal: 6279, shmTotal: 2332, shmPersentase: 37.1, jumlahPenduduk: 5705, jumlahDesa: 7, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
  wpt26: { luasKawasanHa: 7601, hplTotal: 7601, shmTotal: 2906, shmPersentase: 38.2, jumlahPenduduk: 8148, jumlahDesa: 4, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt27: { luasKawasanHa: 10650, hplTotal: 10650, shmTotal: 4392, shmPersentase: 41.2, jumlahPenduduk: 8450, jumlahDesa: 9, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt28: { luasKawasanHa: 12347, hplTotal: 12347, shmTotal: 8017, shmPersentase: 64.9, jumlahPenduduk: 9300, jumlahDesa: 9, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt29: { luasKawasanHa: 6059, hplTotal: 6059, shmTotal: 1346, shmPersentase: 22.2, jumlahPenduduk: 4255, jumlahDesa: 7, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom11' },
  wpt30: { luasKawasanHa: 8498, hplTotal: 8498, shmTotal: 3521, shmPersentase: 41.4, jumlahPenduduk: 5551, jumlahDesa: 3, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt31: { luasKawasanHa: 5057, hplTotal: 5057, shmTotal: 944, shmPersentase: 18.7, jumlahPenduduk: 4433, jumlahDesa: 13, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt32: { luasKawasanHa: 4572, hplTotal: 4572, shmTotal: 2850, shmPersentase: 62.3, jumlahPenduduk: 9767, jumlahDesa: 9, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom10' },
  wpt33: { luasKawasanHa: 6661, hplTotal: 6661, shmTotal: 4469, shmPersentase: 67.1, jumlahPenduduk: 9626, jumlahDesa: 15, komoditiUnggulanId: 'kom6', komoditiPendukungId: 'kom11' },
  wpt34: { luasKawasanHa: 9592, hplTotal: 9592, shmTotal: 4028, shmPersentase: 42, jumlahPenduduk: 6048, jumlahDesa: 3, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom11' },
  wpt35: { luasKawasanHa: 8728, hplTotal: 8728, shmTotal: 8192, shmPersentase: 93.9, jumlahPenduduk: 13015, jumlahDesa: 11, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt36: { luasKawasanHa: 12021, hplTotal: 12021, shmTotal: 4900, shmPersentase: 40.8, jumlahPenduduk: 7749, jumlahDesa: 14, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt37: { luasKawasanHa: 7589, hplTotal: 7589, shmTotal: 2536, shmPersentase: 33.4, jumlahPenduduk: 8538, jumlahDesa: 4, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom8' },
  wpt38: { luasKawasanHa: 8758, hplTotal: 8758, shmTotal: 1555, shmPersentase: 17.8, jumlahPenduduk: 5889, jumlahDesa: 8, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom9' },
  wpt39: { luasKawasanHa: 10936, hplTotal: 10936, shmTotal: 6134, shmPersentase: 56.1, jumlahPenduduk: 7613, jumlahDesa: 4, komoditiUnggulanId: 'kom4', komoditiPendukungId: 'kom8' },
  wpt40: { luasKawasanHa: 11551, hplTotal: 11551, shmTotal: 2361, shmPersentase: 20.4, jumlahPenduduk: 5773, jumlahDesa: 7, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt41: { luasKawasanHa: 7859, hplTotal: 7859, shmTotal: 1726, shmPersentase: 22, jumlahPenduduk: 5441, jumlahDesa: 4, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt42: { luasKawasanHa: 9482, hplTotal: 9482, shmTotal: 1815, shmPersentase: 19.1, jumlahPenduduk: 5186, jumlahDesa: 9, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom10' },
  wpt43: { luasKawasanHa: 7665, hplTotal: 7665, shmTotal: 1206, shmPersentase: 15.7, jumlahPenduduk: 3729, jumlahDesa: 14, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
  wpt44: { luasKawasanHa: 7030, hplTotal: 7030, shmTotal: 1636, shmPersentase: 23.3, jumlahPenduduk: 5724, jumlahDesa: 10, komoditiUnggulanId: 'kom7', komoditiPendukungId: 'kom11' },
  wpt45: { luasKawasanHa: 7657, hplTotal: 7657, shmTotal: 1245, shmPersentase: 16.3, jumlahPenduduk: 3797, jumlahDesa: 6, komoditiUnggulanId: 'kom5', komoditiPendukungId: 'kom9' },
};

/** Commodities the Profil Kawasan page can name as a kawasan's produk unggulan (4 per category). */
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
