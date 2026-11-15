import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AlertTriangle, BatteryFull, ChevronLeft, ChevronRight, Minus, Plus, Search, Signal, Wifi, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function StatusBar() {
  return (
    <div className="statusbar" aria-hidden="true">
      <span>9:41</span>
      <span className="icons"><Signal size={16} /><Wifi size={16} /><BatteryFull size={20} /></span>
    </div>
  )
}

export function TopBar({ title, action, onBack }: { title: string; action?: ReactNode; onBack?: () => void }) {
  const nav = useNavigate()
  return (
    <div className="topbar">
      <button className="icon-btn" aria-label="Volver" onClick={onBack ?? (() => nav(-1))}><ChevronLeft size={20} /></button>
      <div className="title">{title}</div>
      {action ?? <span className="spacer40" />}
    </div>
  )
}

export function IconButton({ icon: Icon, label, badge, onClick, accent }: { icon: LucideIcon; label: string; badge?: number; onClick?: () => void; accent?: boolean }) {
  return (
    <button className={'icon-btn' + (accent ? ' accent-border' : '')} aria-label={label} onClick={onClick}>
      <Icon size={20} />
      {badge ? <span className="badge">{badge}</span> : null}
    </button>
  )
}

export type NavItem = { to: string; label: string; icon: LucideIcon; end?: boolean }
export function BottomNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="bottomnav">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Avatar({ initials, size = 'm' }: { initials: string; size?: 'm' | 'l' }) {
  return <div className={`avatar ${size}`}>{initials}</div>
}

export function Tabs<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={o.value === value} className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Tag({ label, on, onClick, onRemove }: { label: string; on?: boolean; onClick?: () => void; onRemove?: () => void }) {
  return (
    <button className={'tag' + (on ? ' on' : '')} onClick={onRemove ?? onClick} aria-pressed={on}>
      {label}
      {onRemove ? <X size={14} /> : null}
    </button>
  )
}

export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="search">
      <Search size={20} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value ? <button aria-label="Borrar búsqueda" onClick={() => onChange('')}><X size={16} /></button> : null}
    </label>
  )
}

export function SectionTitle({ title, link, onLink }: { title: string; link?: string; onLink?: () => void }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {link ? <button className="link" onClick={onLink}>{link}</button> : null}
    </div>
  )
}

export function Kpi({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card kpi">
      <span className="xs muted">{label}</span>
      <span className="h5">{value}</span>
      {note ? <span className="xs med accent">{note}</span> : null}
    </div>
  )
}

export function Progress({ value, thin }: { value: number; thin?: boolean }) {
  return <div className={'progress' + (thin ? ' thin' : '')}><span style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} /></div>
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button role="switch" aria-checked={on} aria-label={label} className={'toggle' + (on ? ' on' : '')} onClick={() => onChange(!on)} />
}

export function Stepper({ label, value, onChange, step = 1, unit = '', min = 0, format }: { label: string; value: number; onChange: (v: number) => void; step?: number; unit?: string; min?: number; format?: (v: number) => string }) {
  const show = format ? format(value) : `${value}${unit}`
  return (
    <div className="stepper">
      <span className="xs muted">{label}</span>
      <div className="ctrl">
        <button aria-label={`Restar ${label}`} onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))}><Minus size={14} /></button>
        <span>{show}</span>
        <button aria-label={`Sumar ${label}`} onClick={() => onChange(+(value + step).toFixed(2))}><Plus size={14} /></button>
      </div>
    </div>
  )
}

export function Field({ label, value, onChange, placeholder, area, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; area?: boolean; icon?: LucideIcon }) {
  return (
    <label className="field">
      <span className="s med muted">{label}</span>
      <div className="input">
        {area ? <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} /> : <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
        {Icon ? <Icon size={20} color="var(--accent-icon)" /> : null}
      </div>
    </label>
  )
}

export function Steps({ step, total, title }: { step: number; total: number; title: string }) {
  return (
    <div className="steps" aria-label={`Paso ${step} de ${total}: ${title}`}>
      <div className="row between"><span className="xs bold accent">Paso {step} de {total}</span><span className="xs muted">{title}</span></div>
      <div className="segs">{Array.from({ length: total }, (_, i) => <span key={i} className={i < step ? 'on' : ''} />)}</div>
    </div>
  )
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="overlay bottom" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="handle" />
        {children}
      </div>
    </div>
  )
}

export function Dialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="overlay center" onClick={onClose}>
      <div className="dialog" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export function CircleIcon({ icon: Icon, tone = 'accent', size = 56 }: { icon: LucideIcon; tone?: 'accent' | 'warn' | 'ok'; size?: number }) {
  const bg = tone === 'warn' ? 'var(--warn-800)' : tone === 'ok' ? 'var(--ok-800)' : 'var(--accent-strong)'
  const fg = tone === 'warn' ? 'var(--warn-500)' : tone === 'ok' ? 'var(--ok-500)' : 'var(--text)'
  return <div className="circle-icon" style={{ background: bg, width: size, height: size }}><Icon size={size * 0.43} color={fg} /></div>
}

export function CupoBanner({ active, limit, onClick }: { active: number; limit: number; onClick: () => void }) {
  const full = active >= limit
  return (
    <button className="banner-cupo" onClick={onClick}>
      <AlertTriangle size={20} color="var(--warn-500)" />
      <div className="grow stack gap-2">
        <span className="s bold">{active} de {limit} clientes activos</span>
        <span className="xs muted">{full ? 'Llegaste al límite del plan gratuito.' : 'Te recomendamos pagar la mensualidad para tener clientes ilimitados.'}</span>
      </div>
      <span className="s bold warn">Ver plan</span>
    </button>
  )
}

export function Toast({ message, onDone }: { message: string | null; onDone: () => void }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 2200)
    return () => clearTimeout(t)
  }, [message, onDone])
  if (!message) return null
  return <div className="toast" role="status">{message}</div>
}

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null)
  return { msg, show: setMsg, clear: () => setMsg(null) }
}

export function Chevron() {
  return <ChevronRight size={20} color="var(--icon-muted)" />
}
