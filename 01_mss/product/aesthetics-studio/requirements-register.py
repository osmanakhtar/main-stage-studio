#!/usr/bin/env python3
"""Main Stage Aesthetics Studio: platform requirements register (single source).

This file is the register. Edit rows here, then run:
    python3 requirements-register.py
which writes, deterministically (rows sorted by ID, no timestamps):
    requirements-register.csv   canon, filterable, XLSX-exportable
    register.js                 data for platform-design.html

Clinical depth is NOT duplicated here. The CLN rows point at the existing
clinical-platform register (v0.8, S1-S15) which stays the source for those rows.

Column meanings
    scope    Core            = every tenant, every niche
             Pack:Aesthetics = aesthetics vertical pack only
             Tenant:PureMed  = one tenant's integration or migration
    surface  Public / Client console / Operator / System
    status   Built    = code exists and has run
             Partial  = some code or a working precursor exists
             Designed = written design exists, no platform code
             New      = nothing yet
"""
import csv
import json
from pathlib import Path

HERE = Path(__file__).parent

CATEGORIES = {
    "PLT": "Platform and tenancy",
    "DET": "Determinism and audit",
    "PPL": "People and lifecycle",
    "CON": "Consent and data protection",
    "WEB": "Website and CMS",
    "CAP": "Capture and forms",
    "MSG": "Messaging",
    "WFL": "Workflows and automation",
    "CMP": "Campaigns",
    "SOC": "Social engine",
    "BKG": "Booking and diary",
    "PAY": "Payments",
    "CLN": "Clinical (aesthetics pack)",
    "RPT": "Reporting and insight",
    "UXC": "Client console",
    "OPS": "Operator console and delivery",
    "AIA": "AI assistance",
    "INT": "Integrations and migration",
    "SEC": "Security and operations",
    "CMPL": "Vertical compliance",
    "COM": "Commercial model",
}

C, PA, TP = "Core", "Pack:Aesthetics", "Tenant:PureMed"
PUB, CON_, OP, SYS = "Public", "Client console", "Operator", "System"

# (id, requirement, why / source, priority, scope, surface, status, trace)
ROWS = [
    # PLT
    ("PLT-001", "Every record, file, job and query is scoped to one tenant. Isolation is enforced in the database (row-level security), not only in application code.",
     "Multi-tenant platform holding health-adjacent data. App-layer filters regress quietly.", "Must", C, SYS, "Partial",
     "booking-engine-plan.md §4, §11; data-protection-review-2026-08-18"),
    ("PLT-002", "A tenant is defined entirely by configuration data: brand tokens, catalogue, hours, rule tables, templates, workflows, compliance rules. Onboarding a tenant in an existing vertical needs zero code.",
     "The transferability claim only holds if a new tenant is data, not a fork.", "Must", C, OP, "Partial",
     "Vera onboarded to Studio with zero code (24 Jul); content/config/ pattern"),
    ("PLT-003", "Configuration is versioned. Every change records author, time and reason, and every operational record stores the config version it was created under.",
     "Needed to replay or explain any past outcome.", "Must", C, SYS, "New", ""),
    ("PLT-004", "Vertical packs layer on the core: schema extensions, catalogue fields, rule tables, templates, lint rules and optional modules. Core never imports pack code.",
     "Keeps the platform niche-agnostic. Same boundary rule as the wealth-onboarding split.", "Must", C, OP, "New",
     "SOP-WEALTH-006 (no cross-imports)"),
    ("PLT-005", "Modules switch on per tenant (Site, Capture, Messaging, Workflows, Campaigns, Social, Booking, Payments, Clinical). The console shows only enabled modules.",
     "Plans are sold by module; a salon does not see a clinical record.", "Must", C, CON_, "New", ""),
    ("PLT-006", "One operational runtime hosts the spine and operational modules (Node/TypeScript + PostgreSQL). No per-feature backends.",
     "Today one person can sit in four stores: consultation-api SQLite, proposed PHP/MySQL opt-in, booking Postgres, Faces.", "Must", C, SYS, "Designed",
     "consultation-api/README.md; docs/email-sequence-design.md 'Reconcile before build'; D4 reopened 26 Sep 2026: Velocity DB has no PITR; split host proposed (platform-design.md §3.4)"),
    ("PLT-007", "Two planes. Content plane (pages, blog, templates, social posts) is versioned in git and built statically. Operational plane (people, events, bookings, sends) lives in the database.",
     "Git already gives the content side review, history and rollback. Operational data needs transactions.", "Must", C, SYS, "Partial",
     "site/ Astro + Stage + Loop 2"),
    ("PLT-008", "Tenant provisioning is a scripted, idempotent job: create tenant, seed pack defaults, site repo from template, Stage engagement, DNS and email checklist.",
     "Repeatable onboarding is the product, not a consulting exercise.", "Should", C, OP, "Partial",
     "/onboard-client skill; Studio onboarding"),
    ("PLT-009", "All personal data and backups stay in a UK region.", "UK GDPR posture and client expectation for clinic data.", "Must", C, SYS, "Designed",
     "clinical plan §2.1; consultation-api README"),
    ("PLT-010", "A tenant can export all its data (people, events, bookings, documents, content) in open formats at any time. This is also the exit path.",
     "Escaping Faces lock-in is why PureMed is moving. The platform must not reproduce it.", "Must", C, CON_, "New",
     "buy-vs-build-spike-2026-08-15"),
    ("PLT-011", "Tenant offboarding deletes data according to retention rules and logs what was kept and why.", "Contract end must be clean and provable.", "Should", C, OP, "New", ""),

    # DET
    ("DET-001", "Same config version plus same inputs produces the same journey, requirements, price, documents, sends and schedule, every time, and the system can prove it afterwards.",
     "The platform's governing definition, inherited from the booking engine.", "Must", C, SYS, "Designed", "booking-engine-plan.md §2"),
    ("DET-002", "Every state change in every module is written to one append-only event log with actor (person, staff, job, workflow), time, cause and config version.",
     "The determinism review failed the booking service for having no event log.", "Must", C, SYS, "Partial",
     "determinism-review-2026-08-18"),
    ("DET-003", "Current state can be rebuilt by replaying the event log, and a replay test runs in CI.", "Proves DET-002 is complete, not decorative.", "Should", C, SYS, "New", ""),
    ("DET-004", "Every automated action records the workflow, step and rule IDs that caused it, and the client can see this as a plain-language 'why this happened'.",
     "Clients trust automation they can explain to a patient.", "Must", C, CON_, "New", ""),
    ("DET-005", "Snapshot, do not reference: bookings, sends and signed documents store the price, template version and rule IDs in force at commit.",
     "Determinism review found no booking snapshot.", "Must", C, SYS, "Partial", "booking-engine-plan.md §4; determinism-review-2026-08-18"),
    ("DET-006", "No LLM in any decision path: eligibility, price, availability, whether or when to send, segment membership, whether to publish. AI drafts only, for human approval.",
     "Non-determinism in a regulated path is a defect.", "Must", C, SYS, "Designed", "booking-engine-plan.md §2 rule 4; content/PLAN.md principle 1"),
    ("DET-007", "Rules are data (tables with IDs) evaluated by pure functions with no I/O. Each rule table has a ratified rule-trace contract checked by `make trace`.",
     "Only booking-engine has a contract today.", "Must", C, SYS, "Partial", "SOP-OPS-005; rule-trace.js"),
    ("DET-008", "Scheduled work computes due times from stored inputs (enrolled_at, step offset, quiet hours, tenant timezone). Nothing depends on when a cron happens to wake.",
     "Makes the send schedule predictable and testable.", "Must", C, SYS, "Designed", "email-sequence-design.md worker rules"),
    ("DET-009", "Every outbound side effect (send, publish, charge) carries an idempotency key. Overlapping workers cannot double-send.",
     "Double sends to a patient are the most visible automation failure.", "Must", C, SYS, "Designed", "email-sequence-design.md locking"),
    ("DET-010", "Pure engines (availability, rules, segment evaluation, schedule computation) have property-based tests including DST boundaries.",
     "A deterministic system is one whose determinism is demonstrated.", "Should", C, SYS, "Partial", "booking-engine service/test"),

    # PPL
    ("PPL-001", "One Person record per human per tenant, shared by every module. Subscriber, lead, patient and customer are lifecycle stages of the same record.",
     "The single most important fix to today's estate.", "Must", C, SYS, "New", "CRM-001; booking-engine 'client' entity (thin)"),
    ("PPL-002", "Identity matching is deterministic on normalised email and phone. Ambiguous matches go to a review queue and are never auto-merged.",
     "Wrong merges leak one person's history into another's.", "Must", C, CON_, "New", ""),
    ("PPL-003", "Staff can merge and unmerge people, with a full audit trail.", "Duplicates will happen with walk-ins and phone bookings.", "Should", C, CON_, "New", ""),
    ("PPL-004", "Lifecycle stage is derived by rules from events (Subscriber, Lead, Booked, Client, Lapsed, Unsubscribed), never set by hand.",
     "Hand-set stages drift and make segments lie.", "Must", C, SYS, "New", ""),
    ("PPL-005", "Derived fields computed from events: first seen, source, last booked, last attended, next booking, next recall due, total bookings, lifetime spend, last message, last reply.",
     "Answers 'when did this client last book?' without a report.", "Must", C, CON_, "New", ""),
    ("PPL-006", "Person timeline: one chronological view of every event (opt-in, messages, clicks, bookings, attendance, payments, forms, workflow steps, staff notes), filterable by module.",
     "The client's main working view of a relationship.", "Must", C, CON_, "New", ""),
    ("PPL-007", "Acquisition source captured at first touch (UTM, referrer, form, channel, which Instagram account) and carried onto every booking.",
     "Without it 'drive bookings' cannot be measured.", "Must", C, SYS, "New", "CRM-003; growth plan open item"),
    ("PPL-008", "Tags can be applied by rules or staff, and a tag being added can trigger a workflow.", "The tag model from the email design, made platform-wide.", "Must", C, CON_, "Designed", "email-sequence-design.md §2"),
    ("PPL-009", "Segments are saved rule queries over person fields and events. Membership is computed deterministically and its count is previewed before use.",
     "Campaigns and workflows target segments, never hand-picked lists.", "Must", C, CON_, "New", ""),
    ("PPL-010", "Staff notes on a person (non-clinical), stored separately from clinical notes.", "Reception needs a place to write that isn't the clinical record.", "Should", C, CON_, "New", ""),
    ("PPL-011", "Search people by name, email, phone or tag.", "Basic lookup from a phone between appointments.", "Must", C, CON_, "New", ""),
    ("PPL-012", "Import people from CSV or a legacy system with a mapping preview and dry run before commit.", "Every tenant arrives with a list somewhere.", "Should", C, OP, "New", "MIG rows"),

    # CON
    ("CON-001", "Consent ledger: each consent (marketing email, marketing WhatsApp/SMS, clinical photo, marketing photo, treatment) is its own row with status, wording version, time, source and withdrawal event.",
     "Consent has a lifecycle, not a boolean.", "Must", C, SYS, "Designed", "clinical plan §3.1; email design consent_version"),
    ("CON-002", "Every marketing send checks consent at send time, not only at enrolment.", "Withdrawal must take effect on the next step.", "Must", C, SYS, "Designed", "email design worker rules"),
    ("CON-003", "One-click unsubscribe (RFC 8058) plus a visible link. Withdrawal stops every marketing workflow immediately.", "Legal requirement and Gmail/Yahoo bulk sender rules.", "Must", C, PUB, "Designed", "email design §4"),
    ("CON-004", "Lawful basis recorded per data category and purpose, per pack. The record of processing is generated by `make datamap`.", "Generated, not hand-maintained.", "Must", C, OP, "Partial", "SOP-OPS-006; data-map.js"),
    ("CON-005", "Retention rules per data category, set per pack and tenant, enforced by a scheduled sweep that logs what it deleted.", "consultation-api uses a 400-day placeholder.", "Must", C, SYS, "Partial", "consultation-api purge.js"),
    ("CON-006", "Subject access request: one action produces a complete export of one person across all modules.", "Impossible today across four stores.", "Must", C, CON_, "New", "SEC-006; CRM-002"),
    ("CON-007", "Erasure removes or anonymises identity and marketing data while keeping evidential records under a documented retention basis.", "Separate tables with a linking key make this answerable.", "Must", C, CON_, "Designed", "booking-engine-plan.md §4, §10"),
    ("CON-008", "Age gate (18+) where the pack requires it, recorded on the person.", "Aesthetics advertising and treatment rules.", "Must", PA, PUB, "Designed", "ACCT-003"),
    ("CON-009", "Special category (health) data stays in the clinical module. It never reaches marketing segments, message merge fields or analytics.", "The boundary that lets growth tooling sit next to clinical records.", "Must", PA, SYS, "New", ""),
    ("CON-010", "A DPIA is completed per pack before any tenant in that pack goes live, with a tenant addendum per tenant.", "Data protection review: no DPIA anywhere.", "Must", PA, OP, "New", "data-protection-review-2026-08-18"),
    ("CON-011", "Sub-processor register per tenant (Google Workspace, Stripe, Meta, host) with DPAs on file.", "Controller/processor clarity for every tenant.", "Must", C, OP, "New", ""),
    ("CON-012", "Health-adjacent form answers are collected only if a workflow actually uses them, and are flagged in the data map.", "Data minimisation.", "Should", PA, SYS, "Designed", "email design §5"),

    # WEB
    ("WEB-001", "Tenant site is a static Astro build from a vertical template, deployed by CI. Build pass or fail is the gate.", "Proven on MSS and PureMed.", "Must", C, SYS, "Built", "site/; mss-astro-cloudways-setup.md"),
    ("WEB-002", "Client edits copy and images in place on a preview of the real site, submits, and changes publish after the gate.", "Live on Stage for PureMed.", "Must", C, CON_, "Built", "stage-client-autonomy-plan.md; SOP-PUREMED-001"),
    ("WEB-003", "Client can add and remove repeatable items (treatments, FAQs, team).", "Live, clone fixes 18 Sep.", "Should", C, CON_, "Built", "CLAUDE.md 18 Sep note"),
    ("WEB-004", "Client can create and edit blog posts as content, not developer-held data.", "Blog copy lives in blog-posts.js today and is not editable on Stage.", "Must", C, CON_, "New", "puremed CLAUDE.md 16 Sep note"),
    ("WEB-005", "Client creates landing pages and microsites from templates with parameters (treatment, offer, lead magnet), each on its own URL.", "Microsite builds are operator-only scripts today.", "Should", C, CON_, "Partial", "tools/build-microsites.py; SOP-PUREMED-002"),
    ("WEB-006", "Every CTA resolves from the catalogue (for example a booking deep link with service ID). Unmapped or broken CTAs fail the build instead of falling back silently.",
     "Treatment IDs are hand-mapped today; unmapped ones fall back to a generic link.", "Must", C, SYS, "Partial", "puremed CLAUDE.md treatmentId notes"),
    ("WEB-007", "SEO basics generated per pack: meta, Open Graph, sitemap, schema.org business type.", "Consistent across tenants for free.", "Should", C, SYS, "Partial", ""),
    ("WEB-008", "Preflight gate before publish: build, 390/768/1440 viewport pass, link check, placeholder scan.", "Already the deploy gate.", "Must", C, SYS, "Built", "make preflight; deploy-preflight agent"),
    ("WEB-009", "Pack compliance lint runs on site copy (for example no prescription-only medicine names in promotional copy).", "Lint exists for social only.", "Must", PA, SYS, "Partial", "content-lint.js"),
    ("WEB-010", "Page version history with one-step rollback.", "Git holds it; the client can't reach it.", "Should", C, CON_, "Partial", ""),
    ("WEB-011", "Forms and the booking widget are components the client can place on any page.", "Capture and booking must not need a developer per page.", "Should", C, CON_, "New", ""),
    ("WEB-012", "Public surfaces meet WCAG 2.2 AA.", "Equality Act duty and conversion.", "Must", C, PUB, "Partial", "clinical plan §2.8"),
    ("WEB-013", "The production editing and CMS surface runs off the Pi, on a managed host with uptime and backups.", "Stage runs on a Pi on home broadband. Acceptable for review, not for a paid product.", "Must", C, SYS, "New", "consultation-api README 'Not the Raspberry Pi'"),

    # CAP
    ("CAP-001", "Form definitions are config: fields, validation, consent wording version, tags to apply, workflow to trigger, redirect.", "New lead magnet = new config, no code.", "Must", C, CON_, "Designed", "email design sequence config"),
    ("CAP-002", "One capture endpoint for every form, writing to the Person record. Replaces consultation-api and the proposed PHP opt-in endpoint.", "Two lead backends for one site is the wrong end state.", "Must", C, SYS, "New", "email design 'Reconcile before build' item 1"),
    ("CAP-003", "Spam defence by honeypot and rate limit; no CAPTCHA by default.", "Friction costs leads.", "Must", C, SYS, "Designed", "email design §3"),
    ("CAP-004", "Lead magnets: asset at an unlisted URL, delivery message sent immediately, download recorded as an event.", "guide-opt-in is the first one.", "Must", C, SYS, "Designed", "web/guide-opt-in.html; email design"),
    ("CAP-005", "Quiz and consultation journeys are decision tables mapping answers to a recommendation, and each recommendation maps to a catalogue item.", "consultation.astro hardcodes this logic today.", "Should", C, PUB, "Partial", "site/src/pages/consultation.astro"),
    ("CAP-006", "Staff are notified of submissions according to tenant settings: email to the integration mailbox (care@ for PureMed) by default, plus optional phone push.", "Leads must be followed up the same day, in the inbox the team already works from.", "Should", C, CON_, "Partial", "consultation-api ntfy"),
    ("CAP-007", "Repeat submissions follow fixed rules: resend the asset, do not re-enrol within N days, never re-enrol an unsubscribed person.", "Stops accidental re-sends.", "Must", C, SYS, "Designed", "email design re-submission rules"),

    # MSG
    ("MSG-001", "One message model across channels: email first, WhatsApp Business second, SMS optional.", "Aftercare only lands on WhatsApp for PureMed.", "Must", C, SYS, "Partial", "systems proposal item 6"),
    ("MSG-002", "Message templates are versioned content (HTML, plain text, merge fields), approved before use. Each send records the template version.", "Regulated copy must be approved in advance.", "Must", C, CON_, "Designed", "email design §5"),
    ("MSG-003", "Merge fields come from a whitelist per pack. Clinical fields are never available to marketing templates.", "Enforces CON-009 at the template layer.", "Must", C, SYS, "New", ""),
    ("MSG-004", "Sending from the tenant's integration mailbox is blocked until an onboarding check confirms SPF, DKIM and DMARC on its domain (for PureMed, puremed.uk).", "Without all three Gmail junks the mail.", "Must", C, OP, "Designed", "email design §4"),
    ("MSG-005", "The sending address is always the integration mailbox (care@puremed.uk). The display name may name the clinician (\"Nafisa at PureMed\"). Replies return to the same mailbox.", "A named sender gets better engagement without inventing addresses.", "Should", C, SYS, "Designed", "email design reconcile item 2"),
    ("MSG-006", "Quiet hours per tenant. Sends due in quiet hours wait for the window to open.", "No clinic email at 2am.", "Must", C, SYS, "Designed", "email design worker rules"),
    ("MSG-007", "Delivery status tracked: sent, failed, bounced, clicked through signed links. No open-tracking pixel.", "Apple Mail Privacy makes opens meaningless.", "Must", C, CON_, "Designed", "email design §4"),
    ("MSG-008", "A hard bounce suppresses the address across all workflows.", "Protects sender reputation.", "Must", C, SYS, "Designed", ""),
    ("MSG-009", "Transactional messages (confirmations, reminders, aftercare) are separated from marketing and not gated by marketing consent.", "A patient who opted out of offers still gets their reminder.", "Must", C, SYS, "Partial", "booking-engine notifications/"),
    ("MSG-010", "Replies to platform messages are detected in the integration mailbox (matched by thread), attached to the person's timeline, pause that person's marketing workflows and alert staff.", "The next email must not land while a question sits unanswered.", "Should", C, CON_, "Designed", "email design §5 phase 2"),
    ("MSG-013", "Sending volume stays inside the integration mailbox's daily limit. The worker meters sends per day and holds anything over the limit to the next window rather than failing.", "Every send now comes from one Workspace user, which has a daily cap. Check the current limit for Business Starter before Phase 0.", "Must", C, SYS, "New", ""),
    ("MSG-011", "WhatsApp aftercare with delivery and read status.", "PureMed's patients read WhatsApp, not email.", "Should", PA, SYS, "Designed", "technical-design.md §7.1; CARE rows"),
    ("MSG-012", "If the sending provider fails repeatedly, the operator is alerted by a second path, and a health endpoint shows last success and queue depth.", "A silent relay failure stops every workflow.", "Must", C, OP, "Designed", "email design §4 watch-out"),

    # WFL
    ("WFL-001", "A workflow is a trigger, ordered steps and stop conditions, stored as versioned config with an ID.", "The email sequence config, generalised.", "Must", C, SYS, "Designed", "email design sequence definition"),
    ("WFL-002", "Trigger types: tag added, form submitted, booking created/attended/cancelled/no-show, payment event, date reached (for example recall due), segment entered, manual enrol.", "Covers every workflow in the pack library.", "Must", C, SYS, "New", ""),
    ("WFL-003", "Step types are a closed set: wait, send message, add or remove tag, create staff task, branch on rule, notify staff, end. No arbitrary code steps.", "A closed step set is what keeps workflows deterministic and supportable.", "Must", C, SYS, "New", ""),
    ("WFL-004", "Stop conditions are checked before every step: booked, unsubscribed, bounced, replied, manual stop, entered a higher-priority workflow.", "Stopping is a status change, not a clean-up job.", "Must", C, SYS, "Designed", "email design worker rules"),
    ("WFL-005", "Each pack ships a workflow library: lead magnet nurture, new enquiry follow-up, confirmation and reminders, pre-appointment forms, aftercare, review request, recall, no-show rebook, lapsed reactivation. The client enables and sets parameters; no free-form flow drawing in v1.",
     "Parameterised templates are safer and cheaper to support than a canvas builder.", "Must", PA, CON_, "New", ""),
    ("WFL-006", "Manual actions: enrol a person or segment, pause, resume, skip a step, stop. Each records a reason.", "The client must be able to intervene.", "Must", C, CON_, "New", ""),
    ("WFL-007", "Simulation before enabling: who would enter today, and the exact send schedule for a sample person.", "Shows consequences before they happen.", "Should", C, CON_, "New", ""),
    ("WFL-008", "Run view per workflow: people active, the step each is on, next action and when, and completed or stopped with reason.", "Answers 'what is this automation doing right now?'", "Must", C, CON_, "New", ""),
    ("WFL-009", "A person is in at most one marketing workflow at a time unless the workflow allows overlap. Priority order is set in config.", "Prevents message pile-ups.", "Should", C, SYS, "New", ""),
    ("WFL-010", "Changing a live workflow creates a new version. People already enrolled finish on their version unless explicitly migrated.", "Editing mid-flight must not change what someone was promised.", "Must", C, SYS, "New", ""),
    ("WFL-011", "Workflows can create staff tasks (call this lead, confirm this booking) that appear in the console inbox with a due time.", "Some steps need a human.", "Should", C, CON_, "New", ""),
    ("WFL-012", "A tenant-wide switch pauses all automated marketing sends.", "For incidents, holidays and complaints.", "Must", C, CON_, "New", ""),

    # CMP
    ("CMP-001", "A campaign is one object: goal, audience segment, channels, content items (emails, posts, landing page), schedule and a success measure.", "Links everything a push produces to its result.", "Must", C, CON_, "Partial", "Studio Campaign Builder (8 Jul)"),
    ("CMP-002", "Audience preview shows the count and the exclusions (no consent, contacted recently, in an active workflow) before scheduling.", "No surprises about who receives what.", "Must", C, CON_, "New", ""),
    ("CMP-003", "Frequency cap on marketing messages per person per 7 days, set per tenant.", "Protects the list.", "Should", C, SYS, "New", ""),
    ("CMP-004", "Every campaign item passes compliance lint and client approval before it can be scheduled. Approvals are logged.", "Required for a regulated pack.", "Must", C, CON_, "Partial", "content/PLAN.md principle 3"),
    ("CMP-005", "Campaign results: sent, clicked, leads captured, bookings attributed, revenue attributed, against the stated measure.", "The client pays for bookings, not posts.", "Must", C, CON_, "New", ""),
    ("CMP-006", "Pack campaign templates: seasonal offer, treatment launch, lead magnet launch, reactivation.", "Fast starts for self-serve tenants.", "Should", PA, CON_, "New", ""),
    ("CMP-007", "AI drafts campaign content from a brief against the tenant voice file. Drafts stay drafts until approved.", "Where AI saves real time.", "Should", C, CON_, "Partial", "Campaign Builder LLM copy-draft"),
    ("CMP-008", "Offer and discount codes linked to a campaign and redeemable at booking.", "Closes the attribution loop for offers.", "Could", C, SYS, "New", "CRM-008"),

    # SOC
    ("SOC-001", "Post lifecycle state machine: idea, drafted, review, approved, scheduled, published, measured, with flagged and rejected branches.", "Built for PureMed Phase 1.", "Must", C, SYS, "Built", "content/PLAN.md"),
    ("SOC-002", "Monthly calendar generated from pillars and cadence config. The client approves the calendar.", "Built.", "Must", C, CON_, "Built", "content/calendar/"),
    ("SOC-003", "Asset library with tags, source (generated, uploaded, proxy) and marketing-photo consent status per image.", "Shared client asset pool added on Stage 26 Sep.", "Must", C, CON_, "Partial", "image-library.json; Stage shared asset library"),
    ("SOC-004", "One shared renderer, so what the client approves is exactly what publishes, brand overlay included.", "Silent render defects were caught only by looking (Vera).", "Must", C, SYS, "Partial", "slide-templates.json"),
    ("SOC-005", "Pack compliance lint blocks approval on a violation. No autoposting without human approval in a regulated pack.", "Built for PureMed.", "Must", PA, SYS, "Built", "content-lint.js; content/config/compliance.md"),
    ("SOC-006", "Publish to Instagram and Facebook through the Meta Graph API and store platform post IDs.", "Phase 2, blocked on Meta prerequisites.", "Must", C, SYS, "New", "fsc-ig-publishing-plan.md"),
    ("SOC-007", "Several accounts per tenant (main plus satellites), each with its own calendar and link target.", "Shuab's multi-account model.", "Should", PA, CON_, "New", "growth plan GTM section"),
    ("SOC-008", "Every post link carries UTM parameters so leads attribute to the post.", "Feeds PPL-007.", "Must", C, SYS, "New", ""),
    ("SOC-009", "Post metrics (reach, saves, profile visits, link clicks) pulled back and shown against the campaign.", "Closes the social loop.", "Should", C, CON_, "New", ""),
    ("SOC-010", "Client uploads photos and video from a phone into the asset library.", "Nafisa's content starts on her phone.", "Must", C, CON_, "Partial", "Stage bulk upload (26 Sep)"),

    # BKG
    ("BKG-001", "The booking engine is the core booking module: catalogue, availability as a pure function, rule-driven requirements, reschedule and cancel policy.", "Phases 1-6 built and live-verified.", "Must", C, SYS, "Built", "booking-engine-plan.md"),
    ("BKG-002", "Every booking writes to the Person record and emits events workflows can trigger on.", "Removes the need to parse booking emails.", "Must", C, SYS, "New", ""),
    ("BKG-003", "Staff-made bookings pass the same requirement gates as online bookings.", "Parity is a regulatory requirement.", "Must", C, CON_, "Designed", "BOOK-004"),
    ("BKG-004", "Deep link to a specific service from any page, campaign or message.", "Shortest path from interest to booking.", "Must", C, PUB, "Built", "?svc= deep links"),
    ("BKG-005", "Diary day and week views by resource, with quick actions: mark attended, no-show, cancel with reason.", "Attendance is what recall and no-show workflows run on.", "Must", C, CON_, "Partial", "booking-engine admin UI"),
    ("BKG-006", "Calendar sync where the engine owns truth and Google or Microsoft calendars are peers.", "Built.", "Must", C, SYS, "Built", "booking-engine-plan.md §7"),
    ("BKG-007", "Attendance and no-shows are recorded as events.", "Feeds recall, rebook and deposit rules.", "Must", C, SYS, "New", ""),
    ("BKG-008", "Faces Consent is replaced, not integrated. After cutover the platform is the only system holding PureMed's customer records and bookings, and Faces is retired. No booking-email parsing, no sync, no dual running beyond the cutover window.",
     "Decided 26 Sep 2026: one ecosystem for customer records and bookings.", "Must", TP, SYS, "Designed", "clinical plan §9 (full replacement); supersedes email design booking_emails"),
    ("BKG-011", "Cutover migrates booking history and the forward diary from Faces, reconciled appointment by appointment, so no future booking is lost or doubled.",
     "Growth plan gap: no design existed for migrating diary state.", "Must", TP, OP, "Designed", "clinical plan §6.6; growth plan open items"),
    ("BKG-012", "At cutover the platform becomes the only writer to the diary calendar. Every other writer (the ChatGPT inbox automation, Faces' own sync) is switched off the same day.",
     "Three writers to one calendar today; the day two disagree is a missed appointment.", "Must", TP, SYS, "Designed", "systems proposal item 1"),
    ("BKG-009", "Joint prescriber and practitioner availability, and routing by legal provider and location.", "No vendor supports this; a reason to build.", "Must", PA, SYS, "Designed", "BOOK-007; BOOK-008"),
    ("BKG-010", "Waitlist with automatic offer when a slot frees.", "Fills cancellations.", "Could", C, CON_, "New", ""),

    # PAY
    ("PAY-001", "Deposit on every booking, staff-made included, by card, Apple Pay or Google Pay.", "Answered: everyone pays, no exceptions.", "Must", C, PUB, "Partial", "systems proposal item 5; PAY rows"),
    ("PAY-002", "Payment events appear on the timeline. Provider state is mirrored, never authoritative on its own.", "Built in the booking service.", "Must", C, SYS, "Built", "booking-engine-plan.md §9"),
    ("PAY-003", "Deposit policy is a rule table (for example two late cancellations means full prepayment).", "Lets the system say no so the owner doesn't have to.", "Must", C, SYS, "Designed", "systems proposal item 5"),
    ("PAY-004", "Revenue per person and per acquisition source, derived for reporting.", "Links spend to source.", "Should", C, CON_, "New", ""),
    ("PAY-005", "Refunds record reason and actor.", "Audit.", "Must", C, CON_, "Partial", ""),

    # CLN
    ("CLN-001", "Customer and clinical record (S7) as a pack module keyed to the core Person. Reception sees a narrower, field-level view than practitioners, enforced below the app layer. Needed at Faces cutover, not after.",
     "Faces holds the records today; bringing it in house needs S7 on day one. Full row set stays in the clinical register.", "Must", PA, CON_, "Designed", "clinical register REC-001; S7"),
    ("CLN-002", "Consent and medical questionnaire engine (S4), versioned, pre-filled on reissue. Carries the migrated Faces form library unchanged. Needed at Faces cutover.", "Faces issues the consent forms today.", "Must", PA, PUB, "Designed", "CONS rows; S4"),
    ("CLN-003", "Treatment notes with batch and lot traceability queryable across patients (S9).", "Manufacturer recall.", "Must", PA, CON_, "Designed", "NOTE rows; S9"),
    ("CLN-004", "Digital toxin prescribing record with two signatures.", "Replaces the paper pile.", "Must", PA, CON_, "Designed", "systems proposal item 4"),
    ("CLN-005", "Clinical photography: in-app capture, no camera roll, works offline, clinical and marketing consent split, gated export into the marketing asset library.",
     "The only path from a clinical photo to a post.", "Must", PA, CON_, "Designed", "PHOTO rows; S10; technical-design §6"),
    ("CLN-006", "Treatment plans generated from the consultation, with acceptance state.", "", "Should", PA, CON_, "Designed", "S8; CRM-006"),
    ("CLN-007", "A recorded complication or adverse event automatically suppresses marketing workflows (review requests, offers) for that person.", "", "Must", PA, SYS, "Designed", "CRM-007"),
    ("CLN-008", "Recall interval per treatment drives the next-due date that recall workflows trigger on.", "", "Must", PA, SYS, "Designed", "CRM-004"),

    # RPT
    ("RPT-001", "Home dashboard: new leads, bookings, bookings from leads, diary fill for the next 14 days, messages sent, items waiting for the client.", "The owner's weekly pulse on one screen.", "Must", C, CON_, "New", ""),
    ("RPT-002", "Funnel from visit to capture to booking to attendance, by source and campaign, derived from events.", "", "Must", C, CON_, "New", ""),
    ("RPT-003", "Attribution rules are stated and fixed: first touch and last touch shown side by side, no modelled attribution.", "A number the client can check by hand.", "Must", C, SYS, "New", ""),
    ("RPT-004", "Every figure on a dashboard opens the list of records behind it.", "No unexplained numbers. Same discipline as the figures gate.", "Must", C, CON_, "New", "SOP-OPS-008"),
    ("RPT-005", "Diary fill rate has one agreed definition per tenant (bookable minutes booked divided by bookable minutes offered).", "Growth plan: no agreed measure of 'drive bookings'.", "Must", C, SYS, "New", "growth plan open items"),
    ("RPT-006", "A monthly client report is generated from the same queries as the dashboard.", "No hand-built reports.", "Should", C, CON_, "New", ""),
    ("RPT-007", "Workflow performance: entered, completed, stopped by reason, booked within N days.", "Shows which automations earn their place.", "Should", C, CON_, "New", ""),

    # UXC
    ("UXC-001", "One sign-in console with: Today, People, Diary, Campaigns, Workflows, Content (site, blog, social), Inbox, Reports, Settings.", "Replaces Stage + Studio + ntfy + inbox-checking as separate places.", "Must", C, CON_, "New", ""),
    ("UXC-002", "The console opens on a 'Needs you' inbox: approvals, tasks, unmatched bookings, replies, failed sends, ordered by due time.", "The owner has minutes, not hours.", "Must", C, CON_, "New", ""),
    ("UXC-003", "Activity feed of what the system did, newest first, each row with a plain-language reason and a link to the workflow or rule.", "Answers 'what was the last action?'", "Must", C, CON_, "New", ""),
    ("UXC-004", "Person page header: stage, last booked, next booking, source, consents. Below it the timeline. Actions: book, enrol in workflow, tag, message, export, erase.", "", "Must", C, CON_, "New", ""),
    ("UXC-005", "Mobile-first for the owner-operator: Today, Inbox, person lookup, approve content and upload photos work one-handed on a phone.", "Nafisa runs the business from her phone.", "Must", C, CON_, "New", "systems proposal 'What I heard'"),
    ("UXC-006", "Plain language throughout: people not contacts, messages not sends, 'why this happened' not rule trace.", "", "Must", C, CON_, "New", ""),
    ("UXC-007", "Roles: Owner, Practitioner, Reception, Marketing, Operator (MSS). Each sees only its modules and fields.", "Shuab needs campaigns, not clinical notes.", "Must", C, CON_, "New", ""),
    ("UXC-008", "Every outward or destructive action states its consequence before confirming ('Send to 212 people now').", "", "Must", C, CON_, "New", ""),
    ("UXC-009", "Global search across people, bookings and content.", "", "Should", C, CON_, "New", ""),
    ("UXC-010", "Phone notifications for events the tenant chooses (new lead, booking, reply, failed payment).", "", "Should", C, CON_, "Partial", "ntfy"),
    ("UXC-011", "Empty and error states say what to do next.", "", "Must", C, CON_, "New", ""),
    ("UXC-012", "The console meets WCAG 2.2 AA.", "", "Should", C, CON_, "New", ""),

    # OPS
    ("OPS-001", "Operator console: tenants, enabled modules, health, pending approvals, latest gate results.", "The status board, per tenant.", "Should", C, OP, "Partial", "workspace-status.js"),
    ("OPS-002", "Support access 'view as tenant user' is logged and visible to the tenant.", "", "Should", C, OP, "New", ""),
    ("OPS-003", "A new vertical pack is created from a pack template and must pass the gates before a tenant can use it.", "How the second niche gets built.", "Must", C, OP, "New", ""),
    ("OPS-004", "Platform releases run the determinism, data-protection, figures and design gates. Tenants run a pinned platform version with staged rollout.", "", "Must", C, OP, "Partial", "SOP-OPS-005/006/008"),
    ("OPS-005", "Every module ships an operator SOP.", "Standing SOP rule.", "Must", C, OP, "Partial", "sops/ template"),
    ("OPS-006", "A config change on one tenant cannot affect another. Changes to shared templates or renderers require a regression check across all tenants.", "", "Must", C, OP, "New", "Vera shared-renderer note"),

    # AIA
    ("AIA-001", "AI drafts copy (messages, posts, blog, campaigns) from a brief, the tenant voice file and pack compliance. Output always enters as a draft.", "", "Must", C, CON_, "Partial", "copywriting skill; Campaign Builder"),
    ("AIA-002", "AI output passes the same deterministic lint as human copy. AI is never the linter.", "", "Must", C, SYS, "Partial", "content-lint.js"),
    ("AIA-003", "AI suggestions show their provenance: model, prompt template version, date.", "LLM-transparency rule.", "Should", C, CON_, "New", "studio-workflow-alignment-spec.md"),
    ("AIA-004", "Reply classification can pause a workflow and alert staff. It never sends a reply.", "", "Could", C, SYS, "Designed", "email design §5"),
    ("AIA-005", "No clinical data goes to an AI provider without a DPIA-approved basis. Clinical AI features are off by default.", "", "Must", PA, SYS, "New", ""),
    ("AIA-006", "AI usage and cost metered per tenant.", "Needed to price plans.", "Could", C, OP, "New", ""),

    # INT
    ("INT-001", "Each tenant connects one business mailbox (Google Workspace or Microsoft 365) as its single email integration point. All outbound mail sends from it, replies and bounces are read from it, staff notifications go to it, and calendar sync uses its calendar. No third-party email service and no separate sending addresses.",
     "One mailbox the business already owns and watches. Replies and history stay where the team works.", "Must", C, SYS, "Designed", "email design §3-4"),
    ("INT-009", "PureMed's integration mailbox is care@puremed.uk (the only user on Workspace Business Starter, and the admin account). Every platform email integration connects to care@ directly.",
     "Decided 26 Sep 2026.", "Must", TP, SYS, "Designed", "puremed-email-handover.md; email design reconcile item 2"),
    ("INT-010", "Faces exit: a full export (patients, consent library, signed forms, booking history, forward diary) is verified complete against Faces before contract notice is given.",
     "Once notice is given there is no second chance at the data.", "Must", TP, OP, "New", "clinical plan §6; decisions log 'Faces Consent admin'"),
    ("INT-002", "Meta Graph API for publishing and insights.", "", "Must", C, SYS, "New", "fsc-ig-publishing-plan.md"),
    ("INT-003", "WhatsApp Business Platform.", "", "Should", C, SYS, "Designed", "technical-design.md §7.1"),
    ("INT-004", "Stripe per tenant, with the tenant as merchant of record.", "", "Must", C, SYS, "Partial", "booking-engine payments/"),
    ("INT-005", "Google and Microsoft calendars, connected through the integration mailbox's account. For PureMed, confirm the diary Nafisa watches is care@'s calendar before cutover.", "", "Must", C, SYS, "Built", "booking-engine calendar/"),
    ("INT-006", "Faces Consent migration into the platform: 475 patient records, the consent form library as-is, signed consent PDFs, booking history, plus Acuity notes for long-standing patients. Dry run and reconciliation report before cutover.",
     "Bringing Faces in house makes this the critical path.", "Must", TP, OP, "Designed", "MIG rows; clinical plan §6"),
    ("INT-007", "Settings lists every connection with status, last sync and a reconnect action.", "Expired tokens are the most common silent failure.", "Must", C, CON_, "New", ""),
    ("INT-008", "Outbound webhooks and scheduled exports for tenants who keep another tool.", "", "Could", C, SYS, "New", ""),

    # SEC
    ("SEC-001", "Staff sign-in with 2FA and session timeout. No shared logins.", "", "Must", C, CON_, "New", "SEC rows"),
    ("SEC-002", "Identifiers are never credentials. A tenant UUID emailed to clients cannot grant access.", "Data protection review finding.", "Must", C, SYS, "New", "data-protection-review-2026-08-18"),
    ("SEC-003", "Encryption in transit and at rest. Clinical files in encrypted object storage.", "", "Must", C, SYS, "Designed", "technical-design.md §8"),
    ("SEC-004", "Access to personal and clinical data is logged (who viewed what, when).", "", "Must", C, SYS, "New", ""),
    ("SEC-005", "Daily backups with a quarterly tested restore. Proposed RPO 24 hours, RTO 8 hours.", "", "Must", C, OP, "New", ""),
    ("SEC-006", "Monitoring and alerts: uptime, job queue depth, failed sends, payment webhook failures.", "", "Must", C, OP, "Partial", ""),
    ("SEC-007", "Production runs on a managed UK host. The Pi holds nothing but non-personal review content.", "", "Must", C, SYS, "Designed", "booking-engine-plan.md §11"),
    ("SEC-008", "Breach register and incident procedure per tenant.", "", "Must", C, OP, "New", ""),
    ("SEC-009", "The mailbox connection uses the narrowest scopes that work (send, read, calendar). The token is held server-side only, and the code reads only threads the platform started plus delivery failures. Every mailbox read is logged, and the token can be revoked from the Workspace admin console.",
     "care@ holds all patient correspondence. Google can't limit a token to a label, so the limit is enforced in code and must be audited.", "Must", C, SYS, "Designed", "email design §3 access to care@"),

    # CMPL
    ("CMPL-001", "Each pack has a human-written compliance rules file, never generated (aesthetics: no prescription-only medicine advertising, before-and-after restrictions, no appeal to under-18s).", "", "Must", PA, OP, "Built", "content/config/compliance.md"),
    ("CMPL-002", "Compliance rules are executable (word lists, patterns) and run on every surface: site, messages, social, campaigns.", "", "Must", PA, SYS, "Partial", "content-lint.js"),
    ("CMPL-003", "Patient-facing clinical claims need clinician approval, recorded against the content version.", "", "Must", PA, CON_, "Designed", "email design §5"),
    ("CMPL-004", "Treatments delivered under another provider's CQC registration carry that provider and location.", "", "Must", TP, SYS, "Designed", "clinical plan §3.1"),

    # COM
    ("COM-001", "Plans sold by module: Presence (site, content, social), Growth (+ capture, messaging, workflows, campaigns), Practice (+ booking, payments), Clinical (+ clinical pack).", "", "Should", C, OP, "New", ""),
    ("COM-002", "The same console serves managed tenants (MSS runs content and campaigns) and self-serve tenants.", "Managed first; self-serve is a later layer.", "Must", C, OP, "New", ""),
    ("COM-003", "Contract clause on scope of responsibility: MSS operates the software; clinical, regulatory and advertising decisions stay with the tenant.", "Flagged as a prerequisite for the Systems line.", "Must", C, OP, "New", "mss-decisions-log Systems service line"),
    ("COM-004", "Tenant subscription billing.", "", "Could", C, OP, "New", ""),
    ("COM-005", "Transferability is claimed only after one non-aesthetics tenant is onboarded with zero core code change.", "The test that makes 'deterministic and transferable' true.", "Must", C, OP, "New", ""),
]


def main():
    ids = [r[0] for r in ROWS]
    assert len(ids) == len(set(ids)), "duplicate IDs"
    for r in ROWS:
        assert r[0].rsplit("-", 1)[0] in CATEGORIES, r[0]
        assert r[3] in ("Must", "Should", "Could"), r[0]
        assert r[6] in ("Built", "Partial", "Designed", "New"), r[0]
        assert chr(0x2014) not in " ".join(r), f"em dash in {r[0]}"
    rows = sorted(ROWS, key=lambda r: (list(CATEGORIES).index(r[0].rsplit("-", 1)[0]), r[0]))
    head = ["ID", "Category", "Requirement", "Why / source", "Priority", "Scope", "Surface", "Status", "Trace"]
    with (HERE / "requirements-register.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(head)
        for r in rows:
            w.writerow([r[0], CATEGORIES[r[0].rsplit("-", 1)[0]], r[1], r[2], r[3], r[4], r[5], r[6], r[7]])
    data = {"categories": CATEGORIES,
            "rows": [dict(zip(["id", "req", "why", "pri", "scope", "surface", "status", "trace"], r)) for r in rows]}
    (HERE / "register.js").write_text("window.REGISTER = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
    from collections import Counter
    print(len(rows), "rows")
    print(dict(Counter(r[6] for r in rows)))
    print(dict(Counter(r[4] for r in rows)))
    print(dict(Counter(r[3] for r in rows)))


if __name__ == "__main__":
    main()
