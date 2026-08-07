# MSS site: UX and coherence review

**Reviewed:** 5 Aug 2026
**Target:** `01_mss/website/site` (Astro 5 + Tailwind v4), served at `localhost:4321`
**Scope:** single page, `src/pages/index.astro` (1140 lines, all styles inline in `<head>`)
**Lens:** design-taste-frontend skill + MSS design principles in `main-stage-studio/CLAUDE.md`
**Method:** live browser inspection at 1920x958, computed-style and performance measurement, source read. Viewport resize was blocked in this session, so mobile findings are from code, not observation, and are flagged as such.

---

## Status

**Tier 0, Tier 1, Tier 2 and Tier 3.1 implemented 5 Aug 2026.** See "Implementation record" at the foot of this document, which includes a **correction to finding 0.2**: the 4.26s first-contentful-paint figure quoted below was a measurement artifact, not the site's real performance. The rest of 0.2 stands and the fix was worth making. The rest of Tier 3 is untouched. Findings below are preserved as originally written, so Tier 1 describes the site as it was, not as it now is.

---

## Verdict

The writing and the art direction are genuinely good. The problem is that almost none of the intended layout is actually reaching the screen. One CSS cascade bug is silently deleting every margin on the page, which is why the site reads as cramped and lopsided. Two more bugs mean the hero, the single most important thing on the site, is blank for the first four seconds and then only ever half-filled.

Fix the three items in Tier 0 and the site jumps a tier without a single design decision being revisited. Tier 1 is where the real coherence work sits.

---

## Tier 0: blocking defects

### 0.1 Every Tailwind margin utility on the page is dead

This is the big one.

The inline `<style>` block opens with:

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; }
```

Astro scopes that to `[data-astro-cid-j7pv25f6], [data-astro-cid-j7pv25f6]::before, ...`, and it ships **unlayered**. Tailwind v4 puts every utility inside `@layer utilities`. In the CSS cascade, unlayered styles beat layered styles outright, regardless of specificity. So the reset wins against every margin utility, everywhere.

Measured on the live page:

| Element | Class | Computed |
|---|---|---|
| Section container | `max-w-[1400px] mx-auto` | `margin-left: 0px` |
| What-we-do header block | `mb-16` | `margin-bottom: 0px` |
| Section h2 | `mb-8` | `margin-bottom: 0px` |
| Section label | `mb-4` | `margin-bottom: 0px` |

Two visible consequences:

1. **The page is not centred.** `mx-auto` is dead, so every 1400px container is pinned left. At 1920px that leaves roughly 420px of dead parchment down the entire right edge. This currently reads as an intentional (if odd) asymmetric layout. It is not, it is a bug.
2. **All vertical rhythm is gone.** Label, heading, and body copy sit flush against each other at 0px. In "What we do" the intro paragraph's bottom edge and the "Presence" label's top edge are the same pixel, so the label is visually swallowed by the card grid below it.

Only `gap-*` and padding still work, which is the only reason the page holds together at all.

**Fix:** delete the `margin: 0` from that reset. Tailwind's Preflight (inside `@layer base`) already zeroes margins correctly and loses to utilities as intended. If the reset must stay, wrap the inline block in `@layer base { ... }`.

Verified by removing the declaration live: the container immediately picked up `margin-left: 164px` and `mb-16` became `64px`. The section went from cramped to correct in one step.

### 0.2 First contentful paint is 4.26 seconds, and the hero is blank until then

Measured on a clean load:

```
domContentLoaded    39ms
load                54ms
first-paint       4260ms
first-contentful-paint 4260ms
```

Every resource finished inside ~100ms. Nothing is bandwidth-bound. Two compounding causes:

- The Google Fonts stylesheet is a render-blocking third-party `<link>` in `<head>`. No requests to `fonts.gstatic.com` appeared at all in this session, so the font fetch is stalling and taking first paint with it.
- The hero copy is **hidden by default and revealed by JavaScript**. `.line-clip__inner` ships at `translateY(105%)` inside `overflow: hidden`, and only moves once a script adds `.lines-ready` to `<body>`. So the headline, the sub-copy and both CTAs are invisible until CSS and JS have both resolved. Reveal delays then stagger up to a further 1.1s.

Screenshotted at 4s after load: nav only, hero empty. At 9s: hero present. Reproduced across three loads.

**Fix:** self-host the two families (or `preload` the woff2 and drop the blocking `<link>`), and invert the reveal so the hero is visible by default. Add the hiding class from JS on load, so the animation is progressive enhancement rather than a precondition for reading the page. Right now a JS error, a blocked font CDN, or a slow connection all produce a blank hero.

### 0.3 The hero video never plays, leaving 52% of the hero empty

`#hero-video` sits permanently at `readyState: HAVE_NOTHING`, `networkState: LOADING`, `videoWidth: 0`, `buffered: 0`, across every load tested. The wrapper is 998 x 1025px, which is 52% of the hero, and it stays blank parchment.

Root cause is in the file, not the server. The dev server handles range requests correctly (returns `206 Partial Content`). But the mp4 is not fast-start:

```
top-level atoms: ftyp, uuid, free, mdat (2,679,292 bytes), moov (3,135 bytes)
moov before mdat: False
```

The `moov` atom carries the index the decoder needs to render frame one, and it is written **after** the entire 2.68MB media payload. The browser has to pull the whole file before it can show anything.

**Fix:** `ffmpeg -i 3d-mark-animation.mp4 -c copy -movflags +faststart out.mp4`. Then add a `poster` frame so the space is never empty, set `preload="metadata"`, and decide whether it should `loop` (it currently plays once at 0.75x and pauses on `ended`, so anyone arriving late sees a frozen frame).

---

## Tier 1: coherence

This is what was actually asked for. The bugs above are cheap to fix. These are the decisions.

### 1.1 The voice switches between "we" and "I"

The positioning is founder-credential-led and explicitly solo ("one person, one system"). The copy does not hold that line:

- Nav and section headings: "What we do"
- Body: "This studio does both", "Main Stage Studio builds your presence"
- Contact: "Tell me what you're building", "If **I** think **we** can help" (both, in one sentence)
- Success message: "**I** read everything that comes through here"
- Error alert: "emailing **us** directly"

A prospect reads this as either a studio pretending to be bigger or a person hedging. Pick one and hold it. Given the credential section leans hard on a single operator's track record, "I" is the stronger and more defensible choice, with "the studio" as the impersonal alternative.

### 1.2 The section numbering starts at 02

Labels run `02 · The gap`, `03 · Running systems`, `04 · What we do`, `05 · How it works`, `06 · The promise`, `07 · Work`, `08 · Start a project`. There is no `01`. The hero is labelled "Digital Studio · London" instead. The very first numbered thing a visitor sees is a 02, which reads as a mistake because it is one.

Either number the hero 01, or drop the numbering. It is decorative rather than functional here (nothing links to the numbers), so dropping it is defensible.

### 1.3 Every section heading uses the identical construction

Five in a row, all two dark lines then two terracotta lines, all hard-broken with `<br>`:

- "A launch / is a moment. / *Running it / is the job.*"
- "Running systems / that couldn't / *afford to / fail.*"
- "How you / show up. / *What holds / it up.*"
- "One place to / see everything. / *One gate everything / passes through.*"
- "Built and / signed off. / *See the work.*"

Individually each one lands. Stacked, the rhythm becomes a tic, and because every section shouts at exactly the same volume, none of them earns emphasis over the others. Vary the structure, and let at most two sections use the full two-tone four-line form.

Related: those `<br>` breaks are authored for one viewport width. At tablet widths they produce breaks in the wrong places. Prefer `max-width` in `ch` plus `text-wrap: balance`, and reserve manual breaks for the hero.

### 1.4 Sections 05 and 06 say the same thing

"05 · How it works" already lands the argument: sign-off is an enforced gate, the mechanical parts are automated, the judgment parts are not. The "On AI" callout inside it closes with "A person picks the moment. A person signs the words."

"06 · The promise" then says: the system does the labour, judgment is what does not get automated, "which moment actually matters ... That stays human, on purpose."

That is the same idea twice, second time weaker because the first already made it. Fold 06's best line into 05 and cut the section, or repurpose 06 into the thing the page is missing (see 1.5).

### 1.5 The Work section is a dead end

The heading says "See the work". There is nothing to see. No card links anywhere, no case study pages, no external links. Three of the four entries carry a status that says so: "Case study page coming with the Work page", "Visual assets incoming, late 2026", "In progress", "Concept".

Worse, every card carries `.spotlight-card`, a cursor-tracking spotlight on hover. That is a strong interactive affordance promising a click target that does not exist.

Options, in order of preference: ship one real case study and link it, or drop the "See the work" CTA and reframe the section honestly as a client roster, or remove the hover affordance from non-interactive cards so nothing is promised.

### 1.6 The portfolio thumbnails have no shared treatment

Four images, four unrelated visual worlds: a navy clinical photograph, a near-black abstract with a thin gold line, a bright turquoise water painting, and a cream-and-terracotta 3D render. Nothing ties them to each other or to the MSS palette.

This is the section whose whole job is to demonstrate art direction, and it currently reads as a stock grid. A shared treatment (consistent crop and aspect, a duotone or a subtle parchment/terracotta wash, a consistent overlay at rest that lifts on hover) would make four different projects look like one studio's output.

### 1.7 The Presence row is three unequal cards

Measured heights: Launch 347px, Presence Monthly 452px, Campaign 222px. With `items-start`, the row ends ragged and the eye reads it as unfinished rather than as deliberate asymmetry. Campaign in particular has two sentences in a box sized for ten.

The skill lens bans the generic three-equal-card feature row outright, and MSS's own principles say "no generic card overuse, use space, borders, and negative space". This row is the one place the site breaks its own rule.

Suggestion: these three are not peers. Presence Monthly is the core offer, Launch is the entry point, Campaign is a variant of Monthly (the copy says so: "it's often where a Presence Monthly engagement actually starts"). Give Monthly the weight, demote Campaign to a line beneath it, and drop the boxes in favour of dividers.

### 1.8 Wayfinding is thin for a page this long

The document is 8024px, roughly 8.4 viewports. The nav offers three links covering sections 04, 05 and 07. Sections 02, 03 and 06 are unreachable and unnamed. There is no active-section state, so the nav never tells you where you are. The only position feedback is a 1px terracotta progress bar at the very top of the viewport.

Add active-section highlighting (IntersectionObserver, reuse the one already there), and either surface the credential section in the nav or accept it as a scroll-only beat.

### 1.9 The palette has two sources of truth and an undocumented sixth colour

`src/styles/global.css` defines the tokens in Tailwind's `@theme`. The inline `<style>` then redefines the same five colours as CSS custom properties on `:root`. Both exist, and they can drift.

Separately, `#EAE0D0` is hardcoded inline in four places as the alternating section background. It is not in the palette, not in `@theme`, not in `:root`, and not in `CLAUDE.md`. `--blush` (`#E8C9AE`) is defined but never used as a background.

Consolidate to one source, and either promote `#EAE0D0` to a named token or replace it with `--blush`.

---

## Tier 2: accessibility

### 2.1 Contrast failures

Measured WCAG AA ratios (4.5:1 needed for normal text, 3:1 for large text and UI):

| Element | Ratio | Status |
|---|---|---|
| Form field labels, `rgba(28,23,18,0.4)` on `#EAE0D0` | **2.41** | Fail |
| Form placeholders, `rgba(28,23,18,0.24)` | **1.64** | Fail |
| Footer nav links, parchment @ 0.32 | **2.69** | Fail |
| Footer email, parchment @ 0.24 | **2.06** | Fail |
| Footer copyright, parchment @ 0.16 | **1.58** | Fail, effectively invisible |
| Section labels, terracotta on parchment (10px, 0.22em tracking) | **3.39** | Fail |
| Section labels, terracotta on `#EAE0D0` | **2.97** | Fail |
| Body copy, muted on `#EAE0D0` | **4.41** | Marginal fail |
| Body copy, muted on parchment | 5.04 | Pass |
| Dark-section body, muted-dark on near-black | 6.98 | Pass |

The form labels matter most: they are the only thing identifying each field, and at 10px, 0.16em tracking, 40% opacity they are close to unreadable. The terracotta section labels fail at every size they appear in, and they carry the numbering system.

Note the pattern: the `#EAE0D0` sections fail contrast that the parchment sections pass, because the greys were tuned against parchment only. One more argument for consolidating that colour.

### 2.2 The mobile menu traps keyboard focus in hidden content

`#mobile-menu` is `aria-hidden="true"` when closed, but it stays `display: flex`, `visibility: visible`, positioned off-screen at `translateX(1920px)`, with **four focusable links inside** and no `inert`.

Result: screen readers are told to ignore it while keyboard users can still tab straight into it, at every viewport including desktop where the menu is not part of the design at all. Focus lands on links that are 1920px off-screen with no visible indication.

**Fix:** add `inert` when closed (and remove it when open). It handles both the focus and the AT semantics in one attribute.

### 2.3 No focus-visible styles anywhere except form inputs

A stylesheet audit found exactly one `:focus` rule on the entire page: `.finput:focus`. Nav links, both CTA button styles, the ghost links, the menu toggle, and every card have no focus treatment and fall back to the browser default ring.

Compounding it: `.btn-fill` sets `overflow: hidden` (needed for the directional fill effect), which clips a ring drawn inside the element's box. On a near-black button against parchment, the default ring was already low-contrast.

**Fix:** one `:focus-visible` rule using terracotta with `outline-offset: 3px`, applied across interactive elements. Because of the clipping, `.btn-fill` needs the offset specifically.

### 2.4 The select does not look like a select

`.finput` sets `-webkit-appearance: none`, which strips the native dropdown chevron, and nothing replaces it. The result is that "What are you looking for?", the first field in the contact form, is visually identical to a text input. Users will try to type into it.

Add a chevron (inline SVG background), or leave the native appearance on the select.

### 2.5 No reduced-motion support

Confirmed: zero `prefers-reduced-motion` rules in the document. The page runs staggered line reveals, scroll-triggered fades on nearly every block, a cursor-tracking spotlight on six cards, a scroll progress bar, a scaling progress line, directional button fills, and an infinite pulsing dot.

For a studio selling to regulated businesses, where accessibility is frequently a procurement question, this is worth fixing on principle as much as on merit. One media query disabling transitions and the pulse animation covers it.

### 2.6 No `<main>` landmark and no skip link

Neither is present. Both are cheap. Heading order itself is clean (single h1, correct h2/h3 nesting), so this is the only structural gap.

---

## Tier 3: performance and polish

### 3.1 The image payload is roughly 14MB

| File | Size | Natural | Displayed |
|---|---|---|---|
| `sable-atmospheric.png` | **5.4MB** | 2048x2048 | 449x299 |
| `terracotta-and-near-black-mark-01.png` | **3.6MB** | 2504x1876 | 839x524 |
| `3d-mark-animation.mp4` | 2.6MB | video | 998x1025 |
| `art-by-ayesha-johar-cs-01.png` | **2.2MB** | 1664x928 | 449x299 |
| `puremed-hero-consultation.webp` | 52KB | 1537x1023 | 449x299 |

The PureMed asset shows what the others should be: 52KB of WebP doing the same job as a 5.4MB PNG. The built `dist` is 16MB.

None of the four images has `loading="lazy"`, `width`/`height` attributes, or a `srcset`. So all four load eagerly at full resolution, and the missing intrinsic dimensions mean layout shift as each arrives.

This matters more than usual because the copy sells "a website built as a fast, static site". The site is currently the counter-example to its own pitch.

**Fix:** convert to WebP at roughly 2x display size, add `loading="lazy"` to everything below the fold, add explicit `width`/`height`. Astro's `<Image />` component does all three and is already available.

### 3.2 Work thumbnails read as black holes on the way in

`.reveal .work-thumb-inner` fades over 1.1s with a 0.3s delay, so a thumbnail takes 1.4s to reach full opacity, over a near-black card background (`#0E0D0B`). Scrolling at normal speed, the three case study images are solid black rectangles for well over a second. I caught this in screenshots twice before realising the images were fine.

Shorten to roughly 0.5s with no delay, or fade from a mid-tone rather than from the card's near-black.

### 3.3 The form failure path fires a browser `alert()`

`index.astro:1129` and `:1134`. A native modal dialog is jarring on a page this considered, it cannot be styled, and its copy ("emailing us directly") breaks the voice besides. Render the failure inline, mirroring the existing `#form-success` block, which is already well designed.

While there: the success state has no `role="status"`, so screen readers are not told the submission worked.

### 3.4 Three scroll listeners, one forcing layout on every frame

`index.astro` registers three separate `scroll` handlers (progress bar, nav colour, system line). The nav handler does this per event:

```js
nav.style.pointerEvents = 'none';
const el = document.elementFromPoint(...);
nav.style.pointerEvents = '';
```

That is a style write, a forced synchronous layout, and a second style write on every scroll event. It is the likely cause of the nav flicker visible mid-scroll, where the bar briefly renders in a translucent half-state over a light section.

Consolidate into one `requestAnimationFrame`-throttled handler, and replace the hit-testing with an IntersectionObserver on the `[data-nav-dark]` sections. That observer pattern is already in the file for `.reveal`.

### 3.5 Smaller items

- **`html { scroll-behavior: smooth }` is unconditional.** It should be inside the reduced-motion guard, and it also makes programmatic `scrollTo` unreliable.
- **`.mss-hero-video-wrap` uses `45vh` on mobile** while the section correctly uses `min-h-[100dvh]`. Mixing `vh` and `dvh` reintroduces exactly the mobile jump `dvh` was chosen to avoid. Use `45dvh`.
- **"Or email hello@..." has mismatched type sizes**: the paragraph is `0.8125rem`, the link inside it is `1rem`. It reads as a mistake on the baseline.
- **The contact section repeats itself**: label "08 · Start a project", then h2 "Start a project.", directly beneath. One of them can go.
- **"Start a project" appears five times** on the page (nav, hero, work, contact heading, footer). Frequent CTAs are fine, identical wording five times is flat. Vary at least the hero and the work one.
- **No `<noscript>` fallback.** Given 0.2, the page without JS is a nav, a footer and a lot of parchment.
- **`prefers-color-scheme` is unhandled.** Not necessarily wrong for a fixed-palette brand site, but worth a deliberate decision rather than a default.

---

## Suggested order of work

1. **Tier 0.1** (the margin reset). One line. Unblocks the entire intended layout, so do it before judging anything else visually.
2. **Tier 0.2 and 0.3** (fonts, hero reveal, faststart). The hero is the whole first impression.
3. **Tier 2.1, 2.2, 2.3, 2.4** (contrast, inert, focus-visible, select chevron). Cheap, and directly relevant to the regulated-sector pitch.
4. **Tier 3.1** (images). Also cheap with Astro's `<Image />`, and closes the gap between what the copy claims and what the site does.
5. **Tier 1** (coherence). Once the layout is actually rendering, re-review 1.1 through 1.9 against the real thing rather than against the broken one.

Tier 1.5 (the Work dead end) is the one with a content dependency rather than a code fix, so it is worth starting the case study in parallel.

---

---

## Implementation record, 5 Aug 2026

Tier 0 and Tier 2 are done. Build passes, verified in-browser against the production build via `astro preview`.

### Correction to finding 0.2

**The 4.26s first-contentful-paint number was wrong, and I should flag that plainly.**

The browser tab used for this review was running with `visibilityState: hidden` and `hasFocus: false`. Chrome defers rendering and fully suspends `requestAnimationFrame` in hidden tabs. Proof: a bare control page (one `<h1>`, no fonts, no video, no JS bundle) served from the same origin reported **zero paint entries at all** after three seconds, and an instrumented `requestAnimationFrame` loop on the real page fired **zero callbacks in four seconds**.

So both the "FCP 4260ms" figure and the "hero blank for four seconds" screenshots were artifacts of the measurement environment. Real-user paint timing was never actually measured here, and nothing in this document should be read as evidence that the live site is slow to paint.

What was genuinely true, and what the fix addresses:

- The hero's readability depended on JS loading **and** `requestAnimationFrame` actually running. The hidden-tab case proves that dependency is real and can fail, and a background tab (cmd-click, restored session) is an ordinary way for a visitor to arrive.
- The Google Fonts stylesheet was a genuine render-blocking third-party dependency, and zero `fonts.gstatic.com` requests ever completed in this environment.
- The mp4 fast-start defect was verified from the file's atom order, independent of any browser timing.

### Changes made

**Tier 0.1, the margin reset.** Removed `margin: 0` from the scoped universal reset in `index.astro`, leaving `box-sizing` in place, with a comment explaining why it must not come back. Tailwind Preflight handles margins in `@layer base` where utilities can override it.

Verified: `mx-auto` → `margin-left: 164px` (was 0), `mb-16` → `64px`, `mb-8` → `32px`, `mb-4` → `16px`.

**Tier 0.2, fonts and the hero reveal.**
- Self-hosted both families. Downloaded latin and latin-ext woff2 subsets to `public/fonts/` (8 files, 200KB total, ~103KB actually loading for English). Cut the variant list from 9 to the 4 weights the page uses. `@font-face` rules live in `src/styles/global.css`; the three above-the-fold files are preloaded. Verified: 4 woff2 fetched, **0 requests to googleapis or gstatic**.
- Replaced the JS-toggled hero reveal with a pure CSS animation (`@keyframes lineRise`, `animation-fill-mode: both`). The nine inline `transition-delay` values became `animation-delay`. The `lines-ready` class and its double-`requestAnimationFrame` block are gone entirely.
- Added a `.js-anim` class set on `<html>` by a small inline head script before first paint. Every remaining animation (`.reveal`, work thumbnails, `#mss-thumb-img`, hero video opacity) is now gated on it, so with JS absent the page renders fully visible instead of at `opacity: 0`.

Verified: the hero renders complete in a hidden tab where `requestAnimationFrame` never fires, which is exactly the case that used to leave it blank.

**Tier 0.3, the hero video.** Remuxed with `ffmpeg -c copy -movflags +faststart`; atom order is now `ftyp, moov, free, mdat` (was `ftyp, uuid, free, mdat, moov`). Added a 15KB WebP poster frame extracted from frame 0, plus `preload="metadata"` and intrinsic `width`/`height`. The hero's right-hand 52% now shows the poster immediately rather than empty parchment.

**Tier 2.1, contrast.** All measured against WCAG AA:

| Change | Before | After |
|---|---|---|
| `--muted` `#6B655D` → `#5F5952` | 4.41 on `#EAE0D0` | **5.29** (6.04 on parchment) |
| `.slabel` terracotta → ember on light backgrounds | 3.39 / 2.97 | **5.86 / 5.13** |
| `.slabel` on near-black keeps terracotta | 4.58 | unchanged, passes |
| `.flabel` `rgba(28,23,18,0.4)` → `var(--muted)` | 2.41 | **5.29** |
| `.finput::placeholder` 0.24 → 0.62 | 1.64 | **4.53** |
| Footer links 0.32 → 0.72 | 2.69 | **8.53** |
| Footer email 0.24 → 0.72 | 2.06 | **8.53** |
| Footer copyright 0.16 → 0.6 | 1.58 | **6.28** |
| Form error text terracotta → ember | 2.97 | **5.13** |

**Tier 2.2, mobile menu.** Added the `inert` attribute while closed and wired it through a new `setMenu(open)` helper that replaced the duplicated open/close logic. Escape now closes the menu and returns focus to the toggle.

**Tier 2.3, focus visibility.** Added a `:focus-visible` rule using ember with `outline-offset: 3px`, switching to blush on dark surfaces. `.btn-fill` gets `outline-offset: 4px` so its `overflow: hidden` cannot clip the ring. Footer links moved from inline `onmouseover` handlers to a `.footer-link` class that responds to focus as well as hover.

**Tier 2.4, the select.** Added an inline-SVG chevron, `padding-right`, and `cursor: pointer`, so it no longer reads as a text input.

**Tier 2.5, reduced motion.** Added a `prefers-reduced-motion: reduce` block that neutralises the line reveal, scroll reveals, thumbnail fades, spotlight, directional button fill, progress line, pulse dot, image hover scale and smooth scrolling. Content lands in its final state rather than mid-transition, and `.btn-fill` gets a plain colour change on hover so the CTA still gives feedback.

**Tier 2.6, landmarks.** Wrapped the page in `<main id="main">` and added a skip link that appears on focus.

**Also done (small, in the same spirit).** Form fields now carry `aria-describedby` pointing at their error text, errors carry `role="alert"` and `aria-invalid`, the success block carries `role="status"`, and a failed submit moves focus to the first invalid field.

**Tier 3.1, the image payload.** Moved the four case study images out of `public/assets/` into `src/assets/` so Astro's pipeline can process them, and replaced every raw `<img>` with `<Image />` from `astro:assets`. Each now emits WebP, a responsive `srcset`, a `sizes` hint matching the real layout, `loading="lazy"`, `decoding="async"` and intrinsic `width`/`height`.

The `sizes` values are derived from the actual grid, not guessed: the featured card is 3fr of a 3fr/2fr split inside a 1400px container (840px), and each secondary card is (1400 - 48) / 3 = 450px. The fallback `src` is capped at those widths so the build does not carry a full-resolution variant that almost nothing requests.

| | Before | After |
|---|---|---|
| `sable-atmospheric` | 5.4MB PNG, 2048x2048 | WebP srcset, 2KB to 10KB |
| `terracotta-and-near-black-mark-01` | 3.6MB PNG, 2504x1876 | WebP srcset, 6KB to 38KB |
| `art-by-ayesha-johar-cs-01` | 2.2MB PNG, 1664x928 | WebP srcset, 27KB to 64KB |
| `puremed-hero-consultation` | 52KB WebP | WebP srcset, 9KB to 21KB |
| All generated variants in the build | n/a | **332KB total** |
| **Actual page load at 1920px** | ~11.3MB of images | **148KB**, poster included |
| `dist/` | 16MB | **3.7MB** (2.6MB of that is the video) |

Verified in the browser: all four images load, and the browser selects the 450w variants for the 449px thumbnails and the 840w variant for the 839px feature, which is the srcset behaving correctly.

The video stays in `public/assets/` because Astro's image pipeline does not process video, and the poster stays alongside it because a `poster` attribute needs a plain URL.

**Tier 1, coherence.** All nine, to Osman's decisions.

- **1.1 Voice.** Studio voice throughout. The contact section, the project field label and the success message moved off first-person singular. "If I think we can help" was the sharpest case: one sentence containing both "I" and "we". Third-person descriptions of the founder in the track-record section are untouched, because those are consistent with studio voice rather than in conflict with it.
- **1.2 Numbering dropped.** All six section labels lose their numbers, which removes the "starts at 02" problem entirely rather than renumbering around it.
- **1.3 Heading structure varied.** Six sections, six different shapes, each commented in the source so the variety survives the next edit: two short sentences with the accent on the second (The gap); one continuous sentence with no accent at all (Track record); one flowing block with the accent inline (What we do); two words and a full stop, the shortest on the page and set largest (How it works); one short line with the accent on the last two words (Work); one plain line, no accent (Contact). Every hard `<br>` is gone, replaced with `max-width` in `ch` plus `text-wrap: balance`, so the breaks now respond to width instead of being authored for one viewport.
- **1.4 Section 06 folded into 05.** "The promise" is deleted. Its one distinct line, "The system does the labour. You keep the moment.", survives as a display-type closing beat at the end of How it works, where the argument was already being made.
- **1.5 and 1.6 Work section.** Rebuilt around a single case study. MSS, Sable and Art by Ayesha Johar are removed. PureMed is the feature, and the entire card is now an `<a>` to a real page, so the cursor-spotlight hover finally points at something. The dead "See the work" CTA is gone. Supporting copy states plainly that others will appear when there is something worth showing, which is more credible than three cards captioned "coming soon".
- **1.7 Presence row.** The three-equal-card row (measuring 347 / 452 / 222px) is gone. Presence Monthly now carries the weight in a 1.55fr column at a larger heading size, Launch sits alongside at lower volume behind a left border, and Campaign is a single line beneath Monthly, because the copy already said it is a variant of Monthly. Dividers and negative space, no boxes, which also removes the misleading spotlight hover from non-interactive elements.
- **1.8 Wayfinding.** The track-record section is now in the nav (desktop and mobile), and active-section highlighting is in via a second IntersectionObserver reusing the pattern already in the file. Its `rootMargin` collapses the viewport to a thin band across the middle so exactly one section qualifies at a time; verified live as exactly one active link. The active state holds the hover underline open and shifts the link to ember, and a second observer clears it above the first tracked section so nothing is marked while the hero is in view.

**New page: the PureMed case study** at `src/pages/work/puremed.astro`, route `/work/puremed`.

Written to the studio's own case-study checklist: client and context, the challenge, a one-sentence strategic insight, what was built, outcomes, and an honest reflection. Per the checklist rule that a case study takes the client's design voice rather than MSS's, it is built in PureMed's locked palette (navy `#23476A`, champagne gold `#C6A77D`, white and warm white), bright and airy, with no dark sections and no parchment or terracotta anywhere except the link back to MSS.

Contrast was checked against that palette before building: navy on white is 9.63:1, and champagne gold on white is only 2.28:1, so gold appears solely as rules, numerals and marks and never as body text, which happens to match the clinic's own brand rule.

Two honest departures are recorded in the page source. PureMed's body font is Inter; this page sets Plus Jakarta Sans, which the project's own constraints doc names as the preferred alternative, rather than loading a third family for one page. And the clinic's 704 image assets are all AI-generated, so the page uses only the single photograph already on the site rather than introducing more synthetic imagery of a real person; the design system is shown through CSS-rendered palette and type specimens instead.

Every factual claim traces to `02_clients/puremed/`: the 23/100 CRO audit score, the clean-slate rebuild, the eight-to-thirteen page expansion and why, Laser Lift as the lead treatment, the palette correction away from a too-dark primary, and the three open launch blockers.

**Two discrepancies surfaced by this work, both still open:**

1. The site said PureMed was **"Delivered"**. The decisions log says otherwise: a booking-URL conflict marked "Blocks launch", unconfirmed DNS access, and analytics not yet installed. Now stated as "Built, awaiting go-live" on the card and given a full honest section on the case study page.
2. `02_clients/puremed/CLAUDE.md` opens with *"Standalone personal project. Not an MSS client engagement."* The case study presents it as client work, per Osman's decision. **That file should be corrected to match, or the framing revisited.** It has been left untouched here because it is another project's canon.

### Files touched

- `site/src/pages/index.astro`
- `site/src/pages/work/puremed.astro` (new: the PureMed case study)
- `site/src/styles/global.css` (`@font-face` rules added)
- `site/src/assets/` (new: the four case study images, moved from `public/assets/`). The MSS, Sable and Ayesha images are no longer imported anywhere after the Work section rebuild. The files are left in place in case they are wanted for future case studies.
- `site/public/fonts/` (new, 8 woff2)
- `site/public/assets/3d-mark-animation.mp4` (remuxed in place)
- `site/public/assets/hero-mark-poster.webp` (new)

Note: the four images moved from `public/assets/` to `src/assets/`. Anything else referencing `/assets/<name>.png` by URL will 404 and needs updating to an import.

### Not done

Rest of Tier 3: the work-thumbnail fade is still 1.4s over a near-black card (3.2), the form failure path still fires a browser `alert()` (3.3), there are still three separate scroll listeners with one forcing layout every event (3.4), and the small polish list in 3.5 is untouched.

---

## Case study page review, 6 Aug 2026

Re-reviewed `/work/puremed` in the browser at 1920px against
`.claude/mss-new-case-study-checklist.md`. The preview feedback from the previous
session was never written down, so this is a fresh review rather than a record of it.

**One finding is fixed in this session (C1). The rest are open and need a decision.**

### C1 The page never shows the work. FIXED

Measured: 757 words, **one image, zero video, one outbound link**, over a 6704px page.
The single image is a photograph of the practitioner. The only other visuals are six
colour swatches and a type specimen.

So a web case study, whose subject is thirteen pages of built website and the system
around it, showed none of the website and none of the system. Two claims in "What was
built" were assertions with nothing behind them: claims checked before sign-off
(decision 03) and a site the clinic can change herself (decision 05).

Fixed by the new "The tooling" section. See the implementation record below.

### C2 There is no framing page

The checklist is explicit: "Every case study has two parts: a framing page and a full
case study page." Only the full page exists. The homepage work card links straight to
it, so the invitation the framing page is supposed to provide is doing no work at all.

Either build the framing page or amend the checklist to drop it. It has been ignored
once already, which usually means the checklist is wrong rather than the build.

### C3 The case study folder does not exist

The checklist puts curated material at `01_mss/portfolio/[client]/`. There is a
`portfolio/mss/`, a `portfolio/sable/` and a `portfolio/apex-fc/`, but no
`portfolio/puremed/`. The page was built straight into the site with nothing curated
behind it.

### C4 Still no screenshots of the actual site

Checklist Phase 4 wants screenshots of the live site or prototype, the brand mark in
context, and one or two key design moments. The tooling clips added today cover the
system. They do not cover the thing that was actually sold, which is thirteen pages of
website. `02_clients/puremed/site/dist` exists and can be captured the same way the
clips were.

### C5 The page is one narrow column for most of its length

Every text block runs 576px to 762px inside a 1120px wrap, so roughly a third of the
measure sits empty down the whole page, and the eye never gets a change of rhythm. The
swatch row was the only full-width element before today; the tooling section is now the
second. Worth a deliberate pass rather than leaving it to the two sections that happen
to break out.

### C6 `02_clients/puremed/CLAUDE.md` still contradicts the page

Carried over, unchanged from 5 Aug. That file opens "Standalone personal project. Not
an MSS client engagement." The case study presents it as client work. One of the two is
wrong and it is not a documentation nicety: it is whether this page can be published.

---

## Implementation record, 6 Aug 2026

### New section: "The tooling"

Sits between "What was built" and the palette section, which is renamed from
"The system" to "The design system" now that there are two systems on the page.

Two screen recordings, click-to-play:

| Clip | Length | What it shows |
|---|---|---|
| Pipeline | 14s | `content-state.js`, `content-lint.js` and `content-preview.js` running against PureMed. The lint warns on a prescription-only-medicine topic and errors on a post with no copy |
| Review gate | 24s | The generated preview page: five real posts, designed carousel slides, both captions, the scheduled date |

Both are captures of the real tools, run on 6 Aug 2026 against
`02_clients/puremed/`. The terminal clip replays verbatim stdout, typed back at
readable speed; nothing in it was written for the recording. The review clip is the
actual generated preview page with PureMed's own posts. The page says so in a note
under the clips, because a case study that claims evidence should say where the
evidence came from.

**Loading.** `preload="none"` plus a WebP poster, click-to-play, native controls
handed over on first press. The two clips total 1.3MB and none of it loads unless
someone asks for it, which is the only defensible choice on a page that argues for a
fast static site. A second observer pauses a clip when it scrolls out of view so two
cannot run at once behind the reader.

**Play control.** A labelled pill in the bottom-left, not a centred circle. The
centred version sat directly on top of the lint warning, which is the one line in the
first poster worth reading before you press anything.

**The dark terminal.** This brand excludes black and the page holds that rule on every
surface. The clip is a recording of a developer tool rather than a brand surface, so it
stays as captured and sits inside a light frame. Noted in the source.

### Reproducibility

`site/../tools/clips/` now holds the recorder scripts, the terminal replay page and a
README covering capture, encoding and where files go. Playwright is taken from
`~/workspace/scripts/node_modules`. Build passes; `dist` is 5.9MB, of which 3.9MB is
video that only loads on demand.

---

## Second pass, 6 Aug 2026

Four things you asked for after previewing the tooling section.

### The pipeline clip was unreadable. Recut

The first cut linted the whole content directory in one command, which pulled in
`2099-01-01-finishing-proof`. That is a test fixture with no `copy.md`, so the run
ended on a red `ERROR` that had nothing to do with the client and read as a broken
tool rather than a working check.

Recut, and it is now 26s rather than 14s:

- Lints the real August posts one at a time with `--post`, a supported flag. One
  passes clean in green, the next raises the prescription-only-medicine warning in
  amber. Clean, then not clean, which is the whole point.
- Every command now carries a narration line above the terminal saying what it is
  for in plain English. The raw stdout never explained itself.
- The test fixture is gone from the linting, though it still appears in the honest
  `--list` output at the top.

### C4 closed: the built site is now on the page

New "What shipped" section between "What was built" and "The tooling": a full-width
Home shot, a four-across grid of eight treatment pages, and the two phone layouts.
Captured from `02_clients/puremed/web/` by `tools/clips/shoot-site.js`.

> **Superseded the same day.** `web/` is not the site that ships. See the third pass
> below: these shots were replaced with captures of the two-page Astro build.

Note for anyone repeating this: the pages reference `assets/web/...` as a sibling
path while the assets live one level up, so the first pass rendered every image as
alt text. Fixed with a `web/assets` symlink to `../assets`, which is also what the
pages need in order to open correctly at all.

### Stage is recorded, and it is the strongest clip on the site

42s, signed in, on the live PureMed engagement. It walks the built pages in desktop
and phone layouts, then opens the per-element copy panel showing `Approve as
written` / `I've made changes` / `Flag for discussion` against a "95 of 95 reviewed"
counter, then the image placement wizard.

**It is strictly read-only.** It opens panels, which display the decision already
saved, and never clicks a decision, Approve all, Sign off, or Done with images.
`stage-record.js` carries a `FORBIDDEN` regex and a `safeClick` wrapper that throws
rather than clicking any of them. Verified by hand first: the reviewed count was
unchanged after opening a panel.

The session token written by `stage-auth.js` has been deleted, and `stage-state.json`
is gitignored.

### The clips are on the homepage too

Both the Stage clip and the pipeline clip now sit inside "How it works", under the
label "Both of those, running". That section already claimed a review gate and an
automated production side and had nothing behind either claim. Stage's own UI is
parchment-toned, so it reads correctly on the near-black section without restyling.

The case study now runs three clips: pipeline, the site gate, and the monthly
content gate.

### Two things surfaced, both needing your call

1. **The reviews list shows more than one client.** Signed in for the recording,
   `/reviews` listed `FightStar Championship — Social Content (July 2026)` above the
   PureMed engagements. If that was your own account, fine, and the clip simply
   starts at `/review/puremed` to avoid showing it. If a client account can see that
   list, it is a cross-client visibility problem and worth checking before more
   clients are onboarded.
2. **The page claims 13 pages shipped. I can find 10.** `web/` holds Home,
   Treatments, seven treatment pages and a Sculptra landing page. The Treatments
   page itself says "11 specialist treatments". `puremed-treatment-bricks-ready.html`
   looks like a build artifact rather than a page, and the two `sculptra` folders are
   duplicates. I have left the "13 pages" figure in the hero alone because correcting
   a factual claim on a client case study is your call, but it does not currently
   reconcile.

### Open, needs your call

- **C2 to C6 above.**
- **Em dashes in the pipeline clip.** `content-lint.js` prints em dashes as separators,
  so they appear in the captured terminal output. Editing them out would falsify a
  recording, so they stand. The real fix is to change the separator in
  `content-lint.js` and re-record, which is a change to another project's tooling and
  not mine to make unasked. Still true after the recut.
- ~~**Stage itself was not recorded.**~~ Done 6 Aug, see the second pass above.

---

## Third pass, 6 Aug 2026: PureMed promoted to a client, case study re-based on the go-live site

Two instructions from Osman, both of which closed open items above.

### PureMed is now an MSS client engagement

Moved out of `other-projects/` and into the Studio client folder, per the stream
separation rule in `main-stage-studio/CLAUDE.md`:

| Was | Now |
|-----|-----|
| `other-projects/puremed/` | `main-stage-studio/02_clients/puremed/` |
| `other-projects/puremed-publish/` | `main-stage-studio/02_clients/puremed-publish/` |

PureMed keeps its own git repo (`osmanakhtar/puremed-aesthetics`) with its own deploy
workflows, so both directories are gitignored by the Studio repo, the same convention
the workspace repo already uses for `main-stage-studio/` itself. `puremed-publish` is a
worktree of that repo, not a copy: it was repaired with `git worktree repair` after the
move and both entries resolve. The stale gitlink for it in the workspace index was
removed, and the now-pointless `other-projects/puremed/` ignore line dropped.

Path references were rewritten across both repos: `scripts/content-clients.json`,
and the defaults in `scripts/stage-autotag.js`, `scripts/mss-loop2.js` and
`scripts/mss-review.js`, plus SOPs, plan docs and the clips tooling.

**C6 closed.** `02_clients/puremed/CLAUDE.md` no longer says "Standalone personal
project. Not an MSS client engagement." It now records the promotion and its date, and
carries a new "What actually ships" section, written because the ambiguity it leaves is
exactly what produced the error below.

### The "13 pages" question is answered, and the answer was no

The second pass flagged that the hero claimed 13 pages when only 10 files exist in
`web/`. Both numbers were wrong. The site going live is the Astro build in `site/`:
**two pages.** Home, and one Treatments page carrying eleven anchored treatment
sections that the nav deep-links into. That is also the version Nafisa reviewed element
by element on Stage, which is the version that counts.

`web/` holds ten standalone HTML prototypes, six of them per-treatment pages that were
explored and dropped. The first pass of "What shipped" shot those and presented them as
delivered work. Corrected:

| Claim | Was | Now |
|-------|-----|-----|
| Shipped fact, hero | "13 pages" | "2 pages, 11 treatments" |
| Decision 02 | "A page per treatment... became thirteen, one dedicated page and URL per treatment" | "One page, a section each", with the anchor and deep-link reasoning |
| Decision 04 | "rather than thirteen equal ones" | "rather than eleven equal ones" |
| "What shipped" headline | "A page for every treatment, not a menu." | "Two pages. Eleven treatments. No menu." |
| Reflection | "Expanding from eight pages to thirteen mid-build" | Standalone pages built for six treatments before consolidating, which should have been a week-one decision |
| Screenshots | 8 pages from `web/` + 2 mobile | Home, Treatments, all 11 treatment sections, both pages on mobile |

`tools/clips/shoot-site.js` was rewritten to shoot `site/dist` rather than `web/`: it
serves the Astro build, captures both pages at 1440 and at phone width, and takes an
element shot of each `section.tx-section` by the id the nav links to. Rebuild the site
before shooting, or the shots are of whatever `dist/` was last left at.

### Still not reconciled, and still your call

The treatments hero states **"6 Specialist Treatments"** while the page carries eleven
sections and the nav dropdown lists six. That is the client's own copy on the live-bound
site, not case-study copy, so it is left alone here, but one of those three numbers is
wrong and a visitor can count them.

---

## Resume prompt

> Read `01_mss/website/mss-site-ux-review.md`, including the second pass of 6 Aug and the third. Done: homepage Tier 0/1/2/3.1; the PureMed case study at `site/src/pages/work/puremed.astro` with a "What shipped" screenshot section and a "The tooling" section carrying three clips (pipeline, the Stage site gate, the monthly content gate); the Stage and pipeline clips also on the homepage inside "How it works". Recorder scripts, the read-only Stage capture rules and a README are at `01_mss/website/tools/clips/`. PureMed is now an MSS client at `02_clients/puremed/`, and the case study has been re-based on the go-live site (two pages: Home plus one Treatments page with eleven anchored sections), which closed C4 properly, closed C6, and answered the "13 pages" question. Open work, in order: whether a client account can see other clients in `/reviews`; whether the treatments hero's "6 Specialist Treatments" should read eleven; then case study review C2, C3, C5 (no framing page, no `portfolio/puremed/` folder, and the page still runs as one narrow column outside the three full-width sections); then the rest of homepage Tier 3 (work-thumbnail fade at 1.4s over a near-black card, the `alert()` failure path, and three scroll listeners that should be one rAF-throttled handler).
