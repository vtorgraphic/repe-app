import { Outlet, Route, Routes } from 'react-router-dom'
import { BarChart2, Calendar, Home as HomeIcon, Search, User } from 'lucide-react'
import { BottomNav } from '../ui'
import { ClientProvider } from './store'
import Home from './Home'
import { Done, ExerciseStep, Overview, Summary } from './Workout'
import { CoachDetail, Hire, Market, Pay, Sent } from './Market'
import ClientChat from './ClientChat'
import Agenda from './Agenda'
import { Achievements, Progress } from './Progress'
import { ClientNotifications, Help, Language, MyCoach, MyInfo, NotifSettings, Payments, Privacy, Profile, Settings } from './Profile'

const NAV = [
  { to: '/cliente', label: 'Inicio', icon: HomeIcon, end: true },
  { to: '/cliente/marketplace', label: 'Marketplace', icon: Search },
  { to: '/cliente/agenda', label: 'Agenda', icon: Calendar },
  { to: '/cliente/progreso', label: 'Progreso', icon: BarChart2 },
  { to: '/cliente/perfil', label: 'Perfil', icon: User },
]

function Tabs() {
  return (
    <>
      <Outlet />
      <BottomNav items={NAV} />
    </>
  )
}

export default function ClientRoutes() {
  return (
    <ClientProvider>
      <div data-role="cliente" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Routes>
          <Route element={<Tabs />}>
            <Route index element={<Home />} />
            <Route path="marketplace" element={<Market />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="progreso" element={<Progress />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
          <Route path="entreno" element={<Overview />} />
          <Route path="entreno/resumen" element={<Summary />} />
          <Route path="entreno/listo" element={<Done />} />
          <Route path="entreno/:n" element={<ExerciseStep />} />
          <Route path="entrenador/:id" element={<CoachDetail />} />
          <Route path="contratar/:id" element={<Hire />} />
          <Route path="contratar/:id/pago" element={<Pay />} />
          <Route path="contratar/:id/enviada" element={<Sent />} />
          <Route path="chat/:id" element={<ClientChat />} />
          <Route path="progreso/logros" element={<Achievements />} />
          <Route path="notificaciones" element={<ClientNotifications />} />
          <Route path="perfil/entrenador" element={<MyCoach />} />
          <Route path="perfil/informacion" element={<MyInfo />} />
          <Route path="perfil/pagos" element={<Payments />} />
          <Route path="perfil/configuracion" element={<Settings />} />
          <Route path="perfil/configuracion/notificaciones" element={<NotifSettings />} />
          <Route path="perfil/configuracion/privacidad" element={<Privacy />} />
          <Route path="perfil/configuracion/idioma" element={<Language />} />
          <Route path="perfil/configuracion/ayuda" element={<Help />} />
        </Routes>
      </div>
    </ClientProvider>
  )
}
