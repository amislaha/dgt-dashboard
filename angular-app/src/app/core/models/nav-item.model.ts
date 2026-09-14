export interface NavItem {
  id: string;
  label: string;
  sub?: string;
  /** SVG path data, 24x24 viewBox, rendered with currentColor — see design-system icon convention. */
  icon?: string;
}
