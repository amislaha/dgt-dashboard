Use `Switch` for settings that apply immediately.

```jsx
<Switch label="Notifikasi email" checked={on} onChange={e => setOn(e.target.checked)} />
```

For form values that need saving, use `Checkbox` instead.
