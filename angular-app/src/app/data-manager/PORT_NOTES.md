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
