import { mix } from "../scripts/lib/color.mjs";

export const extension = "toml";
export const outDir = "alacritty";
export const filename = (flavor) => `spacehole-${flavor.slug}.toml`;

export function render(flavor, tokens) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const A = flavor.ansi;
  const bright = (n) => mix(A[n], "#FFFFFF", 0.25);

  return `# ${tokens.name} ${flavor.name} — ${flavor.tagline}
# ${tokens.homepage}

[colors.primary]
background = "${c.bg}"
foreground = "${c.fg}"
bright_foreground = "${c.fgBright}"

[colors.cursor]
text = "${c.bg}"
cursor = "${c.keyword}"

[colors.selection]
text = "${c.fgBright}"
background = "${c.selection}"

[colors.normal]
black = "${A.black}"
red = "${A.red}"
green = "${A.green}"
yellow = "${A.yellow}"
blue = "${A.blue}"
magenta = "${A.magenta}"
cyan = "${A.cyan}"
white = "${A.white}"

[colors.bright]
black = "${c.muted}"
red = "${bright("red")}"
green = "${bright("green")}"
yellow = "${bright("yellow")}"
blue = "${bright("blue")}"
magenta = "${bright("magenta")}"
cyan = "${bright("cyan")}"
white = "${c.fgBright}"
`;
}
