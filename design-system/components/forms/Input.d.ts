import * as React from "react";
/** Single-line text field with optional leading icon, hint and error text. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** @default "md" */
  size?: "sm" | "md";
  /** Red border + aria-invalid. @default false */
  invalid?: boolean;
  /** Leading icon, absolutely positioned inside the field. */
  icon?: React.ReactNode;
  /** Helper text below the field. */
  hint?: string;
  /** Error message; implies invalid and replaces hint. */
  error?: string;
}
export declare function Input(props: InputProps): JSX.Element;
