import * as React from "react";
/** Checkbox with optional label and description line. */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
  /** @default false */
  disabled?: boolean;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
