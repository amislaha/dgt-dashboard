import { Component, Input } from '@angular/core';

/** Ports the `pageHead()` toolbar helper shared by every dashboard/data-manager module. */
@Component({
  selector: 'dgt-page-head',
  templateUrl: './page-head.component.html',
  styleUrls: ['./page-head.component.scss']
})
export class PageHeadComponent {
  @Input() title = '';
  @Input() description = '';
}
