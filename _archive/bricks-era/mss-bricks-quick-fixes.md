# MSS — Bricks UI Quick Fixes

*Fast manual fixes for common issues. Do these in the Bricks editor before burning a Claude Code prompt.*
*Last reviewed: 13 June 2026*

---

## Content centred on page / div not full width

**Symptom:** Text or content sits in the middle of the section instead of left-aligned.

**Fix:**
1. Click the inner layout div in the structure panel
2. Style > Sizing > Width — type `100%`
3. Style > Spacing > Margin — confirm left margin is blank or 0, not auto

---

## Section background colour not showing

**Symptom:** Section renders as parchment despite dark background being set.

**Fix:**
1. Click the section in the structure panel
2. Style > Background > Background colour — set hex value directly here
3. If it still doesn't show, scroll to CSS > Custom CSS and add: `%root% { background: #1C1712; }`

---

## Text invisible on dark section

**Symptom:** Text exists in the structure panel but can't be seen on the page.

**Fix:**
1. Click the text element
2. Style > Typography > Colour — set to `#F5EFE5` (parchment) for body text, `#BF6B47` (terracotta) for labels
3. If the entire section's text needs updating, add to the section's Custom CSS: `%root% { color: #F5EFE5; }`

---

## Atmospheric image overlay not showing

**Symptom:** Overlay div exists in structure panel but renders as empty / invisible.

**Fix:**
1. Click the overlay div in the structure panel
2. Style > Background > Background Image > Select Image — choose the atmospheric image from the media library
3. Set Background Size: Cover
4. Set Background Position: Right Center
5. Style > Positioning > Position: Absolute, Top: 0, Right: 0
6. Style > Sizing > Width: 40%, Height: 100%
7. Style > Misc > Opacity: 0.18, Pointer Events: None
8. Click the parent section — Style > Positioning > Position: Relative

---

## Atmospheric image bleeding into adjacent section

**Symptom:** Overlay image extends beyond its section into the section above or below.

**Fix:**
1. Click the parent section (not the overlay div)
2. Style > Positioning > Position — set to Relative
3. If already set to Relative and still bleeding, also check: Style > Misc > Overflow — set to Hidden

---

## Image not displaying in its container

**Symptom:** Image element exists, source URL is valid, but nothing shows.

**Fix in order:**
1. Click the image element — Style > Sizing > Width: 100%
2. Click the parent container div — Style > Sizing > Height — if blank, add a min-height (e.g. 400px) or set to 100%
3. If the parent is a grid/flex column with no explicit height, add to the parent div's Custom CSS: `#brxe-[id] { min-height: 400px; }`
4. If using object-fit cover, ensure the image has height: 100% set in Custom CSS

---

## Two-column layout stacking vertically instead of side by side

**Symptom:** Columns appear stacked instead of side by side.

**Fix:**
1. Click the layout div (parent of the two columns)
2. Style > Layout > Display — confirm it is set to Grid or Flex
3. If Grid: check Custom CSS for `grid-template-columns` — add `#brxe-[id] { grid-template-columns: 1fr 1fr; }` if missing
4. If Flex: Style > Layout > Direction — set to Row

---

## Section label or text appearing centred instead of left

**Symptom:** Heading or text is centred despite no alignment being set.

**Fix:**
1. Click the text element
2. Style > Typography > Text Align — set to Left
3. If the issue is the element itself being centred in its parent: Style > Spacing > Margin Left — set to 0

---

## Image with wrong aspect ratio / squashed or stretched

**Symptom:** Image looks squashed, stretched, or cropped incorrectly.

**Fix:**
1. Click the image element
2. Style > Sizing > Object Fit — set to Cover (for fill) or Contain (for full image)
3. Add to image Custom CSS: `#brxe-[id] { object-fit: cover; }`
4. Ensure the parent div has a defined height or aspect-ratio

---

## Copy a div with its styles to another section

**Symptom:** Need to duplicate an overlay div or styled component into a new section.

**Fix:**
1. Right-click the element in the structure panel
2. Select Copy
3. Click the destination section in the structure panel
4. Right-click > Paste
5. Drag to correct position within the section if needed (should be position 0 for overlay divs)

---

## Nav link hover underlines not appearing

**Symptom:** Nav links have no underline animation on hover.

**Fix:**
Check the page-level CSS is loaded correctly — the nav hover animation is in `customCss`. If missing, the JS for the nav scroll behaviour (`nav-scrolled` class) may not be running either. Check `customScriptsBodyFooter` is present and has `<script>` tags.

---

## Dark section not revealing on scroll

**Symptom:** Dark section stays covered by parchment overlay and never reveals.

**Fix:**
1. Confirm the section has the `dark-section` CSS class applied — click section, Style > CSS Classes
2. Confirm the JS IntersectionObserver references the correct `brxe-` ID for this section
3. Confirm `customScriptsBodyFooter` is present and wrapped in `<script>` tags
4. Hard refresh the preview page (Cmd+Shift+R) — the editor preview sometimes lags behind

---

## Page-level JS rendering as visible text on page

**Symptom:** JavaScript code appears as visible text at the bottom of the page.

**Fix:**
This is in WordPress admin, not the Bricks editor.
1. Go to WP Admin > Pages > Edit the page (standard editor)
2. Find the custom scripts body footer field
3. Confirm the JS is wrapped in `<script>` and `</script>` tags
4. Save and refresh

---

## Section order wrong after a rebuild

**Symptom:** A newly built section appears at the top or bottom of the page instead of in the correct position.

**Fix:**
1. In the Bricks structure panel, drag the section to the correct position
2. Or: Claude Code prompt — "Move section `brxe-[id]` to after section `brxe-[id]`. Verify page order after."

---

## Element overflows right edge on mobile — desktop bleed margin not scoped

**Symptom:** A heading or container is clipped at the right edge of the screen on mobile. The element's left edge aligns correctly but the text runs off to the right and is cut off.

**Cause:** A negative right margin (e.g. `margin-right: -160px`) applied for a desktop typographic bleed effect has no mobile breakpoint override. On mobile the element is 100% wide and the negative margin pushes it 160px past the viewport edge.

**Fix — via MCP (`element:update`):**
Add `_cssCustom` to the element:
```
"_cssCustom": "@media (max-width:767px){#brxe-{id}{margin-right:0!important;max-width:100%;}}"
```
Replace `{id}` with the element's Bricks ID.

**Note:** Setting `right:mobile_portrait: "0"` inside the `_margin` property object via MCP does not generate CSS reliably on this install. Use `_cssCustom` for mobile margin overrides.

**Fix — manually in the Bricks editor:**
1. Select the element
2. Switch to the mobile portrait breakpoint (phone icon in the toolbar)
3. Style > Spacing > Margin Right — set to `0`

---

## Content overflowing section / horizontal scrollbar on page

**Symptom:** Content bleeds beyond the right edge of the viewport. Sections or elements appear side-by-side when they should stack, or a horizontal scrollbar appears.

**Cause:** Bricks's frontend CSS sets `width:1100px` on every `.brxe-container` element by default. When containers are placed inside custom grid or narrow flex columns (via class-based CSS in `customCss`), they stay at 1100px and overflow their column.

**Fix — in page CSS (`code:set_page_css`):**
```css
/* Override Bricks default width:1100px on all containers within your page sections */
.section-a .brxe-container,
.section-b .brxe-container {
  width: 100% !important;
  max-width: none;
}
/* Then restore max-width on any intentional centering containers */
.section-a .my-inner-wrapper { max-width: 1200px !important; }
```

**Watch out:** the `width:100%!important` override will also hit any small fixed-size containers (e.g. icon circles, dot markers). Add specific overrides for those AFTER the broad rule — same specificity, later in cascade wins:
```css
.section-a .icon-circle { width: 40px !important; height: 40px !important; flex-shrink: 0 !important; }
```

---

## Class-based section padding ignored / sections have no breathing room

**Symptom:** Section padding set via CSS class (e.g. `.my-section { padding: 80px 0 }`) has no effect. All sections appear flush with no spacing between them.

**Cause:** Bricks generates inline ID-selector CSS for every section element: `#brxe-{id} { padding: 0 }`. ID selectors (specificity 0,1,0,0) always beat class selectors (0,0,1,0) regardless of order, so the Bricks-generated zero overrides your class padding.

**Fix — add `!important` to section padding in page CSS:**
```css
.my-section { padding-top: 80px !important; padding-bottom: 80px !important; }
```
Left/right padding on sections is normally intentionally zero (side padding comes from inner containers), so only top/bottom needs `!important`.

**Alternative fix:** Set padding via Bricks element property fields (`_padding`) instead of class CSS. Bricks then generates `#brxe-{id} { padding: 80px 0 }` itself and there's no conflict.

---

## Quick colour reference

| Colour | Hex | Use |
|---|---|---|
| Parchment | `#F5EFE5` | Default background, light text on dark |
| Blush | `#E8C9AE` | Cards, dividers, subtle borders |
| Terracotta | `#BF6B47` | Section labels, accents, CTAs |
| Ember | `#8C4A2F` | Hover states, depth |
| Near black | `#1C1712` | Dark section backgrounds, body text |
| Sable bone | `#F0E8D8` | Sable palette — warm white |
| Sable night | `#0D0C0B` | Sable palette — deep black |
| Sable gold | `#C89442` | Sable palette — gold accent |

---

## Code elements not executing — site-wide

**Symptom:** All code elements across the site render as empty divs or `<pre>` text blocks. executeCode is set to true on elements but nothing executes.

**Cause:** The `bricks_global_settings` row is missing from `wp_options`. This happens when a cache-clear SQL query uses `LIKE 'bricks_global_settings%'` which matches and deletes the settings row itself.

**Fix:**
Run this PHP one-shot script via Claude Code:
```php
update_option('bricks_global_settings', ['executeCodeEnabled' => true]);
$val = get_option('bricks_global_settings');
echo json_encode($val);
```
Confirm `executeCodeEnabled` is `true` in the output.

**Prevention:** Never use `LIKE 'bricks_global_settings%'` in cache-clear SQL. Target transients only:
```sql
DELETE FROM wp_options 
WHERE option_name LIKE '_transient_bricks%' 
OR option_name LIKE '_transient_timeout_bricks%'
```

---

## Code element renders as `<pre>` text block

**Symptom:** A code element's HTML content appears as visible raw text on the page instead of rendering.

**Cause:** The `code` field in Bricks 2.3.6 requires an internal signature to execute. Content added via MCP or PHP without the signature is treated as display-only.

**Fix:**
In the Bricks editor, click the code element, go to Content tab, and confirm Execute Code is toggled on (yellow). If it is on but still rendering as text, the signature is missing — delete the element and rebuild it directly in the Bricks UI with Execute Code on from the start.

---

## Header template not rendering on front end

**Symptom:** Header template has elements confirmed in the database but nothing appears on the front end.

**Cause:** Bricks header templates read from `_bricks_page_header_2`. MCP writes to `_bricks_page_content_2`. If only the content key is populated, the front end sees nothing.

**Fix:**
Run this PHP one-shot script via Claude Code:
```php
$content = get_post_meta(POST_ID, '_bricks_page_content_2', true);
update_post_meta(POST_ID, '_bricks_page_header_2', $content);
$check = get_post_meta(POST_ID, '_bricks_page_header_2', true);
echo count(json_decode($check)) . ' elements in header key';
```
Replace `POST_ID` with the template post ID. After running, hard refresh the front end.
