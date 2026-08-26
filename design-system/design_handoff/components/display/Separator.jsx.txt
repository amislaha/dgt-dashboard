import React from "react";
const CSS = `
.tds-sep{border:0;background:var(--border);flex:none}
.tds-sep--h{width:100%;height:var(--border-width);margin:var(--space-4) 0}
.tds-sep--v{width:var(--border-width);align-self:stretch;margin:0 var(--space-4)}
.tds-sep--flush{margin:0}
.tds-seplabel{display:flex;align-items:center;gap:var(--space-3);margin:var(--space-4) 0;font:var(--type-eyebrow);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--muted-foreground)}
.tds-seplabel::before,.tds-seplabel::after{content:"";flex:1;height:var(--border-width);background:var(--border)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-separator-css")) {
  const s = document.createElement("style"); s.id = "tds-separator-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Separator({ orientation = "horizontal", flush = false, label, className = "" }) {
  if (label) return <div className={["tds-seplabel", className].filter(Boolean).join(" ")}>{label}</div>;
  return <hr className={["tds-sep", orientation === "vertical" ? "tds-sep--v" : "tds-sep--h", flush ? "tds-sep--flush" : "", className].filter(Boolean).join(" ")} />;
}
