# MSS — New Site Deployment Guide
## From LocalWP to Cloudways Production

*Covers: server setup, Git deployment, database migration, domain and SSL.*
*Derived from the Main Stage Studio go-live session, 14 June 2026.*
*Last reviewed: 14 June 2026*

---

## Prerequisites

Before starting, have these ready:

- Local WordPress site built and reviewed in LocalWP
- Site content finalised — sections hidden or shown as intended
- Bricks licence key (retrieve from bricksbuilder.io if needed)
- Domain registered and accessible via registrar DNS panel
- GitHub account with SSH key configured locally at `~/.ssh/id_rsa`
- Cloudways account active on the Flexible plan

---

## Phase 1 — Cloudways Server Setup

### 1.1 Create the server

1. Log into Cloudways, go to Flexible
2. Click Create Server
3. Choose: DigitalOcean, 1GB RAM, London
4. Stack: LightningStack (NGINX)
5. Database: MariaDB
6. Name the server following the convention: `mss-do-lon-01`
7. Click Launch, wait 2 to 3 minutes

### 1.2 Fix CPU spike on first boot

Immediately after provisioning, CPU will likely spike to 100%. Fix:

1. Go into the application, Application Settings, WordPress Settings
2. Enable the Cron Optimizer and save
3. Refresh monitoring after 2 minutes, CPU should drop to under 40%

If still high after that, go to Vertical Scaling and temporarily increase to 2GB RAM.

### 1.3 Create the application

1. Add a WordPress application to the server
2. Name it after the site: `mainstagestudio` or `[client-name]`
3. Note the temporary Cloudways URL: `wordpress-[id].cloudwaysapps.com`

### 1.4 Increase PHP upload limits

Go to Application Settings, PHP FPM tab. Update these two values in the editor:

```
;php_admin_value[post_max_size] = 128M
;php_admin_value[upload_max_filesize] = 64M
```

Save changes. Required before uploading Bricks or any large files.

### 1.5 Add SFTP user

1. Go to Application, Access Details, SSH/SFTP Details
2. Click Add SFTP User
3. Username: `mss-deploy`
4. Generate SSH key pair locally if not already done:
   - Open Claude Code
   - Run: `cat ~/.ssh/id_rsa.pub`
   - If no key exists: `ssh-keygen -t rsa -b 4096 -C "mss-deploy"`
5. Copy the full public key output
6. In Cloudways, click the SSH Public Keys button on the SFTP user
7. Label: `mss-macbook`, paste the public key, submit

### 1.6 Note your credentials

From the server Master Credentials screen:

| Field | Value |
|-------|-------|
| Public IP | [server IP] |
| SSH Username | `master_[id]` |
| SSH Password | [note securely] |

From the application Access Details screen:

| Field | Value |
|-------|-------|
| DB Name | [db name] |
| DB Username | [db username] |
| DB Password | [note securely] |

---

## Phase 2 — WordPress Repo Setup

### 2.1 Create the site repo

Each site gets its own GitHub repo. In Claude Code:

```
Create a new GitHub repo called [site-name]-website under the osmanakhtar account.
Initialise it from the LocalWP WordPress files at:
~/Local Sites/[site-name]/app/public/

Create a .gitignore that excludes:
wp-config.php
wp-content/uploads/
wp-content/cache/
wp-content/upgrade/
wp-content/backup-db/
wp-content/advanced-cache.php
wp-content/wp-cache-config.php
node_modules/
.DS_Store
.env
*.env
*.log
*.sql

Make the initial commit and push to the new repo.
Show me each command before running it.
```

### 2.2 Verify the repo

Confirm on GitHub that the repo exists and the initial commit is there before proceeding.

---

## Phase 3 — Git Deployment

### 3.1 Generate Cloudways SSH key

In Cloudways, go to Application, Deployment via GIT. The SSH key will be generated automatically on first visit.

### 3.2 Add the key to GitHub

1. Copy the Cloudways public key from the Deployment via GIT screen
2. Go to GitHub, Settings, SSH and GPG Keys, New SSH Key
3. Label: `cloudways-mss-do-lon-01`
4. Paste the key and save

### 3.3 Configure Git deployment

Back in Cloudways Deployment via GIT, fill in:

| Field | Value |
|-------|-------|
| GIT Remote Address | `git@github.com:osmanakhtar/[repo-name].git` |
| Branch | `main` |
| Deployment Path | `public_html/` |

Click Authenticate first, confirm it connects, then click Start Deployment.

### 3.4 Install Bricks manually

Bricks is a premium theme not included in the repo. Install via SSH:

**Upload the zip:**

In Claude Code:
```
Upload ~/Downloads/bricks.[version].zip to Cloudways via SFTP.
Host: [server IP]
Username: mss-deploy
Port: 22
Remote path: ~/applications/[app-id]/public_html/wp-content/themes/
Use SSH key at ~/.ssh/id_rsa
```

**Unzip on the server:**

In Claude Code:
```
Connect via SSH to [server IP] using username master_[id].
Unzip the Bricks zip into wp-content/themes/ and remove the zip after.
Then activate Bricks via WP-CLI and set the licence key option.
```

Set the licence key via WP-CLI:
```
wp option update bricks_licence_key '[licence key]' --path=~/applications/[app-id]/public_html/
```

Activate via WordPress admin: Appearance, Themes, Activate Bricks.

---

## Phase 4 — Database Migration

### 4.1 Export from LocalWP

1. In LocalWP, open the site and go to WordPress admin
2. Install WP Migrate via LocalWP Site Shell: `wp plugin install wp-migrate-db --activate`
3. Go to Tools, WP Migrate, New Migration, Export
4. In Standard Find and Replace, fill in:

| Find | Replace |
|------|---------|
| `//[local-url].local` | `//[live-domain].co.uk` |
| `/Users/[username]/Local Sites/[site-name]/app/public` | `/home/master_[id]/htdocs/[live-domain].co.uk` |

5. Leave Media Uploads, Themes, Plugins, Core Files unchecked
6. Click Export. A `.sql.gz` file downloads to your Mac.

### 4.2 Import to Cloudways

1. In Cloudways, Application, Access Details, click Launch Database Manager
2. Select all existing tables and Drop them (this clears the default WordPress install)
3. Click Import, choose the `.sql.gz` file, click Execute
4. Confirm "X queries executed OK"

### 4.3 Update site URLs in database

In the Database Manager, click `wp_options` and find these two rows:

| Option | Value |
|--------|-------|
| `siteurl` | `http://[live-domain].co.uk` |
| `home` | `http://[live-domain].co.uk` |

Update both if they still show the local URL.

### 4.4 Transfer media uploads

In Claude Code:
```
Transfer the WordPress uploads folder from LocalWP to Cloudways via rsync.
Local path: ~/Local Sites/[site-name]/app/public/wp-content/uploads/
Remote host: [server IP]
Remote username: master_[id]
Remote path: ~/applications/[app-id]/public_html/wp-content/uploads/
Use SSH key at ~/.ssh/id_rsa
```

---

## Phase 5 — WordPress Configuration

### 5.1 Set static homepage

Go to WordPress admin, Settings, Reading:

- Your homepage displays: A static page
- Homepage: select the correct page

### 5.2 Flush permalinks

Go to Settings, Permalinks, and click Save Changes without changing anything. This fixes any 404 errors on pages that should exist.

### 5.3 Verify Bricks pages

Go to Pages in WordPress admin. Hover over each page and confirm "Edit with Bricks" appears as an option. If it doesn't, Bricks activation or the database migration needs checking.

---

## Phase 6 — Domain and SSL

### 6.1 Add domain in Cloudways

Go to Application, Domain Management. Add the live domain as the primary domain.

### 6.2 Update DNS at registrar

At 123-reg (or relevant registrar), update DNS:

| Type | Host | Points to | TTL |
|------|------|-----------|-----|
| A | @ | [server IP] | 300 |
| CNAME | www | [live-domain].co.uk | 300 |

Set TTL to 300 for faster propagation.

### 6.3 Verify propagation

Check `dnschecker.org`. Wait until the majority of locations show the correct IP before proceeding to SSL.

### 6.4 Install SSL

Go to Application, SSL Certificate. Enter the live domain and install the Let's Encrypt certificate. This will fail if DNS hasn't propagated sufficiently. Wait and retry.

### 6.5 Update WordPress URLs to HTTPS

Go to WordPress admin, Settings, General. Update both fields:

| Field | Value |
|-------|-------|
| WordPress Address | `https://[live-domain].co.uk` |
| Site Address | `https://[live-domain].co.uk` |

Save. WordPress will log you out. Log back in.

### 6.6 Clear cache

In WordPress admin, click Breeze in the top admin bar and select Purge All Cache.

---

## Phase 7 — Final Checks

Run through this before calling the site live.

- [ ] Site loads at `https://[live-domain].co.uk`
- [ ] HTTPS padlock showing in browser
- [ ] Homepage set as static front page
- [ ] All images loading correctly
- [ ] Navigation links working
- [ ] Hidden sections confirmed hidden
- [ ] Contact form working (if applicable)
- [ ] Bricks pages editable via "Edit with Bricks"
- [ ] Breeze cache cleared
- [ ] Cloudways cron optimizer enabled
- [ ] Backup configured in Cloudways (Backup and Restore, enable automated backups)

---

## Caching — Architecture and Operational Management

Cloudways runs two separate caching layers, not one. Clearing the wrong one is why a change can look live in one place and not another.

### The two layers

| Layer | What it is | What clears it |
|-------|-----------|-----------------|
| Varnish (`CLOUDWAYS-CACHE-DC`) | Server-level cache sitting in front of NGINX. Caches full HTTP responses before WordPress is even touched. | Breeze "Purge All", or a direct PURGE request |
| Breeze file cache (`wp-content/cache/`) | WordPress-level cache. Caches rendered page output as static files. | Breeze "Purge All", or deleting the `cache/` folder directly |

The trap: clearing `wp-content/cache/` manually, or via a basic file delete, only clears Breeze's layer. Varnish sits in front of that and will keep serving the old page regardless. This is why a change can be confirmed gone from the filesystem and still show as stale in the browser.

**Breeze "Purge All" in wp-admin clears both layers correctly.** That's the one button that does the full job. Use it as the default.

### When to clear cache

- After any content change made directly in the database (via WP-CLI or phpMyAdmin) — these bypass WordPress's normal save hooks which would otherwise trigger a cache clear automatically
- After a Bricks structural change pulled in via Git deployment
- After updating `siteurl` or `home`
- After a database import or migration
- If a change is confirmed correct in the database but not showing on the live site

### How to clear it — three methods, in order of preference

**1. WordPress admin (default, no exceptions needed)**

Top admin bar, click Breeze, select Purge All Cache. This is the only method that's guaranteed to clear both Varnish and the file cache in one action. Use this unless there's a specific reason not to.

**2. Claude Code, via SSH (when you're already in a terminal workflow)**

For the Varnish layer specifically:

```
Connect via SSH to [server IP] using username master_[id].
Run: curl -X PURGE -H 'Host: [live-domain].co.uk' 'http://127.0.0.1/?breeze'
```

This hits Varnish directly and is useful when you're mid-deployment in Claude Code and don't want to switch to a browser tab. It does not clear the Breeze file cache on its own — if you've also changed something WordPress is serving from its file cache, follow up with method 3 or just use method 1 instead.

**3. Manual file cache clear (rarely needed on its own)**

```
rm -rf ~/applications/[app-id]/public_html/wp-content/cache/breeze-config/cache/*
```

Only clears the file cache layer. Will not touch Varnish. Don't use this as your only step, it will look like nothing happened if Varnish is still serving the old response.

### Practical rule

Default to method 1, the wp-admin Purge All button, for every cache-related issue. Only reach for the Claude Code PURGE command when you're already deep in a terminal-based deployment and switching context would slow things down. Never rely on a manual file delete alone, it solves half the problem and will cost you a confused debugging session when the other half resurfaces.

### Add this to the troubleshooting reflex

If a change is confirmed correct at the database level (via `wp post meta get` or similar) but isn't showing on the live site, cache is the first thing to check, before assuming the deployment or migration failed. Purge All, hard refresh, then re-diagnose if it's still wrong.

---

## Future Deployments

Once the site is live, subsequent deployments from LocalWP to production follow this sequence:

1. Make changes in LocalWP
2. Commit and push to the site repo via Claude Code
3. In Cloudways, Deployment via GIT, click Pull
4. If database changes: re-export from WP Migrate and re-import
5. If new media: rsync the uploads folder again
6. Clear Breeze cache

For code-only changes (theme files, plugin updates), steps 3 and 6 are all that's needed.

---

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Cloudways Project | `main-stage-studio` | applies to all MSS and client work |
| Cloudways Server | `mss-do-[region]-[sequence]` | `mss-do-lon-01` |
| Cloudways Application | `[site-name]` | `mainstagestudio`, `ayesha` |
| GitHub Repo | `[site-name]-website` | `mss-website`, `ayesha-website` |
| SFTP User | `mss-deploy` | same across all sites |
| SSH Key Label (local) | `mss-macbook` | same across all sites |
| SSH Key Label (Cloudways) | `cloudways-[server-name]` | `cloudways-mss-do-lon-01` |

---

## Common Issues and Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| CPU at 100% after provisioning | WordPress cron hammering server | Enable Cron Optimizer in Application Settings |
| Plugin upload link expired | WordPress nonce timeout | Navigate directly to `/wp-admin/plugin-install.php` and upload immediately |
| Bricks not showing in themes | Zip uploaded to plugins folder instead of themes | Move to `wp-content/themes/` via SSH |
| Images not loading | Uploads folder not transferred | Rsync uploads folder separately via Claude Code |
| 404 on homepage | Static front page not set or permalinks not flushed | Settings, Reading, set static page. Then Settings, Permalinks, Save Changes |
| SSL validation failed | DNS not fully propagated | Wait and retry. Check `dnschecker.org` first |
| wp-admin redirecting to live domain | siteurl and home set to live domain before SSL ready | Update via wp-config.php override or WP-CLI temporarily |
| "Edit with Bricks" not appearing | Bricks not activated or licence not validated | Activate via Appearance, Themes. Set licence key via WP-CLI |
| Database still showing default install after import | Tables not dropped before import | Drop all tables first, then import cleanly |
| Change confirmed in database but not showing live | Varnish cache serving old response | Breeze "Purge All" in wp-admin — manual file cache delete alone won't clear Varnish |
