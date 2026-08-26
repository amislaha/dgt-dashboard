import React from "react";
const CSS = `
.tds-textarea{display:block;width:100%;min-height:5rem;padding:var(--space-2) var(--space-3);background:var(--background);color:var(--foreground);border:var(--border-width) solid var(--input);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-base);line-height:var(--leading-normal);box-shadow:var(--shadow-2xs);resize:vertical;transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard)}
.tds-textarea::placeholder{color:var(--muted-foreground)}
.tds-textarea:hover{border-color:var(--abu-300)}
.tds-textarea:focus{outline:none;border-color:var(--ring);box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-textarea:disabled{background:var(--muted);color:var(--muted-foreground);cursor:not-allowed}
.tds-textarea--invalid{border-color:var(--destructive)}
.tds-textarea__count{display:block;margin-top:var(--space-1-5);font:var(--type-caption);color:var(--muted-foreground);text-align:right}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-textarea-css")) {
  const s = document.createElement("style"); s.id = "tds-textarea-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Textarea({ invalid = false, maxLength, showCount = false, value, className = "", ...rest }) {
  const ta = <textarea className={["tds-textarea", invalid ? "tds-textarea--invalid" : "", className].filter(Boolean).join(" ")} maxLength={maxLength} value={value} aria-invalid={invalid || undefined} {...rest} />;
  if (!showCount) return ta;
  return <span style={{ display: "block" }}>{ta}<span className="tds-textarea__count">{(value || "").length}{maxLength ? ` / ${maxLength}` : ""}</span></span>;
}
