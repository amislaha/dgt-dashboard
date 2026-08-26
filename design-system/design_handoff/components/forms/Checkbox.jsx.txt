import React from "react";
const CSS = `
.tds-check{display:inline-flex;align-items:flex-start;gap:var(--space-2-5);cursor:pointer;font:var(--type-body)}
.tds-check--disabled{opacity:.55;cursor:not-allowed}
.tds-check input{position:absolute;opacity:0;width:1rem;height:1rem;margin:0}
.tds-check__box{flex:none;display:grid;place-items:center;width:1rem;height:1rem;margin-top:.15rem;border:var(--border-width-strong) solid var(--abu-300);border-radius:var(--radius-sm);background:var(--background);box-shadow:var(--shadow-2xs);transition:var(--transition-colors)}
.tds-check:hover .tds-check__box{border-color:var(--biru-400)}
.tds-check input:checked + .tds-check__box{background:var(--primary);border-color:var(--primary)}
.tds-check input:focus-visible + .tds-check__box{box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-check__box svg{width:.75rem;height:.75rem;color:var(--primary-foreground);opacity:0;transition:opacity var(--duration-fast) var(--ease-standard)}
.tds-check input:checked + .tds-check__box svg{opacity:1}
.tds-check__txt{display:flex;flex-direction:column;gap:.125rem}
.tds-check__desc{font:var(--type-caption);color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-checkbox-css")) {
  const s = document.createElement("style"); s.id = "tds-checkbox-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Checkbox({ label, description, disabled = false, className = "", ...rest }) {
  return (
    <label className={["tds-check", disabled ? "tds-check--disabled" : "", className].filter(Boolean).join(" ")} style={{ position: "relative" }}>
      <input type="checkbox" disabled={disabled} {...rest} />
      <span className="tds-check__box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></span>
      {(label || description) && <span className="tds-check__txt"><span>{label}</span>{description && <span className="tds-check__desc">{description}</span>}</span>}
    </label>
  );
}
