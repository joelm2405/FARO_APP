import type { MensajeObra } from "./types";

// Ejemplos locales para la demo. No hay conexión con WhatsApp.
export const MENSAJES_OBRA: MensajeObra[] = [
  {
    id: "msg-villa-3", proyectoId: "prj-villa", remitente: "Julio Ramírez",
    enviadoEn: "2026-09-10T10:45:00-05:00",
    texto: "Buenos días, ingeniero. El proveedor me indica que el acero para el bloque D está subiendo de precio. Antes de pedir el siguiente lote, por favor confirmar la cotización con compras.",
  },
  {
    id: "msg-villa-2", proyectoId: "prj-villa", remitente: "Julio Ramírez",
    enviadoEn: "2026-09-10T09:20:00-05:00",
    texto: "En el bloque A vamos más lento con los muros. El ladrillo llegó tarde y calculo que nos tomará dos días más terminar este frente. Les aviso para revisar la programación.",
  },
  {
    id: "msg-villa-1", proyectoId: "prj-villa", remitente: "Julio Ramírez",
    enviadoEn: "2026-09-09T16:30:00-05:00",
    texto: "El armado de acero del bloque D avanzó más rápido de lo previsto. La cuadrilla terminó el frente de hoy y podemos preparar el siguiente mañana, si nos confirman el material.",
  },
  {
    id: "msg-mirador-2", proyectoId: "prj-mirador", remitente: "Pedro Quispe",
    enviadoEn: "2026-09-10T08:50:00-05:00",
    texto: "Ingeniero, la lluvia nos retrasó el trabajo de muros del módulo B esta mañana. Vamos a retomar cuando mejoren las condiciones. Al cierre le paso cómo quedamos.",
  },
  {
    id: "msg-mirador-1", proyectoId: "prj-mirador", remitente: "Pedro Quispe",
    enviadoEn: "2026-09-09T15:10:00-05:00",
    texto: "Terminamos las salidas de tomacorriente del primer sector antes de lo programado. Mañana podemos mover la cuadrilla al siguiente módulo.",
  },
];
