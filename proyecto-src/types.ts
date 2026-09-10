export type TipoRecurso = "MO" | "MAT" | "EQ";

/** Texto original retransmitido por el bot, sin interpretar ni recalcular datos. */
export interface MensajeObra {
  id: string;
  proyectoId: string;
  remitente: string;
  enviadoEn: string;
  texto: string;
}

export type FuentePrecio =
  | "cotizacion"       // el proveedor cotizo directamente
  | "lista-excel"      // proveedor grande, cargo su lista
  | "portal"           // se leyo su portal
  | "whatsapp"         // proveedor pequeno, respondio por chat
  | "indice-inei"      // indice unificado de precios de la construccion
  | "mercado";         // senal macro: LME, Brent, tipo de cambio

export type Confianza = "alta" | "media" | "referencial";

/** Insumo del catalogo maestro: la unidad minima cuyo precio vigila FARO. */
export interface Insumo {
  id: string;
  nombre: string;
  unidad: string;
  tipo: TipoRecurso;
  /** Precio congelado cuando se aprobo el presupuesto. */
  precioBase: number;
  /** Precio que FARO considera vigente hoy. */
  precioVigente: number;
  fuente: FuentePrecio;
  confianza: Confianza;
  /** Dias desde la ultima verificacion del precio. */
  diasDesdeVerificacion: number;
  proveedorId: string;
  /** Que mueve el precio de este insumo. Sirve para explicar la alerta. */
  driver: string;
  importado: boolean;
}

export type TierProveedor = "A" | "B";

export interface Proveedor {
  id: string;
  nombre: string;
  /** A: empresa grande, ya tiene precios en Excel o plataforma.
   *  B: empresa chica, cambia el precio a su criterio. */
  tier: TierProveedor;
  canal: "Lista Excel" | "Portal web" | "WhatsApp";
  ciudad: string;
  diasEntrega: number;
  aliado: boolean;
}

/** Una linea del analisis de precios unitarios. */
export interface LineaAPU {
  insumoId: string;
  /** Cantidad de insumo por unidad de partida. */
  cuadrilla: number;
}

export interface Partida {
  id: string;
  codigo: string;
  descripcion: string;
  unidad: string;
  metrado: number;
  subpresupuesto: string;
  apu: LineaAPU[];
  /** Avance fisico ejecutado, 0 a 1. */
  avance: number;
}

export interface Proyecto {
  id: string;
  nombre: string;
  ubicacion: string;
  viviendas: number;
  inicio: string;
  fin: string;
  ventaEstimada: number;
  partidas: Partida[];
}

export interface ItemCarrito {
  insumoId: string;
  cantidad: number;
}

export interface OfertaCotizacion {
  proveedorId: string;
  insumoId: string;
  precio: number;
  diasEntrega: number;
}

export interface Cotizacion {
  id: string;
  fecha: string;
  items: ItemCarrito[];
  ofertas: OfertaCotizacion[];
  adjudicadoA: string | null;
}

export interface Alerta {
  id: string;
  insumoId: string;
  precioAntes: number;
  precioDespues: number;
  /** Variacion relativa, 0.08 = subio 8 por ciento. */
  variacion: number;
  /** Cantidad total del insumo en todo el presupuesto. */
  cantidadTotal: number;
  /** Impacto en soles sobre el costo directo. */
  impacto: number;
  /** Peso del insumo dentro del costo directo. */
  incidencia: number;
  fuente: FuentePrecio;
  detectadaEn: string;
  leida: boolean;
}

export interface AvanceObra {
  id: string;
  periodo: string;
  titulo: string;
  partidaCodigo: string;
  avanceReportado: number;
  nota: string;
  tono: string;
}
