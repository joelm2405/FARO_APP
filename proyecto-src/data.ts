import type {
  Insumo, Proveedor, Proyecto, Partida, Cotizacion, AvanceObra,
} from "./types";

export const PROVEEDORES: Proveedor[] = [
  { id: "prv-acesur", nombre: "Aceros del Sur SAC", tier: "A", canal: "Lista Excel", ciudad: "Lima", diasEntrega: 4, aliado: true },
  { id: "prv-mendoza", nombre: "Distribuidora Mendoza", tier: "A", canal: "Portal web", ciudad: "Lima", diasEntrega: 6, aliado: true },
  { id: "prv-sanjudas", nombre: "Ferreteria San Judas", tier: "B", canal: "WhatsApp", ciudad: "Huancayo", diasEntrega: 2, aliado: false },
  { id: "prv-cerpuno", nombre: "Ceramicos Puno EIRL", tier: "B", canal: "WhatsApp", ciudad: "Juliaca", diasEntrega: 9, aliado: false },
];

export const INSUMOS_BASE: Insumo[] = [
  { id: "ACE01", nombre: "Acero corrugado fy=4200 grado 60", unidad: "kg", tipo: "MAT", precioBase: 4.20, precioVigente: 4.20, fuente: "lista-excel", confianza: "alta", diasDesdeVerificacion: 3, proveedorId: "prv-acesur", driver: "Chatarra y mineral de hierro + tipo de cambio", importado: false },
  { id: "CEM01", nombre: "Cemento portland tipo I, bolsa 42.5 kg", unidad: "bls", tipo: "MAT", precioBase: 27.50, precioVigente: 27.50, fuente: "lista-excel", confianza: "alta", diasDesdeVerificacion: 5, proveedorId: "prv-mendoza", driver: "Lista de precios de planta, 1 o 2 ajustes al ano", importado: false },
  { id: "AGR01", nombre: "Piedra chancada de 1/2 pulgada", unidad: "m3", tipo: "MAT", precioBase: 62.00, precioVigente: 62.00, fuente: "whatsapp", confianza: "media", diasDesdeVerificacion: 12, proveedorId: "prv-sanjudas", driver: "Flete local y precio del diesel", importado: false },
  { id: "AGR02", nombre: "Arena gruesa", unidad: "m3", tipo: "MAT", precioBase: 55.00, precioVigente: 55.00, fuente: "whatsapp", confianza: "media", diasDesdeVerificacion: 12, proveedorId: "prv-sanjudas", driver: "Flete local y precio del diesel", importado: false },
  { id: "MAD01", nombre: "Madera tornillo para encofrado", unidad: "p2", tipo: "MAT", precioBase: 6.80, precioVigente: 6.80, fuente: "whatsapp", confianza: "media", diasDesdeVerificacion: 21, proveedorId: "prv-sanjudas", driver: "Oferta local, estacional", importado: false },
  { id: "ALA01", nombre: "Alambre negro recocido N16", unidad: "kg", tipo: "MAT", precioBase: 4.60, precioVigente: 4.60, fuente: "lista-excel", confianza: "alta", diasDesdeVerificacion: 3, proveedorId: "prv-acesur", driver: "Mismo driver que el acero", importado: false },
  { id: "LAD01", nombre: "Ladrillo King Kong 18 huecos", unidad: "und", tipo: "MAT", precioBase: 0.95, precioVigente: 0.95, fuente: "portal", confianza: "alta", diasDesdeVerificacion: 7, proveedorId: "prv-mendoza", driver: "Gas natural del horno y flete", importado: false },
  { id: "CER01", nombre: "Ceramico de piso 45x45 cm", unidad: "m2", tipo: "MAT", precioBase: 28.90, precioVigente: 28.90, fuente: "whatsapp", confianza: "referencial", diasDesdeVerificacion: 34, proveedorId: "prv-cerpuno", driver: "Importado: flete maritimo y tipo de cambio", importado: true },
  { id: "PVC01", nombre: "Tuberia PVC SAP 1/2 pulgada", unidad: "m", tipo: "MAT", precioBase: 3.60, precioVigente: 3.60, fuente: "portal", confianza: "alta", diasDesdeVerificacion: 7, proveedorId: "prv-mendoza", driver: "Derivado del petroleo: Brent", importado: false },
  { id: "PVC02", nombre: "Tuberia PVC SAL 4 pulgadas", unidad: "m", tipo: "MAT", precioBase: 12.40, precioVigente: 12.40, fuente: "portal", confianza: "alta", diasDesdeVerificacion: 7, proveedorId: "prv-mendoza", driver: "Derivado del petroleo: Brent", importado: false },
  { id: "CAB01", nombre: "Cable THW 2.5 mm2", unidad: "m", tipo: "MAT", precioBase: 2.85, precioVigente: 2.85, fuente: "lista-excel", confianza: "alta", diasDesdeVerificacion: 4, proveedorId: "prv-mendoza", driver: "Cobre en la Bolsa de Metales de Londres", importado: false },
  { id: "MO01", nombre: "Operario", unidad: "hh", tipo: "MO", precioBase: 26.20, precioVigente: 26.20, fuente: "indice-inei", confianza: "alta", diasDesdeVerificacion: 30, proveedorId: "", driver: "Pliego de reclamos de construccion civil, rige desde junio", importado: false },
  { id: "MO02", nombre: "Oficial", unidad: "hh", tipo: "MO", precioBase: 21.30, precioVigente: 21.30, fuente: "indice-inei", confianza: "alta", diasDesdeVerificacion: 30, proveedorId: "", driver: "Pliego de reclamos de construccion civil", importado: false },
  { id: "MO03", nombre: "Peon", unidad: "hh", tipo: "MO", precioBase: 19.10, precioVigente: 19.10, fuente: "indice-inei", confianza: "alta", diasDesdeVerificacion: 30, proveedorId: "", driver: "Pliego de reclamos de construccion civil", importado: false },
  { id: "EQ01", nombre: "Herramientas manuales", unidad: "%mo", tipo: "EQ", precioBase: 1.00, precioVigente: 1.00, fuente: "indice-inei", confianza: "media", diasDesdeVerificacion: 30, proveedorId: "", driver: "Se calcula como porcentaje de la mano de obra", importado: false },
  { id: "COM01", nombre: "Diesel B5 para equipo y flete", unidad: "gal", tipo: "EQ", precioBase: 16.20, precioVigente: 16.20, fuente: "mercado", confianza: "alta", diasDesdeVerificacion: 1, proveedorId: "", driver: "Precio publicado por Osinergmin, se mueve cada semana", importado: false },
];

const p = (
  id: string, codigo: string, descripcion: string, unidad: string,
  metrado: number, subpresupuesto: string, avance: number,
  apu: Array<[string, number]>,
): Partida => ({
  id, codigo, descripcion, unidad, metrado, subpresupuesto, avance,
  apu: apu.map(([insumoId, cuadrilla]) => ({ insumoId, cuadrilla })),
});

const PARTIDAS_VILLA: Partida[] = [
  p("pa-01", "01.01", "Concreto f'c=210 kg/cm2 en columnas", "m3", 1524, "Estructuras", 0.72, [
    ["CEM01", 9.73], ["AGR01", 0.53], ["AGR02", 0.52], ["MO01", 1.60], ["MO02", 1.60], ["MO03", 6.40], ["EQ01", 3.20],
  ]),
  p("pa-02", "01.02", "Acero corrugado fy=4200 en columnas y vigas", "kg", 253080, "Estructuras", 0.75, [
    ["ACE01", 1.05], ["ALA01", 0.06], ["MO01", 0.032], ["MO02", 0.032], ["EQ01", 0.03],
  ]),
  p("pa-03", "01.03", "Encofrado y desencofrado de columnas", "m2", 10508, "Estructuras", 0.68, [
    ["MAD01", 4.32], ["ALA01", 0.20], ["MO01", 0.53], ["MO02", 0.53], ["EQ01", 0.55],
  ]),
  p("pa-04", "01.04", "Concreto f'c=210 kg/cm2 en losa aligerada", "m3", 2205, "Estructuras", 0.61, [
    ["CEM01", 9.73], ["AGR01", 0.53], ["AGR02", 0.52], ["MO01", 1.20], ["MO03", 5.40], ["EQ01", 2.90], ["COM01", 0.35],
  ]),
  p("pa-05", "02.01", "Muro de ladrillo King Kong, cabeza", "m2", 18944, "Arquitectura", 0.41, [
    ["LAD01", 39.00], ["CEM01", 0.22], ["AGR02", 0.03], ["MO01", 1.10], ["MO03", 0.55], ["EQ01", 1.20],
  ]),
  p("pa-06", "02.02", "Tarrajeo de muros interiores", "m2", 33152, "Arquitectura", 0.28, [
    ["CEM01", 0.14], ["AGR02", 0.02], ["MO01", 0.60], ["MO03", 0.30], ["EQ01", 0.65],
  ]),
  p("pa-07", "02.03", "Piso ceramico de 45x45 cm", "m2", 12876, "Arquitectura", 0.12, [
    ["CER01", 1.05], ["CEM01", 0.19], ["MO01", 0.65], ["MO03", 0.32], ["EQ01", 0.70],
  ]),
  p("pa-08", "03.01", "Salida de agua fria con tuberia PVC SAP", "pto", 1421, "Instalaciones sanitarias", 0.34, [
    ["PVC01", 4.20], ["MO01", 1.05], ["MO02", 0.52], ["EQ01", 1.10],
  ]),
  p("pa-09", "03.02", "Red de desague PVC SAL 4 pulgadas", "m", 4588, "Instalaciones sanitarias", 0.30, [
    ["PVC02", 1.03], ["MO01", 0.42], ["MO02", 0.21], ["EQ01", 0.45],
  ]),
  p("pa-10", "04.01", "Salida para centro de luz", "pto", 2842, "Instalaciones electricas", 0.26, [
    ["CAB01", 9.80], ["PVC01", 3.10], ["MO01", 0.95], ["MO02", 0.47], ["EQ01", 1.00],
  ]),
];

const PARTIDAS_MIRADOR: Partida[] = [
  p("pb-01", "01.01", "Concreto f'c=210 kg/cm2 en zapatas", "m3", 688, "Estructuras", 0.95, [
    ["CEM01", 8.90], ["AGR01", 0.55], ["AGR02", 0.54], ["MO01", 1.20], ["MO03", 5.20], ["EQ01", 2.60],
  ]),
  p("pb-02", "01.02", "Acero corrugado fy=4200 en zapatas y columnas", "kg", 91760, "Estructuras", 0.88, [
    ["ACE01", 1.05], ["ALA01", 0.06], ["MO01", 0.032], ["MO02", 0.032], ["EQ01", 0.03],
  ]),
  p("pb-03", "02.01", "Muro de ladrillo King Kong, soga", "m2", 8362, "Arquitectura", 0.55, [
    ["LAD01", 30.00], ["CEM01", 0.19], ["AGR02", 0.02], ["MO01", 0.95], ["MO03", 0.48], ["EQ01", 1.05],
  ]),
  p("pb-04", "04.01", "Salida para tomacorriente", "pto", 1554, "Instalaciones electricas", 0.35, [
    ["CAB01", 8.40], ["PVC01", 2.80], ["MO01", 0.90], ["MO02", 0.45], ["EQ01", 0.95],
  ]),
];

export const PROYECTOS: Proyecto[] = [
  {
    id: "prj-villa", nombre: "Villa Esperanza, etapa II", ubicacion: "Carabayllo, Lima",
    viviendas: 96, inicio: "2026-03-02", fin: "2027-01-29", ventaEstimada: 12480000,
    partidas: PARTIDAS_VILLA,
  },
  {
    id: "prj-mirador", nombre: "Mirador del Valle", ubicacion: "Huancayo, Junin",
    viviendas: 34, inicio: "2026-06-15", fin: "2027-04-10", ventaEstimada: 2545000,
    partidas: PARTIDAS_MIRADOR,
  },
];

/** Precios alternativos por proveedor: la base de la comparacion. */
export const PRECIOS_PROVEEDOR: Record<string, Record<string, number>> = {
  ACE01: { "prv-acesur": 4.20, "prv-mendoza": 4.34, "prv-sanjudas": 4.55 },
  CEM01: { "prv-mendoza": 27.50, "prv-acesur": 28.10, "prv-sanjudas": 29.20 },
  LAD01: { "prv-mendoza": 0.95, "prv-sanjudas": 1.02 },
  CER01: { "prv-cerpuno": 28.90, "prv-mendoza": 31.40 },
  CAB01: { "prv-mendoza": 2.85, "prv-acesur": 2.98, "prv-sanjudas": 3.15 },
  PVC01: { "prv-mendoza": 3.60, "prv-sanjudas": 3.85 },
  PVC02: { "prv-mendoza": 12.40, "prv-sanjudas": 13.10 },
  AGR01: { "prv-sanjudas": 62.00, "prv-mendoza": 65.50 },
  AGR02: { "prv-sanjudas": 55.00, "prv-mendoza": 58.20 },
  MAD01: { "prv-sanjudas": 6.80, "prv-mendoza": 7.15 },
  ALA01: { "prv-acesur": 4.60, "prv-sanjudas": 4.90 },
};

export const COTIZACIONES: Cotizacion[] = [
  {
    id: "cot-2026-041", fecha: "2026-09-02",
    items: [
      { insumoId: "ACE01", cantidad: 18000 },
      { insumoId: "ALA01", cantidad: 900 },
      { insumoId: "CEM01", cantidad: 1400 },
    ],
    ofertas: [
      { proveedorId: "prv-acesur", insumoId: "ACE01", precio: 4.20, diasEntrega: 4 },
      { proveedorId: "prv-mendoza", insumoId: "ACE01", precio: 4.34, diasEntrega: 6 },
      { proveedorId: "prv-sanjudas", insumoId: "ACE01", precio: 4.55, diasEntrega: 2 },
      { proveedorId: "prv-acesur", insumoId: "ALA01", precio: 4.60, diasEntrega: 4 },
      { proveedorId: "prv-sanjudas", insumoId: "ALA01", precio: 4.90, diasEntrega: 2 },
      { proveedorId: "prv-mendoza", insumoId: "CEM01", precio: 27.50, diasEntrega: 6 },
      { proveedorId: "prv-acesur", insumoId: "CEM01", precio: 28.10, diasEntrega: 4 },
      { proveedorId: "prv-sanjudas", insumoId: "CEM01", precio: 29.20, diasEntrega: 2 },
    ],
    adjudicadoA: "prv-acesur",
  },
];

export const AVANCES: AvanceObra[] = [
  { id: "av-1", periodo: "Agosto 2026", titulo: "Vaciado de losa del bloque C", partidaCodigo: "01.04", avanceReportado: 0.61, nota: "Vaciado completo. Se uso bomba por acceso restringido en el frente norte.", tono: "#8FA3B5" },
  { id: "av-2", periodo: "Agosto 2026", titulo: "Armado de acero en columnas del bloque D", partidaCodigo: "01.02", avanceReportado: 0.75, nota: "Cuadrilla de 6. Rendimiento sobre lo previsto.", tono: "#A8B6A0" },
  { id: "av-3", periodo: "Julio 2026", titulo: "Muros de albanileria, bloques A y B", partidaCodigo: "02.01", avanceReportado: 0.41, nota: "Atraso de 4 dias por llegada tardia de ladrillo.", tono: "#C2A18A" },
  { id: "av-4", periodo: "Julio 2026", titulo: "Encofrado de columnas, bloque C", partidaCodigo: "01.03", avanceReportado: 0.68, nota: "Se recupero madera del bloque B, ahorro no presupuestado.", tono: "#9DA8BD" },
];

/** Escenarios del monitor: lo que dispara la demo. */
export interface Escenario {
  id: string;
  titulo: string;
  detalle: string;
  cambios: Array<{ insumoId: string; factor: number; fuente: string }>;
}

export const ESCENARIOS: Escenario[] = [
  {
    id: "esc-acero",
    titulo: "Aceros del Sur sube el acero 8%",
    detalle: "El proveedor aliado publico su nueva lista. FARO la leyo el mismo dia.",
    cambios: [
      { insumoId: "ACE01", factor: 1.08, fuente: "lista-excel" },
      { insumoId: "ALA01", factor: 1.06, fuente: "lista-excel" },
    ],
  },
  {
    id: "esc-cobre",
    titulo: "El cobre sube 12% en la Bolsa de Metales",
    detalle: "Senal de mercado. El cableado normalmente reacciona entre 4 y 6 semanas despues.",
    cambios: [{ insumoId: "CAB01", factor: 1.09, fuente: "mercado" }],
  },
  {
    id: "esc-ceramico",
    titulo: "Ceramico importado sube 15% por flete y tipo de cambio",
    detalle: "Proveedor pequeno, respondio por WhatsApp con foto de su lista nueva.",
    cambios: [{ insumoId: "CER01", factor: 1.15, fuente: "whatsapp" }],
  },
  {
    id: "esc-diesel",
    titulo: "El diesel baja 4%",
    detalle: "Precio publicado por Osinergmin. Tambien conviene enterarse cuando baja.",
    cambios: [{ insumoId: "COM01", factor: 0.96, fuente: "mercado" }],
  },
];

export const PIE_PRESUPUESTO = {
  gastosGenerales: 0.10,
  utilidad: 0.07,
  igv: 0.18,
};
