import * as React from 'react';
import { cx } from './context';
import { Icon, type IconName } from './Icon';

type Anchorish = { href?: string; onClick?: React.MouseEventHandler; target?: string };

/* ---------- Button ---------- */
export interface ButtonProps extends Anchorish {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'soft' | 'danger' | 'light' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName | string;
  iconRight?: IconName | string;
  iconOnly?: boolean;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', icon, iconRight, iconOnly, block, disabled, type = 'button', label, href, onClick, target, className, style, children }: ButtonProps) {
  const cls = cx('uis-btn', `uis-btn--${variant}`, size !== 'md' && `uis-btn--${size}`, iconOnly && 'uis-btn--icon', block && 'uis-btn--block', className);
  const content = (
    <>
      {icon ? <Icon name={icon} /> : null}
      {iconOnly ? null : children}
      {iconRight && !iconOnly ? <Icon name={iconRight} /> : null}
    </>
  );
  const aria = iconOnly ? label ?? (typeof children === 'string' ? children : undefined) : undefined;
  if (href) return <a className={cls} href={href} onClick={onClick} target={target} style={style} aria-label={aria} aria-disabled={disabled || undefined}>{content}</a>;
  return <button className={cls} type={type} onClick={onClick} disabled={disabled} style={style} aria-label={aria}>{content}</button>;
}

export interface IconButtonProps extends Anchorish {
  icon: IconName | string;
  label: string;
  count?: number | string;
  dot?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function IconButton({ icon, label, count, dot, href, onClick, className, style }: IconButtonProps) {
  const inner = (
    <>
      <Icon name={icon} />
      {count !== undefined && count !== null && count !== '' && count !== 0 ? <span className="uis-count">{count}</span> : null}
      {dot ? <span className="uis-dot" /> : null}
    </>
  );
  if (href) return <a className={cx('uis-iconbtn', className)} href={href} onClick={onClick} aria-label={label} title={label} style={style}>{inner}</a>;
  return <button type="button" className={cx('uis-iconbtn', className)} onClick={onClick} aria-label={label} title={label} style={style}>{inner}</button>;
}

/* ---------- Badge ---------- */
export type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export interface BadgeProps { tone?: Tone; solid?: boolean; outline?: boolean; dot?: boolean; className?: string; style?: React.CSSProperties; children?: React.ReactNode }
export function Badge({ tone = 'neutral', solid, outline, dot, className, style, children }: BadgeProps) {
  return (
    <span className={cx('uis-badge', tone !== 'neutral' && `uis-badge--${tone}`, solid && 'uis-badge--solid', outline && 'uis-badge--outline', className)} style={style}>
      {dot ? <span className="uis-badge__dot" /> : null}
      {children}
    </span>
  );
}

/* ---------- Fields ---------- */
let fieldId = 0;
const useFieldId = (id?: string) => {
  const ref = React.useRef(id ?? `uis-f${++fieldId}`);
  return id ?? ref.current;
};

export interface FieldProps { label?: string; hint?: string; error?: string; id?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }
export function Field({ label, hint, error, id, className, style, children }: FieldProps) {
  return (
    <div className={cx('uis-field', className)} style={style}>
      {label ? <label className="uis-label" htmlFor={id}>{label}</label> : null}
      {children}
      {error ? <span className="uis-hint uis-hint--error">{error}</span> : hint ? <span className="uis-hint">{hint}</span> : null}
    </div>
  );
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName | string;
  kbd?: string;
  size?: 'sm' | 'md';
}
export function Input({ label, hint, error, icon, kbd, size = 'md', id, className, style, ...rest }: InputProps) {
  const fid = useFieldId(id);
  const control = (
    <div className={cx('uis-control', icon && 'uis-control--icon', kbd && 'uis-control--kbd')}>
      {icon ? <Icon name={icon} /> : null}
      <input id={fid} className={cx('uis-input', size === 'sm' && 'uis-input--sm', error && 'uis-input--invalid')} aria-invalid={error ? true : undefined} {...rest} />
      {kbd ? <span className="uis-kbd">{kbd}</span> : null}
    </div>
  );
  if (!label && !hint && !error) return <div className={className} style={style}>{control}</div>;
  return <Field label={label} hint={hint} error={error} id={fid} className={className} style={style}>{control}</Field>;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; hint?: string; options: Array<string | { label: string; value: string }> }
export function Select({ label, hint, options, id, className, style, ...rest }: SelectProps) {
  const fid = useFieldId(id);
  return (
    <Field label={label} hint={hint} id={fid} className={className} style={style}>
      <div className="uis-control">
        <select id={fid} className="uis-select" {...rest}>
          {options.map((o) => {
            const opt = typeof o === 'string' ? { label: o, value: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <Icon name="chevron-down" />
      </div>
    </Field>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; hint?: string }
export function Textarea({ label, hint, id, className, style, ...rest }: TextareaProps) {
  const fid = useFieldId(id);
  return (
    <Field label={label} hint={hint} id={fid} className={className} style={style}>
      <textarea id={fid} className="uis-textarea" {...rest} />
    </Field>
  );
}

export interface ToggleProps { label?: string; checked?: boolean; defaultChecked?: boolean; onChange?: (checked: boolean) => void; className?: string; style?: React.CSSProperties }
export function Switch({ label, checked, defaultChecked, onChange, className, style }: ToggleProps) {
  return (
    <label className={cx('uis-switch', className)} style={style}>
      <input type="checkbox" role="switch" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onChange?.(e.target.checked)} />
      <span className="uis-switch__track"><span className="uis-switch__thumb" /></span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
export function Checkbox({ label, checked, defaultChecked, onChange, className, style }: ToggleProps) {
  return (
    <label className={cx('uis-check', className)} style={style}>
      <input type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={(e) => onChange?.(e.target.checked)} />
      <span className="uis-check__box"><Icon name="check" strokeWidth={2.5} /></span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}

/* ---------- Surfaces ---------- */
export interface CardProps { variant?: 'default' | 'flat' | 'raised' | 'sunken'; interactive?: boolean; flush?: boolean; as?: 'div' | 'article' | 'section' | 'a'; href?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }
export function Card({ variant = 'default', interactive, flush, as = 'div', href, className, style, children }: CardProps) {
  const Tag = (href ? 'a' : as) as 'div';
  return (
    <Tag {...(href ? { href } : {})} className={cx('uis-card', variant !== 'default' && `uis-card--${variant}`, interactive && 'uis-card--interactive', flush && 'uis-card--flush', className)} style={{ ...(href ? { textDecoration: 'none', color: 'inherit', display: 'block' } : null), ...style }}>
      {children}
    </Tag>
  );
}

export function Media({ src, alt = '', ratio, className, style, children }: { src?: string; alt?: string; ratio?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <div className={cx('uis-media', className)} style={{ aspectRatio: ratio, ...style }}>
      {src ? <img src={src} alt={alt} /> : children}
    </div>
  );
}

export function Divider({ vertical, className, style }: { vertical?: boolean; className?: string; style?: React.CSSProperties }) {
  return <hr className={cx('uis-divider', vertical && 'uis-divider--v', className)} style={style} />;
}

export function Kbd({ children, className, style }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <kbd className={cx('uis-kbd', className)} style={style}>{children}</kbd>;
}

/* ---------- Tabs ---------- */
export interface TabItem { label: string; value?: string; icon?: IconName | string; href?: string }
export interface TabsProps { items: Array<TabItem | string>; value?: string; defaultValue?: string; onChange?: (value: string) => void; variant?: 'segmented' | 'pill' | 'underline' | 'plain'; className?: string; style?: React.CSSProperties }
export function Tabs({ items, value, defaultValue, onChange, variant = 'segmented', className, style }: TabsProps) {
  const list = items.map((i) => (typeof i === 'string' ? { label: i, value: i } : { ...i, value: i.value ?? i.label }));
  const [inner, setInner] = React.useState(defaultValue ?? list[0]?.value);
  const current = value ?? inner;
  return (
    <div role="tablist" className={cx('uis-tabs', variant !== 'plain' && `uis-tabs--${variant}`, className)} style={style}>
      {list.map((t) => (
        <button key={t.value} type="button" role="tab" className="uis-tab" aria-selected={t.value === current}
          onClick={() => { setInner(t.value); onChange?.(t.value!); }}>
          {t.icon ? <Icon name={t.icon} size={16} /> : null}{t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Avatar (DiceBear) lives in Avatar.tsx ---------- */
export { Avatar, AvatarGroup, avatarSvg, AVATAR_STYLES, type AvatarProps } from './Avatar';

/* ---------- Feedback ---------- */
export function Tooltip({ children, className, style }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <span role="tooltip" className={cx('uis-tooltip', className)} style={style}>{children}</span>;
}

export function Toast({ title, children, icon = 'check', action, className, style }: { title?: string; children?: React.ReactNode; icon?: IconName | string; action?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div role="status" className={cx('uis-toast', className)} style={style}>
      <Icon name={icon} className="uis-toast__icon" />
      <div style={{ flex: 1 }}>{title ? <strong>{title}</strong> : null}{children}</div>
      {action}
    </div>
  );
}

export function Alert({ tone = 'info', title, children, icon, className, style }: { tone?: 'info' | 'success' | 'warning' | 'danger'; title?: string; children?: React.ReactNode; icon?: IconName | string; className?: string; style?: React.CSSProperties }) {
  const ic = icon ?? (tone === 'success' ? 'check' : tone === 'info' ? 'help' : 'bolt');
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cx('uis-alert', tone !== 'info' && `uis-alert--${tone}`, className)} style={style}>
      <Icon name={ic} size={18} style={{ marginTop: 2 }} />
      <div>{title ? <strong style={{ display: 'block', fontWeight: 600 }}>{title}</strong> : null}{children}</div>
    </div>
  );
}

export function Progress({ value = 0, className, style }: { value?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cx('uis-progress', className)} style={style} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/* ---------- Data ---------- */
export interface StatProps { label: string; value: React.ReactNode; delta?: string; trend?: 'up' | 'down'; icon?: IconName | string; className?: string; style?: React.CSSProperties }
export function Stat({ label, value, delta, trend = 'up', icon, className, style }: StatProps) {
  return (
    <div className={cx('uis-stat', className)} style={style}>
      <span className="uis-stat__label">{icon ? <Icon name={icon} size={16} /> : null}{label}</span>
      <span className="uis-stat__value">{value}</span>
      {delta ? <span className={cx('uis-stat__delta', `uis-stat__delta--${trend}`)}><Icon name={trend === 'up' ? 'trend' : 'chevron-down'} size={14} strokeWidth={2} />{delta}</span> : null}
    </div>
  );
}

export interface TableColumn { key: string; label: string; align?: 'left' | 'right' | 'center'; width?: string | number }
/** A cell is any node, or data: { tone, label } renders a status Badge, { strong } bold text. */
export type TableCell = React.ReactNode | { tone: Tone; label: string } | { strong: string };
export interface TableProps { columns: TableColumn[]; rows: Array<Record<string, TableCell>>; className?: string; style?: React.CSSProperties }
const renderCell = (v: TableCell): React.ReactNode => {
  if (v && typeof v === 'object' && !React.isValidElement(v) && !Array.isArray(v)) {
    const o = v as Record<string, unknown>;
    if ('tone' in o) return <Badge tone={o.tone as Tone} dot>{String(o.label ?? '')}</Badge>;
    if ('strong' in o) return <strong>{String(o.strong)}</strong>;
  }
  return v as React.ReactNode;
};
export function Table({ columns, rows, className, style }: TableProps) {
  return (
    <div className={cx('uis-table-wrap', className)} style={style}>
      <table className="uis-table">
        <thead><tr>{columns.map((c) => <th key={c.key} style={{ textAlign: c.align, width: c.width }}>{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{columns.map((c) => <td key={c.key} style={{ textAlign: c.align }}>{renderCell(r[c.key])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Overlays ---------- */
export function Popover({ title, className, style, children }: { title?: string; className?: string; style?: React.CSSProperties; children?: React.ReactNode }) {
  return (
    <div className={cx('uis-float', 'uis-popover', className)} style={style}>
      {title ? <p className="uis-popover__title">{title}</p> : null}
      {children}
    </div>
  );
}

export interface MenuItem { label: string; icon?: IconName | string; href?: string; kbd?: string; onClick?: () => void }
export function Menu({ items, className, style }: { items: MenuItem[]; className?: string; style?: React.CSSProperties }) {
  return (
    <div role="menu" className={cx('uis-menu', className)} style={style}>
      {items.map((it, i) => (
        <a key={i} role="menuitem" className="uis-menu__item" href={it.href ?? '#'} onClick={it.onClick ? (e) => { e.preventDefault(); it.onClick!(); } : undefined}>
          {it.icon ? <Icon name={it.icon} /> : null}{it.label}{it.kbd ? <span className="uis-kbd">{it.kbd}</span> : null}
        </a>
      ))}
    </div>
  );
}

export function Chips({ items, className, style }: { items: Array<{ label: string; href?: string; onClick?: () => void }>; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cx('uis-chips', className)} style={style}>
      {items.map((c, i) => <a key={i} className="uis-chip" href={c.href ?? '#'} onClick={c.onClick ? (e) => { e.preventDefault(); c.onClick!(); } : undefined}>{c.label}</a>)}
    </div>
  );
}

export function Scrim({ onClick }: { onClick?: () => void }) {
  return <div className="uis-scrim" onClick={onClick} aria-hidden />;
}

export interface DrawerProps { title?: string; open?: boolean; side?: 'right' | 'left'; floating?: boolean; footer?: React.ReactNode; onClose?: () => void; scrim?: boolean; className?: string; style?: React.CSSProperties; children?: React.ReactNode }
export function Drawer({ title, open = true, side = 'right', floating, footer, onClose, scrim = true, className, style, children }: DrawerProps) {
  if (!open) return null;
  return (
    <>
      {scrim ? <Scrim onClick={onClose} /> : null}
      <aside role="dialog" aria-label={title} className={cx('uis-drawer', side === 'left' && 'uis-drawer--left', floating && 'uis-drawer--floating', className)} style={style}>
        <div className="uis-drawer__head">
          <h2 className="uis-drawer__title">{title}</h2>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>
        <div className="uis-drawer__body">{children}</div>
        {footer ? <div className="uis-drawer__foot">{footer}</div> : null}
      </aside>
    </>
  );
}

export interface DialogProps { title?: string; description?: string; open?: boolean; actions?: React.ReactNode; onClose?: () => void; className?: string; style?: React.CSSProperties; children?: React.ReactNode }
export function Dialog({ title, description, open = true, actions, onClose, className, style, children }: DialogProps) {
  if (!open) return null;
  return (
    <>
      <Scrim onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className={cx('uis-dialog', className)} style={style}>
        {title ? <h2 className="uis-h3">{title}</h2> : null}
        {description ? <p className="uis-body-s uis-muted">{description}</p> : null}
        {children}
        {actions ? <div className="uis-dialog__actions">{actions}</div> : null}
      </div>
    </>
  );
}
