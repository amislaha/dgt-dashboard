import { Component } from '@angular/core';

@Component({
  selector: 'dgt-root',
  template: `
    <router-outlet></router-outlet>
    <dgt-toast-container></dgt-toast-container>
  `
})
export class AppComponent {}
