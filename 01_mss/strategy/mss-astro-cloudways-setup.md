# MSS — Astro Static App: Cloudways Setup
## New static application + GitHub Actions deploy key

*One-time setup. Run once per server, not once per client site.*
*Companion to `mss-astro-build-guide.md` (Layer 3 onwards).*
*Part of the Astro migration plan replacing WordPress + Bricks.*
*Written: 25 June 2026*

---

## What this creates

A new Cloudways application on the existing `mss-do-lon-01` server, configured to serve static HTML from its webroot. A dedicated SSH keypair lets GitHub Actions rsync built `dist/` output to this app on every deploy. No additional server cost — applications on Cloudways Flexible are free; the server is already paid for.

The WordPress application (`mainstagestudio`) stays untouched until DNS cutover is confirmed.

---

## Prerequisites

- Cloudways account open, `mss-do-lon-01` server visible
- GitHub repo for the site accessible
- Terminal open in `~/.ssh/`

---

## Phase 1 — Create the static application

### 1.1 Add a new application to the existing server

1. Log into Cloudways
2. Go to **Servers → mss-do-lon-01**
3. Click **Add Application**
4. Application type: **PHP** (not WordPress — no database, no WP overhead)
5. Application name: `mss-static` (for the MSS site) or `[client-name]-static` for client work
6. PHP version: 8.2
7. Click **Add Application** and wait ~60 seconds

### 1.2 Note the application details

Once provisioned, go to the new application → **Access Details**. Record:

| Field | Where to find it | Value |
|-------|-----------------|-------|
| Temporary URL | Access Details → Application URL | `php-[id].cloudwaysapps.com` |
| Application path | Access Details → Application Root | `/home/master_[id]/htdocs/[domain]/` |
| Webroot | Access Details → Web Root | `/home/master_[id]/htdocs/[domain]/public_html/` |
| Server IP | Server Details | already known |

The **Webroot** path is the rsync target — GitHub Actions will write `dist/` contents here.

### 1.3 Confirm Nginx serves static HTML correctly

Open the temporary URL in a browser. You'll see a default PHP page. This confirms Nginx is running and serving from the webroot. Static `.html` files placed here will be served immediately, no PHP runtime involved.

No additional Nginx configuration is needed. The Cloudways LightningStack NGINX config serves `index.html` for directory requests by default.

---

## Phase 2 — SSH key for GitHub Actions

This is a separate keypair from `mss-macbook`. It lives in GitHub Actions secrets and is revocable independently.

### 2.1 Generate the keypair

In terminal:

```bash
ssh-keygen -t ed25519 -C "github-actions-mss" -f ~/.ssh/github_actions_mss -N ""
```

This creates:
- `~/.ssh/github_actions_mss` — private key (goes to GitHub)
- `~/.ssh/github_actions_mss.pub` — public key (goes to Cloudways)

### 2.2 Add the public key to Cloudways

1. Copy the public key:
   ```bash
   cat ~/.ssh/github_actions_mss.pub
   ```
2. In Cloudways, go to **mss-do-lon-01 → SSH Keys** (server-level, under Security)
3. Click **Add Key**
4. Label: `github-actions-mss`
5. Paste the public key content, save

Using the server-level SSH key panel (not the application SFTP user panel) gives access via the `master_[id]` username, which matches the existing rsync pattern already documented in `mss-new-site-deployment-guide.md`.

### 2.3 Add the private key to GitHub

For each GitHub repo using this deploy pipeline:

1. Go to the repo → **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `CLOUDWAYS_SSH_KEY`
4. Value: paste the full content of `~/.ssh/github_actions_mss` (including the `-----BEGIN` and `-----END` lines)
5. Save

Add a second secret for the server IP (to avoid hardcoding it in the workflow file):

| Secret name | Value |
|-------------|-------|
| `CLOUDWAYS_SSH_KEY` | contents of `~/.ssh/github_actions_mss` |
| `CLOUDWAYS_HOST` | server IP from Cloudways server details |
| `CLOUDWAYS_USER` | `master_[id]` — the master SSH username |
| `CLOUDWAYS_WEBROOT` | full webroot path, e.g. `/home/master_[id]/htdocs/[domain]/public_html/` |

`CLOUDWAYS_WEBROOT` will be different per application (MSS site vs client site), so set it per repo, not as an org secret.

---

## Phase 3 — Verify the connection

### 3.1 Test SSH from local machine

Confirm the new key authenticates before trusting GitHub Actions to use it:

```bash
ssh -i ~/.ssh/github_actions_mss master_[id]@[server-ip] "echo connected"
```

Expected output: `connected`

If it fails with `Permission denied (publickey)`, the key wasn't saved correctly in Cloudways. Re-check Phase 2.2.

### 3.2 Test rsync to the webroot

Create a test file and rsync it:

```bash
echo "<h1>test</h1>" > /tmp/index.html
rsync -avz -e "ssh -i ~/.ssh/github_actions_mss" \
  /tmp/index.html \
  master_[id]@[server-ip]:[webroot-path]/
```

Then open the temporary Cloudways URL. You should see "test" in the browser. Delete the test file afterwards:

```bash
ssh -i ~/.ssh/github_actions_mss master_[id]@[server-ip] "rm [webroot-path]/index.html"
```

### 3.3 Add staging subdomain

1. In Cloudways, go to the new application → **Domain Management**
2. Add: `staging.mainstagestudio.co.uk` (or `preview.mainstagestudio.co.uk`)
3. At 123-reg, add a DNS A record:

| Type | Host | Points to | TTL |
|------|------|-----------|-----|
| A | staging | [server IP] | 300 |

4. Check propagation at `dnschecker.org`
5. Once propagated, install SSL: Application → **SSL Certificate** → add `staging.mainstagestudio.co.uk` → Let's Encrypt

The staging subdomain is where GitHub Actions deploys `staging/*` branches. Production (`mainstagestudio.co.uk`) stays on the WordPress app until the cutover.

---

## Phase 4 — Confirm and record

Before moving to the build workflow, confirm all of these:

- [ ] New PHP application created on `mss-do-lon-01`
- [ ] Temporary Cloudways URL loads (confirms Nginx is serving)
- [ ] `github_actions_mss` keypair generated at `~/.ssh/`
- [ ] Public key added to Cloudways server SSH keys panel
- [ ] `CLOUDWAYS_SSH_KEY`, `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_WEBROOT` added to GitHub repo secrets
- [ ] `ssh -i ~/.ssh/github_actions_mss master_[id]@[server-ip] "echo connected"` returns `connected`
- [ ] Rsync test to webroot succeeded — file appeared at temporary URL
- [ ] Staging subdomain added and SSL installed
- [ ] `staging.mainstagestudio.co.uk` loads in browser over HTTPS

Once all boxes are checked, the hosting layer is ready. Move to `mss-astro-build-guide.md` (Layer 2 — Astro project template).

---

## Naming conventions for static apps

Follows the same conventions as `mss-new-site-deployment-guide.md`:

| Element | Convention | Example |
|---------|-----------|---------|
| Application name | `[site-name]-static` | `mss-static`, `ayesha-static` |
| SSH key label (Cloudways) | `github-actions-[scope]` | `github-actions-mss` |
| SSH key label (local) | `github_actions_mss` | filename at `~/.ssh/` |
| GitHub secret — key | `CLOUDWAYS_SSH_KEY` | same across all repos |
| GitHub secret — host | `CLOUDWAYS_HOST` | same across all repos (same server) |
| GitHub secret — user | `CLOUDWAYS_USER` | same across all repos |
| GitHub secret — webroot | `CLOUDWAYS_WEBROOT` | per-repo (different per application) |

---

## Notes

**On the WordPress app:** Do not modify or touch `mainstagestudio` (the existing WordPress application) during this setup. It stays live at `mainstagestudio.co.uk`. DNS cutover to the new static app is a separate, final step handled in the go-live checklist — not during setup.

**On the PHP app type:** The Cloudways PHP app runs Nginx + PHP-FPM. PHP-FPM is unused for a pure static site but is available if a `contact.php` endpoint is needed (MSS contact form migration). No configuration change is required for this — Nginx routes `.php` files through PHP-FPM automatically, and static `.html` files are served directly.

**On SSH key security:** `~/.ssh/github_actions_mss` is a deploy-only key with no passphrase (required for unattended CI use). Keep it out of any committed files. If it's ever compromised, remove it from the Cloudways SSH keys panel and rotate: generate a new pair, add new public key to Cloudways, update the `CLOUDWAYS_SSH_KEY` GitHub secret.
