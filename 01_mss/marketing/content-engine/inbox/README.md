# Inbox format

One file per idea: `YYYY-MM-DD-short-slug.md`. Raw material only, no need to shape it into a post; that's the drafting step's job.

```markdown
---
pillar: process-transparency | case-study | studio-philosophy | brand-visual
---

Whatever's in your head: a bullet list, a voice-note transcript, a paragraph
about something that happened this week. The more concrete the detail
(what actually happened, what the client said, what the mistake would have
been), the better the draft that comes out of it.
```

Drop the file, then ask Claude to draft from it using the matching prompt in `../prompts/`.
