Use `Input` for any single-line value: NIK, nama, email, search.

```jsx
<Label required htmlFor="nik">NIK</Label>
<Input id="nik" placeholder="16 digit NIK" inputMode="numeric" hint="Sesuai KTP elektronik." />
<Input icon={<SearchIcon />} placeholder="Cari kawasan..." size="sm" />
```

Always pair with `Label`. Pass `error` (not `hint`) once validation fails — never both.
