# MSS — Claude Code Session Kickoff Prompt
*Bricks Builder build session via bricks-mcp*
*Last updated: 06 June 2026*

---

## Copy this prompt into Claude Code to start the session

```
I'm building the Main Stage Studio website in Bricks Builder on a LocalWP instance.
The bricks-mcp plugin is installed and the MCP server is running.

Connect to Bricks via:
http://main-stage-studio.local/wp-json/bricks-mcp/v1/mcp

Application password: [PASTE YOUR APPLICATION PASSWORD HERE]

The HTML/CSS prototype is at:
~/workspace/main-stage-studio/01_mss/website/index.html

Read the prototype in full before doing anything. Then:

1. Set up global styles in Bricks — colour palette, typography scale, and spacing
   tokens — using the values below. Do not start building pages until global styles
   are confirmed.

2. Build the homepage (index.html) as a native Bricks page with proper structure:
   sections, containers, elements. Not custom code blocks. Every element should be
   visually editable in the Bricks editor after you're done.

3. Build the Work page — portfolio grid, case study cards, same structure.

4. Build each case study framing page. Each has its own creative identity — do not
   inherit MSS global styles for layout or colour. Use the design brief for each.

5. Build each full case study page. Same rule — client's world, not MSS's.

6. Build the Start a Project page — name, email, message form. Low friction.

Tell me what you can see in the prototype before you start. Confirm the page list
and structure before building anything.

---

GLOBAL STYLES — apply these first

Colours:
--color-parchment:  #F5EFE5  (background / large surfaces)
--color-blush:      #E8C9AE  (cards / secondary sections)
--color-terracotta: #BF6B47  (primary accent / CTAs / logo)
--color-ember:      #8C4A2F  (hover / depth)
--color-near-black: #1C1712  (all type / structural elements)

Typography:
Primary (display/headings): Cormorant Garamond, weights 300-400
Secondary (body/UI): Plus Jakarta Sans, weights 300-500
Body: 16px, line-height 1.75, max-width 65ch
Headlines: large, tracked tight, left-aligned — no centred hero

Logo mark SVG (use this, do not substitute):
<svg width="40" height="40" viewBox="0 0 40 40" fill="none"
xmlns="http://www.w3.org/2000/svg">
  <rect x="2"  y="16" width="24" height="22" rx="2.5" fill="#BF6B47"/>
  <rect x="14" y="2"  width="24" height="22" rx="2.5" fill="#1C1712"/>
  <rect x="14" y="16" width="12" height="8"  rx="1.5" fill="#F5EFE5"/>
</svg>

---

CODE PRINCIPLES

- Asymmetric, editorial layouts — no centred hero
- Hardware-accelerated motion only: transform and opacity
- min-h-[100dvh] for full-height sections, not h-screen
- No emoji, no gradient backgrounds, no purple/blue AI aesthetic
- No generic card overuse — use space and borders instead

---

PAGES TO BUILD

1. Home — hero, work grid (2-3 highlights), process, about, contact CTA
2. Work — full portfolio grid, all case studies
3. [Case study framing pages — list from prototype]
4. [Case study full pages — list from prototype]
5. Start a Project — simple form

Read the prototype and confirm the full page list before starting.
```

---

## Notes for the session

**Before running the prompt above:**
- Confirm LocalWP is running (green indicator in LocalWP app)
- Confirm bricks-mcp server is enabled: WP Admin, Settings, Bricks MCP
- Have the Application Password copied and ready to paste in

**If Claude Code asks about case study design briefs:**
Each case study has its own creative identity. If the design brief for a specific
case study is not yet written, tell Claude Code to skip that page and flag it.
Do not let it default to MSS styles.

**If something goes wrong:**
The bricks-mcp plugin has a reset option. You can also delete all Bricks data
from a page and rebuild from scratch — the prototype is always the source of truth.
