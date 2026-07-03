# MSS — Bricks Page Build Guide

*How to build a page in Bricks Builder from an HTML prototype using Claude and Claude Code.*
*Derived from the Sable case study build session, June 2026.*
*Last reviewed: 13 June 2026*

---

## The core principle

Build in two phases. Phase 1 is planning and analysis — done in Claude desktop. Phase 2 is execution — done in Claude Code. Never start Phase 2 without completing Phase 1. The ratio of planning to build time should be roughly equal. Skipping planning costs more tokens in debugging than the planning would have cost.

---

## Tools and skills

| Tool | Role |
|---|---|
| Claude desktop | Planning, analysis, diff, task list, section prompts |
| Claude Code | MCP build execution only |
| Bricks Builder UI | Manual visual fixes — overlays, position, atmospheric images |
| Browser inspect | Fastest diagnostic when something isn't rendering |

**Skill to load in Claude Code:** `bricks-html-importer`

**MCP connection** (already configured in `~/.claude/mcp.json`):
```
Endpoint: http://main-stage-studio.local/wp-json/bricks-mcp/v1/mcp
Auth: Basic bWFpbnN0YWdlc3R1ZGlvOlBpN04gcWtHeiB4M29zIDVXVXAgYWhHQSBpQTRV
```

---

## Phase 1 — Planning (Claude desktop)

Do this before opening Claude Code.

### Step 1: Confirm you are building the right page
Upload both the prototype HTML and the existing Bricks page HTML (if one exists) to Claude desktop. Ask:

> "Confirm these two files are the same page before doing anything else."

If they are different pages, stop. Do not proceed until you have the correct files.

### Step 2: Run the diff
If a Bricks page already exists:

> "Analyse both files and produce a full diff. For each section: what's correct, what's missing, what's wrong, what needs rebuilding. Produce a numbered task list I can work through one prompt at a time."

If building from scratch, skip to Step 3.

### Step 3: Section-by-section task list
For each section in the prototype, produce a build prompt before opening Claude Code. Each prompt should specify:
- Section background colour and position properties
- Overlay div if needed (empty — set manually in Bricks UI after)
- Layout div with grid/flex properties
- Every content element in order with exact copy from the prototype and typography settings
- Where to place the section in the page order

**Always pull copy directly from the prototype file.** Never write copy from memory.

### Step 4: Identify global classes needed
Before building, list every CSS class from the prototype that needs to be applied to Bricks elements for animations to work: `section-label`, `insight-line`, `reveal-img`, `dark-section`, `swatch-row`, etc. These get applied in the pre-animations pass.

---

## Phase 2 — Build (Claude Code)

### Session opener — send this every time

> "Read the bricks-html-importer skill. Then call get_site_info and get_builder_guide. Confirm the MCP connection is live and read the full builder guide response before proceeding. Use only MCP tools for all operations — no database queries, no PHP scripts, no direct HTTP calls."

### Build order

1. **Header template** — build once, applies to all MSS pages. Do not rebuild per page.
2. **Sections 1 to N** — one prompt per section, in order from the prototype.
3. **CSS classes pass** — apply animation trigger classes to elements.
4. **Animations pass** — add page-level CSS and JS as the final step.

### Per-section prompt structure

Every section prompt follows this pattern:

```
"Build [section name] — section [N]. Place it after [previous section].

Section: _background.color.hex: [colour], _position: relative (if contains overlay), _overflow: hidden

[If dark section with atmospheric image:]
Inside the section add an empty overlay Div first — I will set the atmospheric image manually in Bricks UI after.

Layout Div: _width: 100%, _position: relative, _zIndex: 1 (if overlay present),
_cssCustom: #brxe-[id] { padding: clamp(80px,11vh,140px) clamp(24px,5vw,80px); }

Inside the layout Div add [N] elements in order:
[list every element with exact content and property settings]

Verify with page get after every element addition. Report full structure and element IDs when complete."
```

### What Claude Code handles via MCP
- Creating sections, divs, content elements
- Setting background colour via `_background.color.hex`
- Setting typography via `_typography.*` fields
- Setting width, padding, overflow, z-index, position via property fields
- Grid layout via `_cssCustom` (grid-template-columns has no property field)
- Clamp() values via `_cssCustom`
- CSS classes via `_cssClasses`
- Page-level CSS and JS via the `code` tool

### What you handle manually in Bricks UI
- Atmospheric image overlays — set background image, position, size, opacity in the Style panel
- Any position: absolute that isn't rendering via MCP — set via Style > Positioning panel
- Quick colour or typography fixes that are faster to click than to prompt

---

## Overlay div pattern (atmospheric images)

Every dark section has an atmospheric image overlay. The pattern:

**Claude Code creates the structure:**
```
Section (_position: relative)
  └── Div (empty — no styles set by Claude Code)
  └── Div (_width: 100%, _position: relative, _zIndex: 1) [content]
```

**You set the overlay manually in Bricks UI:**
1. Click the empty overlay div in the structure panel
2. Style > Background > Select Image > choose the atmospheric image
3. Set Size: Cover, Position: Right Center
4. Style > Positioning > set Position: Absolute, Top: 0, Right: 0
5. Set Width: 40%, Height: 100%
6. Style > Misc > Opacity: 0.18, Pointer Events: None

**Important:** The parent section must have Position: Relative set via the Bricks UI Style panel, not just via custom CSS. Verify this after setting the overlay.

---

## CSS classes pass

Before adding animations, apply all trigger classes to their elements. One prompt:

> "Apply the following CSS classes via `_cssClasses` property field. Do not change any other settings.
>
> Add `section-label` to every section label text element.
> Add `insight-line` to [element ID].
> Add `sable-wordmark-specimen` to [element ID].
> Add `swatch-row swatch-delay-0` through `swatch-delay-4` to the five swatch rows.
> Add `reveal-img` to all images that should animate on scroll.
> Add `dark-section` to all dark sections.
>
> Verify all classes applied after."

---

## Animations pass

This is always the final step, after all sections are structurally complete and visually verified.

> "The page structure is final and locked. Do not move, delete, or restructure any existing elements.
>
> Add page-level CSS and JavaScript using the code tool only. Use the exact content from the prototype file at [path].
>
> Step 1: Extract the full style block and add as customCss.
> Step 2: Extract font import links and add as customScriptsHeader.
> Step 3: Extract the full script block, wrap in script tags, update all element ID references to match current page IDs, and add as customScriptsBodyFooter.
>
> Read each field back after writing to verify. Report any IDs that could not be mapped."

---

## Critical rules — code elements

These rules were learned the hard way across multiple failed builds. Follow them without exception.

**Rule 1: Use cssCode and javascriptCode, not the generic code field.**
The generic `code` field in Bricks 2.3.6 requires an internal signature. Without it, content renders as a `<pre>` text block regardless of `executeCode`. Always use `cssCode` for styles and `javascriptCode` for scripts when building via MCP.

**Rule 2: Set executeCode at creation time.**
`executeCode: true` must be included in the element's settings object when the element is created. Setting it via a separate `element:update` call after creation is unreliable — it frequently fails silently or gets dropped on the next template write.

**Rule 3: Verify bricks_global_settings exists before building.**
Bricks will not execute any code elements if `bricks_global_settings` is missing from `wp_options`. This row can be accidentally deleted by cache-clear SQL that uses `LIKE 'bricks_global_settings%'` — it matches the settings row as well as transients. At the start of any build session involving code elements, verify:

```php
$settings = get_option('bricks_global_settings');
// Must exist and contain executeCodeEnabled: true
```

If missing, create it:
```php
update_option('bricks_global_settings', ['executeCodeEnabled' => true]);
```

**Rule 4: Never use LIKE 'bricks_global_settings%' in SQL.**
Always target transients specifically:
```sql
DELETE FROM wp_options 
WHERE option_name LIKE '_transient_bricks%' 
OR option_name LIKE '_transient_timeout_bricks%'
```

---

## Header template meta key rules

Bricks header templates use a different meta key than pages and standard templates.

| Context | Meta key |
|---|---|
| Pages and standard templates | `_bricks_page_content_2` |
| Header templates (front end rendering) | `_bricks_page_header_2` |
| Bricks editor display | `_bricks_page_content_2` |

MCP tools write to `_bricks_page_content_2`. For header templates, this means the editor will show the elements but the front end will not render them until `_bricks_page_header_2` is also populated.

After every MCP build on a header template, run this PHP one-shot:
```php
$content = get_post_meta(TEMPLATE_ID, '_bricks_page_content_2', true);
update_post_meta(TEMPLATE_ID, '_bricks_page_header_2', $content);
```

Keep both keys in sync. Any PHP fix that modifies element data must write to both keys.

---



When something isn't rendering, inspect before prompting. Right-click the problem element in the browser preview and hit Inspect. Paste the HTML block into Claude desktop.

This is always faster than diagnostic prompts. The rendered HTML shows exactly what Bricks output — if a div is empty, the CSS didn't apply. If a background image is missing from the HTML, it wasn't set. One inspect paste gives a definitive answer.

**What to look for:**
- Empty div with no inline styles → property fields not applied, set manually in Bricks UI
- Section with no background colour in HTML → set via Bricks UI Style panel directly
- Absolutely positioned element bleeding outside its parent → parent section missing `position: relative` in Bricks UI

---

## Diagnostic decision tree

```
Something isn't rendering correctly
│
├── Inspect the element first
│     └── Empty div / no inline styles?
│           └── Set manually in Bricks UI — property fields not applied via MCP
│
├── Image not showing?
│     └── Check image source URL is a valid WP media library URL
│           └── Check container has explicit height or the image has width: 100%
│
├── Section wrong colour?
│     └── Set background directly in Bricks UI Style panel
│           └── Do not rely on _cssCustom for background on sections
│
├── Content centred unexpectedly?
│     └── Inner layout div missing _width: 100%
│           └── Add it via property field or manually in Bricks UI
│
├── Overlay bleeding into adjacent section?
│     └── Parent section missing position: relative
│           └── Set via Bricks UI Style > Positioning — not custom CSS
│
└── Spent 3+ prompts debugging the same element?
      └── Delete and rebuild from scratch using the correct pattern
            └── A clean rebuild costs fewer tokens than continued debugging
```

---

## Token efficiency rules

1. **Plan in Claude desktop, build in Claude Code.** Desktop sessions are cheaper. Do all analysis and prompt preparation here.
2. **One section per Claude Code prompt.** Never ask Claude Code to build multiple sections in one prompt.
3. **Inspect before prompting.** One inspect paste is faster than three diagnostic prompts.
4. **Delete and rebuild after three failed fixes.** Continued debugging on a broken element costs more than a clean rebuild.
5. **Keep the prototype file accessible.** Re-upload it to the desktop session if it drops out of context. Never let Claude write copy from memory.
6. **Reload the skill at the start of every new Claude Code session.** Add "Read the bricks-html-importer skill" to every session opener.
7. **Structural changes only in Claude Code, visual fixes in Bricks UI.** Don't burn tokens trying to fix overlay positions via MCP when the Bricks UI takes 10 seconds.

---

## Common failure patterns and fixes

| Pattern | Cause | Fix |
|---|---|---|
| `Section > Code` for all content | Claude ignored element mapping | Delete page, rebuild with skill loaded |
| Content centred on page | Inner div missing `_width: 100%` | Add manually in Bricks UI width field |
| Dark section appearing parchment | Background not applied via MCP | Set background in Bricks UI Style panel |
| Text invisible on dark section | Text colour not applied via MCP | Set colour in Bricks UI or add to `_cssCustom` with `#brxe-[id]` selector |
| Overlay bleeding into adjacent section | Parent section missing `position: relative` | Set via Bricks UI Style > Positioning |
| JS rendering as visible text | Script block missing `<script>` tags | Wrap in script tags, verify by reading field back |
| Atmospheric image not showing | Div has no rendered inline styles | Set background image manually in Bricks UI |
| Wrong copy in built sections | Claude wrote from memory | Re-upload prototype, run correction prompt with exact copy |
| Code element renders as `<pre>` text | Wrong field used — `code` field requires a Bricks signature | Use `cssCode` and `javascriptCode` fields instead of the generic `code` field |
| Code element renders as empty div | `executeCode: true` not set on the element | Set `executeCode: true` at creation time, never as a separate update |
| All code elements failing site-wide | `bricks_global_settings` row missing from `wp_options` | Run PHP: `update_option('bricks_global_settings', ['executeCodeEnabled' => true])` |
| Header template not rendering on front end | Data written to `_bricks_page_content_2` not `_bricks_page_header_2` | After any MCP build on a header template, copy content to header via PHP one-shot script |
| Header template empty in Bricks editor | Bricks editor reads `_bricks_page_content_2`, front end reads `_bricks_page_header_2` | Both keys must be kept in sync — write to both after every PHP fix |
| bricks_global_settings deleted by cache clear | SQL using `LIKE 'bricks_global_settings%'` matches and deletes the settings row | NEVER use that LIKE pattern in cache-clear SQL — target transients only with `LIKE '_transient_bricks%'` |

---

## Page build checklist

Run before calling a page complete.

### Structure
- [ ] All sections use Container for layout wrappers — not Div (empty overlay divs in dark sections are the exception: they stay as Div)
- [ ] No Code elements used for content
- [ ] Every section has correct background colour set
- [ ] Every inner layout div has `_width: 100%`
- [ ] Dark sections have `dark-section` CSS class applied
- [ ] No orphaned elements in the page tree

### Content
- [ ] All copy matches the prototype exactly
- [ ] All images are pointing to WP media library URLs
- [ ] All links have correct hrefs
- [ ] Section label CSS class applied to all label elements
- [ ] Reveal-img class applied to all animated images

### Overlays
- [ ] All dark sections have overlay div created
- [ ] Atmospheric image set manually on overlay div in Bricks UI
- [ ] Parent sections have `position: relative` set in Bricks UI
- [ ] Overlay div has correct position, width, height, opacity set in Bricks UI

### Animations
- [ ] Page-level CSS added via `code` tool
- [ ] Font imports added to `customScriptsHeader`
- [ ] JS added to `customScriptsBodyFooter` with `<script>` tags
- [ ] All element IDs in JS updated to current page IDs
- [ ] Scroll animations firing on preview
- [ ] Dark section reveals working on scroll
- [ ] Page saved as draft — not published

---

## Asset optimisation — images and video

All raster images and video must be optimised before uploading to WordPress. This is a pre-build step, not an afterthought.

### Images

Use the browser-based image optimiser at `03_resources/tools/image-optimiser.html`.

- Output format: WebP at 80% quality (default — do not change unless there is a specific reason)
- Run every PNG, JPG, or raster image through this before it goes into the WordPress media library
- SVGs are exempt — never convert SVGs, keep them as SVG
- File names are preserved with the extension swapped: `hero.jpg` becomes `hero.webp`

**Resize settings for web:**

| Image type | Max dimension |
|---|---|
| Full-width hero images | 1920px |
| Wide section images | 1440px |
| Standard content images | 1280px |
| Card thumbnails | 800px |
| Small UI images | 600px |

### Video

Use the Automator drag-and-drop app at `03_resources/tools/Video Optimiser.app`.

- Output format: WebM (VP9)
- Drag any `.mov` or `.mp4` onto the app icon in Finder — output lands in the same folder as the source
- Use for: Higgsfield exports, client video, any ambient or hero video going into WordPress
- Exception: if a video is also being delivered directly to a client as a file (not just used on the site), keep the original format alongside the WebM

**The app requires FFmpeg installed via Homebrew.** If it opens and closes with no output, run `which ffmpeg` in Terminal to confirm the path.

### WordPress upload order

1. Optimise image or video using the tools above
2. Upload the optimised file to the WordPress media library
3. Never upload raw camera exports, Higgsfield originals, or uncompressed PNGs directly

---

## Updating the skill

When a new failure pattern is discovered or a better approach is found, update the `bricks-html-importer` skill before the next build. The skill is the institutional memory — if it's not in the skill, the next session will repeat the same mistakes.

To update: bring the finding to Claude desktop, describe what went wrong and what the correct approach is. Claude will update the skill and repackage it.

The skill lives at: `~/.claude/skills/bricks-html-importer/`
