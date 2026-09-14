# DGT — Angular 8 port

This is an Angular 8 + TypeScript + Bootstrap 4 rebuild of the three static
tools in the parent repo (`../index.html` launcher, `../dashboard/`,
`../data-manager/`). It's a real, structurally faithful port — not a spec
document — built as a single Angular CLI workspace with lazy-loaded feature
modules, an Angular Router replacing the original's manual DOM-swap
"routing", and a shared component library (`src/app/shared/`) standing in
for the copy-pasted CSS classes (`.panel`, `.badge`, `.table-wrap`, `.rail`,
etc.) the original hand-rolled independently in each tool.

## ⚠️ Before you `npm install`

**This targets Angular 8 / Node 10–12.** It was authored in a sandbox
running Node 24, which cannot install or build this toolchain (Angular
CLI 8's `node-sass` native binary doesn't compile on modern Node, and the
CLI itself predates support for current Node majors) — so **none of this
has been through a live `npm install` / `ng build` / `ng serve`**. The
files are hand-written to be structurally and syntactically correct Angular
8, but treat the very first build on your machine as the real first
compile check, not a formality.

```bash
nvm install 12
nvm use 12
npm install
ng serve   # http://localhost:4200
```

If your team has since moved past Angular 8, the idioms here (NgModules, no
standalone components, `HttpClientModule` not yet wired up, RxJS 6) are the
Angular-8-appropriate choices — most of this ports forward to a newer
Angular major with the standalone-components/inject() migration being the
main mechanical change, not a rewrite.

## Bootstrap version

Defaulted to **Bootstrap 4** (`^4.6.2` in `package.json`, plus
`@ng-bootstrap/ng-bootstrap@^5` for Modal/Offcanvas-shaped needs) since
that's the natural pairing for an Angular 8-era codebase. If your team is
actually on Bootstrap 5, the affected files are `src/styles/
_bootstrap-overrides.scss`, `package.json`, and any component template using
Bootstrap 4-specific class names (`.form-group`, `.custom-select`, `ml-*`/
`mr-*` instead of `ms-*`/`me-*`, etc.) — a real but mechanical find/replace
pass, not a structural change.

## Structure

```
src/
├─ app/
│  ├─ core/            services + models with no UI (AuthGateService, NavItem)
│  ├─ shared/           the ported design-system component library
│  │  ├─ components/    rail-nav, topbar, page-head, kpi-tile, severity-badge,
│  │  │                 drawer, toast-container, data-table, charts/*
│  │  ├─ pipes/         safeHtml (for trusted inline icon SVG)
│  │  └─ services/      ToastService
│  ├─ shell/            AppShellComponent — rail+topbar+content chrome,
│  │                    reused by both feature modules below
│  ├─ launcher/         root route — cosmetic login gate + card grid
│  │                    (ports ../index.html; NOT real auth, see
│  │                    AuthGateService's doc comment)
│  ├─ dashboard/        lazy-loaded — ports ../dashboard/index.html
│  │                    (see src/app/dashboard/PORT_NOTES.md)
│  └─ data-manager/     lazy-loaded — ports ../data-manager/index.html
│                       (see src/app/data-manager/PORT_NOTES.md)
├─ styles/
│  ├─ _tokens.scss              design tokens, ported from
│  │                            ../design-system/tokens/*.css (the
│  │                            canonical source — see root CLAUDE.md)
│  └─ _bootstrap-overrides.scss Bootstrap Sass variable overrides
└─ styles.scss          global resets + a few utility classes with no
                        Bootstrap equivalent (scroll-snap KPI strip, ticker
                        marquee)
```

## What this reconciles vs. the original static site

The original repo has **three divergent `:root` token sets** (root
launcher, dashboard, data-manager each hand-roll slightly different values
under the same variable names — see root `CLAUDE.md`). This port treats
`../design-system/tokens/*.css` as the single source of truth and builds
one token set from it (`src/styles/_tokens.scss`); the per-tool visual
drift in the original is not preserved.

The dashboard and data-manager are kept as **two separate lazy-loaded
feature modules**, matching the fact that they're independent tools at
runtime in the original (data-manager's `localStorage` data was never read
by the dashboard, and that's unchanged here) — not merged into one
mega-module.

## Known gaps / deliberately out of scope for this pass

- `gis-dgt/` and `geomapping/` (separate tools in the parent repo) are not
  ported.
- The three `design-system/ui_kits/*` JSX prototype apps were reference
  material only, not a porting target.
- Dark mode: the token bridge carries the source's `.dark{}` block forward
  as an opt-in class, but nothing switches it on — the original is
  deliberately single-theme (see root `CLAUDE.md` → "Theming"); don't wire
  up a theme toggle without checking that's actually wanted.
- See each feature module's own `PORT_NOTES.md` for what was simplified or
  left partial within it.
