import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../scripts/lib/tokens.mjs";


/**
 * VS Code package metadata: package.json, README, CHANGELOG and
 * .vscodeignore. The README is what shows on the Marketplace page, and
 * images there have to be absolute URLs — relative ones don't load.
 */
export const single = true;
export const extension = "";
export const outDir = "vscode";
export const filename = "package.json";
export const extraFiles = true;

const RAW = "https://raw.githubusercontent.com/mrsandv/spacehole-theme/main";
const REPO = "https://github.com/mrsandv/spacehole-theme";

export function render(flavors, tokens) {
  return JSON.stringify(
    {
      name: `${tokens.slug}-theme`,
      displayName: "Spacehole",
      description: `${flavors.length} flavors — four dark and two light — with verified WCAG AA contrast.`,
      version: tokens.version,
      publisher: "mrsandv",
      license: tokens.license,
      homepage: tokens.homepage,
      icon: "icon.png",
      galleryBanner: {
        // The banner uses the brand flavor's background.
        color: flavors.find((f) => f.primary)?.colors.bg.hex ?? "#000000",
        theme: "dark",
      },
      repository: { type: "git", url: `${REPO}.git` },
      bugs: { url: `${REPO}/issues` },
      engines: { vscode: "^1.80.0" },
      categories: ["Themes"],
      keywords: [
        "theme", "color-theme", "dark", "light", "dark theme", "light theme",
        "base16", "wcag", "accessible", tokens.slug,
      ],
      contributes: {
        themes: flavors.map((f) => ({
          label: `${tokens.name} ${f.name}`,
          uiTheme: f.appearance === "dark" ? "vs-dark" : "vs",
          path: `./themes/spacehole-${f.slug}-color-theme.json`,
        })),
      },
    },
    null,
    2,
  ) + "\n";
}

/** Files that go with package.json inside the package. */
export function extras(flavors, tokens) {
  const dark = flavors.filter((f) => f.appearance === "dark");
  const light = flavors.filter((f) => f.appearance === "light");

  const gallery = flavors
    .map(
      (f) => `### ${tokens.name} ${f.name}
${f.tagline}. ${f.appearance === "dark" ? "Dark" : "Light"}.

![${f.name}](${RAW}/ports/preview/spacehole-${f.slug}.png)
`,
    )
    .join("\n");

  // No logo or title at the top: the Marketplace page already shows the icon,
  // name and description right above the README. Repeating them puts two
  // logos on screen. It opens straight with the preview, which is what the
  // page doesn't show and the only thing that really sells a theme.
  const readme = `![Spacehole Hawking](${RAW}/ports/preview/spacehole-hawking.png)

**${flavors.length} flavors** — ${dark.length} dark, ${light.length} light. WCAG AA contrast verified in each one.
[spacehole.tech](${tokens.homepage})

## The flavors

| Flavor | Mode | Best for |
|---|---|---|
| **Hawking** | dark | Neon on absolute black. High impact. |
| **Event Horizon** | dark | Blue void and accretion amber. The one for long days. |
| **Deep Void** | dark | Cold monochrome with a single accent. For focus. |
| **Background Radiation** | dark | Analog tape, desaturated neon. |
| **Photon Sphere** | light | Warm, on paper. Easier on the eyes in direct sunlight. |
| **White Dwarf** | light | Cold and crisp, high contrast. |

## Install

1. Open **Extensions** (\`⇧⌘X\` / \`Ctrl+Shift+X\`)
2. Search for **Spacehole**
3. **Install**, then \`⌘K ⌘T\` / \`Ctrl+K Ctrl+T\` to pick a flavor

Or from the command palette:

\`\`\`
ext install mrsandv.spacehole-theme
\`\`\`

## Verified contrast

All ${flavors.length} flavors pass **WCAG AA** for every text role on their own background. It's not a statement of intent: it's checked on every commit, and the build fails if a color doesn't pass.

Syntax accents are also compared with each other using **perceptual ΔE** rather than contrast — two colors can have the same luminance and still be obviously different, so measuring contrast there gives false positives.

## Also for your terminal

The same theme, generated from the same tokens, for **iTerm2**, **Ghostty**, **Alacritty**, **Windows Terminal** and **base16** (which in turn unlocks hundreds of community ports).

Everything is in the [repository](${REPO}).

## How it's made

\`palette/tokens.json\` is the single source of truth. One command generates the themes, the terminal ports, the CSS, the icon and the logo. Nothing is edited by hand, so a changed color propagates everywhere in the same commit.

No dependencies: Node and nothing else.

## Gallery

${gallery}
## License

MIT — [Marco Sandoval](${tokens.homepage})
`;

  const changelog = `# Changelog

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and [SemVer](https://semver.org/).

## [${tokens.version}] — 2026-08-26

### Added

- First release with ${flavors.length} flavors: ${flavors.map((f) => f.name).join(", ")}.
- WCAG AA contrast verified in all ${flavors.length} flavors, checked in CI.
- Semantic highlighting (\`semanticHighlighting\`) enabled.
`;

  // What does NOT ship inside the .vsix.
  const ignore = `.vscode/**
.github/**
node_modules/**
*.vsix
`;

  return {
    "README.md": readme,
    "CHANGELOG.md": changelog,
    ".vscodeignore": ignore,
    "LICENSE": readFileSync(join(ROOT, "LICENSE"), "utf8"),
    // The brand logo, not the generated symbol: it's a piece of design work
    // and lives in brand/ as a file. See brand/README.md.
    "icon.png": readFileSync(join(ROOT, "brand", "icon.png")),
  };
}
