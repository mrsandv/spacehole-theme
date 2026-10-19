import { mix, deltaE } from "../scripts/lib/color.mjs";

/**
 * tinted-theming's base16 spec: 16 slots that unlock hundreds of free ports.
 *
 * The 16 slots must be distinguishable from each other: if two collapse,
 * every derived port loses a category. Our palette reuses colors on purpose
 * (info and function can be the same cyan), so here we separate them just
 * enough for the slot to exist, without breaking the identity.
 */
export const extension = "yaml";
export const outDir = "base16";
export const filename = (flavor) => `spacehole-${flavor.slug}.yaml`;

const bare = (hex) => hex.replace("#", "").toLowerCase();
const MIN_DELTA = 8;

/**
 * Ensures each accent is distinguishable from every one already assigned.
 * It compares against the whole list, not a single neighbor: in a monochrome
 * flavor the same color may want to fill three different slots.
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

  // The eight accents (08–0F) are assigned in order, separating any that collide.
  const accents = {};
  const push = (slot, color, toward = edge) => {
    accents[slot] = separate(color, Object.values(accents), toward);
  };
  push("base08", c.error);       // variables, deletions
  push("base09", c.constant);    // numbers, constants
  push("base0A", c.type);        // classes, search
  push("base0B", c.string);      // strings
  push("base0D", c.function);    // functions
  push("base0E", c.keyword);     // reserved words
  push("base0C", c.info, c.fg);  // support, regex
  push("base0F", c.operator);    // deprecated, delimiters

  const palette = {
    base00: c.bg,                          // default background
    base01: c.bgAlt,                       // secondary background, status bar
    base02: c.selection,                   // selection
    base03: c.muted,                       // comments, invisibles
    base04: c.subtext,                     // dimmed foreground
    base05: c.fg,                          // default foreground
    base06: mix(c.fg, c.fgBright, 0.5),    // light foreground
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
