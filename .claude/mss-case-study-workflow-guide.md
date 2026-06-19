# MSS — Case Study Workflow Guide

*How to create a case study — from engagement milestone to published portfolio piece.*
*Companion to `mss-new-case-study-checklist.md`, which is the tick-list version.*
*Last reviewed: 02 June 2026*

---

## The core principle

Each case study is its own creative project. It reflects the client's world — not MSS's. If the HTML starts looking like the MSS website, stop. Re-read the constraints doc and start again.

The case study is not a deliverable list. It's a story about what you found, what you decided, and what you made. The thinking is the value.

---

## When to open a case study

A case study opens when an engagement reaches a presentable milestone — not necessarily when it's complete. An early-stage brand with a strong strategic story is worth documenting even before the site is live.

Ask: is there a story here worth telling yet? If yes, open it. If the work is still too raw, note it in the decisions log and return later.

---

## Location

Case studies live in the MSS portfolio, not in the client folder.

```
~/workspace/01_mss/portfolio/[client-name]/
```

Working files stay at `~/workspace/02_clients/[client-name]/`. Do not move them. Only polished, presentable material goes into the portfolio folder.

---

## Structure: framing page and full case study

Every case study has two parts:

1. **Framing page** — a short, standalone page that introduces the client and the core story. Written before the full case study. This is the entry point from the portfolio grid.
2. **Full case study** — the complete write-up: challenge, insight, what was built, outcomes, reflection.

The framing page copy is written as part of Phase 1 (The Story), not during the build phase. Both pages have their own creative identity — consistent with each other, grounded in the client's world.

---

## Phase 1 — The Story

### What you're doing
Before you open a design tool or write a line of HTML, write the story. The design brief comes from the story — not the other way around.

Write the framing page copy and the full case study copy in this phase. Both need to exist before anything gets designed.

### Steps

1. **Write the framing page copy** — short, specific, opens with the client's world. This is the version of the story that sits on the portfolio grid entry point. It should make someone want to read the full case study. Use the case study register from `mss-tone-of-voice.md`: narrative, grounded, specific. Client's world first.

2. **Write the full story** — use the prompt below. Structure:
   - Client and context (who they are, what they do, why it matters)
   - The challenge (what they needed, what wasn't working)
   - The strategic insight (the one thing that unlocked the work)
   - What was built (services delivered, key outputs — not a deliverable list)
   - Outcomes (what changed, what was achieved)
   - Reflection (one honest paragraph — what worked and what you'd do differently)

3. **Review against the copywriting skill** — before this goes anywhere, check it against the quality checklist in `SKILL.md`. Case study register: narrative, grounded, specific. Client's world first, studio contribution second. Make the client feel recognised, not just described.

4. **Confirm the strategic insight** — this is the most important sentence in the case study. It's the thing that made this client different, the one discovery that shaped the work. If you can't write it in one sentence, you haven't found it yet.

### Prompt

**Framing page copy**
```
I'm writing the framing page for a case study for [client name]. This is the short entry
point from the portfolio grid — it needs to introduce the client and make someone want
to read the full case study.

Here's the core story:
[paste the strategic insight and one or two sentences of context]

Write a framing page introduction of 3–4 sentences. 
Follow the Case Study register from mss-tone-of-voice.md:
- Open with the client's world, not the studio's process
- Make the client feel recognised — specific enough that the reader sees a real person
- End on something that opens into the full story rather than closing it down
```

**Full case study story**
```
I'm writing a case study for [client name]. Here's the context:

Discovery brief: [paste]
What was built: [list outputs]
Outcomes: [what changed for the client]
One thing that made this engagement distinct: [the strategic insight]

Write a case study in six sections:
1. Client and context — who they are, what they do, why it matters
2. The challenge — what they needed, what wasn't working (lead with their world, not the brief)
3. The strategic insight — the one thing that unlocked the work
4. What was built — what was delivered (not a deliverable list — make it mean something)
5. Outcomes — what changed, what was achieved
6. Reflection — one honest paragraph on what worked and what I'd do differently

Follow the Case Study register from mss-tone-of-voice.md:
- Narrative, grounded, specific
- Client's world first, studio contribution second
- No "we were approached by..." openers
- No vague outcomes
- No deliverable lists dressed as achievements
- Make the client feel recognised, not just described
```

### Gate
Framing page copy written. Full story written and reviewed. Strategic insight is one clear sentence. Don't open the design brief until both are done.

---

## Phase 2 — The Design Brief

### What you're doing
Defining the creative identity of this case study before opening any tools. The design should feel like the client's world — their aesthetic, their register, their references. Not MSS.

### Steps

1. **Write the design brief** — three questions to answer before anything is designed:
   - What does this client's world feel like? (three words)
   - What references outside the web apply? (art, architecture, print, objects)
   - What is explicitly off-limits? (minimum two layout conventions)

2. **Choose typography, colour, and layout independently** — don't inherit from MSS. Start fresh from the brief.

3. **Gut check** — does this look and feel like the client's world, or does it look like the MSS website? If MSS: stop. Restart from the brief.

### Prompt

**Write the case study design brief**
```
I'm designing a case study for [client name]. Their brand identity is:

[paste key elements — palette, typography, aesthetic direction]

Their world feels like: [describe in a sentence or two]

Write a design brief for the case study pages (framing page and full case study):
- Three words that describe how they should feel
- Visual references outside the web — what would you point to?
- At least two layout conventions that are explicitly off-limits
- What these pages should never look like

The design should reflect the client's world, not the studio's.
If it starts looking like the MSS website, the brief isn't working.
```

### Gate
Design brief written. Off-limits defined. Ready to build.

---

## Phase 3 — Build

### What you're doing
Building the framing page and full case study page in HTML/CSS. This is Claude Code territory — switch tools here.

### Steps

1. **Open Claude Code** — working directory: `~/workspace/01_mss/portfolio/[client-name]/`

2. **Build the framing page first** — this is the entry point. It needs to feel finished before the full case study page is started.

3. **Build the full case study page** — HTML/CSS, consistent creative identity with the framing page. Typography, colour, layout from the brief — not from MSS defaults.

4. **Review both pages together** — do they feel like the client's world? Do they read as a coherent pair? One honest look before anything goes anywhere.

### Tool guidance
This phase runs in Claude Code. Prompts for the build are in `mss-build-guide.html` — the operational reference for prototype construction.

### Gate
Both pages built and reviewed. Look like the client, not the studio. Framing page and full case study work as a pair.

---

## Phase 4 — Assets

### What you're doing
Gathering the visual evidence. The case study should show the work at its best — not everything, not the rejects.

### What to include
- Screenshots of the live site or prototype — at the moments that show it best
- Brand mark / logo in context
- One or two key design moments — the visuals that carry the work

### What not to include
- Raw working files
- Rejected directions
- Draft logos
- Process screenshots that mean nothing to a reader

### Gate
Assets collected and placed. Both pages look finished, not assembled.

---

## Phase 5 — Publishing

### Steps

1. **Add to MSS website work section** — `index.html`
   - Card content: client name, sector, services, thumbnail image
   - Card links to the framing page
   - Framing page links to the full case study

2. **LinkedIn post (optional)** — if the work is worth sharing publicly. Draft using `mss-tone-of-voice.md`. Case study register — client's world first, studio contribution second.

### Prompt

**Draft a LinkedIn post for a case study**
```
I've just published a case study for [client name]. Here's a summary of the work:

[paste the strategic insight and outcome sections from the case study]

Write a short LinkedIn post to accompany the case study link.

In MSS voice — confident, specific, no filler.
Lead with the client's world, not the studio's process.
No "excited to share" openers.
End with a line that makes someone want to read the full story.
Target length: 4–6 sentences.
```

---

## Notes

**On timing:** The best time to write the story is immediately after the engagement, while the thinking is fresh. The design can wait. The story can't.

**On the framing page:** Write it as a genuine invitation into the full story, not a summary of it. The reader should want more after reading it, not feel like they already have the gist.

**On the reflection section:** This is the most honest part of the case study and usually the most useful — for the next engagement, for the portfolio, for how you talk about the work. Don't skip it or soften it.

**On the creative identity rule:** It's not a style preference — it's the whole point. A case study that looks like MSS tells the reader nothing about the client. The case study is a demonstration of the studio's ability to work inside someone else's world.
