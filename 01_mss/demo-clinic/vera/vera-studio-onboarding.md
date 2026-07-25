# Vera Aesthetics — Studio Client Onboarding

*Created: 24 July 2026*
*Status: ONBOARDED. Vera runs as a Studio client (`--client vera`). Config complete, boot verified, slide rendering verified against the brand system.*
*Canon for: the Vera POC's Studio integration. Brand canon stays in `vera-brand-identity.md` / `vera-tone-of-voice.md` / `vera-campaign-calendar.md`. Studio how-to: `../../../scripts/studio-user-guide.md`. Operator procedure: `../../../sops/sop-mss-001-vera-studio-client.md`.*

---

## 1. What was done

Vera is now a **client config folder**, not new code, exactly as the architecture finding required. Studio is config-not-code, so onboarding meant authoring the config and registering the client.

**Created `01_mss/demo-clinic/vera/content/config/`:**

| File | Source it was derived from | Notes |
|---|---|---|
| `client.json` | brand identity §2–3 | Identity, 5 services with `pomSensitive` flags, IG-only, manual publish, `demonstration: true` |
| `pillars.json` | campaign calendar pillar spread | Six pillars weighted 25/25/17/17/8/8 (Education, Experience, Results, Practitioner, Offers, Patient voice) |
| `theme.json` | brand identity §5–6 + `vera-posts.html` | Navy/bone/gold, Fraunces + Hanken Grotesk (embedded, see below), slide rules, preview tokens |
| `lint-rules.json` | PureMed's POM rules, adapted | 17 blocking errors, 9 warnings. Same UK POM/ASA regime plus Vera's hype-word warnings |
| `compliance.md` | PureMed's, adapted + POC guardrails | Adds §0 demonstration guardrails (labelled demo, no fabricated patients, no invented practitioner identity) |
| `voice.md` | `vera-tone-of-voice.md` | Social-specific layer only; defers to the tone-of-voice doc |
| `image-library.json` | `assets/vera-asset-manifest.md` | All 14 reuse stills with pillar tags, face flags, aspect |
| `finishing.json` | PureMed's, adapted | Soft/warm grades, dip-to-white transition. Reels stay optional for the POC |
| `campaign-types.json` | the clinic's real axes | `brand`, `service`, `multi-service`, `seasonal`. Added 24 Jul to kill the FSC vocabulary leak, see §6 |

**Also created:**
- `brand/fonts/` — **Fraunces** and **Hanken Grotesk** as OFL variable TTFs, with their licences, wired up through `theme.fonts.files`. Neither family is installed on the machine, so until this was done the slide renderer silently fell back to Georgia and system-ui. Nothing errored; the slides were simply not in Vera's typography. Font files are embedded as data URIs at render time, following the FSC pattern.
- `assets/vera-mark.svg` — the leaf mark from brand identity §7, as a real file.
- `assets/vera-mark.png` + `assets/vera-mark-light.png` — 512px rasters (navy and bone). **Required**: ffmpeg has no SVG decoder, so the logo bug fails on every media slide if pointed at the SVG. The bone variant is the one wired up, because media slides carry a navy scrim.
- `assets/webp/` — q=90 WebP derivatives of all 14 assets. See §5.
- `content/assets/stills/` — 8 symlinks to the IG-native 4:5 crops and the two macro shots (now the WebP versions). The Carousel Builder discovers stills by scanning fixed folders (`brand/photos`, `content/assets-stills`, `content/assets/stills` relative to the project root), so the assets had to live in one of those. Symlinks avoid duplicating the files.

**Registered** in `scripts/content-clients.json`:
```json
"vera": "main-stage-studio/01_mss/demo-clinic/vera/content"
```

---

## 2. Verification (what was actually run)

- `resolveClient("vera")` loads: 6 pillars, 17 lint errors + 9 warnings, theme primary `#1E2B4D`, Fraunces, 2 finishing grades.
- `mediaLibrary()` returns **8 stills, 0 clips** (Vera is a stills-and-graphics client, no footage).
- Server boots clean: `node content-review-server.js --client vera --port 4503`.
- `/api/branding` returns Vera's tokens, `/api/media-library` lists the 8 stills, `/api/carousel/config` returns the 9 shared slide templates.
- **A 6-slide post was rendered through the real pipeline** (`content-render.js`), one slide per template the campaign needs, and inspected visually. Evidence: `vera-studio-render-check.png`.
- That post is kept as a **fixture**: `content/posts/vera-render-check/` (flagged `fixture: true`, state `drafted` so it re-renders). It is not a real campaign post. Re-render it with `node content-render.js --client vera --post vera-render-check` and diff against the evidence image after any theme or renderer change.

Three defects were found and fixed only because the output was rendered and looked at, not reasoned about: invisible headlines, the SVG logo crash, and the silent font fallback. None of them raised an error.

---

## 3. The renderer finding (the important one)

**The Carousel Builder does not render the `vera-posts.html` designs as-is. A slide-template add is genuinely required**, confirming what the POC architecture note predicted.

The real slide renderer is `scripts/slides/graphics.js`. Two structural facts drive everything below:

1. **It is a dark-only card family.** Every text template draws on `cardShell()`, whose background is hardcoded to a dark gradient. The `light` / `blue` styles that appear in `content-preview.js` belong to the HTML preview page, **not** to the PNG/MP4 slide renderer. There is no bone/light text card in the renderer at all.
2. **It uses `palette.primary` as its accent-on-dark colour** (numerals, quote attribution, CTA kicker, accent bars, footer accent). That works for FSC, whose primary is bright cyan. Vera's primary is navy, which *is* the card background, so anything coloured with it renders navy-on-navy and disappears.

### Status per template, as rendered

| Template | Verdict | Detail |
|---|---|---|
| `text-dark` | **Works** | Bone Fraunces headline on navy, muted body. Vera's navy card. |
| `cta-close` | **Works** | Headline, body and `@veraaesthetics` chip all read. |
| `hook-cover` | **Works** | Photo + scrim + bone headline + gold mark. Strongest output of the set. |
| `hero-still` | **Works** | Same, headline low in frame. |
| `quote-card` | **Broken** | Attribution row is invisible (navy on navy). Vera's campaign has 3 quote-card posts. |
| `stat-card` | **Broken** | The oversized numeral is invisible (navy on navy). Needed for the numbered education carousels. |
| bone/light card | **Missing** | Roughly half of Vera's design system has no template. |

### Config fixes already applied (these were unambiguous wins)

- `slideRules.headlineColor: "#F5F2EC"` — **without this every headline was invisible**, because the renderer defaults the headline to `palette.primary`. This was the single worst defect and is now fixed.
- `palette.textMuted: "#C2BEB5"` — warm muted bone for kicker, body and footer, replacing the default cool grey.
- `footer.accent: ""` — the renderer colours the accent word with `palette.primary` (invisible). Vera's footer lockup is the lowercase wordmark anyway.

### Cosmetic deviations from the hand-built spec (not blocking)

- Photo-slide headlines are force-uppercased by the template; the spec uses sentence case.
- The eyebrow renders in muted bone, not gold (the renderer colours kickers with `textMuted`, not `kicker`).
- No short gold rule under the eyebrow, and no decorative gold quote glyph.
- No zone for the "Illustrative / results vary" compliance tag that the results posts need. This one is a compliance affordance rather than decoration, so it is worth building rather than working around.

---

## 4. Recommendation for the remaining build

Two routes. **Recommended: the template add.**

**A. Add a light/bone card family + an accent-on-dark token to the shared renderer.** This is the one real build item the POC always had. Concretely: a `text-light` (and light variants of quote/stat) template in `slides/graphics.js` + `slides/registry.js`, plus a `slideRules.accentOnDark` token so `quote-card` and `stat-card` stop hardcoding `palette.primary`. It fixes Vera properly and makes the renderer usable by any light-brand client, which is the whole clinic-vertical bet.

**B. Overload `palette.primary` to gold.** A config-only hack that would fix the numeral, attribution and accent bars immediately. Rejected as the default: it is semantically wrong (Vera's primary is navy), it leaks into Studio's own Brand mode and the preview page, and it still leaves the bone card missing. Available as an interim if the POC needs quote cards before the build lands.

**Caveat:** `slides/graphics.js` and `slides/registry.js` are **shared across FSC, PureMed and Football**. Changes there need Osman's sign-off and a regression check on the other three clients, which is why this session stopped at the finding rather than editing them.

---

## 5. WebP conversion (24 Jul)

The PNG masters were 177M, too large to commit and the reason the whole Vera folder was sitting unbacked. Converted to **q=90 WebP: 7.4M, a 95.8% saving**, dimensions preserved.

**Quality was measured, not assumed.** On `results-skin-macro-2k.png` (fine pore-level skin texture, the hardest content in the bank): q=90 gives SSIM 0.972 / PSNR 41.4dB, and PNG vs q=90 vs q=80 are indistinguishable at 100% zoom. Across all 14, SSIM at q=90 runs 0.95 to 0.98. Two structural reasons the quality question is moot anyway: the masters are 1.7x to 4x larger than the 1080x1350 IG target, and Instagram re-encodes to its own lossy format regardless. (Lossless WebP was also measured at 84M, a 48% saving with zero loss, and is the fallback if a lossless working copy is ever wanted.)

**Master/derivative split:**
- `assets/*.png` = archival originals, **git-excluded**, local + Dropbox. The Higgsfield sub is lapsed, so these are not cheaply regenerated.
- `assets/webp/*.webp` = the working set. Studio, the renderer and publishing all read from it, and it is what gets committed.
- Each `image-library.json` entry carries both: `source` (WebP) and `master` (PNG).
- The `vera-mark*.png` rasters stay tracked (16K each, needed for the logo overlay).

**One shared-code change was required:** `scripts/content-carousel.js` `STILL_EXT` did not include `.webp`, so WebP stills were invisible to the Carousel Builder's discovery scan. Now `['.jpg', '.jpeg', '.png', '.webp']`. Verified safe: no other client has a `.webp` file in any still directory, so the change is a no-op for FSC, PureMed and Football. Everything else in the pipeline already handled WebP (ffmpeg decodes it, Chromium renders it, and the still validator never checked extensions).

Verified end to end: the 6-slide fixture re-rendered from WebP stills and the output is identical to the PNG-sourced version.

**Result:** the committed footprint for the whole Vera POC is now **9.2M across 47 files**, including the fonts.

## 6. Campaign vocabulary: the FSC leak (24 Jul)

Walking the workflow campaigns-first surfaced that the Campaign Builder was offering Vera a **rivalry** campaign, and the subject form was placeholdered with "Kenu Suthakaran" and "The Tamil Tiger". Studio was config-not-code on some axes but had FSC's domain model hardcoded on others.

**Already config-driven (worked):** `subjectLabel` (Vera's `topicLabel: "Service"` correctly produced "Services"), pillars, cadence, formats, themes.

**Was hardcoded, now fixed:**

| What | Was | Now |
|---|---|---|
| The 5 campaign types | `content-campaign.js:25`, a hardcoded Set | `config/campaign-types.json` per client, FSC's five as the default |
| The help text under each type | `review-app.js` `CMP_TYPE_DESC`, FSC-worded | The type's `description`, served from config |
| Subject picker label + hint | Special-cased by type name (`=== 'rivalry'`) | Keyed off the type's `subjects` cardinality + the client's own noun |
| Asset-pool filtering | Special-cased by type name | Same cardinality |
| Client-side validation | Type names | Same cardinality, with the client's noun in the message |

The engine now understands **cardinality** (`none` / `one` / `two` / `many` / `event`), not type names. Nothing special-cases a type by name anywhere, so adding a type is pure config.

Vera's vocabulary: `brand` (the 12-post POC shape), `service`, `multi-service`, `seasonal`.

**Regression-checked:** FSC, PureMed and Football all still resolve the exact default list (byte-identical to `DEFAULT_CAMPAIGN_TYPES`), FSC's server boots and plans a campaign correctly, and the old cardinality rules still fire (fighter needs 1, rivalry needs 2, brand takes 0). Vera correctly rejects `fighter` and `rivalry` as unknown types.

**Still leaking FSC vocabulary (not yet fixed):**
- The subject form in `review-app.html:39-51`: "Kenu Suthakaran" / "The Tamil Tiger" placeholders, and the labels "Archetype", "Fighter id", "Campaign id".
- The Source block is YouTube-channel-only, which is the FSC/Football sourcing model. Vera has no video source at all.
- `review-app.js:4226` keys a People-screen role off the literal `'fighter'`.
- **The Campaign Builder never calls `/api/campaign/list`**, so you cannot see whether a campaign already exists. The endpoint is there; nothing renders it.

## 7. Resume prompt

`Read 01_mss/demo-clinic/vera/vera-studio-onboarding.md §3-4 and scripts/slides/graphics.js + slides/registry.js. Add a light/bone text card family and a slideRules.accentOnDark token to the shared slide renderer so Vera's quote-card, stat-card and bone slides render correctly, then re-render the 6-slide check post and diff against vera-studio-render-check.png. Regression-check FSC, PureMed and Football renders before committing.`
