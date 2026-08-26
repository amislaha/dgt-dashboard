import React from "react";
const CSS = `
.tds-switch{position:relative;display:inline-flex;align-items:center;gap:var(--space-2-5);cursor:pointer;font:var(--type-body)}
.tds-switch--disabled{opacity:.55;cursor:not-allowed}
.tds-switch input{position:absolute;opacity:0;width:2.25rem;height:1.25rem;margin:0}
.tds-switch__track{flex:none;width:2.25rem;height:1.25rem;padding:2px;border-radius:var(--radius-full);background:var(--abu-300);transition:background-color var(--duration-normal) var(--ease-standard)}
.tds-switch__knob{display:block;width:1rem;height:1rem;border-radius:var(--radius-full);background:#fff;box-shadow:var(--shadow-sm);transform:translateX(0);transition:transform var(--duration-normal) var(--ease-out)}
.tds-switch input:checked + .tds-switch__track{background:var(--primary)}
.tds-switch input:checked + .tds-switch__track .tds-switch__knob{transform:translateX(1rem)}
.tds-switch input:focus-visible + .tds-switch__track{box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-switch-css")) {
  const s = document.createElement("style"); s.id = "tds-switch-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Switch({ label, disabled = false, className = "", ...rest }) {
  return (
    <label className={["tds-switch", disabled ? "tds-switch--disabled" : "", className].filter(Boolean).join(" ")}>
      <input type="checkbox" role="switch" disabled={disabled} {...rest} />
      <span className="tds-switch__track" aria-hidden="true"><span className="tds-switch__knob" /></span>
      {label && <span>{label}</span>}
    </label>
  );
}
