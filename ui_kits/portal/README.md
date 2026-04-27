# Believe Portal — UI Kit

Portal MVP cubriendo **5 roles** (Estudiante, Profesor, Recepción, Dueño, Finanzas) que reemplaza el flujo actual de WhatsApp + Excel.

## Cómo usar
Abre `index.html`. Usa el switch superior derecho para cambiar entre roles.

## Archivos
- `Primitives.jsx` — componentes base (Button, Card, Badge, Sidebar, TopBar, Avatar, StatTile, Eyebrow, Icons, LANGS).
- `StudentHome.jsx` — dashboard del estudiante (próxima clase, semana, progreso, pago pendiente).
- `TeacherHome.jsx` — agenda de hoy del profesor + confirmar asistencia.
- `ReceptionHome.jsx` — solicitudes de reserva, estado de aulas en vivo.
- `OwnerHome.jsx` — comprobantes por aprobar, ingresos, distribución por idioma.
- `FinanceHome.jsx` — tabla de cobros, morosos, distribución de métodos de pago.

## Decisiones clave de UX
- **Cinta sticky "próxima clase"** para estudiante resuelve el "¿dónde queda mi clase?".
- **QR para asistencia** — el estudiante escanea al llegar al aula; el profesor confirma unidad/lección después.
- **Recepción publica slots disponibles**, el estudiante elige de los disponibles (tu flujo preferido).
- **Pago manual**: estudiante sube comprobante, dueño aprueba en un click.
- Cada idioma tiene su **bandera + color asignado** — consistente en cards, badges, avatares.
