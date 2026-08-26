import * as React from "react";
/** Determinate progress bar with optional label row. */
export interface ProgressProps {
  value?: number;
  /** @default 100 */
  max?: number;
  label?: React.ReactNode;
  /** Overrides the "NN%" readout (e.g. "812 / 1.200 KK"). */
  valueLabel?: React.ReactNode;
  /** @default "primary" */
  tone?: "primary" | "warning" | "danger" | "info";
  /** @default "md" */
  size?: "sm" | "md";
  className?: string;
}
export declare function Progress(props: ProgressProps): JSX.Element;
