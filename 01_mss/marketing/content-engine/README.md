# MSS content engine (LinkedIn company page)

**Status: v1, MSS-only, manual posting.** Built 18 Aug 2026. Produces drafts for the MSS LinkedIn company page. Founder POV/teardown content for Osman's personal profile is out of scope here and stays manual.

## Why this exists

The MSS LinkedIn page has zero followers and zero posts. Personal profile is the primary conversion channel (see `mss-social-content-plan.md` §1); the page is a slower-moving mirror. This pipeline is what feeds that mirror: page-appropriate content, drafted in studio voice, reviewed before anything posts.

## The loop

1. **Inbox**: Osman drops a raw note into `inbox/` (a shipped feature, a case-study fact, a piece of studio thinking). One file per idea. Format in `inbox/README.md`.
2. **Draft**: Osman asks Claude to draft a post from a specific inbox file, using the matching pillar prompt in `prompts/`. Claude writes the draft into `queue/` with `status: draft`.
3. **Review**: Osman edits the draft directly in the queue file until it's right.
4. **Approve**: Osman changes `status: draft` to `status: approved`.
5. **Post**: Osman copy-pastes the approved copy into LinkedIn manually, then sets `status: posted`, `posted_date`, and `posted_url` in the file.

No step here is automated end-to-end. The judgment (what to say) is always Osman's; Claude drafts from that judgment, never invents it.

## Pillars in scope

Only the pillars that read as studio ("we") voice on a company page, from the four covered by `mss-social-content-plan.md` §3:

| Pillar | Prompt | Status |
|---|---|---|
| Process transparency | `prompts/process-transparency.md` | Active |
| Case study / proof | `prompts/case-study.md` | Active |
| Studio philosophy | `prompts/studio-philosophy.md` | Active |
| Brand / visual | `prompts/brand-visual.md` | Blocked, needs Higgsfield credit top-up |

Founder POV/teardown is deliberately excluded: it reads as personal opinion and belongs on Osman's personal profile, not the page.

## Cadence

Target **1 post/week** to start (4/month), reviewed after one month and adjusted. Lighter than the 8/mo figure in the original plan doc, because that count included the personal-POV pillars this build doesn't touch. Case study/proof will run under target early on since it's opportunistic (sourced from actual client work, and there's currently one active client).

## What this doesn't do

- Doesn't post to LinkedIn. No API integration. See `sops/content-engine-pipeline.md` for why.
- Doesn't cover Instagram. Brand/visual assets and IG cutdowns stay blocked on the Higgsfield credit decision (`mss-social-content-plan.md` §8).
- Doesn't generalize across clients yet. Config-driven reuse (like `outreach-engine/`) is deferred until this is proven for a month.
