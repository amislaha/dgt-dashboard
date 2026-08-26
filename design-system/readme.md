# Transmigrasi Digital — Design System

Design system for **digital governance in Indonesian transmigration** (transmigrasi): the public
service portal of the Kementerian Transmigrasi Republik Indonesia and SIMTRANS, the internal
system civil servants use to register kawasan (settlement areas), verify permohonan (applications)
and track penempatan (family placement).

The system is built on the **shadcn/ui token architecture** (`--background`, `--foreground`,
`--primary`, `--muted`, `--border`, `--ring`, `--radius: 0.625rem`, chart + sidebar scales) with an
palette sampled directly from the official 2024 emblem: **Biru Nusantara** `#163b54` (the seal ring
and all lockup type) as primary, **Teal Laut** `#33809c` (the emblem's water quadrant and the
tagline) for data, info and focus rings, and **Emas Tanah** `#dfb87e` / `#c09546` (the land
quadrants) for warnings and gold accents on dark chrome. Hijau and Merah exist only as functional
status colours (success / destructive) and are never used as brand colours.

The ministry's tagline is **"Kesejahteraan untuk semua."**

## Sources given to me

| Source | What it gave |
| --- | --- |
| `uploads/…(2024) (1)-01.png` (4725×4725) | The official 2024 circular emblem, full colour. Copied to `assets/logo-emblem.png`. **The palette in this system is sampled from this file.** |
| `uploads/…v2_(2024)-01.png` (4725×1122) | The official horizontal lockup with tagline. Copied to `assets/logo-lockup.png`. |
| Three SVG exports of the same marks | Unusable: their `<defs><style>` blocks were empty, so `fil0`–`fil7` had no fills and they rendered as black silhouettes. Superseded by the PNGs above; not kept in `assets/`. |
| Brief: "DIGITAL GOVERNANCE TRANSMIGRATION" | Product context: government digital services for transmigration. |
| Brief: "Use shadcn design system" | Token architecture, component geometry and naming. |

**No codebase, Figma file, deck or font binaries were provided.** Colour comes from the supplied
logo art; everything else is either (a) taken from shadcn/ui's published geometry, or (b) an explicit
design decision recorded below. No UI was reverse-engineered from a screenshot.

### ⚠️ Known gaps

1. **Logo art is raster, not vector.** `assets/logo-emblem.png` and `assets/logo-lockup.png` are
   4725px PNGs — plenty for screen at any size in these kits, but a working SVG is still worth
   having for print and small-size rendering. The SVG exports supplied so far lose their style
   block (export with *Presentation attributes* rather than internal CSS, and convert text to
   curves). The emblem was never redrawn or recoloured.
2. **Fonts are Google Fonts substitutes** (see Typography). No licensed binaries were supplied.
3. **Icons are Lucide** loaded from CDN — the ministry's own icon set was not supplied (see Iconography).

## Index

| Path | What |
| --- | --- |
| `styles.css` | Global entry point — `@import` list only. Consumers link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css` |
| `components/core/` | Icon |
| `components/forms/` | Button, Input, Label, Textarea, Select, Checkbox, RadioGroup, Switch |
| `components/display/` | Card, Badge, Table, Avatar, Separator, Progress |
| `components/feedback/` | Alert, Dialog |
| `components/navigation/` | Tabs, Breadcrumb, Pagination |
| `ui_kits/simtrans/` | Internal governance app — login, dasbor, registri kawasan, telaah permohonan |
| `ui_kits/portal/` | Public portal — beranda + 4-step permohonan form |
| `guidelines/` | Foundation specimen cards (Colors, Type, Spacing, Surfaces, Motion, Brand) |
| `assets/` | `logo-emblem.png` (circular seal), `logo-lockup.png` (horizontal signature with tagline) |
| `SKILL.md` | Agent Skills wrapper so this folder works inside Claude Code |
| `thumbnail.html` | Homepage tile |

### Components

Every component is `<Name>.jsx` + `<Name>.d.ts` + `<Name>.prompt.md`, with one `@dsCard` HTML per
directory. Read the `.prompt.md` before using a component — it carries the Indonesian-language
conventions for that primitive.

**Icon** · **Button** · **Input** · **Label** · **Textarea** · **Select** · **Checkbox** ·
**RadioGroup** · **Switch** · **Card** · **Badge** · **Table** · **Avatar** · **Separator** ·
**Progress** · **Alert** · **Dialog** · **Tabs** · **Breadcrumb** · **Pagination**

**Intentional additions** (no source defined a component inventory, so this is the standard
shadcn-shaped set sized to two real products):
- `Icon` — a wrapper over the Lucide set so no screen ever hand-rolls an SVG path.
- `Pagination` — official registries are paginated by law-adjacent convention (record counts are
  shown); infinite scroll is not acceptable for government record lists.

Not built, because neither product needed them: Tooltip, Toast/Sonner, Command, Popover, Sheet,
Accordion, Calendar, Combobox. Say the word and they follow the same pattern.

## Content fundamentals

**Language.** Indonesian first, always. English exists only as a language toggle in the portal top
strip. Copy is written in **Bahasa Indonesia baku** (standard, not colloquial): "Ajukan permohonan",
not "Yuk ajukan".

**Person.** The state speaks as *kami* ("Kami menyatakan…", "Hubungi kami"), the citizen or officer
is addressed as *Anda* ("Berkas Anda dijadwalkan diverifikasi"). Never *aku/kamu*. Formal statements
that bind the user legally switch to *saya* in the first person, because the user is signing them:
"Saya menyatakan seluruh data benar dan sah."

**Casing.** Sentence case for headings, labels, buttons and table headers — "Registri kawasan
transmigrasi", not "Registri Kawasan Transmigrasi". Two exceptions: institutional names keep their
official capitalisation ("Kementerian Transmigrasi Republik Indonesia", "Ditjen PKP2Trans"), and the
wordmark and table column headers are set in uppercase with `--tracking-caps`.

**Tone.** Plain, procedural, unhurried. Say what happened, what it means, and what to do next.
Never apologise theatrically and never use exclamation marks.
- Good: "1 dokumen wajib belum diunggah. Verifikasi dapat dilanjutkan dengan catatan perbaikan."
- Bad: "Ups! Ada yang kurang nih 😅"

**Numbers and dates.** Indonesian formatting throughout: `1.284` (dot thousands), `Rp 4,7 T` (comma
decimal), `12.480 ha`, `−2,1932 · 114,7291` for coordinates, `24 Agustus 2026` in full and
`24 Agu 2026, 09.14` in logs (dot as the time separator, WIB stated when relevant).

**Vocabulary that must stay consistent:** permohonan (application), kawasan (area),
penempatan (placement), KK (keluarga/household unit), verifikasi, penetapan (designation),
dinas pengusul (proposing regional office), SK (decree), daya tampung (capacity), SLA in working
days ("7 hari kerja").

**Legal and service framing.** Public service pages always state cost, duration and legal basis
("Gratis · 7 hari kerja · PP 3/2014"). Government systems state audit consequences on any
irreversible action ("Tindakan ini tercatat dalam log audit").

**Emoji: never.** Not in UI, not in copy, not in the marketing surfaces. Unicode is used only for
typographic characters: `·` as a separator, `−` as a minus sign, `…` for truncation, `—` for em dash.

## Visual foundations

**Colour.** One primary — `--biru-600` `#163b54`, the emblem's own navy. Hover goes darker
(`--biru-700`), never lighter; tints (`--biru-50`) carry selected/active states and icon plates.
Teal `#33809c` is the secondary brand colour: focus rings, `--info`, chart series 2, and the hero
gradient's cool end. Emas carries "Menunggu", the gold accent on dark chrome and the tagline. Hijau
appears only as `--success` / "Terverifikasi", Merah only as `--destructive` / "Ditolak" — neither is
a brand colour and neither may be used decoratively. Status meanings are fixed (see the *Status
mapping* card). Maximum two background colours per surface: white/`--abu-50` for content,
`--biru-700/900/950` for chrome.

**Type.** Plus Jakarta Sans for everything (a Jakarta-designed grotesque, used widely in Indonesian
government digital services). Lora appears only as a pull quote / editorial voice — the login panel
quote and article intros. JetBrains Mono only for identifiers: registration numbers, kode kawasan,
file names, coordinates. Display sizes are tight (`-.03em`) and heavy (800); body is 14px/1.45.
Numbers are always `tabular-nums`.

**Spacing & layout.** 4px base. Control heights 32/36/40px; public-facing touch targets rise to
44px. Content column `--container-max` 1200px (portal) / `--container-wide` 1440px (app), page
padding 24px, prose 68ch. The app is a fixed 256px dark sidebar plus a 56px sticky topbar; the
portal is a 34px government strip, a 72px sticky glass header, then full-bleed sections at 64px
vertical rhythm.

**Backgrounds.** No stock photography is shipped (none was provided). Section separation is done
with `--abu-50` tint bands and hairline borders. The one full-bleed treatment is the portal hero: a
155° gradient from `--biru-900` through `--biru-700` into `--teal-600`, plus a flat scrim at 25%
so white text always clears contrast. Image slots are honest placeholders labelled with what belongs
there ("Foto siaran pers", "Pratinjau peta hanya tersedia di lingkungan produksi") rather than
invented artwork. No patterns, no textures, no grain, no decorative illustration.

**Cards.** 1px `--border` + `--radius-xl` (14px) + `--shadow-xs` on `--card`. `flat` drops the
shadow (used when a card sits inside another region), `raised` drops the border for
`--shadow-md`. Interactive cards lift 1px and pick up a `--biru-200` border on hover. No coloured
left-border accent cards — the one exception is the legal `pt-decl` statement block, where a 3px
`--emas-300` rule marks quoted regulation.

**Elevation.** Borders do the work; shadows never exceed 18% opacity and are neutral (no coloured
glows). Dialogs are the only `--shadow-xl` surface.

**Radii.** `--radius` 10px base → 6px (sm, checkboxes, small chips), 8px (md, all controls), 10px
(lg), 14px (xl, cards), 20px (2xl, dialogs and the hero stat card), full for badges, avatars,
switches and step pills.

**Transparency & blur.** Used in exactly two places: sticky headers (`--glass-bg` +
`--glass-blur`, so content scrolling under stays legible) and the dialog overlay
(`--overlay` at 55% + 2px blur). Never on cards, never as decoration.

**Motion.** Short and functional. 80ms press, 120ms colour/hover, 180ms dialogs and switches, 280ms
progress and expansion, 420ms route change. Standard curve `cubic-bezier(.2,0,0,1)`; entrances use
`--ease-out`. Dialogs fade + rise 8px with a 0.98→1 scale. No bounce, no spring, no parallax, no
scroll-jacking, no looping ambient animation. Everything collapses to 0ms under
`prefers-reduced-motion`.

**Hover / press / focus / disabled.** Hover darkens fills by one ramp step and tints ghost/outline
backgrounds with `--secondary`/`--accent`; links underline. Press scales to `--press-scale` (.985) —
no colour flash. Focus is a 3px `--ring` at 45% alpha, offset 2px, always visible (government
accessibility requirement) — never removed, never replaced with a border change alone. Disabled is
opacity .5 with pointer-events off; disabled inputs also take a `--muted` fill.

**Borders.** 1px hairlines almost everywhere; 1.5px for checkbox/radio outlines so they read at 16px.
Table rows are separated by hairlines, not shadows; the header row sits on `--abu-50` and is sticky.

**Imagery vibe (when real photography arrives).** Warm, daylight, documentary — people, land and
infrastructure in situ, no staged corporate stock, no heavy filters. Always place text over the
`--scrim-bottom` protection gradient rather than on a bare photo.

## Iconography

- **Set: Lucide 0.436.0**, loaded from `https://unpkg.com/lucide-static@0.436.0/icons/<name>.svg`.
  **This is a substitution** — the ministry's own icon set was not provided. Lucide was chosen for
  its 2px stroke, 24px grid and outline-only style, which reads as neutral and institutional.
- Every glyph goes through the `Icon` component, which paints the SVG as a **CSS mask over
  `currentColor`**, so icons inherit text colour and respond to state without a second asset.
  **No component in this system contains a hand-drawn SVG path.**
- Sizes: 14 / 16 / 20 / 24px (`sm`/`md`/`lg`/`xl`). 16px inside buttons and table cells, 20px in
  navigation and section headers, 24px for empty states.
- Icons are decorative (`aria-hidden`) and always paired with a text label; the only icon-only
  controls are search, notifications and row menus, which carry an `aria-label`.
- Domain glyph vocabulary: `map-pin` kawasan, `layers` registri, `clipboard-list` permohonan,
  `users` KK/penempatan, `chart-column` anggaran, `file-check-2` dokumen lengkap, `shield-check`
  audit/SSO, `sprout`/`tractor` program pertanian, `landmark` institutional, `map` peta.
- **No emoji, ever.** Unicode is used only as typography (`·`, `−`, `…`, `—`).
- Brand assets in `assets/`: the circular emblem and the horizontal lockup. The emblem is #163b54 +
  gold + teal on transparent, so it must never sit directly on dark or coloured fields — on dark
  chrome it goes on a white circular plate (see the Brand cards, the SIMTRANS sidebar/login and the
  portal footer). The lockup is used as-is on light backgrounds, e.g. the portal header.

## Using this system

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { Button, Card, Badge, Icon } = window.TransmigrasiDigitalDesignSystem_7b839d;
</script>
```

Style everything against the semantic tokens (`--primary`, `--border`, `--muted-foreground`), not the
raw ramps. Reach for a ramp value (`--biru-700`, `--emas-300`) only for hover steps and on-dark
chrome, as the kits do.
