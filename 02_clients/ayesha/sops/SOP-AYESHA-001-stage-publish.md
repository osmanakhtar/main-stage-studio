# SOP-AYESHA-001: Publish the Ayesha prototype to Stage

| | |
|---|---|
| **Purpose** | Put the current Art by Ayesha Johar prototype in front of Ayesha on Stage, without breaking her edits or comments |
| **Operator** | Osman (or Claude in a session) |
| **Verified** | 2026-09-30 |
| **Systems touched** | Mac workspace, Stage on the Pi (`pi@192.168.1.106`, engagement `ayesha-johar-site`), https://mss-review.duckdns.org |
| **Canon doc** | `brand/artbyayeshajohar_brand_direction_v2.md` (what the site is); decisions in `main-stage-studio/.claude/mss-decisions-log.md` |

## When this runs

After any change to `web/ayesha-johar-v2.html` or `web/assets/art/` that Ayesha should see.

## Prerequisites

- SSH key access to `pi@192.168.1.106` from the Mac (same as every Stage job).
- `node` on the Mac, and `~/workspace/scripts/stage-autotag.js` present.
- Ayesha's client login is `ayesha`, scoped to `ayesha-johar-site` only, in `~/stage/config/users.json` on the Pi. Her password was handed over out of band; it is not stored in the repo. To reset it or change what she can open, use Stage admin > Users (SOP-OPS-012).

## Routine operation

1. Edit the source: `web/ayesha-johar-v2.html`. New paintings go in `web/assets/art/` as `<slug>.webp` (2000px long edge) plus `<slug>-sm.webp` (800px), and are referenced as `assets/art/<file>`.
2. Optional preview of what would change: `python3 web/stage-publish.py --dry-run`. It prints `manifest: +N copy, +N images` and uploads nothing.
3. Publish: `cd main-stage-studio/02_clients/ayesha && python3 web/stage-publish.py`.
   You should see the autotag summary, `manifest: +N copy, +N images; kept all existing ids`, four upload lines, then `published: https://mss-review.duckdns.org/prototype/ayesha-johar-site`.
4. Commit the source, because autotag may have added `data-stage-id` attributes to it.
5. Open the link logged in as admin and look at the change.

## Checks

- The page loads with every painting showing, and clicking a painting in **Prototype mode** opens the detail view.
- On the Pi, `ls ~/stage/engagements/ayesha-johar-site/prototype` shows a fresh `index.html.bak-<stamp>` from this run.
- Comments she has left: `/stage-feedback ayesha` (SOP-OPS-009).

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| A painting or background is blank on Stage but fine locally | Path not under `assets/art/`, or a subfolder was used | Stage serves assets flat by filename. Put the file directly in `assets/art/` and reference `assets/art/<file>` |
| `WARNING: ids in the live manifest no longer on the page` | Text or an image she could edit was removed or its tag changed | The script keeps the old id, so nothing breaks. If she has an edit on that id, it no longer shows. Check `output/client-edits.json` on the Pi before removing anything for good |
| `ssh` or `rsync` fails | Pi offline or SD card trouble | See the Stage notes in SOP-OPS-011 (backup and restore) |
| Clicking a painting opens Stage's image editor | She is in edit mode | Expected. Prototype mode shows the site as a visitor sees it |

Escalation: roll back by copying the newest `.bak-<stamp>` files over `manifest.json` and `prototype/index.html` in the engagement folder on the Pi.

## Boundaries

- Never hand-edit or rename existing `data-stage-id` values. Her edits and comment pins hang off them.
- The script never removes manifest ids and never touches `output/` (her edits, comments and submissions).
- Never force the upload with a different engagement id. The engagement id is fixed as `ayesha-johar-site`.

## Change log

- 2026-09-30: created. Engagement first published by hand the same day; the script codifies those steps and was run end to end.
