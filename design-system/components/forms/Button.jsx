import React from "react";
const CSS = `
.tds-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;white-space:nowrap;border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-sm);font-weight:var(--weight-medium);letter-spacing:var(--tracking-tight);border:var(--border-width) solid transparent;cursor:pointer;transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard),transform var(--duration-instant) var(--ease-standard);text-decoration:none}
.tds-btn:disabled{opacity:.5;pointer-events:none}
.tds-btn:active{transform:scale(var(--press-scale))}
.tds-btn svg{width:1rem;height:1rem;flex:none}
.tds-btn--sm{height:var(--control-h-sm);padding:0 var(--control-px-sm);font-size:var(--text-xs)}
.tds-btn--md{height:var(--control-h);padding:0 var(--control-px)}
.tds-btn--lg{height:var(--control-h-lg);padding:0 var(--control-px-lg);font-size:var(--text-base)}
.tds-btn--icon{height:var(--control-h);width:var(--control-h);padding:0}
.tds-btn--default{background:var(--primary);color:var(--primary-foreground);box-shadow:var(--shadow-xs)}
.tds-btn--default:hover{background:var(--biru-700)}
.tds-btn--secondary{background:var(--secondary);color:var(--secondary-foreground)}
.tds-btn--secondary:hover{background:var(--abu-200)}
.tds-btn--outline{background:var(--background);color:var(--foreground);border-color:var(--border);box-shadow:var(--shadow-2xs)}
.tds-btn--outline:hover{background:var(--accent);color:var(--accent-foreground);border-color:var(--biru-200)}
.tds-btn--ghost{background:transparent;color:var(--foreground)}
.tds-btn--ghost:hover{background:var(--secondary)}
.tds-btn--destructive{background:var(--destructive);color:var(--destructive-foreground);box-shadow:var(--shadow-xs)}
.tds-btn--destructive:hover{background:var(--merah-600)}
.tds-btn--link{background:transparent;color:var(--primary);height:auto;padding:0;text-underline-offset:4px}
.tds-btn--link:hover{text-decoration:underline}
.tds-btn--full{width:100%}
.tds-btn__spin{width:.875rem;height:.875rem;border-radius:var(--radius-full);border:2px solid currentColor;border-top-color:transparent;animation:tds-btn-spin .6s linear infinite}
@keyframes tds-btn-spin{to{transform:rotate(360deg)}}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-button-css")) {
  const s = document.createElement("style"); s.id = "tds-button-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Button({ variant = "default", size = "md", block = false, loading = false, iconLeft, iconRight, as, children, className = "", ...rest }) {
  const Tag = as || (rest.href ? "a" : "button");
  const cls = ["tds-btn", `tds-btn--${variant}`, variant === "link" ? "" : `tds-btn--${size}`, block ? "tds-btn--full" : "", className].filter(Boolean).join(" ");
  return (
    <Tag className={cls} {...rest}>
      {loading ? <span className="tds-btn__spin" aria-hidden="true" /> : iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}
