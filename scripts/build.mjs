#!/usr/bin/env node
/**
 * Genera todos los ports desde palette/tokens.json.
 * Nada en ports/ se edita a mano: este script es el único que escribe ahí.
 */
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadTokens, flavorList, ROOT } from "./lib/tokens.mjs";

const TEMPLATES = [
  "vscode", "base16", "css", "iterm", "ghostty", "alacritty", "windows-terminal", "logo", "logo-mark", "shadcn", "icon", "preview", "vscode-meta",
];

const tokens = loadTokens();
const flavors = flavorList(tokens);
const portsDir = join(ROOT, "ports");

// Borrón y cuenta nueva: si un flavor desaparece de tokens, su port también.
rmSync(portsDir, { recursive: true, force: true });
mkdirSync(portsDir, { recursive: true });

let count = 0;
const summary = [];

for (const name of TEMPLATES) {
  const tpl = await import(`../templates/${name}.mjs`);
  const dir = join(portsDir, tpl.outDir);
  mkdirSync(dir, { recursive: true });

  // Algunos templates producen un solo archivo con todos los flavors dentro.
  if (tpl.single) {
    const out = tpl.render(flavors, tokens);
    writeFileSync(join(dir, tpl.filename), out, "utf8");
    count++;

    // Algunos templates traen compañía: README, licencia, changelog…
    if (tpl.extraFiles) {
      for (const [file, body] of Object.entries(tpl.extras(flavors, tokens))) {
        // Los extras binarios (el icono) llegan como Buffer.
        writeFileSync(join(dir, file), body, Buffer.isBuffer(body) ? undefined : "utf8");
        count++;
      }
    }

    summary.push(`  ${name.padEnd(18)} ${tpl.filename}${tpl.extraFiles ? " + extras" : ""}`);
    continue;
  }

  for (const flavor of flavors) {
    const base = typeof tpl.filename === "function" ? tpl.filename(flavor) : tpl.filename;
    const file = tpl.extension && !base.endsWith(`.${tpl.extension}`)
      ? `${base}.${tpl.extension}`
      : base;

    const out = tpl.render(flavor, tokens);

    // Los templates binarios (PNG) devuelven Buffer y se escriben tal cual.
    if (tpl.binary) {
      writeFileSync(join(dir, file), out);
    } else {
      const body = typeof out === "string" ? out : JSON.stringify(out, null, 2) + "\n";
      writeFileSync(join(dir, file), body, "utf8");
    }
    count++;
  }
  summary.push(`  ${name.padEnd(18)} ${flavors.length} archivos`);
}

console.log(`✓ ${count} archivos generados en ports/\n`);
console.log(summary.join("\n"));
