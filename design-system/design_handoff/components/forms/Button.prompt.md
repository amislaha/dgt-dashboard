Use `Button` for every action: submit, navigate, confirm, cancel.

```jsx
<Button variant="default" size="md" iconLeft={<PlusIcon />}>Ajukan Permohonan</Button>
<Button variant="outline">Batal</Button>
<Button variant="destructive" size="sm">Tolak</Button>
```

- `default` = Hijau primary; one per view. `outline` for secondary actions in toolbars, `ghost` for icon/table row actions, `destructive` only for rejection/deletion, `link` for inline text actions.
- `size="icon"` makes a square 36px button — pass a single icon child and an `aria-label`.
- Government forms are long: pair `block` with `size="lg"` for the final submit on mobile.
