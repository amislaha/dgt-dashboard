Use `Card` for any grouped block: statistik, ringkasan permohonan, layanan tile.

```jsx
<Card title="Permohonan Masuk" description="30 hari terakhir" action={<Badge tone="primary">Live</Badge>}>
  <div style={{ font: "var(--type-display)" }}>1.284</div>
</Card>
```

`interactive` only when the whole card navigates. Radius is `--radius-xl` (14px) — do not override.
