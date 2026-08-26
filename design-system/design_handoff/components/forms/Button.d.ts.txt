import * as React from "react";
/**
 * Primary action control. shadcn button geometry (h-36px, 16px inline padding, 8px radius).
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual treatment. @default "default" */
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  /** @default "md" */
  size?: "sm" | "md" | "lg" | "icon";
  /** Stretch to container width. @default false */
  block?: boolean;
  /** Replaces the leading icon with a spinner. @default false */
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Render as another element/tag (e.g. "a"). */
  as?: keyof JSX.IntrinsicElements;
  href?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
