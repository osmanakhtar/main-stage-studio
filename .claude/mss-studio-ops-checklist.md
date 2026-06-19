# MSS — Studio Ops Checklist

*Recurring maintenance tasks organised by when they happen.*
*The goal: start each session clean. This file does the remembering.*
*Last reviewed: 25 May 2026*

---

## End of session

Run these before closing any Claude desktop or Claude Code session where a decision was made or something changed.

- [ ] Did anything lock today? → Add a row to the decisions log change history
- [ ] Did any open decision get resolved? → Move it from Open to Locked in the decisions log
- [ ] Did any new item surface that needs checking? → Add it to Flagged in the decisions log
- [ ] Did I produce an updated context file? → Replace the version in `.claude/` immediately

---

## When triggered

These don't have a schedule — they run when the named event happens.

### New client
- [ ] Run `mss-new-client-checklist.md` from the top
- [ ] Add client to the decisions log under active engagements (once that section exists)
- [ ] Update `mss-spend-tracker.md` if hosting or tooling costs change

### New subscription or cost
- [ ] Add to `mss-spend-tracker.md` immediately
- [ ] Note in decisions log change history if it affects a pending decision

### New case study
- [ ] Run `mss-new-case-study-checklist.md` from the top

### Decision log update issued by Claude
- [ ] Download the file
- [ ] Replace the version in `.claude/`
- [ ] Push to GitHub once repo is live

### Context file updated in a session
- [ ] Download the updated file
- [ ] Replace the version in `.claude/`
- [ ] Do not keep both versions — the current one is the only one

---

## Weekly

A 10-minute check. Not a deep review — just a scan.

- [ ] Any Flagged items in the decisions log that can be resolved?
- [ ] Any Open decisions that are now blockers?
- [ ] Any subscriptions due for review? (check `mss-spend-tracker.md`)
- [ ] Any active client work that's stalled — and why?

---

## Periodic — full review cycle

Run when context files are being updated or something significant has changed. Not on a fixed schedule — when it's needed.

- [ ] `mss-decisions-log.md` — does everything locked still reflect current reality?
- [ ] `mss-brand-identity.md` — any visual decisions made that aren't captured here?
- [ ] `mss-tone-of-voice.md` — still accurate? Any new examples worth adding?
- [ ] `mss-website-brief.md` — does it reflect the current build state?
- [ ] `mss-new-client-checklist.md` — does the process still match how you actually work?
- [ ] `mss-new-case-study-checklist.md` — same check
- [ ] `mss-spend-tracker.md` — all current costs reflected?
- [ ] `mss-client-workflow-guide.md` — any prompts improved since last review?
- [ ] `mss-prompt-library.md` — any prompts updated in sessions that haven't been captured here?

---

## Notes

**On the end-of-session habit:** The decisions log only works if it's updated in the moment. A one-line change history entry takes 30 seconds. Doing it a week later means reconstructing what you decided and why — which defeats the point.

**On file versions:** There is one version of each context file. It lives in `.claude/`. When Claude produces an updated version, the old one is replaced — not archived, not renamed. The change history inside each file is the record.

**On the weekly check:** Keep it light. The point is to catch things that are drifting before they become blockers — not to do a full review every week. If nothing needs attention, close the file.
