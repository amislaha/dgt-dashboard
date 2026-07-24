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

Everything lives in one file: inline `<style>`, inline `<script>`. The only external requests are the Leaflet CDN (`<link>`/`<script>` in `<head>`) and OpenStreetMap tiles used by the real basemap — everything else, including all imagery, is self-contained. This matters if the file is ever hosted as a Claude Artifact, which has a strict CSP blocking any external CDN/tile request: the live basemap degrades gracefully there (see below), but only actually works on GitHub Pages.

**Data layer** — near the top of the `<script>`: plain JS arrays/objects (`kawasan`, `provinces`, `ewsAlerts`, `sCurve`, `komoditas`, `infraKategori`, `klCollab`, `asalDaerah`, `nationalKPI`). All values are fabricated/illustrative, not real ministry statistics — the UI says so explicitly ("Data ilustratif") and a footnote repeats this on every page. Don't treat kawasan names, coordinates, or figures as authoritative; when adding data, keep it clearly fictional and internally consistent (e.g. `mapX`/`mapY` in `kawasan` entries are pre-computed positions used by the locator inset, not real coordinates; `lat`/`lon` are real-world approximate coordinates used by the actual basemap).

**Chart layer** — hand-rolled SVG chart builders (`barChart`, `lineChartDual`, `donut`, `gauge`, `smoothClosedPath`), each a plain function that takes data + an `opts` object and returns an `<svg>` element via the `el()` namespaced-element helper. No charting library. `smoothClosedPath` converts a small set of anchor points into a closed Catmull-Rom spline — used to draw the schematic `ISLANDS` silhouettes reused by the Geospasial locator inset (see below). `gauge()` draws its value arc as a half-circle sweep (0–180°), so its SVG arc's large-arc-flag must always be `0` — the value angle can never exceed 180°, so it's never the "major" arc; a `frac > 0.5` style ternary there is a recurring bug (it was wrong once already), not a legitimate threshold.

**Routing / state** — a single global `state` object (current tab, selected kawasan/province, filters, sort, toggles) and a `MODULES` array (id, label, sub-label) drives the left sidebar. Each module has a `renderX()` function (`renderProfil`, `renderGeospasial`, `renderDemografi`, `renderInfrastruktur`, `renderMonitoring`, `renderEkonomi`, `renderAnalitik`, `renderIntelijen`) registered in the `RENDERERS` map. `render()` clears `#main` and mounts the current tab's function output. Each `renderX()` builds its markup as an HTML template string via the `h()` helper (wraps a string in a detached `<div>`), then wires up event listeners with the `qs`/`qsa` query helpers scoped to that `wrap` element — there's no reactive framework, so any state change that should update the DOM calls a local re-render function explicitly (e.g. `renderProvGrid()`, `renderReview()`, `renderEWS()`).

**Sidebar icons** — `ICON_PATHS`/`railIcon()` hold hand-drawn 24×24 line-icon SVG path data keyed by module id, rendered via `currentColor` so they pick up the active/inactive rail color from CSS. `miniIconSvg()` reuses two of those same paths for the Geospasial style-switch buttons.

**Geospasial module layout** — a 2×2 grid: top-left is the map panel (`.geo-map-stage`, containing `#sebaranBody` plus two overlays that persist across view switches — `.map-style-switch` and `.map-locator`), top-right is the `renderGallery()` photo panel, bottom-left is the legality bar chart, bottom-right is `renderReview()`. `state.geoView` toggles between two sub-views inside `#sebaranBody`: `renderDasar()` (real Leaflet + OpenStreetMap basemap, markers at each `kawasan`'s `lat`/`lon`) and `renderProvGrid()` (province tiles with HPL/SHM layer-width bars) — there used to be a third "Peta Skematik" schematic-map view (`renderPeta()`); it was removed, but its `ISLANDS`/`smoothClosedPath` geometry lives on, reused by `renderLocator()` for the small "you are here" inset. `renderDasar()` checks `typeof L === "undefined"` and, if Leaflet failed to load (e.g. blocked by CSP), falls back to `renderDasarStatic()` instead of a live map. The module-level `activeLeafletMap` holds the live map instance so it can be `.remove()`d before creating a new one — both on view-toggle away from "dasar" and on switching sidebar tabs (in `setTab()`), since re-rendering doesn't automatically dispose of it. Leaflet's SVG renderer sets `fill` as a raw attribute rather than through CSS, so it can't resolve `var(--x)` custom properties — marker colors use the plain-hex twin `STAGE_COLOR_HEX` instead of `STAGE_COLOR`. Selecting a kawasan or province (map pin, gallery thumbnail, or province tile) re-runs `renderReview()`, `renderGallery()`, and `renderLocator()` so all three stay in sync regardless of which control triggered the change.

**Static basemap fallback** — `BASEMAP_STATIC_SRC` is a real OpenStreetMap tile mosaic (zoom 5, Indonesia bounding box), fetched once and baked in as a base64 JPEG data URI (~90KB of text in the `<script>`), so `renderDasarStatic()` can show actual coastlines even where live tile requests are blocked (the Claude Artifact preview). `mercatorPx()`/`basemapPct()` reproduce the exact Web Mercator projection math used when the image was built (see `BASEMAP_BBOX`, matching the crop) to place each kawasan's pin at the correct `%` position over the flat image — if you ever regenerate this image at a different zoom or bounding box, `BASEMAP_BBOX` must be updated to match or every pin will be off. There's no pan/zoom on this fallback and it's explicitly captioned as a static snapshot. It carries the required "© OpenStreetMap contributors" attribution baked into the overlay — keep that visible if this image is ever replaced.

**Area imagery** — `cityIllustration(k, w, h)` generates an inline SVG skyline (gradient sky + silhouetted buildings + lit windows), seeded deterministically from `k.id` via `seededRandom()`, and is used only in the Geospasial "Foto-foto" gallery. This deliberately replaced an earlier version that pulled random stock photos (`picsum.photos`): a random photo service can't be trusted to stay thematically on-brief (a snowy scene turned up for a tropical kawasan) or, more importantly, to avoid depicting real identifiable people in a fabricated government-dashboard context — neither risk is acceptable just for placeholder texture. There is no separate "photo card" in the Profil drawer or the map info panels anymore; imagery lives only in the gallery panel.

**Theming** — deliberately single-theme (dark "command-center" palette defined as CSS custom properties in `:root`), not adapted for light mode. This is an intentional choice (the source spec calls for an LED-video-wall / war-room display), not an oversight — don't add a light theme without checking that's actually wanted.

**AI Assistant panel** (`renderIntelijen`) — a keyword-matching mock (`answer()` in the chat log logic), not a real LLM call. It only answers a fixed set of intents (mandiri, risiko, anggaran, indeks/5T) by reading the same in-page data arrays.
