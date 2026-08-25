import { mix } from "../scripts/lib/color.mjs";

export const extension = "";
export const outDir = "ghostty";
export const filename = (flavor) => `spacehole-${flavor.slug}`;

export function render(flavor, tokens) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const A = flavor.ansi;
  const order = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];

  const palette = [
    ...order.map((n, i) => `palette = ${i}=${A[n]}`),
    ...order.map((n, i) =>
      `palette = ${i + 8}=${i === 0 ? c.muted : mix(A[n], "#FFFFFF", 0.25)}`,
    ),
  ];

  return `# ${tokens.name} ${flavor.name} — ${flavor.tagline}
# ${tokens.homepage}
background = ${c.bg}
foreground = ${c.fg}
cursor-color = ${c.keyword}
cursor-text = ${c.bg}
selection-background = ${c.selection}
selection-foreground = ${c.fgBright}
${palette.join("\n")}
`;
}
