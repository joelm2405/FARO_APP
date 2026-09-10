import React, { useMemo, useState } from "react";
import logo from "./logo.jpg";
import fotoLogin from "./images.jpg";
import MensajesObra from "./MensajesObra";
import { MENSAJES_OBRA } from "./mensajes";
import type { Alerta, Insumo, ItemCarrito, Partida, Proyecto } from "./types";
import {
  AVANCES, COTIZACIONES, ESCENARIOS, INSUMOS_BASE, PROVEEDORES, PROYECTOS,
  type Escenario,
} from "./data";
import {
  alternativas, cantidadTotalInsumo, generarAlertas, incidencias, indexar,
  numero, parcial, porcentaje, precioUnitario, presupuesto, soles, solesExactos,
} from "./engine";

type Tab = "resumen" | "catalogo" | "cotizaciones" | "presupuesto" | "alertas" | "avance" | "mensajes";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "resumen", label: "Resumen" },
  { id: "catalogo", label: "Catalogo y carrito" },
  { id: "cotizaciones", label: "Cotizaciones" },
  { id: "presupuesto", label: "Presupuesto" },
  { id: "alertas", label: "Alertas" },
  { id: "avance", label: "Avance de obra" },
  { id: "mensajes", label: "Mensajes de obra" },
];

const proveedor = (id: string) => PROVEEDORES.find((p) => p.id === id);

const FUENTE_LABEL: Record<string, string> = {
  "cotizacion": "Cotizacion adjudicada",
  "lista-excel": "Lista Excel del proveedor",
  "portal": "Portal del proveedor",
  "whatsapp": "WhatsApp del proveedor",
  "indice-inei": "Indice unificado INEI",
  "mercado": "Senal de mercado",
};

function Logo() {
  return <span className="brand-logo"><img src={logo} alt="FARO" /></span>;
}

function Marca({ tono = "#175d9d", size = 26 }: { tono?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 6.5 21h11L12 2.5Z" fill="none" stroke={tono} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="8.4" r="2.4" fill={tono} />
      <path d="M12 8.4 1.5 4.6M12 8.4l10.5-3.8" stroke={tono} strokeWidth="1.1" opacity=".55" />
    </svg>
  );
}

/* ------------------------------------------------------------------ Login */

function Login({ onEntrar }: { onEntrar: () => void }) {
  return (
    <div className="login-page">
      <header className="login-nav"><Logo /><span>Inteligencia financiera para tu obra</span><span className="chip">Innova Vivienda · Demo</span></header>
      <main className="login">
      <div className="login__beam">
        <div className="eyebrow">Una visión clara. Mejores decisiones.</div>
        <h1 className="login__lede">Tu obra avanza.<br />Tu presupuesto,<br /><em>bajo control.</em></h1>
        <p className="login__description">Transforma los cambios de precio en decisiones claras. Entiende su impacto, compara proveedores y cuida el margen de cada proyecto.</p>
        <figure className="login__photo">
          <img src={fotoLogin} alt="Equipo de construcción supervisando una obra de edificios" />
          <figcaption><span className="photo-symbol"><Marca size={23} /></span><span><strong>Cada insumo cuenta.</strong><br />Cada decisión construye.</span></figcaption>
        </figure>
      </div>
      <div className="login__panel">
        <div className="login__panel-mark"><Marca size={28} /></div>
        <div className="eyebrow">Tu espacio de trabajo</div>
        <h2>Qué bueno verte.</h2>
        <p className="sub">Ingresa y encuentra tus proyectos en un solo lugar.</p>
        <form onSubmit={(event) => { event.preventDefault(); onEntrar(); }}>
          <label className="field"><span>Correo de trabajo</span><input type="email" autoComplete="username" defaultValue="costos@constructoraandina.pe" required /></label>
          <label className="field"><span>Contraseña</span><input type="password" autoComplete="current-password" defaultValue="demo1234" required /></label>
          <button type="submit" className="btn btn--wide login__submit">Entrar a FARO <span aria-hidden="true">↗</span></button>
        </form>
        <div className="login__demo"><span className="status-dot" />Estás explorando la demo de FARO<p>Usa los datos de ejemplo para conocer la plataforma.</p></div>
        <div className="login__steps"><span>01 <b>Monitorea</b></span><span>02 <b>Compara</b></span><span>03 <b>Decide</b></span></div>
      </div>
      </main>
      <footer className="login-footer"><span>FARO · Claridad para construir mejor.</span><span>Precios → Presupuesto → Decisión</span></footer>
    </div>
  );
}

/* -------------------------------------------------------------- Proyectos */

function ListaProyectos({
  proyectos, insumos, onAbrir,
}: {
  proyectos: Proyecto[]; insumos: Record<string, Insumo>;
  onAbrir: (id: string) => void;
}) {
  return (
    <div className="content">
      <div className="section-title">
        <h2>Mis proyectos</h2>
        <span>{proyectos.length} obras activas</span>
      </div>
      <div className="grid grid--2">
        {proyectos.map((p) => {
          const base = presupuesto(p, insumos, false);
          const vig = presupuesto(p, insumos, true);
          const delta = vig.costoDirecto - base.costoDirecto;
          const avance = p.partidas.reduce((s, x) => s + x.avance * parcial(x, insumos, false), 0) / base.costoDirecto;
          return (
            <button key={p.id} className="card project-card" style={{ textAlign: "left" }} onClick={() => onAbrir(p.id)}>
              <div className="project-card__intro"><span className="eyebrow">Proyecto residencial</span><span aria-hidden="true">↗</span></div>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <h3 style={{ marginBottom: 2 }}>{p.nombre}</h3>
                <span className="chip">{p.viviendas} viviendas</span>
              </div>
              <div className="card__foot" style={{ marginTop: 0 }}>{p.ubicacion}</div>
              <div className="grid grid--kpi" style={{ marginTop: 16, gap: 12 }}>
                <div>
                  <div className="card__label">Costo directo</div>
                  <div className="num" style={{ fontSize: 19, fontWeight: 600 }}>{soles(vig.costoDirecto)}</div>
                </div>
                <div>
                  <div className="card__label">Desvio vs presupuesto</div>
                  <div className={`num ${delta > 0 ? "delta--up" : "delta--down"}`} style={{ fontSize: 19, fontWeight: 600 }}>
                    {delta === 0 ? "sin cambios" : `${delta > 0 ? "+" : ""}${soles(delta)}`}
                  </div>
                </div>
                <div>
                  <div className="card__label">Avance valorizado</div>
                  <div className="num" style={{ fontSize: 19, fontWeight: 600 }}>{(avance * 100).toFixed(0)}%</div>
                </div>
              </div>
              <div className="project-progress"><span style={{ width: `${avance * 100}%` }} /></div>
              <div className="card__foot">Explorar proyecto <span aria-hidden="true">→</span></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Curva S */

function CurvaS({ proyecto, insumos }: { proyecto: Proyecto; insumos: Record<string, Insumo> }) {
  const meses = ["Mar", "Abr", "May", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Dic"];
  const total = presupuesto(proyecto, insumos, false).costoDirecto;
  const plan = meses.map((_, i) => {
    const t = (i + 1) / meses.length;
    return total * (1 / (1 + Math.exp(-9 * (t - 0.5))));
  });
  const ejecutado = proyecto.partidas.reduce((s, p) => s + p.avance * parcial(p, insumos, false), 0);
  const hasta = 6;
  const real = plan.slice(0, hasta).map((v, i) => v * (0.94 - i * 0.012) * (ejecutado / plan[hasta - 1] || 1));
  const desvioFinal = presupuesto(proyecto, insumos, true).costoDirecto / total;
  const proj = plan.slice(hasta - 1).map((v, i) => v * (0.9 + i * 0.02) * desvioFinal);

  const W = 640, H = 210, pad = 30;
  const maxY = Math.max(...plan, ...proj) * 1.05;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (meses.length - 1);
  const y = (v: number) => H - pad - (v / maxY) * (H - pad * 2);
  const path = (arr: number[], off = 0) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i + off)},${y(v)}`).join(" ");

  return (
    <div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img"
           aria-label="Curva S de avance planificado contra ejecutado">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} className="grid-line" x1={pad} x2={W - pad} y1={y(maxY * f)} y2={y(maxY * f)} />
        ))}
        <path className="plan" d={path(plan)} />
        <path className="real" d={path(real)} />
        <path className="proj" d={path(proj, hasta - 1)} />
        {meses.map((m, i) => (
          <text key={m} x={x(i)} y={H - 8} fontSize="10" fill="#5d7488" textAnchor="middle">{m}</text>
        ))}
      </svg>
      <div className="legend">
        <span><i style={{ background: "#8ba3b8" }} />Planificado</span>
        <span><i style={{ background: "#0a1f33" }} />Ejecutado real</span>
        <span><i style={{ background: "var(--beam)" }} />Proyección con los precios de hoy</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- Resumen */

function Resumen({
  proyecto, insumos, alertas, onIrAlertas,
}: {
  proyecto: Proyecto; insumos: Record<string, Insumo>; alertas: Alerta[]; onIrAlertas: () => void;
}) {
  const base = presupuesto(proyecto, insumos, false);
  const vig = presupuesto(proyecto, insumos, true);
  const delta = vig.costoDirecto - base.costoDirecto;
  const margenBase = proyecto.ventaEstimada - base.total;
  const margenVig = proyecto.ventaEstimada - vig.total;
  const inc = incidencias(proyecto, insumos).slice(0, 6);
  const margenPct = proyecto.ventaEstimada > 0 ? margenVig / proyecto.ventaEstimada * 100 : 0;

  return (
    <div className="content">
      <div className="overview-intro"><div><div className="eyebrow">Panorama financiero</div><h2>Los números claros.<br /><em>Las decisiones, a tiempo.</em></h2></div><p>Del precio de cada insumo al margen de tu proyecto. Toda la información para decidir con perspectiva.</p></div>
      <div className="grid grid--kpi">
        <div className="card">
          <div className="card__label">Presupuesto meta, costo directo</div>
          <div className="card__value num">{soles(base.costoDirecto)}</div>
          <div className="card__foot">Precios congelados al aprobar la obra</div>
        </div>
        <div className={`card ${delta > 0 ? "card--risk" : delta < 0 ? "card--ok" : ""}`}>
          <div className="card__label">Costo directo con los precios de hoy</div>
          <div className={`card__value num ${delta !== 0 ? "changed" : ""}`}>{soles(vig.costoDirecto)}</div>
          <div className={`card__foot num ${delta > 0 ? "delta--up" : delta < 0 ? "delta--down" : ""}`}>
            {delta === 0 ? "Sin variacion" : `${delta > 0 ? "+" : ""}${solesExactos(delta)} (${porcentaje(delta / base.costoDirecto)})`}
          </div>
        </div>
        <div className="card margin-card">
          <div className="card__label">Margen proyectado</div>
          <div className="data-ring" role="img" aria-label={`Margen proyectado: ${margenPct.toFixed(1)} por ciento de la venta estimada`}>
            <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="50" className="ring-track" /><circle cx="60" cy="60" r="50" className="ring-fill" style={{ "--ring-end": 314.159 * (1 - Math.max(0, Math.min(100, margenPct)) / 100) } as React.CSSProperties} /></svg>
            <span>{margenPct.toFixed(1)}<small>%</small></span>
          </div>
          <div className="card__value num">{soles(margenVig)}</div>
          <div className="card__foot">
            {margenBase === margenVig
              ? `${((margenVig / proyecto.ventaEstimada) * 100).toFixed(1)}% sobre la venta estimada`
              : `Antes ${soles(margenBase)}, pierde ${((1 - margenVig / margenBase) * 100).toFixed(1)}%`}
          </div>
        </div>
        <div className={`card ${alertas.length ? "card--risk" : ""}`}>
          <div className="card__label">Alertas de precio activas</div>
          <div className="card__value num">{alertas.length}</div>
          <div className="card__foot">
            {alertas.length
              ? <button className="btn btn--ghost btn--sm" onClick={onIrAlertas}>Ver el impacto</button>
              : "El monitor no encontro variaciones sobre el umbral"}
          </div>
        </div>
      </div>

      <div className="grid grid--2" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Avance planificado contra ejecutado</h3>
          <CurvaS proyecto={proyecto} insumos={insumos} />
        </div>
        <div className="card">
          <h3>Insumos con mayor peso financiero</h3>
          <div className="table-scroll" role="region" aria-label="Tabla de datos; desplázate horizontalmente para ver todas las columnas" tabIndex={0}><table>
            <thead>
              <tr><th>Insumo</th><th className="r">Incidencia</th><th className="r">Monto</th></tr>
            </thead>
            <tbody>
              {inc.map((i) => (
                <tr key={i.insumoId}>
                  <td>{insumos[i.insumoId]?.nombre}</td>
                  <td className="r num">{(i.incidencia * 100).toFixed(1)}%</td>
                  <td className="r num">{soles(i.monto)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <div className="card__foot">
            Una subida de precio importa en proporcion a esta columna, no a su porcentaje.
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Catalogo */

function Catalogo({
  insumos, carrito, setCarrito, onCotizar,
}: {
  insumos: Record<string, Insumo>;
  carrito: ItemCarrito[];
  setCarrito: (c: ItemCarrito[]) => void;
  onCotizar: () => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const lista = Object.values(insumos).filter(
    (i) => i.tipo === "MAT" && i.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );
  const agregar = (id: string) => {
    const existe = carrito.find((c) => c.insumoId === id);
    setCarrito(existe
      ? carrito.map((c) => (c.insumoId === id ? { ...c, cantidad: c.cantidad + 100 } : c))
      : [...carrito, { insumoId: id, cantidad: 100 }]);
  };
  const cambiar = (id: string, cantidad: number) =>
    setCarrito(carrito.map((c) => (c.insumoId === id ? { ...c, cantidad: Math.max(0, cantidad) } : c)));
  const quitar = (id: string) => setCarrito(carrito.filter((c) => c.insumoId !== id));

  return (
    <div className="content">
      <div className="row" style={{ marginBottom: 16 }}>
        <input
          className="field" style={{ flex: 1, minWidth: 240, padding: "10px 13px", border: "1px solid var(--line)", borderRadius: 8, marginBottom: 0 }}
          placeholder="Buscar en el catalogo: acero, cemento, ceramico..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="chip">{lista.length} materiales</span>
      </div>

      <div className="grid catalog-layout">
        <div className="grid grid--cat">
          {lista.map((i) => {
            const prv = proveedor(i.proveedorId);
            return (
              <div className="item" key={i.id}>
                <div className="item__thumb">{i.unidad}</div>
                <div className="item__name">{i.nombre}</div>
                <div className="row" style={{ gap: 6 }}>
                  <span className={`chip chip--${prv?.tier === "A" ? "a" : "b"}`}>{prv?.nombre ?? "Sin proveedor"}</span>
                </div>
                <div className="item__row">
                  <div>
                    <div className="item__price num">{solesExactos(i.precioVigente)}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>por {i.unidad}</div>
                  </div>
                  <button className="btn btn--sm" onClick={() => agregar(i.id)}>Agregar</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card cart">
          <h3>Carrito de cotizacion</h3>
          {carrito.length === 0 ? (
            <div className="empty" style={{ padding: 22 }}>
              Agrega materiales y FARO pide la cotizacion a los proveedores por ti.
            </div>
          ) : (
            <>
              {carrito.map((c) => {
                const i = insumos[c.insumoId];
                return (
                  <div className="cart__line" key={c.insumoId}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13 }}>{i.nombre}</div>
                      <div className="qty" style={{ marginTop: 6 }}>
                        <button onClick={() => cambiar(c.insumoId, c.cantidad - 100)} aria-label="Restar">-</button>
                        <input className="num" value={c.cantidad}
                               onChange={(e) => cambiar(c.insumoId, Number(e.target.value) || 0)} />
                        <button onClick={() => cambiar(c.insumoId, c.cantidad + 100)} aria-label="Sumar">+</button>
                        <span style={{ fontSize: 12, color: "var(--muted)" }}>{i.unidad}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div className="num" style={{ fontWeight: 600 }}>{soles(c.cantidad * i.precioVigente)}</div>
                      <button className="btn btn--ghost btn--sm" style={{ marginTop: 6 }} onClick={() => quitar(c.insumoId)}>Quitar</button>
                    </div>
                  </div>
                );
              })}
              <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
                <span style={{ color: "var(--muted)" }}>Referencial</span>
                <span className="num" style={{ fontWeight: 600, fontSize: 18 }}>
                  {soles(carrito.reduce((s, c) => s + c.cantidad * insumos[c.insumoId].precioVigente, 0))}
                </span>
              </div>
              <button className="btn btn--beam btn--wide" style={{ marginTop: 14 }} onClick={onCotizar}>
                Pedir cotizacion a 4 proveedores
              </button>
              <div className="card__foot">
                A los grandes les llega a su portal, a los chicos por WhatsApp. Las respuestas
                vuelven normalizadas al mismo cuadro.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- Cotizaciones */

function Cotizaciones({ insumos }: { insumos: Record<string, Insumo> }) {
  const cot = COTIZACIONES[0];
  const [adjudicado, setAdjudicado] = useState(cot.adjudicadoA);
  const totalPor = (prvId: string) =>
    cot.items.reduce((s, item) => {
      const oferta = cot.ofertas.find((o) => o.proveedorId === prvId && o.insumoId === item.insumoId);
      return s + (oferta ? oferta.precio * item.cantidad : 0);
    }, 0);
  const candidatos = PROVEEDORES.filter((p) => cot.ofertas.some((o) => o.proveedorId === p.id));
  const mejor = candidatos.reduce((a, b) => (totalPor(a.id) <= totalPor(b.id) ? a : b));

  return (
    <div className="content">
      <div className="section-title">
        <h2>Cotizacion {cot.id}</h2>
        <span>enviada el {cot.fecha} a {candidatos.length} proveedores</span>
      </div>
      <div className="card">
        <div className="table-scroll" role="region" aria-label="Tabla de datos; desplázate horizontalmente para ver todas las columnas" tabIndex={0}><table>
          <thead>
            <tr>
              <th>Insumo</th><th className="r">Cantidad</th>
              {candidatos.map((p) => (
                <th key={p.id} className="r">
                  {p.nombre}<br />
                  <span className={`chip chip--${p.tier === "A" ? "a" : "b"}`}>{p.canal}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cot.items.map((item) => {
              const precios = candidatos.map((p) => cot.ofertas.find((o) => o.proveedorId === p.id && o.insumoId === item.insumoId)?.precio);
              const min = Math.min(...precios.filter((x): x is number => x != null));
              return (
                <tr key={item.insumoId}>
                  <td>{insumos[item.insumoId]?.nombre}</td>
                  <td className="r num">{numero(item.cantidad, 0)} {insumos[item.insumoId]?.unidad}</td>
                  {precios.map((pr, idx) => (
                    <td key={idx} className="r num" style={pr === min ? { color: "var(--ok)", fontWeight: 600 } : undefined}>
                      {pr != null ? solesExactos(pr) : "no cotizo"}
                    </td>
                  ))}
                </tr>
              );
            })}
            <tr className="group">
              <td colSpan={2}>Total de la orden</td>
              {candidatos.map((p) => (
                <td key={p.id} className="r num">{soles(totalPor(p.id))}</td>
              ))}
            </tr>
            <tr>
              <td colSpan={2}>Entrega</td>
              {candidatos.map((p) => <td key={p.id} className="r">{p.diasEntrega} dias</td>)}
            </tr>
            <tr>
              <td colSpan={2}></td>
              {candidatos.map((p) => (
                <td key={p.id} className="r">
                  {adjudicado === p.id
                    ? <span className="chip chip--ok">Adjudicado</span>
                    : <button className="btn btn--ghost btn--sm" onClick={() => setAdjudicado(p.id)}>Adjudicar</button>}
                </td>
              ))}
            </tr>
          </tbody>
        </table></div>
        <div className="card__foot" style={{ marginTop: 14 }}>
          El mas barato es {mejor.nombre} con {soles(totalPor(mejor.id))}. Al adjudicar, cada precio
          entra al analisis de precios unitarios de las partidas que usan ese insumo y el presupuesto
          se recalcula solo.
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ Presupuesto */

function TablaPresupuesto({
  proyecto, insumos, hayCambios,
}: { proyecto: Proyecto; insumos: Record<string, Insumo>; hayCambios: boolean }) {
  const [abierta, setAbierta] = useState<string | null>("pa-02");
  const grupos = proyecto.partidas.reduce<Record<string, Partida[]>>((acc, p) => {
    (acc[p.subpresupuesto] ??= []).push(p);
    return acc;
  }, {});
  const pres = presupuesto(proyecto, insumos, true);
  const base = presupuesto(proyecto, insumos, false);

  return (
    <div className="card" style={{ padding: 0, overflowX: "auto" }}>
      <div className="table-scroll" role="region" aria-label="Tabla de datos; desplázate horizontalmente para ver todas las columnas" tabIndex={0}><table>
        <thead>
          <tr>
            <th style={{ width: 74 }}>Item</th>
            <th>Descripcion</th>
            <th style={{ width: 54 }}>Und</th>
            <th className="r" style={{ width: 92 }}>Metrado</th>
            <th className="r" style={{ width: 108 }}>P. unitario</th>
            <th className="r" style={{ width: 128 }}>Parcial</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grupos).map(([nombre, partidas]) => (
            <React.Fragment key={nombre}>
              <tr className="group">
                <td colSpan={5}>{nombre}</td>
                <td className="r num">{soles(partidas.reduce((s, p) => s + parcial(p, insumos, true), 0))}</td>
              </tr>
              {partidas.map((p) => {
                const pu = precioUnitario(p, insumos, true);
                const puBase = precioUnitario(p, insumos, false);
                const cambio = Math.abs(pu - puBase) > 0.005;
                return (
                  <React.Fragment key={p.id}>
                    <tr className="clickable" onClick={() => setAbierta(abierta === p.id ? null : p.id)}>
                      <td className="num">{p.codigo}</td>
                      <td>{p.descripcion}</td>
                      <td>{p.unidad}</td>
                      <td className="r num">{numero(p.metrado, 0)}</td>
                      <td className={`r num ${cambio && hayCambios ? "changed" : ""}`}
                          style={cambio ? { color: pu > puBase ? "var(--risk)" : "var(--ok)", fontWeight: 600 } : undefined}>
                        {numero(pu)}
                      </td>
                      <td className={`r num ${cambio && hayCambios ? "changed" : ""}`}>{soles(p.metrado * pu)}</td>
                    </tr>
                    {abierta === p.id && (
                      <tr className="apu">
                        <td colSpan={6} style={{ padding: 0 }}>
                          <div className="table-scroll" role="region" aria-label="Tabla de datos; desplázate horizontalmente para ver todas las columnas" tabIndex={0}><table>
                            <thead>
                              <tr>
                                <th colSpan={2} style={{ paddingLeft: 26 }}>Analisis de precios unitarios</th>
                                <th className="r">Cuadrilla</th>
                                <th className="r">Precio</th>
                                <th className="r">Parcial</th>
                                <th>Fuente del precio</th>
                              </tr>
                            </thead>
                            <tbody>
                              {p.apu.map((l) => {
                                const i = insumos[l.insumoId];
                                const cambiado = i.precioVigente !== i.precioBase;
                                return (
                                  <tr key={l.insumoId}>
                                    <td colSpan={2} style={{ paddingLeft: 26 }}>
                                      <span className="num" style={{ color: "var(--muted)" }}>{i.id}</span>{"  "}{i.nombre}
                                    </td>
                                    <td className="r num">{numero(l.cuadrilla, 3)} {i.unidad}</td>
                                    <td className={`r num ${cambiado ? "changed" : ""}`}
                                        style={cambiado ? { color: "var(--risk)", fontWeight: 600 } : undefined}>
                                      {numero(i.precioVigente)}
                                    </td>
                                    <td className="r num">{numero(l.cuadrilla * i.precioVigente)}</td>
                                    <td><span className="chip">{FUENTE_LABEL[i.fuente]}</span></td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table></div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
          <tr className="group"><td colSpan={5}>Costo directo</td><td className="r num">{soles(pres.costoDirecto)}</td></tr>
          <tr><td colSpan={5}>Gastos generales, 10%</td><td className="r num">{soles(pres.gastosGenerales)}</td></tr>
          <tr><td colSpan={5}>Utilidad, 7%</td><td className="r num">{soles(pres.utilidad)}</td></tr>
          <tr><td colSpan={5}>IGV, 18%</td><td className="r num">{soles(pres.igv)}</td></tr>
          <tr className="group">
            <td colSpan={5}>Presupuesto total{base.total !== pres.total ? ` (antes ${soles(base.total)})` : ""}</td>
            <td className={`r num ${hayCambios ? "changed" : ""}`}>{soles(pres.total)}</td>
          </tr>
        </tbody>
      </table></div>
    </div>
  );
}

/* ---------------------------------------------------------------- Alertas */

function DetalleAlerta({
  alerta, proyecto, insumos, onCerrar,
}: {
  alerta: Alerta; proyecto: Proyecto; insumos: Record<string, Insumo>; onCerrar: () => void;
}) {
  const insumo = insumos[alerta.insumoId];
  const cantidad = cantidadTotalInsumo(proyecto, insumos, alerta.insumoId);
  const opciones = alternativas(alerta.insumoId, insumos, cantidad);
  const afectadas = proyecto.partidas.filter((p) => p.apu.some((l) => l.insumoId === alerta.insumoId));

  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal" style={{ width: "min(720px,100%)" }} onClick={(e) => e.stopPropagation()}>
        <h3>{insumo.nombre}</h3>
        <div className="row" style={{ gap: 18, marginBottom: 18 }}>
          <div>
            <div className="card__label">Precio</div>
            <div className="num" style={{ fontSize: 20 }}>
              {solesExactos(alerta.precioAntes)} <span style={{ color: "var(--muted)" }}>a</span>{" "}
              <strong style={{ color: alerta.impacto > 0 ? "var(--risk)" : "var(--ok)" }}>{solesExactos(alerta.precioDespues)}</strong>
            </div>
          </div>
          <div>
            <div className="card__label">Variacion</div>
            <div className="num" style={{ fontSize: 20 }}>{porcentaje(alerta.variacion)}</div>
          </div>
          <div>
            <div className="card__label">Impacto en la obra</div>
            <div className="num" style={{ fontSize: 20, color: alerta.impacto > 0 ? "var(--risk)" : "var(--ok)" }}>
              {alerta.impacto > 0 ? "+" : ""}{solesExactos(alerta.impacto)}
            </div>
          </div>
        </div>

        <p style={{ marginTop: 0, color: "var(--muted)", fontSize: 14 }}>
          La obra consume {numero(cantidad, 0)} {insumo.unidad} de este insumo, que pesa{" "}
          {(alerta.incidencia * 100).toFixed(1)}% del costo directo. {insumo.driver}.
          Detectado por {FUENTE_LABEL[alerta.fuente].toLowerCase()}.
        </p>

        <h4 style={{ margin: "18px 0 8px", fontSize: 14 }}>Si cambias de proveedor</h4>
        <div className="sim">
          <div className="sim__opt">
            <h5>Seguir con {proveedor(insumo.proveedorId)?.nombre ?? "el proveedor actual"}</h5>
            <div className="num" style={{ fontSize: 18 }}>{solesExactos(insumo.precioVigente)}</div>
            <div className="card__foot">Entrega en {proveedor(insumo.proveedorId)?.diasEntrega ?? 0} dias</div>
          </div>
          {opciones.map((o, idx) => {
            const prv = proveedor(o.proveedorId);
            return (
              <div className={`sim__opt ${idx === 0 && o.delta < 0 ? "sim__opt--best" : ""}`} key={o.proveedorId}>
                <h5>{prv?.nombre}</h5>
                <div className="num" style={{ fontSize: 18 }}>{solesExactos(o.precio)}</div>
                <div className={`card__foot num ${o.delta < 0 ? "delta--down" : "delta--up"}`}>
                  {o.delta < 0 ? "Ahorras " : "Pagas "}{soles(Math.abs(o.delta))} en la obra
                </div>
                <div className="card__foot">Entrega en {prv?.diasEntrega} dias, canal {prv?.canal.toLowerCase()}</div>
              </div>
            );
          })}
        </div>

        <h4 style={{ margin: "18px 0 8px", fontSize: 14 }}>Partidas que se recalcularon</h4>
        <div className="table-scroll" role="region" aria-label="Tabla de datos; desplázate horizontalmente para ver todas las columnas" tabIndex={0}><table>
          <thead><tr><th>Item</th><th>Descripcion</th><th className="r">P. unitario antes</th><th className="r">Ahora</th></tr></thead>
          <tbody>
            {afectadas.map((p) => (
              <tr key={p.id}>
                <td className="num">{p.codigo}</td>
                <td>{p.descripcion}</td>
                <td className="r num">{numero(precioUnitario(p, insumos, false))}</td>
                <td className="r num" style={{ fontWeight: 600 }}>{numero(precioUnitario(p, insumos, true))}</td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onCerrar}>Cerrar</button>
          <button className="btn btn--ghost" onClick={onCerrar}>Comprar ahora y congelar</button>
          <button className="btn" onClick={onCerrar}>Generar adenda de reajuste</button>
        </div>
      </div>
    </div>
  );
}

function Alertas({
  alertas, insumos, umbral, setUmbral, onAbrir,
}: {
  alertas: Alerta[]; insumos: Record<string, Insumo>;
  umbral: number; setUmbral: (n: number) => void; onAbrir: (a: Alerta) => void;
}) {
  return (
    <div className="content">
      <div className="section-title">
        <h2>Alertas de precio</h2>
        <span>ordenadas por impacto en soles, no por porcentaje</span>
        <div className="row" style={{ marginLeft: "auto", gap: 8 }}>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Avisame desde</span>
          <input className="num" style={{ width: 110, padding: "6px 10px", border: "1px solid var(--line)", borderRadius: 8 }}
                 value={umbral} onChange={(e) => setUmbral(Number(e.target.value) || 0)} />
          <span style={{ fontSize: 13, color: "var(--muted)" }}>soles de impacto</span>
        </div>
      </div>

      {alertas.length === 0 ? (
        <div className="empty">
          El monitor corrio y no encontro variaciones sobre el umbral.<br />
          Usa <strong>Ejecutar monitor</strong> arriba para ver como reacciona FARO ante un cambio de precio.
        </div>
      ) : (
        <div className="stack">
          {alertas.map((a) => {
            const i = insumos[a.insumoId];
            return (
              <div className={`alerta ${a.impacto < 0 ? "alerta--baja" : ""}`} key={a.id}>
                <div className="alerta__bar" />
                <div className="alerta__body">
                  <div className="alerta__title">
                    {i.nombre} {porcentaje(a.variacion)}
                  </div>
                  <div className="alerta__meta">
                    {solesExactos(a.precioAntes)} a {solesExactos(a.precioDespues)} por {i.unidad} ·{" "}
                    {numero(a.cantidadTotal, 0)} {i.unidad} en la obra · incidencia {(a.incidencia * 100).toFixed(1)}% ·{" "}
                    {FUENTE_LABEL[a.fuente]}
                  </div>
                </div>
                <div className="alerta__impact">
                  <div className={`n num ${a.impacto > 0 ? "delta--up" : "delta--down"}`}>
                    {a.impacto > 0 ? "+" : ""}{soles(a.impacto)}
                  </div>
                  <button className="btn btn--sm" style={{ marginTop: 8 }} onClick={() => onAbrir(a)}>Ver y decidir</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- Avance */

function Avance({ proyecto, insumos }: { proyecto: Proyecto; insumos: Record<string, Insumo> }) {
  return (
    <div className="content">
      <div className="section-title">
        <h2>Avance de obra</h2>
        <span>lo que reporta campo alimenta la curva S y la valorizacion</span>
      </div>
      <div className="grid grid--cat">
        {AVANCES.map((a) => {
          const partida = proyecto.partidas.find((p) => p.codigo === a.partidaCodigo);
          return (
            <div className="foto" key={a.id}>
              <div className="foto__img" style={{ background: a.tono }}>foto de campo</div>
              <div className="foto__body">
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.periodo} · partida {a.partidaCodigo}</div>
                <div style={{ fontWeight: 500, margin: "4px 0 6px" }}>{a.titulo}</div>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>{a.nota}</div>
                <div className="row" style={{ marginTop: 10, justifyContent: "space-between" }}>
                  <span className="chip">avance {(a.avanceReportado * 100).toFixed(0)}%</span>
                  {partida && <span className="num" style={{ fontSize: 13 }}>{soles(partida.avance * parcial(partida, insumos, true))}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Escenarios */

function ModalMonitor({ onAplicar, onCerrar }: { onAplicar: (e: Escenario) => void; onCerrar: () => void }) {
  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Ejecutar el monitor de precios</h3>
        <p style={{ marginTop: 0, color: "var(--muted)", fontSize: 14 }}>
          En produccion esto corre solo cada semana. Aca eliges que encuentra, para la demo.
        </p>
        <div className="stack">
          {ESCENARIOS.map((e) => (
            <button key={e.id} className="card" style={{ textAlign: "left" }} onClick={() => onAplicar(e)}>
              <div style={{ fontWeight: 600 }}>{e.titulo}</div>
              <div className="card__foot" style={{ marginTop: 4 }}>{e.detalle}</div>
            </button>
          ))}
        </div>
        <div className="modal__foot"><button className="btn btn--ghost" onClick={onCerrar}>Cerrar</button></div>
      </div>
    </div>
  );
}

function ModalProyecto({ onCerrar }: { onCerrar: () => void }) {
  return (
    <div className="overlay" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Crear proyecto</h3>
        <label className="field"><span>Nombre de la obra</span><input placeholder="Residencial Los Sauces, etapa I" /></label>
        <label className="field"><span>Ubicacion</span><input placeholder="Distrito, provincia" /></label>
        <label className="field"><span>Numero de viviendas</span><input className="num" placeholder="48" /></label>
        <label className="field"><span>Presupuesto de S10 en Excel</span><input type="file" /></label>
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn" onClick={onCerrar}>Crear proyecto</button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- App */

export default function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [proyectoId, setProyectoId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("resumen");
  const [insumos, setInsumos] = useState<Record<string, Insumo>>(() => indexar(INSUMOS_BASE));
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [umbral, setUmbral] = useState(8000);
  const [verMonitor, setVerMonitor] = useState(false);
  const [verNuevoProyecto, setVerNuevoProyecto] = useState(false);
  const [alertaAbierta, setAlertaAbierta] = useState<Alerta | null>(null);
  const [ultimoEscenario, setUltimoEscenario] = useState<Escenario | null>(null);
  const [mensajesRevisados, setMensajesRevisados] = useState<string[]>([]);
  const mensajesProyecto = MENSAJES_OBRA.filter(m => m.proyectoId === proyectoId)
    .sort((a, b) => Date.parse(b.enviadoEn) - Date.parse(a.enviadoEn));
  const mensajesPendientes = mensajesProyecto.filter(m => !mensajesRevisados.includes(m.id)).length;

  const proyecto = PROYECTOS.find((p) => p.id === proyectoId) ?? null;
  const hayCambios = Object.values(insumos).some((i) => i.precioVigente !== i.precioBase);

  const alertas = useMemo(
    () => (proyecto ? generarAlertas(proyecto, insumos, umbral) : []),
    [proyecto, insumos, umbral],
  );
  const principal = alertas[0];

  const aplicarEscenario = (esc: Escenario) => {
    setInsumos((prev) => {
      const next = { ...prev };
      for (const c of esc.cambios) {
        const i = next[c.insumoId];
        if (!i) continue;
        next[c.insumoId] = {
          ...i,
          precioVigente: Math.round(i.precioBase * c.factor * 100) / 100,
          fuente: c.fuente as Insumo["fuente"],
          diasDesdeVerificacion: 0,
        };
      }
      return next;
    });
    setUltimoEscenario(esc);
    setVerMonitor(false);
    setTab("resumen");
  };

  const reiniciar = () => {
    setInsumos(indexar(INSUMOS_BASE));
    setUltimoEscenario(null);
  };

  const cerrarSesion = () => {
    setAutenticado(false);
    setProyectoId(null);
    setTab("resumen");
    setVerMonitor(false);
    setVerNuevoProyecto(false);
    setAlertaAbierta(null);
    setCarrito([]);
    setMensajesRevisados([]);
    setUmbral(8000);
    reiniciar();
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (!autenticado) return <Login onEntrar={() => setAutenticado(true)} />;

  return (
    <div className="shell">
      <aside className="rail">
        <div className="rail__mark"><Logo /></div>
        <div className="rail__tagline">Claridad para construir.</div>
        <div className="rail__group rail__projects">
          <h4>Proyectos</h4>
          {PROYECTOS.map((p) => (
            <button key={p.id} className="rail__item" aria-current={p.id === proyectoId}
                    onClick={() => { setProyectoId(p.id); setTab("resumen"); }}>
              <span>{p.nombre}</span>
            </button>
          ))}
          <button className="rail__item" aria-current={proyectoId === null} onClick={() => setProyectoId(null)}>
            <span>Ver todos</span>
          </button>
        </div>
        <div className="rail__group rail__monitor">
          <h4>Monitor</h4>
          <button className="rail__item" onClick={() => setVerMonitor(true)}>
            <span>Ejecutar monitor</span>
            {alertas.length > 0 && <span className="rail__badge">{alertas.length}</span>}
          </button>
          {hayCambios && (
            <button className="rail__item" onClick={reiniciar}><span>Reiniciar precios</span></button>
          )}
        </div>
        <div className="rail__spacer" />
        <div className="rail__user">
          Constructora Andina SAC<br />
          <span style={{ color: "#6f8599" }}>costos@constructoraandina.pe</span>
        </div>
        <button className="btn btn--ghost btn--sm rail__logout" onClick={cerrarSesion}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" strokeLinecap="round" strokeLinejoin="round" /></svg>
          Cerrar sesión
        </button>
      </aside>

      <div className="main">
        {proyecto ? (
          <>
            <div className="topbar">
              <div>
                <h1>{proyecto.nombre}</h1>
                <div className="meta">
                  {proyecto.ubicacion} · {proyecto.viviendas} viviendas · {proyecto.partidas.length} partidas ·
                  del {proyecto.inicio} al {proyecto.fin}
                </div>
              </div>
              <div className="topbar__right">
                <button className="btn btn--ghost btn--sm">Exportar a S10</button>
                <button className="btn btn--beam btn--sm" onClick={() => setVerMonitor(true)}>Ejecutar monitor</button>
              </div>
            </div>

            {principal && ultimoEscenario && (
              <div className="beambar">
                <Marca size={22} />
                <div>
                  <div>
                    <strong>{insumos[principal.insumoId].nombre} {porcentaje(principal.variacion)}</strong>
                    {" — "}impacto de <strong>{solesExactos(principal.impacto)}</strong> en esta obra
                  </div>
                  <div style={{ fontSize: 13, color: "#9fb4c7" }}>
                    {ultimoEscenario.detalle} Se recalcularon {proyecto.partidas.filter((p) => p.apu.some((l) => l.insumoId === principal.insumoId)).length} partidas.
                  </div>
                </div>
                <div className="beambar__push">
                  <button className="btn btn--beam btn--sm" onClick={() => { setTab("alertas"); setAlertaAbierta(principal); }}>
                    Ver y decidir
                  </button>
                </div>
              </div>
            )}

            <div className="tabs" role="tablist">
              {TABS.map((t) => (
                <button key={t.id} className="tab" role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
                  {t.label}
                  {t.id === "alertas" && alertas.length > 0 && <span className="dot" />}
                  {t.id === "catalogo" && carrito.length > 0 && <span className="chip" style={{ marginLeft: 6 }}>{carrito.length}</span>}
                  {t.id === "mensajes" && mensajesPendientes > 0 && <span className="chip" style={{ marginLeft: 6 }} aria-label={`${mensajesPendientes} por revisar`}>{mensajesPendientes}</span>}
                </button>
              ))}
            </div>

            {tab === "resumen" && (
              <Resumen proyecto={proyecto} insumos={insumos} alertas={alertas} onIrAlertas={() => setTab("alertas")} />
            )}
            {tab === "catalogo" && (
              <Catalogo insumos={insumos} carrito={carrito} setCarrito={setCarrito} onCotizar={() => setTab("cotizaciones")} />
            )}
            {tab === "cotizaciones" && <Cotizaciones insumos={insumos} />}
            {tab === "presupuesto" && (
              <div className="content">
                <div className="section-title">
                  <h2>Presupuesto meta</h2>
                  <span>estructura de S10: subpresupuesto, partida, analisis de precios unitarios y recurso</span>
                </div>
                <TablaPresupuesto proyecto={proyecto} insumos={insumos} hayCambios={hayCambios} />
              </div>
            )}
            {tab === "alertas" && (
              <Alertas alertas={alertas} insumos={insumos} umbral={umbral} setUmbral={setUmbral} onAbrir={setAlertaAbierta} />
            )}
            {tab === "avance" && <Avance proyecto={proyecto} insumos={insumos} />}
            {tab === "mensajes" && <MensajesObra key={proyecto.id} proyecto={proyecto} mensajes={mensajesProyecto} revisados={mensajesRevisados} onRevisar={id => setMensajesRevisados(prev => prev.includes(id) ? prev : [...prev, id])} />}
          </>
        ) : (
          <>
            <div className="topbar">
              <div>
                <h1>Constructora Andina SAC</h1>
                <div className="meta">Panel de obras</div>
              </div>
              <div className="topbar__right">
                <button className="btn btn--sm" onClick={() => setVerNuevoProyecto(true)}>Crear proyecto</button>
              </div>
            </div>
            <ListaProyectos proyectos={PROYECTOS} insumos={insumos}
                            onAbrir={(id) => { setProyectoId(id); setTab("resumen"); }} />
          </>
        )}
      </div>

      {verMonitor && <ModalMonitor onAplicar={aplicarEscenario} onCerrar={() => setVerMonitor(false)} />}
      {verNuevoProyecto && <ModalProyecto onCerrar={() => setVerNuevoProyecto(false)} />}
      {alertaAbierta && proyecto && (
        <DetalleAlerta alerta={alertaAbierta} proyecto={proyecto} insumos={insumos} onCerrar={() => setAlertaAbierta(null)} />
      )}
    </div>
  );
}

