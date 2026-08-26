Use `Alert` for page-level notices: deadline, missing document, successful submission.

```jsx
<Alert tone="warning" title="Dokumen belum lengkap">Unggah SK Bupati sebelum 30 September 2026.</Alert>
<Alert tone="success" title="Permohonan terkirim" onDismiss={close}>Nomor registrasi TRM-2026-004182.</Alert>
```

Keep the body to one or two sentences and always say what the user should do next.
