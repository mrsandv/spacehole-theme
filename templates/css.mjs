/** Custom properties for consuming the palette from the portfolio. */
export const extension = "css";
export const outDir = "css";
export const filename = (flavor) => `spacehole-${flavor.slug}.css`;

export function render(flavor, tokens) {
  const vars = Object.entries(flavor.colors)
    .map(([role, { hex, label }]) => {
      const name = role.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      return `  --sh-${name}: ${hex}; /* ${label} */`;
    })
    .join("\n");

  const ansi = Object.entries(flavor.ansi)
    .map(([name, hex]) => `  --sh-ansi-${name}: ${hex};`)
    .join("\n");

  return `/* ${tokens.name} ${flavor.name} — ${flavor.tagline}
   Generated from palette/tokens.json. Do not edit by hand. */
[data-theme="spacehole-${flavor.slug}"] {
  color-scheme: ${flavor.appearance};
${vars}

${ansi}
}
`;
}
