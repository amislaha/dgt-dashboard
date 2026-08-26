import React from "react";
const CSS = `
.tds-pag{display:flex;align-items:center;gap:var(--space-4);font-family:var(--font-sans);font-size:var(--text-sm)}
.tds-pag__info{color:var(--muted-foreground);font-variant-numeric:tabular-nums}
.tds-pag__list{display:flex;align-items:center;gap:var(--space-1);margin-left:auto}
.tds-pag__btn{display:grid;place-items:center;min-width:2rem;height:2rem;padding:0 var(--space-2);border:var(--border-width) solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--foreground);font-size:var(--text-sm);font-weight:var(--weight-medium);cursor:pointer;font-variant-numeric:tabular-nums;transition:var(--transition-colors)}
.tds-pag__btn:hover:not(:disabled){background:var(--accent);border-color:var(--biru-200);color:var(--accent-foreground)}
.tds-pag__btn:disabled{opacity:.45;cursor:not-allowed}
.tds-pag__btn--active{background:var(--primary);border-color:var(--primary);color:var(--primary-foreground)}
.tds-pag__btn--active:hover{background:var(--biru-700);color:var(--primary-foreground)}
.tds-pag__gap{padding:0 var(--space-1);color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-pagination-css")) {
  const s = document.createElement("style"); s.id = "tds-pagination-css"; s.textContent = CSS; document.head.appendChild(s);
}
function pages(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out = [1];
  const from = Math.max(2, page - 1), to = Math.min(total - 1, page + 1);
  if (from > 2) out.push("…");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 1) out.push("…");
  out.push(total);
  return out;
}
export function Pagination({ page = 1, totalPages = 1, totalItems, onChange, className = "" }) {
  return (
    <div className={["tds-pag", className].filter(Boolean).join(" ")}>
      {totalItems != null && <span className="tds-pag__info">{totalItems.toLocaleString("id-ID")} data · halaman {page} dari {totalPages}</span>}
      <div className="tds-pag__list">
        <button type="button" className="tds-pag__btn" disabled={page <= 1} onClick={() => onChange && onChange(page - 1)}>Sebelumnya</button>
        {pages(page, totalPages).map((p, i) => p === "…"
          ? <span key={`g${i}`} className="tds-pag__gap">…</span>
          : <button key={p} type="button" className={["tds-pag__btn", p === page ? "tds-pag__btn--active" : ""].filter(Boolean).join(" ")} onClick={() => onChange && onChange(p)}>{p}</button>)}
        <button type="button" className="tds-pag__btn" disabled={page >= totalPages} onClick={() => onChange && onChange(page + 1)}>Berikutnya</button>
      </div>
    </div>
  );
}
