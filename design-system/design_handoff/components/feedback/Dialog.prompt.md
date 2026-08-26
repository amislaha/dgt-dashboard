Use `Dialog` for confirmations and short focused forms; never for long multi-step flows (use a page).

```jsx
<Dialog open={open} onClose={close} title="Setujui permohonan?" description="Tindakan ini tercatat dalam log audit."
  footer={<><Button variant="outline" onClick={close}>Batal</Button><Button onClick={approve}>Setujui</Button></>}>
  <Textarea rows={3} placeholder="Catatan verifikator (opsional)" />
</Dialog>
```
