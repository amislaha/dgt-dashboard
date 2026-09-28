import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DrawGeometryType, DrawnGeometry } from '../models/drawn-geometry.model';

export { DrawGeometryType, DrawnGeometry };

/**
 * Mediates manual map-drawing between `WilayahMapComponent` (the shared map used by both the
 * Wilayah and Submission & Approval pages) and whichever sidebar wants to use it —
 * `SubmissionComponent` to attach a drawn shape to a new submission, `SubmissionApprovalComponent`
 * to preview an already-submitted one. Same mediator role as geomapping's `GeomappingEditService`,
 * scoped way down: manual point/line/polygon capture only, no GPS tracking, no vertex editing, no
 * questionnaire — see PORT_NOTES.md "Map drawing tools" for why the fuller geomapping edit
 * experience wasn't ported wholesale.
 */
@Injectable({ providedIn: 'root' })
export class MapDrawService {
  private readonly drawTypeSubject = new BehaviorSubject<DrawGeometryType | null>(null);
  /** Non-null while `WilayahMapComponent` should be capturing clicks into a new shape. */
  readonly drawType$: Observable<DrawGeometryType | null> = this.drawTypeSubject.asObservable();

  private readonly resultSubject = new Subject<DrawnGeometry>();
  /** Emits once when a manual draw is finished (see `complete()`) — the caller that started the
   *  draw is the one expected to be listening. */
  readonly result$: Observable<DrawnGeometry> = this.resultSubject.asObservable();

  private readonly previewSubject = new BehaviorSubject<DrawnGeometry | null>(null);
  /** A read-only shape to display (e.g. a submission's attached geometry while its Approval row is
   *  expanded) — independent of `drawType$`, since previewing and actively drawing don't overlap. */
  readonly preview$: Observable<DrawnGeometry | null> = this.previewSubject.asObservable();

  get drawType(): DrawGeometryType | null {
    return this.drawTypeSubject.value;
  }

  start(type: DrawGeometryType): void {
    this.drawTypeSubject.next(type);
  }

  cancel(): void {
    this.drawTypeSubject.next(null);
  }

  /** Called by `WilayahMapComponent` once a shape is finished (single click for Point, "Selesai"/
   *  double-click for Line/Polygon) — clears draw mode and hands the shape to whoever is
   *  subscribed to `result$`. */
  complete(geometry: DrawnGeometry): void {
    this.drawTypeSubject.next(null);
    this.resultSubject.next(geometry);
  }

  showPreview(geometry: DrawnGeometry | null): void {
    this.previewSubject.next(geometry);
  }

  clearPreview(): void {
    this.previewSubject.next(null);
  }
}
