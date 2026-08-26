import React from "react";
/* Lucide icons, loaded from the lucide-static CDN and tinted with currentColor
   via CSS mask — no hand-drawn SVG paths anywhere in this design system. */
const CSS = `
.tds-icon{display:inline-block;flex:none;width:1rem;height:1rem;background-color:currentColor;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}
.tds-icon--sm{width:.875rem;height:.875rem}
.tds-icon--lg{width:1.25rem;height:1.25rem}
.tds-icon--xl{width:1.5rem;height:1.5rem}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-icon-css")) {
  const s = document.createElement("style"); s.id = "tds-icon-css"; s.textContent = CSS; document.head.appendChild(s);
}
export const ICON_BASE = "https://unpkg.com/lucide-static@0.436.0/icons/";
export function Icon({ name, size = "md", className = "", style, ...rest }) {
  const url = `url("${ICON_BASE}${name}.svg")`;
  return <span aria-hidden="true" className={["tds-icon", size !== "md" ? `tds-icon--${size}` : "", className].filter(Boolean).join(" ")} style={{ WebkitMaskImage: url, maskImage: url, ...style }} {...rest} />;
}
