#!/usr/bin/env node
/**
 * Validates the palette before generating anything.
 * Fails (exit 1) when a color doesn't pass, so CI stops it.
 */
import { loadTokens, flavorList, hexes } from "./lib/tokens.mjs";
import { contrast, wcagLevel, deltaE } from "./lib/color.mjs";

const AA = 4.5;          // normal text
const AA_UI = 3.0;       // borders and non-text elements
const SELECTION_MIN = 2.0; // text must stay readable on the selection
const ACCENT_MIN_DELTA = 18; // minimum ΔE between syntax accents
const MONOCHROME_MIN_DELTA = 8;  // monochrome flavors flatten on purpose

// Roles painted as text on the editor background.
const TEXT_ROLES = [
  "muted", "subtext", "fg", "fgBright", "keyword", "function", "string",
  "constant", "type", "operator", "error", "warning", "success", "info",
];

const tokens = loadTokens();
const requiredRoles = Object.keys(tokens.roles);
const failures = [];
const warnings = [];

for (const flavor of flavorList(tokens)) {
  const c = hexes(flavor);

  // 1. Integrity: no role can be missing or extra.
  for (const role of requiredRoles) {
    if (!c[role]) failures.push(`${flavor.slug}: missing role "${role}"`);
  }
  for (const role of Object.keys(c)) {
    if (!requiredRoles.includes(role)) {
      warnings.push(`${flavor.slug}: role "${role}" is not declared in roles{}`);
    }
  }

  // 2. Text contrast against the editor background.
  for (const role of TEXT_ROLES) {
    if (!c[role]) continue;
    const ratio = contrast(c[role], c.bg);
    if (ratio < AA) {
      failures.push(
        `${flavor.slug}: ${role} (${c[role]}) on bg → ${ratio.toFixed(2)}:1 · needs ${AA}:1`,
      );
    }
  }

  // 3. Main text must also be readable on panels and popovers.
  for (const surface of ["bgAlt", "bgElevated"]) {
    const ratio = contrast(c.fg, c[surface]);
    if (ratio < AA) {
      failures.push(
        `${flavor.slug}: fg on ${surface} → ${ratio.toFixed(2)}:1 · needs ${AA}:1`,
      );
    }
  }

  // 4. The selection can't swallow the text.
  const selRatio = contrast(c.fg, c.selection);
  if (selRatio < SELECTION_MIN) {
    failures.push(
      `${flavor.slug}: fg on selection → ${selRatio.toFixed(2)}:1 · needs ${SELECTION_MIN}:1`,
    );
  }

  // 5. Borders have to be visible against the background (not text: AA_UI).
  const borderRatio = contrast(c.border, c.bg);
  if (borderRatio < 1.2) {
    warnings.push(
      `${flavor.slug}: border almost invisible on bg → ${borderRatio.toFixed(2)}:1`,
    );
  }

  // 6. Accents must be distinguishable from each other, or the syntax flattens.
  //    Measured with perceptual ΔE, not contrast: two colors can have the
  //    same luminance (1:1 contrast) and still be obviously different.
  //    A flavor declared monochrome gives this up on purpose: its whole point
  //    is that the accents barely separate.
  const accents = ["keyword", "function", "string", "constant", "type"];
  const minDelta = flavor.monochrome ? MONOCHROME_MIN_DELTA : ACCENT_MIN_DELTA;
  for (let i = 0; i < accents.length; i++) {
    for (let j = i + 1; j < accents.length; j++) {
      const diff = deltaE(c[accents[i]], c[accents[j]]);
      if (diff < minDelta) {
        warnings.push(
          `${flavor.slug}: ${accents[i]} and ${accents[j]} are hard to tell apart · ΔE ${diff.toFixed(1)} (minimum ${minDelta})`,
        );
      }
    }
  }
}

// ── Report ──────────────────────────────────────────────
for (const flavor of flavorList(tokens)) {
  const c = hexes(flavor);
  const ratios = TEXT_ROLES.map((r) => contrast(c[r], c.bg));
  const worst = Math.min(...ratios);
  const mark = worst >= AA ? "✓" : "✗";
  console.log(
    `${mark} ${flavor.name.padEnd(22)} ${flavor.appearance.padEnd(6)} worst text ${worst.toFixed(2)}:1  ${wcagLevel(worst)}`,
  );
}

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  · ${w}`);
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} error(s):`);
  for (const f of failures) console.error(`  · ${f}`);
  process.exit(1);
}

console.log(`\n✓ ${flavorList(tokens).length} flavors · all text passes WCAG AA`);
