Use `Textarea` for narrative input: catatan verifikasi, alasan penolakan, aduan.

```jsx
<Textarea rows={4} maxLength={500} showCount value={note} onChange={e => setNote(e.target.value)} placeholder="Catatan verifikator" />
```

Pass `showCount` only when a `maxLength` genuinely applies.
