import * as React from "react";
/**
 * Controlled tab strip: underline (in-page sections) or pill (compact filters).
 */
export interface TabItem { value: string; label: React.ReactNode; count?: number }
export interface TabsProps {
  items: (string | TabItem)[];
  value?: string;
  onChange?: (value: string) => void;
  /** @default "underline" */
  variant?: "underline" | "pill";
  className?: string;
}
export declare function Tabs(props: TabsProps): JSX.Element;
