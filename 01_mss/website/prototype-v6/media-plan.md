# MSS v6 site: media plan

*Written 11 Oct 2026 from Os's home page review. Every moving image and photo on the v6 site,
one row per placement. Nothing gets filmed or generated unless it has a row here.*

## Rules

1. **Clips are evidence.** Product clips show the real tool running against real or labelled-demo
   content (see `../tools/clips/README.md`). Product evidence is never generated or mocked.
2. **Each clip shows one outcome, and control goes back to the owner.** If the caption describes a
   screen ("guide sign-up to console") and not a result ("a sign-up becomes an enquiry by day 6"),
   rewrite it.
3. **Subjects and consent.** PureMed footage needs Nafisa's OK for that specific clip. Ayesha's work
   needs Ayesha's OK. No real client records ever (customer names, emails, appointments): records
   are filmed on the Vera demo tenant (`film/film-setup.sh`, DB `studio_film_sandbox`).
4. **Framing.** Every clip sits in the Spike frame (`.framed`), 16:10 unless the row says otherwise. Loops
   are 8 to 12s, muted, poster = first meaningful frame. Narrated versions only where marked.
5. **Badge = honesty label.** Live / In progress / Self-initiated / Demo, fictional client,
   matching the proof block beside it.
6. **Generated imagery** (Higgsfield, 0 credits) goes only into non-evidence placements, and each one
   gets a credit estimate before it is unparked.

## Home

| # | Section | Outcome the viewer must see | Source | Subject / consent | Length | Badge | Status |
|---|---|---|---|---|---|---|---|
| H1 | Hero | The lights find the mark: beam sweeps in, lands on "show.", the Spike corners snap in like stage tape | Code (CSS/JS, no video) | n/a | 2.5s, once per session | none | Build |
| H2 | Problem ("rent their own front door") | The owner changes a line on her own site and it's live on puremed.uk minutes later, real timestamps on screen ("Edited 21:04 · Live 21:06 · No ticket") | Real Stage edit, then auto-publish (Loop 1 to 3) to production, screen-recorded both sides, cut side by side | PureMed, **Nafisa agreed 11 Oct.** Harmless, reversible change she agrees to | 10–12s loop | Live · PureMed Aesthetics | To film (placeholder: current `website` loop, captioned as demo) |
| H3 | Lineup: Identity | The brand being presented, not the video being generated: the clip must end on the presented brand | Sable: walk-out (6.5s) dissolving into her homepage hero (wordmark, descriptor, line, portrait), held 4s; frame source `portfolio/sable/brand/sable-arrival-presented-01.png`. Ayesha: discovery to directions to chosen system | Sable (self-initiated). **Ayesha agreed 11 Oct** | 10.5s loop | Self-initiated → In progress | Sable: **done** (`out-v6/identity-loop.*`). Ayesha: to record |
| H4 | Lineup: Website | The owner edits the page in place and publishes | Existing `website-loop` (Vera demo site in Stage) | Vera demo | 8s | Demo | Done |
| H5 | Lineup: Campaign | Time passing: sign-up 09:12, guide in her inbox 09:12, follow-up day 3, consultation request day 6 | Re-cut of the campaign recording with a time rail overlay (`record-campaign.js` + clip-kit captions) | Vera demo | 10–12s | Demo | Re-cut |
| H6 | Lineup: Content | A tagged photo library, a month generated from it, carousels assembled, the lint flags a banned word, the owner approves | `content-generate.js` / `content-lint.js` / preview, real run | PureMed library, **Nafisa agreed 11 Oct** (her photos) | 10–12s | In progress · PureMed | To record (current `content` loop until then) |
| H7 | Lineup: Platform | One customer, one record: sign-up source, consent, quiz answers, emails received, appointments, notes | Vera console, client record view | Vera demo only | 8–10s | Demo | Record |
| H8 | Lineup: Care | Static panel | Code | n/a | n/a | none | Done |
| H9 | Proof (PureMed) | Optional: a still of puremed.uk live | `shoot-site.js` screenshot | PureMed, public site | still | Live | Optional |

## Product pages (promise media, right of the h1)

| Page | Media | Source | Status |
|---|---|---|---|
| Review | "What lands" panel | Code | Done |
| Identity | Identity cue film (`identity-cue`), also on the home lineup: Sable's identity from her brief, spread by spread | `tools/clips/cue/`, her brief and existing images | Done 12 Oct |
| Website | Website cue film (`website-cue`), also on the home lineup | `tools/clips/cue/`, real Stage editor | Done 12 Oct |
| Campaign | Campaign cue film (`campaign-cue`), also on the home lineup: one sign-up, the real series, stopped by a booking | `tools/clips/cue/`, Vera filming console, days compressed (captioned) | Done 12 Oct |
| Content | Content cue film (`content-cue`), also on the home lineup: Content Studio plans and drafts a real PureMed week | `tools/clips/cue/`, PureMed's app edition, film profile | Done 12 Oct |
| Platform | Platform cue film (`platform-cue`), also on the home lineup: old records imported (DPIA signed first), one record, a batch recall | `tools/clips/cue/`, Vera filming console, fictional patients | Done 12 Oct |
| Care | "The run" panel | Code | Done |

## Other pages

| Page | Placement | Media | Status |
|---|---|---|---|
| How it works | 02 Rehearsal | `website` loop (Stage comments on a page) | Done; better: a Stage comment pin being placed |
| How it works | 03 Your cue | `console` loop | Swap to an approval moment (Approve button, then "scheduled") from H5/H7 footage |
| How it works | 04 Showtime | none | Reuse H2 once filmed |
| Work | Cards | none | Add posters from H2 to H7 when filmed |
| PureMed case | Before / Now | none | H2 under "Now" once filmed; puremed.uk still |
| About | Portrait | `brand/founder/osman-mono-4x5.webp` (from `osman-original-2026-10b.jpeg`, 12 Oct) | Done |

## Consent (agreed 11 Oct 2026, per Os)

- **Nafisa:** (1) film one real edit going live on puremed.uk (H2), (2) show her tagged photo library and
  generated carousels (H6). No client data in either.
- **Ayesha:** use her discovery (paintings, name meaning, directions) as Brand proof (H3) once her review closes.
