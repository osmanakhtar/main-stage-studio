# SOP-MSS-001: Running the Vera Aesthetics demo clinic in Studio

| | |
|---|---|
| **Purpose** | Produce and check Vera Aesthetics social posts in Studio, the demonstration clinic that proves the MSS content engine end to end |
| **Operator** | Osman (MSS) |
| **Verified** | 2026-07-24 |
| **Systems touched** | Studio (`content-review-server.js`) on the local machine, the Vera config folder, ffmpeg + Playwright Chromium for slide rendering |
| **Canon doc** | `../01_mss/demo-clinic/vera/vera-studio-onboarding.md` (build + renderer findings). Brand: `vera-brand-identity.md`, `vera-tone-of-voice.md`. Campaign: `vera-campaign-calendar.md` |

## When this runs

Whenever a Vera POC post is being planned, built, rendered or checked, and whenever the POC is being demonstrated to someone. The campaign calendar is 12 posts across 3 weeks, 4 per week (Mon/Wed/Fri/Sun), each published manually on its date.

## Prerequisites

- The workspace repo at `~/workspace`, with `node` and `ffmpeg` on PATH.
- Playwright Chromium installed (the slide renderer launches it). Already present if FSC or PureMed rendering has ever run.
- `vera` registered in `~/workspace/scripts/content-clients.json` (it is; value `main-stage-studio/01_mss/demo-clinic/vera/content`).
- The 14 reuse images. **`assets/webp/` is the working set** and is what Studio reads (through symlinks in `content/assets/stills/` for the 8 IG-native ones). The PNGs in `assets/` are archival masters, git-excluded and kept local plus Dropbox: do not point Studio at them.
- `ANTHROPIC_API_KEY` in the environment **only if** you want live copy drafting. Without it Studio still works and posts get a "caption to follow" placeholder.

Vera has **no Meta credentials and must not get any**. Publishing is manual for the POC.

## Routine operation

1. Start the Studio server for Vera:
   ```bash
   cd ~/workspace/scripts
   node content-review-server.js --client vera --port 4503
   ```
   You should see `content-review-server: client "vera" on http://127.0.0.1:4503`. Keep the terminal open.

2. Open `http://127.0.0.1:4503` in a browser. Hard-refresh with **Cmd+Shift+R** if a screen looks stale.

3. **Plan**: go to the **Campaign** screen to generate scheduled posts across the six pillars, or work straight from `vera-campaign-calendar.md`, which already specifies all 12 posts with pillar, format, asset and hook.

4. **Author**: in the **Carousel Builder**, add slides. Vera is a stills-and-graphics client, so you are picking between text cards and the 8 reuse stills (there is no footage and no clip library).
   - Use `text-dark` for the navy cards, `cta-close` for the closing slide, and `hook-cover` or `hero-still` for photo posts. These four are verified good.
   - **Do not use `quote-card` or `stat-card` yet.** Their attribution row and numeral render navy-on-navy and are invisible. See "When it breaks".

5. **Write copy** in Vera's voice (`content/config/voice.md`). Every caption must pass the compliance rules before review: no prescription-only product names, no guarantee/permanent/painless claims, no urgency, and **no em dashes**.

6. **Render** the slides:
   ```bash
   node content-render.js --client vera --post <post-id>
   ```
   Output lands in `content/posts/<post-id>/slides/`.

7. **Preview** the post in the Preview screen, then publish manually on the post's calendar date to the MSS-owned reference Instagram account.

## Regenerating the WebP working set

Only needed if a master changes or a new reuse image is added. From `01_mss/demo-clinic/vera/assets/`:

```bash
cwebp -q 90 -m 6 <name>.png -o webp/<name>.webp
```

Then, if it is an IG-native 4:5 crop that should appear in the Carousel Builder, link it in:

```bash
cd ../content/assets/stills
ln -sf ../../../assets/webp/<name>.webp <name>.webp
```

Finally add the entry to `content/config/image-library.json` with both `source` (the WebP) and `master` (the PNG). q=90 is the verified setting: it is visually indistinguishable from the master even on skin texture at 100% zoom. Do not go below q=80.

## Checks

- Config health, run from `~/workspace/scripts`:
  ```bash
  node -e 'const{resolveClient}=require("./content-lib");const c=resolveClient("vera");console.log(c.config.name,c.pillars.length,"pillars",c.lintRules.errors.length,"lint errors")'
  ```
  A good state prints `Vera Aesthetics 6 pillars 17 lint errors`.
- Still library: `curl -s http://127.0.0.1:4503/api/media-library` should list **8 stills, 0 clips**.
- Rendered slides: headlines must be **bone on navy and clearly legible**. If a headline is invisible, `theme.json`'s `slideRules.headlineColor` has been lost, which is the known worst-case defect.
- Visual reference for what correct output looks like: `01_mss/demo-clinic/vera/vera-studio-render-check.png`.
- **Full render check** after any theme or renderer change. Re-render the fixture and compare against that image:
  ```bash
  node content-render.js --client vera --post vera-render-check
  ```
  `content/posts/vera-render-check/` is a fixture, one slide per template, not a real campaign post. A good state is 6 slides rendered, headlines bone and legible, body in Hanken Grotesk, headlines in Fraunces.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Headlines invisible on text slides | `slideRules.headlineColor` missing from `theme.json` | Restore `"headlineColor": "#F5F2EC"`. The renderer otherwise defaults headlines to `palette.primary`, which is Vera's navy background |
| Quote attribution or stat numeral invisible | Known renderer limitation: those templates hardcode `palette.primary` as their accent | Avoid both templates, or land the light-card/`accentOnDark` build in the canon doc §4 |
| `no decoder found for: svg` during render | A logo path points at `vera-mark.svg` | Point `branding.logo` and `finishing.logoBug.logo` at `assets/vera-mark-light.png`. ffmpeg cannot decode SVG |
| Carousel Builder shows no stills | Symlinks in `content/assets/stills/` broken, or the WebP set moved | Re-create the symlinks to `../../../assets/webp/<file>.webp`. Only `brand/photos`, `content/assets-stills` and `content/assets/stills` are scanned, and only `.jpg/.jpeg/.png/.webp` are picked up |
| A new WebP asset does not appear in the picker | `STILL_EXT` in `scripts/content-carousel.js` lost `.webp` | Restore it. That set is shared code: adding an extension is additive and safe, removing one hides assets for every client |
| Slides render in a generic serif, not Fraunces | `theme.fonts.files` lost, or the TTFs missing from `brand/fonts/` | Restore both. Neither family is installed on the machine, so the renderer falls back to Georgia **silently, with no error** |
| Server exits on boot | Malformed JSON, or a missing required config file | `client.json`, `pillars.json` and `lint-rules.json` are all required. Validate with `node -e 'require("./content-clients.json")'` and check the failing file |
| Captions rejected at lint | A compliance rule fired | Read the reason in the lint output and rewrite. Never soften a rule to make a post pass |

Escalation: renderer-level problems (templates, colours, new slide types) are a change to `scripts/slides/graphics.js` and `slides/registry.js`, which are **shared with FSC, PureMed and Football**. Do not edit them for Vera alone without regression-checking the other three clients.

## Boundaries

- Vera is a **fictional demonstration clinic**. It never presents itself as a real business, takes no patients, and every public surface labels it a Main Stage Studio demonstration.
- **No fabricated real-patient results.** All results and testimonial content is illustrative and labelled. No invented named practitioner, no AI face used as a recurring "the Vera nurse".
- **Never name a prescription-only medicine.** Wrinkle-softening content is consultation-led and product-free, with no price attached.
- **Manual publish only.** Vera gets no Meta API credentials during the POC; auto-publish is Phase 2 and belongs to the IG publishing plan.
- Studio is the making tool. Client-style approval belongs in Stage, and posts-mode there is not built yet.

## Change log

- 2026-07-24: created, when Vera was onboarded as a Studio client and the slide-rendering path was verified.
