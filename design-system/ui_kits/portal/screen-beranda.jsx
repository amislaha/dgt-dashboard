const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Button, Icon, Card, Badge, Separator, Progress, Tabs } = NS;

const LAYANAN = [
  { icon: "map-pin", t: "Penetapan kawasan transmigrasi", d: "Usulan pemerintah daerah untuk penetapan kawasan baru atau perluasan.", who: "Pemerintah daerah" },
  { icon: "users", t: "Pendaftaran calon transmigran", d: "Pendaftaran keluarga calon transmigran beserta verifikasi berkas.", who: "Masyarakat" },
  { icon: "file-check-2", t: "Legalisasi hak atas tanah", d: "Permohonan sertifikasi lahan pekarangan dan lahan usaha.", who: "Transmigran" },
  { icon: "sprout", t: "Bantuan sarana produksi", d: "Pengajuan bantuan bibit, alat, dan pendampingan usaha tani.", who: "Kelompok tani" },
  { icon: "database", t: "Data kawasan terbuka", d: "Unduh data kawasan, daya tampung, dan capaian penempatan.", who: "Umum" },
  { icon: "message-square-warning", t: "Pengaduan masyarakat", d: "Sampaikan aduan pelayanan; ditindaklanjuti dalam 5 hari kerja.", who: "Umum" },
];
const BERITA = [
  { tag: "Kebijakan", t: "Tiga kawasan transmigrasi baru ditetapkan di Papua Selatan", d: "24 Agustus 2026", x: "Penetapan mencakup 8.400 hektare dengan daya tampung 1.950 keluarga." },
  { tag: "Program", t: "Sertifikasi 12.400 bidang lahan transmigran tuntas tahun ini", d: "19 Agustus 2026", x: "Kerja sama dengan Kementerian ATR/BPN mempercepat legalisasi aset." },
  { tag: "Data", t: "Portal data kawasan kini menyediakan unduhan format shapefile", d: "11 Agustus 2026", x: "Pemerintah daerah dapat mengunduh batas kawasan resmi tanpa permohonan." },
];

function BerandaScreen({ onNavigate }) {
  const [tab, setTab] = React.useState("2026");
  return (
    <main>
      <section className="pt-hero">
        <div className="pt-wrap pt-hero__in">
          <div className="pt-hero__txt">
            <div className="pt-eyebrow">Tata kelola digital transmigrasi</div>
            <h1>Satu data kawasan, satu pintu layanan.</h1>
            <p>Ajukan penetapan kawasan, pantau penempatan keluarga, dan akses data resmi transmigrasi Indonesia dalam satu portal.</p>
            <div className="pt-hero__cta">
              <Button size="lg" onClick={() => onNavigate("layanan")} iconRight={<Icon name="arrow-right" />}>Ajukan permohonan</Button>
              <Button size="lg" variant="outline" iconLeft={<Icon name="download" />}>Unduh data kawasan</Button>
            </div>
            <div className="pt-hero__meta"><Icon name="shield-check" size="sm" /> Terhubung dengan SSO ASN Digital dan Satu Data Indonesia</div>
          </div>
          <div className="pt-hero__card">
            <div className="pt-hero__cardhd">Capaian nasional</div>
            <Tabs variant="pill" value={tab} onChange={setTab} items={[{ value: "2026", label: "2026" }, { value: "2025", label: "2025" }, { value: "kumulatif", label: "Kumulatif" }]} />
            <div className="pt-figs">
              <div><strong>52</strong><span>kawasan aktif</span></div>
              <div><strong>12.740</strong><span>KK ditempatkan</span></div>
              <div><strong>27</strong><span>provinsi</span></div>
            </div>
            <Progress label="Realisasi target penempatan" value={68} valueLabel="68%" />
            <Separator flush />
            <div className="pt-hero__note"><Icon name="clock" size="sm" /> Diperbarui 24 Agustus 2026, 06.00 WIB</div>
          </div>
        </div>
      </section>

      <section className="pt-sec">
        <div className="pt-wrap">
          <div className="pt-sechd"><h2>Layanan</h2><a href="#semua">Lihat semua layanan <Icon name="arrow-right" size="sm" /></a></div>
          <div className="pt-grid3">
            {LAYANAN.map((l) => (
              <Card key={l.t} interactive onClick={() => onNavigate("layanan")} title={l.t} description={l.d}
                action={<span className="pt-layicon"><Icon name={l.icon} size="lg" /></span>}
                footer={<Badge tone="neutral">{l.who}</Badge>} footerBordered />
            ))}
          </div>
        </div>
      </section>

      <section className="pt-sec pt-sec--tint">
        <div className="pt-wrap pt-split">
          <div className="pt-peta">
            <div className="pt-peta__ph"><Icon name="map" size="xl" /><span>Peta sebaran kawasan tersedia pada portal produksi (WebGIS Satu Data).</span></div>
          </div>
          <div>
            <div className="pt-eyebrow">Sebaran kawasan</div>
            <h2>52 kawasan transmigrasi di 27 provinsi</h2>
            <p className="pt-lead">Setiap kawasan memiliki halaman profil terbuka: SK penetapan, luas, daya tampung, capaian penempatan, dan kontak dinas pengelola.</p>
            <div className="pt-list">
              {[["Kalimantan Tengah", "12 kawasan"], ["Sulawesi Tenggara", "9 kawasan"], ["Papua Selatan", "7 kawasan"], ["Kalimantan Barat", "6 kawasan"]].map(([p, k]) => (
                <div key={p} className="pt-list__row"><Icon name="map-pin" size="sm" /><strong>{p}</strong><span>{k}</span><Icon name="chevron-right" size="sm" /></div>
              ))}
            </div>
            <Button variant="outline" iconRight={<Icon name="arrow-right" />}>Jelajahi semua kawasan</Button>
          </div>
        </div>
      </section>

      <section className="pt-sec">
        <div className="pt-wrap">
          <div className="pt-sechd"><h2>Berita &amp; siaran pers</h2><a href="#berita">Semua berita <Icon name="arrow-right" size="sm" /></a></div>
          <div className="pt-grid3">
            {BERITA.map((b) => (
              <article key={b.t} className="pt-news">
                <div className="pt-news__img"><span>Foto siaran pers</span></div>
                <Badge tone="primary">{b.tag}</Badge>
                <h3>{b.t}</h3>
                <p>{b.x}</p>
                <time>{b.d}</time>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-cta">
        <div className="pt-wrap pt-cta__in">
          <div><h2>Punya pertanyaan tentang layanan transmigrasi?</h2><p>Layanan informasi publik buka Senin–Jumat, 08.00–16.00 WIB.</p></div>
          <div className="pt-cta__b"><Button size="lg" variant="secondary" iconLeft={<Icon name="phone" />}>Hubungi kami</Button><Button size="lg" variant="outline" iconLeft={<Icon name="message-square-warning" />}>Sampaikan aduan</Button></div>
        </div>
      </section>
    </main>
  );
}
Object.assign(window, { BerandaScreen, LAYANAN });
