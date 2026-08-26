const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Card, Badge, Button, Icon, Progress, Table, Tabs, Alert, Separator } = NS;

const PROVINSI = [
  { name: "Kalimantan Tengah", kk: 4820, pct: 100 },
  { name: "Sulawesi Tengah", kk: 3140, pct: 65 },
  { name: "Papua Selatan", kk: 2610, pct: 54 },
  { name: "Kalimantan Barat", kk: 1980, pct: 41 },
  { name: "Maluku Utara", kk: 1240, pct: 26 },
];
const ANTREAN = [
  { id: 1, kode: "TRM-2026-004182", kawasan: "KTM Lamunti", daerah: "Kapuas, Kalteng", umur: "2 hari", status: "Menunggu", tone: "warning" },
  { id: 2, kode: "TRM-2026-004179", kawasan: "KTM Tinanggea", daerah: "Konawe Selatan, Sultra", umur: "4 hari", status: "Menunggu", tone: "warning" },
  { id: 3, kode: "TRM-2026-004166", kawasan: "KTM Salor", daerah: "Merauke, Papua Selatan", umur: "6 hari", status: "Perbaikan", tone: "info" },
  { id: 4, kode: "TRM-2026-004151", kawasan: "KTM Rasau Jaya", daerah: "Kubu Raya, Kalbar", umur: "9 hari", status: "Terverifikasi", tone: "success" },
  { id: 5, kode: "TRM-2026-004140", kawasan: "KTM Kobisonta", daerah: "Maluku Tengah, Maluku", umur: "12 hari", status: "Ditolak", tone: "danger" },
];

function DashboardScreen({ onOpen }) {
  const [range, setRange] = React.useState("bulan");
  return (
    <div className="sim-page">
      <PageHead eyebrow="Ditjen PKP2Trans · Tahun anggaran 2026" title="Dasbor tata kelola kawasan"
        desc="Ringkasan permohonan, penempatan keluarga, dan realisasi anggaran per 24 Agustus 2026."
        actions={<><Button variant="outline" iconLeft={<Icon name="download" />}>Unduh laporan</Button><Button iconLeft={<Icon name="plus" />}>Permohonan baru</Button></>} />

      <Alert tone="warning" title="24 permohonan menunggu verifikasi lebih dari 5 hari kerja"
        action={<Button size="sm" variant="outline" onClick={() => onOpen("registri")}>Lihat antrean</Button>}>
        Batas layanan (SLA) verifikasi adalah 7 hari kerja sejak berkas dinyatakan lengkap.
      </Alert>

      <div className="sim-stats">
        <Stat label="Permohonan masuk" value="1.284" delta="+8,2% dari bulan lalu" icon="clipboard-list" />
        <Stat label="Kawasan aktif" value="52" delta="3 penetapan baru" icon="layers" />
        <Stat label="KK ditempatkan" value="12.740" delta="+412 KK" icon="users" />
        <Stat label="Menunggu verifikasi" value="24" delta="4 melewati SLA" deltaTone="warning" icon="clock" />
      </div>

      <div className="sim-grid2">
        <Card title="Realisasi anggaran" description="Pagu Rp 4,7 T · terserap Rp 3,2 T"
          action={<Tabs variant="pill" value={range} onChange={setRange} items={[{ value: "pekan", label: "7 hari" }, { value: "bulan", label: "30 hari" }, { value: "tahun", label: "2026" }]} />}>
          <div className="sim-bars">
            {[["Jan", 22], ["Feb", 31], ["Mar", 44], ["Apr", 39], ["Mei", 52], ["Jun", 61], ["Jul", 68], ["Agu", 74]].map(([m, v]) => (
              <div key={m} className="sim-bar">
                <div className="sim-bar__fill" style={{ height: v + "%" }} />
                <span>{m}</span>
              </div>
            ))}
          </div>
          <Separator flush />
          <Progress label="Serapan anggaran nasional" value={68} valueLabel="68% · Rp 3,2 T" />
        </Card>

        <Card title="Penempatan per provinsi" description="Terhadap target 2026">
          <div className="sim-prov">
            {PROVINSI.map((p) => (
              <div key={p.name} className="sim-prov__row">
                <div className="sim-prov__n"><Icon name="map-pin" size="sm" />{p.name}</div>
                <Progress size="sm" value={p.pct} tone={p.pct >= 65 ? "primary" : "info"} />
                <div className="sim-prov__v">{p.kk.toLocaleString("id-ID")} KK</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="flat" title="Antrean verifikasi" description="5 permohonan teratas berdasarkan umur berkas"
        action={<Button size="sm" variant="ghost" iconRight={<Icon name="arrow-right" size="sm" />} onClick={() => onOpen("registri")}>Semua permohonan</Button>}>
        <Table density="compact" onRowClick={() => onOpen("detail")}
          columns={[
            { key: "kode", label: "Nomor registrasi", render: (r) => <span className="sim-mono">{r.kode}</span> },
            { key: "kawasan", label: "Kawasan" },
            { key: "daerah", label: "Daerah pengusul" },
            { key: "umur", label: "Umur berkas", numeric: true },
            { key: "status", label: "Status", render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
          ]} rows={ANTREAN} />
      </Card>
    </div>
  );
}
Object.assign(window, { DashboardScreen, ANTREAN });
