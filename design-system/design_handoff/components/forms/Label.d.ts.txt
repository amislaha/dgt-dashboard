import * as React from "react";
/** Form field label with optional required marker. */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Shows a red asterisk. @default false */
  required?: boolean;
  /** Muted colour for disabled fields. @default false */
  disabled?: boolean;
}
export declare function Label(props: LabelProps): JSX.Element;
