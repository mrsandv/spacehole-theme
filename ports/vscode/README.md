![Spacehole Hawking](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-hawking.png)

**6 flavors** — 4 oscuros, 2 claros. Contraste WCAG AA verificado en cada uno.
[spacehole.tech](https://spacehole.tech)

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

1. Abre **Extensiones** (`⇧⌘X` / `Ctrl+Shift+X`)
2. Busca **Spacehole**
3. **Install**, y luego `⌘K ⌘T` / `Ctrl+K Ctrl+T` para elegir flavor

O desde la paleta de comandos:

```
ext install mrsandv.spacehole-theme
```

## Contraste verificado

Los 6 flavors cumplen **WCAG AA** en todos los roles de texto sobre su propio fondo. No es una declaración de intenciones: se verifica en cada commit y el build falla si un color no pasa.

Los acentos de sintaxis además se comparan entre sí con **ΔE perceptual** y no con contraste — dos colores pueden tener la misma luminancia y ser obviamente distintos, así que medir contraste ahí da falsos positivos.

## También para tu terminal

El mismo theme, generado desde los mismos tokens, para **iTerm2**, **Ghostty**, **Alacritty**, **Windows Terminal** y **base16** (que a su vez abre cientos de ports de la comunidad).

Todo está en el [repositorio](https://github.com/mrsandv/spacehole-theme).

## Cómo está hecho

`palette/tokens.json` es la única fuente de verdad. Un comando genera los themes, los ports de terminal, el CSS, el icono y el logo. Nada se edita a mano, así que un color cambiado se propaga a todo en el mismo commit.

Sin dependencias: Node y nada más.

## Galería

### Spacehole Hawking
Radiación neón sobre vacío. Oscuro.

![Hawking](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-hawking.png)

### Spacehole Event Horizon
Vacío y disco de acreción. Oscuro.

![Event Horizon](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-event-horizon.png)

### Spacehole Deep Void
Monocromo frío con un solo acento. Oscuro.

![Deep Void](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-deep-void.png)

### Spacehole Background Radiation
Cinta analógica, estática cósmica. Oscuro.

![Background Radiation](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-background-radiation.png)

### Spacehole Photon Sphere
Luz atrapada en órbita. Claro.

![Photon Sphere](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-photon-sphere.png)

### Spacehole White Dwarf
Carbono cristalizado, luz fría. Claro.

![White Dwarf](https://raw.githubusercontent.com/mrsandv/spacehole-theme/main/ports/preview/spacehole-white-dwarf.png)

## Licencia

MIT — [Marco Sandoval](https://spacehole.tech)
