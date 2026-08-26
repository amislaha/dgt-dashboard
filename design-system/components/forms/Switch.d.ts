import * as React from "react";
/** Instant-effect toggle (settings, filters). Never use inside a form that needs Submit. */
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  /** @default false */
  disabled?: boolean;
}
export declare function Switch(props: SwitchProps): JSX.Element;
