import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, Check, Clock, Flame, MessageCircle, PartyPopper } from 'lucide-react'
import { IconButton, SectionTitle } from '../ui'
import { useClient } from './store'
import { COACHES, HABITS, WORKOUT, money } from './data'

export default function Home() {
  const c = useClient()
  const nav = useNavigate()
  const totalSets = WORKOUT.exercises.reduce((a, e) => a + e.sets.length, 0)
  const unread = c.notifications.filter((n) => n.unread).length
  const next = c.events.filter((e) => e.day >= 3).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))[0]
  return (
    <div className="screen-body">
      <div className="row between" style={{ paddingTop: 8 }}>
        <div className="stack">
          <span className="s muted">Lunes, 13 de julio</span>
          <span className="h5">Hola, Daniel</span>
        </div>
        <div className="row gap-8">
          <IconButton icon={MessageCircle} label="Chat con Pedro" badge={1} accent onClick={() => nav('/cliente/chat/pedro')} />
          <IconButton icon={Bell} label="Notificaciones" badge={unread} accent onClick={() => nav('/cliente/notificaciones')} />
        </div>
      </div>

      {c.trainedToday ? (
        <div className="card pad stack gap-12" style={{ borderColor: 'var(--accent-line)', borderRadius: 20 }}>
          <span className="row gap-8 s bold accent"><PartyPopper size={20} />Entrenamiento de hoy completado</span>
          <span className="s muted">Pedro ya puede ver tu registro. Mañana te toca Pull (espalda y bíceps).</span>
          <button className="btn tertiary block" onClick={() => nav('/cliente/entreno/resumen')}>Ver resumen</button>
        </div>
      ) : (
        <div className="card pad stack gap-16" style={{ borderColor: 'var(--accent-line)', borderRadius: 20 }}>
          <div className="stack gap-4">
            <span className="chip accent" style={{ alignSelf: 'flex-start' }}>{WORKOUT.day}</span>
            <span className="h5">{WORKOUT.title}</span>
            <span className="s muted">{WORKOUT.exercises.length} ejercicios · {totalSets} series · ~75 min</span>
          </div>
          <button className="btn primary block" onClick={() => nav('/cliente/entreno')}>Empezar entrenamiento</button>
        </div>
      )}

      <div className="row gap-12">
        <div className="card stack" style={{ padding: '8px 16px', flex: 1 }}>
          <span className="row gap-6 h6"><Flame size={20} color="var(--accent-icon)" />{c.streak}</span>
          <span className="xs muted">Días de racha</span>
        </div>
        {next && (
          <button className="card stack" style={{ padding: '8px 16px', flex: 1.4, textAlign: 'left' }} onClick={() => nav('/cliente/agenda')}>
            <span className="row gap-6 s bold truncate">{next.kind === 'reunion' ? <Clock size={16} color="var(--accent-icon)" /> : <Calendar size={16} color="var(--accent-icon)" />}{next.kind === 'reunion' ? 'Reunión' : next.title.split(' (')[0]}</span>
            <span className="xs muted truncate">Vie {next.day} · {next.time}</span>
          </button>
        )}
      </div>

      {c.requests.map((r) => {
        const coach = COACHES.find((x) => x.id === r.coachId)!
        return (
          <button key={r.coachId} className="card pad row gap-12" style={{ textAlign: 'left', borderColor: 'var(--warn-700)' }} onClick={() => nav(`/cliente/contratar/${r.coachId}/enviada`)}>
            <img src={coach.photo} alt="" style={{ width: 44, height: 44, borderRadius: 22, objectFit: 'cover' }} />
            <div className="grow stack gap-2">
              <span className="s bold">Solicitud enviada a {coach.name}</span>
              <span className="xs muted">Esperando confirmación · vence en 3 días · aún no se te cobra ({money(r.total)})</span>
            </div>
          </button>
        )
      })}

      <SectionTitle title="Hábitos de hoy" />
      <div className="stack gap-8">
        {HABITS.map((h) => {
          const on = c.habits.includes(h.id)
          return (
            <button key={h.id} className="card row gap-12" style={{ padding: '12px 16px', textAlign: 'left' }} onClick={() => c.toggleHabit(h.id)} aria-pressed={on}>
              <span className={'check' + (on ? ' on pop' : '')}>{on && <Check size={16} />}</span>
              <div className="grow stack gap-2">
                <span className="m med" style={{ textDecoration: on ? 'line-through' : undefined, opacity: on ? 0.7 : 1 }}>{h.title}</span>
                <span className="s muted">{h.sub}</span>
              </div>
            </button>
          )
        })}
      </div>
      <span className="xs muted center">{c.habits.length} de {HABITS.length} hábitos completados hoy</span>
    </div>
  )
}
