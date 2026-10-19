/**
 * CSS ready to consume from the portfolio (Tailwind v4 + shadcn).
 *
 * A single file with all six flavors, because the site loads them all and
 * switches between them on the client. It emits two layers:
 *
 *  · --sh-*  the raw tokens, in case a component wants the exact color
 *            (the flavor's keyword, the string, the logo's disk…).
 *  · the variables shadcn/ui already expects, mapped from those tokens.
 *
 * It also emits Tailwind's @custom-variant, so `dark:` keeps working:
 * it turns on with any of the dark flavors.
 */
export const single = true;
export const extension = "css";
export const outDir = "css";
export const filename = "spacehole-shadcn.css";

/** Spacehole tokens → variables shadcn/ui already uses. */
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
    // Careful: shadcn uses `accent` as a hover background, but this portfolio
    // uses it as a visible brand color (`text-accent` in headings, `bg-accent`
    // in the availability indicator) — same as it did with its copper.
    // That usage is kept: the existing components win.
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

    // One flavor is duplicated on :root so the document has a valid color in
    // the instant before the client applies its own. It's the site's fallback
    // (tokens.rootFlavor), not necessarily the brand flavor.
    //
    // It's wrapped in :where() so its specificity is zero. Without that,
    // `:root` ties with `[data-theme="x"]` and whichever comes later in the
    // file wins: flavors declared BEFORE the fallback did nothing when
    // selected, while the ones declared after worked. The symptom is
    // confusing — "only some themes respond" — and depends on the order.
    const isRoot = (tokens.rootFlavor ?? flavors.find((f) => f.primary)?.slug) === flavor.slug;
    const selector = isRoot
      ? `:where(:root),\n[data-theme="${flavor.slug}"]`
      : `[data-theme="${flavor.slug}"]`;

    return `/* ${flavor.name} — ${flavor.tagline} */
${selector} {
  color-scheme: ${flavor.appearance};

${raw}

${mapped}
}`;
  });

  // Tailwind's `dark:` turns on with any dark flavor.
  const darkSelector = dark.map((f) => `[data-theme="${f.slug}"] *`).join(", ");

  // Shiki emits one variable per theme; this picks the active flavor's.
  const shiki = flavors
    .map(
      (f) => `[data-theme="${f.slug}"] .shiki,
[data-theme="${f.slug}"] .shiki span {
  color: var(--sh-shiki-${f.slug}) !important;
  background-color: var(--sh-shiki-${f.slug}-bg) !important;
}`,
    )
    .join("\n");

  return `/* ${tokens.name} — generated from palette/tokens.json. Do not edit by hand.
   ${tokens.homepage} */

@custom-variant dark (&:is(${darkSelector}));

${blocks.join("\n\n")}

/* ── Shiki multi-theme ──────────────────────────────────────
   The HTML is highlighted once on the server with all six themes;
   each block carries one variable per flavor, and this enables the
   active flavor's. Switching themes doesn't re-render anything. */
${shiki}
`;
}
