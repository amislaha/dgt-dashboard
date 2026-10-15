import { Injectable } from '@angular/core';
import {
  DashboardDataService, Kawasan, STAGES, profilBucketIndeks, profilDetailData
} from './dashboard-data.service';

export type LaporanJenis = 'kawasan' | 'investasi' | 'anggaran' | 'kinerja' | '5t';
export type LaporanFormat = 'pdf' | 'csv';

type Cell = string | number;

export interface LaporanTabel {
  judul: string;
  kolom: string[];
  baris: Cell[][];
}

export interface LaporanDoc {
  judul: string;
  periode: string;
  cakupan: string;
  dibuat: Date;
  /** Narrative paragraphs, filled from fixed templates over the data (no LLM involved). */
  ringkasan: string[];
  tabel: LaporanTabel[];
}

export interface LaporanHistoryItem {
  judul: string;
  cakupan: string;
  format: LaporanFormat;
  waktu: string;
}

export const LAPORAN_JUDUL: { [key in LaporanJenis]: string } = {
  kawasan: 'Laporan Kawasan',
  investasi: 'Laporan Investasi',
  anggaran: 'Laporan Anggaran',
  kinerja: 'Laporan Kinerja',
  '5t': 'Laporan 5T'
};

const HISTORY_KEY = 'dgt-dashboard:laporan-history';
const HISTORY_MAX = 20;
const RISIKO_LABEL = { low: 'Rendah', med: 'Sedang', high: 'Tinggi' };

const num = (v: number, digits = 0): string =>
  v.toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** "2.39" (toFixed output) → "2,39". */
const dec = (v: string): string => v.replace('.', ',');

/** Names a list in prose, capped so a long list doesn't swamp the summary. */
const daftar = (items: string[], max = 5): string =>
  items.length <= max ? items.join(', ') : items.slice(0, max).join(', ') + `, dan ${items.length - max} lainnya`;

const esc = (v: Cell): string =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Builds the "Buat Laporan" reports from the dashboard dataset and exports them as a printable
 * page (browser "Simpan sebagai PDF") or a CSV file. Every sentence in `ringkasan` is a fixed
 * template filled with computed figures, so the same data always yields the same report.
 */
@Injectable({ providedIn: 'root' })
export class LaporanExportService {
  constructor(private readonly data: DashboardDataService) {}

  build(jenis: LaporanJenis, kawasanId: string, periode: string): LaporanDoc {
    const all = this.data.getKawasan();
    const pool = kawasanId === 'Semua' ? all : all.filter(k => k.id === kawasanId);
    const cakupan = pool.length === 1 ? pool[0].nama + ' (' + pool[0].provinsi + ')' : 'Semua Kawasan (' + pool.length + ')';
    const doc: LaporanDoc = { judul: LAPORAN_JUDUL[jenis], periode, cakupan, dibuat: new Date(), ringkasan: [], tabel: [] };
    switch (jenis) {
      case 'kawasan': this.fillKawasan(doc, pool); break;
      case 'investasi': this.fillInvestasi(doc, pool); break;
      case 'anggaran': this.fillAnggaran(doc, pool); break;
      case 'kinerja': this.fillKinerja(doc, pool); break;
      case '5t': this.fill5t(doc, pool); break;
    }
    return doc;
  }

  export(jenis: LaporanJenis, kawasanId: string, periode: string, format: LaporanFormat): LaporanDoc {
    const doc = this.build(jenis, kawasanId, periode);
    if (format === 'pdf') {
      this.openPrintable(doc);
    } else {
      this.download(this.fileName(doc, 'csv'), '﻿' + this.toCsv(doc), 'text/csv;charset=utf-8');
    }
    this.pushHistory({ judul: doc.judul, cakupan: doc.cakupan, format, waktu: doc.dibuat.toISOString() });
    return doc;
  }

  getHistory(): LaporanHistoryItem[] {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  }

  /* ---------- report contents ---------- */

  private fillKawasan(doc: LaporanDoc, pool: Kawasan[]): void {
    const populasi = pool.reduce((s, k) => s + k.populasi, 0);
    const hpl = pool.reduce((s, k) => s + k.hplHa, 0);
    const shm = pool.reduce((s, k) => s + k.shmHa, 0);
    if (pool.length === 1) {
      const k = pool[0];
      doc.ringkasan.push(
        `Kawasan ${k.nama} berada di Kabupaten ${k.kabupaten}, Provinsi ${k.provinsi}, mencakup ${k.kecamatan} kecamatan dan ${k.desa} desa ` +
        `dengan populasi ${num(k.populasi)} jiwa. Kawasan ini berstatus ${k.tipe} pada tahap ${k.tahap}.`,
        `Luas HPL ${num(k.hplHa)} ha, dengan ${num(k.shmHa)} ha (${num(pct(k.shmHa, k.hplHa))}%) telah bersertifikat SHM; status legalitas: ${k.statusHpl}. ` +
        `Tingkat risiko kawasan dinilai ${RISIKO_LABEL[k.risiko].toLowerCase()}.`
      );
    } else {
      const perTahap = STAGES.map(t => `${t} ${pool.filter(k => k.tahap === t).length}`).join(', ');
      const provinsi = new Set(pool.map(k => k.provinsi)).size;
      const highRisk = pool.filter(k => k.risiko === 'high');
      doc.ringkasan.push(
        `Terdapat ${pool.length} kawasan transmigrasi di ${provinsi} provinsi dengan total populasi ${num(populasi)} jiwa. ` +
        `Sebaran tahap perkembangan: ${perTahap}.`,
        `Total luas HPL ${num(hpl)} ha, dengan ${num(shm)} ha (${num(pct(shm, hpl))}%) telah bersertifikat SHM.`,
        highRisk.length
          ? `${highRisk.length} kawasan berisiko tinggi dan perlu perhatian: ${daftar(highRisk.map(k => k.nama))}.`
          : 'Tidak ada kawasan dengan tingkat risiko tinggi.'
      );
    }
    doc.tabel.push({
      judul: 'Data Kawasan',
      kolom: ['Kawasan', 'Provinsi', 'Kabupaten', 'Tipe', 'Tahap', 'Populasi (jiwa)', 'Desa', 'HPL (ha)', 'SHM (ha)', 'Status Lahan', 'Risiko'],
      baris: pool.map(k => [k.nama, k.provinsi, k.kabupaten, k.tipe, k.tahap, k.populasi, k.desa, k.hplHa, k.shmHa, k.statusHpl, RISIKO_LABEL[k.risiko]])
    });
  }

  private fillInvestasi(doc: LaporanDoc, pool: Kawasan[]): void {
    const rows = pool.map(k => ({ k, d: profilDetailData(k) }));
    const totalNilai = rows.reduce((s, r) => s + r.d.ekonomiSektor.nilaiSektorT, 0);
    const totalUsaha = rows.reduce((s, r) => s + r.d.ekonomiSektor.unitUsaha, 0);
    const top = rows.slice().sort((a, b) => b.d.ekonomiSektor.nilaiSektorT - a.d.ekonomiSektor.nilaiSektorT)[0];
    if (pool.length === 1) {
      const { k, d } = rows[0];
      doc.ringkasan.push(
        d.deskripsiInvestasi,
        `Sektor unggulan berkontribusi ${num(d.ekonomiSektor.kontribusiPdrbPct, 1)}% terhadap PDRB kabupaten dengan nilai ` +
        `Rp ${num(d.ekonomiSektor.nilaiSektorT, 1)} triliun dan ${num(d.ekonomiSektor.unitUsaha)} unit usaha. ` +
        `Dukungan pemerintah daerah dinilai ${d.dukunganLabel} (indeks ${dec(d.indeksDukungan)}).`
      );
    } else {
      doc.ringkasan.push(
        `Nilai sektor unggulan di ${pool.length} kawasan mencapai Rp ${num(totalNilai, 1)} triliun dengan ${num(totalUsaha)} unit usaha. ` +
        `Nilai tertinggi ada di ${top.k.nama} (Rp ${num(top.d.ekonomiSektor.nilaiSektorT, 1)} triliun).`
      );
      const kom = this.data.getKomoditas().slice().sort((a, b) => b.nilai - a.nilai);
      if (kom.length) {
        doc.ringkasan.push(`Komoditas dengan nilai terbesar secara nasional: ${kom.slice(0, 3).map(c => c.nama).join(', ')}.`);
        doc.tabel.push({ judul: 'Komoditas Unggulan Nasional', kolom: ['Komoditas', 'Nilai'], baris: kom.map(c => [c.nama, c.nilai]) });
      }
    }
    doc.tabel.push({
      judul: 'Potensi Investasi per Kawasan',
      kolom: ['Kawasan', 'Provinsi', 'Komoditas Utama', 'Kontribusi PDRB (%)', 'Nilai Sektor (Rp T)', 'Unit Usaha', 'Dukungan Pemda'],
      baris: rows.map(({ k, d }) => [
        k.nama, k.provinsi, d.produkUnggulan.map(p => p.komoditas).slice(0, 2).join(', '),
        num(d.ekonomiSektor.kontribusiPdrbPct, 1), num(d.ekonomiSektor.nilaiSektorT, 1), d.ekonomiSektor.unitUsaha, d.dukunganLabel
      ])
    });
    if (pool.length === 1) {
      doc.tabel.push({
        judul: 'Produk Unggulan',
        kolom: ['Kategori', 'Komoditas', 'Luas (ha)', 'Produksi (ton/th)', 'Pelaku Usaha'],
        baris: rows[0].d.produkUnggulan.map(p => [p.kategori, p.komoditas, p.luasHa, p.produksiTon, p.pelaku])
      });
    }
  }

  private fillAnggaran(doc: LaporanDoc, pool: Kawasan[]): void {
    const avg = pool.reduce((s, k) => s + k.anggaranPct, 0) / pool.length;
    const rendah = pool.filter(k => k.anggaranPct < 50);
    const s = this.data.getSCurve();
    let last = -1;
    s.realisasi.forEach((v, i) => { if (v !== null) { last = i; } });
    if (pool.length === 1) {
      const k = pool[0];
      doc.ringkasan.push(
        `Realisasi anggaran Kawasan ${k.nama} mencapai ${k.anggaranPct}%` +
        (k.anggaranPct < 50 ? ', di bawah ambang 50% sehingga perlu percepatan penyerapan.' : '.')
      );
    } else {
      doc.ringkasan.push(
        `Rata-rata realisasi anggaran di ${pool.length} kawasan sebesar ${num(avg, 1)}%.`,
        rendah.length
          ? `${rendah.length} kawasan masih di bawah 50%, terendah: ${daftar(rendah.sort((a, b) => a.anggaranPct - b.anggaranPct).map(k => `${k.nama} (${k.anggaranPct}%)`))}.`
          : 'Seluruh kawasan telah menyerap anggaran minimal 50%.'
      );
    }
    if (last >= 0) {
      const real = s.realisasi[last] as number;
      const dev = real - s.rencana[last];
      doc.ringkasan.push(
        `Secara nasional, realisasi kumulatif s.d. ${s.labels[last]} sebesar ${real}% terhadap rencana ${s.rencana[last]}% ` +
        `(deviasi ${dev > 0 ? '+' : ''}${dev} poin, ${dev < 0 ? 'tertinggal dari' : 'sesuai/melampaui'} rencana).`
      );
    }
    doc.tabel.push({
      judul: 'Realisasi Anggaran per Kawasan',
      kolom: ['Kawasan', 'Provinsi', 'Tahap', 'Realisasi (%)', 'Keterangan'],
      baris: pool.slice().sort((a, b) => a.anggaranPct - b.anggaranPct)
        .map(k => [k.nama, k.provinsi, k.tahap, k.anggaranPct, k.anggaranPct < 50 ? 'Perlu percepatan' : 'Sesuai'])
    });
    doc.tabel.push({
      judul: 'Kurva S Nasional (kumulatif %)',
      kolom: ['Bulan', 'Rencana (%)', 'Realisasi (%)'],
      baris: s.labels.map((l, i) => [l, s.rencana[i], s.realisasi[i] === null ? '-' : (s.realisasi[i] as number)])
    });
  }

  private fillKinerja(doc: LaporanDoc, pool: Kawasan[]): void {
    const iku = this.data.getIkuList();
    const naik = iku.filter(i => i.trend > 0).length;
    const turun = iku.filter(i => i.trend < 0);
    doc.ringkasan.push(
      `Dari ${iku.length} Indikator Kinerja Utama (IKU), ${naik} menunjukkan tren naik dan ${turun.length} tren turun dibanding periode sebelumnya.`
    );
    if (turun.length) {
      doc.ringkasan.push(`IKU dengan tren turun: ${turun.map(i => `IKU ${i.no} (${dec(i.trend.toString())})`).join(', ')}.`);
    }
    const mandiri = pool.filter(k => k.tahap === 'Mandiri').length;
    doc.ringkasan.push(
      pool.length === 1
        ? `Kawasan ${pool[0].nama} berada pada tahap ${pool[0].tahap} dengan Indeks 5T ${pool[0].indeks5t}.`
        : `${mandiri} dari ${pool.length} kawasan (${num(pct(mandiri, pool.length))}%) telah mencapai tahap Mandiri.`
    );
    doc.tabel.push({
      judul: 'Indikator Kinerja Utama',
      kolom: ['No', 'Indikator', 'Satuan', 'Nilai', 'Tren', 'PIC'],
      baris: iku.map(i => [i.no, i.indikator, i.satuan, i.nilai, (i.trend > 0 ? '+' : '') + dec(i.trend.toString()), i.pic])
    });
  }

  private fill5t(doc: LaporanDoc, pool: Kawasan[]): void {
    const rows = pool.map(k => ({ k, d: profilDetailData(k) }));
    const avg = pool.reduce((s, k) => s + k.indeks5t, 0) / pool.length;
    const sorted = pool.slice().sort((a, b) => b.indeks5t - a.indeks5t);
    if (pool.length === 1) {
      const { k, d } = rows[0];
      doc.ringkasan.push(
        `Indeks 5T Kawasan ${k.nama} sebesar ${k.indeks5t} (kategori ${profilBucketIndeks(k.indeks5t)}). ` +
        `Indeks infrastruktur ${dec(d.indeksInfra)}, kelembagaan ${dec(d.indeksKelembagaan)}, dan dukungan ${dec(d.indeksDukungan)} (skala 1–5).`
      );
    } else {
      const bucket = ['Mandiri', 'Berkembang', 'Tertinggal'].map(b => `${b} ${pool.filter(k => profilBucketIndeks(k.indeks5t) === b).length}`).join(', ');
      doc.ringkasan.push(
        `Rata-rata Indeks 5T di ${pool.length} kawasan sebesar ${num(avg, 1)}. Sebaran kategori: ${bucket}.`,
        `Indeks tertinggi: ${sorted.slice(0, 3).map(k => `${k.nama} (${k.indeks5t})`).join(', ')}. ` +
        `Terendah: ${sorted.slice(-3).reverse().map(k => `${k.nama} (${k.indeks5t})`).join(', ')}.`
      );
    }
    doc.tabel.push({
      judul: 'Indeks 5T per Kawasan',
      kolom: ['Peringkat', 'Kawasan', 'Provinsi', 'Indeks 5T', 'Kategori', 'Indeks Infrastruktur', 'Indeks Kelembagaan', 'Indeks Dukungan'],
      baris: sorted.map((k, i) => {
        const d = rows.find(r => r.k === k).d;
        return [i + 1, k.nama, k.provinsi, k.indeks5t, profilBucketIndeks(k.indeks5t), dec(d.indeksInfra), dec(d.indeksKelembagaan), dec(d.indeksDukungan)];
      })
    });
  }

  /* ---------- output ---------- */

  toCsv(doc: LaporanDoc): string {
    // Semicolon-separated: Excel with Indonesian regional settings uses ';' as its list separator.
    const line = (cells: Cell[]) => cells.map(c => {
      const s = String(c);
      return /[;"\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(';');
    const out: string[] = [
      line([doc.judul]), line(['Periode', doc.periode]), line(['Cakupan', doc.cakupan]),
      line(['Dibuat', doc.dibuat.toLocaleString('id-ID')]), '', line(['Ringkasan']),
      ...doc.ringkasan.map(r => line([r]))
    ];
    doc.tabel.forEach(t => out.push('', line([t.judul]), line(t.kolom), ...t.baris.map(line)));
    return out.join('\r\n');
  }

  toHtml(doc: LaporanDoc): string {
    const cell = (c: Cell) => typeof c === 'number' ? `<td class="n">${esc(num(c))}</td>` : `<td>${esc(c)}</td>`;
    const tables = doc.tabel.map(t => `
      <h2>${esc(t.judul)}</h2>
      <table><thead><tr>${t.kolom.map(k => `<th>${esc(k)}</th>`).join('')}</tr></thead>
      <tbody>${t.baris.map(r => `<tr>${r.map(cell).join('')}</tr>`).join('')}</tbody></table>`).join('');
    return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(doc.judul)} — ${esc(doc.cakupan)}</title>
<style>
  body { font-family: "Plus Jakarta Sans", Arial, sans-serif; color: #1b2a25; margin: 32px; font-size: 12px; }
  .bar { position: sticky; top: 0; background: #fff; padding: 8px 0 12px; text-align: right; }
  .bar button { background: #2c755b; color: #fff; border: 0; border-radius: 6px; padding: 8px 14px; font-weight: 600; cursor: pointer; }
  h1 { font-size: 20px; margin: 0 0 4px; color: #2c755b; }
  .meta { color: #5b6b65; margin-bottom: 18px; }
  h2 { font-size: 14px; margin: 22px 0 8px; border-bottom: 2px solid #2c755b; padding-bottom: 4px; }
  p { line-height: 1.55; margin: 0 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d5ddd9; padding: 5px 7px; text-align: left; vertical-align: top; }
  th { background: #eaf3ef; font-weight: 700; }
  td.n { text-align: right; font-variant-numeric: tabular-nums; }
  tr { page-break-inside: avoid; }
  @media print { body { margin: 0; } .bar { display: none; } @page { size: A4 landscape; margin: 14mm; } }
</style></head><body>
<div class="bar"><button onclick="window.print()">Cetak / Simpan PDF</button></div>
<h1>${esc(doc.judul)}</h1>
<div class="meta">Periode ${esc(doc.periode)} &middot; ${esc(doc.cakupan)} &middot; Dibuat ${esc(doc.dibuat.toLocaleString('id-ID'))}</div>
<h2>Ringkasan</h2>
${doc.ringkasan.map(r => `<p>${esc(r)}</p>`).join('')}
${tables}
<script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 300); });</script>
</body></html>`;
  }

  private openPrintable(doc: LaporanDoc): void {
    const html = this.toHtml(doc);
    const w = window.open('', '_blank');
    if (!w) {
      // Popup blocked: hand over the same page as a file instead.
      this.download(this.fileName(doc, 'html'), html, 'text/html;charset=utf-8');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
  }

  private fileName(doc: LaporanDoc, ext: string): string {
    const slug = (doc.judul + '-' + doc.cakupan + '-' + doc.periode).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return slug + '.' + ext;
  }

  private download(name: string, content: string, type: string): void {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private pushHistory(item: LaporanHistoryItem): void {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify([item, ...this.getHistory()].slice(0, HISTORY_MAX)));
    } catch {}
  }
}

function pct(part: number, whole: number): number {
  return whole ? (part / whole) * 100 : 0;
}
