import { Outlet, Route, Routes } from 'react-router-dom'
import { Calendar, ClipboardList, Home as HomeIcon, User, Users } from 'lucide-react'
import { BottomNav } from '../ui'
import { TrainerProvider } from './store'
import { CupoOnOpen } from './shared'
import Home from './Home'
import { ClientDetail, Clients } from './Clients'
import { CalendarPage, PendingSessions } from './Calendar'
import { Library } from './Library'
import RoutineWizard from './RoutineWizard'
import DietWizard from './DietWizard'
import Assign from './Assign'
import { Payments, PlanUnlimited, Profile, Services } from './Profile'
import { Chat, Messages, Notifications } from './Inbox'

const NAV = [
  { to: '/entrenador', label: 'Inicio', icon: HomeIcon, end: true },
  { to: '/entrenador/clientes', label: 'Clientes', icon: Users },
  { to: '/entrenador/calendario', label: 'Calendario', icon: Calendar },
  { to: '/entrenador/rutinas', label: 'Rutinas', icon: ClipboardList },
  { to: '/entrenador/perfil', label: 'Perfil', icon: User },
]

function Tabs() {
  return (
    <>
      <Outlet />
      <BottomNav items={NAV} />
    </>
  )
}

export default function TrainerRoutes() {
  return (
    <TrainerProvider>
      <div data-role="entrenador" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Routes>
          <Route element={<Tabs />}>
            <Route index element={<Home />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="rutinas" element={<Library />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
          <Route path="clientes/:id" element={<ClientDetail />} />
          <Route path="calendario/por-confirmar" element={<PendingSessions />} />
          <Route path="rutinas/nueva" element={<RoutineWizard />} />
          <Route path="rutinas/:id/editar" element={<RoutineWizard />} />
          <Route path="dietas/nueva" element={<DietWizard />} />
          <Route path="asignar/:kind/:id" element={<Assign />} />
          <Route path="perfil/servicios" element={<Services />} />
          <Route path="perfil/plan" element={<Payments />} />
          <Route path="plan-ilimitado" element={<PlanUnlimited />} />
          <Route path="notificaciones" element={<Notifications />} />
          <Route path="mensajes" element={<Messages />} />
          <Route path="mensajes/:id" element={<Chat />} />
        </Routes>
        <CupoOnOpen />
      </div>
    </TrainerProvider>
  )
}
