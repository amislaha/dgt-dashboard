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
  - `ikuList`: ported **7 of the source's 17** IKU rows (a representative
    subset spanning different `satuan` types) — kept in the data service for
    completeness but not currently consumed by any component (see below).
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
- **`KawasanMapComponent`**: real Leaflet + OSM tile layer, one
  `L.circleMarker` per kawasan colored by `STAGE_COLOR_HEX[tahap]`, popup with
  nama/provinsi/indeks5t, click emits `(select)`. Created in
  `ngAfterViewInit`, torn down in `ngOnDestroy` (`map.remove()`), with a
  public `invalidateSize()` called by the parent after the map panel's expand
  transition — mirrors the original's manual `activeLeafletMap` lifecycle
  discipline. The CSP static-basemap fallback (`BASEMAP_STATIC_SRC`,
  `renderDasarStatic()`) was intentionally **not** ported — the spec calls
  this out explicitly as an Artifact-preview-only workaround, irrelevant to a
  real Angular deployment.
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

`GeospasialComponent` ports the layout **CLAUDE.md documents** ("Geospasial
module layout" section): DSS toolbar (Site/Periode context chips + a real
Area `<select>` + an alert chip that scrolls to the EWS panel), a
`.scroll-snap-row` of `dgt-kpi-tile`s for the 7 executive-summary metrics
(Kawasan Mandiri / Populasi / Indeks 5T / Realisasi Anggaran / Capaian
Infrastruktur / Komoditas Unggulan / Peringatan Aktif), a two-column
`grid-2`-equivalent (Bootstrap `row`/`col-lg-8`+`col-lg-4`) with the map panel
+ tabbed "Detail Kawasan" (Profil/Tabel/Grafik/Foto) on the left and
Summary/EWS/Komoditas/AI-chat panels on the right, and a `.ticker-bar`
marquee of unacknowledged alerts.

**Important divergence to flag**: while reading the *current*
`dashboard/index.html` in full (as instructed) to build this port, its
Geospasial module turned out to have evolved substantially past what
CLAUDE.md's "Architecture" section describes — recent commits
(`16acabd` "Geospasial fullscreen layout rework", `cd1fc12` "Fix Geospasial
fullscreen map, add layer catalogue and per-panel hide") replaced the
KPI-strip with a horizontally-scrolling **17-item IKU chip row** (with a
shared expandable detail box), added a **fullscreen map mode** that
reparents the filter toolbar and several panels via direct DOM manipulation,
and added a collapsible **per-kawasan layer catalogue** overlay on the map.
None of that is mentioned in CLAUDE.md. This port follows CLAUDE.md's
documented architecture (the STG-tile strip) rather than reverse-engineering
the newer undocumented layout, and does **not** implement: the IKU chip
row/detail box, fullscreen mode, or the per-kawasan layer catalogue toggle.
The province "grid" view toggle, kawasan search, map-panel expand/collapse,
tabbed Detail Kawasan, ranked summary panel, EWS panel, komoditas panel, and
embedded AI chat are all ported. Flagging this for the team rather than
silently picking one version.

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
- **Locator inset** (`.map-locator`, `basemapPct()`/`mercatorPx()` projection
  math) was not ported — it existed only to place a dot on the static
  fallback image, which this port doesn't use (see Leaflet note above).
- **Indonesian number formatting**: the original calls
  `.toLocaleString('id-ID')` throughout; this port uses Angular's `number`
  pipe with a digits-format string but no explicit locale (the app doesn't
  register `id-ID` locale data anywhere, and doing so is outside this
  module's scope), so grouping separators render in the runtime's default
  locale rather than Indonesian style. Cosmetic only.
- **IKU list**: 7 of 17 rows ported into `DashboardDataService.getIkuList()`
  but not currently rendered anywhere (see Geospasial divergence above) —
  left in place for whichever team decision follows on the IKU-chip question.

## Explicit TODOs for the team

- Decide whether to chase the newer Geospasial layout (IKU chips, fullscreen
  mode, layer catalogue) in a follow-up pass, or keep this port aligned with
  CLAUDE.md's documented architecture and update CLAUDE.md instead.
- Backfill real kawasan photos once/if the asset files are brought into the
  Angular workspace (`src/assets/...`) and wired to `Kawasan.foto`.
- Register `id-ID` Angular locale data app-wide if pixel-accurate Indonesian
  number formatting matters (`registerLocaleData` + `LOCALE_ID` provider —
  touches `app.module.ts`, outside this module's scope).
- No automated tests exist for this module (none exist anywhere in the
  Angular workspace yet, matching the rest of the repo's no-build/no-test
  convention carried over from the original static prototype).
