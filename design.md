# Design: kalkulator ERGO Razem (Aura Expert sp. z o.o.)

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: editorial
- Shape of the first page: Marquee Hero (a full-measure headline over the bill of three premiums); calculator screens are app screens inside the same system
- Theme: Broadside (a printer's bill), with the brand's red in place of the theme's vermilion
- Axes: light/display-condensed/warm · posture: committed

## Brand (kept at every depth)
- Logo: `public/ergo-hestia-logo.jpg`, as found, on the light plate.
- Red: `#E4002B`, hover `#C00025`. It marks the one forward action of a screen and the focus ring, nothing else.
- "Aura Expert sp. z o.o., agent ERGO Hestii" is visible in the header and the footer of every page.
- Consent, questionnaire and legal texts are verbatim. Figures come only from `lib/data/`.

## Tokens
`app/tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(92% 0.028 88);  --color-paper-2: oklch(88.5% 0.032 88);  --color-paper-3: oklch(85% 0.036 86);
  --color-plate: oklch(97.5% 0.012 88);  /* the header plate, fields, the premium bill */
  --color-ink: oklch(18% 0.01 50);  --color-ink-2: oklch(30% 0.012 50);  --color-muted: oklch(43% 0.02 62);  --color-rule: oklch(75% 0.028 82);
  --color-accent: oklch(57.94% 0.2343 23.93);  --color-accent-hover: oklch(50.96% 0.2058 23.3);  --color-accent-ink: oklch(98.5% 0.008 88);
  --color-focus: oklch(57.94% 0.2343 23.93);  --color-error: oklch(46% 0.19 27);
  --font-display: "Six Caps";  --font-display-2: "Bevan";  --font-body: "Archivo Narrow";
  --radius-card: 0;  --radius-pill: 0;  --rule-hair: 1px;  --rule-bar: 5px;  --rule-frame: 3px;  --shadow-card: none;
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `app/tokens.css`. Body text is `--text-body` (18px); small print is `--text-md` (16px), never smaller.

## Type
- Six Caps, uppercase: page titles, fitted headline lines (`.fit`, sized in `cqi` from a measured width), premiums and step numerals.
- Bevan, uppercase: section heads, product names, the footer statement. The agent's name is Bevan in its legal mixed case.
- Archivo Narrow 400, 500, 600: everything read, labels, table cells, buttons (600, capitals).

## Surfaces
- Rules are 1px or 5px, in ink; rows part with 1px in `--color-rule`. Square corners, no shadow, no gradient.
- A frame is a 3px ink border with a 1px keyline 3px inside it: the header plate, the premium bill, a secondary button, a photograph.
- Photographs print in the ink on the paper (greyscale, multiplied), only on the home page.
- A selection is an ink fill with paper type. The user's entry sits on the plate.

## Controls
- Primary: the red block, Archivo Narrow 600 capitals, square, 52px; one per screen.
- Secondary: the double-rule frame, same height. Inputs: square, 52px, a 1px ink border on the plate, the focus ring inset.

## Motion
- Character: still. No reveal, no hover growth; a live figure updates in place. A press drops 1px.

## Exports
`app/tokens.css` in this project, written as a Tailwind 4 `@theme static` block, so every role is a utility (`bg-paper-2`, `text-muted`, `font-display-2`).
