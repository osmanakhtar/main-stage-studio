# Main Stage Aesthetics Studio: Platform Design

*Canon doc for the productised platform. v0.7, 29 September 2026 (v0.1 to v0.3 on 26 Sep, v0.4 and v0.5 on 27 Sep, v0.6 earlier on 29 Sep).
**Phase 0 built, plus the consultation and a first console screen (see the v0.5 note). Eight of nine decisions locked; D9 (Faces cutover date) open.** Owner: Osman. Working directory:
`~/workspace/main-stage-studio/01_mss/product/aesthetics-studio/`.*

| File | What it is |
|---|---|
| `platform-design.md` | This doc: the design. Canon. |
| `requirements-register.py` | The register's single source. Edit rows here, then run it. |
| `requirements-register.csv` | Generated register (192 rows, 21 categories). Do not hand-edit. |
| `register.js` | Generated data for the readable page. |
| `platform-design.html` | Readable page (architecture, console screens, filterable register). |

Clinical depth is **not** repeated here. `02_clients/puremed/clinical-platform/`
(plan v0.8, register v0.8, technical design v0.4, components S1 to S15) stays the source
for clinical rows. This doc places that work inside a wider platform.

## v0.7 change note, 29 September 2026: console v2 (campaigns, drafts, pause)

Osman's pre-access UX test of the console found: no way to unapprove, no sign that an edit needed
re-approving (a changed email still said "Approved"), unsaved edits lost silently, no campaign context
or live state, placeholder copy approvable, approval dates a day early (a `date` column read through a
local-time `Date`). Decided (Osman, same day, all three as recommended):

- **Pausing replaces unapproving.** Each campaign is On or Paused, using the existing `workflow.state`
  kill switch (the worker already only claims steps of `on` workflows). Paused: the engine skips new
  enrolments and resends (`workflow.enrolment_skipped`, rule `<key>/paused`); people already in it wait
  and continue on resume, overdue steps going out at once. Owner only; `workflow.paused` /
  `workflow.resumed` events; who and when on `workflow.state_changed_by/at` (migration 005). In live
  mode, resume refuses while any patient email in the campaign is unapproved, and the live-mode publish
  check now skips paused campaigns, so a paused campaign's placeholders can't block going live.
- **Save draft and Approve are separate.** New `template_draft` table (one per email, RLS, migration
  005): nobody receives a draft. Approve = the old save (new immutable approved `template_version`,
  re-pin, DET-005 unchanged) plus deleting the draft. Discard deletes it. Every email shows one of
  Approved, Changes not approved, Not approved. Approval refuses `[DRAFT` / `PLACEHOLDER` text.
  Clinic alerts send regardless of approval, so they never count as needing it.
- **Campaign overview.** Emails page replaced by Campaigns (cards) and a campaign page that states, from
  config: entry point (forms whose tags trigger it; new optional form `name` and `page_url`), who gets
  it (consent ticked vs notice), timing and quiet hours, stop rules, re-entry, people in it and emails
  sent in 30 days. New optional workflow `description`. Test mode is a banner on every page.

Tests 64 to 69 (drafts, discard, placeholder guard, pause holds and skips, live-mode resume refusal).
Not yet deployed: needs migration 005 on DigitalOcean (the release job runs it) and a publish.

## v0.6 change note, 29 September 2026: host is DigitalOcean, not Velocity

- **D4 final: DigitalOcean App Platform plus Managed PostgreSQL, both in London (lon1).** Osman
  compared live prices before any Velocity app was created. DigitalOcean is about $25 a month
  (1 GiB app $10, smallest database $15.15) and keeps daily backups plus write-ahead logs for
  7-day point-in-time recovery, the check Velocity failed. One app and one database serve every
  tenant; tenants are separated by path and row-level security, not by infrastructure.
- **Platform address:** `app.puremed.uk` for now. When a second tenant arrives, give each tenant
  its own address (small code change: `PUBLIC_BASE_URL` is global today) and add their domain to
  the same app.
- **Deploy readiness fixes, verified locally against a TLS-only, non-superuser Postgres that
  mirrors DigitalOcean:** TLS to the database verified against its CA (`DATABASE_CA_CERT`); the
  release sets `app_runtime`'s password from `APP_RUNTIME_PASSWORD` and refuses without it on a
  non-local database (migration 003's dev password would otherwise have reached production);
  config publishing now sets the tenant, because under a non-superuser owner FORCE RLS rejected
  it (local tests passed only because the local owner is a superuser). Dockerfile and
  `.do/app.yaml` added. SOP-PLAT-001 Deploy rewritten.
- **DNS** for puremed.uk is managed at 123-reg (nameservers are GoDaddy's `domaincontrol.com`).
- **New processor:** DigitalOcean goes into the data map and the DPIA.

### Deploy state, 29 Sep 2026 (handoff)

**Live:**
- Platform: DigitalOcean App Platform app `studio-platform` (team "Main Stage Studio", lon1, $10/mo,
  1 container, repo osmanakhtar/studio-platform `main`, autodeploy on push, PRE_DEPLOY job `release`)
  + Managed Postgres 16 `studio-platform-db` (lon1, $15.15/mo, 7-day PITR). https://app.puremed.uk
  (CNAME `app` at 123-reg to `sea-turtle-app-mbmgy.ondigitalocean.app`, Google Trust cert).
  Secrets encrypted in DO; Osman holds copies in his password manager.
- Verified: release on the real DB over TLS; `/health`; consultation post scores `laser_lift`;
  wrong origin 403; admin without token 401.
- Site: PureMed staging https://phpstack-1634277-6675729.cloudwaysapps.com/ at commit c6cea75,
  forms post to app.puremed.uk; staging origin is in `tenant.json` `allowed_origins` (commit 9178091).

**Done later on 29 Sep:**
- End-to-end test from the staging consultation page: `POST /f/puremed/consultation` 200 at
  13:04 UTC, result shown (test lead `deploy-test+e2e29sep@mainstagestudio.co.uk`).
- Gmail: OAuth client (Internal, project `puremed-platform-509918`) already existed from 27 Sep;
  `GOOGLE_CLIENT_ID`/`SECRET` added in DO (encrypted), care@ connected 14:49 UTC, `MAIL_TRANSPORT=gmail`
  live with `OUTBOX_DIR` removed (deploy 14:56 UTC), console test email received. Found: switching to
  `gmail` before connecting locks everyone out of the console (the sign-in link can't be emailed);
  SOP-PLAT-001 "Connect Gmail" now connects under outbox first, reading the link from the runtime log.
- Staging site checked: all 24 routes 200, HTML identical to the local build of c6cea75.
- Both test leads erased (Osman ran it from the DO app Console: lookup as app_runtime under the
  tenant, then the admin erase endpoint on localhost with the container's ADMIN_TOKEN; both 200).
  The command is in SOP-PLAT-001 "Admin API".

**Not done, in order:**
4. Before go-live: remove the staging origin from `allowed_origins`; guide PDF into
   `site/public/guide/`; Nafisa approves emails and consent in the console; DPIA; site preflight
   warnings (10 em dashes on index, 8 to 9 MB PNGs, WCAG contrast on home and treatments);
   then the puremed.uk cutover from dermis.ai (enable `puremed-prod` in targets.json, add
   `CLOUDWAYS_WEBROOT_PROD` secret, redirects for old URLs, A records at 123-reg).
5. Housekeeping: DigitalOcean 2FA (Osman); check Cloudways Billing for a Velocity charge
   (Full Access was switched on 29 Sep, no Velocity app created).

## v0.5 change note, 27 September 2026: Cloudways, console-edited emails, the consultation

Osman's answers to the v0.4 blockers:

- **D4 decided: Cloudways** (Velocity, managed Node with its Postgres). Accepted knowing check 1
  failed (no point-in-time recovery). Mitigation in SOP-PLAT-001: the most frequent app backup
  Velocity allows, plus a nightly `pg_dump` kept off the server. Migration 003 now tolerates a
  database user that can't create roles, and the server refuses to start as a superuser, so
  check 4 can't silently weaken tenant isolation.
- **Emails are edited in the console, not in files.** Nafisa signs in with a single-use emailed
  link (staff list in `tenant.json`), sees every automated email with its approval state, previews
  with sample details, sends herself a test, and saves. Saving writes a new immutable template
  version approved by her and re-pins every workflow that uses it. New sign-ups get it; people
  part-way through keep what they started with (DET-005). Repo templates are now only the
  seed: a console version always wins over the file for the same key. Patient emails can't be
  saved without an unsubscribe link, and live mode still refuses unapproved patient emails. This
  pulls a first piece of Phase 1 (console) forward.
- **The digital consultation feeds the platform.** `site/src/pages/consultation.astro` posts to
  `/f/puremed/consultation`. The server scores the answers again from a rule table
  (`tenants/puremed/forms/consultation.json`, CONS-R01 to R15). A test extracts `computeResult`
  from the live page and checks the two agree for all 17,280 answer combinations. Answers are
  stored in `form_submission` with a 400-day purge and deleted on erasure. Two workflows: the
  person's result straight away plus one check-in two days later (on the page's own notice, not
  marketing consent, so consultation leads are **not** put into the guide series), and an alert
  to `care@` with their answers. The anti-wrinkle result is named generically in email, because
  direct marketing mustn't promote a prescription-only medicine. `consultation-api/` is retired.
- **Gmail** connects from console Settings: an OAuth client that is Internal to PureMed's
  Workspace, scopes `gmail.send` plus `openid email` to confirm that the account which consented
  is `care@`. The refresh token is stored AES-256-GCM encrypted in `tenant_credential`. DNS was
  checked on 27 Sep: SPF, DKIM (Google key published) and DMARC (`p=quarantine`) are already
  live on puremed.uk (DNS managed at 123-reg, the registrar; nameservers are GoDaddy's domaincontrol.com).
- **Opt-in page** moved into `site/` as `guide-opt-in.astro` (plus `guide-thank-you.astro`),
  posting to the platform with first name, consent tick, 18+ tick and a honeypot. A test checks the
  consent wording on both pages matches the wording the platform records, word for word.

**Still open:** a Velocity app in London and its env; the Google OAuth client; `app.puremed.uk`
(proposed host name, CNAME added in 123-reg) and `PUBLIC_BASE_URL`; the guide PDF at
`site/public/guide/why-do-i-look-tired.pdf`; copy and consent wording approval by Nafisa; the
guide's "5 things" gap flagged in the opt-in page source; the privacy policy line for this
processing (email design §7); design review of the console before Nafisa sees it.

---

## v0.4 change note, 27 September 2026: Phase 0 build started

Started to deliver the engagement proposal's week-1 commitment (`02_clients/puremed/
puremed-engagement-proposal.md`: the campaign running in test on PureMed's own system by
Saturday 3 October 2026). Code is at `~/workspace/studio-platform/` (its own private repo,
github.com/osmanakhtar/studio-platform, since 29 Sep 2026; not in the workspace repo); run it with `studio-platform/sops/SOP-PLAT-001-phase0-spine.md`.

**Built and tested locally (37 tests against real Postgres):**
- Spine migrations: tenant, immutable `config_version`, person, person_identifier, consent
  ledger, suppression (hash only), person_tag, and an `event` table that refuses update, delete
  and truncate even for the owner. App connects as `app_runtime` with FORCE RLS on every tenant
  table, and tests prove cross-tenant reads and writes fail.
- Config as files (`studio-platform/tenants/puremed/`), published into hash-addressed versions.
  A workflow version pins template versions, and an enrolment pins its workflow version. Publishing
  validates merge fields, templates, stop rules and trigger tags, and **refuses live mode while any
  template is unapproved**.
- Capture endpoint `POST /f/:tenant/:form`: honeypot, per-IP limit, origin check, required
  consent and 18+ ticks, consent rows with wording hash and IP, tag, then workflow triggers.
- Workflow engine and worker: all six due times computed once at enrolment (quiet hours 20:00
  to 08:00, released at 09:00 Europe/London, correct across the clock change); claim with SKIP
  LOCKED; stop checks re-run before every send (suppressed, consent withdrawn, booking event,
  reply event) naming the rule ID; at-most-once sending (a crash mid-send becomes `unknown` for a
  person to check, never a second email); retries 3 times, 30 minutes apart; a permanent failure
  suppresses and stops; kill switch per workflow; daily cap; test mode that only mails an
  allowlist.
- One-click unsubscribe (RFC 8058, GET never unsubscribes), erasure (contact details go, a
  suppression hash stays, the event log is kept), manual "booked" mark, person timeline.
- Gmail API transport (`gmail.send` as `care@`) and an outbox transport. The Mailchimp import
  (dry run by default) brings in subscribers with Mailchimp's opt-in evidence, tags them and does
  **not** enrol them, doesn't import unsubscribed contacts, and suppresses cleaned addresses.

**Found in testing:** Fastify's default 100-character route-parameter limit made every
unsubscribe link return 414. Fixed, and covered by a test.

**Not built in Phase 0 (by design or not yet):** bounce and reply reading from `care@` (MSG-008,
MSG-010, needs the read scope); `person_facts` projection; the console (Phase 1); determinism
and data-protection gate contracts (`rule-trace.json`, `data-protection.json`) for this service.

**Blocking "running in test" on a real host by 3 October:**
1. **D4.** The service has nowhere to run until the host is decided (§3.4).
2. **Gmail OAuth client** on PureMed's Workspace, consented as `care@` (`gmail.send`), plus
   DKIM, SPF and DMARC checked (§3.6).
3. **Email copy.** All six templates are placeholders marked `[DRAFT]` with `approved: false`.
   Copy is to be drafted to the briefs in `docs/email-sequence-design.md` §6 and approved by Nafisa.
4. **The opt-in page** (`02_clients/puremed/web/guide-opt-in.html`) still posts to Mailchimp and has
   no first-name field, consent tick or 18+ tick. It needs `first_name`, `consent_marketing` and
   `age_18` fields, a hidden `website` honeypot, a post to `/f/puremed/guide-opt-in`, and a
   `/guide-thank-you` page.
5. **Guide PDF location.** `links.guide_url` is a placeholder until the file is hosted.
6. **Consent wording** in `tenants/puremed/consent/*.md` is a draft and needs Nafisa's approval.

**Decisions made while building (flag if wrong):** someone who unsubscribed and signs up again
gets the guide, and their new consent is recorded, but they are not re-enrolled in the series
(design §3 rule); erasure suppresses the address, so a later fresh sign-up from the same address
receives nothing until the suppression is removed by hand.

---

## v0.3 change note, 26 September 2026: D1, D2, D4 to D7 locked

Osman took every remaining recommendation except D9:

- **D1.** The v5 reversal is taken, framed: the platform is the Systems line made
  repeatable, with aesthetics as the first edition because PureMed is the proof. Logged
  in `mss-decisions-log.md`, superseding the v5 "clinic vertical dropped" and "Layer 2/3
  stays deferred" locks in part.
- **D2.** Platform = **Main Stage Studio**. Editions carry the niche; **Main Stage
  Aesthetics Studio** is the first.
- **D4.** Host = **Cloudways Velocity** (managed Node.js with PostgreSQL, generally
  available 2026) on **AWS London**. Same vendor as the static sites. The v0.2 worry that
  Cloudways only ran PHP no longer holds. Four checks before Phase 0 (§3.4).
  **Reopened later the same day:** the checks found no point-in-time recovery on
  Velocity's database. See §3.4 for the results and the proposed split host.
- **D5.** Phase 0 opt-in runs on the spine. No PHP stop-gap unless it becomes urgent.
- **D6.** Workflow template library only in v1; no visual builder.
- **D7.** Managed only at launch; the console is the client's window into a service MSS
  runs.

---

## v0.2 change note, 26 September 2026: Faces in house, care@ as the email integration

Two decisions from Osman, locked:

1. **Faces Consent comes in house.** The platform replaces Faces for customer records,
   consent forms and bookings, giving one ecosystem for managing customers. No
   integration with Faces, no booking-email parsing, no dual running beyond the cutover
   window. This confirms the clinical plan's §9 full-replacement posture at platform
   level and settles D3 (below) differently from v0.1's recommendation.
2. **Every email integration connects directly to `care@puremed.uk`.** Outbound mail,
   reply and bounce reading, staff notifications and calendar sync all run through that
   one mailbox. It is already the only user and the admin on PureMed's Workspace. No
   third-party email service and no invented sending addresses.

Consequences: phasing reordered so records and bookings come in house in Phase 2 (§6),
the DPIA now blocks Phase 2 rather than Phase 5, new §3.6 on the mailbox integration,
and register rows BKG-008, BKG-011, BKG-012, INT-001, INT-005, INT-006, INT-009, INT-010,
MSG-004, MSG-005, MSG-010, MSG-013, SEC-009, CAP-006, CLN-001 and CLN-002 added or
rewritten. Logged in `02_clients/puremed/.claude/puremed-decisions-log.md`.

---

## 0. Three decisions before this goes further

Each one changes what gets built, so they come first.

**D1. This reverses three locked v5 positioning decisions. DECIDED 26 Sep 2026:
reverse, framed as recommended.** On 4 August 2026 MSS locked
regulated professional services (advisers, accountants, legal) as the vertical, dropped
the clinic vertical because the founder had no track record in clinics, and deferred
the self-serve product tier (Layer 2/3). An aesthetics-first platform sold as the core
offering goes against all three. There is a reasonable case for it: PureMed is now a
real, live track record in the sector, and the Systems line was always "config-driven,
deterministic operational architecture". But it has to be decided, not drifted into.
*Recommendation (taken):* frame the platform as the Systems line made repeatable, with
aesthetics as the first edition because that is where the proof is. Logged in
`mss-decisions-log.md`.

**D2. The name. DECIDED 26 Sep 2026: Studio plus editions.** "Aesthetics" in the platform name works against the transferability
you want. *Recommendation (taken):* the platform is **Main Stage Studio** (the engine plus
console). Each vertical is an **edition**: **Main Stage Aesthetics Studio** first, then
for example Main Stage Salon Studio. Your chosen name is kept for what clinics buy, and
the second niche doesn't carry the first one's name.

**D3. Where the product competes. DECIDED 26 Sep 2026: customer records and bookings
are in house.** v0.1 recommended keeping the clinical record as a late add-on, because
the buy-vs-build spike (15 Aug) found Pabau, Consentz and similar products already cover
booking, consent and photos cheaply. The decision goes the other way: one ecosystem for
customer records and bookings, with Faces replaced. That is the stronger product. The
growth side (site, capture, nurture, social, campaigns, attribution) now sits on the same
record that holds bookings and consent, which no vertical vendor offers.
*What this costs:* the customer record (S7) and consent engine (S4) become cutover
requirements rather than later add-ons, and the DPIA moves forward to block Phase 2.
Clinical notes, photos, prescribing and treatment plans can still follow after cutover,
because Faces doesn't hold those today.

---

## 1. What exists today, and the problem it shows

| Component | Where | State | Where a person's data lives |
|---|---|---|---|
| Website | `02_clients/puremed/site/` (Astro, 20 pages) | Built, on Stage for review | none |
| CMS / live edit | Stage on the Pi | Built (client autonomy phases 0-4) | Stage JSON on the Pi |
| Consultation capture | `consultation-api/` (Fastify + SQLite) | Built, not deployed | SQLite file |
| Opt-in email campaign | `docs/email-sequence-design.md` (PHP + MySQL) | Designed, not built | MySQL |
| Social engine | `content/` (git state machine, lint, calendar) | Phase 1 built, publishing blocked on Meta | none (content only) |
| Booking | `~/workspace/booking-engine/service/` (Node + Postgres) | Phases 1-6 built, not wired to PureMed | Postgres `client` |
| Clinical platform | `clinical-platform/` | Scoping (S1-S15), no build | (future) |
| Live systems | Faces Consent (to be replaced, §6 Phase 2), WhatsApp, Gmail `care@` | Live | Faces, phones |

**The problem:** one prospective patient can be held in four stores at once, with no
shared identity. The email design has to *read booking notification emails* to find out
whether a lead booked, because the booking system and the email system don't share a
person. Nobody can answer "when did this client last book, what did we last send her,
and why" without opening three tools. A platform whose modules don't share a person
record can't be sold as a platform.

**The fix is a spine, not more modules.** Each module keeps its own engine. They share
one Person record, one consent ledger, one event log, one rules engine and one workflow
engine.

---

## 2. Determinism, defined for the whole platform

Inherited from `booking-engine-plan.md` §2 and widened from booking to every module.

> Given the same configuration version and the same inputs, the platform produces the
> same journey, requirements, price, documents, messages, schedule and published content,
> every time, and can show afterwards why it did.

Six rules:

1. **Rules are data.** Every requirement, segment, eligibility check, price and send
   condition is a row with an ID, evaluated by a pure function. Nothing is hardcoded or
   inferred. (DET-007)
2. **Every state change is an event.** One append-only log across all modules, carrying
   actor, time, cause and config version. Replaying it rebuilds state. (DET-002, DET-003)
3. **Snapshot, don't reference.** Records store the price, template version and rule IDs
   in force when they were committed. (DET-005)
4. **Time is explicit.** Due times are computed from stored inputs, never "whenever the
   cron runs". (DET-008)
5. **Side effects are idempotent.** Every send, publish and charge has an idempotency
   key. (DET-009)
6. **No LLM in a decision path.** AI drafts, a human approves, and deterministic lint
   checks. AI never decides who gets what, when, or whether anything publishes. (DET-006)

**What this gives the client:** every automated action on screen has a "why this
happened" line naming the workflow, step and rule. (DET-004)

**What this gives MSS:** the existing gates (`make trace`, `make datamap`,
`make figures`, `make preflight`) become platform release gates rather than
per-project checks. (OPS-004)

---

## 3. Architecture

Five layers. Anything below the surface layer is shared by every tenant and every niche.

```
SURFACES     Public site + booking widget + forms      Client console      Operator console
             (per tenant, static Astro)                (owner, staff)      (MSS)
─────────────────────────────────────────────────────────────────────────────────────────
MODULES      Site/CMS · Capture · Messaging · Workflows · Campaigns · Social · Booking ·
             Payments · Reporting                    [pack module] Clinical (aesthetics)
─────────────────────────────────────────────────────────────────────────────────────────
SPINE        Person · Consent ledger · Event log · Rules engine · Workflow engine ·
             Scheduler/worker · Audit · Tenant + config versioning
─────────────────────────────────────────────────────────────────────────────────────────
PLANES       Content plane: git per tenant, static build,  Operational plane: PostgreSQL,
             Stage-style propose → approve → publish        RLS per tenant, UK region
─────────────────────────────────────────────────────────────────────────────────────────
CONFIG       Core defaults  ←  Vertical pack (aesthetics)  ←  Tenant config (PureMed)
```

### 3.1 The two planes

- **Content plane:** anything published (pages, blog posts, microsites, message
  templates, social posts, campaign creative). Versioned in git, built statically,
  edited through the Stage live-edit pattern, gated by preflight and compliance lint.
  This already works. It needs to move off the Pi for production (WEB-013).
- **Operational plane:** anything that happens (people, events, consents, bookings,
  payments, sends, enrolments, tasks). Lives in PostgreSQL with row-level security per
  tenant. This is the booking engine's stack, widened.

The rule that keeps them apart: **templates are content, sends are operations.** A
message template is approved in the content plane. The workflow that sends it, and the
record that it was sent, sit in the operational plane and snapshot the template version.

### 3.2 The spine

| Entity | Holds | Notes |
|---|---|---|
| `tenant` | Business, brand tokens, timezone, enabled modules, pack | Root of every query |
| `config_version` | Immutable version of a tenant's config | Referenced by every record |
| `person` | Identity and contact only | One per human per tenant (PPL-001) |
| `person_identifier` | Normalised email, phone, external IDs | Deterministic matching (PPL-002) |
| `consent` | One row per consent type, with wording version and lifecycle | (CON-001) |
| `event` | Append-only: type, person, actor, cause, rule IDs, config version, payload | The audit trail and the timeline |
| `person_facts` | Derived: stage, source, last booked, next booking, recall due, spend | Projection of events, rebuildable (PPL-005) |
| `tag`, `segment` | Tags on people; segments as saved rule queries | (PPL-008, PPL-009) |
| `rule_table`, `rule` | Versioned rule rows with IDs | Pure evaluation (DET-007) |
| `workflow`, `workflow_version` | Trigger, closed-set steps, stop conditions | (WFL-001 to WFL-003) |
| `enrolment`, `scheduled_action` | Person in a workflow version; each due step | Claimed with idempotency keys |
| `task` | Human work created by workflows or staff | Feeds the Inbox |

Module tables (bookings, payments, messages, posts, forms, clinical) key to `person`
and write `event` rows. They never write `person_facts` directly.

### 3.3 Modules

| Module | Built on | Key point |
|---|---|---|
| **Site and CMS** | `site/` Astro + Stage live edit | Add blog-as-content (WEB-004) and CTAs resolved from the catalogue so they fail the build when unmapped (WEB-006) |
| **Capture** | Replaces `consultation-api` and the PHP opt-in | One endpoint, forms as config, writes Person + consent + tag events (CAP-001, CAP-002) |
| **Messaging** | Email design's sending model | All email through `care@puremed.uk` (§3.6). Keep SPF/DKIM/DMARC, quiet hours, one-click unsubscribe and no-pixel rules. Drop PHP. WhatsApp second. |
| **Workflows** | Email design's tags/enrolments/sends model, generalised | Closed step set, stop checks before every step, versions pinned per enrolment. Pack ships a template library; no canvas builder in v1 (WFL-005) |
| **Campaigns** | Studio Campaign Builder | One object linking segment, emails, posts, landing page and result (CMP-001) |
| **Social** | `content/` pipeline | Unchanged state machine. Add UTM on every link (SOC-008) and Meta publishing once prerequisites land |
| **Booking** | `booking-engine/service/` | Replaces Faces as PureMed's only booking system. Emits events to the spine; `client` becomes a foreign key to `person` (BKG-002, BKG-008) |
| **Payments** | Booking service's Stripe layer | Deposit policy as a rule table (PAY-003) |
| **Reporting** | Event projections | Every figure opens its underlying records (RPT-004). One stated attribution rule (RPT-003) |
| **Clinical** (pack) | `clinical-platform/` S4, S7-S11 | Keys to `person`. S4 and S7 are needed at Faces cutover; S8-S11 follow. Health data never leaves the module (CON-009) |

### 3.4 Stack

- **One service** (Node + TypeScript + Fastify) and **one PostgreSQL** database, UK
  region, managed host. This is the booking engine's stack. It isn't the only good
  choice, but it's the one with working, tested code, and choosing it avoids a second
  runtime. (PLT-006)
- **Static sites** stay Astro on Cloudways.
- **Stage** stays the review pattern. Its production editing surface moves off the Pi.
- **Host (D4): REOPENED 26 Sep 2026.** Chosen the same day as Cloudways Velocity
  (Cloudways' managed Node.js product) with its built-in PostgreSQL, subject to four
  checks. The checks were run against Cloudways' and DigitalOcean's own documentation
  the same day, and check 1 fails, so D4 is open again.

  | # | Check | Result | What the docs say |
  |---|---|---|---|
  | 1 | Point-in-time recovery | **Fail** | Velocity backs up the whole application (files plus database) on a schedule (frequency, retention and preferred hour set in the dashboard, "1 Day" given as the example) or on demand. Restore replaces the whole application with the chosen backup. There is no WAL archiving and no per-second recovery, so any events written since the last backup are lost on restore. That breaks DET-002 (the event log is the system of record). |
  | 2 | UK residency for database and backups | **Unconfirmed** | The server location is chosen at launch, but the Velocity docs don't list the locations. Cloudways' classic platform has London on all five providers; one competitor's write-up says Velocity runs on DigitalOcean only. Off-site backups are "stored on Amazon infrastructure" for every provider, and no region is given. Every Velocity app also sits behind Cloudflare Enterprise, which terminates TLS, so Cloudflare becomes a processor too. |
  | 3 | DPA covering health data | **Partial** | Cloudways sends sub-processor objections to DigitalOcean, and DigitalOcean's DPA is an automatic addendum: it names health data as sensitive data without prohibiting it, uses the UK extension to the Data Privacy Framework with an IDTA addendum as fallback, gives 30 days' notice of new sub-processors, deletes data within 30 days of closure, and requires notification "without undue delay". It makes no data-location commitment, and it doesn't say explicitly that it covers Cloudways. Confirm that in writing. |
  | 4 | Database role rights for row-level security | **Unknown, testable** | Installing PostgreSQL gives one database, one username and a password, inside the app's own environment (not a separate managed database), and the install can't be reversed. The docs don't say whether that user can create roles. Row-level security can still work without a second role if every tenant table uses `FORCE ROW LEVEL SECURITY`, but that needs testing on a live plan (from $20 a month). |

  **Proposed replacement (not yet decided):** a split host. The Node service runs on
  Velocity if it offers London (check the location list in the Cloudways dashboard), and
  the database is **DigitalOcean Managed PostgreSQL in LON1**. DigitalOcean's docs give
  7 days of point-in-time recovery (fork or restore to any second in that window), no
  superuser but an admin role that can create users, and the same DigitalOcean DPA. That
  passes check 1, makes check 4 straightforward, and leaves checks 2 and 3 to confirm
  with DigitalOcean in writing. It also adds a separate database bill and a network hop
  between the app and the database. The other option Velocity offers directly is
  Supabase, which has a London region, point-in-time recovery as a paid add-on, and
  native row-level security, but it adds a third vendor for health data.

### 3.5 What to consolidate (and what to stop)

| Today | Proposal | Why |
|---|---|---|
| `consultation-api` (SQLite, undeployed) | Fold into the Capture module | Second lead store |
| PHP + MySQL opt-in service (designed) | Don't build. Keep its data model, rules and sending setup as the Messaging and Workflow design | Third store and a second language |
| Faces Consent (records, consent forms, diary) | Migrate and retire at cutover (BKG-008, BKG-011, INT-006, INT-010) | One ecosystem for customer records and bookings (decided 26 Sep) |
| Parsing Faces booking emails in `care@` | Don't build. The email design's §3 "Knowing she has booked" is superseded | Bookings happen in the platform, which emits `booking.created` itself |
| Stage JSON on the Pi as the CMS of record | Move the editing surface to the managed host; git stays the content store | Uptime and backups for a paid product |

### 3.6 Email integration: `care@puremed.uk`

Decided 26 Sep 2026. Each tenant connects **one business mailbox** as its only email
integration point (INT-001). For PureMed that is `care@puremed.uk` (INT-009): a real user
mailbox, the only user on Workspace Business Starter, and the admin account.

| What | How it runs through `care@` |
|---|---|
| Outbound mail (nurture, campaigns, confirmations, reminders, aftercare by email) | Sent as `care@puremed.uk`, display name may name the clinician ("Nafisa at PureMed") (MSG-005) |
| Replies | Land in `care@` as normal. The platform matches them to its own threads, adds them to the person's timeline and pauses marketing workflows (MSG-010) |
| Bounces | Delivery-failure notices arrive in `care@`; the platform reads them and suppresses the address (MSG-008) |
| Staff notifications | New leads, bookings, replies and failures email `care@` by default, with optional phone push (CAP-006) |
| Calendar | Booking engine syncs to `care@`'s Google Calendar and is its only writer after cutover (INT-005, BKG-012) |
| Domain authentication | SPF, DKIM, DMARC on `puremed.uk` checked before the first send (MSG-004) |

**Access.** One OAuth consent, given once signed in as `care@`, with the narrowest scopes
that work: send, read and calendar. No app password, and no service account with
domain-wide delegation. Google can't limit a token to one label, so the code reads only
threads the platform started plus delivery failures, and every read is logged (SEC-009).
`care@` holds all patient correspondence, which makes this the most sensitive credential
in the platform. It is revocable instantly from the Workspace admin console.

**Two things to check before Phase 0:**
- **Sending limit.** Every send now comes from one Workspace user, which has a daily
  cap. Confirm the current figure for Business Starter and whether the SMTP relay is
  available on that plan. The worker meters against it (MSG-013). A 212-person campaign
  fits comfortably; a list of several thousand wouldn't go out in one day.
- **Which calendar is the diary.** Confirm the calendar Nafisa actually watches is
  `care@`'s, not a personal Google account's, before cutover.

---

## 4. The client console

Written from the client's side. The questions you asked, and where each is answered:

| The client asks | Where | Built from |
|---|---|---|
| When did this client last book? | People list column **Last booked**, and the Person page header | `person_facts` (PPL-005) |
| What happened with this person? | Person page **timeline** | `event` (PPL-006) |
| What was the last thing the system did, and why? | **Activity** feed, each row with a "why" line | `event` + rule IDs (UXC-003, DET-004) |
| How do I create a campaign? | **Campaigns** → New: goal, audience, channels, content, schedule, measure | CMP-001 to CMP-005 |
| How do I start a new workflow? | **Workflows** → Library → Enable, set parameters, simulate, turn on | WFL-005, WFL-007 |
| How do I put one person into a workflow? | Person page → **Enrol in workflow** | WFL-006 |
| What is this automation doing right now? | Workflow **run view**: who is on which step, next action and when | WFL-008 |
| What needs me today? | **Inbox** (the landing screen) | UXC-002 |
| Is any of this working? | **Today** dashboard, figures open their records | RPT-001, RPT-004 |

### 4.1 Navigation

`Today · Inbox · People · Diary · Campaigns · Workflows · Content (Site, Blog, Social) ·
Reports · Settings`. Modules the tenant hasn't enabled don't appear. Roles narrow it
further (UXC-007): Marketing (Shuab) sees Campaigns, Workflows and Content but no
clinical fields; Reception sees Diary and People with the reception view of the record.

### 4.2 Screens

- **Today:** four figures (new leads, bookings, booked from leads, diary fill next 14
  days), today's diary, and the top of the Inbox. Mobile first (UXC-005).
- **Inbox:** approvals (posts, emails, campaign items), tasks created by workflows,
  unmatched bookings, replies waiting, failed sends. Ordered by due time, each with a
  single primary action.
- **People:** searchable list with Stage, Source, Last booked, Next booking, Consent
  columns. Saved segments down the side.
- **Person:** a header with key facts, then the timeline, then actions (Book, Enrol in
  workflow, Tag, Message, Export, Erase). Clinical tabs appear only for clinical roles.
- **Workflows:** a library of pack templates with on/off state; the run view per
  workflow; version history.
- **Campaigns:** list with status and result against the goal; a builder with an
  audience preview showing count and exclusions before anything is scheduled.
- **Activity:** everything the system did, newest first, each row with a "why" line.
- **Content:** site pages (live edit), blog, social calendar, asset library.
- **Settings:** catalogue, hours, team and roles, connections with health, templates,
  compliance rules (read-only for tenants in a regulated pack), data and export.

Every outward action names its consequence before it confirms ("Send to 212 people
now") (UXC-008).

---

## 5. Transferability: core, pack, tenant

| Layer | Holds | Example |
|---|---|---|
| **Core** (162 rows) | Spine, all generic modules, console, gates | Person, workflows, campaigns, booking engine, site template engine |
| **Vertical pack** (23 aesthetics rows) | Catalogue fields, rule tables, compliance file and lint, workflow and campaign templates, DPIA, optional modules | Recall intervals per treatment, POM advertising lint, clinical module, prescriber rules |
| **Tenant** (7 PureMed rows) | Brand, catalogue content, hours, staff, integrations, migrations | Faces migration and exit, diary cutover, `care@` as the mailbox, Whitehouse CQC routing |

A pack is a directory of data plus optional module code, never an edit to core
(PLT-004). The aesthetics pack is the first one; building it forces the pack boundary
to be real.

**The test that earns the word "transferable" (COM-005):** onboard one tenant in a
different niche (for example a salon, physio or accountant) with zero core code change.
Until that has happened, sell it as "built to transfer", not "transferable". Vera
showed the content side can do this (onboarded with zero code on 24 Jul); the
operational side hasn't been tested.

---

## 6. Phasing

Ordered so each phase delivers something PureMed uses, and the spine is built by real
work rather than on speculation.

| Phase | Delivers | Proves |
|---|---|---|
| **0. Spine + first workflow** | Person, consent, events, tags, workflow engine, capture endpoint, email sending. The *Why do I look tired* opt-in runs on it instead of PHP. | The spine carries a real workload |
| **1. Console v1** | Inbox, People, Person timeline, Activity, Workflow run view, kill switch | The client can see and control automation |
| **2. Faces in house** | Customer record (S7) and consent engine (S4) with the Faces form library unchanged. Booking engine writes to Person and emits events. Faces export verified, migrated, reconciled; forward diary moved; platform becomes the only calendar writer; Faces retired. Deposits on every booking. Recall and no-show workflows. | One ecosystem for customer records and bookings |
| **3. Campaigns + reporting** | Campaign object, audience preview, attribution, Today dashboard, monthly report | "Drive bookings" is measurable |
| **4. Social publishing + blog** | Meta publishing, UTM, post metrics, blog as content, CMS off the Pi | Content loop closes |
| **5. Rest of the clinical pack** | Treatment notes and batch tracking, prescribing record, clinical photography, treatment plans (S8-S11) | Aesthetics edition complete |
| **6. Second niche** | A non-aesthetics pack and tenant, zero core change | Transferability |

**Trade-off in Phase 0:** building the opt-in on the spine is slower than the PHP route
by roughly the cost of the spine tables and worker. The benefit is that no lead store is
left to migrate later. If the lead magnet has to go live within days, ship the PHP
version as a disposable stop-gap with an export, and say so in its README. Don't let a
stop-gap become a second system.

**The DPIA now blocks Phase 2.** Bringing Faces in house puts health data and signed
consent into the platform at cutover, not at Phase 5. The DPIA and the Faces export
check (INT-010) both have to be done before Phase 2 starts.

**Gates before any phase is called done:** determinism review, data-protection review
(the booking engine failed both on 18 Aug and those findings carry into the spine:
event log, snapshot, credential-as-identifier, no DPIA), design review for console
screens, and an operator SOP per module.

---

## 7. Open decisions

| # | Decision | Recommendation |
|---|---|---|
| D1 | Reverse v5 on clinic vertical and self-serve tier? | **Decided 26 Sep:** yes, framed as the Systems line made repeatable; logged |
| D2 | Name | **Decided 26 Sep:** platform = Main Stage Studio; edition = Main Stage Aesthetics Studio |
| D3 | Product core | **Decided 26 Sep:** customer records and bookings in house, Faces replaced |
| D4 | Host for the Node + Postgres service | **Decided 29 Sep: DigitalOcean App Platform + Managed PostgreSQL, London** (v0.6 note), replacing the 27 Sep Velocity choice |
| D5 | Phase 0 opt-in: on the spine, or PHP stop-gap first? | **Decided 26 Sep:** on the spine; PHP stop-gap only if it becomes urgent |
| D6 | Workflow authoring: template library only in v1, or a visual builder? | **Decided 26 Sep:** library only. A builder can come once three tenants ask for it |
| D7 | Managed vs self-serve at launch | **Decided 26 Sep:** managed only; the console is the client's window into a service MSS runs |
| D8 | Email integration point | **Decided 26 Sep:** `care@puremed.uk`, direct, for every email integration |
| D9 | Faces cutover date and contract notice | Set once the export is verified complete (INT-010) and the DPIA is done. Needs Faces' contract and notice terms, still open |

## 8. Known stale docs found while writing this

- `02_clients/puremed/puremed-growth-engagement-plan.md` still says the `site/` Astro
  build doesn't go live and dermis.ai keeps `puremed.uk`. That was reversed on 15 Sep
  (see PureMed `CLAUDE.md`). Needs a pass.
- Memory points to `03_resources/unified-content-studio-architecture.md` as canon for
  the Unified Content Studio proposal. The file isn't at that path. The Content module
  here overlaps with that proposal, so find it (or confirm it's lost) before Phase 4.

---

## Resume prompt

> Read `main-stage-studio/01_mss/product/aesthetics-studio/platform-design.md`, the v0.5 note.
> Code is at `~/workspace/studio-platform/` (private repo github.com/osmanakhtar/studio-platform,
> push it separately, `wsbackup` does not cover it); run and deploy it with SOP-PLAT-001. Next: create
> the Velocity app and deploy (Deploy section), point `app.puremed.uk` at it, create the Google
> OAuth client as `care@` and connect Gmail from console Settings, put the guide PDF in
> `site/public/guide/`, run a design review of the console, then have Nafisa approve the copy in
> the console. Then write `rule-trace.json` and `data-protection.json` for the service and run
> `make trace` and `make datamap`.
