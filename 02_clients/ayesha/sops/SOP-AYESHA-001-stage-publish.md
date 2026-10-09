# SOP-AYESHA-001: Publish the Ayesha prototypes to Stage

| | |
|---|---|
| **Purpose** | Put every Art by Ayesha Johar website direction in front of Ayesha on Stage, as pages of one engagement, without breaking her edits or comments |
| **Operator** | Osman (or Claude in a session) |
| **Verified** | 2026-10-09 |
| **Systems touched** | Mac workspace, Stage on the Pi (`pi@192.168.1.106`, engagement `ayesha-johar-site`), https://mss-review.duckdns.org |
| **Canon doc** | `brand/artbyayeshajohar_brand_direction_v3.md` (what the site is); decisions in `main-stage-studio/.claude/mss-decisions-log.md` |

## What is published

One engagement, 34 pages. The front door (`/prototype/ayesha-johar-site`) is the Directions page.

| Page id | Source | What it is |
|---|---|---|
| `directions` | `web/ayesha-johar-v3-choose.html` | Client-facing chooser, one card per direction |
| `index` | `web/ayesha-johar-v2.html` | Version 2, single page. Id kept so her September comments stay attached |
| `ayesha-johar-v3a*`, `-v3b*`, `-v3c*`, `-v4*` | `web/ayesha-johar-v3a.html` etc. | Directions A, B, C and D: home, five rooms, Who I am, Collect (8 pages each) |

The page list, labels and order live in `pages()` in `web/stage-publish.py`.

## When this runs

After any change to the build scripts (`web/build-v3.py`, `web/build-v4.py`, `web/site_kit.py`), to `web/ayesha-johar-v2.html`, or to `web/assets/art/`, that Ayesha should see.

## Prerequisites

- SSH key access to `pi@192.168.1.106` from the Mac (same as every Stage job).
- `node` on the Mac, and `~/workspace/scripts/stage-autotag.js` present.
- Python 3 with Pillow (the builds sample colour from the paintings).
- Ayesha's client login is `ayesha`, scoped to `ayesha-johar-site` only, in `~/stage/config/users.json` on the Pi. Her password was handed over out of band; it is not stored in the repo. To reset it or change what she can open, use Stage admin > Users (SOP-OPS-012).

## Routine operation

1. Build the pages, from `02_clients/ayesha/web/`, with plain `python3` (not `python3 -I`, which stops the builds importing `site_kit.py`):
   `python3 build-v3.py && python3 build-v4.py`
   You should see `wrote 25 pages` and the v4 page list.
2. Optional preview: `python3 stage-publish.py --dry-run`. It prints `manifest: 34 pages ...` and uploads nothing. A warning about `VIDEO.mp4` on `index` is expected (a commented-out placeholder in v2).
3. Publish: `python3 stage-publish.py`.
   You should see the autotag summary, `manifest: 34 pages (+N new), +N copy, +N images; kept all existing ids`, the backup and three rsync lines, then `published: https://mss-review.duckdns.org/prototype/ayesha-johar-site  (front door: Directions)`.
4. Open the link logged in as admin and click through: Directions, a direction's home, a room door, a painting, the Rooms menu.

A rebuild regenerates the HTML without the `data-stage-id` tags; step 3 puts them back. Autotag gives the same ids to unchanged text, so her edits stay attached. Changing a line of text gives it a new id and the old one is kept in the manifest.

## How the Stage copy differs from the source

- `assets/art/` becomes `/assets/ayesha-johar-site/` (Stage serves assets flat by filename).
- Every link to another page (for example `ayesha-johar-v3a-room-nature.html`) becomes `/prototype/ayesha-johar-site/ayesha-johar-v3a-room-nature`. Live-edit only follows links that start with `/prototype/`, and only because the manifest sets `allowNavigation: true`.

## Checks

- Directions loads with five cards; each card opens its direction.
- On a room page, a painting opens its own page, and `#/painting/<slug>` opens it directly.
- "Ask about this painting" lands on that direction's Collect page with the message filled in.
- On the Pi, `ls ~/stage/engagements/ayesha-johar-site` shows a fresh `manifest.json.bak-<stamp>` and `prototype.bak-<stamp>.tgz` from this run.
- Comments she has left: `/stage-feedback ayesha` (SOP-OPS-009).

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| `missing pages (run build-v3.py and build-v4.py first)` | A build was not run, or a page was renamed | Run both builds. If a page was added or renamed on purpose, update `pages()` in `stage-publish.py` |
| `ModuleNotFoundError: No module named 'site_kit'` | The build was run with `python3 -I` | Run it with plain `python3` from `web/` |
| `WARNING <page>: relative links left` | A new link points at a file not in the page list | Add the page to `pages()`, or make the link absolute |
| Clicking a link on Stage does nothing | `allowNavigation` was turned off, or the link is not under `/prototype/` | Republish (the script sets it), or check the link rewrite |
| A painting or background is blank on Stage but fine locally | Path not under `assets/art/`, or a subfolder was used | Put the file directly in `assets/art/` and reference `assets/art/<file>` |
| `note: N ids in the manifest are no longer on any page` | Text she could edit was changed or removed | Nothing breaks; the old id is kept. If she has an edit on it, it no longer shows. Check `output/client-edits.json` on the Pi before removing anything for good |
| `ssh` or `rsync` fails | Pi offline or SD card trouble | See the Stage notes in SOP-OPS-011 (backup and restore) |
| Clicking a painting starts editing its text | She is in edit mode | Expected. Prototype mode on the Stage bar shows the site as a visitor sees it |

Escalation: roll back by restoring the newest backups in the engagement folder on the Pi: `cp manifest.json.bak-<stamp> manifest.json` and `rm -rf prototype && tar xzf prototype.bak-<stamp>.tgz`.

## Boundaries

- Never hand-edit or rename existing `data-stage-id` values. Her edits and comment pins hang off them.
- Keep page id `index` for version 2; her September comments are on it.
- The engagement is **View only** since 9 Oct 2026 (Stage admin dashboard switch, SOP-OPS-012 step 6): she can click through but not edit or comment. Publishing keeps it. Turn it off on the dashboard before asking her for edits or comments.
- Change only the Directions page with `chooser()` from `build-v3.py` if you do not want to rebuild every page; a full build is fine too, because step 3 re-tags.
- The script never removes manifest ids, never deletes pages on the Pi, and never touches `output/` (her edits, comments and submissions).
- Never force the upload with a different engagement id. The engagement id is fixed as `ayesha-johar-site`.

## Change log

- 2026-09-30: created. Engagement first published by hand the same day; the script codifies those steps and was run end to end.
- 2026-10-09: multi-page. Publishes all four directions (v3 A, B, C and v4) plus v2 as 34 pages, Directions as the front door, links rewritten to `/prototype/` paths, `allowNavigation` on. Run end to end and verified live (navigation, painting pages, enquiry hand-off, Rooms menu).
- 2026-10-09 (evening): Directions page reordered by creation (Version 2 first, then A to D), wide tiles, heading "Five ways into your work."; engagement set View only. Publish run end to end; `+0 new` ids on the reorder confirmed tags re-derive unchanged.
