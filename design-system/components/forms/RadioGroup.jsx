import React from "react";
const CSS = `
.tds-radios{display:flex;flex-direction:column;gap:var(--space-2-5)}
.tds-radios--row{flex-direction:row;gap:var(--space-5)}
.tds-radio{position:relative;display:inline-flex;align-items:flex-start;gap:var(--space-2-5);cursor:pointer;font:var(--type-body)}
.tds-radio--disabled{opacity:.55;cursor:not-allowed}
.tds-radio input{position:absolute;opacity:0;width:1rem;height:1rem;margin:0}
.tds-radio__dot{flex:none;display:grid;place-items:center;width:1rem;height:1rem;margin-top:.15rem;border:var(--border-width-strong) solid var(--abu-300);border-radius:var(--radius-full);background:var(--background);box-shadow:var(--shadow-2xs);transition:var(--transition-colors)}
.tds-radio:hover .tds-radio__dot{border-color:var(--biru-400)}
.tds-radio__dot::after{content:"";width:.4375rem;height:.4375rem;border-radius:var(--radius-full);background:var(--primary-foreground);transform:scale(0);transition:transform var(--duration-fast) var(--ease-out)}
.tds-radio input:checked + .tds-radio__dot{background:var(--primary);border-color:var(--primary)}
.tds-radio input:checked + .tds-radio__dot::after{transform:scale(1)}
.tds-radio input:focus-visible + .tds-radio__dot{box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-radio__txt{display:flex;flex-direction:column;gap:.125rem}
.tds-radio__desc{font:var(--type-caption);color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-radio-css")) {
  const s = document.createElement("style"); s.id = "tds-radio-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function RadioGroup({ name, value, onChange, options = [], orientation = "vertical", className = "" }) {
  return (
    <div role="radiogroup" className={["tds-radios", orientation === "horizontal" ? "tds-radios--row" : "", className].filter(Boolean).join(" ")}>
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        return (
          <label key={opt.value} className={["tds-radio", opt.disabled ? "tds-radio--disabled" : ""].filter(Boolean).join(" ")}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} disabled={opt.disabled} onChange={(e) => onChange && onChange(e.target.value)} />
            <span className="tds-radio__dot" aria-hidden="true" />
            <span className="tds-radio__txt"><span>{opt.label}</span>{opt.description && <span className="tds-radio__desc">{opt.description}</span>}</span>
          </label>
        );
      })}
    </div>
  );
}
