export interface NavItem {
  id: string;
  label: string;
  sub?: string;
  /** SVG path data, 24x24 viewBox, rendered with currentColor — see design-system icon convention. */
  icon?: string;
  /** true removes this item from the rendered rail without deleting it from the source list —
   *  the route/component stays fully reachable, just not linked to from the nav. */
  hidden?: boolean;
}
