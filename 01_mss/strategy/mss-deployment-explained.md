# MSS — Deployment Explained
## Why We Did Each Step and What It's For

*Companion to `mss-new-site-deployment-guide.md`.*
*Written after the Main Stage Studio go-live session, 14 June 2026.*

> **Legacy — WordPress/Bricks sites only.** Bricks/WordPress was retired 25 June 2026
> in favour of Astro static sites on Cloudways. This explainer covers the old
> WordPress+Bricks deployment process and its companion guide; current Astro
> deployments follow `01_mss/strategy/mss-astro-cloudways-setup.md` and
> `.github/DEPLOY.md`. Kept for reference only.

---

## The big picture

Deploying a WordPress site from a local machine to a live server involves moving two completely separate things: the files and the database. They need to be moved independently, and both need to point to the right URLs after the move. Most of the complexity in this process comes from managing that transition cleanly.

---

## Phase 1 — Cloudways Server Setup

### Why Cloudways at all?

Cloudways sits between raw server hosting (where you manage everything yourself) and fully managed WordPress hosting (where you control almost nothing). It gives you real server access via SSH, proper staging environments, and the ability to host multiple sites on one server, while handling the infrastructure layer (security patches, server software, backups) for you. For a studio hosting both its own site and client sites, that balance is right.

### Why DigitalOcean?

The major cloud providers on Cloudways (AWS, GCP, DigitalOcean) differ in price and complexity. DigitalOcean is the simplest to manage and the most cost-effective at small scale. AWS and GCP have more power but more overhead. For a portfolio site or early-stage client site, DigitalOcean is the correct choice.

### Why 1GB RAM?

A portfolio site with low traffic doesn't need more. Cloudways lets you scale up in a few clicks at any time, so starting small has no downside. Paying for resources you don't need yet is just overhead.

### Why London?

Server location affects page load speed for users nearby. If your clients are predominantly UK-based, a London server reduces latency. Choose the region closest to your primary audience.

### Why LightningStack over HybridStack?

LightningStack uses NGINX as the web server. NGINX is faster than Apache (which HybridStack uses) for serving static assets like images, fonts, and CSS. HybridStack exists for sites that need `.htaccess` file support, which is an Apache-specific feature. Bricks doesn't need it. There's no reason to take the performance trade-off.

### Why MariaDB over MySQL?

MariaDB is a fork of MySQL that runs faster for most WordPress workloads, particularly on read-heavy sites. Cloudways optimises for MariaDB. The two are compatible so there's no risk in choosing it.

### Why fix the CPU spike immediately?

WordPress runs scheduled tasks called cron jobs. On a fresh Cloudways install, WordPress tries to run these tasks on every page load rather than on a proper schedule. On a 1GB server with limited resources, this hammers the CPU and can make the server unusable. The Cron Optimizer moves cron jobs to a proper server-level schedule, stopping the hammering and returning CPU usage to a normal idle level.

### Why increase PHP upload limits?

PHP has default file size limits for uploads. These defaults are often too low for premium WordPress plugins and themes. Bricks Builder is a large file. Without increasing the limits, WordPress rejects the upload before it even starts.

### Why use SSH keys instead of passwords?

SSH keys are more secure than passwords and more convenient for scripted deployments. A key pair consists of a private key (on your machine, never shared) and a public key (added to the server). The server verifies your identity by matching the keys. Claude Code can use the private key automatically without you entering a password each time.

---

## Phase 2 — WordPress Repo Setup

### Why a separate repo for each site?

The ops repo (`main-stage-studio`) is the studio brain: context files, strategy docs, prototypes, decisions log. It's not a codebase. Mixing WordPress files into it would conflate two different things and make both harder to manage.

Each site gets its own repo so it has independent version control, a clear deployment target, and can be handed over to a client or another developer without dragging in unrelated studio material.

### Why a .gitignore for WordPress?

Several WordPress files and folders should never be in a git repo:

`wp-config.php` contains database credentials specific to the environment it's running in. Committing it would either expose credentials publicly or cause the site to break when deployed to a different environment with different credentials.

`wp-content/uploads/` contains media files uploaded by users. These are often large, change frequently, and don't belong in version control. They're transferred separately via rsync.

Cache files, log files, and upgrade folders are environment-specific and either large or sensitive. They don't belong in the repo.

### Why make the initial commit represent the finished state?

Git captures snapshots. The first snapshot should represent the site in its intended go-live state, with the correct sections visible and hidden. If you commit mid-update, you deploy mid-update.

---

## Phase 3 — Git Deployment

### Why Git deployment over rsync for files?

Once set up, Git deployment means every future code change is deployed with a single `git push` followed by a Pull in Cloudways. No SFTP credentials to manage, no rsync commands to remember, no risk of accidentally overwriting the wrong files. It takes longer to set up the first time but saves significant effort on every subsequent deployment.

### Why does Cloudways need an SSH key added to GitHub?

Git deployment works by Cloudways pulling code from your GitHub repo. For Cloudways to access the repo, GitHub needs to recognise Cloudways as an authorised source. Adding the Cloudways public key to GitHub grants that access without requiring a password.

### Why is Bricks installed manually rather than via the repo?

Bricks is a premium plugin distributed as a zip file from bricksbuilder.io. It's not available via the WordPress plugin repository and can't be downloaded automatically. Premium plugins and themes are typically excluded from repos because including them would either expose a paid product publicly or require a licence key embedded in the code. They're installed manually on each server and activated with a licence key.

### Why does Bricks go in `themes/` not `plugins/`?

Bricks is a WordPress theme, not a plugin. Despite functioning like a page builder, it's built as a theme because it takes full control of how the site renders. WordPress loads themes differently from plugins, and putting it in the wrong folder means WordPress never sees it.

---

## Phase 4 — Database Migration

### Why export and import the database separately from the files?

WordPress stores almost everything in the database: page content, settings, user accounts, plugin configuration, menu structure, and the Bricks page layouts. The files (PHP, CSS, JS) are the engine. The database is the content and configuration. They travel separately because they're different types of data requiring different transfer methods.

### Why use WP Migrate for the export?

WP Migrate handles the search and replace during export. When WordPress runs locally, every URL in the database points to your local address (e.g. `http://main-stage-studio.local`). On the live server, everything needs to point to the live domain. A naive SQL export doesn't fix those references. WP Migrate replaces them during the export, so the imported database is immediately correct for the live environment.

### Why replace the file path as well as the URL?

WordPress sometimes stores absolute file paths in the database, not just URLs. If those paths still point to your local machine after the import, WordPress can't find the files it's looking for. The file path replacement ensures both types of reference are updated.

### Why drop the existing tables before importing?

Cloudways provisions a fresh WordPress installation with its own database tables. If you import your local database on top of those tables without clearing them first, you get a merge of two different WordPress installs. The result is unpredictable. Dropping the existing tables first gives you a clean slate and ensures the imported data is the only data.

### Why transfer uploads separately?

Media files (images, documents, videos) live in `wp-content/uploads/`. They're excluded from the git repo because they're large and change frequently. They need to be transferred separately via rsync, which copies files directly between two locations over SSH. This is a one-direction sync: local to remote.

---

## Phase 5 — WordPress Configuration

### Why set a static homepage?

By default, WordPress shows a blog index as the homepage. Unless your site is a blog, this is wrong. Setting a static page tells WordPress to serve a specific page at the root URL instead.

### Why flush permalinks?

WordPress stores its URL routing rules (which URL maps to which page) in the database and in a rewrite rules file. After a database import, these rules can be stale or incorrect, causing pages that exist to return 404 errors. Flushing the permalinks forces WordPress to regenerate the routing rules from scratch based on the current database state.

### Why two caching layers, and why does it matter operationally?

Varnish sits in front of NGINX and caches entire HTTP responses before WordPress is even reached. Breeze's file cache sits behind that, inside WordPress, caching rendered page output as static files. They were added for different reasons (Varnish for raw speed at the server level, Breeze for WordPress-aware caching that understands posts, pages, and plugins) but the consequence is that clearing one doesn't clear the other.

This matters operationally because it's the single most likely cause of a "the change isn't showing" report that turns out to be nothing wrong with the change at all. If you fix something in the database directly, that fix bypasses WordPress's normal save hooks, which are what would normally trigger a cache clear automatically. Varnish has no idea anything changed and keeps serving the old response. The fix being correct and the site looking wrong can both be true at once, which is exactly when it's worth checking cache before re-debugging the actual change.

The reason "Purge All" in wp-admin is the right default rather than a command-line PURGE request or a manual file delete is that it's the one action confirmed to walk through both layers. A manual `rm -rf` on the cache folder feels like it should work, and it does clear something, just not the layer that's actually serving the stale page to a visitor.

---

## Phase 6 — Domain and SSL

### Why add the domain in Cloudways before pointing DNS?

Cloudways needs to know which domain is associated with which application before it can route traffic correctly. Adding it in Domain Management tells Cloudways to expect requests for that domain and send them to the right application.

### Why set TTL to 300 before changing DNS?

TTL (Time to Live) is how long DNS records are cached by servers around the world. A high TTL (e.g. 86400, which is 24 hours) means changes propagate slowly. Setting it to 300 (5 minutes) before making the change means the update spreads much faster. Always lower the TTL before a DNS change.

### Why wait for propagation before installing SSL?

The SSL certificate is issued by Let's Encrypt, an external authority. To issue the certificate, Let's Encrypt sends a verification request to your domain to confirm you control it. If DNS hasn't propagated yet, the domain doesn't resolve to your server, the verification fails, and no certificate is issued. Waiting for propagation isn't bureaucracy, it's a technical requirement.

### Why HTTPS at all?

HTTPS encrypts the connection between the visitor's browser and your server. Without it, data transmitted between them (including form submissions) can be intercepted. Beyond security, browsers now actively warn users when sites aren't on HTTPS, and search engines penalise non-HTTPS sites in rankings. There's no reason to launch a site without it.

### Why update WordPress URLs to HTTPS after SSL is installed?

When you install the SSL certificate, the server can now serve the site over HTTPS. But WordPress doesn't automatically know that. If the WordPress address and site address are still set to `http://`, WordPress will generate links and redirects using HTTP even though the server is capable of HTTPS. Updating both fields to `https://` tells WordPress to use the encrypted version for everything it generates.

### Why clear the cache after every major change?

Breeze (Cloudways' cache plugin) stores static copies of pages to serve them faster. If you make a change and the cache still holds the old version, visitors (and you) see the old version. Clearing the cache forces Breeze to rebuild those static copies from the current state of the site.

---

## The underlying logic

Every step in this process exists because of one of four reasons:

**Environment difference.** Local and live are different environments with different URLs, file paths, and database credentials. Steps 4.1, 4.3, and 6.5 exist to manage this transition.

**Security.** SSH keys, HTTPS, and keeping credentials out of the repo all exist to protect the site and its data.

**Performance.** LightningStack, MariaDB, the Cron Optimizer, and the cache all exist to make the site fast and stable.

**Separation of concerns.** The ops repo, the site repo, and the database being transferred independently all exist to keep different types of things in the right place. Mixing them creates confusion and fragility.

Understanding these four reasons means you can diagnose most deployment problems without a guide. Ask which of these four things is out of alignment and you'll usually find the fix.
