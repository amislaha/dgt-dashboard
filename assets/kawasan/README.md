# assets/kawasan

Foto asli kawasan transmigrasi, satu folder per kawasan (nama folder = slug dari `k.nama` di array `kawasan` pada `index.html`). Referensikan dari `index.html` pakai path relatif, mis. `assets/kawasan/kpb-rambutan/foto1.jpg`.

Folder saat ini (10, sesuai isi `kawasan` — id di `index.html` dalam kurung):
- `skp-salor` (k1)
- `kpb-rambutan` (k2)
- `skp-towuti` (k3)
- `kpb-malinau` (k4)
- `skp-tobadak` (k5)
- `kpb-bathin-iii` (k6)
- `skp-bina-buay` (k7)
- `kpb-pulau-rimau` (k8)
- `skp-kobisonta` (k9)
- `kpb-air-terang` (k10)

Kalau nambah kawasan baru di `index.html`, tambahin folder senama (slug) di sini juga.

Catatan: ini beda dari pola self-contained yang dipakai file lain (basemap, ilustrasi kota) — file di sini **tidak** ikut ter-bundle kalau `index.html` di-preview sebagai Claude Artifact (CSP-nya blokir request eksternal/relatif ke file lain). Hanya akan tampil kalau dibuka langsung (`file://`) atau lewat GitHub Pages.
