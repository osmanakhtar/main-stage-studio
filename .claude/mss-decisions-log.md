# Main Stage Studio — Decisions Log

*Living document. Add entries when something is locked or changed.*
*Never delete — mark superseded decisions with ~~strikethrough~~ and note the date.*
*Last reviewed: 19 June 2026*

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
| ~~Client definition~~ | ~~Creative founders who lead with instinct and identity — people who know what they're building and why, but haven't yet found the words or the form to make it real~~ |
| Client definition | People with something real to say that hasn't yet found its form. Founders, established businesses that have lost calibration, creatives at any stage. The common thread is the gap between what something is and how it currently shows up. |
| ~~Core proposition~~ | ~~"You know what you want. We know how to build it."~~ |
| Core proposition | "Your vision doesn't need permission. It needs form." |
| Studio name | Main Stage Studio |
| Sector | Broad — any sector. Not limited to creative founders or any single vertical. |
| ~~Values filter~~ | ~~Drawn to founders whose work has positive impact — engagements are chosen accordingly~~ |
| Values filter | Drawn to people whose work means something beyond the commercial. Not sector-specific. The filter is intent, not industry. |
| Differentiator framing | PM rigour as the method, not the message. AI accelerates execution. Vision and judgment stay human. End-to-end: discovery through to live digital presence. |
| Studio voice in one line | Quietly confident, and genuinely empathetic. |
| Three words | Considered. Direct. Distinctive. (Aspirational — chosen with intention, not yet earned in public perception) |
| Personal/public boundary | Thinking is public. Person stays private. |
| AI positioning | AI as a thinking partner and craft tool, not a shortcut. The judgment about what to do with it hasn't changed hands. The live layer of the website is proof of concept for clients. |
| Studio structure | Single studio. No second agency or brand. A second studio concept (provisional working name "Studio 2", execution-first proposition for professional consultants) was explored after 25 May and reversed on 17 June 2026, following a sense check on overhead at pre-revenue stage. PureMed Aesthetics and Locked In Learning are standalone personal projects, not under any studio brand. They may surface later on a future MSS Work page, at the studio's discretion, but are not part of MSS positioning. |

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
| Non-conformist thread | The confidence in the voice has a spine. A belief that the vision deserves to be heard regardless of where it comes from or what structures it has to navigate. This doesn't appear on the surface. It runs underneath everything. |
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
| Bricks skill system | Added 19 June 2026. The original single `bricks-html-importer` skill was being violated in production (Code elements used for content where native elements should have been used) and mixed three separate concerns. Replaced with four skills: `bricks-site-connection` (MCP and environment setup), `bricks-lowcode-skill` (element and style reference catalogue), `bricks-html-importer` (HTML-to-Bricks conversion workflow), and `bricks-mss-site-notes` (MSS-specific build history and fixes). See Flagged for a verification gap in the element catalogue. |

---

### Website

| Decision | What's locked |
|----------|--------------|
| Stack | HTML/CSS prototype (Phase 1) then Bricks Builder on WordPress (Phase 2) |
| Hosting | Cloudways |
| Version control | GitHub — osmanakhtar/main-stage-studio |
| CSS framework | Tailwind CSS |
| Code principles | Asymmetric, editorial. No centred hero. No generic card overuse. Hardware-accelerated motion only. `min-h-[100dvh]` not `h-screen`. No emoji, no gradient backgrounds. |
| Domain | mainstagingstudio.co.uk. Live and published as of mid-June 2026, hosted on Cloudways via WordPress and Bricks. A separate reference to "mainstagestudio.co.uk" (without "ing") surfaced in one session, see Flagged to confirm which spelling is correct on the live DNS. |
| Workflow | Phase 1 (Claude web/desktop): discovery, positioning, copy, creative direction, HTML/CSS prototype. Phase 2 (Claude Code): build, GitHub push, publish. |
| Work section | Homepage shows curated highlights — two or three strongest case studies. Dedicated Work page holds full portfolio. "View all work" link on homepage. Work page not built until three case studies are fully complete, and deferred further behind the PureMed Aesthetics build per the 17 June studio structure decision above. |
| DAM | Bunny.net. Account provisioned. Resolves the earlier Cloudflare R2 vs Bunny.net open decision. |
| Bricks Builder licence | Lifetime, one-time fee. Purchased and confirmed, resolving the earlier annual-vs-lifetime open decision. |
| Contact form | Native WordPress, custom must-use plugin (`mss-contact.php`) relaying through Google Workspace SMTP to hello@. Reply-To set to the visitor's email. Resolves the earlier native-vs-third-party open decision. See Flagged — one session noted the live contact section rendering as text only with no visible form, needs confirming. |

---

### Case Studies

| Decision | What's locked |
|----------|--------------|
| Case study structure | Each case study has a framing page before the full write-up. The framing page is written as part of the story phase, not the build phase. Added 02 June 2026. |
| Self-initiated concepts | Positioned transparently as self-initiated briefs, not fabricated client relationships. One honest line in the case study resolves the framing. |
| Portfolio — entry level | MSS building MSS and Sable lead the homepage grid. Most accessible, speak directly to the core audience. Both are built and live as of mid-June 2026. |
| Portfolio — depth | Apex FC and a professional services concept (doctor, consultant, dietitian) were planned for the dedicated work page. Apex FC build was deferred by the founder ("build that later") — treat as not currently active rather than locked. |
| Portfolio — off site | PureMed and Locked In Learning stay off the MSS site for now. Standalone personal projects, not part of the MSS proposition. May surface later on the future Work page, at the studio's discretion, once it exists. |
| Creative identity rule | Each case study has its own creative identity — not inherited from MSS brand. If it starts looking like the MSS website, stop and restart from the brief. |
| Sable case study | Built and live on the homepage. Received scroll/motion polish in a session on 06 June 2026. This file previously flagged Sable as "placeholder only, needs proper rebuild" — that flag was incorrect and has been removed. |
| Ayesha case study | Homepage card exists with a footer note reading "Visual assets incoming, late 2026." No link live yet. See Flagged — the underlying engagement's instruction-template blocker was never confirmed resolved, despite the card's existence suggesting some progress. |
| Voss case study | No information found in recent sessions beyond the original flag. See Flagged. |

---

### Workspace Structure

| Decision | What's locked |
|----------|--------------|
| Repo root | `~/workspace/main-stage-studio/` — public GitHub repo |
| Client projects | Live at `02_clients/` — never inside `01_mss/` |
| Case studies | Live at `01_mss/portfolio/[client]/` — not in the client folder |
| mp4 assets | Local only — excluded from git. Hosted via Bunny.net once live. |
| ~~`locked-in-learning/admin`~~ | ~~Local only — never pushed to GitHub~~ — ~~migrated to Studio 2 (25 May 2026)~~ — Studio 2 reversed 17 June 2026, see Positioning |
| Locked In Learning | Standalone personal project. Sits in its own top-level workspace folder, separate from the MSS repo. Not part of MSS or any studio brand. |
| PureMed Aesthetics | Standalone personal project, same status as Locked In Learning. May surface on a future MSS Work page once built, at the studio's discretion. |
| Each case study | Has its own creative identity — not inherited from MSS brand |
| Two `.claude` folders | `~/workspace/main-stage-studio/.claude` is the repo-specific context folder: MSS strategy, brand, voice, decisions. `~/.claude/` (osmanakhtar/.claude) is the global layer: portable skills and Claude Code config that aren't tied to MSS. Skills that are genuinely cross-project (Bricks skill family, copywriting, creative-director) live globally. Anything that would be wrong or missing if a session forgot MSS context lives in the repo folder. Confirmed 19 June 2026 via README audit. |

---

### Committed Subscriptions

| Tool | Cost | Status |
|------|------|--------|
| Claude Pro | £20/month | Committed |
| Higgsfield | $45/month | Month one committed — extension pending |
| Bricks Builder | Lifetime licence | Purchased and confirmed. Covers MSS, Ayesha, and the personal projects (PureMed, Locked In Learning) as shared infrastructure only, not a shared brand. |

---

## Open Decisions

These are known — they haven't been made yet. Some are blockers.

| Decision | Why it's open | Blocker? |
|----------|--------------|---------|
| Higgsfield hero asset | Can only be generated once visual identity is fully locked and brief is clear | Depends on identity lock |
| Higgsfield subscription extension | Month one committed — worth extending? | Review after month one |
| LinkedIn company page | Claimed — not yet populated or active | Low urgency, pre-launch |
| Editorial section | Direction of travel — not yet active. Studio point of view, not personal blog. | Post-launch |
| Spend tracker reconciliation | Additional Claude spend and subscription costs to be logged | Owner action — update ad hoc |
| Professional services case study | Doctor, consultant, dietitian or similar. Concept brief to demonstrate that use case. No longer urgent given Apex FC deferral — work page itself is now deferred behind PureMed. | No timeline set |
| Work page structure | When the Work page is eventually built: will it replace the homepage's curated highlights, hold full case studies directly, or link out to separate framing pages. To be settled once the PureMed build is complete and the Work page is actually being designed. | No, deferred by design |

---

## Flagged — Needs Check

Items that look incomplete or potentially contradictory. Resolve before treating them as locked.

| Item | What needs checking |
|------|---------------------|
| `mss-website-brief.md` | Proposition line and hero copy updated in session 05 June 2026 — file needs updating to reflect new copy |
| `mss-tone-of-voice.md` first impression example | Still references "creative founders" — update to remove founder-specific language |
| Voss case study | Status unknown — confirm whether still planned, renamed, or shelved |
| Ayesha engagement | Homepage card exists with a "visual assets incoming" note, suggesting some progress, but the original blocker (missing client project instruction template) was never confirmed resolved. Confirm whether the engagement is on hold or has resumed. |
| Apex FC case study copy | Written in session 05 June 2026, needs review through updated lens before build starts. Build itself has been deferred by the founder — confirm this copy work isn't wasted effort if the concept changes before it's picked back up. |
| MSS case study | Needs full rewrite through updated lens — non-conformist thread, wider client definition, AI as thinking partner framing. No timeline set. |
| Domain spelling | This log locks `mainstagingstudio.co.uk`. A separate session referenced the live site as `mainstagestudio.co.uk`, without the "ing". Confirm which is correct on the live DNS and fix the other reference. |
| Portfolio folder naming | A copy audit on 06 June flagged that this log's homepage-grid language (MSS, Sable) doesn't map cleanly to the actual workspace folder names (`chef`, `music`). Reconcile the naming. |
| Contact form frontend | Backend (mu-plugin and SMTP relay) is built, but one session noted the live site showing the contact section as text only, no visible form rendering. Confirm the form actually renders before treating this as fully resolved. |
| `mss-new-client-checklist.md` | Not yet reviewed in this review cycle — may be out of date |
| `mss-new-case-study-checklist.md` | Not yet reviewed in this review cycle — may be out of date |
| `mss-spend-tracker.md` | Not yet reviewed in this review cycle — update ad hoc when figures confirmed |
| `constraints.md` template | No template exists in `02_clients/_template/`. Structure is only documented inside workflow guide prompts — needs a standalone template file created and placed in the client template folder. |
| `mss-bricks-build-guide.md` / `mss-bricks-quick-fixes.md` | Added 19 June 2026. Content has been folded into the new `bricks-mss-site-notes` skill, but these two files haven't been formally retired or marked superseded. Decide whether to mark them superseded in favour of the skill, or keep them as the longer-form reference the skill points back to. |
| `bricks-lowcode-skill` element catalogue | Added 19 June 2026. Built from a live `get_builder_guide` pull against PureMed's install, not MSS's own. Needs a fresh pull against the MSS/Ayesha install before its element list can be treated as verified for MSS work. |
| Docs audit | Confirmed present at repo root (docs-audit-2026-06-19.md), tracked in git since commit b7e1e31. Of its 10 numbered decisions: closed are 1 (build-guide duplicate deleted), 4 (ghost file investigated, no action needed), 5 (strategy-folder duplicates resolved), 6 (copywriting skill consolidated), 7 (bricks-mss-site-notes now points to the build guide and quick-fixes files), 8 (mss-production-ops.md created), 10 (CLAUDE.md corrected). Still open: 2 (three HTML files in 01_mss/strategy/ — system architecture extracted, tooling rationale extraction pending, final archive/delete decision pending), 3 (Bricks_Workflow_User_Guide.docx not yet actioned), 9 (final sweep of this log for stale Open items — largely done through tonight's fixes, worth one more pass to confirm). |
| Project custom instructions | Recommended 13 June 2026: move context files into Claude Project custom instructions and knowledge instead of attaching per session, plus a model-routing default (Haiku for mechanical work, Opus for thinking). Adoption status unconfirmed. |

---

## Change History

| Date | What changed | Why |
|------|-------------|-----|
| 19 June 2026 | Corrected false claim that the docs audit file "was never located on disk" | A prior session searched incorrectly and wrote a wrong conclusion into this log. Confirmed via `find` and `git log` that the file exists and has been tracked since commit b7e1e31. |
| 19 June 2026 | `mss-decisions-log-workflow.md` and `mss-studio-ops-checklist.md` created | README referenced both files but neither existed. Created to complete the audit. |
| 19 June 2026 | Two-`.claude`-folders flagged item resolved | `README.md` audit locked the distinction: repo `.claude/` for MSS-specific context, global `~/.claude/` for portable skills. |
| 19 June 2026 | This file rebuilt from the correct 05 June base | A stale 25 May fork had been worked on in a parallel session and was mistakenly treated as current. The 05 June repo version (`workspace/main-stage-studio/.claude`) confirmed as the real lineage. All changes since 05 June folded in: Studio 2 reversed, DAM and Bricks licence resolved, site confirmed live, contact form built, Sable's stale "placeholder" flag removed, Bricks skill system added, several new items flagged |
| 17 June 2026 | Studio 2 venture reversed, single studio confirmed | A sense check on 4 June raised the overhead problem at pre-revenue stage. Founder confirmed: one studio, PureMed and Locked In Learning stay personal projects, possible future surface on an MSS Work page only |
| 17 June 2026 | DAM resolved to Bunny.net | Account provisioned, closes the Cloudflare R2 vs Bunny.net open decision |
| 17 June 2026 | Bricks Builder licence resolved to lifetime | Purchased, closes the annual vs lifetime open decision |
| 17 June 2026 | Contact form resolved to native WordPress | Custom mu-plugin relaying through Google Workspace SMTP, closes the native vs third-party open decision. Frontend rendering flagged for confirmation |
| 19 June 2026 | Bricks skill system added — four skills replacing the single `bricks-html-importer` approach | Original skill was being violated in production (Code elements used for content) and mixed three concerns — connection, element/style reference, conversion workflow — that needed separating |
| 05 June 2026 | Client definition widened — "creative founders" retired | Case study audit revealed three distinct archetypes: founders, established businesses that have lost calibration, creatives at any stage. Common thread is the gap between what something is and how it shows up, not life stage |
| 05 June 2026 | Core proposition updated — "You know what you want. We know how to build it." retired | Too narrow. Assumed clarity on the client's side. New line: "Your vision doesn't need permission. It needs form." |
| 05 June 2026 | Values filter updated — "founders" removed | Aligned to widened client definition. Filter is intent, not industry or life stage |
| 05 June 2026 | Non-conformist thread added to tone of voice | Voice recalibration: the confidence has a spine. A belief that the vision deserves to be heard. Runs underneath everything without appearing on the surface |
| 05 June 2026 | AI positioning updated | Reframed from "craft tool, not a shortcut" to "thinking partner." The judgment about what to do with the tools hasn't changed hands |
| 05 June 2026 | Work section structure locked | Homepage: curated highlights, two or three case studies. Dedicated Work page for full portfolio. PureMed off site entirely |
| 05 June 2026 | Hero copy and about section copy updated | Full rewrite in session. Hero proposition line, body copy, and about section all updated |
| 02 June 2026 | Tone of voice updated — empathy layer added to brand character | Voice recalibration: same rigour, more warmth |
| 02 June 2026 | Copy contexts updated — First Impression and Discovery Framing revised, Case Study and Editorial guidance updated | Aligned to updated tone of voice |
| 02 June 2026 | Case study framing page locked as structural approach | Confirmed in session — framing page precedes full case study write-up |
| 02 June 2026 | Studio voice in one line updated | Was "Quietly confident. Doesn't need to prove anything." Now "Quietly confident, and genuinely empathetic." |
| 25 May 2026 | Locked In Learning migrated out of MSS scope | Doesn't fit creative founder proposition — moved to Studio 2 (later reversed 17 June) |
| 25 May 2026 | Decisions log created | Review cycle — consolidating locked decisions from brand identity, tone of voice, copywriting skill, and website brief sessions |
| 24 May 2026 | Brand identity, tone of voice, copywriting skill — all updated | Review cycle — full rebuild of brand and voice layer |
| 24 May 2026 | Website brief — updated | Copy direction added; stack and code principles confirmed |
