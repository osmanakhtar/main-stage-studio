# Stage Lifecycle Review — Handoff

**Purpose:** a wider review of the **Stage** tool as the client-facing surface across the
whole content lifecycle — **campaign ideation → content creation → posting** — with one
governing question: *are we building the same capability in more than one place?* Anti-goal
is duplicated engines/state/render/copy logic across Studio, Stage, and the shared
`scripts/content-*` pipeline.

**Status:** scoping handoff — the review itself is NOT done. This maps the surfaces, states
the intended single-spine architecture (already half-written into the code), and lists the
duplication-risk questions to answer.

**Author context:** written 13 Jul 2026 immediately after building the People/roster profile
editor (Studio review-app). Grounded in on-disk inspection, not memory.

---

## 1. The lifecycle and where each stage lives today

```
IDEATION ─────────────▶ CREATION ─────────────▶ REVIEW/APPROVAL ─────▶ POSTING
(why + when)           (make the asset)         (client sign-off)      (go live)
```

| Stage | Studio (operator, localhost) | Shared engine (`scripts/`) | Stage (client, Pi) | Canon doc |
|---|---|---|---|---|
| **Ideation** | `screen-campaign` (Campaign Builder screen) | `content-campaign.js` (scaffold campaign→posts), `content-calendar.js`, `content-suggest.js`, `content-draft.js`, `content-dossier.js` | *future* client-facing campaign form (v2, not built) | `fsc-campaign-model.md`, `fsc-content-pillars.md`, `fsc-campaign-programme-plan.md` (Thread 7b) |
| **Creation** | `screen-review/sets/carousel/finish/montage/people` | `content-library/clips/finish/carousel/reel/preview/render/generate.js`; Higgsfield skills; asset intake (Dropbox masters) | — (creation is not client-side) | `fsc-content-engine-plan.md`, `fsc-clip-finishing-plan.md`, `fsc-clip-montage-plan.md`, `fsc-asset-consolidation-plan.md` |
| **Review/approval** | review-app is the *internal* view | `content-sync.js` (Stage decisions → `post.json`), `content-state.js` (state machine) | **Stage** engagement manifests: modes `prototype/assets/copy` + **posts-mode** (7c, built, NOT deployed); `signoff.md`; Loop 1 monitor | `fsc-stage-approval-plan.md`, `stage-build-plan.md` |
| **Posting** | — | `content-publish.js` (Step 3, **planned, not built**) — deterministic Meta publisher | consumes `approved→scheduled` | `fsc-ig-publishing-plan.md` + `fsc-ig-publishing-p0-runbook.md` |

Adjacent, shares the approval-gate ethos but a separate lane: **outreach-engine** (sponsorship).
Parallel pipelines riding the *same* engine: **football-goals**, **influencer-engine**, **PureMed** (website + content).

---

## 2. The intended architecture — one spine, thin front-ends

This is **already the stated design**, written into the code comments — the review's job is to
confirm nothing has drifted from it, not to invent it:

- **One engine** = `scripts/content-*.js`. Client-agnostic; per-client config. It scaffolds,
  finishes, and (soon) publishes. Every client rides it (FSC, PureMed, football-goals).
- **`post.json` + `content-state.js`** = the single source of truth for a post's identity and
  state: `… review → approved → scheduled → published → measured` (+ failure states).
- **Studio review-app** = the *operator* front-end (Osman). Screens are views onto engine data.
- **Stage** = the *client* front-end (Pi). Intended to be **thin**: it should write the same
  request/decision shapes the engine already defines and read/write the shared state — not hold
  its own parallel model.
- **The seams are explicit in-code:**
  - `content-campaign.js`: *"The request object is the seam for a future client-facing Stage
    form (v2): Stage would write the same shape, a loop would call generateCampaign() here."*
  - `content-sync.js`: pulls Stage decisions **into `post.json` state** (adapter on the
    `mss-loop2.js` pattern) — decisions live in the engine, not on Stage.

**If the review finds Stage (or a Studio screen) holding its own campaign/post/state model
instead of reading/writing these, that is the duplication to kill.**

---

## 3. Duplication-risk register (the questions to answer)

| # | Risk zone | The question | Where to look |
|---|---|---|---|
| **D1** | **Two review surfaces** — Studio review-app *and* Stage posts-mode both render posts + hold "review state" | Does Stage posts-mode consume `post.json`/`content-state.js`, or did the 7c patch fork a parallel `review-state.json` post model? Is post *rendering* implemented twice? | `scripts/stage-patches/2026-07-12-posts-mode/` (`signoff-posts.js`, `manifest.js`, `posts.html`) vs `content-state.js` + `content-sync.js` |
| **D2** | **Campaign→posts in ≥2 places** — Studio `screen-campaign`, `content-campaign.js`, and Thread 7b programme engine all turn a campaign into scheduled slots | Is there one `generateCampaign()` everyone calls, or divergent scheduling/slot logic? Does the Studio screen just POST the request shape? | `review-app.html#screen-campaign`, `content-campaign.js`, `fsc-campaign-programme-plan.md` |
| **D3** | **Copy drafting in ≥3 places** — Campaign Builder LLM draft, `content-draft.js`, `copywriting` skill, dossier interview briefs | One copy path or several? Do they share voice/config, or re-implement prompting? | `content-draft.js`, `content-campaign.js`, `content-dossier.js`, `copywriting` skill |
| **D4** | **Manifest/state model mismatch** — Stage's one-shot engagement blob (`stage-manifest.json`/`review-state.json`) vs per-post `post.json` state machine | This is already flagged as G1/G5 in the approval plan. Should the engagement model be replaced by a posts-native batch that *points at* `post.json`, so state isn't duplicated? | `content/preview/stage-manifest.json`, `fsc-stage-approval-plan.md` §3 (G1, G5) |
| **D5** | **Asset storage** — Dropbox masters vs Stage uploads vs `preview/assets` (wiped) | Confirm the rule "only *decisions* live on Stage; assets never duplicate storage" (G10) still holds after the client-upload patch | `stage-patches/2026-07-08-client-upload/`, Thread 8 asset model |
| **D6** | **Notifications/loops** — Loop 1 sign-off monitor vs planned Stage notifications vs manual WhatsApp | One notification mechanism or three? | `mss-loop1.js`, `fsc-stage-approval-plan.md` §3 (G2) |

---

## 4. Recommended review method

1. **Trace one post end-to-end.** Pick a real FSC post id. Follow it: campaign scaffold
   (`content-campaign.js`) → creation (carousel/finish) → `post.json` state → pushed to Stage
   → decision → `content-sync.js` → `content-publish.js` (planned). At every hop ask *"who owns
   this fact, and does anyone else store a copy?"* Every fork found is a D-register entry.
2. **Diff the two post renderers.** Studio's post view vs Stage posts-mode `posts.html`. If both
   build a carousel/reel preview from scratch, that's a shared component candidate.
3. **Confirm the seam contracts.** Does `screen-campaign` write the exact `content-campaign.js`
   request shape? Does posts-mode write exactly what `content-sync.js` reads? If yes, Stage-as-
   thin-front-end holds; if no, that gap is the build.
4. **Decide the target topology before building anything else.** The likely conclusion (state up
   front): keep **one engine + `post.json` spine**, make **Stage a thin client** that reads/writes
   the shared shapes, retire the one-shot engagement model for posts (D4), and treat post
   preview as **one shared renderer** used by both Studio and Stage.

---

## 5. Open decisions for Osman (surface during the review)

- **Stage posts-mode deployment** is gated (Pi deploy + phone pass, Sammo handover, veto-policy
  agreement) and **no one at FSC has seen Stage yet** — so there's still freedom to change its
  post/state model *before* it ships. This review should happen **before** deploying 7c.
- **Batch-week (Option A) vs posts-mode (Option B)** for FSC 37 (`fsc-stage-approval-plan.md`
  §4): Option A covers FSC 37 with zero build. The dedupe review may argue for shipping A now
  and folding B into the unified spine rather than as a Stage-local model.
- **Campaign Builder split-to-Stage** ("v2 client-facing form") — confirm it's a thin form over
  `content-campaign.js`, not a second builder.

---

## 6. Key file pointers (verified on disk 13 Jul 2026)

- Studio operator app: `scripts/review-app.{html,js,css}` + `scripts/content-review-server.js`
  (screens: studio, review, sets, carousel, finish, montage, people, campaign)
- Shared engine: `scripts/content-*.js` (see `content-campaign/sync/state/publish/draft.js`)
- Stage build/architecture: `main-stage-studio/03_resources/stage-build-plan.md`
- Stage patches (the real Stage behaviour locally): `scripts/stage-patches/{2026-07-03-asset-requests,2026-07-08-client-upload,2026-07-12-posts-mode}/`
- Stage lives deployed on the Pi: `ssh pi@192.168.1.106`, app `/home/pi/stage/`, users in
  `config/users.json` (`pi` + `nafisa`); public `mss-review.duckdns.org`
- Loops: `scripts/mss-loop1.js` (sign-off monitor), `mss-loop2.js` (Astro sync/apply)
- FSC canon: `fightstar-championship/fsc-{stage-approval,campaign-model,campaign-programme,ig-publishing}-plan.md`

---

## 7. Resume prompt

> Read `main-stage-studio/03_resources/stage-lifecycle-review-handoff.md`. Run the §4 review:
> trace one FSC post end-to-end across Studio → engine → Stage → publisher, fill in the §3
> duplication-risk register with findings, and propose the target topology (§4 step 4) before
> we build or deploy anything else — especially before deploying Stage posts-mode (7c).
