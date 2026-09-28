export interface NavItem {
  id: string;
  label: string;
  sub?: string;
  /** SVG path data, 24x24 viewBox, rendered with currentColor — see design-system icon convention. */
  icon?: string;
  /** true removes this item from the rendered rail without deleting it from the source list —
   *  the route/component stays fully reachable, just not linked to from the nav. */
  hidden?: boolean;
  /** Set on the first item of a new rail section: renders a divider + this label above the item,
   *  so one flat `items` array can still read as separate groups (e.g. data-manager's CRUD entities
   *  vs. its Persetujuan & Pengajuan section). Omit to keep flowing in the current group. */
  sectionLabel?: string;
}
