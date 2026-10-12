# SOP-MSS-006: Building the v6 site prototype and publishing it to Stage

| | |
|---|---|
| **Purpose** | Rebuild the MSS v6 site prototype from its build script and put it on Stage for review |
| **Operator** | Os (or a Claude session on his request) |
| **Verified** | 2026-10-12 (stills, build, viewport audit and Stage publish run end to end, several times) |
| **Systems touched** | `01_mss/website/prototype-v6/` (worktree `mss-v6-copy`), the Pi (`pi@192.168.1.106`, Stage engagement `mss-v6-site`), mainstagestudio.co.uk and puremed.uk (read only, for screenshots) |
| **Canon doc** | `01_mss/strategy/mss-v6-build-plan.md` (step 11) |

## When this runs

After any change to the prototype's copy, layout or images, and whenever Os wants the latest version on Stage to review.

## Prerequisites

- `ffmpeg` and `cwebp` (Homebrew). This ffmpeg has no WebP encoder, which is why `cwebp` does the encoding.
- Playwright, installed under `~/workspace/scripts` (used by `work-shots.js` and `scripts/viewport-audit.js`).
- Network access, because `work-shots.js` screenshots the live demo journeys and puremed.uk.
- SSH key access to the Pi as `pi`. No password is needed.
- The tool recordings in `01_mss/website/tools/clips/out-v6/` (SOP-MSS-004) and the Sable files in `01_mss/portfolio/sable/brand/`.

## Routine operation

1. `cd ~/workspace/.worktrees/mss-v6-copy/01_mss/website/prototype-v6`
2. Only if images changed: `bash make-stills.sh`. You should see a list of `assets/still-*.webp` files (27 as of 12 Oct).
3. `python3 build-site.py`. You should see `built:` followed by every page. Edit this script, never the HTML.
4. Audit each changed page: `node ~/workspace/scripts/viewport-audit.js <page>.html`. The expected verdict is `PASS_WITH_WARNINGS`. The one standing warning is the closed mobile menu's links.
5. `python3 stage-publish.py --dry-run` to check the staging copy, then `python3 stage-publish.py`. You should see `manifest: updated, +N copy, +M images` and then `published: https://mss-review.duckdns.org/prototype/mss-v6-site`.
6. Commit on `mss-v6-copy`, staging `01_mss/website/prototype-v6` by name.

## Checks

- On the Pi: `ls stage/engagements/mss-v6-site/assets/still-* | wc -l` matches the local count.
- The pages served from `stage/engagements/mss-v6-site/prototype/*.html` reference `/assets/mss-v6-site/still-…` and contain no relative links. `stage-publish.py` prints a WARNING if any are left.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Images load locally but not on Stage | An asset is in a subfolder. Stage serves `/assets/<engagement>/<file>` flat and rewrites every image `src` to its bare filename | Keep every asset flat in `assets/` |
| `build-site.py` exits with "stills missing" | `make-stills.sh` has not run | Run step 2 |
| A replaced image still shows the old version on Stage | Stage serves assets with a one-day browser cache (`max-age=86400`), so a file swapped under the same name stays stale | Give the new file a new name (e.g. a `-oct26` suffix) in `build-site.py`, `git rm` the old copy in `assets/`, rebuild and publish |
| `make-stills.sh` fails in `work-shots.js` | A live demo or puremed.uk is down, or there's no network | Retry later. The existing stills stay valid |
| Audit FAIL `image-collapsed` | An image is loaded inside a container hidden at that width | Hide the `img` itself at that breakpoint, not only its parent |
| A page is missing from Stage's page switcher | It isn't in `PAGES` in `stage-publish.py` | Add it and republish |

Escalation: Stage's own code is `~/stage/server.js` and `public/live-edit.js` on the Pi. Change it only through a patch in `scripts/stage-patches/`, with Os's OK.

## Boundaries

- The publish script is append-only for manifest ids, because comments hang off them. Remove an entry only after checking that nothing under `~/stage` references it, and back up `manifest.json` first.
- This publishes to Stage only. The live site is step 12 (Astro), shipped with `make ship`, never from here.
- The engagement is admin-only (no client login). Do not add a client to it.

## Change log

- 2026-10-12: added the stale-image row (founder portrait swap).
- 2026-10-12: created. Stills replace the clips (`make-stills.sh`, `work-shots.js`), and the asset rsync now recurses.
