# Importing this design system into Figma

`foundations-and-components.html` is a single 1440px-wide sheet holding the brand lockups, every
colour ramp and semantic token, the type ladder, radii/elevation/scrim specimens, and every
component with its variants and states. It exists purely as an import source — it is not part of the
design system itself.

## Steps

1. In Figma, install the **html.to.design** plugin (Community → search "html.to.design").
2. Run it in a new Figma file → **URL** tab → paste the link below → *Import*.
3. It lands as one tall frame with real text layers, vectors and auto-layout groups. Group the
   sections into pages, then promote the swatches to **Figma variables** and the component rows to
   **Figma components**.

Import URL (valid ~1 hour — ask me for a fresh one after that):

```
https://7b839deb-d7a3-4b63-a229-77dd3cb059ab.claudeusercontent.com/v1/design/projects/7b839deb-d7a3-4b63-a229-77dd3cb059ab/serve/figma/import-foundations-and-components.html?t=64106455ad4e057c4827421f241fc9501071ea889a16ca2b0d03e309e9a85fc4.a9d6f66d-5973-4df0-9bd4-226af3cd2009.6760d31a-4a3a-4b95-afbb-06ac17b1883f.1787548999.fp&direct=1
```

`import-foundations-and-components.html` is the same sheet inlined into one self-contained file — the
plugin's **Local file / paste HTML** tab accepts it directly if you'd rather not use a URL. Do not
edit it; edit `foundations-and-components.html` and re-bundle.

## Screens

The two UI kits (`ui_kits/portal/index.html`, `ui_kits/simtrans/index.html`) import the same way, one
screen state per import — the plugin captures whatever the page renders, so import once per state you
want (login, dasbor, registri, telaah; beranda, formulir). Say the word and I'll prepare
single-state, self-contained copies of each screen with import URLs.

## Notes

- Fonts come from Google Fonts; install **Plus Jakarta Sans**, **Lora** and **JetBrains Mono** in
  Figma first or the text will substitute.
- Icons are Lucide painted as CSS masks. They import as images, not vectors — for editable icon
  vectors, install the **Lucide** Figma plugin and re-place them.
- Logos import as the raster PNGs in `assets/`. Replace them with vectors once a clean SVG export
  exists.
