import type { Alerta, Insumo, Partida, Proyecto } from "./types";
import { PIE_PRESUPUESTO, PRECIOS_PROVEEDOR } from "./data";

export type MapaInsumos = Record<string, Insumo>;

export const indexar = (insumos: Insumo[]): MapaInsumos =>
  insumos.reduce<MapaInsumos>((acc, i) => { acc[i.id] = i; return acc; }, {});

/**
 * Precio unitario de una partida: la suma de cantidad por precio de cada
 * recurso de su analisis. Es la misma aritmetica que hace S10; lo unico que
 * cambia en FARO es que el precio del recurso no es un dato congelado.
 */
export function precioUnitario(
  partida: Partida,
  insumos: MapaInsumos,
  usarVigente: boolean,
): number {
  let manoObra = 0;
  let resto = 0;
  for (const linea of partida.apu) {
    const insumo = insumos[linea.insumoId];
    if (!insumo) continue;
    if (insumo.unidad === "%mo") continue; // se resuelve al final
    const precio = usarVigente ? insumo.precioVigente : insumo.precioBase;
    const parcial = linea.cuadrilla * precio;
    if (insumo.tipo === "MO") manoObra += parcial;
    else resto += parcial;
  }
  const herramienta = partida.apu.find((l) => insumos[l.insumoId]?.unidad === "%mo");
  const pctHerramienta = herramienta ? (herramienta.cuadrilla / 100) * manoObra : 0;
  return manoObra + resto + pctHerramienta;
}

export const parcial = (partida: Partida, insumos: MapaInsumos, vigente: boolean) =>
  partida.metrado * precioUnitario(partida, insumos, vigente);

export function costoDirecto(proyecto: Proyecto, insumos: MapaInsumos, vigente: boolean) {
  return proyecto.partidas.reduce((s, p) => s + parcial(p, insumos, vigente), 0);
}

export interface Presupuesto {
  costoDirecto: number;
  gastosGenerales: number;
  utilidad: number;
  subtotal: number;
  igv: number;
  total: number;
}

export function presupuesto(
  proyecto: Proyecto, insumos: MapaInsumos, vigente: boolean,
): Presupuesto {
  const cd = costoDirecto(proyecto, insumos, vigente);
  const gg = cd * PIE_PRESUPUESTO.gastosGenerales;
  const ut = cd * PIE_PRESUPUESTO.utilidad;
  const subtotal = cd + gg + ut;
  const igv = subtotal * PIE_PRESUPUESTO.igv;
  return { costoDirecto: cd, gastosGenerales: gg, utilidad: ut, subtotal, igv, total: subtotal + igv };
}

/** Cantidad total de un insumo en toda la obra: la clave para medir impacto. */
export function cantidadTotalInsumo(
  proyecto: Proyecto, insumos: MapaInsumos, insumoId: string,
): number {
  let total = 0;
  for (const p of proyecto.partidas) {
    const linea = p.apu.find((l) => l.insumoId === insumoId);
    if (!linea) continue;
    if (insumos[insumoId]?.unidad === "%mo") continue;
    total += linea.cuadrilla * p.metrado;
  }
  return total;
}

/** Cuanto pesa cada insumo dentro del costo directo. */
export function incidencias(
  proyecto: Proyecto, insumos: MapaInsumos,
): Array<{ insumoId: string; monto: number; incidencia: number; cantidad: number }> {
  const cd = costoDirecto(proyecto, insumos, false);
  const acumulado: Record<string, number> = {};
  for (const p of proyecto.partidas) {
    let manoObra = 0;
    for (const l of p.apu) {
      const ins = insumos[l.insumoId];
      if (!ins || ins.unidad === "%mo") continue;
      if (ins.tipo === "MO") manoObra += l.cuadrilla * ins.precioBase;
      acumulado[l.insumoId] = (acumulado[l.insumoId] ?? 0) + l.cuadrilla * ins.precioBase * p.metrado;
    }
    const h = p.apu.find((l) => insumos[l.insumoId]?.unidad === "%mo");
    if (h) {
      acumulado[h.insumoId] = (acumulado[h.insumoId] ?? 0) + (h.cuadrilla / 100) * manoObra * p.metrado;
    }
  }
  return Object.entries(acumulado)
    .map(([insumoId, monto]) => ({
      insumoId, monto, incidencia: cd > 0 ? monto / cd : 0,
      cantidad: cantidadTotalInsumo(proyecto, insumos, insumoId),
    }))
    .sort((a, b) => b.monto - a.monto);
}

/**
 * Genera alertas comparando el precio congelado del presupuesto contra el
 * vigente. Se ordenan por impacto en soles, nunca por porcentaje: una subida
 * de 15% en un insumo que pesa 0.3% no merece interrumpir a nadie.
 */
export function generarAlertas(
  proyecto: Proyecto, insumos: MapaInsumos, umbralSoles: number,
): Alerta[] {
  const cd = costoDirecto(proyecto, insumos, false);
  const alertas: Alerta[] = [];
  for (const insumo of Object.values(insumos)) {
    if (insumo.precioVigente === insumo.precioBase) continue;
    const cantidad = cantidadTotalInsumo(proyecto, insumos, insumo.id);
    if (cantidad === 0) continue;
    const impacto = (insumo.precioVigente - insumo.precioBase) * cantidad;
    if (Math.abs(impacto) < umbralSoles) continue;
    alertas.push({
      id: `alr-${proyecto.id}-${insumo.id}`,
      insumoId: insumo.id,
      precioAntes: insumo.precioBase,
      precioDespues: insumo.precioVigente,
      variacion: insumo.precioVigente / insumo.precioBase - 1,
      cantidadTotal: cantidad,
      impacto,
      incidencia: cd > 0 ? (insumo.precioBase * cantidad) / cd : 0,
      fuente: insumo.fuente,
      detectadaEn: "hoy",
      leida: false,
    });
  }
  return alertas.sort((a, b) => Math.abs(b.impacto) - Math.abs(a.impacto));
}

/** Alternativas de proveedor para un insumo, con el impacto de cambiarse. */
export function alternativas(
  insumoId: string, insumos: MapaInsumos, cantidad: number,
): Array<{ proveedorId: string; precio: number; delta: number }> {
  const insumo = insumos[insumoId];
  const tabla = PRECIOS_PROVEEDOR[insumoId];
  if (!insumo || !tabla) return [];
  const factor = insumo.precioVigente / insumo.precioBase;
  return Object.entries(tabla)
    .filter(([prv]) => prv !== insumo.proveedorId)
    .map(([proveedorId, precioLista]) => {
      // Un alza de mercado arrastra a todos, pero no con la misma fuerza.
      const precio = precioLista * (1 + (factor - 1) * 0.6);
      return { proveedorId, precio, delta: (precio - insumo.precioVigente) * cantidad };
    })
    .sort((a, b) => a.precio - b.precio);
}

export const soles = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(n);

export const solesExactos = (n: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 }).format(n);

export const numero = (n: number, dec = 2) =>
  new Intl.NumberFormat("es-PE", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n);

export const porcentaje = (n: number, dec = 1) =>
  `${n >= 0 ? "+" : ""}${(n * 100).toFixed(dec).replace(".", ",")}%`;
