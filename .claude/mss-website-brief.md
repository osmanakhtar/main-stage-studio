# Main Stage Studio — Website Brief

*Use alongside `mss-brand-identity.md`. That file is the visual source of truth.*
*Last reviewed: 05 June 2026*

---

## Proposition
*"Your vision doesn't need permission. It needs form."*

Target: People with something real to say that hasn't yet found its form. Founders, established businesses that have lost calibration, creatives at any stage. The common thread is the gap between what something is and how it currently shows up. MSS starts with what they're trying to say, not what they think they need built.

---

## Creative Direction

**Aesthetic:** Editorial motion — considered layouts, typographically confident, kinetic moments used as punctuation not decoration.

**Feel:** Warm, direct, quietly confident. Not corporate. Not try-hard. The rigour runs underneath; it's not the message.

**Motion approach**
- Hero: ambient 3D mark loop or Higgsfield video — slow, intentional, one continuous motion
- Below hero: editorial stillness — typography and space do the work
- Scroll-triggered moments: kinetic typography, image reveals, section transitions
- Motion is the punctuation, not the sentence

---

## Palette
```css
--color-parchment:  #F5EFE5;
--color-blush:      #E8C9AE;
--color-terracotta: #BF6B47;
--color-ember:      #8C4A2F;
--color-near-black: #1C1712;
```

---

## Typography
- **Display / headings:** Cormorant Garamond, 300–400 weight
- **Body / UI:** Plus Jakarta Sans, 300–500 weight
- Headlines large, tracked tight, left-aligned
- Body 16px, line-height relaxed, max-width ~65ch

---

## Page Structure

### Hero
- Full viewport height (`min-h-[100dvh]`)
- Left-aligned headline — proposition
- Ambient video or 3D mark loop right side (Higgsfield asset)
- Single CTA: Start a project
- Navigation: wordmark left, links + CTA right

**Copy direction:** Opens with the reader's experience, not the studio's offer. Empathy before capability. States the offer without decorating it — no adjectives doing the work that substance should do. First impression register: direct, clear, warm. The reader should feel recognised before they feel sold to.

**Locked hero copy (05 June 2026):**

*Your vision doesn't need permission. It needs form.*

Most people with something real to say spend years waiting for the right moment, the right structure, the right framework that finally gives them permission to say it. That moment rarely arrives on its own.

Main Stage Studio exists for the people who stop waiting.

We work with people who have something real to say and need a thought partner who can help them find the form to say it. The brief is rarely the real brief. That's always where we start.

---

### Work / Portfolio
- Case studies as editorial cards
- Each card: client name, sector, services, visual thumbnail
- Card links to framing page — full case study accessible from there
- No carousel — grid or stacked layout
- Homepage shows curated highlights: two or three strongest case studies
- "View all work" link leads to dedicated Work page
- Work page not built until three case studies are fully complete

**Copy direction:** Each case study leads with the client's world, not the studio's process. The problem emerges from the person, not from a brief. Deliverables are not achievements — outcomes are. Make the client feel recognised, not just described.

---

### Process
- Four stages: Discovery, Brand Expression, Design System, Web Presence
- Editorial layout, each stage given space
- The sequence is the point — each stage informs the next

**Copy direction:** The process is framed as a journey, not a service menu. Don't explain the methodology — make the reader feel the logic of it. Discovery framing register: warm but purposeful. The studio listens first.

---

### About
- One person — product management background; creative director at heart
- The tools have changed what's possible; the judgment about what to do with them hasn't changed hands
- Values: rigour, creative empathy, intent over industry
- The thinking is public. The person stays private.

**Copy direction:** Honest about the model without over-explaining it. Product management is the differentiator — the discipline of understanding the problem before touching the solution. That runs underneath everything. No bios, no headshots, no personal disclosure beyond what serves the work.

**Locked about copy (05 June 2026):**

Main Stage was built by someone who spent years being effective at things that weren't quite the right fit. The rigour stayed. The expression got parked. This is what happens when you stop parking it.

The background is product management, which means one thing above everything else: understand the problem properly before you touch the solution. That discipline runs underneath everything the studio makes.

The tools have changed what's possible. The judgment about what to do with them hasn't changed hands.

Drawn to people whose work means something beyond the commercial. If what you're building matters to you, it matters here.

---

### Start a project
- Name, email, tell me about your project
- No long forms — low friction entry

---

## Technical Stack

| Layer | Tool |
|-------|------|
| Build (primary) | WordPress + Bricks Builder |
| Prototyping | HTML/CSS via Claude Code |
| Design assets | Higgsfield (video/3D), Claude (SVG, components) |
| DAM | TBC — Cloudflare R2 or Bunny.net |
| Hosting | Cloudways |
| Local dev | LocalWP |

### Build approach
1. HTML prototype in Claude Code — layout, typography, motion
2. Review and lock
3. Migrate to Bricks Builder on WordPress
4. Drop in Higgsfield assets

### Code principles
- Asymmetric, editorial — not centred or symmetric
- No centred hero bias — split screen or left-aligned always
- No generic card overuse — use space and borders instead
- Hardware-accelerated motion only — `transform` and `opacity`
- `min-h-[100dvh]` not `h-screen` for full-height sections
- Tailwind CSS for styling
- No emoji, no purple/blue AI aesthetic, no gradient backgrounds

---

## Logo SVG — canonical mark (light background)
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

**Dark background variant** — near-black square uses `#3D3128`.
See `mss-brand-identity.md` for full mark specification and variants.

---

## Open Decisions
- DAM solution — Cloudflare R2 vs Bunny.net (resolve before build)
- Higgsfield hero asset — generate once identity fully locked
- Contact/intake form — native WordPress or third party
