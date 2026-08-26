import React from "react";
const CSS = `
.tds-avatar{display:inline-grid;place-items:center;overflow:hidden;flex:none;background:var(--biru-100);color:var(--biru-700);border-radius:var(--radius-full);font-family:var(--font-sans);font-weight:var(--weight-semibold);letter-spacing:var(--tracking-tight);user-select:none}
.tds-avatar--square{border-radius:var(--radius-md)}
.tds-avatar--sm{width:1.75rem;height:1.75rem;font-size:var(--text-2xs)}
.tds-avatar--md{width:2.25rem;height:2.25rem;font-size:var(--text-xs)}
.tds-avatar--lg{width:2.75rem;height:2.75rem;font-size:var(--text-sm)}
.tds-avatar--xl{width:4rem;height:4rem;font-size:var(--text-lg)}
.tds-avatar img{width:100%;height:100%;object-fit:cover}
.tds-avatar--ring{box-shadow:0 0 0 2px var(--background),0 0 0 3px var(--biru-200)}
.tds-avatars{display:flex}
.tds-avatars > *{margin-left:-.5rem;box-shadow:0 0 0 2px var(--background)}
.tds-avatars > *:first-child{margin-left:0}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-avatar-css")) {
  const s = document.createElement("style"); s.id = "tds-avatar-css"; s.textContent = CSS; document.head.appendChild(s);
}
function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
export function Avatar({ name = "", src, size = "md", shape = "circle", ring = false, className = "", ...rest }) {
  return (
    <span className={["tds-avatar", `tds-avatar--${size}`, shape === "square" ? "tds-avatar--square" : "", ring ? "tds-avatar--ring" : "", className].filter(Boolean).join(" ")} title={name || undefined} {...rest}>
      {src ? <img src={src} alt={name} /> : initials(name)}
    </span>
  );
}
