import React from "react";
const CSS = `
.tds-dlg__ov{position:fixed;inset:0;background:var(--overlay);backdrop-filter:blur(2px);display:grid;place-items:center;padding:var(--space-4);z-index:60;animation:tds-dlg-fade var(--duration-normal) var(--ease-standard)}
.tds-dlg{width:100%;max-width:32rem;background:var(--popover);color:var(--popover-foreground);border:var(--border-width) solid var(--border);border-radius:var(--radius-2xl);box-shadow:var(--shadow-xl);animation:tds-dlg-in var(--duration-normal) var(--ease-out)}
.tds-dlg--sm{max-width:24rem}
.tds-dlg--lg{max-width:44rem}
.tds-dlg__hd{display:flex;align-items:flex-start;gap:var(--space-4);padding:var(--space-5) var(--space-5) 0}
.tds-dlg__t{font:var(--type-h3);font-size:var(--text-lg);letter-spacing:var(--tracking-tight)}
.tds-dlg__d{margin-top:var(--space-1);font-size:var(--text-sm);line-height:var(--leading-normal);color:var(--muted-foreground)}
.tds-dlg__x{margin-left:auto;flex:none;width:1rem;height:1rem;border:0;padding:0;cursor:pointer;color:var(--muted-foreground);background-color:currentColor;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.tds-dlg__body{padding:var(--space-4) var(--space-5);font-size:var(--text-base);line-height:var(--leading-normal)}
.tds-dlg__ft{display:flex;justify-content:flex-end;gap:var(--space-2);padding:var(--space-4) var(--space-5);border-top:var(--border-width) solid var(--border)}
@keyframes tds-dlg-fade{from{opacity:0}to{opacity:1}}
@keyframes tds-dlg-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-dialog-css")) {
  const s = document.createElement("style"); s.id = "tds-dialog-css"; s.textContent = CSS; document.head.appendChild(s);
}
const X = 'url("https://unpkg.com/lucide-static@0.436.0/icons/x.svg")';
export function Dialog({ open = false, title, description, size = "md", footer, onClose, children, className = "" }) {
  if (!open) return null;
  return (
    <div className="tds-dlg__ov" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : undefined} className={["tds-dlg", size !== "md" ? `tds-dlg--${size}` : "", className].filter(Boolean).join(" ")} onClick={(e) => e.stopPropagation()}>
        {(title || onClose) && (
          <div className="tds-dlg__hd">
            <div>{title && <div className="tds-dlg__t">{title}</div>}{description && <div className="tds-dlg__d">{description}</div>}</div>
            {onClose && <button type="button" aria-label="Tutup" className="tds-dlg__x" onClick={onClose} style={{ WebkitMaskImage: X, maskImage: X }} />}
          </div>
        )}
        {children && <div className="tds-dlg__body">{children}</div>}
        {footer && <div className="tds-dlg__ft">{footer}</div>}
      </div>
    </div>
  );
}
