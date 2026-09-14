# Dashboard module — port notes

Angular 8 port of `dashboard/index.html` (the original, ~2247-line static
prototype — see repo-root `CLAUDE.md`, "Architecture of dashboard/index.html").
Everything below lives under `src/app/dashboard/`.

## What's implemented

- **Shell**: `DashboardShellComponent` wraps `<dgt-app-shell>` (rail + topbar,
  already built in `src/app/shell`) around a `<router-outlet>`. `activeId` is
  derived from the deepest activated child route's `data.navId`, updated on
  every `NavigationEnd`. The 8 `NavItem`s (id/label/sub) are copied verbatim
  from the original `MODULES` array, in the same order (Geospasial first —
  it's the landing module, `state.tab` defaults to it in the source).
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
  - `profil` — KPI grid, sortable kawasan table (`dgt-data-table`), detail
    panel, stage-distribution donut.
  - `demografi` — asal-daerah bar chart, pembauran gauge, populasi-per-kawasan
    bar chart.
  - `infrastruktur` — infra-category progress bars, K/L collaboration table.
  - `monitoring` — KPI grid, `dgt-dual-line-chart` Kurva S, anggaran bar chart.
  - `ekonomi` — komoditas bar chart, hilirisasi stepper, investment table
    (last two ported as the original's own hard-coded static rows).
  - `analitik` — priority-scoring table + the second EWS list (via
    `EwsService`, see above).
  - `intelijen` — KPI grid, disabled "Laporan Strategis" action buttons
    (ported as `disabled`, matching the original), full `ChatPanelComponent`.

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
