import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Avatar, CupoBanner, IconButton, Kpi, SectionTitle, Sheet, Tabs, Tag, Toast, TopBar, useToast } from '../ui'
import { useTrainer, newId } from './store'
import { PENDING_NOTES } from './data'

const WEEK = [['Lun', 16], ['Mar', 17], ['Mié', 18], ['Jue', 19], ['Vie', 20], ['Sáb', 21], ['Dom', 22]] as const

function SessionCard({ s }: { s: { time: string; duration: string; client: string; type: string; confirmed: boolean } }) {
  return (
    <div className="card row gap-12" style={{ padding: '12px 16px' }}>
      <div className="stack" style={{ width: 56, alignItems: 'center' }}><span className="h6">{s.time}</span><span className="xs muted">{s.duration}</span></div>
      <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
      <div className="grow stack gap-2"><span className="m med truncate">{s.client}</span><span className="xs muted truncate">{s.type}</span></div>
      <span className={'chip ' + (s.confirmed ? 'ok' : 'warn')}>{s.confirmed ? 'Confirmada' : 'Por confirmar'}</span>
    </div>
  )
}

export function CalendarPage() {
  const t = useTrainer()
  const nav = useNavigate()
  const [view, setView] = useState<'mes' | 'semana' | 'lista'>('semana')
  const [day, setDay] = useState(16)
  const [open, setOpen] = useState(false)
  const pending = t.sessions.filter((s) => !s.confirmed)
  const list = view === 'lista' ? t.sessions : t.sessions.filter((s) => s.day === day)
  const dayName = WEEK.find((w) => w[1] === day)?.[0] ?? ''
  return (
    <>
      <div className="screen-body">
        <div className="row between" style={{ paddingTop: 8 }}>
          <span className="h5">Calendario</span>
          <IconButton icon={Clock} label="Por confirmar" badge={pending.length} accent onClick={() => nav('/entrenador/calendario/por-confirmar')} />
        </div>
        {t.warn && <CupoBanner active={t.activeCount} limit={t.limit} onClick={() => nav('/entrenador/plan-ilimitado')} />}
        <Tabs value={view} onChange={setView} options={[{ value: 'mes', label: 'Mes' }, { value: 'semana', label: 'Semana' }, { value: 'lista', label: 'Lista' }]} />
        {view !== 'lista' && (
          <>
            <div className="row between"><ChevronLeft size={20} /><span className="m bold">{view === 'mes' ? 'Noviembre 2026' : '16 – 22 noviembre 2026'}</span><ChevronRight size={20} /></div>
            {view === 'semana' ? (
              <div className="row between">
                {WEEK.map(([d, n]) => {
                  const has = t.sessions.some((s) => s.day === n)
                  return (
                    <button key={n} className={'daypick' + (n === day ? ' on' : '') + (n === 22 ? ' off' : '')} onClick={() => setDay(n)} aria-pressed={n === day}>
                      <span className="num">{n}</span><span className="xs">{d}</span>{has && <span className="dot" />}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => <span key={d} className="xs muted center">{d}</span>)}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
                  const has = t.sessions.some((s) => s.day === n)
                  return (
                    <button key={n} onClick={() => { setDay(n); setView('semana') }} className="stack" style={{ alignItems: 'center', gap: 3, padding: '8px 0', borderRadius: 10, background: n === day ? 'var(--accent)' : 'var(--card)', color: n === day ? 'var(--on-accent)' : undefined, gridColumnStart: n === 1 ? 7 : undefined }}>
                      <span className="s bold">{n}</span>
                      <span style={{ width: 4, height: 4, borderRadius: 2, background: has ? 'var(--accent-icon)' : 'transparent' }} />
                    </button>
                  )
                })}
              </div>
            )}
          </>
        )}
        <div className="kpis">
          <Kpi label="Esta semana" value={String(t.sessions.length)} note={`${t.sessions.filter((s) => s.day === 16).length} hoy`} />
          <Kpi label="Por confirmar" value={String(pending.length)} note="Revisar" />
          <Kpi label="Cancelaciones" value="1" note="Esta semana" />
        </div>
        <SectionTitle title={view === 'lista' ? 'Todas las sesiones' : `${dayName} ${day}`} link={pending.length ? 'Por confirmar' : undefined} onLink={() => nav('/entrenador/calendario/por-confirmar')} />
        <div className="stack gap-8">
          {list.map((s) => <SessionCard key={s.id} s={s} />)}
          {list.length === 0 && <span className="s muted center" style={{ padding: 16 }}>Sin sesiones este día.</span>}
        </div>
      </div>
      <div className="footer"><button className="btn primary" onClick={() => setOpen(true)}>Agendar sesión</button></div>
      <ScheduleSheet open={open} onClose={() => setOpen(false)} day={day} />
    </>
  )
}

function ScheduleSheet({ open, onClose, day }: { open: boolean; onClose: () => void; day: number }) {
  const t = useTrainer()
  const toast = useToast()
  const active = t.clients.filter((c) => ['activo', 'inactivo', 'por vencer'].includes(c.status))
  const [client, setClient] = useState(active[0]?.name ?? '')
  const [time, setTime] = useState('17:00')
  const [mode, setMode] = useState<'online' | 'presencial'>('online')
  const save = () => {
    t.addSession({ id: newId('s'), day, time, duration: '1 h', client, type: mode === 'online' ? 'Online · Videollamada' : 'Presencial · Gimnasio Central', confirmed: true })
    onClose()
    toast.show(`Sesión con ${client} agendada el ${day} nov a las ${time}`)
  }
  return (
    <>
      <Sheet open={open} onClose={onClose}>
        <span className="h5">Agendar sesión</span>
        <span className="s bold faint">Cliente</span>
        <div className="chips">{active.slice(0, 6).map((c) => <Tag key={c.id} label={c.name.split(' ')[0]} on={client === c.name} onClick={() => setClient(c.name)} />)}</div>
        <span className="s bold faint">Hora · {day} de noviembre</span>
        <div className="chips">{['07:00', '09:30', '12:00', '17:00', '19:00'].map((h) => <Tag key={h} label={h} on={time === h} onClick={() => setTime(h)} />)}</div>
        <Tabs value={mode} onChange={setMode} options={[{ value: 'online', label: 'Online' }, { value: 'presencial', label: 'Presencial' }]} />
        <button className="btn primary lg block" onClick={save}>Agendar</button>
      </Sheet>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function PendingSessions() {
  const t = useTrainer()
  const toast = useToast()
  const pending = t.sessions.filter((s) => !s.confirmed)
  return (
    <>
      <TopBar title="Por confirmar" />
      <div className="screen-body">
        <span className="s muted">{pending.length ? `${pending.length} solicitudes esperan tu respuesta. Si no respondes en 24 h, se cancelan automáticamente.` : 'No tienes citas por confirmar.'}</span>
        {pending.map((s) => (
          <div key={s.id} className="card pad stack gap-12">
            <div className="row gap-12">
              <Avatar initials={s.client.split(' ').map((w) => w[0]).join('')} />
              <div className="grow stack gap-2"><span className="m med">{s.client}</span><span className="xs muted">{s.type}</span></div>
            </div>
            <div className="row gap-8" style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--bg)' }}><CalIcon size={20} color="var(--accent-icon)" /><span className="s med">{s.day} nov · {s.time} · {s.duration}</span></div>
            {PENDING_NOTES[s.id] && <span className="s muted">{PENDING_NOTES[s.id]}</span>}
            <div className="row gap-8">
              <button className="btn primary sm grow" onClick={() => { t.confirmSession(s.id); toast.show('Cita confirmada') }}>Aceptar</button>
              <button className="btn tertiary sm grow" onClick={() => toast.show('Le propusimos otra hora al cliente')}>Otra hora</button>
            </div>
            <button className="btn danger sm" onClick={() => { t.rejectSession(s.id); toast.show('Solicitud rechazada') }}>Rechazar solicitud</button>
          </div>
        ))}
      </div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}
