# Spacehole

A family of themes in six flavors — four dark, two light — for editors and terminals.

**[spacehole.tech](https://spacehole.tech)**

## Flavors

| Flavor | Mode | Role | Worst contrast |
|---|---|---|---|
| **Hawking** | dark | Public face. Neon on absolute black. | 5.04:1 |
| **Event Horizon** | dark | Daily use. Void and accretion disk. | 5.31:1 |
| **Deep Void** | dark | Focus. Cold monochrome with a single accent. | 4.53:1 |
| **Background Radiation** | dark | Nostalgia. Analog tape, cosmic static. | 5.36:1 |
| **Photon Sphere** | light | Warm light. Counterpart to Event Horizon. | 4.69:1 |
| **White Dwarf** | light | Crisp light. Counterpart to Deep Void. | 4.65:1 |

All six pass **WCAG AA** for every text role, verified in CI.

## How it works

`palette/tokens.json` is the single source of truth. Everything in `ports/`
is generated from that file — **never edited by hand**.

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

To change a color: edit it in `tokens.json`, run `npm run check` and commit
the regenerated `ports/`. CI fails if the two don't match.

```bash
npm run validate   # WCAG contrast + role integrity
npm run build      # regenerates every port
npm run check      # both
```

No dependencies: Node 22+ and nothing else.

## base16

`ports/base16/` follows the [tinted-theming](https://github.com/tinted-theming) spec.
Any community builder can take those YAML files and produce ports for Vim,
tmux, Kitty, Qutebrowser, i3 and many more with no extra work.

The 16 slots are guaranteed to be perceptually distinct: if two roles share a
color in a flavor (it happens in the monochrome ones), the generator separates
them just enough so no derived port loses a category.

## Installation

**VS Code** — from `ports/vscode/`:
```bash
cd ports/vscode && npx @vscode/vsce package && code --install-extension *.vsix
```

**iTerm2** — Preferences → Profiles → Colors → Color Presets → Import,
and pick the flavor's `.itermcolors`.

**Ghostty** — copy `ports/ghostty/spacehole-<flavor>` to
`~/.config/ghostty/themes/` and add `theme = spacehole-<flavor>` to your config.

**Alacritty** — import the flavor's TOML in your `alacritty.toml`.

**Web / shiki** — the JSON files in `ports/vscode/themes/` load directly:
```js
import theme from "./ports/vscode/themes/spacehole-hawking-color-theme.json";
const hl = await createHighlighter({ themes: [theme], langs: ["typescript"] });
```

## Validation

`scripts/validate.mjs` checks, per flavor:

1. That no declared role is missing or extra.
2. Contrast ≥ 4.5:1 for every text role against the editor background.
3. That text stays readable on panels and popovers.
4. That the selection doesn't swallow the text.
5. That borders stand out from the background.
6. That syntax accents are distinguishable **from each other**, measured with
   perceptual ΔE rather than contrast — two colors can have the same
   luminance and still be obviously different.

A flavor can declare `"monochrome": true` to relax point 6 on purpose, as
Deep Void does.

## Open decisions

The ones left open on purpose are in [NOTES.md](NOTES.md), with the context
needed to pick them up without rebuilding the reasoning.

## License

MIT
