export type Coach = {
  id: string
  name: string
  photo: string
  specialty: string
  place: string
  years: number
  rating: number
  reviews: number
  price: number
  categories: string[]
  title: string
  city: string
  tags: string[]
  clients: string
  responds: string
}

export const COACHES: Coach[] = [
  { id: 'pedro', name: 'Pedro Ramírez', photo: '/img/pedro.jpg', specialty: 'Musculación', place: 'Online', years: 20, rating: 4.6, reviews: 56, price: 45, categories: ['Musculación', 'En casa'], title: 'Entrenador personal · Musculación e hipertrofia', city: 'Caracas · Online', tags: ['Musculación', 'Hipertrofia', 'Pérdida de grasa'], clients: '+120', responds: '~2 h' },
  { id: 'carlos', name: 'Carlos Torres', photo: '/img/carlos.jpg', specialty: 'Fuerza', place: 'Gimnasio', years: 12, rating: 4.9, reviews: 84, price: 55, categories: ['Musculación'], title: 'Entrenador de fuerza y powerlifting', city: 'Bogotá · Gimnasio', tags: ['Fuerza', 'Powerlifting'], clients: '+90', responds: '~1 h' },
  { id: 'amelia', name: 'Amelia Navas', photo: '/img/amelia.jpg', specialty: 'Cardio', place: 'Exterior', years: 8, rating: 4.8, reviews: 62, price: 45, categories: ['Running', 'Spinning'], title: 'Entrenadora de resistencia y cardio', city: 'Medellín · Exterior', tags: ['Cardio', 'Running', 'Pérdida de grasa'], clients: '+70', responds: '~3 h' },
  { id: 'javier', name: 'Javier Ruiz', photo: '/img/javier.jpg', specialty: 'Funcional', place: 'Gimnasio', years: 10, rating: 4.9, reviews: 97, price: 50, categories: ['Musculación', 'En casa'], title: 'Entrenador funcional', city: 'Lima · Gimnasio', tags: ['Funcional', 'Movilidad'], clients: '+150', responds: '~2 h' },
  { id: 'andres', name: 'Andrés Vega', photo: '/img/andres.jpg', specialty: 'Movilidad', place: 'Online', years: 6, rating: 4.7, reviews: 43, price: 35, categories: ['En casa'], title: 'Movilidad y prevención de lesiones', city: 'Quito · Online', tags: ['Movilidad', 'Rehabilitación'], clients: '+40', responds: '~4 h' },
  { id: 'miguel', name: 'Miguel Castro', photo: '/img/miguel.jpg', specialty: 'CrossFit', place: 'Gimnasio', years: 15, rating: 5.0, reviews: 76, price: 65, categories: ['Musculación'], title: 'Coach de CrossFit', city: 'Santiago · Gimnasio', tags: ['CrossFit', 'Fuerza', 'Resistencia'], clients: '+110', responds: '~1 h' },
]

export const CATEGORIES = ['Musculación', 'En casa', 'Running', 'Spinning']

export type WSet = { kg: string; target: string; note?: string }
export type WExercise = { name: string; muscle: string; rest: string; tip?: string; sets: WSet[] }

const s = (kg: string, ...targets: string[]): WSet[] => targets.map((t) => ({ kg, target: t }))

export const WORKOUT: { title: string; day: string; exercises: WExercise[] } = {
  title: 'Tren superior',
  day: 'Lunes · Push',
  exercises: [
    { name: 'Abs', muscle: 'Abdomen', rest: '60 s', tip: 'Exhala al subir y controla la bajada.', sets: s('15 p', '12', '12', '12') },
    { name: 'Press inclinado', muscle: 'Pecho', rest: '90 s', tip: 'Pausa de 1 s abajo sin rebotar, no abras mucho los hombros.', sets: s('65 kg', '11', '9', '10') },
    { name: 'Press banca', muscle: 'Pecho', rest: '2 min', sets: s('75 kg', '7', '9', '8') },
    { name: 'Fondo en máquina', muscle: 'Pecho · Tríceps', rest: '90 s', sets: [{ kg: '16 p', target: '10' }, { kg: '15 p', target: '12' }, { kg: '15 p', target: '12' }] },
    { name: 'Apertura', muscle: 'Pecho', rest: '90 s', tip: 'Drop set: al terminar, baja el peso y sigue sin descansar.', sets: [{ kg: '70/50 kg', target: '5/7', note: 'Drop set' }, { kg: '64/50 kg', target: '7/7', note: 'Drop set' }] },
    { name: 'Press militar', muscle: 'Hombro', rest: '2 min', sets: [{ kg: '22.5 kg', target: '6' }, { kg: '20 kg', target: '8' }, { kg: '20 kg', target: '7' }] },
    { name: 'Lateral', muscle: 'Hombro', rest: '60 s', sets: s('12.5 kg', '12', '10', '12') },
    { name: 'Hombro anterior', muscle: 'Hombro', rest: '60 s', sets: s('40 kg', '12', '12', '12') },
    { name: 'Copa en polea', muscle: 'Tríceps', rest: '90 s', sets: [{ kg: '55 kg', target: '9' }, { kg: '55/50 kg', target: '5/2', note: 'Drop set' }, { kg: '50 kg', target: '7' }] },
    { name: 'Extensión de tríceps', muscle: 'Tríceps', rest: '90 s', tip: 'Rest-pause: descansa 15 s y saca las reps extra.', sets: [{ kg: '65 kg', target: '9/3', note: 'Rest-pause' }, { kg: '65 kg', target: '9/2', note: 'Rest-pause' }, { kg: '60 kg', target: '12' }] },
  ],
}

export const HABITS = [
  { id: 'agua', title: 'Tomar 2L de agua', sub: '0.5L registrados' },
  { id: 'dormir', title: 'Dormir 8 horas', sub: 'Recomendado por tu entrenador' },
  { id: 'foto', title: 'Registrar foto de progreso', sub: 'Semanal' },
]

export const WEEK = [['Lun', 29], ['Mar', 30], ['Mié', 1], ['Jue', 2], ['Vie', 3], ['Sáb', 4], ['Dom', 5]] as const

export type CalEvent = { id: string; day: number; time: string; duration: string; title: string; sub: string; kind: 'entreno' | 'reunion'; groups?: [string, string][] }
export const EVENTS: CalEvent[] = [
  { id: 'e1', day: 2, time: '06:00', duration: '1:30 hr', title: 'Push (Pecho, hombros y tríceps)', sub: '7 ejercicios · Asignada por Pedro', kind: 'entreno', groups: [['Pecho', 'Press inclinado · Press banca · Fondo en máquina'], ['Hombros', 'Press militar · Laterales'], ['Tríceps', 'Copa en polea · Extensión de tríceps']] },
  { id: 'e2', day: 3, time: '06:00', duration: '1:30 hr', title: 'Pull (Espalda y bíceps)', sub: 'Viernes 3 de julio', kind: 'entreno', groups: [['Espalda', 'Dominadas · Remo con barra · Jalón al pecho'], ['Bíceps', 'Curl con barra · Curl martillo']] },
  { id: 'e3', day: 3, time: '18:00', duration: '30 min', title: 'Reunión con entrenador', sub: 'Videollamada con Pedro · revisión del progreso del mes', kind: 'reunion' },
  { id: 'e4', day: 6, time: '06:00', duration: '1:15 hr', title: 'Pierna (Cuádriceps y glúteos)', sub: 'Asignada por Pedro', kind: 'entreno' },
]

export const ACHIEVEMENTS = [
  { group: 'Constancia', items: [{ name: 'Racha diaria', status: '4 de 5 días', done: false, progress: 0.8 }, { name: 'Racha semanal', status: '3 semanas', done: true, progress: 1 }, { name: 'Racha de 30 días', status: '16 de 30 días', done: false, progress: 0.53 }] },
  { group: 'Fuerza', items: [{ name: 'Primeros 60 kg en sentadilla', status: '12 jul', done: true, progress: 1 }, { name: 'Primeros 80 kg en press banca', status: '75 de 80 kg', done: false, progress: 0.94 }, { name: 'Primeros 100 kg en peso muerto', status: 'Bloqueado', done: false, progress: 0 }] },
  { group: 'Cardio', items: [{ name: '1ra semana de cardio', status: '5 jul', done: true, progress: 1 }, { name: '1ros 15 min de cardio', status: '28 jun', done: true, progress: 1 }, { name: 'Primeros 5 km', status: 'Bloqueado', done: false, progress: 0 }] },
  { group: 'Hábitos', items: [{ name: 'Foto semanal', status: '3 de 4 semanas', done: false, progress: 0.75 }, { name: '4 L de agua por 7 días', status: '9 jul', done: true, progress: 1 }, { name: 'Dormir 8 h por 7 días', status: '2 de 7 días', done: false, progress: 0.28 }] },
]

export const RECORDS = [
  { name: 'Press banca', muscle: 'Pecho', date: '12 jul', best: '75 kg × 7', delta: '+5 kg', series: [60, 62.5, 65, 67.5, 70, 75] },
  { name: 'Sentadilla', muscle: 'Pierna', date: '12 jul', best: '60 kg × 8', delta: '+10 kg', series: [40, 45, 47.5, 50, 55, 60] },
  { name: 'Press inclinado', muscle: 'Pecho', date: '10 jul', best: '65 kg × 11', delta: '+5 kg', series: [50, 52.5, 55, 57.5, 60, 65] },
  { name: 'Extensión de tríceps', muscle: 'Tríceps', date: '8 jul', best: '65 kg × 9', delta: '+5 kg', series: [45, 50, 52.5, 55, 60, 65] },
  { name: 'Press militar', muscle: 'Hombro', date: '6 jul', best: '22.5 kg × 6', delta: '+2.5 kg', series: [15, 15, 17.5, 20, 20, 22.5] },
  { name: 'Prensa de piernas', muscle: 'Pierna', date: '4 jul', best: '140 kg × 10', delta: '+20 kg', series: [100, 110, 115, 120, 130, 140] },
]

export const BODYWEIGHT = [76.2, 76.6, 77.1, 77.4, 78.0, 78.4]
export const MONTHS = ['Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul']

export const CLIENT_NOTIFICATIONS = [
  { id: 'c1', cat: 'Entrenos', title: 'Recuerda entrenar hoy', text: 'Push a las 4:15 pm · 7 ejercicios, ~75 min', time: 'Hace 5 min', group: 'Hoy', unread: true },
  { id: 'c2', cat: 'Citas', title: 'Reunión con tu entrenador a las 2:00 pm', text: 'Videollamada con Pedro. El enlace se activa 10 min antes.', time: 'Hace 1 h', group: 'Hoy', unread: true },
  { id: 'c3', cat: 'Hábitos', title: 'No olvides tomar tus 4 L de agua', text: 'Llevas 1.5 L hoy. ¡Te faltan 2.5 L!', time: 'Hace 2 h', group: 'Hoy', unread: false },
  { id: 'c4', cat: 'Entrenos', title: 'Pedro te escribió', text: '“¿Cómo te sentiste con el press inclinado?”', time: 'Hace 3 h', group: 'Hoy', unread: false },
  { id: 'c5', cat: 'Entrenos', title: 'Pedro actualizó tu rutina', text: 'Nueva semana de Push, Pull y Pierna', time: 'Ayer · 7:20 pm', group: 'Ayer', unread: false },
  { id: 'c6', cat: 'Hábitos', title: '¡Llevas 16 días de racha!', text: 'Sigue así, Daniel. Tu mejor marca es 21 días.', time: 'Ayer · 6:05 pm', group: 'Ayer', unread: false },
  { id: 'c7', cat: 'Pagos', title: 'Pago recibido', text: '$47.25 · Mensualidad de musculación', time: 'Ayer · 9:00 am', group: 'Ayer', unread: false },
]

export const PRE_CHAT = [
  { from: 'out', text: 'Hola Pedro 👋 Quiero ganar masa muscular pero soy principiante. ¿Tu plan me sirve?', time: '10:02' },
  { from: 'in', text: '¡Hola Daniel! Sí, trabajo mucho con principiantes. Empezamos con 4 días por semana y vamos subiendo cargas poco a poco.', time: '10:15' },
  { from: 'out', text: 'Tengo una molestia lumbar leve, ¿es un problema?', time: '10:16' },
  { from: 'in', text: 'Para nada. Me lo indicas en el cuestionario y adapto los ejercicios. Te dejo una oferta con videollamada inicial incluida 👇', time: '10:21' },
] as const

export const SERVICE_FEE = 0.05
export const money = (n: number) => `$${n.toFixed(2)}`
