# Main Stage Studio, Website Copy Review

*A per-page, per-element instrument for reviewing every piece of copy on the MSS site.*
*Created: 16 June 2026*

---

## How to use this file

This is a working audit tool, not a copy document. Run it against the live site one page at a time.

For each copy element there are three jobs:

1. **Reconcile.** The "Copy of record" column holds the copy as documented in the source files (website brief, decisions log, tone of voice). Open the live page and confirm the live copy matches. Tick the **Live match** column: `Y` if identical, `N` if it differs, `?` if the element is not documented and you need to read it off the page.
2. **Review.** Run the copy element against the quality lens below and the register for that section. Note anything that fails.
3. **Decide.** Mark a status: `Keep`, `Edit`, `Rewrite`, or `Cut`.

A note on provenance: a flagged item in the decisions log says the website brief copy may sit slightly ahead of, or behind, what is actually live. Do not assume the page matches the brief. The point of the Live match column is to catch exactly that drift.

---

## The review lens

Every copy element gets checked against the same craft list (from the copywriting skill quality check):

- First sentence starts on the thing, not the approach to the thing
- Every sentence earns its place
- Active voice throughout
- Hedges and qualifiers cut ("we think", "in our experience", "perhaps")
- Leads with the reader's world, not the studio's process
- Empathy before capability
- Ending closes with weight, not a trail-off
- Sounds like the MSS voice, not generic copy
- Read aloud: does it stumble anywhere

### Register per section

Each section has its own temperature. The voice character stays constant, the register shifts.

| Section | Register | What the reader should feel |
|---|---|---|
| Hero | First Impression | Recognised before they feel sold to |
| Work / case study cards | Case Study | The client's world is the subject, not the studio's process |
| Process | Discovery Framing | The logic of the sequence, not a methodology lecture |
| About | First Impression / honest model framing | The model is honest and the rigour is real, without over-explaining |
| Start a project | Proposal / Direct Client Communication | Low friction, talking to a person not a form |
| Editorial (future) | Editorial Voice | A position stated, not opinion hedged |

---

# Page 1: Homepage (`index.html`)

Status: prototype built. Per the decisions log, copy was to be revisited after the full context file review. Treat the homepage as the priority for this audit.

## 1.1 Navigation / Header

| Element | Copy of record | Source | Live match | Review notes | Status |
|---|---|---|---|---|---|
| Wordmark | "Main Stage" (Cormorant Garamond) + "STUDIO" (Plus Jakarta Sans, terracotta, tracked) | Brand identity | | Visual, not body copy. Confirm the descriptor renders as locked. | |
| Nav links | [pull from live page] | Not documented | | Confirm labels, order, and that they match section anchors. | |
| Nav CTA | "Start a project" | Website brief | | Must match the hero CTA and the contact section heading exactly. | |

## 1.2 Hero

Register: First Impression. Empathy before capability. Opens with the reader's experience, not the studio's offer.

| Element | Copy of record | Live match | Status |
|---|---|---|---|
| Headline / proposition | "Your vision doesn't need permission. It needs form." | | |
| Body, para 1 | "Most people with something real to say spend years waiting for the right moment, the right structure, the right framework that finally gives them permission to say it. That moment rarely arrives on its own." | | |
| Body, para 2 | "Main Stage Studio exists for the people who stop waiting." | | |
| Body, para 3 | "We work with people who have something real to say and need a thought partner who can help them find the form to say it. The brief is rarely the real brief. That's always where we start." | | |
| CTA | "Start a project" | | |

Source for all hero rows: website brief, locked 05 June 2026.

Hero review checks:
- [ ] Opens on the reader's experience ("Your vision"), not the studio
- [ ] Empathy lands before any capability claim
- [ ] No adjectives doing work that substance should do
- [ ] "The brief is rarely the real brief" still earns its place, or is it now a tic across the site (it also appears in positioning and the About logic). Check for repetition fatigue.
- [ ] Headline reads cleanly aloud as two beats

## 1.3 Work / Portfolio (homepage section)

Register: Case Study. Each card leads with the client's world. Deliverables are not achievements, outcomes are.

| Element | Copy of record | Source | Live match | Review notes | Status |
|---|---|---|---|---|---|
| Section heading | [pull from live page] | Not documented | | Confirm wording and that it is not a generic "Our Work". | |
| Card 1, client name | "MSS building MSS" (entry-level, leads grid) | Decisions log | | Decisions log names MSS and Sable as homepage leads. Workspace folders list `chef` and `music`. Reconcile which two are actually on the live homepage. | |
| Card 2, client name | "Sable" (entry-level, leads grid) | Decisions log | | Same reconciliation as above. | |
| Card, sector line | [pull from live page] | Not documented | | One line per card. Check it reads as the client's sector, not studio jargon. | |
| Card, services line | [pull from live page] | Not documented | | Services listed, not dressed as achievements. | |
| "View all work" link | "View all work" | Website brief | | Leads to dedicated Work page. Confirm the page exists, or the link is dead. Work page is not built until three case studies are complete. | |

Work section review checks:
- [ ] Homepage shows only the two or three strongest, not the full grid
- [ ] Each card opens on the client, not on MSS
- [ ] No deliverable lists posing as outcomes
- [ ] Card copy makes someone want to open the case study

## 1.4 Process

Register: Discovery Framing. Frame the process as a journey, not a service menu. Make the reader feel the logic, do not explain the methodology.

| Element | Copy of record | Source | Live match | Review notes | Status |
|---|---|---|---|---|---|
| Section heading | [pull from live page] | Not documented | | | |
| Stage 1 label | "Discovery" | Website brief | | | |
| Stage 1 description | [pull from live page] | Not documented | | Check it opens the conversation, does not diagram a phase. | |
| Stage 2 label | "Brand Expression" | Website brief | | | |
| Stage 2 description | [pull from live page] | Not documented | | | |
| Stage 3 label | "Design System" | Website brief | | | |
| Stage 3 description | [pull from live page] | Not documented | | | |
| Stage 4 label | "Web Presence" | Website brief | | | |
| Stage 4 description | [pull from live page] | Not documented | | | |
| Sequence line | The sequence is the point: each stage informs the next | Website brief (direction) | | Confirm this logic is stated, not over-explained. | |

Process review checks:
- [ ] Reads as a journey, not a list of services
- [ ] No "Phase 1 involves..." framing
- [ ] The reader feels why the sequence matters without being lectured

## 1.5 About

Register: honest model framing, First Impression warmth. Product management is the differentiator. No bios, no headshots, no personal disclosure beyond what serves the work.

| Element | Copy of record | Live match | Status |
|---|---|---|---|
| Section heading | [pull from live page] | | |
| Para 1 | "Main Stage was built by someone who spent years being effective at things that weren't quite the right fit. The rigour stayed. The expression got parked. This is what happens when you stop parking it." | | |
| Para 2 | "The background is product management, which means one thing above everything else: understand the problem properly before you touch the solution. That discipline runs underneath everything the studio makes." | | |
| Para 3 | "The tools have changed what's possible. The judgment about what to do with them hasn't changed hands." | | |
| Para 4 | "Drawn to people whose work means something beyond the commercial. If what you're building matters to you, it matters here." | | |

Source for About paragraph rows: website brief, locked 05 June 2026.

About review checks:
- [ ] Person stays private, thinking stays public
- [ ] Honest about the AI model without over-explaining it
- [ ] No headshot or bio copy crept in
- [ ] Closes with weight (para 4 is the close, confirm it lands)

## 1.6 Start a project (contact)

Register: Proposal / Direct Client Communication. Low friction. Talking to a person, not issuing a form.

| Element | Copy of record | Source | Live match | Review notes | Status |
|---|---|---|---|---|---|
| Section heading | "Start a project" | Website brief | | Must match the nav CTA and hero CTA exactly. | |
| Intro / framing line | [pull from live page] | Not documented | | If present, check it is an invitation, not instructions. | |
| Field label, name | "Name" | Website brief | | | |
| Field label, email | "Email" | Website brief | | | |
| Field label, project | "Tell me about your project" | Website brief | | First person ("me") signals one person behind the studio. Confirm it is consistent with the voice elsewhere, which mixes "we" and "I". | |
| Submit button | [pull from live page] | Not documented | | Avoid generic "Submit". | |
| Success / confirmation message | [pull from live page] | Not documented | | Often forgotten. Check the post-send message exists and is in voice. | |

Contact review checks:
- [ ] No long form, low friction confirmed
- [ ] Pronoun choice ("I" vs "we") is deliberate and consistent with the page
- [ ] Button copy is not generic

## 1.7 Footer and global

| Element | Copy of record | Source | Live match | Review notes | Status |
|---|---|---|---|---|---|
| Footer tagline / line | [pull from live page] | Not documented | | | |
| Footer nav / links | [pull from live page] | Not documented | | | |
| Copyright line | [pull from live page] | Not documented | | Confirm year reads 2026, studio name spelled correctly. | |
| Email / contact detail | [pull from live page] | Not documented | | | |
| Social links label | [pull from live page] | Not documented | | LinkedIn page is claimed but not yet populated. Confirm the link does not lead somewhere empty. | |

## 1.8 Meta and non-visible copy

Easy to forget, and it is the first copy a search result or a shared link shows.

| Element | Copy of record | Live match | Review notes | Status |
|---|---|---|---|---|
| Page title (`<title>`) | [pull from live page] | | Should carry the proposition or studio line, not "Home". | |
| Meta description | [pull from live page] | | First Impression register in under 160 characters. | |
| Open Graph title / description | [pull from live page] | | What shows when the link is shared. | |
| Image alt text | [pull from live page] | | Logo and key images need alt text in voice, not filenames. | |

---

# Page 2: Work (dedicated portfolio page)

Status: per the decisions log, the Work page is **not built until three case studies are complete**. If a live page exists, it is likely a placeholder.

| Element | Copy of record | Live match | Review notes | Status |
|---|---|---|---|---|
| Page heading | [pull from live page] | | | |
| Page intro | [pull from live page] | | If present, confirm it frames the portfolio, does not sell the studio. | |
| Full card grid copy | [pull from live page] | | Same Case Study register as the homepage cards. | |

Documented portfolio split to reconcile against the live grid:
- Homepage leads: MSS building MSS, Sable
- Dedicated work page depth: Apex FC, professional services concept (doctor, consultant, dietitian)
- Off site entirely: PureMed
- Note the workspace folders list `chef` and `music`, which do not map cleanly to the names above. Resolve the naming before this page goes live.

---

# Page 3 onward: Case study pages (framing + full)

Status: per the current stage notes, case study pages are to be rebuilt from scratch. Existing versions are placeholder only. Decisions log confirms each case study has a framing page written before the full write-up, and its own creative identity, not the MSS aesthetic.

Use this block per case study once real copy exists. Duplicate the table for each one.

### Case study: [client name]

**Framing page**

| Element | Copy of record | Live match | Review notes | Status |
|---|---|---|---|---|
| Framing intro (3 to 4 sentences) | [pull from live page] | | Opens with the client's world. Makes someone want to read the full study. Does not summarise it. | |
| Link into full case study | [pull from live page] | | | |

**Full case study**

| Element | Copy of record | Live match | Review notes | Status |
|---|---|---|---|---|
| Client and context | [pull from live page] | | Who they are, what they do, why it matters. | |
| The challenge | [pull from live page] | | Leads with their world, not the brief. No "we were approached by". | |
| The strategic insight | [pull from live page] | | The single sentence that unlocked the work. | |
| What was built | [pull from live page] | | Not a deliverable list. | |
| Outcomes | [pull from live page] | | No vague outcomes ("delighted with the results"). | |
| Reflection | [pull from live page] | | One honest paragraph. | |
| Self-initiated framing line | [pull from live page] | | Concepts are positioned transparently as self-initiated briefs, one honest line, not fabricated client relationships. | |

Case study review checks:
- [ ] Creative identity reads as the client's world, not MSS
- [ ] No "We were approached by..." opener
- [ ] Strategic insight is one clear sentence
- [ ] Framing page and full study work as a pair

---

# Page: Editorial

Status: direction of travel, not yet active. No copy to review. Listed here so the audit is complete and the section is not forgotten when it goes live. Register when live: Editorial Voice, a studio stance, not a personal blog.

---

# Cross-page consistency checks

Run these once, across the whole site, after the per-page pass.

- [ ] "Start a project" is worded identically in nav, hero, and contact section
- [ ] Studio name is "Main Stage Studio" everywhere, never "MainStage" or "Main Stage Studios"
- [ ] Pronoun logic holds: "we" for studio voice, "I" for direct client lines, used deliberately not randomly
- [ ] "The brief is rarely the real brief" is not overused across hero, process, and about
- [ ] Proposition line "Your vision doesn't need permission. It needs form." matches between hero and any meta or social copy
- [ ] No em dashes if the studio house style is moving away from them, or consistent em dash usage if it is keeping them. Pick one and apply site-wide.
- [ ] No corporate tells: passive voice, buzzword stacking, "holistic", "end-to-end solution"
- [ ] Empathy before capability holds on every page that introduces the studio

---

# What only the live HTML can confirm

These elements are not in any source file. They must be read directly off the built pages and pasted in before this audit is complete:

- All navigation labels and order
- Work and process section headings
- All work card copy (sector lines, services lines)
- All four process stage descriptions
- Contact intro line, submit button, success message
- Entire footer
- All meta, Open Graph, and alt text
- Any microcopy: hover states, link labels, form validation messages

To close those gaps quickly: paste the built `index.html` (and any other built page) into a session and the verbatim copy can be extracted straight into the "Copy of record" cells, turning every `[pull from live page]` into real text.

---

# Sign-off

| Page | Reviewed | Reconciled to live | Edits actioned | Signed off |
|---|---|---|---|---|
| Homepage | | | | |
| Work page | | | | |
| Case studies | | | | |
| Editorial | n/a | n/a | n/a | n/a |
| Cross-page consistency | | | | |
