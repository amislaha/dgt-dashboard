import * as React from "react";
/** Multi-line text field, vertically resizable, with optional character counter. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** @default false */
  invalid?: boolean;
  /** Shows "n / max" counter below the field. @default false */
  showCount?: boolean;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
