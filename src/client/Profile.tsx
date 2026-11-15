import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, Camera, Check, ChevronDown, CreditCard, Download, FileText, Globe, HelpCircle, Image, Info, Lock, LogOut, Mail, MessageCircle, Repeat, Shield, Star, Trash2, User, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Avatar, Chevron, Dialog, Progress, SectionTitle, Sheet, Tag, Toggle, TopBar, Toast, useToast } from '../ui'
import { useClient } from './store'
import { COACHES } from './data'

function Row({ icon: Icon, label, sub, value, onClick, danger }: { icon: LucideIcon; label: string; sub?: string; value?: string; onClick?: () => void; danger?: boolean }) {
  return (
    <button className="list-row" onClick={onClick}>
      <Icon size={20} color={danger ? 'var(--err-300)' : undefined} style={{ flex: 'none' }} />
      <div className="grow stack gap-2"><span className={'m med' + (danger ? ' err' : '')}>{label}</span>{sub && <span className="xs muted">{sub}</span>}</div>
      {value && <span className="s muted">{value}</span>}
      <Chevron />
    </button>
  )
}

function CoachCard({ onClick }: { onClick?: () => void }) {
  const p = COACHES[0]
  return (
    <button className="card pad stack gap-12" style={{ textAlign: 'left', borderColor: 'var(--accent-line)', borderRadius: 20 }} onClick={onClick}>
      <div className="row gap-12">
        <img src={p.photo} alt="" style={{ width: 48, height: 48, borderRadius: 24, objectFit: 'cover' }} />
        <div className="grow stack gap-2"><span className="m bold">{p.name}</span><span className="xs muted">Musculación · {p.years} años de experiencia</span></div>
        <Chevron />
      </div>
      <div className="row between s"><span>Plan mensual · Rutina + dieta</span><span className="bold accent">$45/mes</span></div>
      <Progress value={18 / 30} />
      <div className="row between xs muted"><span>Día 18 de 30</span><span>Se renueva el 13 de agosto</span></div>
    </button>
  )
}

export function Profile() {
  const nav = useNavigate()
  const toast = useToast()
  const [logout, setLogout] = useState(false)
  const [photo, setPhoto] = useState(false)
  return (
    <>
      <div className="screen-body">
        <div className="stack" style={{ paddingTop: 8 }}><span className="s muted">Tu cuenta</span><span className="h5">Mi perfil</span></div>
        <div className="row gap-16">
          <button aria-label="Cambiar foto de perfil" onClick={() => setPhoto(true)} style={{ position: 'relative' }}><Avatar initials="DA" size="l" /><span className="circle-icon" style={{ position: 'absolute', right: -2, bottom: -2, width: 26, height: 26, background: 'var(--accent)' }}><Camera size={14} color="var(--on-accent)" /></span></button>
          <div className="stack gap-4"><span className="h6">Daniel Acosta</span><span className="xs muted">Miembro desde julio 2026 · Caracas</span></div>
        </div>
        <SectionTitle title="Mi entrenador" />
        <CoachCard onClick={() => nav('/cliente/perfil/entrenador')} />
        <div className="card">
          <Row icon={User} label="Mi información" sub="Objetivo, horarios, alimentación y lesiones" onClick={() => nav('/cliente/perfil/informacion')} />
          <Row icon={Wallet} label="Pagos y suscripción" sub="Visa •••• 4821 · último pago 13 jul" onClick={() => nav('/cliente/perfil/pagos')} />
          <Row icon={Shield} label="Cuenta" sub="Notificaciones, privacidad, idioma y ayuda" onClick={() => nav('/cliente/perfil/configuracion')} />
          <Row icon={Repeat} label="Cambiar de rol" value="Entrenador" onClick={() => nav('/')} />
          <Row icon={LogOut} label="Cerrar sesión" danger onClick={() => setLogout(true)} />
        </div>
        <span className="xs muted center">Repe v1.0</span>
      </div>
      <Dialog open={logout} onClose={() => setLogout(false)}>
        <span className="h6 center">¿Seguro que deseas cerrar tu sesión?</span>
        <span className="s muted center">Tendrás que volver a iniciar sesión para ver tu rutina y hablar con tu entrenador.</span>
        <button className="btn primary block" onClick={() => nav('/')}>Cerrar sesión</button>
        <button className="btn ghost block" onClick={() => setLogout(false)}>Cancelar</button>
      </Dialog>
      <Sheet open={photo} onClose={() => setPhoto(false)}>
        <div style={{ alignSelf: 'center' }}><Avatar initials="DA" size="l" /></div>
        <span className="h6 center">Foto de perfil</span>
        <span className="s muted center">Tu entrenador la verá en el chat y en tus reportes.</span>
        <div className="card" style={{ background: 'var(--bg)' }}>
          <label className="list-row" style={{ cursor: 'pointer' }}><Camera size={20} /><span className="m med grow">Tomar foto</span><input type="file" accept="image/*" capture="user" hidden onChange={() => { setPhoto(false); toast.show('Foto actualizada') }} /></label>
          <label className="list-row" style={{ cursor: 'pointer' }}><Image size={20} /><span className="m med grow">Elegir de la galería</span><input type="file" accept="image/*" hidden onChange={() => { setPhoto(false); toast.show('Foto actualizada') }} /></label>
          <button className="list-row" onClick={() => { setPhoto(false); toast.show('Foto eliminada') }}><Trash2 size={20} color="var(--err-300)" /><span className="m med grow err">Eliminar foto actual</span></button>
        </div>
        <button className="btn ghost block" onClick={() => setPhoto(false)}>Cancelar</button>
      </Sheet>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function MyCoach() {
  const nav = useNavigate()
  const toast = useToast()
  const [cancel, setCancel] = useState(false)
  return (
    <>
      <TopBar title="Mi entrenador" />
      <div className="screen-body">
        <div className="stack gap-8" style={{ alignItems: 'center', textAlign: 'center' }}>
          <img src={COACHES[0].photo} alt="" style={{ width: 88, height: 88, borderRadius: 44, objectFit: 'cover', border: '2px solid var(--accent-line)' }} />
          <span className="h5">Pedro Ramírez</span>
          <span className="s muted">Musculación e hipertrofia</span>
          <span className="row gap-4 xs"><Star size={14} color="var(--warn-500)" fill="var(--warn-500)" />4.6 · Entrenan juntos desde jul 2026</span>
        </div>
        <div className="row gap-8"><button className="btn primary grow" onClick={() => nav('/cliente/chat/pedro')}><MessageCircle size={18} />Enviar mensaje</button><button className="btn tertiary grow" onClick={() => nav('/cliente/agenda')}><Calendar size={18} />Agendar cita</button></div>
        <SectionTitle title="Tu plan" />
        <div className="card pad stack gap-10">
          <div className="row between s"><span className="bold">Plan mensual · Rutina + dieta</span><span className="bold accent">$45/mes</span></div>
          <Progress value={0.6} />
          <div className="row between xs muted"><span>Día 18 de 30</span><span>Se renueva el 13 de agosto</span></div>
          {['Rutina actualizada cada 4 semanas', 'Plan de alimentación', 'Revisión semanal y chat directo', '1 videollamada al mes (te queda 1)'].map((x) => <span key={x} className="row gap-8 s"><Check size={16} color="var(--accent-icon)" />{x}</span>)}
        </div>
        <SectionTitle title="Próxima cita" />
        <div className="card row gap-12" style={{ padding: 16 }}><Calendar size={20} color="var(--accent-icon)" /><div className="grow stack gap-2"><span className="s bold">Reunión de seguimiento</span><span className="xs muted">Vie 3 de julio · 18:00 · 30 min</span></div><button className="link" onClick={() => nav('/cliente/agenda')}>Gestionar</button></div>
        <div className="card">
          <Row icon={User} label="Ver perfil público" onClick={() => nav('/cliente/entrenador/pedro')} />
          <Row icon={Repeat} label="Cambiar de plan" value="Mensual → Trimestral" onClick={() => toast.show('Pedro recibirá tu solicitud de cambio')} />
          <Row icon={Star} label="Calificar a Pedro" onClick={() => toast.show('¡Gracias por tu calificación!')} />
          <Row icon={Info} label="Reportar un problema" onClick={() => toast.show('Soporte te contactará en menos de 24 h')} />
          <Row icon={LogOut} label="Cancelar suscripción" danger onClick={() => setCancel(true)} />
        </div>
        <span className="xs muted center">Si cancelas, mantienes el acceso hasta el 13 de agosto.</span>
      </div>
      <Dialog open={cancel} onClose={() => setCancel(false)}>
        <span className="h6 center">¿Cancelar tu suscripción con Pedro?</span>
        <span className="s muted center">Mantienes el acceso hasta el 13 de agosto y no se te volverá a cobrar.</span>
        <button className="btn primary block" onClick={() => { setCancel(false); toast.show('Suscripción cancelada. Acceso hasta el 13 de agosto.') }}>Sí, cancelar</button>
        <button className="btn ghost block" onClick={() => setCancel(false)}>Mantener mi plan</button>
      </Dialog>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

const INFO: [string, LucideIcon, [string, string][]][] = [
  ['Objetivo', Star, [['Meta principal', 'Ganar masa muscular'], ['Peso objetivo', '82 kg en 6 meses'], ['Nivel', 'Principiante']]],
  ['Datos físicos', User, [['Peso', '78.4 kg'], ['Altura', '1.78 m'], ['Edad', '20 años'], ['Grasa corporal', '18.2%']]],
  ['Horarios y disponibilidad', Calendar, [['Días', 'Lunes a viernes'], ['Hora', '4:00 a 5:30 pm'], ['Lugar', 'Gimnasio']]],
  ['Alimentación', FileText, [['Restricciones', 'Ninguna'], ['Comidas al día', '3 + 2 meriendas'], ['Alergias', 'Ninguna'], ['Agua', '4 L al día']]],
  ['Estilo de vida', Globe, [['Trabajo', 'Oficina, sentado'], ['Sueño', '7 horas'], ['Actividad extra', 'Camina 30 min']]],
  ['Lesiones y condiciones', Shield, [['Lesiones', 'Molestia lumbar leve'], ['Medicamentos', 'Ninguno'], ['Notas', 'Evitar peso muerto pesado por ahora']]],
]

export function MyInfo() {
  const c = useClient()
  const [open, setOpen] = useState('Objetivo')
  return (
    <>
      <TopBar title="Mi información" />
      <div className="screen-body">
        <div className="notice"><Info size={20} color="var(--accent-text)" style={{ flex: 'none' }} /><span className="xs">Pedro ve estos datos para adaptar tu plan. Actualízalos cuando cambien.</span></div>
        {INFO.map(([title, Icon, rows]) => (
          <div key={title} className="card">
            <button className="list-row" onClick={() => setOpen(open === title ? '' : title)} aria-expanded={open === title}>
              <Icon size={20} color="var(--accent-icon)" /><span className="m bold grow">{title}</span><ChevronDown size={20} style={{ transform: open === title ? 'rotate(180deg)' : undefined }} />
            </button>
            {open === title && rows.map(([k, v]) => <div key={k} className="list-row" style={{ paddingTop: 10, paddingBottom: 10 }}><span className="s muted grow">{k}</span><span className="s med">{k === 'Peso' ? `${c.weight} kg` : v}</span></div>)}
          </div>
        ))}
        <span className="xs muted center">Última actualización: 13 de julio de 2026</span>
      </div>
    </>
  )
}

export function Payments() {
  const toast = useToast()
  return (
    <>
      <TopBar title="Pagos y suscripción" />
      <div className="screen-body">
        <div className="card pad stack gap-6" style={{ borderColor: 'var(--accent-line)' }}>
          <span className="xs bold accent">SUSCRIPCIÓN ACTIVA</span>
          <span className="h6">Mensualidad de musculación</span>
          <span className="s muted">Con Pedro Ramírez · $47.25 al mes</span>
          <span className="xs muted">Próximo cobro: 13 de agosto de 2026</span>
        </div>
        <SectionTitle title="Método de pago actual" link="Cambiar" onLink={() => toast.show('Próximamente')} />
        <div className="card row gap-12" style={{ padding: 16 }}><CreditCard size={20} color="var(--accent-icon)" /><div className="grow stack gap-2"><span className="m med">Visa •••• 4821</span><span className="xs muted">Daniel Acosta · vence 08/28</span></div><span className="chip accent">Principal</span></div>
        <SectionTitle title="Historial de pagos" />
        <div className="card">
          {[['Mensualidad de musculación', 'Pedro Ramírez · 13 ago 2026', '$47.25', 'Programado'], ['Sesión extra por videollamada', 'Pedro Ramírez · 20 jul 2026 · Visa •••• 4821', '$15.00', 'Pagado'], ['Mensualidad de musculación', 'Pedro Ramírez · 13 jul 2026 · Visa •••• 4821', '$47.25', 'Pagado']].map(([t, d, a, s], i) => (
            <div key={i} className="list-row"><div className="grow stack gap-2"><span className="s bold">{t}</span><span className="xs muted">{d}</span></div><div className="stack gap-2" style={{ alignItems: 'flex-end' }}><span className="s bold">{a}</span><span className={'chip ' + (s === 'Pagado' ? 'ok' : 'neutral')}>{s}</span></div></div>
          ))}
        </div>
        <button className="btn tertiary block" onClick={() => toast.show('Recibos enviados a tu correo')}><Download size={18} />Descargar recibos</button>
      </div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function Settings() {
  const nav = useNavigate()
  return (
    <>
      <TopBar title="Configuración" />
      <div className="screen-body">
        <div className="card">
          <Row icon={Bell} label="Notificaciones" sub="Recordatorios, reuniones y hábitos" onClick={() => nav('notificaciones')} />
          <Row icon={Lock} label="Privacidad y seguridad" sub="Contraseña, fotos de progreso, datos" onClick={() => nav('privacidad')} />
          <Row icon={Globe} label="Idioma y unidades" sub="Español · kg · cm" onClick={() => nav('idioma')} />
          <Row icon={HelpCircle} label="Ayuda y soporte" sub="Preguntas frecuentes y contacto" onClick={() => nav('ayuda')} />
          <Row icon={FileText} label="Términos y política de privacidad" />
        </div>
        <span className="xs muted center">Repe v1.0</span>
      </div>
    </>
  )
}

function ToggleRow({ k, label, sub }: { k: string; label: string; sub?: string }) {
  const c = useClient()
  return <div className="list-row"><div className="grow stack gap-2"><span className="m med">{label}</span>{sub && <span className="xs muted">{sub}</span>}</div><Toggle label={label} on={c.settings[k]} onChange={() => c.toggleSetting(k)} /></div>
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return <><SectionTitle title={title} /><div className="card">{children}</div></>
}

export function NotifSettings() {
  return (
    <>
      <TopBar title="Notificaciones" />
      <div className="screen-body">
        <Group title="Entrenamiento"><ToggleRow k="entreno" label="Recordatorio de entreno" sub="Todos los días de entreno a las 4:15 pm" /><ToggleRow k="reuniones" label="Reuniones con el entrenador" sub="1 hora antes de cada cita" /><ToggleRow k="mensajes" label="Mensajes del entrenador" /></Group>
        <Group title="Hábitos"><ToggleRow k="agua" label="Tomar agua" sub="Cada 2 horas, meta de 4 L" /><ToggleRow k="dormir" label="Hora de dormir" sub="10:30 pm" /><ToggleRow k="foto" label="Foto de progreso semanal" sub="Domingos a las 9:00 am" /></Group>
        <Group title="Cuenta"><ToggleRow k="pagos" label="Pagos y renovaciones" sub="Aviso 3 días antes de cada cobro" /><ToggleRow k="promos" label="Novedades y promociones" /></Group>
        <Group title="Recibir por"><ToggleRow k="push" label="Notificaciones push" /><ToggleRow k="correo" label="Correo electrónico" sub="daniel.a••••@gmail.com" /></Group>
      </div>
    </>
  )
}

export function Privacy() {
  const toast = useToast()
  return (
    <>
      <TopBar title="Privacidad y seguridad" />
      <div className="screen-body">
        <Group title="Seguridad">
          <Row icon={Lock} label="Cambiar contraseña" sub="Último cambio hace 2 meses" onClick={() => toast.show('Te enviamos un enlace a tu correo')} />
          <Row icon={Shield} label="Dispositivos con sesión iniciada" value="2" />
          <ToggleRow k="dosPasos" label="Verificación en dos pasos" sub="Código por SMS al iniciar sesión" />
        </Group>
        <Group title="Privacidad">
          <Row icon={Image} label="Quién ve mis fotos de progreso" value="Solo mi entrenador" />
          <ToggleRow k="compartir" label="Compartir mis datos con mi entrenador" sub="Peso, medidas, hábitos y entrenos" />
          <ToggleRow k="testimonios" label="Aparecer en testimonios" sub="Pedro puede mostrar tus resultados con tu permiso" />
        </Group>
        <Group title="Tus datos">
          <Row icon={Download} label="Descargar mis datos" onClick={() => toast.show('Prepararemos tu archivo y te lo enviaremos por correo')} />
          <Row icon={Trash2} label="Eliminar mi cuenta" danger onClick={() => toast.show('Para eliminar tu cuenta, contacta a soporte')} />
        </Group>
      </div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function Language() {
  const c = useClient()
  const [lang, setLang] = useState('es')
  const [cm, setCm] = useState(true)
  const opt = (on: boolean, label: string, sub: string | undefined, onClick: () => void) => (
    <button className="list-row" onClick={onClick}><div className="grow stack gap-2"><span className="m med">{label}</span>{sub && <span className="xs muted">{sub}</span>}</div><span className={'radio' + (on ? ' on' : '')} /></button>
  )
  return (
    <>
      <TopBar title="Idioma y unidades" />
      <div className="screen-body">
        <Group title="Idioma">{opt(lang === 'es', 'Español', 'Latinoamérica', () => setLang('es'))}{opt(lang === 'en', 'English', undefined, () => setLang('en'))}{opt(lang === 'pt', 'Português', 'Brasil', () => setLang('pt'))}</Group>
        <Group title="Peso">{opt(c.unit === 'kg', 'Kilogramos (kg)', undefined, () => c.setUnit('kg'))}{opt(c.unit === 'lb', 'Libras (lb)', undefined, () => c.setUnit('lb'))}</Group>
        <Group title="Medidas">{opt(cm, 'Centímetros (cm)', undefined, () => setCm(true))}{opt(!cm, 'Pulgadas (in)', undefined, () => setCm(false))}</Group>
        {lang !== 'es' && <span className="xs muted center">El prototipo solo está disponible en español.</span>}
      </div>
    </>
  )
}

export function Help() {
  const [faq, setFaq] = useState<string | null>(null)
  const toast = useToast()
  const FAQ: [string, string][] = [
    ['¿Cómo cambio de entrenador?', 'Busca uno nuevo en el Marketplace y envíale una solicitud. Tu plan actual sigue activo hasta que termine.'],
    ['¿Cómo cancelo o pauso mi plan?', 'En Perfil → Mi entrenador → Cancelar suscripción. Mantienes el acceso hasta la fecha de renovación.'],
    ['¿Qué pasa si no recibo mi plan?', 'Si no llega en 72 h, Repe te devuelve el dinero automáticamente.'],
    ['¿Cómo registro mis pesos y repeticiones?', 'Durante el entreno, en cada serie anota las repeticiones hechas y marca el check.'],
  ]
  return (
    <>
      <TopBar title="Ayuda y soporte" />
      <div className="screen-body">
        <span className="h6">¿En qué te podemos ayudar?</span>
        <Group title="Preguntas frecuentes">
          {FAQ.map(([q, a]) => (
            <div key={q}>
              <button className="list-row" onClick={() => setFaq(faq === q ? null : q)} aria-expanded={faq === q}><span className="s med grow">{q}</span><ChevronDown size={18} style={{ transform: faq === q ? 'rotate(180deg)' : undefined }} /></button>
              {faq === q && <p className="s muted" style={{ padding: '0 16px 14px' }}>{a}</p>}
            </div>
          ))}
        </Group>
        <Group title="Contáctanos">
          <Row icon={MessageCircle} label="Chatear con soporte" sub="Lun a sáb · 8:00 am a 8:00 pm" onClick={() => toast.show('Soporte en vivo: próximamente')} />
          <Row icon={Mail} label="Escribir un correo" sub="soporte@repe.app" onClick={() => { location.href = 'mailto:soporte@repe.app' }} />
          <Row icon={Info} label="Reportar un problema" sub="Con capturas de pantalla" onClick={() => toast.show('Gracias, revisaremos tu reporte')} />
        </Group>
      </div>
      <Toast message={toast.msg} onDone={toast.clear} />
    </>
  )
}

export function ClientNotifications() {
  const c = useClient()
  const [cat, setCat] = useState('Todas')
  const list = c.notifications.filter((n) => cat === 'Todas' || n.cat === cat)
  return (
    <>
      <TopBar title="Notificaciones" action={<button className="link" style={{ width: 'auto' }} onClick={c.markAllRead}>Marcar leídas</button>} />
      <div className="screen-body tight">
        <div className="chips" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>{['Todas', 'Entrenos', 'Citas', 'Hábitos', 'Pagos'].map((x) => <Tag key={x} label={x} on={cat === x} onClick={() => setCat(x)} />)}</div>
        {['Hoy', 'Ayer'].map((g) => {
          const items = list.filter((n) => n.group === g)
          if (!items.length) return null
          return (
            <div key={g} className="stack gap-12">
              <span className="s bold faint">{g}</span>
              {items.map((n) => (
                <div key={n.id} className="card row gap-12" style={{ padding: '14px 16px', alignItems: 'flex-start' }}>
                  <span className="circle-icon" style={{ width: 40, height: 40, background: 'var(--accent-soft)' }}><Bell size={18} color="var(--accent-icon)" /></span>
                  <div className="grow stack gap-2"><span className="s bold">{n.title}</span><span className="xs muted">{n.text}</span><span className="xs faint">{n.time}</span></div>
                  {n.unread && <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)', flex: 'none', marginTop: 6 }} />}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </>
  )
}
