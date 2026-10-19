import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

/**
 * Lets a design-token colour like `var(--warn)` through a [style.background]/[style.color]
 * binding. Angular 8's style sanitizer rejects `var(...)` and drops the whole value (the element
 * just renders uncoloured, with only a console warning), so token colours set from TS never showed.
 *
 * Only a bare `var(--token-name)` is trusted; anything else (hex, rgb, user-entered values) is
 * returned unchanged and still goes through the normal sanitizer.
 */
@Pipe({ name: 'cssVar' })
export class CssVarPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeStyle | string | null | undefined {
    return typeof value === 'string' && /^var\(--[\w-]+\)$/.test(value.trim()) ? this.sanitizer.bypassSecurityTrustStyle(value.trim()) : value;
  }
}
