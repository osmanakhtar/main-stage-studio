---
status: proposal
owner: osman
updated: 2026-10-16
next: Osman picks the concept (section 2) and answers the open calls (section 7); then build the gaps in section 5
blocked_on: Osman
---

# MSS v6 launch: visual asset plan

The social launch of "Run the show" (v6, live on the site since 13 Oct 2026), posted through the MSS edition of Content Studio. Built mainly from assets we already have. No Higgsfield subscription; at most about £35 of pay-per-use generation (the 12 Oct budget line).

## 1. Brief

- **Job:** tell owner-led and regulated firms that MSS is now a product studio with seven priced products, and prove it with real work.
- **Channels:** LinkedIn (personal profile leads, company page mirrors) is where people convert. Instagram is where people see the brand and the portfolio.
- **Constraints:** v6 identity A (Stage Black, House Lights, Tungsten as the one accent, Cue Red for dots and fills only, Archivo and Geist Mono). Timely hooks are never a countdown or a discount (`brands/mss/pillars.json`). Demo work is called a demo. Every price or count goes through `make figures`.
- **What we have:** the hero film "Source to stage" (16:10, plus a 4:5 cut at 800×1000), nine product and proof cue films (all 16:10, 1600×1000), four tool loops (16:9), the sting (16:10, 1:1, 9:16), and graded founder portraits (mono 4:5, colour 1:1).
- **What's missing:** no product film exists in a vertical format. That is the biggest production gap.

## 2. Concepts (scored)

Scores out of 10. Strategy is fit with v6 and the buyer, Distinctive is whether another studio could run the same idea, and Craft is whether we can build it at this budget with these assets.

| | Concept | Idea | Strategy | Distinctive | Craft | Overall |
|---|---|---|---|---|---|---|
| A | **Opening Night** | Run the launch as a theatre opening: an overture of teasers, then opening night, then a programme of the seven products. It doubles as a live demo of the Opening Night product. | 8 | 6 | 8 | 7.3 |
| B | **The Cue Sheet** | The feed is a stage manager's cue sheet. Every post carries a Geist Mono cue number and name ("CUE 07 · CONTENT") and a Cue Red dot. Running the show means calling cues on time, and the feed calls them. | 9 | 8 | 9 | 8.7 |
| C | **House Lights Up** | Each post brings the house lights up on how something was made: the review gate, the sign-off, the client editing their own site. The theatre shows its backstage. | 9 | 7 | 7 | 7.7 |

**Recommendation: B as the system, C as the stance.**

- The Cue Sheet gives every post the same frame at almost no cost. The cue number, product name and dot are code-rendered.
- It extends naming the brand already owns: the cue films, the sting and the Spike.
- It works past launch week. A feed with cue numbers has no natural end, so it carries on into the normal 8 + 8 monthly rhythm.
- House Lights Up decides what goes inside each cue: show the workings and never just claim them, which is the Process transparency pillar.
- From A we keep only the phrase "Opening Night", and only if the launch is used to sell that product.

**Reference check:** numbered running orders are common in editorial design. What makes ours distinctive is tying the numbers to real stage-management vocabulary, which matches the brand language, rather than the numbering itself. Before any copy is final it goes through the `copywriting` skill and the `copy-reviewer` agent.

## 3. Aspect ratio rules

Design each master once, at the largest canvas it needs. Every other format is cut from the master, never stretched.

| Placement | Ratio | Pixels | Safe zone and notes |
|---|---|---|---|
| Instagram Reel | 9:16 | 1080×1920 | Keep type and faces inside the central 1080×1420. Leave about 250 px clear at the top, about 420 px at the bottom (caption and buttons) and about 120 px on the right (action rail). The grid shows a centred 3:4 crop, so the cover frame's title must sit in the middle. |
| Instagram feed image or carousel | 4:5 | 1080×1350 | The profile grid crops to 3:4 (1012×1350), so keep about 34 px clear on each side. All slides in a carousel share one ratio. |
| Instagram Story | 9:16 | 1080×1920 | Leave about 250 px clear at the top and bottom. A link sticker goes in the lower third. |
| Instagram highlight cover | 9:16 canvas | 1080×1920 | The icon goes in the central circle, about 600 px across. |
| Instagram avatar | 1:1, shown as a circle | 320×320 minimum (make it 1080) | The Spike mark only, no wordmark. |
| LinkedIn feed image | 4:5 | 1080×1350 | Takes the most height on mobile. Use 1:1 (1080×1080) only when a design needs it. |
| LinkedIn native video | 4:5 (or 1:1) | 1080×1350 | Vertical 9:16 plays in LinkedIn's video feed but is cropped in the main feed, so 4:5 is the safer master here. Burn in captions, because most people watch without sound. |
| LinkedIn document (PDF carousel) | 4:5 | 1080×1350 | The same slides as the Instagram carousel, exported to PDF. |
| LinkedIn personal banner | 4:1 | 1584×396 | The avatar covers the bottom left on mobile, so keep the left 30% plain. |
| LinkedIn company cover | about 5.9:1 | 1128×191 | Keep the type in the centre band. |
| LinkedIn avatar and logo | 1:1 | 400×400 | |

**Rules for existing landscape films (16:10 and 16:9):**

1. **Stage frame (fast, no re-render).** Place the 16:10 film full width in a vertical canvas: at 1080 wide it is 675 px tall. The cue number and title go above it and a caption bar goes below, all on Stage Black. In 9:16 the film sits in the middle third. In 4:5 the type goes above and the film fills the lower part.
2. **Punch-in reframe (for screen demos).** Use Content Studio's `screen-demo-punch` template to follow the action at 9:16. This works for UI recordings and badly for films with wide type.
3. **True vertical re-render (best, slowest).** Give a film its own portrait layout in `cue/engine.js`, as the hero already has for 4:5. Only do this for the films that perform.

**AI atmosphere images:** generate them at 9:16 (or 2:3) with the subject centred. One image then gives a 9:16 cut, a 4:5 cut and a 1:1 cut without regenerating.

## 4. Asset list

**Status key:** **Have** means usable as it is. **Edit** means it exists but needs reframing or a re-render. **New** means it has to be made.

**Source key:**
- **Film** = `01_mss/website/tools/clips/out-v6/`
- **Code** = code-rendered (Playwright and ffmpeg, v6 tokens)
- **CS** = Content Studio MSS edition
- **Rec** = new screen recording with `clip-kit.js`
- **Cam** = Osman's own footage
- **AI** = pay-per-use generation

### 4.0 Profile set (live before Cue 01)

| # | Asset | Format | Source | Status |
|---|---|---|---|---|
| P1 | Instagram avatar: the Spike mark on Stage Black | 1:1, 1080 | Code from `brand/mark/` | New |
| P2 | LinkedIn personal banner: "Run the show" and the seven product names in Geist Mono, left 30% plain | 1584×396 | Code | New |
| P3 | LinkedIn company cover and logo | 1128×191, 400×400 | Code | New |
| P4 | Instagram highlight covers: Work, Products, How, Prices (a Cue Red dot and a mono label on each) | 9:16 | Code | New |
| P5 | Sting end card in 4:5 (brand.json currently maps 4:5 to the 1:1 sting) | 4:5, 1080×1350 | Film (re-render) | Edit |

### 4.1 Launch week

| Cue | Post | Instagram | LinkedIn | Source | Status |
|---|---|---|---|---|---|
| 01 | **Source to stage.** The hero film, captioned, ending on the sting. | Reel 9:16 | Native video 4:5 | Film: `render-hero-v2.js` needs a 9:16 layout, and the 4:5 needs a re-render at 1080×1350 (the current one is 800×1000) | Edit |
| 02 | **Who runs the show.** Founder intro: the mono portrait, then 4 type slides (career, mission, why products, the CTA). | Carousel 4:5, 5 slides | Image 4:5 plus a text post (personal profile) | `brand/founder/osman-mono-4x5.png` plus Code | Have (portrait) and New (slides) |
| 03 | **The programme.** Seven products with what each one is, how long it takes and its price. | Carousel 4:5, 9 slides (cover, 7 products, close) | Document PDF 4:5 | Code or CS Stage style; prices from the v6 proposal section 5 through `make figures` | New |
| 04 | **Proof: Ayesha.** Her cue film (painting into identity). | Reel 9:16, Stage frame | Native video 4:5, Stage frame | Film `ayesha-cue.mp4` (consent given 11 Oct) | Edit (frame) |
| S | Launch-day Story set: Cue 01 reshared plus a link sticker to the site | Story 9:16 ×3 | | CS | New |

### 4.2 Weeks 2 and 3: one product per cue, mixed with process and philosophy posts

| Cue | Post | Instagram | LinkedIn | Source | Status |
|---|---|---|---|---|---|
| 05 | Identity | Reel 9:16 | Video 4:5 | Film `identity-cue.mp4`, Stage frame | Edit |
| 06 | **House lights up: this post made itself.** A screen recording of Content Studio building this post. | Reel 9:16, punch-in | Video 4:5 | Rec (Content Studio MSS edition), CS `screen-demo-punch` template | New |
| 07 | Content (PureMed's own photos and brand) | Reel 9:16 | Video 4:5 | Film `content-cue.mp4`, Stage frame | Edit |
| 08 | Philosophy card: "Hand over the controls" | Image 4:5 | Image 4:5 plus a text post | Code type card on an AI atmosphere background | New |
| 09 | Website | Reel 9:16 | Video 4:5 | Film `website-cue.mp4`, Stage frame | Edit |
| 10 | Campaign | Reel 9:16 | Video 4:5 | Film `campaign-cue.mp4`, Stage frame | Edit |
| 11 | **House lights up: the review gate.** Nothing ships until someone signs it off. | Reel 9:16, punch-in | Video 4:5 | Film `pipeline.mp4` or a new recording | Edit |
| 12 | Philosophy card: "Prices on the page" | Image 4:5 | Image 4:5 plus a text post | Code plus AI background | New |
| 13 | Platform | Reel 9:16 | Video 4:5 | Film `platform-cue.mp4`, Stage frame | Edit |
| 14 | Care and Review (one post with two cues) | Carousel 4:5 (2 video slides) | Video 4:5 | Film `care-cue.mp4`, `review-cue.mp4` | Edit |
| 15 | (Optional) Founder hook on camera: "Why I publish my prices" | Reel 9:16 | Video 4:5 | Cam plus CS `hook-quick-cuts` | New (your call, see section 7) |

That makes 15 cues over three weeks plus the profile set. It is denser than the planned 8 + 8 a month at the start, then settles back to it.

## 5. Production gaps (the build list)

1. **Stage frame template:** one ffmpeg or CS reel template that takes any 16:10 film to 9:16 and 4:5, with the cue number, title, caption bar and sting. This unlocks cues 04, 05, 07, 09, 10, 13 and 14 in one build.
2. **Hero re-renders:** add a 9:16 layout to `render-hero-v2.js` and re-render the 4:5 cut at 1080×1350.
3. **Sting in 4:5:** re-render, then point `carousel-studio/brands/mss/brand.json` 4:5 at it.
4. **Code-rendered card kit:** avatar, banners, highlight covers, the cue-number overlay, the programme carousel and quote cards, all from `mss-v6-tokens.css`.
5. **AI atmosphere set:** about 6 images, generated at 9:16 with the subject centred. Prompt themes: an empty stage under one tungsten work light (a "ghost light"), a dark auditorium with house lights at 10%, a rigging silhouette, a cue light glowing red in the wings. No people. Pay per use through the Gemini API (Nano Banana), fal.ai or Replicate. Check current prices before running; the cap is £35.
6. **Screen recordings:** Content Studio building a post (Cue 06). Don't film Montage, Directory or Content Analysis, because they still contain FSC wording.

## 6. Production order

1. The card kit and the Stage frame template (no cost; unblocks 11 of the 15 cues).
2. Hero and sting re-renders.
3. The programme carousel copy, through the copywriting skill, the copy-reviewer agent and `make figures`.
4. The AI atmosphere set, then the quote cards.
5. Screen recording for Cue 06.
6. Install the MSS edition (`carousel-studio/dist/mss/`) to Applications and load the kit into it for posting.

## 7. Open calls for Osman

1. Concept: B with C (recommended), or A or C on its own.
2. On-camera founder content (Cue 15): the August social plan excluded talking heads. The 13 Oct founder-led framing and the portrait on /about point the other way. Include it or keep it out?
3. Clients that can be named: `brands/mss/pillars.json` still says PureMed is the only client that may be named. Ayesha has agreed to be shown, so update the pillars file before Cue 04.
4. Launch date for Cue 01.

**Resume prompt:** MSS v6 launch asset plan at `01_mss/marketing/mss-v6-launch-asset-plan.md`. Once Osman has answered section 7, build section 5, items 1 to 4.
