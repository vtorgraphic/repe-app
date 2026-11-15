import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Coffee, Copy, Edit3, MoreVertical, Plus, Trash2, Users } from 'lucide-react'
import { CupoBanner, Dialog, SearchBar, SectionTitle, Sheet, Tabs, Tag, Toast, useToast, Chevron } from '../ui'
import { useTrainer } from './store'

function PlanCard({ icon: Icon, name, detail, assigned, onMore, onOpen }: { icon: typeof ClipboardList; name: string; detail: string; assigned: number; onMore: () => void; onOpen?: () => void }) {
  return (
    <div className="card row gap-12" style={{ padding: 16 }}>
      <button className="row gap-12 grow" style={{ textAlign: 'left' }} onClick={onOpen ?? onMore}>
        <div className="thumb" style={{ width: 48, height: 48, borderRadius: 12 }}><Icon size={20} color="var(--accent-icon)" /></div>
        <div className="grow stack gap-2">
          <span className="m bold truncate">{name}</span>
          <span className="xs muted">{detail}</span>
          <span className="xs med accent">{assigned ? `Asignada a ${assigned} cliente${assigned > 1 ? 's' : ''}` : 'Sin asignar'}</span>
        </div>
      </button>
      <button aria-label={`Opciones de ${name}`} onClick={onMore}><MoreVertical size={20} color="var(--icon-muted)" /></button>
    </div>
  )
}

export function Library() {
  const t = useTrainer()
  const nav = useNavigate()
  const toast = useToast()
  const [kind, setKind] = useState<'rutinas' | 'dietas'>('rutinas')
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<string | null>(null)
  const [actions, setActions] = useState<string | null>(null)
  const [create, setCreate] = useState(false)
  const [template, setTemplate] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const isR = kind === 'rutinas'
  const filters = isR ? ['Principiante', 'Intermedio', 'Tren superior', 'Tren inferior'] : ['Déficit', 'Volumen', 'Mantenimiento', 'Vegetariana']
  const routines = t.routines.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()) && (!filter || r.level === filter || (filter === 'Tren superior' && r.muscles.some((m) => ['Pecho', 'Espalda', 'Hombro'].includes(m))) || (filter === 'Tren inferior' && r.muscles.some((m) => ['Cuádriceps', 'Glúteos'].includes(m)))))
  const diets = t.diets.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()) && (!filter || d.goal === filter || d.restrictions.includes(filter)))
  const selected = t.routines.find((r) => r.id === actions)
  const selectedDiet = t.diets.find((d) => d.id === actions)
  return (
    <>
      <div className="screen-body">
        <span className="h5" style={{ paddingTop: 8 }}>Rutinas</span>
        {t.warn && <CupoBanner active={t.activeCount} limit={t.limit} onClick={() => nav('/entrenador/plan-ilimitado')} />}
        <Tabs value={kind} onChange={(v) => { setKind(v); setFilter(null) }} options={[{ value: 'rutinas', label: 'Entrenamiento' }, { value: 'dietas', label: 'Alimentación' }]} />
        <SearchBar value={q} onChange={setQ} placeholder={isR ? 'Buscar rutina' : 'Buscar dieta'} />
        <div className="chips">{filters.map((f) => <Tag key={f} label={f} on={filter === f} onClick={() => setFilter(filter === f ? null : f)} />)}</div>
        <SectionTitle title={isR ? `Mis rutinas (${routines.length})` : `Mis dietas (${diets.length})`} />
        <div className="stack gap-8">
          {isR
            ? routines.map((r) => <PlanCard key={r.id} icon={ClipboardList} name={r.name} detail={`${r.level} · ${r.items.length} ejercicios`} assigned={r.assigned.length} onMore={() => setActions(r.id)} />)
            : diets.map((d) => <PlanCard key={d.id} icon={Coffee} name={d.name} detail={`${d.goal} · ${d.meals.length || 4} comidas`} assigned={d.assigned.length} onMore={() => setActions(d.id)} />)}
        </div>
      </div>
      <div className="footer"><button className="btn primary" onClick={() => (isR ? setCreate(true) : nav('/entrenador/dietas/nueva'))}>{isR ? 'Crear rutina' : 'Crear dieta'}</button></div>

      <Sheet open={create} onClose={() => setCreate(false)}>
        <span className="h5">Crear rutina</span>
        <span className="s muted">Una rutina es una sesión de entrenamiento. Podrás asignarla, editarla o duplicarla cuando quieras.</span>
        {[{ id: null, icon: Plus, title: 'Desde cero', text: 'Arma la sesión paso a paso' }, ...t.routines.slice(0, 3).map((r) => ({ id: r.id, icon: Copy, title: `Plantilla: ${r.name}`, text: `${r.items.length} ejercicios · ${r.level}` }))].map((o) => (
          <button key={o.title} className="row gap-12" style={{ padding: 14, borderRadius: 16, background: 'var(--bg)', border: `1px solid ${template === o.id ? 'var(--accent-line)' : 'var(--border)'}`, textAlign: 'left' }} onClick={() => setTemplate(o.id)}>
            <div className="thumb" style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)' }}><o.icon size={20} color="var(--accent-text)" /></div>
            <div className="grow stack gap-2"><span className="m bold">{o.title}</span><span className="xs muted">{o.text}</span></div>
            <span className={'radio' + (template === o.id ? ' on' : '')} />
          </button>
        ))}
        <button className="btn primary lg block" onClick={() => nav('/entrenador/rutinas/nueva' + (template ? `?plantilla=${template}` : ''))}>Continuar</button>
      </Sheet>

      <Sheet open={!!actions} onClose={() => setActions(null)}>
        {(selected || selectedDiet) && (
          <>
            <div className="stack gap-2"><span className="h6">{selected?.name ?? selectedDiet?.name}</span><span className="xs muted">{selected ? `Asignada a ${selected.assigned.length} clientes · usada ${selected.uses} veces` : `Asignada a ${selectedDiet?.assigned.length} clientes`}</span></div>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <button className="list-row" onClick={() => nav(`/entrenador/asignar/${selected ? 'rutina' : 'dieta'}/${actions}`)}><Users size={20} /><span className="m med grow">Asignar</span><span className="s muted">Clientes y fechas</span><Chevron /></button>
              {selected && <button className="list-row" onClick={() => nav(`/entrenador/rutinas/${selected.id}/editar`)}><Edit3 size={20} /><span className="m med grow">Editar</span><span className="s muted">{selected.assigned.length ? `Afecta a ${selected.assigned.length} clientes` : 'Sin clientes'}</span><Chevron /></button>}
              {selected && <button className="list-row" onClick={() => { const c = t.duplicateRoutine(selected.id); setActions(null); if (c) toast.show(`Creada “${c.name}”. Edítala para personalizarla.`) }}><Copy size={20} /><span className="m med grow">Duplicar</span><span className="s muted">Para personalizar</span><Chevron /></button>}
              {selected && <button className="list-row" onClick={() => { setConfirmDelete(selected.id); setActions(null) }}><Trash2 size={20} color="var(--err-300)" /><span className="m med grow err">Eliminar</span><Chevron /></button>}
            </div>
          </>
        )}
      </Sheet>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <span className="h6 center">¿Eliminar esta rutina?</span>
        <span className="s muted center">Tus clientes dejarán de verla en sus próximas sesiones. Esto no se puede deshacer.</span>
        <button className="btn primary block" onClick={() => { if (confirmDelete) t.deleteRoutine(confirmDelete); setConfirmDelete(null); toast.show('Rutina eliminada') }}>Eliminar</button>
        <button className="btn ghost block" onClick={() => setConfirmDelete(null)}>Cancelar</button>
      </Dialog>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}
