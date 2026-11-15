import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, ClipboardList, MessageCircle, UserPlus } from 'lucide-react'
import { Avatar, CupoBanner, IconButton, Kpi, SectionTitle, Toast, useToast } from '../ui'
import { useTrainer } from './store'
import { ClientCard, CupoFullSheet, hoursLabel } from './shared'
import type { Request } from './data'

export function useAcceptRequest() {
  const t = useTrainer()
  const toast = useToast()
  const [blocked, setBlocked] = useState<Request | null>(null)
  const accept = (r: Request) => {
    if (t.acceptRequest(r.id)) toast.show(`${r.name} ahora es tu cliente. Se le cobró su ${r.service.toLowerCase()}.`)
    else setBlocked(r)
  }
  const ui = (
    <>
      <CupoFullSheet request={blocked} onClose={() => setBlocked(null)} />
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
  return { accept, ui }
}

export function RequestCard({ r, onAccept }: { r: Request; onAccept: () => void }) {
  const t = useTrainer()
  return (
    <div className="card pad stack gap-12">
      <div className="row gap-12">
        <Avatar initials={r.initials} />
        <div className="grow stack gap-2">
          <span className="m med">{r.name}</span>
          <span className="xs muted">{r.service} · {r.price}</span>
        </div>
        <span className="chip warn">{hoursLabel(r.hoursLeft)}</span>
      </div>
      <div className="row gap-8">
        <button className="btn primary sm grow" onClick={onAccept}>Aceptar</button>
        <button className="btn tertiary sm grow" onClick={() => t.rejectRequest(r.id)}>Rechazar</button>
      </div>
    </div>
  )
}

export default function Home() {
  const t = useTrainer()
  const nav = useNavigate()
  const { accept, ui } = useAcceptRequest()
  const today = t.clients.filter((c) => ['activo', 'inactivo'].includes(c.status)).slice(0, 3)
  const expiring = t.clients.filter((c) => c.status === 'por vencer')
  const unread = t.notifications.filter((n) => n.unread).length
  const msgs = t.conversations.reduce((a, c) => a + c.unread, 0)
  const confirmed = t.sessions.filter((s) => s.day === 16)
  return (
    <>
      <div className="screen-body">
        <div className="row between" style={{ paddingTop: 8 }}>
          <div className="stack">
            <span className="s muted">Lunes, 16 de noviembre</span>
            <span className="h5">Hola, Ramiro</span>
          </div>
          <div className="row gap-8">
            <IconButton icon={MessageCircle} label="Mensajes" badge={msgs} accent onClick={() => nav('/entrenador/mensajes')} />
            <IconButton icon={Bell} label="Notificaciones" badge={unread} accent onClick={() => nav('/entrenador/notificaciones')} />
          </div>
        </div>
        {t.warn && <CupoBanner active={t.activeCount} limit={t.limit} onClick={() => nav('/entrenador/plan-ilimitado')} />}
        <div className="kpis">
          <Kpi label="Sesiones hoy" value={String(confirmed.length)} note="1 completada" />
          <Kpi label="Clientes activos" value={t.plan === 'ilimitado' ? String(t.activeCount) : `${t.activeCount}/${t.limit}`} note={t.plan === 'ilimitado' ? 'Plan ilimitado' : `${Math.max(0, t.limit - t.activeCount)} cupos libres`} />
          <Kpi label="Ingresos nov." value="$1.240" note="+12% vs oct." />
        </div>
        {t.requests.length > 0 && (
          <>
            <SectionTitle title={`Solicitudes nuevas (${t.requests.length})`} />
            {t.requests.slice(0, 2).map((r) => <RequestCard key={r.id} r={r} onAccept={() => accept(r)} />)}
          </>
        )}
        <SectionTitle title="Entrenamientos de hoy" link="Ver todo" onLink={() => nav('/entrenador/clientes')} />
        <div className="stack gap-8">
          {today.map((c) => <ClientCard key={c.id} client={c} detail={c.today ?? c.plan} status={c.status} onClick={() => nav(`/entrenador/clientes/${c.id}`)} />)}
        </div>
        {expiring.length > 0 && (
          <>
            <SectionTitle title="Por vencer" />
            <div className="stack gap-8">
              {expiring.map((c) => <ClientCard key={c.id} client={c} detail={`${c.plan} · vence en ${c.daysLeft} días`} status={c.status} onClick={() => nav(`/entrenador/clientes/${c.id}`)} />)}
            </div>
          </>
        )}
        <SectionTitle title="Acciones rápidas" />
        <div className="kpis">
          {[
            { icon: UserPlus, label: 'Invitar cliente', to: '/entrenador/clientes?invitar=1' },
            { icon: ClipboardList, label: 'Crear rutina', to: '/entrenador/rutinas/nueva' },
            { icon: Calendar, label: 'Agendar', to: '/entrenador/calendario' },
          ].map(({ icon: Icon, label, to }) => (
            <button key={label} className="card stack gap-8" style={{ padding: '14px 8px', alignItems: 'center' }} onClick={() => nav(to)}>
              <Icon size={20} color="var(--accent-icon)" />
              <span className="s med">{label}</span>
            </button>
          ))}
        </div>
      </div>
      {ui}
    </>
  )
}
