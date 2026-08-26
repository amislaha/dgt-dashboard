import React from "react";
const CSS = `
.tds-tabs{display:flex;gap:var(--space-1);border-bottom:var(--border-width) solid var(--border)}
.tds-tab{position:relative;background:none;border:0;padding:var(--space-2-5) var(--space-3);margin-bottom:-1px;font-family:var(--font-sans);font-size:var(--text-base);font-weight:var(--weight-medium);color:var(--muted-foreground);cursor:pointer;border-bottom:2px solid transparent;transition:var(--transition-colors)}
.tds-tab:hover{color:var(--foreground)}
.tds-tab--active{color:var(--primary);border-bottom-color:var(--primary)}
.tds-tab__count{margin-left:var(--space-1-5);padding:.0625rem var(--space-1-5);border-radius:var(--radius-full);background:var(--abu-100);color:var(--abu-600);font-size:var(--text-2xs);font-weight:var(--weight-semibold)}
.tds-tab--active .tds-tab__count{background:var(--biru-50);color:var(--biru-700)}
.tds-tabs--pill{border-bottom:0;gap:var(--space-1);padding:var(--space-1);background:var(--secondary);border-radius:var(--radius-lg);display:inline-flex}
.tds-tabs--pill .tds-tab{margin-bottom:0;border-bottom:0;border-radius:var(--radius-md);padding:var(--space-1-5) var(--space-3);font-size:var(--text-sm)}
.tds-tabs--pill .tds-tab--active{background:var(--background);color:var(--foreground);box-shadow:var(--shadow-xs)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-tabs-css")) {
  const s = document.createElement("style"); s.id = "tds-tabs-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Tabs({ items = [], value, onChange, variant = "underline", className = "" }) {
  return (
    <div role="tablist" className={["tds-tabs", variant === "pill" ? "tds-tabs--pill" : "", className].filter(Boolean).join(" ")}>
      {items.map((it) => {
        const t = typeof it === "string" ? { value: it, label: it } : it;
        const active = t.value === value;
        return (
          <button key={t.value} type="button" role="tab" aria-selected={active} className={["tds-tab", active ? "tds-tab--active" : ""].filter(Boolean).join(" ")} onClick={() => onChange && onChange(t.value)}>
            {t.label}{t.count != null && <span className="tds-tab__count">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
