import { DrawnGeometry } from './drawn-geometry.model';
import { EntityKey } from './entity-key.model';

export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type SubmissionMode = 'create' | 'update' | 'delete';

export interface SubmissionHistoryEntry {
  action: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RESET';
  by: string;
  at: string;
  note: string;
}

/**
 * A proposed change to one master-data entity, queued for review before anyone applies it by hand
 * in the entity CRUD screens — the "Persetujuan & Pengajuan" rail section's data shape. Deliberately
 * NOT wired to auto-apply on approval via EntityCrudService: this ports geomapping's image-evidence +
 * approval-record concept (see geomapping.model.ts's `ApprovalRecord`/`GeomappingFeature.images`)
 * scoped down to a submission log, not the full geomapping module (no GPS tracking, vertex editing,
 * or questionnaire — see MapDrawService/PORT_NOTES.md "Map drawing tools" for the manual-draw
 * capability that WAS ported).
 */
export interface Submission {
  id: string;
  entityKey: EntityKey;
  mode: SubmissionMode;
  /** Existing record id for update/delete; null for a proposed new (create) entry. */
  targetId: string | null;
  /** Free-text label of what/who is being proposed — shown in list rows instead of resolving `targetId`. */
  targetLabel: string;
  summary: string;
  /** Data-URL photo evidence attached to the proposal, same concept as geomapping's `Feature.images`. */
  images: string[];
  /** Optional shape drawn on the shared map (see MapDrawService) — a proposed location/boundary,
   *  same concept as geomapping's `Feature.geometry` but optional, since not every submission needs
   *  a location (e.g. a Satker or Program proposal doesn't). */
  geometry?: DrawnGeometry | null;
  /** The target entity's own `EntityConfig.fields` values, captured via the same generic
   *  `EntityFormComponent` the entity CRUD screens use (create: a full proposed record; update: the
   *  proposed new values, prefilled from the current record) — undefined for `mode: 'delete'`, which
   *  doesn't need field edits. This is what makes a submission's "Ringkasan Perubahan" free text a
   *  supplement rather than the only record of what's being proposed. */
  fieldValues?: { [key: string]: any } | null;
  /** update/delete: the target record's field values when the submission was made, so the detail
   *  page can still show "old → new" after approval has overwritten the record. Absent on older
   *  submissions. */
  previousValues?: { [key: string]: any } | null;
  submittedBy: string;
  submittedAt: string;
  status: SubmissionStatus;
  reviewer: string | null;
  reviewedAt: string | null;
  reviewNote: string;
  history: SubmissionHistoryEntry[];
}

export const SUBMISSION_STATUS_META: { [key in SubmissionStatus]: { label: string; severity: 'good' | 'warn' | 'critical' } } = {
  PENDING: { label: 'Menunggu', severity: 'warn' },
  APPROVED: { label: 'Disetujui', severity: 'good' },
  REJECTED: { label: 'Ditolak', severity: 'critical' }
};

export const SUBMISSION_MODE_LABEL: { [key in SubmissionMode]: string } = {
  create: 'Tambah baru',
  update: 'Ubah data',
  delete: 'Hapus data'
};

export const SUBMISSION_ACTION_LABEL: { [key in SubmissionHistoryEntry['action']]: string } = {
  SUBMITTED: 'Diajukan',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
  RESET: 'Dikembalikan ke Menunggu'
};
