/** Color utilities. No dependencies — sRGB and WCAG 2.1. */

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`Invalid hex: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

export function rgbToHex([r, g, b]) {
  const c = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

/** sRGB channel → linear. */
function linearize(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance per WCAG 2.1. */
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio. Range 1:1 – 21:1. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Conformance label for normal text. */
export function wcagLevel(ratio) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-large";
  return "FAIL";
}

/** Linear mix between two hex colors. amount 0 = a, 1 = b. */
export function mix(a, b, amount) {
  const [ra, ga, ba] = hexToRgb(a);
  const [rb, gb, bb] = hexToRgb(b);
  return rgbToHex([
    ra + (rb - ra) * amount,
    ga + (gb - ga) * amount,
    ba + (bb - ba) * amount,
  ]);
}

/** Derives the ANSI "bright" color by moving it toward white, deterministically. */
export function brighten(hex, amount = 0.3) {
  return mix(hex, "#FFFFFF", amount);
}

/** Converts hex to 0..1 per channel, for formats that need it (iTerm). */
export function toUnit(hex) {
  return hexToRgb(hex).map((c) => (c / 255).toFixed(10));
}

// ── Perceptual difference ────────────────────────────────
// WCAG contrast only measures luminance: magenta and cyan can score 1.0:1
// and still be obviously different colors. To know whether two syntax accents
// can be told apart you need perceptual distance, not brightness.

function rgbToXyz(hex) {
  const [r, g, b] = hexToRgb(hex).map(linearize);
  return [
    r * 0.4124564 + g * 0.3575761 + b * 0.1804375,
    r * 0.2126729 + g * 0.7151522 + b * 0.0721750,
    r * 0.0193339 + g * 0.1191920 + b * 0.9503041,
  ];
}

/** XYZ → CIE L*a*b* with the D65 reference white. */
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
 * ΔE CIE76. Approximate, but good enough to separate syntax roles.
 * Reference: ~2.3 is the "just noticeable" threshold; for colors that must
 * read as distinct categories at a glance we want a lot more.
 */
export function deltaE(a, b) {
  const [l1, a1, b1] = toLab(a);
  const [l2, a2, b2] = toLab(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
}
