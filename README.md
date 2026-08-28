# Spacehole

Una familia de themes en seis flavors — cuatro oscuros, dos claros — para editores y terminales.

**[spacehole.tech](https://spacehole.tech)**

## Flavors

| Flavor | Modo | Rol | Peor contraste |
|---|---|---|---|
| **Hawking** | oscuro | Cara pública. Neón sobre negro absoluto. | 5.04:1 |
| **Event Horizon** | oscuro | Uso diario. Vacío y disco de acreción. | 5.31:1 |
| **Deep Void** | oscuro | Foco. Monocromo frío con un solo acento. | 4.53:1 |
| **Background Radiation** | oscuro | Nostalgia. Cinta analógica, estática cósmica. | 5.36:1 |
| **Photon Sphere** | claro | Light cálido. Contraparte de Event Horizon. | 4.69:1 |
| **White Dwarf** | claro | Light nítido. Contraparte de Deep Void. | 4.65:1 |

Los seis cumplen **WCAG AA** en todos los roles de texto, verificado en CI.

## Cómo funciona

`palette/tokens.json` es la única fuente de verdad. Todo lo que hay en `ports/`
se genera a partir de ese archivo — **nunca se edita a mano**.

```
palette/tokens.json ──> scripts/build.mjs ──> ports/
                                              ├── vscode/
                                              ├── base16/
                                              ├── css/
                                              ├── iterm2/
                                              ├── ghostty/
                                              ├── alacritty/
                                              └── windows-terminal/
```

Para cambiar un color: edítalo en `tokens.json`, corre `npm run check` y
commitea `ports/` regenerado. El CI falla si los dos no coinciden.

```bash
npm run validate   # contraste WCAG + integridad de roles
npm run build      # regenera todos los ports
npm run check      # ambos
```

No hay dependencias: Node 22+ y nada más.

## base16

`ports/base16/` sigue el spec de [tinted-theming](https://github.com/tinted-theming).
Cualquier builder de la comunidad puede tomar esos YAML y producir ports para
Vim, tmux, Kitty, Qutebrowser, i3 y muchos más sin trabajo adicional.

Los 16 slots se garantizan perceptualmente distintos: si dos roles comparten
color en un flavor (pasa en los monocromos), el generador los separa lo mínimo
para que ningún port derivado pierda una categoría.

## Instalación

**VS Code** — desde `ports/vscode/`:
```bash
cd ports/vscode && npx @vscode/vsce package && code --install-extension *.vsix
```

**iTerm2** — Preferences → Profiles → Colors → Color Presets → Import,
y elige el `.itermcolors` del flavor.

**Ghostty** — copia `ports/ghostty/spacehole-<flavor>` a
`~/.config/ghostty/themes/` y añade `theme = spacehole-<flavor>` a tu config.

**Alacritty** — importa el TOML del flavor en tu `alacritty.toml`.

**Web / shiki** — los JSON de `ports/vscode/themes/` se cargan directo:
```js
import theme from "./ports/vscode/themes/spacehole-hawking-color-theme.json";
const hl = await createHighlighter({ themes: [theme], langs: ["typescript"] });
```

## Validación

`scripts/validate.mjs` comprueba, por flavor:

1. Que no falte ni sobre ningún rol declarado.
2. Contraste ≥ 4.5:1 de cada rol de texto contra el fondo del editor.
3. Que el texto siga legible sobre paneles y popovers.
4. Que la selección no se trague el texto.
5. Que los bordes se distingan del fondo.
6. Que los acentos de sintaxis se distingan **entre sí**, medido con ΔE
   perceptual y no con contraste — dos colores pueden tener la misma
   luminancia y ser obviamente distintos.

Un flavor puede declararse `"monochrome": true` para relajar el punto 6 a
propósito, como hace Deep Void.

## Decisiones abiertas

Las que quedaron pendientes a propósito están en [NOTES.md](NOTES.md), con el
contexto para retomarlas sin reconstruir el razonamiento.

## Licencia

MIT
