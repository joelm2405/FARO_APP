# FARO — prototipo frontend (React + TypeScript)

## Correrlo

Abre `../index.html` directamente en el navegador. También se genera
una copia idéntica en esta carpeta y en la raíz del workspace. Las imágenes, fuentes y código están
incluidos en el HTML; la demo no necesita conexión a internet.

Para modificar y volver a compilar, desde `proyecto-src`:

    npm install
    npm run check
    npm run build

El login es demostrativo y usa datos de ejemplo, sin autenticación real.

Para publicar la demo estática, coloca `index.html` en la raíz de la carpeta
que publiques. El archivo incluye todos los recursos necesarios.

## Identidad visual

Cada proyecto incluye la pestaña **Mensajes de obra**: texto original del maestro,
fecha y remitente, con filtro de pendientes y marcado como revisado durante la
sesión (se reinicia al recargar). Los ejemplos están en `mensajes.ts`, separados
por `proyectoId`. El bot previsto solo retransmite mensajes; esta demo no conecta
con WhatsApp ni modifica presupuestos o avances a partir del texto recibido.

Estilo de vidrio esmerilado basado en `prompstyle`, adaptado al azul y celeste
de `logo.jpg`. El login utiliza `images.jpg`. Las fuentes DM Sans y DM Serif
Display se incluyen localmente, con sus licencias OFL en `fonts/`.
Los estilos contemplan móviles, foco de teclado y movimiento reducido.
El rediseño conserva los datos, cálculos y funcionalidades del prototipo;
no agrega un backend ni una integración real con S10.

## Archivos

- `types.ts` — modelo de datos: insumo, partida, APU, proveedor, cotizacion, alerta.
- `data.ts` — 16 insumos con precios peruanos, 4 proveedores (2 grandes con lista
  Excel o portal, 2 chicos por WhatsApp), 2 obras con 14 partidas y su APU, y los
  4 escenarios del monitor.
- `engine.ts` — el motor: precio unitario, presupuesto con pie, incidencia por
  insumo, alertas ordenadas por impacto en soles y comparacion de proveedores.
  Es la misma aritmetica de S10, sin licencia.
- `App.tsx` — login, proyectos, resumen con curva S, catalogo con carrito,
  cuadro comparativo, presupuesto con APU desplegable, alertas con simulacion,
  avance de obra.
- `styles.css` — sistema visual completo, responsive.

## El momento de la demo

Boton **Ejecutar monitor**, escenario "Aceros del Sur sube el acero 8%".
Aparece la barra de alerta con el impacto real (S/ 90,350 en Villa Esperanza),
el costo directo se recalcula y en Presupuesto los precios unitarios de las
partidas con acero cambian de color. Abre una partida para ver el APU con el
precio nuevo y su fuente.
