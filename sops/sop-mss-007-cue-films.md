# SOP-MSS-007: Cue films for the MSS site (capture, render, re-shoot)

| | |
|---|---|
| **Purpose** | Make the product films on the MSS site from the real tools: captured frame by frame, directed in code, never mocked |
| **Operator** | Osman (or a Claude Code session) |
| **Verified** | 2026-10-12 (Website, Content, Campaign, Identity and Ayesha films captured and rendered as written; `film-campaign-setup.sh` run end to end. Platform: every step run, but one at a time; `film-platform-setup.sh` was written from those steps and has not yet been run as one script) |
| **Systems touched** | `01_mss/website/tools/clips/cue/` (scripts), `out-v6/` (films), Stage on the Pi (`vera-demo-site` for Website), `~/workspace/carousel-studio` (Content Studio), studio-platform worktree `.worktrees/sp-v6-reskin` and its local `studio_film_sandbox` database on :3451 (Campaign, Platform), Playwright, ffmpeg, cwebp |
| **Canon doc** | `01_mss/strategy/mss-v6-build-plan.md` (Cue films section); concepts in `01_mss/website/prototype-v6/brand-video-concepts.md` |

## When this runs

When a product film is first made, when the tool it shows changes visibly, or when Os asks for a re-cut. One film at a time:
Os sees the original and the plan before anything is built, and reviews each film before it goes on the site.

## Prerequisites

- Playwright under `~/workspace/scripts/node_modules`; ffmpeg and cwebp (Homebrew).
- Website: an admin sign-in to Stage, made by a human in the window `node ../stage-auth.js` opens. Session in `../stage-state.json`; the chain below deletes it.
- Content: an Anthropic key pasted by a human into the app's own Settings, in the film profile (`cue/film-content/`, git-ignored). Never read or copied from Os's own settings.
- Campaign and Platform: Docker Postgres up (`studio-platform/service`), and a studio-platform worktree whose `.env.sandbox` names `studio_film_sandbox` and `PORT=3451`.

## Routine operation

Every film is two scripts: `capture-<film>.js` writes `frames-<film>/` (stills plus a `timeline.json` of positions), and
`render-<film>.js` (or `render.js` for Website) writes `out-v6/<film>-cue.{mp4,webm,webp}`. `--still <seconds>` renders one test frame.

1. `cd ~/workspace/.worktrees/mss-v6-copy/01_mss/website/tools/clips/cue`
2. Set up the film's source, if it has one:
   - Website: `node ../stage-auth.js && node capture-website.js && node render.js; rm -f ../stage-state.json` (a human signs in as admin).
   - Content: `node capture-content.js` (first run: paste a key in the app's Settings when it opens). `--dry` stops before any AI drafting.
   - Campaign: `SERVER_DIR=~/workspace/.worktrees/sp-v6-reskin/service bash film-campaign-setup.sh`. You should see `filming console up (one day = 30000ms)`. Then `node capture-campaign.js` (about 5.5 minutes: ten Vera days of 30 seconds).
   - Platform: `SERVER_DIR=... DATA=/tmp/vera-legacy bash film-platform-setup.sh`, then `node capture-platform.js /tmp/vera-legacy`. You should see `COMMITTED, migration job ...`.
   - Identity (Sable) and Ayesha: no setup. `node capture-identity.js`, `node capture-ayesha.js`.
   - Door, Care, Review, Cues (code-directed, no capture): `node render-stage.js door|care|review|cues` renders straight to `out-v6/` (`--still 4.2` for a test frame). Type, light and paper only: never draw a product screen.
3. Check four or five test frames before a full render: `node render-<film>.js --still 6.2`, and look at them.
4. `node render-<film>.js`. You should see the three files with sizes (aim for 1.5MB or less).
5. Watch the film. Then add it to `FILMS` in `prototype-v6/build-site.py` and publish under SOP-MSS-006. The build copies each film under a content hash (`website-cue-10af6b.mp4`), so a re-cut is always a new URL on Stage.
6. Commit the scripts and `out-v6/<film>-cue.*` on `mss-v6-copy`, by name. Frames and film profiles are git-ignored.

## Checks

- Every capture script refuses rather than films something wrong: the edit not landing, a post not coming back Ready, the series not stopping, nothing found in the recall.
- No real client data on screen. Vera and Hannah, Daisy and the others are fictional (example.com); PureMed appears only in the Content film (Nafisa agreed 11 Oct 2026).
- Compressed time is captioned ("days compressed for filming"); the Content clock is the real elapsed time of each frame.

## When it breaks

| Symptom | Cause | Fix |
|---|---|---|
| A replaced film or image still shows the old one on Stage | Stage caches assets for a day | New file name (SOP-MSS-006) |
| Campaign: emails land a "day" late | The worker checks once a minute; a 30-second day is shorter | Expected. Labels use the series' scheduled days |
| Platform import: "Refusing ... uncommitted importer code" | Something untracked in the studio-platform worktree (the film server log used to be) | `git status` there; the log now goes to `/tmp/mss-film-server.log` |
| Platform import: "Sign the DPIA first" or "doesn't cover bringing in the old records" | Vera's filming DPIA missing or without B10 | Run the setup script, which republishes with `vera-film-dp/` and signs through `vera-dp-sign.mts` |
| Vera's config has no data protection content | The kit copy was published away from `packs/` | The setup scripts copy it to `<root>/tenants/vera` beside a `packs` link |
| People export: "write it inside ~/puremed-data" | A guard for real data | The setup writes the demo list straight from the filming database instead |

## Boundaries

- Never film the live PureMed console, its people or its emails. Never press Submit or Publish in Stage; never post anything.
- Never switch off a platform guard to get a shot (DPIA gate, live-mode `day_ms` refusal, importer code check). Meet it the real way, or ask Os.
- Generated imagery only where the media plan allows it (rule 6); product films are real captures only.

## Change log

- 2026-10-12: created with the first six films.
- 2026-10-13: `render-stage.js` adds four code-directed films (door, care, review, cues); films published under a content hash to beat Stage's asset cache.
