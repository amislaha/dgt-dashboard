import { Component } from '@angular/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'dgt-root',
  template: `
    <router-outlet></router-outlet>
    <dgt-toast-container></dgt-toast-container>
  `
})
export class AppComponent {
  // Injected only to force ThemeService's constructor (which reads
  // localStorage and applies the `.dark` class) to run once at bootstrap,
  // rather than whenever the first `<dgt-theme-toggle>` happens to be
  // created — see index.html's inline script for the pre-bootstrap version
  // of the same check, which avoids a flash of the wrong theme.
  constructor(private readonly theme: ThemeService) {}
}
