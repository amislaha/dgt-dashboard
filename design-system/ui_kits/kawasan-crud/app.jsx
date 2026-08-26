const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Card, Badge, Button, Icon, Input, Label, Select, Breadcrumb, Pagination, Alert, Dialog, Separator } = NS;
const STORE_KEY = "tds-kawasan-crud-v1";
const STATUS_OPTIONS = ["Berkembang", "Mandiri", "Berdaya Saing"];
const STATUS_TONE = { "Berdaya Saing": "success", Mandiri: "info", Berkembang: "warning" };
const PAGE_SIZE = 15;
const fmt = (n) => n == null ? "—" : n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const emptyForm = { kawasan: "", ipktrans2024: "", status2024: "Berkembang", intrans2025: "", proyeksi2025: "", status2025: "Berkembang" };

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return window.KAWASAN_SEED;
}

function StatCard({ label, value, sub }) {
  return (
    <div className="kc-stat">
      <span className="kc-stat__l">{label}</span>
      <span className="kc-stat__v">{value}</span>
      {sub && <span className="kc-stat__s">{sub}</span>}
    </div>
  );
}

function KawasanForm({ value, onChange }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target ? e.target.value : e });
  return (
    <div className="kc-form">
      <div className="kc-f"><Label htmlFor="f-nama" required>Nama kawasan</Label><Input id="f-nama" value={value.kawasan} onChange={set("kawasan")} placeholder="Contoh: KTM Lamunti" /></div>
      <Separator label="Hasil pengukuran 2024" />
      <div className="kc-f2">
        <div className="kc-f"><Label htmlFor="f-ip" required>Nilai IPKTRANS</Label><Input id="f-ip" inputMode="decimal" value={value.ipktrans2024} onChange={set("ipktrans2024")} placeholder="0-100" /></div>
        <div className="kc-f"><Label htmlFor="f-s24" required>Status</Label><Select id="f-s24" value={value.status2024} onChange={set("status2024")} options={STATUS_OPTIONS} /></div>
      </div>
      <Separator label="Hasil pengukuran 2025" />
      <div className="kc-f2">
        <div className="kc-f"><Label htmlFor="f-in">INTRANS (pengukuran langsung)</Label><Input id="f-in" inputMode="decimal" value={value.intrans2025} onChange={set("intrans2025")} placeholder="Kosongkan jika belum diukur" /></div>
        <div className="kc-f"><Label htmlFor="f-pj" required>Proyeksi nilai INTRANS</Label><Input id="f-pj" inputMode="decimal" value={value.proyeksi2025} onChange={set("proyeksi2025")} placeholder="0-1" /></div>
      </div>
      <div className="kc-f"><Label htmlFor="f-s25" required>Status 2025</Label><Select id="f-s25" value={value.status2025} onChange={set("status2025")} options={STATUS_OPTIONS} /></div>
    </div>
  );
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

  React.useEffect(() => { try { localStorage.setItem(STORE_KEY, JSON.stringify(rows)); } catch (e) {} }, [rows]);

  const filtered = React.useMemo(() => rows.filter((r) =>
    (!q || r.kawasan.toLowerCase().includes(q.toLowerCase())) &&
    (!statusFilter || r.status2025 === statusFilter)
  ), [rows, q, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const avgIp = rows.length ? rows.reduce((s, r) => s + Number(r.ipktrans2024), 0) / rows.length : 0;
  const measured = rows.filter((r) => r.intrans2025 != null);
  const avgMeasured = measured.length ? measured.reduce((s, r) => s + Number(r.intrans2025), 0) / measured.length : null;
  const avgProy = rows.length ? rows.reduce((s, r) => s + Number(r.proyeksi2025), 0) / rows.length : 0;
  const counts = STATUS_OPTIONS.reduce((a, s) => { a[s] = rows.filter((r) => r.status2025 === s).length; return a; }, {});

  const openAdd = () => { setForm(emptyForm); setDialog({ mode: "add" }); };
  const openEdit = (r) => { setForm({ kawasan: r.kawasan, ipktrans2024: r.ipktrans2024, status2024: r.status2024, intrans2025: r.intrans2025 ?? "", proyeksi2025: r.proyeksi2025, status2025: r.status2025 }); setDialog({ mode: "edit", id: r.id }); };

  const save = () => {
    if (!form.kawasan.trim() || form.ipktrans2024 === "" || form.proyeksi2025 === "") return;
    const payload = {
      kawasan: form.kawasan.trim(),
      ipktrans2024: Number(form.ipktrans2024),
      status2024: form.status2024,
      intrans2025: form.intrans2025 === "" ? null : Number(form.intrans2025),
      proyeksi2025: Number(form.proyeksi2025),
      status2025: form.status2025,
    };
    if (dialog.mode === "add") {
      setRows((r) => [...r, { id: "kws-" + Date.now(), ...payload }]);
      setToast({ tone: "success", title: "Kawasan ditambahkan", body: `${payload.kawasan} tersimpan dalam registri.` });
    } else {
      setRows((r) => r.map((x) => (x.id === dialog.id ? { ...x, ...payload } : x)));
      setToast({ tone: "success", title: "Kawasan diperbarui", body: `${payload.kawasan} tersimpan dalam registri.` });
    }
    setDialog(null);
  };

  const confirmDelete = () => {
    const target = rows.find((r) => r.id === delId);
    setRows((r) => r.filter((x) => x.id !== delId));
    setDelId(null);
    setToast({ tone: "danger", title: "Kawasan dihapus", body: target ? `${target.kawasan} dihapus dari registri.` : undefined });
  };

  return (
    <div className="kc-page">
      <Breadcrumb items={[{ label: "Beranda", href: "#" }, { label: "Data & Statistik", href: "#" }, { label: "Kawasan Prioritas Nasional" }]} />
      <div className="kc-head">
        <div>
          <div className="kc-eyebrow">Data & statistik · tahun anggaran 2025</div>
          <h1>45 kawasan prioritas nasional tahun 2025</h1>
          <p>Indeks Pembangunan Kawasan Transmigrasi (IPKTRANS) 2024 dibandingkan dengan hasil dan proyeksi Indeks Transmigrasi (INTRANS) 2025.</p>
        </div>
        <div className="kc-head__a">
          <Button variant="outline" iconLeft={<Icon name="download" />}>Ekspor CSV</Button>
          <Button iconLeft={<Icon name="plus" />} onClick={openAdd}>Tambah kawasan</Button>
        </div>
      </div>

      {toast && <Alert tone={toast.tone} title={toast.title} onDismiss={() => setToast(null)}>{toast.body}</Alert>}

      <div className="kc-stats">
        <StatCard label="Total kawasan" value={rows.length} sub="terdaftar dalam registri" />
        <StatCard label="Rata-rata IPKTRANS 2024" value={fmt(avgIp)} />
        <StatCard label="Rata-rata INTRANS terukur" value={avgMeasured == null ? "—" : fmt(avgMeasured)} sub={`${measured.length} dari ${rows.length} kawasan diukur langsung`} />
        <StatCard label="Rata-rata proyeksi INTRANS 2025" value={fmt(avgProy)} />
      </div>

      <Card variant="flat">
        <div className="kc-toolbar">
          <Input size="sm" icon={<Icon name="search" />} placeholder="Cari nama kawasan…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          <Select size="sm" placeholder="Semua status 2025" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} options={STATUS_OPTIONS} />
          <div className="kc-toolbar__badges">
            {STATUS_OPTIONS.map((s) => <Badge key={s} tone={STATUS_TONE[s]} dot>{s} · {counts[s]}</Badge>)}
          </div>
        </div>

        <div className="kc-tablewrap">
          <table className="kc-table">
            <thead>
              <tr>
                <th rowSpan={2} className="kc-num" style={{ width: "44px" }}>No.</th>
                <th rowSpan={2}>Kawasan</th>
                <th colSpan={2} className="kc-grp">Hasil pengukuran 2024</th>
                <th colSpan={3} className="kc-grp">Hasil pengukuran 2025</th>
                <th rowSpan={2} style={{ width: "84px" }}>Aksi</th>
              </tr>
              <tr>
                <th className="kc-num">IPKTRANS</th>
                <th>Status</th>
                <th className="kc-num">INTRANS (langsung)</th>
                <th className="kc-num">Proyeksi INTRANS</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && <tr><td colSpan={8} className="kc-empty">Tidak ada kawasan yang cocok dengan pencarian.</td></tr>}
              {pageRows.map((r, i) => (
                <tr key={r.id}>
                  <td className="kc-num">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="kc-name">{r.kawasan}</td>
                  <td className="kc-num">{fmt(r.ipktrans2024)}</td>
                  <td><Badge tone={STATUS_TONE[r.status2024]} dot>{r.status2024}</Badge></td>
                  <td className="kc-num">{fmt(r.intrans2025)}</td>
                  <td className="kc-num">{fmt(r.proyeksi2025)}</td>
                  <td><Badge tone={STATUS_TONE[r.status2025]} dot>{r.status2025}</Badge></td>
                  <td>
                    <div className="kc-rowa">
                      <Button size="icon" variant="ghost" aria-label="Ubah kawasan" onClick={() => openEdit(r)}><Icon name="pencil" size="sm" /></Button>
                      <Button size="icon" variant="ghost" aria-label="Hapus kawasan" onClick={() => setDelId(r.id)}><Icon name="trash-2" size="sm" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2} className="kc-avglabel">Rata-rata</td>
                  <td className="kc-num">{fmt(avgIp)}</td>
                  <td></td>
                  <td className="kc-num">{avgMeasured == null ? "—" : fmt(avgMeasured)}</td>
                  <td className="kc-num">{fmt(avgProy)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} onChange={setPage} />
      </Card>

      <Dialog open={!!dialog} onClose={() => setDialog(null)} size="lg"
        title={dialog?.mode === "add" ? "Tambah kawasan" : "Ubah kawasan"}
        description="Data indeks digunakan untuk pemantauan capaian kawasan prioritas nasional."
        footer={<><Button variant="outline" onClick={() => setDialog(null)}>Batal</Button><Button onClick={save}>Simpan</Button></>}>
        {dialog && <KawasanForm value={form} onChange={setForm} />}
      </Dialog>

      <Dialog open={!!delId} onClose={() => setDelId(null)} size="sm" title="Hapus kawasan?"
        description="Tindakan ini tidak dapat dibatalkan."
        footer={<><Button variant="outline" onClick={() => setDelId(null)}>Batal</Button><Button variant="destructive" onClick={confirmDelete}>Hapus</Button></>}>
        Kawasan akan dihapus dari registri 45 kawasan prioritas nasional.
      </Dialog>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<KawasanCrudApp />);
