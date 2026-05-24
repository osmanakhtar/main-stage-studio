# Workspace — Claude Code Context

## Overview
Osman Akhtar's workspace. Four active streams in one repo while each is early stage. Spin out to separate repos when a stream gets traction.

## Streams

| Folder | Stream | What it is |
|--------|--------|-----------|
| `01_mss/` | Main Stage Studio | Creative agency for founders — brand, web, AI-assisted delivery |
| `02_pm-ai/` | PM / AI | Systems, integrations, consulting. Locked In Learning, PureMed |
| `03_social/` | Social automation | Higgsfield/TikTok POCs — validate before committing |
| `04_cookies/` | Cookies | Daughter's cookie business. Brand-separate from everything else |
| `05_resources/` | Shared assets | DAM holding area — Cloudflare R2 or Bunny.net TBD |

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

**Logo mark — canonical SVG (light background):**
```svg
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="2"  y="16" width="24" height="22" rx="2.5" fill="#BF6B47"/>
  <rect x="14" y="2"  width="24" height="22" rx="2.5" fill="#1C1712"/>
  <rect x="14" y="16" width="12" height="8"  rx="1.5" fill="#F5EFE5"/>
</svg>
```
Near-black top-right (leads). Terracotta bottom-left (recedes). Parchment cutout at intersection.

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
- **Production:** WordPress + Bricks Builder
- **Assets:** Higgsfield for video/3D, Claude for SVG and components
- **Hosting:** Cloudways
- **Local dev:** LocalWP
- **DAM:** TBD — Cloudflare R2 or Bunny.net

---

## MSS design principles (MSS work only)

```css
--color-parchment:  #F5EFE5;
--color-blush:      #E8C9AE;
--color-terracotta: #BF6B47;
--color-ember:      #8C4A2F;
--color-near-black: #1C1712;
```

- Fonts: Cormorant Garamond (display) + Plus Jakarta Sans (body) via Google Fonts
- No centred hero layouts — left-aligned or split screen
- No generic card overuse — use space, borders, and negative space
- Hardware-accelerated motion only — `transform` and `opacity`
- `min-h-[100dvh]` not `h-screen` for full-height sections
- Tailwind CSS for styling
- No emoji, no purple/blue AI aesthetic, no gradient backgrounds

---

## Stream separation rules
- Client work lives at `~/projects/clients/[name]/` — never inside `01_mss/`
- Cookies brand is fully isolated from MSS — different audience, different aesthetic
- Social automation is a standalone POC — not MSS-specific
- PM/AI consulting targets professional services — different from MSS positioning

---

## For Claude desktop (claude.ai)
When starting a new MSS conversation, attach:
- `mss-brand-identity.md` — always
- `mss-tone-of-voice.md` — for copy or brand work
- `mss-website-brief.md` — for build sessions
- `mss-decisions-log.md` — for strategy or planning sessions

All files live at `~/projects/mss/.claude/`
