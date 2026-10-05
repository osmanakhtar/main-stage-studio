# PureMed Social Content Pattern (Instagram + Facebook)

*Created: 5 October 2026*
*Status: PLANNING. Input to the Studio build spec for form-driven, period-based content generation.*
*Builds on: the Vera POC (`01_mss/demo-clinic/vera/`), whose Studio config (pillars, campaign types, lint rules, compliance) was itself adapted from PureMed's. This plan extends that model rather than replacing it.*

---

## 0. The core idea

A repeatable pattern is four layers, and only the last one needs an LLM:

```
Campaign  (why, for how long, about what)
  -> Schedule (cadence x period = dated slots)
    -> Slot plan (each slot gets a pillar + content type + subject)   <- deterministic code
      -> Post   (copy, slides, script, captions per platform)          <- Claude or ChatGPT
        -> Lint -> Stage review -> publish
```

**Recommendation: keep planning deterministic and use the model only to write.** If the LLM decides the mix, two runs of the same form produce different plans, compliance weighting drifts, and swapping providers changes strategy rather than just wording. Code allocates slots from the form; the model fills one well-specified slot at a time. That is also what makes Claude and ChatGPT interchangeable (section 7).

---

## 1. Campaign architecture

PureMed runs on two layers at once.

### Layer 1: Always-on (the baseline rhythm)
Never switched off. The pillar mix at default weights, no specific service. This is Vera's `brand` campaign type. If nothing else is planned for a period, this is what generates.

### Layer 2: Overlay campaigns (2 to 6 weeks)
An overlay takes a share of slots (default 50%, adjustable) and the always-on mix fills the rest. Overlays never take 100%: a feed that only talks about one treatment for a month reads as a hard sell.

| Campaign type | Subjects | Length | Use for |
|---|---|---|---|
| `brand` | none | ongoing | The always-on baseline |
| `service` | one service | 3 to 4 weeks | Spotlight arc on one treatment (e.g. laser facelift): education, then experience, then results, then a soft CTA |
| `multi-service` | many | 2 to 4 weeks | Pathways and combinations ("what a skin plan over 3 months looks like") |
| `seasonal` | none | 2 to 4 weeks | Timing-led hook, never price-led |
| `location` | one location | 2 to 3 weeks | Local presence (Winslow microsite, any new clinic day or venue) |
| `launch` | one service | 2 weeks | New treatment or device: awareness, explainer, first-availability |

`location` and `launch` are new relative to Vera. Both are pure config (`campaign-types.json`) since the engine now keys off cardinality, not type names.

### Annual seasonal spine (UK aesthetics)
A default calendar the form can suggest from, so the operator is not starting blank each quarter:

| Months | Seasonal hook | Natural services |
|---|---|---|
| Jan to Feb | New-year reset, skin after winter | Skin health, consultation |
| Mar to Apr | Spring skin, sun-prep | Skincare, SPF education |
| May to Jun | Wedding and event season | Planning timelines ("book 8 to 12 weeks ahead"), skin health |
| Jul to Aug | Summer skin care, what to pause in the sun | Education-heavy, low offers |
| Sep to Oct | Autumn skin season, laser season opens | Laser, resurfacing, skin health |
| Nov to Dec | Party-season planning, gift vouchers | Timelines, vouchers (non-POM only) |

Laser and resurfacing content leans autumn and winter because sun exposure matters for many laser treatments. That timing is itself good educational content.

---

## 2. Content pillars

Keep the six-pillar model proven on Vera, reweighted for a real clinic. A real practitioner and real (consented) patients change what is possible.

| Pillar | Vera weight | PureMed weight | What changes for a real clinic |
|---|---|---|---|
| Education | 25 | 25 | Same. Lead with the reader's worry, not the service |
| Experience | 25 | 20 | Real clinic room and real visit, not stock-like b-roll |
| Practitioner | 17 | 20 | Nafisa on camera if she will film. The strongest trust lever available |
| Results | 17 | 15 | Consented imagery only; illustrative tag otherwise |
| Patient voice | 8 | 10 | Real reviews, quoted with consent (Google reviews are a ready source) |
| Offers / timing | 8 | 10 | Seasonal and availability-led, never discount-led on POM services |

Weights are defaults in `pillars.json`; the form can override them per run.

**Planner constraints** (enforced in code, not left to the model):
- No pillar twice in a row.
- Results: at most 1 per week.
- Offers: at most 1 per fortnight, never on a `pomSensitive` service.
- Every 7-day window holds at least one Education and one Practitioner or Experience post.

---

## 3. Content types

A content type is a template: a fixed structure the model fills. Each one defines its inputs, output shape, assets and compliance flags. This is what the Studio form selects from.

| ID | Content type | IG | FB | Structure | Asset need | Pillars it serves |
|---|---|---|---|---|---|---|
| `carousel-explainer` | Explainer carousel | Feed carousel 4:5 | Multi-image post | Hook slide, 3 to 6 point slides, CTA slide | Brand graphics, optional still | Education |
| `carousel-myth` | Myth vs fact | Feed carousel 4:5 | Multi-image post | Myth, why people believe it, the truth, CTA | Brand graphics | Education |
| `carousel-faq` | Questions to ask | Feed carousel 4:5 | Multi-image post | Question per slide, closing answer slide | Brand graphics | Education, Practitioner |
| `single-still` | Photo + line | Feed 4:5 | Photo post | One image, one line on image or clean | Library still | Experience, Results |
| `quote-card` | Quote card | Feed 4:5 | Image post | One line, attribution | None (graphic) | Practitioner, Patient voice |
| `reel-talking-head` | Practitioner to camera | Reel 9:16, 20 to 45s | Reel (cross-posted) | Hook 0 to 3s, 3 beats, CTA; on-screen text | Filmed clip | Practitioner, Education |
| `reel-walkthrough` | Treatment day walkthrough | Reel 9:16 | Reel | "What happens when you arrive" sequence | Clinic b-roll or stills with motion | Experience |
| `reel-broll` | Mood reel | Reel 9:16, 7 to 15s | Reel | Text-led over b-roll, single message | Library clips or stills with motion | Experience, Results |
| `review-card` | Patient review | Feed 4:5 | Image post | Review excerpt, star line, first name or initial only | None (graphic) | Patient voice |
| `seasonal-cta` | Timing post | Feed 4:5 | Image post + link | Timely hook, honest suitability line, booking CTA | Graphic or still | Offers |
| `story-set` | Story sequence | 3 to 5 frames 9:16 | FB Story | Poll or question sticker, answer, link sticker | Graphic | Any (repurposes the feed post) |

**Format mix per week (default at 4 feed posts):** 1 carousel, 1 Reel, 1 single or quote/review card, 1 flex. Reels are where reach comes from on both platforms; carousels are where saves come from. Stories are generated as companions to feed posts, not separate slots.

**Graceful degradation:** if the form says "practitioner will not film this period", `reel-talking-head` is removed from the pool and its slots fall back to `quote-card` or `reel-broll`. The planner does this, not the model.

---

## 4. Platform rules: one post, two variants

Generate one post object with a variant per platform. Do not generate two separate posts.

| | Instagram | Facebook |
|---|---|---|
| Caption length | 80 to 150 words; hook in first 125 characters (before "more") | Can be shorter and more direct; local, older audience |
| Links | "Link in bio" or link sticker in Story | Clickable booking link in the post |
| Hashtags | 3 to 5, specific (treatment + location) | 0 to 2 |
| Location | Location tag (Winslow etc.) | Location in copy, Page check-in |
| Reels | Native | Cross-posted from IG via Meta |
| Alt text | Required field | Required field |
| Age | Cosmetic procedure content respects Meta's 18+ norms; check the IG account and set the FB Page age restriction | Same |

---

## 5. Cadence and periods

| Setting | Default | Range |
|---|---|---|
| Feed posts per week | 4 (Mon / Wed / Fri / Sun) | 2 to 7 |
| Reels per week | 1 (counted inside feed posts) | 0 to 3 |
| Story sets per week | 3 | 0 to 7 |
| Post time | 18:00 Europe/London | Per day override |
| Period | 4 weeks | 1 week to 1 quarter |

Generation unit is the **period**: the form produces every slot in that window in one run, then the operator reviews the plan before any copy is written (section 6, step 2). Quarter-length runs should plan the whole quarter but generate copy one month at a time, so later posts can reflect what performed.

---

## 6. The form (Studio build spec input)

### Step 1: form fields

**A. Period**
- Start date (date, defaults to next Monday)
- Length (1 / 2 / 4 weeks, month, quarter, or end date)
- Blackout dates (multi-date: clinic closed, holidays)
- Key dates (date + label: open day, new device arrives, bank holiday)

**B. Campaign**
- Campaign type (select, from `campaign-types.json`)
- Campaign name (text)
- Objective (select: awareness / education / consultations booked / fill a specific clinic day)
- Subjects (picker, cardinality from campaign type: services or locations)
- Overlay share (slider, 25 to 75%, default 50; hidden for `brand`)
- Seasonal hook (select from the annual spine, or free text)
- Offer / availability detail (text + terms; disabled automatically if any selected service is `pomSensitive`)

**C. Channels**
- Platforms (checkboxes: Instagram, Facebook)
- Include Stories (toggle)
- Cross-post Reels to Facebook (toggle, default on)

**D. Cadence**
- Feed posts per week (number)
- Posting days (day checkboxes)
- Post time (time, per day override)

**E. Mix**
- Pillar weights (sliders, prefilled from `pillars.json`, must total 100)
- Content types allowed this period (checkboxes from section 3)
- Practitioner filming available (toggle; off removes talking-head Reels)
- Consented results imagery available (toggle; off forces illustrative/graphic results posts)

**F. Assets**
- Use library assets (toggle, scans `image-library.json`)
- Must-use assets (picker)
- Allow new-asset briefs (toggle: slots without a suitable asset get a Higgsfield/photo brief rather than a placeholder)

**G. Voice and CTA**
- Primary CTA (select: book a consultation / message us / link in bio / none)
- Booking URL (prefilled from `client.json`)
- Must mention (text)
- Must avoid (text, appended to lint as session warnings)

**H. Generation**
- Provider (Claude / ChatGPT)
- Model (select, per provider, from server config)
- Variants per post (1 to 3)
- Hook alternatives (0 to 3)

### Step 2: plan preview (no LLM yet)
Deterministic slot table: date, day, pillar, content type, subject, asset. Operator can drag, swap a content type, lock a slot, or regenerate the plan with a new seed. Nothing is written until the plan is approved. This is the cheap place to fix mistakes.

### Step 3: generate
One model call per slot (parallelised), each given: brand pack, voice, compliance, the content type template, the slot, and the titles of neighbouring posts so hooks do not repeat.

### Step 4: lint and review
Every post through `content-lint.js`. Errors trigger one automatic regeneration with the lint reasons fed back; a second failure marks the slot "needs human". Passing posts go to Stage for Nafisa's approval, then publish (manual for now; Meta Graph API later).

---

## 7. Data shapes

### Slot (output of planner)
```json
{
  "slotId": "2026-10-12-feed",
  "date": "2026-10-12",
  "time": "18:00",
  "pillar": "education",
  "contentType": "carousel-myth",
  "subject": { "kind": "service", "id": "laser-facelift" },
  "campaign": "autumn-laser-season",
  "assetId": null,
  "platforms": ["instagram", "facebook"],
  "withStory": true,
  "locked": false
}
```

### Post (output of generation, the JSON schema the model must return)
```json
{
  "slotId": "2026-10-12-feed",
  "hook": "Laser facelift is a facelift. True or false?",
  "hookAlternatives": ["..."],
  "slides": [
    { "template": "hook-cover", "kicker": "Myth vs fact", "headline": "...", "body": "" }
  ],
  "reel": null,
  "story": [{ "frame": 1, "text": "...", "sticker": "poll", "options": ["True", "False"] }],
  "platforms": {
    "instagram": { "caption": "...", "hashtags": ["..."], "altText": "..." },
    "facebook":  { "caption": "...", "link": "https://...", "altText": "..." }
  },
  "cta": "book-consultation",
  "compliance": { "pomSensitive": false, "illustrative": false, "notes": "" },
  "assetBrief": null
}
```

`reel` when present: `{ "durationSec", "hook", "beats": [{ "onScreenText", "voiceover", "shot" }], "cta" }`.

The schema is the contract. The renderer, lint, Stage and the publisher only ever read this shape, never raw model text.

---

## 8. Claude and ChatGPT support

A thin provider adapter behind one interface:

```
generatePost({ system, prompt, schema, model, temperature }) -> Post JSON
```

| | Claude (Anthropic API) | ChatGPT (OpenAI API) |
|---|---|---|
| Structured output | Forced tool use with the Post schema as `input_schema` (or structured outputs) | Structured Outputs, `json_schema` with `strict: true` |
| Brand pack reuse | Prompt caching on the system block (brand, voice, compliance, templates) | Automatic prompt caching on the repeated prefix |
| Keys | Server-side env only (`ANTHROPIC_API_KEY`) | Server-side env only (`OPENAI_API_KEY`) |

Rules that keep the providers interchangeable:
1. **One prompt pack, no per-provider prompts.** System = `voice.md` + `compliance.md` + content-type template + pillar guidance. Provider differences live only in the adapter.
2. **Validate every response against the schema** regardless of provider; invalid JSON is a retry, not a crash.
3. **Lint is provider-agnostic.** Compliance never depends on which model wrote the copy.
4. **Record provenance per post:** provider, model ID, prompt-pack version, seed, lint result. Needed for the audit trail in a regulated sector and for comparing providers on real output.
5. **Model lists are config, not code.** Models change faster than the app.
6. Optional later: "compare" mode generates the same slot with both providers side by side in Stage, so the choice is made on PureMed output, not reputation.

---

## 9. Worked example: 4 weeks from Mon 12 October 2026

Campaign: `seasonal` "Autumn laser season" at 50% overlay, always-on fills the rest. 4 feed posts per week, IG + FB, Stories on.

| # | Date | Layer | Pillar | Content type | Working hook |
|---|---|---|---|---|---|
| 1 | Mon 12 Oct | Overlay | Education | `carousel-myth` | "Laser facelift is a facelift. True or false?" |
| 2 | Wed 14 Oct | Always-on | Practitioner | `reel-talking-head` | "The question I ask before every treatment" |
| 3 | Fri 16 Oct | Overlay | Experience | `reel-walkthrough` | "Your first laser appointment, start to finish" |
| 4 | Sun 18 Oct | Always-on | Patient voice | `review-card` | Consented review excerpt |
| 5 | Mon 19 Oct | Overlay | Education | `carousel-explainer` | "Why autumn is laser season" |
| 6 | Wed 21 Oct | Always-on | Experience | `single-still` | "No rush, no upsell at the door" |
| 7 | Fri 23 Oct | Overlay | Results | `single-still` | "Skin that looks rested, not done" |
| 8 | Sun 25 Oct | Always-on | Practitioner | `quote-card` | "If it isn't right for your skin, I'll tell you" |
| 9 | Mon 26 Oct | Always-on | Education | `carousel-faq` | "3 questions to ask before any treatment" |
| 10 | Wed 28 Oct | Overlay | Practitioner | `reel-talking-head` | "Who laser is not right for" |
| 11 | Fri 30 Oct | Always-on | Experience | `reel-broll` | Clinic mood, one line |
| 12 | Sun 1 Nov | Overlay | Offers | `seasonal-cta` | "Planning for December? Start in November" |
| 13 | Mon 2 Nov | Always-on | Education | `carousel-explainer` | "What healthy skin actually looks like" |
| 14 | Wed 4 Nov | Overlay | Patient voice | `review-card` | Laser-specific consented review |
| 15 | Fri 6 Nov | Always-on | Results | `single-still` | Skin-quality still, illustrative tag if needed |
| 16 | Sun 8 Nov | Overlay | Practitioner | `quote-card` | Campaign close on the brand line |

Spread: Education 4, Practitioner 4, Experience 3, Patient voice 2, Results 2, Offers 1. Reels 4 (one per week). Treatment names and suitability claims above are placeholders until the service list is confirmed (section 10).

---

## 10. Open questions before the build spec

1. **Service list and POM flags.** The eleven Treatments-page services need confirming in PureMed's `client.json`, each with `pomSensitive` set. Anything involving a prescription-only medicine stays consultation-led and unnamed.
2. **Will Nafisa film?** Talking-head Reels are the biggest lever. If not, the Practitioner pillar runs on quote cards and the reach ceiling is lower.
3. **Consented results and reviews.** Is there a consented bank, and is written consent captured per image and per platform?
4. **Facebook Page status.** Exists, connected to the IG account in Meta Business Suite, age restriction set?
5. **Publishing.** Manual publish (as Vera) for launch, or Meta Graph API scheduling in scope for this build?
6. **Approval SLA.** How far ahead does Nafisa need the batch in Stage? This sets the generation lead time (suggest 7 days before period start).
7. **Measurement.** The Tier 1 to 4 metrics in `01_mss/strategy/mss-clinic-case-study-and-metrics.md` assume a "How did you hear about us?" field at booking. This pattern is the machine that case study describes, so confirm the tracking is in place before the first period runs.

## 11. Known Studio gaps this touches

From `vera-studio-onboarding.md`:
- Platforms are Instagram-only in current client configs; the post schema needs the per-platform variant block.
- The Campaign Builder subject form still leaks FSC vocabulary ("Fighter id", "Archetype"); this form replaces it.
- The Campaign Builder never calls `/api/campaign/list`, so existing campaigns are invisible. Overlay campaigns need this to stop two overlays claiming the same slots.
- No compliance-tag zone ("Illustrative / results vary") on slides yet; Results posts need it.
- No light card family in the slide renderer yet, if PureMed's palette is light-led.
