const NS = window.TransmigrasiDigitalDesignSystem_7b839d;
const { Button, Input, Label, Checkbox, Alert, Icon, Separator } = NS;

function LoginScreen({ onSignIn }) {
  const [nip, setNip] = React.useState("198703142010011002");
  return (
    <div className="sim-login">
      <div className="sim-login__panel">
        <div className="sim-login__brand">
          <span className="sim-login__plate"><img src="../../assets/logo-emblem.png" alt="" /></span>
          <div>
            <div className="sim-login__wm">KEMENTERIAN TRANSMIGRASI</div>
            <div className="sim-login__wm2">Kesejahteraan untuk semua</div>
          </div>
        </div>
        <div className="sim-login__quote">Satu data kawasan transmigrasi, dari usulan daerah sampai penempatan keluarga.</div>
        <div className="sim-login__meta">SIMTRANS v4.2 · Pusat Data dan Teknologi Informasi</div>
      </div>
      <div className="sim-login__form">
        <div className="sim-login__box">
          <h1 className="sim-login__h">Masuk ke SIMTRANS</h1>
          <p className="sim-login__p">Gunakan akun SSO kepegawaian Anda. Akses dicatat dalam log audit.</p>
          <Alert tone="info" title="Pemeliharaan terjadwal">Sabtu, 29 Agustus 2026, 22.00–02.00 WIB.</Alert>
          <div className="sim-login__field">
            <Label htmlFor="nip" required>NIP</Label>
            <Input id="nip" value={nip} onChange={(e) => setNip(e.target.value)} inputMode="numeric" />
          </div>
          <div className="sim-login__field">
            <Label htmlFor="pw" required>Kata sandi</Label>
            <Input id="pw" type="password" defaultValue="rahasia123" hint="Minimal 12 karakter, diganti setiap 90 hari." />
          </div>
          <div className="sim-login__row">
            <Checkbox label="Ingat perangkat ini" defaultChecked />
            <a href="#lupa">Lupa kata sandi?</a>
          </div>
          <Button block size="lg" onClick={onSignIn} iconRight={<Icon name="arrow-right" />}>Masuk</Button>
          <Separator label="atau" />
          <Button block variant="outline" iconLeft={<Icon name="shield-check" />} onClick={onSignIn}>Masuk dengan SSO ASN Digital</Button>
        </div>
      </div>
    </div>
  );
}
Object.assign(window, { LoginScreen });
