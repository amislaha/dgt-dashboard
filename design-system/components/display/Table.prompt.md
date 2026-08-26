Use `Table` for registries and lists of records — the core surface of SIMTRANS.

```jsx
<Table density="compact" columns={[
  { key: "kode", label: "Kode" },
  { key: "kawasan", label: "Kawasan" },
  { key: "kk", label: "Jumlah KK", numeric: true },
  { key: "status", label: "Status", render: r => <Badge tone="success" dot>{r.status}</Badge> }
]} rows={rows} onRowClick={openDetail} />
```

Numeric columns must set `numeric` so figures align. Wrap in `Pagination` below, never infinite scroll for official data.
