import { toUnit, mix } from "../scripts/lib/color.mjs";

export const extension = "itermcolors";
export const outDir = "iterm2";
export const filename = (flavor) => `Spacehole ${flavor.name}.itermcolors`;

function entry(key, hex) {
  const [r, g, b] = toUnit(hex);
  return `	<key>${key}</key>
	<dict>
		<key>Color Space</key>
		<string>sRGB</string>
		<key>Red Component</key>
		<real>${r}</real>
		<key>Green Component</key>
		<real>${g}</real>
		<key>Blue Component</key>
		<real>${b}</real>
		<key>Alpha Component</key>
		<real>1</real>
	</dict>`;
}

export function render(flavor) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const A = flavor.ansi;
  const order = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];

  const rows = [
    ...order.map((name, i) => entry(`Ansi ${i} Color`, A[name])),
    ...order.map((name, i) =>
      entry(`Ansi ${i + 8} Color`, i === 0 ? c.muted : mix(A[name], "#FFFFFF", 0.25)),
    ),
    entry("Background Color", c.bg),
    entry("Foreground Color", c.fg),
    entry("Bold Color", c.fgBright),
    entry("Cursor Color", c.keyword),
    entry("Cursor Text Color", c.bg),
    entry("Selection Color", c.selection),
    entry("Selected Text Color", c.fgBright),
    entry("Link Color", c.function),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${rows.join("\n")}
</dict>
</plist>
`;
}
