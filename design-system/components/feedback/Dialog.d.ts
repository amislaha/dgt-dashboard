import * as React from "react";
/** Modal dialog with overlay, header, body and right-aligned footer actions. */
export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** @default "md" */
  size?: "sm" | "md" | "lg";
  /** Footer action row, usually two Buttons. */
  footer?: React.ReactNode;
  /** Called by the close button and overlay click. */
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
