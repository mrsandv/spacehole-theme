import { encodePng } from "../scripts/lib/png.mjs";
import { hexToRgb } from "../scripts/lib/color.mjs";

/**
 * Preview de cada flavor para el README del Marketplace y el sitio.
 *
 * Es una ventana de editor esquemática: cada línea de "código" es una barra
 * del color que ese rol tendría de verdad. No sustituye a una captura real,
 * pero comunica la distribución de color del theme de un vistazo y se genera
 * sola — una captura hay que rehacerla a mano cada vez que cambia un color.
 *
 * Se dibuja con rectángulos porque rasterizar texto exigiría embeber una
 * fuente y un motor de glifos, que es justo la dependencia que este repo evita.
 */
export const binary = true;
export const extension = "png";
export const outDir = "preview";
export const filename = (flavor) => `spacehole-${flavor.slug}.png`;

const W = 800;
const H = 420;
const SIDEBAR = 148;
const TITLEBAR = 34;

/** Estructura de un archivo real: indentación, longitud y rol por token. */
const LINES = [
  [[0, 8, "muted"], [9, 30, "muted"]],
  [],
  [[0, 6, "keyword"], [7, 5, "operator"], [13, 9, "function"], [23, 4, "operator"], [28, 22, "string"]],
  [[0, 6, "keyword"], [7, 4, "operator"], [12, 12, "constant"]],
  [],
  [[0, 8, "keyword"], [9, 8, "type"], [18, 2, "operator"]],
  [[2, 3, "keyword"], [6, 11, "function"], [17, 2, "operator"], [20, 14, "fg"]],
  [[4, 6, "keyword"], [11, 16, "string"]],
  [[2, 1, "operator"]],
  [],
  [[0, 6, "keyword"], [7, 9, "function"], [16, 1, "operator"], [18, 7, "fg"], [25, 2, "operator"], [28, 6, "type"], [34, 2, "operator"]],
  [[2, 5, "muted"], [8, 26, "muted"]],
  [[2, 6, "keyword"], [9, 4, "fg"], [13, 1, "operator"], [15, 12, "function"], [27, 2, "operator"]],
  [[4, 4, "fg"], [8, 1, "operator"], [10, 9, "constant"], [19, 1, "operator"]],
  [[4, 6, "fg"], [10, 1, "operator"], [12, 13, "string"], [25, 1, "operator"]],
  [[2, 2, "operator"]],
  [[0, 1, "operator"]],
  [],
  [[0, 6, "keyword"], [7, 12, "function"], [19, 2, "operator"], [22, 9, "constant"]],
];

const CH = 7.2;   // ancho de carácter
const LH = 15;    // alto de línea
const BAR = 7;    // grosor de la barra

export function render(flavor) {
  const hex = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const rgb = Object.fromEntries(
    Object.entries(hex).map(([k, v]) => [k, hexToRgb(v)]),
  );

  const px = new Uint8Array(W * H * 4);

  const fill = (x0, y0, w, h, color, alpha = 1) => {
    for (let y = Math.max(0, y0 | 0); y < Math.min(H, (y0 + h) | 0); y++) {
      for (let x = Math.max(0, x0 | 0); x < Math.min(W, (x0 + w) | 0); x++) {
        const i = (y * W + x) * 4;
        px[i] = px[i] + (color[0] - px[i]) * alpha;
        px[i + 1] = px[i + 1] + (color[1] - px[i + 1]) * alpha;
        px[i + 2] = px[i + 2] + (color[2] - px[i + 2]) * alpha;
        px[i + 3] = 255;
      }
    }
  };

  fill(0, 0, W, H, rgb.bg);
  fill(0, 0, SIDEBAR, H, rgb.bgAlt);
  fill(0, 0, W, TITLEBAR, rgb.bgAlt);
  fill(SIDEBAR, 0, 1, H, rgb.border);
  fill(0, TITLEBAR, W, 1, rgb.border);

  // Semáforo de la barra de título.
  for (const [i, role] of ["error", "warning", "success"].entries()) {
    const cx = 18 + i * 18;
    const cy = TITLEBAR / 2;
    for (let y = cy - 5; y <= cy + 5; y++) {
      for (let x = cx - 5; x <= cx + 5; x++) {
        if ((x - cx) ** 2 + (y - cy) ** 2 <= 25) fill(x, y, 1, 1, rgb[role]);
      }
    }
  }

  // Árbol de archivos: barras tenues, una destacada como archivo abierto.
  for (let i = 0; i < 11; i++) {
    const y = TITLEBAR + 22 + i * 22;
    const indent = i === 0 ? 0 : 12;
    const active = i === 4;
    if (active) fill(0, y - 6, SIDEBAR, 20, rgb.bgElevated);
    fill(16 + indent, y, 60 + ((i * 23) % 46), 6, active ? rgb.fg : rgb.muted, active ? 1 : 0.55);
  }

  // Cuerpo del editor.
  const top = TITLEBAR + 26;
  const left = SIDEBAR + 46;
  LINES.forEach((tokens, i) => {
    const y = top + i * LH;
    if (y + BAR > H - 10) return;

    // Números de línea.
    fill(SIDEBAR + 18, y + 1, 12, 5, rgb.subtext, 0.5);

    for (const [col, len, role] of tokens) {
      fill(left + col * CH, y, len * CH, BAR, rgb[role] ?? rgb.fg);
    }
  });

  // Cursor sobre la línea activa.
  const cursorY = top + 6 * LH;
  fill(SIDEBAR + 1, cursorY - 4, W - SIDEBAR - 1, LH, rgb.bgAlt, 0.5);
  fill(left + 34 * CH, cursorY - 2, 2, BAR + 4, rgb.keyword);

  return encodePng(W, H, px);
}
