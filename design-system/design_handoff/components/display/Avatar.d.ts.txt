import * as React from "react";
/** User or unit avatar; falls back to two-letter initials on Hijau-100. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string;
  src?: string;
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "xl";
  /** @default "circle" */
  shape?: "circle" | "square";
  /** Hijau focus ring. @default false */
  ring?: boolean;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
