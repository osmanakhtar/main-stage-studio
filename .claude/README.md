# MSS — `.claude/` README

*The front page. Start here if you don't know where to look.*
*Last reviewed: 19 June 2026*

---

## What this folder is

This is the auto-loaded context for any Claude Code or Claude desktop session working
on Main Stage Studio. Everything in here is meant to be true *every session*, regardless
of task. If you're looking for something that's only relevant to a specific job (a
go-live, a Bricks debugging session), that's not here — see "Where the strategy folder
fits" below.

For the conceptual model of how all of this fits together, read
**`mss-system-architecture.md`** first. This file is the practical companion to that
one: it tells you what to read and in what order for a given task. The architecture
file tells you why the layers exist; this file tells you which door to open.

---

## The three `.claude` locations

There is more than one `.claude` folder on this machine, and they are not
interchangeable. Putting the wrong thing in the wrong one is the single most common
source of drift in this system — it happened twice in one session on 19 June alone.

| Location | Scope | What belongs here |
|----------|-------|---------------------|
| `~/.claude/` (global, `osmanakhtar/.claude`) | Every project on this machine | Claude Code settings, MCP connections, auto-memory, and skills that are genuinely portable craft — not tied to MSS specifically. Currently: the Bricks skill family, copywriting, creative-director, design-taste-frontend. |
| `~/workspace/main-stage-studio/.claude/` (this folder) | This repo only | MSS-specific knowledge: brand, voice, decisions, workflows, prompts, production rules. Anything that would be wrong or missing-in-action if a session forgot it. |
| A future client repo's own `.claude/` (does not exist yet) | That repo only | Follows the same logic as this folder, scoped to one client — their brand, their voice, their site's quirks. Would only appear if a client site gets migrated to its own GitHub repo, per the convention in `mss-new-site-deployment-guide.md`. Never contains MSS strategy. This folder never contains a client's brand details. Each repo's `.claude/` only knows about itself. |

**The test for "does this belong in `~/.claude/` or here?"** — would this make sense to
use on a completely different project with no connection to MSS? If yes, it's a global
skill. If it only makes sense in the context of this studio, it belongs in this folder.

---

## Where the strategy folder fits

`01_mss/strategy/` is a separate, lower tier: reference material you reach for only
when doing a specific, bounded task. It is readable by Claude Code on demand but is
**not auto-loaded**, sessions won't know it exists unless something in `.claude/`
points to it or you mention it directly.

**The test for `.claude/` vs `01_mss/strategy/`:**

> Would getting this wrong, or a session simply not knowing it, be actively confusing
> or harmful in *any* session — not just the ones doing a specific task?

If yes → `.claude/`. The decisions log, brand identity, and production-ops rules are
all here because you'd never want a session operating without them.

If no, it's only relevant to a bounded task → `01_mss/strategy/`. The deployment
guide, Bricks build guide, and session kickoff prompts live here because most
sessions, writing copy, reviewing a brief, never need them.

**A third, quieter category currently living inside `strategy/` without its own
home:** point-in-time project artifacts — the copy review, the homepage audit. These
are records of work already done, not living reference material anyone should read
before starting a new task. They're not wrong to keep, but they're a different kind
of thing than the build guide or the deployment guide, and if `strategy/` keeps
accumulating these, it may be worth a `strategy/archive/` subfolder later. Not urgent,
worth naming so it doesn't get mistaken for active reference.

---

## Bricks skill session ordering

The four Bricks skills (`bricks-site-connection`, `bricks-lowcode-skill`,
`bricks-html-importer`, `bricks-mss-site-notes`) divide responsibilities cleanly. Within
a typical build session, use them in this order:

1. `bricks-site-connection` — open the session, authenticate, troubleshoot connection issues
2. `bricks-html-importer` — run the HTML-to-Bricks conversion workflow
3. `bricks-lowcode-skill` — consulted throughout the build for element, style, and pattern decisions

**When something new comes up that none of the skills cover:**

- New component or pattern → `bricks-lowcode-skill`'s Compound Pattern Library
- New hosting or environment quirk → `bricks-site-connection`'s troubleshooting table
- Workflow or sequencing change → `bricks-html-importer`'s phase structure

This is a map to the skills, not a replacement for reading them.

---

## Markdown only

No HTML, no `.docx`, in either `.claude/` or `01_mss/strategy/`. This is a locked
convention, not a preference. Markdown is diffable in git, directly editable by Claude
Code, and lightweight to load into a session. HTML and Word files are none of those
things — they sit there unreadable by the tools that are supposed to keep this system
current, which is exactly how the three large HTML files and one `.docx` ended up
silently drifting for weeks before the 19 June audit caught them.

If you need a document to look good in a browser, use the markdown viewer in
`03_resources/tools/md-viewer.html` rather than writing the document in HTML.

---

## Reading order by scenario

| You're about to... | Read, in order |
|---|---|
| Start any session, unsure where to begin | This file → `mss-system-architecture.md` → `mss-decisions-log.md` |
| Scope a new client engagement | `mss-decisions-log.md` (current positioning) → `mss-client-workflow-guide.md` → `mss-new-client-checklist.md` |
| Write any copy, MSS or client | `mss-tone-of-voice.md` (or the client's own voice file) → the `copywriting` skill → `copy-contexts.md` |
| Open or publish a case study | `mss-case-study-workflow-guide.md` → `mss-new-case-study-checklist.md` |
| Build or fix something in Bricks | `mss-production-ops.md` (the rules) → `bricks-html-importer` skill → `01_mss/strategy/mss-bricks-build-guide.md` and `mss-bricks-quick-fixes.md` as needed |
| Take a site live, or deploy a change | `01_mss/strategy/mss-new-site-deployment-guide.md` |
| Check whether something is actually decided | `mss-decisions-log.md` — always wins if anything else disagrees |
| Update studio spend or subscriptions | `mss-spend-tracker.md` |
| Reflect on the studio's own positioning or identity privately | `mss-founder-vision.md` |

---

## Maintaining this system

How to keep the decisions log itself current is covered in
`mss-decisions-log-workflow.md`. Recurring studio maintenance tasks (when to review
what, on what cadence) are in `mss-studio-ops-checklist.md`.

The short version that applies to every file in this folder, not just the decisions
log: when something changes, update the file in the moment, in the session where it
changed. A file that's accurate today and stale next week is worse than no file,
because it creates false confidence. The 19 June audit found three genuine,
operationally dangerous contradictions that had been sitting undetected for as long
as two weeks. Don't let that happen again — update as you go.
