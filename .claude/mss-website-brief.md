# Main Stage Studio — Website Brief

*Use alongside `mss-brand-identity.md`. That file is the visual source of truth.*

---

## Proposition
*"You know what you want. We know how to build it."*

Target: Creative founders who lead with instinct and identity. They have the vision, they struggle to execute it. MSS takes what's in their head and makes it real.

---

## Creative Direction

**Aesthetic:** Editorial motion — considered layouts, bold typography, kinetic moments used as punctuation not decoration.

**Feel:** Warm, confident, direct. Not corporate, not try-hard. The rigour is the method, not the message.

**Motion approach**
- Hero: ambient 3D mark loop or Higgsfield video — slow, intentional, one continuous motion
- Below hero: editorial stillness — typography and space do the work
- Scroll-triggered moments: kinetic typography, image reveals, section transitions
- No motion for motion's sake

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

### Work / Portfolio
- Case studies as editorial cards
- Each card: client name, sector, services, visual thumbnail
- No carousel — grid or stacked layout

### Process
- Four stages: Discovery → Brand Expression → Design System → Web Presence
- Editorial layout, each stage given space
- Emphasise the journey, not the deliverable

### About
- One person, PM background, AI-assisted delivery
- Honest about the model — not pretending to be a large agency
- Values: rigour, creative empathy, positive societal impact

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
| DAM | TBD — Cloudflare R2 or Bunny.net |
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
