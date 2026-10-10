# Workspace — Claude Code Context

## Overview
Osman Akhtar's workspace. Multiple streams in one repo while each is early stage. Spin out to separate repos when a stream gets traction.

## Streams

| Folder | Stream | What it is |
|--------|--------|-----------|
| `01_mss/` | Main Stage Studio | Six products for owner-led businesses: Identity, Website, Campaign, Content, Platform, Care. "Run the show" (v6, 10 Oct 2026) |
| `02_clients/` | Client projects | Active client engagements. Current: Ayesha Johar |
| `03_resources/` | Shared assets | DAM holding area — images, video, tools. Cloudflare R2 or Bunny.net TBD |

---

## For MSS sessions — read these files first

| File | What it covers |
|------|---------------|
| `.claude/mss-brand-identity.md` | Canonical visual source — palette, typography, logo SVG, aesthetic direction |
| `.claude/mss-tone-of-voice.md` | Brand character, copy principles, voice in practice |
| `.claude/mss-website-brief.md` | Website structure, stack, code principles, logo SVG reference |
| `.claude/mss-decisions-log.md` | What's locked, what's open, change history |
| `.claude/mss-spend-tracker.md` | Committed costs and pending decisions |
| `.claude/mss-new-client-checklist.md` | Standard process for opening a new client engagement |
| `.claude/mss-new-case-study-checklist.md` | Standard process for opening and publishing a case study |

**Logo mark: the Spike (v6). On dark (Tungsten); on light the strokes are `#12110F`:**
```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square"/>
  <path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square"/>
</svg>
```
Two corners of stage tape framing empty space: the client's spot. Files in `01_mss/brand/mark/`.

---

## How I want Claude Code to show up
- Honest over agreeable — flag problems before building around them
- Ask one good question if something is ambiguous before proceeding
- Think in first principles — don't default to generic patterns
- Direct and concise — no filler
- Push back when something doesn't stack up with the brief

---

## Shared stack
- **Prototyping:** HTML/CSS in Claude Code
- **Production:** Astro static sites (Bricks Builder retired 25 June 2026 — legacy docs in `_archive/bricks-era/`)
- **Client review:** Stage on the Pi (`mss-review.duckdns.org`)
- **Assets:** real tool recordings (`01_mss/website/tools/clips/clip-kit.js`), Claude for SVG and components; Higgsfield on hold (0 credits)
- **Hosting:** Cloudways (MSS production site now runs on Astro)
- **DAM:** Deprioritised — WebP compression + Cloudways direct serving is sufficient

---

## MSS design principles (MSS work only)

v6 direction A, "Stage". Full rules: `.claude/mss-brand-identity.md`. Tokens: `01_mss/brand/mss-v6-tokens.css`.

```css
--mss-stage-black: #12110F;  /* default background, type on light */
--mss-riser:       #1F1D1A;  /* raised surfaces on dark */
--mss-line:        #2E2B27;  /* rules and borders on dark */
--mss-house:       #F3F1EC;  /* light surfaces, type on dark */
--mss-rigging:     #8C8981;  /* secondary text on dark */
--mss-tungsten:    #FFB21A;  /* the one accent: never text on light */
--mss-cue-red:     #E5402A;  /* signals only: never small text */
```

- Fonts: Archivo (display at width 112 to 125, body at 100) + Geist Mono (labels, prices, buttons in tools), Google Fonts
- Dark-first; one Tungsten moment per view; text on Tungsten is Stage Black
- MSS's layer is in A; the client's layer (their site, colours, logo, posts, emails) stays theirs
- No centred hero layouts; no generic card overuse; no emoji, no purple/blue AI aesthetic, no gradients, no glass
- Hardware-accelerated motion only, `transform` and `opacity`; respect `prefers-reduced-motion`
- `min-h-[100dvh]` not `h-screen` for full-height sections; Tailwind CSS for styling

---

## Stream separation rules
- Client work lives at `02_clients/[name]/` — never inside `01_mss/`
- Portfolio case studies live at `01_mss/portfolio/[client]/` — separate from the active client folder
- Each client folder follows the `02_clients/_template/` scaffold: brand/, discovery/, design-system/, deliverables/, web/

---

## For Claude desktop (claude.ai)
When starting a new MSS conversation, attach:
- `mss-brand-identity.md` — always
- `mss-tone-of-voice.md` — for copy or brand work
- `mss-website-brief.md` — for build sessions
- `mss-decisions-log.md` — for strategy or planning sessions

All files live at `~/workspace/main-stage-studio/.claude/`
