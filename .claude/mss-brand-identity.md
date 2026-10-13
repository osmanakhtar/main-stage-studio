# Main Stage Studio: Brand Identity

*Canonical source for every visual decision. Other docs defer to this file.*
*v6, direction A ("Stage"). Ratified 10 Oct 2026: see `01_mss/strategy/mss-positioning-v6-proposal.md` and `mss-decisions-log.md`. v1 (parchment, terracotta, Cormorant) is archived in `_archive/brand-v1/`.*

---

## Positioning in one breath

**Run the show.** Main Stage Studio builds the brand, the website, the content and the systems behind them for owner-led businesses, then hands over the controls. Everything it builds, the client can change, approve and take with them.

Six products plus Review, priced on the page: Review, Identity, Website, Campaign, Content, Platform, Care. Full detail and prices: proposal §5, §5.8 and §5.9.

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
- **On the website, black is the stage, not the whole building** (11 Oct 2026). Dark where the work performs: the hero, the product lineup, product clips, the final cue. House Lights where the buyer reads and weighs trust: the problem, proof, how it works, the founder, and a product page's who/what/own/price/questions. Change the lights no more than three or four times a page, and on a light section the Spike strokes go Stage Black.
- No purple or blue AI gradients, no glass panels, no gradient backgrounds, no emoji. **One exception: the hero beam.** It's a soft Tungsten radial light on the home hero only. It counts as lighting, not a background, and appears once per page at most. **Extended 12 Oct 2026 (Os):** a scaled-down beam (a small Tungsten radial light) also follows the pointer across anything you can press, on desktop only. It lights the thing under the pointer, never a surface on its own.

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

**Email and account assets (13 Oct 2026).** Email clients cannot show SVG or web fonts, so these are PNGs rendered from the mark and the site header lockup:
- `01_mss/brand/email-signature/`: `mss-signature-logo.png` (lockup, Tungsten mark and House Lights wordmark on Stage Black, 3x, shown at 208px wide), `mss-email-signature.html` (table layout, Arial fallback; Os Akhtar, Founder, os@mainstagestudio.co.uk), `lockup-source.html` (re-render source).
- `01_mss/brand/account-logos/`: square 1024px avatars, Tungsten on Stage Black (Google account photo) and black on House Lights, circle-crop safe; transparent Tungsten and black marks; the lockup on black.

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

**Home hero, "finding your light" (11 Oct 2026):** the page loads dark, the beam fades up and settles on the marked word, then the two Spike corners snap in around it like stage tape. 2.5s at most, once per session, headline readable from the first frame. Afterwards the beam follows the pointer on desktop and drifts slowly on touch. Under reduced motion: beam static, no sweep.

**Home hero film (13 Oct 2026):** "Source to stage" v2 sits beside the headline on wide screens (1200px and up: headline and buttons left at up to 112px, film right) and after the buttons on narrower screens, so the headline is always first. Phones under 700px get a 4:5 cut with its own layout (not a crop), bigger type and Vera's journey as a vertical timeline; only the cut on show loads. The film's black is feathered into the lit hero, it plays muted and looping with a Pause control, and the poster stays under reduced motion. The Spike corners in the film are the logo doing the work; it opens and closes on the mark. A 1.4s sting cut from its close (`tools/clips/out-v6/sting-*.mp4`) is the sign-off for social video and film end cards.

**CTAs and clickables (12 Oct 2026):** on hover a button's fill wipes in from the left, the arrow takes a bow (out right, back in from the left), and two Spike corners snap in at opposite corners like the hero's stage tape; a press sinks to 97%. Anything you can press carries the small beam under the pointer. Cursor: arrow over reading text, hand over anything you can press (text cursor only in form fields and in Stage's edit mode; Stage's prototype mode fixed to match, patch `scripts/stage-patches/2026-10-12-preview-cursor`).

**Product lineup, "Spotlight" (12 Oct 2026):** the running order on the left, one framed stage on the right that lights whichever product you are on (hover, focus or scroll) and runs through its stills; other names dim to Rigging Grey. Phones get each product's still inline. Product imagery is stills cut from the real tool recordings until the clips are properly made. Chosen by Os on 12 Oct over a hover-peek list and a 3D drum (after the 21st.dev works-wheel).

---

## Reference builds

- Specimen A (the approved direction): `01_mss/brand/mss-v6-specimen.html`, on Stage as `mss-v6-brand`.
- Tools already in A: Studio (`scripts/review-app.*`), the client console (studio-platform, live 10 Oct), Stage's editor, login, home and admin (patches `scripts/stage-patches/2026-10-10-v6-reskin*`).
