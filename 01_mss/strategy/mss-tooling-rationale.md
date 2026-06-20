# MSS — Tooling Rationale

*Why we use the tools we use.*
*Extracted from Architecture Design v0.3 (May 2026). Superseded sections noted inline.*
*Last reviewed: 20 June 2026*

---

## Why Bricks Builder

**Platform:** WordPress (self-hosted, wordpress.org) + Bricks Builder

Developer-grade visual builder with clean code output, class-based styling, and a Webflow-like workflow on WordPress infrastructure. No platform lock-in — if Bricks ceased trading, WordPress sites continue to function. Committed tooling for all Main Stage Studio client delivery.

**vs Framer**

Framer offers faster prototyping for simple brochure sites, but introduces platform dependency and limits infrastructure control. Bricks on WordPress aligns with Main Stage Studio's technical depth, agency growth ambitions, and AWS foundational knowledge.

**vs Elementor**

Bricks produces cleaner code, is faster, and is better suited to a professional agency delivery model. Elementor's larger ecosystem is not a sufficient trade-off.

---

## Why HTML prototyping

**Tool:** HTML prototypes (Claude-assisted), delivered via GitHub Pages

Prototypes are pushed to the existing GitHub repo and served as a live public URL at zero cost. No CMS, no hosting overhead, no infrastructure required. The URL stays stable across iterations — push updates, client refreshes.

**Why not Figma?**

Not in the current stack. Future milestone triggered by client scale or engagement complexity. Saves £144/year at current stage. Revisit when a client needs more complex design handoff or when engagement complexity makes it worth the overhead.

**Why not a CMS prototype?**

Explicitly not required at this stage. Client content edits during review are handled directly by MSS. Revisit only when a client needs to self-manage content during the review phase.

**Why it works**

Proven in client engagement. Lightweight, browser-renderable, no tooling overhead. Serves as functional spec for the Bricks build — the prototype is the brief.

---

## Why Cloudways / DigitalOcean

**Provider:** Cloudways (managed cloud) on DigitalOcean — London region

- UK data residency, GDPR alignment
- Managed infrastructure layer — Cloudways handles the server, MSS handles WordPress
- Multiple WordPress installs on one server, each with its own domain, database, and file system — no artificial site limits
- Scales linearly by resizing the server, not migrating platforms
- No long-term contract, monthly billing
- Entry cost: approx. £10–12/month for a single small server (1GB RAM comfortably handles 3–5 low-traffic brochure sites)
- Compatible with AWS foundational knowledge — avoids the architectural debt of cheap shared hosting

**Why not cheap shared hosting?**

Avoided by design. Shared hosting carries architectural debt that becomes a migration cost later. Cloudways removes the infrastructure management overhead while retaining full flexibility over the WordPress layer.

---

## Client hosting options

Two models. Decision is made per engagement.

| Option | Description | Best for |
|--------|-------------|----------|
| **Option A — Hosted by MSS** (default) | Client sites on MSS Cloudways account. Full environment control. Simpler setup per engagement. Bundleable into retainer pricing. MSS carries hosting cost and responsibility. | Early-stage clients, low-overhead projects |
| **Option B — Client's own hosting** | Client procures and owns their hosting. Clean separation — no dependency on MSS. Client owns infrastructure fully. More setup friction per engagement. | Established clients with technical resource |

Option A is the current default. Option B to be offered as client sophistication increases.

---

## Bricks Builder licence tiers

Licensed per live production site. Local and staging environments do not count against licence limits. Upgrades are prorated — no cost is wasted when moving between tiers.

| Tier | Sites | Cost | Notes |
|------|-------|------|-------|
| Starter | 1 | $79/year | Insufficient — two live sites required from outset |
| Business | 3 | $149/year | Minimum viable tier — was the planned starting point |
| Agency | Unlimited | $249/year | Target tier as client base grows beyond 3 live sites |
| Ultimate Lifetime | Unlimited | $599 once | Best long-term value if committed to stack |

~~**Planned tier: Business ($149/year)**~~ **Superseded June 2026:** Lifetime licence purchased. Unlimited sites, no annual renewal. See decisions log (17 June 2026). The tier table above is kept for historical context — it documents why Lifetime was the right call once commitment to the stack was confirmed.

---

## Local development

**Tool:** LocalWP (free)

Full WordPress environment running locally. All site builds begin here before going live. No hosting cost during the build phase. Local and staging environments do not count against Bricks licence limits.

---

## ~~Claude Code as a future capability~~

*Superseded — see note.*

The original architecture document (May 2026, Section 3.5) recorded Claude Code integration as "Not in use. Deferred until stack is proven manually." The stated reason: the Bricks JSON schema was undocumented and version-sensitive, and direct database writes carried risk of silent content failures.

**This is no longer the position.** Claude Code is now the active build environment. The Bricks MCP plugin provides a proper API surface — Claude Code connects via HTTP, not direct database writes, which resolves the risk that caused the original deferral. The four-skill system (`bricks-site-connection`, `bricks-lowcode-skill`, `bricks-html-importer`, `bricks-mss-site-notes`) was added 19 June 2026.

The original deferral reasoning is preserved here because it explains what changed: the Bricks MCP plugin was the missing piece.

---

## Source and version note

Extracted from `01_mss/strategy/MSS_Architecture_Design_v0.3.html` (May 2026, draft). The source file also contained:

- **Section 7 — PureMed as "first project for Main Stage Studio"** — not carried forward. PureMed is a standalone personal project, not an MSS client. Studio structure confirmed as single studio on 17 June 2026. See decisions log (Positioning).
- **Section 5.2 — committed annual spend table** — not carried forward. `mss-spend-tracker.md` is the live source for costs.
- **Section 8 — open decisions table** — not carried forward. All items from that table are already reflected in the decisions log.

Source file status: pending deletion decision (docs audit item 2, Flagged in decisions log).
