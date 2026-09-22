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
  - Ported **all 10** of the source's `kawasan` entries (not a trimmed
    subset), field-for-field, since 10 was already within the suggested
    8–12 range. `mapX`/`mapY` and `foto` were dropped — see "Simplifications"
    below.
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

**Update**: `GeospasialComponent` now ports the **current**
`dashboard/index.html` Geospasial module, not the older layout CLAUDE.md's
own "Architecture" section still describes — that section is itself stale
(see the flag it already carries). CLAUDE.md should be updated to match,
but as of this pass it has not been (out of scope for this component).

DSS toolbar (Site/Periode context chips + a real Area `<select>` + an alert
chip that scrolls to the EWS panel — no page title/description above it, per
the source's own "no header for dashboard app"), a horizontally-scrolling
**17-item IKU chip row** (`.stg-strip`/`.stg-strip-row` class names kept from
the older STG-tile strip, same as the source) with a shared expandable
detail box, a two-column `row`/`col-lg-8`+`col-lg-4` layout with the map
panel + tabbed "Detail Kawasan" (Profil/Tabel/Grafik/Foto) + a collapsible
per-kawasan **layer catalogue** overlay on the left, and
Summary/EWS/AI-chat panels (no more Komoditas panel — removed in the source)
on the right, plus a `.ticker-bar` marquee of unacknowledged alerts.

**Fullscreen mode** ("Perbesar panel peta"): the map panel takes over the
viewport; the filter toolbar and the Detail Kawasan panel need to appear in
a different spot while it's active. The original does this via direct DOM
manipulation (`insertBefore`/`appendChild` on raw nodes). This port achieves
the same visual result the idiomatic Angular way instead: `toolbarTpl` and
`detailPanelTpl` are each declared once (`<ng-template>`) and instantiated
in whichever of two spots is active via `*ngTemplateOutlet`, gated by the
`fullscreen` flag — no manual DOM reparenting. Layering (the fixed map panel
vs. everything floating on top of it) is done with the same z-index-context
approach as the original, just expressed over Bootstrap's `.row`/`.card`
instead of the hand-rolled `.grid-2`/`.panel`.

The map itself now draws each kawasan as a real irregular polygon area
(`kawasanAreaLatLngs()`, ported to `DashboardDataService`) instead of a
point marker, colored by `STAGE_COLOR_HEX` — see `KawasanMapComponent`.
`fitBounds()` to every kawasan's coordinates on load (fixing SKP Salor,
Papua, previously off-screen at a fixed center/zoom) and a `topright`
zoom control (clearing space for the layer catalogue) are ported too.

The "you are here" **locator inset** is also now ported — previously
skipped because it depended on the CSP-only static-basemap fallback image.
That image (`BASEMAP_STATIC_SRC`, a real OSM zoom-5 mosaic baked into the
original as base64) was extracted and committed as a real file,
`src/assets/basemap-indonesia.jpg`, rather than inlined as a giant base64
string in a component — same pixels, more usable in an editor/diff. The
`mercatorPx()`/`basemapPct()` projection math that places the dot on it
lives in `DashboardDataService` alongside `BASEMAP_BBOX`.

## Simplifications vs. the source (beyond the Geospasial note above)

- **Photos** (`kawasan.foto`, `assets/kawasan/`, `cityIllustration()`):
  the `Kawasan` interface keeps an optional `foto` field and the Geospasial
  "Foto" detail tab renders it when present, but no `foto` values or asset
  files were carried over, and the SVG-skyline `cityIllustration()` fallback
  was not ported (the tab shows a plain "no photo" placeholder instead). Low
  priority to backfill since the real asset files live outside this Angular
  workspace.
- **`mapX`/`mapY`** on `kawasan` were dropped — CLAUDE.md itself calls these
  "unused leftovers from a removed locator inset," so there was nothing to
  port.
- **Indonesian number formatting**: the original calls
  `.toLocaleString('id-ID')` throughout; this port uses Angular's `number`
  pipe with a digits-format string but no explicit locale (the app doesn't
  register `id-ID` locale data anywhere, and doing so is outside this
  module's scope), so grouping separators render in the runtime's default
  locale rather than Indonesian style. Cosmetic only.

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
