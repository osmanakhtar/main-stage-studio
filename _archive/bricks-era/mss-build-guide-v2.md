# MSS — Build Guide v2
*End-to-end: local build through to live site. Covers MSS site, case studies, and client sites.*
*Last updated: 06 June 2026*
*Superseded: 19 June 2026 — see notice below*

---

## ⚠ Superseded — read before using

This document was the original end-to-end plan. Two parts of it have since been replaced by documents derived from real sessions where this plan ran into problems:

- **Part 2 (MSS site build) and Part 3 (adding a case study)** are superseded by `mss-bricks-build-guide.md` (13 June 2026). That document was derived from the actual Sable case study build and corrects the MCP connection method (now persistent via `~/.claude/mcp.json`, not re-added every session via `claude mcp add`) and replaces the high-level "build all pages" instruction with a granular, section-by-section approach that produces fewer bugs.

- **Part 5 (Migrating to Cloudways)** is superseded by `mss-new-site-deployment-guide.md` (14 June 2026). That document was derived from the actual MSS go-live and replaces Migrate Guru / Better Search Replace / manual DNS with Git-based deployment, SSH keys, a repo-per-site model, and the two-layer Varnish/Breeze cache architecture.

**What's still potentially useful here:** Part 1 (one-time local setup) and Part 4 (new client site setup) haven't been explicitly superseded by a dedicated replacement document. Part 4 in particular, scaffolding a brand-new client's LocalWP environment, may still be the only place this process is written down. Confirm before relying on it, since the MCP connection details in 4.3 carry the same superseded pattern as Part 2/3.

**Do not follow Part 2, 3, or 5 of this document.** Use the two replacement guides named above instead.

---

## How this guide works

Three workflows, all using the same stack:

1. **MSS site** — build and maintain mainstagingstudio.co.uk
2. **Adding a case study** — new portfolio entry from content to live
3. **New client site** — full engagement from LocalWP to Cloudways

The tools are the same across all three. The process adapts to the scope.

---

## Stack

| Layer | Tool |
|-------|------|
| Local development | LocalWP |
| Page builder | Bricks Builder (Business licence) |
| Build automation | Claude Code + bricks-mcp plugin |
| Prototype delivery | GitHub Pages (HTML/CSS) |
| Hosting | Cloudways |
| Local dev | LocalWP |
| Version control | GitHub |

---

## Part 1 — One-time setup (already done for MSS)

### 1.1 LocalWP

Download from localwp.com. Install as standard macOS app.

Create a new site:
- Site name matches the project
- Accept the suggested local domain (e.g. main-stage-studio.local)
- Environment: Preferred (PHP 8.x, MySQL 8.x, Nginx)
- Set admin credentials and record them

### 1.2 Bricks Builder

Download bricks.zip from bricksbuilder.io, account, Downloads.

Install via WP Admin, Plugins, Add New, Upload Plugin. Activate.

Set as active theme: Appearance, Themes, Activate Bricks.

Activate licence: Bricks, Licence, paste key.

Clean up defaults: delete Hello Dolly plugin, sample page, Hello World post, unused themes.

### 1.3 bricks-mcp plugin

This plugin gives Claude Code direct API access to Bricks. Install it once per site.

Download the plugin zip from: github.com/cristianuibar/bricks-mcp/releases

Install via WP Admin, Plugins, Add New, Upload Plugin. Activate.

Enable the server: Settings, Bricks MCP, enable server, enable dangerous actions.

Create Application Password: Users, Profile, scroll to Application Passwords,
create one and copy it. Store it securely — you need it every Claude Code session.

Connect Claude Code to the site:

```
claude mcp add bricks-mcp http://[site].local/wp-json/bricks-mcp/v1/mcp --transport http
```

### 1.4 Global styles in Bricks

Set once per site in Bricks, Settings, Theme Styles. Create a new style and apply:

Colours:
- Primary: #BF6B47 (terracotta)
- Secondary: #8C4A2F (ember)
- Light: #F5EFE5 (parchment)
- Dark: #1C1712 (near black)
- Muted: #E8C9AE (blush)
- Border: #E8C9AE (blush)

Typography:
- Body: Plus Jakarta Sans, 400, 16px, line-height 1.75
- All Headings: Cormorant Garamond, 300

Save the style as MSS Global.

---

## Part 2 — Building or updating the MSS site

### First build

Use the session kickoff prompt in mss-bricks-session-kickoff.md. Open Claude Code,
run the mcp add command, paste the prompt, and let Claude Code build from the prototype.

Pages Claude Code builds:
- Home (hero, work grid, process, about, contact CTA)
- Work (full portfolio grid)
- Case study framing pages (one per case study)
- Case study full pages (one per case study)
- Start a Project (contact form)

Claude Code builds native Bricks structure — every element is editable in the
visual editor afterwards.

### Updating existing pages

For copy changes: edit directly in the Bricks visual editor. Click the element,
update the text, save.

For structural changes: open a Claude Code session, reconnect via mcp add, and
describe what needs to change. Claude Code can modify existing pages directly.

For adding new sections to a page: tell Claude Code what to add and where. Give
it the copy and any design direction. It writes the Bricks structure.

### Homepage work grid

The grid shows 2-3 case study highlights. When a new case study is ready to feature:

1. Open the Home page in Bricks
2. Find the work grid section
3. Update the card: client name, sector, services, thumbnail image, link to framing page

Or tell Claude Code: "Add [client name] to the homepage work grid with this copy
and link: [details]."

---

## Part 3 — Adding a new case study

A case study has two pages: a framing page and a full case study page. Both are
written before anything is designed or built.

### Step 1 — Content (Claude desktop, not Claude Code)

Write the framing page copy and full case study copy before opening any build tools.
Follow the case study workflow in mss-case-study-workflow-guide.md.

Both pieces need to exist and be reviewed before Step 2.

### Step 2 — Design brief (Claude desktop)

Write the creative brief for this case study:
- Three words that describe the client's world
- Visual references outside the web
- At least two layout conventions that are off-limits
- What these pages should never look like

The design should reflect the client's world, not MSS. If it starts looking like
the MSS site, the brief is not working.

### Step 3 — Build in Claude Code

Open a Claude Code session and connect via bricks-mcp.

Prompt template:

```
I'm adding a new case study to the MSS site on main-stage-studio.local.

Client: [name]
Pages to build: framing page and full case study page

Framing page copy:
[paste copy]

Full case study copy:
[paste copy]

Design brief:
Three words: [x, y, z]
Visual references: [list]
Off-limits: [list]
What it should never look like: [description]

Build both pages as native Bricks pages. The design should reflect the client's
world — not MSS styles. Use the design brief above to make independent typography,
colour, and layout decisions for these pages.

When done:
1. Add a card for this case study to the Work page portfolio grid
2. Update the framing page to link to the full case study
3. If this is one of the top 2-3 strongest case studies, ask me whether to add it
   to the homepage work grid
```

### Step 4 — Assets

Upload screenshots, logo, and key visuals via WP Admin, Media, Add New.

In the Bricks editor, place assets in the relevant sections on both pages.

### Step 5 — Review

Open both pages in the browser at [site].local. Check:
- Does it look like the client's world, not the MSS site
- Does the framing page make someone want to read the full case study
- Do both pages work as a coherent pair
- Are all links correct

### Step 6 — Publish

When ready to go live, migrate to Cloudways (see Part 5). The case study goes
live as part of the next site deployment.

---

## Part 4 — New client site

Each client site follows the same process. The build does not start until
discovery, brand, and design system are complete.

### 4.1 Create the LocalWP site

In LocalWP, create a new site:
- Site name: [client name]
- Local domain: [client-name].local
- Environment: Preferred
- Record admin credentials

### 4.2 Install Bricks

Same process as Part 1.2. Use the same Business licence key — local domains do
not consume licence slots.

### 4.3 Install bricks-mcp

Same process as Part 1.3. Create a new Application Password for this site.

Connect Claude Code:

```
claude mcp add bricks-mcp http://[client-name].local/wp-json/bricks-mcp/v1/mcp --transport http
```

### 4.4 Set global styles

Set the client's brand colours and typography in Bricks Theme Styles. These come
from the constraints doc and brand files in the client folder.

### 4.5 Build with Claude Code

The HTML/CSS prototype (built in Phase 1 of the client workflow) is the source
of truth. Open a Claude Code session and use this prompt structure:

```
I'm building a client website in Bricks Builder on [client-name].local.

The HTML/CSS prototype is at:
~/workspace/main-stage-studio/02_clients/[client-name]/prototype/index.html

Application password: [paste]

Client brand:
Colours: [paste from brand files]
Typography: [paste from brand files]

Read the prototype first. Confirm the page list and structure before building.

Build all pages as native Bricks structure — no custom code blocks. Every element
should be editable in the visual editor after you're done.
```

### 4.6 Content population

Once pages are built structurally, populate content:
- Copy comes from the client's approved copy document
- Images and assets from the client's deliverables folder
- Upload to WP Media and place in Bricks

### 4.7 Client review

Share the LocalWP URL during a screen share, or use LocalWP's tunnel feature to
give the client a temporary external URL. Capture feedback and feed back to
Claude Code for revisions.

---

## Part 5 — Migrating to Cloudways (go-live)

Use this process for both MSS and client sites.

### 5.1 Cloudways setup

Log in to Cloudways. Create a new application:
- Server: DigitalOcean, closest region to client
- Application: WordPress
- Application name: [site name]
- Note the temporary URL (e.g. abc123.cloudwaysapps.com)

### 5.2 Migration

Install Migrate Guru on the local site: WP Admin, Plugins, Add New, search
Migrate Guru, install and activate.

Get Cloudways SFTP credentials: Application, Access Details — note Public IP,
Application Username, Application Password, SFTP Port (22).

Run migration: Migrate Guru, enter email, click Migrate, select Other Host,
enter SFTP credentials. Migration runs server-to-server, typically 10-20 minutes.

### 5.3 Post-migration steps

1. Log in to WP Admin via the Cloudways temp URL
2. Settings, General — update both URL fields from [site].local to the temp URL
3. Verify the site loads correctly on the temp URL
4. Install Better Search Replace plugin
5. Find: [site].local, replace with https://[live-domain.com] — dry run first,
   then run for real

### 5.4 DNS

In your domain registrar, update DNS:
- A record, @, Cloudways server IP
- A record, www, same IP
- Set TTL to 300 before the change, restore to 3600 after

Verify propagation at dnschecker.org.

### 5.5 SSL

Cloudways, Application, SSL Certificate, Let's Encrypt:
- Enter email address
- Enter domain
- Enable www redirect
- Click Install Certificate (takes ~30 seconds)
- Enable Force HTTPS toggle

### 5.6 Update WordPress URLs

WP Admin, Settings, General — update both URL fields to https://[live-domain].
Save.

### 5.7 Reactivate Bricks licence

Bricks, Licence — domain has changed. Re-activate with your key.

### 5.8 Go-live checklist

Run through all items before sharing the live URL:

DNS and HTTPS:
- DNS fully propagated
- SSL padlock showing, no mixed-content warnings
- http redirects to https
- www redirects consistently

WordPress core:
- WP Site URL and Home URL both on live domain
- All plugins up to date
- Admin username not "admin"
- WP debug mode OFF
- File editor disabled
- Unused plugins deleted

SEO and visibility:
- Settings, Reading: discourage search engines is unchecked
- SEO plugin installed (Rank Math preferred)
- Meta title and description set on homepage
- Favicon set
- Google Search Console property added

Performance:
- Varnish cache enabled (Cloudways dashboard)
- Redis object cache enabled
- Images optimised
- No console errors

Content and forms:
- All links tested, no 404s
- Contact form tested end-to-end
- SMTP email configured (WP Mail SMTP plugin)
- All images have alt text
- Privacy Policy page published
- All placeholder text removed
- Mobile layout reviewed on a real device

Backups:
- Cloudways automated backups enabled (daily, 7-day retention)
- Manual snapshot taken immediately before go-live

---

## Quick reference — which tool for what

| Task | Tool |
|------|------|
| Write copy, case studies, strategy | Claude desktop |
| Build or update pages in Bricks | Claude Code + bricks-mcp |
| Visual edits to existing pages | Bricks editor directly |
| Upload images and assets | WP Admin, Media |
| Deliver HTML prototype to client | GitHub Pages |
| Migrate local to live | Migrate Guru plugin |
| DNS and SSL | Cloudways + domain registrar |

---

## Notes

**On the bricks-mcp connection:** You need to run the claude mcp add command at
the start of every Claude Code session. The connection does not persist between
sessions. Keep the Application Password somewhere accessible.

**On case study creative identity:** Every case study has its own design. Claude
Code will default to MSS styles if you do not give it an explicit design brief.
Always provide the brief before asking it to build.

**On the prototype as source of truth:** The HTML/CSS prototype is always the
reference. If something looks wrong in Bricks, compare against the prototype.
Claude Code can read both and reconcile the difference.

**On Bricks licence slots:** Local domains do not consume licence slots. Only
live production domains count. The Business licence covers unlimited live sites.
