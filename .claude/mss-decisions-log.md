# Main Stage Studio — Decisions Log

*Living document. Add entries when something is locked or changed.*
*Never delete — mark superseded decisions with ~~strikethrough~~ and note the date.*
*Last reviewed: 03 June 2026*

---

## How to use this file

Three sections:

1. **Locked** — confirmed, in use, not up for revision without a reason
2. **Open** — known decisions that haven't been made yet
3. **Flagged** — things that look missing or need a check before they can be locked

Anything that moves from Open to Locked should be dated and noted briefly.

---

## Locked Decisions

### Positioning

| Decision | What's locked |
|----------|--------------|
| Client definition | Creative founders who lead with instinct and identity — people who know what they're building and why, but haven't yet found the words or the form to make it real |
| Core proposition | "You know what you want. We know how to build it." |
| Studio name | Main Stage Studio |
| Sector | Broad — creative founders across any sector. Not limited to events or any single vertical. |
| Values filter | Drawn to founders whose work has positive impact — engagements are chosen accordingly |
| Differentiator framing | PM rigour as the method, not the message. AI accelerates execution. Vision and judgment stay human. End-to-end: discovery through to live digital presence. |
| Studio voice in one line | Quietly confident, and genuinely empathetic. |
| Three words | Considered. Direct. Distinctive. (Aspirational — chosen with intention, not yet earned in public perception) |
| Personal/public boundary | Thinking is public. Person stays private. |
| AI positioning | AI as a craft tool, not a shortcut. The live layer of the website is proof of concept for clients. |

---

### Brand Identity — Visual

| Decision | What's locked |
|----------|--------------|
| Palette — Parchment | `#F5EFE5` — base / background / large surfaces |
| Palette — Warm blush | `#E8C9AE` — cards / secondary sections / subtle texture |
| Palette — Dusty terracotta | `#BF6B47` — primary accent / CTAs / logo mark / key moments |
| Palette — Deep ember | `#8C4A2F` — accent hover / depth |
| Palette — Near black | `#1C1712` — all type / structural elements / primary buttons |
| Colour principles | Max one accent colour per composition. Parchment is default background — never stark white or cool grey. Near-black for body type — never pure black. Terracotta as punctuation, not wallpaper. |
| Logo mark — structure | Two offset squares with deliberate negative space at intersection. Near-black top-right (leads, on top). Terracotta bottom-left (recedes behind). Parchment cutout at intersection. |
| Logo mark — corner radius | 2.5px on both squares, 1.5px on cutout |
| Logo mark — dark bg variant | Near-black square uses `#3D3128` to remain visible against dark backgrounds |
| Wordmark — Main Stage | Cormorant Garamond, weight 400, letter-spacing 0.02em |
| Wordmark — Studio | Plus Jakarta Sans, weight 400, letter-spacing 0.24em, uppercase, terracotta |
| Flat mark usage | Always primary in functional contexts — favicon, header, print, documents, email signatures |
| 3D mark / Higgsfield usage | Expressive layer only — hero video, brand film, social content. Never replace flat mark in functional contexts. |
| Minimum mark size | 32px |
| Typography — primary | Cormorant Garamond — display headings, wordmark, editorial moments. Weights 300–400 only. |
| Typography — secondary | Plus Jakarta Sans — body copy, navigation, UI labels, sub-headings. Weights 300–500. |
| Typography — Inter | Never use. Too generic for this identity. |
| Typographic principles | Headlines: large, tracked tight, left-aligned. Body: 16px, relaxed line-height, max-width ~65ch. All caps only for labels/descriptors at small sizes with wide tracking. No centred hero bias. |

---

### Brand Identity — Aesthetic

| Decision | What's locked |
|----------|--------------|
| Style direction | Editorial motion — considered, typographically confident layouts. Kinetic moments that hit hard because surrounding space is calm. |
| Motion principles | Hardware-accelerated only — `transform` and `opacity`. Never `top/left/width/height`. Motion is punctuation, not sentence. |
| What to avoid | Centred hero layouts. Generic card overuse. Purple/blue AI aesthetic. Gradient backgrounds. Motion as decoration. |
| Identity system — Layer 1 (Static) | Flat SVG mark + wordmark + palette + typography. Use for: PDF proposals, documents, favicons, email signatures, headers. |
| Identity system — Layer 2 (Live) | 3D mark render + Higgsfield video + scroll-triggered motion + kinetic typography. Use for: website hero, case study openers, social content, brand films. |

---

### Tone of Voice

| Decision | What's locked |
|----------|--------------|
| Brand character | Quietly confident, and genuinely empathetic. The rigour is real. So is the warmth. Neither works without the other. |
| What it never sounds like | Fluffy (no passion without substance). Arrogant (no "most studios do it wrong"). Unsure (no excessive hedging). Corporate (no passive voice, no buzzword stacking). |
| Copy principles | Say what you mean. No filler. Active voice. Lead with the reader's world, not the studio's process. Endings close with weight. Empathy before capability. |
| Five copy contexts | First impression / Discovery framing / Case study / Editorial / Proposal — each with distinct register. See `mss-tone-of-voice.md` and `copy-contexts.md`. |
| Empathy layer | Added 02 June 2026. The voice shift: same rigour, more warmth. Same clarity, more expressiveness. The studio understands what it feels like to have a vision you haven't found the words for. That's not stated as autobiography — it comes through in how the studio listens and works. |

---

### Skills

| Decision | What's locked |
|----------|--------------|
| Copywriting skill | Built and active. Two layers: craft (constant) and voice (context-dependent). Lives in `.claude/skills/copywriting/SKILL.md`. |
| Creative director skill | Active. Applies across all MSS and client sessions. |
| Voice files | MSS work uses `mss-tone-of-voice.md`. Client work uses the client's own tone of voice file. No copy before the voice file is loaded. |

---

### Website

| Decision | What's locked |
|----------|--------------|
| Stack | HTML/CSS prototype (Phase 1) then Bricks Builder on WordPress (Phase 2) |
| Hosting | Cloudways |
| Version control | GitHub — osmanakhtar/main-stage-studio |
| CSS framework | Tailwind CSS |
| Code principles | Asymmetric, editorial. No centred hero. No generic card overuse. Hardware-accelerated motion only. `min-h-[100dvh]` not `h-screen`. No emoji, no gradient backgrounds. |
| Domain | mainstagingstudio.co.uk — secured, nothing published yet |
| Workflow | Phase 1 (Claude web/desktop): discovery, positioning, copy, creative direction, HTML/CSS prototype. Phase 2 (Claude Code): build, GitHub push, publish. |

---

### Case Studies

| Decision | What's locked |
|----------|--------------|
| Case study structure | Two pages: a case study page in MSS voice telling the studio's story, followed by the fully realised client site. The case study page is the portfolio piece. The client site is the proof of capability. Added 03 June 2026. |
| Case study page structure | Eight sections: hero, the client, the challenge, the discovery, the decisions, the work, the reflection, the entry point. The entry point transitions into the client site via a full page fade. |
| Self-initiated concepts | Positioned transparently as self-initiated briefs, not fabricated client relationships. One honest line in the case study resolves the framing. |
| Portfolio pieces in progress | Sable (music, self-initiated, case study page built). Chef persona (self-initiated, brief to be developed). MSS building MSS (lead case study, in progress). |
| Creative identity rule | Each case study has its own creative identity — not inherited from MSS brand. If it starts looking like the MSS website, stop and restart from the brief. |
| Image treatment rule | Images on dark sections bleed into the background via CSS mask fade. Images on light sections use background colour matching or elliptical fade. Album artwork and designed objects retain hard edges always. |

---

### Sable — Brand Identity (Self-initiated case study)

| Decision | What's locked |
|----------|--------------|
| Creative insight | Soft and sharp. Soul and grit. She holds both and does not resolve the contradiction for you. |
| Wordmark | `sable` in Playfair Display, weight 400, wide-tracked, lowercase throughout |
| Descriptor | `london` in DM Sans, weight 300, gold #C89442, tracked wide, beneath the wordmark |
| Typography — display | Playfair Display, weight 400. Not MSS fonts. Completely separate identity. |
| Typography — body and UI | DM Sans, weight 300 and 400 |
| Palette — Bone | `#F0E8D8` — primary ground, homepage, arrival |
| Palette — Night | `#0D0C0B` — deep ground, music sections, immersive content |
| Palette — Coal | `#1C1A18` — secondary dark surface |
| Palette — Ash | `#3D3530` — tertiary dark surface |
| Palette — Gold | `#C89442` — accent, descriptor, punctuation throughout |
| Ground system | Bone leads on arrival. Dark deepens as the site goes deeper. Gold is the consistent thread. |
| Photography direction | Intimate and cinematic leads. AI-generated to narrative. Warm practical light sources only. |
| Copy voice | Still. Present. Guarded and private. The vulnerability lives in the music, not the copy. |
| Homepage copy line | "born in london. the rest is in the music." |
| CTA language | Single word always: listen, write |
| Album name | Between the Words |
| Album cover | sable-atmospheric.png with Playfair Display wordmark top left, DM Sans descriptor bottom left |
| Tour dates | 7 UK cities, autumn 2026. Intimate independent venues. |
| Hero video | sable-hero-18-secs-01.mov — freeze frame fades to near-black, text fades out before performance moment, returns on near-black |
| Two-page structure | Case study page in MSS voice. Artist site in Sable's voice. Entry point in section 08 transitions between them via full page fade. |
| Site sections | Arrival, music (Between the Words with checkout), tour (with ticketing overlay), connect |
| Documents | sable-brand-brief.md, sable-tone-of-voice.md, sable-homepage-copy-spec.md, sable-artist-site-spec.md, sable-case-study-page.md |

---

### Workspace Structure

| Decision | What's locked |
|----------|--------------|
| Repo root | `~/workspace/main-stage-studio/` — public GitHub repo |
| Client projects | Live at `02_clients/` — never inside `01_mss/` |
| Case studies | Live at `01_mss/portfolio/[client]/` — not in the client folder |
| mp4 assets | Local only — excluded from git. To be hosted via DAM (TBC). |
| ~~`locked-in-learning/admin`~~ | ~~Local only — never pushed to GitHub~~ — migrated to Studio 2 (25 May 2026) |
| Each case study | Has its own creative identity — not inherited from MSS brand |

---

### Committed Subscriptions

| Tool | Cost | Status |
|------|------|--------|
| Claude Pro | £20/month | Committed |
| Higgsfield | $45/month | Month one committed — extension pending |
| Bricks Builder | TBC | Pending — annual unlimited vs lifetime one-time. MSS sites in scope: MSS, Ayesha. PureMed and Locked In Learning tracked under Studio 2. |

---

## Open Decisions

These are known — they haven't been made yet. Some are blockers.

| Decision | Why it's open | Blocker? |
|----------|--------------|---------|
| DAM — Cloudflare R2 vs Bunny.net | Must be decided before video assets can go live or build starts in earnest | Yes — resolves before build |
| Contact / intake form | Native WordPress or third party (Typeform, Tally, etc.) | Decide before build |
| Bricks Builder licence | Annual unlimited vs lifetime one-time. 4 sites in scope. | Financial — decide before build starts |
| Higgsfield subscription extension | Month one committed — worth extending? | Review after month one |
| LinkedIn company page | Claimed — not yet populated or active | Low urgency, pre-launch |
| Editorial section | Direction of travel — not yet active. Studio point of view, not personal blog. | Post-launch |
| Chef persona brief | Character and tension not yet defined | Needed before build starts |
| Spend tracker reconciliation | Additional Claude spend and subscription costs to be logged | Owner action — update ad hoc |
| MSS homepage copy rewrite | Needs rewriting to reflect updated tone of voice. Current version predates empathy layer. | Before anything goes live |
| Sable artist site build | Fully specced. Waiting for Claude Code session. | Next build task |
| Sable site screenshots | Section 06 of case study page has two placeholders. Replace once artist site is built. | Post artist site build |

---

## Flagged — Needs Check

Items that look incomplete or potentially contradictory. Resolve before treating them as locked.

| Item | What needs checking |
|------|---------------------|
| Voss case study | Placeholder only — needs proper rebuild. No timeline set. |
| Ayesha engagement | Active client, on hold. No client project instruction template defined yet — that's the actual blocker. Resolve before resuming. |
| `mss-new-client-checklist.md` | Not yet reviewed in this review cycle — may be out of date |
| `mss-spend-tracker.md` | Not yet reviewed in this review cycle — update ad hoc when figures confirmed |
| `constraints.md` template | No template exists in `02_clients/_template/`. Structure is only documented inside workflow guide prompts — needs a standalone template file created and placed in the client template folder. |
| MSS tone of voice — em dashes | Several em dashes remain in the worked examples throughout `mss-tone-of-voice.md`. Needs cleaning before the document is used as a copy reference. |

---

## Change History

| Date | What changed | Why |
|------|-------------|-----|
| 03 June 2026 | Sable brand identity locked in full | Self-initiated case study — complete discovery, brand, and build session |
| 03 June 2026 | Case study two-page structure locked | Case study page in MSS voice, client site in client voice. Entry point transitions between them. |
| 03 June 2026 | Case study page structure updated | Now eight sections. Framing page approach superseded by full case study page with entry point into client site. |
| 03 June 2026 | Image treatment rule added to case studies | Fade treatment for images on dark sections. Background colour matching for portraits on light sections. Hard edges for designed objects. |
| 03 June 2026 | MSS homepage copy rewrite added to Open Decisions | Current homepage copy predates the updated tone of voice and empathy layer. Needs rewriting before launch. |
| 02 June 2026 | Tone of voice updated — empathy layer added to brand character | Voice recalibration: same rigour, more warmth. Short sentences felt abrupt for a creative founder audience. |
| 02 June 2026 | Copy contexts updated — First Impression and Discovery Framing revised, Case Study and Editorial guidance updated | Aligned to updated tone of voice |
| 02 June 2026 | Case study framing page locked as structural approach | Confirmed in session — framing page precedes full case study write-up |
| 02 June 2026 | Studio voice in one line updated | Was "Quietly confident. Doesn't need to prove anything." Now "Quietly confident, and genuinely empathetic." |
| 25 May 2026 | Locked In Learning migrated out of MSS scope | Doesn't fit creative founder proposition — moved to Studio 2 |
| 25 May 2026 | PureMed removed from MSS Flagged section | Not an MSS project — tracked under Studio 2 |
| 25 May 2026 | Bricks Builder site count updated | PureMed and Locked In Learning now under Studio 2 |
| 25 May 2026 | Ayesha flagged item clarified | Blocker is the missing client project instruction template — not ambiguous status |
| 25 May 2026 | Decisions log created | Review cycle — consolidating locked decisions from brand identity, tone of voice, copywriting skill, and website brief sessions |
| 24 May 2026 | Brand identity, tone of voice, copywriting skill — all updated | Review cycle — full rebuild of brand and voice layer |
| 24 May 2026 | Website brief — updated | Copy direction added; stack and code principles confirmed |
