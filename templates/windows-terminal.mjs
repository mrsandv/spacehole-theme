import { mix } from "../scripts/lib/color.mjs";

export const extension = "json";
export const outDir = "windows-terminal";
export const filename = (flavor) => `spacehole-${flavor.slug}.json`;

export function render(flavor, tokens) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const A = flavor.ansi;
  const bright = (n) => mix(A[n], "#FFFFFF", 0.25);

  return {
    name: `${tokens.name} ${flavor.name}`,
    background: c.bg,
    foreground: c.fg,
    cursorColor: c.keyword,
    selectionBackground: c.selection,
    black: A.black, red: A.red, green: A.green, yellow: A.yellow,
    blue: A.blue, purple: A.magenta, cyan: A.cyan, white: A.white,
    brightBlack: c.muted,
    brightRed: bright("red"), brightGreen: bright("green"),
    brightYellow: bright("yellow"), brightBlue: bright("blue"),
    brightPurple: bright("magenta"), brightCyan: bright("cyan"),
    brightWhite: c.fgBright,
  };
}
