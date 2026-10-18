# SOP-MSS-009: Rebuild the Vera logo files

| | |
|---|---|
| **Purpose** | Regenerate every Vera logo file from one script, so the mark never drifts between Studio, the platform and the demo site |
| **Operator** | Osman, or a Claude session working on the Vera demo brand |
| **Verified** | 2026-10-18 |
| **Systems touched** | `main-stage-studio/01_mss/demo-clinic/vera/` (brand, assets, site), `studio-platform/tenants/vera/brand/` |
| **Canon doc** | `~/workspace/main-stage-studio/01_mss/demo-clinic/vera/vera-studio-onboarding.md` §7a; design rules in `vera-brand-identity.md` §7 |

## When this runs

Any change to the Vera logo: weight, kerning, point size or spacing, colours, or a new export size. Never edit the SVGs or PNGs by hand; edit the constants in the script and rerun.

## Prerequisites

- `rsvg-convert` on the PATH (`brew install librsvg`).
- Python with fonttools. The system Python does not have it; use a throwaway venv.
- `vera/brand/fonts/Fraunces-Variable.ttf` present (it is committed).

## Routine operation

1. Edit the constants at the top of `~/workspace/main-stage-studio/01_mss/demo-clinic/vera/brand/logo/build-logo.py` (`INSTANCE`, `KERN`, `R`, `GAP`, colours).
2. Create the venv once: `python3 -m venv /tmp/vl && /tmp/vl/bin/pip install fonttools`
3. Run: `cd ~/workspace/main-stage-studio/01_mss/demo-clinic/vera/brand/logo && /tmp/vl/bin/python build-logo.py`
   You should see `built 6 svgs and copied 6 files`.
4. If the wordmark changed, rerun the demo site build so its inline header picks it up (`site/build-site.py` reads `brand/logo/vera-logo.svg`), or patch the five built pages in place if Stage edits must be kept.
5. Look at the result: open `vera-logo.png`, `vera-avatar.png` and `vera-favicon.png`, and screenshot the site header at 1440 and 390 wide.
6. Commit `main-stage-studio` (brand/logo, assets, site) and `studio-platform` (tenants/vera/brand) separately. studio-platform is a shared checkout: stage by name, on a branch.

## Checks

- `file ~/workspace/studio-platform/tenants/vera/brand/logo-*.png` shows header 400px, email 240px and footer 168px wide.
- `file ../../assets/vera-mark*.png` shows 512 x 512.
- The gold point is visible on every export at 32px and up.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| `ModuleNotFoundError: fontTools` | Ran with the system Python | Use the venv Python from step 2 |
| `rsvg-convert: not found` | librsvg missing | `brew install librsvg` |
| Copied 6 files but a surface still shows the old logo | That surface caches or embeds the logo (the platform stores it inside the published config) | Republish the tenant config; rerender Studio outputs |
| Point missing at small sizes | `R` lowered for the main mark | Small sizes take `r` separately (the favicon uses 150); adjust there |

Escalation: the design rules in `vera-brand-identity.md` §7 decide what is allowed.

## Boundaries

- Vera is a fictional demonstration clinic. The tenant is sandbox-only; this procedure never publishes anything to production.
- Never recolour the word gold, drop the point, or swap in live Fraunces text as a stand-in for the logo.

## Change log

- 2026-10-18: created with the "vera." logo; steps 2, 3 and 5 run as written (step 4 done by patching the pages in place; build-site.py not rerun).
