import { MONTH_FULL, QUESTIONNAIRE } from '../models/geomapping.model';

/**
 * Ports geomapping/index.html's questionnaire read-helpers (`qnFieldCount`/`qnAnsweredCount`/
 * `fmtDateID`/`questionnaireSummary`, lines ~2133-2178) and the inline calendar's date-grid math
 * (`qcalHtml`, lines ~2307-2340) as plain functions returning data instead of HTML strings, so
 * Angular templates can `*ngFor` over the result rather than re-parsing innerHTML.
 */

export function qnFieldCount(): number {
  let n = 0;
  QUESTIONNAIRE.forEach(q => (n += q.type === 'group' && q.items ? q.items.length : 1));
  return n;
}

export function qnAnsweredCount(data: { [key: string]: any } | null | undefined): number {
  data = data || {};
  let n = 0;
  QUESTIONNAIRE.forEach(q => {
    if (q.type === 'group' && q.items) {
      const g = data![q.id] || {};
      q.items.forEach(it => {
        if (g[it.id] != null && String(g[it.id]).trim()) {
          n++;
        }
      });
    } else if (data![q.id] != null && String(data![q.id]).trim()) {
      n++;
    }
  });
  return n;
}

export function fmtDateID(iso: string | null | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) {
    return String(iso || '');
  }
  return +m[3] + ' ' + MONTH_FULL[+m[2] - 1] + ' ' + m[1];
}

export interface QuestionnaireSummaryRow {
  k: string;
  v: string;
}

/** Ports `questionnaireSummary(f)`'s row-building (the "up to 4 answers + N more" list) minus the
 *  HTML — the "belum ada jawaban" / "kelengkapan X / Y" framing stays in the template. */
export function questionnaireSummaryRows(data: { [key: string]: any } | null | undefined): QuestionnaireSummaryRow[] {
  data = data || {};
  const rows: QuestionnaireSummaryRow[] = [];
  QUESTIONNAIRE.forEach(q => {
    if (q.type === 'group' && q.items) {
      const g = data![q.id] || {};
      q.items.forEach(it => {
        const v = g[it.id];
        if (v != null && String(v).trim()) {
          rows.push({ k: q.label + ' · ' + it.label, v: String(v) });
        }
      });
    } else {
      const v = data![q.id];
      if (v != null && String(v).trim()) {
        rows.push({ k: q.label, v: q.type === 'date' ? fmtDateID(v) : String(v) });
      }
    }
  });
  return rows;
}

export interface QcalDay {
  day: number;
  iso: string;
  out: boolean;
  sel: boolean;
}
export interface QcalMonth {
  label: string;
  dow: string[];
  days: QcalDay[];
}

const QCAL_DOW = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];

/** Ports `qcalHtml(iso, path)`'s 6-week date-grid math verbatim (Monday-first weeks, leading/
 *  trailing days from the neighbouring months marked `out`), split from view-state (`vy`/`vm`
 *  come from the caller — QuestionnaireDialogComponent tracks `calView` per field path exactly
 *  like the source's `qdlg.calView`). */
export function qcalMonth(vy: number, vm: number, selectedIso: string | null): QcalMonth {
  const startDow = (new Date(vy, vm, 1).getDay() + 6) % 7; // Mon = 0
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();
  const prevDays = new Date(vy, vm, 0).getDate();
  const days: QcalDay[] = [];
  for (let i = 0; i < 42; i++) {
    let dayNum: number;
    let out = false;
    let cy = vy;
    let cm = vm;
    if (i < startDow) {
      dayNum = prevDays - startDow + 1 + i;
      out = true;
      cm = vm - 1;
      if (cm < 0) {
        cm = 11;
        cy = vy - 1;
      }
    } else if (i >= startDow + daysInMonth) {
      dayNum = i - startDow - daysInMonth + 1;
      out = true;
      cm = vm + 1;
      if (cm > 11) {
        cm = 0;
        cy = vy + 1;
      }
    } else {
      dayNum = i - startDow + 1;
    }
    const cIso = cy + '-' + ('0' + (cm + 1)).slice(-2) + '-' + ('0' + dayNum).slice(-2);
    days.push({ day: dayNum, iso: cIso, out, sel: !!selectedIso && cIso === selectedIso });
    if (i >= startDow + daysInMonth - 1 && i % 7 === 6) {
      break;
    }
  }
  return { label: MONTH_FULL[vm] + ' ' + vy, dow: QCAL_DOW, days };
}
