const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Icon, Avatar, Badge, Input, Button } = NS;

const NAV = [
  { id: "dashboard", label: "Dasbor", icon: "layout-dashboard" },
  { id: "registri", label: "Registri Kawasan", icon: "layers" },
  { id: "permohonan", label: "Permohonan", icon: "clipboard-list", count: 24 },
  { id: "penempatan", label: "Penempatan KK", icon: "users" },
  { id: "anggaran", label: "Anggaran", icon: "chart-column" },
  { id: "peta", label: "Peta Kawasan", icon: "map-pin" },
];
const NAV2 = [
  { id: "audit", label: "Log Audit", icon: "shield-check" },
  { id: "pengaturan", label: "Pengaturan", icon: "settings" },
];

function Sidebar({ active, onNavigate }) {
  const item = (n) => (
    <button key={n.id} onClick={() => onNavigate(n.id)} className={"sim-nav" + (active === n.id ? " sim-nav--on" : "")}>
      <Icon name={n.icon} />
      <span>{n.label}</span>
      {n.count != null && <span className="sim-nav__c">{n.count}</span>}
    </button>
  );
  return (
    <aside className="sim-side">
      <div className="sim-side__brand">
        <span className="sim-side__plate"><img src="../../assets/logo-emblem.png" alt="" /></span>
        <div>
          <div className="sim-side__name">SIMTRANS</div>
          <div className="sim-side__sub">Kementerian Transmigrasi RI</div>
        </div>
      </div>
      <nav className="sim-side__nav">{NAV.map(item)}</nav>
      <div className="sim-side__spacer" />
      <nav className="sim-side__nav">{NAV2.map(item)}</nav>
      <div className="sim-side__foot">
        <Avatar name="Siti Rahayu" size="sm" />
        <div>
          <div className="sim-side__u">Siti Rahayu</div>
          <div className="sim-side__r">Verifikator Ditjen PKP2Trans</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, breadcrumbSlot, actions }) {
  return (
    <header className="sim-top">
      <div className="sim-top__l">
        <div className="sim-top__t">{title}</div>
        {breadcrumbSlot}
      </div>
      <div className="sim-top__r">
        <Input size="sm" icon={<Icon name="search" />} placeholder="Cari kawasan, permohonan, NIK…" className="sim-top__search" />
        <Button size="icon" variant="ghost" aria-label="Notifikasi"><Icon name="bell" /></Button>
        {actions}
      </div>
    </header>
  );
}

function PageHead({ eyebrow, title, desc, actions }) {
  return (
    <div className="sim-ph">
      <div>
        {eyebrow && <div className="sim-ph__e">{eyebrow}</div>}
        <h1 className="sim-ph__t">{title}</h1>
        {desc && <p className="sim-ph__d">{desc}</p>}
      </div>
      <div className="sim-ph__a">{actions}</div>
    </div>
  );
}

function Stat({ label, value, delta, deltaTone = "success", icon }) {
  return (
    <div className="sim-stat">
      <div className="sim-stat__top"><span>{label}</span><Icon name={icon} /></div>
      <div className="sim-stat__v">{value}</div>
      {delta && <Badge tone={deltaTone} dot>{delta}</Badge>}
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, PageHead, Stat, NAV });
