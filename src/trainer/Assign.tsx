import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, ClipboardList, Coffee } from 'lucide-react'
import { Avatar, SearchBar, SectionTitle, Tabs, Tag, Toast, TopBar, useToast } from '../ui'
import { useTrainer } from './store'

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

export default function Assign() {
  const { kind, id } = useParams()
  const t = useTrainer()
  const nav = useNavigate()
  const toast = useToast()
  const isR = kind === 'rutina'
  const plan = isR ? t.routines.find((r) => r.id === id) : t.diets.find((d) => d.id === id)
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [days, setDays] = useState<string[]>(['Lun', 'Jue'])
  const [start, setStart] = useState('Lun 23 nov')
  const [weeks, setWeeks] = useState('8')
  if (!plan) return <><TopBar title="Asignar" /><div className="screen-body"><span className="s muted">No encontramos este plan.</span></div></>
  const clients = t.clients.filter((c) => ['activo', 'inactivo', 'por vencer'].includes(c.status) && c.name.toLowerCase().includes(q.toLowerCase()))
  const toggle = (cid: string) => setPicked((p) => (p.includes(cid) ? p.filter((x) => x !== cid) : [...p, cid]))
  const submit = () => {
    if (!picked.length) return toast.show('Elige al menos un cliente')
    if (isR) t.assignRoutine(plan.id, picked); else t.assignDiet(plan.id, picked)
    toast.show(`Asignada a ${picked.length} cliente${picked.length > 1 ? 's' : ''}`)
    setTimeout(() => nav('/entrenador/rutinas'), 900)
  }
  const Icon = isR ? ClipboardList : Coffee
  return (
    <>
      <TopBar title={isR ? 'Asignar rutina' : 'Asignar dieta'} />
      <div className="screen-body">
        <div className="card row gap-12" style={{ padding: 16 }}>
          <div className="thumb" style={{ width: 48, height: 48, borderRadius: 12 }}><Icon size={20} color="var(--accent-icon)" /></div>
          <div className="grow stack gap-2"><span className="m bold">{plan.name}</span><span className="xs med accent">{plan.assigned.length ? `Ya asignada a ${plan.assigned.length} clientes` : 'Sin asignar'}</span></div>
        </div>
        <SectionTitle title="Elige los clientes" link={`${picked.length} seleccionados`} />
        <SearchBar value={q} onChange={setQ} placeholder="Buscar cliente" />
        <div className="card" style={{ padding: '4px 16px' }}>
          {clients.map((c, i) => {
            const on = picked.includes(c.id)
            const already = plan.assigned.includes(c.id)
            return (
              <button key={c.id} className="row gap-12" style={{ padding: '10px 0', width: '100%', textAlign: 'left', borderTop: i ? '1px solid var(--border)' : undefined }} onClick={() => toggle(c.id)} aria-pressed={on}>
                <span className={'check' + (on ? ' on' : '')}>{on && <Check size={16} />}</span>
                <Avatar initials={c.initials} />
                <div className="grow stack gap-2"><span className="m med">{c.name}</span><span className="xs muted">{already ? (isR ? 'Ya la tiene · se sumará otra vez' : 'Ya tiene esta dieta') : c.plan}</span></div>
              </button>
            )
          })}
        </div>
        {isR && (
          <>
            <span className="s med muted">Días de la semana</span>
            <div className="chips">{DAYS.map((d) => <Tag key={d} label={d} on={days.includes(d)} onClick={() => setDays(days.includes(d) ? days.filter((x) => x !== d) : [...days, d])} />)}</div>
            <span className="xs muted">La misma rutina puede repetirse varios días y asignarse a varios clientes.</span>
          </>
        )}
        <span className="s med muted">Fecha de inicio</span>
        <div className="chips">{['Hoy', 'Lun 23 nov', 'Lun 30 nov'].map((d) => <Tag key={d} label={d} on={start === d} onClick={() => setStart(d)} />)}</div>
        <span className="s med muted">Duración</span>
        <Tabs value={weeks} onChange={setWeeks} options={['4', '8', '12'].map((w) => ({ value: w, label: `${w} semanas` }))} />
      </div>
      <div className="footer"><button className="btn primary lg" onClick={submit}>{picked.length ? `Asignar a ${picked.length} cliente${picked.length > 1 ? 's' : ''}` : 'Asignar'}</button></div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}
