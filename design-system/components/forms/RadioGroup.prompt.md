Use `RadioGroup` when the options must all stay visible (jenis permohonan, status kepemilikan lahan).

```jsx
<RadioGroup name="jenis" value={jenis} onChange={setJenis} options={[
  { value: "baru", label: "Permohonan baru", description: "Belum pernah terdaftar." },
  { value: "perpanjangan", label: "Perpanjangan" }
]} />
```
