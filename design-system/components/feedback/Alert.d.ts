import * as React from "react";
/**
 * Inline message banner with tone icon.
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** @default "info" */
  tone?: "info" | "success" | "warning" | "danger" | "neutral";
  title?: React.ReactNode;
  /** Optional action row (usually a small outline Button). */
  action?: React.ReactNode;
  /** Renders a close button. */
  onDismiss?: () => void;
}
export declare function Alert(props: AlertProps): JSX.Element;
