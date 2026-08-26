# Portal publik (transmigrasi.go.id) — UI kit

Public-facing ministry portal. Open `index.html`; the header and service cards navigate between the
two screens.

1. **Beranda** (`screen-beranda.jsx`) — government top strip (language + high-contrast links), glass
   sticky header with emblem lockup, full-bleed gradient hero with a floating "Capaian nasional"
   stat card, six service cards, a kawasan distribution split section with an honest map
   placeholder, three press releases with labelled image slots, and a closing contact band.
2. **Layanan / permohonan** (`screen-layanan.jsx`) — the flagship service: a 4-step application
   (Data pengusul → Data kawasan → Dokumen → Pernyataan) with step pills, progress, service summary
   card (cost, duration, legal basis), upload rows with one deliberately missing mandatory document,
   legal declaration block, help sidebar, and a submit confirmation dialog that produces a
   registration number.

`site-chrome.jsx` holds the top strip, header and the five-column footer (address, service links,
transparency links — PPID/LHKPN/WBS — and newsletter signup).

Layout CSS lives in `index.html` under `pt-*`. All controls, cards, badges, alerts and dialogs come
from the design system. Photography is not shipped: image areas are labelled placeholders.

The header uses the horizontal lockup PNG at 42px height; the footer uses the emblem on a white
circular plate over the navy field, with the tagline "Kesejahteraan untuk semua" in Emas.
