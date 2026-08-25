import { mix, deltaE } from "../scripts/lib/color.mjs";

/**
 * Spec base16 de tinted-theming: 16 slots que dan cientos de ports gratis.
 *
 * Los 16 slots tienen que ser distinguibles entre sí: si dos colapsan, cada
 * port derivado pierde una categoría. Nuestra paleta reutiliza colores a
 * propósito (info y function pueden ser el mismo cyan), así que aquí los
 * separamos lo justo para que el slot exista, sin romper la identidad.
 */
export const extension = "yaml";
export const outDir = "base16";
export const filename = (flavor) => `spacehole-${flavor.slug}.yaml`;

const bare = (hex) => hex.replace("#", "").toLowerCase();
const MIN_DELTA = 8;

/**
 * Garantiza que cada acento sea distinguible de todos los ya asignados.
 * Compara contra la lista completa, no contra un solo vecino: en un flavor
 * monocromo el mismo color puede querer ocupar tres slots distintos.
 */
function separate(color, taken, toward) {
  let out = color;
  for (let attempt = 0; attempt < 4; attempt++) {
    if (taken.every((t) => deltaE(out, t) >= MIN_DELTA)) return out;
    out = mix(out, toward, 0.3);
  }
  return out;
}

export function render(flavor, tokens) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const dark = flavor.appearance === "dark";
  const edge = dark ? "#FFFFFF" : "#000000";

  // Los ocho acentos (08–0F) se asignan en orden, separando el que colisione.
  const accents = {};
  const push = (slot, color, toward = edge) => {
    accents[slot] = separate(color, Object.values(accents), toward);
  };
  push("base08", c.error);       // variables, borrados
  push("base09", c.constant);    // números, constantes
  push("base0A", c.type);        // clases, búsqueda
  push("base0B", c.string);      // cadenas
  push("base0D", c.function);    // funciones
  push("base0E", c.keyword);     // palabras reservadas
  push("base0C", c.info, c.fg);  // soporte, regex
  push("base0F", c.operator);    // obsoleto, delimitadores

  const palette = {
    base00: c.bg,                          // fondo por defecto
    base01: c.bgAlt,                       // fondo secundario, status bar
    base02: c.selection,                   // selección
    base03: c.muted,                       // comentarios, invisibles
    base04: c.subtext,                     // foreground apagado
    base05: c.fg,                          // foreground por defecto
    base06: mix(c.fg, c.fgBright, 0.5),    // foreground claro
    base07: dark ? c.fgBright : c.bgElevated,
    base08: accents.base08,
    base09: accents.base09,
    base0A: accents.base0A,
    base0B: accents.base0B,
    base0C: accents.base0C,
    base0D: accents.base0D,
    base0E: accents.base0E,
    base0F: accents.base0F,
  };

  const lines = [
    `system: "base16"`,
    `name: "${tokens.name} ${flavor.name}"`,
    `author: "${tokens.author} (${tokens.homepage})"`,
    `variant: "${flavor.appearance}"`,
    `palette:`,
    ...Object.entries(palette).map(([k, v]) => `  ${k}: "${bare(v)}"`),
  ];
  return lines.join("\n") + "\n";
}
