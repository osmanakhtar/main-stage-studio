# Deployment — MSS site (`01_mss/website/site`)

Two workflows, two gates, same convention as the PureMed pipeline:

| Workflow | Trigger | Gate | Target |
|---|---|---|---|
| `mss-site-staging.yml` | Push/merge to `main` touching `01_mss/website/site/**` | PR review + merge | Cloudways staging webroot |
| `mss-site-deploy.yml` | Manual dispatch, type `deploy` to confirm | Explicit human confirmation | Cloudways production webroot |

Production stays manual until the DNS cutover from the existing WordPress + Bricks
site (`mainstagestudio.co.uk`) is confirmed. Merge-to-main only ever reaches staging.

## One-time setup

1. **Cloudways static app** — new PHP app `mss-static` on the existing
   `mss-do-lon-01` server (no extra cost, applications are free on Flexible).
   Steps: `01_mss/strategy/mss-astro-cloudways-setup.md`.
2. **SSH keypair** — already generated at `~/.ssh/github_actions_mss` /
   `~/.ssh/github_actions_mss.pub`. Public key goes on the Cloudways server-level
   SSH Keys panel (not the per-application SFTP user panel).
3. **Repo secrets** (Settings → Secrets and variables → Actions, on
   `osmanakhtar/main-stage-studio`):
   - `CLOUDWAYS_SSH_KEY` — contents of `~/.ssh/github_actions_mss` (private key)
   - `CLOUDWAYS_HOST` — server IP for `mss-do-lon-01`
   - `CLOUDWAYS_USER` — `master_[id]`, the master SSH username for the new app
   - `CLOUDWAYS_WEBROOT_STAGING` — staging app webroot path
   - `CLOUDWAYS_WEBROOT_PROD` — production app webroot path (set at cutover)

Split staging/prod webroot secrets (rather than the setup doc's single
`CLOUDWAYS_WEBROOT`) so a merge to `main` can never physically reach production —
same convention as `other-projects/puremed/.github/DEPLOY.md`.

## Path filtering

Both workflows are scoped to `01_mss/website/site/**` (plus their own workflow
file) so pushes elsewhere in the monorepo — FSC content, client folders, other
strategy docs — never trigger an MSS site build or deploy.
