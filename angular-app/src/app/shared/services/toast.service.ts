import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  text: string;
  variant: 'success' | 'danger' | 'info';
}

/** Ports data-manager's `showToast()` — transient confirmation messages after CRUD actions. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly toasts$ = new BehaviorSubject<ToastMessage[]>([]);
  readonly toasts = this.toasts$.asObservable();

  show(text: string, variant: ToastMessage['variant'] = 'success', durationMs = 3000): void {
    const toast: ToastMessage = { id: this.nextId++, text, variant };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.dismiss(toast.id), durationMs);
  }

  dismiss(id: number): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }
}
