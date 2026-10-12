# SOP-MSS-005: Products, scope and cost (scoping and quoting a v6 product)

| | |
|---|---|
| **Purpose** | One place that says what each MSS product includes, where the boundary between products sits (payments, booking, email sending, hosting), what each costs MSS to deliver, and how to turn a lead into a quote |
| **Operator** | Os, or a Claude session preparing a proposal |
| **Verified** | Not yet run (drafted 2026-10-12; hours are estimates until real engagements are logged against them) |
| **Systems touched** | Proposal template `01_mss/ops-finance/mss-proposal-template.md`, client folder `02_clients/<client>/`, `make figures` |
| **Canon doc** | `01_mss/strategy/mss-positioning-v6-proposal.md` §5 (products, ratified 10 Oct 2026; Review added 11 Oct) and `.claude/mss-decisions-log.md` |

Prices below are the ratified ones. **Hours, effective rates and the payments placement
are proposals in this SOP, not decisions.** Anything marked *Proposed* needs Os's call
and a decisions-log entry before it goes on the site or in a proposal.

---

## 1. The product map in one view

Two layers. Everything the public sees is static and owned by the client (the
**Website layer**). Everything that remembers a person, a consent, a booking or a
payment lives in a database (the **Platform layer**). The rule that decides where a
feature belongs:

> **If it needs to remember something about a person after the page closes, it is
> Platform. If it only needs to be shown, it is Website.**

| Product | Layer | Type | Target | Founding (first 3) | Timeline |
|---|---|---|---|---|---|
| Review | Advisory | One week | £1,500 | £450 | 1 week |
| Identity | Brand | One-off | £2,500 | £750 | 3 to 4 weeks |
| Website (10 pages) | Website | One-off | £1,800 | £540 | 3 to 5 weeks |
| Website, extra page | Website | Per page beyond 10 | £75 | £22.50 | |
| Opening Night (Identity + Website) | Brand + Website | One-off | £4,300 | £1,290 | 5 to 8 weeks |
| Campaign | Website, sends via Platform or client tool | One-off | £1,800 | £540 | 2 to 3 weeks |
| Content | Brand | Monthly, 3-month minimum | £3,500/mo | £1,050/mo | Ongoing |
| Platform Foundation | Platform | One-off | £8,000 | £2,400 | 4 to 6 weeks |
| Platform modules beyond Foundation | Platform | Scoped | Quoted | Quoted | Scoped |
| Care (site) | Running | Monthly | £350/mo | £105/mo | Ongoing |
| Care (with Platform) | Running | Monthly | Not set | Not set | Ongoing |
| Content Studio app | Tool licence | Included with Content or Care (*Proposed*) | Not set standalone | Not set standalone | Ongoing (§4c) |

Founding = 30% of target. Review's fee is credited against any product bought within 8 weeks.

---

## 2. Where accepting payments fits

**Answer: payments are a Platform module, not part of Website.** *Proposed*, with one
narrow exception on the Website side.

Why it cannot sit in Website:

- The Website product is a static Astro site with no server and no database. A real
  payment flow needs both: a record of who paid for what, a webhook from Stripe that
  confirms it, refunds, and an audit trail.
- Payments almost always come with rules (deposit amount per service, refund window,
  no-show fee, keeping a card on file). In the platform design those rules are a rule
  table (PAY-003) on the spine, beside Booking. That is Platform by definition.
- Taking money brings data protection work with it: Stripe as a processor, how long
  payment and deposit records are kept, card-on-file consent. PureMed's DPIA only gained
  these questions (B8.5 to B8.10) on 2 Oct 2026. That paperwork is part of Platform's
  scope, not Website's.

The Website exception (include at no extra cost, *Proposed*):

- **A "pay" link or button that hands off to Stripe**, using a Stripe Payment Link or
  Buy Button in the **client's own Stripe account**. Fixed-price items only (a
  voucher, a course, a consultation fee). MSS stores nothing, there is no booking
  attached, and Stripe sends the receipt. It is a link, so it counts as page content.

What it looks like on the price list:

| Need | Product | How it is priced |
|---|---|---|
| "Let people pay a fixed fee from my site" | Website | Included (a link out to the client's Stripe) |
| "Take a deposit when someone books" | Platform: Bookings and payments module | Scoped beyond Foundation |
| "No-show fees, cards on file, refunds by rule" | Platform: Bookings and payments module | Scoped beyond Foundation |
| "Sell products online (cart, stock, shipping)" | Not offered | Refer to Shopify or similar |

Build state, so nothing is oversold:

- The Stripe layer is built and tested in `booking-engine/service/src/payments/` (demo
  tenants only, never live money).
- It is **not yet in studio-platform**, the live multi-tenant platform. The next platform
  step is the booking and Stripe build spec (platform-design v0.11 note).
- So today the Bookings and payments module is sellable only as scoped work with a
  realistic timeline, and PureMed is the first place it should go live.

Money flow: the client always has their own Stripe account and pays Stripe's fees
directly. MSS never holds client money and never sits in the payment chain.

---

## 3. Product scopes

Each product lists what is in, what is out, what it depends on, and the third-party
costs the client pays directly (settled 11 Oct 2026: third-party costs are paid by the
client, per product, and listed in the scope).

### 3.1 Review

- **In:** a look at the brand, site, social channels and tools; written findings; brand
  guidelines tidied or written down; a campaign calendar; a costed plan for what to
  build; a walkthrough call.
- **Out:** any build, any copy beyond examples, any running of channels.
- **Depends on:** read access to the site, socials and current tools.
- **Client pays:** nothing.
- **Note:** the costed plan should quote MSS products by name, so the fee credit has
  somewhere to land.

### 3.2 Identity

- **In:** one-page positioning; the name story and a line; tone of voice guide; visual
  identity (mark, colour, type, imagery rules); a short brand book; a starter asset set
  (generated imagery and templates). All source files, in editable formats.
- **Out:** a website, photography shoots, printed items, trademark searches or filing.
- **Client pays:** any paid font licences (named in the brand book); trademark costs if
  they want them.

### 3.3 Website

- **In:** 10 pages (a page is a template plus its copy; blog posts and repeating items
  count once); copy in the client's voice; static Astro build; live editing through
  Stage; sitemap, schema, canonicals; forms wired to their destination; launch and domain
  set-up; the Stripe "pay" link from §2 if wanted.
- **Out:** a database, logins for the client's customers, bookings, deposits, email
  campaigns, e-commerce, ongoing hosting (that is Care).
- **Extra pages:** £75 target, £22.50 founding, each beyond 10. Under 10 the price stays.
- **Client pays:** the domain (about £10 to £20 a year), any paid stock or fonts.
  Hosting is billed through Care.

### 3.4 Campaign

- **In:** a lead magnet (guide or quiz); landing and thank-you pages; consent wording; a
  4 to 6 email follow-up series written with the client; launch ad and social creative;
  click tracking.
- **Out:** ad spend and ad account management beyond launch; ongoing content (that is
  Content).
- **Depends on:** Website or an existing site it can attach to, **and** somewhere to
  send email from: either a Platform, or the client's existing tool (Mailchimp and the
  like).
- **Client pays:** ad spend; their email tool if they are not on Platform.
- **Boundary to watch:** if the client has no sending tool, Campaign quietly becomes a
  Platform sale. Say so at scoping, never discover it mid-build.

### 3.5 Content

- **In:** monthly calendar; designed posts and carousels; edited reels and clips;
  captions in the client's voice; every piece checked against their rules and approved
  by them before release; assets delivered to their storage.
- **Out:** posting on their behalf (settled 11 Oct: the client posts from their own
  accounts), community management, replies and DMs, paid ads.
- **Volume:** *Proposed*, write it into every Content scope: up to 12 posts or carousels
  and 4 reels a month. Without a stated volume this product has no ceiling.
- **Client pays:** licensed music beyond free libraries; any paid stock.

### 3.6 Platform Foundation

- **In:** one record per customer; the consent ledger; email campaigns and automations
  the client writes and approves in their console; forms, quizzes and intake feeding the
  record; migration from old tools (one source system, *Proposed*); the data map, DPIA
  and DPA done in the build.
- **Out (scoped as modules beyond Foundation):** Bookings and payments (§2); WhatsApp
  messaging; clinical or regulated records packs; a second migration source; custom
  reporting.
- **Condition before any contract:** the scope-of-responsibility clause (positioning v5
  §8, v6 §5.5) must exist.
- **Client pays:** their email sending (Google Workspace mailbox or a sending service);
  Stripe fees if payments are added; Meta messaging fees if WhatsApp is added.

### 3.7 Care

- **In (site):** hosting, backups, security updates, small changes on request, a
  monthly check.
- **Small change:** *Proposed*: up to one hour a month; anything bigger is quoted.
- **With a Platform:** price not set yet (left to scoping on 11 Oct). It must at least
  cover the tenant's share of the database and app hosting, email sending set-up and
  monitoring, and platform updates.

---

## 4. Estimated cost to deliver

MSS's cost is almost entirely Os's time. Cash costs are small because the client pays
third parties directly. The table turns each price into an **effective hourly rate**
from estimated hours, so a product that pays badly is visible before it is sold.

Hour estimates are *Proposed*, based on PureMed (about 130 hours over three months for
the system, 10 a week) and the v6 build timelines. Replace them with logged hours after
each first engagement.

| Product | Est. hours | Effective rate, founding | Effective rate, target |
|---|---|---|---|
| Review | 12 to 16 | £28 to £38/hr | £94 to £125/hr |
| Identity | 30 to 40 | £19 to £25/hr | £63 to £83/hr |
| Website (10 pages) | 35 to 50 | £11 to £15/hr | £36 to £51/hr |
| Website, extra page | 1.5 to 2 | £11 to £15/hr | £38 to £50/hr |
| Opening Night | 65 to 90 | £14 to £20/hr | £48 to £66/hr |
| Campaign | 20 to 30 | £18 to £27/hr | £60 to £90/hr |
| Content (per month) | 25 to 35 | £30 to £42/hr | £100 to £140/hr |
| Platform Foundation | 80 to 120 | £20 to £30/hr | £67 to £100/hr |
| Care, site (per month) | 2 to 4 | about £23 to £51/hr | about £85 to £173/hr |

Care rates take £4 to £12 a month of hosting per site out of the fee first (§4b.4).

What the table says:

- **Website founding is the weakest product**: £11 to £15 an hour, below PureMed's
  "another client" rate of £25 an hour and well below the UK day-rate reference of
  £250 to £600 a day (about £33 to £80 an hour, Osdire, checked 26 Sep 2026). It is a
  deliberate loss leader for the first three; do not extend the founding window for it.
- **Content and Review pay best per hour** and carry the least delivery risk.
- **Platform has the widest spread** and the highest consequence if it goes wrong. Its
  hours are the least certain until a second tenant has been onboarded.

## 4b. Run and infrastructure costs

What it costs in cash to build and keep each product running. Figures marked
**Actual** are from Os's bills (12 Oct 2026); everything else is marked as an
estimate. Where a supplier bills in dollars, check the converted figure on the day.

### 4b.1 The current stack and what it costs

| Item | What it runs | Cost a month | Status | Shared by |
|---|---|---|---|---|
| DigitalOcean: App Platform app `studio-platform` (1 GiB, 1 container) and Managed Postgres 16 `studio-platform-db` (smallest size), both lon1 | The Platform service and every tenant's records; daily backups and 7-day point-in-time recovery included | **£15** | Actual | All Platform tenants |
| Cloudways server `mss-do-lon-01` | Static sites: MSS, PureMed, client sites; Cloudways backups | **about £12** | Actual (last month) | All Website clients and MSS |
| Stage on the Raspberry Pi (`mss-review.duckdns.org`) | Client review, live editing, auto-publish | Electricity only; DuckDNS free | Running at home | All clients |
| GitHub private repos and Actions | Site and platform code, installer builds | £0 on the free plan | Estimate (confirm plan) | All |
| Local sandbox (Docker Postgres on the Mac) | Platform build and demos | £0 | Running | Build time only |
| **Infrastructure total** | | **about £27** | | |

Cost per client falls as clients share the same servers:

| Clients on it | Platform (£15) per tenant | Websites (£12) per site |
|---|---|---|
| 1 | £15 | £12 |
| 3 | £5 | £4 |
| 5 | £3 | £2.40 |

Today PureMed is the only Platform tenant, and Cloudways carries about three sites.

### 4b.2 When the stack needs an uplift

Each part of the stack has a limit. Upgrade when a trigger is hit, not in advance.
Next-tier prices are estimates from the suppliers' size ladders: check the live price
on the day.

| Part | Holds today | Uplift trigger | Uplift | Est. extra a month |
|---|---|---|---|---|
| **Stage on the Pi** | Every client's review and live editing, on home broadband and an SD card (which threw a write error on 30 Sep 2026) | **Now, before the next client who edits their own site.** Requirement WEB-013 already says the editing surface must run off the Pi for a paid product | Move Stage to a small managed server (a small DigitalOcean droplet, or a second app on the Cloudways server if it has room) with backups | £5 to £10 |
| **Platform: tenant addressing** | One address, `app.puremed.uk` (`PUBLIC_BASE_URL` is global) | **The second Platform tenant** | Code change so each tenant has its own address on the same app; add their domain. Time, not cash | £0 |
| **Platform: app container** (1 GiB) | One tenant comfortably | Memory sustained above about 70%, slow pages, or restarts in the DigitalOcean insights; most likely around 3 to 5 active tenants, sooner if many scheduled sends run at once | Next size up (2 GiB), or a second container | about £10 to £15 |
| **Platform: database** (smallest size) | One tenant, 10 GiB disk | Connections near the limit shown on the database's settings page, disk above about 80%, or slow queries; most likely around 5 to 10 tenants | Next size up | about £15 |
| **Platform: high availability** | A single database node; recovery is from backups | The first client whose contract needs an uptime promise, or any client whose bookings or payments run through the Platform | Add a standby node | roughly doubles the database cost (about £15) |
| **Cloudways server** | About three static sites; light load | Disk above about 80%, or around 10 to 15 sites, or one busy site slowing the others | Next server size up | about £10 to £15 |
| **Monitoring** | None recorded | **Before the second paying client** | A free uptime monitor on each site, the Platform and Stage, alerting Os | £0 |
| **Email sending** | Each tenant sends from their own Google Workspace mailbox through the Gmail API | A tenant sending more than Google's daily limit per mailbox (about 2,000 a day) | A sending service for that tenant, paid by them | Client's cost |

A realistic path: Stage off the Pi now (+£5 to £10), monitoring before the second
client (£0), app container at about 3 to 5 Platform tenants (+£10 to £15), database at
about 5 to 10 (+£15). With five Platform tenants the stack would cost roughly £57 to
£67 a month, up to about £80 if the Cloudways server also moves up a size. The Platform
part alone would be about £40 to £45, or about £8 to £9 per tenant.

### 4b.3 Run cost per product

"MSS carries" means it comes out of MSS's fee. "Client pays" means it goes in the
scope as a third-party cost, paid directly or recharged at cost with no mark-up.

| Product | Build-time cost | Monthly run cost once live | Who carries it |
|---|---|---|---|
| Review | None | None | |
| Identity | Image generation, £35 for the month it is bought (decided 12 Oct 2026: absorbed into the fee) | None | MSS carries generation; client pays paid font licences |
| Website | Stage review (no cash cost) | Cloudways share, about £4 a site with three sites; domain £10 to £20 a year | Hosting through Care; client pays the domain |
| Campaign | Same as Website for its pages | Email sending from the client's Google Workspace mailbox (£7 a month plus VAT per user, usually one they already have), or their own email tool | Client pays sending and ad spend; pages hosted under Care |
| Content | Image generation, £35 in any month it is bought (absorbed); licensed music if needed | None after delivery; assets go to the client's storage | MSS carries generation; client pays music beyond free libraries |
| Content Studio app (§4c) | Apple Developer Program, about £79 a year, shared by every edition | None if installed; a hosted version adds server cost (§4c) | MSS carries |
| Platform Foundation | Local sandbox (no cash cost) | Platform share: £15 with one tenant, £5 with three | Through Care with Platform; client pays their mailbox |
| Platform: Bookings and payments | None extra | Stripe card fees per payment (Stripe's published UK rate, check on the day) | Client pays, in their own Stripe account |
| Platform: WhatsApp | Meta business verification (free) | Meta's fee per delivered template message | Client pays, on their own WhatsApp Business Account |
| Care, site | | Cloudways share, £4 (three sites) to £12 (one site) | MSS carries |
| Care, with Platform | | Cloudways share plus Platform share: about £19 today, about £9 with three tenants | MSS carries, out of a fee still to be set |

At £35, generation takes about 5% of an Identity at its £750 founding price, and about
3% of a £1,050 founding Content month. Absorbing it is safe at both prices.

### 4b.4 What Care has to cover

| | Care, site, founding | Care, site, target | Care, with Platform |
|---|---|---|---|
| Fee | £105 | £350 | Not set |
| Infrastructure | £4 to £12 | £4 to £12 | about £19 today; about £9 at three tenants |
| Left for time (2 to 4 hours) | £93 to £101 | £338 to £346 | |

**Cost floor for Care with Platform** (*Proposed*, for decision 6): infrastructure share
plus about 4 hours a month of monitoring, updates and support. At PureMed's "another
client" rate of £25 an hour: about £120 a month today, about £110 at three tenants. At
£75 an hour: about £320 today, about £310 at three tenants. The uplifts in §4b.2 add
about £2 to £4 per tenant once the stack has grown, so set the price with that headroom.

### 4b.5 MSS fixed overhead (not tied to one product)

| Item | Cost | Status |
|---|---|---|
| DigitalOcean | £15 a month | Actual; carried in full by MSS until a second tenant arrives; PureMed pays at cost from January 2027 |
| Cloudways | about £12 a month | Actual (last month) |
| Image generation (Higgsfield) | £35 in any month it is bought | Actual; bought only for a paid Identity or Content job, or MSS's own marketing |
| Apple Developer Program | about £79 a year (about £6.60 a month) | Not yet bought; needed to sign the Content Studio app (§4c) |
| Claude subscription | £20 a month in the spend tracker | **Check**: confirm the current plan |
| MSS domain | Not recorded | Confirm the renewal date and cost |
| Stage off the Pi (once moved) | £5 to £10 a month | Not yet moved (§4b.2) |
| **Running total, known items** | **about £27 a month, plus £35 in generation months** | Before Claude, domain, Apple and the Stage move |

### 4b.6 Third-party costs the client pays

| Cost | Typical figure | Products |
|---|---|---|
| Domain | £10 to £20 a year | Website |
| Stripe card fees | Stripe's published UK rate (check on the day of quoting) | Website pay link, Platform payments |
| Email mailbox for sending | Google Workspace £7 a month plus VAT per user | Campaign, Platform |
| Other email tool, if not on Platform | Their current plan | Campaign |
| Meta WhatsApp fees | Per delivered template message | Platform WhatsApp module |
| AI drafting in the Content Studio app (optional) | A few pence per draft, on their own API key | Content Studio app |
| Ad spend | Client's budget | Campaign |
| Paid fonts, stock, music | As used | Identity, Website, Content |

---

## 4c. The Content Studio app: licensing, signing and hosting

**What it is today.** Main Stage Content Studio (`carousel-studio/`) is an Electron Mac
app, one branded edition per client, that lets the client make on-brand carousels and
clips with their compliance rules checked as they type. The first edition is PureMed's
(1.1.0, Intel and Apple Silicon `.dmg` files). It is handed over as a download.

**Where it sits in the products (*Proposed*):** a tool MSS licenses, not something the
client owns. Included for as long as the client pays for Content or Care; it stops
being licensed when both end. This matches standard term 5 in the proposal template
(MSS owns the shared tooling and licenses it while they are a client). A standalone
price is not set.

### 4c.1 Signing (needed either way while it stays an install file)

Today the app is unsigned (`"identity": "-"`, `hardenedRuntime: false` in
`package.json`), so macOS blocks it on first open and the client has to go to
**Privacy & Security > Open Anyway**. Unsigned is acceptable for family; it is not
acceptable for a paying client, and it rules out automatic updates.

| Step | What | Cost |
|---|---|---|
| 1 | Join the Apple Developer Program as an **organisation** (needs a D-U-N-S number for the MSS company) so the signature reads "Main Stage Studio", not a personal name | about £79 a year; D-U-N-S is free |
| 2 | Create a **Developer ID Application** certificate; keep it in the login keychain and a copy in the password manager | Included |
| 3 | In `package.json`: set the signing identity, `hardenedRuntime: true`, entitlements for the bundled ffmpeg binary, and notarisation (electron-builder's `notarize` with an app-specific password or App Store Connect API key) | Time |
| 4 | Build, then check: `codesign --verify --deep --strict` and `spctl --assess --type execute` on the `.app`; the `.dmg` should open with no warning on a second Mac | Time |
| 5 | Optional: turn on automatic updates (electron-updater with `latest-mac.yml`, which the build already produces), served from a private GitHub release or the Cloudways server | £0 |

Windows is not needed today (the app is Mac-only). If a Windows edition is ever wanted,
it needs its own code-signing certificate (budget roughly £100 to £300 a year;
check on the day).

### 4c.2 Licensing (if it stays an install file)

| Item | What to do |
|---|---|
| Licence terms | A short end-user licence shown in the installer and in the client contract: licensed to that client's business, not transferable, ends when Content and Care both end, MSS keeps ownership of the app; the client keeps everything they export |
| Enforcement | Light. Each edition is already locked to one client's brand pack, which limits its value to anyone else. An expiry date or licence-key check is possible but adds support load; not recommended for the first clients |
| Third-party licences | The app bundles ffmpeg (through `ffmpeg-static`) and open-licence fonts. Include their licence texts in the app's About or Help screen. **Check the ffmpeg build's licence (the static builds are typically GPL) before the first paid licence goes out**; it runs as a separate program, but the licence notice and source offer still need to be right. Not legal advice: have the licence terms reviewed with the proposal terms |
| Data | The app keeps campaigns in the client's own Documents folder and sends nothing to MSS. The only outbound call is the optional AI draft, on the client's own API key. Say so in the licence |

### 4c.3 The hosted option

| | Install file (signed) | Hosted in the browser |
|---|---|---|
| Runs on | The client's Mac only | Any device with a browser, any OS, several staff |
| MSS cash cost | About £79 a year, shared by every edition | Server time for rendering clips (ffmpeg is heavy): a separate worker, roughly £10 to £20 a month on DigitalOcean to start, rising with use; storage for media |
| Build effort | Small: signing and notarisation | Large: logins, per-tenant storage for photos and video, a render queue, and the app moved into the Platform console |
| Licensing | Contract plus end-user licence | Just the subscription: access ends when they stop paying |
| Data protection | Nothing held by MSS | Client photos (including before-and-after results with consent records) held by MSS: goes in the data map and the client's DPIA |
| Updates | Client downloads, or auto-update once signed | Instant for everyone |

**Recommendation (*Proposed*):** sign the install file now; it is cheap and unblocks
paying clients. Build the hosted version only when a client needs Windows, an iPad or
more than one user, and then build it inside the Platform console so it shares logins,
storage and the consent records rather than becoming a fourth system.

---

## 5. Routine operation: from lead to quote

1. Book the Soundcheck (free call). Note the problem in the client's words.
2. If the need is unclear, sell **Review** first. Do not guess a build.
3. Map each need to a product with the rule in §1. Check every need against the "Out"
   lists in §3; anything outside goes on the roadmap as scoped work.
4. Check dependencies: Campaign needs a site and a sender; Platform needs the scope
   clause; payments need Platform (§2) unless it is a fixed-price pay link.
5. Count founding places used for each product in the decisions log. First three
   clients per product get founding; after that, target.
6. List the client's third-party and run costs per product (§4b.3 and §4b.6) in the scope.
7. Write the proposal from `01_mss/ops-finance/mss-proposal-template.md` in
   `02_clients/<client>/`. Re-check every market source on the day.
8. Run `copy-reviewer`, then `figures-reviewer` / `make figures` (it contains money).
9. Send. Log the founding place used in `.claude/mss-decisions-log.md`.
10. After delivery, log actual hours against §4 and update the estimate.

## Checks

- Every price quoted matches §1 and positioning v6 §5.8.
- No Platform contract goes out without the scope-of-responsibility clause attached.
- No proposal promises live payments or bookings in studio-platform before the module
  has gone live for PureMed; until then it is quoted as scoped work with its own timeline.
- Every Content scope states a monthly volume.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Client asks for "a website that takes bookings" | Two products blurred | Website + Platform Foundation + Bookings and payments module; or a third-party booking tool linked from the site |
| Campaign stalls with no way to send | No sender checked at scoping | Add Platform, or connect their existing tool; re-quote |
| Content month overruns | No volume cap in scope | Cap from §3.5 at the next renewal |
| Care requests keep growing | "Small changes" undefined | Apply the one-hour cap; quote the rest |
| Hours far above §4 | Estimate wrong or scope creep | Log it, update §4, raise target at the next founding cut-off |

Escalation: any scope question that changes a product's definition is a positioning
decision. Log it in `mss-decisions-log.md`; v6 is not reopened for 12 months unless a
paying client proves it wrong.

## Boundaries

- MSS never holds client money and never takes a cut of payments.
- MSS does not post to client social accounts.
- No e-commerce (carts, stock, shipping).
- No legal advice: the DPIA, DPA and data map are prepared for the client, who is the
  controller and signs them.
- Employers are never named in any proposal.

## Decisions needed from Os

1. Payments as a Platform module, with a Stripe pay link included in Website (§2).
2. The hour estimates in §4, as the working baseline.
3. Content volume cap: 12 posts or carousels and 4 reels a month.
4. Care small-change cap: one hour a month.
5. Platform Foundation migration: one source system included.
6. A Care-with-Platform price, at or above the cost floor in §4b.4 (suggest confirming
   it once PureMed's real running cost is itemised in January 2027).
7. ~~Image generation~~: **decided 12 Oct 2026**, MSS absorbs it (£35 in any month it is
   bought).
8. Confirm the two unrecorded costs: the Claude plan and the MSS domain renewal
   (Cloudways about £12 and DigitalOcean £15 confirmed 12 Oct 2026).
9. Move Stage off the Pi before the next client who edits their own site (§4b.2).
10. Content Studio app: licensed with Content or Care, not sold outright (§4c).
11. Join the Apple Developer Program as an organisation and sign the app (§4c.1).
12. Install file now, hosted version only when a client needs it (§4c.3).

## Change log

- 2026-10-12: §4b rewritten with actual costs (DigitalOcean £15, Cloudways about £12,
  generation £35 absorbed); stack uplift triggers added (§4b.2); §4c added for the
  Content Studio app (licensing, signing, hosted option); decisions 9 to 12 added.
- 2026-10-12: added §4b, run and infrastructure costs (shared infrastructure, cost per
  tenant, run cost per product, Care cost floor, fixed overhead); decisions 7 and 8 added.
- 2026-10-12: created. Product map, payments placement, scopes and delivery-cost
  estimates drafted for the v6 repositioning; six decisions open.
