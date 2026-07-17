# MSS Repositioning Plan — From Brand Studio to Presence Partner

*Created: 12 July 2026*
*Status: PROPOSAL — nothing in this document is locked until the founder signs it off and the decisions log is updated.*
*Companion doc: `mss-website-copy-v2.md` (proposed site copy, same date).*

---

## 1. Why this exists

The MSS website says the studio does brand identity and digital presence. The studio now does considerably more, and does it differently:

- **The stack changed.** Bricks/WordPress retired 25 June 2026. Production is now Astro static sites deployed to Cloudways via GitHub Actions. This is not a tooling footnote — it changes what a "website" engagement *is* (no CMS, no maintenance surface, deterministic deploys, sign-off as the deploy gate).
- **The scope changed.** PureMed is being delivered as a full solution: site + social content pipeline + client review/sign-off + self-service copy edits that flow to the live site. FSC is a paid campaign-operations engagement (£400/wk social role). Neither fits "brand identity and a website."
- **The economics changed.** The old offer was project-shaped (build, hand over, leave). The new capability is retainer-shaped (build, then run). The site currently attracts project clients at project budgets.

The decisions log already notes the direction (25 June: *"MSS repositioning as an AI consultancy — the delivery pipeline itself becomes the offering"*). This plan resolves what that actually means and how to say it.

---

## 2. The positioning fork — and the recommendation

There are two ways to read "the pipeline becomes the offering":

**Option A — AI consultancy.** Sell the pipeline itself: automation builds, AI workflow consulting, "we'll build you a content engine." This is the Leftclick-playbook shape (`ai_consulting_agency_playbook.md`).

**Option B — Presence partner.** Sell the *outcome* the pipeline produces: a brand, website, and content presence that is built once and then kept alive — with the system as the differentiator and the proof, not the product.

**Recommendation: Option B.** Reasons:

1. **It's what's actually being sold.** PureMed isn't buying a pipeline; they're buying "my site, my socials, my content — handled, and I approve everything from one place." FSC is buying campaign output, not tooling.
2. **The tools are internal leverage, not resellable artifacts.** Studio/Stage/the loops are MSS-shaped. Selling them as consulting deliverables means productising, documenting, and supporting them for other operators — a different business, premature at pre-revenue.
3. **AI-consultancy buyers are automation buyers.** They procure differently (scoped builds, technical evaluation, race-to-the-bottom pricing on Upwork). Presence buyers procure on trust and taste — which is where the MSS voice and the Stage experience actually win.
4. **It preserves the locked AI positioning:** *"AI as a thinking partner and craft tool... The judgment about what to do with them hasn't changed hands."* AI is the method, not the message. Option A makes AI the message.

The consultancy playbook still earns its keep — as a **marketing operations** reference (lead gen, sales call structure, retainer mechanics), not as positioning.

---

## 3. Capability inventory — what the studio can actually deliver

An honest audit of the estate. "Proof level" is what we can truthfully claim on the site today.

| Capability | Tooling behind it | Status | Proof level |
|---|---|---|---|
| **Discovery, positioning, tone of voice** | Copywriting skill + voice-file system, creative-director skill, discovery/constraints templates | Mature — run for MSS, Ayesha, Sable, PureMed, FSC | Proven (client-delivered) |
| **Brand identity** | Identity system method (static + live layers), Higgsfield 3D/video marks | Mature | Proven (MSS, Sable; Ayesha delivered) |
| **Website build** | HTML prototype → Astro static build → GitHub Actions → Cloudways (staging + manual-gate production) | Built; PureMed Astro project generated; **Cloudways deploy not yet proven live** | Claimable as offer; not yet claimable as track record |
| **Client review & sign-off** | Stage on the Pi (`mss-review.duckdns.org`) — approve / change / flag per section, client login, client upload patch ready | Live since late June; PureMed first engagement | Proven (in live client use) |
| **Self-service copy edits → live site** | Stage sign-off manifest → Loop 1 (monitor) → Loop 2 (apply to Astro source on `signoff/*` branch) → PR → CI deploy | Built, fixture-verified end-to-end; needs first real sign-off cycle + Cloudways static app | Claimable as offer with care ("request a change, approve the wording, it goes live") — flag internally as unproven |
| **Social content production** | Studio: clip library (human-picked, machine-finished), campaign builder (intent → scheduled, copy-drafted posts), carousel/reel builder, brand finishing packages, compliance lint (POM-grade for PureMed) | Built; FSC POC through one real client revision cycle; PureMed Phase 1 built | Proven as capability; one paying campaign client |
| **Campaign operations** | FSC estate: campaign archetypes, fighter/people DB (785 fighters), dossiers + interview briefs, media-day pipeline, coverage reporting | Live paid engagement (FSC37, £400/wk) | Proven (paid) |
| **Publishing** | IG publishing design frozen 7 Jul; **blocked on Meta P0 prereqs** | Not live — posts publish manually today | **Do not claim auto-publishing.** Claim "reviewed, approved, published" (true — manually) |
| **Asset generation** | Higgsfield asset-generation + scene-generation skills, placement manifests, WebP compression | Active, used across clients | Proven |
| **Outreach / growth** | Outreach engine (Stages 0/1/3 built, rest blocked on client prereqs) | Partial | Not sellable yet — keep off the site |

**Reading of the table:** the studio can honestly sell three things today — **brand + website builds**, **content/campaign operations**, and **the review experience that wraps both** (Stage). The two soft spots are the unproven Cloudways deploy and the manual publish step. Neither blocks the repositioning; both shape the copy (see §8, honesty constraints).

---

## 4. Who this is for — the "right level of clientele"

The old client definition (*"people with something real to say that hasn't yet found its form"*) selects for **pre-form** clients: early, often pre-revenue, project budgets, high emotional labour. It produced a beautiful voice and underpriced demand.

The new offer needs clients who have a **run-rate problem, not a form problem**:

> **Established small businesses and funded founders whose work is better than their presence — and who need it run, not just launched.**

Concretely:
- Trading businesses with real customers and revenue (clinics, practices, venues, sports orgs, product founders) — PureMed and FSC are the archetypes.
- They can carry a monthly retainer. Anchor: FSC pays £400/wk for social operations alone. A Run retainer covering content + site upkeep should sit in the **£1,200–£2,500/month** band (founder decision — see §9).
- They value taste and judgment but buy *reliability*: the pitch that lands is "it keeps happening every week without you chasing it," not "we'll find your voice."

**What survives from the old definition:** the values filter (*"drawn to people whose work means something beyond the commercial — the filter is intent, not industry"*) stays. It's a selection principle, not positioning copy.

**What retires:** "creatives at any stage" as a named audience. Individual creatives without a business behind them are no longer the target — they can still arrive via the values filter, but the site shouldn't court them.

---

## 5. The offer architecture

Three engagement shapes, two of them core. Plain names — considered and rejected the theatre metaphor ("Opening Night" / "The Run"); the echo of *Main Stage* is pleasant but the buyer shouldn't have to decode the menu.

### Launch — the build engagement
Discovery → positioning → tone of voice → identity → HTML prototype → client review in Stage → Astro build → live on Cloudways. Fixed-scope, project-priced. Every Launch is architected to hand into a Run (voice file, theme, brand package, and pillars all become Studio config).

### Run — the ongoing engagement (the centre of gravity)
Monthly retainer. What the client experiences:
- A planned content calendar (campaigns spread across their content pillars)
- Designed posts, edited clips, captions in their voice — every piece compliance-checked
- **Everything reviewed and approved by them in Stage before it goes anywhere**
- Site copy changes requested and approved in the same place, flowing to the live site — no ticket queue, no maintenance invoice
- Assets generated and optimised as needed

What powers it (internal, appears on the site only as "the system"): Studio per-client servers, campaign builder, clip pipeline, finishing packages, lint rules, Loop 1/2, CI deploy.

### Campaign — the event engagement
Time-boxed sprints around a launch, event, or signing — the FSC pattern (buildup arcs, media-day coverage, per-event content ops). Sold to clients with event calendars; also the natural trial engagement that converts to a Run.

**Sequencing note:** the site leads with Launch + Run. Campaign appears as a variant of Run ("built around an event") rather than a third menu item, until there's a second campaign client.

---

## 6. Positioning — what the studio says now

### The proposition

Retire the hero line *"Your vision doesn't need permission. It needs form."* It is true of the old offer: form was the deliverable. The new deliverable is form **plus momentum** — and the new line should carry the same two-beat structure and the same directness:

> **"You don't need a bigger team. You need a better system."**

Why this line:
- It opens in the reader's world (the felt problem: "we can't keep up with all of this") and names the false solution they're already considering (hire an agency, hire a marketer).
- "System" is honest — it's literally what MSS built — and it earns the AI story without saying AI.
- It keeps the locked voice: considered, direct, no adjectives doing substance's work.

Alternates considered (recorded for the decisions log discussion):
1. *"Launched is not the same as alive."* — strong as a section heading; as a hero it leads with the client's failure.
2. *"A presence that doesn't go quiet."* — warm, but soft; describes an outcome without a point of view.
3. Keeping *"Your vision doesn't need permission. It needs form."* — retired from the hero; the thought survives inside the About section's lineage.

### The differentiator story (unchanged in spirit, wider in scope)
PM rigour as the method, not the message — now extended: *product thinking applied to presence*. Understand the problem, build the system, keep judgment human. The Stage experience is the visible proof: one place to review everything, sign-off as the gate, changes that actually ship.

### The AI story (locked framing holds)
One honest paragraph, not a theme: *"The tools have changed what's possible. The judgment about what to do with them hasn't changed hands."* The live layer of the site and the Stage workflow demonstrate it; the copy doesn't sell it.

### Voice
No change to character (quietly confident, genuinely empathetic; considered, direct, distinctive). The empathy target shifts: from *"a vision you haven't found words for"* to *"work that deserves better than the presence it currently has — and no sane way to fix that alone."* Same warmth, aimed at a running business instead of a forming one.

---

## 7. Site map

### Phase 1 — now (single page, rebuilt copy, current WordPress home OR first Astro proof)

One page, seven sections. This matches what can be maintained and reviewed today, and every section has honest content behind it.

```
Home (/)
├── 1. Hero            — proposition + two CTAs (How it works / Start a project)
├── 2. The gap         — the problem: launched ≠ alive; the staffing trap
├── 3. What we do      — Launch / Run (Campaign folded into Run)
├── 4. How it works    — the system, told as the client experience (Stage front and centre)
├── 5. Work            — curated cards (MSS building MSS, Sable; PureMed pending §9 decision)
├── 6. The studio      — About: one person + a system; PM lineage; AI honesty paragraph
└── 7. Start a project — low-friction form (unchanged mechanics)
```

### Phase 2 — post-PureMed live + three complete case studies

```
/                      — Home (tightened; Work section becomes 2–3 cards + "View all work")
/work                  — full portfolio grid (framing pages → full case studies, per locked structure)
/work/[case-study]     — own creative identity per locked rule
/how-it-works          — expanded system page: the Launch journey + the Run month, screenshots of Stage
/journal               — editorial (existing locked direction; unchanged)
/start                 — start a project (breaks out of the single page when nav needs it)
```

Phase 2 triggers, not dates: PureMed live on Cloudways (pipeline proven) + third case study complete (existing locked rule for the Work page).

### The MSS site as pipeline proof #2

Recommendation: once PureMed proves the Cloudways deploy, **rebuild the MSS site itself on Astro with this copy** — prototype → Stage → Astro → Cloudways, eating our own workflow. The current WordPress+Bricks production site is the last Bricks dependency; cutting it over closes `mss-production-ops.md` and the legacy skill set. Until then, Phase 1 copy can go into the existing WordPress home if speed matters, but the better move is to hold copy for the Astro rebuild and avoid touching Bricks again.

---

## 8. Honesty constraints on the copy

These keep the rewrite from overclaiming. All are reflected in `mss-website-copy-v2.md`:

1. **No "we'll auto-publish your socials."** Publishing is manual until IG publishing P0 clears. The copy says *reviewed, approved, published* — true regardless of mechanism.
2. **No named track-record claim for Astro-on-Cloudways** until PureMed is live. The copy describes the build approach (fast, static, nothing to maintain) without citing deployments.
3. **No client logos / counts.** One paying client (FSC), one engagement in review (PureMed, off-site per current lock), one delivered brand strategy (Ayesha, unlaunched). Proof lives in the case studies and in how the site itself behaves.
4. **Self-service edits** are described as the client experience ("request the change, approve the wording, it goes live") — accurate to the built pipeline — but the first real sign-off cycle should run before this line ships. It's the single highest-value claim on the page; it must be true on day one.
5. **Sole operator, stated with confidence, not apology.** "One person and a system" is a feature at this price point: one accountable judgment, no account managers. The About section owns it.

---

## 9. Decisions required (founder sign-off → decisions log)

| # | Decision | Recommendation |
|---|---|---|
| 1 | Positioning: presence partner (Option B) vs AI consultancy (Option A) | **B** — see §2 |
| 2 | New core proposition line | *"You don't need a bigger team. You need a better system."* — alternates in §6 |
| 3 | Client definition v3 | Established small businesses + funded founders; run-rate problem; values filter unchanged |
| 4 | Offer names | Launch / Run (Campaign folded into Run for now) |
| 5 | Retainer band | Anchor Run at £1,200–£2,500/mo (FSC £400/wk = evidence). Site copy stays qualitative; band used in proposals |
| 6 | PureMed on the MSS site | **Reverse the current lock** (off-site) once live: PureMed is the flagship proof of the entire new offer. Requires client comfort — ask them |
| 7 | MSS site cutover | Hold new copy for the Astro rebuild (proof #2) rather than re-touching Bricks — unless a live-copy fix can't wait |
| 8 | Old hero line | Retire from hero; lineage survives in About |
| 9 | `mss-website-brief.md` + `mss-brand-identity.md` + tone-of-voice audience refs | Update to v3 positioning once 1–4 lock (they were last reconciled to the 05 June positioning) |

## 10. Sequencing

1. **Founder review of this plan + the copy doc** — verdicts on §9, ideally through Stage or inline.
2. Decisions log updated with whatever locks (standing rule).
3. PureMed Cloudways deploy proven (already the critical path for everything).
4. MSS HTML prototype v2 from the locked copy → Stage review → Astro build → cutover.
5. Context-file reconciliation (§9 item 9) + Claude Project knowledge re-upload.
6. Phase 2 pages as triggers fire.

**Resume prompt:** `Read 01_mss/strategy/mss-repositioning-plan.md and mss-website-copy-v2.md, take my verdicts on the §9 decisions, update the decisions log, and start the MSS homepage prototype v2.`
