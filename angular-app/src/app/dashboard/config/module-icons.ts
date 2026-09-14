/**
 * Ports dashboard/index.html's `ICON_PATHS`/`railIcon()` (dashboard/index.html:1179-1192) — one
 * hand-drawn 24x24 line icon per module, rendered with `currentColor` so it picks up the active/
 * inactive rail-item colour from CSS. Mirrors the same convention data-manager already ported as
 * `ENTITY_ICON_PATHS`/`entityIconSvg()` (see data-manager/config/entity-configs.ts) — this was the
 * one piece of it not yet carried over to the dashboard's own rail.
 */
export const MODULE_ICON_PATHS: { [id: string]: string } = {
  profil: '<path d="M12 2 L21 7 L12 12 L3 7 Z"/><path d="M3 12 L12 17 L21 12"/><path d="M3 17 L12 22 L21 17"/>',
  geospasial: '<path d="M12 21s7-7.58 7-12a7 7 0 1 0-14 0c0 4.42 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/>',
  demografi:
    '<circle cx="8.5" cy="8" r="3"/><path d="M2.5 20c0-3.5 2.7-6 6-6s6 2.5 6 6"/><circle cx="17" cy="9.3" r="2.3"/><path d="M15 14.2c2.6.3 4.5 2.5 4.5 5.3"/>',
  infrastruktur:
    '<rect x="4" y="8" width="7" height="13"/><rect x="13" y="3" width="7" height="18"/><path d="M6.5 11h2M6.5 14h2M6.5 17h2M15.5 6h2M15.5 9h2M15.5 12h2M15.5 15h2"/>',
  monitoring: '<path d="M3 20h18"/><path d="M4 16l5-6 4 3 6-8"/><path d="M15 5h5v5"/>',
  ekonomi:
    '<ellipse cx="12" cy="6" rx="7" ry="2.4"/><path d="M5 6v5c0 1.3 3.1 2.4 7 2.4s7-1.1 7-2.4V6"/><path d="M5 11v5c0 1.3 3.1 2.4 7 2.4s7-1.1 7-2.4v-5"/>',
  analitik:
    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  intelijen:
    '<rect x="6" y="6" width="12" height="12" rx="2.2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/><circle cx="9.5" cy="10.2" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="10.2" r="1" fill="currentColor" stroke="none"/><path d="M9 14.3c1 .8 3 .8 4 0"/>'
};

export function moduleIconSvg(id: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${MODULE_ICON_PATHS[id] || ''}</svg>`;
}
