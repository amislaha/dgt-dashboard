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
