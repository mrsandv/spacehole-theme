import { mix } from "../scripts/lib/color.mjs";

/**
 * The mark: the shadow of a black hole.
 *
 * Three elements, all grounded in physics — none of them is decoration:
 *
 *  1. The shadow     — the dark central disk. It's the only thing a black
 *                      hole optically "is": absence.
 *  2. The photon     — the thin, bright circle where light orbits before
 *     ring             falling in. It's the real edge of the shadow.
 *  3. The accretion  — the thick outer ring. It glows ASYMMETRICALLY: the
 *     disk             side spinning toward us looks brighter because of the
 *                      relativistic Doppler effect. That asymmetry is the
 *                      brand's signature, and what sets it apart from any
 *                      circular logo.
 */
export const extension = "svg";
export const outDir = "logo";
export const filename = (flavor) => `spacehole-${flavor.slug}.svg`;

const R_DISK = 39;

/**
 * The asymmetric glow is a gradient on the stroke, not two overlapping
 * arcs: two arcs leave visible seams, and the round linecap turns the disk
 * into a horseshoe as soon as you go below 48px.
 */
export function palette(flavor) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const dark = flavor.appearance === "dark";
  return {
    // In a light flavor the hole can't be the color of the paper: it would
    // stop reading as a hole. Use the ink.
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

  // At favicon size the photon ring is noise: it's dropped, the disk gets
  // thicker, and the shadow grows with it so the hole still reads.
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
