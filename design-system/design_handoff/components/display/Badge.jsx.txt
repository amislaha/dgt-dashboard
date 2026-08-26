import React from "react";
const CSS = `
.tds-badge{display:inline-flex;align-items:center;gap:var(--space-1-5);padding:.125rem var(--space-2);border-radius:var(--radius-full);border:var(--border-width) solid transparent;font-family:var(--font-sans);font-size:var(--text-xs);font-weight:var(--weight-semibold);line-height:1.35;white-space:nowrap}
.tds-badge--square{border-radius:var(--radius-sm)}
.tds-badge__dot{width:.375rem;height:.375rem;border-radius:var(--radius-full);background:currentColor}
.tds-badge--neutral{background:var(--abu-100);color:var(--abu-700);border-color:var(--abu-200)}
.tds-badge--primary{background:var(--biru-50);color:var(--biru-700);border-color:var(--biru-100)}
.tds-badge--solid{background:var(--primary);color:var(--primary-foreground)}
.tds-badge--success{background:var(--hijau-50);color:var(--hijau-600);border-color:var(--hijau-100)}
.tds-badge--warning{background:var(--emas-50);color:var(--emas-600);border-color:var(--emas-100)}
.tds-badge--danger{background:var(--merah-50);color:var(--merah-600);border-color:var(--merah-100)}
.tds-badge--info{background:var(--teal-50);color:var(--teal-500);border-color:var(--teal-100)}
.tds-badge--outline{background:transparent;color:var(--muted-foreground);border-color:var(--border)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-badge-css")) {
  const s = document.createElement("style"); s.id = "tds-badge-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Badge({ tone = "neutral", shape = "pill", dot = false, children, className = "", ...rest }) {
  return <span className={["tds-badge", `tds-badge--${tone}`, shape === "square" ? "tds-badge--square" : "", className].filter(Boolean).join(" ")} {...rest}>{dot && <span className="tds-badge__dot" aria-hidden="true" />}{children}</span>;
}
