# Handoff: Transmigrasi Digital Design System

## Overview
Design system + reference UI kits for Kementerian Transmigrasi's digital products: **SIMTRANS** (internal case-management app), the **public portal**, and a **Kawasan Prioritas Nasional** CRUD screen. Built for governance/case-work software — clear status states, dense data tables, accessible forms.

## About the Design Files
Everything here is **HTML/JSX design reference**, not production code to copy directly. It shows intended look, states, and behavior. The task is to **recreate these designs in your codebase's actual framework** (React, Vue, native, etc.) using its existing patterns — or choose the most suitable framework if none exists yet. Do not ship the HTML/JSX files as-is.

## Fidelity
**High-fidelity.** Colors, type, spacing, and states are final — implement pixel-close using your framework's equivalents of the tokens below.

## Design Tokens
All tokens are CSS custom properties, defined in `tokens/colors.css`, `tokens/base.css`, `tokens/elevation.css` (imported by `styles.css`). Port these into your framework's theme (Tailwind config, CSS variables, etc.) rather than hardcoding values.

- **Colors** — sampled from the ministry's own emblem, not invented:
  - `--biru-*` (Biru Nusantara, navy `#163b54`) = `--primary`
  - `--teal-*` (Teal Laut, `#33809c`) = `--info`, focus ring, chart series 2
  - `--emas-*` (Emas Tanah, `#dfb87e`/`#c09546`) = `--warning`, gold accents on dark chrome
  - `--hijau-*` / `--merah-*` = functional only: `--success`/"Terverifikasi", `--destructive`/"Ditolak" — never decorative
  - Full semantic map (`--background`, `--card`, `--border`, `--ring`, etc.) plus a `.dark` override block
- **Type** — see `tokens/base.css` for `--font-sans`/`--font-mono`, the `--text-*` scale, and `--type-*` shorthand composites
- **Spacing/radius/shadow** — `--space-*`, `--radius-*`, `--shadow-*` in `tokens/base.css` and `tokens/elevation.css`

## Components
`components/<category>/<Name>.jsx` + matching `<Name>.d.ts` (props contract) + `<Name>.prompt.md` (usage notes/rationale). Categories: `core` (Icon), `display` (Avatar, Badge, Card, Progress, Separator, Table), `feedback` (Alert, Dialog), `forms` (Button, Checkbox, Input, Label, RadioGroup, Select, Switch, Textarea), `navigation` (Breadcrumb, Pagination, Tabs). Each `.card.html` in the same folder is a live specimen sheet — open it to see all states/variants rendered.

Port each component into your framework preserving the prop names/types in its `.d.ts`. These are inline-styled reference implementations reading the CSS variables above — not an installable package.

## UI Kits (full-flow references)
- `ui_kits/simtrans/` — internal app shell + login, dashboard, registry table, detail, all wired to a shared app-shell/sidebar
- `ui_kits/portal/` — public site chrome + beranda (home) and layanan (services) screens
- `ui_kits/kawasan-crud/` — full CRUD flow (list, create/edit form, detail, delete confirm) for a "Kawasan Prioritas Nasional" record, with mock data in `data.js`

Each kit folder has its own README with screen-by-screen notes. Treat these as layout/interaction references, not markup to lift verbatim — recreate the structure with your framework's routing/state.

## Assets
`assets/logo-emblem.png` (official ministry seal, circular, transparent) and `assets/logo-lockup.png` (horizontal signature with tagline "Kesejahteraan untuk semua"). Both are raster; note in `design-system-readme.md` that vector versions are still needed for print.

## Files in this bundle
```
components/            reference component implementations + prop contracts + specimens
tokens/                colors.css, base.css, elevation.css
styles.css             entry stylesheet (imports tokens)
ui_kits/simtrans/       internal app screens
ui_kits/portal/         public portal screens
ui_kits/kawasan-crud/   CRUD flow reference
assets/                 logo files
design-system-readme.md   full design system documentation (palette rationale, type/spacing system, open gaps)
```

Read `design-system-readme.md` first for the full rationale behind every token decision.
