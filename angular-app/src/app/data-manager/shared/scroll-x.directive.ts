import { Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';

/**
 * Sideways scrolling for a strip/table whose scrollbar is hidden by the host's own CSS: click-and-drag pans it (a drag never counts as a click on what's under it),
 * trackpads and Shift+wheel work natively, and with `dgtScrollX="wheel"` a plain vertical wheel
 * scrolls it sideways too (tab strips — not tables, where the wheel must keep scrolling the page).
 * Listeners run outside Angular so mouse moves don't trigger change detection.
 */
@Directive({ selector: '[dgtScrollX]' })
export class ScrollXDirective implements OnDestroy {
  /** '' (drag only) or 'wheel'. */
  @Input() dgtScrollX = '';

  private startX = 0;
  private startScroll = 0;
  private pressed = false;
  private dragged = false;
  private readonly cleanup: Array<() => void> = [];

  constructor(private readonly el: ElementRef<HTMLElement>, zone: NgZone) {
    const node = el.nativeElement;
    zone.runOutsideAngular(() => {
      this.listen(node, 'wheel', (e: WheelEvent) => this.onWheel(e), { passive: false });
      this.listen(node, 'mousedown', (e: MouseEvent) => this.onDown(e));
      this.listen(document, 'mousemove', (e: MouseEvent) => this.onMove(e));
      this.listen(document, 'mouseup', () => this.onUp());
      // Capture phase: runs before the row/tab's own click handler, so it can be cancelled.
      this.listen(node, 'click', (e: MouseEvent) => this.onClick(e), true);
    });
  }

  ngOnDestroy(): void {
    this.cleanup.forEach(off => off());
  }

  private listen(target: EventTarget, type: string, handler: (e: any) => void, options?: boolean | AddEventListenerOptions): void {
    target.addEventListener(type, handler, options);
    this.cleanup.push(() => target.removeEventListener(type, handler, options));
  }

  private get canScroll(): boolean {
    const node = this.el.nativeElement;
    return node.scrollWidth > node.clientWidth + 1;
  }

  private onWheel(event: WheelEvent): void {
    if (this.dgtScrollX !== 'wheel' || !this.canScroll || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }
    this.el.nativeElement.scrollLeft += event.deltaY;
    event.preventDefault();
  }

  private onDown(event: MouseEvent): void {
    if (event.button !== 0 || !this.canScroll) {
      return;
    }
    this.pressed = true;
    this.dragged = false;
    this.startX = event.clientX;
    this.startScroll = this.el.nativeElement.scrollLeft;
  }

  private onMove(event: MouseEvent): void {
    if (!this.pressed) {
      return;
    }
    const dx = event.clientX - this.startX;
    if (!this.dragged && Math.abs(dx) < 5) {
      return;
    }
    this.dragged = true;
    this.el.nativeElement.style.cursor = 'grabbing';
    this.el.nativeElement.style.userSelect = 'none';
    this.el.nativeElement.scrollLeft = this.startScroll - dx;
    event.preventDefault();
  }

  private onUp(): void {
    this.pressed = false;
    this.el.nativeElement.style.cursor = '';
    this.el.nativeElement.style.userSelect = '';
  }

  private onClick(event: MouseEvent): void {
    if (this.dragged) {
      this.dragged = false;
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
