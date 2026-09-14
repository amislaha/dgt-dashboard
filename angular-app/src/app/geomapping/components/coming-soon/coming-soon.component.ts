import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Placeholder for the geomapping panels not ported yet in this pass — Approval, Edit Mode
 * (drawing + GPS tracking), Task, Activity. See the module's PORT_NOTES.md for the phase plan;
 * swap this component out for a given route as each phase lands. Title/description come from the
 * route's own `data` (set once per route in geomapping-routing.module.ts) since a routed
 * component has no parent template to bind `@Input`s from.
 */
@Component({
  selector: 'dgt-geomapping-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {
  title = '';
  description = '';

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.title = this.route.snapshot.data.title || '';
    this.description = this.route.snapshot.data.description || '';
  }
}
