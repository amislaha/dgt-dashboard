import * as React from "react";
/** Mutually exclusive choice, 2-4 options, with optional per-option description. */
export interface RadioOption { value: string; label: string; description?: string; disabled?: boolean }
export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: (string | RadioOption)[];
  /** @default "vertical" */
  orientation?: "vertical" | "horizontal";
  className?: string;
}
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
