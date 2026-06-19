# MSS — System Architecture
*The six-layer model: how studio context, brand, and delivery fit together.*
*Extracted from mss-operating-manual.html, originally compiled 12 June 2026.*
*Last reviewed: 19 June 2026*

---

The studio is a layered system. Decisions sit at the bottom and govern everything above them. Knowledge is held in files, capability in skills, process in workflows and checklists, execution in prompts. Tools are the surface you work on, not the system itself.

The single rule that makes the architecture coherent: **nothing above a layer overrides what is locked below it.** If a workflow, a prompt, or a piece of copy contradicts the decisions log or the brand identity, the lower layer wins and the higher layer is wrong, not the other way round.

---

## The six layers

| Layer | Name | What it contains |
|-------|------|-----------------|
| Layer 0 | Source of truth | `mss-decisions-log.md` is canonical for what is locked, open, or flagged. `mss-brand-identity.md` is canonical for every visual decision. When anything disagrees, these two settle it. |
| Layer 1 | Context files | The studio knowledge base: tone of voice, website brief, spend tracker, copy contexts. Attached per session so Claude works from real context, not memory. |
| Layer 2 | Skills | Portable capability that travels across every session: `creative-director`, `copywriting`, `bricks-html-importer`. Skills hold the way of working; files hold the facts. |
| Layer 3 | Workflows & checklists | The process spine: client workflow guide, case study workflow guide, Bricks build guide, and the two tick-list checklists that mirror them. The narrative explains; the checklist verifies. |
| Layer 4 | Prompts | The execution units. Held in `mss-prompt-library.md` and used in sequence through each phase. Filled in with real context every time, never sent with brackets still in them. |
| Layer 5 | Tools | Claude desktop and Claude Code, Bricks Builder on WordPress, Higgsfield, LocalWP, Cloudways, GitHub. The surface. Interchangeable in principle; the layers above are not. |

---

## How conflicts resolve

Two files outrank everything. `mss-decisions-log.md` records what is locked, what is still open, and what is flagged for a check. `mss-brand-identity.md` is the visual canon: palette, type, logo, aesthetic direction. Before treating any decision as settled, confirm it against these. Before treating a file as current, check it has not been superseded in the decisions log change history.

---

## The work spine: two phases, two surfaces

Every engagement and every case study runs along the same spine. Thinking happens in one place, building in another, and the handover between them is deliberate.

**Phase 1 — Claude desktop / web**
Discovery, positioning, copy, creative direction, and the HTML/CSS prototype. Cheaper sessions, where the judgment lives. Nothing builds until the thinking is locked.

**Phase 2 — Claude Code**
Build, migrate to Bricks, GitHub push, publish. Execution only. The skill reloads at the top of every session; copy is pulled from the prototype, never written from memory.

*The mark itself encodes this: vision steps forward (near-black, on top), structure holds underneath (terracotta, behind), and the stage emerges in the negative space where they meet. That is the operating model in a logo.*

---

## Workflows and checklists work as pairs

Each process exists in two forms. The workflow guide is the narrative: what you are doing, the steps, the prompts, and the gate that has to be true before moving on. The checklist is the tick-list version of the same thing, for running through live. Use the guide to understand, the checklist to verify nothing was skipped.

- **Client work:** `mss-client-workflow-guide.md` pairs with `mss-new-client-checklist.md`. Covers scoping through brand expression.
- **Case studies:** `mss-case-study-workflow-guide.md` pairs with `mss-new-case-study-checklist.md`. Covers story through publishing.
- **Build:** `mss-bricks-build-guide.md` pairs with `mss-bricks-quick-fixes.md`. Covers prototype-to-Bricks, plus fast manual fixes.

---

## Note on this extraction

This captures the architectural model only, not the process audit or evaluation sections from the original document. Those were a point-in-time snapshot of what was drifting as of 12 June 2026 — most of what they flagged has since been resolved. The source HTML file is still on disk pending a decision on whether to archive or delete it.
