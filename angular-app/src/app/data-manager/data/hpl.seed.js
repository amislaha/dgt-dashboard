"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hpl_model_1 = require("../models/hpl.model");
const seed_data_1 = require("./seed-data");
/**
 * Illustrative HPL lokasi — fabricated, like the rest of the dashboard's figures (see CLAUDE.md
 * "Data layer"); only the kawasan they sit in (and so provinsi/kabupaten/approximate position) come
 * from the real WPT_SEED. Generated deterministically (fixed-seed PRNG) so every browser starts from
 * the same rows: 1–3 HPL per kawasan, a few km apart around the kawasan's own lat/lon.
 */
function prng(seed) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}
const SK_CODE = ['DA', 'BPN', 'KEM-ATR/BPN'];
function buildSeed() {
    const rand = prng(20261019);
    const out = [];
    seed_data_1.WPT_SEED.forEach(w => {
        const count = 1 + Math.floor(rand() * 3);
        for (let i = 0; i < count; i++) {
            const gen = rand() < 0.45 ? 0 : rand() < 0.5 ? 1 : 2;
            const tahun = gen === 0 ? 1976 + Math.floor(rand() * 14) : gen === 1 ? 1990 + Math.floor(rand() * 10) : 2000 + Math.floor(rand() * 25);
            const luas = Math.round((150 + rand() * (gen === 0 ? 6000 : 1800)) * 100) / 100;
            const certified = gen === 2 ? rand() < 0.6 : rand() < 0.12;
            const nsert = certified ? 1 + Math.floor(rand() * 3) : 0;
            const hilang = nsert && rand() < 0.35 ? 1 : 0;
            const inv = rand();
            const prio = rand();
            const nomor = `${1 + Math.floor(rand() * 140)}/HPL/${SK_CODE[gen]}/${String(tahun).slice(gen === 2 ? 0 : 2)}`;
            out.push({
                id: 'hpl' + (out.length + 1),
                nomorSk: nomor,
                tahunSk: tahun,
                generasi: hpl_model_1.HPL_GENERASI[gen],
                wilayahId: w.id,
                provinsi: w.provinsi,
                kabupaten: w.kabupaten,
                luas,
                dokumenSk: rand() < 0.79 ? 'Ada' : 'Tidak ada',
                jumlahSertifikat: nsert,
                luasSertifikat: nsert ? Math.round(luas * (0.4 + rand() * 0.6) * 100) / 100 : 0,
                sertifikatAsliHilang: hilang,
                adaPeta: rand() < 0.3,
                inventarisasi: inv < 0.08 ? 'Sudah' : inv < 0.15 ? 'Rencana 2026' : 'Belum',
                prioritas: prio < 0.04 ? 'Tinggi' : prio < 0.15 ? 'Sedang' : prio < 0.2 ? 'Rendah' : '',
                lat: w.lat != null ? Math.round((w.lat + (rand() - 0.5) * 0.2) * 1e5) / 1e5 : undefined,
                lon: w.lon != null ? Math.round((w.lon + (rand() - 0.5) * 0.2) * 1e5) / 1e5 : undefined,
                color: '#b2293d'
            });
        }
    });
    return out;
}
exports.HPL_SEED = buildSeed();
