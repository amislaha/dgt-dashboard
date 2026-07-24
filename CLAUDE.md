# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

A prototype build of **SVKE** (Sistem Visualisasi Keputusan Eksekutif — Executive Decision Support Visualization System), a situation-room dashboard for Indonesia's transmigration-area (kawasan transmigrasi) leadership. There is no build system, package manager, or test suite — everything is static, dependency-free HTML/CSS/vanilla JS.

- `DGT.md` — the original spec (in Indonesian). Describes the system as an 8-module "war room" control panel meant for large-format displays (LED video wall / 4K), covering: area profiles (5T indicators), land legality (HPL/SHM geospatial overlay), demographics, infrastructure & cross-ministry collaboration, program/budget monitoring, economic/investment potential, priority scoring & early warning, and executive intelligence/AI assistant. Treat this file as the source of truth for what each module is supposed to do.
- `index.html` — the single-file implementation of the dashboard described above, and the file GitHub Pages serves directly from the repo root. This is the file to edit — it is the only copy; there is no separate source file to keep in sync.

This directory **is** the git repository (`git init`'d here, remote `origin` → `amislaha/dgt-dashboard` on GitHub). Work directly in this folder.

## Common commands

There is nothing to install or build. To preview, just open `index.html` in a browser.

To save and publish a change:

```bash
git add -A
git commit -m "..."
git push
```

Commits should be small and describe the user-visible change (e.g. "Add schematic map view to Geospasial module"), since the main reason this repo exists is to make it easy to look back at `git log` or revert (`git revert`/`git checkout <hash> -- index.html`) to a prior working state.

The GitHub repo is `amislaha/dgt-dashboard` (public, required for free GitHub Pages). Pages is configured to serve `index.html` from the `master` branch root — every push to `master` redeploys the live site at https://amislaha.github.io/dgt-dashboard/ within a minute or two.

## Architecture of index.html

Everything lives in one file: inline `<style>`, inline `<script>`, no external requests (this matters if it's ever hosted as a Claude Artifact, which has a strict CSP blocking any external CDN/font/script).

**Data layer** — near the top of the `<script>`: plain JS arrays/objects (`kawasan`, `provinces`, `ewsAlerts`, `sCurve`, `komoditas`, `infraKategori`, `klCollab`, `asalDaerah`, `nationalKPI`). All values are fabricated/illustrative, not real ministry statistics — the UI says so explicitly ("Data ilustratif") and a footnote repeats this on every page. Don't treat kawasan names, coordinates, or figures as authoritative; when adding data, keep it clearly fictional and internally consistent (e.g. `mapX`/`mapY` in `kawasan` entries are pre-computed screen positions for the schematic map, not real coordinates).

**Chart layer** — hand-rolled SVG chart builders (`barChart`, `lineChartDual`, `donut`, `gauge`, `smoothClosedPath`), each a plain function that takes data + an `opts` object and returns an `<svg>` element via the `el()` namespaced-element helper. No charting library. `smoothClosedPath` converts a small set of anchor points into a closed Catmull-Rom spline — used to draw the schematic island shapes in the map view (`ISLANDS` array); it is not a survey-accurate map, and the UI discloses this.

**Routing / state** — a single global `state` object (current tab, selected kawasan/province, filters, sort, toggles) and a `MODULES` array (id, label, sub-label) drives the left sidebar. Each module has a `renderX()` function (`renderProfil`, `renderGeospasial`, `renderDemografi`, `renderInfrastruktur`, `renderMonitoring`, `renderEkonomi`, `renderAnalitik`, `renderIntelijen`) registered in the `RENDERERS` map. `render()` clears `#main` and mounts the current tab's function output. Each `renderX()` builds its markup as an HTML template string via the `h()` helper (wraps a string in a detached `<div>`), then wires up event listeners with the `qs`/`qsa` query helpers scoped to that `wrap` element — there's no reactive framework, so any state change that should update the DOM calls a local re-render function explicitly (e.g. `renderProvGrid()`, `renderConflict()`, `renderEWS()`).

**Sidebar icons** — `ICON_PATHS`/`railIcon()` hold hand-drawn 24×24 line-icon SVG path data keyed by module id, rendered via `currentColor` so they pick up the active/inactive rail color from CSS.

**Geospasial module specifics** — `state.geoView` toggles between two sub-views of the same "Sebaran/Peta Kawasan" panel: `renderProvGrid()` (province tiles with HPL/SHM layer-width bars) and `renderPeta()` (the schematic SVG archipelago map with clickable population/stage-coded pins). Both drive the same `renderConflict()` (HPL–SHM gap ranking) via `state.selectedProv`.

**Theming** — deliberately single-theme (dark "command-center" palette defined as CSS custom properties in `:root`), not adapted for light mode. This is an intentional choice (the source spec calls for an LED-video-wall / war-room display), not an oversight — don't add a light theme without checking that's actually wanted.

**AI Assistant panel** (`renderIntelijen`) — a keyword-matching mock (`answer()` in the chat log logic), not a real LLM call. It only answers a fixed set of intents (mandiri, risiko, anggaran, indeks/5T) by reading the same in-page data arrays.
