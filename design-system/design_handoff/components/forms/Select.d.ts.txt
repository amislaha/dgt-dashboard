import * as React from "react";
/** Native select styled to match Input; chevron affordance on the right. */
export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Strings or {value,label} objects. */
  options?: (string | SelectOption)[];
  /** Empty-value first option. */
  placeholder?: string;
  /** @default "md" */
  size?: "sm" | "md";
}
export declare function Select(props: SelectProps): JSX.Element;
