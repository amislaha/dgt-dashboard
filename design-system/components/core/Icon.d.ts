import * as React from "react";
/** Lucide glyph rendered as a CSS mask so it inherits currentColor. Icon set: lucide-static 0.436.0 via unpkg. */
export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Lucide icon name, kebab-case (e.g. "map-pin", "file-check-2"). */
  name: string;
  /** 14 / 16 / 20 / 24 px. @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
}
export declare function Icon(props: IconProps): JSX.Element;
export declare const ICON_BASE: string;
