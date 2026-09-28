# data-manager port notes

Port of `data-manager/index.html` ("DGT Data Manager") to Angular 8 +
TypeScript + Bootstrap 4, entirely under `src/app/data-manager/`. Read
`data-manager/index.html`, `data-manager/README.md`, and CLAUDE.md's
`data-manager/` section before touching this module — the notes below assume
that context.

## What's implemented

**All 8 entities get full CRUD** (list + search + create + edit + delete +
toast), not just the "2-3 entities" floor in the task brief — see "Why a
generic component pair" below for why that was cheap to reach:

- WPT → SKP → SP, the full territorial hierarchy, with real FK dropdowns
  (SKP picks its WPT, SP picks its SKP and WPT).
- Komoditi, Program, Satker, Personel, IKU — the remaining master-data
  entities. Personel's Satker FK and IKU's Program FK are real dropdowns too.

**Left out on purpose**: "Produk Unggulan" (the 9th tab in the original). The
task's own model list names exactly 8 entities (WPT, SKP, SP, Komoditi,
Program, Satker, Personel, Iku) and the source ERD sheet for it has a column
definition but zero data rows (data-manager/README.md), so there was nothing
to port. Re-adding it later is mechanical: a `ProdukUnggulan { id, nama }`
model, a `produk-unggulan-crud.service.ts` following the existing pattern, one
`EntityConfig` entry, and a routing/registry line — no component code needed
because of the generic list/form design below.

**Not ported** (out of scope for this pass, flagged for the team):
- Export/Import JSON and "Salin sebagai JS" (the original's `openExport`/
  `importJson`/`toJsLiteral`). These are file-I/O/clipboard conveniences
  layered on top of the same `EntityCrudService.list()`/`create()` data — a
  follow-up `ExportDialogComponent` reading `EntityRegistryService.all` would
  reproduce them without touching this module's core CRUD path.
- No `CanDeactivate` guard warning about an open, unsaved drawer on
  navigation — the original doesn't have this either (its drawer is DOM-only,
  not routed), so this isn't a regression, just an opportunity.

## Architecture

```
models/            One interface per entity, plus EntityKey, FieldConfig,
                    EntityConfig (the config-object schema every entity is
                    described by, mirroring the original's ENTITIES object).
data/seed-data.ts   SEED data transcribed from the original, FK strings
                    converted to id references (see "FK fix" below).
config/
  entity-configs.ts One EntityConfig per entity (columns + form fields),
                    the direct port of the original ENTITIES object, plus the
                    ported ENTITY_ICONS/railIcon() as entityIconSvg().
services/
  entity-crud.service.ts   Generic EntityCrudService<T> abstract base:
                           localStorage-backed, BehaviorSubject-reactive,
                           same "dgt-data-manager:" key prefix and nextId()
                           numbering scheme as the original.
  <entity>-crud.service.ts One-line `providedIn: 'root'` subclass per entity.
  entity-registry.service.ts  Maps EntityKey -> { config, service }. This is
                           the piece that makes the generic components work.
data-manager-shell/  Routed DataManagerShellComponent wrapping <dgt-app-shell>
                     around a <router-outlet>, building the rail's NavItem[]
                     from the 8 configs and translating (select) into router
                     navigation, per the port spec.
entity-list/         Generic list component: search, dgt-data-table with
                     sortable columns, opens the create/edit drawer, delete
                     via a "Hapus" button in the drawer footer.
entity-form/         Generic Reactive Form driven by one EntityConfig's
                     `fields`, rendered inside the shared dgt-drawer.
data-manager.module.ts / data-manager-routing.module.ts
```

## Why a generic component pair, not 8 per-entity components

The task offered a choice: "one component pair per entity, OR a generic
reusable pair... driven by a per-entity field-config object". The original
data-manager/index.html is already fully config-object-driven (`ENTITIES`
object with `columns`/`fields`, one `render()`/`openForm()` pair reused for
every tab) — so a generic `EntityListComponent` + `EntityFormComponent`
reading an `EntityConfig` is the more faithful port of *how the original is
actually built*, not just what it looks like. It's also why reaching full CRUD
on all 8 entities (instead of the 2-3 floor) cost roughly the same as 3: the
marginal cost per entity is one model file, one 3-line service subclass, and
one config object — no new component code.

The tradeoff, made explicit rather than accidental: `EntityRegistryService`
and both generic components work with `EntityConfig<any>` /
`EntityCrudService<any>` — type safety across the entity boundary is
traded for the generic dispatch. Each concrete `<Entity>CrudService` is still
fully typed (`EntityCrudService<Wpt>` etc.), so this only affects the
generic list/form/registry layer, not the data layer itself.

## The FK fix (required by the task)

The original stores parent references as plain name strings (`indukWpt: "WPT
Lunang Silaut"`), matched only by an HTML `<datalist>` autocomplete — "not an
enforced foreign key... a flat localStorage tool, not a real relational
database" per the source file's own comment and data-manager/README.md. This
port changes every child-entity FK field to a real id reference:

- `Skp.indukWptId: string` → `Wpt.id`
- `Sp.indukSkpId` / `Sp.indukWptId: string | null` → `Skp.id` / `Wpt.id`
- `Personel.satkerId: string` → `Satker.id`
- `Iku.satkerId?: string` / `Iku.programId?: string` → `Satker.id` / `Program.id`

Form fields of `type: 'fk'` render as a real `<select>` populated from the
target `EntityCrudService.list()`, not a free-text input — you can no longer
save a value that doesn't match an existing record for a *new* edit, which is
the actual point of the fix.

**Two known data-quality gaps from the ERD are preserved, not silently
fixed**, per CLAUDE.md's framing that these are inherited spreadsheet gaps,
not something to launder away:

1. **`Sp.indukSkpId`/`indukWptId` are nullable.** The seed row "SP 1 Timika"
   references "SKP A Timika" / "WPT Timika" in the source, neither of which
   exists as a record (only "WPT Timika / SP-Jagamin" does). Rather than
   guessing which real WPT/SKP was meant, both fields are `null` for that one
   seed row. `EntityListComponent.resolveFkLabel()` surfaces this visibly as
   "⚠ tidak ditemukan (id)" in the table instead of silently showing nothing —
   arguably a fidelity *improvement* over the original, where a
   non-matching autocomplete value just failed to highlight, easy to miss.
2. **`Iku.satkerId` is `undefined` on every seed row.** The ERD's IKU sheet
   names satker by person/role title ("Direktur Pembangunan Kawasan
   Transmigrasi (PKT)"); the Satker entity uses org-unit names ("Direktorat
   Pembangunan Kawasan Transmigrasi") — they never string-match
   (data-manager/README.md "Known data-quality gaps"). Rather than inventing
   a mapping, `Iku.satkerLabel` keeps the original ERD text for display/
   reconciliation, and `satkerId` (a real, required-going-forward `fk` field
   in the edit form) starts unset — editing an IKU row means picking the
   correct Satker once, same as the original's stated "required going
   forward" behaviour for this field.

## Other notes

- `EntityCrudService`'s localStorage key prefix (`dgt-data-manager:`) and
  per-entity id scheme (`idPrefix + N`, e.g. `wpt11`, `sat33`) exactly match
  the original, so existing browser data written by `data-manager/index.html`
  is a strict data-shape subset of what this port expects (same keys) once
  the FK string fields are migrated to ids — that migration itself is not
  automated here (no user data exists yet to migrate against).
- Delete lives as a "Hapus" button in the drawer footer (visible only when
  editing an existing record) rather than a per-row icon in the table. The
  shared `dgt-data-table` (out of scope to modify — see task instructions)
  only supports a whole-row click and plain-text cell interpolation, not a
  per-row action slot, so a per-row delete icon isn't currently expressible
  without changing that shared component.
- Confirmation before delete is a plain `window.confirm(...)`, matching the
  original (`data-manager/index.html`'s `deleteRow()`) — no custom confirm
  dialog UX was introduced.
- Search is a client-side substring match across every field of a row
  (`Object.keys(row).some(...)`), identical to the original's
  `filteredRows()`.

## Persetujuan & Pengajuan (added later, not in `data-manager/index.html`)

Originally a second rail section (`Pengajuan Data` and `Approval` as two
separate items, divider-separated from the 8 entities — see git history for
that iteration). **Superseded by the header-nav rework below**: the rail is
gone entirely, and the two pages were consolidated into one tab-switched page
under a single header item, "Submission & Approval" (`submission-hub/`).

- `models/submission.model.ts` / `services/submission.service.ts`: a
  `Submission` log (propose create/update/delete on one of the entities,
  optional photo evidence, PENDING/APPROVED/REJECTED status + history),
  localStorage-backed under the same `dgt-data-manager:` prefix as the entity
  services but *not* an `EntityCrudService` subclass — review is a status
  transition (`review()`), not a field-by-field `update()`.
- `submission/` (Pengajuan Data tab): create a submission (entity + create/
  update/delete + target picker + summary + multi-image upload via
  `FileReader`→data-URL, same encoding geomapping uses for its
  `Feature.images`) and list the queue.
- `submission-approval/` (Approval tab): filter by status, expand a row to
  see the images/summary/history, approve/reject (rejection requires a note)/
  reset to pending — the same shape as geomapping's `ApprovalComponent`
  ported down to `Submission` instead of `GeomappingFeature`.
- `submission-hub/` (`SubmissionHubComponent`, routed at `submission`): owns
  the single `dgt-page-head` and a `.seg` tab switcher, embedding
  `<dgt-submission>`/`<dgt-submission-approval>` as plain child components
  (neither depends on `ActivatedRoute`, so this needed no changes to either
  beyond swapping their own `dgt-page-head` for a plain `.dm-toolbar` div —
  see each component's `.html`).
- **Deliberately not "full" geomapping**, per the original request: no map,
  no drawing/GPS capture, no structured questionnaire — only the
  image-evidence + approval-workflow slice. **Also deliberately not wired to
  auto-apply**: approving a submission here does not call the target
  `EntityCrudService` create/update/delete — it only records the decision.
  Wiring that up (so "Setujui" actually mutates the entity) is a natural
  follow-up once someone confirms that's wanted, since an auto-apply path
  needs to decide how to turn `Submission.summary` (free text) into a typed
  `EntityConfig.fields` payload.

## Header nav + Wilayah map + 16 more masters (added later, on request)

A larger rework, on request, replacing the sidebar entirely and adding many
more master-data entities:

- **Sidebar → header.** `DataManagerShellComponent` no longer uses
  `<dgt-app-shell>`/`<dgt-rail-nav>` (see its own doc comment) — it now
  renders its own header bar: "Wilayah" and "Submission & Approval" as flat
  links, "Data Master" and "Settings" as `ngbDropdown` menus
  (`@ng-bootstrap/ng-bootstrap`, already a dependency but unused elsewhere
  until now — added to `SharedModule`'s imports/exports). `RailNavComponent`/
  `AppShellComponent`/`ShellModule` are untouched; only this module stopped
  using them (dashboard's own shell is unaffected). The `NavItem.sectionLabel`
  divider capability added for the rail-based iteration of this feature is
  now dormant (nothing sets it any more) but left in place in
  `RailNavComponent` as a harmless, still-documented, still-generic capability
  rather than reverted — dashboard or a future rail could still use it.
- **Wilayah is now the default page and a map.** The route redirect changed
  from `wpt` to `wilayah`. `wilayah/wilayah.component.ts` is the new routed
  component for that path (`data: { entityKey: 'wpt', navId: 'wilayah' }`) —
  it renders `wilayah/wilayah-map/` (a real Leaflet map, same
  `import * as L from 'leaflet'` pattern as dashboard's `KawasanMapComponent`/
  geomapping's `GeomappingMapComponent`, both already in this codebase) above
  an embedded, *unmodified* `<dgt-entity-list>`. That embed works because
  `EntityListComponent` isn't behind its own `<router-outlet>` here — its
  injected `ActivatedRoute` resolves to `WilayahComponent`'s own route, whose
  `data.entityKey: 'wpt'` is exactly what it needs. `Wpt` gained optional
  `lat`/`lon` fields (illustrative real-world-approximate coordinates, same
  fabrication convention as the dashboard's `kawasan` array — seeded in
  `data/seed-data.ts`) for the map to plot; a record missing either is simply
  not pinned. The WPT entity's config/service/`skp`/`sp` children were
  unchanged at first — only its rail label became "Wilayah" and it moved off
  the "Data Master" dropdown onto the header directly (see
  entity-key.model.ts's `MASTER_DATA_ORDER`, which excludes `wpt`) — **see
  "Real Wilayah data" below for a later, bigger change to its actual data.**
- **16 new master entities**, for the "Data Master"/"Settings" dropdowns:
  Wilayah Status/Category/Target, Project, Satker Type, Strategic Target, IKU
  Definition/NKO/Status, Produk Jenis, Recommendation Category, Profil
  Category/Group/Measure, Application Settings, Approval Flow (full list and
  grouping in `entity-key.model.ts`'s `MASTER_DATA_ORDER`/`SETTINGS_ORDER`).
  None had real fields specified, so every one of them is a **placeholder**:
  `models/simple-master.model.ts`'s single shared `SimpleMaster { id; nama;
  keterangan? }` shape, `config/entity-configs.ts`'s `simpleMasterConfig()`
  factory (one call per entity — a name + textarea form, one `nama` column),
  and `services/simple-master-crud.service.ts` (16 tiny
  `EntityCrudService<SimpleMaster>` subclasses in one file, since they're
  otherwise identical boilerplate — unlike the original 8, which each got
  their own model/service file because their shapes actually differ). No seed
  rows (`EMPTY_SIMPLE_MASTER_SEED`) — there's no source spreadsheet for these
  yet, so an empty list is more honest than inventing illustrative data for a
  schema that's itself a stand-in. Swapping any one of these for a real,
  dedicated model/config once its fields are known is the same mechanical
  process this file's own top section describes for "Produk Unggulan".
  `Komoditi`→"Komoditas", `Program`→"Transmigration Program", and
  `Iku`→"IKU Indicator" were relabelled to match the requested menu wording;
  their keys, storage, and fields are untouched.
- `EntityKey` grew from 8 to 24 members; `EntityRegistryService`'s
  constructor/registry map grew to match (mechanical — one param, one entry
  per entity, per its own doc comment). `ENTITY_ORDER` is still "every
  entity" (used for the aggregate total); `MASTER_DATA_ORDER`/
  `SETTINGS_ORDER` are the two new orderings the header's dropdowns actually
  render, both excluding `wpt`.

## Real Wilayah data (Matriks 45 Kawasan Transmigrasi, replacing the fabricated seed)

`WPT_SEED` (`data/seed-data.ts`) was replaced wholesale with the user-provided
"Matriks 45 Kawasan Transmigrasi Prioritas Nasional Tahun 2025" spreadsheet
(45 rows: NO/KAWASAN/KABUPATEN/PROVINSI/WPT/SKP/SP/KPB?/Pusat SKP?) — real
government data, not the earlier 10-row illustrative placeholder.

- `Wpt` (models/wpt.model.ts) gained `kawasan`/`skpRingkasan`/`spRingkasan`/
  `kpb`/`pusatSkp` — one field per remaining sheet column, added the same
  field-for-field way `geo` already was for the original ERD. `nama`
  transcribes the sheet's "WPT" column verbatim, inconsistent casing and all
  ("Mahalona" next to "RASAU JAYA") — same transcribe-as-is policy as
  `IKU_SEED`. A sheet cell of "-" (its "no data" convention) was normalized to
  `undefined`, the one liberty taken.
- `lat`/`lon` are **not** from the source (it has no coordinates) — still
  illustrative per-kabupaten approximations, same convention as before and as
  the dashboard's `kawasan` array, added only so `WilayahMapComponent` has
  something to plot. Treat them as roughly-the-right-area, not surveyed.
- **`SKP_SEED`/`SP_SEED` were cleared to `[]`**, not remapped. The old
  fabricated SKP/SP sub-units (e.g. "SKP A Lunang", "SP 1 Lunang") were
  invented for the old 10-WPT placeholder and don't correspond to anything in
  the new source, which only has free-text summaries at the WPT level
  (`Wpt.skpRingkasan`/`spRingkasan`), not structured per-record SKP/SP data.
  Leaving the old rows in place with their old `indukWptId`s would have just
  produced 22 rows of "⚠ tidak ditemukan" broken-FK warnings against the new
  ids — an empty list (same honest-placeholder pattern as the 16 masters'
  `EMPTY_SIMPLE_MASTER_SEED`) reads as "no data yet", not "something broke".
  Real SKP/SP-level data for these 45 kawasan, if it turns up, is a natural
  follow-up.
- **Submission's entity picker was curated to match**, on the same request:
  `submission/submission.component.ts`'s `SUBMITTABLE_ENTITY_ORDER` is
  `['wpt', ...MASTER_DATA_ORDER]` (mirroring the header's Wilayah + Data
  Master grouping) instead of the raw `ENTITY_ORDER`, which also listed the 3
  Settings-group entities (Profil Measure, Application Settings, Approval
  Flow) — not sensible things to propose a create/update/delete against, so
  now excluded from that one dropdown specifically (they're still fully
  reachable/editable from the header's own Settings menu).

## Wilayah and Submission & Approval share one map, with manual draw tools

Two more requests, layered on the full-bleed shell above: put the exact same
map behind both pages ("so only the sidebar is different"), and add "drawing
tools like geomapping" to Submission & Approval.

- **Shared map.** `SubmissionHubComponent` now renders the identical
  `<dgt-wilayah-map [wilayah]="wilayah" ...>` `WilayahComponent` does,
  including its own duplicate `registry.get('wpt').service.changes`
  subscription (small and self-contained enough that a shared base
  class/service felt like more machinery than the 4 lines it would save —
  each page stays independent). `WilayahMapComponent` itself didn't need to
  change for this — it was already a plain `@Input()`-driven component with
  no assumptions baked in about which page hosts it.
- **`MapDrawService`** (`services/map-draw.service.ts`) mediates manual
  drawing between the shared map and whichever sidebar is using it — the
  same mediator role as geomapping's `GeomappingEditService`, scoped way
  down: `start(type)`/`cancel()`/`result$` for actively drawing a new
  Point/LineString/Polygon, plus a separate `showPreview()`/`clearPreview()`
  for read-only display of an already-submitted shape. No GPS tracking, no
  vertex editing/addvertex/delete modes, no questionnaire — those are
  geomapping's Edit Mode proper (see its own `PORT_NOTES.md`), which is a
  survey tool's feature set, not a fit for a master-data submission form.
  What *was* ported is geomapping's core manual-draw mechanic almost
  verbatim: `WilayahMapComponent.renderDrawPreview()` mirrors
  `refreshDrawPreview()` (dashed shape + small circle markers per point
  placed so far), a click places a point (or completes immediately for
  Point), and double-click/a "Selesai" button completes a Line/Polygon
  (`doubleClickZoom` is disabled while drawing, same reason geomapping
  disables it — dblclick means "finish shape," not "zoom in").
- **`Submission.geometry?: DrawnGeometry`** (`models/drawn-geometry.model.ts`
  — a tiny GeoJSON-shaped type, same coordinate order/shape as geomapping's
  `GeomappingGeometry` so the two could interop later) is optional: not every
  proposal needs a location. `SubmissionComponent`'s create form has 3
  buttons (Tandai Titik/Gambar Garis/Gambar Area) that call
  `mapDraw.start(type)` — the map lives in the sibling
  `SubmissionHubComponent`, so this goes through the service rather than an
  `@Input`/`@Output` chain, same reasoning as the rest of this section.
  `SubmissionApprovalComponent` calls `mapDraw.showPreview(s.geometry)` when
  expanding a row that has one (`clearPreview()` on collapse/destroy) so a
  reviewer can see what was drawn without any drawing tools active.
- Originally the create form used the shared `<dgt-drawer>` (fixed overlay).
  That's since been replaced with an inline-in-sidebar form (see the next
  section) — the drawer's own full-viewport scrim briefly caused a real bug
  here (see next section's first bullet) before being superseded entirely.

## Header logo, dropdowns moved right, inline form, collapsible sidebar

Four more requests on the same header/sidebar system:

- **Logo.** `assets/logo-emblem.png` (the same Kementerian Transmigrasi
  emblem already wired into dashboard/geomapping/launcher's own headers —
  see CLAUDE.md's Hosting/visibility section for the provenance/approval
  history) now also appears in the Data Manager header, left of the "DGT
  Data Manager" wordmark. Nothing new to flag — this is the one already-
  approved asset, just reused, not a new emblem.
- **"Data Master"/"Settings" moved right.** They're now wrapped in their own
  `.dm-nav-right` div with `ml-auto` inside `.dm-nav` (itself
  `flex-grow-1`), so they sit at the right edge of the nav row — right before
  the entri-count/theme-toggle block — while "Wilayah"/"Submission &
  Approval" stay as flat links on the left. Purely a template/CSS reshuffle;
  `DataManagerShellComponent`'s TS is unchanged.
- **Submission's create form moved fully inline.** `SubmissionComponent` no
  longer uses `<dgt-drawer>` at all — clicking "+ Ajukan Perubahan" now
  swaps the table for the form via a plain `*ngIf="drawerOpen"` in the same
  template, both rendering as normal in-flow content inside this component's
  slice of the sidebar. This was the actual fix for the scrim bug described
  above: with the form inline there's no separate overlay/scrim to
  accidentally swallow a map click in the first place, so the `[scrim]`
  input added to `DrawerComponent` for that workaround was reverted (nothing
  uses `<dgt-drawer>` from this component any more) — `DrawerComponent`
  itself is back to its original form, still used everywhere else unchanged
  (`EntityListComponent`'s create/edit drawer, etc.).
- **Sidebar collapsible.** `WilayahComponent`/`SubmissionHubComponent` each
  got their own `sidebarCollapsed` boolean (duplicated between them, same
  "small enough not to share" reasoning as the map subscription) and a small
  tab button (`.sidebar-collapse-toggle`) fixed to the panel's own left edge
  via `position:absolute; left:-24px` — since it's positioned relative to
  the sidebar itself, not the viewport, it stays glued to the panel's
  current left edge automatically as the panel's width animates to/from 0,
  no recalculation needed. Collapsing only ever reveals more of the map
  underneath (the map was already full-width the whole time; the sidebar
  merely overlays it), so there's no resize/`invalidateSize()` concern.
  Required restructuring both panels' markup one level deeper — the
  scrollable content moved into an inner `.sidebar-scroll` div so the outer
  `.wilayah-side-panel`/`.submission-side-panel` could go back to
  `overflow: visible` (needed so the toggle button, which sits partly
  outside that box, isn't clipped by it).

## Submission form: full entity fields, split into tabs

On request ("adjust form to all fields in data induk, create tab so it's not
too long and user friendly") — until now a submission only ever carried a
free-text `summary` plus a `targetLabel`, never the target entity's actual
field values.

- **`Submission.fieldValues?: { [key: string]: any }`** (models/
  submission.model.ts) is the target entity's own `EntityConfig.fields`
  values — undefined for `mode: 'delete'`. `SubmissionComponent`'s create
  form now embeds the *same* generic `<dgt-entity-form>` every entity CRUD
  screen already uses, driven by `selectedConfig` (`registry.get(draftEntityKey)
  .config`) and `prefillRecord` (the target's current values in update mode,
  `null` for create). Submitted via `@ViewChild(EntityFormComponent)` +
  `entityFormRef.submit()`, the exact same pattern `EntityListComponent`
  already uses for its own create/edit drawer — `(saved)` emits the built,
  type-coerced value object, which becomes `fieldValues` on the `Submission`.
  For `create` mode, `targetLabel` is now derived from
  `fieldValues[config.titleField]` instead of a separate free-text "Nama/
  Judul Usulan" input (removed — it was redundant with the entity form's own
  title field once the full form existed).
- **3 tabs** (`activeTab: 'umum' | 'data' | 'lokasi'`) — Informasi Umum
  (Entitas/Jenis Pengajuan/Data Target/Ringkasan/Diajukan oleh), Data Induk
  (the embedded `<dgt-entity-form>` — hidden entirely, not just its tab
  button, when `mode: 'delete'`), Lokasi & Lampiran (draw tools + foto).
  Switching tabs uses `[class.d-none]`, **not** `*ngIf` — `*ngIf` would
  destroy and recreate `<dgt-entity-form>` (losing whatever the user had
  typed into it) every time they navigated away from "Data Induk" and back.
  The whole Data Induk pane *is* still behind `*ngIf="showEntityForm"`
  (mode-driven): switching to "Hapus data" should drop stale field values,
  not just hide them.
  `submitDraft()` switches to whichever tab has the failing validation
  (`umum` for missing summary/submittedBy/target, `data` for an invalid
  entity form) before that field's own toast fires, so the user doesn't have
  to go hunting for what's wrong.
- **Approval-side display.** `SubmissionApprovalComponent.fieldEntries()`
  renders `fieldValues` as label/value rows in a submission's expanded view,
  resolving `fk`-typed fields to their referenced record's display label
  (same logic as `EntityListComponent.resolveFkLabel()`) so a reviewer sees
  "Kubu Raya", not `wpt1`. Without this the newly-captured structured data
  would be invisible to whoever has to actually approve the change.
