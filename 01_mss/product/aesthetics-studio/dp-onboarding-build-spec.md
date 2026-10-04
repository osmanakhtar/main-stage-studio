# Build spec: data protection onboarding in the console (DPA, DPIA, ROPA)

*Build spec, v1.1, 1 October 2026. Implements platform-design.md v0.8 part B. Parent canon:
`platform-design.md` (v0.9 note points here). Content source for PureMed:
`02_clients/puremed/data-protection/puremed-dpia-draft.md` v0.1 and its two companions.
Repo: `~/workspace/studio-platform`. **All 8 slices BUILT 1 Oct 2026 (commit d034ffc), committed
locally, NOT pushed, so not deployed.** See section 12 for what differs from this spec and what
is still open.*

## 1. What this builds

The clinic completes its data protection paperwork in the console, as a guided journey,
and the platform keeps the signed result as a permanent record:

1. **DPA acceptance.** The owner reads the processor agreement, records the clinic's ICO
   registration, and accepts it.
2. **The DPIA journey.** The platform shows the processor half it generated from the live
   config; the owner confirms it, answers the controller questions, rates the risks,
   parks anything that needs an adviser, exports an adviser pack, and signs.
3. **The ROPA**, generated from the signed DPIA and the config, exportable.
4. **Review triggers.** When a publish changes what the platform collects, keeps or sends,
   the console says the assessment needs reviewing and names what changed.

The platform gives no legal advice at any point. Where a question needs a judgement, the
journey says so and lets the clinic park it for an adviser.

## 2. Decisions this spec rests on (1 October 2026, Osman)

| # | Decision |
|---|---|
| S-1 | **Named sign-off is by an individual login, never the shared mailbox.** Nafisa Mughal gets her own console login at her personal address, akhtar.nafisa@gmail.com, as owner. care@puremed.uk stays as a login but is marked shared and cannot accept a DPA or sign a DPIA |
| S-2 | **Soft gate for PureMed, hard gate for future tenants.** PureMed (already live) keeps sending; the console flags the DPIA as required and outstanding on every page until it is signed. Every new tenant is refused live sending until a signed DPA and an approved DPIA are on record |
| S-3 | **Adviser questions are parked, not answered by the platform.** The owner can mark any question "waiting on adviser", carry on, and export an adviser pack. Approval stays blocked while any parked question is open |
| S-4 | **Save and resume.** Answers save as a draft (one per document kind, like email drafts). Only the signed version becomes the permanent record |
| S-5 | **Fixed text lives in the aesthetics pack.** Question wording, help text, risk list and the DPA template are pack content, so every clinic in the edition gets the same questions. A tenant can add its own extra questions and risks (PureMed's Mailchimp import is one) |
| D10 | (30 Sep) MSS drafts the DPA, a solicitor reviews before anyone signs |

Still open, with the default this spec builds to unless Osman says otherwise:

| # | Decision | Default in this build |
|---|---|---|
| D11 | Footprint change after an approved DPIA: warn or block? | Warn on any change. For hard-gate tenants, block a live publish only when a new special category field or a new recipient appears. For PureMed (soft), warn only |
| D12 | Check the clinic's ICO registration at onboarding? | Yes: a required tick plus registration number on the DPA screen, stored with the acceptance |

## 3. Slices, in build order

Each slice ships with tests and is deployable on its own. Gates before the whole thing is
called done are in section 10.

| Slice | What | Depends on |
|---|---|---|
| 1 | Staff identity: individual vs shared logins; Nafisa added | none |
| 2 | Storage: `dp_draft`, `dp_document`, events, RLS | none |
| 3 | Content: pack loading, platform facts, the footprint | 2 |
| 4 | The gate: soft and hard enforcement, the "outstanding" flag | 2, 3 |
| 5 | DPIA journey screens | 1 to 4 |
| 6 | DPA acceptance screen | 1 to 4, and a solicitor-reviewed DPA text (D10) |
| 7 | ROPA generation and document exports | 5 |
| 8 | Review triggers | 3, 5 |

The DPA screen can be built before the solicitor review finishes, but it refuses
acceptance until the template is marked reviewed (section 6.4). The DPIA does not wait
for the DPA.

## 4. Slice 1: staff identity

**Why:** today the console knows only "care@", so it cannot record who signed anything
(DPIA gap G11).

- `StaffMember` (`config/types.ts`) gains `kind: "person" | "shared"`, required. Publish
  refuses a staff entry without it.
- `tenants/puremed/tenant.json` staff becomes:
  - `{ "email": "akhtar.nafisa@gmail.com", "name": "Nafisa Mughal", "role": "owner", "kind": "person" }`
  - `{ "email": "care@puremed.uk", "name": "PureMed (shared mailbox)", "role": "owner", "kind": "shared" }`
- Sign-in is unchanged (single-use link to the listed address, `console/auth.ts`). Nafisa's
  link is sent to her Gmail through care@'s transport.
- Every console action is already attributed `staff:<email>`. From this slice, actions
  by Nafisa's login are attributable to her.
- **New rule:** the routes that accept a DPA or sign a DPIA require
  `role === "owner" && kind === "person"`. Anyone else sees the document read-only and a
  line saying who can sign.
- Data note: her personal address is already in `test_allowlist`; it now also becomes staff
  data in every config version from here on (the contract's `config_version.body` row
  already covers this; add her to the contract's staff note).

Tests: a shared login gets 403 on accept and sign; a person owner succeeds; publish refuses
a staff entry with no `kind`.

## 5. Slice 2: storage

Migration `007_data_protection.sql`.

```sql
-- One working draft per document kind per tenant. Nobody signs a draft.
create table dp_draft (
  tenant_id   uuid not null references tenant(id),
  kind        text not null check (kind in ('dpa', 'dpia')),
  answers     jsonb not null default '{}',
  updated_by  text not null,
  updated_at  timestamptz not null,
  primary key (tenant_id, kind)
);

-- The permanent record. Insert-only, like event.
create table dp_document (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references tenant(id),
  kind               text not null check (kind in ('dpa', 'dpia', 'ropa')),
  version            int not null,
  content            jsonb not null,  -- answers + the generated processor half, as shown
  rendered           text not null,   -- the document as a person reads it (markdown)
  content_hash       text not null,   -- sha256 of rendered
  template_hash      text,            -- DPA: hash of the agreement text accepted
  config_version_id  uuid not null references config_version(id),
  footprint_hash     text not null,
  signed_by_email    text,            -- null for ropa (generated, not signed)
  signed_by_name     text,
  signed_by_role     text,            -- as typed by the signer, e.g. "Owner and lead practitioner"
  ico_registration   text,            -- DPA only (D12)
  signed_at          timestamptz not null,
  supersedes_id      uuid references dp_document(id),
  unique (tenant_id, kind, version)
);
```

- Insert-only trigger on `dp_document` (same pattern as `event_no_update`).
- RLS enabled and forced on both, same `tenant_isolation` policy as 003/004.
- Grants to `app_runtime`: `dp_draft` select/insert/update/delete; `dp_document`
  select/insert only.
- Events: `dp.draft_saved`, `dp.adviser_pack_exported`, `dp.dpa_accepted`,
  `dp.dpia_approved`, `dp.ropa_generated`, `dp.review_needed`, `dp.gate_soft_passed`.
  Payloads carry document ids, versions and hashes, never answers.
- Add both tables to `service/data-protection.json` in the same commit (role
  `operational`, purpose `console-operations`; `signed_by_*` are staff personal data). Rerun
  `make datamap`.

## 6. Slice 3: content

### 6.1 Where each part of the draft goes

| Draft section (puremed-dpia-draft.md) | Becomes |
|---|---|
| Cover, "How to use", "Why this is needed" | Pack: `packs/aesthetics/dp/dpia-intro.md`, with tenant merge fields |
| Part A (A1 to A7) | **Generated** at render time from the config (section 6.3) plus platform facts (6.2) |
| A8 gaps | Platform facts, maintained per release (they describe code, not config) |
| Part B questions | Pack: `packs/aesthetics/dp/dpia-questions.json`; PureMed-only B6 (Mailchimp) in `tenants/puremed/dp/extra-questions.json` |
| Part C (needs a qualified decision) | Not a separate list: each question carries an `adviser` note naming the judgement (C1 on the Article 9 question, C3 on the Mailchimp question, and so on). The adviser pack collects the parked ones |
| Part D risks | Pack: `packs/aesthetics/dp/risks.json` (generic); PureMed's D1 (Mailchimp) and D14 in `tenants/puremed/dp/extra-risks.json` |
| Part E sign-off | The sign step (section 8.6) |
| Section 6, Phase 2 | Pack intro text for "what this does not cover", plus a review trigger when Phase 2 tables appear |
| DPA requirements list | The DPA template in `packs/aesthetics/dp/dpa-template.md`, drafted by MSS and solicitor-reviewed (D10) |

### 6.2 Platform facts

`service/src/dp/platform-facts.json`: what is true of the platform for every tenant and
cannot be read from config. That covers hosting (DigitalOcean lon1, backups, PITR window),
security measures (A6), how each right is handled (A7), what erasure removes and what it
leaves (A4's right-hand column), and the current gap list (A8). Each entry carries
`verified_at` and `verified_against` (a commit). A test fails if the file's `verified_against`
is more than one migration behind, so a schema change forces someone to re-read it.

### 6.3 Generated processor half and the footprint

`service/src/dp/footprint.ts`, a pure function of the config body:

```
footprint(config) = {
  forms: per form: key, fields, required ticks, consent purposes and wording hashes,
         consultation question ids and option ids, retention_days,
  email_quotes: email_fields per form (which answers go into email),
  recipients: workflow steps with recipient "staff" (what goes to the clinic inbox),
  sub_processors: from platform facts + tenant (mailbox provider),
  special: question ids the pack classifies as possibly special category
}
footprint_hash = sha256(canonical(footprint))
```

`service/src/dp/render.ts` turns footprint plus platform facts into Part A as the clinic
reads it (the tables in the draft's A2 to A5), in plain language. It must reproduce the
substance of draft v0.1 Part A for PureMed: a snapshot test renders PureMed's current
config and is reviewed by eye once, then pinned.

### 6.4 Question schema

```json
{
  "id": "B2.2",
  "section": "Health information",
  "text": "If yes, which Article 9 condition does PureMed rely on ...",
  "help": "plain-language explanation, no advice",
  "type": "lawful_basis | article9_condition | text | choice | period | yes_no_unsure",
  "options": ["..."],
  "required": true,
  "show_if": { "B2.1": ["yes", "unsure"] },
  "adviser": "Whether the answers are special category data, and which condition applies, needs a qualified adviser (C1)."
}
```

Every answer is stored as
`{ "status": "answered" | "adviser" | "unknown", "value": ..., "note": "..." }`.
`lawful_basis` offers the six Article 6 bases plus "waiting on adviser", with a required
"why" box. `period` takes a number plus unit, or "waiting on adviser". Nothing is
pre-selected.

The DPA template carries front matter `solicitor_reviewed: false | <date and firm>`.
Acceptance is refused while it is `false`, for every tenant.

Publish loads `packs/<tenant.pack>/dp/` and `tenants/<slug>/dp/` into the config body under
`dp`, so the questions a document was answered against are pinned by `config_version_id`
like everything else (DET-005).

## 7. Slice 4: the gate

- `tenant.json` gains `"data_protection": { "enforcement": "soft" | "hard" }`. **Absent means
  hard.** PureMed sets `"soft"`. Only MSS can change it (repo config, not the console).
- "Current" means: the latest `dp_document` of kind `dpa`, and the latest of kind `dpia`
  whose `footprint_hash` equals the footprint being published.
- At publish with `sending.mode: live` and no current DPA and DPIA:
  - **hard:** refuse, with `config invalid: live sending needs a signed DPA and an approved
    DPIA (none on record)` (or "the approved DPIA covers an earlier footprint: <diff>"), the
    same way unapproved templates are refused today.
  - **soft:** publish succeeds; append `dp.gate_soft_passed` with what is missing; the CLI
    prints a warning line.
- Console, soft tenants: a banner on every console page until both are current. It reads
  "Data protection assessment required: outstanding", gives a one-line reason (no
  DPA / no DPIA / DPIA needs reviewing) and a button to the journey. It is not dismissible.
- Console, Home: a "Data protection" card with each document's status (Not started, In
  progress, Waiting on adviser (n), Signed on <date> by <name>, Needs reviewing).

Tests: a hard tenant in live mode with no documents is refused; a soft tenant publishes and
gets the event; a DPIA on an older footprint counts as not current; absent setting behaves
as hard.

## 8. Slice 5: the DPIA journey

Routes under `/console/:tenant/data-protection/`. Server-rendered like the rest of the
console (`console/views.ts`), mobile-first (Nafisa uses her phone). Every screen has
Save and Back, and a progress bar showing sections done and items parked.

| Step | Screen | Behaviour |
|---|---|---|
| 8.1 | **Start** | What a DPIA is, that it is PureMed's document, that MSS has filled in the facts, that nothing is legal advice, roughly how long it takes. Resumes where she left off |
| 8.2 | **Check the facts (Part A)** | One screen per section (what comes in, what happens, what is kept, who else handles it, protection, rights, known gaps), generated (6.3). Each ends with "This is right" or "Something's wrong" plus a note. A "something's wrong" note goes to MSS (an event plus an email to Osman) and blocks signing until MSS resolves it |
| 8.3 | **Your decisions (Part B)** | One screen per section of questions. Each question shows its help, an answer control, and a quieter "I'll ask an adviser" link that parks it with the question's `adviser` note shown. "I don't know" is accepted and counts as parked |
| 8.4 | **Risks (Part D)** | One card per risk: agree it's a risk (yes / no, with why), likelihood and severity (low / medium / high), measures as tick boxes, plus "other". A risk rated high/high after measures prompts the ICO prior consultation question (C7), which is itself parkable |
| 8.5 | **Adviser pack** | Lists every parked question with its adviser note and the relevant Part A facts, and exports them as a print-friendly page and a .md download. Logs `dp.adviser_pack_exported`. When the adviser replies, Nafisa (or MSS on her written instruction) enters the answer and the source ("advice from <name>, <date>") |
| 8.6 | **Review and sign** | The whole DPIA rendered as it will be stored. Blocked, with the reasons listed, while: any required question is unanswered or parked, any Part A "something's wrong" is unresolved, or the signer is not a person owner. Signing asks for full name and role (typed), and the adviser's name if one was consulted. The tick reads: "I have read this assessment and approve it for PureMed Aesthetics Ltd." Creates `dp_document` (kind `dpia`, next version, current footprint), deletes the draft, generates the ROPA (slice 7), logs `dp.dpia_approved` |

Saving writes `dp_draft` and `dp.draft_saved` (throttled to one event per section per
session). MSS can see a draft read-only from the operator side, to help, but cannot sign.

## 9. Slices 6 to 8

**6. DPA acceptance.** One screen: the agreement text from the pack template with tenant
details merged (PureMed's legal name, company number, address; MSS's legal entity, still
to confirm), a required ICO registration tick and number (D12), typed name and role,
Accept. Refused while `solicitor_reviewed` is false. Stores `template_hash` and logs
`dp.dpa_accepted`. A new template version asks the owner to accept again. Whether the older
acceptance stays current meanwhile, and for how long, is **open** (Osman, with the solicitor);
build it as "stays current, flagged" until decided.

**7. ROPA and exports.** On each DPIA approval, generate kind `ropa`, which is both records
from `puremed-ropa-draft.md` filled from the signed answers and the footprint, and store it
unsigned. Every `dp_document` can be downloaded from the console as a print-friendly page
and .md, with its hash and signing details in the footer.

**8. Review triggers.** On every publish, compare the new footprint with the current DPIA's.
If they differ: log `dp.review_needed` with a plain-language diff ("a new question was added
to the consultation"; "consultation answers are now quoted in an email"; "a new recipient:
..."), show it on the Data protection card and in the banner, and open a new DPIA draft
pre-filled from the last signed answers so only the changed sections need revisiting.
Hard tenants follow D11's default (section 2).

## 10. Before it is called done

- Tests per slice as listed; the existing suite stays green.
- `data-protection-reviewer` rerun on studio-platform with `dp_draft` and `dp_document` in
  the contract.
- `design-reviewer` on the journey screens at 390, 768 and 1440.
- `copy-reviewer` on the pack intro and question help text (plain, client-facing, no advice).
- Operator SOP `studio-platform/sops/SOP-PLAT-002-data-protection-onboarding.md`: adding a
  tenant's enforcement setting, updating platform facts per release, marking the DPA
  template solicitor-reviewed, helping a clinic through a parked question, and what to do
  when Part A is reported wrong.
- PureMed walkthrough: Nafisa signs in with her own login, completes the journey to the
  sign step. The first real signature waits for her adviser's answers.

## 11. What this does not do

- Answer any legal question, or suggest a basis.
- Replace the DPA's solicitor review.
- Fix the platform gaps the DPIA records (age tick, Google Fonts link, staff unsubscribe,
  erasure of log rows, retention on 14 tables). Those are separate work items, and the
  footprint and platform facts will show them as changed when they land.
- Cover Phase 2 (Faces records). That is a review trigger and a new DPIA version when it
  comes.

## 12. Build status, 1 October 2026

Built in `studio-platform` commit d034ffc (not pushed). Tests: 109 pass (88 existing, 21 new in
`service/test/dp.test.ts`, one or more per slice). Operator SOP:
`studio-platform/sops/SOP-PLAT-002-data-protection-onboarding.md`. Local screens checked at 390,
768 and 1440 with `viewport-audit.js`; the docker image was built and loads the pack from
`/app/packs`.

| Where | What |
|---|---|
| Code | `service/src/dp/` (types, content loader, footprint, render, markdown, store, `platform-facts.json`), `service/src/console/dp-routes.ts` + `dp-views.ts`, migration `007_data_protection.sql`, gate hook in `config/publish.ts` `pinAndActivate` |
| Pack | `packs/aesthetics/dp/`: `dpia-intro.md`, `dpia-questions.json` (26 incl. C7 since 1 Oct evening, was 31), `risks.json` (12), `ropa.json`, `dpa-template.md` (MSS draft, `solicitor_reviewed: false`) |
| PureMed | `tenants/puremed/dp/`: `extra-questions.json` (B1.6, B6, B7.1 to B7.2), `extra-risks.json` (D1, D14), `extra-ropa.json`, `facts.json`; `tenant.json` gets Nafisa's owner login (`kind: person`), care@ renamed "PureMed (shared mailbox)" (`kind: shared`), `data_protection.enforcement: soft` |
| Operator | `GET /admin/:tenant/data-protection` (draft, status, blockers, read-only); `POST /admin/:tenant/data-protection/facts/:section/resolve` |

**Where the build differs from this spec, and why:**

- **D11 vs slice 4 for hard tenants.** Slice 4 says a DPIA on an older footprint is refused;
  D11's default says block only on a new special category field or a new recipient. Built to
  D11: other changes warn and log `dp.review_needed`.
- **Special category = every consultation question.** The pack has no per-question
  classification yet (that is adviser item C1), so all consultation answers count as possibly
  special. A new consultation question therefore blocks a hard tenant until re-approved.
- **C7 (ICO prior consultation)** is a pack question with `show_if: {"$risk_high": ["yes"]}`,
  shown on the Risks screen once any agreed risk is rated high likelihood and high severity.
- **MSS cannot enter answers for the clinic.** The operator view is read-only (8.5 allowed MSS to
  enter adviser answers on written instruction; not built, the owner enters them).
- **"Something's wrong" email** goes to `MSS_NOTIFY_EMAIL` from the tenant mailbox. Set on
  DigitalOcean to hello@mainstagestudio.co.uk (2 Oct 2026, was os@ from 1 Oct).
- **Option order** of consultation answers is pinned into `dp.option_order` at publish, because
  the config body is jsonb and loses key order.
- **Visible change for PureMed:** approvals made with the care@ login now read "Approved by
  PureMed (shared mailbox)" instead of "Nafisa".
- **Phase 2 trigger** is not a separate check: new tables surface through the platform-facts
  migration test, and any new form or field through the footprint.

**Section 10 reviews, run 1 October 2026 (evening).** All three agents run; fixes are in the
studio-platform commit after d034ffc (109 tests, typecheck clean).

- `copy-reviewer`: its one "must fix" (`{{clinics}}` unresolved) was a false positive: `clinics`
  is the possessive variable (`render.ts:30`) and renders "PureMed Aesthetics' record". Fixed:
  PureMed B7.1 asserted that later approval covers processing since 30 Sep (a legal premise in
  the question stem); now asks whether anything should be paused until both documents are in
  place. ICO number: B7.4 now asks for the number only and pre-fills the DPA screen (below); C7 stem
  ("must consult the ICO?") is borderline but deliberate, parkable and carries an adviser note.
- `design-reviewer`: fixed the stepper showing "Adviser pack" green (done) from the first visit
  (now done only once all decisions are answered, part when anything is parked); fixed the
  review page and print/download tables wrapping the # column one character per line at every
  width (`overflow-wrap:anywhere` on `.doc-md` shrank cell min-content; cells now
  `break-word`). Not changed: review page length with no jump nav, decisions page density
  (worth doing, not blocking); the empty "I'll answer" pre-select is a non-issue (an empty value
  is "Not answered" and blocks signing).
- `data-protection-reviewer`: verdict "not defensible" on the same five pre-existing FAILs.
  Section 12's "datamap unchanged at 5 FAIL" was true on count only: d034ffc added lawful-basis
  gaps (19 to 21) and dp_document to retention. Fixed in the contract: dp_draft retention
  ("until signed") removed because no code enforces a limit on an unsigned draft (retention now
  16 tables, honestly); `MSS_NOTIFY_EMAIL` declared as a recipient (staff name, email, note);
  config_version staff description brought up to date (Nafisa's own Gmail owner login). Second
  processors WARN (MSS notify mailbox has no egress host to match) is the same false-positive
  class as the runtime-logs WARN; data-map.js has no exception mechanism for it.

**Osman's changes, 1 October 2026 (late).** Asked "do we need so many questions?", comments
mandatory, and an offline export.

- **Questions cut from 38 to 32** (26 pack + 6 PureMed). Removed only those that duplicate a
  measure on the Risks screen, so the same choice is still made there: B4.1 store only the result
  (D2/D7), B4.2 answers in the alert vs a link (D3), B4.5 18+ confirmation (D9), B4.6 confirm the
  email first (D13), PureMed B6.4 keep the 458 un-emailed (D1); plus B3.2 (same next step for every
  recommendation), a product question rather than a risk to people. Kept: every lawful-basis and
  retention question (they feed the ROPA), B4.3/B4.4 (necessity with no matching risk), B7.4.
- **Comments mandatory** on every choice and period answer (free text is its own comment):
  `needsComment` in `render.ts`, so an answer without a comment isn't complete and blocks signing
  ("it needs a comment"). Labels read "Comment (required): ...", the decisions lede says every
  answer needs one, and an answered question without one shows "Add a comment to finish this
  answer". The rendered DPIA and ROPA say "Comment:" where they said "Why:". Risks: "If not, why
  not? (required if you answer No)", unchanged rule.
- **Offline export**: `GET .../dpia/questions/print` and `/download` (.md), linked on the overview
  DPIA card and under every decisions-page lede. Every question in journey order (conditional ones
  marked with when they're asked), options, the comment rule, the adviser note, the answer so far;
  then the risks with their measures and C7; then Part A. Logs `dp.questions_exported`.
  **Word (.docx)** at `.../dpia/questions/word` (the link shows Word and PDF; the .md route stays):
  same content with a box under each question ("Your answer" | "Comment (required)", and the four
  risk columns) pre-filled with answers so far and room to type. Typing in Word saves nothing;
  answers count only once entered in the console (the footer says so). Built with the `docx`
  package (new dependency) via `src/dp/markdownToDocx`, which takes the same Markdown subset as
  the HTML renderer, so signed documents could get a Word copy the same way.
- **B7.4** now asks for the ICO number only; the DPA screen pre-fills from it.

**Campaigns and WhatsApp spec, 1 October 2026.** `campaigns-audiences-build-spec.md` (design only,
nothing built) adds aftercare as service messages, care records (health data), WhatsApp through
Meta, and WhatsApp marketing consent. Part A is unchanged, because it states the platform as it runs
today. PureMed gets an optional section, "Planned: campaigns, WhatsApp and aftercare" (B8.1 to
B8.4, each with an adviser note), so the adviser answers these in the same round. Optional questions
are marked "Optional: doesn't hold up approval", never block signing (test), and read "Not
answered (optional)" in the signed DPIA if left blank. The comment rule applies once one is answered
("Comment (needed if you answer)"). When the build lands, the footprint review trigger still opens a
new DPIA version, as spec section 9 says.

**Needs Osman / a qualified decision:** `dp_document` retention vs the DPA template, which
promises deletion "from the platform" at the end of the service while the table refuses DELETE,
so tenant offboarding can't complete: (a) fixed period after service end plus a purge migration,
(b) keep as the accountability record with a clause 9.1 exception, or (c) return to the
controller then delete. Also for the adviser: whether DPIA signing needs its own purpose and
basis rather than `console-operations`; whether adviser names typed as free text need a notice.

**Pushed 1 October 2026** (studio-platform db06944, d034ffc onward), so the journey is live on
app.puremed.uk for Nafisa to review. `MSS_NOTIFY_EMAIL` = os@mainstagestudio.co.uk (MSS Google
Workspace), decided 1 Oct, recorded in `.do/app.yaml` and the contract; Osman sets it in the
DigitalOcean panel. **Still open:** the PureMed
walkthrough with Nafisa on her own login. `service/data-protection.json` still UNRATIFIED; the
DPA acceptance-currency question when the template changes (built as "stays current, flagged").

Local dev note: the local DB copy of PureMed is in live mode, so `config:publish ../tenants/puremed`
is refused locally (local has no console approvals). For local review publish a copy with
`sending.mode` "test". The local `.env` has `MAIL_TRANSPORT=gmail` with a stored care@ token: run
review servers with `MAIL_TRANSPORT=outbox` so nothing reaches a real inbox.

## Resume prompt

> Read section 12 of `main-stage-studio/01_mss/product/aesthetics-studio/dp-onboarding-build-spec.md`.
> Then: push studio-platform main to deploy (release publishes the pack), check the journey on
> app.puremed.uk, set `MSS_NOTIFY_EMAIL` on DigitalOcean, send Nafisa her sign-in at
> /console/puremed/login with akhtar.nafisa@gmail.com, and get Osman's call on dp_document retention.
