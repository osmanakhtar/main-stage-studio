# SOP-MSS-003: MSS LinkedIn page content engine

| | |
|---|---|
| **Purpose** | Draft and track content for the MSS LinkedIn company page, review-gated before anything posts |
| **Operator** | Osman |
| **Verified** | Not yet run. Built 2026-08-18; bump this once the loop has actually been walked end to end (inbox note through to a posted LinkedIn post). |
| **Systems touched** | `01_mss/marketing/content-engine/` (local files only), LinkedIn company page (manual posting) |
| **Canon doc** | `01_mss/marketing/mss-social-content-plan.md` |

## When this runs

Weekly, targeting one drafted post ready to review per week. Also opportunistically: whenever a real piece of process or client work happens that's worth capturing, drop the note the same day rather than waiting for the weekly slot.

## Prerequisites

- A note worth drafting from: something concrete that happened, a stated position, or cleared client-work detail. Not a topic, an actual instance of one.
- For case-study drafts specifically: client confirmation that the work is cleared for publication.

## Routine operation

1. Write a raw note into `content-engine/inbox/YYYY-MM-DD-short-slug.md`, tagged with a `pillar` (see `inbox/README.md` for format).
2. Ask Claude to draft from that inbox file, naming the pillar so it uses the matching prompt in `content-engine/prompts/`.
3. Claude writes a draft into `content-engine/queue/YYYY-MM-DD-short-slug.md` with `status: draft`. You should see a queue file with the frontmatter fields filled in and post copy underneath.
4. Read the draft. Edit directly in the file until it's actually right, not just close.
5. Change `status: draft` to `status: approved` once it's final.
6. Copy the post body into LinkedIn (MSS company page, "Start a post"), post it.
7. Back in the queue file: set `status: posted`, `posted_date`, and `posted_url`.

## Checks

- `ls content-engine/queue/` and grep for `status: draft` or `status: approved` to see what's waiting on you.
- A healthy week has at least one file move from `draft` to `posted`. If a file sits at `draft` for more than two weeks, either finish it or delete it, don't let the queue silently grow stale.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Draft reads generic, could be about any studio | Inbox note was a topic, not a real instance | Rewrite the inbox note with a concrete detail (what actually happened, what was said) and re-draft |
| Case-study draft names client details that weren't cleared | Drafted without confirming publication clearance | Do not post; strip or generalize the detail, confirm clearance before redrafting |
| Nothing in the inbox to draft from | No captured moment this week | Skip the week rather than inventing a post; note it and move on |

Escalation: none needed, this is a single-operator system with no external dependency until the posting step.

## Boundaries

- Nothing posts without Osman reading and approving it first; no `status` field skips `approved`.
- No LinkedIn API integration in v1: posting is manual, on purpose (see `content-engine/README.md`).
- Founder POV/teardown content does not run through this pipeline; it belongs on Osman's personal profile and stays a separate, manual process.
- Brand/visual pillar does not run until the Higgsfield credit top-up decision is made (`mss-social-content-plan.md` §8).

## Change log

- 2026-08-18: created, alongside the content-engine build.
