import React from "react";
const CSS = `
.tds-prog{display:flex;flex-direction:column;gap:var(--space-1-5)}
.tds-prog__head{display:flex;justify-content:space-between;align-items:baseline;font:var(--type-caption);color:var(--muted-foreground)}
.tds-prog__head strong{font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--foreground);font-variant-numeric:tabular-nums}
.tds-prog__track{height:.5rem;width:100%;background:var(--abu-200);border-radius:var(--radius-full);overflow:hidden}
.tds-prog--sm .tds-prog__track{height:.25rem}
.tds-prog__bar{height:100%;border-radius:var(--radius-full);background:var(--primary);transition:width var(--duration-slow) var(--ease-out)}
.tds-prog--warning .tds-prog__bar{background:var(--warning)}
.tds-prog--danger .tds-prog__bar{background:var(--destructive)}
.tds-prog--info .tds-prog__bar{background:var(--info)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-progress-css")) {
  const s = document.createElement("style"); s.id = "tds-progress-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Progress({ value = 0, max = 100, label, valueLabel, tone = "primary", size = "md", className = "" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={["tds-prog", `tds-prog--${tone}`, size === "sm" ? "tds-prog--sm" : "", className].filter(Boolean).join(" ")}>
      {(label || valueLabel) && <div className="tds-prog__head"><span>{label}</span><strong>{valueLabel ?? `${Math.round(pct)}%`}</strong></div>}
      <div className="tds-prog__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}><div className="tds-prog__bar" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
