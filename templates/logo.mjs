import { mix } from "../scripts/lib/color.mjs";

/**
 * La marca: la sombra de un agujero negro.
 *
 * Tres elementos, todos con fundamento físico — no son adornos:
 *
 *  1. La sombra      — el disco oscuro central. Es lo único que un agujero
 *                      negro "es" ópticamente: ausencia.
 *  2. El anillo de   — la circunferencia fina y brillante donde la luz orbita
 *     fotones          antes de caer. Es el borde real de la sombra.
 *  3. El disco de    — el anillo grueso exterior. Brilla ASIMÉTRICO: el lado
 *     acreción         que gira hacia nosotros se ve más intenso por efecto
 *                      Doppler relativista. Esa asimetría es la firma de la
 *                      marca, y lo que la separa de cualquier logo circular.
 */
export const extension = "svg";
export const outDir = "logo";
export const filename = (flavor) => `spacehole-${flavor.slug}.svg`;

const R_DISK = 39;

/**
 * El brillo asimétrico se hace con un gradiente sobre el stroke, no con dos
 * arcos superpuestos: dos arcos dejan topes visibles y el linecap redondo
 * convierte el disco en una herradura en cuanto bajas de 48px.
 */
export function palette(flavor) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const dark = flavor.appearance === "dark";
  return {
    // En un flavor claro el agujero no puede ser del color del papel:
    // dejaría de leerse como agujero. Usa la tinta.
    shadow: dark ? c.bg : c.fg,
    dim: mix(c.keyword, c.bg, dark ? 0.62 : 0.5),
    mid: mix(c.keyword, c.bg, dark ? 0.25 : 0.2),
    bright: c.keyword,
    photon: c.function,
  };
}

export function symbol(flavor, { size = 120, simple = false } = {}) {
  const p = palette(flavor);
  const id = `sh-${flavor.slug}${simple ? "-s" : ""}`;

  // A tamaño de favicon el anillo de fotones es ruido: se omite, el disco
  // engorda y la sombra crece con él para que el agujero siga leyéndose.
  const width = simple ? 13 : 10;
  const rShadow = simple ? 30 : 28;
  const rPhoton = 29.4;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="Spacehole">
  <defs>
    <linearGradient id="${id}" x1="0.25" y1="0" x2="0.72" y2="1">
      <stop offset="0" stop-color="${p.dim}"/>
      <stop offset="0.42" stop-color="${p.mid}"/>
      <stop offset="1" stop-color="${p.bright}"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="${R_DISK}" fill="none" stroke="url(#${id})" stroke-width="${width}"/>
  <circle cx="60" cy="60" r="${rShadow}" fill="${p.shadow}"/>${
    simple ? "" : `
  <circle cx="60" cy="60" r="${rPhoton}" fill="none" stroke="${p.photon}" stroke-width="1.1" opacity="0.75"/>`
  }
</svg>
`;
}

export function render(flavor) {
  return symbol(flavor);
}
