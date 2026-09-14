import { Injectable } from '@angular/core';
import { DashboardDataService } from './dashboard-data.service';

/**
 * Ports `aiAnswer(q)` (dashboard/index.html:1258) VERBATIM in rule/intent
 * terms — a keyword-matching mock, not a real LLM/API call. Do not wire this
 * to any real model; that would defeat the point CLAUDE.md makes about it
 * being a fixed, offline, always-identical mock shared by both chat UIs.
 */
@Injectable({ providedIn: 'root' })
export class AiMockService {
  constructor(private readonly data: DashboardDataService) {}

  answer(query: string): string {
    const s = (query || '').toLowerCase();
    const kawasan = this.data.getKawasan();

    if (s.indexOf('mandiri') > -1) {
      const m = kawasan.filter(k => k.tahap === 'Mandiri');
      return `Ada <b>${m.length} kawasan</b> berstatus Mandiri: ${m.map(k => k.nama).join(', ')}.`;
    }
    if (s.indexOf('risiko') > -1 || s.indexOf('bahaya') > -1) {
      const r = kawasan.filter(k => k.risiko === 'high');
      return `Kawasan risiko tinggi saat ini: ${r.map(k => `${k.nama} (${k.provinsi})`).join(', ')}. Rekomendasi: prioritaskan intervensi anggaran &amp; pendampingan sosial.`;
    }
    if (s.indexOf('anggaran') > -1 || s.indexOf('budget') > -1) {
      const avg = Math.round(kawasan.reduce((a, k) => a + k.anggaranPct, 0) / kawasan.length);
      const lowest = kawasan.slice().sort((a, b) => a.anggaranPct - b.anggaranPct)[0];
      return `Rata-rata realisasi anggaran seluruh kawasan adalah <b>${avg}%</b>. Kawasan dengan realisasi terendah: ${lowest.nama}.`;
    }
    if (s.indexOf('indeks') > -1 || s.indexOf('5t') > -1) {
      const highest = kawasan.slice().sort((a, b) => b.indeks5t - a.indeks5t)[0];
      const nationalKPI = this.data.getNationalKPI();
      return `Rata-rata Indeks 5T nasional adalah <b>${nationalKPI.avgIndeks} / 100</b>, dengan kawasan tertinggi ${highest.nama}.`;
    }
    return 'Saya belum memiliki jawaban spesifik untuk itu. Coba tanyakan tentang: kawasan mandiri, risiko tinggi, realisasi anggaran, atau indeks 5T.';
  }
}
