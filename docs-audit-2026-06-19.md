# MSS Documentation Audit
*Date: 19 June 2026 — Read-only analysis. No files modified.*

---

## 1. INVENTORY

Full inventory of every file in the MSS documentation stack. Files are grouped by location. Line counts are exact from `wc -l`.

---

### 1A — Global Claude Code config: `~/.claude/`

| File | Format | Lines | Purpose |
|------|--------|-------|---------|
| `settings.json` | JSON | ~10 | Global Claude Code config — acceptEdits permission mode, voice hold |
| `settings.local.json` | JSON | ~27 | Per-machine allowlist — 23 approved Bash/file operations |
| `mcp.json` | JSON | ~24 | MCP server endpoints — higgsfield, bricks-mcp (local), bricks-mcp-puremed |
| `mcp-needs-auth-cache.json` | JSON | 1 | OAuth token cache — Google Calendar, Gmail, Google Drive |

**Operational folders (not documentation):** `backups/`, `cache/`, `downloads/`, `file-history/`, `history.jsonl`, `paste-cache/`, `plugins/`, `projects/`, `session-env/`, `sessions/`, `shell-snapshots/`, `tasks/`

---

### 1B — Global skills: `~/.claude/skills/`

| File | Lines | Description |
|------|-------|-------------|
| `bricks-html-importer/SKILL.md` | 230 | Converts HTML prototypes to Bricks via MCP — 7 rules, 5-phase workflow, 8 common pitfalls |
| `bricks-lowcode-skill/SKILL.md` | 433 | Definitive Bricks element/interaction/pattern reference — 6 rules, full element settings, 200+ line interactions library, 9 compound patterns |
| `bricks-mss-site-notes/SKILL.md` | 209 | MSS/Ayesha-specific Bricks quirks — confirmed bugs, overlay pattern, asset optimisation, token efficiency, build checklist |
| `bricks-site-connection/SKILL.md` | 141 | MCP connection setup, session opener, 7 common connection issues |
| `copywriting/SKILL.md` | 135 | Two-layer copywriting system — craft constant, voice context-dependent; quality checklist |
| `copywriting/references/copy-contexts.md` | ~178 | Five copy contexts with examples — First Impression, Discovery, Case Study, Editorial, Proposal |
| `creative-director/SKILL.md` | 43 | Creative direction methods — SIT, TRIZ, SCAMPER, Synectics; 3-axis evaluation, 5-phase process |
| `design-taste-frontend/SKILL.md` | 226 | Senior UI/UX engineer persona — design variance config, React/Next.js patterns, anti-bias directives, creative arsenal |
| `references/builder_guide.md` | large | Snapshot of `get_builder_guide` response — Bricks 7.0 reference. Shared across skills. |

---

### 1C — Auto-memory: `~/.claude/projects/-Users-osmanakhtar/memory/`

| File | Lines | Purpose |
|------|-------|---------|
| `MEMORY.md` | 3 | Index — one entry pointing to project-mss-infra.md |
| `project-mss-infra.md` | 36 | Server IP (159.65.19.91), WP paths, domain note, contact form deploy constraints, git vs SFTP split |

---

### 1D — Repo `.claude` folder: `~/workspace/main-stage-studio/.claude/`

Core context documents loaded into Claude Code sessions:

| File | Lines | Last reviewed | Purpose |
|------|-------|---------------|---------|
| `mss-brand-identity.md` | 146 | — | Logo spec, SVG, 5-colour palette, typography, aesthetic direction |
| `mss-tone-of-voice.md` | 126 | 05 Jun 2026 | Brand character, copy principles, five voice-in-practice examples |
| `mss-website-brief.md` | 167 | 05 Jun 2026 | Website proposition, page structure, locked copy, technical stack, code principles |
| `mss-decisions-log.md` | 231 | 05 Jun 2026 | Locked, open, and flagged decisions with full change history |
| `mss-client-workflow-guide.md` | 361 | 25 May 2026 | 5-phase client engagement playbook with gates and prompts |
| `mss-case-study-workflow-guide.md` | 243 | 02 Jun 2026 | 5-phase case study workflow — story, brief, build, assets, publishing |
| `mss-prompt-library.md` | 309 | 25 May 2026 | Reusable prompts for all MSS and client work, organised by phase |
| `copy-contexts.md` | 178 | 02 Jun 2026 | Five copy context registers with worked examples |
| `mss-new-client-checklist.md` | 106 | — | Checkbox version of client workflow — 8 phases |
| `mss-new-case-study-checklist.md` | 109 | 02 Jun 2026 | Checkbox version of case study workflow — location rules, 5 phases |
| `mss-founder-vision.md` | 60 | 05 Jun 2026 | Private reference — founder identity, influences, AI-as-thinking-partner stance |
| `mss-spend-tracker.md` | 60 | — | Committed and pending costs, Year 1 revenue target |

**Anomalous file:**

| File | Size | Issue |
|------|------|-------|
| `mss-new-client-checklist` (no extension) | 22,916 bytes | Contains decisions-log content, not checklist content. Wrong name or ghost file from a failed write. |

**Repo `.claude` skills subfolder:**

| File | Lines | Note |
|------|-------|------|
| `skills/copywriting/SKILL.md` | 135 | Matches global `~/.claude/skills/copywriting/SKILL.md` |
| `skills/copywriting/copywriting-SKILL.md` | 139 | Updated version — adds empathy layer, updated quality checklist |
| `skills/copywriting/references/` | — | Folder present; contents mirrored from copy-contexts.md |
| `skills/bricks/bricks-html-importer.skill` | binary | ZIP-format binary file — not a readable skill |

---

### 1E — Repo root: `~/workspace/main-stage-studio/`

| File | Lines | Purpose |
|------|-------|---------|
| `CLAUDE.md` | 97 | Master workspace context — streams, session guidance, design principles, stream separation rules |
| `index.html` | 10 | Meta redirect to `01_mss/website/` |
| `.gitignore` | — | Git exclusions |
| `.nojekyll` | — | GitHub Pages Jekyll bypass |

---

### 1F — Strategy folder: `01_mss/strategy/`

**Markdown documents:**

| File | Lines | Purpose |
|------|-------|---------|
| `mss-new-site-deployment-guide.md` | 418 | Canonical deployment guide — 7 phases, Cloudways setup, git deploy, DB migration, SSL, caching architecture |
| `mss-bricks-build-guide.md` | 391 | Two-phase build process — Claude desktop planning, Claude Code execution |
| `mss-bricks-quick-fixes.md` | 236 | Bricks bug catalogue — symptom-to-fix reference |
| `mss-bricks-session-kickoff.md` | 107 | Session setup prompts for Bricks work |
| `mss-build-guide.md` | 421 | Build guide (same line count as v2 — possibly identical) |
| `mss-build-guide-v2.md` | 421 | Build guide version 2 — same line count, relationship to v1 unclear |
| `mss-website-copy-review.md` | 286 | Full website copy review |
| `mss-homepage-audit-bricks.md` | 229 | MSS homepage Bricks audit |
| `mss-deployment-explained.md` | 183 | Deployment process explanation |
| `mss-client-handover-template.md` | 189 | Client handover document template |
| `mss-go-live-checklist.md` | 106 | Pre/post go-live checklist — v0.1, not yet validated against a real go-live |
| `mss-nav-fix-prompts.md` | 74 | Navigation fix prompts |
| `MIGRATION-INSTRUCTIONS.md` | 236 | File/content migration instructions |
| `constraints-template.md` | 58 | Client constraints document template |
| `copywriting-SKILL.md` | 139 | Copy of the copywriting skill — misplaced here |
| `mss-new-client-checklist.md` | 106 | Duplicate of `.claude/mss-new-client-checklist.md` |
| `mss-spend-tracker.md` | 61 | Duplicate of `.claude/mss-spend-tracker.md` |
| `mss-founder-vision.md` | 60 | Duplicate of `.claude/mss-founder-vision.md` |

**HTML documents:**

| File | Lines | Purpose |
|------|-------|---------|
| `mss-build-guide.html` | 1305 | HTML reference version of the build guide — comprehensive |
| `mss-operating-manual.html` | 687 | Comprehensive MSS operating manual |
| `MSS_Architecture_Design_v0.3.html` | 877 | Architecture and design documentation |

**Other:**

| File | Format | Purpose |
|------|--------|---------|
| `Bricks_Workflow_User_Guide.docx` | Word | Bricks workflow documentation |

---

### 1G — Portfolio: `01_mss/portfolio/`

| Path | Files present |
|------|---------------|
| `apex-fc/` | `README.md`, `brand/`, `web/` subdirs |
| `sable/` | `case-study.html`, `brand/`, `web/` subdirs |
| `mss/` | `case-study.html` |

---

### 1H — Website: `01_mss/website/`

| File | Purpose |
|------|---------|
| `index.html` | Main MSS website HTML prototype |

---

### 1I — Clients: `02_clients/`

| Path | Content |
|------|---------|
| `_template/` | Empty scaffold — brand/, deliverables/, design-system/, discovery/constraints.md, web/ |
| `ayesha/` | `brand/artbyayeshajohar_brand_direction.docx`, `brand/ayesha-johar-fonts.html`, `discovery/constraints.md`, `web/ayesha-johar.html` |

---

### 1J — Resources: `03_resources/`

| Path | Content |
|------|---------|
| `assets/` | 40+ assets — WebP/PNG images, MP4/WebM videos, SVGs (MSS mark renders, Sable character set, hero videos) |
| `tools/image-optimiser.html` | Browser-based image optimiser tool |
| `tools/image-optimiser-README.md` | Usage notes for image-optimiser |
| `tools/md-viewer.html` | Browser markdown viewer |
| `tools/video-optimiser-README.md` | Usage notes for video optimiser |
| `tools/video-to-webm.sh` | Shell script for video conversion |
| `tools/Video Optimiser.app` | macOS app for video optimisation (requires FFmpeg) |

---

### 1K — WordPress local site: `~/Local Sites/main-stage-studio/app/public/`

| File | Purpose |
|------|---------|
| `wp-content/mu-plugins/mss-contact.php` | SMTP config (Gmail, plaintext password), REST contact endpoint, form JS handler — SFTP-only deploy, never git |

---

## 2. ALIGNMENT

How well the documentation serves actual working practice.

**Strong alignment:**

- The `.claude/` context files (brand-identity, tone-of-voice, decisions-log, website-brief) are accurate and actively maintained. They reflect the current state of the site and brand.
- The `bricks-lowcode-skill` and `bricks-mss-site-notes` skill pair covers the Bricks workflow thoroughly. The confirmed-bugs section in `mss-site-notes` captures real session learnings.
- `mss-new-site-deployment-guide.md` is the most operationally complete document in the stack — accurately describes the two-layer Cloudways cache architecture, the git vs SFTP split, and the full go-live sequence.
- The copywriting skill's two-layer system (craft constant, voice context-dependent) aligns correctly with `copy-contexts.md` and the five registers described there.
- The `mss-decisions-log.md` is genuinely live — recent update 05 Jun 2026 reflects locked repositioning and flagged open decisions.

**Weak alignment:**

- `CLAUDE.md` describes five streams (`01_mss`, `02_pm-ai`, `03_social`, `04_cookies`, `05_resources`) but the actual repo has three folders (`01_mss`, `02_clients`, `03_resources`). The named streams `02_pm-ai`, `03_social`, `04_cookies` do not exist. This makes CLAUDE.md misleading as a workspace orientation file.
- `CLAUDE.md` states "Client work lives at `~/projects/clients/[name]/`" but actual client work is at `02_clients/ayesha/`. The path is wrong.
- `mss-decisions-log.md` flags "New client checklist outdated" and "Spend tracker needs updating" — both are still present as outdated files in `01_mss/strategy/`. The flagged condition hasn't been cleared.
- `mss-go-live-checklist.md` is marked v0.1 and "not yet validated against a real go-live" but the MSS site did go live — the checklist was never validated and updated after that.
- The `mss-bricks-build-guide.md` describes a two-phase workflow (Claude desktop planning then Claude Code execution) but session practice has shifted to direct Claude Code builds from DB scripts rather than the MCP-first workflow the guide assumes. The guide lags real practice.

---

## 3. OVERLAP

Specific duplicate and near-duplicate files.

**Exact or near-exact duplicates:**

| File A | File B | Status |
|--------|--------|--------|
| `.claude/mss-spend-tracker.md` | `01_mss/strategy/mss-spend-tracker.md` | Duplicate. `.claude/` version is canonical (Claude Code context). Strategy version is stale. |
| `.claude/mss-founder-vision.md` | `01_mss/strategy/mss-founder-vision.md` | Duplicate. `.claude/` version is canonical. |
| `.claude/mss-new-client-checklist.md` | `01_mss/strategy/mss-new-client-checklist.md` | Duplicate. `.claude/` version is canonical. |
| `~/.claude/skills/copywriting/SKILL.md` | `.claude/skills/copywriting/SKILL.md` | Appears to match. See Section 9 for full analysis. |
| `~/.claude/skills/copywriting/references/copy-contexts.md` | `.claude/copy-contexts.md` | Mirrored content. Global skills version references the repo version. |
| `.claude/skills/copywriting/copywriting-SKILL.md` | `01_mss/strategy/copywriting-SKILL.md` | Both are the updated copywriting skill with empathy layer. Two copies of the same file. |

**Unclear relationship (require content comparison):**

| File A | File B | Issue |
|--------|--------|-------|
| `01_mss/strategy/mss-build-guide.md` (421 lines) | `01_mss/strategy/mss-build-guide-v2.md` (421 lines) | Identical line count — may be identical or near-identical. One should be the current version; the other should be deleted or archived. |

**Content in wrong file (ghost file):**

| File | Problem |
|------|---------|
| `.claude/mss-new-client-checklist` (no extension, 22KB) | Contains decisions-log content. Not a checklist. Not readable as markdown by Claude Code tooling. Should be investigated and removed if confirmed corrupt or duplicate. |

**Large HTML files with unclear relationship to markdown equivalents:**

| HTML file | Possible markdown equivalent |
|-----------|------------------------------|
| `mss-build-guide.html` (1305 lines) | `mss-build-guide.md` / `mss-build-guide-v2.md` |
| `mss-operating-manual.html` (687 lines) | No clear markdown equivalent — may predate the current `.claude/` context system |
| `MSS_Architecture_Design_v0.3.html` (877 lines) | No markdown equivalent — v0.3 implies earlier iteration |

These HTML files are not accessible to Claude Code's Read tool in a useful way. Their content relationship to the current documentation is unknown without a manual read.

---

## 4. GAPS

Things that are absent, incomplete, or identified in decisions-log as missing.

**Operational gaps:**

- **No `mss-bricks-quick-fixes.md` in skills.** The `bricks-mss-site-notes` SKILL.md explicitly references `mss-bricks-quick-fixes.md` as the extended symptom table, but that file lives in `01_mss/strategy/` — outside Claude Code's skills loading path. During a Bricks session, Claude Code would need to be explicitly directed to read it; it won't be loaded automatically.
- **`mss-go-live-checklist.md` never validated.** Marked v0.1, not validated against real go-live. The MSS site is now live. The checklist should be reviewed against what actually happened.
- **No post-go-live production ops reference.** The deployment guide covers getting live but not ongoing production operations: routine deployments, DB-only changes via PHP scripts, Breeze cache management in day-to-day use. This workflow now exists in session history but not in any document.
- **`constraints-template.md` flagged missing in decisions-log.** The file exists in `01_mss/strategy/` but is not in `.claude/` and is not referenced in the client workflow guide. It won't be found unless someone knows to look.
- **No `mu-plugins` deploy note in any indexed document.** The production constraint — `mss-contact.php` must be SFTP-deployed, never git — lives only in the auto-memory (`project-mss-infra.md`). It should be in the deployment guide or a dedicated note in `.claude/`.
- **`mss-decisions-log.md` has open decisions unresolved since May 2026:** DAM solution, Higgsfield hero asset, contact form platform, Bricks licence type. No document tracks the status of these against current reality (Cloudways is live, contact form IS deployed).

**Documentation gaps:**

- **No document covering the PHP/DB direct-edit workflow.** Three PHP scripts (`mss-values-section.php`, `mss-local-update.php`, `fix-prod-css-wp.php`) were written during build sessions and sit in `/tmp/`. The pattern of base64-encoded payloads, `$wpdb->update()` vs `update_post_meta()`, and SSH file transfer via stdin redirect is now well-understood — but undocumented. It will need to be re-derived next time.
- **No client-facing document template exists yet for Ayesha.** The `02_clients/ayesha/` folder has brand and discovery files but no constraints document is complete, no design system, no deliverables. The mss-decisions-log flags the Ayesha client template as a blocker.
- **`bricks-mss-site-notes` token efficiency rule 6** ("Reload the relevant skills at the start of every new Claude Code session") implies a session-opening ritual, but there is no single document or checklist that codifies the full session-opening sequence for an MSS Bricks build session. The information is spread across three skills.
- **No index of what's in `03_resources/assets/`.** The folder has 40+ named assets but there is no manifest documenting which asset is which, when it was generated, and what it's for. Finding the right asset in a future session requires browsing filenames.

**CLAUDE.md gaps:**

- Stream table is wrong (see Section 2). No `02_pm-ai/`, `03_social/`, `04_cookies/` folders exist.
- "For Claude desktop" section references `~/projects/mss/.claude/` — this path does not exist. The correct path is `~/workspace/main-stage-studio/.claude/`.

---

## 5. PROPOSED TARGET ARCHITECTURE

Changes to note. No files should be moved until the user has reviewed this section.

**Principle:** Canonical source for Claude Code context belongs in `.claude/` (loaded automatically). Strategy and reference material belongs in `01_mss/strategy/`. Nothing should exist in both unless explicitly mirrored.

---

**Tier 1 — Claude Code context (always loaded): `~/.claude/` and `~/workspace/main-stage-studio/.claude/`**

`~/.claude/settings.json` + `settings.local.json` — fine as-is  
`~/.claude/mcp.json` — fine as-is  
`~/.claude/skills/` — all seven skills. See Section 9 for skill-specific notes.

`.claude/` repo folder — the 12 core context documents — fine. Keep in `.claude/`.

**One addition needed:** `.claude/mss-production-ops.md` — a new file capturing: PHP DB-edit pattern, base64 transfer approach, cache clear sequence, mu-plugins SFTP constraint. This captures session learnings that currently exist only in conversation history or `/tmp/` files.

---

**Tier 2 — Reference and process (read on demand): `01_mss/strategy/`**

Keep:
- `mss-new-site-deployment-guide.md` — canonical deployment reference
- `mss-bricks-build-guide.md` — canonical Bricks build workflow
- `mss-bricks-quick-fixes.md` — extended bug/fix reference
- `mss-bricks-session-kickoff.md` — session prompts
- `mss-go-live-checklist.md` — after validation
- `mss-deployment-explained.md` — explanatory companion to deployment guide
- `mss-client-handover-template.md` — template, keep here
- `constraints-template.md` — move or mirror to `.claude/` so it's found
- `mss-website-copy-review.md` — project artefact, keep
- `mss-homepage-audit-bricks.md` — project artefact, keep
- `mss-nav-fix-prompts.md` — Bricks companion, keep
- `MIGRATION-INSTRUCTIONS.md` — keep

Remove (decisions required — see Section 6):
- `mss-spend-tracker.md` — duplicate of `.claude/` version
- `mss-founder-vision.md` — duplicate of `.claude/` version
- `mss-new-client-checklist.md` — duplicate of `.claude/` version
- `copywriting-SKILL.md` — misplaced skill file; belongs in skills folders
- `mss-build-guide.md` OR `mss-build-guide-v2.md` — one is redundant

Investigate and decide:
- `mss-build-guide.html`, `mss-operating-manual.html`, `MSS_Architecture_Design_v0.3.html` — likely superseded by current `.claude/` context docs. Content comparison needed before removal.
- `Bricks_Workflow_User_Guide.docx` — Word format is not accessible to Claude Code. If content is current, convert to markdown; if superseded, remove.

---

**Tier 3 — Skills: `~/.claude/skills/`**

All seven skills stay in global skills. See Section 9 for the one structural issue.

**Repo `.claude/skills/` subfolder — current state is confusing:**
- `skills/copywriting/SKILL.md` — mirrors global; redundant if global is always available
- `skills/copywriting/copywriting-SKILL.md` — the updated version; should replace the old SKILL.md globally
- `skills/bricks/bricks-html-importer.skill` — binary ZIP, not usable by Claude Code

These three files serve no operational purpose in their current state. The updated copywriting skill should be promoted to the global location; the binary and the old copy removed.

---

**Tier 4 — Auto-memory: `~/.claude/projects/.../memory/`**

Current state is lean (2 files). The production ops information in `project-mss-infra.md` is useful and accurate. The MEMORY.md index only has one entry. As the `.claude/mss-production-ops.md` file is created, the memory system can become a pointer to it rather than a summary of its content.

---

## 6. DECISIONS REQUIRED

Things a human must resolve. No file changes should be made until these are answered.

| # | Decision | Options | Implication |
|---|----------|---------|-------------|
| 1 | **`mss-build-guide.md` vs `mss-build-guide-v2.md`** — which is current? | (a) v2 is newer, delete v1 &nbsp;&nbsp; (b) They diverge, keep both | Need content comparison first |
| 2 | **Three large HTML files** (`mss-build-guide.html`, `mss-operating-manual.html`, `MSS_Architecture_Design_v0.3.html`) — superseded or still useful? | (a) Superseded — delete &nbsp;&nbsp; (b) Extract any unique content → markdown, then delete &nbsp;&nbsp; (c) Archive, don't delete | These can't be loaded by Claude Code tools so they provide no active value unless read manually |
| 3 | **`Bricks_Workflow_User_Guide.docx`** — current? | (a) Convert to markdown &nbsp;&nbsp; (b) Delete if superseded by skills | Word format is not accessible to Claude Code |
| 4 | **Ghost file: `.claude/mss-new-client-checklist`** (no extension, contains decisions-log content) — what is it? | (a) Delete — corrupt/duplicate &nbsp;&nbsp; (b) Investigate origin | 22KB of decisions-log content under a checklist filename; almost certainly a broken write |
| 5 | **Duplicates in `01_mss/strategy/`** — delete the strategy-folder copies of `mss-spend-tracker.md`, `mss-founder-vision.md`, `mss-new-client-checklist.md`? | (a) Delete strategy copies, `.claude/` is canonical &nbsp;&nbsp; (b) Keep both, acknowledge the duplication | No reason to maintain both unless strategy/ is meant as a manual-browse archive |
| 6 | **`copywriting-SKILL.md` in `01_mss/strategy/`** — promote updated version globally? | (a) Update global `~/.claude/skills/copywriting/SKILL.md` with empathy additions from `copywriting-SKILL.md`, then remove the strategy/ copy &nbsp;&nbsp; (b) Leave as-is | The global skill is slightly behind the repo version |
| 7 | **Should `mss-bricks-quick-fixes.md` be accessible as a skill reference?** | (a) Add a pointer to it in `bricks-mss-site-notes` SKILL.md that explicitly instructs Claude to read the file path on demand &nbsp;&nbsp; (b) Migrate its contents into the skill | Currently it's referenced but won't be automatically loaded |
| 8 | **Create `mss-production-ops.md`?** | (a) Yes — document the PHP/DB-edit pattern, base64 transfer, cache management, mu-plugins constraint &nbsp;&nbsp; (b) No — leave in session history | Strong case for yes: three sessions have now used the same pattern; it will be re-derived otherwise |
| 9 | **Open decisions in `mss-decisions-log.md`** — several are stale since site went live: contact form (deployed), Cloudways (live), Bricks licence (required for go-live). Log needs a pass to close these. | Review and update the log | Not a structural decision — just noting it needs a sweep |
| 10 | **`CLAUDE.md` stream table** — update to reflect actual folder structure? | (a) Update immediately &nbsp;&nbsp; (b) Leave until streams are reorganised | Currently describes folders that don't exist; misleads any new session |

---

## 7. FORMAT & ACCESS

How each document is accessed and whether the format is appropriate.

**Claude Code context loading (automatic on session start):**
- `CLAUDE.md` — auto-loaded as system context. Format: markdown. Good.
- `.claude/*.md` files — auto-loaded by Claude Code when in the workspace directory. Format: markdown. Good.
- Skills — loaded via `/skill-name` slash command. Format: markdown with YAML frontmatter. Good.
- Auto-memory (`MEMORY.md`) — auto-loaded. Format: markdown index. Good.

**Claude Code on-demand access (must be explicitly read):**
- `01_mss/strategy/*.md` — readable by Claude Code Read tool. Format: markdown. Accessible but not auto-loaded.
- `01_mss/portfolio/*/case-study.html` — readable but HTML format makes it slower to parse than markdown.
- `02_clients/ayesha/*.html` — same.
- `03_resources/tools/*.html` — browser tools, not Claude Code context.

**Inaccessible to Claude Code (format issues):**
- `*.html` files (strategy folder) — technically readable but 1000+ line HTML files are expensive to load and parse in Claude Code context. Not a practical reference format for session use.
- `*.docx` files — binary format, unreadable by Claude Code tools.
- `*.skill` binary file (bricks-html-importer.skill in repo) — ZIP binary, not readable.
- `03_resources/assets/` — binary media files. No manifest file makes asset discovery manual.

**Browser-only documents (not Claude Code context):**
- `03_resources/tools/image-optimiser.html` — browser tool, correct format for its use.
- `03_resources/tools/md-viewer.html` — markdown renderer, useful for reviewing `.md` files in browser.
- `01_mss/website/index.html` — the prototype. Correct location.

**Recommendations (decisions required — see Section 6):**
- HTML strategy docs: convert key content to markdown or confirm as archive-only.
- DOCX: convert to markdown or delete.
- Binary `.skill` file: replace with readable SKILL.md or remove.

---

## 8. TWO .CLAUDE FOLDERS

Analysis of the global `~/.claude/` and the repo `~/workspace/main-stage-studio/.claude/`.

### What each folder is for

| Folder | Scope | Auto-loaded by |
|--------|-------|----------------|
| `~/.claude/` | All Claude Code sessions, all directories | Claude Code globally |
| `~/workspace/main-stage-studio/.claude/` | Sessions running from the workspace directory | Claude Code when CWD is inside the workspace |

### The intended split

`~/.claude/` should contain:
- Claude Code config (settings, MCP, allowlist)
- Skills that apply across all projects (Bricks, copywriting, creative direction, design)
- Auto-memory

`~/workspace/main-stage-studio/.claude/` should contain:
- MSS-specific strategic context (brand, voice, decisions, prompts, workflows)
- Skills that are MSS-specific — currently only the copywriting skill subfolder

### The actual state

**Global (`~/.claude/`):** Config is clean. Skills folder has 7 skills — all appropriate for global scope. No MSS-specific content that shouldn't be here.

**Repo (`.claude/`):** 12 core context documents, all MSS-specific. Appropriate.  
The skills subfolder (`.claude/skills/`) is the problem:
- `skills/copywriting/SKILL.md` — a copy of the global skill. Redundant.
- `skills/copywriting/copywriting-SKILL.md` — an updated version not yet promoted globally. Creates ambiguity about which version is current.
- `skills/copywriting/references/` — mirrors `copy-contexts.md`. Redundant.
- `skills/bricks/bricks-html-importer.skill` — binary ZIP file. Not usable.

**The copywriting skill has three copies:**
1. `~/.claude/skills/copywriting/SKILL.md` (135 lines) — the globally-loaded version
2. `.claude/skills/copywriting/SKILL.md` (135 lines) — identical, repo-level copy
3. `.claude/skills/copywriting/copywriting-SKILL.md` (139 lines) — updated version with empathy additions

Only one should exist: the updated version at the global location. Decision 6 covers this.

### Does the two-folder split cause problems?

Not currently, because:
- MSS sessions always run from the workspace directory, so both folders load.
- Skills are invoked explicitly by name, so the user controls which copy loads.

It would cause problems if:
- Claude Code sessions run from a different directory (global skills load, repo context doesn't).
- The global copywriting skill is invoked and returns the older version.

**Recommended boundary rule (to note, not implement without decision):**  
`~/.claude/skills/` → craft/tool skills only (Bricks, copywriting principles, design taste, creative direction)  
`~/.claude/` project memory → infrastructure and infra-only facts  
`.claude/` → MSS brand, strategy, workflow context — never duplicated in global

---

## 9. SKILLS

Full analysis of the skills system.

### Global skills (`~/.claude/skills/`)

**Bricks skill cluster — four skills, well-designed hierarchy:**

```
bricks-site-connection      ← Layer 1: how to connect to any site
bricks-lowcode-skill        ← Layer 2: what elements/interactions exist
bricks-html-importer        ← Layer 3: how to convert HTML to Bricks
bricks-mss-site-notes       ← Layer 4: MSS-specific overrides and bugs
```

The hierarchy is explicit — each skill references the others, and `bricks-mss-site-notes` correctly positions itself as additive over the live `get_builder_guide` response, not a replacement.

The relationship between `bricks-lowcode-skill` (433 lines, the largest skill) and `bricks-html-importer` (230 lines) is complementary: lowcode-skill is the reference, importer is the workflow. Both correctly defer to the live builder guide for element details.

**`bricks-mss-site-notes` references `mss-bricks-quick-fixes.md`** for the extended bug table. That file is in `01_mss/strategy/` — not auto-loaded. The skill should either include an explicit `Read` instruction for that path, or the key fixes should be migrated into the skill itself.

**`references/builder_guide.md`** — sits outside any skill folder at `~/.claude/skills/references/`. This is a Bricks 7.0 snapshot. It's used as fallback when live MCP is unavailable. The location is logical but not obvious. No skill explicitly states this path — users would need to know it exists.

---

**`copywriting/SKILL.md`** — 135 lines, well-structured. The two-layer system (craft constant, voice context-dependent) is a sound approach. The `references/copy-contexts.md` companion correctly extends the skill without bloating it.

Issue: the global skill is 135 lines; the updated repo version (`copywriting-SKILL.md`, 139 lines) adds four lines of empathy framing. These four lines are not in the globally-loaded version. Any session invoking `/copywriting` gets the older version unless the user is in the workspace and explicitly loads the repo version. Resolution: Decision 6.

---

**`creative-director/SKILL.md`** — 43 lines, very light. Primarily a methodology reference (SIT, TRIZ, SCAMPER, Synectics, Bisociation) with 3-axis evaluation. It functions as a thinking framework rather than an operational skill. Not currently wired into any MSS workflow document. Potentially high value for brand and strategy sessions but disconnected from the client workflow guide which doesn't reference it.

---

**`design-taste-frontend/SKILL.md`** — 226 lines, highly prescriptive. Configured for React/Next.js with Tailwind — not aligned with the MSS production stack (WordPress + Bricks). Useful for HTML prototype work and potentially for future client web projects, but would need care in Bricks sessions where its React/Next.js defaults don't apply. No MSS workflow document references it or notes the scope limitation.

---

### Repo `.claude/skills/` — redundant and needs cleanup

See Section 8 for full analysis. Short version:
- Remove the `skills/` subfolder from the repo `.claude/` entirely once copywriting skill is consolidated at global level.
- The binary `.skill` file serves no purpose here.

---

### Skills not yet written that would be useful

| Gap | Justification |
|-----|---------------|
| `mss-production-ops` skill or reference | The PHP/DB direct-edit pattern has been used three times. It's now a repeatable workflow without a home. |
| `mss-session-opener` note in `bricks-mss-site-notes` | Token efficiency rule 6 says "reload relevant skills" but there's no explicit ordered list of what to load and in what sequence for an MSS Bricks session. |
| Bricks interactions reference | The interactions library in `bricks-lowcode-skill` is comprehensive but the trigger+action combinations that actually work reliably on this Bricks version/install are not isolated from the theoretical spec. `bricks-mss-site-notes` covers this partially (missing `enterView` trigger bug) but not as a quick-reference table. |

---

## SUMMARY

**Total files audited:** 47 markdown files, 3 HTML strategy documents, 1 DOCX, 1 binary skill, 4 JSON config files, 2 memory files, 40+ media assets.

**Health of the system:** The `.claude/` context layer is well-maintained and accurate. The skills cluster is comprehensive and well-structured. The strategy folder has accumulated duplicates, outdated files, and HTML/Word artefacts that predate the current `.claude/` system.

**Three actions with the highest return:**

1. **Fix `CLAUDE.md`** — the stream table is wrong. Two minutes to update; every new session reads this file first.
2. **Consolidate the copywriting skill** — three copies, one is newer. Promote the updated version globally, remove the two copies.
3. **Create `mss-production-ops.md`** — the PHP/DB-edit pattern is now established practice with no home. Three sessions have derived it. It will be derived a fourth time without a document.

*No files were modified, created, deleted, or moved during this audit.*
