# MSS v6 Build Plan

*Created 10 October 2026. Canon for building the v6 site and the assets it needs. Positioning, prices and visual direction (A) are ratified: see `mss-positioning-v6-proposal.md` and `.claude/mss-decisions-log.md`.*

## Order of work

| # | Step | Repo / place | Production risk | Output |
|---|---|---|---|---|
| 1 | **DONE 10 Oct.** A tokens as one shared file | `01_mss/brand/` | None | `mss-v6-tokens.css` + `mark/spike-{tungsten,black,house}.svg` |
| 2 | **DONE 10 Oct.** Studio app in A (dark default; brand mode still renders the client's light chrome); terminal replay page in A. Content preview left in the client's brand on purpose | `scripts/review-app.{css,html,js}`, `scripts/content-branding.js`, `tools/clips/pipeline-terminal.html` | None (internal tool) | Studio in A |
| 3 | **DEPLOYED 10 Oct 2026** (commit 90edfd7, `make ship TARGET=studio-platform CONFIRM=deploy`, live after ~2 min, verified on app.puremed.uk). Console MSS layer in A; client colours unchanged. Open: PureMed's "Clinic console" label is gold on navy at 4.23:1 (pre-existing, tenant colours) | `studio-platform` | Live | Console in A |
| 4 | **APPLIED 10 Oct 2026 19:45** (`apply.sh`, Pi backups `.bak-v6reskin-20261010-194550`). Live login serves A; live `live-edit.js` matches the patch byte for byte; no Stage errors since restart. Live save round-trip verified 10 Oct on `mss-v6-brand` (2 saves 200, edit survived reload, test edit removed after) | `scripts/stage-patches/2026-10-10-v6-reskin/` | Live | Stage in A |
| 4b | **APPLIED 10 Oct 2026 19:59.** Stage admin pages (dashboard, engagement page and all 8 panels, users) and the legacy review shell and partials in A. Missed in step 4, caught by Osman. Patch `scripts/stage-patches/2026-10-10-v6-reskin-admin/` (`transform.py`, `fixbars.py`, `apply.sh`; backups `.bak-v6admin-20261010-195902`) | Pi | Live | Stage admin in A |
| 4d | **APPLIED 10 Oct 2026 21:26.** Every Stage editor pop-up restyled to match the dock (patch `2026-10-10-v6-reskin-panels`, backups `.bak-v6panels-20261010-212653`) | Pi | Live | Pop-ups in A |
| 4c | **APPLIED 10 Oct 2026 20:11.** Editor dock second pass (square, mono capitals, spike mark, Tungsten active) and PureMed staging banner hidden inside Stage. Patch `scripts/stage-patches/2026-10-10-v6-reskin-dock/` (backups `.bak-v6dock-20261010-201134`) | Pi | Live | Dock in A |
| 5 | Heads-up to Nafisa (and Ayesha) before steps 3 and 4 ship: new look, nothing moved | Osman sends | None | One-line message |
| 6 | **DONE 10 Oct.** All six clips in `tools/clips/out-v6/`: console (43s), content (30s), campaign (36s), website (38s, re-taken after the Stage pop-ups moved to A), content checks (19s), identity (29s, MSS brand book). Narrated cut + 8s loop each, MP4 + WebM + WebP. Demo surfaces: `studio_film_sandbox`, Vera demo site (`demo-clinic/vera/site/`, Stage `vera-demo-site`). Method in the clips README | `01_mss/website/tools/clips/` | Read-only recording | Clips |
| 7 | **DONE with step 6** (clip-kit encodes both cuts). Cut each clip twice (6 to 10s silent loop for cards, full narrated for product pages), framed in A, poster frames | same | None | MP4 + WebM + WebP posters |
| 8 | Mark set: favicons, apple-touch, per-page 1200x630 share images; retire `3d-mark-animation.mp4` and `hero-mark-poster.webp` | `01_mss/website/site/public/` | None | Assets |
| 9 | **DONE 10 Oct.** Brand canon rewritten for v6 A: `.claude/mss-brand-identity.md`, `mss-tone-of-voice.md`, `copy-contexts.md`, `mss-website-brief.md`, `CLAUDE.md` router, decisions-log brand tables; v1 archived in `_archive/brand-v1/`. Brand book `01_mss/brand/mss-brand-book.html` (built from specimen A by `build-brand-book.py`) | `main-stage-studio` | None | Canon |
| 10 | **DRAFTED 10 Oct.** `mss-website-copy-v4.md`: every page in the map. Copy-reviewer pass 1 done, fixes applied. Figures gate (`mss-website-copy-v4.figures.json`): 12 of 14 pass, all prices included; 2 fail by design until checked in production (1,642 appointments, zero unapproved sends). Open calls for Osman at the end of the doc | `01_mss/strategy/` | None | Copy doc |
| 11 | **BUILT and on Stage 11 Oct** (engagement `mss-v6-site`, admin only): 14 pages from `01_mss/website/prototype-v6/build-site.py` (edit the script, not the HTML), published with `stage-publish.py`. Viewport audit PASS on all 14 at 390/768/1440. Real clips and posters; no page nav (Stage's pill switches pages). Design-reviewer pass: see below. **Revised 12 Oct** (commits 898cc43, cbc1f3f, fcdc511, ee99020 on `mss-v6-copy`): clips replaced by stills until the clips are properly made (`make-stills.sh` + `work-shots.js`, written flat to `assets/still-*.webp` because Stage serves assets flat only); home lineup is Spotlight (Os chose it over two other concepts); CTA motion and pointer beam on every clickable; combat sports promotion removed; 19 pages now, including v6 case studies for Ayesha, Sable and the three demos | `01_mss/website/` | None | Prototype |
| 12 | **NEXT.** Astro build from `prototype-v6`, redirects for old `/work/` URLs (the three demo case studies now have v6 pages; `/work/booking-engine/prototype/` must keep serving, the demo case studies link to it), deploy-preflight, cutover | `01_mss/website/site/` | **Live** site. Deploy on Osman's OK | v6 live |

## Assets

**Reuse (recut after reskin where the tool UI is visible):** Stage editor capture (1 Oct, PureMed site, cleared), console capture (1 Oct, Vera), `puremed-pipeline`, `puremed-review-gate`, `intake-onboarding` (fictional firms, labelled), Sable images and hero clip.

**Record new:** Vera guide signup to console enrolment (Campaign); carousel builder with Vera (Content); MSS brand book scroll (Identity, after step 9); fresh screenshots of live puremed.uk.

**Have:** founder portrait graded, `01_mss/brand/founder/osman-mono-4x5.webp` (site; replaced 12 Oct 2026 with a mono crop of the new studio shot `osman-original-2026-10.png`) and `osman-colour-1x1.jpg` (LinkedIn; still the old shot, recrop from the new one if wanted). Ayesha agreed to be shown.

**Dropped for launch:** generated hard-lit stills (Higgsfield at 0 credits).

## Honesty rules for the videos

- Real tools only. No mock-ups on the live site.
- Demo data only (Vera, MSS). PureMed's public site is cleared; its console, people and emails never appear.
- FSC footage and branding never appear.
- There is no client screen for approving posts. Content pages say clients approve every post, and do not show an approval screen.
- Client colours stay the client's in every recording; A frames them.

## Recording notes (found in step 2)

- **Film only:** Carousel Builder, Campaign Builder, Clip Finishing, and the terminal replay. **Do not film** Montage Builder ("all fighters"), Directory ("Fighters", "Coaches", "from a fight card") or Content Analysis: FSC's domain model is still hard-coded there. Fixing that is its own job (config-driven labels per client).
- `content-lint.js` and `content-preview.js` print em dashes in their output. The terminal clip must show real output verbatim, so change the tools' messages, then re-capture; never edit the transcript.
- Studio interface text no longer uses em dashes; the Content Analysis placeholders no longer show a real fighter's name.

## Open

- Case study copy (Ayesha, Sable, three demos, 12 Oct) has had no copy-reviewer pass; `mss-website-copy-v4.md` does not yet carry it, the stills or the Spotlight lineup.
- Sable is described on the site as "a character I created": Os to confirm the wording.
- Ayesha has agreed to be shown, but has not seen her case study page (it quotes her answers and shows her unreleased directions).
- Positioning v6 §5.9 still names the combat sports promotion as Review proof; the site no longer does. Review has no proof until its first paid engagement.
- Care target for a site plus Platform (only the site rate is set).
- The viewport auditor reports PASS on a missing file (`scripts/viewport-audit.js:529`); fix offered, not yet approved.
