# Queue format

One file per draft: `YYYY-MM-DD-short-slug.md`, named after its source inbox item.

```markdown
---
pillar: process-transparency | case-study | studio-philosophy | brand-visual
source: inbox/2026-08-18-review-gate-catch.md
status: draft | approved | posted
created: 2026-08-18
posted_date:
posted_url:
---

The drafted post copy, ready to paste into LinkedIn once approved.
```

Lifecycle:
- **draft**: freshly generated, needs Osman's read and edit.
- **approved**: copy is final, waiting to be posted.
- **posted**: on LinkedIn. Fill in `posted_date` and `posted_url` when this happens, both as a record and so the cadence (1/week) is easy to check at a glance.

Nothing skips a stage. A file never goes straight from `draft` to `posted`.
