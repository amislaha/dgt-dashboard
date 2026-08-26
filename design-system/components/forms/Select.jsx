import React from "react";
const CSS = `
.tds-select{position:relative;display:inline-flex;width:100%}
.tds-select select{appearance:none;width:100%;height:var(--control-h);padding:0 2.25rem 0 var(--space-3);background:var(--background);color:var(--foreground);border:var(--border-width) solid var(--input);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-base);box-shadow:var(--shadow-2xs);cursor:pointer;transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard)}
.tds-select select:hover{border-color:var(--abu-300)}
.tds-select select:focus{outline:none;border-color:var(--ring);box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-select select:disabled{background:var(--muted);color:var(--muted-foreground);cursor:not-allowed}
.tds-select--sm select{height:var(--control-h-sm);font-size:var(--text-sm)}
.tds-select__chev{position:absolute;right:var(--space-3);top:50%;transform:translateY(-50%);width:.875rem;height:.875rem;color:var(--muted-foreground);pointer-events:none}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-select-css")) {
  const s = document.createElement("style"); s.id = "tds-select-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Select({ options = [], placeholder, size = "md", className = "", ...rest }) {
  return (
    <span className={["tds-select", size === "sm" ? "tds-select--sm" : "", className].filter(Boolean).join(" ")}>
      <select {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>;
        })}
      </select>
      <svg className="tds-select__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </span>
  );
}
