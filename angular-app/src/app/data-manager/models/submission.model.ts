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
 * scoped down to a submission log, not the full geomapping module (no map/drawing/GPS/questionnaire).
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
