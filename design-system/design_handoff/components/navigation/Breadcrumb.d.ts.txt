import * as React from "react";
/** Ancestor trail. The last item renders as current page, unlinked. */
export interface CrumbItem { label: React.ReactNode; href?: string }
export interface BreadcrumbProps { items: CrumbItem[]; className?: string }
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
