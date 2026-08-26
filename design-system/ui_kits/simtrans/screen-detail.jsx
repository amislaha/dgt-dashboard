const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Card, Badge, Button, Icon, Tabs, Breadcrumb, Alert, Dialog, Textarea, Separator, Progress, Avatar, Table, RadioGroup, Label, Switch } = NS;

const DOKUMEN = [
  { nama: "SK Bupati penetapan lokasi", file: "sk-bupati-2026-114.pdf", ok: true },
  { nama: "Peta batas kawasan (shapefile)", file: "batas-ktm-lamunti.zip", ok: true },
  { nama: "Rencana rinci satuan kawasan", file: "rkt-lamunti-2026.pdf", ok: true },
  { nama: "Berita acara clean and clear lahan", file: "—", ok: false },
];
const RIWAYAT = [
  { who: "Ahmad Fauzi", role: "Dinas Transmigrasi Kab. Kapuas", act: "mengirim permohonan", at: "22 Agu 2026, 09.14" },
  { who: "Sistem", role: "SIMTRANS", act: "memverifikasi kelengkapan — 3 dari 4 dokumen lengkap", at: "22 Agu 2026, 09.15" },
  { who: "Budi Hartono", role: "Analis Kawasan", act: "menugaskan verifikator wilayah Kalimantan", at: "22 Agu 2026, 13.02" },
  { who: "Siti Rahayu", role: "Verifikator Ditjen PKP2Trans", act: "membuka berkas untuk telaah", at: "24 Agu 2026, 08.40" },
];
const FAKTA = [["Nama kawasan", "Kawasan Transmigrasi Lamunti"], ["Kode usulan", "KTM-01"], ["Kabupaten", "Kapuas"], ["Provinsi", "Kalimantan Tengah"], ["Luas diusulkan", "12.480 ha"], ["Daya tampung", "1.200 KK"], ["Status lahan", "APL 78% · HPK 22%"], ["Titik koordinat", "−2,1932 · 114,7291"], ["Jenis permohonan", "Penetapan baru"], ["Tahun anggaran", "2026"]];

function DetailScreen() {
  const [tab, setTab] = React.useState("telaah");
  const [dlg, setDlg] = React.useState(false);
  const [keputusan, setKeputusan] = React.useState("setuju");
  const [done, setDone] = React.useState(false);
  return (
    <div className="sim-page">
      <Breadcrumb items={[{ label: "Dasbor", href: "#" }, { label: "Permohonan", href: "#" }, { label: "TRM-2026-004182" }]} />
      <PageHead eyebrow="Permohonan penetapan kawasan · TRM-2026-004182" title="KTM Lamunti, Kabupaten Kapuas"
        desc="Diusulkan Dinas Transmigrasi Kabupaten Kapuas, Kalimantan Tengah · masuk 22 Agustus 2026"
        actions={<><Button variant="outline" iconLeft={<Icon name="printer" />}>Cetak</Button>
          <Button variant="destructive" onClick={() => { setKeputusan("tolak"); setDlg(true); }}>Tolak</Button>
          <Button onClick={() => { setKeputusan("setuju"); setDlg(true); }} iconLeft={<Icon name="circle-check" />}>Setujui</Button></>} />

      {done
        ? <Alert tone="success" title="Keputusan tersimpan" onDismiss={() => setDone(false)}>Keputusan tercatat dalam log audit dan dikirim ke dinas pengusul.</Alert>
        : <Alert tone="warning" title="1 dokumen wajib belum diunggah">Berita acara clean and clear lahan belum tersedia. Verifikasi dapat dilanjutkan dengan catatan perbaikan.</Alert>}

      <div className="sim-detail">
        <div className="sim-detail__main">
          <Card variant="flat">
            <Tabs value={tab} onChange={setTab} items={[{ value: "telaah", label: "Telaah berkas" }, { value: "dokumen", label: "Dokumen", count: 4 }, { value: "riwayat", label: "Riwayat", count: 4 }]} />
            {tab === "telaah" && (
              <div className="sim-kv">
                {FAKTA.map(([k, v]) => <div key={k} className="sim-kv__row"><span>{k}</span><strong>{v}</strong></div>)}
                <Separator label="Kesesuaian teknis" />
                <Progress label="Kelengkapan berkas" value={3} max={4} valueLabel="3 / 4 dokumen" tone="warning" />
                <Progress label="Kesesuaian tata ruang (RTRW)" value={92} />
              </div>
            )}
            {tab === "dokumen" && (
              <Table density="compact" rows={DOKUMEN.map((d, i) => ({ id: i, ...d }))}
                columns={[{ key: "nama", label: "Dokumen wajib" },
                  { key: "file", label: "Berkas", render: (r) => <span className="sim-mono">{r.file}</span> },
                  { key: "ok", label: "Status", render: (r) => <Badge tone={r.ok ? "success" : "danger"} dot>{r.ok ? "Lengkap" : "Belum ada"}</Badge> },
                  { key: "a", label: "", width: "96px", render: (r) => r.ok ? <Button size="sm" variant="ghost" iconLeft={<Icon name="eye" size="sm" />}>Lihat</Button> : <Button size="sm" variant="outline">Minta</Button> }]} />
            )}
            {tab === "riwayat" && (
              <ol className="sim-time">
                {RIWAYAT.map((r, i) => (
                  <li key={i}><Avatar name={r.who} size="sm" />
                    <div><div className="sim-time__t"><strong>{r.who}</strong> {r.act}</div><div className="sim-time__m">{r.role} · {r.at}</div></div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>
        <div className="sim-detail__side">
          <Card title="Status permohonan" description="SLA 7 hari kerja">
            <Badge tone="warning" dot>Menunggu verifikasi</Badge>
            <Progress label="Sisa waktu SLA" value={2} max={7} valueLabel="hari ke-2 dari 7" tone="info" />
            <Separator flush />
            <div className="sim-kv__row"><span>Verifikator</span><strong>Siti Rahayu</strong></div>
            <div className="sim-kv__row"><span>Unit</span><strong>Ditjen PKP2Trans</strong></div>
          </Card>
          <Card title="Peta kawasan" description="Batas usulan · shapefile terunggah" action={<Button size="sm" variant="ghost" iconLeft={<Icon name="external-link" size="sm" />}>Buka</Button>}>
            <div className="sim-map"><Icon name="map" size="xl" /><span>Pratinjau peta hanya tersedia di lingkungan produksi.</span></div>
          </Card>
          <Card title="Catatan verifikator">
            <Textarea rows={3} placeholder="Tulis catatan telaah…" />
            <Button size="sm" variant="outline" block>Simpan catatan</Button>
          </Card>
        </div>
      </div>

      <Dialog open={dlg} onClose={() => setDlg(false)} title="Catat keputusan verifikasi"
        description="Keputusan bersifat final untuk tahap ini dan tercatat dalam log audit."
        footer={<><Button variant="outline" onClick={() => setDlg(false)}>Batal</Button>
          <Button variant={keputusan === "tolak" ? "destructive" : "default"} onClick={() => { setDlg(false); setDone(true); }}>{keputusan === "tolak" ? "Tolak permohonan" : "Simpan keputusan"}</Button></>}>
        <div className="sim-dlgform">
          <RadioGroup name="kep" value={keputusan} onChange={setKeputusan} options={[
            { value: "setuju", label: "Setujui", description: "Lanjut ke penetapan Direktur Jenderal." },
            { value: "perbaikan", label: "Kembalikan untuk perbaikan", description: "Dinas pengusul melengkapi dokumen dalam 14 hari." },
            { value: "tolak", label: "Tolak", description: "Wajib menyertakan dasar penolakan." }]} />
          <div className="sim-dlgform__f">
            <Label htmlFor="cat" required>Catatan keputusan</Label>
            <Textarea id="cat" rows={3} placeholder="Dasar pertimbangan dan tindak lanjut" />
          </div>
          <Switch label="Kirim notifikasi email ke dinas pengusul" defaultChecked />
        </div>
      </Dialog>
    </div>
  );
}
Object.assign(window, { DetailScreen });
