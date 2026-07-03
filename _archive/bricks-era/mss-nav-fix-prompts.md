# MSS — Nav Fix Session Prompts

*Prompts for fixing the MSS header nav and creating the Sable case study header template.*
*Created: 08 June 2026*

---

## Claude desktop — session opener

```
I'm building Main Stage Studio — a digital studio website on WordPress using Bricks Builder, with a Claude Code MCP connection for automated builds.

Read all context files from the project before we start.

Today's session: fix the MSS header nav template in Bricks so it matches the homepage prototype, set correct display conditions so it applies to all MSS pages, then create a separate Sable header template that applies only to the Sable case study page (page ID 60).

The MSS nav uses the MSS brand: parchment background, near-black type, terracotta CTA. The Sable nav reflects Sable's brand identity and is specific to her case study page only.

Before we do anything, I'll paste the current header template structure from Claude Code and the prototype nav HTML so you can produce a diff and task list.
```

---

## Claude Code — session opener

```
Read the bricks-html-importer skill. Call get_site_info and get_builder_guide. Confirm the MCP connection is live. Use MCP tools only — no database queries.
```

---

## Claude Code — check current MSS header template

```
Find the MSS header template in Bricks. Report its current structure — every element and its ID. Also report its current display conditions. Do not make any changes.
```

---

## Claude desktop — produce the diff

Paste the Claude Code response and the prototype nav HTML, then send:

```
Here is the current MSS header template structure: [paste response]. Here is what the nav should look like based on the prototype: [paste the nav HTML from the homepage prototype]. Produce a diff and a task list to bring the Bricks header template in line with the prototype.
```

---

## Claude Code — set MSS header display conditions

```
Update the MSS header template display conditions to apply to all pages except the Sable case study page (page ID 60). Verify the conditions after.
```

---

## Claude Code — create the Sable header template

```
Create a new Bricks header template called 'Sable Header'. Set its display condition to page ID 60 only. Build it using Div elements only, no Containers. Structure: [paste the Sable nav HTML from the case study prototype]. Verify after.
```

---

## Files to have in the project before starting

- `mss-brand-identity.md`
- `mss-tone-of-voice.md`
- `mss-decisions-log.md`
- `mss-bricks-build-guide.md`
- `mss-bricks-quick-fixes.md`

If these are already in the project, the "read all context files" instruction in the session opener covers them automatically.
