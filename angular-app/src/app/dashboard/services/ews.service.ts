import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type EwsSeverity = 'high' | 'med' | 'low';

export interface EwsAlert {
  id: string;
  sev: EwsSeverity;
  title: string;
  detail: string;
  when: string;
  ack: boolean;
}

/** Titles below reference real kawasan names from the 45-kawasan matrix (see
 *  `dashboard-data.service.ts`'s `KAWASAN_SEEDS`) — updated when that dataset replaced the old
 *  10-entry fabricated list, since the alerts used to name kawasan ("Kobisonta", "Bina Buay", "Air
 *  Terang") that don't exist in the real 45. The alerts themselves (severity/detail/timing) are
 *  still fabricated/illustrative, same as the rest of this file — only the kawasan being pointed at
 *  is now real. */
const INITIAL_ALERTS: EwsAlert[] = [
  { id: 'e1', sev: 'high', title: 'Penurunan produktivitas — SKP Patlean', detail: 'Indeks 5T turun 9 poin dalam 2 kuartal terakhir; realisasi anggaran di bawah 20%.', when: '2 jam lalu', ack: false },
  { id: 'e2', sev: 'high', title: 'Potensi sengketa lahan — SKP Bungku', detail: 'Tumpang tindih HPL–SHM terdeteksi di 3 blok, estimasi 1.100 Ha.', when: '5 jam lalu', ack: false },
  { id: 'e3', sev: 'med', title: 'Realisasi anggaran tertinggal — SKP Tobadak', detail: 'Serapan anggaran 22%, di bawah target kuartalan 35%.', when: '1 hari lalu', ack: false },
  { id: 'e4', sev: 'med', title: 'Tren kerawanan sosial — KPB Lagita', detail: 'Laporan gesekan sosial meningkat pada 2 dusun sekitar kawasan.', when: '1 hari lalu', ack: true },
  { id: 'e5', sev: 'low', title: 'Verifikasi data penempatan — KPB Lamunti - Dadahup', detail: '9 KK menunggu validasi data kependudukan lebih dari 30 hari.', when: '3 hari lalu', ack: true }
];

/**
 * Ports the single `ewsAlerts` array + ack-toggle logic that the original
 * deliberately shares between the Geospasial "Peringatan Dini (EWS)" panel
 * and the Analitik module's own EWS list (see CLAUDE.md: "a deliberate,
 * flagged duplication, not an oversight"). Both feature components inject
 * this same service so toggling ack in one place is reflected in the other,
 * exactly like the original's shared `ewsAlerts` array + independent render
 * functions kept in sync.
 */
@Injectable({ providedIn: 'root' })
export class EwsService {
  private readonly alertsSubject = new BehaviorSubject<EwsAlert[]>(INITIAL_ALERTS.map(a => ({ ...a })));
  readonly alerts$ = this.alertsSubject.asObservable();

  getAll(): EwsAlert[] {
    return this.alertsSubject.value;
  }

  getActiveCount(): number {
    return this.alertsSubject.value.filter(a => !a.ack).length;
  }

  toggleAck(id: string): void {
    this.alertsSubject.next(
      this.alertsSubject.value.map(a => (a.id === id ? { ...a, ack: !a.ack } : a))
    );
  }
}
