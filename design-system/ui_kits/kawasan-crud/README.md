# Kawasan Prioritas Nasional — CRUD (UI kit)

A CRUD screen for the 45 national-priority kawasan registry, modelled on the public
[DGT dashboard](https://amislaha.github.io/dgt-dashboard/) table (IPKTRANS 2024 vs. INTRANS 2025).
Open `index.html`.

- **Read** — grouped two-year header table (IPKTRANS 2024 + status; INTRANS 2025 measured +
  projected + status), search by name, filter by 2025 status, paginated 15 rows/page, a live
  averages row and four summary stat cards.
- **Create** — "Tambah kawasan" opens a dialog with the same six fields as the table.
- **Update** — the pencil action on any row opens the same dialog pre-filled.
- **Delete** — the trash action opens a destructive confirmation dialog.

State persists to `localStorage` (`tds-kawasan-crud-v1`) so edits survive a reload; seed data lives in
`data.js` (`window.KAWASAN_SEED`, transcribed from the reference table). Averages recompute live from
whatever data is currently in the table, including after edits.

Everything visual comes from the design system — `Card`, `Badge`, `Button`, `Input`, `Select`,
`Label`, `Dialog`, `Alert`, `Breadcrumb`, `Pagination`, `Separator`, `Icon`. The grouped two-row
table header has no equivalent in the `Table` component, so it's hand-built with `kc-*` classes that
reuse the same tokens (hairlines, `--abu-50` header, tabular figures) as every other table in this
system.
