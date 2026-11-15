import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Camera, ClipboardList, Coffee, Copy, Dumbbell, Info, Link2, MessageCircle, TrendingUp } from 'lucide-react'
import { Avatar, Chevron, CupoBanner, IconButton, Kpi, Progress, SearchBar, SectionTitle, Sheet, Tabs, Toast, TopBar, useToast } from '../ui'
import { useTrainer } from './store'
import { ClientCard } from './shared'
import { RequestCard, useAcceptRequest } from './Home'

type Tab = 'activos' | 'invitados' | 'archivados'

export function Clients() {
  const t = useTrainer()
  const nav = useNavigate()
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>('activos')
  const [q, setQ] = useState('')
  const { accept, ui } = useAcceptRequest()
  const inviteOpen = params.get('invitar') === '1'
  const groups = {
    activos: t.clients.filter((c) => ['activo', 'inactivo', 'por vencer'].includes(c.status)),
    invitados: t.clients.filter((c) => c.status === 'invitado'),
    archivados: t.clients.filter((c) => c.status === 'archivado'),
  }
  const list = groups[tab].filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <div className="screen-body">
        <div className="row between" style={{ paddingTop: 8 }}>
          <span className="h5">Clientes</span>
          {t.plan === 'gratis' ? <span className={'chip ' + (t.warn ? 'warn' : 'neutral')}>{t.activeCount}/{t.limit} activos</span> : <span className="chip accent">Ilimitado</span>}
        </div>
        {t.warn && <CupoBanner active={t.activeCount} limit={t.limit} onClick={() => nav('/entrenador/plan-ilimitado')} />}
        <SearchBar value={q} onChange={setQ} placeholder="Buscar cliente por nombre" />
        <Tabs value={tab} onChange={setTab} options={[{ value: 'activos', label: `Activos (${groups.activos.length})` }, { value: 'invitados', label: `Invitados (${groups.invitados.length})` }, { value: 'archivados', label: `Archivados (${groups.archivados.length})` }]} />
        {tab === 'activos' && t.requests.length > 0 && !q && (
          <>
            <SectionTitle title={`Solicitudes (${t.requests.length})`} />
            {t.requests.map((r) => <RequestCard key={r.id} r={r} onAccept={() => accept(r)} />)}
            <SectionTitle title="Tus clientes" />
          </>
        )}
        <div className="stack gap-8">
          {list.map((c) => (
            <ClientCard key={c.id} client={c} status={c.status} detail={c.status === 'por vencer' ? `${c.plan} · vence en ${c.daysLeft} días` : c.status === 'activo' ? `${c.plan} · vence ${c.end}` : c.today ?? c.plan} onClick={() => c.status !== 'invitado' && nav(`/entrenador/clientes/${c.id}`)} />
          ))}
          {list.length === 0 && <span className="s muted center" style={{ padding: 24 }}>No hay clientes aquí.</span>}
        </div>
      </div>
      <div className="footer"><button className="btn primary" onClick={() => setParams({ invitar: '1' })}>Invitar cliente</button></div>
      <InviteSheet open={inviteOpen} onClose={() => setParams({})} />
      {ui}
    </>
  )
}

function InviteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTrainer()
  const [service, setService] = useState(t.services[0].id)
  const toast = useToast()
  const link = `repe.app/i/ramiro-${service}`
  const copy = async (text: string, msg: string) => {
    try { await navigator.clipboard.writeText(text) } catch { /* el navegador no permite copiar */ }
    toast.show(msg)
  }
  const share = async () => {
    const data = { title: 'Entrena conmigo en Repe', text: 'Regístrate y solicita mi servicio desde la app:', url: `https://${link}` }
    if (navigator.share) { try { await navigator.share(data); return } catch { /* cancelado */ } }
    copy(data.url, 'Enlace copiado. Pégalo en WhatsApp o tus redes.')
  }
  return (
    <>
      <Sheet open={open} onClose={onClose}>
        <span className="h5">Invitar cliente</span>
        <span className="s muted">Elige el servicio y comparte el enlace. Tu cliente se registra y lo solicita desde la app.</span>
        <span className="s bold faint">Servicio</span>
        {t.services.filter((s) => s.on).map((s) => (
          <button key={s.id} className="row gap-12" style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg)', border: `1px solid ${service === s.id ? 'var(--accent-line)' : 'var(--border)'}`, textAlign: 'left' }} onClick={() => setService(s.id)}>
            <span className={'radio' + (service === s.id ? ' on' : '')} />
            <div className="grow stack gap-2"><span className="m med">{s.name}</span><span className="xs muted">{s.price} · {s.desc}</span></div>
          </button>
        ))}
        <div className="row gap-10" style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <Link2 size={20} color="var(--accent-icon)" />
          <span className="s med grow truncate">{link}</span>
          <button aria-label="Copiar enlace" onClick={() => copy(`https://${link}`, 'Enlace copiado')}><Copy size={20} color="var(--accent-icon)" /></button>
        </div>
        <div className="row between"><span className="s muted">O comparte el código</span><span className="m bold accent">RMR-728</span></div>
        <button className="btn primary lg block" onClick={share}>Compartir enlace</button>
        <button className="btn tertiary block" onClick={() => copy('RMR-728', 'Código copiado')}>Copiar código</button>
      </Sheet>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

type DetailTab = 'info' | 'progreso' | 'plan'

export function ClientDetail() {
  const { id } = useParams()
  const t = useTrainer()
  const nav = useNavigate()
  const [tab, setTab] = useState<DetailTab>('progreso')
  const client = t.clients.find((c) => c.id === id)
  const routines = useMemo(() => t.routines.filter((r) => r.assigned.includes(id ?? '')), [t.routines, id])
  const diets = useMemo(() => t.diets.filter((d) => d.assigned.includes(id ?? '')), [t.diets, id])
  if (!client) return <><TopBar title="Cliente" /><div className="screen-body"><span className="s muted">No encontramos este cliente.</span></div></>
  const conv = t.conversations.find((c) => c.clientId === client.id)
  const elapsed = Math.max(0.05, 1 - client.daysLeft / 30)
  const statusChip = { activo: ['ok', 'Activo'], inactivo: ['neutral', 'Inactivo'], 'por vencer': ['warn', 'Por vencer'], invitado: ['info', 'Invitado'], archivado: ['neutral', 'Archivado'] }[client.status]
  return (
    <>
      <TopBar title="Ficha del cliente" action={<IconButton icon={MessageCircle} label="Abrir chat" onClick={() => nav(`/entrenador/mensajes/${conv?.id ?? 'maria'}`)} />} />
      <div className="screen-body">
        <div className="row gap-16">
          <Avatar initials={client.initials} size="l" />
          <div className="stack gap-4">
            <span className="h5">{client.name}</span>
            <span className="s muted">{client.age} años · Nivel {client.level.toLowerCase()}</span>
            <span className={`chip ${statusChip[0]}`} style={{ alignSelf: 'flex-start' }}>{statusChip[1]}</span>
          </div>
        </div>
        <div className="card pad stack gap-8">
          <div className="row between"><span className="s bold">{client.plan}</span><span className="s bold accent">{client.price}</span></div>
          <Progress value={elapsed} />
          <div className="row between"><span className="xs muted">Inicio {client.start}</span><span className="xs muted">Fin {client.end} · {client.daysLeft} días</span></div>
        </div>
        {client.condition && <div className="notice err"><Info size={20} color="var(--err-300)" /><span className="xs">{client.condition}</span></div>}
        <Tabs value={tab} onChange={setTab} options={[{ value: 'info', label: 'Información' }, { value: 'progreso', label: 'Progreso' }, { value: 'plan', label: 'Plan' }]} />
        {tab === 'progreso' && (
          <>
            <div className="kpis">
              <Kpi label="Peso" value={client.weight ? `${client.weight} kg` : '—'} note="-1.6 kg este mes" />
              <Kpi label="Grasa" value={client.fat ? `${client.fat}%` : '—'} note="-2% este mes" />
              <Kpi label="Constancia" value={`${client.consistency}%`} note="Últimas 4 semanas" />
            </div>
            <SectionTitle title="Récords personales" />
            <div className="card">
              {client.records.length ? client.records.map((r) => (
                <div key={r.name} className="list-row"><TrendingUp size={20} /><span className="m med grow">{r.name}</span><span className="s muted">{r.value}</span></div>
              )) : <div className="list-row"><span className="s muted">Aún no hay registros.</span></div>}
            </div>
            <SectionTitle title="Fotos de progreso" />
            <div className="kpis">
              {['Sep', 'Oct', 'Nov'].map((m) => <div key={m} className="card stack gap-6" style={{ height: 96, alignItems: 'center', justifyContent: 'center' }}><Camera size={20} color="var(--icon-muted)" /><span className="xs muted">{m}</span></div>)}
            </div>
          </>
        )}
        {tab === 'info' && (
          <div className="card">
            {[['Edad', `${client.age} años`], ['Nivel', client.level], ['Peso', client.weight ? `${client.weight} kg` : '—'], ['Grasa corporal', client.fat ? `${client.fat}%` : '—'], ['Horario habitual', 'Lunes a viernes · 4:00 a 5:30 pm'], ['Lugar', 'Gimnasio']].map(([k, v]) => (
              <div key={k} className="list-row"><span className="s muted grow">{k}</span><span className="s med">{v}</span></div>
            ))}
          </div>
        )}
        {tab === 'plan' && (
          <>
            <SectionTitle title="Rutinas asignadas" />
            <div className="card">
              {routines.length ? routines.map((r) => <div key={r.id} className="list-row"><Dumbbell size={20} color="var(--accent-icon)" /><span className="m med grow">{r.name}</span><span className="xs muted">{r.items.length} ejercicios</span></div>) : <div className="list-row"><span className="s muted">Sin rutinas asignadas.</span></div>}
            </div>
            <SectionTitle title="Dieta" />
            <div className="card">
              {diets.length ? diets.map((d) => <div key={d.id} className="list-row"><Coffee size={20} color="var(--accent-icon)" /><span className="m med grow">{d.name}</span></div>) : <div className="list-row"><span className="s muted">Sin dieta asignada.</span></div>}
            </div>
          </>
        )}
        <button className="list-row card" onClick={() => { t.archiveClient(client.id); nav('/entrenador/clientes') }}>
          <ClipboardList size={20} color="var(--err-300)" /><span className="m med grow err">Archivar cliente</span><Chevron />
        </button>
      </div>
      <div className="footer">
        <button className="btn primary" onClick={() => nav('/entrenador/rutinas')}>Asignar plan</button>
        <button className="btn tertiary" onClick={() => nav('/entrenador/calendario')}>Agendar</button>
      </div>
    </>
  )
}
