import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavItem } from '../core/models/nav-item.model';

/**
 * Wraps `<dgt-app-shell>` around a `<router-outlet>` for the 8 dashboard
 * module routes — the Angular equivalent of dashboard/index.html's
 * `MODULES` array + `#rail` wiring + `render()`/`RENDERERS` dispatch
 * (dashboard/index.html:1194-1238, 2224-2233). Rail item order/labels/subs
 * are copied verbatim from the original `MODULES` array; Geospasial stays
 * first since it's the landing module (`state.tab` defaults to it there).
 */
@Component({
  selector: 'dgt-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss']
})
export class DashboardShellComponent implements OnInit, OnDestroy {
  readonly navItems: NavItem[] = [
    { id: 'geospasial', label: 'Geospasial & Legalitas Lahan', sub: 'HPL · SHM · Trans Tuntas' },
    { id: 'profil', label: 'Data Induk & Profil Kawasan', sub: '5T · SKP / KPB' },
    { id: 'demografi', label: 'Demografi & Pembauran', sub: 'Transmigran · Masyarakat Lokal' },
    { id: 'infrastruktur', label: 'Infrastruktur & Kolaborasi K/L', sub: 'Trans Gotong Royong' },
    { id: 'monitoring', label: 'Monitoring Program & Anggaran', sub: 'Timeline · Kurva S' },
    { id: 'ekonomi', label: 'Ekonomi & Investasi Kawasan', sub: 'Trans Karya Nusa' },
    { id: 'analitik', label: 'Analitik, Skoring & EWS', sub: 'Prioritas · Peringatan Dini' },
    { id: 'intelijen', label: 'Executive Intelligence & AI', sub: 'Statistik · AI Assistant' }
  ];

  activeId: string | null = 'geospasial';

  private routerSub?: Subscription;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateActiveId();
    this.routerSub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.updateActiveId());
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  onSelect(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  private updateActiveId(): void {
    let snapshot: ActivatedRouteSnapshot | null = this.route.snapshot.firstChild;
    while (snapshot && snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    const navId = snapshot && snapshot.data ? snapshot.data.navId : null;
    this.activeId = navId || (snapshot && snapshot.url.length ? snapshot.url[0].path : 'geospasial');
  }
}
