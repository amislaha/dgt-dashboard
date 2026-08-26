import * as React from "react";
/** Hairline rule; with `label` it becomes an uppercase section divider. */
export interface SeparatorProps {
  /** @default "horizontal" */
  orientation?: "horizontal" | "vertical";
  /** Removes the default margin. @default false */
  flush?: boolean;
  /** Centred uppercase caption between two rules. */
  label?: React.ReactNode;
  className?: string;
}
export declare function Separator(props: SeparatorProps): JSX.Element;
