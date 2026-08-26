import React from "react";
const CSS = `
.tds-crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:var(--space-1-5);font-family:var(--font-sans);font-size:var(--text-sm);color:var(--muted-foreground)}
.tds-crumbs a{color:var(--muted-foreground);text-decoration:none;transition:var(--transition-colors)}
.tds-crumbs a:hover{color:var(--primary);text-decoration:underline}
.tds-crumbs__sep{width:.75rem;height:.75rem;background-color:var(--abu-400);-webkit-mask-image:url("https://unpkg.com/lucide-static@0.436.0/icons/chevron-right.svg");mask-image:url("https://unpkg.com/lucide-static@0.436.0/icons/chevron-right.svg");-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.tds-crumbs__cur{color:var(--foreground);font-weight:var(--weight-medium)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-breadcrumb-css")) {
  const s = document.createElement("style"); s.id = "tds-breadcrumb-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Breadcrumb({ items = [], className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={["tds-crumbs", className].filter(Boolean).join(" ")}>
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={it.label + i}>
            {last || !it.href ? <span className={last ? "tds-crumbs__cur" : undefined} aria-current={last ? "page" : undefined}>{it.label}</span> : <a href={it.href}>{it.label}</a>}
            {!last && <span className="tds-crumbs__sep" aria-hidden="true" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
