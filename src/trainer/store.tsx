import { createContext, useContext, useState, type ReactNode } from 'react'
import { CLIENTS, CONVERSATIONS, DIETS, EXERCISES, FOODS, LIMIT, NOTIFICATIONS, REQUESTS, ROUTINES, SERVICES, SESSIONS, type Client, type Diet, type Exercise, type Food, type Routine } from './data'

const ACTIVE: Client['status'][] = ['activo', 'inactivo', 'por vencer']
let seq = 100
export const newId = (p: string) => `${p}${++seq}`

function useTrainerState() {
  const [clients, setClients] = useState(CLIENTS)
  const [requests, setRequests] = useState(REQUESTS)
  const [plan, setPlan] = useState<'gratis' | 'ilimitado'>('gratis')
  const [routines, setRoutines] = useState(ROUTINES)
  const [diets, setDiets] = useState(DIETS)
  const [exercises, setExercises] = useState(EXERCISES)
  const [foods, setFoods] = useState(FOODS)
  const [services, setServices] = useState(SERVICES)
  const [sessions, setSessions] = useState(SESSIONS)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [conversations, setConversations] = useState(CONVERSATIONS)

  const activeCount = clients.filter((c) => ACTIVE.includes(c.status)).length
  const full = plan === 'gratis' && activeCount >= LIMIT
  const warn = plan === 'gratis' && activeCount >= 8

  return {
    clients, requests, plan, routines, diets, exercises, foods, services, sessions, notifications, conversations,
    activeCount, full, warn, limit: LIMIT,
    /** Devuelve false si no hay cupo (el cliente sigue en espera y no se le cobra). */
    acceptRequest(id: string) {
      if (full) return false
      const r = requests.find((x) => x.id === id)
      if (!r) return true
      setRequests((rs) => rs.filter((x) => x.id !== id))
      setClients((cs) => [{ ...CLIENTS[0], id: r.id, name: r.name, initials: r.initials, plan: r.service, price: r.price, start: '16 nov', end: '16 dic', daysLeft: 30, status: 'activo', today: 'Nuevo cliente · asigna su primer plan', condition: undefined, records: [], weight: 0, fat: 0, consistency: 0 }, ...cs])
      return true
    },
    rejectRequest: (id: string) => setRequests((rs) => rs.filter((x) => x.id !== id)),
    upgrade: () => setPlan('ilimitado'),
    archiveClient: (id: string) => setClients((cs) => cs.map((c) => (c.id === id ? { ...c, status: 'archivado' } : c))),
    saveRoutine: (r: Routine) => setRoutines((rs) => (rs.some((x) => x.id === r.id) ? rs.map((x) => (x.id === r.id ? r : x)) : [r, ...rs])),
    duplicateRoutine(id: string) {
      const r = routines.find((x) => x.id === id)
      if (!r) return null
      const copy = { ...r, id: newId('r'), name: `${r.name} (copia)`, assigned: [], uses: 0 }
      setRoutines((rs) => [copy, ...rs])
      return copy
    },
    deleteRoutine: (id: string) => setRoutines((rs) => rs.filter((x) => x.id !== id)),
    assignRoutine: (id: string, clientIds: string[]) => setRoutines((rs) => rs.map((x) => (x.id === id ? { ...x, assigned: [...new Set([...x.assigned, ...clientIds])], uses: x.uses + clientIds.length } : x))),
    saveDiet: (d: Diet) => setDiets((ds) => (ds.some((x) => x.id === d.id) ? ds.map((x) => (x.id === d.id ? d : x)) : [d, ...ds])),
    assignDiet: (id: string, clientIds: string[]) => setDiets((ds) => ds.map((x) => (x.id === id ? { ...x, assigned: [...new Set([...x.assigned, ...clientIds])] } : x))),
    addExercise: (e: Exercise) => setExercises((es) => [e, ...es]),
    addFood: (f: Food) => setFoods((fs) => [f, ...fs]),
    toggleService: (id: string) => setServices((ss) => ss.map((s) => (s.id === id ? { ...s, on: !s.on } : s))),
    addSession: (s: (typeof SESSIONS)[number]) => setSessions((ss) => [...ss, s].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))),
    confirmSession:(id: string) => setSessions((ss) => ss.map((s) => (s.id === id ? { ...s, confirmed: true } : s))),
    rejectSession: (id: string) => setSessions((ss) => ss.filter((s) => s.id !== id)),
    markAllRead: () => setNotifications((ns) => ns.map((n) => ({ ...n, unread: false }))),
    readConversation: (id: string) => setConversations((cs) => cs.map((c) => (c.id === id ? { ...c, unread: 0 } : c))),
    sendMessage: (id: string, text: string) => setConversations((cs) => cs.map((c) => (c.id === id ? { ...c, time: 'Ahora', messages: [...c.messages, { from: 'out' as const, text, time: 'Ahora' }] } : c))),
  }
}

type TrainerStore = ReturnType<typeof useTrainerState>
const Ctx = createContext<TrainerStore | null>(null)

export function TrainerProvider({ children }: { children: ReactNode }) {
  const store = useTrainerState()
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTrainer() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useTrainer fuera de TrainerProvider')
  return s
}
