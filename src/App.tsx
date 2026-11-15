import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { StatusBar } from './ui'
import RoleSelect from './RoleSelect'
import TrainerRoutes from './trainer/TrainerRoutes'

function Phone() {
  return (
    <div className="stage">
      <div className="phone">
        <StatusBar />
        <Outlet />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Phone />}>
          <Route index element={<RoleSelect />} />
          <Route path="entrenador/*" element={<TrainerRoutes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
