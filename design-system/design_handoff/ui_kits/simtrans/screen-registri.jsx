const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Card, Badge, Button, Icon, Table, Tabs, Pagination, Select, Input, Breadcrumb, Checkbox } = NS;

const ROWS = [
  ["KTM-01", "KTM Lamunti", "Kapuas, Kalimantan Tengah", 1200, "2019", "Terverifikasi", "success"],
  ["KTM-02", "KTM Tinanggea", "Konawe Selatan, Sulawesi Tenggara", 840, "2021", "Menunggu", "warning"],
  ["KTM-03", "KTM Salor", "Merauke, Papua Selatan", 615, "2020", "Perbaikan", "info"],
  ["KTM-04", "KTM Rasau Jaya", "Kubu Raya, Kalimantan Barat", 1024, "2018", "Terverifikasi", "success"],
  ["KTM-05", "KTM Kobisonta", "Maluku Tengah, Maluku", 430, "2022", "Ditolak", "danger"],
  ["KTM-06", "KTM Mesuji", "Mesuji, Lampung", 1580, "2017", "Terverifikasi", "success"],
  ["KTM-07", "KTM Pawonsari", "Bombana, Sulawesi Tenggara", 720, "2023", "Menunggu", "warning"],
  ["KTM-08", "KTM Belitang", "Sekadau, Kalimantan Barat", 905, "2019", "Arsip", "neutral"],
].map(([kode, kawasan, daerah, kk, tahun, status, tone], i) => ({ id: i, kode, kawasan, daerah, kk, tahun, status, tone }));

function RegistriScreen({ onOpen }) {
  const [tab, setTab] = React.useState("semua");
  const [page, setPage] = React.useState(1);
  const rows = tab === "semua" ? ROWS : ROWS.filter((r) => (tab === "menunggu" ? r.status === "Menunggu" : r.status === "Terverifikasi"));
  return (
    <div className="sim-page">
      <Breadcrumb items={[{ label: "Dasbor", href: "#" }, { label: "Registri Kawasan" }]} />
      <PageHead title="Registri kawasan transmigrasi" desc="1.284 catatan kawasan dari 27 provinsi. Data bersumber dari SK penetapan dan verifikasi lapangan."
        actions={<><Button variant="outline" iconLeft={<Icon name="upload" />}>Impor CSV</Button><Button iconLeft={<Icon name="plus" />}>Tambah kawasan</Button></>} />

      <Card variant="flat">
        <div className="sim-toolbar">
          <Input size="sm" icon={<Icon name="search" />} placeholder="Cari kode atau nama kawasan…" />
          <Select size="sm" placeholder="Semua provinsi" options={["Kalimantan Tengah", "Kalimantan Barat", "Sulawesi Tenggara", "Papua Selatan", "Maluku", "Lampung"]} />
          <Select size="sm" placeholder="Semua tahun SK" options={["2017", "2018", "2019", "2020", "2021", "2022", "2023"]} />
          <Button size="sm" variant="ghost" iconLeft={<Icon name="filter" size="sm" />}>Filter lanjutan</Button>
        </div>
        <Tabs value={tab} onChange={setTab} items={[{ value: "semua", label: "Semua", count: 1284 }, { value: "menunggu", label: "Menunggu verifikasi", count: 24 }, { value: "terverifikasi", label: "Terverifikasi", count: 1198 }]} />
        <Table zebra rows={rows} onRowClick={() => onOpen("detail")}
          columns={[
            { key: "sel", label: <Checkbox aria-label="Pilih semua" />, width: "36px", render: () => <Checkbox aria-label="Pilih baris" /> },
            { key: "kode", label: "Kode", width: "84px", render: (r) => <span className="sim-mono">{r.kode}</span> },
            { key: "kawasan", label: "Nama kawasan" },
            { key: "daerah", label: "Kabupaten / provinsi" },
            { key: "kk", label: "Daya tampung (KK)", numeric: true, render: (r) => r.kk.toLocaleString("id-ID") },
            { key: "tahun", label: "Tahun SK", numeric: true },
            { key: "status", label: "Status", render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge> },
            { key: "aksi", label: "", width: "40px", render: () => <Button size="icon" variant="ghost" aria-label="Aksi baris"><Icon name="ellipsis-vertical" /></Button> },
          ]} />
        <Pagination page={page} totalPages={161} totalItems={1284} onChange={setPage} />
      </Card>
    </div>
  );
}
Object.assign(window, { RegistriScreen });
