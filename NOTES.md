# Notas para el yo del futuro

Decisiones que quedaron abiertas a propósito. Cada una tiene el contexto
suficiente para retomarla en frío, sin tener que reconstruir el razonamiento.

Última revisión: 2026-08-27.

---

## El flavor de marca no coincide con el logo

**Estado:** decidido dejarlo así por ahora.

`Hawking` está marcado como `"primary": true` en `palette/tokens.json`, y de
ahí sale el color del `galleryBanner` en el Marketplace. Pero Hawking es
magenta neón, y el disco de acreción del logo es **ámbar cálido** — eso es
`Event Horizon`.

O sea: hoy el banner es el negro de Hawking y el icono es cálido. No choca,
pero tampoco es coherente del todo.

**Si algún día quieres alinearlo:** mueve `"primary": true` de `hawking` a
`event-horizon` en `tokens.json`, `npm run build`, sube la versión y vuelve a
publicar. Es un cambio de una línea.

**Lo que hay que pensar antes:** Hawking es el flavor que mejor se ve en un
screenshot, y el screenshot es como la gente descubre themes. Event Horizon es
el que la gente deja puesto ocho horas. La pregunta no es cuál es más bonito,
sino cuál quieres que sea la cara pública. Puede que la respuesta correcta sea
dejarlo como está y aceptar que el logo y el flavor estrella cuentan historias
distintas.

---

## El wordmark no está resuelto

**Estado:** pendiente, bloquea cualquier uso del wordmark fuera de la web.

En el manual de identidad quedaron cuatro lockups sin elegir:

- **A** — símbolo + "Spacehole" en horizontal (el que se usó por defecto)
- **B** — la O de "SpacehOle" es el agujero (el más memorable, pero se rompe
  en anchos chicos y pide más espacio)
- **C** — vertical, para avatares y sellos
- **D** — símbolo solo

**El problema real:** donde se ha usado el wordmark hasta ahora, la tipografía
es la del sistema (Avenir Next Condensed). Eso **no es distribuible**: en otra
máquina cae a otra fuente y el logo cambia. Para poder usarlo fuera de tu Mac
hay que fijar una fuente con licencia y convertir el texto a trazos.

Candidatas libres que encajan con el registro instrumental: **Archivo
Expanded**, **Chakra Petch**, **Familjen Grotesk**.

Ojo: esto solo aplica al wordmark. El logo del sello (`brand/icon.png`) ya
tiene el texto como imagen, así que no le afecta.

---

## base16 es la distribución barata que falta

**Estado:** generado pero sin subir. Es lo que más alcance da por menos trabajo.

`ports/base16/` ya cumple el spec de tinted-theming. Subirlo a
https://github.com/tinted-theming abre **cientos de ports de la comunidad**
—Vim, tmux, Kitty, Qutebrowser, i3— sin escribir una línea más.

Ya está resuelto el detalle difícil: los 16 slots se garantizan
perceptualmente distintos aunque un flavor reutilice colores (pasa en Deep
Void, que es monocromo a propósito). Sin eso, cada port derivado perdía una
categoría de color.

---

## Los previews del Marketplace son esquemáticos, no capturas

`ports/preview/` son ventanas de editor dibujadas: cada línea de código es una
barra del color que ese rol tendría de verdad. Se generan solas y no se quedan
desactualizadas.

Pero **una captura real de código vende más**. Si quieres subir la conversión
del Marketplace, toma capturas de VS Code con cada flavor y súbelas al README.
El costo es que hay que rehacerlas a mano cada vez que cambie un color — por
eso no se hizo así de entrada.

---

## Dependencias silenciosas que conviene recordar

**El README del Marketplace necesita que el repo sea público.** Las imágenes
apuntan a `raw.githubusercontent.com`. Si el repo pasa a privado, la página del
Marketplace se queda con las imágenes rotas y no hay aviso de ningún tipo.

**El logo vive en dos sitios.** `brand/icon.png` es copia de
`portfolio/public/android-chrome-512x512.png`. Si cambias el logo en el
portfolio, hay que copiarlo aquí y volver a publicar la extensión — no hay nada
que lo sincronice.

**`lib/flavors.ts` del portfolio duplica los colores del selector.** Es la
única duplicación consciente del sistema: si cambias un color en `tokens.json`,
regenera el CSS **y** actualiza esa lista. Se podría eliminar generando también
ese archivo desde tokens, si algún día estorba.

---

## Por qué el validador mide ΔE y no contraste

Por si el día de mañana parece complicado de más y da tentación simplificarlo.

El contraste WCAG solo mide **luminancia**. Magenta y cyan pueden dar 1.06:1
—es decir, "idénticos" según esa métrica— y ser colores obviamente distintos.
Cuando el chequeo usaba contraste para comparar acentos entre sí, escupía 21
avisos falsos.

ΔE mide distancia **perceptual**, que es lo que de verdad importa para saber si
dos roles de sintaxis se distinguen de un vistazo. Con eso los avisos bajaron a
los que eran reales.

Para el contraste **texto contra fondo** sí se usa WCAG, que ahí es la métrica
correcta. Son dos preguntas distintas y cada una tiene su herramienta.
