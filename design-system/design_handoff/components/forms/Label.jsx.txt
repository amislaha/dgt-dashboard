import React from "react";
const CSS = `
.tds-label{display:inline-flex;align-items:center;gap:var(--space-1);font:var(--type-label);color:var(--foreground)}
.tds-label__req{color:var(--destructive)}
.tds-label--disabled{color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-label-css")) {
  const s = document.createElement("style"); s.id = "tds-label-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Label({ required = false, disabled = false, children, className = "", ...rest }) {
  return <label className={["tds-label", disabled ? "tds-label--disabled" : "", className].filter(Boolean).join(" ")} {...rest}>{children}{required && <span className="tds-label__req" aria-hidden="true">*</span>}</label>;
}
