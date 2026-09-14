import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Trusts a hand-authored SVG icon-path string for [innerHTML] binding.
 * Ports the design-system's `ICON_PATHS`/`railIcon()` convention (hand-drawn
 * 24x24 line-icon path data, rendered via currentColor) — every value passed
 * through this pipe must come from a fixed internal icon-path constant, never
 * from user input or remote data.
 */
@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
