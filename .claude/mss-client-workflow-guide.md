# MSS — Client Workflow Guide
## Scoping through Brand Expression

*How the work actually happens — steps, decisions, tools, and prompts.*
*Companion to `mss-new-client-checklist.md`, which is the tick-list version.*
*Website build is covered separately in `mss-build-guide.html`.*
*Last reviewed: 25 May 2026*

---

## How this guide works

Each phase has:
- **What you're doing** — the job to be done
- **Steps** — in order, with tool guidance
- **Prompts** — starter prompts for Claude sessions; refine as you use them
- **Gate** — what has to be true before moving to the next phase

Prompts are also collected in `mss-prompt-library.md` — reference there when you need them outside a phase workflow.

---

## Phase 1 — Scoping

### What you're doing
Understanding the client well enough to scope the engagement accurately. This is a conversation, not a form. The output is a signed-off scope.

### Steps

1. **Initial conversation** — understand the client, their audience, their ambition. Don't frame it as a sales conversation. Ask what they're trying to say, not what they think they need built.

2. **Define engagement type** — one of:
   - Brand only
   - Web only
   - Full: Discovery → Brand → Design system → Web

3. **Agree hosting model**
   - Option A (MSS Cloudways) — early-stage clients, low-overhead, retainer relationships
   - Option B (client's own) — established clients with technical resource

4. **Agree rough timeline and budget** — don't over-engineer this. Rough numbers, verbal agreement. The proposal formalises it.

5. **Send proposal / scope of work** — see prompt below.

6. **Get sign-off** — verbal is fine at this stage. Written preferred.

### Prompts

**→ Prompt: Draft a proposal**
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

### Gate
Scope signed off before moving to setup.

---

## Phase 2 — Setup

### What you're doing
Creating the working environment for the engagement. This takes 10 minutes. Do it before anything else.

### Steps

1. **Create client folder**
   ```
   ~/workspace/02_clients/[client-name]/
   ```
   Copy structure from `02_clients/_template/`. Never create inside `01_mss/`.

2. **Open `discovery/constraints.md`** — fill in what you know so far. It will be incomplete at this stage — that's fine. It gets completed during discovery.

3. **Write `CLAUDE.md` at project root** — this is the session context file for Claude Code. It should reference the constraints doc and set the working context for every session.

4. **Open a terminal tab** — name it for the client. Confirm working directory:
   ```
   cd ~/workspace/02_clients/[client-name]/
   ```

### Prompts

**→ Prompt: Write CLAUDE.md for a new client project**
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

### Gate
Folder structure in place, CLAUDE.md written, terminal tab open and in the right directory.

---

## Phase 3 — Discovery

### What you're doing
Understanding the client's world well enough to make creative and strategic decisions. Discovery ends when you know what makes this client different, who they're for, and what the work needs to do.

The output is a signed-off brief and a completed constraints doc. Nothing gets designed until both exist.

### Steps

1. **Run a discovery session with the client** — two hours, no agenda, just conversation. The questions to explore:
   - What made you build this?
   - Who is it for — and who is it not for?
   - What do you want people to feel when they encounter your brand?
   - What are you doing that no one else does?
   - What would you never want this to look like?

2. **Write `discovery/brief.md`** — client, audience, differentiator, goals. Use the discovery session prompt below to structure this in Claude.

3. **Complete `discovery/constraints.md`** — the design brief. Must include:
   - Spatial character (one sentence — how the brand should feel in space)
   - Off-limits layout conventions (minimum two — specific, not vague)
   - Emotional register (three words)
   - References outside the web (art, architecture, print, objects)
   - What this brand is not — visual, emotional, structural

4. **Research** — competitors, references, relevant visual territory. Document in `discovery/`.

5. **Sign off with client** — share the brief and constraints. Get confirmation before moving to brand.

### Prompts

**→ Prompt: Write a discovery brief from notes**
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

**→ Prompt: Build the constraints doc**
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

**→ Prompt: Competitor research brief**
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

### Gate
`discovery/brief.md` written, `discovery/constraints.md` complete, discovery signed off with client.

---

## Phase 4 — Brand Expression

### What you're doing
Translating the discovery brief and constraints into a visual and verbal identity. This phase moves from logo → palette → typography → tone of voice → key messages.

Nothing in this phase is invented. Every decision should trace back to the constraints doc.

### Steps

1. **Logo** — start with the mark, not the wordmark. Explore directions in `brand/`. Present 2–3 concepts to the client — not a shortlist of 10. You've done the thinking; give them a decision to make, not a mood board.

2. **Colour palette** — derive from the constraints. The palette should feel like the brand, not like a colour theory exercise. Document in `brand/palette.md`.

3. **Typography** — primary and secondary. Test at headline and body scale before committing. Document in `brand/typography.md`.

4. **Tone of voice** — this is copy strategy, not a style guide. Document:
   - Brand character (one sentence)
   - Three words
   - What it never sounds like
   - Voice in practice — at least three worked examples in different contexts

5. **Key messages** — 3–5 statements that carry the positioning. These are the sentences the client should be able to say unprompted.

6. **Present to client** — brand presentation, not a PDF deck. Walk them through the thinking, not just the output.

7. **Sign off** — brand locked before moving to design system.

### Prompts

**→ Prompt: Logo concept brief**
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

**→ Prompt: Colour palette development**
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

**→ Prompt: Typography selection**
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

**→ Prompt: Tone of voice document**
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

**→ Prompt: Key messages**
```
Based on the discovery brief and brand positioning for [client name]:

[paste brief]

Draft 4–5 key messages. These should be:
- Statements the client can say unprompted
- Grounded in their differentiator, not generic brand language
- Specific enough to be useful, short enough to be remembered

For each message, note what it's doing — which part of the positioning it carries.
```

**→ Prompt: Brand presentation structure**
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

### Gate
Logo, palette, typography, tone of voice, and key messages all complete and documented. Brand signed off by client before moving to design system.

---

## Phase 5 — Asset Generation

### What you're doing
Generating the image and video assets for the site before the build starts. This phase runs once brand expression is signed off and the HTML prototype exists. The output is a complete asset set and a placement manifest — the build phase works from real assets, not placeholders.

### When to run this phase
- Brand signed off
- HTML prototype built and locked
- Client constraints doc complete

Do not run this phase before the prototype exists. The skill reads the HTML to map placements — without it, there is nothing to analyse.

### Steps

1. **Open a Claude Code session** in the client working directory.

2. **Run the Higgsfield asset generation skill** — say: "Run the Higgsfield asset generation skill for this client." The skill will ask you to confirm the prototype path, the client folder path, and any specific instructions for this run before it starts.

3. **Review the placement plan** — the skill presents a full brief before generating anything. Check the placements, prompts, and model assignments. Adjust anything that doesn't feel right before proceeding.

4. **Review the cross-section outputs** — for hero placements, the skill generates across multiple models. Review the outputs and note which model produced the strongest result for each placement. Add notes to the manifest.

5. **Confirm the manifest** — the manifest lives at `assets/generated/manifest.md` in the client folder. Confirm output URLs are recorded against each placement before closing the session.

### Gate
Manifest complete. Every placement has an output URL recorded. Hero cross-section reviewed and preferred option noted. Assets ready for the build phase.

---

## Tool guidance — Claude desktop vs Claude Code

| Phase | Tool | Why |
|-------|------|-----|
| Scoping | Claude desktop/web | Thinking and copy work |
| Setup | Terminal | Filesystem — not a Claude job |
| Discovery | Claude desktop/web | Strategy, brief writing, research |
| Brand strategy | Claude desktop/web | Tone of voice, key messages, concept direction |
| Logo exploration | Claude desktop/web → Claude Code | Concept and rationale in desktop; SVG builds in Claude Code |
| Colour / typography | Claude desktop/web | Decisions and documentation |
| Prototype (future) | Claude Code | Build phase — see mss-build-guide.html |
| Asset generation | Higgsfield asset generation skill via Claude Code | Runs after brand sign-off and prototype lock; outputs placement manifest for build phase |

---

## Notes

**On prompts:** These are starters. The best version of each prompt is the one you've refined through use. When you change a prompt and it works better, update `mss-prompt-library.md`.

**On sequence:** The gate at the end of each phase is real. Skipping discovery to get to brand faster produces brand work with nothing underneath it. The constraints doc is the thing that stops the work from being generic.

**On presenting to clients:** Don't send a PDF and wait. Walk them through it. The thinking is the value — a PDF without the conversation loses half of that.
