import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, "..", "..");

export function loadTokens() {
  const raw = readFileSync(join(ROOT, "palette", "tokens.json"), "utf8");
  return JSON.parse(raw);
}

/** Flavors ordenados por su campo `order`, con el slug incluido. */
export function flavorList(tokens) {
  return Object.entries(tokens.flavors)
    .map(([slug, flavor]) => ({ slug, ...flavor }))
    .sort((a, b) => a.order - b.order);
}

/** Atajo: mapa rol → hex, sin las etiquetas. */
export function hexes(flavor) {
  return Object.fromEntries(
    Object.entries(flavor.colors).map(([role, { hex }]) => [role, hex]),
  );
}
