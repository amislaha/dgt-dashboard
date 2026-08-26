# SIMTRANS — internal governance app (UI kit)

Recreation of the internal system used by Kementerian Transmigrasi staff to run the kawasan
lifecycle. Open `index.html` and click through:

1. **Login** (`screen-login.jsx`) — split layout: dark brand panel with a Lora pull quote, form panel
   with NIP + password, maintenance notice, and an SSO ASN Digital fallback. Either button signs in.
2. **Dasbor** (`screen-dashboard.jsx`) — SLA alert, four stat tiles, budget bar chart + provincial
   placement progress, and the top of the verification queue. Rows and "Lihat antrean" navigate.
3. **Registri kawasan** (`screen-registri.jsx`) — toolbar (search + two selects + advanced filter),
   status tabs with counts, zebra table with row selection and row menu, pagination showing 1.284
   records. Any row opens the detail screen.
4. **Telaah permohonan** (`screen-detail.jsx`) — breadcrumb, decision actions, document-completeness
   warning, tabbed telaah / dokumen / riwayat, sidebar with SLA progress, map placeholder and
   verifier notes. "Setujui" / "Tolak" open the decision dialog; saving swaps the warning for a
   success alert.

`app-shell.jsx` holds the dark sidebar, glass topbar, page header and stat tile. Modules in the
sidebar that are not part of this kit (Penempatan, Anggaran, Peta, Audit, Pengaturan) render a
deliberately empty page with a disclaimer rather than invented screens.

Everything visual comes from the design system: `Button`, `Input`, `Select`, `Checkbox`,
`RadioGroup`, `Switch`, `Textarea`, `Label`, `Card`, `Badge`, `Table`, `Avatar`, `Separator`,
`Progress`, `Alert`, `Dialog`, `Tabs`, `Breadcrumb`, `Pagination`, `Icon`. The kit only adds layout
CSS (`sim-*` classes in `index.html`).

Data is fictional but plausible: real kawasan names (Lamunti, Tinanggea, Salor, Rasau Jaya,
Kobisonta, Mesuji, Pawonsari, Belitang) with invented figures.

The sidebar and login panel carry the official emblem on a white circular plate — the seal's ring and
type are #163b54 and would vanish if placed straight onto the navy chrome.
