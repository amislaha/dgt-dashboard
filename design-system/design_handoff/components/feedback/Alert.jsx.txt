import React from "react";
const CSS = `
.tds-alert{display:flex;gap:var(--space-3);padding:var(--space-4);border:var(--border-width) solid var(--border);border-left-width:var(--border-width);border-radius:var(--radius-lg);background:var(--card);font-family:var(--font-sans)}
.tds-alert__icon{flex:none;width:1.125rem;height:1.125rem;background-color:currentColor;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;margin-top:.05rem}
.tds-alert__body{display:flex;flex-direction:column;gap:var(--space-1)}
.tds-alert__t{font-size:var(--text-base);font-weight:var(--weight-semibold);letter-spacing:var(--tracking-tight)}
.tds-alert__d{font-size:var(--text-sm);line-height:var(--leading-normal);color:var(--muted-foreground)}
.tds-alert__x{margin-left:auto;background:none;border:0;padding:0;cursor:pointer;color:var(--muted-foreground);width:1rem;height:1rem;flex:none;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;background-color:currentColor}
.tds-alert--info{background:var(--teal-50);border-color:var(--teal-100);color:var(--teal-500)}
.tds-alert--success{background:var(--hijau-50);border-color:var(--hijau-100);color:var(--hijau-600)}
.tds-alert--warning{background:var(--emas-50);border-color:var(--emas-100);color:var(--emas-600)}
.tds-alert--danger{background:var(--merah-50);border-color:var(--merah-100);color:var(--merah-600)}
.tds-alert--neutral{background:var(--abu-50);border-color:var(--border);color:var(--abu-700)}
.tds-alert .tds-alert__t{color:var(--foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-alert-css")) {
  const s = document.createElement("style"); s.id = "tds-alert-css"; s.textContent = CSS; document.head.appendChild(s);
}
const ICONS = { info: "info", success: "circle-check", warning: "triangle-alert", danger: "circle-alert", neutral: "info" };
const BASE = "https://unpkg.com/lucide-static@0.436.0/icons/";
export function Alert({ tone = "info", title, children, action, onDismiss, className = "", ...rest }) {
  const url = `url("${BASE}${ICONS[tone] || "info"}.svg")`;
  return (
    <div role="status" className={["tds-alert", `tds-alert--${tone}`, className].filter(Boolean).join(" ")} {...rest}>
      <span className="tds-alert__icon" aria-hidden="true" style={{ WebkitMaskImage: url, maskImage: url }} />
      <div className="tds-alert__body">
        {title && <div className="tds-alert__t">{title}</div>}
        {children && <div className="tds-alert__d">{children}</div>}
        {action && <div style={{ marginTop: "var(--space-2)" }}>{action}</div>}
      </div>
      {onDismiss && <button type="button" aria-label="Tutup" onClick={onDismiss} className="tds-alert__x" style={{ WebkitMaskImage: `url("${BASE}x.svg")`, maskImage: `url("${BASE}x.svg")` }} />}
    </div>
  );
}
