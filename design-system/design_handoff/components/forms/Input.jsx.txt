import React from "react";
const CSS = `
.tds-input{display:flex;width:100%;height:var(--control-h);padding:0 var(--space-3);background:var(--background);color:var(--foreground);border:var(--border-width) solid var(--input);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-base);box-shadow:var(--shadow-2xs);transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard)}
.tds-input::placeholder{color:var(--muted-foreground)}
.tds-input:hover{border-color:var(--abu-300)}
.tds-input:focus{outline:none;border-color:var(--ring);box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-input:disabled{background:var(--muted);color:var(--muted-foreground);cursor:not-allowed}
.tds-input--sm{height:var(--control-h-sm);font-size:var(--text-sm)}
.tds-input--invalid{border-color:var(--destructive)}
.tds-input--invalid:focus{border-color:var(--destructive);box-shadow:0 0 0 var(--focus-ring-width) color-mix(in oklab,var(--destructive) 30%,transparent)}
.tds-field{display:flex;flex-direction:column;gap:var(--space-1-5)}
.tds-field__hint{font:var(--type-caption);color:var(--muted-foreground)}
.tds-field__err{font:var(--type-caption);color:var(--destructive)}
.tds-inputwrap{position:relative;display:flex;align-items:center}
.tds-inputwrap svg{position:absolute;left:var(--space-3);width:1rem;height:1rem;color:var(--muted-foreground);pointer-events:none}
.tds-inputwrap .tds-input--icon{padding-left:2.25rem}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-input-css")) {
  const s = document.createElement("style"); s.id = "tds-input-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Input({ size = "md", invalid = false, icon, hint, error, className = "", ...rest }) {
  const input = <input className={["tds-input", size === "sm" ? "tds-input--sm" : "", invalid || error ? "tds-input--invalid" : "", icon ? "tds-input--icon" : "", className].filter(Boolean).join(" ")} aria-invalid={invalid || !!error || undefined} {...rest} />;
  const control = icon ? <span className="tds-inputwrap">{icon}{input}</span> : input;
  if (!hint && !error) return control;
  return <span className="tds-field">{control}{error ? <span className="tds-field__err">{error}</span> : <span className="tds-field__hint">{hint}</span>}</span>;
}
