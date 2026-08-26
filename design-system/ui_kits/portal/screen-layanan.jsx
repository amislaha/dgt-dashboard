const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Button, Icon, Card, Badge, Input, Label, Select, Textarea, Checkbox, RadioGroup, Alert, Breadcrumb, Separator, Progress, Dialog } = NS;

function LayananScreen({ onNavigate }) {
  const [step, setStep] = React.useState(1);
  const [jenis, setJenis] = React.useState("baru");
  const [sent, setSent] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const steps = ["Data pengusul", "Data kawasan", "Dokumen", "Pernyataan"];
  return (
    <main className="pt-form">
      <div className="pt-wrap">
        <Breadcrumb items={[{ label: "Beranda", href: "#" }, { label: "Layanan", href: "#" }, { label: "Penetapan kawasan transmigrasi" }]} />
        <div className="pt-formhd">
          <div>
            <div className="pt-eyebrow">Layanan pemerintah daerah</div>
            <h1>Permohonan penetapan kawasan transmigrasi</h1>
            <p className="pt-lead">Formulir ini diajukan oleh dinas yang menangani transmigrasi di kabupaten/kota. Waktu penyelesaian 7 hari kerja sejak berkas lengkap. Tidak dipungut biaya.</p>
          </div>
          <Card variant="flat" title="Ringkasan layanan">
            <div className="pt-kv"><span>Biaya</span><strong>Gratis</strong></div>
            <div className="pt-kv"><span>Waktu</span><strong>7 hari kerja</strong></div>
            <div className="pt-kv"><span>Dasar hukum</span><strong>PP 3/2014</strong></div>
            <div className="pt-kv"><span>Pemohon</span><strong>Pemerintah daerah</strong></div>
          </Card>
        </div>

        {sent && <Alert tone="success" title="Permohonan terkirim" onDismiss={() => setSent(false)}>Nomor registrasi TRM-2026-004182. Pantau status melalui menu Permohonan Saya.</Alert>}

        <div className="pt-steps">
          {steps.map((s, i) => (
            <div key={s} className={"pt-step" + (i + 1 === step ? " pt-step--on" : "") + (i + 1 < step ? " pt-step--done" : "")}>
              <span className="pt-step__n">{i + 1 < step ? <Icon name="check" size="sm" /> : i + 1}</span>{s}
            </div>
          ))}
        </div>
        <Progress size="sm" value={step} max={steps.length} label={`Langkah ${step} dari ${steps.length}`} valueLabel={steps[step - 1]} />

        <div className="pt-formgrid">
          <Card>
            {step === 1 && (
              <div className="pt-fields">
                <div className="pt-f2">
                  <div className="pt-f"><Label htmlFor="dinas" required>Nama dinas pengusul</Label><Input id="dinas" defaultValue="Dinas Transmigrasi Kabupaten Kapuas" /></div>
                  <div className="pt-f"><Label htmlFor="prov" required>Provinsi</Label><Select id="prov" options={["Kalimantan Tengah", "Kalimantan Barat", "Sulawesi Tenggara", "Papua Selatan", "Maluku"]} /></div>
                </div>
                <div className="pt-f2">
                  <div className="pt-f"><Label htmlFor="pic" required>Nama pejabat penanggung jawab</Label><Input id="pic" placeholder="Nama lengkap dan gelar" /></div>
                  <div className="pt-f"><Label htmlFor="nip" required>NIP</Label><Input id="nip" inputMode="numeric" placeholder="18 digit NIP" hint="Tanpa spasi atau tanda baca." /></div>
                </div>
                <div className="pt-f2">
                  <div className="pt-f"><Label htmlFor="em" required>Email dinas</Label><Input id="em" type="email" placeholder="nama@kapuaskab.go.id" /></div>
                  <div className="pt-f"><Label htmlFor="tel" required>Telepon</Label><Input id="tel" placeholder="(0513) 000000" /></div>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="pt-fields">
                <div className="pt-f"><Label required>Jenis permohonan</Label>
                  <RadioGroup name="jenis" value={jenis} onChange={setJenis} options={[
                    { value: "baru", label: "Penetapan kawasan baru", description: "Kawasan belum pernah ditetapkan." },
                    { value: "perluasan", label: "Perluasan kawasan", description: "Menambah satuan permukiman pada kawasan yang sudah ada." },
                    { value: "revisi", label: "Revisi batas kawasan" }]} />
                </div>
                <div className="pt-f2">
                  <div className="pt-f"><Label htmlFor="nk" required>Nama kawasan</Label><Input id="nk" placeholder="Contoh: KTM Lamunti" /></div>
                  <div className="pt-f"><Label htmlFor="lu" required>Luas diusulkan (ha)</Label><Input id="lu" inputMode="decimal" placeholder="12480" /></div>
                </div>
                <div className="pt-f2">
                  <div className="pt-f"><Label htmlFor="dt" required>Daya tampung (KK)</Label><Input id="dt" inputMode="numeric" placeholder="1200" /></div>
                  <div className="pt-f"><Label htmlFor="st">Status lahan dominan</Label><Select id="st" placeholder="Pilih status" options={["APL", "HPK", "Hutan produksi konversi", "Lainnya"]} /></div>
                </div>
                <div className="pt-f"><Label htmlFor="ket">Uraian singkat usulan</Label><Textarea id="ket" rows={4} placeholder="Latar belakang, kesesuaian RTRW, dan rencana pengembangan usaha." /></div>
              </div>
            )}
            {step === 3 && (
              <div className="pt-fields">
                <Alert tone="info" title="Format berkas">PDF atau ZIP, maksimal 25 MB per dokumen. Berkas dipindai otomatis.</Alert>
                {[["SK Bupati penetapan lokasi", true], ["Peta batas kawasan (shapefile)", true], ["Rencana rinci satuan kawasan", true], ["Berita acara clean and clear lahan", false]].map(([d, ok]) => (
                  <div key={d} className={"pt-up" + (ok ? " pt-up--ok" : "")}>
                    <Icon name={ok ? "file-check-2" : "upload"} size="lg" />
                    <div><strong>{d}</strong><span>{ok ? "sk-bupati-2026-114.pdf · 2,4 MB" : "Wajib · belum diunggah"}</span></div>
                    <Button size="sm" variant={ok ? "ghost" : "outline"}>{ok ? "Ganti" : "Pilih berkas"}</Button>
                  </div>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="pt-fields">
                <div className="pt-decl">
                  <h3>Surat pernyataan</h3>
                  <p>Dengan ini kami menyatakan bahwa data dan dokumen yang disampaikan dalam permohonan ini benar, sah, dan dapat dipertanggungjawabkan. Kami bersedia menerima sanksi sesuai ketentuan peraturan perundang-undangan apabila di kemudian hari ditemukan ketidaksesuaian.</p>
                </div>
                <Checkbox label="Saya menyatakan seluruh data benar dan sah" description="Pernyataan ini setara tanda tangan elektronik." />
                <Checkbox label="Saya menyetujui pemrosesan data sesuai kebijakan privasi" />
                <Separator flush />
                <div className="pt-kv"><span>Kawasan</span><strong>KTM Lamunti</strong></div>
                <div className="pt-kv"><span>Jenis</span><strong>{jenis === "baru" ? "Penetapan kawasan baru" : jenis === "perluasan" ? "Perluasan kawasan" : "Revisi batas kawasan"}</strong></div>
                <div className="pt-kv"><span>Dokumen</span><strong>3 dari 4 lengkap</strong></div>
              </div>
            )}
            <Separator flush />
            <div className="pt-formnav">
              <Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)} iconLeft={<Icon name="arrow-left" />}>Sebelumnya</Button>
              {step < 4
                ? <Button onClick={() => setStep(step + 1)} iconRight={<Icon name="arrow-right" />}>Lanjut</Button>
                : <Button onClick={() => setConfirm(true)} iconLeft={<Icon name="send" />}>Kirim permohonan</Button>}
            </div>
          </Card>

          <aside className="pt-aside">
            <Card variant="flat" title="Dokumen yang perlu disiapkan">
              <ul className="pt-ul">
                <li>SK Bupati/Wali Kota penetapan lokasi</li>
                <li>Peta batas kawasan format shapefile</li>
                <li>Rencana rinci satuan kawasan</li>
                <li>Berita acara clean and clear lahan</li>
              </ul>
            </Card>
            <Card variant="flat" title="Butuh bantuan?">
              <p className="pt-help">Layanan informasi publik, Senin–Jumat 08.00–16.00 WIB.</p>
              <Button size="sm" variant="outline" block iconLeft={<Icon name="phone" />}>(021) 7940327</Button>
              <Button size="sm" variant="ghost" block iconLeft={<Icon name="book-open" />}>Panduan pengisian (PDF)</Button>
            </Card>
            <div className="pt-badgebox"><Badge tone="success" dot>Layanan aktif</Badge><Badge tone="outline">Tanpa biaya</Badge></div>
          </aside>
        </div>
      </div>

      <Dialog open={confirm} onClose={() => setConfirm(false)} size="sm" title="Kirim permohonan?"
        description="Setelah terkirim, berkas tidak dapat diubah kecuali dikembalikan untuk perbaikan."
        footer={<><Button variant="outline" onClick={() => setConfirm(false)}>Periksa lagi</Button><Button onClick={() => { setConfirm(false); setSent(true); setStep(1); }}>Kirim</Button></>}>
        Pastikan seluruh dokumen wajib telah diunggah. Saat ini 3 dari 4 dokumen lengkap.
      </Dialog>
    </main>
  );
}
Object.assign(window, { LayananScreen });
