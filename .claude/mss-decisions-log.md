# Main Stage Studio — Decisions Log

*Living document. Add entries when something is locked or changed. Never delete — mark as superseded if overridden.*

---

## Locked decisions

### Positioning
- **Client:** Creative founders — instinct and identity led, struggle to execute
- **Proposition:** *"You know what you want. We know how to build it."*
- **Differentiator:** PM rigour as the method, not the message. AI-assisted delivery. End-to-end from discovery to live brand.
- **Sector:** Broad — creative founders across any sector. Not limited to events.

### Brand identity
- **Palette:** Parchment `#F5EFE5` / Warm blush `#E8C9AE` / Dusty terracotta `#BF6B47` / Deep ember `#8C4A2F` / Near black `#1C1712`
- **Mark:** Near-black top-right (leads, on top) / Terracotta bottom-left (recedes behind) / Parchment cutout at intersection. See `mss-brand-identity.md` for canonical SVG.
- **Wordmark:** Cormorant Garamond (Main Stage) + Plus Jakarta Sans (Studio)
- **Aesthetic:** Editorial motion — considered layouts, kinetic moments as punctuation

### Identity system
- **Static layer:** Flat SVG mark + wordmark — always primary for functional use
- **Live layer:** 3D mark render + Higgsfield video — expressive, hero sections, brand film only
- Motion is proof of concept — demonstrates AI-assisted creative delivery

### Tooling
- Figma dropped — building directly via HTML prototype → Bricks Builder
- Higgsfield for video and 3D generative assets
- Claude Code for direct build
- DAM unresolved — Cloudflare R2 or Bunny.net

### Portfolio
- MMA POC dropped — doesn't align with creative founder positioning
- PureMed kept separate — skill-building project, not MSS portfolio
- First portfolio piece to be defined — new concept aligned to creative founders
- MSS building MSS is the lead case study (self-initiated, in progress)

### Directory structure
- Client projects are sibling directories — never nested inside MSS
- `~/projects/mss/` for all studio work
- `~/projects/clients/[name]/` for all client work
- Separation enforced at filesystem level to prevent aesthetic bleed

---

## Open decisions

| Decision | Options | Status |
|----------|---------|--------|
| DAM solution | Cloudflare R2 / Bunny.net | Unresolved — decide before build |
| Higgsfield hero asset | Brief and generate | Waiting on identity lock |
| Portfolio strategy | Real client or speculative first piece | Unresolved |
| Contact/intake form | Native WordPress / third party | Unresolved |
| Starter offer | Define and price entry-level engagement | Not started |
| Client acquisition strategy | — | Not started — after site live |

---

## Change log

| Date | Decision | Previous state | New state |
|------|----------|---------------|-----------|
| May 2026 | Logo mark orientation confirmed | Docs said terracotta top-right | Corrected: near-black top-right, terracotta bottom-left |
| May 2026 | Session summary renamed | mss-session-summary.md | mss-decisions-log.md — permanent record |
