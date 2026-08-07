# Main Stage Studio — Brand Identity

*Canonical source. All other docs defer to this file for visual decisions.*

---

## Positioning

**Who we serve:** Established small businesses and funded founders with a run-rate problem — not enough consistent output to build presence, without the overhead of a full team. Values filter unchanged: drawn to people whose work means something beyond the commercial, intent over industry.

**What we do:** Presence partner — MSS builds and runs a client's brand, site, and content on retainer. Launch (build engagement) gets a client live; Run (ongoing retainer, the centre of gravity) keeps them shipping without headcount. Nothing gets handed over and abandoned.

**How we're different:** PM discipline running underneath a creative process. The rigour keeps nothing from getting lost; the creative direction keeps it from feeling like a process. AI accelerates the execution — the vision and judgment stay human. The delivery pipeline (Astro, Higgsfield, Stage review) is the mechanism, not the pitch.

**Core proposition:** *"You don't need a bigger team. You need a better system."*

*Retired 16 July 2026 (repositioning v3): "Your vision doesn't need permission. It needs form." — lineage preserved in the About section copy (`01_mss/strategy/mss-website-copy-v2.md` §7), not carried in the hero.*

---

## Logo

### Mark — canonical description
- Two offset squares with deliberate negative space at the intersection
- **Near-black square — top-right, leads, sits on top** (the studio's structure and systems, a shadow that supports from underneath even while positioned to lead)
- **Terracotta square — bottom-left, recedes behind** (the client — their vision, their presence — carried and elevated by that structure)

Corrected 6 Aug 2026: the mark's spatial description (position, which square leads/recedes) was always right; the *meaning* attached to each colour was backwards in earlier drafts of this doc. Black is not "the vision" — black is MSS's own discipline and systems, invisible infrastructure. Terracotta is the client, the thing being supported and made visible. Any imagery, copy, or generated asset built on "black = vision" reasoning predates this correction and should be checked.
- Parchment cutout at the intersection — the stage, the moment of emergence
- Corner radius: 2.5px on both squares, 1.5px on cutout

### Mark — canonical SVG (light background)
```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Terracotta square — bottom-left, recedes behind -->
  <rect x="2"  y="16" width="24" height="22" rx="2.5" fill="#BF6B47"/>
  <!-- Near-black square — top-right, leads, sits on top -->
  <rect x="14" y="2"  width="24" height="22" rx="2.5" fill="#1C1712"/>
  <!-- Parchment cutout — at intersection -->
  <rect x="14" y="16" width="12" height="8"  rx="1.5" fill="#F5EFE5"/>
</svg>
```

### Mark — dark background variant
Near-black square uses `#3D3128` so it remains visible against near-black backgrounds.
```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2"  y="16" width="24" height="22" rx="2.5" fill="#BF6B47"/>
  <rect x="14" y="2"  width="24" height="22" rx="2.5" fill="#3D3128"/>
  <rect x="14" y="16" width="12" height="8"  rx="1.5" fill="#F5EFE5"/>
</svg>
```

### Wordmark
- **Main Stage** — Cormorant Garamond, weight 400, letter-spacing 0.02em
- **Studio** — Plus Jakarta Sans, weight 400, letter-spacing 0.24em, uppercase, terracotta colour

### Usage rules
- Flat SVG mark is always primary — favicon, header, print, documents
- 3D rendered mark is expressive only — hero video, brand film, social content
- Never replace the flat mark with the 3D version in functional contexts
- Minimum size: 32px

---

## Colour Palette

| Name | Hex | CSS token | Role |
|------|-----|-----------|------|
| Parchment | `#F5EFE5` | `--color-parchment` | Base / background / large surfaces |
| Warm blush | `#E8C9AE` | `--color-blush` | Cards / secondary sections / subtle texture |
| Dusty terracotta | `#BF6B47` | `--color-terracotta` | Primary accent / CTAs / logo mark / key moments |
| Deep ember | `#8C4A2F` | `--color-ember` | Accent hover / depth |
| Near black | `#1C1712` | `--color-near-black` | All type / structural elements / primary buttons |

### CSS variables
```css
--color-parchment:  #F5EFE5;
--color-blush:      #E8C9AE;
--color-terracotta: #BF6B47;
--color-ember:      #8C4A2F;
--color-near-black: #1C1712;
```

### Colour principles
- Max one accent colour in any composition
- Parchment is the default background — never stark white or cool grey
- Near-black for all body type — never pure black
- Terracotta as punctuation, not wallpaper

---

## Typography

### Primary — Cormorant Garamond
- Use: Display headings, wordmark, editorial moments
- Weight: 300–400 only
- Character: High-contrast serif, warm, distinctive, editorial

### Secondary — Plus Jakarta Sans
- Use: Body copy, navigation, UI labels, sub-headings, Studio descriptor
- Weight: 300–500
- Character: Geometric warmth

### Import
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

### Typographic principles
- Headlines: large, tracked tight, left-aligned — no centred hero bias
- Body: 16px, line-height relaxed, max-width ~65ch
- All caps only for labels and descriptors at small sizes with wide tracking
- Never use Inter — too generic for this identity

---

## Aesthetic Direction

**Style:** Editorial motion
- Considered, typographically confident layouts
- Kinetic moments that hit hard because the surrounding space is calm
- Editorial stillness punctuated by motion, not motion everywhere

**Motion principles**
- Static mark always primary
- 3D mark and Higgsfield video used as expressive layer only
- Motion is the punctuation, not the sentence
- Hardware-accelerated only — `transform` and `opacity`, never `top/left/width/height`

**What to avoid**
- Centred hero layouts
- Generic card overuse
- Purple/blue AI aesthetic
- Gradient backgrounds
- Motion as decoration

---

## Identity System Layers

### Layer 1 — Static
Flat SVG mark + wordmark + palette + typography.
Use for: PDF proposals, documents, favicons, email signatures, headers.

### Layer 2 — Live
3D mark render + Higgsfield video + scroll-triggered motion + kinetic typography.
Use for: Website hero, case study openers, social content, brand films.

The live layer demonstrates AI-assisted creative delivery — proof of concept for clients.
