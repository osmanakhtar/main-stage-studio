# Main Stage Studio: Website Brief

*Use alongside `mss-brand-identity.md` (visual source of truth) and `mss-tone-of-voice.md`.*
*v6, 10 Oct 2026. Positioning and page map: `01_mss/strategy/mss-positioning-v6-proposal.md` §9. Build order: `01_mss/strategy/mss-v6-build-plan.md`. v1 brief archived in `_archive/brand-v1/`.*

---

## Proposition

**Run the show.** Brand, website, content and the systems behind them, built by one studio and handed over with the controls. Six products, plus Review as the way in (added 11 Oct 2026), with prices on the page: Identity, Website, Campaign, Content, Platform, Care.

The site's job is to sell those products. Every product page opens on a short clip of the real tool doing its job; Review and Care use a static panel.

---

## Creative direction

Direction A, "Stage": dark-first, Stage Black with one Tungsten spotlight per view, Archivo wide headlines, Geist Mono for prices and labels, the Spike mark. Reference build: `01_mss/brand/mss-v6-specimen.html`.

Client work appears in the client's own colours, framed by the spike. Case studies and long reads may sit on House Lights.

---

## Page map

| Page | Job |
|---|---|
| `/` | Promise, the six products, one proof, how it works, who's behind it, start |
| `/review`, `/identity`, `/website`, `/campaign`, `/content`, `/platform`, `/care` | One product each, same template |
| `/work` | Case studies, filterable by product, each labelled live, in progress, self-initiated or demo |
| `/work/puremed` | Flagship case study |
| `/how-it-works` | Soundcheck, Rehearsal, Your cue, Showtime, The run, with real screens |
| `/pricing` | Every product's founding and target price |
| `/about` | Osman: two decades of systems, why MSS exists, what it believes |
| `/start` | Form opening on "What do you need?" with Review, the six products and "Not sure" |
| `/journal` | Point-of-view pieces |

Keep working via redirects: `/work/conveyancing-onboarding/`, `/work/accountancy-intake/`, `/work/clinic-booking/`, `/work/sable/`.

**Product page template:** name and one-line promise; who it's for; what you get; what you own at the end; timeline and price in mono (founding large, target struck through); the clip; one proof with its status label; how the cue works for this product; three FAQs; start this.

---

## Media

The tool clips live in `01_mss/website/tools/clips/out-v6/`: a narrated cut and an 8-second loop per product, as MP4, WebM and a WebP poster. Cards use the loop (muted, autoplay, loop, playsinline, poster set); product pages offer the narrated cut. Under `prefers-reduced-motion`, show the poster and a play button instead of autoplay.

| Product | Clip |
|---|---|
| Website | `website` |
| Campaign | `campaign` |
| Content | `content`, plus `pipeline` for the content checks |
| Platform | `console` |
| Identity | Sable walk-out ending on her homepage hero; full shot list in `01_mss/website/prototype-v6/media-plan.md` |
| Care | none; a static panel is enough |

Retired assets: `3d-mark-animation.mp4`, `hero-mark-poster.webp` (old two-squares mark).

---

## Technical stack

| Layer | Tool |
|-------|------|
| Build (primary) | Astro static (Bricks Builder retired 25 June 2026; see `_archive/bricks-era/`) |
| Prototyping | HTML/CSS via Claude Code |
| Client review | Stage on the Pi (`mss-review.duckdns.org`) |
| Design assets | Real tool recordings (`tools/clips/clip-kit.js`); Higgsfield is on hold (0 credits) |
| DAM | Deprioritised: WebP compression and Cloudways direct serving |
| Hosting | Cloudways |

### Build approach
1. HTML prototype in Claude Code, with `data-stage-section` on every section from the first draft
2. Stage review and sign-off
3. Astro build from the approved prototype (`data-stage-id` preserved)
4. Drop in the clips and posters
5. GitHub Actions: merge-to-main to Cloudways staging, manual-confirm dispatch to production (deploy-preflight first)

### Code principles
- Dark-first; light surfaces only for long reads and case studies
- Asymmetric and editorial; no centred hero
- No generic card overuse; use space, rules and borders
- Hardware-accelerated motion only (`transform`, `opacity`); respect `prefers-reduced-motion`
- `min-h-[100dvh]`, not `h-screen`, for full-height sections
- Tailwind CSS for styling, tokens from `01_mss/brand/mss-v6-tokens.css`
- No emoji, no purple or blue AI aesthetic, no gradient backgrounds, no glass panels
- Contrast: body text 4.5:1 minimum; never Tungsten or Cue Red as text on light

---

## Logo SVG: the Spike (on dark)
```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square"/>
  <path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square"/>
</svg>
```
On light surfaces the strokes are `#12110F`. Files and rules: `mss-brand-identity.md`.

---

## Open decisions
- Care price when a Platform is running (only the site rate is set).
- Identity clip: see `01_mss/website/prototype-v6/media-plan.md` (H3).
