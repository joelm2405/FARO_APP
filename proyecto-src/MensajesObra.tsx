import React, { useState } from "react";
import type { MensajeObra, Proyecto } from "./types";

const fecha = (iso: string) => new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima",
}).format(new Date(iso));

export default function MensajesObra({ proyecto, mensajes, revisados, onRevisar }: {
  proyecto: Proyecto; mensajes: MensajeObra[]; revisados: string[];
  onRevisar: (id: string) => void;
}) {
  const [soloPendientes, setSoloPendientes] = useState(false);
  const pendientes = mensajes.filter(m => !revisados.includes(m.id));
  const visibles = soloPendientes ? pendientes : mensajes;
  return (
    <section className="content" aria-label="Mensajes del maestro de obra">
      <div className="overview-intro">
        <div><div className="eyebrow">Comunicación desde campo</div><h2>La voz de tu obra,<br /><em>en un solo lugar.</em></h2></div>
        <p>Mensajes del maestro de obra enviados al bot de WhatsApp y retransmitidos a este proyecto.</p>
      </div>
      <div className="messages-layout">
        <div>
          <div className="messages-toolbar">
            <div><h3>Mensajes del maestro de obra</h3><span className="card__foot">{mensajes.length} mensajes · {pendientes.length} por revisar</span></div>
            <button className="btn btn--ghost btn--sm" aria-pressed={soloPendientes} onClick={() => setSoloPendientes(!soloPendientes)}>{soloPendientes ? "Ver todos" : "Solo por revisar"}</button>
          </div>
          <div className="stack">
            {visibles.map(m => {
              const revisado = revisados.includes(m.id);
              return (
                <article className={`card obra-message ${revisado ? "" : "obra-message--new"}`} key={m.id}>
                  <header className="obra-message__header">
                    <span className="message-avatar" aria-hidden="true">{m.remitente.split(" ").map(n => n[0]).join("")}</span>
                    <div><strong>{m.remitente}</strong><div className="card__foot">Maestro de obra · {proyecto.nombre}</div></div>
                    <span className={`chip ${revisado ? "" : "chip--a"}`}>{revisado ? "Revisado" : "Por revisar"}</span>
                  </header>
                  <p className="obra-message__text">{m.texto}</p>
                  <footer className="obra-message__footer">
                    <div><span className="message-source">WhatsApp · Texto original</span><time dateTime={m.enviadoEn}>{fecha(m.enviadoEn)} · Lima</time></div>
                    {!revisado && <button className="btn btn--ghost btn--sm" onClick={() => onRevisar(m.id)}>Marcar como revisado</button>}
                  </footer>
                </article>
              );
            })}
            {visibles.length === 0 && <div className="empty">{soloPendientes ? "Estás al día. No hay mensajes por revisar." : "Todavía no hay mensajes del maestro de obra en este proyecto."}</div>}
          </div>
        </div>
        <aside className="card messages-guide">
          <div className="eyebrow">De WhatsApp a FARO</div>
          <h3>Lo que ocurre en campo.</h3>
          <p>El maestro comunica cambios de precio, retrasos, avances o cualquier novedad de la obra.</p>
          <ol><li><strong>El maestro escribe</strong><span>Envía su mensaje por WhatsApp.</span></li><li><strong>El bot lo transmite</strong><span>Conserva el texto original del mensaje.</span></li><li><strong>Tu equipo lo revisa</strong><span>Encuentra la novedad en el proyecto correspondiente.</span></li></ol>
          <div className="messages-demo"><span className="chip">Demostración</span><p>Estos mensajes son ejemplos. La conexión con WhatsApp está pendiente.</p></div>
          <p className="card__foot">Revisar un mensaje no modifica el presupuesto ni el avance registrado.</p>
        </aside>
      </div>
    </section>
  );
}
