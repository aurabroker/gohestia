# Design: kalkulator ERGO Razem (Aura Expert sp. z o.o.)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape of the first page: Stat-Led (the question, the age field and the action beside three premium cards); calculator screens are app screens inside the same system
- Theme: Coral (warm near-white paper, soft paper cards, one sans-serif face), with the brand's red in place of the theme's coral. An earlier pass used Broadside; the owner found it too heavy.
- Axes: light/grotesk-sans/warm · posture: restrained

## Brand (kept at every depth)
- Logo: `public/ergo-hestia-logo.jpg`, as found, on the light header card.
- Red: `#E4002B`, hover `#C00025`. It marks the one forward action of a screen and the focus ring, nothing else.
- "Aura Expert sp. z o.o., agent ERGO Hestii" is visible in the header and the footer of every page.
- Consent, questionnaire and legal texts are verbatim. Figures come only from `lib/data/`.

## Tokens
`app/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(97% 0.006 55);  --color-paper-2: oklch(94.5% 0.007 55);  --color-paper-3: oklch(91.5% 0.009 55);
  --color-cotton: oklch(98.8% 0.0045 80);  /* cards, fields, the header */
  --color-desk: oklch(94.3% 0.008 64);  /* the ground behind the home hero */
  --color-ink: oklch(21% 0.012 38);  --color-ink-2: oklch(29% 0.013 40);  --color-muted: oklch(47% 0.013 45);
  --color-rule: oklch(87% 0.009 55);  --color-rule-2: oklch(81% 0.011 55);
  --color-accent: oklch(57.94% 0.2343 23.93);  --color-accent-hover: oklch(50.96% 0.2058 23.3);  --color-accent-ink: oklch(98.8% 0.0045 80);
  --color-focus: oklch(57.94% 0.2343 23.93);  --color-error: oklch(46% 0.19 27);
  --font-display: "General Sans", "Hanken Grotesk";  --font-body: var(--font-display);
  --radius-card: 8px;  --radius-input: 6px;  --rule-hair: 1px;
  --shadow-stock: /* a lit top edge, a shaded bottom edge and a short cast to the right */;
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `app/tokens.css`. Body text is `--text-body` (18px); small print is `--text-md` (16px), never smaller.

## Type
- One family in weights 400, 500 and 600, sentence case everywhere. The theme names General Sans; the site ships Hanken Grotesk, its free counterpart, self-hosted through `next/font`.
- Heads are 600 with tight tracking (-0.03em); premiums and totals are 600 at display size with -0.05em and tabular figures.
- Labels, table heads and meta are 500 or 600 at 16px in `--color-muted` or ink, never uppercase, never tracked.

## Surfaces
- A card is cotton stock with an 8px radius and `--shadow-stock`: the header, the three premium cards, the payouts sheet, the bill, the modal, a secondary button. Nothing else is boxed.
- Rules are 1px: `--color-rule` between rows, `--color-rule-2` over a section, ink over a total.
- A selection is an ink outline with a filled mark; a well is `--color-paper-2` with the card radius.
- Photographs are the owner's own, in colour and slightly muted, only on the home page.

## Controls
- Primary: the red card, 600, 8px radius, 52px; one per screen.
- Secondary: a cotton card with the stock shadow, same height. Inputs: 52px, 6px radius, a 1px `--color-muted` border on cotton, the focus ring inset.

## Motion
- Character: still. No reveal; a live figure updates in place. A press drops 1px.

## Exports
`app/tokens.css` in this project, written as a Tailwind 4 `@theme static` block, so every role is a utility (`bg-paper-2`, `text-muted`, `bg-cotton`).
