/**
 * CSS listo para consumir desde el portfolio (Tailwind v4 + shadcn).
 *
 * Un solo archivo con los seis flavors, porque el sitio los carga todos y
 * cambia entre ellos en el cliente. Emite dos capas:
 *
 *  · --sh-*  los tokens crudos, por si un componente quiere el color exacto
 *            (el keyword del flavor, el string, el disco del logo…).
 *  · las variables que shadcn/ui ya espera, mapeadas desde esos tokens.
 *
 * También emite el @custom-variant de Tailwind, para que `dark:` siga
 * funcionando: se activa con cualquiera de los flavors oscuros.
 */
export const single = true;
export const extension = "css";
export const outDir = "css";
export const filename = "spacehole-shadcn.css";

/** tokens de Spacehole → variables que shadcn/ui ya usa. */
function shadcnVars(c) {
  return {
    background: c.bg,
    foreground: c.fg,
    card: c.bgAlt,
    "card-foreground": c.fg,
    popover: c.bgElevated,
    "popover-foreground": c.fg,
    primary: c.keyword,
    "primary-foreground": c.bg,
    secondary: c.bgAlt,
    "secondary-foreground": c.fg,
    muted: c.bgAlt,
    "muted-foreground": c.muted,
    // Ojo: shadcn usa `accent` como fondo de hover, pero este portfolio lo
    // usa como color de marca visible (`text-accent` en títulos, `bg-accent`
    // en el indicador de disponibilidad) — igual que hacía con su copper.
    // Se respeta ese uso: mandan los componentes que ya existen.
    accent: c.keyword,
    "accent-foreground": c.bg,
    destructive: c.error,
    "destructive-foreground": c.bg,
    border: c.border,
    input: c.border,
    ring: c.keyword,
    "chart-1": c.keyword,
    "chart-2": c.function,
    "chart-3": c.string,
    "chart-4": c.constant,
    "chart-5": c.type,
    sidebar: c.bgAlt,
    "sidebar-foreground": c.fg,
    "sidebar-primary": c.keyword,
    "sidebar-primary-foreground": c.bg,
    "sidebar-accent": c.bgElevated,
    "sidebar-accent-foreground": c.fg,
    "sidebar-border": c.border,
    "sidebar-ring": c.keyword,
  };
}

export function render(flavors, tokens) {
  const dark = flavors.filter((f) => f.appearance === "dark");

  const blocks = flavors.map((flavor) => {
    const c = Object.fromEntries(
      Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
    );

    const raw = Object.entries(flavor.colors)
      .map(([role, { hex, label }]) => {
        const name = role.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        return `  --sh-${name}: ${hex}; /* ${label} */`;
      })
      .join("\n");

    const mapped = Object.entries(shadcnVars(c))
      .map(([k, v]) => `  --${k}: ${v};`)
      .join("\n");

    // Un flavor se duplica en :root para que el documento tenga color válido
    // en el instante antes de que el cliente aplique el suyo. Es el fallback
    // del sitio (tokens.rootFlavor), no necesariamente el flavor de marca.
    const isRoot = (tokens.rootFlavor ?? flavors.find((f) => f.primary)?.slug) === flavor.slug;
    const selector = isRoot
      ? `:root,\n[data-theme="${flavor.slug}"]`
      : `[data-theme="${flavor.slug}"]`;

    return `/* ${flavor.name} — ${flavor.tagline} */
${selector} {
  color-scheme: ${flavor.appearance};

${raw}

${mapped}
}`;
  });

  // `dark:` de Tailwind se activa con cualquier flavor oscuro.
  const darkSelector = dark.map((f) => `[data-theme="${f.slug}"] *`).join(", ");

  // Shiki emite una variable por theme; aquí se elige la del flavor activo.
  const shiki = flavors
    .map(
      (f) => `[data-theme="${f.slug}"] .shiki,
[data-theme="${f.slug}"] .shiki span {
  color: var(--sh-shiki-${f.slug}) !important;
  background-color: var(--sh-shiki-${f.slug}-bg) !important;
}`,
    )
    .join("\n");

  return `/* ${tokens.name} — generado desde palette/tokens.json. No editar a mano.
   ${tokens.homepage} */

@custom-variant dark (&:is(${darkSelector}));

${blocks.join("\n\n")}

/* ── Shiki multi-theme ──────────────────────────────────────
   El HTML se resalta una sola vez en el servidor con los seis themes;
   cada bloque lleva una variable por flavor y aquí se activa la del
   flavor vigente. Cambiar de theme no re-renderiza nada. */
${shiki}
`;
}
