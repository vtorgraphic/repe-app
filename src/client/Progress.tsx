import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Camera, Lock, MessageSquareQuote, Trophy } from 'lucide-react'
import { CircleIcon, Dialog, Progress as Bar, SearchBar, SectionTitle, Sheet, Stepper, Tabs, TopBar, Toast, useToast } from '../ui'
import { ACHIEVEMENTS, BODYWEIGHT, MONTHS, RECORDS } from './data'
import { useClient } from './store'

function LineChart({ data, unit, goal }: { data: number[]; unit: string; goal?: number }) {
  const W = 360, H = 140, pad = 24
  const all = goal ? [...data, goal] : data
  const min = Math.floor(Math.min(...all) - 2), max = Math.ceil(Math.max(...all) + 2)
  const x = (i: number) => pad + (i * (W - pad * 2)) / (data.length - 1)
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2)
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Evolución: de ${data[0]} a ${data[data.length - 1]} ${unit}`}>
      {[0, 1, 2].map((k) => { const v = min + ((max - min) * k) / 2; return <g key={k}><line x1={pad} x2={W - pad} y1={y(v)} y2={y(v)} stroke="var(--border)" strokeDasharray="3 4" /><text x={0} y={y(v) + 4} fontSize="10" fill="var(--text-2)">{Math.round(v)}</text></g> })}
      {goal && <><line x1={pad} x2={W - pad} y1={y(goal)} y2={y(goal)} stroke="var(--warn-500)" strokeDasharray="6 4" /><text x={W - pad} y={y(goal) - 6} fontSize="10" fill="var(--warn-500)" textAnchor="end">Meta {goal} {unit}</text></>}
      <polyline points={pts} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === data.length - 1 ? 5 : 3} fill={i === data.length - 1 ? 'var(--accent)' : 'var(--bg)'} stroke="var(--accent)" strokeWidth="2" />)}
      {MONTHS.map((m, i) => <text key={m} x={x(i)} y={H - 4} fontSize="10" fill="var(--text-2)" textAnchor="middle">{m}</text>)}
    </svg>
  )
}

export function Progress() {
  const c = useClient()
  const nav = useNavigate()
  const toast = useToast()
  const [ex, setEx] = useState(RECORDS[0].name)
  const [range, setRange] = useState('6M')
  const [q, setQ] = useState('')
  const [photoView, setPhotoView] = useState<'frente' | 'perfil' | 'espalda'>('frente')
  const [unlocked, setUnlocked] = useState<string | null>(null)
  const [logging, setLogging] = useState(false)
  const [w, setW] = useState(c.weight)
  const rec = RECORDS.find((r) => r.name === ex) ?? RECORDS[0]
  const factor = c.unit === 'lb' ? 2.2046 : 1
  const series = rec.series.map((v) => +(v * factor).toFixed(1))
  const sliced = range === '1M' ? series.slice(-2) : range === '3M' ? series.slice(-3) : series
  const weights = [...BODYWEIGHT.slice(0, -1), c.weight]
  const records = RECORDS.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
  const preview = ACHIEVEMENTS.flatMap((g) => g.items).slice(0, 6)
  return (
    <>
      <div className="screen-body">
        <div className="stack" style={{ paddingTop: 8 }}><span className="s muted">Tu evolución</span><span className="h5">Progreso</span></div>
        <div className="card pad stack gap-12">
          <span className="m bold">4 de 5 días esta semana</span>
          <span className="xs muted">Tu meta: 5 días · Racha semanal: 3 semanas seguidas</span>
          <div className="row between">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i} className="circle-icon xs bold" style={{ width: 40, height: 40, background: i < 4 ? 'var(--accent)' : 'var(--n-700)', color: i < 4 ? 'var(--on-accent)' : 'var(--text-2)' }}>{d}</span>)}</div>
        </div>
        <SectionTitle title={`Logros · ${ACHIEVEMENTS.flatMap((g) => g.items).filter((a) => a.done).length} de ${ACHIEVEMENTS.flatMap((g) => g.items).length}`} link="Ver todos" onLink={() => nav('/cliente/progreso/logros')} />
        <div className="row gap-8" style={{ overflowX: 'auto', paddingBottom: 4 }}>
          {preview.map((a) => (
            <button key={a.name} className="card stack gap-8" style={{ minWidth: 136, padding: 12, textAlign: 'left', borderColor: a.done ? 'var(--accent-line)' : undefined }} onClick={() => a.done && setUnlocked(a.name)}>
              <CircleIcon icon={a.done ? Trophy : a.progress ? Award : Lock} size={36} tone={a.done ? 'accent' : 'warn'} />
              <span className="xs bold">{a.name}</span>
              <span className="xs muted">{a.status}</span>
              {!a.done && <Bar thin value={a.progress} />}
            </button>
          ))}
        </div>
        <SectionTitle title="Antes y después" />
        <div className="row gap-8">
          {[['Peso corporal', '76.2 kg', `${c.weight} kg`, `${(c.weight - 76.2 >= 0 ? '+' : '')}${(c.weight - 76.2).toFixed(1)} kg`], ['Grasa corporal', '20.1%', '18.2%', '−1.9 pts']].map(([t, a, b, d]) => (
            <div key={t} className="card stack gap-6" style={{ flex: 1, padding: 14 }}><span className="xs muted">{t}</span><span className="xs muted">Antes {a}</span><span className="h6">{b}</span><span className="xs bold accent">{d}</span></div>
          ))}
        </div>
        <SectionTitle title="Avance por ejercicio" />
        <div className="card pad stack gap-12">
          <div className="row gap-8">
            <select aria-label="Ejercicio" value={ex} onChange={(e) => setEx(e.target.value)} className="m bold grow" style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 10px' }}>{RECORDS.map((r) => <option key={r.name}>{r.name}</option>)}</select>
            <Tabs value={c.unit} onChange={c.setUnit} options={[{ value: 'kg', label: 'kg' }, { value: 'lb', label: 'lb' }]} />
          </div>
          <div className="row between"><div className="stack"><span className="xs muted">Peso máximo</span><span className="h5">{series[series.length - 1]} {c.unit}</span></div><div className="stack" style={{ alignItems: 'flex-end' }}><span className="xs muted">En 6 meses</span><span className="m bold accent">+{(series[series.length - 1] - series[0]).toFixed(1)} {c.unit}</span></div></div>
          <Tabs value={range} onChange={setRange} options={['1M', '3M', '6M', '1A'].map((r) => ({ value: r, label: r }))} />
          {sliced.length > 1 ? <LineChart data={range === '1A' ? series : sliced.length < 3 ? series.slice(-3) : sliced} unit={c.unit} /> : null}
        </div>
        <div className="card pad stack gap-12">
          <div className="row between"><span className="m bold">Peso corporal</span><button className="link" onClick={() => { setW(c.weight); setLogging(true) }}>Registrar peso</button></div>
          <div className="row between"><div className="stack"><span className="xs muted">Actual</span><span className="h5">{c.weight} kg</span></div><span className="xs muted">Te faltan {(82 - c.weight).toFixed(1)} kg para tu meta</span></div>
          <LineChart data={weights} unit="kg" goal={82} />
        </div>
        <SectionTitle title="Récords personales" />
        <SearchBar value={q} onChange={setQ} placeholder="Buscar ejercicio" />
        <div className="card">
          {records.map((r) => (
            <button key={r.name} className="list-row" onClick={() => setEx(r.name)}>
              <div className="grow stack gap-2"><span className="m med">{r.name}</span><span className="xs muted">Récord del {r.date} · {r.muscle}</span></div>
              <div className="stack" style={{ alignItems: 'flex-end' }}><span className="s bold">{r.best}</span><span className="xs bold accent">{r.delta}</span></div>
            </button>
          ))}
          {records.length === 0 && <div className="list-row"><span className="s muted">Sin resultados para “{q}”.</span></div>}
        </div>
        <SectionTitle title="Fotos de antes y después" />
        <Tabs value={photoView} onChange={setPhotoView} options={[{ value: 'frente', label: 'Frente' }, { value: 'perfil', label: 'Perfil' }, { value: 'espalda', label: 'Espalda' }]} />
        <div className="row gap-8">{[['Antes', '13 feb'], ['Después', '13 jul']].map(([t, d]) => <div key={t} className="card stack gap-6" style={{ flex: 1, height: 180, alignItems: 'center', justifyContent: 'center' }}><Camera size={24} color="var(--icon-muted)" /><span className="xs bold">{t}</span><span className="xs muted">{d} · {photoView}</span></div>)}</div>
        <label className="btn tertiary block" style={{ cursor: 'pointer' }}>Subir foto de esta semana<input type="file" accept="image/*" hidden onChange={() => toast.show('Foto guardada. Solo la verá Pedro.')} /></label>
        <SectionTitle title="Medidas corporales" />
        <div className="kpis">{[['Pecho', '98 cm', '+3 cm'], ['Brazo', '34 cm', '+1.5 cm'], ['Cintura', '81 cm', '−2 cm']].map(([a, b, d]) => <div key={a} className="card kpi"><span className="xs muted">{a}</span><span className="h6">{b}</span><span className="xs bold accent">{d}</span></div>)}</div>
        <div className="notice" style={{ alignItems: 'flex-start' }}><MessageSquareQuote size={20} color="var(--accent-text)" style={{ flex: 'none' }} /><div className="stack gap-4"><span className="xs bold">Comentario de Pedro · resumen de julio</span><span className="xs">“Subiste 15 kg en banca sin perder técnica. Este mes vamos por los 80 kg y a bajar 1 cm más de cintura.”</span></div></div>
      </div>
      <Dialog open={!!unlocked} onClose={() => setUnlocked(null)}>
        <CircleIcon icon={Trophy} size={72} />
        <span className="xs bold accent">¡LOGRO DESBLOQUEADO!</span>
        <span className="h5 center">{unlocked}</span>
        <span className="s muted center">Lo lograste este mes. Pedro ya lo sabe.</span>
        <button className="btn primary block" onClick={() => { navigator.clipboard?.writeText(`¡Logré “${unlocked}” en Repe! 💪`); setUnlocked(null); toast.show('Logro copiado para compartir') }}>Compartir logro</button>
        <button className="btn ghost block" onClick={() => setUnlocked(null)}>Seguir</button>
      </Dialog>
      <Sheet open={logging} onClose={() => setLogging(false)}>
        <span className="h5">Registrar peso de hoy</span>
        <div className="row"><Stepper label="Peso (kg)" value={w} step={0.1} onChange={setW} format={(v) => `${v.toFixed(1)} kg`} /></div>
        <button className="btn primary lg block" onClick={() => { c.logWeight(+w.toFixed(1)); setLogging(false); toast.show('Peso registrado') }}>Guardar</button>
      </Sheet>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function Achievements() {
  const done = ACHIEVEMENTS.flatMap((g) => g.items).filter((a) => a.done).length
  return (
    <>
      <TopBar title="Logros" />
      <div className="screen-body">
        <div className="card pad stack gap-8" style={{ borderColor: 'var(--accent-line)' }}>
          <span className="h6">{done} de {ACHIEVEMENTS.flatMap((g) => g.items).length} logros</span>
          <span className="xs muted">El próximo: primeros 80 kg en press banca</span>
        </div>
        {ACHIEVEMENTS.map((g) => (
          <div key={g.group} className="stack gap-8">
            <SectionTitle title={g.group} link={`${g.items.filter((a) => a.done).length} de ${g.items.length}`} />
            <div className="card">
              {g.items.map((a) => (
                <div key={a.name} className="list-row">
                  <CircleIcon icon={a.done ? Trophy : a.progress ? Award : Lock} size={40} tone={a.done ? 'accent' : 'warn'} />
                  <div className="grow stack gap-4"><span className="s bold">{a.name}</span><span className="xs muted">{a.status}</span>{!a.done && a.progress > 0 && <Bar thin value={a.progress} />}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <span className="xs muted center">Las metas de racha se ajustan a los días que elegiste en tu objetivo.</span>
      </div>
    </>
  )
}
