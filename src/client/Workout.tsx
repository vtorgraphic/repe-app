import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Award, Check, ChevronLeft, List, Pencil, Play, TrendingUp, X, Zap } from 'lucide-react'
import { CircleIcon, IconButton, Kpi, Sheet, TopBar } from '../ui'
import { useClient } from './store'
import { WORKOUT } from './data'

let startedAt = Date.now()
const total = WORKOUT.exercises.length

function useElapsed() {
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const s = Math.max(0, Math.floor((now - startedAt) / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  return (h ? `${h}:${String(m).padStart(2, '0')}` : String(m).padStart(2, '0')) + `:${String(sec).padStart(2, '0')}`
}

const num = (v: string) => v.split('/').reduce((a, x) => a + (parseFloat(x) || 0), 0)

export function Overview() {
  const nav = useNavigate()
  const c = useClient()
  const sets = WORKOUT.exercises.reduce((a, e) => a + e.sets.length, 0)
  return (
    <>
      <TopBar title="Entrenamiento de hoy" />
      <div className="screen-body">
        <div className="card pad stack gap-4" style={{ background: 'var(--accent-soft)', borderColor: 'var(--accent-line)', borderRadius: 20 }}>
          <span className="xs bold accent">{WORKOUT.day}</span>
          <span className="h5">{WORKOUT.title}</span>
          <span className="s muted">{total} ejercicios · {sets} series · ~75 min</span>
        </div>
        <span className="h6 faint">Ejercicios</span>
        <div className="card">
          {WORKOUT.exercises.map((e, i) => (
            <div key={e.name} className="list-row">
              <span className="circle-icon xs bold" style={{ width: 28, height: 28, background: 'var(--n-700)' }}>{i + 1}</span>
              <div className="grow stack gap-2"><span className="m med">{e.name}</span><span className="xs muted">{e.sets.length} series · {[...new Set(e.sets.map((s) => s.kg))].join(' · ')}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div className="footer"><button className="btn primary lg" onClick={() => { c.resetWorkout(); startedAt = Date.now(); nav('/cliente/entreno/1') }}>Empezar entrenamiento</button></div>
    </>
  )
}

export function ExerciseStep() {
  const { n } = useParams()
  const i = Math.min(total, Math.max(1, Number(n) || 1)) - 1
  const e = WORKOUT.exercises[i]
  const c = useClient()
  const nav = useNavigate()
  const elapsed = useElapsed()
  const [video, setVideo] = useState(false)
  const [list, setList] = useState(false)
  const [rest, setRest] = useState<number | null>(null)
  useEffect(() => {
    if (rest === null) return
    if (rest <= 0) { setRest(null); return }
    const t = setTimeout(() => setRest(rest - 1), 1000)
    return () => clearTimeout(t)
  }, [rest])
  const restSecs = e.rest.includes('min') ? parseFloat(e.rest) * 60 : parseFloat(e.rest)
  const check = (k: number) => {
    const cur = c.done[i][k]
    c.setDoneValue(i, k, cur ? '' : e.sets[k].target)
    if (!cur) setRest(restSecs)
  }
  const last = i === total - 1
  return (
    <>
      <div className="topbar">
        <IconButton icon={X} label="Salir del entreno" onClick={() => nav('/cliente')} />
        <div className="title stack" style={{ lineHeight: 1 }}><span className="m bold">Ejercicio {i + 1} de {total}</span><span className="xs muted" style={{ fontWeight: 300 }}>{WORKOUT.title} · {elapsed}</span></div>
        <IconButton icon={List} label="Ver lista de ejercicios" onClick={() => setList(true)} />
      </div>
      <div className="steps" style={{ padding: '0 16px' }}><div className="segs" style={{ marginTop: 0 }}>{WORKOUT.exercises.map((_, k) => <span key={k} className={k <= i ? 'on' : ''} />)}</div></div>
      <div className="screen-body" style={{ paddingTop: 16 }}>
        <button className="card row gap-12" style={{ padding: 16 }} onClick={() => setVideo(true)}>
          <span className="circle-icon" style={{ width: 44, height: 44, background: 'var(--accent)' }}><Play size={20} color="var(--on-accent)" /></span>
          <div className="stack gap-2" style={{ textAlign: 'left' }}><span className="m bold accent">Ver técnica</span><span className="xs muted">Video de Pedro · 0:24</span></div>
        </button>
        <div className="stack gap-4">
          <div className="row between"><span className="h5">{e.name}</span><span className="tag" style={{ height: 28, fontSize: 14 }}>{e.muscle}</span></div>
          <span className="s muted">{e.sets.length} series · Descanso {e.rest}</span>
        </div>
        {e.tip && <div className="notice"><span className="xs"><b className="accent">Pedro:</b> {e.tip}</span></div>}
        <div className="stack gap-8">
          <div className="row xs muted" style={{ padding: '0 8px' }}><span style={{ width: 44 }}>Serie</span><span className="grow">Peso</span><span style={{ width: 56, textAlign: 'center' }}>Objetivo</span><span style={{ width: 64, textAlign: 'center' }}>Hechas</span><span style={{ width: 40, textAlign: 'center' }}>Check</span></div>
          {e.sets.map((s, k) => {
            const v = c.done[i][k]
            const ok = !!v
            return (
              <div key={k} className="card row gap-8" style={{ padding: 8, borderColor: ok ? 'var(--accent-line)' : undefined }}>
                <span className="circle-icon s bold" style={{ width: 32, height: 32, background: ok ? 'var(--accent)' : 'var(--n-700)', color: ok ? 'var(--on-accent)' : undefined, marginRight: 4 }}>{k + 1}</span>
                <span className="grow stack"><span className="m bold row gap-6">{s.kg}<Pencil size={14} color="var(--icon-muted)" /></span>{s.note && <span className="xs accent">{s.note}</span>}</span>
                <span className="m muted" style={{ width: 56, textAlign: 'center' }}>{s.target}</span>
                <input aria-label={`Repeticiones hechas en la serie ${k + 1}`} value={v} placeholder="—" inputMode="numeric" onChange={(ev) => c.setDoneValue(i, k, ev.target.value)} className="m bold" style={{ width: 64, height: 40, textAlign: 'center', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)', outline: 0 }} />
                <button className={'square-btn' + (ok ? ' on' : '')} style={{ width: 40, height: 40 }} aria-label={`Marcar serie ${k + 1}`} onClick={() => check(k)}><Check size={20} /></button>
              </div>
            )
          })}
        </div>
        <label className="field">
          <span className="s med muted">Observaciones <span className="faint">(opcional)</span></span>
          <div className="input"><textarea value={c.notes[i]} onChange={(ev) => c.setNote(i, ev.target.value)} placeholder="¿Cómo te sentiste? Molestias, ajustes, técnica…" /></div>
        </label>
      </div>
      {rest !== null && (
        <div className="row between" style={{ margin: '0 16px', padding: '10px 16px', borderRadius: 12, background: 'var(--accent-soft)', border: '1px solid var(--accent-line)' }}>
          <span className="s med">Descanso</span>
          <span className="m bold accent">{Math.floor(rest / 60)}:{String(rest % 60).padStart(2, '0')}</span>
          <button className="link" onClick={() => setRest(null)}>Saltar</button>
        </div>
      )}
      <div className="footer">
        <button className="icon-btn" style={{ width: 54, height: 54, flex: 'none' }} aria-label="Ejercicio anterior" onClick={() => nav(i === 0 ? '/cliente/entreno' : `/cliente/entreno/${i}`)}><ChevronLeft size={20} /></button>
        <button className="btn primary lg" onClick={() => nav(last ? '/cliente/entreno/resumen' : `/cliente/entreno/${i + 2}`)}>{last ? 'Ver resumen' : 'Siguiente ejercicio'}</button>
      </div>
      <Sheet open={video} onClose={() => setVideo(false)}>
        <div className="thumb stack gap-8" style={{ height: 220, borderRadius: 16 }}><span className="circle-icon" style={{ background: 'var(--accent)' }}><Play size={24} color="var(--on-accent)" /></span><span className="xs muted">Video de Pedro · 0:24</span></div>
        <span className="h6">{e.name}</span>
        {e.tip && <span className="s muted">{e.tip}</span>}
        <button className="btn ghost block" onClick={() => setVideo(false)}>Cerrar</button>
      </Sheet>
      <Sheet open={list} onClose={() => setList(false)}>
        <span className="h6">Ejercicios de hoy</span>
        <div className="card" style={{ background: 'var(--bg)' }}>
          {WORKOUT.exercises.map((x, k) => {
            const doneAll = c.done[k].every(Boolean)
            return (
              <button key={x.name} className="list-row" onClick={() => { setList(false); nav(`/cliente/entreno/${k + 1}`) }}>
                <span className="circle-icon xs bold" style={{ width: 28, height: 28, background: doneAll ? 'var(--accent)' : 'var(--n-700)', color: doneAll ? 'var(--on-accent)' : undefined }}>{doneAll ? <Check size={14} /> : k + 1}</span>
                <span className={'m grow' + (k === i ? ' bold accent' : ' med')}>{x.name}</span>
              </button>
            )
          })}
        </div>
      </Sheet>
    </>
  )
}

export function Summary() {
  const c = useClient()
  const nav = useNavigate()
  const totalSets = WORKOUT.exercises.reduce((a, e) => a + e.sets.length, 0)
  const doneSets = c.done.flat().filter(Boolean).length
  const volume = WORKOUT.exercises.reduce((a, e, i) => a + e.sets.reduce((b, s, k) => b + num(s.kg) * num(c.done[i][k] || '0'), 0), 0)
  const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000))
  return (
    <>
      <TopBar title="Resumen del entrenamiento" />
      <div className="screen-body">
        <span className="s muted">{WORKOUT.title} · Lunes 13 jul</span>
        <div className="kpis">
          <Kpi label="Duración" value={mins >= 60 ? `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')} h` : `${mins} min`} />
          <Kpi label="Series" value={`${doneSets}/${totalSets}`} />
          <Kpi label="Volumen total" value={`${Math.round(volume).toLocaleString('es-CO')} kg`} />
        </div>
        <div className="stack gap-4"><span className="h6 faint">Lo que hiciste</span><span className="xs muted">Toca un ejercicio para corregir lo que anotaste.</span></div>
        <div className="stack gap-8">
          {WORKOUT.exercises.map((e, i) => {
            const reps = c.done[i].map((d) => d || '—').join(' · ')
            return (
              <button key={e.name} className="card stack gap-4" style={{ padding: '12px 16px', textAlign: 'left' }} onClick={() => nav(`/cliente/entreno/${i + 1}`)}>
                <span className="m bold">{e.name}</span>
                <span className="s muted">{e.sets[0].kg} × {reps}</span>
                {c.notes[i] && <span className="xs accent">“{c.notes[i]}”</span>}
              </button>
            )
          })}
        </div>
        <label className="field">
          <span className="s med muted">Comentario para Pedro <span className="faint">(opcional)</span></span>
          <div className="input"><textarea value={c.comment} onChange={(ev) => c.setComment(ev.target.value)} placeholder="¿Algo que tu entrenador deba saber de esta sesión?" /></div>
        </label>
        {doneSets < totalSets && <span className="xs warn">Te faltan {totalSets - doneSets} series por marcar. Puedes enviar igual.</span>}
      </div>
      <div className="footer"><button className="btn primary lg" onClick={() => { c.finishWorkout(); nav('/cliente/entreno/listo', { replace: true }) }}>Finalizar y enviar</button></div>
    </>
  )
}

export function Done() {
  const c = useClient()
  const nav = useNavigate()
  const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000))
  const share = async () => {
    const text = `¡Completé mi entrenamiento de ${WORKOUT.title} en Repe! Racha de ${c.streak} días 💪`
    if (navigator.share) { try { await navigator.share({ text }) } catch { /* cancelado */ } } else { try { await navigator.clipboard.writeText(text) } catch { /* sin permiso */ } }
  }
  return (
    <>
      <div className="screen-body" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 20 }}>
        <div className="circle-icon" style={{ width: 120, height: 120, background: 'var(--accent-soft)', border: '2px solid var(--accent-line)' }}><Award size={48} color="var(--accent-icon)" /></div>
        <span className="h4">¡Entrenamiento completado!</span>
        <span className="s muted">¡Buen trabajo, Daniel! Pedro ya puede ver tu registro y tus observaciones.</span>
        <div className="row gap-8" style={{ width: '100%' }}>
          <div className="card stack" style={{ padding: '12px 16px', flex: 1, textAlign: 'left' }}><span className="h6">{mins} min</span><span className="xs muted">Duración</span></div>
          <div className="card stack" style={{ padding: '12px 16px', flex: 1, textAlign: 'left' }}><span className="h6 accent">{c.streak} días</span><span className="xs muted">Racha</span></div>
        </div>
        <div className="card" style={{ width: '100%' }}>
          <div className="list-row"><CircleIcon icon={Zap} size={40} /><div className="stack gap-2" style={{ textAlign: 'left' }}><span className="s bold">Racha de {c.streak} días</span><span className="xs muted">Tu mejor racha hasta ahora</span></div></div>
          <div className="list-row"><CircleIcon icon={TrendingUp} size={40} /><div className="stack gap-2" style={{ textAlign: 'left' }}><span className="s bold">+8% de volumen</span><span className="xs muted">Comparado con tu último Push</span></div></div>
        </div>
      </div>
      <div className="footer" style={{ flexDirection: 'column' }}>
        <button className="btn primary lg block" onClick={() => nav('/cliente', { replace: true })}>Volver al inicio</button>
        <button className="btn tertiary block" onClick={share}>Compartir logro</button>
      </div>
    </>
  )
}
