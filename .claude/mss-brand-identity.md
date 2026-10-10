# Main Stage Studio: Brand Identity

*Canonical source for every visual decision. Other docs defer to this file.*
*v6, direction A ("Stage"). Ratified 10 Oct 2026: see `01_mss/strategy/mss-positioning-v6-proposal.md` and `mss-decisions-log.md`. v1 (parchment, terracotta, Cormorant) is archived in `_archive/brand-v1/`.*

---

## Positioning in one breath

**Run the show.** Main Stage Studio builds the brand, the website, the content and the systems behind them for owner-led businesses, then hands over the controls. Everything it builds, the client can change, approve and take with them.

Six products, priced on the page: Identity, Website, Campaign, Content, Platform, Care. Full detail and prices: proposal §5 and §5.8.

---

## The idea behind the look: the lit stage

A stage is dark so the thing on it can be seen. The identity is mostly black and white, with one warm spotlight colour that only lands on what matters: a price, the main action, the client's work, the moment something goes live. MSS is the stage and the lighting rig; the client is what is lit.

---

## Colour

| Name | Hex | Role |
|---|---|---|
| Stage Black | `#12110F` | Default background; all type on light surfaces |
| Riser | `#1F1D1A` | Raised surfaces on dark: cards, panels |
| Riser 2 | `#26231F` | Second raise: inputs, chips, hover |
| Line | `#2E2B27` | Rules and borders on dark |
| House Lights | `#F3F1EC` | Light surfaces: documents, long reads; type on dark |
| Rigging Grey | `#8C8981` | Secondary text on dark |
| Rigging Deep | `#5E5B55` | Secondary text on light |
| Tungsten | `#FFB21A` | The spotlight: the main action, prices, the mark, focus |
| Tungsten hover | `#FFC54D` | Hover on Tungsten fills |
| Cue Red | `#E5402A` | Signals only: dots, borders, fills for "live" or "wrong" |
| Error text | `#FF6B55` | Error and destructive words on dark |
| OK text | `#9BD48A` | Success words on dark |

Tokens as CSS: `01_mss/brand/mss-v6-tokens.css`. Tools that cannot import it copy the values and point back to it.

**Rules (learned from the builds, not just chosen):**
- **One Tungsten moment per view.** If two things are lit, nothing is.
- **Tungsten is never text on a light surface.** It measures 1.6:1 on House Lights. On light it is a fill with black type, or the mark turns black.
- **Text on Tungsten is always Stage Black,** never white.
- **Cue Red is never small text.** It scrapes 4.6:1 on Stage Black and falls under 4.5:1 on every raised surface (4.1:1 on Riser, 3.4:1 on Line). Use it for dots, borders and fills; use Error text for words.
- **Focus rings on a client's page are two-tone:** Tungsten plus a thin Stage Black line, because Tungsten alone disappears on white. In MSS's own dark chrome, Tungsten alone.
- **Dark-first.** Product UI, tools and the site default to Stage Black. Documents, proposals and long reads sit on House Lights.
- No purple or blue AI gradients, no glass panels, no gradient backgrounds, no emoji.

---

## Type

| Role | Typeface | Setting |
|---|---|---|
| Display | **Archivo**, wide | width 112 to 125 (`font-variation-settings: "wdth" 125` or `font-stretch: 118%`), weight 700 to 900, tight tracking |
| Body and UI | **Archivo** | width 100, weight 400 to 500 |
| System layer | **Geist Mono** | 400 to 500; labels, prices, timelines, buttons in tools; capitals only here, tracked .06 to .1em |

Google Fonts: `family=Archivo:wdth,wght@62..125,300..900&family=Geist+Mono:wght@400;500`.

Rules: headlines left-aligned and large; body max about 65 characters; prices and timelines always in Geist Mono; capitals only in Geist Mono at small sizes. Avoided on purpose: Anton (FSC's face), Inter (generic), and the faces used in client work (Ayesha's directions, Vera's Fraunces and Hanken Grotesk), so studio and client never blur.

---

## The mark: Spike

Stage managers tape two corners on the floor to mark exactly where a performer stands. The mark is that tape: two corners framing empty space, because what goes inside is always the client's. It reads three ways: a spike mark (your spot), a crop frame (we frame your work), a selection box (you can edit what is inside).

```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square"/>
  <path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square"/>
</svg>
```

Files: `01_mss/brand/mark/spike-tungsten.svg` (on dark), `spike-black.svg` (on light), `spike-house.svg` (on Tungsten or photography).

- **Wordmark:** MAIN STAGE in Archivo wide 800; STUDIO in Geist Mono, tracked wide, in a secondary colour.
- **On dark:** Tungsten mark. **On light:** the mark goes black. **On Tungsten:** black.
- Minimum size 20px. Square caps, stroke 5 on the 40 grid.
- In tools, the mark sits at the start of the editing dock and as a small "Runs on Main Stage" signature in client consoles (black on light, Tungsten on dark).

---

## The studio layer and the client layer

MSS tools sit on top of a client's own brand. The rule that keeps both honest:

- **MSS's layer is in A:** Stage's editing dock and panels, Studio, the console's type and controls, the sign-in and review pages.
- **The client's layer stays theirs:** their site, their colours and logo in their console, their post designs, their emails.
- The spike frames client work and never recolours it. Never show a client a product dressed in MSS colours that they would not actually get.

---

## Imagery

1. **The real work in use:** screen recordings and screenshots of clients editing, approving, receiving. The strongest asset MSS has. Recorded with `01_mss/website/tools/clips/clip-kit.js`, demo data only (the fictional Vera clinic, or MSS itself).
2. **Client work at full bleed, in the client's own colours,** framed by the spike.
3. **Hard-lit still life on black** (one object, one light, deep shadow, no people): dropped for launch, kept as a direction for later.

Never: stock people, glossy AI portraits, laptops on desks, before-and-after as a headline, any real client data in a demo. The founder appears once, in black and white (`01_mss/brand/founder/`), on About and LinkedIn, not on the home hero.

---

## Motion

Motion is a lighting cue, not decoration. The signature move is the spotlight: Tungsten fades up on the key element as it enters view. `transform` and `opacity` only, `prefers-reduced-motion` respected everywhere.

---

## Reference builds

- Specimen A (the approved direction): `01_mss/brand/mss-v6-specimen.html`, on Stage as `mss-v6-brand`.
- Tools already in A: Studio (`scripts/review-app.*`), the client console (studio-platform, live 10 Oct), Stage's editor, login, home and admin (patches `scripts/stage-patches/2026-10-10-v6-reskin*`).
