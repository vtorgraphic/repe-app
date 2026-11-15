import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, UserPlus } from 'lucide-react'
import { Avatar, Chevron, CircleIcon, Dialog, Progress, Sheet } from '../ui'
import { useTrainer } from './store'
import type { Client, Request } from './data'

const STATUS: Record<string, { label: string; cls: string }> = {
  activo: { label: 'Activo', cls: 'ok' },
  inactivo: { label: 'Inactivo', cls: 'neutral' },
  'por vencer': { label: 'Por vencer', cls: 'warn' },
  invitado: { label: 'Invitado', cls: 'info' },
  archivado: { label: 'Archivado', cls: 'neutral' },
  pendiente: { label: 'Sin cupo', cls: 'err' },
}

export function ClientCard({ client, detail, onClick, status }: { client: Pick<Client, 'name' | 'initials'>; detail: string; status: string; onClick?: () => void }) {
  const s = STATUS[status] ?? STATUS.activo
  return (
    <button className="card row gap-12" style={{ padding: '12px 16px', width: '100%', textAlign: 'left' }} onClick={onClick}>
      <Avatar initials={client.initials} />
      <div className="grow stack gap-2">
        <span className="m med truncate">{client.name}</span>
        <span className="s muted truncate">{detail}</span>
      </div>
      <span className={`chip ${s.cls}`}>{s.label}</span>
      <Chevron />
    </button>
  )
}

export function hoursLabel(h: number) {
  const d = Math.floor(h / 24)
  return d ? `${d} d ${h % 24} h` : `${h} h`
}

/** Aviso al abrir la app desde el cliente activo número 8 (una vez por sesión). */
export function CupoOnOpen() {
  const t = useTrainer()
  const nav = useNavigate()
  const [open, setOpen] = useState(() => {
    try { return !sessionStorage.getItem('repe-cupo-visto') } catch { return true }
  })
  const close = () => { setOpen(false); try { sessionStorage.setItem('repe-cupo-visto', '1') } catch { /* sin almacenamiento */ } }
  if (!t.warn) return null
  return (
    <Dialog open={open} onClose={close}>
      <CircleIcon icon={AlertTriangle} tone="warn" />
      <span className="h5 center">{t.full ? 'Llegaste al límite' : 'Estás cerca del límite'}</span>
      <span className="s muted center">Recomendamos pagar la mensualidad para ampliar de manera ilimitada tu cantidad de clientes.</span>
      <div className="stack gap-8" style={{ width: '100%' }}>
        <div className="row between"><span className="xs muted">Clientes activos</span><span className="xs bold">{t.activeCount} de {t.limit}</span></div>
        <Progress value={t.activeCount / t.limit} />
      </div>
      <button className="btn primary lg block" onClick={() => { close(); nav('/entrenador/plan-ilimitado') }}>Pagar mensualidad</button>
      <button className="btn ghost block" onClick={close}>Ahora no</button>
    </Dialog>
  )
}

/** Hoja "Alguien desea solicitar sus servicios" cuando no queda cupo. */
export function CupoFullSheet({ request, onClose }: { request: Request | null; onClose: () => void }) {
  const nav = useNavigate()
  return (
    <Sheet open={!!request} onClose={onClose}>
      {request && (
        <>
          <div style={{ alignSelf: 'center' }}><CircleIcon icon={UserPlus} /></div>
          <span className="h5 center">Alguien desea solicitar tus servicios</span>
          <span className="s muted center">Paga la mensualidad para poder aceptar clientes de manera ilimitada. Al cliente solo se le cobra cuando lo aceptes.</span>
          <ClientCard client={request} detail={`${request.service} · ${request.price}`} status="pendiente" />
          <div className="row gap-8" style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--warn-900)', border: '1px solid var(--warn-700)' }}>
            <Clock size={20} color="var(--warn-500)" />
            <span className="s med warn">La solicitud vence en {hoursLabel(request.hoursLeft)}</span>
          </div>
          <button className="btn primary lg block" onClick={() => { onClose(); nav('/entrenador/plan-ilimitado') }}>Pagar suscripción</button>
          <button className="btn ghost block" onClick={onClose}>Ahora no</button>
        </>
      )}
    </Sheet>
  )
}
