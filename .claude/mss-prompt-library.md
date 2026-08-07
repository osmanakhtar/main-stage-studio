# MSS — Prompt Library

*Starter prompts for all phases of client work and MSS studio work.*
*Refine as you use them. When a prompt improves, update it here.*
*Last reviewed: 25 May 2026*

---

## How to use this file

Prompts are organised by phase. Each has a name, the prompt itself, and a brief note on what it's doing.

When using a prompt: paste it into Claude, fill in the bracketed fields, and adjust based on what you know about the specific client. These are starting points, not scripts.

---

## Client Work — Scoping

### Draft a proposal
```
I'm writing a proposal for a new client engagement. Here's what I know:

Client: [name and brief description]
What they do: [one or two sentences]
Their audience: [who they serve]
Engagement type: [Brand only / Web only / Full]
Scope of work: [what's included]
Timeline: [rough]
Investment: [£ amount]
Hosting: [MSS Cloudways / client's own]

Draft a proposal in MSS voice — confident, clear, no oversell. 
Follow the Proposal / Direct Client Communication register from mss-tone-of-voice.md.
Sound like a person, not a document.
```

*What it's doing: Gives Claude the structural inputs and the voice brief in one hit. The register instruction does the work of keeping it from sounding like a template.*

---

## Client Work — Setup

### Write CLAUDE.md for a new client project
```
Write a CLAUDE.md file for a new client project. Here's the context:

Client: [name]
What they do: [one or two sentences]
Engagement type: [Brand only / Web only / Full]
Working directory: ~/workspace/02_clients/[client-name]/

The file should:
- Set session context for Claude Code
- Reference discovery/constraints.md as the design source of truth
- Note any known constraints or principles for this engagement
- Be short — this is a working reference, not a document
```

*What it's doing: Produces a lean CLAUDE.md that grounds every Claude Code session in the client context without over-engineering it.*

---

## Client Work — Discovery

### Write a discovery brief from notes
```
I've just completed a discovery session with a new client. Here are my notes:

[paste raw notes]

From this, write a discovery brief structured as:
- Client: who they are, what they do
- Audience: who they serve, what those people care about
- Differentiator: what makes this client distinct — the one thing
- Goals: what this engagement needs to achieve
- Tone: how the brand should feel (three words)

Write it plainly. No filler. This is a working document, not copy.
```

*What it's doing: Converts messy discovery notes into a structured brief. The "one thing" instruction forces a real differentiator rather than a list of nice-sounding qualities.*

### Build the constraints doc
```
I'm completing the constraints doc for a new client. Here's the discovery brief:

[paste brief]

And here's what the client said about references, aesthetics, and what they want to avoid:

[paste relevant notes]

Complete the constraints doc with:
- Spatial character — one sentence describing how this brand should feel in space
- Off-limits — at least two specific layout conventions this brand should never use
- Emotional register — three words
- References outside the web — art, architecture, objects, print that carry the right feeling
- What this brand is not — visual, emotional, structural

Be specific. Vague constraints produce generic work.
```

*What it's doing: Turns discovery notes into the design brief. The final instruction ("be specific") is important — without it Claude defaults to vague positives.*

### Competitor research brief
```
I'm doing discovery research for [client name], who does [brief description].

Their audience is [description]. Their differentiator is [one sentence].

Help me map the competitive landscape:
- Who are the 4–6 closest competitors or comparators?
- What does the visual and verbal territory look like across them?
- Where are the gaps — what's not being done?
- What should this brand avoid in order to stand apart?

Frame this as a working research note, not a report.
```

*What it's doing: Positions the research as strategic — gaps and avoidance, not just description. "Working research note" keeps it lean.*

---

## Client Work — Brand Expression

### Logo concept brief
```
I'm developing logo concepts for [client name]. Here's their constraints doc:

[paste constraints doc]

And here's the discovery brief:

[paste brief]

I want to explore [number] directions. For each direction, give me:
- The concept — what it's doing, what it references
- The form — describe the mark in words before I build it
- Why it fits this client specifically — not generically "clean" or "modern"

Don't describe logos that could belong to anyone. Every direction should be defensible from the constraints doc.
```

*What it's doing: The last instruction does the heavy lifting — it forces every direction to be grounded in the constraints rather than generic design-speak.*

### Colour palette development
```
I'm defining a colour palette for [client name]. Their constraints doc says:

Emotional register: [three words]
Spatial character: [one sentence]
References: [list]
What this brand is not: [list]

Propose a palette of 4–5 colours. For each:
- Name (descriptive, not generic like "blue" or "accent")
- Hex value
- Role in the system (background, primary, accent, type, etc.)
- Why it fits — trace it back to the constraints

Present the palette as a working system, not a list of swatches.
```

*What it's doing: "Trace it back to the constraints" is the key instruction — every colour should be justified by the brief, not by taste.*

### Typography selection
```
I'm selecting typography for [client name]. Their brand character is:

[paste from constraints doc]

The palette is: [list colours]

Recommend a type system — one primary (display/headings), one secondary (body/UI). For each:
- Font name and source (Google Fonts preferred unless there's a strong reason otherwise)
- Weight range to use
- What it brings to this brand specifically
- What it would look like at headline scale and body scale

Avoid Inter. Avoid anything generic.
```

*What it's doing: The specificity instructions ("at headline scale and body scale") force a practical recommendation, not just a font name.*

### Tone of voice document
```
I'm writing a tone of voice document for [client name]. Here's their discovery brief:

[paste brief]

And here's what I know about how they communicate naturally:

[paste relevant notes from discovery]

Write a tone of voice document with:
- Brand character — one sentence
- Three words (aspirational but chosen with intention)
- What it never sounds like — four anti-examples
- Voice in practice — three worked examples in different contexts:
  1. First impression (website / cold introduction)
  2. Direct client communication
  3. One other context relevant to this client

Follow the same structure and craft principles as mss-tone-of-voice.md, but in [client name]'s voice, not MSS's.
```

*What it's doing: The reference to mss-tone-of-voice.md grounds the format. "Not MSS's voice" is important — without it Claude defaults to the voice it's been trained on for this project.*

### Key messages
```
Based on the discovery brief and brand positioning for [client name]:

[paste brief]

Draft 4–5 key messages. These should be:
- Statements the client can say unprompted
- Grounded in their differentiator, not generic brand language
- Specific enough to be useful, short enough to be remembered

For each message, note what it's doing — which part of the positioning it carries.
```

*What it's doing: "Statements the client can say unprompted" is the test — if they couldn't say it in a conversation, it's not a key message.*

### Brand presentation narrative
```
I'm presenting the brand to [client name]. The engagement was [type]. 
Here's what's been developed: [list outputs — logo, palette, typography, tone of voice, key messages].

Draft a presentation narrative — the spoken walkthrough, not the slide deck. Structure it as:
1. Where we started (brief back to the client in one paragraph)
2. What we found (the strategic insight that shaped the work)
3. The brand (walk through each element with the thinking behind it)
4. What this makes possible (what the client can now do that they couldn't before)

Write it in MSS voice — confident, clear, specific. Not a sales pitch. A handover of thinking.
```

*What it's doing: Frames the presentation as a thinking handover, not a reveal. Section 4 is the most important — it closes on the client's future, not the studio's work.*

---

## MSS Studio Work

### Review a context file
```
I'm reviewing [file name] as part of a periodic context file check.

Here's the current version:

[paste file]

And here's what's changed since it was last updated:

[describe recent decisions or changes]

Flag:
1. Anything that contradicts what's now locked
2. Anything that's missing
3. Anything that could be cleaner or more direct

Don't rewrite for the sake of it. Only flag what genuinely needs changing.
```

*What it's doing: Frames the review as a check, not a rewrite. The last instruction keeps it from over-editing documents that are working fine.*

### Draft editorial content
```
I'm writing a piece of editorial content for the MSS website. Here's the topic and angle:

[topic]
[angle — the position I want to take]

Follow the Editorial Voice register from mss-tone-of-voice.md:
- State the position directly — no hedging, no "we think"
- Develop it with enough substance to earn the opening claim
- Close with weight, not a summary

Target length: [short / medium — 200–400 words]
```

*What it's doing: The register instruction does the work. Without it, editorial copy defaults to blog-post hedging.*

### Onboarding copy for a new client
```
I'm writing onboarding copy for a new client — [name]. This is the first thing they'll read when the engagement officially begins.

Their brief: [one or two sentences]
Their personality: [what you know about how they communicate]

Follow the Discovery Framing register from mss-tone-of-voice.md:
- Warm but purposeful — a genuine opening, not a sales pitch
- Turn the process into an invitation, not a methodology explanation
- Make them feel seen before anything is made

Keep it short — this isn't a document, it's a moment.
```

*What it's doing: The register instruction and the final line together set the right tone and scale.*

---

## Notes

**Updating prompts:** When you find a better version of a prompt, update it here and note briefly what changed. Don't keep both versions — the current version is the right one until it isn't.

**Prompts Claude Code doesn't need:** Build-phase prompts (prototype construction, Astro build) live in `01_mss/strategy/mss-astro-cloudways-setup.md` and `.github/DEPLOY.md` — those are the Claude Code operational reference.

**On bracketed fields:** Always fill them in before sending. A prompt with `[paste brief]` still in it produces generic output.
