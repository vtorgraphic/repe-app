import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AlertTriangle, ArrowDown, ArrowUp, Check, ChevronDown, Copy, Dumbbell, FileText, Info, Play, Plus, Trash2, Video, X } from 'lucide-react'
import { CircleIcon, Dialog, Field, IconButton, Kpi, SearchBar, Sheet, Stepper, Steps, Tabs, Tag, Toggle, TopBar } from '../ui'
import { MUSCLES, MUSCLE_ZONES, type Exercise, type Routine, type RoutineItem } from './data'
import { newId, useTrainer } from './store'

const TOTAL = 6
const TITLES = ['Nombre', 'Grupo muscular', 'Ejercicios', 'Series, peso y reps', 'Recomendaciones', 'Revisar y guardar']
const MAX_MB = 10

const newItem = (e: Exercise): RoutineItem => ({ exerciseId: e.id, same: true, sets: [{ reps: 10, kg: 20 }, { reps: 10, kg: 20 }, { reps: 10, kg: 20 }], rest: 90, minutes: e.type === 'Cardio' ? 15 : 0, km: e.type === 'Cardio' ? 2 : 0, note: '' })

export default function RoutineWizard() {
  const t = useTrainer()
  const nav = useNavigate()
  const { id } = useParams()
  const [params] = useSearchParams()
  const editing = id ? t.routines.find((r) => r.id === id) : undefined
  const template = t.routines.find((r) => r.id === params.get('plantilla'))
  const base = editing ?? (template ? { ...template, name: '', assigned: [], uses: 0 } : undefined)
  const [step, setStep] = useState(editing ? 4 : 1)
  const [r, setR] = useState<Routine>(() => ({ id: editing?.id ?? newId('r'), name: base?.name ?? '', level: base?.level ?? 'Intermedio', description: base?.description ?? '', muscles: base?.muscles ?? [], items: base?.items ?? [], generalNote: base?.generalNote ?? '', assigned: base?.assigned ?? [], uses: base?.uses ?? 0 }))
  const [warnEdit, setWarnEdit] = useState(false)
  const [error, setError] = useState('')
  const exById = (eid: string) => t.exercises.find((e) => e.id === eid)!
  const set = (patch: Partial<Routine>) => setR((x) => ({ ...x, ...patch }))

  const next = () => {
    if (step === 1 && !r.name.trim()) return setError('Ponle un nombre a la rutina.')
    if (step === 3 && r.items.length === 0) return setError('Añade al menos un ejercicio.')
    setError('')
    setStep((s) => Math.min(TOTAL, s + 1))
  }
  const save = (assign: boolean, force = false) => {
    if (editing && editing.assigned.length && !force) return setWarnEdit(true)
    t.saveRoutine(r)
    nav(assign ? `/entrenador/asignar/rutina/${r.id}` : '/entrenador/rutinas', { replace: true })
  }

  return (
    <>
      <TopBar title={editing ? 'Editar rutina' : 'Nueva rutina'} onBack={() => (step > 1 ? setStep(step - 1) : nav(-1))} action={<IconButton icon={X} label="Salir" onClick={() => nav('/entrenador/rutinas')} />} />
      <div className="screen-body">
        <Steps step={step} total={TOTAL} title={TITLES[step - 1]} />
        {step === 1 && <StepName r={r} set={set} />}
        {step === 2 && <StepMuscles r={r} set={set} />}
        {step === 3 && <StepExercises r={r} set={set} />}
        {step === 4 && <StepSets r={r} set={set} exById={exById} />}
        {step === 5 && <StepNotes r={r} set={set} exById={exById} />}
        {step === 6 && <StepReview r={r} exById={exById} />}
        {error && <span className="s err" role="alert">{error}</span>}
      </div>
      <div className="footer">
        {step === 3 && <span className="s bold accent" style={{ flex: 'none' }}>{r.items.length} añadidos</span>}
        {step === 5 && <button className="link" style={{ flex: 'none' }} onClick={() => setStep(6)}>Omitir</button>}
        {step > 1 && step < 6 && <button className="btn tertiary" onClick={() => setStep(step - 1)}>Atrás</button>}
        {step < 6 && <button className="btn primary" onClick={next}>Siguiente</button>}
        {step === 6 && <><button className="btn tertiary" onClick={() => save(false)}>Guardar</button><button className="btn primary" onClick={() => save(true)}>Guardar y asignar</button></>}
      </div>
      <Dialog open={warnEdit} onClose={() => setWarnEdit(false)}>
        <CircleIcon icon={AlertTriangle} tone="warn" />
        <span className="h6 center">Esta rutina está asignada a {editing?.assigned.length} clientes</span>
        <span className="s muted center">Los cambios se aplicarán a sus próximas sesiones. Las sesiones que ya hicieron no cambian.</span>
        <button className="btn primary block" onClick={() => save(false, true)}>Guardar cambios</button>
        <button className="btn tertiary block" onClick={() => { t.saveRoutine({ ...r, id: newId('r'), name: `${r.name} (copia)`, assigned: [], uses: 0 }); nav('/entrenador/rutinas', { replace: true }) }}>Duplicar en su lugar</button>
        <button className="btn ghost block" onClick={() => setWarnEdit(false)}>Cancelar</button>
      </Dialog>
    </>
  )
}

type StepProps = { r: Routine; set: (p: Partial<Routine>) => void }

function Heading({ title, sub }: { title: string; sub?: string }) {
  return <div className="stack gap-4"><span className="h5">{title}</span>{sub && <span className="s muted">{sub}</span>}</div>
}

function StepName({ r, set }: StepProps) {
  return (
    <>
      <Heading title="¿Cómo se llama la rutina?" sub="Usa un nombre que reconozcas fácil al asignarla." />
      <Field label="Nombre" value={r.name} onChange={(v) => set({ name: v })} placeholder="Ej. Push · pecho y tríceps" />
      <div className="field"><span className="s med muted">Nivel (opcional)</span><Tabs value={r.level} onChange={(v) => set({ level: v })} options={['Principiante', 'Intermedio', 'Avanzado'].map((l) => ({ value: l, label: l }))} /></div>
      <Field label="Descripción (opcional)" value={r.description} onChange={(v) => set({ description: v })} area placeholder="Ej. Sesión de empuje enfocada en pecho y tríceps." />
    </>
  )
}

function StepMuscles({ r, set }: StepProps) {
  const toggle = (m: string) => set({ muscles: r.muscles.includes(m) ? r.muscles.filter((x) => x !== m) : [...r.muscles, m] })
  const zoneOn = (z: string) => MUSCLE_ZONES[z].every((m) => r.muscles.includes(m))
  const toggleZone = (z: string) => set({ muscles: zoneOn(z) ? r.muscles.filter((m) => !MUSCLE_ZONES[z].includes(m)) : [...new Set([...r.muscles, ...MUSCLE_ZONES[z]])] })
  return (
    <>
      <Heading title="¿Qué trabaja esta rutina?" sub="Puedes elegir varios. Usamos tu selección para sugerirte ejercicios." />
      <span className="s bold faint">Zonas</span>
      <div className="chips">{Object.keys(MUSCLE_ZONES).map((z) => <Tag key={z} label={z} on={zoneOn(z)} onClick={() => toggleZone(z)} />)}</div>
      <span className="s bold faint">Músculos</span>
      <div className="chips">{MUSCLES.map((m) => <Tag key={m} label={m} on={r.muscles.includes(m)} onClick={() => toggle(m)} />)}</div>
      <div className="notice"><Info size={20} color="var(--accent-text)" /><span className="xs">Al elegir una zona se marcan todos sus músculos. Por ejemplo, Tren superior marca pecho, espalda, hombro, bíceps, tríceps y trapecio.</span></div>
    </>
  )
}

function StepExercises({ r, set }: StepProps) {
  const t = useTrainer()
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState<string[]>(r.muscles)
  const [preview, setPreview] = useState<Exercise | null>(null)
  const [creating, setCreating] = useState(false)
  const results = useMemo(() => t.exercises
    .filter((e) => e.name.toLowerCase().includes(q.toLowerCase()))
    .filter((e) => q || !filters.length || e.muscles.some((m) => filters.includes(m)))
    .sort((a, b) => Number(b.muscles.some((m) => filters.includes(m))) - Number(a.muscles.some((m) => filters.includes(m)))), [t.exercises, q, filters])
  const added = (e: Exercise) => r.items.some((i) => i.exerciseId === e.id)
  const toggle = (e: Exercise) => set({ items: added(e) ? r.items.filter((i) => i.exerciseId !== e.id) : [...r.items, newItem(e)] })
  if (creating) return <CreateExercise name={q} onDone={(e) => { if (e) { t.addExercise(e); set({ items: [...r.items, newItem(e)] }); setQ('') } setCreating(false) }} />
  return (
    <>
      <Heading title="Añade ejercicios" />
      <SearchBar value={q} onChange={setQ} placeholder="Busca un ejercicio (ej. press, sentadilla)" />
      {filters.length > 0 && <div className="chips">{filters.map((m) => <Tag key={m} label={m} on onRemove={() => setFilters(filters.filter((x) => x !== m))} />)}</div>}
      <span className="xs muted">{q ? `${results.length} resultados para “${q}”` : `${results.length} ejercicios sugeridos`}</span>
      <div className="stack gap-8">
        {results.slice(0, 12).map((e) => (
          <div key={e.id} className="card row gap-12" style={{ padding: 12, borderColor: added(e) ? 'var(--accent-line)' : undefined }}>
            <button className="thumb" style={{ width: 56, height: 56 }} aria-label={`Ver video de ${e.name}`} onClick={() => setPreview(e)}>
              <span className="circle-icon" style={{ width: 28, height: 28, background: 'var(--card)' }}><Play size={14} /></span>
            </button>
            <button className="grow stack gap-2" style={{ textAlign: 'left' }} onClick={() => setPreview(e)}>
              <span className="m med">{e.name}</span>
              <span className="xs muted">{e.muscles.join(', ')} · {e.equipment} · {e.type}{e.custom ? ' · Tuyo' : ''}</span>
            </button>
            <button className={'square-btn' + (added(e) ? ' on' : '')} aria-label={added(e) ? `Quitar ${e.name}` : `Añadir ${e.name}`} onClick={() => toggle(e)}>{added(e) ? <Check size={20} /> : <Plus size={20} />}</button>
          </div>
        ))}
      </div>
      <button className="dashed" onClick={() => setCreating(true)}>
        <Plus size={20} />
        <div className="stack gap-2" style={{ textAlign: 'left' }}><span className="s bold" style={{ color: 'var(--text)' }}>¿No encuentras el ejercicio?</span><span className="xs muted">Créalo con su explicación y un video de hasta 10 MB</span></div>
      </button>
      <Sheet open={!!preview} onClose={() => setPreview(null)}>
        {preview && (
          <>
            <div className="thumb stack gap-8" style={{ height: 220, borderRadius: 16 }}>
              <span className="circle-icon" style={{ background: 'var(--accent)' }}><Play size={24} color="var(--on-accent)" /></span>
              <span className="xs muted">{preview.custom ? 'Video subido por ti' : `Video de muestra · ${preview.duration}`}</span>
            </div>
            <span className="h5">{preview.name}</span>
            <div className="chips">{[...preview.muscles, preview.equipment, preview.type].map((x) => <span key={x} className="tag">{x}</span>)}</div>
            <span className="s bold">Cómo se hace</span>
            <span className="s muted">{preview.description}</span>
            <button className="btn primary lg block" onClick={() => { if (!added(preview)) toggle(preview); setPreview(null) }}>{added(preview) ? 'Ya está en la rutina' : 'Añadir a la rutina'}</button>
            <button className="btn ghost block" onClick={() => setPreview(null)}>Cerrar</button>
          </>
        )}
      </Sheet>
    </>
  )
}

function CreateExercise({ name: initial, onDone }: { name: string; onDone: (e: Exercise | null) => void }) {
  const [name, setName] = useState(initial)
  const [type, setType] = useState<'Fuerza' | 'Cardio'>('Fuerza')
  const [muscles, setMuscles] = useState<string[]>([])
  const [desc, setDesc] = useState('')
  const [video, setVideo] = useState<{ name: string; mb: number } | null>(null)
  const [error, setError] = useState('')
  const onFile = (f?: File) => {
    if (!f) return
    const mb = f.size / 1024 / 1024
    if (!/\.(mp4|mov)$/i.test(f.name)) return setError('Solo se aceptan videos MP4 o MOV.')
    if (mb > MAX_MB) return setError(`El video pesa ${mb.toFixed(1)} MB y supera el máximo de ${MAX_MB} MB. Recórtalo o comprímelo.`)
    setError(''); setVideo({ name: f.name, mb })
  }
  const save = () => {
    if (!name.trim() || !muscles.length || !desc.trim()) return setError('Completa el nombre, los músculos y la explicación.')
    onDone({ id: newId('ex'), name: name.trim(), muscles, equipment: 'Personalizado', type, description: desc.trim(), duration: video ? 'propio' : '—', custom: true })
  }
  return (
    <>
      <Heading title="Crear ejercicio" sub="Lo verán tú y tus clientes." />
      <Field label="Nombre del ejercicio" value={name} onChange={setName} placeholder="Ej. Extensión de tríceps en banco declinado" />
      <div className="field"><span className="s med muted">Tipo</span><Tabs value={type} onChange={setType} options={[{ value: 'Fuerza', label: 'Fuerza' }, { value: 'Cardio', label: 'Cardio' }]} /></div>
      <span className="s med muted">Músculos</span>
      <div className="chips">{MUSCLES.map((m) => <Tag key={m} label={m} on={muscles.includes(m)} onClick={() => setMuscles(muscles.includes(m) ? muscles.filter((x) => x !== m) : [...muscles, m])} />)}</div>
      <Field label="Explicación" value={desc} onChange={setDesc} area placeholder="Cómo se ejecuta, postura, ritmo…" />
      <span className="s med muted">Video de muestra (opcional)</span>
      {video ? (
        <div className="card pad row gap-10" style={{ borderColor: 'var(--accent-line)' }}>
          <Video size={20} color="var(--accent-icon)" />
          <div className="grow stack gap-2"><span className="s med truncate">{video.name}</span><span className="xs muted">{video.mb.toFixed(1)} MB de {MAX_MB} MB · listo</span></div>
          <button aria-label="Quitar video" onClick={() => setVideo(null)}><X size={20} color="var(--icon-muted)" /></button>
        </div>
      ) : (
        <label className="dashed" style={{ justifyContent: 'center', cursor: 'pointer' }}>
          <Video size={20} /><span className="s bold">Subir video (MP4 o MOV, máx. 10 MB)</span>
          <input type="file" accept="video/mp4,video/quicktime,.mov,.mp4" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      )}
      {error && <span className="s err" role="alert">{error}</span>}
      <button className="btn primary lg block" onClick={save}>Guardar y añadir</button>
      <button className="btn ghost block" onClick={() => onDone(null)}>Cancelar</button>
    </>
  )
}

function StepSets({ r, set, exById }: StepProps & { exById: (id: string) => Exercise }) {
  const [open, setOpen] = useState(r.items[0]?.exerciseId ?? '')
  const upd = (i: number, patch: Partial<RoutineItem>) => set({ items: r.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) })
  const move = (i: number, d: number) => { const items = [...r.items]; const [x] = items.splice(i, 1); items.splice(i + d, 0, x); set({ items }) }
  return (
    <>
      <Heading title="Define series, peso y repeticiones" />
      {r.items.map((it, i) => {
        const e = exById(it.exerciseId)
        const isOpen = open === it.exerciseId
        const s0 = it.sets[0]
        const summary = e.type === 'Cardio' ? `${it.minutes} min · ${it.km} km` : it.same ? `${it.sets.length} × ${s0.reps} · ${s0.kg} kg · ${it.rest} s` : `Por serie · ${it.sets.length} series`
        return (
          <div key={it.exerciseId} className={'card pad stack gap-12' + (isOpen ? ' accent' : '')}>
            <div className="row gap-8">
              <div className="stack">
                <button aria-label="Subir" disabled={i === 0} onClick={() => move(i, -1)} style={{ opacity: i === 0 ? 0.3 : 1 }}><ArrowUp size={16} /></button>
                <button aria-label="Bajar" disabled={i === r.items.length - 1} onClick={() => move(i, 1)} style={{ opacity: i === r.items.length - 1 ? 0.3 : 1 }}><ArrowDown size={16} /></button>
              </div>
              <button className="grow stack gap-2" style={{ textAlign: 'left' }} onClick={() => setOpen(isOpen ? '' : it.exerciseId)}>
                <span className="m bold">{e.name}</span>
                {!isOpen && <span className="xs muted">{summary}</span>}
              </button>
              <span className={'chip ' + (e.type === 'Cardio' ? 'warn' : 'info')}>{e.type}</span>
              <button aria-label={isOpen ? 'Cerrar' : 'Configurar'} onClick={() => setOpen(isOpen ? '' : it.exerciseId)}><ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : undefined }} /></button>
            </div>
            {isOpen && e.type === 'Cardio' && (
              <>
                <div className="row gap-8"><Stepper label="Tiempo (min)" value={it.minutes} onChange={(v) => upd(i, { minutes: v })} /><Stepper label="Distancia (km)" value={it.km} step={0.5} onChange={(v) => upd(i, { km: v })} format={(v) => v.toLocaleString('es-CO')} /></div>
                <span className="xs muted">Completa al menos uno de los dos.</span>
              </>
            )}
            {isOpen && e.type === 'Fuerza' && (
              <>
                <div className="row between"><span className="s med">Igual en todas las series</span><Toggle label="Igual en todas las series" on={it.same} onChange={(v) => upd(i, { same: v, sets: v ? it.sets.map(() => ({ ...s0 })) : it.sets })} /></div>
                {it.same ? (
                  <div className="row gap-8">
                    <Stepper label="Series" value={it.sets.length} min={1} onChange={(n) => upd(i, { sets: Array.from({ length: Math.max(1, n) }, () => ({ ...s0 })) })} />
                    <Stepper label="Reps" value={s0.reps} min={1} onChange={(v) => upd(i, { sets: it.sets.map((s) => ({ ...s, reps: v })) })} />
                    <Stepper label="Peso (kg)" value={s0.kg} step={2.5} onChange={(v) => upd(i, { sets: it.sets.map((s) => ({ ...s, kg: v })) })} format={(v) => v.toLocaleString('es-CO')} />
                  </div>
                ) : (
                  <>
                    {it.sets.map((s, k) => (
                      <div key={k} className="row gap-8" style={{ alignItems: 'flex-end' }}>
                        <span className="xs bold accent" style={{ width: 56, height: 42, borderRadius: 10, background: 'var(--accent-soft)', display: 'grid', placeItems: 'center', flex: 'none' }}>Serie {k + 1}</span>
                        <Stepper label="Reps" value={s.reps} min={1} onChange={(v) => upd(i, { sets: it.sets.map((x, j) => (j === k ? { ...x, reps: v } : x)) })} />
                        <Stepper label="Peso (kg)" value={s.kg} step={2.5} onChange={(v) => upd(i, { sets: it.sets.map((x, j) => (j === k ? { ...x, kg: v } : x)) })} format={(v) => v.toLocaleString('es-CO')} />
                        {it.sets.length > 1 && <button aria-label={`Quitar serie ${k + 1}`} style={{ paddingBottom: 12 }} onClick={() => upd(i, { sets: it.sets.filter((_, j) => j !== k) })}><Trash2 size={16} color="var(--icon-muted)" /></button>}
                      </div>
                    ))}
                    <button className="link" onClick={() => upd(i, { sets: [...it.sets, { ...it.sets[it.sets.length - 1] }] })}><Plus size={16} />Añadir serie</button>
                  </>
                )}
                <div className="row gap-8"><Stepper label="Descanso" value={it.rest} step={15} unit=" s" onChange={(v) => upd(i, { rest: v })} /></div>
                {i < r.items.length - 1 && exById(r.items[i + 1].exerciseId).type === 'Fuerza' && (
                  <button className="link" onClick={() => { upd(i + 1, { same: it.same, sets: it.sets.map((s) => ({ ...s })), rest: it.rest }); setOpen(r.items[i + 1].exerciseId) }}><Copy size={16} />Copiar al siguiente ejercicio</button>
                )}
              </>
            )}
          </div>
        )
      })}
    </>
  )
}

function StepNotes({ r, set, exById }: StepProps & { exById: (id: string) => Exercise }) {
  return (
    <>
      <Heading title="Recomendaciones" sub="Opcional. Tu cliente las verá durante el entrenamiento." />
      {r.items.map((it, i) => (
        <Field key={it.exerciseId} label={exById(it.exerciseId).name} value={it.note} area placeholder="Ej. Baja en 3 segundos, no bloquees los codos." onChange={(v) => set({ items: r.items.map((x, j) => (j === i ? { ...x, note: v } : x)) })} />
      ))}
      <Field label="Nota general de la rutina" value={r.generalNote} area placeholder="Ej. Calienta 10 min antes. Si sientes dolor, baja el peso y avísame." onChange={(v) => set({ generalNote: v })} />
    </>
  )
}

function StepReview({ r, exById }: { r: Routine; exById: (id: string) => Exercise }) {
  const strength = r.items.filter((i) => exById(i.exerciseId).type === 'Fuerza')
  const series = strength.reduce((a, i) => a + i.sets.length, 0)
  const minutes = Math.round(strength.reduce((a, i) => a + i.sets.length * (0.75 + i.rest / 60), 0) + r.items.filter((i) => exById(i.exerciseId).type === 'Cardio').reduce((a, i) => a + i.minutes, 0))
  return (
    <>
      <div className="card pad accent stack gap-10">
        <span className="h6">{r.name}</span>
        <div className="chips"><span className="tag on">{r.level}</span>{r.muscles.slice(0, 4).map((m) => <span key={m} className="tag">{m}</span>)}</div>
        {r.description && <span className="xs muted">{r.description}</span>}
      </div>
      <div className="kpis"><Kpi label="Ejercicios" value={String(r.items.length)} /><Kpi label="Series" value={String(series)} /><Kpi label="Duración" value={`~${minutes} min`} /></div>
      <div className="stack gap-8">
        {r.items.map((it) => {
          const e = exById(it.exerciseId)
          const reps = it.sets.map((s) => s.reps).join('/')
          const kgs = [...new Set(it.sets.map((s) => s.kg))]
          const d = e.type === 'Cardio' ? `${it.minutes} min · ${it.km} km` : it.same ? `${it.sets.length} × ${it.sets[0].reps} · ${it.sets[0].kg} kg · ${it.rest} s` : `${reps} · ${kgs[0]}–${kgs[kgs.length - 1]} kg · ${it.rest} s`
          return (
            <div key={it.exerciseId} className="card row gap-12" style={{ padding: 12 }}>
              <div className="thumb" style={{ width: 48, height: 48 }}><Dumbbell size={20} color="var(--accent-icon)" /></div>
              <div className="grow stack gap-2"><span className="m med">{e.name}</span><span className="s muted">{d}{it.note ? ' · con nota' : ''}</span></div>
            </div>
          )
        })}
      </div>
      {r.generalNote && <div className="notice"><FileText size={20} color="var(--accent-text)" /><span className="xs">Nota general: {r.generalNote}</span></div>}
    </>
  )
}
