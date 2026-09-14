# Geomapping module — port notes

Angular port of `geomapping/index.html` (the original, ~3316-line self-contained PWA prototype —
see repo-root `CLAUDE.md` and the source file's own top comment for the PRD this follows:
`PRD_Geomapping.docx` v1.0, 9 Sep 2026). Everything below lives under `src/app/geomapping/`.

This is a genuinely large app — a full-screen Leaflet map workspace with drawing tools, GPS
tracking, a dynamic per-feature questionnaire, an approval workflow, activity log, and task list
— so it's being ported in phases rather than one pass. **This first pass (Phase 1) is the shell +
two read-mostly views: Public Mapping and My Layers.** See "Explicit TODOs" below for the rest.

## What's implemented (Phase 1)

- **`GeomappingShellComponent`**: the persistent chrome — `.topbar` (brand/back-to-DGT link, panel
  toggle, WC chip, user menu with "Setel ulang data lokal", language-button stub), the icon
  `.rail` (6 views + badges for Task/Approval counts), the persistent `<dgt-geomapping-map>`, the
  floating `.dock` panel (collapsible, `<router-outlet>` for the active view), and the floating
  `.map-ctrls` (basemap picker popover, boundary-overlay toggle, POI-layer toggle). Deliberately
  bespoke, not the shared `<dgt-app-shell>` — see its own doc comment for why (nothing about this
  app's full-screen-map-plus-floating-dock chrome resembles the other two tools' shells).
  - The original switches panels via one `state.view` string + a hand-rolled `renderPanel()`
    dispatch, with the map untouched across switches. This port keeps that same "map is
    shell-owned and persists; only the dock panel changes" structure, but expresses the view
    switch as real child routes (`/geomapping/public`, `/geomapping/mylayers`, …) into a
    `<router-outlet>` inside the dock panel body, matching how `DashboardShellComponent` already
    relates a persistent shell to routed content — and getting deep-linkable URLs per view free.
- **`GeomappingDataService`**: the original's module-level `store`/`classifications`/`features`/
  `compartments`/`tasks`/`activity`/scalar `state` bits + `persist()`, `clsById`/`wcById`/
  `classOrder`/`clsLabel`, the approval-count helper, `logActivity`. Reactive (one `BehaviorSubject`
  per collection/scalar) instead of "mutate the module var, call the matching renderX() by hand".
  **Same `geomapping:` localStorage key prefix as the original** (matching how the Angular
  data-manager port kept `dgt-data-manager:`) — deliberate: this port and the original static tool
  share an origin (github.io), so existing local data carries over rather than starting empty.
  CLS_VERSION/CLS_REMAP migration logic ported verbatim for the same reason.
- **`GeomappingMapComponent`**: real Leaflet, the same component-per-map pattern as the dashboard
  port's `KawasanMapComponent`. Basemap tile-layer switching (all 7 `BASEMAPS`), the feature layer
  (Point/LineString/Polygon styled by classification colour, with the same popup content and
  area/length as the original), the static POI layer, and the illustrative boundary grid overlay
  (`BND_LEVELS`/`BND_BBOX`) — all read-only render. A feature click emits `(selectFeature)` so a
  later phase can wire in the editor without touching this component again, but for now it just
  opens the same popup Leaflet would show regardless.
- **`PublicMappingComponent`** (`renderPublicPanel()`): full WorkCompartment CRUD — create (name/
  desc/thumbnail-emoji picker), activate/deactivate (click a row), delete (tap-to-arm, tap again to
  confirm, matching the original), exit back to default Public Mapping via the header button or the
  topbar's WC chip. Feature counts per compartment.
- **`MyLayersComponent`** (`renderMyLayersPanel()`): the feature list (search by title/address,
  geometry-type segmented filter, compartment scope toggle when one is active), delete-with-confirm
  per row, and the classification manager moved here from the original's removed Layers menu
  (`classPanelHtml()`/`wireClassPanel()`) — per-classification visibility toggle + add a new one
  (name/colour/icon/description). GeoJSON export (`toGeoJSON()` + a Blob download, same shape as
  the original's `exportGeoJSON()`) and import (`<input type="file">` + `FileReader`, same
  parse/validate/merge logic as `importGeoJSON()`) are both ported too — neither depends on the
  drawing tools, so there was no reason to defer them to a later phase.
- **`GeomappingToastService`**: ports `toast(msg, kind)` as a small shared service (`#toastWrap`
  was a module-level DOM reference in the original; Angular components can't reach across each
  other's templates that way, so every panel component that wants a toast injects this instead).
- **Launcher**: the GEOMAPPING card (`angular-app/src/app/launcher/launcher.component.ts`) now
  routes internally (`/geomapping`) instead of an external link to the sibling static site — same
  change already made for `/dashboard` and `/data-manager` when those were ported. GIS DGT is
  still external (still just a "coming soon" placeholder in the static original, nothing to port).

## Explicit TODOs — later phases, in roughly the order they'd naturally build on each other

1. **Edit Mode — manual drawing** (`beginDraw`/`addDrawPoint`/`finishDraw`/`mountEditShape`/
   `renderHandles` and friends): draw Point/LineString/Polygon by clicking the map, vertex/midpoint
   drag handles, the shape-tool toolbar (vertex/move/add-vertex/delete-vertex modes).
2. **Edit Mode — GPS tracking** (`requestMyLoc`/`startTrackPoint`/`renderCountdown`/
   `startLineTrack`/`lineTrackAddCurrent`/etc.): the 10-second countdown Tracking Point flow, the
   stepwise Tracking Line/Polygon flow from the "My Location" balloon, the locate FAB.
3. **The feature editor form + questionnaire dialog** (`openEditor`/`renderEditorForm`/
   `openQuestionnaireDialog`/`renderQdlg`): General Info fields, the classification picker (dock-top
   `<details class="collection">`, not yet ported — Phase 1's dock top is empty, no search row
   either, see below), image-URL list, the Wizard/Scroll-View questionnaire modal
   (`QUESTIONNAIRE`, already modelled in `GeomappingFeature.questionnaire` but no UI reads/writes
   it yet).
4. **Approval panel** (`renderApprovalPanel()`/`setApproval()`): review pending objects, approve/
   reject with a note, history. `GeomappingDataService` doesn't have `setApproval()`/
   `ensureApproval()` yet either — add alongside the panel.
5. **Task panel** (`renderTaskPanel()`): the survey to-do list, toggle done. `DEFAULT_TASKS`/
   `GeomappingTask` already modelled; just needs the panel + a `toggleTaskDone()` data-service
   method.
6. **Activity panel** (`renderActivityPanel()`): the log list UI. `logActivity()`/`activity$`
   already exist and are already being called by everything above; just needs the panel.
7. **Search** (`runSearch()`/`dropPin()`/`zoomToFeature()`, Nominatim geocoding) and the dock-top
   search row + classification-collection picker (`renderDockTop()`) — Phase 1 left the dock top
   empty rather than ship a non-functional search box; build both together.
8. **PWA** (`manifest.webmanifest`, `sw.js`, `icon.svg`): not touched at all. Would need the
   `@angular/pwa` schematic (adds `ngsw-config.json` + registers `@angular/service-worker`) rather
   than copying the original's hand-written service worker — a real build/tooling change, out of
   scope for a component-level port pass, and this workspace has never been through a real
   `ng build`/`ng serve` yet regardless (see root `angular-app/README.md`'s Node-version caveat).
9. **`wc-fab`** (the floating "+ WorkCompartment" quick-create button, shown only in Public
   Mapping) and the **`.map-fab`** locate button weren't ported — both are reachable via
   already-ported UI (the "Buat WorkCompartment" button inside the panel; the locate FAB has no
   home until GPS tracking, item 2, lands), so there's no dangling requirement, just noting they're
   visually absent from Phase 1.

## Simplifications / things to double-check once the workspace has a real build

- Same as every other module in this port: **never been through a real `ng build`/`ng serve`**
  (Node 24 here can't run the Angular 8 toolchain) — hand-written to be correct, but treat the
  team's first real build as the first actual compile check.
- TypeScript is pinned to `~3.5.3` for this workspace (see `angular-app/package.json`) — **no
  optional chaining (`?.`) or nullish coalescing (`??`) in `.ts` files**, both are TS 3.7+ syntax.
  Angular templates have their own, older safe-navigation `?.` operator (compiled by the Angular
  template compiler, not TypeScript) which is fine to use in `.html` files.
- `GeomappingMapComponent`'s boundary grid and POI layer are rebuilt/replayed on every relevant
  `@Input` change (`ngOnChanges`) rather than diffed — fine at this data size (POIs: 8, boundary
  cells: up to 8×8), matches the original's own `renderPOIs()`/`renderBoundaries()` doing a full
  `clearLayers()`+rebuild each time too.
