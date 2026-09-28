import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawnGeometry } from '../models/drawn-geometry.model';
import { EntityKey } from '../models/entity-key.model';
import { Submission, SubmissionHistoryEntry, SubmissionMode, SubmissionStatus } from '../models/submission.model';
import { STORAGE_PREFIX } from './entity-crud.service';

const KEY = STORAGE_PREFIX + 'submissions';

export interface SubmissionInput {
  entityKey: EntityKey;
  mode: SubmissionMode;
  targetId: string | null;
  targetLabel: string;
  summary: string;
  images: string[];
  geometry?: DrawnGeometry | null;
  submittedBy: string;
}

/**
 * localStorage-backed log of `Submission`s, under the same `dgt-data-manager:` key prefix as the
 * 8 entity CRUD services (see entity-crud.service.ts) — reactive via BehaviorSubject like them, but
 * not an `EntityCrudService` subclass: a submission is reviewed (approve/reject/reset), not edited
 * field-by-field, so it needs its own `review()` instead of a generic `update()`.
 */
@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private readonly itemsSubject = new BehaviorSubject<Submission[]>(this.loadInitial());
  readonly changes: Observable<Submission[]> = this.itemsSubject.asObservable();

  list(): Submission[] {
    return this.itemsSubject.value;
  }

  count(status: SubmissionStatus | 'all'): number {
    return status === 'all' ? this.itemsSubject.value.length : this.itemsSubject.value.filter(s => s.status === status).length;
  }

  submit(input: SubmissionInput): Submission {
    const now = new Date().toISOString();
    const record: Submission = {
      id: 'sub' + this.nextSeq(),
      entityKey: input.entityKey,
      mode: input.mode,
      targetId: input.targetId,
      targetLabel: input.targetLabel,
      summary: input.summary,
      images: input.images,
      geometry: input.geometry || null,
      submittedBy: input.submittedBy,
      submittedAt: now,
      status: 'PENDING',
      reviewer: null,
      reviewedAt: null,
      reviewNote: '',
      history: [{ action: 'SUBMITTED', by: input.submittedBy, at: now, note: '' }]
    };
    this.persist([record, ...this.itemsSubject.value]);
    return record;
  }

  /** Records a review decision. Resetting to PENDING clears the reviewer/note, matching geomapping's
   *  `setApproval()` "Kembalikan ke Menunggu" behaviour. */
  review(id: string, status: SubmissionStatus, reviewer: string, note: string): void {
    const now = new Date().toISOString();
    const action: SubmissionHistoryEntry['action'] = status === 'PENDING' ? 'RESET' : status;
    const next = this.itemsSubject.value.map(s => {
      if (s.id !== id) {
        return s;
      }
      return {
        ...s,
        status,
        reviewer: status === 'PENDING' ? null : reviewer,
        reviewedAt: status === 'PENDING' ? null : now,
        reviewNote: status === 'PENDING' ? '' : note,
        history: [{ action, by: reviewer, at: now, note }, ...s.history]
      };
    });
    this.persist(next);
  }

  private nextSeq(): number {
    let max = 0;
    this.itemsSubject.value.forEach(s => {
      const match = /^sub(\d+)$/.exec(s.id);
      if (match) {
        max = Math.max(max, parseInt(match[1], 10));
      }
    });
    return max + 1;
  }

  private loadInitial(): Submission[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      // fall through to an empty log, same tolerance as EntityCrudService.loadInitial
    }
    return [];
  }

  private persist(items: Submission[]): void {
    this.itemsSubject.next(items);
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      console.error('SubmissionService: failed to persist to localStorage', e);
    }
  }
}
