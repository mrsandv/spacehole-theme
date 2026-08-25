#!/usr/bin/env node
/**
 * Valida la paleta antes de generar nada.
 * Truena (exit 1) si un color no cumple, para que CI lo detenga.
 */
import { loadTokens, flavorList, hexes } from "./lib/tokens.mjs";
import { contrast, wcagLevel, deltaE } from "./lib/color.mjs";

const AA = 4.5;          // texto normal
const AA_UI = 3.0;       // bordes y elementos no textuales
const SELECTION_MIN = 2.0; // el texto debe seguir leyéndose sobre la selección
const ACCENT_MIN_DELTA = 18; // ΔE mínimo entre acentos de sintaxis
const MONOCHROME_MIN_DELTA = 8;  // los flavors monocromos aplanan a propósito

// Roles que se pintan como texto sobre el fondo del editor.
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

  // 1. Integridad: ningún rol puede faltar ni sobrar.
  for (const role of requiredRoles) {
    if (!c[role]) failures.push(`${flavor.slug}: falta el rol "${role}"`);
  }
  for (const role of Object.keys(c)) {
    if (!requiredRoles.includes(role)) {
      warnings.push(`${flavor.slug}: rol "${role}" no está declarado en roles{}`);
    }
  }

  // 2. Contraste de texto contra el fondo del editor.
  for (const role of TEXT_ROLES) {
    if (!c[role]) continue;
    const ratio = contrast(c[role], c.bg);
    if (ratio < AA) {
      failures.push(
        `${flavor.slug}: ${role} (${c[role]}) sobre bg → ${ratio.toFixed(2)}:1 · necesita ${AA}:1`,
      );
    }
  }

  // 3. El texto principal debe leerse también sobre paneles y popovers.
  for (const surface of ["bgAlt", "bgElevated"]) {
    const ratio = contrast(c.fg, c[surface]);
    if (ratio < AA) {
      failures.push(
        `${flavor.slug}: fg sobre ${surface} → ${ratio.toFixed(2)}:1 · necesita ${AA}:1`,
      );
    }
  }

  // 4. La selección no puede tragarse el texto.
  const selRatio = contrast(c.fg, c.selection);
  if (selRatio < SELECTION_MIN) {
    failures.push(
      `${flavor.slug}: fg sobre selection → ${selRatio.toFixed(2)}:1 · necesita ${SELECTION_MIN}:1`,
    );
  }

  // 5. Los bordes tienen que verse contra el fondo (no es texto: AA_UI).
  const borderRatio = contrast(c.border, c.bg);
  if (borderRatio < 1.2) {
    warnings.push(
      `${flavor.slug}: border casi invisible sobre bg → ${borderRatio.toFixed(2)}:1`,
    );
  }

  // 6. Los acentos deben distinguirse entre sí, o la sintaxis se aplana.
  //    Se mide con ΔE perceptual, no con contraste: dos colores pueden tener
  //    la misma luminancia (contraste 1:1) y ser obviamente distintos.
  //    Un flavor declarado monochrome renuncia a esto a propósito: su gracia
  //    es justamente que los acentos casi no se separen.
  const accents = ["keyword", "function", "string", "constant", "type"];
  const minDelta = flavor.monochrome ? MONOCHROME_MIN_DELTA : ACCENT_MIN_DELTA;
  for (let i = 0; i < accents.length; i++) {
    for (let j = i + 1; j < accents.length; j++) {
      const diff = deltaE(c[accents[i]], c[accents[j]]);
      if (diff < minDelta) {
        warnings.push(
          `${flavor.slug}: ${accents[i]} y ${accents[j]} cuesta distinguirlos · ΔE ${diff.toFixed(1)} (mínimo ${minDelta})`,
        );
      }
    }
  }
}

// ── Reporte ──────────────────────────────────────────────
for (const flavor of flavorList(tokens)) {
  const c = hexes(flavor);
  const ratios = TEXT_ROLES.map((r) => contrast(c[r], c.bg));
  const worst = Math.min(...ratios);
  const mark = worst >= AA ? "✓" : "✗";
  console.log(
    `${mark} ${flavor.name.padEnd(22)} ${flavor.appearance.padEnd(6)} peor texto ${worst.toFixed(2)}:1  ${wcagLevel(worst)}`,
  );
}

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} aviso(s):`);
  for (const w of warnings) console.log(`  · ${w}`);
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} error(es):`);
  for (const f of failures) console.error(`  · ${f}`);
  process.exit(1);
}

console.log(`\n✓ ${flavorList(tokens).length} flavors · todo el texto cumple WCAG AA`);
