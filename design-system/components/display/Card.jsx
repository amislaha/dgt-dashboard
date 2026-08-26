import React from "react";
const CSS = `
.tds-card{display:flex;flex-direction:column;background:var(--card);color:var(--card-foreground);border:var(--border-width) solid var(--border);border-radius:var(--radius-xl);box-shadow:var(--shadow-xs)}
.tds-card--flat{box-shadow:var(--shadow-none)}
.tds-card--raised{box-shadow:var(--shadow-md);border-color:transparent}
.tds-card--interactive{cursor:pointer;transition:box-shadow var(--duration-normal) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard),transform var(--duration-normal) var(--ease-out)}
.tds-card--interactive:hover{box-shadow:var(--shadow-md);border-color:var(--biru-200);transform:translateY(-1px)}
.tds-card__hd{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4);padding:var(--space-5) var(--space-5) 0}
.tds-card__t{font:var(--type-h3);letter-spacing:var(--tracking-tight)}
.tds-card__d{margin-top:var(--space-1);font:var(--type-caption);font-size:var(--text-sm);color:var(--muted-foreground)}
.tds-card__body{padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-3)}
.tds-card__ft{display:flex;align-items:center;gap:var(--space-2);padding:0 var(--space-5) var(--space-5)}
.tds-card__ft--bordered{padding-top:var(--space-4);margin-top:auto;border-top:var(--border-width) solid var(--border)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-card-css")) {
  const s = document.createElement("style"); s.id = "tds-card-css"; s.textContent = CSS; document.head.appendChild(s);
}
export function Card({ variant = "default", interactive = false, title, description, action, footer, footerBordered = false, children, className = "", ...rest }) {
  return (
    <div className={["tds-card", `tds-card--${variant}`, interactive ? "tds-card--interactive" : "", className].filter(Boolean).join(" ")} {...rest}>
      {(title || action) && (
        <div className="tds-card__hd">
          <div>{title && <div className="tds-card__t">{title}</div>}{description && <div className="tds-card__d">{description}</div>}</div>
          {action}
        </div>
      )}
      {children && <div className="tds-card__body">{children}</div>}
      {footer && <div className={["tds-card__ft", footerBordered ? "tds-card__ft--bordered" : ""].filter(Boolean).join(" ")}>{footer}</div>}
    </div>
  );
}
