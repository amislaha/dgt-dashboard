import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface GeomappingToast {
  id: string;
  msg: string;
  kind?: 'ok' | 'err';
}

/** Ports geomapping/index.html's `toast(msg, kind)` — a small auto-dismissing message stack
 *  (`#toastWrap`), shared across the module's components via this service instead of a module-
 *  level DOM reference. */
@Injectable({ providedIn: 'root' })
export class GeomappingToastService {
  private readonly toastsSubject = new BehaviorSubject<GeomappingToast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();
  private seq = 0;

  show(msg: string, kind?: 'ok' | 'err'): void {
    const id = 'toast-' + ++this.seq;
    this.toastsSubject.next([...this.toastsSubject.value, { id, msg, kind }]);
    setTimeout(() => {
      this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
    }, 2800);
  }
}
