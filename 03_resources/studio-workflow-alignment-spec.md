# Studio Operator App — Workflow Alignment Spec

**Purpose:** reorganize the **Studio operator app** (`scripts/review-app.{html,js,css}` +
`content-review-server.js`) so its screens match how Osman actually moves through FSC content —
**not** the tool-by-tool, build-order layout it has today. Osman is walking his real workflow
(media day as the worked example) and, as he does, we extract **deterministic, content-type-agnostic
rules** so the tool serves *any* FSC content type, not just media day.

**Mode:** this is a **capture + design** pass, **not a build**. No files reorganized until the whole
workflow is walked and Osman says go. Companion to `stage-lifecycle-review-handoff.md` (that doc =
"kill duplication across Studio/Stage/engine"; this doc = "make Studio's screens match the workflow").

**How capture works:** every point Osman makes is sorted into **(a) media-day specifics** vs
**(b) deterministic rules** (the generalized "for any content type, the tool should…"). Where the two
diverge, we flag and ask which governs.

---

## Current Studio app (as-is, verified on disk 13 Jul 2026)

8 screens, **flat hub topology**. Landing (`screen-studio`) is a **subject/fighter library + a
"New subject → Create & analyze" form**. Topbar nav buttons are peers, ordered by *build order*, not
workflow: `Campaign Builder · Montage Builder · Carousel Builder · Clip Finishing · Footage Sets ·
People` + Brand toggle.

| Screen | What it does | Lifecycle stage |
|---|---|---|
| `screen-campaign` | Compose campaign → generate posts | Ideation |
| `screen-people` | Edit roster / IG handles (tabs, stub concept, verifiedFacts read-only, whitelisted PATCH/POST) | reference data |
| `screen-sets` | Owned-footage appearance pass | reference data |
| `screen-review` | Scrub video, mark in/out, tag category/event/themes/note, verify, clip library, suggestions panel | Creation |
| `screen-montage` | Build montage from verified clips | Creation |
| `screen-carousel` | Build carousel post from media | Creation |
| `screen-finish` | Brand cut clips (grade/audio/overlays/logo) — "Publishing Step 2" | Creation |

**Core problem with the as-is:** nav is organized around *tools* and *build order*, not around the
*workflow*. Landing screen is subject-centric ("manage fighters"), when the true front door should be
**content analysis**. Reference-data tools, creation tools, and ideation sit as undifferentiated peers.

---

## Feature 1 — Content Analysis (the new entry point)

**Media-day specifics:** hours of footage exist from the media day. A **capture brief** (shot list,
known *before* the shoot) defined what was meant to be captured. Nobody can find which asset / which
timestamp holds each briefed item without scrubbing everything. Editors need, per briefed item: a
**low-res preview**, the **source asset**, and **tc-in / tc-out** — so they go straight to the right
master + rough window in Dropbox.

**Deterministic rules:**
1. **Entry point = Content Analysis, not Fighters.** Landing inverts from "pick a subject" to
   "open/define an analysis." The subject library stops being the front door.
2. **Every analysis is scoped by content type, chosen up front** — media event / FSC fight event /
   interview / *other* — explicit and **extensible**.
3. **An analysis is driven by a brief** = a pre-known list of required content items. The analysis is
   the act of *locating* each briefed item in the footage. Items can also be **added manually** mid-analysis.
4. **Output unit = a "finding":** `{brief item OR manual tag} → {source asset, tc-in, tc-out,
   preview proxy, people}`. Findings are **pointers to masters**, not deliverables (reference-proxy model).
5. **Content-type agnostic mechanism** — video *and* image assets flow through the same analysis;
   both support people-tagging.
6. **Folder naming on Dropbox is the taxonomy** — read event type/context from the folder naming
   convention rather than re-entering it.

**Structural note:** `screen-review` already *is* a scrub-mark-tag-verify workspace with suggestions —
but it's **fighter-scoped** and its tags are clip-library-oriented, not brief-oriented.

**MAJOR — the engine already exists as a CLI (verified on disk 13 Jul 2026).**
- **The brief** = `content/config/coverage/<id>.json` ("shot-list-as-data"): structured expectation
  rows `{role, category, tier, min, per}`. `coverage/media-day.json` is real (a client-blessing
  PROPOSAL as of 10 Jul; shape is settled).
- **The findings engine** = `content-coverage.js`: for every expected (person × category × target) it
  reports **have / missing** against verified library clips, in two modes — `appearances` (early
  signal off `set.json` co-presence) and `library` (production gate off verified clips). It already
  distinguishes "filmed but not yet verified" from "not filmed."
- So Feature 1 is **mostly a UI front door over `content-coverage.js`**, not a build from scratch.

**The real capture brief exists too — TWO complementary brief artefacts (agent read of the itinerary
PDF, 13 Jul 2026):** the human capture spec is `FSC 37 Richmond IVY_05_07_26_Itinerary.pdf` (Sun 05
Jul 2026) — a **freeform doc with four sub-lists: Sequence Shots (10), Interviews (9, timed, presenter
Snoochie Shy), Arrivals, Seating**, person- and time-specific, with scripted wording (the £25k Aug-23
promo). Reconciliation:
- **Itinerary = what *should have been captured*** (named person/shot/time). Primary briefed-item rows
  = the **10 Sequence Shots + 9 Interviews**; Arrivals/Seating = supporting context for *locating*
  items in footage, not capture targets.
- **`coverage/media-day.json` = the deterministic generalized checklist** (role×category expectations).
- **Mapping:** a **structured-rows brief spine** where each shot/interview = one row (people +
  expected content + expected TC window), **populated from the itinerary** and reconciled against the
  coverage config. This *populating* step is brief-creation (manual entry or LLM-assisted parse of the
  doc) — it does not change the locked "structured rows" shape; it's how rows get seeded.
- **Identity-matching input:** the itinerary names people likely **not yet in the registry** (Snoochie
  Shy, Krept & Konan, Nathan Rose, Max Kashket, Lancey Foux, Helen/Selene) → a People-registry
  reconciliation task feeding the person↔asset edge.

**Decisions locked (13 Jul 2026):**
- **Brief shape = structured coverage config.** Settled by the existing model — not freeform.
- **Who-locates = deterministic gate first.** Ship the have/missing matrix + manual-add now; add
  **LLM candidate-surfacing** (jump-to asset/timestamp for gaps, human confirms — matches
  [[feedback-fsc-clip-picking-needs-human-review]]) as a **fast-follow**. Nothing LLM on the critical path.
- **New Analysis screen** (not a reframe of `screen-review`). The new screen renders the coverage gap
  matrix (event+brief scoped) and **links into** the existing verify workspace to fill gaps. `screen-
  review` stays the fighter-scoped verify workspace it already is.
- **Build now against the current `media-day.json` proposal**; client blessing edits config, not code.

**Future (not now):** create the actual clips/assets directly in this tool. Out of scope for this pass.

---

## Feature 2 — People / Registry

**Specifics:** a single **people registry** for everyone in the business — internal staff, ambassadors,
presenters, fighters, **and sponsors**. Goal: understand anyone **at a glance**, incl. a **profile
picture**. The **dossier** (links + fact-check resources) was a one-off test but the thinking should
become permanent: facts live on the person record, **editable**, with the ability to **add rows**.

**Deterministic rules:**
1. **People registry is a first-class shared entity for the whole system** — not a fighter sub-tool.
   Analysis, campaigns, carousels, reels all reference it.
2. **Every person has a role/type** — staff · ambassador · presenter · fighter · sponsor · *extensible* —
   and the **schema is polymorphic by role** (fighter carries dossier facts; sponsor carries acquisition
   history + package subscriptions).
3. **Structured over freeform, always.** No large unstructured blobs. Every fact is a field/row so it's
   **taggable and queryable**. The dossier generator becomes a **seed** for structured rows, not the
   owner — humans edit and extend.
4. **Bidirectional person ↔ asset linkage** — the SAME edge feature-1 people-tagging creates.
   Write-side = analysis; read-side = here: from a person, pull **"which assets am I in"** → select a
   photo/clip → **mark it for a campaign** or make it available to reel/carousel. (Not for sponsors.)

**Enrichment (on-demand):** any person record supports a **runnable "refresh / fact-find" action** —
pull anything new since last time (interviews, on-record statements) **including social media** — that
proposes **structured** facts/rows for human confirmation. Fighters are the priority case; the action
generalizes. On-demand, not automatic; human-in-the-loop. Kenu already proved this (tags exist).

**Modeling fork (flagged, not resolved):** a **sponsor is really an organization** (deal + packages,
optional contact people), not a person. Recommendation = model **sponsor as an org entity** in the same
registry area but its own type, to avoid a lopsided person schema. Osman to confirm org-vs-person seam.

**Naming:** "People" undersells it if it holds sponsor orgs too. Candidates: **Directory / Registry /
Roster**. Not decided.

---

## The shared backbone: person ↔ asset is ONE edge

Feature-1 "identify people in this footage" and feature-2 "which assets is this person in" are the
**two directions of one relationship**. Tag once during analysis; query from either side. Treat as a
single shared edge, not two features.

---

## Cross-cutting rule — LLM dependency must be explicit

Osman's requirement: the design must call out **where an LLM is used and whether the system breaks
without Claude**. Standing convention for the whole design — **every step tagged as one of:**
- **Deterministic** — no LLM, always works (file ops, folder-taxonomy parsing, tc math, registry CRUD,
  asset lookups).
- **LLM-assisted** — LLM *proposes*, human confirms, **degrades to manual** if Claude is unplugged
  (analysis suggestions, dossier seeding, enrichment, copy drafts).
- **LLM-required** — genuinely breaks without an LLM.

**Design goal: nothing on the critical path is LLM-required.** The tool stays usable as a structured
database + manual workspace with Claude unplugged; the LLM only accelerates. Any would-be
LLM-required step gets called out for a re-architecture decision.

---

## Cross-cutting rule — low-res proxies only (the tool holds intent, not masters)

**Constraint, not preference.** Masters live in FSC Dropbox (reference-proxy model, Thread 8) and
**never on Osman's machine**. Therefore the tool can only ever hold **low-res proxies**, across
*every* screen — clips, idents, graphics, stills. Proxies exist to **illustrate intent**, never to
build the real post.

**Consequence — the Creation layer is a *specification* layer, not a deliverable layer.** Studio's
montage/carousel/finish screens don't produce the finished asset. They produce a **mock-up brief**:
low-res intent + a machine-readable spec that a **human editor + graphics team** then execute against
the masters. Lifecycle is really: *Studio spec → human production (downstream) → back into review*.
This reframes the "Creation" row of the lifecycle table across the board.

**Future evolution (parked, infra-gated).** This grows into a real in-tool creation layer **eventually
— maybe not for this client**. It is **blocked on infrastructure**: cloud hosting, or a solution for
editing a small subset of clips. Design principle that falls out: **don't foreclose it, don't build
for it now.** The forward-compatibility hook is that every brief is emitted as a **structured spec**
(see Feature 3) — a future cloud creation layer is just a *renderer over that same spec*.

**The one boundary exception — real assets re-enter only at return→publish.** Low-res holds across the
entire spec/brief side. **Finished, full-res assets legitimately re-enter the system at exactly one
seam: when edited content is *returned* from the editors/clippers/designers and structured for
publishing** (see the Publishing surface below). Everywhere else = proxies; the publish boundary is
the sole place real assets live in-tool.

---

## Cross-cutting rule — UI-instigated create/maintain (no "Claude-Code-only" artefacts)

**Osman's requirement (applies to the *whole* implementation):** every artefact or asset the system
produces must be **creatable and maintainable from the UI**. Anything that today can only be made or
edited by **dropping into Claude Code** is a **gap** to be called out and closed with a **UI-instigated
operation**. This is distinct from the LLM-transparency rule: that one asks *"does it need Claude at
runtime?"*; this one asks *"does creating/maintaining it need the Claude Code dev environment?"* — and
the answer must be **no** for every artefact.

**Method:** as each feature is walked, every artefact it introduces is checked into the **UI-Gap
register** below — has a UI create + maintain path, or is flagged Claude-Code-only.

### UI-Gap register (living — completed as features are walked)

*Verified on disk 13 Jul 2026 (write routes in `content-review-server.js`, config in
`content/config/`).*

| Artefact / asset type | UI create? | UI maintain? | Status (verified) |
|---|---|---|---|
| Carousel/slide **templates** (`slide-templates.json`) | ✗ | ✗ | **GAP.** Rich structured registry (zones/params/paramSpec/provenance); note says "edited by hand or by the `carousel-patterns` skill." Carousel builder only *selects* templates (`carTemplate()`), no create/edit route. Needs a UI template author. |
| **Content pillars** (`content/config/pillars.json`, per archetype) | ✗ | ✗ | **GAP.** Structured JSON, hand-edited; review-app only *displays* `p.pillar`. No write route. |
| **Reel templates / transitions / bumpers** (`content-reel.js`) | ✗ | ✗ | **GAP.** Code/config-defined (`bridge`, `logo-spin`, etc.); no UI registry. |
| **Overlays / idents / graphics library** | ◐ | ◐ | **PARTIAL.** *Apply* is UI (finish-screen picker `/api/finish/overlay-assets` + drag-place); *registering a new* overlay = filesystem drop under `assets/overlays/`, not a UI op. |
| **Client tone-of-voice** (`content/config/voice.md`) | ✗ | ✗ | **Doc-only.** Acceptable as a brand doc, but flagged — no UI. |
| People registry records + facts | ✓ | ✓ | OK — `POST /api/people` full-record editor. |
| Clips + tags | ✓ | ✓ | OK — review screen. |
| Campaign / calendar / content plan | ✓ | ✓ | OK — `saveJson(campaignPath)` write route (Feature 4). |
| Post decisions / state | ✓ | ✓ | OK — `content-state.js` + `content-sync.js` adapter. |

**Close-out list (UI operations to build): template author · pillar editor · reel-template/transition
registry UI · overlay-library "add new" · (optional) tone-of-voice editor.** Goal remains zero
Claude-Code-only rows.

---

## Feature 3 — Montage Builder (first Creation-layer screen)

**Position in workflow:** the natural next step *after* clips are available from analysis. It consumes
the clip library (read-side of the Feature-1 tag schema) and the shared asset pool.

**Media-day specifics:** media-day clips are the montage input; the idents/graphics pulled in are the
existing FSC-branded **broadcast/brand idents** and graphics already in the shared repo (as low-res).

**Deterministic rules:**
1. **Output = a mock-up brief for editors/graphics**, not a finished cut. Two artifacts, always **both**:
   (a) a **low-res preview** of the montage, and (b) a **structured edit-decision list** — per beat:
   `{clip, tc-in, tc-out, transition, ident/graphic, position}`. The spec is the deliverable; the
   preview just makes it legible. (This is the forward-compat hook for a future creation layer.)
2. **Clip library is searchable** — free-text fields allowed, but **structured categories are
   mandatory** so filters narrow to the right content type before scrubbing. Read-side of the
   Feature-1 tag schema.
3. **Standard naming convention** for montage / edited-clip outputs — **deterministic template built
   from tags**, human-readable and sensible, so an edited clip is recognisable by what's in it
   (e.g. `subject-action-treatment-identNN`). No LLM in the naming path.
4. **Editing UI paradigm:** preview screen at **top**; transitions + assets in **right-hand side
   panels**; **drag into the timeline** below — traditional-editor muscle memory.
5. **Low-res throughout** (per the cross-cutting rule above).

**Tagging:**
- Load low-res assets, clip-library search/filter (tags + free text), drag-to-timeline assembly,
  structured edit-list emission, deterministic tag-based naming → **all Deterministic.**
- **Nothing in the montage builder is LLM-assisted or LLM-required.** Whole screen runs with Claude
  unplugged. (The as-is `screen-montage` suggestions panel is the only LLM touch-point and is not
  required — revisit if kept.)

**Slice points:**
- **Clip library is a shared component**, not montage-local — montage, carousel, and reel all consume
  it. New duplication-register candidate beyond D1–D6: **D7 — clip-library-as-shared-component.**
- **Naming convention is a shared service** across every edited-clip output, not montage-only.
- Montage builder is its own screen but rides the **shared preview renderer** (ties to D1's "post
  rendering implemented twice") and the shared library.

**Open (deferred to campaign-builder walk):** the tool-wide low-res model has more to it — Osman
flagged he'll expand when walking the campaign side.

---

## Feature 4 — Campaign Builder (Ideation — the front of the workflow)

**Position (lifecycle-order correction):** the plan comes **before** any downstream asset work — you
cannot create until you know the shape. This moves Campaign to the **front of the workflow, right
after Analysis**: **Analysis → Campaign/Plan → Creation → Review → Posting.** The as-is nav has
Campaign as a mid-list peer; that ordering is wrong.

**Acceptance test (stated by Osman):** *"reproduce the FSC 37 countdown campaign from this page."* The
tool doesn't do that today — that is the bar. FSC 37 (23 Aug) is the worked example throughout.

**Media-day / FSC-37 specifics:** inputs so far = media-day footage + newly signed brand ambassadors,
presenters, and new sponsors; target event = FSC 37.

**Deterministic rules:**
1. **Inputs are abstract:** `{available assets, event attendance list, target event OR point-in-time,
   themes, talent focus}` → a configurable planning **horizon** (a month, in the example).
2. **Two outputs, one plan object:**
   - **Campaign calendar (= the campaign log)** — the dated artefact, **same shape as the FSC 37
     calendar already produced**. Calendar and log are the *same artefact*, not two.
   - **Content plan** — the strategy view (themes, pillars, talent focus, campaign shape).
   Both are **views of one plan object**; the calendar is the primary render.
3. **Each planned post carries:** post **type** (editable), **sample copy** in the client's tone
   (editable), target **channel(s)**, and a **rationale** ("why this post, this day").
4. **Preview shows the "why", in a calendar view.** As-is shows only the pillar — insufficient. The
   rationale is the post's **provenance**: countdown position to the target event · theme running ·
   talent in focus · triggering input (e.g. "sponsor just signed → spotlight"). It is the plan's
   **audit trail**, assembled from the plan's own inputs — mostly Deterministic, LLM only phrases it.
   Calendar cell = date · pillar · post type · talent focus · channel · **why** · low-res preview.
5. **Clip suggestion is tag-driven:** focus (talent/theme) resolves to candidate **images + videos**
   via the **person↔asset edge** (talent) and **theme tags** — a Deterministic filter. Human selects.
6. **Channel selection** — campaign targets one or more channels; content-type-agnostic.
7. **Export the calendar.** Edit any post before it goes out.
8. **Approval gate into Stage is OPTIONAL**, but **all artefacts are client-facing by default**
   (matches the standing client-facing-briefs rule).

**The edit brief (campaign → creation seam):** selecting assets produces an **edit brief** for
editors/graphics = **post mocks + a list of assets to use (with per-asset context)**. This is the
**same artefact family as the Feature-3 montage mock-up-brief**: creation tools (montage/carousel)
produce the low-res **mocks**; the campaign builder assembles them with the **asset list + context**
into the brief handed to editors. One brief concept, not two.

**Tagging (honours the headline reconciliation — deterministic spine + LLM proposals that all
degrade to manual; nothing LLM-required):**
- **Deterministic:** calendar/cadence/slotting, post-type templates, channel targeting, export, post
  editing, the **attendance-list → people → assets** chain, **talent/theme → clip filter**, and the
  **rationale/provenance** assembly.
- **LLM-assisted (degrade to manual):** synthesising the **campaign shape** from raw inputs, drafting
  **sample copy**, **ranking/curating** clips for suitability beyond the raw tag filter, phrasing the
  "why".
- **LLM-required:** **none.** Unplug Claude → still plan from templates, filter clips by tag, write
  copy manually. The closest-to-required step (shape synthesis) explicitly degrades to manual
  template planning.

**Slice points & D-register:**
- **D2 (campaign→posts in ≥2 places):** this screen must be the **thin front-end that POSTs the
  `content-campaign.js` request shape** — not a second builder — and must reconcile with the Thread 7b
  programme engine. The "shape from inputs" belongs in `content-campaign.js` (or a planning layer
  above it), **not forked into the screen**.
- **D3 (copy in ≥3 places):** "sample copy in tone of voice" **routes through the single copy path**
  (`content-draft.js` + `copywriting` skill + client tone file) — no local re-prompting.
- **D1 / D4 (Stage seam + shared renderer):** campaign artefacts are the client-facing brief *and* the
  optional Stage sign-off input — **one artefact, optionally gated**. Calendar-cell preview uses the
  **shared preview renderer** (same one montage uses), not a second implementation.
- **Payoff:** the "focus on talent → their assets" chain is the **person↔asset backbone doing real
  work**; "attendance list" leans on the **Thread 9 media-day talent pipeline / People registry**.

**Addendum (14 Jul, from the live FSC 37 engagement) — grid-brief import.** Kay briefs campaigns as a
**spreadsheet grid**: rows = fights/promo streams (in client priority order), columns = daily dates
grouped into weeks, cells = actual post items ("Carousel of Tom Mullen Best KO's"); see
`~/workspace/resources/FSC 37_EVENT CAMPAIGN Schedule.xlsx` and the client's explicit "just fill the
spreadsheet up with actual posts / don't waste time on word docs". This is a real-world instance of
the "shape from inputs" seam and lands per D2 as **`planFromGrid()` in `content-campaign.js`** (or the
planning layer above): parse grid → one slot per non-empty cell, where row supplies **stream** (a new
slot/post field alongside `pillar`), column supplies `date`, and cell text becomes the brief title —
then the existing `scaffoldPost` → `content-draft.js` pipeline runs unchanged. Store the raw grid on
the campaign JSON so the calendar view round-trips; the calendar render this spec already mandates is
a strict superset of the grid (add a paste/upload import affordance on `#screen-campaign`). Interim
evidence of the shape: `fightstar-championship/content/config/fsc37-schedule-plan.json` (streams +
dated posts + owner/lead-time/capacity fields) + `scripts/fsc37-schedule.py` which emits Kay's xlsx
grid, an asset-deadline sheet, and the ops CSVs from that one plan object — that plan JSON is a
working prototype of the grid-campaign data model, including two fields this spec should adopt:
**owner** (which creative delivers the asset) and **status gates** (hold/posted/note) with a
capacity rule (2 assets per creative per 2 days).

---

## Feature 5 — Carousel Builder (Creation-layer authoring; use case A)

**Position:** entered **campaign-first** — select campaign → drill to the specific post. The **day and
pillar are already defined by the campaign**; the carousel never starts blank. It is scoped by a
Feature-4 plan slot.

**Deterministic rules:**
1. **Content type (image/video) is inherited from the campaign design** for that post.
2. **Apply assets + generic graphics/overlays** (lower-thirds, straps) onto slides — shared
   overlay/graphics library (same family as montage idents).
3. **Slide editor renders `{kicker, headline, body, media, overlays}` clearly** — as-is it's ambiguous
   and doesn't really render. Structured, visibly rendered slide fields.
4. **Standard templates ("cookie-cutter"):** select a template → build from there. **Reuses the
   existing `slide-templates.json` registry** — no new engine. Examples: lower-third strap, vertical
   partition.
5. **Template preview = swipeable stack of slide images.**
6. **Templates must be UI-creatable** (per the UI-instigated rule) — currently they are **not
   creatable** without Claude Code. This is the confirmed UI-Gap-register item.

**LLM-assisted (degrades to manual):**
- **"Analyse what's working with carousels"** (video overlays, mixed video + stills + graphics) = the
  existing **`carousel-patterns` weekly skill**: researches proven patterns → proposes template
  additions → human approves. Reuse, not rebuild. Unplug Claude → maintain templates manually.

**LLM-required:** none.

**Slice points & D-register:**
- **D8 — carousel-creation-in-two-places: DISSOLVED (verified on disk).** Stage has **no carousel
  authoring** — only posts-mode *rendering* of carousel posts for review. Studio authors, Stage
  displays. Only becomes real if Osman later adds client-side carousel authoring to Stage. Target if
  that happens: **one shared carousel engine** (slide model + template registry + renderer).
- **Shared overlay/graphics library** across montage + carousel (D7 family).
- **Template registry** (`slide-templates.json` + `carousel-patterns`) = shared service, reuse.

---

## Publishing surface / Direct-to-Instagram (Posting layer — forward-looking, IG-connection-gated)

**Status: preparing for a requirement, NOT confirmed.** Osman: "none of that is confirmed — we iterate
once the connection is sorted." **Gated on the IG pipeline** (`content-publish.js` / Step 3 — not
built; `fsc-ig-publishing-plan.md`). Captured now because Feature 5's "use case B" flows into it.

**What it is:** a single surface to **push new content to Instagram** — **posts, reels, carousels, and
potentially story updates**. Not carousel-specific; carousel authoring (Feature 5) is one feed into it.

**Rules captured:**
1. **A push either aligns to a specific campaign calendar item, OR stands alone** (a post that isn't
   part of any campaign). Alignment to the Feature-4 plan slot is the link, not a requirement.
2. **Ingests *returned finished content*** from editors/clippers/designers → structures it as a
   carousel/reel/post → **attaches assigned copy** → pushes to IG.
3. **This is the return→publish boundary** — the one place **real, full-res assets** live in-tool (see
   the low-res boundary exception). Everything upstream stays low-res.

**Lifecycle node this adds (the loop closes):**
`Analysis → Campaign → Creation (low-res brief) → [human editors produce real assets] → **content
returns** → structured as post + copy → Review → **Publish to IG**.`

**Tagging:** structuring returned assets into a post, calendar-item alignment, copy attachment, the
push itself → **Deterministic** (a deterministic Meta publisher, per the IG plan). Copy drafting (if
generated here) routes through the single copy path — **LLM-assisted**. **LLM-required: none.**

**D-register:** this is the **D1 "who owns posting"** question made concrete — Osman's lean is
**publishing lives in Studio, not Stage.** Must consume `post.json`/`content-state.js` and the
deterministic `content-publish.js`, not a parallel publisher.

---

## Finish / Brand-cut clips (`screen-finish`, "Publishing Step 2") — PARKED

**Decision (Osman, this session): parked, not walked.** In the current model the tool **never finishes
or cuts content itself** — editors/clippers return already-finished real assets, and the tool re-enters
only at the return→publish boundary. Finishing/brand-cutting is a **real-asset editing operation**, so
it belongs to the **parked, infra-gated future in-tool creation layer** (see the low-res "Future
evolution" note), **not** the low-res spec model.

**Consequence:** `screen-finish` drops out of the current reorganization. It returns when the tool
grows into a real build-and-cut-content creation layer. No low-res reason to touch it now.

---

## Review / Approval hop (the Stage client seam) — VERIFIED ON DISK 13 Jul 2026

The last lifecycle node. Traced through `content-state.js`, `content-sync.js`, the posts-mode patch
(`stage-patches/2026-07-12-posts-mode/`), and `content-review-server.js`. Findings reconcile the
duplication register with reality — several prior register entries were recall-based and are corrected
here.

**Verified architecture (matches the intended thin-spine design):**
- **State is single-sourced.** `post.json` (via `content-state.js`, states
  `idea→drafted→review→approved→scheduled→published→measured` + flagged/rejected/publish-failed) is the
  sole owner. Stage posts-mode writes *decisions* to `review-state.json` (`posts{ id:{status,note,
  reviewer,at,history} }`); `content-sync.js` normalises them and calls `setPostState` back onto
  `post.json`. Clean adapter — **no forked state model.**
- **Optional approval gate is already modelled.** `content-sync.js --delegate` flips undecided posts
  to `approved` on the operator's authority inside the veto window (only if `signedOff`). This *is*
  Osman's "optional gate."

**Register verdicts (corrected):**
- **D1 — two/three renderers: CONFIRMED.** Post rendering exists in `content-render.js` (the real
  Playwright→PNG), the review-app operator previews, and Stage `posts.html`. **Shared-renderer is the
  build** — one renderer consumed by operator preview + Stage + final PNG.
- **D4 — state model: DOWNGRADED to content-duplication.** State is *not* forked (above). The residual
  is that the engagement `manifest.json` **copies** each post's label/type/media/caption (the `id`
  points back to `content/posts/<id>`), so the manifest must be regenerated when copy changes. Fix =
  a **posts-native batch that points at `post.json`** rather than copying its display fields.
- **D6 — notifications: NOT triplicated.** posts-mode deliberately omits notifications (Option C);
  WhatsApp drops + Loop 1 monitor remain the single nudge path. Deferred, not duplicated.
- **D8 — carousel-in-two-places: DISSOLVED.** Verified: **Stage has no carousel authoring.** Its only
  carousel presence is posts-mode *rendering* carousel-type posts (swipeable slides) for review.
  Studio authors; Stage displays. D8 becomes a *future* risk only if client-side carousel authoring is
  ever added to Stage.

**Deterministic / LLM tagging:** the whole review→sync→state→delegate path is **Deterministic**
(decision normalisation, state transitions, sign-off doc generation). Redraft-from-a-change-note is
where an agent re-enters — **LLM-assisted** (the note is a constraint), degrades to manual rewrite.
**LLM-required: none.**

**Slice points:**
- **One shared post renderer** (kills D1) — used by operator preview, Stage, and final render.
- **Posts-native engagement that references `post.json`** instead of copying fields (kills D4 residual).
- Stage stays the **thin client**: writes decisions, reads shared shapes — confirmed, not aspirational.

---

## Status & what's still uncaptured

**Captured so far (data-foundation layer):** Feature 1 (Content Analysis), Feature 2 (People/Registry),
the person↔asset backbone, and the LLM-transparency rule. Everything below *consumes* this layer.

**Ideation + Creation layers — in progress this session:**
- **Cross-cutting: low-res proxies only** + the **Creation-layer-is-a-specification-layer** reframe (locked).
- **Feature 3 — Montage Builder** (locked): mock-up brief = preview + structured edit-list; searchable
  clip library w/ mandatory categories; deterministic tag-based naming; editor-style drag UI; fully
  Deterministic, no LLM.
- **Feature 4 — Campaign Builder** (locked): front-of-workflow ideation; acceptance test = reproduce
  the FSC 37 campaign; two outputs of one plan object (calendar/log + content plan); calendar-view
  preview showing the per-post **"why"/provenance**; tag-driven clip suggestion; optional Stage gate,
  client-facing artefacts; **edit brief = post mocks + asset list** (unifies with the Feature-3 brief);
  **deterministic spine + LLM proposals that degrade to manual, nothing LLM-required.**
- **Feature 5 — Carousel Builder** (locked): campaign-first entry; content type inherited from plan;
  render `{kicker, headline, body, media, overlays}`; reuse `slide-templates.json` + `carousel-patterns`;
  swipeable template preview; **templates must become UI-creatable**. One shared carousel engine (D8).
- **Publishing surface / Direct-to-IG** (captured, forward-looking, **IG-connection-gated, unconfirmed**):
  posts/reels/carousels/stories; push aligns to a calendar item **or** stands alone; ingests **returned
  finished content** + copy → publish. Publishing leans **Studio, not Stage** (D1).
- **Cross-cutting (locked):** **low-res boundary exception** — real assets re-enter only at
  return→publish; **UI-instigated create/maintain** rule + **UI-Gap register** (carousel templates =
  first confirmed gap; pillars / tone-of-voice / reel templates / overlays library flagged CHECK).
- **Lifecycle-order correction (locked):** **Analysis → Campaign/Plan → Creation → [editors return real
  assets] → Review → Publish** (Campaign at front; return→publish loop now closed).

- **Review/Approval hop** (locked, **verified on disk**): state single-sourced in `post.json`; Stage is
  a confirmed thin decision-writer; optional gate = `--delegate`. Register corrected: **D1 confirmed**
  (≥3 renderers → build one shared renderer), **D4 downgraded** to manifest content-duplication (fix =
  posts-native batch pointing at `post.json`), **D6 not triplicated** (deferred), **D8 dissolved**
  (Stage has no carousel authoring).
- **UI-Gap register completed (verified):** confirmed gaps = slide-templates author, pillar editor,
  reel-template registry UI, overlay "add new"; tone-of-voice doc-only.

**Finish / brand-cut (`screen-finish`): PARKED** — tool never cuts content in the current model;
belongs to the future in-tool creation layer.

**WALK COMPLETE.** Every lifecycle node from Analysis → Publish is captured, tagged, and reconciled
against the duplication register (D1–D8) with on-disk verification. The spec is now a full design.

**Not built (by design — this was a capture+design pass).** Build sequence below.

---

## Build sequence & slice boundaries

Ordered by **dependency + leverage**, not by feature number. Each slice is independently shippable,
names what it closes, and states what (if anything) blocks it. **Nothing starts until Osman picks a
slice.** Legend: 🟢 no blockers · 🟡 needs an open decision · 🔴 gated on external work.

### Slice A — Shared post renderer 🟢 *(foundation; start here)*
- **Do:** extract one render contract `postSpec → visual` and point all three current render paths at
  it — `content-render.js` (real Playwright→PNG), review-app operator previews, Stage `posts.html`.
- **Closes:** **D1**. Unblocks every downstream preview (montage, carousel, campaign calendar cell,
  Stage) so nothing re-implements rendering.
- **Boundary:** pure dedup — **no new features**. Low-res preview component is the deliverable.
- **Blockers:** none. Good timing — Stage posts-mode isn't deployed yet, so changing `posts.html` is free.
- Deterministic.

### Slice B — Nav reorder to lifecycle 🟢 *(cheap clarity win; can pair with A)*
- **Do:** reorder the topbar to **Analysis → Campaign → Creation (montage/carousel) → Review → Publish**;
  demote reference-data tools (People/Sets) out of the peer row.
- **Closes:** the "nav is build-order not workflow" core problem. No data changes.
- **Blockers:** none.

### Slice C — Campaign Builder to the FSC-37 acceptance test 🟡 *(the big value slice)*
- **Do:** Feature 4 — deterministic spine (calendar/cadence/slots/channel/export/edit) as a **thin
  front-end over `content-campaign.js`** (D2), LLM proposals (shape/copy/clip-rank) via the **single
  copy path** (D3); calendar view with per-post **"why"/provenance**; tag-driven clip suggestion via
  the person↔asset edge + pillars.
- **Acceptance:** reproduces the FSC-37 countdown campaign.
- **Depends on:** Slice A (calendar-cell preview).
- **Blockers (🟡):** none hard, but better if pillars are editable (Slice E) — can ship with JSON pillars.

### Slice D — Content Analysis entry point 🟢 *(the new front door; HIGH PRIORITY, decisions locked)*
- **D.1 BUILT + verified on disk 13 Jul 2026.** New **Content Analysis** screen (front-door nav button,
  first in the topbar) over `content-coverage.js`: brief + set + mode pickers, the have/missing gap
  matrix grouped by category (appearances & library modes), per-gap **"Locate in footage →"** deep-link
  into the Footage Sets verify workspace, and a **manual-items** panel (add / mark-located / delete,
  persisted to `content/analysis/coverage-<brief>--<set>.json`). Fully Deterministic — no LLM.
  Files: `content-review-server.js` (routes `/api/coverages`, `/api/coverage`, `/api/coverage/manual`
  GET/POST/PATCH/DELETE), `review-app.{html,js,css}`. Verified end-to-end via curl: matrix (51 rows /
  51 gaps for the media-day set, both modes), manual CRUD, and error paths (bad/missing set id → 400).
  **Next: D.2** (findings preview — proxies now confirmed in the Dropbox media-day set), then **D.3**.
- **D.1.5 — set intake in the UI: BUILT + verified 13 Jul 2026.** "+ Scan a folder" on the Analysis
  screen lists folders staged under `footage/dropbox-incoming/` (with scanned/scannable flags) and
  scans an unscanned one into a set via a background job (`content-set.js --scan`), then selects it and
  re-runs coverage. Routes `/api/set-folders`, `/api/set/scan`. Verified end-to-end (valid-slug folder
  → 1-file set → coverage runs; invalid slug + missing folder rejected). Guide §4.1 updated.
  **Prerequisite unchanged:** a set = a folder *synced locally*; pulling it from Dropbox is still rclone.

- **D.2 — proxy-ingest path (INVESTIGATED 13 Jul, not built). Findings:**
  - **State of the media-day set:** 196 video files, **0 masters local**, **all 196 carry proxy
    metadata in set.json** — but **the proxy `.webm` binaries are NOT on disk** (no `proxies/` dir).
    Each proxy ≈ 300 KB → **~60 MB for all 196** (vs multi-TB masters, some single files 6–25 GB).
  - **Serving/preview infra ALREADY EXISTS:** `/api/set/video?set=&file=` streams the proxy when the
    master is absent (`getSetVideo` → `entry.proxy.path` via `streamMp4WithRange` = HTTP range =
    seekable/timecode). Proxies preserve **source fps**, so tc-in/tc-out map 1:1 onto the master. The
    Sets screen already plays proxies this way. **D.2's preview player is essentially free.**
  - **The gap = getting the proxy binaries local.** `content-set.js --proxies` only *rebuilds from
    masters* (throws for a purged master with no local proxy) — there is **no existing tool to pull
    existing proxies down from Dropbox.** rclone remotes exist (`fsc-dropbox:` + 2 others, v1.74.4).
  - **Resolved (13 Jul):** no proxies in Dropbox — only masters. Client stores stay read-only; the
    studio writes derivatives to Osman's own **`os-fsc-gmail-dropbox`** (currently the rclone remote
    named `fsc-dropbox:`; rename pending). Both `fsc-dbx-new:` and `fsc-gdrive:` are client-owned →
    read-only. Masters for the media day + FSC37 interviews now staged in `os-fsc-gmail-dropbox`
    (`FSC MEDIA DAY 5.7.26/`, `FSC 37/`).
  - **D.2a tool BUILT + verified (dry-run) 13 Jul — `scripts/content-proxy-ingest.js`.** Per file:
    pull master → render ~640px proxy (reuses `content-set.js` ffmpeg) → upload proxy to the writable
    remote → delete local master (peak disk ~one master). **Writable-remote allowlist guard** in
    `content/config/remotes.json` makes it physically unable to write to client remotes (verified:
    `fsc-dbx-new`/`fsc-gdrive`/local all BLOCKED; `os-fsc-gmail-dropbox` ALLOWED). Committed `8a84844`.
  - **Before a real run:** rename rclone remote `fsc-dropbox:` → `os-fsc-gmail-dropbox:` (guard keys on
    the name); confirm the interview set is scanned first (needs a full pull → scan, since no set.json
    yet — media-day already has one); pick the machine (local vs Pi/NAS). Then run per set.
  - **D.2b — findings drill-down preview (after D.2a):** `content-coverage.js` returns only *counts*;
    extend it to return the **backing refs per row** (appearances mode → the set files where the row's
    people co-appear + `appearance.frames` for tc; library mode → verified entries w/ source + in/out),
    then a drill-down panel previews them via `/api/set/video`. Deterministic; no LLM.
- **Engine already exists** as `content-coverage.js` (have/missing matrix) + `coverage/media-day.json`
  (structured brief). This slice is the **UI front door over it**, not a from-scratch build.
- **Decisions locked (13 Jul):** structured coverage-config brief · deterministic gate first (LLM
  candidate-surfacing = fast-follow) · **new Analysis screen** linking into `screen-review` · build
  against the current `media-day.json` proposal.
- **Do (in two internal steps, clean boundary):**
  - **D.1 — gap-matrix front door (needs NO proxies):** new Analysis screen rendering the
    `content-coverage.js` have/missing matrix (event+brief scoped, both modes) + **manual-add** of
    items + **deep-link into `screen-review`** to verify a gap. Builds against real `set.json` +
    coverage config + library today.
  - **D.2 — findings preview (NEEDS low-res proxies):** per located item show low-res preview + source
    asset + tc-in/out. **Gated on proxy availability** (see below).
  - **D.3 — LLM candidate-surfacing (fast-follow):** propose asset/timestamp for gaps; human confirms.
- **Blockers:** **D.1 has none — startable now.** D.2 needs local low-res proxies for the media-day
  set (`press-2026-07-05-media-day` currently holds only `guest-list.xlsx` + `set.json`, no video) →
  **proxy-ingest is a prerequisite for D.2 only.** D.3 needs D.2 + a matching pass.
- **Brief seeding (enhancement):** D.1 runs against `coverage/media-day.json` as-is. The real
  itinerary PDF (10 Sequence Shots + 9 Interviews, named people/times) can **seed richer per-shot rows**
  — optional, and pulls in an **identity-matching** task for people not yet in the registry (Snoochie
  Shy, Krept & Konan, Nathan Rose, Max Kashket, Lancey Foux, Helen/Selene).

### Slice E — UI-Gap close-out 🟢 *(parallel; small CRUD each)*
- **Do:** UI-instigated create/maintain for the confirmed gaps — **slide-template author, pillar
  editor, reel-template/transition registry UI, overlay "add-new."** Each is thin CRUD over existing
  config (`slide-templates.json`, `pillars.json`, etc.).
- **Closes:** the UI-Gap register. Independent — can interleave anytime.
- Deterministic.

### Slice F — Carousel Builder 🟡
- **Do:** Feature 5 — campaign-first entry, render `{kicker,headline,body,media,overlays}`, swipeable
  template preview, template selection.
- **Depends on:** Slice A (renderer) + Slice E (template author, so templates are creatable).

### Slice G — Edit brief (unify montage + campaign output) 🟢
- **Do:** the shared **edit brief = post mocks + asset list + context**; montage produces mocks,
  campaign assembles the brief. Uses the shared clip library (**D7**).
- **Depends on:** Slice C (campaign) + the montage mocks.

### Slice H — Posts-native engagement 🟢 *(kills the D4 residual)*
- **Do:** replace the manifest's field-copying with a batch that **points at `post.json`**; Stage
  consumes references, not copies.
- **Depends on:** Slice A + Slice C. Do before deploying Stage posts-mode.

### Slice I — Publishing surface / Direct-to-IG 🔴 *(last)*
- **Do:** the posts/reels/carousels/stories publisher; ingest returned finished content + copy → push.
- **Blockers (🔴):** **gated on the IG connection** (`content-publish.js` / Step 3, not built).

**Priority (Osman, 13 Jul): D and C are highest.** D.1 is startable immediately (decisions locked, no
proxies needed); C is the FSC-37 value slice. Slice A (shared renderer) still ideally precedes C's
calendar preview, but can be minimal.

**Critical path:** A → C → G/H. **Parallel anytime:** B, E, **D.1**. **Blocked external:** D.2
(proxies), I (IG connection).

**Open decisions still parked (need Osman):** sponsor org-vs-person; registry naming; **D5**
asset-storage rule (not re-verified — check before any Stage-upload-adjacent work). *(Slice-D design
decisions — brief shape, who-locates, screen approach — RESOLVED 13 Jul.)*

---

## Resume prompt (next session)

> Read `main-stage-studio/03_resources/studio-workflow-alignment-spec.md` and
> `stage-lifecycle-review-handoff.md`. **The workflow walk is COMPLETE** — every node from Analysis →
> Publish is captured, tagged (Deterministic / LLM-assisted / LLM-required), and reconciled against the
> duplication register D1–D8 with on-disk verification. Locked lifecycle: **Analysis → Campaign →
> Creation (low-res brief) → [editors return real assets] → Review → Publish**; `finish`/brand-cut is
> PARKED (future creation layer). This session is a **build-priority decision, not more walking** — see
> the **"Build sequence & slice boundaries"** section (Slices A–I; critical path A → C → G/H; Slice A =
> shared post renderer, 🟢 no blockers, start here). **Still needs Osman:** brief shape, who-locates, sponsor
> org-vs-person, registry naming, new-vs-reframed analysis screen, and D5 (asset-storage, not
> re-verified). Do not build until Osman picks the first slice.
