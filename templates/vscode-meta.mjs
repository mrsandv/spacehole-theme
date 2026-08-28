import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "../scripts/lib/tokens.mjs";


/**
 * Metadatos del paquete de VS Code: package.json, README, CHANGELOG y
 * .vscodeignore. El README es lo que se ve en la página del Marketplace, y
 * ahí las imágenes tienen que ser URLs absolutas — las relativas no cargan.
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
      description: `${flavors.length} flavors — cuatro oscuros y dos claros — con contraste WCAG AA verificado.`,
      version: tokens.version,
      publisher: "mrsandv",
      license: tokens.license,
      homepage: tokens.homepage,
      icon: "icon.png",
      galleryBanner: {
        // El banner usa el fondo del flavor de marca.
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

/** Archivos que acompañan al package.json dentro del paquete. */
export function extras(flavors, tokens) {
  const dark = flavors.filter((f) => f.appearance === "dark");
  const light = flavors.filter((f) => f.appearance === "light");

  const gallery = flavors
    .map(
      (f) => `### ${tokens.name} ${f.name}
${f.tagline}. ${f.appearance === "dark" ? "Oscuro" : "Claro"}.

![${f.name}](${RAW}/ports/preview/spacehole-${f.slug}.png)
`,
    )
    .join("\n");

  // Sin logo ni título arriba: la página del Marketplace ya muestra el icono,
  // el nombre y la descripción justo encima del README. Repetirlos deja dos
  // logos en pantalla. Se abre directo con el preview, que es lo que la página
  // no muestra y lo único que de verdad vende un theme.
  const readme = `![Spacehole Hawking](${RAW}/ports/preview/spacehole-hawking.png)

**${flavors.length} flavors** — ${dark.length} oscuros, ${light.length} claros. Contraste WCAG AA verificado en cada uno.
[spacehole.tech](${tokens.homepage})

## Los flavors

| Flavor | Modo | Para qué |
|---|---|---|
| **Hawking** | oscuro | Neón sobre negro absoluto. Alto impacto. |
| **Event Horizon** | oscuro | Vacío azul y ámbar de acreción. El de jornada larga. |
| **Deep Void** | oscuro | Monocromo frío con un solo acento. Para concentrarse. |
| **Background Radiation** | oscuro | Cinta analógica, neón desaturado. |
| **Photon Sphere** | claro | Cálido, sobre papel. Cansa menos con sol de frente. |
| **White Dwarf** | claro | Frío y nítido, alto contraste. |

## Instalar

1. Abre **Extensiones** (\`⇧⌘X\` / \`Ctrl+Shift+X\`)
2. Busca **Spacehole**
3. **Install**, y luego \`⌘K ⌘T\` / \`Ctrl+K Ctrl+T\` para elegir flavor

O desde la paleta de comandos:

\`\`\`
ext install mrsandv.spacehole-theme
\`\`\`

## Contraste verificado

Los ${flavors.length} flavors cumplen **WCAG AA** en todos los roles de texto sobre su propio fondo. No es una declaración de intenciones: se verifica en cada commit y el build falla si un color no pasa.

Los acentos de sintaxis además se comparan entre sí con **ΔE perceptual** y no con contraste — dos colores pueden tener la misma luminancia y ser obviamente distintos, así que medir contraste ahí da falsos positivos.

## También para tu terminal

El mismo theme, generado desde los mismos tokens, para **iTerm2**, **Ghostty**, **Alacritty**, **Windows Terminal** y **base16** (que a su vez abre cientos de ports de la comunidad).

Todo está en el [repositorio](${REPO}).

## Cómo está hecho

\`palette/tokens.json\` es la única fuente de verdad. Un comando genera los themes, los ports de terminal, el CSS, el icono y el logo. Nada se edita a mano, así que un color cambiado se propaga a todo en el mismo commit.

Sin dependencias: Node y nada más.

## Galería

${gallery}
## Licencia

MIT — [Marco Sandoval](${tokens.homepage})
`;

  const changelog = `# Changelog

Este proyecto sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/)
y [SemVer](https://semver.org/lang/es/).

## [${tokens.version}] — 2026-08-26

### Añadido

- Primera publicación con ${flavors.length} flavors: ${flavors.map((f) => f.name).join(", ")}.
- Contraste WCAG AA verificado en los ${flavors.length} flavors, comprobado en CI.
- Resaltado semántico (\`semanticHighlighting\`) activo.
`;

  // Lo que NO viaja dentro del .vsix.
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
    // El logo de marca, no el símbolo generado: es obra de diseño y vive en
    // brand/ como archivo. Ver brand/README.md.
    "icon.png": readFileSync(join(ROOT, "brand", "icon.png")),
  };
}
