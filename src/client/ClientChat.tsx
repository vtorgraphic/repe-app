import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Send, ShieldCheck } from 'lucide-react'
import { TopBar } from '../ui'
import { COACHES, PRE_CHAT } from './data'

type Msg = { from: 'in' | 'out'; text: string; time: string }

export default function ClientChat() {
  const { id } = useParams()
  const nav = useNavigate()
  const c = COACHES.find((x) => x.id === id) ?? COACHES[0]
  const first = c.name.split(' ')[0]
  const [msgs, setMsgs] = useState<Msg[]>(() => (c.id === 'pedro' ? [...PRE_CHAT] : [{ from: 'in', text: `¡Hola! Soy ${first}. Cuéntame tu objetivo y vemos si mi plan te sirve.`, time: '09:00' }]))
  const [text, setText] = useState('')
  const end = useRef<HTMLDivElement>(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs.length])
  const send = (t: string) => {
    if (!t.trim()) return
    setMsgs((m) => [...m, { from: 'out', text: t.trim(), time: 'Ahora' }])
    setText('')
    setTimeout(() => setMsgs((m) => [...m, { from: 'in', text: 'Buena pregunta 🙌 Te respondo con detalle en un rato.', time: 'Ahora' }]), 1200)
  }
  return (
    <>
      <TopBar title={c.name} />
      <button className="row gap-12" style={{ padding: '10px 16px', background: 'var(--card)', textAlign: 'left' }} onClick={() => nav(`/cliente/entrenador/${c.id}`)}>
        <img src={c.photo} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
        <div className="grow stack"><span className="xs muted">Consultando por</span><span className="s bold">Plan de {c.specialty.toLowerCase()} · ${c.price}/mes</span></div>
        <span className="xs bold accent">Ver plan</span>
      </button>
      <div className="screen-body tight" style={{ gap: 10 }}>
        <span className="xs med muted center">Hoy</span>
        {msgs.map((m, i) => <div key={i} className={'bubble ' + m.from}><span>{m.text}</span><span className="time">{m.time}</span></div>)}
        {c.id === 'pedro' && (
          <div className="card pad stack gap-8" style={{ borderColor: 'var(--accent-line)', maxWidth: 300 }}>
            <span className="xs bold accent">Oferta para ti</span>
            <span className="s bold">Plan mensual + videollamada inicial</span>
            <span className="row gap-4" style={{ alignItems: 'baseline' }}><span className="h5">$45</span><span className="xs muted">/mes · válida 48 h</span></span>
          </div>
        )}
        <div ref={end} />
      </div>
      <div className="chips" style={{ padding: '0 16px 8px', flexWrap: 'nowrap', overflowX: 'auto' }}>
        {['¿Incluye dieta?', '¿Puedo pausar el plan?', '¿Días por semana?'].map((q) => <button key={q} className="tag" style={{ height: 32, fontSize: 14 }} onClick={() => send(q)}>{q}</button>)}
      </div>
      <div className="row gap-10" style={{ padding: '8px 16px 8px' }}>
        <label className="row gap-8 grow" style={{ padding: '12px 16px', borderRadius: 24, background: 'var(--card)', border: '1px solid var(--border)' }}>
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(text)} placeholder="Escribe un mensaje…" aria-label="Mensaje" className="s grow" style={{ background: 'none', border: 0, outline: 0, minWidth: 0 }} />
        </label>
        <button className="circle-icon" style={{ width: 44, height: 44, background: 'var(--accent)' }} aria-label="Enviar" onClick={() => send(text)}><Send size={20} color="var(--on-accent)" /></button>
      </div>
      <span className="row gap-6 xs muted" style={{ padding: '0 16px 20px', justifyContent: 'center' }}><ShieldCheck size={14} />Por tu seguridad, mantén pagos y conversaciones dentro de Repe.</span>
    </>
  )
}
