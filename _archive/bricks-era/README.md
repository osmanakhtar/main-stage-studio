# Archive — Bricks era

*Archived 3 July 2026 during the Astro migration cleanup.*

These documents cover the WordPress + Bricks Builder build workflow that MSS
retired on 25 June 2026 (Bricks subscription cancelled and refunded 27 June).
New builds use Astro static sites on Cloudways — see
`01_mss/strategy/mss-astro-cloudways-setup.md` and the decisions log.

Kept for reference only. Nothing in here should be treated as current process.

## Still live elsewhere (deliberately NOT archived)

The MSS production site remains WordPress + Bricks on Cloudways until the
Astro cutover completes. Until then, these stay active:

- `.claude/mss-production-ops.md` — live-site safety rules
- `01_mss/strategy/mss-new-site-deployment-guide.md` — cache handling source of truth
- `01_mss/strategy/mss-deployment-explained.md` — companion to the above
- Global `bricks-*` skills in `~/.claude/skills/` — needed for production fixes

When the MSS site itself moves to Astro, those can join this archive.

## Contents

| File | What it was |
|---|---|
| `mss-bricks-build-guide.md` | Prototype-to-Bricks build workflow |
| `mss-bricks-quick-fixes.md` | Fast manual Bricks fixes |
| `mss-bricks-session-kickoff.md` | Claude Code session opener for bricks-mcp builds |
| `mss-build-guide-v2.md` | End-to-end build guide (already superseded 19 June) |
| `mss-go-live-checklist.md` | LocalWP → Bricks → Cloudways go-live sequence |
| `mss-homepage-audit-bricks.md` | Bricks homepage audit |
| `mss-nav-fix-prompts.md` | One-off header nav fix session prompts (June 2026) |
