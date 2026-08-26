/* @ds-bundle: {"format":4,"namespace":"TransmigrasiDigitalDesignSystem_7b839d","components":[{"name":"ICON_BASE","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Progress","sourcePath":"components/display/Progress.jsx"},{"name":"Separator","sourcePath":"components/display/Separator.jsx"},{"name":"Table","sourcePath":"components/display/Table.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Label","sourcePath":"components/forms/Label.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"Pagination","sourcePath":"components/navigation/Pagination.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/core/Icon.jsx":"7754647c9fb7","components/display/Avatar.jsx":"8499173e43d4","components/display/Badge.jsx":"ede753bc8a22","components/display/Card.jsx":"18518aeca5e0","components/display/Progress.jsx":"87c7aeb0b8f0","components/display/Separator.jsx":"13261eb27f67","components/display/Table.jsx":"59c9519760cc","components/feedback/Alert.jsx":"2e1b9b7230d3","components/feedback/Dialog.jsx":"da49d4f3af9e","components/forms/Button.jsx":"f0e1137feb14","components/forms/Checkbox.jsx":"bbf7716d960e","components/forms/Input.jsx":"2dc216cc6bb6","components/forms/Label.jsx":"6c610758527c","components/forms/RadioGroup.jsx":"1e0e4b766065","components/forms/Select.jsx":"50b49e8297c1","components/forms/Switch.jsx":"329afc99fe78","components/forms/Textarea.jsx":"c44edca29e92","components/navigation/Breadcrumb.jsx":"06cbfd3734c2","components/navigation/Pagination.jsx":"caa54f807be8","components/navigation/Tabs.jsx":"1f3d6176b61d","design_handoff/ui_kits/kawasan-crud/app.jsx":"12afc48f7fcd","design_handoff/ui_kits/kawasan-crud/data.js":"b17f840c01c9","design_handoff/ui_kits/portal/screen-beranda.jsx":"18d443018dc3","design_handoff/ui_kits/portal/screen-layanan.jsx":"6c87ba274bdb","design_handoff/ui_kits/portal/site-chrome.jsx":"68a8942f8956","design_handoff/ui_kits/simtrans/app-shell.jsx":"ae0b0d5790e6","design_handoff/ui_kits/simtrans/screen-dashboard.jsx":"dfda25f41849","design_handoff/ui_kits/simtrans/screen-detail.jsx":"a4b3750e3536","design_handoff/ui_kits/simtrans/screen-login.jsx":"fb1d01060c20","design_handoff/ui_kits/simtrans/screen-registri.jsx":"25aa2e0fdf21","ui_kits/kawasan-crud/app.jsx":"12afc48f7fcd","ui_kits/kawasan-crud/data.js":"b17f840c01c9","ui_kits/portal/screen-beranda.jsx":"18d443018dc3","ui_kits/portal/screen-layanan.jsx":"6c87ba274bdb","ui_kits/portal/site-chrome.jsx":"68a8942f8956","ui_kits/simtrans/app-shell.jsx":"ae0b0d5790e6","ui_kits/simtrans/screen-dashboard.jsx":"dfda25f41849","ui_kits/simtrans/screen-detail.jsx":"a4b3750e3536","ui_kits/simtrans/screen-login.jsx":"fb1d01060c20","ui_kits/simtrans/screen-registri.jsx":"25aa2e0fdf21"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TransmigrasiDigitalDesignSystem_7b839d = window.TransmigrasiDigitalDesignSystem_7b839d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide icons, loaded from the lucide-static CDN and tinted with currentColor
   via CSS mask — no hand-drawn SVG paths anywhere in this design system. */
const CSS = `
.tds-icon{display:inline-block;flex:none;width:1rem;height:1rem;background-color:currentColor;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:center;mask-position:center;-webkit-mask-size:contain;mask-size:contain}
.tds-icon--sm{width:.875rem;height:.875rem}
.tds-icon--lg{width:1.25rem;height:1.25rem}
.tds-icon--xl{width:1.5rem;height:1.5rem}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-icon-css")) {
  const s = document.createElement("style");
  s.id = "tds-icon-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
const ICON_BASE = "https://unpkg.com/lucide-static@0.436.0/icons/";
function Icon({
  name,
  size = "md",
  className = "",
  style,
  ...rest
}) {
  const url = `url("${ICON_BASE}${name}.svg")`;
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true",
    className: ["tds-icon", size !== "md" ? `tds-icon--${size}` : "", className].filter(Boolean).join(" "),
    style: {
      WebkitMaskImage: url,
      maskImage: url,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { ICON_BASE, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-avatar{display:inline-grid;place-items:center;overflow:hidden;flex:none;background:var(--biru-100);color:var(--biru-700);border-radius:var(--radius-full);font-family:var(--font-sans);font-weight:var(--weight-semibold);letter-spacing:var(--tracking-tight);user-select:none}
.tds-avatar--square{border-radius:var(--radius-md)}
.tds-avatar--sm{width:1.75rem;height:1.75rem;font-size:var(--text-2xs)}
.tds-avatar--md{width:2.25rem;height:2.25rem;font-size:var(--text-xs)}
.tds-avatar--lg{width:2.75rem;height:2.75rem;font-size:var(--text-sm)}
.tds-avatar--xl{width:4rem;height:4rem;font-size:var(--text-lg)}
.tds-avatar img{width:100%;height:100%;object-fit:cover}
.tds-avatar--ring{box-shadow:0 0 0 2px var(--background),0 0 0 3px var(--biru-200)}
.tds-avatars{display:flex}
.tds-avatars > *{margin-left:-.5rem;box-shadow:0 0 0 2px var(--background)}
.tds-avatars > *:first-child{margin-left:0}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-avatar-css")) {
  const s = document.createElement("style");
  s.id = "tds-avatar-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}
function Avatar({
  name = "",
  src,
  size = "md",
  shape = "circle",
  ring = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["tds-avatar", `tds-avatar--${size}`, shape === "square" ? "tds-avatar--square" : "", ring ? "tds-avatar--ring" : "", className].filter(Boolean).join(" "),
    title: name || undefined
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-badge{display:inline-flex;align-items:center;gap:var(--space-1-5);padding:.125rem var(--space-2);border-radius:var(--radius-full);border:var(--border-width) solid transparent;font-family:var(--font-sans);font-size:var(--text-xs);font-weight:var(--weight-semibold);line-height:1.35;white-space:nowrap}
.tds-badge--square{border-radius:var(--radius-sm)}
.tds-badge__dot{width:.375rem;height:.375rem;border-radius:var(--radius-full);background:currentColor}
.tds-badge--neutral{background:var(--abu-100);color:var(--abu-700);border-color:var(--abu-200)}
.tds-badge--primary{background:var(--biru-50);color:var(--biru-700);border-color:var(--biru-100)}
.tds-badge--solid{background:var(--primary);color:var(--primary-foreground)}
.tds-badge--success{background:var(--hijau-50);color:var(--hijau-600);border-color:var(--hijau-100)}
.tds-badge--warning{background:var(--emas-50);color:var(--emas-600);border-color:var(--emas-100)}
.tds-badge--danger{background:var(--merah-50);color:var(--merah-600);border-color:var(--merah-100)}
.tds-badge--info{background:var(--teal-50);color:var(--teal-500);border-color:var(--teal-100)}
.tds-badge--outline{background:transparent;color:var(--muted-foreground);border-color:var(--border)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-badge-css")) {
  const s = document.createElement("style");
  s.id = "tds-badge-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Badge({
  tone = "neutral",
  shape = "pill",
  dot = false,
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["tds-badge", `tds-badge--${tone}`, shape === "square" ? "tds-badge--square" : "", className].filter(Boolean).join(" ")
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "tds-badge__dot",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-card{display:flex;flex-direction:column;background:var(--card);color:var(--card-foreground);border:var(--border-width) solid var(--border);border-radius:var(--radius-xl);box-shadow:var(--shadow-xs)}
.tds-card--flat{box-shadow:var(--shadow-none)}
.tds-card--raised{box-shadow:var(--shadow-md);border-color:transparent}
.tds-card--interactive{cursor:pointer;transition:box-shadow var(--duration-normal) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard),transform var(--duration-normal) var(--ease-out)}
.tds-card--interactive:hover{box-shadow:var(--shadow-md);border-color:var(--biru-200);transform:translateY(-1px)}
.tds-card__hd{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4);padding:var(--space-5) var(--space-5) 0}
.tds-card__t{font:var(--type-h3);letter-spacing:var(--tracking-tight)}
.tds-card__d{margin-top:var(--space-1);font:var(--type-caption);font-size:var(--text-sm);color:var(--muted-foreground)}
.tds-card__body{padding:var(--space-5);display:flex;flex-direction:column;gap:var(--space-3)}
.tds-card__ft{display:flex;align-items:center;gap:var(--space-2);padding:0 var(--space-5) var(--space-5)}
.tds-card__ft--bordered{padding-top:var(--space-4);margin-top:auto;border-top:var(--border-width) solid var(--border)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-card-css")) {
  const s = document.createElement("style");
  s.id = "tds-card-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Card({
  variant = "default",
  interactive = false,
  title,
  description,
  action,
  footer,
  footerBordered = false,
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: ["tds-card", `tds-card--${variant}`, interactive ? "tds-card--interactive" : "", className].filter(Boolean).join(" ")
  }, rest), (title || action) && /*#__PURE__*/React.createElement("div", {
    className: "tds-card__hd"
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    className: "tds-card__t"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "tds-card__d"
  }, description)), action), children && /*#__PURE__*/React.createElement("div", {
    className: "tds-card__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: ["tds-card__ft", footerBordered ? "tds-card__ft--bordered" : ""].filter(Boolean).join(" ")
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Progress.jsx
try { (() => {
const CSS = `
.tds-prog{display:flex;flex-direction:column;gap:var(--space-1-5)}
.tds-prog__head{display:flex;justify-content:space-between;align-items:baseline;font:var(--type-caption);color:var(--muted-foreground)}
.tds-prog__head strong{font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--foreground);font-variant-numeric:tabular-nums}
.tds-prog__track{height:.5rem;width:100%;background:var(--abu-200);border-radius:var(--radius-full);overflow:hidden}
.tds-prog--sm .tds-prog__track{height:.25rem}
.tds-prog__bar{height:100%;border-radius:var(--radius-full);background:var(--primary);transition:width var(--duration-slow) var(--ease-out)}
.tds-prog--warning .tds-prog__bar{background:var(--warning)}
.tds-prog--danger .tds-prog__bar{background:var(--destructive)}
.tds-prog--info .tds-prog__bar{background:var(--info)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-progress-css")) {
  const s = document.createElement("style");
  s.id = "tds-progress-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Progress({
  value = 0,
  max = 100,
  label,
  valueLabel,
  tone = "primary",
  size = "md",
  className = ""
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", {
    className: ["tds-prog", `tds-prog--${tone}`, size === "sm" ? "tds-prog--sm" : "", className].filter(Boolean).join(" ")
  }, (label || valueLabel) && /*#__PURE__*/React.createElement("div", {
    className: "tds-prog__head"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("strong", null, valueLabel ?? `${Math.round(pct)}%`)), /*#__PURE__*/React.createElement("div", {
    className: "tds-prog__track",
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemin": 0,
    "aria-valuemax": max
  }, /*#__PURE__*/React.createElement("div", {
    className: "tds-prog__bar",
    style: {
      width: `${pct}%`
    }
  })));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Progress.jsx", error: String((e && e.message) || e) }); }

// components/display/Separator.jsx
try { (() => {
const CSS = `
.tds-sep{border:0;background:var(--border);flex:none}
.tds-sep--h{width:100%;height:var(--border-width);margin:var(--space-4) 0}
.tds-sep--v{width:var(--border-width);align-self:stretch;margin:0 var(--space-4)}
.tds-sep--flush{margin:0}
.tds-seplabel{display:flex;align-items:center;gap:var(--space-3);margin:var(--space-4) 0;font:var(--type-eyebrow);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--muted-foreground)}
.tds-seplabel::before,.tds-seplabel::after{content:"";flex:1;height:var(--border-width);background:var(--border)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-separator-css")) {
  const s = document.createElement("style");
  s.id = "tds-separator-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Separator({
  orientation = "horizontal",
  flush = false,
  label,
  className = ""
}) {
  if (label) return /*#__PURE__*/React.createElement("div", {
    className: ["tds-seplabel", className].filter(Boolean).join(" ")
  }, label);
  return /*#__PURE__*/React.createElement("hr", {
    className: ["tds-sep", orientation === "vertical" ? "tds-sep--v" : "tds-sep--h", flush ? "tds-sep--flush" : "", className].filter(Boolean).join(" ")
  });
}
Object.assign(__ds_scope, { Separator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Separator.jsx", error: String((e && e.message) || e) }); }

// components/display/Table.jsx
try { (() => {
const CSS = `
.tds-tablewrap{width:100%;overflow:auto;border:var(--border-width) solid var(--border);border-radius:var(--radius-xl);background:var(--card)}
.tds-table{width:100%;border-collapse:collapse;font-family:var(--font-sans);font-size:var(--text-base)}
.tds-table thead th{position:sticky;top:0;background:var(--abu-50);text-align:left;padding:var(--space-2-5) var(--space-4);font-size:var(--text-xs);font-weight:var(--weight-semibold);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--muted-foreground);border-bottom:var(--border-width) solid var(--border);white-space:nowrap}
.tds-table tbody td{padding:var(--space-3) var(--space-4);border-bottom:var(--border-width) solid var(--border);vertical-align:middle;color:var(--foreground)}
.tds-table tbody tr:last-child td{border-bottom:0}
.tds-table--hover tbody tr{transition:background-color var(--duration-fast) var(--ease-standard)}
.tds-table--hover tbody tr:hover{background:var(--abu-50)}
.tds-table--zebra tbody tr:nth-child(even){background:var(--abu-50)}
.tds-table--compact thead th{padding:var(--space-2) var(--space-3)}
.tds-table--compact tbody td{padding:var(--space-2) var(--space-3);font-size:var(--text-sm)}
.tds-table td.tds-num,.tds-table th.tds-num{text-align:right;font-variant-numeric:tabular-nums}
.tds-table__empty{padding:var(--space-10);text-align:center;color:var(--muted-foreground);font:var(--type-body)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-table-css")) {
  const s = document.createElement("style");
  s.id = "tds-table-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Table({
  columns = [],
  rows = [],
  density = "default",
  zebra = false,
  hover = true,
  emptyLabel = "Belum ada data",
  onRowClick,
  className = ""
}) {
  const cls = ["tds-table", hover ? "tds-table--hover" : "", zebra ? "tds-table--zebra" : "", density === "compact" ? "tds-table--compact" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: "tds-tablewrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: cls
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map(c => /*#__PURE__*/React.createElement("th", {
    key: c.key,
    className: c.numeric ? "tds-num" : undefined,
    style: c.width ? {
      width: c.width
    } : undefined
  }, c.label)))), /*#__PURE__*/React.createElement("tbody", null, rows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: columns.length
  }, /*#__PURE__*/React.createElement("div", {
    className: "tds-table__empty"
  }, emptyLabel))), rows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id ?? i,
    onClick: onRowClick ? () => onRowClick(r) : undefined,
    style: onRowClick ? {
      cursor: "pointer"
    } : undefined
  }, columns.map(c => /*#__PURE__*/React.createElement("td", {
    key: c.key,
    className: c.numeric ? "tds-num" : undefined
  }, c.render ? c.render(r) : r[c.key])))))));
}
Object.assign(__ds_scope, { Table });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-alert{display:flex;gap:var(--space-3);padding:var(--space-4);border:var(--border-width) solid var(--border);border-left-width:var(--border-width);border-radius:var(--radius-lg);background:var(--card);font-family:var(--font-sans)}
.tds-alert__icon{flex:none;width:1.125rem;height:1.125rem;background-color:currentColor;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;margin-top:.05rem}
.tds-alert__body{display:flex;flex-direction:column;gap:var(--space-1)}
.tds-alert__t{font-size:var(--text-base);font-weight:var(--weight-semibold);letter-spacing:var(--tracking-tight)}
.tds-alert__d{font-size:var(--text-sm);line-height:var(--leading-normal);color:var(--muted-foreground)}
.tds-alert__x{margin-left:auto;background:none;border:0;padding:0;cursor:pointer;color:var(--muted-foreground);width:1rem;height:1rem;flex:none;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;background-color:currentColor}
.tds-alert--info{background:var(--teal-50);border-color:var(--teal-100);color:var(--teal-500)}
.tds-alert--success{background:var(--hijau-50);border-color:var(--hijau-100);color:var(--hijau-600)}
.tds-alert--warning{background:var(--emas-50);border-color:var(--emas-100);color:var(--emas-600)}
.tds-alert--danger{background:var(--merah-50);border-color:var(--merah-100);color:var(--merah-600)}
.tds-alert--neutral{background:var(--abu-50);border-color:var(--border);color:var(--abu-700)}
.tds-alert .tds-alert__t{color:var(--foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-alert-css")) {
  const s = document.createElement("style");
  s.id = "tds-alert-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
const ICONS = {
  info: "info",
  success: "circle-check",
  warning: "triangle-alert",
  danger: "circle-alert",
  neutral: "info"
};
const BASE = "https://unpkg.com/lucide-static@0.436.0/icons/";
function Alert({
  tone = "info",
  title,
  children,
  action,
  onDismiss,
  className = "",
  ...rest
}) {
  const url = `url("${BASE}${ICONS[tone] || "info"}.svg")`;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    className: ["tds-alert", `tds-alert--${tone}`, className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "tds-alert__icon",
    "aria-hidden": "true",
    style: {
      WebkitMaskImage: url,
      maskImage: url
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "tds-alert__body"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "tds-alert__t"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "tds-alert__d"
  }, children), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-2)"
    }
  }, action)), onDismiss && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Tutup",
    onClick: onDismiss,
    className: "tds-alert__x",
    style: {
      WebkitMaskImage: `url("${BASE}x.svg")`,
      maskImage: `url("${BASE}x.svg")`
    }
  }));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
const CSS = `
.tds-dlg__ov{position:fixed;inset:0;background:var(--overlay);backdrop-filter:blur(2px);display:grid;place-items:center;padding:var(--space-4);z-index:60;animation:tds-dlg-fade var(--duration-normal) var(--ease-standard)}
.tds-dlg{width:100%;max-width:32rem;background:var(--popover);color:var(--popover-foreground);border:var(--border-width) solid var(--border);border-radius:var(--radius-2xl);box-shadow:var(--shadow-xl);animation:tds-dlg-in var(--duration-normal) var(--ease-out)}
.tds-dlg--sm{max-width:24rem}
.tds-dlg--lg{max-width:44rem}
.tds-dlg__hd{display:flex;align-items:flex-start;gap:var(--space-4);padding:var(--space-5) var(--space-5) 0}
.tds-dlg__t{font:var(--type-h3);font-size:var(--text-lg);letter-spacing:var(--tracking-tight)}
.tds-dlg__d{margin-top:var(--space-1);font-size:var(--text-sm);line-height:var(--leading-normal);color:var(--muted-foreground)}
.tds-dlg__x{margin-left:auto;flex:none;width:1rem;height:1rem;border:0;padding:0;cursor:pointer;color:var(--muted-foreground);background-color:currentColor;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.tds-dlg__body{padding:var(--space-4) var(--space-5);font-size:var(--text-base);line-height:var(--leading-normal)}
.tds-dlg__ft{display:flex;justify-content:flex-end;gap:var(--space-2);padding:var(--space-4) var(--space-5);border-top:var(--border-width) solid var(--border)}
@keyframes tds-dlg-fade{from{opacity:0}to{opacity:1}}
@keyframes tds-dlg-in{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-dialog-css")) {
  const s = document.createElement("style");
  s.id = "tds-dialog-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
const X = 'url("https://unpkg.com/lucide-static@0.436.0/icons/x.svg")';
function Dialog({
  open = false,
  title,
  description,
  size = "md",
  footer,
  onClose,
  children,
  className = ""
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "tds-dlg__ov",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": typeof title === "string" ? title : undefined,
    className: ["tds-dlg", size !== "md" ? `tds-dlg--${size}` : "", className].filter(Boolean).join(" "),
    onClick: e => e.stopPropagation()
  }, (title || onClose) && /*#__PURE__*/React.createElement("div", {
    className: "tds-dlg__hd"
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    className: "tds-dlg__t"
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: "tds-dlg__d"
  }, description)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Tutup",
    className: "tds-dlg__x",
    onClick: onClose,
    style: {
      WebkitMaskImage: X,
      maskImage: X
    }
  })), children && /*#__PURE__*/React.createElement("div", {
    className: "tds-dlg__body"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "tds-dlg__ft"
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;white-space:nowrap;border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-sm);font-weight:var(--weight-medium);letter-spacing:var(--tracking-tight);border:var(--border-width) solid transparent;cursor:pointer;transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard),transform var(--duration-instant) var(--ease-standard);text-decoration:none}
.tds-btn:disabled{opacity:.5;pointer-events:none}
.tds-btn:active{transform:scale(var(--press-scale))}
.tds-btn svg{width:1rem;height:1rem;flex:none}
.tds-btn--sm{height:var(--control-h-sm);padding:0 var(--control-px-sm);font-size:var(--text-xs)}
.tds-btn--md{height:var(--control-h);padding:0 var(--control-px)}
.tds-btn--lg{height:var(--control-h-lg);padding:0 var(--control-px-lg);font-size:var(--text-base)}
.tds-btn--icon{height:var(--control-h);width:var(--control-h);padding:0}
.tds-btn--default{background:var(--primary);color:var(--primary-foreground);box-shadow:var(--shadow-xs)}
.tds-btn--default:hover{background:var(--biru-700)}
.tds-btn--secondary{background:var(--secondary);color:var(--secondary-foreground)}
.tds-btn--secondary:hover{background:var(--abu-200)}
.tds-btn--outline{background:var(--background);color:var(--foreground);border-color:var(--border);box-shadow:var(--shadow-2xs)}
.tds-btn--outline:hover{background:var(--accent);color:var(--accent-foreground);border-color:var(--biru-200)}
.tds-btn--ghost{background:transparent;color:var(--foreground)}
.tds-btn--ghost:hover{background:var(--secondary)}
.tds-btn--destructive{background:var(--destructive);color:var(--destructive-foreground);box-shadow:var(--shadow-xs)}
.tds-btn--destructive:hover{background:var(--merah-600)}
.tds-btn--link{background:transparent;color:var(--primary);height:auto;padding:0;text-underline-offset:4px}
.tds-btn--link:hover{text-decoration:underline}
.tds-btn--full{width:100%}
.tds-btn__spin{width:.875rem;height:.875rem;border-radius:var(--radius-full);border:2px solid currentColor;border-top-color:transparent;animation:tds-btn-spin .6s linear infinite}
@keyframes tds-btn-spin{to{transform:rotate(360deg)}}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-button-css")) {
  const s = document.createElement("style");
  s.id = "tds-button-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Button({
  variant = "default",
  size = "md",
  block = false,
  loading = false,
  iconLeft,
  iconRight,
  as,
  children,
  className = "",
  ...rest
}) {
  const Tag = as || (rest.href ? "a" : "button");
  const cls = ["tds-btn", `tds-btn--${variant}`, variant === "link" ? "" : `tds-btn--${size}`, block ? "tds-btn--full" : "", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, rest), loading ? /*#__PURE__*/React.createElement("span", {
    className: "tds-btn__spin",
    "aria-hidden": "true"
  }) : iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-check{display:inline-flex;align-items:flex-start;gap:var(--space-2-5);cursor:pointer;font:var(--type-body)}
.tds-check--disabled{opacity:.55;cursor:not-allowed}
.tds-check input{position:absolute;opacity:0;width:1rem;height:1rem;margin:0}
.tds-check__box{flex:none;display:grid;place-items:center;width:1rem;height:1rem;margin-top:.15rem;border:var(--border-width-strong) solid var(--abu-300);border-radius:var(--radius-sm);background:var(--background);box-shadow:var(--shadow-2xs);transition:var(--transition-colors)}
.tds-check:hover .tds-check__box{border-color:var(--biru-400)}
.tds-check input:checked + .tds-check__box{background:var(--primary);border-color:var(--primary)}
.tds-check input:focus-visible + .tds-check__box{box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-check__box svg{width:.75rem;height:.75rem;color:var(--primary-foreground);opacity:0;transition:opacity var(--duration-fast) var(--ease-standard)}
.tds-check input:checked + .tds-check__box svg{opacity:1}
.tds-check__txt{display:flex;flex-direction:column;gap:.125rem}
.tds-check__desc{font:var(--type-caption);color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-checkbox-css")) {
  const s = document.createElement("style");
  s.id = "tds-checkbox-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Checkbox({
  label,
  description,
  disabled = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["tds-check", disabled ? "tds-check--disabled" : "", className].filter(Boolean).join(" "),
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "tds-check__box",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), (label || description) && /*#__PURE__*/React.createElement("span", {
    className: "tds-check__txt"
  }, /*#__PURE__*/React.createElement("span", null, label), description && /*#__PURE__*/React.createElement("span", {
    className: "tds-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-input{display:flex;width:100%;height:var(--control-h);padding:0 var(--space-3);background:var(--background);color:var(--foreground);border:var(--border-width) solid var(--input);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-base);box-shadow:var(--shadow-2xs);transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard)}
.tds-input::placeholder{color:var(--muted-foreground)}
.tds-input:hover{border-color:var(--abu-300)}
.tds-input:focus{outline:none;border-color:var(--ring);box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-input:disabled{background:var(--muted);color:var(--muted-foreground);cursor:not-allowed}
.tds-input--sm{height:var(--control-h-sm);font-size:var(--text-sm)}
.tds-input--invalid{border-color:var(--destructive)}
.tds-input--invalid:focus{border-color:var(--destructive);box-shadow:0 0 0 var(--focus-ring-width) color-mix(in oklab,var(--destructive) 30%,transparent)}
.tds-field{display:flex;flex-direction:column;gap:var(--space-1-5)}
.tds-field__hint{font:var(--type-caption);color:var(--muted-foreground)}
.tds-field__err{font:var(--type-caption);color:var(--destructive)}
.tds-inputwrap{position:relative;display:flex;align-items:center}
.tds-inputwrap svg{position:absolute;left:var(--space-3);width:1rem;height:1rem;color:var(--muted-foreground);pointer-events:none}
.tds-inputwrap .tds-input--icon{padding-left:2.25rem}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-input-css")) {
  const s = document.createElement("style");
  s.id = "tds-input-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Input({
  size = "md",
  invalid = false,
  icon,
  hint,
  error,
  className = "",
  ...rest
}) {
  const input = /*#__PURE__*/React.createElement("input", _extends({
    className: ["tds-input", size === "sm" ? "tds-input--sm" : "", invalid || error ? "tds-input--invalid" : "", icon ? "tds-input--icon" : "", className].filter(Boolean).join(" "),
    "aria-invalid": invalid || !!error || undefined
  }, rest));
  const control = icon ? /*#__PURE__*/React.createElement("span", {
    className: "tds-inputwrap"
  }, icon, input) : input;
  if (!hint && !error) return control;
  return /*#__PURE__*/React.createElement("span", {
    className: "tds-field"
  }, control, error ? /*#__PURE__*/React.createElement("span", {
    className: "tds-field__err"
  }, error) : /*#__PURE__*/React.createElement("span", {
    className: "tds-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Label.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-label{display:inline-flex;align-items:center;gap:var(--space-1);font:var(--type-label);color:var(--foreground)}
.tds-label__req{color:var(--destructive)}
.tds-label--disabled{color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-label-css")) {
  const s = document.createElement("style");
  s.id = "tds-label-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Label({
  required = false,
  disabled = false,
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    className: ["tds-label", disabled ? "tds-label--disabled" : "", className].filter(Boolean).join(" ")
  }, rest), children, required && /*#__PURE__*/React.createElement("span", {
    className: "tds-label__req",
    "aria-hidden": "true"
  }, "*"));
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Label.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
const CSS = `
.tds-radios{display:flex;flex-direction:column;gap:var(--space-2-5)}
.tds-radios--row{flex-direction:row;gap:var(--space-5)}
.tds-radio{position:relative;display:inline-flex;align-items:flex-start;gap:var(--space-2-5);cursor:pointer;font:var(--type-body)}
.tds-radio--disabled{opacity:.55;cursor:not-allowed}
.tds-radio input{position:absolute;opacity:0;width:1rem;height:1rem;margin:0}
.tds-radio__dot{flex:none;display:grid;place-items:center;width:1rem;height:1rem;margin-top:.15rem;border:var(--border-width-strong) solid var(--abu-300);border-radius:var(--radius-full);background:var(--background);box-shadow:var(--shadow-2xs);transition:var(--transition-colors)}
.tds-radio:hover .tds-radio__dot{border-color:var(--biru-400)}
.tds-radio__dot::after{content:"";width:.4375rem;height:.4375rem;border-radius:var(--radius-full);background:var(--primary-foreground);transform:scale(0);transition:transform var(--duration-fast) var(--ease-out)}
.tds-radio input:checked + .tds-radio__dot{background:var(--primary);border-color:var(--primary)}
.tds-radio input:checked + .tds-radio__dot::after{transform:scale(1)}
.tds-radio input:focus-visible + .tds-radio__dot{box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-radio__txt{display:flex;flex-direction:column;gap:.125rem}
.tds-radio__desc{font:var(--type-caption);color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-radio-css")) {
  const s = document.createElement("style");
  s.id = "tds-radio-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  orientation = "vertical",
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    className: ["tds-radios", orientation === "horizontal" ? "tds-radios--row" : "", className].filter(Boolean).join(" ")
  }, options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("label", {
      key: opt.value,
      className: ["tds-radio", opt.disabled ? "tds-radio--disabled" : ""].filter(Boolean).join(" ")
    }, /*#__PURE__*/React.createElement("input", {
      type: "radio",
      name: name,
      value: opt.value,
      checked: value === opt.value,
      disabled: opt.disabled,
      onChange: e => onChange && onChange(e.target.value)
    }), /*#__PURE__*/React.createElement("span", {
      className: "tds-radio__dot",
      "aria-hidden": "true"
    }), /*#__PURE__*/React.createElement("span", {
      className: "tds-radio__txt"
    }, /*#__PURE__*/React.createElement("span", null, opt.label), opt.description && /*#__PURE__*/React.createElement("span", {
      className: "tds-radio__desc"
    }, opt.description)));
  }));
}
Object.assign(__ds_scope, { RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const CSS = `
.tds-select{position:relative;display:inline-flex;width:100%}
.tds-select select{appearance:none;width:100%;height:var(--control-h);padding:0 2.25rem 0 var(--space-3);background:var(--background);color:var(--foreground);border:var(--border-width) solid var(--input);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-base);box-shadow:var(--shadow-2xs);cursor:pointer;transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard)}
.tds-select select:hover{border-color:var(--abu-300)}
.tds-select select:focus{outline:none;border-color:var(--ring);box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-select select:disabled{background:var(--muted);color:var(--muted-foreground);cursor:not-allowed}
.tds-select--sm select{height:var(--control-h-sm);font-size:var(--text-sm)}
.tds-select__chev{position:absolute;right:var(--space-3);top:50%;transform:translateY(-50%);width:.875rem;height:.875rem;color:var(--muted-foreground);pointer-events:none}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-select-css")) {
  const s = document.createElement("style");
  s.id = "tds-select-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Select({
  options = [],
  placeholder,
  size = "md",
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: ["tds-select", size === "sm" ? "tds-select--sm" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("select", rest, placeholder && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value,
      disabled: opt.disabled
    }, opt.label);
  })), /*#__PURE__*/React.createElement("svg", {
    className: "tds-select__chev",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-switch{position:relative;display:inline-flex;align-items:center;gap:var(--space-2-5);cursor:pointer;font:var(--type-body)}
.tds-switch--disabled{opacity:.55;cursor:not-allowed}
.tds-switch input{position:absolute;opacity:0;width:2.25rem;height:1.25rem;margin:0}
.tds-switch__track{flex:none;width:2.25rem;height:1.25rem;padding:2px;border-radius:var(--radius-full);background:var(--abu-300);transition:background-color var(--duration-normal) var(--ease-standard)}
.tds-switch__knob{display:block;width:1rem;height:1rem;border-radius:var(--radius-full);background:#fff;box-shadow:var(--shadow-sm);transform:translateX(0);transition:transform var(--duration-normal) var(--ease-out)}
.tds-switch input:checked + .tds-switch__track{background:var(--primary)}
.tds-switch input:checked + .tds-switch__track .tds-switch__knob{transform:translateX(1rem)}
.tds-switch input:focus-visible + .tds-switch__track{box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-switch-css")) {
  const s = document.createElement("style");
  s.id = "tds-switch-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Switch({
  label,
  disabled = false,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: ["tds-switch", disabled ? "tds-switch--disabled" : "", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "tds-switch__track",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tds-switch__knob"
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.tds-textarea{display:block;width:100%;min-height:5rem;padding:var(--space-2) var(--space-3);background:var(--background);color:var(--foreground);border:var(--border-width) solid var(--input);border-radius:var(--radius-md);font-family:var(--font-sans);font-size:var(--text-base);line-height:var(--leading-normal);box-shadow:var(--shadow-2xs);resize:vertical;transition:var(--transition-colors),box-shadow var(--duration-fast) var(--ease-standard)}
.tds-textarea::placeholder{color:var(--muted-foreground)}
.tds-textarea:hover{border-color:var(--abu-300)}
.tds-textarea:focus{outline:none;border-color:var(--ring);box-shadow:0 0 0 var(--focus-ring-width) var(--focus-ring-color)}
.tds-textarea:disabled{background:var(--muted);color:var(--muted-foreground);cursor:not-allowed}
.tds-textarea--invalid{border-color:var(--destructive)}
.tds-textarea__count{display:block;margin-top:var(--space-1-5);font:var(--type-caption);color:var(--muted-foreground);text-align:right}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-textarea-css")) {
  const s = document.createElement("style");
  s.id = "tds-textarea-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Textarea({
  invalid = false,
  maxLength,
  showCount = false,
  value,
  className = "",
  ...rest
}) {
  const ta = /*#__PURE__*/React.createElement("textarea", _extends({
    className: ["tds-textarea", invalid ? "tds-textarea--invalid" : "", className].filter(Boolean).join(" "),
    maxLength: maxLength,
    value: value,
    "aria-invalid": invalid || undefined
  }, rest));
  if (!showCount) return ta;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block"
    }
  }, ta, /*#__PURE__*/React.createElement("span", {
    className: "tds-textarea__count"
  }, (value || "").length, maxLength ? ` / ${maxLength}` : ""));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
const CSS = `
.tds-crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:var(--space-1-5);font-family:var(--font-sans);font-size:var(--text-sm);color:var(--muted-foreground)}
.tds-crumbs a{color:var(--muted-foreground);text-decoration:none;transition:var(--transition-colors)}
.tds-crumbs a:hover{color:var(--primary);text-decoration:underline}
.tds-crumbs__sep{width:.75rem;height:.75rem;background-color:var(--abu-400);-webkit-mask-image:url("https://unpkg.com/lucide-static@0.436.0/icons/chevron-right.svg");mask-image:url("https://unpkg.com/lucide-static@0.436.0/icons/chevron-right.svg");-webkit-mask-size:contain;mask-size:contain;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.tds-crumbs__cur{color:var(--foreground);font-weight:var(--weight-medium)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-breadcrumb-css")) {
  const s = document.createElement("style");
  s.id = "tds-breadcrumb-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Breadcrumb({
  items = [],
  className = ""
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Breadcrumb",
    className: ["tds-crumbs", className].filter(Boolean).join(" ")
  }, items.map((it, i) => {
    const last = i === items.length - 1;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: it.label + i
    }, last || !it.href ? /*#__PURE__*/React.createElement("span", {
      className: last ? "tds-crumbs__cur" : undefined,
      "aria-current": last ? "page" : undefined
    }, it.label) : /*#__PURE__*/React.createElement("a", {
      href: it.href
    }, it.label), !last && /*#__PURE__*/React.createElement("span", {
      className: "tds-crumbs__sep",
      "aria-hidden": "true"
    }));
  }));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Pagination.jsx
try { (() => {
const CSS = `
.tds-pag{display:flex;align-items:center;gap:var(--space-4);font-family:var(--font-sans);font-size:var(--text-sm)}
.tds-pag__info{color:var(--muted-foreground);font-variant-numeric:tabular-nums}
.tds-pag__list{display:flex;align-items:center;gap:var(--space-1);margin-left:auto}
.tds-pag__btn{display:grid;place-items:center;min-width:2rem;height:2rem;padding:0 var(--space-2);border:var(--border-width) solid var(--border);border-radius:var(--radius-md);background:var(--background);color:var(--foreground);font-size:var(--text-sm);font-weight:var(--weight-medium);cursor:pointer;font-variant-numeric:tabular-nums;transition:var(--transition-colors)}
.tds-pag__btn:hover:not(:disabled){background:var(--accent);border-color:var(--biru-200);color:var(--accent-foreground)}
.tds-pag__btn:disabled{opacity:.45;cursor:not-allowed}
.tds-pag__btn--active{background:var(--primary);border-color:var(--primary);color:var(--primary-foreground)}
.tds-pag__btn--active:hover{background:var(--biru-700);color:var(--primary-foreground)}
.tds-pag__gap{padding:0 var(--space-1);color:var(--muted-foreground)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-pagination-css")) {
  const s = document.createElement("style");
  s.id = "tds-pagination-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function pages(page, total) {
  if (total <= 7) return Array.from({
    length: total
  }, (_, i) => i + 1);
  const out = [1];
  const from = Math.max(2, page - 1),
    to = Math.min(total - 1, page + 1);
  if (from > 2) out.push("…");
  for (let i = from; i <= to; i++) out.push(i);
  if (to < total - 1) out.push("…");
  out.push(total);
  return out;
}
function Pagination({
  page = 1,
  totalPages = 1,
  totalItems,
  onChange,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: ["tds-pag", className].filter(Boolean).join(" ")
  }, totalItems != null && /*#__PURE__*/React.createElement("span", {
    className: "tds-pag__info"
  }, totalItems.toLocaleString("id-ID"), " data \xB7 halaman ", page, " dari ", totalPages), /*#__PURE__*/React.createElement("div", {
    className: "tds-pag__list"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tds-pag__btn",
    disabled: page <= 1,
    onClick: () => onChange && onChange(page - 1)
  }, "Sebelumnya"), pages(page, totalPages).map((p, i) => p === "…" ? /*#__PURE__*/React.createElement("span", {
    key: `g${i}`,
    className: "tds-pag__gap"
  }, "\u2026") : /*#__PURE__*/React.createElement("button", {
    key: p,
    type: "button",
    className: ["tds-pag__btn", p === page ? "tds-pag__btn--active" : ""].filter(Boolean).join(" "),
    onClick: () => onChange && onChange(p)
  }, p)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "tds-pag__btn",
    disabled: page >= totalPages,
    onClick: () => onChange && onChange(page + 1)
  }, "Berikutnya")));
}
Object.assign(__ds_scope, { Pagination });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Pagination.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
const CSS = `
.tds-tabs{display:flex;gap:var(--space-1);border-bottom:var(--border-width) solid var(--border)}
.tds-tab{position:relative;background:none;border:0;padding:var(--space-2-5) var(--space-3);margin-bottom:-1px;font-family:var(--font-sans);font-size:var(--text-base);font-weight:var(--weight-medium);color:var(--muted-foreground);cursor:pointer;border-bottom:2px solid transparent;transition:var(--transition-colors)}
.tds-tab:hover{color:var(--foreground)}
.tds-tab--active{color:var(--primary);border-bottom-color:var(--primary)}
.tds-tab__count{margin-left:var(--space-1-5);padding:.0625rem var(--space-1-5);border-radius:var(--radius-full);background:var(--abu-100);color:var(--abu-600);font-size:var(--text-2xs);font-weight:var(--weight-semibold)}
.tds-tab--active .tds-tab__count{background:var(--biru-50);color:var(--biru-700)}
.tds-tabs--pill{border-bottom:0;gap:var(--space-1);padding:var(--space-1);background:var(--secondary);border-radius:var(--radius-lg);display:inline-flex}
.tds-tabs--pill .tds-tab{margin-bottom:0;border-bottom:0;border-radius:var(--radius-md);padding:var(--space-1-5) var(--space-3);font-size:var(--text-sm)}
.tds-tabs--pill .tds-tab--active{background:var(--background);color:var(--foreground);box-shadow:var(--shadow-xs)}
`;
if (typeof document !== "undefined" && !document.getElementById("tds-tabs-css")) {
  const s = document.createElement("style");
  s.id = "tds-tabs-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function Tabs({
  items = [],
  value,
  onChange,
  variant = "underline",
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    className: ["tds-tabs", variant === "pill" ? "tds-tabs--pill" : "", className].filter(Boolean).join(" ")
  }, items.map(it => {
    const t = typeof it === "string" ? {
      value: it,
      label: it
    } : it;
    const active = t.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      type: "button",
      role: "tab",
      "aria-selected": active,
      className: ["tds-tab", active ? "tds-tab--active" : ""].filter(Boolean).join(" "),
      onClick: () => onChange && onChange(t.value)
    }, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      className: "tds-tab__count"
    }, t.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/kawasan-crud/app.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Input,
  Label,
  Select,
  Breadcrumb,
  Pagination,
  Alert,
  Dialog,
  Separator
} = NS;
const STORE_KEY = "tds-kawasan-crud-v1";
const STATUS_OPTIONS = ["Berkembang", "Mandiri", "Berdaya Saing"];
const STATUS_TONE = {
  "Berdaya Saing": "success",
  Mandiri: "info",
  Berkembang: "warning"
};
const PAGE_SIZE = 15;
const fmt = n => n == null ? "—" : n.toLocaleString("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const emptyForm = {
  kawasan: "",
  ipktrans2024: "",
  status2024: "Berkembang",
  intrans2025: "",
  proyeksi2025: "",
  status2025: "Berkembang"
};
function loadInitial() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return window.KAWASAN_SEED;
}
function StatCard({
  label,
  value,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kc-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kc-stat__l"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "kc-stat__v"
  }, value), sub && /*#__PURE__*/React.createElement("span", {
    className: "kc-stat__s"
  }, sub));
}
function KawasanForm({
  value,
  onChange
}) {
  const set = k => e => onChange({
    ...value,
    [k]: e.target ? e.target.value : e
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "kc-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-nama",
    required: true
  }, "Nama kawasan"), /*#__PURE__*/React.createElement(Input, {
    id: "f-nama",
    value: value.kawasan,
    onChange: set("kawasan"),
    placeholder: "Contoh: KTM Lamunti"
  })), /*#__PURE__*/React.createElement(Separator, {
    label: "Hasil pengukuran 2024"
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-ip",
    required: true
  }, "Nilai IPKTRANS"), /*#__PURE__*/React.createElement(Input, {
    id: "f-ip",
    inputMode: "decimal",
    value: value.ipktrans2024,
    onChange: set("ipktrans2024"),
    placeholder: "0-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-s24",
    required: true
  }, "Status"), /*#__PURE__*/React.createElement(Select, {
    id: "f-s24",
    value: value.status2024,
    onChange: set("status2024"),
    options: STATUS_OPTIONS
  }))), /*#__PURE__*/React.createElement(Separator, {
    label: "Hasil pengukuran 2025"
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-in"
  }, "INTRANS (pengukuran langsung)"), /*#__PURE__*/React.createElement(Input, {
    id: "f-in",
    inputMode: "decimal",
    value: value.intrans2025,
    onChange: set("intrans2025"),
    placeholder: "Kosongkan jika belum diukur"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-pj",
    required: true
  }, "Proyeksi nilai INTRANS"), /*#__PURE__*/React.createElement(Input, {
    id: "f-pj",
    inputMode: "decimal",
    value: value.proyeksi2025,
    onChange: set("proyeksi2025"),
    placeholder: "0-1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-s25",
    required: true
  }, "Status 2025"), /*#__PURE__*/React.createElement(Select, {
    id: "f-s25",
    value: value.status2025,
    onChange: set("status2025"),
    options: STATUS_OPTIONS
  })));
}
function KawasanCrudApp() {
  const [rows, setRows] = React.useState(loadInitial);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dialog, setDialog] = React.useState(null); // {mode:"add"|"edit", id?}
  const [form, setForm] = React.useState(emptyForm);
  const [toast, setToast] = React.useState(null);
  const [delId, setDelId] = React.useState(null);
  React.useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(rows));
    } catch (e) {}
  }, [rows]);
  const filtered = React.useMemo(() => rows.filter(r => (!q || r.kawasan.toLowerCase().includes(q.toLowerCase())) && (!statusFilter || r.status2025 === statusFilter)), [rows, q, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const avgIp = rows.length ? rows.reduce((s, r) => s + Number(r.ipktrans2024), 0) / rows.length : 0;
  const measured = rows.filter(r => r.intrans2025 != null);
  const avgMeasured = measured.length ? measured.reduce((s, r) => s + Number(r.intrans2025), 0) / measured.length : null;
  const avgProy = rows.length ? rows.reduce((s, r) => s + Number(r.proyeksi2025), 0) / rows.length : 0;
  const counts = STATUS_OPTIONS.reduce((a, s) => {
    a[s] = rows.filter(r => r.status2025 === s).length;
    return a;
  }, {});
  const openAdd = () => {
    setForm(emptyForm);
    setDialog({
      mode: "add"
    });
  };
  const openEdit = r => {
    setForm({
      kawasan: r.kawasan,
      ipktrans2024: r.ipktrans2024,
      status2024: r.status2024,
      intrans2025: r.intrans2025 ?? "",
      proyeksi2025: r.proyeksi2025,
      status2025: r.status2025
    });
    setDialog({
      mode: "edit",
      id: r.id
    });
  };
  const save = () => {
    if (!form.kawasan.trim() || form.ipktrans2024 === "" || form.proyeksi2025 === "") return;
    const payload = {
      kawasan: form.kawasan.trim(),
      ipktrans2024: Number(form.ipktrans2024),
      status2024: form.status2024,
      intrans2025: form.intrans2025 === "" ? null : Number(form.intrans2025),
      proyeksi2025: Number(form.proyeksi2025),
      status2025: form.status2025
    };
    if (dialog.mode === "add") {
      setRows(r => [...r, {
        id: "kws-" + Date.now(),
        ...payload
      }]);
      setToast({
        tone: "success",
        title: "Kawasan ditambahkan",
        body: `${payload.kawasan} tersimpan dalam registri.`
      });
    } else {
      setRows(r => r.map(x => x.id === dialog.id ? {
        ...x,
        ...payload
      } : x));
      setToast({
        tone: "success",
        title: "Kawasan diperbarui",
        body: `${payload.kawasan} tersimpan dalam registri.`
      });
    }
    setDialog(null);
  };
  const confirmDelete = () => {
    const target = rows.find(r => r.id === delId);
    setRows(r => r.filter(x => x.id !== delId));
    setDelId(null);
    setToast({
      tone: "danger",
      title: "Kawasan dihapus",
      body: target ? `${target.kawasan} dihapus dari registri.` : undefined
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "kc-page"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Beranda",
      href: "#"
    }, {
      label: "Data & Statistik",
      href: "#"
    }, {
      label: "Kawasan Prioritas Nasional"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kc-eyebrow"
  }, "Data & statistik \xB7 tahun anggaran 2025"), /*#__PURE__*/React.createElement("h1", null, "45 kawasan prioritas nasional tahun 2025"), /*#__PURE__*/React.createElement("p", null, "Indeks Pembangunan Kawasan Transmigrasi (IPKTRANS) 2024 dibandingkan dengan hasil dan proyeksi Indeks Transmigrasi (INTRANS) 2025.")), /*#__PURE__*/React.createElement("div", {
    className: "kc-head__a"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "download"
    })
  }, "Ekspor CSV"), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    }),
    onClick: openAdd
  }, "Tambah kawasan"))), toast && /*#__PURE__*/React.createElement(Alert, {
    tone: toast.tone,
    title: toast.title,
    onDismiss: () => setToast(null)
  }, toast.body), /*#__PURE__*/React.createElement("div", {
    className: "kc-stats"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Total kawasan",
    value: rows.length,
    sub: "terdaftar dalam registri"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Rata-rata IPKTRANS 2024",
    value: fmt(avgIp)
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Rata-rata INTRANS terukur",
    value: avgMeasured == null ? "—" : fmt(avgMeasured),
    sub: `${measured.length} dari ${rows.length} kawasan diukur langsung`
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Rata-rata proyeksi INTRANS 2025",
    value: fmt(avgProy)
  })), /*#__PURE__*/React.createElement(Card, {
    variant: "flat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-toolbar"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search"
    }),
    placeholder: "Cari nama kawasan\u2026",
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setPage(1);
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "Semua status 2025",
    value: statusFilter,
    onChange: e => {
      setStatusFilter(e.target.value);
      setPage(1);
    },
    options: STATUS_OPTIONS
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-toolbar__badges"
  }, STATUS_OPTIONS.map(s => /*#__PURE__*/React.createElement(Badge, {
    key: s,
    tone: STATUS_TONE[s],
    dot: true
  }, s, " \xB7 ", counts[s])))), /*#__PURE__*/React.createElement("div", {
    className: "kc-tablewrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "kc-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    rowSpan: 2,
    className: "kc-num",
    style: {
      width: "44px"
    }
  }, "No."), /*#__PURE__*/React.createElement("th", {
    rowSpan: 2
  }, "Kawasan"), /*#__PURE__*/React.createElement("th", {
    colSpan: 2,
    className: "kc-grp"
  }, "Hasil pengukuran 2024"), /*#__PURE__*/React.createElement("th", {
    colSpan: 3,
    className: "kc-grp"
  }, "Hasil pengukuran 2025"), /*#__PURE__*/React.createElement("th", {
    rowSpan: 2,
    style: {
      width: "84px"
    }
  }, "Aksi")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "kc-num"
  }, "IPKTRANS"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "kc-num"
  }, "INTRANS (langsung)"), /*#__PURE__*/React.createElement("th", {
    className: "kc-num"
  }, "Proyeksi INTRANS"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, pageRows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    className: "kc-empty"
  }, "Tidak ada kawasan yang cocok dengan pencarian.")), pageRows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, (page - 1) * PAGE_SIZE + i + 1), /*#__PURE__*/React.createElement("td", {
    className: "kc-name"
  }, r.kawasan), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(r.ipktrans2024)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[r.status2024],
    dot: true
  }, r.status2024)), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(r.intrans2025)), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(r.proyeksi2025)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[r.status2025],
    dot: true
  }, r.status2025)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "kc-rowa"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Ubah kawasan",
    onClick: () => openEdit(r)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: "sm"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Hapus kawasan",
    onClick: () => setDelId(r.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: "sm"
  }))))))), rows.length > 0 && /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    className: "kc-avglabel"
  }, "Rata-rata"), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(avgIp)), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, avgMeasured == null ? "—" : fmt(avgMeasured)), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(avgProy)), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null))))), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: totalPages,
    totalItems: filtered.length,
    onChange: setPage
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: !!dialog,
    onClose: () => setDialog(null),
    size: "lg",
    title: dialog?.mode === "add" ? "Tambah kawasan" : "Ubah kawasan",
    description: "Data indeks digunakan untuk pemantauan capaian kawasan prioritas nasional.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setDialog(null)
    }, "Batal"), /*#__PURE__*/React.createElement(Button, {
      onClick: save
    }, "Simpan"))
  }, dialog && /*#__PURE__*/React.createElement(KawasanForm, {
    value: form,
    onChange: setForm
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: !!delId,
    onClose: () => setDelId(null),
    size: "sm",
    title: "Hapus kawasan?",
    description: "Tindakan ini tidak dapat dibatalkan.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setDelId(null)
    }, "Batal"), /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      onClick: confirmDelete
    }, "Hapus"))
  }, "Kawasan akan dihapus dari registri 45 kawasan prioritas nasional."));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(KawasanCrudApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/kawasan-crud/app.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/kawasan-crud/data.js
try { (() => {
window.KAWASAN_SEED = [["Rasau Jaya", 82.86, "Berdaya Saing", 0.62, 0.62, "Mandiri"], ["Lagita", 80.47, "Berdaya Saing", 0.62, 0.62, "Mandiri"], ["Cahaya Baru", 79.29, "Berdaya Saing", 0.59, 0.59, "Mandiri"], ["Mahalona", 67.58, "Mandiri", 0.58, 0.58, "Mandiri"], ["Tobadak", 76.21, "Berdaya Saing", 0.57, 0.57, "Mandiri"], ["Lunang Silaut", 84.93, "Berdaya Saing", 0.56, 0.56, "Mandiri"], ["Telang", 78.67, "Berdaya Saing", 0.53, 0.53, "Mandiri"], ["Salor", 68.65, "Mandiri", 0.58, 0.58, "Berkembang"], ["Jelai (Pulau Nibung)", 43.27, "Berkembang", 0.54, 0.54, "Berkembang"], ["Pituriase", 48.72, "Berkembang", 0.53, 0.53, "Berkembang"], ["Petata", 46.13, "Berkembang", 0.53, 0.53, "Berkembang"], ["Parit Rambutan", 50.12, "Mandiri", 0.52, 0.52, "Berkembang"], ["Tasifeto - Mandeu", 41.36, "Berkembang", 0.51, 0.51, "Berkembang"], ["Selaut", 66.78, "Mandiri", 0.49, 0.49, "Berkembang"], ["Selaparang", 47.26, "Berkembang", 0.46, 0.46, "Berkembang"], ["Batu Betumpang", 81.36, "Berdaya Saing", 0.59, 0.59, "Berkembang"], ["Sarudu Baras", 64.20, "Mandiri", 0.55, 0.55, "Berkembang"], ["Bungku", 53.20, "Mandiri", null, 0.44, "Berkembang"], ["Mutiara", 62.44, "Mandiri", null, 0.53, "Berkembang"], ["Sumalata", 65.00, "Mandiri", null, 0.56, "Berkembang"], ["Salim Batu", 53.49, "Mandiri", null, 0.44, "Berkembang"], ["Palolo", 61.24, "Mandiri", null, 0.52, "Berkembang"], ["Gerbang Masperkasa", 63.76, "Mandiri", null, 0.55, "Berkembang"], ["Asinua/Routa", 50.12, "Mandiri", null, 0.41, "Berkembang"], ["Tampolore", 53.13, "Mandiri", null, 0.44, "Berkembang"], ["Kikim", 54.25, "Mandiri", null, 0.45, "Berkembang"], ["Ponu", 51.05, "Mandiri", null, 0.42, "Berkembang"], ["Pulau Morotai", 48.55, "Berkembang", null, 0.55, "Berkembang"], ["Kobalima Timur", 52.14, "Mandiri", null, 0.43, "Berkembang"], ["Kerang", 47.93, "Mandiri", null, 0.54, "Berkembang"], ["Muting", 58.09, "Mandiri", null, 0.49, "Berkembang"], ["Senggi", 46.92, "Mandiri", null, 0.53, "Berkembang"], ["Tubbi Taramanu", 39.11, "Berkembang", null, 0.45, "Berkembang"], ["Anawua", 30.30, "Berkembang", null, 0.36, "Berkembang"], ["Lamunti - Dadahup", 55.97, "Mandiri", null, 0.47, "Berkembang"], ["Ulumanda", 48.81, "Berkembang", null, 0.55, "Berkembang"], ["Patlean", 29.19, "Berkembang", null, 0.35, "Berkembang"], ["Mambi Mehalaan", 54.77, "Mandiri", null, 0.46, "Berkembang"], ["Sekayam - Entikong", 43.41, "Berkembang", null, 0.49, "Berkembang"], ["Ketungau Hulu", 36.29, "Berkembang", null, 0.42, "Berkembang"], ["Sagea Waleh", 19.37, "Berkembang", null, 0.25, "Berkembang"], ["Muara Takung - Kamang Baru", 43.80, "Berkembang", null, 0.50, "Berkembang"], ["Pulau Bacan", 32.14, "Berkembang", null, 0.38, "Berkembang"], ["Klamono - Segun", 41.96, "Berkembang", null, 0.48, "Berkembang"], ["Arut Selatan dan Kota Waringin Lama", 61.66, "Mandiri", null, 0.53, "Berkembang"]].map(([kawasan, ipktrans2024, status2024, intrans2025, proyeksi2025, status2025], i) => ({
  id: "kws-" + (i + 1),
  kawasan,
  ipktrans2024,
  status2024,
  intrans2025,
  proyeksi2025,
  status2025
}));
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/kawasan-crud/data.js", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/portal/screen-beranda.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Icon,
  Card,
  Badge,
  Separator,
  Progress,
  Tabs
} = NS;
const LAYANAN = [{
  icon: "map-pin",
  t: "Penetapan kawasan transmigrasi",
  d: "Usulan pemerintah daerah untuk penetapan kawasan baru atau perluasan.",
  who: "Pemerintah daerah"
}, {
  icon: "users",
  t: "Pendaftaran calon transmigran",
  d: "Pendaftaran keluarga calon transmigran beserta verifikasi berkas.",
  who: "Masyarakat"
}, {
  icon: "file-check-2",
  t: "Legalisasi hak atas tanah",
  d: "Permohonan sertifikasi lahan pekarangan dan lahan usaha.",
  who: "Transmigran"
}, {
  icon: "sprout",
  t: "Bantuan sarana produksi",
  d: "Pengajuan bantuan bibit, alat, dan pendampingan usaha tani.",
  who: "Kelompok tani"
}, {
  icon: "database",
  t: "Data kawasan terbuka",
  d: "Unduh data kawasan, daya tampung, dan capaian penempatan.",
  who: "Umum"
}, {
  icon: "message-square-warning",
  t: "Pengaduan masyarakat",
  d: "Sampaikan aduan pelayanan; ditindaklanjuti dalam 5 hari kerja.",
  who: "Umum"
}];
const BERITA = [{
  tag: "Kebijakan",
  t: "Tiga kawasan transmigrasi baru ditetapkan di Papua Selatan",
  d: "24 Agustus 2026",
  x: "Penetapan mencakup 8.400 hektare dengan daya tampung 1.950 keluarga."
}, {
  tag: "Program",
  t: "Sertifikasi 12.400 bidang lahan transmigran tuntas tahun ini",
  d: "19 Agustus 2026",
  x: "Kerja sama dengan Kementerian ATR/BPN mempercepat legalisasi aset."
}, {
  tag: "Data",
  t: "Portal data kawasan kini menyediakan unduhan format shapefile",
  d: "11 Agustus 2026",
  x: "Pemerintah daerah dapat mengunduh batas kawasan resmi tanpa permohonan."
}];
function BerandaScreen({
  onNavigate
}) {
  const [tab, setTab] = React.useState("2026");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "pt-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-hero__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__txt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-eyebrow"
  }, "Tata kelola digital transmigrasi"), /*#__PURE__*/React.createElement("h1", null, "Satu data kawasan, satu pintu layanan."), /*#__PURE__*/React.createElement("p", null, "Ajukan penetapan kawasan, pantau penempatan keluarga, dan akses data resmi transmigrasi Indonesia dalam satu portal."), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onNavigate("layanan"),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Ajukan permohonan"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "download"
    })
  }, "Unduh data kawasan")), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: "sm"
  }), " Terhubung dengan SSO ASN Digital dan Satu Data Indonesia")), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__cardhd"
  }, "Capaian nasional"), /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    value: tab,
    onChange: setTab,
    items: [{
      value: "2026",
      label: "2026"
    }, {
      value: "2025",
      label: "2025"
    }, {
      value: "kumulatif",
      label: "Kumulatif"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-figs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "52"), /*#__PURE__*/React.createElement("span", null, "kawasan aktif")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "12.740"), /*#__PURE__*/React.createElement("span", null, "KK ditempatkan")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "27"), /*#__PURE__*/React.createElement("span", null, "provinsi"))), /*#__PURE__*/React.createElement(Progress, {
    label: "Realisasi target penempatan",
    value: 68,
    valueLabel: "68%"
  }), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__note"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: "sm"
  }), " Diperbarui 24 Agustus 2026, 06.00 WIB")))), /*#__PURE__*/React.createElement("section", {
    className: "pt-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-sechd"
  }, /*#__PURE__*/React.createElement("h2", null, "Layanan"), /*#__PURE__*/React.createElement("a", {
    href: "#semua"
  }, "Lihat semua layanan ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: "sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-grid3"
  }, LAYANAN.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.t,
    interactive: true,
    onClick: () => onNavigate("layanan"),
    title: l.t,
    description: l.d,
    action: /*#__PURE__*/React.createElement("span", {
      className: "pt-layicon"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: l.icon,
      size: "lg"
    })),
    footer: /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, l.who),
    footerBordered: true
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "pt-sec pt-sec--tint"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-peta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-peta__ph"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: "xl"
  }), /*#__PURE__*/React.createElement("span", null, "Peta sebaran kawasan tersedia pada portal produksi (WebGIS Satu Data)."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pt-eyebrow"
  }, "Sebaran kawasan"), /*#__PURE__*/React.createElement("h2", null, "52 kawasan transmigrasi di 27 provinsi"), /*#__PURE__*/React.createElement("p", {
    className: "pt-lead"
  }, "Setiap kawasan memiliki halaman profil terbuka: SK penetapan, luas, daya tampung, capaian penempatan, dan kontak dinas pengelola."), /*#__PURE__*/React.createElement("div", {
    className: "pt-list"
  }, [["Kalimantan Tengah", "12 kawasan"], ["Sulawesi Tenggara", "9 kawasan"], ["Papua Selatan", "7 kawasan"], ["Kalimantan Barat", "6 kawasan"]].map(([p, k]) => /*#__PURE__*/React.createElement("div", {
    key: p,
    className: "pt-list__row"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: "sm"
  }), /*#__PURE__*/React.createElement("strong", null, p), /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: "sm"
  })))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Jelajahi semua kawasan")))), /*#__PURE__*/React.createElement("section", {
    className: "pt-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-sechd"
  }, /*#__PURE__*/React.createElement("h2", null, "Berita & siaran pers"), /*#__PURE__*/React.createElement("a", {
    href: "#berita"
  }, "Semua berita ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: "sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-grid3"
  }, BERITA.map(b => /*#__PURE__*/React.createElement("article", {
    key: b.t,
    className: "pt-news"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-news__img"
  }, /*#__PURE__*/React.createElement("span", null, "Foto siaran pers")), /*#__PURE__*/React.createElement(Badge, {
    tone: "primary"
  }, b.tag), /*#__PURE__*/React.createElement("h3", null, b.t), /*#__PURE__*/React.createElement("p", null, b.x), /*#__PURE__*/React.createElement("time", null, b.d)))))), /*#__PURE__*/React.createElement("section", {
    className: "pt-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-cta__in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Punya pertanyaan tentang layanan transmigrasi?"), /*#__PURE__*/React.createElement("p", null, "Layanan informasi publik buka Senin\u2013Jumat, 08.00\u201316.00 WIB.")), /*#__PURE__*/React.createElement("div", {
    className: "pt-cta__b"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "phone"
    })
  }, "Hubungi kami"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-square-warning"
    })
  }, "Sampaikan aduan")))));
}
Object.assign(window, {
  BerandaScreen,
  LAYANAN
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/portal/screen-beranda.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/portal/screen-layanan.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Icon,
  Card,
  Badge,
  Input,
  Label,
  Select,
  Textarea,
  Checkbox,
  RadioGroup,
  Alert,
  Breadcrumb,
  Separator,
  Progress,
  Dialog
} = NS;
function LayananScreen({
  onNavigate
}) {
  const [step, setStep] = React.useState(1);
  const [jenis, setJenis] = React.useState("baru");
  const [sent, setSent] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const steps = ["Data pengusul", "Data kawasan", "Dokumen", "Pernyataan"];
  return /*#__PURE__*/React.createElement("main", {
    className: "pt-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Beranda",
      href: "#"
    }, {
      label: "Layanan",
      href: "#"
    }, {
      label: "Penetapan kawasan transmigrasi"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-formhd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pt-eyebrow"
  }, "Layanan pemerintah daerah"), /*#__PURE__*/React.createElement("h1", null, "Permohonan penetapan kawasan transmigrasi"), /*#__PURE__*/React.createElement("p", {
    className: "pt-lead"
  }, "Formulir ini diajukan oleh dinas yang menangani transmigrasi di kabupaten/kota. Waktu penyelesaian 7 hari kerja sejak berkas lengkap. Tidak dipungut biaya.")), /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Ringkasan layanan"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Biaya"), /*#__PURE__*/React.createElement("strong", null, "Gratis")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Waktu"), /*#__PURE__*/React.createElement("strong", null, "7 hari kerja")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Dasar hukum"), /*#__PURE__*/React.createElement("strong", null, "PP 3/2014")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Pemohon"), /*#__PURE__*/React.createElement("strong", null, "Pemerintah daerah")))), sent && /*#__PURE__*/React.createElement(Alert, {
    tone: "success",
    title: "Permohonan terkirim",
    onDismiss: () => setSent(false)
  }, "Nomor registrasi TRM-2026-004182. Pantau status melalui menu Permohonan Saya."), /*#__PURE__*/React.createElement("div", {
    className: "pt-steps"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    className: "pt-step" + (i + 1 === step ? " pt-step--on" : "") + (i + 1 < step ? " pt-step--done" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "pt-step__n"
  }, i + 1 < step ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: "sm"
  }) : i + 1), s))), /*#__PURE__*/React.createElement(Progress, {
    size: "sm",
    value: step,
    max: steps.length,
    label: `Langkah ${step} dari ${steps.length}`,
    valueLabel: steps[step - 1]
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-formgrid"
  }, /*#__PURE__*/React.createElement(Card, null, step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "dinas",
    required: true
  }, "Nama dinas pengusul"), /*#__PURE__*/React.createElement(Input, {
    id: "dinas",
    defaultValue: "Dinas Transmigrasi Kabupaten Kapuas"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "prov",
    required: true
  }, "Provinsi"), /*#__PURE__*/React.createElement(Select, {
    id: "prov",
    options: ["Kalimantan Tengah", "Kalimantan Barat", "Sulawesi Tenggara", "Papua Selatan", "Maluku"]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "pic",
    required: true
  }, "Nama pejabat penanggung jawab"), /*#__PURE__*/React.createElement(Input, {
    id: "pic",
    placeholder: "Nama lengkap dan gelar"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "nip",
    required: true
  }, "NIP"), /*#__PURE__*/React.createElement(Input, {
    id: "nip",
    inputMode: "numeric",
    placeholder: "18 digit NIP",
    hint: "Tanpa spasi atau tanda baca."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "em",
    required: true
  }, "Email dinas"), /*#__PURE__*/React.createElement(Input, {
    id: "em",
    type: "email",
    placeholder: "nama@kapuaskab.go.id"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "tel",
    required: true
  }, "Telepon"), /*#__PURE__*/React.createElement(Input, {
    id: "tel",
    placeholder: "(0513) 000000"
  })))), step === 2 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    required: true
  }, "Jenis permohonan"), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "jenis",
    value: jenis,
    onChange: setJenis,
    options: [{
      value: "baru",
      label: "Penetapan kawasan baru",
      description: "Kawasan belum pernah ditetapkan."
    }, {
      value: "perluasan",
      label: "Perluasan kawasan",
      description: "Menambah satuan permukiman pada kawasan yang sudah ada."
    }, {
      value: "revisi",
      label: "Revisi batas kawasan"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "nk",
    required: true
  }, "Nama kawasan"), /*#__PURE__*/React.createElement(Input, {
    id: "nk",
    placeholder: "Contoh: KTM Lamunti"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "lu",
    required: true
  }, "Luas diusulkan (ha)"), /*#__PURE__*/React.createElement(Input, {
    id: "lu",
    inputMode: "decimal",
    placeholder: "12480"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "dt",
    required: true
  }, "Daya tampung (KK)"), /*#__PURE__*/React.createElement(Input, {
    id: "dt",
    inputMode: "numeric",
    placeholder: "1200"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "st"
  }, "Status lahan dominan"), /*#__PURE__*/React.createElement(Select, {
    id: "st",
    placeholder: "Pilih status",
    options: ["APL", "HPK", "Hutan produksi konversi", "Lainnya"]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "ket"
  }, "Uraian singkat usulan"), /*#__PURE__*/React.createElement(Textarea, {
    id: "ket",
    rows: 4,
    placeholder: "Latar belakang, kesesuaian RTRW, dan rencana pengembangan usaha."
  }))), step === 3 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Format berkas"
  }, "PDF atau ZIP, maksimal 25 MB per dokumen. Berkas dipindai otomatis."), [["SK Bupati penetapan lokasi", true], ["Peta batas kawasan (shapefile)", true], ["Rencana rinci satuan kawasan", true], ["Berita acara clean and clear lahan", false]].map(([d, ok]) => /*#__PURE__*/React.createElement("div", {
    key: d,
    className: "pt-up" + (ok ? " pt-up--ok" : "")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ok ? "file-check-2" : "upload",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, d), /*#__PURE__*/React.createElement("span", null, ok ? "sk-bupati-2026-114.pdf · 2,4 MB" : "Wajib · belum diunggah")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: ok ? "ghost" : "outline"
  }, ok ? "Ganti" : "Pilih berkas")))), step === 4 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-decl"
  }, /*#__PURE__*/React.createElement("h3", null, "Surat pernyataan"), /*#__PURE__*/React.createElement("p", null, "Dengan ini kami menyatakan bahwa data dan dokumen yang disampaikan dalam permohonan ini benar, sah, dan dapat dipertanggungjawabkan. Kami bersedia menerima sanksi sesuai ketentuan peraturan perundang-undangan apabila di kemudian hari ditemukan ketidaksesuaian.")), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Saya menyatakan seluruh data benar dan sah",
    description: "Pernyataan ini setara tanda tangan elektronik."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Saya menyetujui pemrosesan data sesuai kebijakan privasi"
  }), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Kawasan"), /*#__PURE__*/React.createElement("strong", null, "KTM Lamunti")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Jenis"), /*#__PURE__*/React.createElement("strong", null, jenis === "baru" ? "Penetapan kawasan baru" : jenis === "perluasan" ? "Perluasan kawasan" : "Revisi batas kawasan")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Dokumen"), /*#__PURE__*/React.createElement("strong", null, "3 dari 4 lengkap"))), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-formnav"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    disabled: step === 1,
    onClick: () => setStep(step - 1),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left"
    })
  }, "Sebelumnya"), step < 4 ? /*#__PURE__*/React.createElement(Button, {
    onClick: () => setStep(step + 1),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Lanjut") : /*#__PURE__*/React.createElement(Button, {
    onClick: () => setConfirm(true),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "send"
    })
  }, "Kirim permohonan"))), /*#__PURE__*/React.createElement("aside", {
    className: "pt-aside"
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Dokumen yang perlu disiapkan"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "pt-ul"
  }, /*#__PURE__*/React.createElement("li", null, "SK Bupati/Wali Kota penetapan lokasi"), /*#__PURE__*/React.createElement("li", null, "Peta batas kawasan format shapefile"), /*#__PURE__*/React.createElement("li", null, "Rencana rinci satuan kawasan"), /*#__PURE__*/React.createElement("li", null, "Berita acara clean and clear lahan"))), /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Butuh bantuan?"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pt-help"
  }, "Layanan informasi publik, Senin\u2013Jumat 08.00\u201316.00 WIB."), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "phone"
    })
  }, "(021) 7940327"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "book-open"
    })
  }, "Panduan pengisian (PDF)")), /*#__PURE__*/React.createElement("div", {
    className: "pt-badgebox"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "Layanan aktif"), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "Tanpa biaya"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: confirm,
    onClose: () => setConfirm(false),
    size: "sm",
    title: "Kirim permohonan?",
    description: "Setelah terkirim, berkas tidak dapat diubah kecuali dikembalikan untuk perbaikan.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setConfirm(false)
    }, "Periksa lagi"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setConfirm(false);
        setSent(true);
        setStep(1);
      }
    }, "Kirim"))
  }, "Pastikan seluruh dokumen wajib telah diunggah. Saat ini 3 dari 4 dokumen lengkap."));
}
Object.assign(window, {
  LayananScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/portal/screen-layanan.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/portal/site-chrome.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Icon,
  Badge,
  Input
} = NS;
const MENU = ["Profil", "Layanan", "Kawasan", "Data & Statistik", "Berita", "Pengaduan"];
function TopStrip() {
  return /*#__PURE__*/React.createElement("div", {
    className: "pt-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-strip__in"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "landmark",
    size: "sm"
  }), " Situs resmi Kementerian Transmigrasi Republik Indonesia"), /*#__PURE__*/React.createElement("span", {
    className: "pt-strip__r"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#bahasa"
  }, "Bahasa Indonesia"), /*#__PURE__*/React.createElement("span", {
    className: "pt-dot"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#en"
  }, "English"), /*#__PURE__*/React.createElement("span", {
    className: "pt-dot"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#kontras"
  }, "Mode kontras tinggi"))));
}
function SiteHeader({
  onNavigate,
  active
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "pt-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-head__in"
  }, /*#__PURE__*/React.createElement("a", {
    className: "pt-brand",
    href: "#beranda",
    onClick: () => onNavigate("beranda")
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-lockup.png",
    alt: "Kementerian Transmigrasi Republik Indonesia \u2014 Kesejahteraan untuk semua"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "pt-nav"
  }, MENU.map(m => /*#__PURE__*/React.createElement("a", {
    key: m,
    href: "#" + m,
    className: active === m ? "pt-nav--on" : undefined,
    onClick: e => {
      e.preventDefault();
      onNavigate(m === "Layanan" ? "layanan" : "beranda");
    }
  }, m))), /*#__PURE__*/React.createElement("div", {
    className: "pt-head__a"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Cari"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNavigate("layanan")
  }, "Masuk SIMTRANS"))));
}
function SiteFooter() {
  const cols = [["Layanan", ["Permohonan penetapan kawasan", "Pendaftaran calon transmigran", "Data kawasan terbuka", "Pengaduan masyarakat"]], ["Informasi", ["Profil kementerian", "Struktur organisasi", "Rencana strategis", "Laporan kinerja"]], ["Keterbukaan", ["PPID", "LHKPN", "Whistleblowing system", "Pengadaan barang & jasa"]]];
  return /*#__PURE__*/React.createElement("footer", {
    className: "pt-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-foot__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pt-foot__plate"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-emblem.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__wm"
  }, "KEMENTERIAN TRANSMIGRASI"), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__wm2"
  }, "Kesejahteraan untuk semua"), /*#__PURE__*/React.createElement("p", null, "Jl. TMP Kalibata No. 17, Jakarta Selatan 12750", /*#__PURE__*/React.createElement("br", null), "Telepon (021) 7940327 \xB7 halo@transmigrasi.go.id"), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__badges"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "SPBE"), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "WBK/WBBM"), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "ISO 27001")))), cols.map(([t, items]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    className: "pt-foot__col"
  }, /*#__PURE__*/React.createElement("h4", null, t), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#" + i
  }, i)))), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__col"
  }, /*#__PURE__*/React.createElement("h4", null, "Buletin transmigrasi"), /*#__PURE__*/React.createElement("p", {
    className: "pt-foot__p"
  }, "Ringkasan kebijakan dan data kawasan, dikirim sebulan sekali."), /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    placeholder: "Alamat email"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline"
  }, "Berlangganan"))), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-foot__barin"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Kementerian Transmigrasi Republik Indonesia"), /*#__PURE__*/React.createElement("span", null, "Peta situs \xB7 Kebijakan privasi \xB7 Aksesibilitas"))));
}
Object.assign(window, {
  TopStrip,
  SiteHeader,
  SiteFooter,
  MENU
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/portal/site-chrome.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/simtrans/app-shell.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Icon,
  Avatar,
  Badge,
  Input,
  Button
} = NS;
const NAV = [{
  id: "dashboard",
  label: "Dasbor",
  icon: "layout-dashboard"
}, {
  id: "registri",
  label: "Registri Kawasan",
  icon: "layers"
}, {
  id: "permohonan",
  label: "Permohonan",
  icon: "clipboard-list",
  count: 24
}, {
  id: "penempatan",
  label: "Penempatan KK",
  icon: "users"
}, {
  id: "anggaran",
  label: "Anggaran",
  icon: "chart-column"
}, {
  id: "peta",
  label: "Peta Kawasan",
  icon: "map-pin"
}];
const NAV2 = [{
  id: "audit",
  label: "Log Audit",
  icon: "shield-check"
}, {
  id: "pengaturan",
  label: "Pengaturan",
  icon: "settings"
}];
function Sidebar({
  active,
  onNavigate
}) {
  const item = n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => onNavigate(n.id),
    className: "sim-nav" + (active === n.id ? " sim-nav--on" : "")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon
  }), /*#__PURE__*/React.createElement("span", null, n.label), n.count != null && /*#__PURE__*/React.createElement("span", {
    className: "sim-nav__c"
  }, n.count));
  return /*#__PURE__*/React.createElement("aside", {
    className: "sim-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-side__brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sim-side__plate"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-emblem.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-side__name"
  }, "SIMTRANS"), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__sub"
  }, "Kementerian Transmigrasi RI"))), /*#__PURE__*/React.createElement("nav", {
    className: "sim-side__nav"
  }, NAV.map(item)), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__spacer"
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sim-side__nav"
  }, NAV2.map(item)), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__foot"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Siti Rahayu",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-side__u"
  }, "Siti Rahayu"), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__r"
  }, "Verifikator Ditjen PKP2Trans"))));
}
function Topbar({
  title,
  breadcrumbSlot,
  actions
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "sim-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-top__l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-top__t"
  }, title), breadcrumbSlot), /*#__PURE__*/React.createElement("div", {
    className: "sim-top__r"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search"
    }),
    placeholder: "Cari kawasan, permohonan, NIK\u2026",
    className: "sim-top__search"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Notifikasi"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  })), actions));
}
function PageHead({
  eyebrow,
  title,
  desc,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-ph"
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "sim-ph__e"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "sim-ph__t"
  }, title), desc && /*#__PURE__*/React.createElement("p", {
    className: "sim-ph__d"
  }, desc)), /*#__PURE__*/React.createElement("div", {
    className: "sim-ph__a"
  }, actions));
}
function Stat({
  label,
  value,
  delta,
  deltaTone = "success",
  icon
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-stat__top"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement(Icon, {
    name: icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-stat__v"
  }, value), delta && /*#__PURE__*/React.createElement(Badge, {
    tone: deltaTone,
    dot: true
  }, delta));
}
Object.assign(window, {
  Sidebar,
  Topbar,
  PageHead,
  Stat,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/simtrans/app-shell.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/simtrans/screen-dashboard.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Progress,
  Table,
  Tabs,
  Alert,
  Separator
} = NS;
const PROVINSI = [{
  name: "Kalimantan Tengah",
  kk: 4820,
  pct: 100
}, {
  name: "Sulawesi Tengah",
  kk: 3140,
  pct: 65
}, {
  name: "Papua Selatan",
  kk: 2610,
  pct: 54
}, {
  name: "Kalimantan Barat",
  kk: 1980,
  pct: 41
}, {
  name: "Maluku Utara",
  kk: 1240,
  pct: 26
}];
const ANTREAN = [{
  id: 1,
  kode: "TRM-2026-004182",
  kawasan: "KTM Lamunti",
  daerah: "Kapuas, Kalteng",
  umur: "2 hari",
  status: "Menunggu",
  tone: "warning"
}, {
  id: 2,
  kode: "TRM-2026-004179",
  kawasan: "KTM Tinanggea",
  daerah: "Konawe Selatan, Sultra",
  umur: "4 hari",
  status: "Menunggu",
  tone: "warning"
}, {
  id: 3,
  kode: "TRM-2026-004166",
  kawasan: "KTM Salor",
  daerah: "Merauke, Papua Selatan",
  umur: "6 hari",
  status: "Perbaikan",
  tone: "info"
}, {
  id: 4,
  kode: "TRM-2026-004151",
  kawasan: "KTM Rasau Jaya",
  daerah: "Kubu Raya, Kalbar",
  umur: "9 hari",
  status: "Terverifikasi",
  tone: "success"
}, {
  id: 5,
  kode: "TRM-2026-004140",
  kawasan: "KTM Kobisonta",
  daerah: "Maluku Tengah, Maluku",
  umur: "12 hari",
  status: "Ditolak",
  tone: "danger"
}];
function DashboardScreen({
  onOpen
}) {
  const [range, setRange] = React.useState("bulan");
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-page"
  }, /*#__PURE__*/React.createElement(PageHead, {
    eyebrow: "Ditjen PKP2Trans \xB7 Tahun anggaran 2026",
    title: "Dasbor tata kelola kawasan",
    desc: "Ringkasan permohonan, penempatan keluarga, dan realisasi anggaran per 24 Agustus 2026.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "download"
      })
    }, "Unduh laporan"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus"
      })
    }, "Permohonan baru"))
  }), /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "24 permohonan menunggu verifikasi lebih dari 5 hari kerja",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      onClick: () => onOpen("registri")
    }, "Lihat antrean")
  }, "Batas layanan (SLA) verifikasi adalah 7 hari kerja sejak berkas dinyatakan lengkap."), /*#__PURE__*/React.createElement("div", {
    className: "sim-stats"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Permohonan masuk",
    value: "1.284",
    delta: "+8,2% dari bulan lalu",
    icon: "clipboard-list"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Kawasan aktif",
    value: "52",
    delta: "3 penetapan baru",
    icon: "layers"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "KK ditempatkan",
    value: "12.740",
    delta: "+412 KK",
    icon: "users"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Menunggu verifikasi",
    value: "24",
    delta: "4 melewati SLA",
    deltaTone: "warning",
    icon: "clock"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-grid2"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Realisasi anggaran",
    description: "Pagu Rp 4,7 T \xB7 terserap Rp 3,2 T",
    action: /*#__PURE__*/React.createElement(Tabs, {
      variant: "pill",
      value: range,
      onChange: setRange,
      items: [{
        value: "pekan",
        label: "7 hari"
      }, {
        value: "bulan",
        label: "30 hari"
      }, {
        value: "tahun",
        label: "2026"
      }]
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-bars"
  }, [["Jan", 22], ["Feb", 31], ["Mar", 44], ["Apr", 39], ["Mei", 52], ["Jun", 61], ["Jul", 68], ["Agu", 74]].map(([m, v]) => /*#__PURE__*/React.createElement("div", {
    key: m,
    className: "sim-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-bar__fill",
    style: {
      height: v + "%"
    }
  }), /*#__PURE__*/React.createElement("span", null, m)))), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement(Progress, {
    label: "Serapan anggaran nasional",
    value: 68,
    valueLabel: "68% \xB7 Rp 3,2 T"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Penempatan per provinsi",
    description: "Terhadap target 2026"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-prov"
  }, PROVINSI.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    className: "sim-prov__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-prov__n"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: "sm"
  }), p.name), /*#__PURE__*/React.createElement(Progress, {
    size: "sm",
    value: p.pct,
    tone: p.pct >= 65 ? "primary" : "info"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-prov__v"
  }, p.kk.toLocaleString("id-ID"), " KK")))))), /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Antrean verifikasi",
    description: "5 permohonan teratas berdasarkan umur berkas",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: "sm"
      }),
      onClick: () => onOpen("registri")
    }, "Semua permohonan")
  }, /*#__PURE__*/React.createElement(Table, {
    density: "compact",
    onRowClick: () => onOpen("detail"),
    columns: [{
      key: "kode",
      label: "Nomor registrasi",
      render: r => /*#__PURE__*/React.createElement("span", {
        className: "sim-mono"
      }, r.kode)
    }, {
      key: "kawasan",
      label: "Kawasan"
    }, {
      key: "daerah",
      label: "Daerah pengusul"
    }, {
      key: "umur",
      label: "Umur berkas",
      numeric: true
    }, {
      key: "status",
      label: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.status)
    }],
    rows: ANTREAN
  })));
}
Object.assign(window, {
  DashboardScreen,
  ANTREAN
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/simtrans/screen-dashboard.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/simtrans/screen-detail.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Tabs,
  Breadcrumb,
  Alert,
  Dialog,
  Textarea,
  Separator,
  Progress,
  Avatar,
  Table,
  RadioGroup,
  Label,
  Switch
} = NS;
const DOKUMEN = [{
  nama: "SK Bupati penetapan lokasi",
  file: "sk-bupati-2026-114.pdf",
  ok: true
}, {
  nama: "Peta batas kawasan (shapefile)",
  file: "batas-ktm-lamunti.zip",
  ok: true
}, {
  nama: "Rencana rinci satuan kawasan",
  file: "rkt-lamunti-2026.pdf",
  ok: true
}, {
  nama: "Berita acara clean and clear lahan",
  file: "—",
  ok: false
}];
const RIWAYAT = [{
  who: "Ahmad Fauzi",
  role: "Dinas Transmigrasi Kab. Kapuas",
  act: "mengirim permohonan",
  at: "22 Agu 2026, 09.14"
}, {
  who: "Sistem",
  role: "SIMTRANS",
  act: "memverifikasi kelengkapan — 3 dari 4 dokumen lengkap",
  at: "22 Agu 2026, 09.15"
}, {
  who: "Budi Hartono",
  role: "Analis Kawasan",
  act: "menugaskan verifikator wilayah Kalimantan",
  at: "22 Agu 2026, 13.02"
}, {
  who: "Siti Rahayu",
  role: "Verifikator Ditjen PKP2Trans",
  act: "membuka berkas untuk telaah",
  at: "24 Agu 2026, 08.40"
}];
const FAKTA = [["Nama kawasan", "Kawasan Transmigrasi Lamunti"], ["Kode usulan", "KTM-01"], ["Kabupaten", "Kapuas"], ["Provinsi", "Kalimantan Tengah"], ["Luas diusulkan", "12.480 ha"], ["Daya tampung", "1.200 KK"], ["Status lahan", "APL 78% · HPK 22%"], ["Titik koordinat", "−2,1932 · 114,7291"], ["Jenis permohonan", "Penetapan baru"], ["Tahun anggaran", "2026"]];
function DetailScreen() {
  const [tab, setTab] = React.useState("telaah");
  const [dlg, setDlg] = React.useState(false);
  const [keputusan, setKeputusan] = React.useState("setuju");
  const [done, setDone] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-page"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Dasbor",
      href: "#"
    }, {
      label: "Permohonan",
      href: "#"
    }, {
      label: "TRM-2026-004182"
    }]
  }), /*#__PURE__*/React.createElement(PageHead, {
    eyebrow: "Permohonan penetapan kawasan \xB7 TRM-2026-004182",
    title: "KTM Lamunti, Kabupaten Kapuas",
    desc: "Diusulkan Dinas Transmigrasi Kabupaten Kapuas, Kalimantan Tengah \xB7 masuk 22 Agustus 2026",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "printer"
      })
    }, "Cetak"), /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      onClick: () => {
        setKeputusan("tolak");
        setDlg(true);
      }
    }, "Tolak"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setKeputusan("setuju");
        setDlg(true);
      },
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check"
      })
    }, "Setujui"))
  }), done ? /*#__PURE__*/React.createElement(Alert, {
    tone: "success",
    title: "Keputusan tersimpan",
    onDismiss: () => setDone(false)
  }, "Keputusan tercatat dalam log audit dan dikirim ke dinas pengusul.") : /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "1 dokumen wajib belum diunggah"
  }, "Berita acara clean and clear lahan belum tersedia. Verifikasi dapat dilanjutkan dengan catatan perbaikan."), /*#__PURE__*/React.createElement("div", {
    className: "sim-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-detail__main"
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat"
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: "telaah",
      label: "Telaah berkas"
    }, {
      value: "dokumen",
      label: "Dokumen",
      count: 4
    }, {
      value: "riwayat",
      label: "Riwayat",
      count: 4
    }]
  }), tab === "telaah" && /*#__PURE__*/React.createElement("div", {
    className: "sim-kv"
  }, FAKTA.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "sim-kv__row"
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("strong", null, v))), /*#__PURE__*/React.createElement(Separator, {
    label: "Kesesuaian teknis"
  }), /*#__PURE__*/React.createElement(Progress, {
    label: "Kelengkapan berkas",
    value: 3,
    max: 4,
    valueLabel: "3 / 4 dokumen",
    tone: "warning"
  }), /*#__PURE__*/React.createElement(Progress, {
    label: "Kesesuaian tata ruang (RTRW)",
    value: 92
  })), tab === "dokumen" && /*#__PURE__*/React.createElement(Table, {
    density: "compact",
    rows: DOKUMEN.map((d, i) => ({
      id: i,
      ...d
    })),
    columns: [{
      key: "nama",
      label: "Dokumen wajib"
    }, {
      key: "file",
      label: "Berkas",
      render: r => /*#__PURE__*/React.createElement("span", {
        className: "sim-mono"
      }, r.file)
    }, {
      key: "ok",
      label: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.ok ? "success" : "danger",
        dot: true
      }, r.ok ? "Lengkap" : "Belum ada")
    }, {
      key: "a",
      label: "",
      width: "96px",
      render: r => r.ok ? /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "eye",
          size: "sm"
        })
      }, "Lihat") : /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline"
      }, "Minta")
    }]
  }), tab === "riwayat" && /*#__PURE__*/React.createElement("ol", {
    className: "sim-time"
  }, RIWAYAT.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.who,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-time__t"
  }, /*#__PURE__*/React.createElement("strong", null, r.who), " ", r.act), /*#__PURE__*/React.createElement("div", {
    className: "sim-time__m"
  }, r.role, " \xB7 ", r.at))))))), /*#__PURE__*/React.createElement("div", {
    className: "sim-detail__side"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Status permohonan",
    description: "SLA 7 hari kerja"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "warning",
    dot: true
  }, "Menunggu verifikasi"), /*#__PURE__*/React.createElement(Progress, {
    label: "Sisa waktu SLA",
    value: 2,
    max: 7,
    valueLabel: "hari ke-2 dari 7",
    tone: "info"
  }), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-kv__row"
  }, /*#__PURE__*/React.createElement("span", null, "Verifikator"), /*#__PURE__*/React.createElement("strong", null, "Siti Rahayu")), /*#__PURE__*/React.createElement("div", {
    className: "sim-kv__row"
  }, /*#__PURE__*/React.createElement("span", null, "Unit"), /*#__PURE__*/React.createElement("strong", null, "Ditjen PKP2Trans"))), /*#__PURE__*/React.createElement(Card, {
    title: "Peta kawasan",
    description: "Batas usulan \xB7 shapefile terunggah",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "external-link",
        size: "sm"
      })
    }, "Buka")
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-map"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: "xl"
  }), /*#__PURE__*/React.createElement("span", null, "Pratinjau peta hanya tersedia di lingkungan produksi."))), /*#__PURE__*/React.createElement(Card, {
    title: "Catatan verifikator"
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 3,
    placeholder: "Tulis catatan telaah\u2026"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    block: true
  }, "Simpan catatan")))), /*#__PURE__*/React.createElement(Dialog, {
    open: dlg,
    onClose: () => setDlg(false),
    title: "Catat keputusan verifikasi",
    description: "Keputusan bersifat final untuk tahap ini dan tercatat dalam log audit.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setDlg(false)
    }, "Batal"), /*#__PURE__*/React.createElement(Button, {
      variant: keputusan === "tolak" ? "destructive" : "default",
      onClick: () => {
        setDlg(false);
        setDone(true);
      }
    }, keputusan === "tolak" ? "Tolak permohonan" : "Simpan keputusan"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-dlgform"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    name: "kep",
    value: keputusan,
    onChange: setKeputusan,
    options: [{
      value: "setuju",
      label: "Setujui",
      description: "Lanjut ke penetapan Direktur Jenderal."
    }, {
      value: "perbaikan",
      label: "Kembalikan untuk perbaikan",
      description: "Dinas pengusul melengkapi dokumen dalam 14 hari."
    }, {
      value: "tolak",
      label: "Tolak",
      description: "Wajib menyertakan dasar penolakan."
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-dlgform__f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "cat",
    required: true
  }, "Catatan keputusan"), /*#__PURE__*/React.createElement(Textarea, {
    id: "cat",
    rows: 3,
    placeholder: "Dasar pertimbangan dan tindak lanjut"
  })), /*#__PURE__*/React.createElement(Switch, {
    label: "Kirim notifikasi email ke dinas pengusul",
    defaultChecked: true
  }))));
}
Object.assign(window, {
  DetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/simtrans/screen-detail.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/simtrans/screen-login.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Input,
  Label,
  Checkbox,
  Alert,
  Icon,
  Separator
} = NS;
function LoginScreen({
  onSignIn
}) {
  const [nip, setNip] = React.useState("198703142010011002");
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-login"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sim-login__plate"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-emblem.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__wm"
  }, "KEMENTERIAN TRANSMIGRASI"), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__wm2"
  }, "Kesejahteraan untuk semua"))), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__quote"
  }, "Satu data kawasan transmigrasi, dari usulan daerah sampai penempatan keluarga."), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__meta"
  }, "SIMTRANS v4.2 \xB7 Pusat Data dan Teknologi Informasi")), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__box"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "sim-login__h"
  }, "Masuk ke SIMTRANS"), /*#__PURE__*/React.createElement("p", {
    className: "sim-login__p"
  }, "Gunakan akun SSO kepegawaian Anda. Akses dicatat dalam log audit."), /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Pemeliharaan terjadwal"
  }, "Sabtu, 29 Agustus 2026, 22.00\u201302.00 WIB."), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__field"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "nip",
    required: true
  }, "NIP"), /*#__PURE__*/React.createElement(Input, {
    id: "nip",
    value: nip,
    onChange: e => setNip(e.target.value),
    inputMode: "numeric"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__field"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "pw",
    required: true
  }, "Kata sandi"), /*#__PURE__*/React.createElement(Input, {
    id: "pw",
    type: "password",
    defaultValue: "rahasia123",
    hint: "Minimal 12 karakter, diganti setiap 90 hari."
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__row"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Ingat perangkat ini",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("a", {
    href: "#lupa"
  }, "Lupa kata sandi?")), /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    onClick: onSignIn,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Masuk"), /*#__PURE__*/React.createElement(Separator, {
    label: "atau"
  }), /*#__PURE__*/React.createElement(Button, {
    block: true,
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "shield-check"
    }),
    onClick: onSignIn
  }, "Masuk dengan SSO ASN Digital"))));
}
Object.assign(window, {
  LoginScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/simtrans/screen-login.jsx", error: String((e && e.message) || e) }); }

// design_handoff/ui_kits/simtrans/screen-registri.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Table,
  Tabs,
  Pagination,
  Select,
  Input,
  Breadcrumb,
  Checkbox
} = NS;
const ROWS = [["KTM-01", "KTM Lamunti", "Kapuas, Kalimantan Tengah", 1200, "2019", "Terverifikasi", "success"], ["KTM-02", "KTM Tinanggea", "Konawe Selatan, Sulawesi Tenggara", 840, "2021", "Menunggu", "warning"], ["KTM-03", "KTM Salor", "Merauke, Papua Selatan", 615, "2020", "Perbaikan", "info"], ["KTM-04", "KTM Rasau Jaya", "Kubu Raya, Kalimantan Barat", 1024, "2018", "Terverifikasi", "success"], ["KTM-05", "KTM Kobisonta", "Maluku Tengah, Maluku", 430, "2022", "Ditolak", "danger"], ["KTM-06", "KTM Mesuji", "Mesuji, Lampung", 1580, "2017", "Terverifikasi", "success"], ["KTM-07", "KTM Pawonsari", "Bombana, Sulawesi Tenggara", 720, "2023", "Menunggu", "warning"], ["KTM-08", "KTM Belitang", "Sekadau, Kalimantan Barat", 905, "2019", "Arsip", "neutral"]].map(([kode, kawasan, daerah, kk, tahun, status, tone], i) => ({
  id: i,
  kode,
  kawasan,
  daerah,
  kk,
  tahun,
  status,
  tone
}));
function RegistriScreen({
  onOpen
}) {
  const [tab, setTab] = React.useState("semua");
  const [page, setPage] = React.useState(1);
  const rows = tab === "semua" ? ROWS : ROWS.filter(r => tab === "menunggu" ? r.status === "Menunggu" : r.status === "Terverifikasi");
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-page"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Dasbor",
      href: "#"
    }, {
      label: "Registri Kawasan"
    }]
  }), /*#__PURE__*/React.createElement(PageHead, {
    title: "Registri kawasan transmigrasi",
    desc: "1.284 catatan kawasan dari 27 provinsi. Data bersumber dari SK penetapan dan verifikasi lapangan.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "upload"
      })
    }, "Impor CSV"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus"
      })
    }, "Tambah kawasan"))
  }), /*#__PURE__*/React.createElement(Card, {
    variant: "flat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-toolbar"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search"
    }),
    placeholder: "Cari kode atau nama kawasan\u2026"
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "Semua provinsi",
    options: ["Kalimantan Tengah", "Kalimantan Barat", "Sulawesi Tenggara", "Papua Selatan", "Maluku", "Lampung"]
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "Semua tahun SK",
    options: ["2017", "2018", "2019", "2020", "2021", "2022", "2023"]
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "filter",
      size: "sm"
    })
  }, "Filter lanjutan")), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: "semua",
      label: "Semua",
      count: 1284
    }, {
      value: "menunggu",
      label: "Menunggu verifikasi",
      count: 24
    }, {
      value: "terverifikasi",
      label: "Terverifikasi",
      count: 1198
    }]
  }), /*#__PURE__*/React.createElement(Table, {
    zebra: true,
    rows: rows,
    onRowClick: () => onOpen("detail"),
    columns: [{
      key: "sel",
      label: /*#__PURE__*/React.createElement(Checkbox, {
        "aria-label": "Pilih semua"
      }),
      width: "36px",
      render: () => /*#__PURE__*/React.createElement(Checkbox, {
        "aria-label": "Pilih baris"
      })
    }, {
      key: "kode",
      label: "Kode",
      width: "84px",
      render: r => /*#__PURE__*/React.createElement("span", {
        className: "sim-mono"
      }, r.kode)
    }, {
      key: "kawasan",
      label: "Nama kawasan"
    }, {
      key: "daerah",
      label: "Kabupaten / provinsi"
    }, {
      key: "kk",
      label: "Daya tampung (KK)",
      numeric: true,
      render: r => r.kk.toLocaleString("id-ID")
    }, {
      key: "tahun",
      label: "Tahun SK",
      numeric: true
    }, {
      key: "status",
      label: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.status)
    }, {
      key: "aksi",
      label: "",
      width: "40px",
      render: () => /*#__PURE__*/React.createElement(Button, {
        size: "icon",
        variant: "ghost",
        "aria-label": "Aksi baris"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "ellipsis-vertical"
      }))
    }]
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: 161,
    totalItems: 1284,
    onChange: setPage
  })));
}
Object.assign(window, {
  RegistriScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "design_handoff/ui_kits/simtrans/screen-registri.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kawasan-crud/app.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Input,
  Label,
  Select,
  Breadcrumb,
  Pagination,
  Alert,
  Dialog,
  Separator
} = NS;
const STORE_KEY = "tds-kawasan-crud-v1";
const STATUS_OPTIONS = ["Berkembang", "Mandiri", "Berdaya Saing"];
const STATUS_TONE = {
  "Berdaya Saing": "success",
  Mandiri: "info",
  Berkembang: "warning"
};
const PAGE_SIZE = 15;
const fmt = n => n == null ? "—" : n.toLocaleString("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
const emptyForm = {
  kawasan: "",
  ipktrans2024: "",
  status2024: "Berkembang",
  intrans2025: "",
  proyeksi2025: "",
  status2025: "Berkembang"
};
function loadInitial() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return window.KAWASAN_SEED;
}
function StatCard({
  label,
  value,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "kc-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "kc-stat__l"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "kc-stat__v"
  }, value), sub && /*#__PURE__*/React.createElement("span", {
    className: "kc-stat__s"
  }, sub));
}
function KawasanForm({
  value,
  onChange
}) {
  const set = k => e => onChange({
    ...value,
    [k]: e.target ? e.target.value : e
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "kc-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-nama",
    required: true
  }, "Nama kawasan"), /*#__PURE__*/React.createElement(Input, {
    id: "f-nama",
    value: value.kawasan,
    onChange: set("kawasan"),
    placeholder: "Contoh: KTM Lamunti"
  })), /*#__PURE__*/React.createElement(Separator, {
    label: "Hasil pengukuran 2024"
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-ip",
    required: true
  }, "Nilai IPKTRANS"), /*#__PURE__*/React.createElement(Input, {
    id: "f-ip",
    inputMode: "decimal",
    value: value.ipktrans2024,
    onChange: set("ipktrans2024"),
    placeholder: "0-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-s24",
    required: true
  }, "Status"), /*#__PURE__*/React.createElement(Select, {
    id: "f-s24",
    value: value.status2024,
    onChange: set("status2024"),
    options: STATUS_OPTIONS
  }))), /*#__PURE__*/React.createElement(Separator, {
    label: "Hasil pengukuran 2025"
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-in"
  }, "INTRANS (pengukuran langsung)"), /*#__PURE__*/React.createElement(Input, {
    id: "f-in",
    inputMode: "decimal",
    value: value.intrans2025,
    onChange: set("intrans2025"),
    placeholder: "Kosongkan jika belum diukur"
  })), /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-pj",
    required: true
  }, "Proyeksi nilai INTRANS"), /*#__PURE__*/React.createElement(Input, {
    id: "f-pj",
    inputMode: "decimal",
    value: value.proyeksi2025,
    onChange: set("proyeksi2025"),
    placeholder: "0-1"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "kc-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "f-s25",
    required: true
  }, "Status 2025"), /*#__PURE__*/React.createElement(Select, {
    id: "f-s25",
    value: value.status2025,
    onChange: set("status2025"),
    options: STATUS_OPTIONS
  })));
}
function KawasanCrudApp() {
  const [rows, setRows] = React.useState(loadInitial);
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [dialog, setDialog] = React.useState(null); // {mode:"add"|"edit", id?}
  const [form, setForm] = React.useState(emptyForm);
  const [toast, setToast] = React.useState(null);
  const [delId, setDelId] = React.useState(null);
  React.useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(rows));
    } catch (e) {}
  }, [rows]);
  const filtered = React.useMemo(() => rows.filter(r => (!q || r.kawasan.toLowerCase().includes(q.toLowerCase())) && (!statusFilter || r.status2025 === statusFilter)), [rows, q, statusFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const avgIp = rows.length ? rows.reduce((s, r) => s + Number(r.ipktrans2024), 0) / rows.length : 0;
  const measured = rows.filter(r => r.intrans2025 != null);
  const avgMeasured = measured.length ? measured.reduce((s, r) => s + Number(r.intrans2025), 0) / measured.length : null;
  const avgProy = rows.length ? rows.reduce((s, r) => s + Number(r.proyeksi2025), 0) / rows.length : 0;
  const counts = STATUS_OPTIONS.reduce((a, s) => {
    a[s] = rows.filter(r => r.status2025 === s).length;
    return a;
  }, {});
  const openAdd = () => {
    setForm(emptyForm);
    setDialog({
      mode: "add"
    });
  };
  const openEdit = r => {
    setForm({
      kawasan: r.kawasan,
      ipktrans2024: r.ipktrans2024,
      status2024: r.status2024,
      intrans2025: r.intrans2025 ?? "",
      proyeksi2025: r.proyeksi2025,
      status2025: r.status2025
    });
    setDialog({
      mode: "edit",
      id: r.id
    });
  };
  const save = () => {
    if (!form.kawasan.trim() || form.ipktrans2024 === "" || form.proyeksi2025 === "") return;
    const payload = {
      kawasan: form.kawasan.trim(),
      ipktrans2024: Number(form.ipktrans2024),
      status2024: form.status2024,
      intrans2025: form.intrans2025 === "" ? null : Number(form.intrans2025),
      proyeksi2025: Number(form.proyeksi2025),
      status2025: form.status2025
    };
    if (dialog.mode === "add") {
      setRows(r => [...r, {
        id: "kws-" + Date.now(),
        ...payload
      }]);
      setToast({
        tone: "success",
        title: "Kawasan ditambahkan",
        body: `${payload.kawasan} tersimpan dalam registri.`
      });
    } else {
      setRows(r => r.map(x => x.id === dialog.id ? {
        ...x,
        ...payload
      } : x));
      setToast({
        tone: "success",
        title: "Kawasan diperbarui",
        body: `${payload.kawasan} tersimpan dalam registri.`
      });
    }
    setDialog(null);
  };
  const confirmDelete = () => {
    const target = rows.find(r => r.id === delId);
    setRows(r => r.filter(x => x.id !== delId));
    setDelId(null);
    setToast({
      tone: "danger",
      title: "Kawasan dihapus",
      body: target ? `${target.kawasan} dihapus dari registri.` : undefined
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "kc-page"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Beranda",
      href: "#"
    }, {
      label: "Data & Statistik",
      href: "#"
    }, {
      label: "Kawasan Prioritas Nasional"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "kc-eyebrow"
  }, "Data & statistik \xB7 tahun anggaran 2025"), /*#__PURE__*/React.createElement("h1", null, "45 kawasan prioritas nasional tahun 2025"), /*#__PURE__*/React.createElement("p", null, "Indeks Pembangunan Kawasan Transmigrasi (IPKTRANS) 2024 dibandingkan dengan hasil dan proyeksi Indeks Transmigrasi (INTRANS) 2025.")), /*#__PURE__*/React.createElement("div", {
    className: "kc-head__a"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "download"
    })
  }, "Ekspor CSV"), /*#__PURE__*/React.createElement(Button, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus"
    }),
    onClick: openAdd
  }, "Tambah kawasan"))), toast && /*#__PURE__*/React.createElement(Alert, {
    tone: toast.tone,
    title: toast.title,
    onDismiss: () => setToast(null)
  }, toast.body), /*#__PURE__*/React.createElement("div", {
    className: "kc-stats"
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Total kawasan",
    value: rows.length,
    sub: "terdaftar dalam registri"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Rata-rata IPKTRANS 2024",
    value: fmt(avgIp)
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Rata-rata INTRANS terukur",
    value: avgMeasured == null ? "—" : fmt(avgMeasured),
    sub: `${measured.length} dari ${rows.length} kawasan diukur langsung`
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Rata-rata proyeksi INTRANS 2025",
    value: fmt(avgProy)
  })), /*#__PURE__*/React.createElement(Card, {
    variant: "flat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kc-toolbar"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search"
    }),
    placeholder: "Cari nama kawasan\u2026",
    value: q,
    onChange: e => {
      setQ(e.target.value);
      setPage(1);
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "Semua status 2025",
    value: statusFilter,
    onChange: e => {
      setStatusFilter(e.target.value);
      setPage(1);
    },
    options: STATUS_OPTIONS
  }), /*#__PURE__*/React.createElement("div", {
    className: "kc-toolbar__badges"
  }, STATUS_OPTIONS.map(s => /*#__PURE__*/React.createElement(Badge, {
    key: s,
    tone: STATUS_TONE[s],
    dot: true
  }, s, " \xB7 ", counts[s])))), /*#__PURE__*/React.createElement("div", {
    className: "kc-tablewrap"
  }, /*#__PURE__*/React.createElement("table", {
    className: "kc-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    rowSpan: 2,
    className: "kc-num",
    style: {
      width: "44px"
    }
  }, "No."), /*#__PURE__*/React.createElement("th", {
    rowSpan: 2
  }, "Kawasan"), /*#__PURE__*/React.createElement("th", {
    colSpan: 2,
    className: "kc-grp"
  }, "Hasil pengukuran 2024"), /*#__PURE__*/React.createElement("th", {
    colSpan: 3,
    className: "kc-grp"
  }, "Hasil pengukuran 2025"), /*#__PURE__*/React.createElement("th", {
    rowSpan: 2,
    style: {
      width: "84px"
    }
  }, "Aksi")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "kc-num"
  }, "IPKTRANS"), /*#__PURE__*/React.createElement("th", null, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "kc-num"
  }, "INTRANS (langsung)"), /*#__PURE__*/React.createElement("th", {
    className: "kc-num"
  }, "Proyeksi INTRANS"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, pageRows.length === 0 && /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 8,
    className: "kc-empty"
  }, "Tidak ada kawasan yang cocok dengan pencarian.")), pageRows.map((r, i) => /*#__PURE__*/React.createElement("tr", {
    key: r.id
  }, /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, (page - 1) * PAGE_SIZE + i + 1), /*#__PURE__*/React.createElement("td", {
    className: "kc-name"
  }, r.kawasan), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(r.ipktrans2024)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[r.status2024],
    dot: true
  }, r.status2024)), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(r.intrans2025)), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(r.proyeksi2025)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(Badge, {
    tone: STATUS_TONE[r.status2025],
    dot: true
  }, r.status2025)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "kc-rowa"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Ubah kawasan",
    onClick: () => openEdit(r)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pencil",
    size: "sm"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Hapus kawasan",
    onClick: () => setDelId(r.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trash-2",
    size: "sm"
  }))))))), rows.length > 0 && /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    className: "kc-avglabel"
  }, "Rata-rata"), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(avgIp)), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, avgMeasured == null ? "—" : fmt(avgMeasured)), /*#__PURE__*/React.createElement("td", {
    className: "kc-num"
  }, fmt(avgProy)), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null))))), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: totalPages,
    totalItems: filtered.length,
    onChange: setPage
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: !!dialog,
    onClose: () => setDialog(null),
    size: "lg",
    title: dialog?.mode === "add" ? "Tambah kawasan" : "Ubah kawasan",
    description: "Data indeks digunakan untuk pemantauan capaian kawasan prioritas nasional.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setDialog(null)
    }, "Batal"), /*#__PURE__*/React.createElement(Button, {
      onClick: save
    }, "Simpan"))
  }, dialog && /*#__PURE__*/React.createElement(KawasanForm, {
    value: form,
    onChange: setForm
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: !!delId,
    onClose: () => setDelId(null),
    size: "sm",
    title: "Hapus kawasan?",
    description: "Tindakan ini tidak dapat dibatalkan.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setDelId(null)
    }, "Batal"), /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      onClick: confirmDelete
    }, "Hapus"))
  }, "Kawasan akan dihapus dari registri 45 kawasan prioritas nasional."));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(KawasanCrudApp, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kawasan-crud/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kawasan-crud/data.js
try { (() => {
window.KAWASAN_SEED = [["Rasau Jaya", 82.86, "Berdaya Saing", 0.62, 0.62, "Mandiri"], ["Lagita", 80.47, "Berdaya Saing", 0.62, 0.62, "Mandiri"], ["Cahaya Baru", 79.29, "Berdaya Saing", 0.59, 0.59, "Mandiri"], ["Mahalona", 67.58, "Mandiri", 0.58, 0.58, "Mandiri"], ["Tobadak", 76.21, "Berdaya Saing", 0.57, 0.57, "Mandiri"], ["Lunang Silaut", 84.93, "Berdaya Saing", 0.56, 0.56, "Mandiri"], ["Telang", 78.67, "Berdaya Saing", 0.53, 0.53, "Mandiri"], ["Salor", 68.65, "Mandiri", 0.58, 0.58, "Berkembang"], ["Jelai (Pulau Nibung)", 43.27, "Berkembang", 0.54, 0.54, "Berkembang"], ["Pituriase", 48.72, "Berkembang", 0.53, 0.53, "Berkembang"], ["Petata", 46.13, "Berkembang", 0.53, 0.53, "Berkembang"], ["Parit Rambutan", 50.12, "Mandiri", 0.52, 0.52, "Berkembang"], ["Tasifeto - Mandeu", 41.36, "Berkembang", 0.51, 0.51, "Berkembang"], ["Selaut", 66.78, "Mandiri", 0.49, 0.49, "Berkembang"], ["Selaparang", 47.26, "Berkembang", 0.46, 0.46, "Berkembang"], ["Batu Betumpang", 81.36, "Berdaya Saing", 0.59, 0.59, "Berkembang"], ["Sarudu Baras", 64.20, "Mandiri", 0.55, 0.55, "Berkembang"], ["Bungku", 53.20, "Mandiri", null, 0.44, "Berkembang"], ["Mutiara", 62.44, "Mandiri", null, 0.53, "Berkembang"], ["Sumalata", 65.00, "Mandiri", null, 0.56, "Berkembang"], ["Salim Batu", 53.49, "Mandiri", null, 0.44, "Berkembang"], ["Palolo", 61.24, "Mandiri", null, 0.52, "Berkembang"], ["Gerbang Masperkasa", 63.76, "Mandiri", null, 0.55, "Berkembang"], ["Asinua/Routa", 50.12, "Mandiri", null, 0.41, "Berkembang"], ["Tampolore", 53.13, "Mandiri", null, 0.44, "Berkembang"], ["Kikim", 54.25, "Mandiri", null, 0.45, "Berkembang"], ["Ponu", 51.05, "Mandiri", null, 0.42, "Berkembang"], ["Pulau Morotai", 48.55, "Berkembang", null, 0.55, "Berkembang"], ["Kobalima Timur", 52.14, "Mandiri", null, 0.43, "Berkembang"], ["Kerang", 47.93, "Mandiri", null, 0.54, "Berkembang"], ["Muting", 58.09, "Mandiri", null, 0.49, "Berkembang"], ["Senggi", 46.92, "Mandiri", null, 0.53, "Berkembang"], ["Tubbi Taramanu", 39.11, "Berkembang", null, 0.45, "Berkembang"], ["Anawua", 30.30, "Berkembang", null, 0.36, "Berkembang"], ["Lamunti - Dadahup", 55.97, "Mandiri", null, 0.47, "Berkembang"], ["Ulumanda", 48.81, "Berkembang", null, 0.55, "Berkembang"], ["Patlean", 29.19, "Berkembang", null, 0.35, "Berkembang"], ["Mambi Mehalaan", 54.77, "Mandiri", null, 0.46, "Berkembang"], ["Sekayam - Entikong", 43.41, "Berkembang", null, 0.49, "Berkembang"], ["Ketungau Hulu", 36.29, "Berkembang", null, 0.42, "Berkembang"], ["Sagea Waleh", 19.37, "Berkembang", null, 0.25, "Berkembang"], ["Muara Takung - Kamang Baru", 43.80, "Berkembang", null, 0.50, "Berkembang"], ["Pulau Bacan", 32.14, "Berkembang", null, 0.38, "Berkembang"], ["Klamono - Segun", 41.96, "Berkembang", null, 0.48, "Berkembang"], ["Arut Selatan dan Kota Waringin Lama", 61.66, "Mandiri", null, 0.53, "Berkembang"]].map(([kawasan, ipktrans2024, status2024, intrans2025, proyeksi2025, status2025], i) => ({
  id: "kws-" + (i + 1),
  kawasan,
  ipktrans2024,
  status2024,
  intrans2025,
  proyeksi2025,
  status2025
}));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kawasan-crud/data.js", error: String((e && e.message) || e) }); }

// ui_kits/portal/screen-beranda.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Icon,
  Card,
  Badge,
  Separator,
  Progress,
  Tabs
} = NS;
const LAYANAN = [{
  icon: "map-pin",
  t: "Penetapan kawasan transmigrasi",
  d: "Usulan pemerintah daerah untuk penetapan kawasan baru atau perluasan.",
  who: "Pemerintah daerah"
}, {
  icon: "users",
  t: "Pendaftaran calon transmigran",
  d: "Pendaftaran keluarga calon transmigran beserta verifikasi berkas.",
  who: "Masyarakat"
}, {
  icon: "file-check-2",
  t: "Legalisasi hak atas tanah",
  d: "Permohonan sertifikasi lahan pekarangan dan lahan usaha.",
  who: "Transmigran"
}, {
  icon: "sprout",
  t: "Bantuan sarana produksi",
  d: "Pengajuan bantuan bibit, alat, dan pendampingan usaha tani.",
  who: "Kelompok tani"
}, {
  icon: "database",
  t: "Data kawasan terbuka",
  d: "Unduh data kawasan, daya tampung, dan capaian penempatan.",
  who: "Umum"
}, {
  icon: "message-square-warning",
  t: "Pengaduan masyarakat",
  d: "Sampaikan aduan pelayanan; ditindaklanjuti dalam 5 hari kerja.",
  who: "Umum"
}];
const BERITA = [{
  tag: "Kebijakan",
  t: "Tiga kawasan transmigrasi baru ditetapkan di Papua Selatan",
  d: "24 Agustus 2026",
  x: "Penetapan mencakup 8.400 hektare dengan daya tampung 1.950 keluarga."
}, {
  tag: "Program",
  t: "Sertifikasi 12.400 bidang lahan transmigran tuntas tahun ini",
  d: "19 Agustus 2026",
  x: "Kerja sama dengan Kementerian ATR/BPN mempercepat legalisasi aset."
}, {
  tag: "Data",
  t: "Portal data kawasan kini menyediakan unduhan format shapefile",
  d: "11 Agustus 2026",
  x: "Pemerintah daerah dapat mengunduh batas kawasan resmi tanpa permohonan."
}];
function BerandaScreen({
  onNavigate
}) {
  const [tab, setTab] = React.useState("2026");
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    className: "pt-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-hero__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__txt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-eyebrow"
  }, "Tata kelola digital transmigrasi"), /*#__PURE__*/React.createElement("h1", null, "Satu data kawasan, satu pintu layanan."), /*#__PURE__*/React.createElement("p", null, "Ajukan penetapan kawasan, pantau penempatan keluarga, dan akses data resmi transmigrasi Indonesia dalam satu portal."), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__cta"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onNavigate("layanan"),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Ajukan permohonan"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "download"
    })
  }, "Unduh data kawasan")), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__meta"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: "sm"
  }), " Terhubung dengan SSO ASN Digital dan Satu Data Indonesia")), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__cardhd"
  }, "Capaian nasional"), /*#__PURE__*/React.createElement(Tabs, {
    variant: "pill",
    value: tab,
    onChange: setTab,
    items: [{
      value: "2026",
      label: "2026"
    }, {
      value: "2025",
      label: "2025"
    }, {
      value: "kumulatif",
      label: "Kumulatif"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-figs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "52"), /*#__PURE__*/React.createElement("span", null, "kawasan aktif")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "12.740"), /*#__PURE__*/React.createElement("span", null, "KK ditempatkan")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "27"), /*#__PURE__*/React.createElement("span", null, "provinsi"))), /*#__PURE__*/React.createElement(Progress, {
    label: "Realisasi target penempatan",
    value: 68,
    valueLabel: "68%"
  }), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-hero__note"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: "sm"
  }), " Diperbarui 24 Agustus 2026, 06.00 WIB")))), /*#__PURE__*/React.createElement("section", {
    className: "pt-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-sechd"
  }, /*#__PURE__*/React.createElement("h2", null, "Layanan"), /*#__PURE__*/React.createElement("a", {
    href: "#semua"
  }, "Lihat semua layanan ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: "sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-grid3"
  }, LAYANAN.map(l => /*#__PURE__*/React.createElement(Card, {
    key: l.t,
    interactive: true,
    onClick: () => onNavigate("layanan"),
    title: l.t,
    description: l.d,
    action: /*#__PURE__*/React.createElement("span", {
      className: "pt-layicon"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: l.icon,
      size: "lg"
    })),
    footer: /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral"
    }, l.who),
    footerBordered: true
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "pt-sec pt-sec--tint"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-split"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-peta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-peta__ph"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: "xl"
  }), /*#__PURE__*/React.createElement("span", null, "Peta sebaran kawasan tersedia pada portal produksi (WebGIS Satu Data)."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pt-eyebrow"
  }, "Sebaran kawasan"), /*#__PURE__*/React.createElement("h2", null, "52 kawasan transmigrasi di 27 provinsi"), /*#__PURE__*/React.createElement("p", {
    className: "pt-lead"
  }, "Setiap kawasan memiliki halaman profil terbuka: SK penetapan, luas, daya tampung, capaian penempatan, dan kontak dinas pengelola."), /*#__PURE__*/React.createElement("div", {
    className: "pt-list"
  }, [["Kalimantan Tengah", "12 kawasan"], ["Sulawesi Tenggara", "9 kawasan"], ["Papua Selatan", "7 kawasan"], ["Kalimantan Barat", "6 kawasan"]].map(([p, k]) => /*#__PURE__*/React.createElement("div", {
    key: p,
    className: "pt-list__row"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: "sm"
  }), /*#__PURE__*/React.createElement("strong", null, p), /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: "sm"
  })))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Jelajahi semua kawasan")))), /*#__PURE__*/React.createElement("section", {
    className: "pt-sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-sechd"
  }, /*#__PURE__*/React.createElement("h2", null, "Berita & siaran pers"), /*#__PURE__*/React.createElement("a", {
    href: "#berita"
  }, "Semua berita ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: "sm"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-grid3"
  }, BERITA.map(b => /*#__PURE__*/React.createElement("article", {
    key: b.t,
    className: "pt-news"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-news__img"
  }, /*#__PURE__*/React.createElement("span", null, "Foto siaran pers")), /*#__PURE__*/React.createElement(Badge, {
    tone: "primary"
  }, b.tag), /*#__PURE__*/React.createElement("h3", null, b.t), /*#__PURE__*/React.createElement("p", null, b.x), /*#__PURE__*/React.createElement("time", null, b.d)))))), /*#__PURE__*/React.createElement("section", {
    className: "pt-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-cta__in"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Punya pertanyaan tentang layanan transmigrasi?"), /*#__PURE__*/React.createElement("p", null, "Layanan informasi publik buka Senin\u2013Jumat, 08.00\u201316.00 WIB.")), /*#__PURE__*/React.createElement("div", {
    className: "pt-cta__b"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "phone"
    })
  }, "Hubungi kami"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "message-square-warning"
    })
  }, "Sampaikan aduan")))));
}
Object.assign(window, {
  BerandaScreen,
  LAYANAN
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/screen-beranda.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/screen-layanan.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Icon,
  Card,
  Badge,
  Input,
  Label,
  Select,
  Textarea,
  Checkbox,
  RadioGroup,
  Alert,
  Breadcrumb,
  Separator,
  Progress,
  Dialog
} = NS;
function LayananScreen({
  onNavigate
}) {
  const [step, setStep] = React.useState(1);
  const [jenis, setJenis] = React.useState("baru");
  const [sent, setSent] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const steps = ["Data pengusul", "Data kawasan", "Dokumen", "Pernyataan"];
  return /*#__PURE__*/React.createElement("main", {
    className: "pt-form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Beranda",
      href: "#"
    }, {
      label: "Layanan",
      href: "#"
    }, {
      label: "Penetapan kawasan transmigrasi"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-formhd"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pt-eyebrow"
  }, "Layanan pemerintah daerah"), /*#__PURE__*/React.createElement("h1", null, "Permohonan penetapan kawasan transmigrasi"), /*#__PURE__*/React.createElement("p", {
    className: "pt-lead"
  }, "Formulir ini diajukan oleh dinas yang menangani transmigrasi di kabupaten/kota. Waktu penyelesaian 7 hari kerja sejak berkas lengkap. Tidak dipungut biaya.")), /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Ringkasan layanan"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Biaya"), /*#__PURE__*/React.createElement("strong", null, "Gratis")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Waktu"), /*#__PURE__*/React.createElement("strong", null, "7 hari kerja")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Dasar hukum"), /*#__PURE__*/React.createElement("strong", null, "PP 3/2014")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Pemohon"), /*#__PURE__*/React.createElement("strong", null, "Pemerintah daerah")))), sent && /*#__PURE__*/React.createElement(Alert, {
    tone: "success",
    title: "Permohonan terkirim",
    onDismiss: () => setSent(false)
  }, "Nomor registrasi TRM-2026-004182. Pantau status melalui menu Permohonan Saya."), /*#__PURE__*/React.createElement("div", {
    className: "pt-steps"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s,
    className: "pt-step" + (i + 1 === step ? " pt-step--on" : "") + (i + 1 < step ? " pt-step--done" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "pt-step__n"
  }, i + 1 < step ? /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: "sm"
  }) : i + 1), s))), /*#__PURE__*/React.createElement(Progress, {
    size: "sm",
    value: step,
    max: steps.length,
    label: `Langkah ${step} dari ${steps.length}`,
    valueLabel: steps[step - 1]
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-formgrid"
  }, /*#__PURE__*/React.createElement(Card, null, step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "dinas",
    required: true
  }, "Nama dinas pengusul"), /*#__PURE__*/React.createElement(Input, {
    id: "dinas",
    defaultValue: "Dinas Transmigrasi Kabupaten Kapuas"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "prov",
    required: true
  }, "Provinsi"), /*#__PURE__*/React.createElement(Select, {
    id: "prov",
    options: ["Kalimantan Tengah", "Kalimantan Barat", "Sulawesi Tenggara", "Papua Selatan", "Maluku"]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "pic",
    required: true
  }, "Nama pejabat penanggung jawab"), /*#__PURE__*/React.createElement(Input, {
    id: "pic",
    placeholder: "Nama lengkap dan gelar"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "nip",
    required: true
  }, "NIP"), /*#__PURE__*/React.createElement(Input, {
    id: "nip",
    inputMode: "numeric",
    placeholder: "18 digit NIP",
    hint: "Tanpa spasi atau tanda baca."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "em",
    required: true
  }, "Email dinas"), /*#__PURE__*/React.createElement(Input, {
    id: "em",
    type: "email",
    placeholder: "nama@kapuaskab.go.id"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "tel",
    required: true
  }, "Telepon"), /*#__PURE__*/React.createElement(Input, {
    id: "tel",
    placeholder: "(0513) 000000"
  })))), step === 2 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    required: true
  }, "Jenis permohonan"), /*#__PURE__*/React.createElement(RadioGroup, {
    name: "jenis",
    value: jenis,
    onChange: setJenis,
    options: [{
      value: "baru",
      label: "Penetapan kawasan baru",
      description: "Kawasan belum pernah ditetapkan."
    }, {
      value: "perluasan",
      label: "Perluasan kawasan",
      description: "Menambah satuan permukiman pada kawasan yang sudah ada."
    }, {
      value: "revisi",
      label: "Revisi batas kawasan"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "nk",
    required: true
  }, "Nama kawasan"), /*#__PURE__*/React.createElement(Input, {
    id: "nk",
    placeholder: "Contoh: KTM Lamunti"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "lu",
    required: true
  }, "Luas diusulkan (ha)"), /*#__PURE__*/React.createElement(Input, {
    id: "lu",
    inputMode: "decimal",
    placeholder: "12480"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "dt",
    required: true
  }, "Daya tampung (KK)"), /*#__PURE__*/React.createElement(Input, {
    id: "dt",
    inputMode: "numeric",
    placeholder: "1200"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "st"
  }, "Status lahan dominan"), /*#__PURE__*/React.createElement(Select, {
    id: "st",
    placeholder: "Pilih status",
    options: ["APL", "HPK", "Hutan produksi konversi", "Lainnya"]
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "ket"
  }, "Uraian singkat usulan"), /*#__PURE__*/React.createElement(Textarea, {
    id: "ket",
    rows: 4,
    placeholder: "Latar belakang, kesesuaian RTRW, dan rencana pengembangan usaha."
  }))), step === 3 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Format berkas"
  }, "PDF atau ZIP, maksimal 25 MB per dokumen. Berkas dipindai otomatis."), [["SK Bupati penetapan lokasi", true], ["Peta batas kawasan (shapefile)", true], ["Rencana rinci satuan kawasan", true], ["Berita acara clean and clear lahan", false]].map(([d, ok]) => /*#__PURE__*/React.createElement("div", {
    key: d,
    className: "pt-up" + (ok ? " pt-up--ok" : "")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ok ? "file-check-2" : "upload",
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, d), /*#__PURE__*/React.createElement("span", null, ok ? "sk-bupati-2026-114.pdf · 2,4 MB" : "Wajib · belum diunggah")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: ok ? "ghost" : "outline"
  }, ok ? "Ganti" : "Pilih berkas")))), step === 4 && /*#__PURE__*/React.createElement("div", {
    className: "pt-fields"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-decl"
  }, /*#__PURE__*/React.createElement("h3", null, "Surat pernyataan"), /*#__PURE__*/React.createElement("p", null, "Dengan ini kami menyatakan bahwa data dan dokumen yang disampaikan dalam permohonan ini benar, sah, dan dapat dipertanggungjawabkan. Kami bersedia menerima sanksi sesuai ketentuan peraturan perundang-undangan apabila di kemudian hari ditemukan ketidaksesuaian.")), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Saya menyatakan seluruh data benar dan sah",
    description: "Pernyataan ini setara tanda tangan elektronik."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Saya menyetujui pemrosesan data sesuai kebijakan privasi"
  }), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Kawasan"), /*#__PURE__*/React.createElement("strong", null, "KTM Lamunti")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Jenis"), /*#__PURE__*/React.createElement("strong", null, jenis === "baru" ? "Penetapan kawasan baru" : jenis === "perluasan" ? "Perluasan kawasan" : "Revisi batas kawasan")), /*#__PURE__*/React.createElement("div", {
    className: "pt-kv"
  }, /*#__PURE__*/React.createElement("span", null, "Dokumen"), /*#__PURE__*/React.createElement("strong", null, "3 dari 4 lengkap"))), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "pt-formnav"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    disabled: step === 1,
    onClick: () => setStep(step - 1),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left"
    })
  }, "Sebelumnya"), step < 4 ? /*#__PURE__*/React.createElement(Button, {
    onClick: () => setStep(step + 1),
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Lanjut") : /*#__PURE__*/React.createElement(Button, {
    onClick: () => setConfirm(true),
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "send"
    })
  }, "Kirim permohonan"))), /*#__PURE__*/React.createElement("aside", {
    className: "pt-aside"
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Dokumen yang perlu disiapkan"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "pt-ul"
  }, /*#__PURE__*/React.createElement("li", null, "SK Bupati/Wali Kota penetapan lokasi"), /*#__PURE__*/React.createElement("li", null, "Peta batas kawasan format shapefile"), /*#__PURE__*/React.createElement("li", null, "Rencana rinci satuan kawasan"), /*#__PURE__*/React.createElement("li", null, "Berita acara clean and clear lahan"))), /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Butuh bantuan?"
  }, /*#__PURE__*/React.createElement("p", {
    className: "pt-help"
  }, "Layanan informasi publik, Senin\u2013Jumat 08.00\u201316.00 WIB."), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "phone"
    })
  }, "(021) 7940327"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    block: true,
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "book-open"
    })
  }, "Panduan pengisian (PDF)")), /*#__PURE__*/React.createElement("div", {
    className: "pt-badgebox"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "Layanan aktif"), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "Tanpa biaya"))))), /*#__PURE__*/React.createElement(Dialog, {
    open: confirm,
    onClose: () => setConfirm(false),
    size: "sm",
    title: "Kirim permohonan?",
    description: "Setelah terkirim, berkas tidak dapat diubah kecuali dikembalikan untuk perbaikan.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setConfirm(false)
    }, "Periksa lagi"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setConfirm(false);
        setSent(true);
        setStep(1);
      }
    }, "Kirim"))
  }, "Pastikan seluruh dokumen wajib telah diunggah. Saat ini 3 dari 4 dokumen lengkap."));
}
Object.assign(window, {
  LayananScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/screen-layanan.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/site-chrome.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Icon,
  Badge,
  Input
} = NS;
const MENU = ["Profil", "Layanan", "Kawasan", "Data & Statistik", "Berita", "Pengaduan"];
function TopStrip() {
  return /*#__PURE__*/React.createElement("div", {
    className: "pt-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-strip__in"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Icon, {
    name: "landmark",
    size: "sm"
  }), " Situs resmi Kementerian Transmigrasi Republik Indonesia"), /*#__PURE__*/React.createElement("span", {
    className: "pt-strip__r"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#bahasa"
  }, "Bahasa Indonesia"), /*#__PURE__*/React.createElement("span", {
    className: "pt-dot"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#en"
  }, "English"), /*#__PURE__*/React.createElement("span", {
    className: "pt-dot"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#kontras"
  }, "Mode kontras tinggi"))));
}
function SiteHeader({
  onNavigate,
  active
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "pt-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-head__in"
  }, /*#__PURE__*/React.createElement("a", {
    className: "pt-brand",
    href: "#beranda",
    onClick: () => onNavigate("beranda")
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-lockup.png",
    alt: "Kementerian Transmigrasi Republik Indonesia \u2014 Kesejahteraan untuk semua"
  })), /*#__PURE__*/React.createElement("nav", {
    className: "pt-nav"
  }, MENU.map(m => /*#__PURE__*/React.createElement("a", {
    key: m,
    href: "#" + m,
    className: active === m ? "pt-nav--on" : undefined,
    onClick: e => {
      e.preventDefault();
      onNavigate(m === "Layanan" ? "layanan" : "beranda");
    }
  }, m))), /*#__PURE__*/React.createElement("div", {
    className: "pt-head__a"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Cari"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search"
  })), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => onNavigate("layanan")
  }, "Masuk SIMTRANS"))));
}
function SiteFooter() {
  const cols = [["Layanan", ["Permohonan penetapan kawasan", "Pendaftaran calon transmigran", "Data kawasan terbuka", "Pengaduan masyarakat"]], ["Informasi", ["Profil kementerian", "Struktur organisasi", "Rencana strategis", "Laporan kinerja"]], ["Keterbukaan", ["PPID", "LHKPN", "Whistleblowing system", "Pengadaan barang & jasa"]]];
  return /*#__PURE__*/React.createElement("footer", {
    className: "pt-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-foot__in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pt-foot__plate"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-emblem.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__wm"
  }, "KEMENTERIAN TRANSMIGRASI"), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__wm2"
  }, "Kesejahteraan untuk semua"), /*#__PURE__*/React.createElement("p", null, "Jl. TMP Kalibata No. 17, Jakarta Selatan 12750", /*#__PURE__*/React.createElement("br", null), "Telepon (021) 7940327 \xB7 halo@transmigrasi.go.id"), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__badges"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "SPBE"), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "WBK/WBBM"), /*#__PURE__*/React.createElement(Badge, {
    tone: "outline"
  }, "ISO 27001")))), cols.map(([t, items]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    className: "pt-foot__col"
  }, /*#__PURE__*/React.createElement("h4", null, t), items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#" + i
  }, i)))), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__col"
  }, /*#__PURE__*/React.createElement("h4", null, "Buletin transmigrasi"), /*#__PURE__*/React.createElement("p", {
    className: "pt-foot__p"
  }, "Ringkasan kebijakan dan data kawasan, dikirim sebulan sekali."), /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    placeholder: "Alamat email"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline"
  }, "Berlangganan"))), /*#__PURE__*/React.createElement("div", {
    className: "pt-foot__bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pt-wrap pt-foot__barin"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Kementerian Transmigrasi Republik Indonesia"), /*#__PURE__*/React.createElement("span", null, "Peta situs \xB7 Kebijakan privasi \xB7 Aksesibilitas"))));
}
Object.assign(window, {
  TopStrip,
  SiteHeader,
  SiteFooter,
  MENU
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/site-chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/simtrans/app-shell.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Icon,
  Avatar,
  Badge,
  Input,
  Button
} = NS;
const NAV = [{
  id: "dashboard",
  label: "Dasbor",
  icon: "layout-dashboard"
}, {
  id: "registri",
  label: "Registri Kawasan",
  icon: "layers"
}, {
  id: "permohonan",
  label: "Permohonan",
  icon: "clipboard-list",
  count: 24
}, {
  id: "penempatan",
  label: "Penempatan KK",
  icon: "users"
}, {
  id: "anggaran",
  label: "Anggaran",
  icon: "chart-column"
}, {
  id: "peta",
  label: "Peta Kawasan",
  icon: "map-pin"
}];
const NAV2 = [{
  id: "audit",
  label: "Log Audit",
  icon: "shield-check"
}, {
  id: "pengaturan",
  label: "Pengaturan",
  icon: "settings"
}];
function Sidebar({
  active,
  onNavigate
}) {
  const item = n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => onNavigate(n.id),
    className: "sim-nav" + (active === n.id ? " sim-nav--on" : "")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon
  }), /*#__PURE__*/React.createElement("span", null, n.label), n.count != null && /*#__PURE__*/React.createElement("span", {
    className: "sim-nav__c"
  }, n.count));
  return /*#__PURE__*/React.createElement("aside", {
    className: "sim-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-side__brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sim-side__plate"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-emblem.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-side__name"
  }, "SIMTRANS"), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__sub"
  }, "Kementerian Transmigrasi RI"))), /*#__PURE__*/React.createElement("nav", {
    className: "sim-side__nav"
  }, NAV.map(item)), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__spacer"
  }), /*#__PURE__*/React.createElement("nav", {
    className: "sim-side__nav"
  }, NAV2.map(item)), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__foot"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Siti Rahayu",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-side__u"
  }, "Siti Rahayu"), /*#__PURE__*/React.createElement("div", {
    className: "sim-side__r"
  }, "Verifikator Ditjen PKP2Trans"))));
}
function Topbar({
  title,
  breadcrumbSlot,
  actions
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "sim-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-top__l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-top__t"
  }, title), breadcrumbSlot), /*#__PURE__*/React.createElement("div", {
    className: "sim-top__r"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search"
    }),
    placeholder: "Cari kawasan, permohonan, NIK\u2026",
    className: "sim-top__search"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "icon",
    variant: "ghost",
    "aria-label": "Notifikasi"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell"
  })), actions));
}
function PageHead({
  eyebrow,
  title,
  desc,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-ph"
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "sim-ph__e"
  }, eyebrow), /*#__PURE__*/React.createElement("h1", {
    className: "sim-ph__t"
  }, title), desc && /*#__PURE__*/React.createElement("p", {
    className: "sim-ph__d"
  }, desc)), /*#__PURE__*/React.createElement("div", {
    className: "sim-ph__a"
  }, actions));
}
function Stat({
  label,
  value,
  delta,
  deltaTone = "success",
  icon
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-stat__top"
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement(Icon, {
    name: icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-stat__v"
  }, value), delta && /*#__PURE__*/React.createElement(Badge, {
    tone: deltaTone,
    dot: true
  }, delta));
}
Object.assign(window, {
  Sidebar,
  Topbar,
  PageHead,
  Stat,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/simtrans/app-shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/simtrans/screen-dashboard.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Progress,
  Table,
  Tabs,
  Alert,
  Separator
} = NS;
const PROVINSI = [{
  name: "Kalimantan Tengah",
  kk: 4820,
  pct: 100
}, {
  name: "Sulawesi Tengah",
  kk: 3140,
  pct: 65
}, {
  name: "Papua Selatan",
  kk: 2610,
  pct: 54
}, {
  name: "Kalimantan Barat",
  kk: 1980,
  pct: 41
}, {
  name: "Maluku Utara",
  kk: 1240,
  pct: 26
}];
const ANTREAN = [{
  id: 1,
  kode: "TRM-2026-004182",
  kawasan: "KTM Lamunti",
  daerah: "Kapuas, Kalteng",
  umur: "2 hari",
  status: "Menunggu",
  tone: "warning"
}, {
  id: 2,
  kode: "TRM-2026-004179",
  kawasan: "KTM Tinanggea",
  daerah: "Konawe Selatan, Sultra",
  umur: "4 hari",
  status: "Menunggu",
  tone: "warning"
}, {
  id: 3,
  kode: "TRM-2026-004166",
  kawasan: "KTM Salor",
  daerah: "Merauke, Papua Selatan",
  umur: "6 hari",
  status: "Perbaikan",
  tone: "info"
}, {
  id: 4,
  kode: "TRM-2026-004151",
  kawasan: "KTM Rasau Jaya",
  daerah: "Kubu Raya, Kalbar",
  umur: "9 hari",
  status: "Terverifikasi",
  tone: "success"
}, {
  id: 5,
  kode: "TRM-2026-004140",
  kawasan: "KTM Kobisonta",
  daerah: "Maluku Tengah, Maluku",
  umur: "12 hari",
  status: "Ditolak",
  tone: "danger"
}];
function DashboardScreen({
  onOpen
}) {
  const [range, setRange] = React.useState("bulan");
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-page"
  }, /*#__PURE__*/React.createElement(PageHead, {
    eyebrow: "Ditjen PKP2Trans \xB7 Tahun anggaran 2026",
    title: "Dasbor tata kelola kawasan",
    desc: "Ringkasan permohonan, penempatan keluarga, dan realisasi anggaran per 24 Agustus 2026.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "download"
      })
    }, "Unduh laporan"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus"
      })
    }, "Permohonan baru"))
  }), /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "24 permohonan menunggu verifikasi lebih dari 5 hari kerja",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "outline",
      onClick: () => onOpen("registri")
    }, "Lihat antrean")
  }, "Batas layanan (SLA) verifikasi adalah 7 hari kerja sejak berkas dinyatakan lengkap."), /*#__PURE__*/React.createElement("div", {
    className: "sim-stats"
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Permohonan masuk",
    value: "1.284",
    delta: "+8,2% dari bulan lalu",
    icon: "clipboard-list"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Kawasan aktif",
    value: "52",
    delta: "3 penetapan baru",
    icon: "layers"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "KK ditempatkan",
    value: "12.740",
    delta: "+412 KK",
    icon: "users"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Menunggu verifikasi",
    value: "24",
    delta: "4 melewati SLA",
    deltaTone: "warning",
    icon: "clock"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-grid2"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Realisasi anggaran",
    description: "Pagu Rp 4,7 T \xB7 terserap Rp 3,2 T",
    action: /*#__PURE__*/React.createElement(Tabs, {
      variant: "pill",
      value: range,
      onChange: setRange,
      items: [{
        value: "pekan",
        label: "7 hari"
      }, {
        value: "bulan",
        label: "30 hari"
      }, {
        value: "tahun",
        label: "2026"
      }]
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-bars"
  }, [["Jan", 22], ["Feb", 31], ["Mar", 44], ["Apr", 39], ["Mei", 52], ["Jun", 61], ["Jul", 68], ["Agu", 74]].map(([m, v]) => /*#__PURE__*/React.createElement("div", {
    key: m,
    className: "sim-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-bar__fill",
    style: {
      height: v + "%"
    }
  }), /*#__PURE__*/React.createElement("span", null, m)))), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement(Progress, {
    label: "Serapan anggaran nasional",
    value: 68,
    valueLabel: "68% \xB7 Rp 3,2 T"
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Penempatan per provinsi",
    description: "Terhadap target 2026"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-prov"
  }, PROVINSI.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.name,
    className: "sim-prov__row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-prov__n"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map-pin",
    size: "sm"
  }), p.name), /*#__PURE__*/React.createElement(Progress, {
    size: "sm",
    value: p.pct,
    tone: p.pct >= 65 ? "primary" : "info"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-prov__v"
  }, p.kk.toLocaleString("id-ID"), " KK")))))), /*#__PURE__*/React.createElement(Card, {
    variant: "flat",
    title: "Antrean verifikasi",
    description: "5 permohonan teratas berdasarkan umur berkas",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconRight: /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-right",
        size: "sm"
      }),
      onClick: () => onOpen("registri")
    }, "Semua permohonan")
  }, /*#__PURE__*/React.createElement(Table, {
    density: "compact",
    onRowClick: () => onOpen("detail"),
    columns: [{
      key: "kode",
      label: "Nomor registrasi",
      render: r => /*#__PURE__*/React.createElement("span", {
        className: "sim-mono"
      }, r.kode)
    }, {
      key: "kawasan",
      label: "Kawasan"
    }, {
      key: "daerah",
      label: "Daerah pengusul"
    }, {
      key: "umur",
      label: "Umur berkas",
      numeric: true
    }, {
      key: "status",
      label: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.status)
    }],
    rows: ANTREAN
  })));
}
Object.assign(window, {
  DashboardScreen,
  ANTREAN
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/simtrans/screen-dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/simtrans/screen-detail.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Tabs,
  Breadcrumb,
  Alert,
  Dialog,
  Textarea,
  Separator,
  Progress,
  Avatar,
  Table,
  RadioGroup,
  Label,
  Switch
} = NS;
const DOKUMEN = [{
  nama: "SK Bupati penetapan lokasi",
  file: "sk-bupati-2026-114.pdf",
  ok: true
}, {
  nama: "Peta batas kawasan (shapefile)",
  file: "batas-ktm-lamunti.zip",
  ok: true
}, {
  nama: "Rencana rinci satuan kawasan",
  file: "rkt-lamunti-2026.pdf",
  ok: true
}, {
  nama: "Berita acara clean and clear lahan",
  file: "—",
  ok: false
}];
const RIWAYAT = [{
  who: "Ahmad Fauzi",
  role: "Dinas Transmigrasi Kab. Kapuas",
  act: "mengirim permohonan",
  at: "22 Agu 2026, 09.14"
}, {
  who: "Sistem",
  role: "SIMTRANS",
  act: "memverifikasi kelengkapan — 3 dari 4 dokumen lengkap",
  at: "22 Agu 2026, 09.15"
}, {
  who: "Budi Hartono",
  role: "Analis Kawasan",
  act: "menugaskan verifikator wilayah Kalimantan",
  at: "22 Agu 2026, 13.02"
}, {
  who: "Siti Rahayu",
  role: "Verifikator Ditjen PKP2Trans",
  act: "membuka berkas untuk telaah",
  at: "24 Agu 2026, 08.40"
}];
const FAKTA = [["Nama kawasan", "Kawasan Transmigrasi Lamunti"], ["Kode usulan", "KTM-01"], ["Kabupaten", "Kapuas"], ["Provinsi", "Kalimantan Tengah"], ["Luas diusulkan", "12.480 ha"], ["Daya tampung", "1.200 KK"], ["Status lahan", "APL 78% · HPK 22%"], ["Titik koordinat", "−2,1932 · 114,7291"], ["Jenis permohonan", "Penetapan baru"], ["Tahun anggaran", "2026"]];
function DetailScreen() {
  const [tab, setTab] = React.useState("telaah");
  const [dlg, setDlg] = React.useState(false);
  const [keputusan, setKeputusan] = React.useState("setuju");
  const [done, setDone] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-page"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Dasbor",
      href: "#"
    }, {
      label: "Permohonan",
      href: "#"
    }, {
      label: "TRM-2026-004182"
    }]
  }), /*#__PURE__*/React.createElement(PageHead, {
    eyebrow: "Permohonan penetapan kawasan \xB7 TRM-2026-004182",
    title: "KTM Lamunti, Kabupaten Kapuas",
    desc: "Diusulkan Dinas Transmigrasi Kabupaten Kapuas, Kalimantan Tengah \xB7 masuk 22 Agustus 2026",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "printer"
      })
    }, "Cetak"), /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      onClick: () => {
        setKeputusan("tolak");
        setDlg(true);
      }
    }, "Tolak"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setKeputusan("setuju");
        setDlg(true);
      },
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "circle-check"
      })
    }, "Setujui"))
  }), done ? /*#__PURE__*/React.createElement(Alert, {
    tone: "success",
    title: "Keputusan tersimpan",
    onDismiss: () => setDone(false)
  }, "Keputusan tercatat dalam log audit dan dikirim ke dinas pengusul.") : /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "1 dokumen wajib belum diunggah"
  }, "Berita acara clean and clear lahan belum tersedia. Verifikasi dapat dilanjutkan dengan catatan perbaikan."), /*#__PURE__*/React.createElement("div", {
    className: "sim-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-detail__main"
  }, /*#__PURE__*/React.createElement(Card, {
    variant: "flat"
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: "telaah",
      label: "Telaah berkas"
    }, {
      value: "dokumen",
      label: "Dokumen",
      count: 4
    }, {
      value: "riwayat",
      label: "Riwayat",
      count: 4
    }]
  }), tab === "telaah" && /*#__PURE__*/React.createElement("div", {
    className: "sim-kv"
  }, FAKTA.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "sim-kv__row"
  }, /*#__PURE__*/React.createElement("span", null, k), /*#__PURE__*/React.createElement("strong", null, v))), /*#__PURE__*/React.createElement(Separator, {
    label: "Kesesuaian teknis"
  }), /*#__PURE__*/React.createElement(Progress, {
    label: "Kelengkapan berkas",
    value: 3,
    max: 4,
    valueLabel: "3 / 4 dokumen",
    tone: "warning"
  }), /*#__PURE__*/React.createElement(Progress, {
    label: "Kesesuaian tata ruang (RTRW)",
    value: 92
  })), tab === "dokumen" && /*#__PURE__*/React.createElement(Table, {
    density: "compact",
    rows: DOKUMEN.map((d, i) => ({
      id: i,
      ...d
    })),
    columns: [{
      key: "nama",
      label: "Dokumen wajib"
    }, {
      key: "file",
      label: "Berkas",
      render: r => /*#__PURE__*/React.createElement("span", {
        className: "sim-mono"
      }, r.file)
    }, {
      key: "ok",
      label: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.ok ? "success" : "danger",
        dot: true
      }, r.ok ? "Lengkap" : "Belum ada")
    }, {
      key: "a",
      label: "",
      width: "96px",
      render: r => r.ok ? /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "ghost",
        iconLeft: /*#__PURE__*/React.createElement(Icon, {
          name: "eye",
          size: "sm"
        })
      }, "Lihat") : /*#__PURE__*/React.createElement(Button, {
        size: "sm",
        variant: "outline"
      }, "Minta")
    }]
  }), tab === "riwayat" && /*#__PURE__*/React.createElement("ol", {
    className: "sim-time"
  }, RIWAYAT.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.who,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-time__t"
  }, /*#__PURE__*/React.createElement("strong", null, r.who), " ", r.act), /*#__PURE__*/React.createElement("div", {
    className: "sim-time__m"
  }, r.role, " \xB7 ", r.at))))))), /*#__PURE__*/React.createElement("div", {
    className: "sim-detail__side"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Status permohonan",
    description: "SLA 7 hari kerja"
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "warning",
    dot: true
  }, "Menunggu verifikasi"), /*#__PURE__*/React.createElement(Progress, {
    label: "Sisa waktu SLA",
    value: 2,
    max: 7,
    valueLabel: "hari ke-2 dari 7",
    tone: "info"
  }), /*#__PURE__*/React.createElement(Separator, {
    flush: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-kv__row"
  }, /*#__PURE__*/React.createElement("span", null, "Verifikator"), /*#__PURE__*/React.createElement("strong", null, "Siti Rahayu")), /*#__PURE__*/React.createElement("div", {
    className: "sim-kv__row"
  }, /*#__PURE__*/React.createElement("span", null, "Unit"), /*#__PURE__*/React.createElement("strong", null, "Ditjen PKP2Trans"))), /*#__PURE__*/React.createElement(Card, {
    title: "Peta kawasan",
    description: "Batas usulan \xB7 shapefile terunggah",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "external-link",
        size: "sm"
      })
    }, "Buka")
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-map"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "map",
    size: "xl"
  }), /*#__PURE__*/React.createElement("span", null, "Pratinjau peta hanya tersedia di lingkungan produksi."))), /*#__PURE__*/React.createElement(Card, {
    title: "Catatan verifikator"
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 3,
    placeholder: "Tulis catatan telaah\u2026"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    block: true
  }, "Simpan catatan")))), /*#__PURE__*/React.createElement(Dialog, {
    open: dlg,
    onClose: () => setDlg(false),
    title: "Catat keputusan verifikasi",
    description: "Keputusan bersifat final untuk tahap ini dan tercatat dalam log audit.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setDlg(false)
    }, "Batal"), /*#__PURE__*/React.createElement(Button, {
      variant: keputusan === "tolak" ? "destructive" : "default",
      onClick: () => {
        setDlg(false);
        setDone(true);
      }
    }, keputusan === "tolak" ? "Tolak permohonan" : "Simpan keputusan"))
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-dlgform"
  }, /*#__PURE__*/React.createElement(RadioGroup, {
    name: "kep",
    value: keputusan,
    onChange: setKeputusan,
    options: [{
      value: "setuju",
      label: "Setujui",
      description: "Lanjut ke penetapan Direktur Jenderal."
    }, {
      value: "perbaikan",
      label: "Kembalikan untuk perbaikan",
      description: "Dinas pengusul melengkapi dokumen dalam 14 hari."
    }, {
      value: "tolak",
      label: "Tolak",
      description: "Wajib menyertakan dasar penolakan."
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "sim-dlgform__f"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "cat",
    required: true
  }, "Catatan keputusan"), /*#__PURE__*/React.createElement(Textarea, {
    id: "cat",
    rows: 3,
    placeholder: "Dasar pertimbangan dan tindak lanjut"
  })), /*#__PURE__*/React.createElement(Switch, {
    label: "Kirim notifikasi email ke dinas pengusul",
    defaultChecked: true
  }))));
}
Object.assign(window, {
  DetailScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/simtrans/screen-detail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/simtrans/screen-login.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Button,
  Input,
  Label,
  Checkbox,
  Alert,
  Icon,
  Separator
} = NS;
function LoginScreen({
  onSignIn
}) {
  const [nip, setNip] = React.useState("198703142010011002");
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-login"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sim-login__plate"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-emblem.png",
    alt: ""
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__wm"
  }, "KEMENTERIAN TRANSMIGRASI"), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__wm2"
  }, "Kesejahteraan untuk semua"))), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__quote"
  }, "Satu data kawasan transmigrasi, dari usulan daerah sampai penempatan keluarga."), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__meta"
  }, "SIMTRANS v4.2 \xB7 Pusat Data dan Teknologi Informasi")), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-login__box"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "sim-login__h"
  }, "Masuk ke SIMTRANS"), /*#__PURE__*/React.createElement("p", {
    className: "sim-login__p"
  }, "Gunakan akun SSO kepegawaian Anda. Akses dicatat dalam log audit."), /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    title: "Pemeliharaan terjadwal"
  }, "Sabtu, 29 Agustus 2026, 22.00\u201302.00 WIB."), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__field"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "nip",
    required: true
  }, "NIP"), /*#__PURE__*/React.createElement(Input, {
    id: "nip",
    value: nip,
    onChange: e => setNip(e.target.value),
    inputMode: "numeric"
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__field"
  }, /*#__PURE__*/React.createElement(Label, {
    htmlFor: "pw",
    required: true
  }, "Kata sandi"), /*#__PURE__*/React.createElement(Input, {
    id: "pw",
    type: "password",
    defaultValue: "rahasia123",
    hint: "Minimal 12 karakter, diganti setiap 90 hari."
  })), /*#__PURE__*/React.createElement("div", {
    className: "sim-login__row"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Ingat perangkat ini",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement("a", {
    href: "#lupa"
  }, "Lupa kata sandi?")), /*#__PURE__*/React.createElement(Button, {
    block: true,
    size: "lg",
    onClick: onSignIn,
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right"
    })
  }, "Masuk"), /*#__PURE__*/React.createElement(Separator, {
    label: "atau"
  }), /*#__PURE__*/React.createElement(Button, {
    block: true,
    variant: "outline",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "shield-check"
    }),
    onClick: onSignIn
  }, "Masuk dengan SSO ASN Digital"))));
}
Object.assign(window, {
  LoginScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/simtrans/screen-login.jsx", error: String((e && e.message) || e) }); }

// ui_kits/simtrans/screen-registri.jsx
try { (() => {
const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const {
  Card,
  Badge,
  Button,
  Icon,
  Table,
  Tabs,
  Pagination,
  Select,
  Input,
  Breadcrumb,
  Checkbox
} = NS;
const ROWS = [["KTM-01", "KTM Lamunti", "Kapuas, Kalimantan Tengah", 1200, "2019", "Terverifikasi", "success"], ["KTM-02", "KTM Tinanggea", "Konawe Selatan, Sulawesi Tenggara", 840, "2021", "Menunggu", "warning"], ["KTM-03", "KTM Salor", "Merauke, Papua Selatan", 615, "2020", "Perbaikan", "info"], ["KTM-04", "KTM Rasau Jaya", "Kubu Raya, Kalimantan Barat", 1024, "2018", "Terverifikasi", "success"], ["KTM-05", "KTM Kobisonta", "Maluku Tengah, Maluku", 430, "2022", "Ditolak", "danger"], ["KTM-06", "KTM Mesuji", "Mesuji, Lampung", 1580, "2017", "Terverifikasi", "success"], ["KTM-07", "KTM Pawonsari", "Bombana, Sulawesi Tenggara", 720, "2023", "Menunggu", "warning"], ["KTM-08", "KTM Belitang", "Sekadau, Kalimantan Barat", 905, "2019", "Arsip", "neutral"]].map(([kode, kawasan, daerah, kk, tahun, status, tone], i) => ({
  id: i,
  kode,
  kawasan,
  daerah,
  kk,
  tahun,
  status,
  tone
}));
function RegistriScreen({
  onOpen
}) {
  const [tab, setTab] = React.useState("semua");
  const [page, setPage] = React.useState(1);
  const rows = tab === "semua" ? ROWS : ROWS.filter(r => tab === "menunggu" ? r.status === "Menunggu" : r.status === "Terverifikasi");
  return /*#__PURE__*/React.createElement("div", {
    className: "sim-page"
  }, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: [{
      label: "Dasbor",
      href: "#"
    }, {
      label: "Registri Kawasan"
    }]
  }), /*#__PURE__*/React.createElement(PageHead, {
    title: "Registri kawasan transmigrasi",
    desc: "1.284 catatan kawasan dari 27 provinsi. Data bersumber dari SK penetapan dan verifikasi lapangan.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "upload"
      })
    }, "Impor CSV"), /*#__PURE__*/React.createElement(Button, {
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus"
      })
    }, "Tambah kawasan"))
  }), /*#__PURE__*/React.createElement(Card, {
    variant: "flat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sim-toolbar"
  }, /*#__PURE__*/React.createElement(Input, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "search"
    }),
    placeholder: "Cari kode atau nama kawasan\u2026"
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "Semua provinsi",
    options: ["Kalimantan Tengah", "Kalimantan Barat", "Sulawesi Tenggara", "Papua Selatan", "Maluku", "Lampung"]
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    placeholder: "Semua tahun SK",
    options: ["2017", "2018", "2019", "2020", "2021", "2022", "2023"]
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "filter",
      size: "sm"
    })
  }, "Filter lanjutan")), /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: "semua",
      label: "Semua",
      count: 1284
    }, {
      value: "menunggu",
      label: "Menunggu verifikasi",
      count: 24
    }, {
      value: "terverifikasi",
      label: "Terverifikasi",
      count: 1198
    }]
  }), /*#__PURE__*/React.createElement(Table, {
    zebra: true,
    rows: rows,
    onRowClick: () => onOpen("detail"),
    columns: [{
      key: "sel",
      label: /*#__PURE__*/React.createElement(Checkbox, {
        "aria-label": "Pilih semua"
      }),
      width: "36px",
      render: () => /*#__PURE__*/React.createElement(Checkbox, {
        "aria-label": "Pilih baris"
      })
    }, {
      key: "kode",
      label: "Kode",
      width: "84px",
      render: r => /*#__PURE__*/React.createElement("span", {
        className: "sim-mono"
      }, r.kode)
    }, {
      key: "kawasan",
      label: "Nama kawasan"
    }, {
      key: "daerah",
      label: "Kabupaten / provinsi"
    }, {
      key: "kk",
      label: "Daya tampung (KK)",
      numeric: true,
      render: r => r.kk.toLocaleString("id-ID")
    }, {
      key: "tahun",
      label: "Tahun SK",
      numeric: true
    }, {
      key: "status",
      label: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        dot: true
      }, r.status)
    }, {
      key: "aksi",
      label: "",
      width: "40px",
      render: () => /*#__PURE__*/React.createElement(Button, {
        size: "icon",
        variant: "ghost",
        "aria-label": "Aksi baris"
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "ellipsis-vertical"
      }))
    }]
  }), /*#__PURE__*/React.createElement(Pagination, {
    page: page,
    totalPages: 161,
    totalItems: 1284,
    onChange: setPage
  })));
}
Object.assign(window, {
  RegistriScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/simtrans/screen-registri.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ICON_BASE = __ds_scope.ICON_BASE;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Separator = __ds_scope.Separator;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.Pagination = __ds_scope.Pagination;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
