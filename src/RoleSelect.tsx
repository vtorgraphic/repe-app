import { useNavigate } from 'react-router-dom'
import { ChevronRight, Dumbbell, Users } from 'lucide-react'

export default function RoleSelect() {
  const nav = useNavigate()
  const options = [
    { role: 'cliente', icon: Dumbbell, title: 'Soy cliente', text: 'Sigue tu rutina, tu dieta y tu progreso con tu entrenador.', ready: false },
    { role: 'entrenador', icon: Users, title: 'Soy entrenador', text: 'Gestiona clientes, rutinas, dietas y tu agenda en un solo lugar.', ready: true },
  ]
  return (
    <div className="screen-body" style={{ justifyContent: 'center', gap: 32, padding: '24px' }}>
      <div className="stack gap-8">
        <span className="h3" style={{ color: 'var(--p-400)' }}>Repe</span>
        <span className="h5">¿Cómo vas a usar la app?</span>
        <span className="s muted">Este es un prototipo con datos de ejemplo. Puedes cambiar de rol cuando quieras desde el perfil.</span>
      </div>
      <div className="stack gap-12">
        {options.map(({ role, icon: Icon, title, text, ready }) => (
          <button
            key={role}
            data-role={role}
            className="card pad row gap-16"
            style={{ textAlign: 'left', borderColor: ready ? 'var(--accent-line)' : undefined, opacity: ready ? 1 : 0.6 }}
            onClick={() => ready && nav(`/${role}`)}
            disabled={!ready}
          >
            <div className="circle-icon" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent-strong)' }}><Icon size={24} color="var(--accent-icon)" /></div>
            <div className="grow stack gap-4">
              <span className="m bold">{title}</span>
              <span className="xs muted">{text}</span>
              {!ready && <span className="xs bold accent">Muy pronto</span>}
            </div>
            {ready && <ChevronRight size={20} color="var(--accent-icon)" />}
          </button>
        ))}
      </div>
    </div>
  )
}
