# MSS — Maintaining the Decisions Log

*How to keep `mss-decisions-log.md` accurate over time.*
*Companion to `mss-studio-ops-checklist.md`, which covers all recurring studio tasks.*
*Last reviewed: 25 May 2026*

---

## What this file is for

The decisions log is the single record of what's true right now. Brand identity, tone of voice, website brief, and every other context file describe specifics in their own domain. The decisions log is where you check that none of them contradict each other, and where you track what hasn't been decided yet.

It only works if it's current. A decisions log that's three weeks stale is worse than no decisions log, because it creates false confidence.

---

## The three sections, and what belongs in each

### Locked
A decision goes here when it's confirmed and you're building on it. Not "probably this" — actually decided. Each row should be specific enough that someone with no context could read it and know exactly what to do.

Don't lock something to make the document feel more complete. An empty Open section isn't the goal. A Locked section full of things that might still change is worse than honesty about what's still in motion.

### Open
A known decision that hasn't been made. Every row needs a reason it's open and whether it blocks anything. If it doesn't block anything, it's fine to sit here indefinitely. If it does, the Blocker column should say so plainly, not bury it in a description.

### Flagged
Anything that looks incomplete, possibly out of date, or contradictory, but you haven't checked yet. This is a holding pen, not a permanent home. Items here should either get resolved (move to Locked or Open) or get checked and confirmed fine (remove the row entirely). Nothing should live in Flagged for months without anyone looking at it.

---

## When to update it

**Every time something locks.** Not at the end of the week, not at the next full review. The moment a decision is confirmed, in the same session, add the row and the change history entry. This takes under a minute and is the single habit that keeps the whole document trustworthy.

**Every time a contradiction surfaces.** If you're working on something and notice it conflicts with what the log says is locked, stop and resolve it there before continuing. Don't let the working file and the log disagree silently.

**Every time a new open question surfaces.** If a session raises a decision that needs to be made later, it goes into Open immediately, not into memory.

**At the end of any session that touched a context file.** Quick scan: did anything I just did change what's locked, opened, or flagged? If yes, update before closing.

The end-of-session habit is also captured in `mss-studio-ops-checklist.md` — this file explains how to do it well, that file is the reminder that it needs doing.

---

## How to write an entry

**Locked decisions** should read as a fact, not a summary of a conversation. Write the decision, not the reasoning that got you there — the reasoning belongs in change history if it matters, not in the locked table itself.

Good: `Palette — Dusty terracotta | #BF6B47 — primary accent / CTAs / logo mark / key moments`

Not this: `Palette — Dusty terracotta | We discussed a few options and landed on a warm terracotta tone because it felt right for the brand`

**Change history entries** are one line. Date, what changed, why. The "why" matters more than it looks like it does — six months from now you won't remember why a decision reversed, and the why is what stops you relitigating it.

```
| 25 May 2026 | Locked In Learning migrated out of MSS scope | Doesn't fit creative founder proposition — moved to Studio 2 |
```

**Superseded decisions** never get deleted. Strike through the old version, keep it in place, add the new version as its own row, note the date.

```
| ~~Client definition~~ | ~~Creative founders who lead with instinct and identity~~ |
| Client definition | People with something real to say that hasn't yet found its form |
```

This matters because the history of how positioning evolved is itself useful — both for you and for anyone joining the studio later.

---

## Keeping it in sync across Claude desktop and Claude Code

There is one canonical file. It lives in `.claude/` in the repo. Both tools read from it; neither tool owns a separate version.

- **Claude desktop** is where most updates happen — strategy and copy sessions are where decisions actually get made
- **Claude Code** reads the log via `CLAUDE.md` at session start, but rarely writes to it directly. If a build session surfaces a decision (a stack change, a new technical constraint), note it during the session and update the log manually afterward — don't rely on Claude Code to edit the canonical file mid-build
- When a desktop session produces an updated version of the log, replace the file in `.claude/` immediately. Don't keep the old version "just in case" — the change history inside the file is the record, not a second copy of the file

Once the GitHub repo is live, every replacement is a commit. That's your version control. You don't need anything else layered on top.

---

## What not to do

**Don't rewrite sections that aren't wrong.** If a review only changes one row, only touch that row. Wholesale rewrites make it harder to see what actually changed and erode trust in the document.

**Don't let Flagged become a junk drawer.** If something's been sitting in Flagged for more than a couple of review cycles without action, either resolve it or admit it doesn't matter and remove it.

**Don't track every micro-decision.** The log is for things that other decisions depend on, or that could cause contradiction if forgotten. A one-off phrasing choice in a single piece of copy doesn't need a row. A typography rule that every future piece of copy must follow does.

**Don't maintain two versions.** Not a personal scratch copy, not a "draft" sitting alongside the real one. One file, one truth.

---

## Quick test before closing any session

Ask: if someone else opened this file right now with no other context, would it tell them the truth about where the studio stands? If the answer's no, fix it before you close the session, not after.
