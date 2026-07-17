# Main Stage Studio — Website Brief

*Use alongside `mss-brand-identity.md`. That file is the visual source of truth.*
*Last reviewed: 16 July 2026 — repositioning v3 (presence partner)*

---

## Proposition
*"You don't need a bigger team. You need a better system."*

Target: Established small businesses and funded founders with a run-rate problem. Values filter unchanged — drawn to people whose work means something beyond the commercial, intent over industry.

Positioning: presence partner — MSS builds and runs a client's brand, site, and content on retainer. The delivery pipeline (Astro, Higgsfield, Stage review) is the mechanism, not the pitch.

Offer architecture: **Launch** (build engagement) / **Run** (ongoing retainer, the centre of gravity — Campaign folded in rather than named separately). New Run proposals anchor £1,500–£3,000/mo (qualitative on-site, used in proposals only).

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

**Copy source of record (16 July 2026):** full hero, section, and page copy for v3 (presence partner) lives in `01_mss/strategy/mss-website-copy-v2.md` §2. That is the copy of record for the next build; it doesn't ship until the Astro rebuild (MSS site cutover holds for proof #2 — see `mss-decisions-log.md`).

**Retired hero copy (locked 05 June 2026, superseded 16 July 2026 — line moved to About, see below):**

~~*Your vision doesn't need permission. It needs form.*~~

~~Most people with something real to say spend years waiting for the right moment, the right structure, the right framework that finally gives them permission to say it. That moment rarely arrives on its own.~~

~~Main Stage Studio exists for the people who stop waiting.~~

~~We work with people who have something real to say and need a thought partner who can help them find the form to say it. The brief is rarely the real brief. That's always where we start.~~

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

### What we do / How it works
*(supersedes the old standalone "Process" section — 16 July 2026, repositioning v3)*
- No longer a 4-stage process page section. Folded into two Phase 1 sections per `mss-website-copy-v2.md` §4–5: **What we do** (Launch / Run, the offer architecture) and **How it works** (the review-system story, told as the client's experience, ending on the AI honesty paragraph).
- The old 4-stage build sequence — Discovery, Brand Expression, Design System, Web Presence — still describes the real Launch methodology internally, but doesn't surface as a named 4-stage journey on the homepage anymore. It resurfaces, expanded, on the Phase 2 `/how-it-works` page as "the Launch journey" (see plan §7 Phase 2 skeleton).
- Editorial layout retained for both sections; system section runs on dark background for contrast (matches "How it works" as the trust/mechanism beat).

**Copy direction:** What we do is framed as two ways of working, not a service menu — most engagements start with Launch and settle into Run. How it works is told as the client's experience (one review space, one gate) not the internal machinery, closing on the honesty paragraph verbatim every time it appears.

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
| Build (primary) | Astro static (Bricks Builder retired 25 June 2026 — see `_archive/bricks-era/`) |
| Prototyping | HTML/CSS via Claude Code |
| Client review | Stage on the Pi (`mss-review.duckdns.org`) |
| Design assets | Higgsfield (video/3D), Claude (SVG, components) |
| DAM | Deprioritised — WebP compression + Cloudways direct serving |
| Hosting | Cloudways |

### Build approach
1. HTML prototype in Claude Code — layout, typography, motion
2. Stage review and sign-off
3. Astro build from approved prototype (`data-stage-id` preserved)
4. Drop in Higgsfield assets
5. GitHub Actions: merge-to-main → Cloudways staging, manual-confirm dispatch → production

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
None outstanding on this file as of 16 July 2026 — see `mss-decisions-log.md` for anything current. (DAM, hero asset, and contact form were all resolved June 2026 and are tracked there.)
