# Intake, case study plan

*Created 7 August 2026. Revised 8 August 2026 for the three-tenant pivot, see §11.*
*Plan only, nothing built.*
*Subject: the multi-tenant client-journey engine at `workspace/booking-engine/`.*
*Run against `.claude/mss-new-case-study-checklist.md`. Every deviation from that
checklist is named and justified below rather than quietly taken.*

---

## 1. What this piece has to do

The Systems service line has no public proof asset. Positioning v5 §5.2 says so
outright, and gives the reason: the founder's real evidence is a wealth platform's
onboarding architecture that sits too close to the employer's product to ever be
shown. Systems currently launches on credential alone.

This case study is the substitute. It is the only Systems artefact that can be
published, which is not a weakness to hide but the thing that makes it worth
publishing.

**It must not read as "we built a booking system."** That reinstates the clinic
vertical v4 dropped, sells a utility rather than an engagement, and puts the
flagship Systems proof in the one sector with no personal track record behind it.

---

## 2. Name and label

| | |
|---|---|
| **Project name (card headline)** | **Intake** |
| **Case study hero line** | **Show your working.** |
| **Card label** | `Case Study · Systems` |
| **Status stamp** | `Self-initiated` |
| **Nav label (studio chrome)** | `Case study`, per the 7 Aug rule. Nobody paid for this |
| **Sector line** | Regulated Professional Services |
| **Scope line** | Journey Architecture · Rules Design · Prototype |

"Booking Engine" is the internal name and should not survive contact with the
site. It describes the mechanism, undersells the work, and points at the wrong
buyer. **Intake** is what the thing actually is for a regulated firm, it is the
word the target buyer already uses, and it travels across both tenants.

"Show your working" carries the whole argument in three words, is plain rather
than clever, and is the one line that means the same thing to a compliance officer
and to a designer.

---

## 3. Where it lives

Following the Sable precedent exactly: a case study page, with the artefact itself
as a sibling route that carries a return bar and is noindexed.

```
Site routes
  /work/intake/              the case study
  /work/intake/prototype/    the live thing, noindex, return bar at the foot

Source
  01_mss/portfolio/intake/   this plan, copy, assets, creative brief
  workspace/booking-engine/  the engine itself, unchanged, still the source of truth
```

### On porting the prototype, a deviation worth taking

Sable's site was ported into Astro. **Do not port this one.** Sable's page was
markup. This is 1,600 lines of interdependent state, rules and rendering, and
re-expressing it as an Astro page buys nothing and risks the one thing the piece
is selling, which is that it works.

Ship it as a static file under `public/` and route to it. Two jobs before it goes:

1. **Self-host the fonts.** It currently pulls seven Google Font families over the
   network. Subset to the weights actually used and serve locally. Same reasoning
   that applied to Sable's CDN Tailwind.
2. **Check the header at 320px.** The tenant switcher, the claim and the reset
   button share one flex row and will overflow on the narrowest supported width.

Add a return bar at the foot matching Sable's, in the studio's colours, saying
what it is and linking back to the case study.

---

## 4. The card on `/#work`

Third card in the work section. Two copy problems it creates, both needing a pass
in the same session:

- The section heading is **"Built and signed off."** Nothing here was signed off
  by anyone. Either the heading widens, or this card sits visibly outside it.
  Recommended replacement: **"Built, and shown working."** It keeps the shape and
  the full stop, covers all three cards, and gets closer to what the section
  actually contains now.
- The section standfirst says **"Two engagements written up properly."** Becomes
  three, and one of them is not an engagement. Rewrite to name the split: two
  client engagements and one system built to be taken apart.

Card content:

> **Intake** · Case Study · Systems · *Self-initiated*
>
> Three regulated practices, one engine. A client journey where every question the
> system asks can be traced to a numbered rule, and the rule is on the record
> next to the answer. Built to be taken apart, because that is the only way to
> show this kind of work.
>
> Sector: Regulated Professional Services
> Scope: Journey Architecture · Rules Design · Prototype

Thumbnail: see §7.

---

## 5. The case study page, section by section

The checklist's required content list is followed, with one substitution named at
§5.7. Order is chosen so the reader who is not in aesthetics or accountancy knows
this is for them before they meet either tenant.

### 5.1 Hero

`Show your working.`

Standfirst names the reader's fear, not the system: a journey that cannot explain
itself when someone asks why it did what it did. Stamped `Self-initiated, 2026`
in the hero per the Sable precedent.

### 5.2 The problem, in the buyer's language

Small regulated firms run their client intake across a booking tool, a form
builder, an e-signature service and an inbox. Each part works. Nothing joins them,
and nothing can answer the only question that matters afterwards: why was this
client asked for that, and where is the proof they agreed?

No mention of any sector yet. This section has to land for a broker, an accountant
and a solicitor equally.

### 5.3 The strategic insight

One sentence, per the checklist. This is it:

> **A regulated journey is not software with compliance bolted on, it is a rules
> table with an interface attached, and if the rules table cannot be read by a
> non-technical reviewer then the system cannot be trusted.**

Everything downstream is a consequence of that sentence. It should be set as the
largest type on the page after the hero.

### 5.4 The translation

The bridge that stops a wealth or legal reader bouncing when the clinic appears:

> Swap the treatment for a pension transfer and the architecture does not change.

Then the primitives table: consent capture, policy gates, evidential records,
audit trail. Same in every regulated intake, whatever is being intaken.

### 5.5 What was built

Not a deliverable list. Four things, each with the reason it exists:

1. **A rules engine.** Fifteen numbered rules. Every requirement a client sees
   traces to one, and the rule ID is stored on the record. (Corrected 8 August
   from "twelve", which was wrong from the first draft.)
2. **An availability engine.** A pure function over working pattern, imported
   calendar busy time, duration, buffers and notice period. No floating start
   times, no randomness, so the same inputs always produce the same slots.
3. **An evidence layer.** In-flight signature, per-clause acknowledgement with
   individual timestamps, and a SHA-256 hash over the rendered document. The
   practice and the client hold the same file with the same hash.
4. **A tenant record.** Everything client-facing is data. Three practices in three
   different regulated sectors run on one engine, including the words on the
   buttons.

### 5.6 The prototype, embedded

**This is the page.** Full-bleed, minimum 90vh, framed as a device rather than
dropped in raw. Everything above it is setup and everything below it is caption.

Directly under it, three things to try, because most readers will not explore and
still need to be shown the point:

- **The reroute.** Choose a Leasehold Purchase at Thackray Vane. RULE-004 fires and
  routes to a free quote call, because the landlord and managing agent fees on a
  lease the firm has not seen are not the firm's to guess. Flip one admin setting
  and it instructs directly.
- **The switcher.** Same journey, chartered accountants, then an aesthetics clinic.
  The rules keep their numbers and change their meaning.
- **The calendar.** Turn off "read the practitioner's calendar" and the blocked
  time reappears as bookable. That is the integration, made visible.

A fourth, only if the layout allows it without crowding: **the conflict check**.
Answer yes to "are we already acting for the other party" at Thackray Vane and the
journey stops, with the reason on the page. No continue, no reroute. It is the
clearest illustration on the page that these rules are not validation.

### 5.7 What it proves, and the honest substitution

**The checklist asks for Outcomes. There are none, and inventing them would be
the single worst thing this page could do.** No client used this, no revenue moved,
no hours were saved. A Systems case study that fabricates outcomes is
disqualifying in front of exactly the buyer it is written for.

What replaces it is stronger and checkable by the reader in the browser:

- Every requirement shown is explained by a numbered rule, visible live
- Availability is reproducible: same inputs, same slots, on any machine, any day
- The hashes are real, computed in the page
- Three sectors, one engine, no forked code
- One rule exists for one tenant and not the others, and the field it would have
  collected is simply not rendered
- One rule stops a journey outright, for a reason the client can read

### 5.8 The honesty block

Kept as a designed section, not a footnote. It is the most credible thing on the
page in front of a regulated buyer:

- All three practices are fictional
- Clinical consent forms, letters of engagement and retainers are labelled
  placeholders, because those documents are written by clinicians and by a firm's
  own advisers and insurers, and a convincing fake is worse than a blank
- Nothing has had legal or compliance review, and this demonstrates a method
  rather than assuring compliance
- No server, no database, no calendar connection, no payment provider

### 5.9 Close

Forward-facing, hands to the CTA, per the retired-reflection rule. One line
connecting the artefact to the credential without restating the CV, then straight
into the Systems enquiry route. **No price.** Systems sells discovery-then-proposal.

---

## 6. Creative brief (checklist Phase 2)

### The conflict, and how it resolves

The checklist says a case study takes its design voice from the client's world,
and that if it starts looking like the MSS site, stop. Here there are three
fictional clients with opposing palettes and no real one. Thackray Vane's claret,
Marbury's green and Vera's navy are mutually exclusive, and none can own the page
without making the other two look like subsidiaries. Three tenants make this
argument stronger than two did.

**Resolution: the page takes its voice from the system's world, not either
tenant's.** That is the honest answer, and it keeps the rule's intent, which is
that the page must not default to studio parchment and terracotta.

### Three words

Precise. Evidential. Unhurried.

### The direction

Technical-document rather than agency-portfolio. Near-white paper ground, generous
measure, a single structural rule line, and monospace used properly for anything
that is data: rule IDs, hashes, timestamps, field names. One accent colour, cool
and low-chroma, belonging to neither tenant. Type: one serif for argument, one
grotesk for apparatus. Numbered sections, because the piece is about traceability
and the page should behave the way the system does.

### Off-limits (checklist requires at least two)

1. No parchment, terracotta or ember. This is not the studio's page.
2. No full-bleed hero image. The artefact is the image.
3. No three-column feature grid with icons. It is the default shape for software
   pages and it would make a rules engine look like a SaaS landing page.
4. No dashboard screenshots presented as results. There are no results.

### References outside the web

A well-set standards document. Legal deeds where the clause numbering is the
navigation. Engineering drawings, where the annotation is part of the artefact
rather than decoration on top of it.

---

## 7. Assets

| Asset | Notes |
|---|---|
| Card thumbnail | The rule-trace panel, dark, terracotta rules, real text. Most arresting frame in the whole build and it says "evidence" immediately. 4:3 |
| All three tenants side by side | Three hero crops in one frame, the switcher visible. Proves the multi-tenant claim in a still. Claret, green and navy in one image is the whole argument without a caption |
| The rules table | Set as designed type, not a screenshot. It is the artefact a reviewer reads |
| A signed document with its hash | Close crop. The hash is the proof object |
| Thackray Vane reroute notice | The RULE-004 panel, showing a system declining to quote blind |
| The conflict BLOCK | The RULE-011 panel at Thackray Vane. A journey stopping, with the reason on the page |

No raw working files, no rejected directions, per the checklist. Existing capture
at `workspace/booking-engine/prototype/preview-marbury.jpg` is a working
screenshot, not a case study asset.

---

## 8. Build order

1. Copy first, both pieces, before anything is designed. Checklist rule.
2. Run both against the copywriting quality checklist.
3. Confirm the strategic insight is one sentence that survives being read aloud.
4. Creative brief signed off against §6 before Claude Code opens.
5. Build the case study page.
6. Prepare the prototype route: self-host fonts, 320px check, return bar.
7. Studio chrome to the locked spec, colours from this page's own palette, nav
   label `Case study`.
8. Add the card to `/#work`, and fix the two copy collisions in §4.
9. **Rewrite the Systems block on the homepage.** It currently explains that
   Systems work is not public, which is why there is no case study. There is one
   now. The line should change from an apology to a pointer.
10. Optional LinkedIn post. Strongest angle is the placeholder decision, not the
    build: why the consent forms in a demo are deliberately blank.

---

## 9. Open decisions

1. **Name.** `Intake` is the recommendation. Confirm before any file is created,
   because it becomes the route, the folder and the card headline.
2. **Two pages or one.** The checklist mandates a framing page plus a full case
   study. PureMed ships as a single page and Sable as a case study plus artefact.
   Recommendation: follow Sable, treat the artefact route as the second page, and
   note the deviation rather than inventing a framing page nobody needs.
3. **How much rules-engine detail is too much.** The rules table is the most
   persuasive object here and also the fastest way to lose a non-technical reader.
   Recommendation was five rules in full on the page, with the live trace carrying
   the rest. **Revised 8 August to six**, because the legal tenant brought the
   conflict check, which is the rule a lay reader grasps fastest. Deviation
   recorded at the head of `case-study-copy.md`.
4. **Whether the accountancy tenant leads.** ~~Marbury Hale is the actual ICP and
   Vera is the more attractive page. Recommendation: Vera loads first in the
   prototype because it reads faster, but Marbury leads in the case study copy.~~
   **Superseded 8 August.** Osman's call: the showcase leads on the professional
   practices. Thackray Vane now loads first in the prototype, Marbury second, Vera
   last. The copy leads on legal and accountancy throughout, and the clinic appears
   only where range is being argued. See §11.

---

## 10. Resume prompt

> Read `01_mss/portfolio/intake/case-study-plan.md` then `case-study-copy.md`.
> Systems case study built on the three-tenant prototype at
> `workspace/booking-engine/prototype/booking-engine-prototype-v1.3.html`.
> Plan revised 8 Aug for the three-tenant pivot (§11): the showcase leads on legal
> and accountancy, the clinic is kept last as range proof. **Copy REWRITTEN 8 Aug
> to lead on the two professional practices**, checklist Phase 1 complete again.
> Decisions 1 and 2 in §9 stand, 3 revised to six rules, 4 superseded. Nothing
> designed or built. Next step is Phase 2, the creative brief in §6, then the
> build order in §8. Two things to settle before design: confirm neither fictional
> firm name collides with a live UK practice, and note that the copy takes two
> deviations from this plan (six rules not five, four prompts not three), both
> recorded at the head of the copy file.

---

## 11. Revision, 8 August 2026: the three-tenant pivot

**What changed.** Osman's call while reviewing the booking engine plan: build the
showcase around the accountancy firm and a legal practice rather than lead with the
clinic. This does not change the positioning, it brings the artefact into line with
it. The ICP decision of 7 August already named accountancy first and legal second.

**What was built.** A third tenant, **Thackray Vane**, a firm of solicitors doing
residential property, added to the prototype as `v1.3` and verified end to end. It
loads first. Switcher order is now Thackray Vane, Marbury Hale, Vera Aesthetics,
set explicitly rather than by object key order.

**Why conveyancing** rather than private client or commercial: highest-evidence
intake in the profession, understood by non-lawyers (which matters on a public
page), and far enough from Marbury Hale's shape that the two professional tenants
do not read as the same firm twice. It also brings a primitive neither other tenant
has, the conflict check, which stops the journey outright.

**Why Vera was kept.** Two adjacent AML-supervised tenants invite the reader to
conclude that accountancy and law are near enough the same firm. A clinic sitting
maximally far away is what makes the configuration-not-a-fork claim hard to argue
with, and RULE-006 firing for Vera with no analogue in either professional practice
is the sharpest single piece of evidence in the build. It costs nothing to keep and
it leads nothing.

**A finding worth putting in the copy.** Adding the third tenant exposed seven
places where the sector was hardcoded in the rendering layer. A conveyancing client
would have been told "your appointment is booked". They are now tenant data. This
is a good paragraph for §5.7, because it is the case study criticising its own
artefact and then fixing it, which is more persuasive than the claim it replaces:
two tenants were not enough to prove the thing the prototype was asserting.

**Revision 2, same day: the tenants were a recolour, not a redesign.** Osman's
read on the first three-tenant build was that both professional tenants looked
AI-generated and vanilla. He was right, and the cause was architectural: a tenant
was fourteen colour and font tokens and nothing else, so all three practices
rendered identical DOM including the same equal-card grid. Each tenant now carries
a `layout` archetype driving its own structure. Thackray Vane is stage-led and
editorial with a photographic split hero; Marbury Hale is a dense ledger with a
tax-year deadline panel, no photography and no cards at all; Vera is an airy
asymmetric gallery. Detail in `booking-engine-plan.md` §15.

This matters for the copy, not just the build. **§6's "A tenant record" claim gets
materially stronger**: it is no longer "the palette and the words are data", it is
"the layout is data". And the confession in §9 gains a second half worth adding at
design stage: the first version of the multi-tenant claim was true of the tokens
and false of the page.

**Consequences not yet actioned.**

1. `case-study-copy.md` needs rewriting to lead on legal and accountancy.
2. The card copy in §4 and the section standfirst change from two to three.
3. Asset list in §7 updated, but nothing has been captured.
4. Confirm neither Thackray Vane nor Marbury Hale collides with a live UK practice
   before publication. Not yet checked.
5. Font self-hosting is now nine families rather than seven.
