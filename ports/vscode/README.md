![Spacehole Hawking](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-hawking.png)

**6 flavors** — 4 dark, 2 light. WCAG AA contrast verified in each one.
[spacehole.tech](https://spacehole.tech)

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

1. Open **Extensions** (`⇧⌘X` / `Ctrl+Shift+X`)
2. Search for **Spacehole**
3. **Install**, then `⌘K ⌘T` / `Ctrl+K Ctrl+T` to pick a flavor

Or from the command palette:

```
ext install mrsandv.spacehole-theme
```

## Verified contrast

All 6 flavors pass **WCAG AA** for every text role on their own background. It's not a statement of intent: it's checked on every commit, and the build fails if a color doesn't pass.

Syntax accents are also compared with each other using **perceptual ΔE** rather than contrast — two colors can have the same luminance and still be obviously different, so measuring contrast there gives false positives.

## Also for your terminal

The same theme, generated from the same tokens, for **iTerm2**, **Ghostty**, **Alacritty**, **Windows Terminal** and **base16** (which in turn unlocks hundreds of community ports).

Everything is in the [repository](https://github.com/mrsandv/spacehole-theme).

## How it's made

`palette/tokens.json` is the single source of truth. One command generates the themes, the terminal ports, the CSS, the icon and the logo. Nothing is edited by hand, so a changed color propagates everywhere in the same commit.

No dependencies: Node and nothing else.

## Gallery

### Spacehole Hawking
Neon radiation over the void. Dark.

![Hawking](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-hawking.png)

### Spacehole Event Horizon
Void and accretion disk. Dark.

![Event Horizon](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-event-horizon.png)

### Spacehole Deep Void
Cold monochrome with a single accent. Dark.

![Deep Void](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-deep-void.png)

### Spacehole Background Radiation
Analog tape, cosmic static. Dark.

![Background Radiation](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-background-radiation.png)

### Spacehole Photon Sphere
Light trapped in orbit. Light.

![Photon Sphere](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-photon-sphere.png)

### Spacehole White Dwarf
Crystallized carbon, cold light. Light.

![White Dwarf](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-white-dwarf.png)

## License

MIT — [Marco Sandoval](https://spacehole.tech)
