import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Bell, Briefcase, Check, CreditCard, DollarSign, Eye, HelpCircle, Info, Lock, LogOut, Plus, Repeat, SlidersHorizontal, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Avatar, Chevron, CircleIcon, CupoBanner, IconButton, Kpi, Progress, SectionTitle, Toggle, Toast, TopBar, useToast } from '../ui'
import { useTrainer } from './store'

function Row({ icon: Icon, label, value, onClick, danger }: { icon: LucideIcon; label: string; value?: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button className="list-row" onClick={onClick}>
      <Icon size={20} color={danger ? 'var(--err-300)' : undefined} />
      <span className={'m med grow' + (danger ? ' err' : '')}>{label}</span>
      {value && <span className="s muted">{value}</span>}
      <Chevron />
    </button>
  )
}

export function Profile() {
  const t = useTrainer()
  const nav = useNavigate()
  const toast = useToast()
  return (
    <>
      <div className="screen-body">
        <div className="row between" style={{ paddingTop: 8 }}>
          <span className="h5">Mi perfil</span>
          <IconButton icon={SlidersHorizontal} label="Ajustes" accent onClick={() => toast.show('Ajustes de cuenta: próximamente')} />
        </div>
        <div className="card pad row gap-16" style={{ borderColor: 'var(--accent-line)', borderRadius: 20 }}>
          <Avatar initials="RG" size="l" />
          <div className="stack gap-4">
            <span className="h6">Ramiro Gómez</span>
            <span className="row gap-6 xs med accent"><BadgeCheck size={16} />Certificado ISSA · verificado</span>
            <span className="xs muted">20 años de experiencia · Bogotá</span>
          </div>
        </div>
        <div className="kpis"><Kpi label="Clientes" value={String(t.activeCount)} note="activos" /><Kpi label="Valoración" value="4.9" note="32 opiniones" /><Kpi label="Sesiones" value="1.240" note="en Repe" /></div>
        {t.warn && <CupoBanner active={t.activeCount} limit={t.limit} onClick={() => nav('/entrenador/plan-ilimitado')} />}
        <SectionTitle title="Negocio" />
        <div className="card">
          <Row icon={Eye} label="Perfil público" value="Ver como cliente" onClick={() => toast.show('Así te verán en el Marketplace (app cliente, próximamente)')} />
          <Row icon={Briefcase} label="Mis servicios" value={`${t.services.filter((s) => s.on).length} activos`} onClick={() => nav('/entrenador/perfil/servicios')} />
          <Row icon={CreditCard} label="Plan y pagos" value={t.plan === 'ilimitado' ? 'Ilimitado' : 'Gratis'} onClick={() => nav('/entrenador/perfil/plan')} />
          <Row icon={TrendingUp} label="Clientes por mes" onClick={() => nav('/entrenador/perfil/plan')} />
        </div>
        <SectionTitle title="Cuenta" />
        <div className="card">
          <Row icon={Bell} label="Notificaciones" onClick={() => nav('/entrenador/notificaciones')} />
          <Row icon={Lock} label="Privacidad y seguridad" onClick={() => toast.show('Próximamente')} />
          <Row icon={HelpCircle} label="Ayuda y soporte" onClick={() => toast.show('Próximamente')} />
          <Row icon={Repeat} label="Cambiar de rol" value="Cliente / Entrenador" onClick={() => nav('/')} />
          <Row icon={LogOut} label="Cerrar sesión" danger onClick={() => nav('/')} />
        </div>
      </div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function Services() {
  const t = useTrainer()
  const toast = useToast()
  return (
    <>
      <TopBar title="Mis servicios" action={<IconButton icon={Plus} label="Crear servicio" onClick={() => toast.show('Crear servicio: próximamente')} />} />
      <div className="screen-body">
        <div className="notice"><Info size={20} color="var(--accent-text)" /><span className="xs">Estos servicios aparecen en el Marketplace. Repe retiene una comisión de cada pago que recibes.</span></div>
        {t.services.map((s) => (
          <div key={s.id} className="card pad stack gap-10">
            <div className="row between"><span className="m bold">{s.name}</span><span className="m bold accent">{s.price}</span></div>
            <span className="xs muted">{s.desc}</span>
            <div className="chips">{s.tags.map((x) => <span key={x} className="tag" style={{ height: 28, fontSize: 14 }}>{x}</span>)}</div>
            <div className="row between"><span className="s muted">{s.clients}</span><span className="row gap-8"><span className={'s med' + (s.on ? '' : ' muted')}>{s.on ? 'Publicado' : 'Oculto'}</span><Toggle label={`Publicar ${s.name}`} on={s.on} onChange={() => t.toggleService(s.id)} /></span></div>
          </div>
        ))}
      </div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function Payments() {
  const t = useTrainer()
  const nav = useNavigate()
  const bars = [0.45, 0.55, 0.5, 0.7, 0.82, 1]
  return (
    <>
      <TopBar title="Plan y pagos" />
      <div className="screen-body">
        <div className="card pad accent stack gap-12">
          <div className="row between"><span className="h6">{t.plan === 'ilimitado' ? 'Plan ilimitado' : 'Plan Gratis'}</span><span className={'s bold ' + (t.plan === 'ilimitado' ? 'accent' : 'warn')}>{t.plan === 'ilimitado' ? `${t.activeCount} clientes` : `${t.activeCount} de ${t.limit} clientes`}</span></div>
          {t.plan === 'gratis' ? (
            <>
              <Progress value={t.activeCount / t.limit} />
              <span className="xs muted">Con el plan ilimitado aceptas clientes sin límite por $19/mes.</span>
              <button className="btn primary block" onClick={() => nav('/entrenador/plan-ilimitado')}>Pasar a ilimitado</button>
            </>
          ) : <span className="xs muted">$19/mes · se renueva el 16 de diciembre.</span>}
        </div>
        <div className="card pad stack gap-12">
          <div className="row between" style={{ alignItems: 'flex-end' }}>
            <div className="stack gap-2"><span className="xs muted">Ingresos netos · noviembre</span><span className="h4">$1.240</span></div>
            <span className="s bold ok">+12% vs oct.</span>
          </div>
          <div className="row gap-12" style={{ alignItems: 'flex-end', height: 116 }}>
            {['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'].map((m, i) => (
              <div key={m} className="stack gap-6 grow" style={{ alignItems: 'center' }}>
                <div style={{ width: '100%', height: 90 * bars[i], borderRadius: '6px 6px 0 0', background: i === 5 ? 'var(--accent)' : 'var(--accent-strong)' }} />
                <span className="xs muted">{m}</span>
              </div>
            ))}
          </div>
        </div>
        <SectionTitle title="Historial de pagos" />
        <div className="card" style={{ padding: '4px 16px' }}>
          {[['María González', 'Plan mensual · 28 oct', '+$54'], ['Carlos Pérez', 'Plan mensual · 2 nov', '+$54'], ['Pedro Sánchez', 'Plan trimestral · 15 oct', '+$144']].map(([n, d, a], i) => (
            <div key={n} className="row gap-12" style={{ padding: '12px 0', borderTop: i ? '1px solid var(--border)' : undefined }}>
              <CircleIcon icon={DollarSign} tone="ok" size={40} />
              <div className="grow stack gap-2"><span className="m med">{n}</span><span className="xs muted">{d}</span></div>
              <div className="stack gap-2" style={{ alignItems: 'flex-end' }}><span className="m bold ok">{a}</span><span className="xs muted">neto</span></div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function PlanUnlimited() {
  const t = useTrainer()
  const nav = useNavigate()
  const [paid, setPaid] = useState(t.plan === 'ilimitado')
  if (paid) {
    return (
      <>
        <TopBar title="Plan ilimitado" />
        <div className="screen-body" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <CircleIcon icon={Check} tone="ok" size={72} />
          <span className="h5">¡Listo! Ya tienes clientes ilimitados</span>
          <span className="s muted">{t.requests.length ? `Tienes ${t.requests.length} solicitud${t.requests.length > 1 ? 'es' : ''} esperando. A cada cliente se le cobra cuando lo aceptes.` : 'Puedes aceptar nuevas solicitudes sin límite.'}</span>
        </div>
        <div className="footer"><button className="btn primary lg" onClick={() => nav('/entrenador/clientes', { replace: true })}>{t.requests.length ? 'Ver solicitudes' : 'Ir a clientes'}</button></div>
      </>
    )
  }
  return (
    <>
      <TopBar title="Plan ilimitado" />
      <div className="screen-body">
        <div className="card pad stack gap-12" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-line)', borderRadius: 20, padding: 20 }}>
          <span className="chip accent" style={{ alignSelf: 'flex-start' }}>Recomendado</span>
          <span className="h5">Clientes ilimitados</span>
          <span className="row gap-4" style={{ alignItems: 'flex-end' }}><span className="h3">$19</span><span className="m muted">/mes</span></span>
          {['Acepta clientes sin límite', 'Las mismas herramientas que ya usas', 'Cancela cuando quieras'].map((f) => <span key={f} className="row gap-8 s med"><Check size={20} color="var(--accent-icon)" />{f}</span>)}
        </div>
        <div className="card pad stack gap-8">
          <div className="row between"><span className="s bold">Plan actual: Gratis</span><span className="s bold warn">{t.activeCount} de {t.limit}</span></div>
          <Progress value={t.activeCount / t.limit} />
          {t.requests.length > 0 && <span className="xs muted">{t.requests.length} solicitud{t.requests.length > 1 ? 'es' : ''} esperando · vencen en 3 días</span>}
        </div>
        <SectionTitle title="Método de pago" />
        <div className="card"><Row icon={CreditCard} label="Visa •••• 4242" value="Cambiar" /></div>
        <span className="xs muted center">Prototipo: no se realiza ningún cobro real.</span>
      </div>
      <div className="footer" style={{ flexDirection: 'column' }}>
        <button className="btn primary lg block" onClick={() => { t.upgrade(); setPaid(true) }}>Pagar $19 y activar</button>
        <span className="xs muted center">Se renueva cada mes. Puedes cancelar en cualquier momento.</span>
      </div>
    </>
  )
}
