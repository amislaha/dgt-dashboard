# Dashboard module — port notes

Angular 8 port of `dashboard/index.html` (the original, ~2247-line static
prototype — see repo-root `CLAUDE.md`, "Architecture of dashboard/index.html").
Everything below lives under `src/app/dashboard/`.

## What's implemented

- **Shell**: `DashboardShellComponent` now composes its own bespoke shell
  (`dgt-rail-nav` + one floating `.rail-fab` toggle + `<router-outlet>`)
  instead of the shared `<dgt-app-shell>`/`<dgt-topbar>` (still used by
  data-manager, unchanged). The current dashboard/index.html has no topbar
  at all ("No header bar in this app at all (removed by request)") — just
  `<nav class="rail collapsed">` + one persistent floating hamburger button
  that both reveals the collapsed-by-default desktop rail (hover near the
  top-left corner) and drives the mobile off-canvas drawer, ported here as
  `.rail-fab`/`toggleRail()`. `activeId` is derived from the deepest
  activated child route's `data.navId`, updated on every `NavigationEnd`.
  The 8 `NavItem`s (id/label/sub/**icon**) are copied verbatim from the
  original `MODULES` array, in the same order (Geospasial first — it's the
  landing module, `state.tab` defaults to it in the source) — the per-module
  icons (`ICON_PATHS`/`railIcon()`) are newly ported too, as
  `config/module-icons.ts`; the rail previously rendered with no icons at
  all, unlike data-manager's own rail (which already had its equivalent,
  `ENTITY_ICON_PATHS`/`entityIconSvg()`).
- **`RailNavComponent`** (`src/app/shared/components/rail-nav/`, shared with
  data-manager): was styled with the design-system's dark `--sidebar` theme,
  which doesn't match either original tool — both `dashboard/index.html`'s
  and `data-manager/index.html`'s own `.rail` are light panels. Restyled to
  match (`var(--card)`/`var(--text-dim)`, a `var(--primary)` left-accent bar
  on the active item, matching dashboard's own `.rail-item::before`). Also
  gained `logoSrc`/`logoAlt` inputs for an image rail-head logo (dashboard's
  `assets/logo-emblem.png`; data-manager keeps its plain text mark, since
  its own emblem lives in its topbar instead) and a `groupLabel` input
  (dashboard passes "Modul Eksekutif", matching the source; was hardcoded to
  the generic "Modul" for both consumers before).
- **Routing** (`dashboard-routing.module.ts`): one child route per module
  under the shell, `''` redirects to `geospasial`.
- **`DashboardDataService`**: TypeScript interfaces (`Kawasan`, `Province`,
  `SCurve`, `Komoditas`, `InfraKategori`, `KlCollab`, `AsalDaerah`, `IkuItem`,
  `NationalKPI`) plus the ported mock arrays, exposed via plain getter
  methods (no NgRx, per the spec — this data never changes at runtime except
  EWS ack state, which lives in its own service). All values are
  fabricated/illustrative, same as the source — not real ministry statistics.
  - **Update**: `kawasan` was later expanded from the original 10-entry mock
    list to the real 45-kawasan matrix (on request, from a user-provided
    "Matriks 45 Kawasan Transmigrasi Prioritas Nasional Tahun 2025" spreadsheet)
    — `KAWASAN_SEEDS`'s own doc comment in `dashboard-data.service.ts` has the
    full breakdown of what's now real (nama/kabupaten/provinsi/KPB flag) vs.
    still fabricated (everything else, deterministically derived by
    `deriveKawasan()`). `EwsService`'s alert titles were updated at the same
    time, since they used to name kawasan (Kobisonta, Bina Buay, Air Terang)
    that don't exist in the real 45. `mapX`/`mapY` and `foto` were dropped —
    see "Simplifications" below.
  - `provinces` and `nationalKPI` are derived the same way the original does
    (reduced from `kawasan` at read time, not stored separately).
  - `ikuList`: all **17** of the source's IKU rows, consumed by the
    Geospasial IKU-chip strip (see below) — previously a 7-row representative
    subset that wasn't rendered anywhere.
  - `kawasanAreaLatLngs()`/`seededRandom()` and `BASEMAP_BBOX`/
    `mercatorPx()`/`basemapPct()` (the fabricated per-kawasan polygon shape
    and the static-basemap projection math, respectively) are also ported
    here now, for `KawasanMapComponent` and the Geospasial locator inset.
- **`EwsService`**: the single shared `ewsAlerts` array (all 5 source alerts,
  verbatim) + `toggleAck()`, as a `BehaviorSubject`. Both `GeospasialComponent`
  and `AnalitikComponent` inject it and render their own EWS list from the
  same stream — this reproduces the original's *deliberate* duplication
  (CLAUDE.md: "a deliberate, flagged duplication, not an oversight") as two
  independent views over one real shared data source, which is arguably
  tighter than the original's two independent DOM-rendering functions over
  one shared array.
- **`AiMockService.answer(query)`**: `aiAnswer(q)` ported rule-for-rule
  (mandiri / risiko·bahaya / anggaran·budget / indeks·5t keyword branches,
  same fallback string). Explicitly not wired to any real LLM.
- **`ChatPanelComponent`** (`mode: 'compact' | 'full'`): one component used by
  both `GeospasialComponent` (compact, embedded) and `IntelijenComponent`
  (full), each with its own local `chatLog`, both calling the same
  `AiMockService` — so by construction the two chat UIs can't drift, matching
  the CLAUDE.md callout that the original's duplication here is intentional.
  Its opening message is now mode-dependent (`WELCOME.compact`/`.full`) — it
  previously hardcoded Intelijen's own wording ("Saya dapat merangkum...")
  for both, so the Geospasial mini chat was opening with the wrong greeting
  instead of the source's `#geoChatLog`-specific "Tanya cepat...".
- **`KpiTileComponent`**: `dir` now also accepts `'flat'` (no colour, ports
  `.k-delta.flat`) alongside `'up'`/`'down'` — previously binary. It also no
  longer auto-renders a trend arrow: the source's own `kpiTile()` never does
  either, so a `dir="up"` tile is plain black text unless the *caller's own
  delta string* happens to have "▲ " baked in (about half of them do, half
  don't — verified against every `kpiTile(...)` call site). The 3 consumers
  (Profil, Monitoring, Intelijen) were previously getting this wrong in both
  directions — a `dir` that should've been `flat`, or a missing/extra arrow
  glyph — fixed per call site to match the source exactly.
- **`KawasanMapComponent`**: real Leaflet + OSM tile layer, one `L.polygon`
  area per kawasan (`kawasanAreaLatLngs()`, not a point marker — see the
  Geospasial section below) colored by `STAGE_COLOR_HEX[tahap]`, popup with
  nama/provinsi/tahap/populasi/luas HPL, click emits `(select)`. `fitBounds()`
  to every kawasan's coordinates once added (not a fixed center/zoom), a
  `topright` zoom control, and a public `setAreaVisible(id, visible)` for the
  Geospasial layer catalogue. Created in `ngAfterViewInit`, torn down in
  `ngOnDestroy` (`map.remove()`), with a public `invalidateSize()` called by
  the parent after the map panel's fullscreen transition — mirrors the
  original's manual `activeLeafletMap` lifecycle discipline. The CSP
  static-basemap fallback (`BASEMAP_STATIC_SRC`, `renderDasarStatic()`) is
  still **not** ported here (an Artifact-preview-only workaround, irrelevant
  to a real Angular deployment) — but the same baked-in image now backs the
  separate locator inset in `GeospasialComponent`, which IS part of the live
  UI regardless of Leaflet availability (see below).
- **One component per module** under `components/`, each using
  `dgt-page-head` / `dgt-kpi-tile` / `dgt-data-table` / the chart components /
  `dgt-severity-badge` in place of the original's hand-rolled
  `.panel`/`.badge`/`.table-wrap`/SVG-builder markup:
  - `geospasial` — see "Geospasial" below, the flagship module.
  - `profil` — **rebuilt** (per a later wireframe, "Data Induk & Profil
    Kawasan Transmigrasi") from a single KPI-grid/sortable-table/drawer page
    into a two-level view: a landing page (national provinsi/kabupaten/
    kecamatan/desa KPI tiles, two Mandiri/Berkembang/Tertinggal classification
    donuts — "Indeks Intrans" bucketed off `indeks5t`, "Indeks Kinerja Utama"
    off `tahap`, see `profilBucketIndeks`/`profilBucketTahap` — and a
    searchable/filterable kawasan list) plus a per-kawasan drill-down
    (`view`/`selectedId`/`detailTab` state in `ProfilComponent`) with
    Ekonomi/Sosial/Perencanaan tabs built out and Patriot/Media stubbed (no
    wireframe exists for those two yet). The drill-down's numbers
    (population density, produk unggulan, sarana/kelembagaan ekonomi, usia/
    pendidikan/kesehatan/IDM-desa breakdowns, SHM certification share) are
    computed on demand by `profilDetailData()` in `dashboard-data.service.ts`
    from the existing `Kawasan` fields plus `seededRandom(k.id)`, the same
    approach `kawasanAreaLatLngs()` already uses — not stored as extra
    hand-authored literals per kawasan. `dgt-kpi-tile` gained optional
    `color`/`chip`/`sub` inputs for the drill-down's four solid-colour Ekonomi
    KPI cards; every other caller is unaffected (all three inputs default to
    unset). Mirrors the same rebuild in `legacy-static/dashboard/index.html`'s
    `renderProfil()` — see that file's own comment block for the full data-
    derivation rationale. Like the original's Ubah/Hapus buttons on the
    Produk Unggulan Kawasan table, this stays a read-only dashboard: those
    buttons are present but non-functional (no data-manager write-back).
    The Ekonomi tab later gained a "Profil Investasi Kawasan" block (hero
    image, a Deskripsi-kawasan stat panel, a static-basemap locator reusing
    `basemapPct()`, a generated description paragraph, and Infografis/Galeri
    placeholder grids) — added here rather than as a 6th tab or a separate
    page, since `ekonomi`'s own "Lihat Detail" cards and map pins link
    straight to it via `?kawasan=<id>` (read in `ngOnInit`), see that
    module's own bullet below. No per-kawasan photo assets were ported for
    Angular (see this file's earlier "Simplifications" note), so the hero
    image is the one generic `assets/hero-kawasan.jpg` for every kawasan.
  - `demografi` — asal-daerah bar chart, pembauran gauge, populasi-per-kawasan
    bar chart. **Hidden from the rail** per request ("make demografi &
    pembauran hidden but dont delete") — `DashboardShellComponent.navItems`
    carries a new optional `NavItem.hidden` flag; the route
    (`dashboard-routing.module.ts`) and this component are untouched and
    still directly reachable at `/dashboard/demografi`, just not linked to
    from the rail (`visibleNavItems` filters it out). A prior full removal of
    this module (and `infrastruktur`) was reverted, hence a visibility toggle
    this time rather than deleting it again — flip `hidden` back off on that
    entry to restore it.
  - `infrastruktur` — infra-category progress bars, K/L collaboration table.
  - `monitoring` — **KPI tiles adjusted** (per a later wireframe) from a
    generic Realisasi Fisik/Realisasi Anggaran/Program Berjalan/Tenggat
    Terlewat set to budget-specific Total Anggaran/Realisasi Anggaran/
    Persentase/Sisa Tahun Anggaran, plus an Area filter in the page-head
    toolbar (same field-inline pattern as `profil`'s) that narrows the
    Realisasi Anggaran per Kawasan bar chart only — the national KPI tiles
    and Kurva S stay unfiltered. Total/Realisasi/Persentase are derived
    together from one fixed illustrative `ANGGARAN_TOTAL_RP` and the same
    per-kawasan `anggaranPct` the bar chart already plots, see that constant's
    own comment for why (the wireframe's own figures were internally
    inconsistent). Mirrors the same change in `legacy-static/dashboard/
    index.html`'s `renderMonitoring()`.
  - `ekonomi` — **rebuilt** (per a later wireframe, "Ekonomi & Investasi
    Kawasan") from a bar-chart/stepper/static-table page into a national
    investment-discovery portal: 5 commodity shortcut cards (derived from
    every kawasan's `produkUnggulan`, not hand-authored — see
    `EkonomiComponent.komoditasFreq()`), a filter sidebar (Wilayah/Provinsi/
    Kategori Sektor are real filters; Peluang Investasi/Detil Peluang
    Investasi/Tahun are `disabled` single-option selects — no backing field
    exists for those three, same "don't fake a working control" call as the
    original's Site/Periode chips) plus a `dgt-kawasan-map` coloured by
    wilayah region instead of tahap, national productivity bars (derived from
    `komoditas`), and two summary tables, then a per-commodity kawasan card
    grid. `KawasanMapComponent` gained optional `fillColorOf`/`popupOf`
    inputs (default to the original tahap-based colouring/popup) so this
    module could reuse it rather than hand-rolling a second Leaflet wrapper.
    No separate "kawasan investment profile" page — a card or map-pin click
    navigates to `profil`'s Ekonomi tab via `?kawasan=<id>` (`ProfilComponent`
    reads it in `ngOnInit`); see that module's own bullet above for what was
    added there. Mirrors the same rebuild in `legacy-static/dashboard/
    index.html`'s `renderEkonomi()`.
  - `analitik` — priority-scoring table + the second EWS list (via
    `EwsService`, see above).
  - `intelijen` — **replaced** (per request) with the "Buat Laporan"
    report-generator hub: a Pilih Periode/Pilih Kawasan toolbar (Periode is a
    static `.info-chip`, same non-functional-context-chip precedent as
    Geospasial's Site/Periode; Pilih Kawasan is a real `<select>` over
    `DashboardDataService.getKawasan()` that drives each card's "N Kawasan"
    count), 5 report-type cards (cosmetic — `title` attribute, no click
    handler, same "present but non-functional" treatment as the Ubah/Hapus
    buttons elsewhere, since there's no backend to actually export a report
    from), a toggleable "History ekspor laporan" note, and an Asisten AI
    panel — this last piece is the one thing carried over from the old
    "Executive Intelligence & AI" module it replaced: same
    `<dgt-chat-panel>`, switched from `mode="full"` to `mode="compact"` to
    match the new wireframe's shorter welcome copy. Route id and component
    class are both kept as `intelijen` to keep the diff small — see
    `DashboardShellComponent.navItems`' own comment. Mirrors the same
    replacement in `legacy-static/dashboard/index.html`'s `renderLaporan()`
    (which, unlike here, did rename the id to `"laporan"`).

## Geospasial — what's in, what's deliberately different

**Update (latest, third pass)**: on request, after the full-bleed rewrite
below landed: the 10→45 kawasan data expansion (see `DashboardDataService`'s
own bullet above), a second legality layer (SHM, alongside HPL), a kawasan-type
filter in the left panel, a "Detail Kawasan" card back in the right panel, the
right panel's trend chart switched from budget to Indeks 5T, a simplified EWS
summary (category grid + one top alert instead of the full list), the
toolbar's alert count moved into a bell icon, and the top toolbar shrunk to
its content width. Full rationale for each is in `GeospasialComponent`'s own
doc comment ("**Second pass**" — the component's second pass, third overall
counting the pre-full-bleed layout) rather than duplicated here.

**Update (full-bleed rewrite)**: `GeospasialComponent` was rewritten a second
time, from the card/two-column layout described further below to a full-bleed
map with floating panels — on request, from a "DGT DSS" reference mockup. This
was a **structural** rewrite only; no data model changes (those came later, in
the pass above). CLAUDE.md's own "Architecture of dashboard/index.html"
section is now stale for Geospasial in two independent ways (see its own
already-acknowledged staleness note) — none of these passes has updated it;
still an open TODO.

What the new layout keeps from the reference: a full-bleed `KawasanMapComponent`
(`showZoomControl=false`, its own bottom-toolbar zoom buttons drive it instead
via new `zoomIn()`/`zoomOut()`/`resetView()`/`getZoom()` methods and a
`(viewChange)` output added for this), a floating top filter toolbar, a
floating left "Manajemen Lapisan" layer panel, a floating right "Ringkasan
Seluruh Kawasan" summary panel, and a floating bottom toolbar + status bar.

What was **adapted rather than faked**, since the reference assumes data this
app doesn't have:
- The reference groups kawasan into 4 types (WPT/SKP/SP/KTM) and shows a
  6-category EWS breakdown. The real `Kawasan.tipe` union only has 2 values
  (SKP/KPB), and there are only 5 `EwsAlert`s total. The left/right panels
  group by whatever's real instead — 2 type toggles, and EWS categories
  derived by splitting each alert's own title on its em dash
  (`ewsCategoryOf()` in the component), which happens to yield 5 distinct
  one-alert-each categories from the current 5 alerts (adding more alerts
  with a shared prefix would naturally group them for real).
- The reference's map is a 3D photorealistic satellite render with marker
  clustering; this is still the existing 2D Leaflet + OSM polygon-area map,
  just filling the page instead of sitting in a bordered card panel — no
  paid 3D/satellite tile provider is wired into this repo.
- The reference's bottom toolbar has several icons with no obvious real
  feature behind them in this app (a 3D toggle, a settings gear, a clock, an
  images icon, a theme toggle — the shell already has its own global
  `<dgt-theme-toggle>`). Left out rather than shipped as dead buttons, same
  "don't fake a working control" precedent already used elsewhere in this
  module (Site/Periode) and in `ekonomi` (see that module's own bullet). The
  bottom toolbar here only has a recenter button and zoom −/+ with a live
  zoom-level readout.
- The reference's bottom status bar shows a fixed "408 km" distance and a
  named-agency map/data source attribution this app can't honestly claim.
  Replaced with the map's actual live center lat/long (from `(viewChange)`).

What was **dropped outright** (not shown in the reference, and this was an
explicit "change layout completely" request): the 17-item IKU chip strip, the
fullscreen/expand toggle (`toggleFullscreen()`/`panelsHidden`/`toolbarTpl`/
`detailPanelTpl` `ngTemplateOutlet` relocation — "without expand button life
before"), the tabbed Detail Kawasan card (Profil/Tabel/Grafik/Foto), the
Kawasan Teratas & Terendah ranking card, the embedded `<dgt-chat-panel>`, the
Grid Provinsi map view, the `.ticker-bar` marquee, and the static-basemap
"you are here" locator inset (see `KawasanMapComponent`'s own doc comment —
it no longer makes sense once the map itself is full-bleed). Selecting a
kawasan is now done by clicking its name in the left layer list or its
polygon on the map; a real Provinsi `<select>` in the top toolbar now
actually filters which kawasan are plotted (previously only Ekonomi's
already-separate map had a real region filter).

The map's own polygon-per-kawasan drawing (`kawasanAreaLatLngs()`,
`STAGE_COLOR_HEX` fill, `fitBounds()` on load) is unchanged — see the
"pre-rewrite" paragraphs below, still accurate for that part.

### Pre-rewrite layout (superseded, kept for history)

The previous version had a DSS toolbar (Site/Periode context chips + a real
Area `<select>` + an alert chip that scrolls to the EWS panel), a
horizontally-scrolling 17-item IKU chip row with a shared expandable detail
box, a two-column `row`/`col-lg-8`+`col-lg-4` layout with the map panel +
tabbed "Detail Kawasan" + a collapsible per-kawasan layer catalogue overlay
on the left, and Summary/EWS/AI-chat panels on the right, plus a ticker
marquee — and a fullscreen mode built via `*ngTemplateOutlet` template
relocation rather than the original's direct DOM manipulation. All of this
is gone now; see above for what replaced it.

## Simplifications vs. the source (beyond the Geospasial note above)

- **Photos** (`kawasan.foto`, `assets/kawasan/`, `cityIllustration()`): the
  `Kawasan` interface keeps an optional `foto` field, but no `foto` values or
  asset files were carried over, and the SVG-skyline `cityIllustration()`
  fallback was not ported. Nothing in the Angular app currently renders this
  field at all — Geospasial's own "Foto" detail tab that used to show it was
  dropped in its latest rewrite (see "Geospasial" above). Low priority to
  backfill since the real asset files live outside this Angular workspace.
- **`mapX`/`mapY`** on `kawasan` were dropped — CLAUDE.md itself calls these
  "unused leftovers from a removed locator inset," so there was nothing to
  port.
- **Indonesian number formatting**: the original calls
  `.toLocaleString('id-ID')` throughout; this port uses Angular's `number`
  pipe with a digits-format string but no explicit locale (the app doesn't
  register `id-ID` locale data anywhere, and doing so is outside this
  module's scope), so grouping separators render in the runtime's default
  locale rather than Indonesian style. Cosmetic only.

## Discovered while building the Geospasial full-bleed rewrite (pre-existing, out of scope here)

- **Leaflet's animated zoom is very slow/unreliable app-wide.** Calling `map.zoomIn()`/
  `setZoom()`/`fitBounds()` without `{ animate: false }` visibly does nothing for several seconds
  (`getZoom()` empirically stayed at the pre-call value for 2+ seconds in a live check) before the
  zoom finally lands. Leaflet's animated zoom finalizes on a CSS `transitionend` from its internal
  pane transform — something in this app's global CSS cascade appears to interfere with that
  transition's timing. Geospasial's own new toolbar zoom buttons route around it with
  `{ animate: false }` (see `KawasanMapComponent.zoomIn()`/`zoomOut()`/`resetView()`'s own comments),
  but the pre-existing topright Leaflet zoom control (used by Ekonomi's map, and previously by
  Geospasial's own map before this rewrite) still uses the default animated path and is presumably
  still affected — nobody may have noticed since a slow zoom control easily reads as "the map is
  just laggy" rather than "zoom is broken." Worth a real investigation (start with whatever sets a
  global `transition` on a broad selector) rather than patching every call site with
  `animate: false` piecemeal.
- **`RailNavComponent`'s collapsed `.rail` inflates page height on every dashboard route.**
  `.rail.collapsed` goes to `width: 0` but doesn't hide its label text (only `overflow: hidden`),
  which wraps into a very tall single-character column at zero available width. That makes `.shell`'s
  flex-row height (and `.main`, stretched to match it via default `align-items: stretch`) taller than
  the viewport on every dashboard page — empirically ~1018px measured on a ~660–730px-tall window,
  regardless of window size. Invisible everywhere else since those pages already scroll normally for
  legitimate reasons; only became visible while building Geospasial's `height: 100vh` full-bleed page
  (worked around locally with `position: fixed; inset: 0`, see that component's own SCSS comment).
  The real fix belongs in `RailNavComponent` itself — likely hiding collapsed labels via
  `white-space: nowrap` (so they clip instead of wrapping) rather than relying on `overflow: hidden`
  alone, or hiding them outright when collapsed.

## Explicit TODOs for the team

- Update CLAUDE.md's "Architecture of dashboard/index.html" section — it
  still documents the pre-IKU-chip/fullscreen/layer-catalogue Geospasial
  layout (see the Geospasial section above, now ported and up to date here).
- Backfill real kawasan photos once/if the asset files are brought into the
  Angular workspace (`src/assets/...`) and wired to `Kawasan.foto`.
- Register `id-ID` Angular locale data app-wide if pixel-accurate Indonesian
  number formatting matters (`registerLocaleData` + `LOCALE_ID` provider —
  touches `app.module.ts`, outside this module's scope).
- No automated tests exist for this module (none exist anywhere in the
  Angular workspace yet, matching the rest of the repo's no-build/no-test
  convention carried over from the original static prototype).
