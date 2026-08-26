import * as React from "react";
/** Compact status label. Tone carries meaning — pick by status, not by colour preference. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default "neutral" */
  tone?: "neutral" | "primary" | "solid" | "success" | "warning" | "danger" | "info" | "outline";
  /** @default "pill" */
  shape?: "pill" | "square";
  /** Leading status dot. @default false */
  dot?: boolean;
}
export declare function Badge(props: BadgeProps): JSX.Element;
