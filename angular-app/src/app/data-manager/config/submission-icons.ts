/** Hand-drawn 24x24 line icons for the rail's "Persetujuan & Pengajuan" section, same convention as
 *  `ENTITY_ICON_PATHS`/`entityIconSvg` in entity-configs.ts — kept in their own file since these two
 *  aren't keyed by `EntityKey`. */
const SUBMISSION_ICON_PATH = '<path d="M12 5v14"/><path d="M5 12h14"/>';
const APPROVAL_ICON_PATH = '<path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/>';

function wrap(pathData: string): string {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + pathData + '</svg>';
}

export const SUBMISSION_ICON_SVG = wrap(SUBMISSION_ICON_PATH);
export const APPROVAL_ICON_SVG = wrap(APPROVAL_ICON_PATH);
