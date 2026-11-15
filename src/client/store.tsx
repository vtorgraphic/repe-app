import { createContext, useContext, useState, type ReactNode } from 'react'
import { CLIENT_NOTIFICATIONS, EVENTS, WORKOUT, type CalEvent } from './data'

export type HireRequest = { coachId: string; plan: 'mensual' | 'trimestral'; total: number; start: string; hoursLeft: number }

function useClientState() {
  const [habits, setHabits] = useState<string[]>(['agua'])
  const [done, setDone] = useState<string[][]>(() => WORKOUT.exercises.map((e) => e.sets.map(() => '')))
  const [notes, setNotes] = useState<string[]>(() => WORKOUT.exercises.map(() => ''))
  const [comment, setComment] = useState('')
  const [streak, setStreak] = useState(16)
  const [trainedToday, setTrainedToday] = useState(false)
  const [events, setEvents] = useState<CalEvent[]>(EVENTS)
  const [requests, setRequests] = useState<HireRequest[]>([])
  const [notifications, setNotifications] = useState(CLIENT_NOTIFICATIONS)
  const [weight, setWeight] = useState(78.4)
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg')
  const [settings, setSettings] = useState<Record<string, boolean>>({ entreno: true, reuniones: true, mensajes: true, agua: true, dormir: false, foto: true, pagos: true, promos: false, push: true, correo: true, dosPasos: false, compartir: true, testimonios: false })

  return {
    habits, done, notes, comment, streak, trainedToday, events, requests, notifications, weight, unit, settings,
    toggleHabit: (id: string) => setHabits((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id])),
    setDoneValue: (ex: number, set: number, v: string) => setDone((d) => d.map((row, i) => (i === ex ? row.map((x, j) => (j === set ? v : x)) : row))),
    setNote: (ex: number, v: string) => setNotes((n) => n.map((x, i) => (i === ex ? v : x))),
    setComment,
    finishWorkout() {
      if (!trainedToday) setStreak((s) => s + 1)
      setTrainedToday(true)
    },
    resetWorkout() {
      setDone(WORKOUT.exercises.map((e) => e.sets.map(() => '')))
      setNotes(WORKOUT.exercises.map(() => ''))
      setComment('')
    },
    addEvent: (e: CalEvent) => setEvents((es) => [...es, e]),
    moveEvent: (id: string, day: number, time: string) => setEvents((es) => es.map((e) => (e.id === id ? { ...e, day, time } : e))),
    sendRequest: (r: HireRequest) => setRequests((rs) => [...rs.filter((x) => x.coachId !== r.coachId), r]),
    markAllRead: () => setNotifications((ns) => ns.map((n) => ({ ...n, unread: false }))),
    logWeight: setWeight,
    setUnit,
    toggleSetting: (k: string) => setSettings((s) => ({ ...s, [k]: !s[k] })),
  }
}

type ClientStore = ReturnType<typeof useClientState>
const Ctx = createContext<ClientStore | null>(null)

export function ClientProvider({ children }: { children: ReactNode }) {
  const store = useClientState()
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useClient() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useClient fuera de ClientProvider')
  return s
}
