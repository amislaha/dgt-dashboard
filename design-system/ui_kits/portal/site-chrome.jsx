const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Button, Icon, Badge, Input } = NS;

const MENU = ["Profil", "Layanan", "Kawasan", "Data & Statistik", "Berita", "Pengaduan"];

function TopStrip() {
  return (
    <div className="pt-strip">
      <div className="pt-wrap pt-strip__in">
        <span><Icon name="landmark" size="sm" /> Situs resmi Kementerian Transmigrasi Republik Indonesia</span>
        <span className="pt-strip__r">
          <a href="#bahasa">Bahasa Indonesia</a><span className="pt-dot" /><a href="#en">English</a><span className="pt-dot" /><a href="#kontras">Mode kontras tinggi</a>
        </span>
      </div>
    </div>
  );
}

function SiteHeader({ onNavigate, active }) {
  return (
    <header className="pt-head">
      <div className="pt-wrap pt-head__in">
        <a className="pt-brand" href="#beranda" onClick={() => onNavigate("beranda")}>
          <img src="../../assets/logo-lockup.png" alt="Kementerian Transmigrasi Republik Indonesia — Kesejahteraan untuk semua" />
        </a>
        <nav className="pt-nav">
          {MENU.map((m) => (
            <a key={m} href={"#" + m} className={active === m ? "pt-nav--on" : undefined}
              onClick={(e) => { e.preventDefault(); onNavigate(m === "Layanan" ? "layanan" : "beranda"); }}>{m}</a>
          ))}
        </nav>
        <div className="pt-head__a">
          <Button size="icon" variant="ghost" aria-label="Cari"><Icon name="search" /></Button>
          <Button size="sm" onClick={() => onNavigate("layanan")}>Masuk SIMTRANS</Button>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  const cols = [
    ["Layanan", ["Permohonan penetapan kawasan", "Pendaftaran calon transmigran", "Data kawasan terbuka", "Pengaduan masyarakat"]],
    ["Informasi", ["Profil kementerian", "Struktur organisasi", "Rencana strategis", "Laporan kinerja"]],
    ["Keterbukaan", ["PPID", "LHKPN", "Whistleblowing system", "Pengadaan barang & jasa"]],
  ];
  return (
    <footer className="pt-foot">
      <div className="pt-wrap pt-foot__in">
        <div className="pt-foot__brand">
          <span className="pt-foot__plate"><img src="../../assets/logo-emblem.png" alt="" /></span>
          <div>
            <div className="pt-foot__wm">KEMENTERIAN TRANSMIGRASI</div>
            <div className="pt-foot__wm2">Kesejahteraan untuk semua</div>
            <p>Jl. TMP Kalibata No. 17, Jakarta Selatan 12750<br />Telepon (021) 7940327 · halo@transmigrasi.go.id</p>
            <div className="pt-foot__badges"><Badge tone="outline">SPBE</Badge><Badge tone="outline">WBK/WBBM</Badge><Badge tone="outline">ISO 27001</Badge></div>
          </div>
        </div>
        {cols.map(([t, items]) => (
          <div key={t} className="pt-foot__col">
            <h4>{t}</h4>
            {items.map((i) => <a key={i} href={"#" + i}>{i}</a>)}
          </div>
        ))}
        <div className="pt-foot__col">
          <h4>Buletin transmigrasi</h4>
          <p className="pt-foot__p">Ringkasan kebijakan dan data kawasan, dikirim sebulan sekali.</p>
          <Input size="sm" placeholder="Alamat email" />
          <Button size="sm" variant="outline">Berlangganan</Button>
        </div>
      </div>
      <div className="pt-foot__bar"><div className="pt-wrap pt-foot__barin"><span>© 2026 Kementerian Transmigrasi Republik Indonesia</span><span>Peta situs · Kebijakan privasi · Aksesibilitas</span></div></div>
    </footer>
  );
}
Object.assign(window, { TopStrip, SiteHeader, SiteFooter, MENU });
