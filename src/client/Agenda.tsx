import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Dumbbell, Video } from 'lucide-react'
import { IconButton, Kpi, Sheet, Tabs, Tag, Toast, useToast } from '../ui'
import { useClient } from './store'
import { WEEK, type CalEvent } from './data'

const DAY_NAME: Record<number, string> = { 29: 'Lunes 29 de junio', 30: 'Martes 30 de junio', 1: 'Miércoles 1 de julio', 2: 'Jueves 2 de julio', 3: 'Viernes 3 de julio', 4: 'Sábado 4 de julio', 5: 'Domingo 5 de julio', 6: 'Lunes 6 de julio', 7: 'Martes 7 de julio' }
const TODAY = 2

export default function Agenda() {
  const c = useClient()
  const nav = useNavigate()
  const toast = useToast()
  const [view, setView] = useState<'semana' | 'mes'>('semana')
  const [day, setDay] = useState(TODAY)
  const [open, setOpen] = useState<string[]>([])
  const [booking, setBooking] = useState(false)
  const [moving, setMoving] = useState<CalEvent | null>(null)
  const dayEvents = c.events.filter((e) => e.day === day).sort((a, b) => a.time.localeCompare(b.time))
  const upcoming = c.events.filter((e) => e.day > day && e.day < 29).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  const allOpen = dayEvents.length > 0 && dayEvents.every((e) => open.includes(e.id))
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
  return (
    <>
      <div className="screen-body">
        <div className="row between" style={{ paddingTop: 8 }}>
          <div className="stack"><span className="s muted">Julio 2026</span><span className="h5">Calendario</span></div>
          <IconButton icon={Bell} label="Notificaciones" badge={c.notifications.filter((n) => n.unread).length} accent onClick={() => nav('/cliente/notificaciones')} />
        </div>
        <Tabs value={view} onChange={setView} options={[{ value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} />
        {view === 'semana' ? (
          <div className="row between">
            {WEEK.map(([d, n]) => {
              const has = c.events.some((e) => e.day === n)
              return <button key={n} className={'daypick' + (n === day ? ' on' : '') + (n < TODAY && n > 10 ? ' off' : '')} onClick={() => setDay(n)} aria-pressed={n === day}><span className="num">{n}</span><span className="xs">{d}</span>{has && <span className="dot" />}</button>
            })}
          </div>
        ) : (
          <MonthGrid day={day} onPick={(d) => { setDay(d); setView('semana') }} />
        )}
        <div className="row between"><span className="h6 faint">{day === TODAY ? 'Hoy · ' : ''}{DAY_NAME[day] ?? `${day} de julio`}</span>{dayEvents.length > 0 && <button className="link" onClick={() => setOpen(allOpen ? [] : dayEvents.map((e) => e.id))}>{allOpen ? 'Contraer todo' : 'Desplegar todo'}</button>}</div>
        {dayEvents.length === 0 && <span className="s muted">Día de descanso. Nada programado.</span>}
        {dayEvents.map((e) => <EventCard key={e.id} e={e} open={open.includes(e.id)} onToggle={() => toggle(e.id)} isToday={day === TODAY} onStart={() => nav('/cliente/entreno')} onMove={() => setMoving(e)} onJoin={() => toast.show('El enlace se activa 10 min antes de la reunión')} onReschedule={() => setBooking(true)} />)}
        {upcoming.length > 0 && <span className="h6 faint">Esta semana</span>}
        {upcoming.map((e) => <EventCard key={e.id} e={e} open={open.includes(e.id)} onToggle={() => toggle(e.id)} isToday={false} onStart={() => nav('/cliente/entreno')} onMove={() => setMoving(e)} onJoin={() => toast.show('El enlace se activa 10 min antes de la reunión')} onReschedule={() => setBooking(true)} showDay />)}
      </div>
      <div className="footer"><button className="btn primary" onClick={() => setBooking(true)}>Agendar cita</button></div>
      <BookSheet open={booking} onClose={() => setBooking(false)} onDone={(m) => toast.show(m)} />
      <MoveSheet ev={moving} onClose={() => setMoving(null)} onDone={(m) => toast.show(m)} />
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

function EventCard({ e, open, onToggle, isToday, onStart, onMove, onJoin, onReschedule, showDay }: { e: CalEvent; open: boolean; onToggle: () => void; isToday: boolean; onStart: () => void; onMove: () => void; onJoin: () => void; onReschedule: () => void; showDay?: boolean }) {
  const meet = e.kind === 'reunion'
  return (
    <div className="card" style={{ borderColor: open ? 'var(--accent-line)' : undefined }}>
      <button className="row gap-12" style={{ padding: '12px 16px', width: '100%', textAlign: 'left' }} onClick={onToggle} aria-expanded={open}>
        <div className="stack" style={{ width: 56, alignItems: 'center' }}><span className="h6">{e.time}</span><span className="xs muted">{e.duration}</span></div>
        <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }} />
        <div className="grow stack gap-2"><span className="m bold">{e.title}</span><span className="xs muted">{showDay ? DAY_NAME[e.day] ?? '' : e.sub}</span></div>
        <ChevronDown size={20} style={{ transform: open ? 'rotate(180deg)' : undefined, flex: 'none' }} />
      </button>
      {open && (
        <div className="stack gap-12" style={{ padding: '0 16px 16px 16px' }}>
          {meet ? (
            <>
              <span className="row gap-8 xs muted"><Video size={16} color="var(--accent-icon)" />Videollamada · el enlace se activa 10 min antes</span>
              <span className="s">{e.sub}</span>
              <div className="row gap-8"><button className="btn primary sm grow" onClick={onJoin}>Unirme</button><button className="btn tertiary sm grow" onClick={onReschedule}>Reprogramar</button></div>
            </>
          ) : (
            <>
              {(e.groups ?? [['Ejercicios', e.sub]]).map(([g, x]) => <div key={g} className="stack gap-2"><span className="s bold accent">{g}</span><span className="s muted">{x}</span></div>)}
              <div className="row gap-8">{isToday && <button className="btn primary sm grow" onClick={onStart}><Dumbbell size={16} />Empezar entreno</button>}<button className="btn tertiary sm grow" onClick={onMove}>Mover día</button></div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function MonthGrid({ day, onPick }: { day: number; onPick: (d: number) => void }) {
  const c = useClient()
  const cells = [29, 30, ...Array.from({ length: 31 }, (_, i) => i + 1), 1, 2]
  const done = [1, 3, 6, 7, 8, 10, 13, 14, 15, 17, 20, 21, 22, 24, 27, 28, 29]
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i} className="xs muted center">{d}</span>)}
        {cells.map((n, i) => {
          const other = i < 2 || i > 32
          const meet = !other && c.events.some((e) => e.day === n && e.kind === 'reunion')
          const train = !other && (c.events.some((e) => e.day === n && e.kind === 'entreno') || (n > TODAY && [6, 9, 13, 16, 20, 23, 27, 30].includes(n)))
          const ok = !other && n < TODAY && done.includes(n)
          return (
            <button key={i} disabled={other} onClick={() => onPick(n)} className="stack" style={{ alignItems: 'center', gap: 3, padding: '7px 0', borderRadius: 10, opacity: other ? 0.35 : 1, background: n === day && !other ? 'var(--accent)' : ok ? 'var(--accent-soft)' : 'var(--card)', color: n === day && !other ? 'var(--on-accent)' : undefined }}>
              <span className="s bold">{n}</span>
              <span className="row gap-2"><span style={{ width: 4, height: 4, borderRadius: 2, background: train || ok ? 'var(--accent-icon)' : 'transparent' }} />{meet && <span style={{ width: 4, height: 4, borderRadius: 2, background: 'var(--warn-500)' }} />}</span>
            </button>
          )
        })}
      </div>
      <div className="row gap-12 xs muted"><span className="row gap-4"><span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent-soft)', border: '1px solid var(--accent-icon)' }} />Completado</span><span className="row gap-4"><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent-icon)' }} />Programado</span><span className="row gap-4"><span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--warn-500)' }} />Reunión</span></div>
      <div className="kpis"><Kpi label="Entrenos" value="1/23" /><Kpi label="Reuniones" value="3" /><Kpi label="Racha" value={`${c.streak} días`} /></div>
    </>
  )
}

function BookSheet({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: (m: string) => void }) {
  const c = useClient()
  const [mode, setMode] = useState<'video' | 'presencial'>('video')
  const [d, setD] = useState(3)
  const [t, setT] = useState('18:00')
  const [why, setWhy] = useState('Revisión del progreso del mes')
  const days: [string, number][] = [['Vie', 3], ['Lun', 6], ['Mar', 7], ['Mié', 8], ['Jue', 9]]
  return (
    <Sheet open={open} onClose={onClose}>
      <span className="h5">Agendar cita con Pedro</span>
      <span className="s muted">Elige un horario libre de su agenda. Pedro confirma en menos de 24 h.</span>
      <Tabs value={mode} onChange={setMode} options={[{ value: 'video', label: 'Videollamada' }, { value: 'presencial', label: 'Presencial' }]} />
      <span className="s bold faint">Día</span>
      <div className="row gap-8">{days.map(([n, x]) => <button key={x} className={'daypick' + (d === x ? ' on' : '')} onClick={() => setD(x)}><span className="num">{x}</span><span className="xs">{n}</span></button>)}</div>
      <span className="s bold faint">Horarios disponibles · 30 min</span>
      <div className="chips">{['07:00', '12:30', '17:00', '18:00', '19:30', '20:00'].map((h) => <Tag key={h} label={h} on={t === h} onClick={() => setT(h)} />)}</div>
      <label className="field"><span className="s med muted">Motivo (opcional)</span><div className="input"><input value={why} onChange={(e) => setWhy(e.target.value)} /></div></label>
      <button className="btn primary lg block" onClick={() => { c.addEvent({ id: `b${Date.now()}`, day: d, time: t, duration: '30 min', title: 'Reunión con entrenador', sub: `${mode === 'video' ? 'Videollamada' : 'Presencial'} con Pedro · ${why || 'sin motivo'} · por confirmar`, kind: 'reunion' }); onClose(); onDone(`Cita solicitada para el ${d} de julio a las ${t}. Pedro la confirmará.`) }}>Confirmar · {days.find((x) => x[1] === d)?.[0]} {d}, {t}</button>
    </Sheet>
  )
}

function MoveSheet({ ev, onClose, onDone }: { ev: CalEvent | null; onClose: () => void; onDone: (m: string) => void }) {
  const c = useClient()
  const [d, setD] = useState<number | null>(null)
  const [t, setT] = useState('06:00')
  if (!ev) return null
  const options: [string, number][] = [['Vie', 3], ['Sáb', 4], ['Dom', 5], ['Lun', 6]]
  const label = (n: number) => (n === ev.day ? 'Actual' : c.events.some((e) => e.day === n && e.kind === 'entreno') ? 'Ya tiene entreno' : 'Libre')
  const target = d ?? options.find(([, n]) => label(n) === 'Libre')?.[1] ?? 4
  return (
    <Sheet open onClose={onClose}>
      <span className="h5">Mover {ev.title.split(' (')[0]} a otro día</span>
      <span className="s muted">{DAY_NAME[ev.day]} · {ev.time} · {ev.duration}</span>
      <span className="s bold faint">¿A qué día lo mueves?</span>
      <div className="row gap-8">
        {options.map(([n, x]) => {
          const l = label(x)
          return <button key={x} disabled={l !== 'Libre'} className="stack gap-4" style={{ flex: 1, alignItems: 'center', padding: '10px 4px', borderRadius: 12, border: `1px solid ${target === x ? 'var(--accent-line)' : 'var(--border)'}`, background: target === x ? 'var(--accent-soft)' : 'var(--bg)', opacity: l === 'Libre' ? 1 : 0.5 }} onClick={() => setD(x)}><span className="xs muted">{n}</span><span className="h6">{x}</span><span className="xs accent">{l}</span></button>
        })}
      </div>
      <span className="s bold faint">Hora</span>
      <div className="chips">{['06:00', '07:00', '18:00'].map((h) => <Tag key={h} label={h} on={t === h} onClick={() => setT(h)} />)}</div>
      <div className="notice"><span className="xs">Pedro recibirá un aviso del cambio. Tu racha no se pierde si entrenas el día nuevo.</span></div>
      <button className="btn primary lg block" onClick={() => { c.moveEvent(ev.id, target, t); onClose(); onDone(`Movido al ${DAY_NAME[target] ?? target}, ${t}`) }}>Mover a {DAY_NAME[target]?.split(' ')[0].toLowerCase()} {target}, {t}</button>
      <button className="btn ghost block" onClick={onClose}>Cancelar</button>
    </Sheet>
  )
}
