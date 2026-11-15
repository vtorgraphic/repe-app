import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertTriangle, Bell, Calendar, Check, CheckCircle2, ClipboardList, DollarSign, Image, Mic, Paperclip, Play, Send, Shield, UserPlus, Video } from 'lucide-react'
import { Avatar, IconButton, SearchBar, Tabs, Tag, Toast, TopBar, useToast } from '../ui'
import { useTrainer } from './store'

const ICONS = { request: UserPlus, calendar: Calendar, alert: AlertTriangle, money: DollarSign, routine: ClipboardList, shield: Shield } as const

export function Notifications() {
  const t = useTrainer()
  const nav = useNavigate()
  const [filter, setFilter] = useState('Todas')
  const map: Record<string, string[]> = { Todas: Object.keys(ICONS), Solicitudes: ['request'], Pagos: ['money'], Recordatorios: ['calendar', 'alert', 'routine', 'shield'] }
  const items = t.notifications.filter((n) => map[filter].includes(n.icon))
  return (
    <>
      <TopBar title="Notificaciones" action={<IconButton icon={Check} label="Marcar todas como leídas" onClick={t.markAllRead} />} />
      <div className="screen-body tight">
        <div className="chips" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>{Object.keys(map).map((f) => <Tag key={f} label={f} on={filter === f} onClick={() => setFilter(f)} />)}</div>
        {['Hoy', 'Ayer'].map((g) => {
          const list = items.filter((n) => n.group === g)
          if (!list.length) return null
          return (
            <div key={g} className="stack gap-12">
              <span className="s bold faint">{g}</span>
              {list.map((n) => {
                const Icon = ICONS[n.icon as keyof typeof ICONS] ?? Bell
                return (
                  <button key={n.id} className="card row gap-12" style={{ padding: '14px 16px', alignItems: 'flex-start', textAlign: 'left' }} onClick={() => nav(n.to)}>
                    <div className="circle-icon" style={{ width: 40, height: 40, background: 'var(--accent-strong)' }}><Icon size={20} /></div>
                    <div className="grow stack gap-2"><span className="s bold">{n.title}</span><span className="xs muted">{n.text}</span><span className="xs faint">{n.time}</span></div>
                    {n.unread && <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)', flex: 'none', marginTop: 6 }} />}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </>
  )
}

export function Messages() {
  const t = useTrainer()
  const nav = useNavigate()
  const toast = useToast()
  const [tab, setTab] = useState<'clientes' | 'masivos'>('clientes')
  const [q, setQ] = useState('')
  const [bulk, setBulk] = useState('')
  const [to, setTo] = useState('Todos los activos')
  const list = t.conversations.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
  const preview = (m: { text: string; kind?: string; from: string }) => (m.kind === 'voice' ? `Nota de voz · ${m.text}` : m.kind === 'photo' ? 'Foto de progreso' : (m.from === 'out' ? 'Tú: ' : '') + m.text)
  return (
    <>
      <TopBar title="Mensajes" action={<IconButton icon={Send} label="Mensaje masivo" onClick={() => setTab('masivos')} />} />
      <div className="screen-body tight">
        <Tabs value={tab} onChange={setTab} options={[{ value: 'clientes', label: 'Clientes' }, { value: 'masivos', label: 'Masivos' }]} />
        {tab === 'clientes' ? (
          <>
            <SearchBar value={q} onChange={setQ} placeholder="Buscar conversación" />
            <div className="stack">
              {list.map((c, i) => {
                const last = c.messages[c.messages.length - 1]
                return (
                  <button key={c.id} className="row gap-12" style={{ padding: '12px 0', borderTop: i ? '1px solid var(--border)' : undefined, textAlign: 'left' }} onClick={() => nav(`/entrenador/mensajes/${c.id}`)}>
                    <Avatar initials={c.initials} />
                    <div className="grow stack gap-2"><span className="m med">{c.name}</span><span className="s muted truncate">{preview(last)}</span></div>
                    <div className="stack gap-6" style={{ alignItems: 'flex-end' }}>
                      <span className="xs muted">{c.time}</span>
                      {c.unread > 0 && <span className="chip accent" style={{ padding: '2px 7px' }}>{c.unread}</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <span className="s muted">Envía el mismo mensaje a varios clientes. Cada uno lo recibe en su chat privado.</span>
            <span className="s bold faint">Para</span>
            <div className="chips">{['Todos los activos', 'Por vencer', 'Inactivos'].map((x) => <Tag key={x} label={x} on={to === x} onClick={() => setTo(x)} />)}</div>
            <label className="field"><span className="s med muted">Mensaje</span><div className="input"><textarea value={bulk} onChange={(e) => setBulk(e.target.value)} placeholder="Ej. Esta semana el gimnasio cierra el jueves, movamos la sesión al viernes." /></div></label>
            <button className="btn primary lg block" disabled={!bulk.trim()} onClick={() => { toast.show(`Mensaje enviado a: ${to.toLowerCase()}`); setBulk('') }}>Enviar mensaje masivo</button>
          </>
        )}
      </div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function Chat() {
  const { id } = useParams()
  const t = useTrainer()
  const nav = useNavigate()
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)
  const conv = t.conversations.find((c) => c.id === id)
  const { readConversation } = t
  useEffect(() => { if (id) readConversation(id) }, [id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [conv?.messages.length])
  if (!conv) return <><TopBar title="Chat" /><div className="screen-body"><span className="s muted">Conversación no encontrada.</span></div></>
  const client = t.clients.find((c) => c.id === conv.clientId)
  const send = () => { if (!text.trim()) return; t.sendMessage(conv.id, text.trim()); setText('') }
  return (
    <>
      <TopBar title={conv.name} action={<IconButton icon={Video} label="Videollamada" />} />
      <button className="row gap-8" style={{ padding: '8px 16px', background: 'var(--card)' }} onClick={() => client && nav(`/entrenador/clientes/${client.id}`)}>
        <CheckCircle2 size={16} color="var(--ok-500)" />
        <span className="xs med muted grow" style={{ textAlign: 'left' }}>{client ? `${client.plan} · ${client.today ?? 'al día'}` : 'Solicitud pendiente'}</span>
        <span className="xs bold accent">Ver ficha</span>
      </button>
      <div className="screen-body tight" style={{ gap: 10 }}>
        <span className="xs med muted center">Hoy</span>
        {conv.messages.map((m, i) => m.kind === 'photo' ? (
          <div key={i} className="card stack gap-6" style={{ width: 200, height: 160, alignItems: 'center', justifyContent: 'center', alignSelf: m.from === 'in' ? 'flex-start' : 'flex-end' }}><Image size={20} color="var(--icon-muted)" /><span className="xs muted">Foto de progreso</span></div>
        ) : m.kind === 'voice' ? (
          <div key={i} className="card row gap-10" style={{ padding: '10px 14px 10px 10px', alignSelf: 'flex-start' }}>
            <span className="circle-icon" style={{ width: 32, height: 32, background: 'var(--accent)' }}><Play size={16} color="var(--on-accent)" /></span>
            <span className="row gap-2" aria-hidden="true">{[8, 14, 20, 12, 18, 24, 10, 16, 22, 12, 8, 14].map((h, k) => <span key={k} style={{ width: 3, height: h, borderRadius: 2, background: 'var(--text-2)' }} />)}</span>
            <span className="xs muted">{m.text}</span>
          </div>
        ) : (
          <div key={i} className={'bubble ' + m.from}><span>{m.text}</span><span className="time">{m.time}</span></div>
        ))}
        <div ref={end} />
      </div>
      <div className="row gap-10" style={{ padding: '12px 16px 28px', borderTop: '1px solid var(--border)' }}>
        <Paperclip size={20} color="var(--icon-muted)" />
        <label className="row gap-8 grow" style={{ padding: '12px 16px', borderRadius: 24, background: 'var(--card)', border: '1px solid var(--border)' }}>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Escribe un mensaje" aria-label="Mensaje" className="s grow" style={{ background: 'none', border: 0, outline: 0, minWidth: 0 }} />
          <Mic size={20} color="var(--icon-muted)" />
        </label>
        <button className="circle-icon" style={{ width: 44, height: 44, background: 'var(--accent)' }} aria-label="Enviar" onClick={send}><Send size={20} color="var(--on-accent)" /></button>
      </div>
    </>
  )
}
