# Repe

Prototipo funcional de **Repe**, una app que conecta a entrenadores con sus clientes del gimnasio: rutinas, dietas, progreso, agenda y chat en un solo lugar.

Es una app web pensada para el móvil (en escritorio se muestra dentro de un marco de teléfono). Usa datos de ejemplo: no hay cuentas, servidor ni cobros reales.

## Qué incluye

- **Selector de rol:** cliente o entrenador.
- **App del entrenador** (paleta morada):
  - Inicio con KPIs, solicitudes nuevas, entrenamientos del día y clientes por vencer.
  - Límite de 10 clientes activos en el plan gratis: aviso desde el cliente 8, bloqueo y pago del plan ilimitado al recibir el cliente 11 (al cliente solo se le cobra cuando el entrenador lo acepta).
  - Clientes: lista, solicitudes, invitación por enlace o código, ficha con progreso y plan.
  - Calendario semanal y mensual, agendar sesiones y citas por confirmar.
  - Rutinas y dietas: biblioteca, asistentes paso a paso para crearlas, asignar, editar (con aviso si ya está asignada) y duplicar.
  - Perfil, servicios, plan y pagos, notificaciones y mensajería.
- **App del cliente** (paleta verde): en construcción.

## Cómo correrlo en tu computador

Necesitas [Node.js](https://nodejs.org) 20 o superior.

```bash
npm install
npm run dev
```

Abre la dirección que aparece en la terminal (normalmente http://localhost:5173).

## Tecnología

React 19 + TypeScript + Vite, React Router e íconos de Lucide. Los colores y tipografías vienen de las variables del archivo de Figma (Figtree, paleta primaria verde y secundaria morada).
