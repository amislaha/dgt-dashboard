# DGT Data Manager

A standalone CRUD admin tool for master data used by the DGT (Digital Governance Transmigration) ecosystem (the [dashboard](../dashboard) situation-room tool and related apps in this same repo — see the [repo home page](../index.html) for the full list). It's a single self-contained `index.html` — no build step, no server, no dependencies beyond a Google Fonts request for typeface parity with the dashboard.

## Data model

Rebuilt to follow **`ERD DTG 2026 (1).xlsx`**, the ministry's entity-relationship spreadsheet, rather than the dashboard's earlier ad-hoc "kawasan" model. Nine entities, each its own tab:

| Entity | What it is | Links to |
|---|---|---|
| **WPT** | Wilayah Pengembangan Transmigrasi — top-level development region | — |
| **SKP** | Satuan Kawasan Pengembangan — sub-region within a WPT | → WPT |
| **SP** | Satuan Permukiman — settlement unit within an SKP | → SKP, → WPT |
| **Komoditi** | Commodity categories | — |
| **Produk Unggulan** | Flagship products (defined in the ERD, no data supplied yet) | — |
| **Program** | The 5 transmigration program types (Tuntas, Lokal, Patriot, Karya Nusa, Gotong Royong) | — |
| **Satker** | Org unit / position structure | — |
| **Personel** | Staff records | → Satker |
| **IKU** | Key Performance Indicators per satker | → Satker, → Program |

A field with an "→" link is free text with autocomplete (an HTML `<datalist>` built from the target entity's current records) — not an enforced foreign key. This is a flat localStorage tool, not a relational database.

### Sheets left out of the source workbook

- **Master Satker Relasi** and **Struktur Wilayah** — both sample data ended in a literal `"dst"` ("etc.") placeholder row in the source; their content is fully covered by Satker and the WPT/SKP/SP hierarchy respectively, so they weren't turned into separate tabs.
- **Fact Table** — the sheet exists but defines no columns at all; there's nothing to model.

### Known data-quality gaps, inherited from the source spreadsheet

Transcribed as-is rather than silently fixed:

- **IKU → Satker naming mismatch**: the IKU sheet's "Satker" column uses person/role titles ("Direktur Pembangunan Kawasan Transmigrasi (PKT)") while the Dimension sheet (→ this tool's Satker entity) uses org-unit names ("Direktorat Pembangunan Kawasan Transmigrasi"). They don't string-match, so most IKU rows' Satker autocomplete won't highlight an existing suggestion. Reconcile by hand if you want clean linkage.
- **IKU rows 9-N, 12-N, 14-N through 17-N, and the unlabeled final row**: the source left Satker blank (and the final row also left Satuan blank). The Satker/Satuan fields are required going forward, so re-saving one of these rows means picking a value first.
- **SP "SP 1 Timika"**: references "SKP A Timika" and "WPT Timika" — neither exists in the source's SKP or WPT sheets (the WPT sheet has "WPT Timika / SP-Jagamin" instead).
- **Personel**: only 3 sample rows exist in the source, all the same person ("Suherman") with different Jabatan values.

## Running it

Just open `index.html` in a browser (double-click it, or drag it into a tab).

## How it works

- Data lives in this browser's `localStorage`, seeded on first load from the transcription above.
- **It is not connected to any other system at runtime** — not the dashboard, not a real database. Edits here don't automatically appear anywhere else.
- Use **"Salin sebagai JS"** to get a `var wpt = [...]` (etc.) block in the same shape as this file's seed data, or **"Ekspor/Impor JSON"** for backup/portability between browsers.

## Data is fictional / illustrative

Same caveat as the dashboard it feeds: none of this should be treated as authoritative ministry data — the underlying spreadsheet itself is a draft ERD with placeholder and sample rows throughout.
