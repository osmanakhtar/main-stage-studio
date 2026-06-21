
⏺ You are continuing the build of the Main Stage Studio WordPress/Bricks
  homepage.
  Your job is to audit the HTML prototype against what's currently rendering in
  Bricks,
  identify every gap, and fix them all so the Bricks page matches the prototype
  exactly.

  ---

  ## PROTOTYPE (source of truth)
  /Users/osmanakhtar/workspace/main-stage-studio/01_mss/website/index.html

  Read this file in full before doing anything else. It is the authoritative
  reference
  for layout, copy, spacing, colours, animations, and interactions.

  ---

  ## BRICKS SITE
  http://main-stage-studio.local (LocalWP)
  Page ID: 10 (front page, published)
  Header template ID: 33 (sitewide — do not touch)

  ---

  ## ENVIRONMENT & CREDENTIALS

  ### Bricks MCP
  Config at ~/.claude/mcp.json (already set up, available in all sessions)
  Endpoint: http://main-stage-studio.local/wp-json/bricks-mcp/v1/mcp
  Auth: Basic bWFpbnN0YWdlc3R1ZGlvOlBpN04gcWtHeiB4M29zIDVXVXAgYWhHQSBpQTRV

  ### PHP helper pattern (primary method for all DB writes)
  Write file → /Users/osmanakhtar/Local
  Sites/main-stage-studio/app/public/script.php
  Run → curl http://main-stage-studio.local/script.php
  Delete → rm the file
  Always start with: require_once __DIR__ . '/wp-load.php';

  ### DB direct access (fallback only)
  mysql --socket="/Users/osmanakhtar/Library/Application
  Support/Local/run/_PL6uCVLD/mysql/mysqld.sock" -u root -proot local

  ### Meta keys
  - Page elements:   _bricks_page_content_2  (post_id = 10)
  - Header elements: _bricks_page_header_2   (post_id = 33)
  - Page CSS + JS:   _bricks_page_settings   (post_id = 10)
    → customCss (no wrapper tags)
    → customScriptsBodyFooter (must include <script>…</script> tags)
  - Template CSS + JS: _bricks_page_settings (post_id = 33)

  ---

  ## BRAND TOKENS
  --parchment:  #F5EFE5
  --blush:      #E8C9AE
  --terracotta: #BF6B47
  --ember:      #8C4A2F
  --near-black: #1C1712
  Fonts: Cormorant Garamond (display) + Plus Jakarta Sans (body) — loaded via
  Google Fonts

  ---

  ## KEY ELEMENT IDs (page 10)

  | Section           | Element     | Bricks ID |
  |-------------------|-------------|-----------|
  | Hero section      | section     | tkekdr    |
  | Hero video wrap   | code el     | hvdwrp    |
  | Hero content      | container   | rfhilk    |
  | Work section      | section     | jujuih    |
  | MSS card          | container   | ffdlqt    |
  | MSS image wrap    | container   | lfgful    |
  | MSS img element   | image       | csimsm    |
  | Sable card        | container   | erdpru    |
  | Sable image wrap  | container   | rqkeut    |
  | Sable img element | image       | csisbl    |
  | Ayesha card       | container   | khgelq    |
  | Ayesha image wrap | container   | qduljs    |
  | Ayesha img el     | image       | csiayj    |
  | Process section   | section     | fsdcus    |
  | About section     | section     | ccphci    |
  | Contact section   | section     | jrpsli    |
  | Footer section    | section     | dcdscd    |

  Header template (post 33): navsec · navctr · lgoctr · lgosvg · wrdmrk · dsknav
  · lnkwrk/lnkprc/lnkabt · ctabtn · hmbrg1 · mblmnu

  ---

  ## KNOWN BRICKS BUGS — READ BEFORE TOUCHING ANYTHING

  1. **element:add / page:update_content don't save to templates** — always
  write
     _bricks_page_header_2 directly for template 33.

  2. **Children arrays are required** — when adding a child element via PHP, you
  MUST
     also add its ID to the parent element's `children` array. Bricks uses the
     `children` array to determine render order, not just the `parent` field on
  the child.
     Missing `children` = element is silently never rendered.

  3. **Bricks image element renders as `<figure><img></figure>`** — `_cssCustom`
  on
     the image element targets the `<figure>` wrapper, not the `<img>`. To style
  the img
     itself, use `customCss` in page settings: `#brxe-{id} img { ... }`.

  4. **Bricks code element requires `executeCode: true`** to render HTML. With
     `executeCode: false`, the HTML is escaped and displayed as visible text.
     Also requires `executeCodeEnabled: true` in bricks_global_settings (already
  set).

  5. **Border rgba** — `_border.color.hex` doesn't accept rgba. Use
     `_cssCustom: "#brxe-{id} { border-color: rgba(...) }"` instead.

  6. **Button links** — use `link: {url: "...", type: "external"}`, not `_link`.

  7. **customScriptsBodyFooter IIFEs must be balanced** — an unmatched `})();`
     causes a SyntaxError that silently kills all JS on the page. Count opens
  and closes.

  8. **GitHub raw URLs don't support video streaming** — use local WP media URLs
     (`/wp-content/uploads/`) for any video or image assets.

  ---

  ## WHAT IS ALREADY BUILT (do not rebuild, only fix gaps)

  **Header template (33):** Fixed nav, logo mark + wordmark, nav links
  (Work/Process/About),
  "START A PROJECT" CTA (uppercase, nowrap, directional fill animation),
  hamburger +
  mobile menu overlay with JS. Scroll → nav gets parchment bg + shadow.

  **Page 10 sections:**
  - Hero: parchment bg, hero video (3d-mark-animation.mp4, WP media ID 37), H1,
  body copy, CTA
  - Marquee strip: near-black bg, service names (currently static — no CSS
  animation)
  - Work: 3 case study cards (MSS, Sable, Ayesha). Images uploaded (IDs
  34/35/36),
    rendered via Bricks image elements with children arrays set.
    Hover zoom via customCss. Spotlight border effect via JS + CSS custom props.
  - Process: near-black bg, 4 stages with ghost numbers
  - About (03 Studio): two-column layout, body copy + values
  - Contact (04 Start a project): Bricks form, Formspree action, submit JS
  - Footer: logo mark + copyright

  **Custom JS in page settings (customScriptsBodyFooter):**
  Already includes: scroll progress bar, process line scaleY, spotlight
  mousemove
  (--mx/--my), hero CTA directional fill, contact form handler, hero video
  fade-in.

  **Custom CSS in page settings (customCss):**
  Already includes: CSS variables, hero video wrap layout + mobile mask,
  case study image fill + hover zoom, contact section 2fr/3fr layout,
  submit button styling, work card image hover zoom.

  ---

  ## KNOWN GAPS (confirmed missing or broken — fix these)

  1. **Marquee animation** — the marquee text exists but the CSS `animation:
  marquee 36s
     linear infinite` is not applied. The prototype uses a pure CSS keyframe
  animation.
     Add `@keyframes marquee` + `.marquee-track { animation: marquee 36s linear
  infinite }`
     to customCss. Also add hover:paused state.

  2. **Nav scroll behaviour** — the prototype adds class `.scrolled` to `#nav`
  on scroll
     (parchment bg, box-shadow). Check if this is wired in the template's
     customScriptsBodyFooter. The nav section in Bricks has id `navsec`.

  3. **Hero section min-height** — prototype uses `min-h-[100dvh]`. Check
  `tkekdr`
     has this set. If not, add via customCss: `#brxe-tkekdr { min-height:
  100dvh; }`.

  4. **Scroll reveal (.reveal)** — prototype uses IntersectionObserver to add
  `.in-view`
     class to elements with `.reveal` class. Check if the work cards and other
  sections
     have this class and if the observer JS is running.

  5. **Hero line-clip entrance animations** — prototype animates
  `.line-clip__inner`
     elements with `translateY` on load. Check if this is running in Bricks.

  6. **Process progress line** — `#process-line` element and its scaleY scroll
  animation.
     Verify the element exists in Bricks and the JS is targeting the correct
  section ID.

  7. **Directional fill on hero CTA** — `.btn-fill` mouseenter logic setting
  `--fill-x`
     / `--fill-y`. Verify it's wired to the hero CTA button (`kdfljf`).

  8. **Verify assets render** — confirm the hero video (#hero-video inside
  hvdwrp)
     is visible and playing on page load, and all three case study images
     (csimsm / csisbl / csiayj) are visible in their cards. If either is
  missing,
     diagnose and fix before moving on to anything else.

  ---

  ## HOW TO AUDIT

  1. Read the full prototype HTML (index.html)
  2. Fetch the rendered Bricks page: `curl -s http://main-stage-studio.local/`
  3. For each section, compare: layout, spacing, copy, colours, CSS classes,
  animations
  4. Read _bricks_page_content_2 (post 10) and _bricks_page_settings (post 10)
  to
     understand exactly what's stored
  5. Fix gaps one section at a time, top to bottom
  6. After each fix, fetch the rendered page to confirm the HTML changed as
  expected
  7. Do not invent — match the prototype exactly

  Start with the audit. Read the prototype first, then the rendered page, then
  the DB.
  Report your findings before making any changes.