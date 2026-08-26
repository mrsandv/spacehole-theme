import { encodePng } from "../scripts/lib/png.mjs";
import { hexToRgb } from "../scripts/lib/color.mjs";
import { palette } from "./logo.mjs";

/**
 * Icono PNG para el Marketplace de VS Code y Open VSX.
 *
 * Rasteriza la misma geometría que el SVG del logo. Se dibuja a mano en vez
 * de convertir el SVG porque no hay rasterizador disponible ni en la máquina
 * ni en CI, y las herramientas de macOS añaden padding que descentra la marca.
 *
 * Las proporciones vienen del símbolo original en un lienzo de 120: la marca
 * ocupa el 75% del icono y el resto es aire, que es lo que pide el Marketplace
 * para que no se vea apretada junto a las demás extensiones.
 */
export const single = false;
export const binary = true;
export const extension = "png";
export const outDir = "icon";
export const filename = (flavor) => `spacehole-${flavor.slug}.png`;

const SIZE = 256;
const SS = 4; // supersampling por eje: 16 muestras por píxel

// Geometría del símbolo, en el espacio original de 120 unidades.
const UNIT = 120;
const R_DISK = 39;
const W_DISK = 10;
const R_SHADOW = 28;
const R_PHOTON = 29.4;

/** Interpola el gradiente del disco según la posición dentro del símbolo. */
function diskColor(t, stops) {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 1; i < stops.length; i++) {
    const [pa, ca] = stops[i - 1];
    const [pb, cb] = stops[i];
    if (clamped <= pb) {
      const k = pb === pa ? 0 : (clamped - pa) / (pb - pa);
      return [0, 1, 2].map((c) => ca[c] + (cb[c] - ca[c]) * k);
    }
  }
  return stops[stops.length - 1][1];
}

export function render(flavor) {
  const p = palette(flavor);
  const bg = hexToRgb(p.shadow);
  const shadow = hexToRgb(p.shadow);
  const photon = hexToRgb(p.photon);
  const stops = [
    [0, hexToRgb(p.dim)],
    [0.42, hexToRgb(p.mid)],
    [1, hexToRgb(p.bright)],
  ];

  // El símbolo ocupa el 75% del icono; el resto es aire.
  const scale = (SIZE * 0.75) / UNIT;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const px = new Uint8Array(SIZE * SIZE * 4);

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          // Coordenadas de la muestra en el espacio del símbolo.
          const ux = (x + (sx + 0.5) / SS - cx) / scale;
          const uy = (y + (sy + 0.5) / SS - cy) / scale;
          const dist = Math.hypot(ux, uy);

          let c = bg;
          if (Math.abs(dist - R_DISK) <= W_DISK / 2) {
            // El gradiente del SVG va de arriba-izquierda a abajo-derecha.
            const t = (ux / UNIT + 0.25 + (uy / UNIT + 0.5)) / 1.5;
            c = diskColor(t, stops);
          }
          if (dist <= R_SHADOW) {
            c = shadow;
          } else if (Math.abs(dist - R_PHOTON) <= 0.55) {
            // El anillo de fotones va al 75% de opacidad sobre lo que haya.
            c = [0, 1, 2].map((i) => c[i] + (photon[i] - c[i]) * 0.75);
          }

          r += c[0];
          g += c[1];
          b += c[2];
        }
      }

      const n = SS * SS;
      const i = (y * SIZE + x) * 4;
      px[i] = Math.round(r / n);
      px[i + 1] = Math.round(g / n);
      px[i + 2] = Math.round(b / n);
      px[i + 3] = 255;
    }
  }

  return encodePng(SIZE, SIZE, px);
}
