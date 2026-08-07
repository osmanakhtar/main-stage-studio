# MSS — Higgsfield Asset Generation: Operational Procedure

*End-to-end process for generating, compressing, and integrating visual assets
into a client prototype using the Higgsfield asset generation skill.*
*Last reviewed: 23 June 2026*

---

## Overview

This procedure covers the full asset generation pipeline: from prerequisites through
to a prototype HTML file updated with compressed, web-ready assets. It runs once per
page, one page per session.

The pipeline has four operational stages:

1. Prerequisites — confirm everything is in place before the first session
2. Generation — run the skill per page in Claude Code
3. Compression — script runs automatically at the end of each session
4. Review and sign-off — mark preferred variants, confirm the prototype is updated

---

## Prerequisites

Complete these once per client before running any generation sessions.

### Skill and tooling

- [ ] Skill installed at `~/.claude/skills/higgsfield-asset-generation/`
      Folder contains: `SKILL.md`, `references/model-guide.md`,
      `scripts/compress-assets.js`, `scripts/package.json`
- [ ] Script dependencies installed:
      ```bash
      cd ~/.claude/skills/higgsfield-asset-generation/scripts/
      npm install
      ```
- [ ] Higgsfield MCP added to Claude Code global config
      URL: `https://mcp.higgsfield.ai/mcp`
      If not yet added, open a Claude Code session and say:
      "Add the Higgsfield MCP to my global config"

### Client folder

- [ ] `discovery/constraints.md` exists and is complete
      The skill gates on this file. If it's missing or incomplete, the session
      will stop in Phase 1.
- [ ] Client tone of voice file exists (if brand work has been completed)
- [ ] Prototype HTML files exist for each page being generated
- [ ] Asset prompts file saved to the client folder:
      `puremed-asset-generation-prompts.md` (or equivalent for the client)

### Higgsfield account

- [ ] Logged into Higgsfield
- [ ] Free toggle confirmed available for: Flux.2 Pro, GPT Image, Seedream 4.5,
      Kling O1 Image, Nano Banana, Seedream 5.0 Lite
- [ ] Credit balance checked before running any video generation
      (Kling 3.0: ~6 credits per video. Veo 3.1 and Sora 2: 40-70 credits each)

---

## Per-page generation procedure

Run this for each page. One page per Claude Code session.

### Step 1 — Open a new Claude Code session

Open a fresh Claude Code session. Set the working directory to the client folder:

```bash
cd ~/workspace/[client-folder]/
```

Do not reuse a session from a previous page. Context accumulates quickly during
generation and will degrade quality across pages.

### Step 2 — Run the generation prompt

Say:

```
Run the asset generation prompt for [page-name]
```

Example: `Run the asset generation prompt for puremed-anti-wrinkle`

Claude Code will read the skill, locate the prompt in the prompts file, and begin.

### Step 3 — Review the placement plan (Phase 3 gate)

The skill pauses before generating and presents:
- Every placement it has identified in the prototype
- The generation brief for each placement
- Model assignments

**Review this before approving.** Check:
- All expected placements are present — if a section is missing, it may not
  have a clear image element in the HTML
- Briefs feel on-brand — compare against the constraints doc
- Hero cross-section includes at least two model variants
- No video models assigned to static image placements

Approve or adjust, then tell Claude Code to proceed.

### Step 4 — Monitor generation (Phase 5)

Generation runs automatically once approved. During this phase:
- Hero placements generate first
- Each job polls for completion before moving to the next
- Any failures are logged and skipped — the job does not stop

You do not need to stay in the session. Generation can take several minutes
depending on the number of placements and models.

### Step 5 — Compression runs automatically (Phase 7)

Once all Higgsfield jobs complete, the skill runs the compression script without
prompting. It will:
- Download all assets from Higgsfield output URLs
- Convert images to WebP at quality 85
- Copy videos as-is
- Update `manifest.json` with local and compressed paths
- Update the prototype HTML with WebP asset paths

Watch the output for any failed downloads or compression errors.

### Step 6 — Review the session summary

At the end of the session, Claude Code presents:
- What was generated, downloaded, and compressed
- Any failures that need manual attention
- Hero cross-section results with a recommendation on preferred variant

Note any failures. These need to be resolved before this page is considered complete.

---

## Post-generation review

Run this after all pages for a client are complete.

### Mark preferred variants

For any cross-section placement (typically hero), open `manifest.json` and set
`"preferred": true` on the chosen variant. Then re-run the compression script to
update the prototype HTML with the preferred asset:

```bash
node ~/.claude/skills/higgsfield-asset-generation/scripts/compress-assets.js \
  --manifest assets/generated/manifest.json \
  --prototype [path-to-prototype.html] \
  --output assets/generated/compressed/
```

### Browser review

Open each prototype in a browser and confirm:
- All assets are rendering correctly
- No broken image paths
- Video loops play and loop cleanly
- No asset is visibly off-brand

If an asset needs replacing, generate a new variant in a fresh session using
the same page prompt. Add specific direction about what to change.

### Manifest sign-off

When a page is complete, the `manifest.json` should have:
- `local_path` populated for every asset
- `compressed_path` populated for every asset
- `preferred: true` set on exactly one variant per cross-section placement

Do not proceed to the WordPress upload until all pages are signed off and
preferred variants are marked. The upload script processes everything in the
manifest in one run — it is cleaner to have all pages ready before running it.

---

## WordPress upload (legacy — WordPress/Bricks sites only)

Bricks was retired for new builds 25 June 2026 in favour of Astro static sites on
Cloudways; the MSS production site itself is on Astro. This step only applies if a
site is still on WordPress/Bricks — current Astro builds reference the compressed
asset paths directly from the project (no WordPress media library, no upload step).
Kept below for that legacy case.

Run once after all pages are reviewed and signed off. This bridges the pipeline
to the Bricks build.

### Prerequisites

- [ ] All pages generated, compressed, and reviewed
- [ ] `preferred: true` set on one variant per cross-section placement in every
      `manifest.json`
- [ ] WordPress application password generated:
      WordPress admin → Users → Profile → Application Passwords
      Name it "Claude Code". Copy the password exactly as shown (spaces included).
- [ ] WP_USER and WP_APP_PASSWORD set as environment variables in your shell:
      ```bash
      export WP_USER=your_username
      export WP_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx"
      ```

### Run the upload

Run once per page manifest. From the client folder:

```bash
WP_USER=your_username WP_APP_PASSWORD="xxxx xxxx xxxx" \
node ~/.claude/skills/higgsfield-asset-generation/scripts/upload-to-wp.js \
  --manifest assets/generated/manifest.json \
  --prototype [path-to-prototype.html] \
  --wp-url https://your-site.com
```

The script uploads each compressed asset to the WordPress media library, records
the WordPress URL and attachment ID in `manifest.json`, and updates the prototype
HTML to replace local compressed paths with WordPress media URLs.

Already-uploaded assets are skipped automatically — safe to re-run if interrupted.

### Confirm the prototype is ready for Bricks (legacy WordPress/Bricks sites only)

After the upload script completes:
- [ ] Open the prototype HTML and confirm src attributes contain WordPress URLs
      (they should start with your site domain, not a local path)
- [ ] Spot-check one or two URLs in a browser — confirm the assets are serving
- [ ] `manifest.json` has `wp_url` and `wp_attachment_id` populated for every asset

The prototype HTML now references live WordPress media. The Bricks build session
can begin.

---

## Handling failures

### Higgsfield MCP not found at session start

The skill will flag this immediately. Add the MCP to your Claude Code global
config and restart the session.

### constraints.md missing or incomplete

The skill stops in Phase 1. Complete the constraints doc before proceeding.
Spatial character, emotional register, off-limits, and references must all
be present — these are what the generation briefs are built from.

### Generation job fails mid-run

The skill logs it and continues. At the end of the session, failed placements
are listed in the summary. To retry a failed placement, open a new session and
say: "Regenerate [placement-id] for [page-name]." The skill will run a single
placement rather than the full page.

### Download fails during compression

The Higgsfield output URL may have expired. Re-run the generation for that
placement to get a fresh URL, then run the compression script again.
Source URLs from Higgsfield are not permanent — run compression in the same
session or shortly after generation completes.

### HTML not updated after compression

Check that `section_selector` is populated in `manifest.json` for that
placement. If it is null, the prototype had no matching element at the time
of analysis. Add the img or video element to the HTML manually, update the
selector in `manifest.json`, and re-run the compression script.

### WordPress upload fails

Check the error message. Common causes:
- Wrong application password — regenerate in WordPress admin and reset the
  environment variable
- REST API disabled — confirm `/wp-json/wp/v2/media` is accessible on the site
- File not found — confirm `compressed_path` in `manifest.json` points to a file
  that exists locally

The upload script skips already-uploaded assets, so it is safe to re-run after
fixing the issue. Only failed assets will be retried.

### Prototype HTML not updated after upload

The script matches local paths in the HTML to `compressed_path` values in the
manifest. If paths don't match exactly (e.g. relative vs absolute), the swap
won't happen. Open `manifest.json`, check `compressed_path` for the affected
asset, and confirm it matches the src attribute in the HTML. Correct whichever
is wrong and re-run the upload script.

---

## File locations reference

| File | Location |
|------|----------|
| Skill | `~/.claude/skills/higgsfield-asset-generation/SKILL.md` |
| Model guide | `~/.claude/skills/higgsfield-asset-generation/references/model-guide.md` |
| Compression script | `~/.claude/skills/higgsfield-asset-generation/scripts/compress-assets.js` |
| Upload script | `~/.claude/skills/higgsfield-asset-generation/scripts/upload-to-wp.js` |
| Asset prompts | `[client-folder]/[client]-asset-generation-prompts.md` |
| Generated assets | `[client-folder]/assets/generated/` |
| Compressed assets | `[client-folder]/assets/generated/compressed/` |
| Manifest (JSON) | `[client-folder]/assets/generated/manifest.json` |
| Manifest (readable) | `[client-folder]/assets/generated/manifest.md` |

---

## Notes

**One session per page.** Do not run multiple pages in one Claude Code session.
Context accumulates during generation and degrades quality. The discipline of one
session per page also gives you a clean record of what was generated and when.

**Run compression in the same session.** Higgsfield source URLs expire. The
compression script must run before the session closes, or downloads will fail.
The skill handles this automatically — only a reason applies if you are running
the script manually.

**The manifest is the source of truth.** During the build phase, the build skill
reads `manifest.json` to know which asset goes in which placement. Keep it
accurate. If you replace an asset manually, update the manifest to match.

**Credentials stay in the shell.** WP_USER and WP_APP_PASSWORD are environment
variables only — never put them in any project file, manifest, or prompt. Generate
the application password in WordPress admin, set it as an env variable for the
upload session, and discard it from your terminal history afterward if needed.

**Credit-drawing models.** Kling 3.0, Veo 3.1, and Sora 2 draw credits on every
generation. Check your balance before running hero cross-sections that include
these models. If credits are low, Cinema Studio 3.0 is the fallback for hero video
and the free image models cover all static placements.
