import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { geomappingSvg } from '../../config/icons';
import { QUESTIONNAIRE, QuestionnaireItem, QuestionnaireQuestion } from '../../models/geomapping.model';
import { QcalMonth, qcalMonth } from '../../services/questionnaire-utils';

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Ports the questionnaire modal — `openQuestionnaireDialog`/`closeQuestionnaireDialog`/`qdlgSet`/
 * `qdlgGet`/`renderQdlg`/`qqHtml`/`wireQqInputs`/`qcalHtml`/`wireQcal`/`saveQuestionnaireDialog`
 * (geomapping/index.html:2181-2394). A structured per-feature survey with a Wizard (one question
 * at a time) / Scroll View toggle, opened from the editor form's "Edit" button on the
 * Questionnaire step. Answers are edited on a local `draft` copy (`qdlg.draft` in the source) and
 * only reach the feature via `(saved)` — cancelling (`(closed)`, no emit) leaves the feature's
 * `questionnaire` untouched, matching the source (`saveQuestionnaireDialog()` is the only writer).
 *
 * The Escape-closes-only-the-dialog behaviour (`qdlgKey`, capture-phase + `stopImmediatePropagation`
 * so the shell's own Escape handling — which would otherwise cancel the *editor* underneath —
 * never sees the key) is ported with a manual capture-phase `document` listener, since Angular's
 * `HostListener` has no capture-phase option and (unlike the source, where the dialog is appended
 * after the shell's listener registers) an Angular `HostListener` here would run in ADD order,
 * which is after the shell's listener that this needs to pre-empt.
 */
@Component({
  selector: 'dgt-questionnaire-dialog',
  templateUrl: './questionnaire-dialog.component.html',
  styleUrls: ['./questionnaire-dialog.component.scss']
})
export class QuestionnaireDialogComponent implements OnInit, OnDestroy {
  @Input() initial: { [key: string]: any } = {};
  @Output() saved = new EventEmitter<{ [key: string]: any }>();
  @Output() closed = new EventEmitter<void>();

  readonly questions: QuestionnaireQuestion[] = QUESTIONNAIRE;

  mode: 'wizard' | 'scroll' = 'scroll';
  step = 0;
  draft: { [key: string]: any } = {};

  private readonly calView: { [path: string]: { y: number; m: number } } = {};
  private readonly keyHandler = (ev: KeyboardEvent) => {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      this.close();
    }
  };

  ngOnInit(): void {
    try {
      this.draft = JSON.parse(JSON.stringify(this.initial || {}));
    } catch (e) {
      this.draft = {};
    }
    document.addEventListener('keydown', this.keyHandler, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keyHandler, true);
  }

  setMode(m: 'wizard' | 'scroll'): void {
    this.mode = m;
    this.step = 0;
  }
  prev(): void {
    if (this.step > 0) {
      this.step--;
    }
  }
  next(): void {
    if (this.step < this.questions.length - 1) {
      this.step++;
    }
  }

  fieldPath(q: QuestionnaireQuestion, sub?: QuestionnaireItem): string {
    return sub ? q.id + '/' + sub.id : q.id;
  }

  get(path: string): string {
    const p = path.split('/');
    if (p.length === 2) {
      return (this.draft[p[0]] || {})[p[1]] || '';
    }
    return this.draft[path] || '';
  }
  private set(path: string, val: string): void {
    const p = path.split('/');
    if (p.length === 2) {
      if (!this.draft[p[0]] || typeof this.draft[p[0]] !== 'object') {
        this.draft[p[0]] = {};
      }
      this.draft[p[0]][p[1]] = val;
    } else {
      this.draft[path] = val;
    }
  }
  onInput(path: string, ev: Event): void {
    this.set(path, (ev.target as HTMLInputElement).value);
  }

  calendar(path: string): QcalMonth {
    const iso = this.get(path);
    const view = this.calView[path];
    let vy: number;
    let vm: number;
    if (view) {
      vy = view.y;
      vm = view.m;
    } else {
      const m = DATE_RE.exec(iso);
      if (m) {
        vy = +m[1];
        vm = +m[2] - 1;
      } else {
        const t = new Date();
        vy = t.getFullYear();
        vm = t.getMonth();
      }
    }
    return qcalMonth(vy, vm, iso || null);
  }
  navCal(path: string, dir: number): void {
    const view = this.calView[path];
    let base: Date;
    const m = DATE_RE.exec(this.get(path));
    if (view) {
      base = new Date(view.y, view.m, 1);
    } else if (m) {
      base = new Date(+m[1], +m[2] - 1, 1);
    } else {
      base = new Date();
    }
    base.setMonth(base.getMonth() + dir);
    this.calView[path] = { y: base.getFullYear(), m: base.getMonth() };
  }
  pickDate(path: string, iso: string): void {
    this.set(path, iso);
    const m = DATE_RE.exec(iso);
    if (m) {
      this.calView[path] = { y: +m[1], m: +m[2] - 1 };
    }
  }
  clearDate(path: string): void {
    this.set(path, '');
  }

  iconSvg(name: string): string {
    return geomappingSvg(name);
  }

  onBackdropMouseDown(ev: MouseEvent): void {
    if (ev.target === ev.currentTarget) {
      this.close();
    }
  }

  save(): void {
    const clean: { [key: string]: any } = {};
    this.questions.forEach(q => {
      if (q.type === 'group' && q.items) {
        const g = this.draft[q.id] || {};
        const out: { [key: string]: string } = {};
        q.items.forEach(it => {
          const v = String(g[it.id] == null ? '' : g[it.id]).trim();
          if (v) {
            out[it.id] = v;
          }
        });
        if (Object.keys(out).length) {
          clean[q.id] = out;
        }
      } else {
        const v = String(this.draft[q.id] == null ? '' : this.draft[q.id]).trim();
        if (v) {
          clean[q.id] = v;
        }
      }
    });
    this.saved.emit(clean);
  }

  close(): void {
    this.closed.emit();
  }
}
