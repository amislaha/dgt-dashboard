import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavItem } from '../core/models/nav-item.model';
import { moduleIconSvg } from './config/module-icons';

/**
 * The Angular equivalent of dashboard/index.html's `MODULES` array + `#rail`
 * wiring + `render()`/`RENDERERS` dispatch (dashboard/index.html:1194-1238,
 * 2224-2233). Rail item order/labels/subs are copied verbatim from the
 * original `MODULES` array; Geospasial stays first since it's the landing
 * module (`state.tab` defaults to it there).
 *
 * Deliberately does NOT use `<dgt-app-shell>`/`<dgt-topbar>` (unlike
 * DataManagerShellComponent) — the current dashboard/index.html has no
 * topbar at all ("No header bar in this app at all (removed by request)"),
 * just `<nav class="rail collapsed">` + one floating `.rail-fab` (☰) button
 * that both reveals the collapsed desktop rail (hover near the top-left
 * corner) and drives the mobile off-canvas drawer. data-manager's source is
 * unchanged and still topbar-based, so it keeps using the shared shell —
 * this is a genuine, current divergence between the two tools' own chrome,
 * not an oversight in one of the ports.
 */
@Component({
  selector: 'dgt-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.scss']
})
export class DashboardShellComponent implements OnInit, OnDestroy {
  readonly navItems: NavItem[] = [
    { id: 'geospasial', label: 'Geospasial & Legalitas Lahan', sub: 'HPL · SHM · Trans Tuntas', icon: moduleIconSvg('geospasial') },
    { id: 'profil', label: 'Data Induk & Profil Kawasan', sub: '5T · SKP / KPB', icon: moduleIconSvg('profil') },
    { id: 'monitoring', label: 'Monitoring Program & Anggaran', sub: 'Timeline · Kurva S', icon: moduleIconSvg('monitoring') },
    { id: 'ekonomi', label: 'Ekonomi & Investasi Kawasan', sub: 'Trans Karya Nusa', icon: moduleIconSvg('ekonomi') },
    { id: 'analitik', label: 'Analitik, Skoring & EWS', sub: 'Prioritas · Peringatan Dini', icon: moduleIconSvg('analitik') },
    { id: 'intelijen', label: 'Executive Intelligence & AI', sub: 'Statistik · AI Assistant', icon: moduleIconSvg('intelijen') }
  ];

  activeId: string | null = 'geospasial';

  isNarrow = false;
  // Ports <nav class="rail collapsed" id="rail"> — the rail starts collapsed
  // by default, unlike data-manager's (which starts expanded).
  railCollapsed = true;
  railOpen = false;

  private routerSub?: Subscription;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.updateActiveId();
    this.routerSub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => this.updateActiveId());
    this.checkWidth();
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  @HostListener('window:resize')
  checkWidth(): void {
    this.isNarrow = window.innerWidth <= 760;
    if (!this.isNarrow) {
      this.railOpen = false;
    }
  }

  /** The rail-fab's one click handler — ports the original's single
   *  `railFab` click listener, which toggles `.open` on mobile or
   *  `.collapsed` on desktop depending on the current viewport width. */
  toggleRail(): void {
    if (this.isNarrow) {
      this.railOpen = !this.railOpen;
    } else {
      this.railCollapsed = !this.railCollapsed;
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
