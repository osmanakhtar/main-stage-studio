# MSS — New Case Study Checklist

*Run when an engagement reaches a presentable milestone or completes. Case studies live in MSS portfolio — never in the client folder.*
*Last reviewed: 07 August 2026*

---

## Location

```
~/workspace/01_mss/portfolio/[client-name]/
```

Not `~/workspace/02_clients/[client-name]/`. The client folder holds working files. The case study folder holds the curated story.

---

## The core principle

Each case study earns its own creative treatment. The design voice reflects the client's world, not MSS's. If the HTML starts looking like the MSS website, stop. Re-read the constraints doc and start again.

### The one exception: studio chrome

The nav and the scroll-progress bar are fixed across the whole portfolio. Their **geometry, position, structure and behaviour do not change from one case study to the next**. What varies is the colour values, which come from the client's palette like everything else on the page, and one word in the right-hand label.

Locked, every case study:

- Fixed nav bar, `--nav-height: 64px`, spanning the viewport, `z-index: 50`
- Backbar left: back arrow + "Main Stage Studio", linking to `/#work`
- Label right, 10px, uppercase, `0.28em` tracking. **The one word that varies, see below.**
- A 1px hairline under the bar
- `body { padding-top: var(--nav-height); }` to clear it
- Vertical scroll-progress bar, 2px, left edge, `z-index: 60`
- Same backbar metrics: `0.65rem` gap, `0.75rem` font, `0.04em` tracking, hover shifts colour and opens the gap to `0.95rem`

Free per client: the bar's background, the hairline colour, the label colour, the backbar's resting and hover colours, and the progress bar's colour. Pick them from the client's own tokens.

#### The nav label marks engagement type (set 7 Aug 2026)

| Label | Use for |
|---|---|
| **Portfolio** | Paid client engagements. PureMed. |
| **Case study** | Self-initiated and spec work. Sable. |

The label reflects whether someone paid for the work, not what kind of document the page is. Both page types remain case studies everywhere else on the site: the homepage card, the "Read the case study" button, the `<title>`, and the footer line all keep that wording on both pages. The nav word is the only place the engagement type shows up in the chrome.

Worth knowing when you next touch this: a reader has no key to that distinction, so it reads as a wayfinding label rather than a credibility signal. The real separation between paid and self-initiated is carried in the content layer, where it is explicit and already works: Sable's card is stamped "Self-initiated", her hero carries "Self-initiated, 2026", and her footer repeats it. PureMed names a client, a sign-off and a live status, none of which a spec piece can have. If the paid/unpaid line ever needs to be firmer, strengthen it there, not in the nav.

Two notes on getting the colours right:

- **The nav contents align to that page's content column, not to a fixed gutter.** Sable's page runs a full-bleed `--pad-x` gutter, so her nav is full-bleed. PureMed runs a 1120px column, so its nav spans the viewport while its contents sit on the 1120px grid. Same rule, different grid.
- **The client's own colour rules still apply inside the chrome.** PureMed's brand bars gold from text (2.28:1 on white), so its label is muted ink and gold takes the hairline and the progress bar instead. Do not break a client's contrast rule to force a colour match with another case study.

Reference pair: `work/sable/index.astro` and `work/puremed.astro`.

---

## Structure

Every case study has two parts: a framing page and a full case study page. Both are written before anything is designed. Both share the same creative identity, grounded in the client's world.

---

## Opening a case study

- [ ] Case study folder created at correct path (above)
- [ ] Working files remain in `~/workspace/02_clients/[client-name]/` — do not move them
- [ ] Only polished, presentable material copied to the case study folder

---

## Phase 1 — Content

### Framing page
- [ ] **Framing page copy written** — short, 3–4 sentences, opens with the client's world
- [ ] **Makes someone want to read the full case study** — opens into the story, doesn't summarise it
- [ ] **Client feels recognised** — specific enough to describe a real person, not a type

### Full case study
- [ ] **Client and context** — who they are, what they do, why it matters
- [ ] **The challenge** — what they needed, what wasn't working
- [ ] **The strategic insight** — what made this client different, the one thing that unlocked the work (must be expressible in one sentence)
- [ ] **What was built** — services delivered, key outputs (not a deliverable list)
- [ ] **Outcomes** — what changed, what was achieved
- [ ] **Close** — ends forward-facing and hands straight to the CTA below it

**Retired 7 Aug 2026: the "what we'd do differently" reflection section.** It was oversharing. A prospective client reading the page does not need a list of the studio's mid-build regrets, and a status section that itemises what is blocking go-live reads as an excuse however carefully it is written. State where the work stands, frame the remaining stretch as the normal shape of a project rather than a fault, and close on a line that hands to the CTA. Honesty about status stays; the self-audit goes.

### Review
- [ ] Both pieces checked against copywriting skill quality checklist in `SKILL.md`
- [ ] Strategic insight confirmed as one clear sentence
- [ ] Neither piece starts with "We were approached by..."
- [ ] No vague outcomes, no deliverable lists dressed as achievements

---

## Phase 2 — Design Brief

- [ ] Creative brief written before opening Claude Code:
  - [ ] What does this client's world feel like? (three words)
  - [ ] What references outside the web apply?
  - [ ] What is explicitly off-limits? (minimum two layout conventions)
- [ ] Typography, colour, and layout chosen independently — not inherited from MSS
- [ ] Design reviewed: does it feel like the client's world or the studio's?
- [ ] If it looks like the MSS website — stop and restart from the brief

---

## Phase 3 — Build

- [ ] Framing page built — HTML/CSS, client's creative identity
- [ ] Full case study page built — HTML/CSS, consistent with framing page
- [ ] Both pages reviewed together — coherent pair, not two separate builds
- [ ] Both pages look like the client, not the studio
- [ ] Studio chrome matches the locked spec above — nav geometry and behaviour identical to the other case studies, colours from this client's palette
- [ ] Nav label set from engagement type — "Portfolio" if the client paid, "Case study" if self-initiated
- [ ] Nav checked against the narrowest supported width (320px) for overflow

---

## Phase 4 — Assets

- [ ] Screenshots of live site or prototype
- [ ] Brand mark / logo in context
- [ ] Key design moments — one or two visuals that show the work at its best
- [ ] No raw working files, no rejected directions, no draft logos

---

## Phase 5 — Publishing

- [ ] Both pages added to MSS website work section (`index.html`)
- [ ] Card content: client name, sector, services, thumbnail image
- [ ] Card links to framing page
- [ ] Framing page links to full case study
- [ ] LinkedIn post drafted (optional — use `mss-tone-of-voice.md`)

---

## Case study format guidance

The case study is a story, not a deliverable list. Write it the way you'd explain the project to another creative founder — what you found out, what you decided, what you made.

The framing page is the invitation. The full case study is the story. Neither should be able to exist without the other.

Length: enough to show the thinking. Not a portfolio PDF. Not a blog post. Something in between.

Voice: follow `mss-tone-of-voice.md`. Confident, specific, no filler. Make the client feel recognised, not just described.
