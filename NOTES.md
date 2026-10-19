# Notes for future me

Decisions left open on purpose. Each one has enough context to pick it up
cold, without having to rebuild the reasoning.

Last reviewed: 2026-08-27.

---

## The brand flavor doesn't match the logo

**Status:** decided to leave it as is for now.

`Hawking` is marked `"primary": true` in `palette/tokens.json`, and the
Marketplace `galleryBanner` color comes from it. But Hawking is neon magenta,
and the logo's accretion disk is **warm amber** — that's `Event Horizon`.

In other words: today the banner is Hawking's black and the icon is warm. It
doesn't clash, but it isn't fully consistent either.

**If you ever want to align it:** move `"primary": true` from `hawking` to
`event-horizon` in `tokens.json`, run `npm run build`, bump the version and
publish again. It's a one-line change.

**What to think about first:** Hawking is the flavor that looks best in a
screenshot, and screenshots are how people discover themes. Event Horizon is
the one people keep on for eight hours. The question isn't which one is
prettier, but which one you want as the public face. The right answer may be
to leave it as is and accept that the logo and the star flavor tell different
stories.

---

## The wordmark isn't settled

**Status:** pending; it blocks any use of the wordmark outside the web.

The identity guide left four lockups unchosen:

- **A** — symbol + "Spacehole" horizontally (the one used by default)
- **B** — the O in "SpacehOle" is the hole (the most memorable, but it breaks
  at small widths and needs more space)
- **C** — vertical, for avatars and stamps
- **D** — symbol only

**The real problem:** wherever the wordmark has been used so far, the
typeface is the system one (Avenir Next Condensed). That's **not
distributable**: on another machine it falls back to a different font and the
logo changes. To use it outside your Mac, you need to pick a licensed font and
convert the text to outlines.

Free candidates that fit the instrument-like register: **Archivo Expanded**,
**Chakra Petch**, **Familjen Grotesk**.

Note: this only applies to the wordmark. The stamp logo (`brand/icon.png`)
already has the text as an image, so it isn't affected.

---

## base16 is the cheap distribution that's missing

**Status:** generated but not submitted. It's the most reach for the least work.

`ports/base16/` already follows the tinted-theming spec. Submitting it to
https://github.com/tinted-theming unlocks **hundreds of community ports**
—Vim, tmux, Kitty, Qutebrowser, i3— without writing another line.

The hard part is already solved: the 16 slots are guaranteed to be
perceptually distinct even when a flavor reuses colors (as Deep Void does,
being monochrome on purpose). Without that, every derived port lost a color
category.

---

## The Marketplace previews are schematic, not screenshots

`ports/preview/` are drawn editor windows: each line of code is a bar in the
color that role would really have. They generate themselves and never go
stale.

But **a real code screenshot sells better**. If you want to raise Marketplace
conversion, take VS Code screenshots with each flavor and add them to the
README. The cost is that they have to be redone by hand every time a color
changes — which is why it wasn't done that way from the start.

---

## The Open VSX namespace isn't verified

**Status:** pending, just paperwork. The extension works the same meanwhile.

The Open VSX page shows an orange warning: *"That user account is not a
verified publisher of the namespace mrsandv"*. That's normal for every new
extension — on Open VSX, creating a namespace doesn't make you its verified
owner, because anyone can register any name. Microsoft's Marketplace doesn't
have this because the publisher is validated when it's created.

**To remove it:** open an issue at
https://github.com/EclipseFdn/open-vsx.org/issues/new/choose with the
*"Request ownership of a namespace"* template, asking for `mrsandv`.
Verification is straightforward because the GitHub account and the repo are
the same. It takes a few days.

The request is per **namespace**, not per extension: once verified, everything
published afterwards is already verified.

Check the status at any time:

```bash
curl -s https://open-vsx.org/api/mrsandv | grep -o '"verified":[a-z]*'
```

---

## Silent dependencies worth remembering

**The Marketplace README needs the repo to be public.** The images point to
`raw.githubusercontent.com`. If the repo goes private, the Marketplace page
ends up with broken images and no warning of any kind.

**The logo lives in two places.** `brand/icon.png` is a copy of
`portfolio/public/android-chrome-512x512.png`. If you change the logo in the
portfolio, copy it here and publish the extension again — nothing keeps them
in sync.

**The portfolio's `lib/flavors.ts` duplicates the picker colors.** It's the
only deliberate duplication in the system: if you change a color in
`tokens.json`, regenerate the CSS **and** update that list. It could be
removed by also generating that file from the tokens, if it ever gets in the
way.

---

## Why the validator measures ΔE instead of contrast

In case it someday looks overcomplicated and tempting to simplify.

WCAG contrast only measures **luminance**. Magenta and cyan can score 1.06:1
—that is, "identical" by that metric— and still be obviously different
colors. When the check used contrast to compare accents with each other, it
produced 21 false warnings.

ΔE measures **perceptual** distance, which is what actually matters for
telling whether two syntax roles can be told apart at a glance. With it, the
warnings dropped to the real ones.

For **text against background** contrast, WCAG is still used, because there
it's the right metric. They're two different questions, and each has its own
tool.
