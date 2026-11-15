import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, Bell, Check, ChevronLeft, Clock, CreditCard, MessageCircle, Play, Plus, Share2, ShieldCheck, SlidersHorizontal, Star } from 'lucide-react'
import { IconButton, SearchBar, Sheet, Steps, Tag, TopBar } from '../ui'
import { CATEGORIES, COACHES, SERVICE_FEE, money, type Coach } from './data'
import { useClient } from './store'

export function Market() {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string | null>('Musculación')
  const [filters, setFilters] = useState(false)
  const [maxPrice, setMaxPrice] = useState(70)
  const list = COACHES.filter((c) => c.id !== 'pedro')
    .filter((c) => `${c.name} ${c.specialty} ${c.place} ${c.city}`.toLowerCase().includes(q.toLowerCase()))
    .filter((c) => c.price <= maxPrice)
    .sort((a, b) => Number(b.categories.includes(cat ?? '')) - Number(a.categories.includes(cat ?? '')))
  return (
    <>
      <div className="screen-body">
        <div className="row between" style={{ paddingTop: 8 }}>
          <div className="stack"><span className="s muted">Descubre</span><span className="h5">Marketplace</span></div>
          <IconButton icon={Bell} label="Notificaciones" accent onClick={() => nav('/cliente/notificaciones')} />
        </div>
        <div className="row gap-8">
          <div className="grow"><SearchBar value={q} onChange={setQ} placeholder="Buscar entrenador, especialidad, ubicación" /></div>
          <IconButton icon={SlidersHorizontal} label="Filtros" accent onClick={() => setFilters(true)} />
        </div>
        <div className="chips" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>{CATEGORIES.map((c) => <Tag key={c} label={c} on={cat === c} onClick={() => setCat(cat === c ? null : c)} />)}</div>
        <div className="stack gap-12">
          {[COACHES[0], ...list].map((c) => <CoachCard key={c.id} c={c} onClick={() => nav(`/cliente/entrenador/${c.id}`)} />)}
          {list.length === 0 && <span className="s muted center">No hay entrenadores con esos filtros.</span>}
        </div>
      </div>
      <Sheet open={filters} onClose={() => setFilters(false)}>
        <span className="h5">Filtros</span>
        <label className="stack gap-8"><span className="row between s med"><span>Precio máximo</span><span className="accent bold">${maxPrice}/mes</span></span><input type="range" min={30} max={70} step={5} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ accentColor: 'var(--accent)' }} /></label>
        <span className="s bold faint">Modalidad</span>
        <div className="chips">{['Gimnasio', 'Online', 'Exterior'].map((m) => <Tag key={m} label={m} onClick={() => setQ(m)} on={q === m} />)}</div>
        <button className="btn primary lg block" onClick={() => setFilters(false)}>Ver resultados</button>
      </Sheet>
    </>
  )
}

function CoachCard({ c, onClick }: { c: Coach; onClick: () => void }) {
  return (
    <button className="card row" style={{ padding: 0, overflow: 'hidden', textAlign: 'left', alignItems: 'stretch' }} onClick={onClick}>
      <img src={c.photo} alt={c.name} style={{ width: 120, height: 136, objectFit: 'cover', flex: 'none' }} />
      <div className="stack gap-4 grow" style={{ padding: '12px 14px' }}>
        <span className="h6">{c.name}</span>
        <span className="xs muted">{c.specialty} · {c.place}</span>
        <span className="xs muted">{c.years} años de experiencia</span>
        <span className="row gap-4 xs"><Star size={14} color="var(--warn-500)" fill="var(--warn-500)" />{c.rating.toFixed(1)} <span className="muted">({c.reviews})</span></span>
        <span className="row gap-2" style={{ alignItems: 'baseline', marginTop: 'auto' }}><span className="h5 accent">${c.price}</span><span className="xs muted">/mes</span></span>
      </div>
    </button>
  )
}

export function CoachDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const c = COACHES.find((x) => x.id === id) ?? COACHES[0]
  const [plan, setPlan] = useState<'mensual' | 'trimestral'>('mensual')
  const [video, setVideo] = useState(false)
  const quarter = c.price * 3 - 15
  return (
    <>
      <div className="screen-body" style={{ padding: 0, gap: 0 }}>
        <div style={{ position: 'relative', height: 320, flex: 'none' }}>
          <img src={c.photo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, var(--bg))' }} />
          <div className="row between" style={{ position: 'absolute', top: 8, left: 16, right: 16 }}>
            <button className="icon-btn" style={{ background: 'rgba(9,11,13,.6)' }} aria-label="Volver" onClick={() => nav(-1)}><ChevronLeft size={20} /></button>
            <button className="icon-btn" style={{ background: 'rgba(9,11,13,.6)' }} aria-label="Compartir" onClick={() => navigator.clipboard?.writeText(location.href)}><Share2 size={18} /></button>
          </div>
          <button className="row gap-8 s bold" style={{ position: 'absolute', left: 16, bottom: 16, padding: '8px 14px', borderRadius: 100, background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', color: 'var(--accent-text)' }} onClick={() => setVideo(true)}><Play size={16} />Ver presentación · 1:05</button>
        </div>
        <div className="stack gap-16" style={{ padding: '8px 16px 24px' }}>
          <div className="stack gap-4">
            <span className="row gap-8 h5">{c.name}<BadgeCheck size={20} color="var(--accent-icon)" /></span>
            <span className="s muted">{c.title}</span>
            <span className="row gap-4 s"><Star size={14} color="var(--warn-500)" fill="var(--warn-500)" />{c.rating} <span className="muted">({c.reviews} reseñas) · {c.city}</span></span>
          </div>
          <div className="chips">{c.tags.map((t) => <span key={t} className="tag" style={{ height: 30, fontSize: 14 }}>{t}</span>)}</div>
          <div className="kpis">
            <div className="card kpi"><span className="h6">{c.years} años</span><span className="xs muted">Experiencia</span></div>
            <div className="card kpi"><span className="h6">{c.clients}</span><span className="xs muted">Clientes</span></div>
            <div className="card kpi"><span className="h6">{c.responds}</span><span className="xs muted">Responde en</span></div>
          </div>
          <div className="card pad stack gap-12" style={{ borderColor: 'var(--accent-line)', borderRadius: 20 }}>
            <span className="xs bold accent">EL SERVICIO</span>
            <span className="h6">Plan de {c.specialty.toLowerCase()} personalizado</span>
            <span className="s muted">Rutina y alimentación hechas a tu medida, con seguimiento semanal para que avances sin estancarte.</span>
            <div className="row gap-8">
              {([['mensual', 'Mensual', `$${c.price}`, '/mes'], ['trimestral', 'Trimestral', `$${quarter}`, 'Ahorras $15']] as const).map(([k, l, p, sub]) => (
                <button key={k} className="stack gap-4 grow" style={{ padding: 12, borderRadius: 12, textAlign: 'left', border: `1px solid ${plan === k ? 'var(--accent-line)' : 'var(--border)'}`, background: plan === k ? 'var(--accent-soft)' : 'var(--bg)' }} onClick={() => setPlan(k)}>
                  <span className="xs muted">{l}</span><span className="row gap-4" style={{ alignItems: 'baseline' }}><span className="h5">{p}</span><span className="xs accent">{sub}</span></span>
                </button>
              ))}
            </div>
            <span className="s bold">Qué incluye</span>
            {['Rutina personalizada, actualizada cada 4 semanas', 'Plan de alimentación adaptado a tu estilo de vida', 'Revisión semanal de progreso, pesos y fotos', 'Chat directo con respuesta en menos de 24 h', '1 videollamada mensual de 30 min'].map((x) => <span key={x} className="row gap-8 s"><Check size={16} color="var(--accent-icon)" style={{ flex: 'none' }} />{x}</span>)}
          </div>
          <span className="h6 faint">Sobre {c.name.split(' ')[0]}</span>
          <span className="s muted">Entreno desde hace {c.years} años y acompaño a personas que empiezan desde cero. Mi enfoque: progresar con técnica, cargas medibles y una dieta que puedas sostener.</span>
          <span className="h6 faint">Testimonios · {c.rating}</span>
          {[['MG', 'María G.', 'hace 2 semanas', 'Nunca había seguido una rutina tanto tiempo. Ajusta todo según cómo me siento y siempre responde rápido.'], ['LR', 'Luis R.', 'hace 1 mes', 'Muy buen plan y la dieta es fácil de seguir. Me hubiera gustado una videollamada más al inicio.']].map(([i, n, t, x]) => (
            <div key={n} className="card pad stack gap-8">
              <div className="row gap-10"><span className="avatar m">{i}</span><div className="stack"><span className="s bold">{n}</span><span className="xs muted">{t}</span></div></div>
              <span className="s muted">{x}</span>
            </div>
          ))}
          <span className="h6 faint">Cómo funciona</span>
          {[['Envías tu solicitud', 'Solo se te cobra cuando el entrenador te acepta'], ['Completas tu cuestionario', 'Objetivo, horarios, lesiones y alimentación (5 min)'], ['Recibes tu plan en 48 h', 'Arma tu rutina y tu dieta, y empiezas a entrenar']].map(([t, d], k) => (
            <div key={t} className="row gap-12"><span className="circle-icon s bold" style={{ width: 32, height: 32, background: 'var(--accent-soft)', color: 'var(--accent-text)' }}>{k + 1}</span><div className="stack gap-2"><span className="s bold">{t}</span><span className="xs muted">{d}</span></div></div>
          ))}
          <div className="notice"><ShieldCheck size={20} color="var(--accent-text)" /><span className="xs">Pago protegido por Repe. Si no recibes tu plan en 72 h, te devolvemos el dinero.</span></div>
        </div>
      </div>
      <div className="footer" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="stack" style={{ flex: 'none' }}><span className="row gap-2" style={{ alignItems: 'baseline' }}><span className="h5 accent">{plan === 'mensual' ? `$${c.price}` : `$${quarter}`}</span><span className="xs muted">{plan === 'mensual' ? '/mes' : '/3 meses'}</span></span><span className="xs muted">Plan {plan}</span></div>
        <button className="icon-btn" style={{ width: 46, height: 46, flex: 'none' }} aria-label="Escribirle" onClick={() => nav(`/cliente/chat/${c.id}`)}><MessageCircle size={20} /></button>
        <button className="btn primary" onClick={() => nav(`/cliente/contratar/${c.id}?plan=${plan}`)}>Contratar</button>
      </div>
      <Sheet open={video} onClose={() => setVideo(false)}>
        <img src={c.photo} alt="" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 16 }} />
        <span className="h6">Presentación de {c.name}</span>
        <span className="s muted">Video de 1:05 donde explica cómo trabaja. (En el prototipo se muestra solo la portada.)</span>
        <button className="btn ghost block" onClick={() => setVideo(false)}>Cerrar</button>
      </Sheet>
    </>
  )
}

function usePlan() {
  const { id } = useParams()
  const c = COACHES.find((x) => x.id === id) ?? COACHES[0]
  const params = new URLSearchParams(location.search)
  return { c, initial: (params.get('plan') as 'mensual' | 'trimestral') ?? 'mensual' }
}

export function Hire() {
  const { c, initial } = usePlan()
  const nav = useNavigate()
  const [plan, setPlan] = useState(initial)
  const [start, setStart] = useState('Lun 20 jul')
  const price = plan === 'mensual' ? c.price : c.price * 3 - 15
  const fee = +(price * SERVICE_FEE).toFixed(2)
  return (
    <>
      <TopBar title="Confirma tu plan" />
      <div className="screen-body">
        <Steps step={1} total={2} title="Tu plan" />
        <div className="card row gap-12" style={{ padding: 12 }}>
          <img src={c.photo} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
          <div className="stack gap-2"><span className="m bold">Plan de {c.specialty.toLowerCase()} personalizado</span><span className="xs muted">{c.name} · ★ {c.rating} ({c.reviews})</span></div>
        </div>
        <span className="h6 faint">Elige tu plan</span>
        {([['mensual', 'Mensual', 'Se renueva cada mes. Cancela cuando quieras.', `$${c.price}/mes`], ['trimestral', 'Trimestral · ahorras $15', `Equivale a $${((c.price * 3 - 15) / 3).toFixed(0)}/mes.`, `$${c.price * 3 - 15} cada 3 meses`]] as const).map(([k, t, d, p]) => (
          <button key={k} className="row gap-12" style={{ padding: 16, borderRadius: 16, textAlign: 'left', background: 'var(--card)', border: `1px solid ${plan === k ? 'var(--accent-line)' : 'var(--border)'}` }} onClick={() => setPlan(k)}>
            <span className={'radio' + (plan === k ? ' on' : '')} />
            <div className="grow stack gap-2"><span className="m bold">{t}</span><span className="xs muted">{d}</span></div>
            <span className="s bold accent">{p}</span>
          </button>
        ))}
        <span className="h6 faint">¿Cuándo quieres empezar?</span>
        <div className="chips">{['Lo antes posible', 'Lun 20 jul', 'Lun 27 jul'].map((d) => <Tag key={d} label={d} on={start === d} onClick={() => setStart(d)} />)}</div>
        <div className="card pad stack gap-8">
          <div className="row between s"><span className="muted">Plan {plan}</span><span>{money(price)}</span></div>
          <div className="row between s"><span className="muted">Tarifa de servicio Repe</span><span>{money(fee)}</span></div>
          <div className="divider" />
          <div className="row between"><span className="m bold">Total</span><span className="m bold accent">{money(price + fee)}</span></div>
          <span className="xs muted">No se te cobra nada hasta que {c.name.split(' ')[0]} acepte tu solicitud.</span>
        </div>
      </div>
      <div className="footer"><button className="btn primary lg" onClick={() => nav(`/cliente/contratar/${c.id}/pago?plan=${plan}&start=${encodeURIComponent(start)}`)}>Continuar al pago</button></div>
    </>
  )
}

export function Pay() {
  const { c, initial } = usePlan()
  const nav = useNavigate()
  const client = useClient()
  const [method, setMethod] = useState('visa')
  const [terms, setTerms] = useState(false)
  const [error, setError] = useState('')
  const price = initial === 'mensual' ? c.price : c.price * 3 - 15
  const total = price + +(price * SERVICE_FEE).toFixed(2)
  const start = new URLSearchParams(location.search).get('start') ?? 'Lun 20 jul'
  const submit = () => {
    if (!terms) return setError('Acepta los términos para continuar.')
    client.sendRequest({ coachId: c.id, plan: initial, total, start, hoursLeft: 72 })
    nav(`/cliente/contratar/${c.id}/enviada`, { replace: true })
  }
  return (
    <>
      <TopBar title="Método de pago" />
      <div className="screen-body">
        <Steps step={2} total={2} title="Pago" />
        <span className="h6 faint">¿Cómo quieres pagar?</span>
        {[['visa', 'Visa •••• 4821', 'Vence 08/28', CreditCard], ['nueva', 'Agregar tarjeta', 'Débito o crédito', Plus], ['paypal', 'PayPal', 'Paga con tu cuenta PayPal', CreditCard]].map(([k, t, d, Icon]) => {
          const I = Icon as typeof CreditCard
          return (
            <button key={k as string} className="row gap-12" style={{ padding: 16, borderRadius: 16, textAlign: 'left', background: 'var(--card)', border: `1px solid ${method === k ? 'var(--accent-line)' : 'var(--border)'}` }} onClick={() => setMethod(k as string)}>
              <I size={20} color="var(--accent-icon)" />
              <div className="grow stack gap-2"><span className="m med">{t as string}</span><span className="xs muted">{d as string}</span></div>
              <span className={'radio' + (method === k ? ' on' : '')} />
            </button>
          )
        })}
        <div className="card pad stack gap-8">
          <div className="row between s"><span className="muted">Plan {initial} · {c.name}</span><span>{money(price)}</span></div>
          <div className="row between s"><span className="muted">Tarifa de servicio Repe</span><span>{money(total - price)}</span></div>
          <div className="divider" />
          <div className="row between"><span className="m bold">Total a pagar</span><span className="m bold accent">{money(total)}</span></div>
        </div>
        <div className="notice"><ShieldCheck size={20} color="var(--accent-text)" /><span className="xs">Guardamos tu método de pago, pero <b>solo se cobra cuando {c.name.split(' ')[0]} acepte tu solicitud</b>. Si no responde en 3 días, la solicitud vence y no se te cobra nada.</span></div>
        <button className="row gap-12" style={{ textAlign: 'left' }} onClick={() => { setTerms(!terms); setError('') }} aria-pressed={terms}>
          <span className={'check' + (terms ? ' on' : '')} style={{ width: 24, height: 24 }}>{terms && <Check size={14} />}</span>
          <span className="s">Acepto los términos del servicio y la política de reembolso.</span>
        </button>
        {error && <span className="s err" role="alert">{error}</span>}
        <span className="xs muted center">Prototipo: no se realiza ningún cobro real.</span>
      </div>
      <div className="footer"><button className="btn primary lg" onClick={submit}>Enviar solicitud</button></div>
    </>
  )
}

export function Sent() {
  const { id } = useParams()
  const nav = useNavigate()
  const client = useClient()
  const c = COACHES.find((x) => x.id === id) ?? COACHES[0]
  const r = client.requests.find((x) => x.coachId === c.id)
  return (
    <>
      <div className="screen-body" style={{ justifyContent: 'center', gap: 20 }}>
        <div className="stack gap-12" style={{ alignItems: 'center', textAlign: 'center' }}>
          <img src={c.photo} alt="" style={{ width: 96, height: 96, borderRadius: 48, objectFit: 'cover', border: '2px solid var(--accent-line)' }} />
          <span className="h5">Solicitud enviada a {c.name}</span>
          <span className="s muted">Te avisaremos cuando confirme. Solo entonces se te cobrará {r ? money(r.total) : 'el plan'}.</span>
        </div>
        <div className="row gap-8" style={{ padding: '10px 12px', borderRadius: 12, background: 'var(--warn-900)', border: '1px solid var(--warn-700)' }}><Clock size={20} color="var(--warn-500)" /><span className="s med warn">Si no responde en 3 días, la solicitud vence y no pagas nada.</span></div>
        <span className="h6 faint">Próximos pasos</span>
        {[[`${c.name.split(' ')[0]} acepta tu solicitud`, 'Recibes un aviso y se hace el cobro'], ['Completa tu cuestionario', 'Te toma 5 minutos'], ['Recibes tu plan', `Antes de 48 h · inicio ${r?.start ?? 'Lun 20 jul'}`]].map(([t, d], k) => (
          <div key={t} className="row gap-12"><span className="circle-icon s bold" style={{ width: 32, height: 32, background: 'var(--accent-soft)', color: 'var(--accent-text)' }}>{k + 1}</span><div className="stack gap-2"><span className="s bold">{t}</span><span className="xs muted">{d}</span></div></div>
        ))}
      </div>
      <div className="footer" style={{ flexDirection: 'column' }}>
        <button className="btn primary lg block" onClick={() => nav('/cliente', { replace: true })}>Volver al inicio</button>
        <button className="btn tertiary block" onClick={() => nav(`/cliente/chat/${c.id}`)}>Escribirle a {c.name.split(' ')[0]}</button>
      </div>
    </>
  )
}
