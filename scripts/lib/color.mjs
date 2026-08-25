/** Utilidades de color. Sin dependencias — sRGB y WCAG 2.1. */

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Hex inválido: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function rgbToHex([r, g, b]) {
  const c = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

/** Canal sRGB → lineal. */
function linearize(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Luminancia relativa según WCAG 2.1. */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razón de contraste WCAG 2.1. Rango 1:1 – 21:1. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Etiqueta de conformidad para texto normal. */
export function wcagLevel(ratio) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "FAIL";
}

/** Mezcla lineal entre dos hex. amount 0 = a, 1 = b. */
export function mix(a, b, amount) {
  const [ra, ga, ba] = hexToRgb(a);
  const [rb, gb, bb] = hexToRgb(b);
  return rgbToHex([
    ra + (rb - ra) * amount,
    ga + (gb - ga) * amount,
    ba + (bb - ba) * amount,
  ]);
}

/** Deriva el ANSI "bright" acercando el color al blanco de forma determinista. */
export function brighten(hex, amount = 0.3) {
  return mix(hex, "#FFFFFF", amount);
}

/** Convierte hex a 0..1 por canal, para formatos que lo piden (iTerm). */
export function toUnit(hex) {
  return hexToRgb(hex).map((c) => (c / 255).toFixed(10));
}

// ── Diferencia perceptual ────────────────────────────────
// El contraste WCAG solo mide luminancia: magenta y cyan pueden dar 1.0:1
// y ser colores obviamente distintos. Para saber si dos acentos de sintaxis
// se distinguen entre sí hace falta distancia perceptual, no de brillo.

function rgbToXyz(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return [
    r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
    r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
  ];
}

/** XYZ → CIE L*a*b* con blanco de referencia D65. */
function xyzToLab([x, y, z]) {
  const [wx, wy, wz] = [0.95047, 1.0, 1.08883];
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const [fx, fy, fz] = [f(x / wx), f(y / wy), f(z / wz)];
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

export function toLab(hex) {
  return xyzToLab(rgbToXyz(hex));
}

/**
 * ΔE CIE76. Aproximado pero suficiente para separar roles de sintaxis.
 * Referencia: ~2.3 es el umbral de "apenas perceptible"; para colores que
 * deben leerse como categorías distintas de un vistazo queremos bastante más.
 */
export function deltaE(a, b) {
  const [l1, a1, b1] = toLab(a);
  const [l2, a2, b2] = toLab(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}
