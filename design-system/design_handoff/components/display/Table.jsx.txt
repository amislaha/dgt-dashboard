import React from "react";
const CSS = `
.tds-tablewrap{width:100%;overflow:auto;border:var(--border-width) solid var(--border);border-radius:var(--radius-xl);background:var(--card)}
.tds-table{width:100%;border-collapse:collapse;font-family:var(--font-sans);font-size:var(--text-base)}
.tds-table thead th{position:sticky;top:0;background:var(--abu-50);text-align:left;padding:var(--space-2-5) var(--space-4);font-size:var(--text-xs);font-weight:var(--weight-semibold);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--muted-foreground);border-bottom:var(--border-width) solid var(--border);white-space:nowrap}
.tds-table tbody td{padding:var(--space-3) var(--space-4);border-bottom:var(--border-width) solid var(--border);vertical-align:middle;color:var(--foreground)}
.tds-table tbody tr:last-child td{border-bottom:0}
.tds-table--hover tbody tr{transition:background-color var(--duration-fast) var(--ease-standard)}
.tds-table--hover tbody tr:hover{background:var(--abu-50)}
.tds-table--zebra tbody tr:nth-child(even){background:var(--abu-50)}
.tds-table--compact thead th{padding:var(--space-2) var(--space-3)}
.tds-table--compact tbody td{padding:var(--space-2) var(--space-3);font-size:var(--text-sm)}
.tds-table td.tds-num,.tds-table th.tds-num{text-align:right;font-variant-numeric:tabular-nums}
.tds-table__empty{padding:var(--space-10);text-align:center;color:var(--muted-foreground);font:var(--type-body)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-table-css")) {
  const s = document.createElement("style"); s.id = "tds-table-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Table({ columns = [], rows = [], density = "default", zebra = false, hover = true, emptyLabel = "Belum ada data", onRowClick, className = "" }) {
  const cls = ["tds-table", hover ? "tds-table--hover" : "", zebra ? "tds-table--zebra" : "", density === "compact" ? "tds-table--compact" : "", className].filter(Boolean).join(" ");
  return (
    <div className="tds-tablewrap">
      <table className={cls}>
        <thead><tr>{columns.map((c) => <th key={c.key} className={c.numeric ? "tds-num" : undefined} style={c.width ? { width: c.width } : undefined}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={columns.length}><div className="tds-table__empty">{emptyLabel}</div></td></tr>}
          {rows.map((r, i) => (
            <tr key={r.id ?? i} onClick={onRowClick ? () => onRowClick(r) : undefined} style={onRowClick ? { cursor: "pointer" } : undefined}>
              {columns.map((c) => <td key={c.key} className={c.numeric ? "tds-num" : undefined}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
