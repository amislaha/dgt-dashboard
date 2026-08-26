Use `Icon` for every glyph. Never hand-write SVG paths in this system.

```jsx
<Icon name="map-pin" size="lg" />
<Button iconLeft={<Icon name="download" />}>Unduh laporan</Button>
```

Icons are decorative by default (aria-hidden). Colour follows text colour, so set `color` on the parent. Preferred glyphs: map-pin, layers, users, file-check-2, landmark, sprout, tractor, chart-column, bell, search.
