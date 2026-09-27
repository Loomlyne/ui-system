'use client';
import * as React from 'react';
import { Button, Icon } from '@ui-system/react';

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="pg-field">
      <span className="pg-label">{label}{hint ? <code>{hint}</code> : null}</span>
      {children}
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange, labels }: { value: T; options: readonly T[]; onChange: (v: T) => void; labels?: Partial<Record<T, string>> }) {
  return (
    <div className="pg-seg" role="group">
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={o === value} onClick={() => onChange(o)}>{labels?.[o] ?? o}</button>
      ))}
    </div>
  );
}

const HEX = /^#?[0-9a-fA-F]{6}$/;

export function ColorField({ label, value, onChange, swatches = [] }: { label: string; value: string; onChange: (v: string) => void; swatches?: string[] }) {
  const [text, setText] = React.useState(value);
  React.useEffect(() => setText(value), [value]);
  return (
    <Field label={label}>
      <div className="pg-color">
        <input type="color" value={HEX.test(value) ? (value.startsWith('#') ? value : `#${value}`) : '#000000'} onChange={(e) => onChange(e.target.value.toUpperCase())} aria-label={`${label} color`} />
        <input type="text" value={text} spellCheck={false} aria-label={`${label} hex`}
          onChange={(e) => { setText(e.target.value); if (HEX.test(e.target.value)) onChange((e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`).toUpperCase()); }} />
      </div>
      {swatches.length ? (
        <div className="pg-swatches">
          {swatches.map((s) => <button key={s} type="button" className="pg-swatch" style={{ background: s }} aria-label={s} aria-pressed={s.toUpperCase() === value.toUpperCase()} onClick={() => onChange(s)} />)}
        </div>
      ) : null}
    </Field>
  );
}

export function RangeField({ label, value, min = 0, max = 100, step = 1, suffix = '', onChange }: { label: string; value: number; min?: number; max?: number; step?: number; suffix?: string; onChange: (v: number) => void }) {
  return (
    <Field label={label} hint={`${value}${suffix}`}>
      <input className="pg-range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
    </Field>
  );
}

export function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <input className="uis-input uis-input--sm" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} aria-label={label} />
    </Field>
  );
}

export function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ value: T; label: string }>; onChange: (v: T) => void }) {
  return (
    <Field label={label}>
      <div className="uis-control">
        <select className="uis-select uis-input--sm" style={{ height: 'var(--uis-h-sm)' }} value={value} onChange={(e) => onChange(e.target.value as T)} aria-label={label}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <Icon name="chevron-down" />
      </div>
    </Field>
  );
}

export function UploadField({ label, value, onChange }: { label: string; value?: string; onChange: (v?: string) => void }) {
  const ref = React.useRef<HTMLInputElement>(null);
  const read = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => onChange(String(r.result));
    r.readAsDataURL(file);
  };
  return (
    <Field label={label}>
      <div className="pg-upload">
        <span className="pg-thumb" style={value ? { backgroundImage: `url("${value}")` } : undefined} />
        <input ref={ref} type="file" accept="image/svg+xml,image/png,image/webp,image/jpeg" onChange={(e) => read(e.target.files?.[0])} />
        <Button size="sm" variant="secondary" icon="upload" onClick={() => ref.current?.click()}>{value ? 'Replace' : 'Upload'}</Button>
        {value ? <Button size="sm" variant="ghost" onClick={() => onChange(undefined)}>Remove</Button> : null}
      </div>
    </Field>
  );
}
