import { mix } from "../scripts/lib/color.mjs";

/** Alpha en formato VS Code: #RRGGBBAA */
const a = (hex, alpha) =>
  hex + Math.round(alpha * 255).toString(16).padStart(2, "0").toUpperCase();

export const extension = "json";
export const outDir = "vscode/themes";

export function filename(flavor) {
  return `spacehole-${flavor.slug}-color-theme.json`;
}

export function render(flavor, tokens) {
  const c = Object.fromEntries(
    Object.entries(flavor.colors).map(([k, v]) => [k, v.hex]),
  );
  const dark = flavor.appearance === "dark";
  // Sombra de foco y hovers derivados, para no inventar colores sueltos.
  const hover = mix(c.bgAlt, dark ? "#FFFFFF" : "#000000", 0.05);
  const active = mix(c.bgAlt, dark ? "#FFFFFF" : "#000000", 0.09);

  const style = (scope, color, fontStyle) => ({
    scope,
    settings: fontStyle ? { foreground: color, fontStyle } : { foreground: color },
  });

  return {
    $schema: "vscode://schemas/color-theme",
    name: `${tokens.name} ${flavor.name}`,
    type: flavor.appearance,
    semanticHighlighting: true,

    colors: {
      "editor.background": c.bg,
      "editor.foreground": c.fg,
      "editor.lineHighlightBackground": a(c.bgAlt, 0.6),
      "editor.selectionBackground": c.selection,
      "editor.selectionHighlightBackground": a(c.selection, 0.5),
      "editor.wordHighlightBackground": a(c.selection, 0.45),
      "editor.findMatchBackground": a(c.warning, 0.35),
      "editor.findMatchHighlightBackground": a(c.warning, 0.2),
      "editorCursor.foreground": c.keyword,
      "editorLineNumber.foreground": c.subtext,
      "editorLineNumber.activeForeground": c.fg,
      "editorIndentGuide.background1": c.border,
      "editorIndentGuide.activeBackground1": c.muted,
      "editorWhitespace.foreground": c.border,
      "editorBracketMatch.background": a(c.function, 0.2),
      "editorBracketMatch.border": c.function,

      "editorGutter.addedBackground": c.success,
      "editorGutter.modifiedBackground": c.info,
      "editorGutter.deletedBackground": c.error,
      "editorError.foreground": c.error,
      "editorWarning.foreground": c.warning,
      "editorInfo.foreground": c.info,

      "editorWidget.background": c.bgElevated,
      "editorWidget.border": c.border,
      "editorSuggestWidget.background": c.bgElevated,
      "editorSuggestWidget.selectedBackground": active,
      "editorHoverWidget.background": c.bgElevated,
      "editorHoverWidget.border": c.border,

      "activityBar.background": c.bgAlt,
      "activityBar.foreground": c.fg,
      "activityBar.inactiveForeground": c.muted,
      "activityBarBadge.background": c.keyword,
      "activityBarBadge.foreground": c.bg,

      "sideBar.background": c.bgAlt,
      "sideBar.foreground": c.subtext,
      "sideBar.border": c.border,
      "sideBarTitle.foreground": c.fg,
      "sideBarSectionHeader.background": c.bgAlt,
      "sideBarSectionHeader.foreground": c.fg,
      "list.hoverBackground": hover,
      "list.activeSelectionBackground": active,
      "list.activeSelectionForeground": c.fgBright,
      "list.inactiveSelectionBackground": hover,
      "list.highlightForeground": c.keyword,

      "statusBar.background": c.bgAlt,
      "statusBar.foreground": c.subtext,
      "statusBar.border": c.border,
      "statusBar.noFolderBackground": c.bgAlt,
      "statusBar.debuggingBackground": c.keyword,
      "statusBar.debuggingForeground": c.bg,

      "titleBar.activeBackground": c.bgAlt,
      "titleBar.activeForeground": c.fg,
      "titleBar.inactiveBackground": c.bgAlt,
      "titleBar.inactiveForeground": c.muted,
      "titleBar.border": c.border,

      "tab.activeBackground": c.bg,
      "tab.activeForeground": c.fgBright,
      "tab.activeBorderTop": c.keyword,
      "tab.inactiveBackground": c.bgAlt,
      "tab.inactiveForeground": c.muted,
      "tab.border": c.border,
      "editorGroupHeader.tabsBackground": c.bgAlt,
      "editorGroupHeader.tabsBorder": c.border,

      "panel.background": c.bgAlt,
      "panel.border": c.border,
      "panelTitle.activeForeground": c.fg,
      "panelTitle.inactiveForeground": c.muted,

      "terminal.background": c.bg,
      "terminal.foreground": c.fg,
      "terminal.ansiBlack": flavor.ansi.black,
      "terminal.ansiRed": flavor.ansi.red,
      "terminal.ansiGreen": flavor.ansi.green,
      "terminal.ansiYellow": flavor.ansi.yellow,
      "terminal.ansiBlue": flavor.ansi.blue,
      "terminal.ansiMagenta": flavor.ansi.magenta,
      "terminal.ansiCyan": flavor.ansi.cyan,
      "terminal.ansiWhite": flavor.ansi.white,
      "terminal.ansiBrightBlack": c.muted,
      "terminal.ansiBrightRed": mix(flavor.ansi.red, "#FFFFFF", 0.25),
      "terminal.ansiBrightGreen": mix(flavor.ansi.green, "#FFFFFF", 0.25),
      "terminal.ansiBrightYellow": mix(flavor.ansi.yellow, "#FFFFFF", 0.25),
      "terminal.ansiBrightBlue": mix(flavor.ansi.blue, "#FFFFFF", 0.25),
      "terminal.ansiBrightMagenta": mix(flavor.ansi.magenta, "#FFFFFF", 0.25),
      "terminal.ansiBrightCyan": mix(flavor.ansi.cyan, "#FFFFFF", 0.25),
      "terminal.ansiBrightWhite": c.fgBright,

      "button.background": c.keyword,
      "button.foreground": c.bg,
      "button.hoverBackground": mix(c.keyword, c.fg, 0.15),
      "input.background": c.bgElevated,
      "input.foreground": c.fg,
      "input.border": c.border,
      "focusBorder": c.keyword,
      "badge.background": c.keyword,
      "badge.foreground": c.bg,
      "progressBar.background": c.keyword,
      "scrollbarSlider.background": a(c.muted, 0.25),
      "scrollbarSlider.hoverBackground": a(c.muted, 0.4),
      "scrollbarSlider.activeBackground": a(c.muted, 0.55),

      "gitDecoration.addedResourceForeground": c.success,
      "gitDecoration.modifiedResourceForeground": c.info,
      "gitDecoration.deletedResourceForeground": c.error,
      "gitDecoration.untrackedResourceForeground": c.string,
      "gitDecoration.ignoredResourceForeground": c.muted,

      "diffEditor.insertedTextBackground": a(c.success, 0.14),
      "diffEditor.removedTextBackground": a(c.error, 0.14),
      "peekView.border": c.keyword,
      "textLink.foreground": c.function,
      "textLink.activeForeground": c.fgBright,
      "selection.background": a(c.selection, 0.8),
    },

    tokenColors: [
      style("comment", c.muted, "italic"),
      style(["string", "string.quoted", "punctuation.definition.string"], c.string),
      style(["string.regexp", "constant.character.escape"], c.info),
      style(["constant.numeric", "constant.language", "constant.language.boolean"], c.constant),
      style(["keyword", "keyword.control", "storage", "storage.type", "storage.modifier"], c.keyword),
      style(["keyword.operator"], c.operator),
      style(["entity.name.function", "support.function", "meta.function-call.generic"], c.function),
      style(["entity.name.type", "entity.name.class", "support.class", "support.type"], c.type),
      style(["variable", "meta.definition.variable.name", "support.variable"], c.fg),
      style(["variable.parameter", "meta.parameter"], c.subtext),
      style(["variable.other.property", "meta.object-literal.key"], c.function),
      style(["entity.name.tag", "punctuation.definition.tag"], c.error),
      style(["entity.other.attribute-name"], c.type),
      style(["punctuation", "meta.brace"], c.subtext),
      style(["invalid", "invalid.illegal"], c.error, "underline"),
      style(["markup.heading", "entity.name.section"], c.keyword, "bold"),
      style(["markup.bold"], c.fg, "bold"),
      style(["markup.italic"], c.fg, "italic"),
      style(["markup.inline.raw", "markup.fenced_code"], c.string),
      style(["markup.inserted"], c.success),
      style(["markup.deleted"], c.error),
      style(["markup.changed"], c.info),
      style(["markup.underline.link"], c.function, "underline"),
    ],

    semanticTokenColors: {
      namespace: c.type,
      class: c.type,
      interface: c.type,
      enum: c.type,
      enumMember: c.constant,
      typeParameter: c.type,
      function: c.function,
      method: c.function,
      property: c.function,
      variable: c.fg,
      parameter: c.subtext,
      "variable.readonly": c.constant,
      "variable.defaultLibrary": c.constant,
      keyword: c.keyword,
      "*.deprecated": { strikethrough: true },
    },
  };
}
