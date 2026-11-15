export type ClientStatus = 'activo' | 'inactivo' | 'por vencer' | 'invitado' | 'archivado'

export type Client = {
  id: string
  name: string
  initials: string
  age: number
  level: string
  plan: string
  price: string
  start: string
  end: string
  daysLeft: number
  status: ClientStatus
  today?: string
  weight: number
  fat: number
  consistency: number
  condition?: string
  records: { name: string; value: string }[]
}

export type Request = { id: string; name: string; initials: string; service: string; price: string; hoursLeft: number }

export type Exercise = { id: string; name: string; muscles: string[]; equipment: string; type: 'Fuerza' | 'Cardio'; description: string; duration: string; custom?: boolean }

export type SetConfig = { reps: number; kg: number }
export type RoutineItem = { exerciseId: string; same: boolean; sets: SetConfig[]; rest: number; minutes: number; km: number; note: string }
export type Routine = { id: string; name: string; level: string; description: string; muscles: string[]; items: RoutineItem[]; generalNote: string; assigned: string[]; uses: number }

export type Food = { id: string; name: string; per: string; kcal: number; p: number; c: number; f: number; unit: 'g' | 'ml' | 'ud'; unitGrams?: number; custom?: boolean }
export type DietMeal = { id: string; name: string; time: string; foods: { foodId: string; qty: number }[] }
export type Diet = { id: string; name: string; description: string; goal: string; kcal: number; macros: { p: number; c: number; f: number }; restrictions: string[]; meals: DietMeal[]; substitutes: { food: string; text: string }[]; generalNote: string; supplements: string[]; assigned: string[] }

export const LIMIT = 10

export const MUSCLE_ZONES: Record<string, string[]> = {
  'Tren superior': ['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Trapecio'],
  'Tren inferior': ['Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Pantorrilla'],
  'Full body': ['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Trapecio', 'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Pantorrilla', 'Core'],
  Core: ['Core'],
}
export const MUSCLES = ['Pecho', 'Espalda', 'Hombro', 'Bíceps', 'Tríceps', 'Trapecio', 'Cuádriceps', 'Isquiotibiales', 'Glúteos', 'Pantorrilla', 'Core', 'Cardio']

const c = (id: string, name: string, status: ClientStatus, extra: Partial<Client> = {}): Client => ({
  id, name, initials: name.split(' ').map((w) => w[0]).join('').slice(0, 2), age: 30, level: 'Intermedio', plan: 'Plan mensual online', price: '$60/mes',
  start: '28 oct', end: '28 nov', daysLeft: 12, status, weight: 70, fat: 20, consistency: 85, records: [{ name: 'Press banca', value: '60 kg' }, { name: 'Sentadilla', value: '90 kg' }], ...extra,
})

export const CLIENTS: Client[] = [
  c('maria', 'María González', 'activo', { age: 35, weight: 62.4, fat: 24, consistency: 92, today: 'Push · completado a las 7:10', condition: 'Lesión en rodilla izquierda: evitar ejercicios de impacto.', records: [{ name: 'Press banca', value: '45 kg' }, { name: 'Sentadilla', value: '70 kg' }, { name: 'Peso muerto', value: '80 kg' }] }),
  c('carlos', 'Carlos Pérez', 'activo', { age: 27, end: '2 dic', daysLeft: 17, today: 'Pierna · pendiente 6:00 pm', weight: 81.2, fat: 17 }),
  c('lucia', 'Lucía Romero', 'inactivo', { age: 41, end: '5 dic', daysLeft: 20, today: 'Sin actividad hace 4 días', consistency: 54 }),
  c('jose', 'José Martínez', 'por vencer', { age: 20, level: 'Principiante', end: '19 nov', daysLeft: 3, weight: 74 }),
  c('pedro', 'Pedro Sánchez', 'activo', { plan: 'Plan trimestral', price: '$160/3 meses', end: '15 ene', daysLeft: 60 }),
  c('valentina', 'Valentina Ruiz', 'activo', { age: 24, end: '1 dic', daysLeft: 16 }),
  c('andres', 'Andrés Castro', 'activo', { age: 33, end: '7 dic', daysLeft: 22 }),
  c('camila', 'Camila Díaz', 'activo', { age: 29, plan: 'Asesoría presencial', price: '$25/sesión', end: '30 nov', daysLeft: 15 }),
  c('diego', 'Diego Ruiz', 'invitado', { today: 'Invitación enviada hace 2 días' }),
  c('sara', 'Sara Méndez', 'invitado', { today: 'Invitación enviada hoy' }),
  c('tomas', 'Tomás Herrera', 'archivado', { today: 'Terminó en septiembre' }),
  c('elena', 'Elena Vargas', 'archivado', { today: 'Terminó en agosto' }),
  c('martin', 'Martín Gil', 'archivado', { today: 'Terminó en julio' }),
]

export const REQUESTS: Request[] = [
  { id: 'ana', name: 'Ana Torres', initials: 'AT', service: 'Plan mensual online', price: '$60/mes', hoursLeft: 71 },
  { id: 'luis', name: 'Luis Ortega', initials: 'LO', service: 'Plan mensual online', price: '$60/mes', hoursLeft: 50 },
  { id: 'sofia', name: 'Sofía Vega', initials: 'SV', service: 'Asesoría presencial', price: '$25/sesión', hoursLeft: 30 },
]

export const SERVICES = [
  { id: 'mensual', name: 'Plan mensual online', price: '$60/mes', desc: 'Rutina personalizada, dieta, chat y 1 llamada al mes.', tags: ['Online', 'Rutina + dieta'], clients: '6 clientes', on: true },
  { id: 'presencial', name: 'Asesoría presencial', price: '$25/sesión', desc: 'Sesión de 1 h en Gimnasio Central para revisar técnica.', tags: ['Presencial', '1 h'], clients: '2 clientes', on: true },
  { id: 'trimestral', name: 'Plan trimestral', price: '$160/3 meses', desc: 'Todo lo del plan mensual con 15% de descuento.', tags: ['Online', 'Ahorro 15%'], clients: 'Sin clientes', on: false },
]

export const SESSIONS = [
  { id: 's1', day: 16, time: '06:00', duration: '1 h', client: 'María González', type: 'Presencial · Gimnasio Central', confirmed: true },
  { id: 's2', day: 16, time: '09:30', duration: '30 min', client: 'Carlos Pérez', type: 'Online · Videollamada', confirmed: true },
  { id: 's3', day: 16, time: '18:00', duration: '45 min', client: 'Ana Torres', type: 'Online · Primera asesoría', confirmed: false },
  { id: 's4', day: 17, time: '07:00', duration: '1 h', client: 'Pedro Sánchez', type: 'Presencial · Gimnasio Central', confirmed: true },
  { id: 's5', day: 18, time: '07:00', duration: '1 h', client: 'José Martínez', type: 'Presencial · Revisión de técnica', confirmed: false },
  { id: 's6', day: 18, time: '19:00', duration: '30 min', client: 'Valentina Ruiz', type: 'Online · Videollamada', confirmed: true },
  { id: 's7', day: 20, time: '08:00', duration: '1 h', client: 'Camila Díaz', type: 'Presencial · Gimnasio Central', confirmed: true },
]

export const PENDING_NOTES: Record<string, string> = { s3: '“Quiero empezar a entrenar para bajar de peso.”', s5: '“¿Podemos revisar la sentadilla?”' }

export const EXERCISES: Exercise[] = [
  { id: 'press-banca', name: 'Press banca', muscles: ['Pecho', 'Tríceps'], equipment: 'Barra', type: 'Fuerza', duration: '0:32', description: 'Acostado en el banco, baja la barra al pecho controlando y empuja hasta extender los brazos sin bloquear.' },
  { id: 'press-inclinado', name: 'Press inclinado con mancuernas', muscles: ['Pecho', 'Hombro'], equipment: 'Mancuernas', type: 'Fuerza', duration: '0:28', description: 'En banco a 30°, baja las mancuernas a la altura del pecho y empuja juntándolas arriba.' },
  { id: 'aperturas', name: 'Aperturas en polea', muscles: ['Pecho'], equipment: 'Polea', type: 'Fuerza', duration: '0:25', description: 'Con los codos ligeramente flexionados, junta las manos al frente apretando el pecho.' },
  { id: 'fondos', name: 'Fondos en máquina', muscles: ['Pecho', 'Tríceps'], equipment: 'Máquina', type: 'Fuerza', duration: '0:22', description: 'Baja controlando hasta 90° de codo y empuja sin bloquear.' },
  { id: 'press-militar', name: 'Press militar', muscles: ['Hombro', 'Tríceps'], equipment: 'Barra', type: 'Fuerza', duration: '0:30', description: 'De pie, empuja la barra desde la clavícula hasta arriba de la cabeza con el core activo.' },
  { id: 'elevaciones', name: 'Elevaciones laterales', muscles: ['Hombro'], equipment: 'Mancuernas', type: 'Fuerza', duration: '0:20', description: 'Sube las mancuernas a los lados hasta la altura de los hombros con los codos suaves.' },
  { id: 'press-frances', name: 'Press francés', muscles: ['Tríceps'], equipment: 'Barra Z', type: 'Fuerza', duration: '0:32', description: 'Acostado en el banco, baja la barra hacia la frente doblando solo los codos. Mantén los brazos fijos y sube sin bloquear.' },
  { id: 'ext-polea', name: 'Extensión de tríceps en polea', muscles: ['Tríceps'], equipment: 'Polea', type: 'Fuerza', duration: '0:18', description: 'Con los codos pegados al cuerpo, extiende hacia abajo y controla la subida.' },
  { id: 'dominadas', name: 'Dominadas', muscles: ['Espalda', 'Bíceps'], equipment: 'Peso corporal', type: 'Fuerza', duration: '0:26', description: 'Cuelga de la barra y sube hasta pasar la barbilla, bajando controlado.' },
  { id: 'remo-barra', name: 'Remo con barra', muscles: ['Espalda', 'Trapecio'], equipment: 'Barra', type: 'Fuerza', duration: '0:29', description: 'Con la espalda recta e inclinado, lleva la barra al ombligo juntando escápulas.' },
  { id: 'jalon', name: 'Jalón al pecho', muscles: ['Espalda', 'Bíceps'], equipment: 'Polea', type: 'Fuerza', duration: '0:24', description: 'Tira de la barra hasta el pecho llevando los codos hacia abajo.' },
  { id: 'encogimientos', name: 'Encogimientos con mancuernas', muscles: ['Trapecio'], equipment: 'Mancuernas', type: 'Fuerza', duration: '0:15', description: 'Sube los hombros hacia las orejas, sostén 1 segundo y baja.' },
  { id: 'curl-barra', name: 'Curl con barra', muscles: ['Bíceps'], equipment: 'Barra', type: 'Fuerza', duration: '0:21', description: 'Sin balancear el cuerpo, flexiona los codos llevando la barra al pecho.' },
  { id: 'curl-martillo', name: 'Curl martillo', muscles: ['Bíceps'], equipment: 'Mancuernas', type: 'Fuerza', duration: '0:19', description: 'Con agarre neutro, sube las mancuernas alternando.' },
  { id: 'sentadilla', name: 'Sentadilla', muscles: ['Cuádriceps', 'Glúteos'], equipment: 'Barra', type: 'Fuerza', duration: '0:35', description: 'Baja como si te sentaras, rodillas en línea con los pies, y sube empujando el suelo.' },
  { id: 'prensa', name: 'Prensa de piernas', muscles: ['Cuádriceps', 'Glúteos'], equipment: 'Máquina', type: 'Fuerza', duration: '0:23', description: 'Baja la plataforma hasta 90° de rodilla y empuja sin bloquear.' },
  { id: 'ext-cuadriceps', name: 'Extensión de cuádriceps', muscles: ['Cuádriceps'], equipment: 'Máquina', type: 'Fuerza', duration: '0:17', description: 'Extiende las piernas hasta arriba y baja en 3 segundos.' },
  { id: 'peso-muerto-rumano', name: 'Peso muerto rumano', muscles: ['Isquiotibiales', 'Glúteos'], equipment: 'Barra', type: 'Fuerza', duration: '0:31', description: 'Con rodillas semiflexionadas, baja la barra pegada a las piernas llevando la cadera atrás.' },
  { id: 'curl-femoral', name: 'Curl femoral', muscles: ['Isquiotibiales'], equipment: 'Máquina', type: 'Fuerza', duration: '0:18', description: 'Flexiona las rodillas llevando el rodillo a los glúteos.' },
  { id: 'hip-thrust', name: 'Hip thrust', muscles: ['Glúteos'], equipment: 'Barra', type: 'Fuerza', duration: '0:27', description: 'Con la espalda en el banco, sube la cadera apretando glúteos arriba.' },
  { id: 'gemelos', name: 'Elevación de talones', muscles: ['Pantorrilla'], equipment: 'Máquina', type: 'Fuerza', duration: '0:14', description: 'Sube en puntas de pie y baja hasta estirar la pantorrilla.' },
  { id: 'plancha', name: 'Plancha', muscles: ['Core'], equipment: 'Peso corporal', type: 'Fuerza', duration: '0:20', description: 'Apoya antebrazos y puntas, cuerpo recto, abdomen apretado.' },
  { id: 'crunch', name: 'Crunch en polea', muscles: ['Core'], equipment: 'Polea', type: 'Fuerza', duration: '0:16', description: 'De rodillas, lleva los codos a los muslos encogiendo el abdomen.' },
  { id: 'caminadora', name: 'Caminadora', muscles: ['Cardio'], equipment: 'Máquina', type: 'Cardio', duration: '0:12', description: 'Camina o trota a ritmo constante. Mantén una inclinación cómoda.' },
  { id: 'bicicleta', name: 'Bicicleta estática', muscles: ['Cardio'], equipment: 'Máquina', type: 'Cardio', duration: '0:12', description: 'Pedalea a ritmo constante ajustando la resistencia.' },
  { id: 'eliptica', name: 'Elíptica', muscles: ['Cardio'], equipment: 'Máquina', type: 'Cardio', duration: '0:12', description: 'Movimiento continuo coordinando brazos y piernas.' },
  { id: 'remo-ergo', name: 'Remo ergómetro', muscles: ['Cardio', 'Espalda'], equipment: 'Máquina', type: 'Cardio', duration: '0:15', description: 'Empuja con las piernas y termina tirando con los brazos.' },
]

const sets = (n: number, reps: number, kg: number): SetConfig[] => Array.from({ length: n }, () => ({ reps, kg }))
const item = (exerciseId: string, s: SetConfig[], rest = 90, note = ''): RoutineItem => ({ exerciseId, same: s.every((x) => x.reps === s[0].reps && x.kg === s[0].kg), sets: s, rest, minutes: 0, km: 0, note })

export const ROUTINES: Routine[] = [
  { id: 'r1', name: 'Hipertrofia tren superior', level: 'Intermedio', description: '', muscles: ['Pecho', 'Espalda', 'Hombro'], items: [item('press-banca', sets(4, 10, 60)), item('remo-barra', sets(4, 10, 50)), item('press-militar', sets(3, 8, 35)), item('curl-barra', sets(3, 12, 20), 60)], generalNote: '', assigned: ['maria', 'carlos', 'pedro', 'valentina', 'andres'], uses: 38 },
  { id: 'r2', name: 'Pierna y glúteo', level: 'Intermedio', description: '', muscles: ['Cuádriceps', 'Glúteos'], items: [item('sentadilla', sets(4, 8, 70)), item('hip-thrust', sets(4, 10, 60)), item('prensa', sets(3, 12, 120)), item('curl-femoral', sets(3, 12, 30), 60)], generalNote: '', assigned: ['carlos', 'camila', 'valentina'], uses: 21 },
  { id: 'r3', name: 'Full body principiante', level: 'Principiante', description: '', muscles: ['Pecho', 'Espalda', 'Cuádriceps'], items: [item('prensa', sets(3, 12, 60)), item('jalon', sets(3, 12, 35)), item('fondos', sets(3, 10, 0)), item('plancha', sets(3, 1, 0), 45)], generalNote: '', assigned: ['jose', 'lucia'], uses: 9 },
  { id: 'r4', name: 'Movilidad y core', level: 'Principiante', description: '', muscles: ['Core'], items: [item('plancha', sets(3, 1, 0), 45), item('crunch', sets(3, 15, 20), 45)], generalNote: '', assigned: [], uses: 0 },
]

export const FOODS: Food[] = [
  { id: 'avena', name: 'Avena en hojuelas', per: '100 g', kcal: 389, p: 13, c: 66, f: 7, unit: 'g' },
  { id: 'avena-inst', name: 'Avena instantánea', per: '100 g', kcal: 379, p: 13, c: 68, f: 6, unit: 'g' },
  { id: 'bebida-avena', name: 'Bebida de avena', per: '100 ml', kcal: 45, p: 1, c: 7, f: 1.5, unit: 'ml' },
  { id: 'barra-avena', name: 'Barra de avena y miel', per: '100 g', kcal: 420, p: 8, c: 64, f: 15, unit: 'g' },
  { id: 'claras', name: 'Claras de huevo', per: '100 g', kcal: 52, p: 11, c: 0.7, f: 0.2, unit: 'g' },
  { id: 'huevo', name: 'Huevo entero', per: '1 unidad', kcal: 78, p: 6, c: 0.6, f: 5, unit: 'ud', unitGrams: 50 },
  { id: 'platano', name: 'Plátano', per: '1 unidad', kcal: 105, p: 1.3, c: 27, f: 0.4, unit: 'ud', unitGrams: 118 },
  { id: 'manzana', name: 'Manzana', per: '1 unidad', kcal: 95, p: 0.5, c: 25, f: 0.3, unit: 'ud', unitGrams: 180 },
  { id: 'fresas', name: 'Fresas', per: '100 g', kcal: 32, p: 0.7, c: 7.7, f: 0.3, unit: 'g' },
  { id: 'pollo', name: 'Pechuga de pollo', per: '100 g', kcal: 165, p: 31, c: 0, f: 3.6, unit: 'g' },
  { id: 'atun', name: 'Atún en agua', per: '100 g', kcal: 116, p: 26, c: 0, f: 1, unit: 'g' },
  { id: 'salmon', name: 'Salmón', per: '100 g', kcal: 208, p: 20, c: 0, f: 13, unit: 'g' },
  { id: 'carne', name: 'Carne magra de res', per: '100 g', kcal: 176, p: 26, c: 0, f: 8, unit: 'g' },
  { id: 'arroz', name: 'Arroz integral cocido', per: '100 g', kcal: 112, p: 2.6, c: 23, f: 0.9, unit: 'g' },
  { id: 'papa', name: 'Papa cocida', per: '100 g', kcal: 87, p: 1.9, c: 20, f: 0.1, unit: 'g' },
  { id: 'batata', name: 'Batata cocida', per: '100 g', kcal: 90, p: 2, c: 21, f: 0.1, unit: 'g' },
  { id: 'pasta', name: 'Pasta integral cocida', per: '100 g', kcal: 124, p: 5, c: 25, f: 1, unit: 'g' },
  { id: 'pan', name: 'Pan integral', per: '1 rebanada', kcal: 80, p: 4, c: 14, f: 1, unit: 'ud', unitGrams: 30 },
  { id: 'lentejas', name: 'Lentejas cocidas', per: '100 g', kcal: 116, p: 9, c: 20, f: 0.4, unit: 'g' },
  { id: 'ensalada', name: 'Ensalada verde', per: '100 g', kcal: 17, p: 1.2, c: 3, f: 0.2, unit: 'g' },
  { id: 'brocoli', name: 'Brócoli', per: '100 g', kcal: 34, p: 2.8, c: 7, f: 0.4, unit: 'g' },
  { id: 'aguacate', name: 'Aguacate', per: '100 g', kcal: 160, p: 2, c: 9, f: 15, unit: 'g' },
  { id: 'aceite', name: 'Aceite de oliva', per: '1 cucharada', kcal: 119, p: 0, c: 0, f: 13.5, unit: 'ud', unitGrams: 14 },
  { id: 'almendras', name: 'Almendras', per: '100 g', kcal: 579, p: 21, c: 22, f: 50, unit: 'g' },
  { id: 'yogur', name: 'Yogur griego sin lactosa', per: '100 g', kcal: 97, p: 9, c: 4, f: 5, unit: 'g' },
  { id: 'queso', name: 'Queso fresco', per: '100 g', kcal: 174, p: 12, c: 3, f: 13, unit: 'g' },
  { id: 'whey', name: 'Proteína whey', per: '1 scoop', kcal: 120, p: 24, c: 3, f: 1.5, unit: 'ud', unitGrams: 30 },
  { id: 'arepa', name: 'Arepa de maíz', per: '1 unidad', kcal: 198, p: 4, c: 38, f: 3, unit: 'ud', unitGrams: 90 },
]

export const DIETS: Diet[] = [
  { id: 'd1', name: 'Déficit moderado · 1.800 kcal', description: '', goal: 'Déficit', kcal: 1800, macros: { p: 30, c: 40, f: 30 }, restrictions: ['Sin lactosa'], meals: [{ id: 'm1', name: 'Desayuno', time: '07:30', foods: [{ foodId: 'avena', qty: 60 }, { foodId: 'claras', qty: 200 }, { foodId: 'platano', qty: 1 }] }, { id: 'm2', name: 'Almuerzo', time: '13:00', foods: [{ foodId: 'pollo', qty: 150 }, { foodId: 'arroz', qty: 120 }, { foodId: 'ensalada', qty: 150 }] }], substitutes: [], generalNote: '', supplements: [], assigned: ['maria', 'lucia', 'camila', 'jose'] },
  { id: 'd2', name: 'Volumen limpio · 2.900 kcal', description: '', goal: 'Volumen', kcal: 2900, macros: { p: 25, c: 50, f: 25 }, restrictions: [], meals: [], substitutes: [], generalNote: '', supplements: [], assigned: ['carlos', 'andres'] },
  { id: 'd3', name: 'Vegetariana alta en proteína', description: '', goal: 'Mantenimiento', kcal: 2200, macros: { p: 30, c: 45, f: 25 }, restrictions: ['Vegetariana'], meals: [], substitutes: [], generalNote: '', supplements: [], assigned: ['valentina'] },
]

export const NOTIFICATIONS = [
  { id: 'n1', icon: 'request', title: 'Nueva solicitud de Ana Torres', text: 'Quiere contratar tu plan mensual online.', time: 'Hace 5 min', unread: true, group: 'Hoy', to: '/entrenador/clientes?tab=solicitudes' },
  { id: 'n2', icon: 'calendar', title: 'Sesión en 30 min', text: 'María González · 06:00 · Gimnasio Central', time: 'Hace 20 min', unread: true, group: 'Hoy', to: '/entrenador/calendario' },
  { id: 'n3', icon: 'alert', title: 'Mensualidad por vencer', text: 'El plan de José Martínez vence en 3 días.', time: 'Hace 1 h', unread: false, group: 'Hoy', to: '/entrenador/clientes/jose' },
  { id: 'n4', icon: 'money', title: 'Pago recibido', text: 'Carlos Pérez pagó su plan mensual · +$54', time: '18:40', unread: false, group: 'Ayer', to: '/entrenador/perfil/plan' },
  { id: 'n5', icon: 'routine', title: 'Cambio de rutina pendiente', text: 'La rutina de Lucía Romero termina el viernes.', time: '09:15', unread: false, group: 'Ayer', to: '/entrenador/rutinas' },
  { id: 'n6', icon: 'shield', title: 'Verifica tu cuenta', text: 'Sube tu certificado para obtener la insignia de verificado.', time: '08:00', unread: false, group: 'Ayer', to: '/entrenador/perfil' },
]

export type Msg = { from: 'in' | 'out'; text: string; time: string; kind?: 'photo' | 'voice' }
export const CONVERSATIONS: { id: string; clientId: string; name: string; initials: string; unread: number; time: string; messages: Msg[] }[] = [
  { id: 'maria', clientId: 'maria', name: 'María González', initials: 'MG', unread: 2, time: '10:24', messages: [{ from: 'in', text: 'Hola Ramiro, ya terminé la rutina de hoy 💪', time: '10:20' }, { from: 'in', text: 'Foto de progreso', time: '10:21', kind: 'photo' }, { from: 'out', text: '¡Excelente, María! Se nota el cambio. Mañana subimos 2,5 kg en press banca.', time: '10:24' }, { from: 'in', text: '0:24', time: '10:28', kind: 'voice' }] },
  { id: 'carlos', clientId: 'carlos', name: 'Carlos Pérez', initials: 'CP', unread: 1, time: '09:02', messages: [{ from: 'in', text: '0:24', time: '09:02', kind: 'voice' }] },
  { id: 'ana', clientId: 'ana', name: 'Ana Torres', initials: 'AT', unread: 0, time: 'Ayer', messages: [{ from: 'in', text: '¿Tienes horario el lunes en la tarde?', time: '17:40' }] },
  { id: 'jose', clientId: 'jose', name: 'José Martínez', initials: 'JM', unread: 0, time: 'Ayer', messages: [{ from: 'in', text: 'Foto de progreso', time: '12:10', kind: 'photo' }] },
  { id: 'lucia', clientId: 'lucia', name: 'Lucía Romero', initials: 'LR', unread: 0, time: 'Lun', messages: [{ from: 'out', text: '¿Cómo sigue la rodilla?', time: '08:30' }] },
  { id: 'pedro', clientId: 'pedro', name: 'Pedro Sánchez', initials: 'PS', unread: 0, time: 'Dom', messages: [{ from: 'in', text: 'Gracias, nos vemos el jueves', time: '19:12' }] },
]

export const foodTotals = (food: Food, qty: number) => {
  const factor = food.unit === 'ud' ? qty : qty / 100
  return { kcal: food.kcal * factor, p: food.p * factor, c: food.c * factor, f: food.f * factor }
}
export const fmt = (n: number) => Math.round(n).toLocaleString('es-CO')
