import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Clock, Coffee, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { Field, IconButton, Kpi, Progress, SearchBar, Stepper, Steps, Tabs, Tag, TopBar } from '../ui'
import { fmt, foodTotals, type Diet, type DietMeal, type Food } from './data'
import { newId, useTrainer } from './store'

const TOTAL = 7
const TITLES = ['Nombre', 'Objetivo', 'Comidas del día', 'Alimentos', 'Cantidades', 'Recomendaciones', 'Revisar y guardar']
const GOALS: Record<string, { p: number; c: number; f: number }> = { Déficit: { p: 30, c: 40, f: 30 }, Mantenimiento: { p: 25, c: 45, f: 30 }, Volumen: { p: 25, c: 50, f: 25 }, Recomposición: { p: 35, c: 35, f: 30 } }
const PRESETS: Record<string, [string, string][]> = {
  '3': [['Desayuno', '07:30'], ['Almuerzo', '13:00'], ['Cena', '20:00']],
  '4': [['Desayuno', '07:30'], ['Almuerzo', '13:00'], ['Merienda', '17:00'], ['Cena', '20:30']],
  '5': [['Desayuno', '07:00'], ['Media mañana', '10:00'], ['Almuerzo', '13:00'], ['Merienda', '17:00'], ['Cena', '20:30']],
}
const mealsFrom = (k: string): DietMeal[] => PRESETS[k].map(([name, time]) => ({ id: newId('m'), name, time, foods: [] }))

export default function DietWizard() {
  const t = useTrainer()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [d, setD] = useState<Diet>(() => ({ id: newId('d'), name: '', description: '', goal: 'Déficit', kcal: 1800, macros: GOALS['Déficit'], restrictions: [], meals: mealsFrom('4'), substitutes: [], generalNote: '', supplements: [], assigned: [] }))
  const set = (p: Partial<Diet>) => setD((x) => ({ ...x, ...p }))
  const food = (id: string) => t.foods.find((f) => f.id === id)!
  const totals = useMemo(() => d.meals.flatMap((m) => m.foods).reduce((a, x) => { const v = foodTotals(food(x.foodId), x.qty); return { kcal: a.kcal + v.kcal, p: a.p + v.p, c: a.c + v.c, f: a.f + v.f } }, { kcal: 0, p: 0, c: 0, f: 0 }), [d.meals, t.foods]) // eslint-disable-line react-hooks/exhaustive-deps
  const goalG = { p: (d.kcal * d.macros.p) / 100 / 4, c: (d.kcal * d.macros.c) / 100 / 4, f: (d.kcal * d.macros.f) / 100 / 9 }
  const next = () => {
    if (step === 1 && !d.name.trim()) return setError('Ponle un nombre a la dieta.')
    if (step === 2 && d.macros.p + d.macros.c + d.macros.f !== 100) return setError('Los macros deben sumar 100%.')
    if (step === 4 && !d.meals.some((m) => m.foods.length)) return setError('Añade al menos un alimento.')
    setError(''); setStep(step + 1)
  }
  const save = (assign: boolean) => { t.saveDiet({ ...d, kcal: d.kcal }); nav(assign ? `/entrenador/asignar/dieta/${d.id}` : '/entrenador/rutinas', { replace: true }) }
  return (
    <>
      <TopBar title="Nueva dieta" onBack={() => (step > 1 ? setStep(step - 1) : nav(-1))} action={<IconButton icon={X} label="Salir" onClick={() => nav('/entrenador/rutinas')} />} />
      <div className="screen-body">
        <Steps step={step} total={TOTAL} title={TITLES[step - 1]} />
        {step === 1 && (
          <>
            <H title="¿Cómo se llama la dieta?" sub="Como las rutinas, podrás asignarla, editarla o duplicarla." />
            <Field label="Nombre" value={d.name} onChange={(v) => set({ name: v })} placeholder="Ej. Déficit moderado · 1.800 kcal" />
            <Field label="Descripción (opcional)" value={d.description} area onChange={(v) => set({ description: v })} placeholder="Ej. Plan para bajar grasa sin perder músculo." />
          </>
        )}
        {step === 2 && (
          <>
            <H title="¿Cuál es el objetivo?" />
            <div className="chips">{Object.keys(GOALS).map((g) => <Tag key={g} label={g} on={d.goal === g} onClick={() => set({ goal: g, macros: GOALS[g] })} />)}</div>
            <div className="row gap-8"><Stepper label="Calorías diarias" value={d.kcal} step={50} format={(v) => `${fmt(v)} kcal`} onChange={(v) => set({ kcal: v })} /></div>
            <button className="notice" style={{ textAlign: 'left' }} onClick={() => set({ kcal: 1780 })}><Sparkles size={20} color="var(--accent-text)" /><span className="xs grow">Sugerido para María según su peso, altura y actividad: <b>1.780 kcal</b>. Toca para usarlo.</span></button>
            <span className="s bold faint">Macros · {d.macros.p + d.macros.c + d.macros.f}%</span>
            <div className="card pad stack gap-12">
              {(['p', 'c', 'f'] as const).map((k) => (
                <div key={k} className="row gap-12" style={{ alignItems: 'flex-end' }}>
                  <div className="grow stack gap-6"><div className="row between"><span className="s med">{{ p: 'Proteína', c: 'Carbohidratos', f: 'Grasas' }[k]}</span><span className="s bold accent">{fmt(goalG[k])} g</span></div><Progress thin value={d.macros[k] / 100} /></div>
                  <div style={{ width: 120 }}><Stepper label="%" value={d.macros[k]} step={5} unit="%" onChange={(v) => set({ macros: { ...d.macros, [k]: v } })} /></div>
                </div>
              ))}
              <span className="xs muted">Reparto sugerido para {d.goal.toLowerCase()}. Puedes ajustarlo.</span>
            </div>
            <span className="s bold faint">Restricciones</span>
            <div className="chips">{['Vegetariana', 'Sin lactosa', 'Sin gluten', 'Sin frutos secos'].map((r) => <Tag key={r} label={r} on={d.restrictions.includes(r)} onClick={() => set({ restrictions: d.restrictions.includes(r) ? d.restrictions.filter((x) => x !== r) : [...d.restrictions, r] })} />)}</div>
          </>
        )}
        {step === 3 && <StepMeals d={d} set={set} />}
        {step === 4 && <StepFoods d={d} set={set} />}
        {step === 5 && (
          <>
            <H title="Ajusta las cantidades" />
            <TotalBar totals={totals} d={d} goalG={goalG} />
            {d.meals.filter((m) => m.foods.length).map((m) => (
              <div key={m.id} className="card stack" style={{ padding: '12px 16px 4px' }}>
                <div className="row gap-8" style={{ paddingBottom: 8 }}><Coffee size={20} color="var(--accent-icon)" /><span className="m bold grow">{m.name} · {m.time}</span><span className="s bold accent">{fmt(m.foods.reduce((a, x) => a + foodTotals(food(x.foodId), x.qty).kcal, 0))} kcal</span></div>
                {m.foods.map((x) => {
                  const f = food(x.foodId)
                  return (
                    <div key={x.foodId} className="row gap-12" style={{ padding: '10px 0', borderTop: '1px solid var(--border)', alignItems: 'flex-end' }}>
                      <div className="grow stack gap-2"><span className="s med">{f.name}</span><span className="xs muted">{fmt(foodTotals(f, x.qty).kcal)} kcal</span></div>
                      <div style={{ width: 140 }}><Stepper label="Cantidad" value={x.qty} min={f.unit === 'ud' ? 1 : 10} step={f.unit === 'ud' ? 1 : 10} unit={f.unit === 'ud' ? ' ud' : ` ${f.unit}`} onChange={(v) => set({ meals: d.meals.map((mm) => (mm.id === m.id ? { ...mm, foods: mm.foods.map((ff) => (ff.foodId === x.foodId ? { ...ff, qty: v } : ff)) } : mm)) })} /></div>
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}
        {step === 6 && <StepTips d={d} set={set} />}
        {step === 7 && (
          <>
            <div className="card pad accent stack gap-10">
              <span className="h6">{d.name}</span>
              <div className="chips"><span className="tag on">{d.goal}</span>{d.restrictions.map((r) => <span key={r} className="tag">{r}</span>)}</div>
            </div>
            <div className="kpis"><Kpi label="Calorías" value={fmt(totals.kcal)} note={`Objetivo ${fmt(d.kcal)}`} /><Kpi label="Comidas" value={String(d.meals.length)} /><Kpi label="Alimentos" value={String(d.meals.reduce((a, m) => a + m.foods.length, 0))} /></div>
            <TotalBar totals={totals} d={d} goalG={goalG} />
            {d.meals.map((m) => <div key={m.id} className="card row gap-8" style={{ padding: '12px 16px' }}><Coffee size={20} color="var(--accent-icon)" /><span className="s bold grow">{m.name}</span><span className="s muted">{m.time}</span><span className="s bold accent">{fmt(m.foods.reduce((a, x) => a + foodTotals(food(x.foodId), x.qty).kcal, 0))} kcal</span></div>)}
          </>
        )}
        {error && <span className="s err" role="alert">{error}</span>}
      </div>
      <div className="footer">
        {step === 6 && <button className="link" style={{ flex: 'none' }} onClick={() => setStep(7)}>Omitir</button>}
        {step > 1 && step < 7 && <button className="btn tertiary" onClick={() => setStep(step - 1)}>Atrás</button>}
        {step < 7 && <button className="btn primary" onClick={next}>Siguiente</button>}
        {step === 7 && <><button className="btn tertiary" onClick={() => save(false)}>Guardar</button><button className="btn primary" onClick={() => save(true)}>Guardar y asignar</button></>}
      </div>
    </>
  )
}

function H({ title, sub }: { title: string; sub?: string }) {
  return <div className="stack gap-4"><span className="h5">{title}</span>{sub && <span className="s muted">{sub}</span>}</div>
}

type P = { d: Diet; set: (p: Partial<Diet>) => void }

function TotalBar({ totals, d, goalG }: { totals: { kcal: number; p: number; c: number; f: number }; d: Diet; goalG: { p: number; c: number; f: number } }) {
  return (
    <div className="stack gap-8" style={{ padding: 14, borderRadius: 16, background: 'var(--accent-soft)', border: '1px solid var(--accent-line)' }}>
      <div className="row between"><span className="s bold">Total del día</span><span className="m bold accent">{fmt(totals.kcal)} / {fmt(d.kcal)} kcal</span></div>
      <Progress thin value={totals.kcal / d.kcal} />
      <span className="xs muted">P {fmt(totals.p)}/{fmt(goalG.p)} g · C {fmt(totals.c)}/{fmt(goalG.c)} g · G {fmt(totals.f)}/{fmt(goalG.f)} g</span>
    </div>
  )
}

function StepMeals({ d, set }: P) {
  const count = String(d.meals.length) as '3' | '4' | '5'
  const upd = (id: string, p: Partial<DietMeal>) => set({ meals: d.meals.map((m) => (m.id === id ? { ...m, ...p } : m)) })
  return (
    <>
      <H title="Comidas del día" sub="¿Cuántas comidas hará tu cliente y a qué hora?" />
      <Tabs value={['3', '4', '5'].includes(count) ? count : '4'} onChange={(k) => set({ meals: mealsFrom(k) })} options={['3', '4', '5'].map((k) => ({ value: k, label: `${k} comidas` }))} />
      {d.meals.map((m) => (
        <div key={m.id} className="card row gap-12" style={{ padding: '10px 16px' }}>
          <Coffee size={20} color="var(--accent-icon)" />
          <input aria-label="Nombre de la comida" value={m.name} onChange={(e) => upd(m.id, { name: e.target.value })} className="m med grow" style={{ background: 'none', border: 0, outline: 0, minWidth: 0 }} />
          <label className="row gap-6" style={{ padding: '6px 10px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
            <Clock size={16} color="var(--accent-icon)" />
            <input aria-label={`Hora de ${m.name}`} type="time" value={m.time} onChange={(e) => upd(m.id, { time: e.target.value })} className="s bold" style={{ background: 'none', border: 0, outline: 0, width: 64 }} />
          </label>
          {d.meals.length > 1 && <button aria-label={`Quitar ${m.name}`} onClick={() => set({ meals: d.meals.filter((x) => x.id !== m.id) })}><Trash2 size={16} color="var(--icon-muted)" /></button>}
        </div>
      ))}
      <button className="dashed" style={{ justifyContent: 'center' }} onClick={() => set({ meals: [...d.meals, { id: newId('m'), name: 'Nueva comida', time: '16:00', foods: [] }] })}><Plus size={20} /><span className="s bold">Añadir comida</span></button>
    </>
  )
}

function StepFoods({ d, set }: P) {
  const t = useTrainer()
  const [meal, setMeal] = useState(d.meals[0].id)
  const [q, setQ] = useState('')
  const [creating, setCreating] = useState(false)
  const current = d.meals.find((m) => m.id === meal) ?? d.meals[0]
  const vegan = d.restrictions.includes('Vegetariana')
  const results = t.foods.filter((f) => f.name.toLowerCase().includes(q.toLowerCase())).filter((f) => !vegan || !['pollo', 'atun', 'salmon', 'carne'].includes(f.id))
  const has = (f: Food) => current.foods.some((x) => x.foodId === f.id)
  const toggle = (f: Food) => set({ meals: d.meals.map((m) => (m.id === current.id ? { ...m, foods: has(f) ? m.foods.filter((x) => x.foodId !== f.id) : [...m.foods, { foodId: f.id, qty: f.unit === 'ud' ? 1 : 100 }] } : m)) })
  if (creating) return <CreateFood name={q} onDone={(f) => { if (f) { t.addFood(f); set({ meals: d.meals.map((m) => (m.id === current.id ? { ...m, foods: [...m.foods, { foodId: f.id, qty: f.unit === 'ud' ? 1 : 100 }] } : m)) }) } setCreating(false) }} />
  return (
    <>
      <H title="Añade alimentos" />
      <div className="chips">{d.meals.map((m) => <Tag key={m.id} label={`${m.name}${m.foods.length ? ` · ${m.foods.length}` : ''}`} on={m.id === current.id} onClick={() => setMeal(m.id)} />)}</div>
      <SearchBar value={q} onChange={setQ} placeholder="Busca un alimento (ej. avena, pollo)" />
      <span className="xs muted">{results.length} resultados · base de alimentos Repe{vegan ? ' · solo vegetarianos' : ''}</span>
      <div className="stack gap-8">
        {results.slice(0, 10).map((f) => (
          <div key={f.id} className="card row gap-12" style={{ padding: '12px 16px', borderColor: has(f) ? 'var(--accent-line)' : undefined }}>
            <div className="grow stack gap-2"><span className="m med">{f.name}{f.custom ? ' · tuyo' : ''}</span><span className="xs med accent">{f.kcal} kcal · por {f.per}</span><span className="xs muted">P {f.p} g · C {f.c} g · G {f.f} g</span></div>
            <button className={'square-btn' + (has(f) ? ' on' : '')} aria-label={has(f) ? `Quitar ${f.name}` : `Añadir ${f.name}`} onClick={() => toggle(f)}>{has(f) ? <Check size={20} /> : <Plus size={20} />}</button>
          </div>
        ))}
      </div>
      <button className="dashed" onClick={() => setCreating(true)}><Plus size={20} /><div className="stack gap-2" style={{ textAlign: 'left' }}><span className="s bold" style={{ color: 'var(--text)' }}>¿No lo encuentras?</span><span className="xs muted">Crea el alimento con sus calorías y macros</span></div></button>
    </>
  )
}

function CreateFood({ name: initial, onDone }: { name: string; onDone: (f: Food | null) => void }) {
  const [name, setName] = useState(initial)
  const [mode, setMode] = useState<'100' | 'porcion'>('porcion')
  const [portion, setPortion] = useState('1 unidad · 90 g')
  const [v, setV] = useState({ kcal: 198, p: 4, c: 38, f: 3 })
  const [error, setError] = useState('')
  const save = () => {
    if (!name.trim()) return setError('Ponle un nombre al alimento.')
    onDone({ id: newId('f'), name: name.trim(), per: mode === '100' ? '100 g' : portion, ...v, unit: mode === '100' ? 'g' : 'ud', custom: true })
  }
  return (
    <>
      <H title="Crear alimento" sub="Se guarda en “Mis alimentos”. Lo verán tú y tus clientes." />
      <Field label="Nombre del alimento" value={name} onChange={setName} placeholder="Ej. Arepa de maíz casera" />
      <div className="field"><span className="s med muted">Valores nutricionales</span><Tabs value={mode} onChange={setMode} options={[{ value: '100', label: 'Por 100 g' }, { value: 'porcion', label: 'Por porción' }]} /></div>
      {mode === 'porcion' && <Field label="Tamaño de la porción" value={portion} onChange={setPortion} />}
      <div className="row gap-8"><Stepper label="Calorías (kcal)" value={v.kcal} step={5} onChange={(x) => setV({ ...v, kcal: x })} /><Stepper label="Proteína (g)" value={v.p} onChange={(x) => setV({ ...v, p: x })} /></div>
      <div className="row gap-8"><Stepper label="Carbohidratos (g)" value={v.c} onChange={(x) => setV({ ...v, c: x })} /><Stepper label="Grasas (g)" value={v.f} onChange={(x) => setV({ ...v, f: x })} /></div>
      {error && <span className="s err" role="alert">{error}</span>}
      <button className="btn primary lg block" onClick={save}>Guardar y añadir</button>
      <button className="btn ghost block" onClick={() => onDone(null)}>Cancelar</button>
    </>
  )
}

function StepTips({ d, set }: P) {
  const t = useTrainer()
  const inDiet = [...new Set(d.meals.flatMap((m) => m.foods.map((x) => x.foodId)))].map((id) => t.foods.find((f) => f.id === id)!).filter(Boolean)
  const get = (name: string) => d.substitutes.find((s) => s.food === name)?.text ?? ''
  const put = (name: string, text: string) => set({ substitutes: [...d.substitutes.filter((s) => s.food !== name), { food: name, text }] })
  return (
    <>
      <H title="Recomendaciones" sub="Opcional. Ayuda a tu cliente a seguir la dieta con flexibilidad." />
      {inDiet.slice(0, 3).map((f) => <Field key={f.id} label={`Sustituto · ${f.name}`} value={get(f.name)} area placeholder="Ej. Puedes cambiarlo por…" onChange={(v) => put(f.name, v)} />)}
      <Field label="Nota general" value={d.generalNote} area placeholder="Ej. Toma 2,5 L de agua al día." onChange={(v) => set({ generalNote: v })} />
      <span className="s bold faint">Suplementos (opcional)</span>
      <div className="chips">{['Proteína whey', 'Creatina', 'Multivitamínico', 'Omega 3'].map((s) => <Tag key={s} label={s} on={d.supplements.includes(s)} onClick={() => set({ supplements: d.supplements.includes(s) ? d.supplements.filter((x) => x !== s) : [...d.supplements, s] })} />)}</div>
    </>
  )
}
