import { symbol } from "./logo.mjs";

/** Compact variant: favicon, avatar, anything under 48px. */
export const extension = "svg";
export const outDir = "logo";
export const filename = (flavor) => `spacehole-${flavor.slug}-mark.svg`;

export function render(flavor) {
  return symbol(flavor, { simple: true });
}
