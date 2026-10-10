# SOP-MSS-004: Recording the v6 tool clips

| | |
|---|---|
| **Purpose** | Film the real MSS tools (console, Studio, Stage) on demo data for the product pages, as a narrated cut and an 8-second loop each |
| **Operator** | Osman, or a Claude session on the Mac mini |
| **Verified** | 2026-10-10 (all six clips recorded and encoded with these steps) |
| **Systems touched** | Local studio-platform sandbox (Docker Postgres :55433, a worktree server on :3451), Studio (`scripts/content-review-server.js`, :4503), the Vera demo site (:4322), Stage on the Pi (engagement `vera-demo-site`), ffmpeg, ImageMagick |
| **Canon doc** | `01_mss/strategy/mss-v6-build-plan.md` (step 6); method detail in `01_mss/website/tools/clips/README.md` |

## When this runs

When a tool's look or behaviour changes enough that a clip no longer matches what a client would see, or a product gains a clip.

## Prerequisites

- Docker running, with the platform's Postgres up (`cd ~/workspace/studio-platform/service && docker compose up -d`).
- A studio-platform worktree whose `service/.env.sandbox` names `studio_film_sandbox` and `PORT=3451` (the shared sandbox `studio_sandbox` is never filmed).
- For the Website clip: an admin sign-in to Stage, done by a person (`node stage-auth.js`).
- Playwright from `~/workspace/scripts/node_modules`; ffmpeg and ImageMagick on the path.

## Routine operation

All commands from `~/workspace/main-stage-studio/01_mss/website/tools/clips/` unless stated.

1. **Filming database:** `SERVER_DIR=<worktree>/service bash film/film-setup.sh`. It copies the shared sandbox into `studio_film_sandbox`, restarts the :3451 server only if it runs from that worktree, signs in off camera, writes the filmed Vera email copy and sets the approver to "Vera (clinic owner)". Ends with "Done. Console session ...".
2. **Platform:** `node record-console.js /tmp/mss-film-console-state.json`.
3. **Campaign:** serve the Vera site (`cd ../../../demo-clinic/vera/site && python3 build-site.py && python3 -m http.server 4322`), rebuild the film DB (step 1) so the demo person appears once, then `node record-campaign.js /tmp/mss-film-console-state.json`.
4. **Content:** start Studio (`cd ~/workspace/scripts && node content-review-server.js --client vera --port 4503`), then `node record-content.js`. It deletes its post and reindexes afterwards.
5. **Website:** `node stage-auth.js` (a person signs in as admin), then `node record-website.js`, then `rm stage-state.json`. The recorder resets the demo page before and after, even on failure.
6. **Content checks:** `node record-pipeline.js`.
7. **Identity:** `cd ../../../brand && python3 build-brand-book.py`, then back here, `node record-identity.js`.
8. Each recorder prints six paths in `out-v6/`: `<name>.mp4/.webm/.webp` and `<name>-loop.mp4/.webm/.webp`.
9. Review every clip on a contact sheet (`ffmpeg -i out-v6/<name>.mp4 -vf "fps=1/3,scale=640:-2,tile=3x4" -frames:v 1 sheet.png`) before using it.
10. Clean up: stop the servers you started, `rm /tmp/mss-film-console-state.json`.

## Checks

- Every narration line describes something visible in that frame.
- No real client data on screen; the "Demo · fictional clinic" or "MSS's own identity" tag is visible.
- No em dash anywhere on screen (the recorder refuses one in narration; tool output was cleaned at source).
- After the Website clip: `vera-demo-site`'s `output/client-edits.json` on the Pi has no copy or image edits.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Sign-in step hangs or exits with status 7 | The :3451 server was not up | Rerun `film-setup.sh`; it waits for the server with a 2-second curl timeout |
| `TimeoutError` waiting for a row | Locator text is split across a cell (name and email share one) | Point at the row with `locator('main tr', { hasText })` |
| Library photo not found in the Website clip | The library loads after the panel opens | The recorder waits up to 15s; rerun |
| Clip ends on a black frame | Context close | `encode()` trims 0.6s from the end by default |
| Shared sandbox shows filmed changes | Something pointed at `studio_sandbox` | Check `.env.sandbox`; the filming copy must end in `film_sandbox` |

## Boundaries

- Never film PureMed's console, people or emails, or FSC footage or branding.
- Never press Publish on Stage while filming.
- Never film Studio's Montage, Directory or Content Analysis screens until FSC vocabulary is made client-agnostic there.
- Never edit captured tool output in `pipeline-terminal.html`; change the tool and re-run.

## Change log

- 2026-10-10: created with the six v6 clips.
