# Carousel Studio

A Mac app that lets a client make on-brand Instagram and Facebook carousels and short clips from their campaign content, without a designer in the loop. The first build is **PureMed Studio**, for Nafisa at PureMed Aesthetics.

The brand is locked in: palette, type, logo, footer and layouts come from a brand pack, so everything she exports looks like PureMed. Every word on every slide and in both captions is checked against PureMed's advertising rules as she types, and a post that breaks a hard rule (a prescription-only medicine brand name, a guarantee, an em dash) cannot be exported until it's fixed.

| | |
|---|---|
| **Makes** | Carousel slides as 1080×1350 PNGs, plus `caption.txt` · Clips as mp4: 4:5 for the feed, 9:16 for Reels and Stories |
| **From** | Campaign content she pastes or writes (one block per slide), or a brief that Claude drafts from (optional) |
| **Media** | A starter library of PureMed's site imagery, plus her own photos and videos (iPhone HEIC photos are converted automatically) |
| **Posting** | Manual for now. Automated posting is a later feature |
| **Runs on** | macOS 12 or later, Apple Silicon and Intel |

## Costs

| Item | Cost |
|---|---|
| The app, Electron, ffmpeg, fonts (Cormorant Garamond and Hanken Grotesk, both OFL) | Free |
| Building the installers (GitHub Actions macOS runners on a public repo) | Free |
| Code signing (Apple Developer Program, about £79 a year) | Not used. The app is unsigned, see the install steps below |
| Draft with Claude (optional) | Pay per use on her or your Anthropic API key, a few pence per draft. Nothing if no key is added |

## Installing on a Mac (for Nafisa)

1. Download the `.dmg` for your Mac. For any Mac from late 2020 onwards (M1, M2, M3, M4) it's the one ending `arm64.dmg`. For an older Intel Mac it's the one ending `x64.dmg`. If you're not sure, open the Apple menu, then **About This Mac**: "Chip: Apple M..." means arm64.
2. Open the `.dmg` and drag **PureMed Studio** into **Applications**.
3. Open it from Applications. The first time, macOS says it can't verify the app. Click **Done**. This happens because the app isn't registered with Apple, not because anything is wrong with it.
4. Open **System Settings**, then **Privacy & Security**. Scroll down to the message about PureMed Studio and click **Open Anyway**, then confirm with your password.

You only do steps 3 and 4 once. After that it opens like any other app.

To update, download the new `.dmg` and drag it into Applications again. Your campaigns are kept: they live in **Documents › PureMed Studio**, not inside the app.

## Using it

1. **New campaign.** Pick the treatment and content pillar, then paste the campaign content. Write one block per slide with an empty line between blocks. The first line of a block is the headline, and the lines after it are the supporting text. A short first line ending in a colon becomes the small heading.
2. **Make slides from this content.** The first block becomes the cover, the middle ones become numbered cards, and the last becomes the closing call to action. If there's no closing slide, a consultation-led one is added.
3. **Edit.** Click a slide in the strip to change its layout, words, photo or video, and framing. Six layouts: cover photo, light card, split photo, brand card, quote, and closing call to action.
4. **Captions tab.** Write or paste the Instagram and Facebook captions. They're checked too.
5. **Compliance tab.** Anything marked **Must fix** blocks export. **Check** items are worth a second look but don't block.
6. **Export slides** saves the PNGs and `caption.txt` into Documents › PureMed Studio › exports. **Export clip** makes an mp4: still slides get a slow push-in, video on a cover slide plays under the headline, and slides crossfade.

**Draft with Claude** (optional): add an Anthropic API key in Settings and the campaign screen can draft the slides and both captions from a brief, in PureMed's voice and within its rules. The draft goes through the same compliance check as anything typed by hand.

## For MSS: building and releasing

```bash
cd 01_mss/tools/carousel-studio
npm ci
npm start        # run the app from source
npm test         # unit tests: templates, compliance rules, content parsing
npx electron . --selftest=./selftest-out   # renders the example post to PNGs and both clips, then quits
```

**Release:** push a tag such as `carousel-studio-v0.1.0`. The `Carousel Studio — build Mac app` workflow runs the tests, does a real render check on macOS (from source and again from the packaged app), builds the Apple Silicon and Intel `.dmg` files, and publishes them as a GitHub release whose download link you can send to Nafisa. Running the workflow by hand from the Actions tab builds the same files as an artifact without publishing. A `.dmg` can't be built on Linux, so the Mac build only happens in that workflow.

The repo is public, so a release download is public too. The brand pack only holds what's already public on puremed.uk (palette, logo, site imagery) and the compliance rules.

## How it fits together

| Path | What it is |
|---|---|
| `brands/puremed/` | The brand pack: `brand.json` (palette, fonts, logo, footer, handle, treatments, voice summary), `lint-rules.json` and `compliance.md` (copied from `content/config/` in `osmanakhtar/puremed-aesthetics`), `voice-social.md`, `pillars.json`, fonts, logo, starter `library/`, and the example campaign she sees on first launch |
| `src/shared/slides.js` | The six slide templates. One HTML document per slide, used for both the on-screen preview and the export, so the preview is exactly what ships |
| `src/shared/lint.js` | The compliance check. Same rules and matching as Studio's `content-lint.js` |
| `src/shared/outline.js` | Turns pasted content into slides |
| `src/main/render.js` | PNG capture (Chromium DevTools capture at exactly 1080×1350, whatever the screen size) and clip assembly with the bundled ffmpeg |
| `src/main/claude.js` | The optional drafting add-on |
| `src/renderer/` | The editor UI |
| `scripts/make-icon.js` | Rebuilds `packaging/icon.png` from the brand pack |

**A second client** is a new folder in `brands/` and a change to `studioBrand`, `build.appId`, `build.productName` and `build.dmg` in `package.json`. The templates and checks don't change.

**Keeping the rules in step:** `lint-rules.json`, `compliance.md`, `voice-social.md` and `pillars.json` are copies. If they change in the PureMed repo, copy them in again and cut a new release.

## Known limits and open items

- **Majesty font.** The brand display face is Majesty Light, which is commercial and not yet licensed. The app uses Cormorant Garamond Light as a stand-in, the same as the live site. To switch, add the woff2 to `brands/puremed/fonts/` and list it in `brand.json`.
- **Retired palette still in Studio.** `content/config/theme.json` in the PureMed repo still has the retired `#23476A` and Inter values. This app uses the reconciled live palette from `puremed-brand-identity.md`. Studio's own renderer will drift from this app until that file is updated.
- **Draft with Claude has not been run end to end.** The request shape was checked against the API, but no draft was generated while building (no key was available). Run one draft with a real key before showing it to Nafisa.
- **Unsigned.** It's a one-time first-open step on each Mac. If Nafisa ever finds it a nuisance, the Apple Developer Program removes it.
- **No auto-update.** New versions are a new `.dmg`.
- **Video.** Footage plays under the slide on cover slides only. On a split slide, a video exports as its still frame.
- **Licensing of bundled ffmpeg.** `ffmpeg-static` ships a GPL build of ffmpeg. That's fine for giving the app to a client. If the app is ever sold as a product, revisit this.
