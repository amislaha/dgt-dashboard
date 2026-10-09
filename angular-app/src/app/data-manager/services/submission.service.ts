import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DrawnGeometry } from '../models/drawn-geometry.model';
import { EntityKey } from '../models/entity-key.model';
import { Submission, SubmissionHistoryEntry, SubmissionMode, SubmissionStatus } from '../models/submission.model';
import { ENTITY_CONFIGS } from '../config/entity-configs';
import { STORAGE_PREFIX } from './entity-crud.service';
import { EntityRegistryService } from './entity-registry.service';

const KEY = STORAGE_PREFIX + 'submissions';

export interface SubmissionInput {
  entityKey: EntityKey;
  mode: SubmissionMode;
  targetId: string | null;
  targetLabel: string;
  summary: string;
  images: string[];
  geometry?: DrawnGeometry | null;
  fieldValues?: { [key: string]: any } | null;
  submittedBy: string;
}

/**
 * localStorage-backed log of `Submission`s, under the same `dgt-data-manager:` key prefix as the
 * 8 entity CRUD services (see entity-crud.service.ts) — reactive via BehaviorSubject like them, but
 * not an `EntityCrudService` subclass: a submission is reviewed (approve/reject/reset), not edited
 * field-by-field, so it needs its own `review()` instead of a generic `update()`.
 *
 * Every add/edit/delete of master data is a submission (see EntityListComponent) — nothing writes an
 * entity directly any more. `review(..., 'APPROVED')` is what actually applies the change through
 * the entity's `EntityCrudService`, credited to the submitter. An approved submission is final (it
 * can't be rejected/reset afterwards — the data has already changed).
 */
@Injectable({ providedIn: 'root' })
export class SubmissionService {
  private readonly itemsSubject = new BehaviorSubject<Submission[]>(this.loadInitial());
  readonly changes: Observable<Submission[]> = this.itemsSubject.asObservable();

  constructor(private readonly registry: EntityRegistryService) {}

  list(): Submission[] {
    return this.itemsSubject.value;
  }

  count(status: SubmissionStatus | 'all'): number {
    return status === 'all' ? this.itemsSubject.value.length : this.itemsSubject.value.filter(s => s.status === status).length;
  }

  submit(input: SubmissionInput): Submission {
    const now = new Date().toISOString();
    const target = input.targetId ? this.registry.get(input.entityKey).service.get(input.targetId) : null;
    const previousValues: { [key: string]: any } | null = target ? {} : null;
    if (target) {
      ENTITY_CONFIGS[input.entityKey].fields.forEach(f => (previousValues![f.name] = target[f.name]));
    }
    const record: Submission = {
      id: 'sub' + this.nextSeq(),
      entityKey: input.entityKey,
      mode: input.mode,
      targetId: input.targetId,
      targetLabel: input.targetLabel,
      summary: input.summary,
      images: input.images,
      geometry: input.geometry || null,
      fieldValues: input.fieldValues || null,
      previousValues,
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
  review(id: string, status: SubmissionStatus, reviewer: string, note: string): string | null {
    const current = this.itemsSubject.value.find(s => s.id === id);
    if (!current) {
      return 'Pengajuan tidak ditemukan.';
    }
    if (current.status === 'APPROVED') {
      return 'Pengajuan yang sudah disetujui tidak bisa diubah lagi — datanya sudah diterapkan.';
    }
    if (status === 'APPROVED') {
      const error = this.apply(current);
      if (error) {
        return error;
      }
    }
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
    return null;
  }

  /** Applies an approved submission to its entity. Returns an error message instead of throwing so the caller can toast it and leave the submission unchanged. */
  private apply(s: Submission): string | null {
    const entry = this.registry.get(s.entityKey);
    if (s.mode === 'delete') {
      if (!entry.service.get(s.targetId)) {
        return 'Data yang diusulkan untuk dihapus sudah tidak ada.';
      }
      entry.service.remove(s.targetId as string);
      return null;
    }
    if (!s.fieldValues) {
      return 'Pengajuan ini tidak memuat isian data, jadi tidak bisa diterapkan.';
    }
    if (s.mode === 'create') {
      entry.service.create(s.fieldValues as any, s.submittedBy);
      return null;
    }
    if (!entry.service.get(s.targetId)) {
      return 'Data yang diusulkan untuk diubah sudah tidak ada.';
    }
    // A field cleared in the form is absent after the localStorage JSON round-trip; make that an explicit clear.
    const patch: { [key: string]: any } = {};
    ENTITY_CONFIGS[s.entityKey].fields.forEach(f => (patch[f.name] = s.fieldValues![f.name]));
    entry.service.update(s.targetId as string, patch, s.submittedBy);
    return null;
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
