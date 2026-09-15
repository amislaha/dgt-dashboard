# Geomapping module — port notes

Angular port of `geomapping/index.html` (the original, ~3316-line self-contained PWA prototype —
see repo-root `CLAUDE.md` and the source file's own top comment for the PRD this follows:
`PRD_Geomapping.docx` v1.0, 9 Sep 2026). Everything below lives under `src/app/geomapping/`.

This is a genuinely large app — a full-screen Leaflet map workspace with drawing tools, GPS
tracking, a dynamic per-feature questionnaire, an approval workflow, activity log, and task list
— so it's being ported in phases rather than one pass. **Phase 1 is the shell + two read-mostly
views (Public Mapping, My Layers). Phase 2 adds Approval/Task/Activity. Phase 3 adds Edit Mode**
(manual drawing, GPS tracking, the feature editor + questionnaire dialog) — the last of the
originally-scoped work; see "Explicit TODOs" below for what's still left (search, PWA, two cosmetic
FABs — none of it blocking).

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
- **The old static `geomapping/` moved to `legacy-static/geomapping/`** — it occupied the exact
  `/geomapping` URL this port's own route needs, and GitHub Pages serves a real file at an exact
  path before ever falling through to the Angular SPA, so the static site was silently winning
  over this port at that URL until it moved (same fix `dashboard/`/`data-manager/` needed
  earlier). See root `CLAUDE.md`'s "Hosting / visibility" section.

## Phase 2 — what's implemented (Approval / Task / Activity)

- **`ApprovalComponent`** (`renderApprovalPanel()`/`apprRowHtml()`/`approvalMetaHtml()`/
  `apprHistoryHtml()`/`apprChip()`): status filter tabs with live counts, sorted list (pending →
  rejected → approved, then newest-submitted-first within each), expandable rows with the full
  approval meta block + history + a reviewer note field, and the three actions (Approve/Reject/
  Reset-to-Pending) — rejecting without a note is blocked, matching the original. Any signed-in
  user can act as reviewer, same as the original (no real role check, front-end prototype).
  `GeomappingDataService.setApproval()` added for this. The "Buka di peta / editor" link
  (`zoomToFeature()`/`openEditor()` in the original) now really does both — Phase 3.
- **`TaskComponent`** (`renderTaskPanel()`): the to-do list, toggle done, delete, add a new task
  (title only, same as the original). `GeomappingDataService.addTask()`/`toggleTaskDone()`/
  `deleteTask()` added. One deliberate fix vs. the source: its delete button
  (`class="li-act"`) never actually gets the `.li-act` icon-button styling, because that CSS rule
  is scoped to `.list-item .li-act` and task rows use `.task-item` instead — a CSS-scoping miss in
  the source, not a real design choice, so this port gives it the same styling rather than
  reproducing the miss.
- **`ActivityComponent`** (`renderActivityPanel()`): the log list, "Bersihkan" (clear) with the
  same tap-to-arm/tap-to-confirm pattern used elsewhere. `GeomappingDataService.clearActivity()`
  added.

## Phase 3 — what's implemented (Edit Mode: drawing, GPS tracking, editor, questionnaire)

The biggest phase by far — "bagian tersulit" as flagged going in. New pieces:

- **`GeomappingEditService`** (new): the orchestration core, replacing the source's module-level
  `state.drawType`/`state.editing`/`state.lineTrack`/`state.countdown`/`state.myLoc`/
  `state.shapeMode` + the functions that mutate them (`beginDraw`/`addDrawPoint`/`finishDraw`/
  `cancelDraw`/`requestMyLoc`/`startTrackPoint`/`startLineTrack`/`lineTrackAdd*`/`openEditor`/
  `cancelEditing`/`saveEditor`, and the vertex-mutation half of `renderHandles`). See the service's
  own doc comment for the one real architectural departure: a vertex/shape **drag** doesn't push
  through the authoritative `editing$` state on every mouse-move tick (unlike the source, which
  rebuilds all Leaflet handle markers on every tick in "move" mode) — live ticks go through a
  separate `liveLatLngs$` channel instead, so `GeomappingMapComponent` can move the dragged layer's
  coordinates directly without Angular recreating the marker out from under the cursor; the
  authoritative state (driving the editor form's readout numbers too) advances once on drag-end.
  `EditingState.sessionId` (bumped only by `openEditor()`) is what lets `EditComponent` tell "a new
  editing session started, (re)load the form" apart from "the same session's draft changed
  underneath it" (a drag commit, a classification pick) — see that field's doc comment; without it,
  every live-draft change would wipe whatever the user had just typed into Judul/Deskripsi, since
  those (like the source, which reads them straight from the DOM only at Simpan) are local
  component fields, not stored on the draft until save.
- **Bug found and fixed during live testing**: a vertex/shape drag's `commitVertices()` call was
  originally made synchronously from the marker's own `dragend` handler. That handler runs *inside*
  Leaflet's own `Draggable._onUp` → `Marker._onDragEnd` → `fire('dragend')` call stack;
  `commitVertices()` triggers `editing$`, which `GeomappingMapComponent` answers by rebuilding the
  whole handle layer (`clearLayers()` + fresh markers) — doing that while Leaflet is still unwinding
  its own drag-end handling for the very marker being torn down corrupted Leaflet's internal drag
  state (an orphaned marker DOM node left outside the map) and silently dropped the drag itself (the
  vertex reverted to its pre-drag position on save, even though the live readout had shown the
  dragged numbers correctly during the drag). Fixed by deferring the `commitVertices()` call one
  macrotask (`setTimeout(…, 0)`) so Leaflet finishes unwinding before the layer gets rebuilt — same
  fix in both the vertex-handle and the Point-marker `dragend` handlers. With the fix, re-tested
  drags correctly reflect the moved vertex in the live readout, the committed `editing$` state, and
  the persisted feature after Simpan, with no leftover/orphaned marker DOM nodes.
  **Caveat**: this was tested by dispatching synthetic `MouseEvent`s at a marker/`document` (this
  sandbox has no real pointer input, and this session's browser-automation tool could not drive a
  reliable genuine mouse drag either), not a real mouse/touchscreen drag. Those synthetic tests
  still logged an uncaught Leaflet-internal exception (`TypeError: Cannot read properties of
  undefined (reading 'baseVal')`, inside minified `Draggable.finishDrag`/`Draggable.disable`) even
  after the fix, without visibly affecting the outcome (state and DOM both ended up correct in every
  retest) — plausibly an artifact of synthetic events skipping timing/pointer-capture details a real
  drag has, but not confirmed either way. Worth a real-device pass before relying on this deeply;
  if the same exception reproduces there, treat this fix as necessary-but-not-sufficient and dig
  further into `Draggable`'s internals rather than assuming the deferral alone is the whole story.
- **`GeomappingMapComponent`** (extended): now also owns every Edit Mode Leaflet layer — the manual-
  draw dashed preview + point handles (`refreshDrawPreview`), the shape actually being edited
  (`mountEditShape`/`renderHandles`, including vertex/move/add-vertex/delete-vertex mode handling),
  the GPS tracking-line preview (`drawLineTrack`), and the My Location balloon (`setMyLoc`). Injects
  `GeomappingEditService` directly (not threaded through `@Input`s from the shell) since editing
  needs frequent two-way interaction with the live `L.Map` that doesn't fit the shell's existing
  one-way data flow — same reasoning every routed panel component already uses for
  `GeomappingDataService`. Opening an *existing* feature (from My Layers, Approval, or — not yet
  wired, see TODOs — search) now also pans/zooms the map to it (`zoomToFeature()`'s effect), folded
  into the same `editing$` subscription that mounts the shape, rather than requiring every call site
  to remember to trigger it separately.
- **`EditComponent`** (new, routed at `/geomapping/edit`, replacing `ComingSoonComponent` — which
  is now unused everywhere and was deleted): the dock-panel body, dispatching the same if/else-if
  chain as `renderEditPanel()` — countdown echo text → line-track panel → in-progress manual-draw
  prompt → the full editor form → the Edit Mode landing (Tracking Point/Line/Polygon entry cards +
  manual-draw grid + "Terakhir ditambahkan" recent-objects list, now with working row-click-to-edit
  and delete). The editor form ports all 6 steps (Klasifikasi, General Info, Questionnaire,
  read-only Status Approval, Sunting Bentuk shape tools, Save/Cancel/Delete) — see the component's
  own doc comment for the title/description/address/privilege-stay-local-until-Simpan design.
  Leaving the `/geomapping/edit` route (`ngOnDestroy`) cancels whatever drawing/tracking/editing was
  in progress, porting the source's rail-click-handler behaviour (`if (v !== "edit") { cancel... }`)
  as route-scoped cleanup instead, since in this port's routed structure navigating away from Edit
  Mode *is* leaving the `edit` view.
- **`QuestionnaireDialogComponent`** (new): the Wizard/Scroll-View questionnaire modal
  (`openQuestionnaireDialog`/`renderQdlg`/`qqHtml`/`qcalHtml`/`saveQuestionnaireDialog`), including
  the inline date-picker calendar. Escape closes only the dialog (not the editor underneath) via a
  manual capture-phase `document` listener — ports `qdlgKey`'s capture + `stopImmediatePropagation`
  trick, needed here because (unlike the source, where the dialog element is appended to the DOM
  *after* the shell's own listener is already registered) an Angular `HostListener` would instead
  run in registration order, i.e. *after* `GeomappingShellComponent`'s Escape handling, too late to
  pre-empt it. **One deliberate behaviour change**: the source persists an *existing* (already-
  saved) feature's questionnaire answers immediately on dialog-Save, independent of the outer
  editor form's own Simpan (because `qdlg.feature` there is the live object already sitting in the
  in-memory `features` array — mutating it mutates storage). This port stages questionnaire answers
  on the draft like every other field and only actually persists them when the editor form's own
  Simpan is clicked — consistent behaviour (no surprise partial-saves if the user closes the dialog
  and then abandons the whole form) traded for that one edge case's immediacy; noted here rather
  than silently diverging.
- **`GeomappingShellComponent`** (extended): now also renders the three Edit Mode overlays that
  float directly over the map, outside the routed dock panel — the draw-tool dock (`#drawDock`,
  Titik/Garis/Poligon, visible for the entire time the `edit` rail view is active except during the
  countdown, exactly matching the source's `!editView || countdown != null` visibility rule — not
  just while a draw is in progress), the draw/track-in-progress hint bar (`#drawHint`), and the
  Tracking Point countdown ring (`#countdownOv`). They live here rather than in `EditComponent`
  because the source positions them against the same containing block as `.map-ctrls` (the app
  shell, not the dock), and the global Enter/Escape keyboard handling (`document.keydown`, ports
  index.html:1831-1840) lives here too, for the same "always mounted for the whole geomapping app"
  reason `GeomappingMapComponent` itself is shell-owned rather than routed.
- **`GeomappingDataService.saveFeature()`** (new): the persist half of `saveEditor()` — builds the
  final `GeomappingFeature` record (fresh `PENDING` `ApprovalRecord` if new, existing approval kept
  otherwise), pushes/replaces it in the `features` array, and logs the activity entry. The
  DOM-reading/validation half stays in `EditComponent`.
- **Data-model fix**: `FeaturePrivilege` only had `'PUBLIC' | 'RESTRICTED'` since Phase 1 — the
  source's editor form actually offers three (`PUBLIC`/`RESTRICTED`/`PRIVATE`); fixed now that Edit
  Mode's privilege `<select>` needed it, rather than silently dropping the third option.
  `GeomappingFeatureDraft` (new) models `state.editing.feature`'s shape — the same fields as
  `GeomappingFeature` but with `id`/`createdAt`/`updatedAt`/`approval` optional, since a
  still-being-drawn feature has none of those yet.
- **Pre-existing CSS gap fixed**: `.qn-row`/`.qn-k`/`.qn-v` (the label/value row used throughout
  Approval's meta block, and now the editor form's Questionnaire/Status-Approval steps too) was used
  in `ApprovalComponent`'s template since Phase 2 but never actually defined in any `.scss` file —
  moved into `_shared-panel.scss` so both components get it.
- **Another source CSS-scoping miss fixed**: `.hbtn` (the pill "Ambil"/"Perbarui" My Location
  button) is scoped to `.view-head .hbtn` in the source, but the source itself also uses it inside
  `.status-line` on the Edit Mode landing screen, outside any `.view-head` — same class of oversight
  as Phase 2's Task-panel delete button, so restyled unscoped in `edit.component.scss` rather than
  reproduced as unstyled text.
- **My Layers / Approval wiring**: `MyLayersComponent`'s "Rekam objek baru (Edit Mode)" button was
  `disabled` since Phase 1 pending this phase — now navigates to `/geomapping/edit`; its row click
  now opens that feature in the editor (`wireFeatureList()`'s effect) instead of doing nothing.
  `ApprovalComponent`'s "Buka di peta / editor" link now actually opens the row's feature in Edit
  Mode instead of routing to a placeholder.
- **GPS-denied fallback simplification**: `requestMyLoc()`'s "no GPS" fallback uses the map's real
  live centre in the source (`map.getCenter()`); `GeomappingEditService` has no Leaflet dependency
  by design (see its doc comment), so it falls back to a fixed constant (`DEFAULT_MAP_CENTER`,
  matching the map's own initial `setView`) instead — same intent, a fixed rather than live point.

## Explicit TODOs — everything still left, none of it blocking

1. **Search** (`runSearch()`/`dropPin()`/`zoomToFeature()`, Nominatim geocoding) and the dock-top
   search row + classification-collection picker (`renderDockTop()`) — Phase 1 left the dock top
   empty rather than ship a non-functional search box; build both together. A search hit on an
   existing feature should open it via the same `GeomappingEditService.openEditor(f, false)` path
   My Layers/Approval rows already use.
2. **PWA** (`manifest.webmanifest`, `sw.js`, `icon.svg`): not touched at all. Would need the
   `@angular/pwa` schematic (adds `ngsw-config.json` + registers `@angular/service-worker`) rather
   than copying the original's hand-written service worker — a real build/tooling change, out of
   scope for a component-level port pass, and this workspace has never been through a real
   `ng build`/`ng serve` yet regardless (see root `angular-app/README.md`'s Node-version caveat).
   Also worth knowing: the *original static* `legacy-static/geomapping/` still registers its own
   service worker at whatever URL it's loaded from — a browser that visits it there and later
   visits this Angular port's `/geomapping` (same origin) is unaffected (different scope/path), but
   a browser that visited the OLD `/geomapping` URL *before* the legacy-static/ move may still have
   a stale service worker registered at that now-vacated scope; harmless (nothing serves that scope
   as the SPA), just a residual local artifact for anyone who saw it pre-move.
3. **`wc-fab`** (the floating "+ WorkCompartment" quick-create button, shown only in Public
   Mapping) and the **`.map-fab`** locate button weren't ported — both are reachable via
   already-ported UI (the "Buat WorkCompartment" button inside the panel; My Location has its own
   status-line "Ambil"/"Perbarui" button on the Edit Mode landing screen instead of a floating FAB),
   so there's no dangling requirement, just noting they're visually absent still.

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
