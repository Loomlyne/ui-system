'use client';
import * as React from 'react';
import { FONT_PRESETS, RADIUS_PRESETS, type FontPresetId } from '@ui-system/core';
import { AVATAR_STYLES } from '@ui-system/react';
import { ColorField, Field, RangeField, Segmented, SelectField, TextField, UploadField } from './fields';
import { STARTERS, type Config } from '@/lib/state';

type Props = { config: Config; onChange: (c: Config) => void; onStarter: (id: string) => void };

const PRIMARY = ['#1C1B19', '#2F5D50', '#2F6BD8', '#5B4BDB', '#7A2E3A', '#3B2F2A'];
const ACCENT = ['#E0562B', '#C4952E', '#F2A93B', '#2F6BD8', '#1E8E4E', '#D94F8A'];
const NEUTRAL = ['#77736B', '#737373', '#6B7280', '#7C8579', '#8A7F6A', '#6E6A80'];

export default function Controls({ config: c, onChange, onStarter }: Props) {
  const up = <G extends keyof Config>(group: G, patch: Partial<Config[G]>) => onChange({ ...c, [group]: { ...(c[group] as object), ...patch } } as Config);
  const top = (patch: Partial<Config>) => onChange({ ...c, ...patch });
  const radiusPreset = Object.entries(RADIUS_PRESETS).find(([, v]) => v.roundness === c.radius.roundness && v.pill === c.radius.pill)?.[0] ?? '';

  return (
    <>
      <section className="pg-section">
        <h2>Start from</h2>
        <div className="pg-seg">
          {STARTERS.map((s) => <button key={s.id} type="button" aria-pressed={false} onClick={() => onStarter(s.id)}>{s.label}</button>)}
        </div>
        <p className="pg-note">Starters set color, shape, type and navs. Your wordmark and logo stay.</p>
      </section>

      <section className="pg-section">
        <h2>Brand</h2>
        <TextField label="Project name" value={c.name} onChange={(v) => top({ name: v })} />
        <div className="pg-row">
          <TextField label="Wordmark" value={c.brand.wordmark} onChange={(v) => up('brand', { wordmark: v })} />
          <TextField label="Caption" value={c.brand.caption} placeholder="(none)" onChange={(v) => up('brand', { caption: v })} />
        </div>
        <Field label="Logo arrangement">
          <Segmented value={c.brand.variant} options={['lockup', 'stacked', 'mark', 'wordmark'] as const} onChange={(v) => up('brand', { variant: v })} />
        </Field>
        <Field label="Generated mark">
          <Segmented value={c.brand.mark} options={['monogram', 'ring', 'spark', 'stack', 'orbit', 'none'] as const} onChange={(v) => up('brand', { mark: v })} />
        </Field>
        <div className="pg-row">
          <Field label="Mark color"><Segmented value={c.brand.markTone} options={['current', 'primary'] as const} labels={{ current: 'Text', primary: 'Brand' }} onChange={(v) => up('brand', { markTone: v })} /></Field>
          <Field label="Wordmark case"><Segmented value={c.brand.wordmarkCase} options={['normal', 'upper'] as const} labels={{ normal: 'Aa', upper: 'AA' }} onChange={(v) => up('brand', { wordmarkCase: v })} /></Field>
        </div>
        <Field label="Logo placement in navs">
          <Segmented value={c.brand.placement} options={['left', 'center', 'right'] as const} onChange={(v) => up('brand', { placement: v })} />
        </Field>
        <UploadField label="Client logo (full)" value={c.brand.logoSrc} onChange={(v) => up('brand', { logoSrc: v })} />
        <UploadField label="Client mark (icon only)" value={c.brand.markSrc} onChange={(v) => up('brand', { markSrc: v, mark: v ? 'custom' : c.brand.mark === 'custom' ? 'monogram' : c.brand.mark })} />
      </section>

      <section className="pg-section">
        <h2>Color</h2>
        <Field label="Mode"><Segmented value={c.color.mode} options={['light', 'dark'] as const} onChange={(v) => up('color', { mode: v })} /></Field>
        <ColorField label="Primary" value={c.color.primary} swatches={PRIMARY} onChange={(v) => up('color', { primary: v })} />
        <ColorField label="Accent" value={c.color.accent} swatches={ACCENT} onChange={(v) => up('color', { accent: v })} />
        <ColorField label="Neutral tint" value={c.color.neutral === 'auto' ? c.color.primary : c.color.neutral} swatches={NEUTRAL} onChange={(v) => up('color', { neutral: v })} />
        <div className="pg-row">
          <ColorField label="Success" value={c.color.success} onChange={(v) => up('color', { success: v })} />
          <ColorField label="Danger" value={c.color.danger} onChange={(v) => up('color', { danger: v })} />
        </div>
      </section>

      <section className="pg-section">
        <h2>Shape</h2>
        <Segmented value={radiusPreset as keyof typeof RADIUS_PRESETS} options={Object.keys(RADIUS_PRESETS) as Array<keyof typeof RADIUS_PRESETS>} onChange={(v) => up('radius', { ...RADIUS_PRESETS[v] })} />
        <RangeField label="Roundness" value={c.radius.roundness} suffix="%" onChange={(v) => up('radius', { roundness: v })} />
        <Field label="Pill controls" hint="buttons, chips, inputs, nav shells">
          <Segmented value={c.radius.pill ? 'on' : 'off'} options={['off', 'on'] as const} onChange={(v) => up('radius', { pill: v === 'on' })} />
        </Field>
      </section>

      <section className="pg-section">
        <h2>Type</h2>
        <SelectField<FontPresetId> label="Font pairing" value={c.type.preset} options={Object.values(FONT_PRESETS).map((p) => ({ value: p.id, label: `${p.label} · ${p.display} / ${p.body}` }))} onChange={(v) => up('type', { preset: v })} />
        <div className="pg-row">
          <TextField label="Display font" value={c.type.display ?? ''} placeholder="Any Google font" onChange={(v) => up('type', { display: v || undefined })} />
          <TextField label="Body font" value={c.type.body ?? ''} placeholder="Any Google font" onChange={(v) => up('type', { body: v || undefined })} />
        </div>
        <Field label="Button case"><Segmented value={c.type.buttonCase} options={['normal', 'upper'] as const} labels={{ normal: 'Sentence', upper: 'UPPER' }} onChange={(v) => up('type', { buttonCase: v })} /></Field>
      </section>

      <section className="pg-section">
        <h2>Feel</h2>
        <Field label="Density"><Segmented value={c.density} options={['compact', 'comfortable', 'spacious'] as const} onChange={(v) => top({ density: v })} /></Field>
        <Field label="Floating surfaces"><Segmented value={c.surface.float} options={['solid', 'glass'] as const} onChange={(v) => up('surface', { float: v })} /></Field>
        <Field label="Shadows"><Segmented value={c.surface.shadow} options={['none', 'soft', 'medium', 'deep'] as const} onChange={(v) => up('surface', { shadow: v })} /></Field>
        <Field label="Card borders"><Segmented value={c.surface.border} options={['hairline', 'none'] as const} onChange={(v) => up('surface', { border: v })} /></Field>
      </section>

      <section className="pg-section">
        <h2>People and motion</h2>
        <SelectField label="Avatar style (DiceBear)" value={c.avatars.style} options={AVATAR_STYLES.map((v) => ({ value: v, label: v }))} onChange={(v) => up('avatars', { style: v })} />
        <div className="pg-row">
          <Field label="Motion"><Segmented value={c.motion.enabled ? 'on' : 'off'} options={['on', 'off'] as const} onChange={(v) => up('motion', { enabled: v === 'on' })} /></Field>
          <Field label="Intensity"><Segmented value={c.motion.intensity} options={['subtle', 'expressive'] as const} onChange={(v) => up('motion', { intensity: v })} /></Field>
        </div>
      </section>

      <section className="pg-section">
        <h2>Navigation</h2>
        <Field label="Website"><Segmented value={c.nav.front} options={['island', 'bar', 'stacked', 'dock', 'minimal'] as const} onChange={(v) => up('nav', { front: v })} /></Field>
        <Field label="App"><Segmented value={c.nav.back} options={['sidebar', 'rail', 'inset', 'topbar', 'dock'] as const} onChange={(v) => up('nav', { back: v })} /></Field>
      </section>
    </>
  );
}
