#!/usr/bin/env node
/**
 * Generates every port from palette/tokens.json.
 * Nothing in ports/ is edited by hand: this script is the only thing that writes there.
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

// Clean slate: if a flavor disappears from tokens, its port goes too.
rmSync(portsDir, { recursive: true, force: true });
mkdirSync(portsDir, { recursive: true });

let count = 0;
const summary = [];

for (const name of TEMPLATES) {
  const tpl = await import(`../templates/${name}.mjs`);
  const dir = join(portsDir, tpl.outDir);
  mkdirSync(dir, { recursive: true });

  // Some templates produce a single file with every flavor inside.
  if (tpl.single) {
    const out = tpl.render(flavors, tokens);
    writeFileSync(join(dir, tpl.filename), out, "utf8");
    count++;

    // Some templates come with companions: README, license, changelog…
    if (tpl.extraFiles) {
      for (const [file, body] of Object.entries(tpl.extras(flavors, tokens))) {
        // Binary extras (the icon) arrive as a Buffer.
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

    // Binary templates (PNG) return a Buffer and are written as is.
    if (tpl.binary) {
      writeFileSync(join(dir, file), out);
    } else {
      const body = typeof out === "string" ? out : JSON.stringify(out, null, 2) + "\n";
      writeFileSync(join(dir, file), body, "utf8");
    }
    count++;
  }
  summary.push(`  ${name.padEnd(18)} ${flavors.length} files`);
}

console.log(`✓ ${count} files generated in ports/\n`);
console.log(summary.join("\n"));
