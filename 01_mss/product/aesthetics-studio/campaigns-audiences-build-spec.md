# Design spec: audiences and campaigns, by email and WhatsApp

*Design spec, v0.2, 2 October 2026 (v0.1 on 1 Oct). **All 8 slices BUILT 2 Oct 2026 in
studio-platform (commits 58f8abf, cfb24d8 and the SOP/data-map commit after them), committed
locally, NOT pushed, so not deployed.** Section 13 lists what differs from this spec and what is
open. Parent canon: `platform-design.md` (v0.10 note
points here). Implements CMP-001 to CMP-005, PPL-009, MSG-001, MSG-009, MSG-011, INT-003 and CON-001
for the WhatsApp purpose. Repo: `~/workspace/studio-platform`. **Decided 1 Oct (Osman): every
message is service or marketing, both can run as a campaign or a series, aftercare is service and
needs no marketing consent (section 3.1); the clinic's WhatsApp is a Business app account, so C-2 is
settled.** The other decisions in section 11 are open; this spec is written to the recommended
default for each. Readable copy (Claude Docs, may lag this file): https://claude.ai/code/artifact/0bd463b1-9518-410a-94b9-ce5405b062dc*

## 1. What this adds

Today the console's **Campaigns** page lists automated series: emails that start when someone does
something on the website (a form tag enrols them in a workflow). There is no way to pick a group of
people and send them something.

This spec adds four things:

1. **Audiences.** A saved, named rule that picks people (for example "guide sign-ups in the last 90
   days who haven't booked"). The console shows the count and who is left out, and why, before the
   audience is used.
2. **Campaigns.** A one-off send to an audience: a goal, an audience, one or both channels, the
   content for each channel, a schedule, approval, a launch confirmation, and results.
3. **WhatsApp as a second channel.** Sent through the WhatsApp Business Platform (Cloud API), with
   its own consent purpose, Meta-approved templates, delivery statuses, STOP handling and replies.
4. **A service and marketing boundary.** Every campaign, series and template is one or the other.
   Service messages (aftercare follow-ups first) go without marketing consent, and automate what
   Nafisa sends by hand on WhatsApp today. Marketing messages need marketing consent. The
   boundary has guards so service can't become a way round consent (section 3.1).

The existing automated series keep working unchanged; they are marketing, except the guide's first
email and the clinic alert, which are already flagged transactional.

## 2. Words used in the console

| Word | Means | Was |
|---|---|---|
| **Audience** | A saved rule that picks people. Its members are worked out when it is used, never hand-picked | New |
| **Campaign** | A one-off send to an audience, on one or both channels | New. The word currently labels series |
| **Automated series** | Messages that start when someone does something (today's workflows) | Currently called "Campaigns" (C-1) |
| **Channel** | Email or WhatsApp | New in the console |

The Campaigns page gets two sections: **Campaigns** (new) and **Automated series** (today's cards,
unchanged except the heading). Nav stays `Campaigns`, plus a new `Audiences` entry.

## 3. Rules this build keeps

From `platform-design.md` §2 and the live build. None of these are new; they constrain every
choice below.

- **Rules are data (DET-007).** An audience is a rule document with condition IDs, evaluated by a
  pure function over the database. No free-text queries, no SQL from the console.
- **Snapshot, don't reference (DET-005).** A campaign pins the audience version, the template
  versions and the config version it launched with. Editing the audience or the content after
  launch changes nothing already sent.
- **Every state change is an event (DET-002).** Audience saved, campaign approved, launched,
  paused, each recipient included or excluded, each message sent, delivered, read, failed.
- **Consent at send time (CON-002).** The recipient list is frozen at launch, but consent,
  suppression and erasure are checked again for each message as it goes out.
- **Idempotent sends (DET-009).** One idempotency key per recipient per channel. The existing
  "message row committed as `sending` before the transport is called" rule carries over to
  WhatsApp unchanged.
- **Health data never reaches marketing (CON-009).** Audience rules cannot read consultation
  answers or results (`form_submission`), and no clinical field is a merge field.
- **Approval before anything goes out (CMP-004, MSG-002).** Same draft and approve split as
  series emails. Nafisa writes and approves her own copy; Osman does not gatekeep it.
- **Consequence before confirmation (UXC-008).** Launch says "Send to 212 people now: 180 by
  email, 32 by WhatsApp", not "Launch".
- **Test mode holds.** In test mode only allowlisted addresses and numbers receive anything.

### 3.1 The service and marketing boundary (decided 1 Oct 2026)

Every campaign, series, template and message carries a **purpose**: `service` or `marketing`. It is
set when the campaign or series is created and cannot change after its content is approved; a
change of purpose is a new campaign.

| | Service | Marketing |
|---|---|---|
| For | Care the person has had or booked: aftercare follow-ups, check-ins, reminders, results | Promoting treatments, offers, events, news, the guide series |
| Marketing consent | **Not checked** (MSG-009) | Required per channel, checked at every send |
| Who can receive | Only people with a qualifying care record (guard G2) | Anyone an audience picks, after system exclusions |
| Typical shape | A series started by a care record (aftercare day 1, 3, 7, 14) or a campaign to a care-based audience (everyone treated with a recalled product) | A campaign to an audience, or a series started by a form |
| Meta template category | Utility | Marketing |
| Frequency cap, results | Not counted in the marketing cap or marketing results | Counted |
| Quiet hours | Apply | Apply |
| Opt-out | No marketing unsubscribe; "reply if you have questions"; staff can stop care messages for a person (C-12) | Unsubscribe link, STOP, "Stop promotions" button |

**Guards.** Without these, "service" would be a loophole, and an ICO complaint about a promotional
"aftercare" message would be hard to answer.

| ID | Guard |
|---|---|
| G1 | Purpose is fixed at approval. Every send records the purpose it went out under |
| G2 | A service audience must include a care condition (`has_care_record`, optionally by treatment and within a window). A service campaign without one can't be saved, and service series can only be started by a care record |
| G3 | Service content is linted against a pack list: prices, offers, discount words, "book your next", links to anything but aftercare pages or the person's own booking. The lint blocks approval with the matching phrase shown. It is a backstop; the approver's tick ("This message only helps with care they have had") is the decision, and it is logged |
| G4 | If Meta moves a utility template to the marketing category, the platform treats it as marketing from then on: marketing consent is checked, and the console says why |
| G5 | Service messages never appear in marketing results, and marketing results never count them |

**What starts aftercare.** Bookings stay in Faces until Phase 2, so there is no booking event to start
from. Version 1 adds **Record treatment** to the person page: treatment (from the pack catalogue),
date, practitioner, and "patient is happy to get aftercare on WhatsApp". Saving it writes a
`care_record` row and enrols the person in that treatment's aftercare series. This replaces the
messages Nafisa sends by hand. At Phase 2 the booking engine's "attended" event writes the same
row and the button becomes a fallback.

**Health data.** "Aftercare for your Profhilo treatment" says what treatment someone had, which is
health data (special category). So: the treatment lives in `care_record`, which erasure can clear,
never in the append-only event log (the event carries only the record's id); care conditions are
available to service audiences only, never marketing ones (CON-009 holds); and service WhatsApp
messages send health data to Meta, which the DPIA must cover (section 9).

**Meta's opt-in still applies.** Meta requires the person to have agreed to hear from the business
on WhatsApp for any message the business starts, service or not. The "happy to get aftercare on
WhatsApp" tick on Record treatment is that agreement, stored as a `service_whatsapp` contact
preference. It is not marketing consent and never satisfies a marketing check.

## 4. Audiences

### 4.1 The rule document

An audience is `include` (every condition must hold) plus `exclude` (any condition removes the
person). Each condition has an ID so the preview and the recipient record can say which one
included or excluded someone.

```json
{
  "include": [
    { "id": "A1", "type": "has_tag", "tag": "why-do-i-look-tired" },
    { "id": "A2", "type": "first_seen", "within_days": 90 }
  ],
  "exclude": [
    { "id": "X1", "type": "event_since", "event_types": ["booking.created", "booking.recorded_manually"], "within_days": 365 },
    { "id": "X2", "type": "in_active_series", "series": ["why-do-i-look-tired"] }
  ]
}
```

### 4.2 Condition types (closed set, version 1)

| Type | Reads | Example in the console |
|---|---|---|
| `has_tag` / `lacks_tag` | `person_tag` | Has the tag *imported:mailchimp* |
| `first_seen` | `person.created_at` | Joined in the last 90 days |
| `source` | Identifier `source`, first-touch event | Came from the guide sign-up form |
| `submitted_form` | `form.submitted` events (the fact, never the answers) | Sent the consultation form |
| `consent` | Latest `consent` row per purpose | Has agreed to WhatsApp marketing |
| `consent_source` | Consent `source` and `evidence.mailchimp_source` | Mailchimp list upload (see C-7) |
| `event_since` | `event` by type within a window | Booked in the last 12 months |
| `no_event_since` | Same, negated | No booking in the last 6 months (lapsed) |
| `in_active_series` / `completed_series` | `enrolment` status | Still in the guide series |
| `received_campaign` | `campaign_recipient` | Already got the October campaign |
| `has_channel` | Email or WhatsApp identifier present | Has a mobile number |
| `has_care_record` | `care_record` (treatment, date). **Service audiences only** (G2) | Treated with Profhilo in the last 30 days |

Adding a type is a code change with a test, not configuration. This keeps the set closed and
reviewable by the determinism gate. The evaluator refuses `has_care_record` in a marketing
audience. Recall-due conditions arrive with Phase 2 bookings.

### 4.3 Exclusions the platform always applies

These are not part of the audience and cannot be switched off. The preview shows each as its own
line with its count:

| ID | Exclusion | Why |
|---|---|---|
| `SYS-ERASED` | Erased people | Erasure |
| `SYS-SUPPRESSED` | Suppressed address (bounced, complaint, imported unsubscribe) | MSG-008 |
| `SYS-NO-CONSENT-<channel>` | Marketing only: no granted marketing consent for that channel | PECR; CON-001 |
| `SYS-NO-CARE-WHATSAPP` | Service only: no `service_whatsapp` agreement, so WhatsApp is not used (email still can be) | Meta opt-in policy |
| `SYS-CARE-STOPPED` | Service only: staff stopped care messages for this person | C-12 |
| `SYS-NO-ADDRESS-<channel>` | No email address, or no WhatsApp number | Nothing to send to |
| `SYS-FREQ-CAP` | Marketing only: already had the tenant's cap of marketing messages in the last 7 days | CMP-003 (C-9) |
| `SYS-TEST-MODE` | Not on the test allowlist (test mode only) | Test mode |

### 4.4 Preview

Shown live while the audience is built, and again on the campaign review step:

```
Matches your rules                  347
  Left out: no email consent         -41
  Left out: suppressed                -6
  Left out: had 2 messages this week  -9
Will receive                        291   (259 email, 32 WhatsApp)
[See the 291]  [See who was left out]
```

Every figure opens the list behind it (RPT-004). The preview is the same function the launch
uses, run without writing, so the number at launch can only differ by what changed in between,
and the launch screen says so if it has ("3 more people since you previewed").

### 4.5 Versions

Saving an audience creates an immutable `audience_version` (rule document plus content hash),
like templates and workflows. A campaign pins the version it launched with. An audience used by a
launched campaign can be edited (new version) but not deleted, so the campaign can always show
what it was sent to.

## 5. Campaigns

### 5.1 What a campaign holds (CMP-001)

| Field | Notes |
|---|---|
| Purpose | Service or marketing (section 3.1). Chosen first, because it decides which audiences, conditions, consent checks and template category apply |
| Name and goal | Goal from a short list: bookings, consultation sign-ups, event attendance, information only (marketing); care follow-up, safety notice (service). Drives the results screen |
| Audience | One pinned `audience_version` |
| Channels | Email, WhatsApp, or both, with a channel rule (5.2) |
| Content | One email and/or one WhatsApp template, each with its own draft, approval and version |
| Schedule | Send now, or at a set time (tenant timezone). Quiet hours always apply |
| Status | Draft, Scheduled, Sending, Paused, Sent, Cancelled |

### 5.2 Channel rules

When a campaign has both channels, each person gets **one** message, chosen by a rule the owner
picks on the Channels step:

| Rule | Each person gets |
|---|---|
| **WhatsApp first** (default, C-8) | WhatsApp if they have a number and WhatsApp consent, otherwise email if they have email consent |
| **Email first** | Email if they can get it, otherwise WhatsApp |
| **Both** | Every channel they can get. The confirmation states the double-send count |

The choice is recorded per recipient with the rule ID that decided it, so "why did Sarah get a
WhatsApp and not an email" has an answer on her timeline.

### 5.3 Launch

1. **Checks.** Content approved on every chosen channel; WhatsApp template approved by Meta; the
   tenant's channel connection healthy; live mode or a test-mode banner; owner role.
2. **Test send.** "Send me a test" goes to the signed-in person's email and/or WhatsApp number,
   rendered with their own merge values. Required once per content version before launch.
3. **Confirm.** "Send to 291 people now: 259 by email, 32 by WhatsApp. This can't be unsent."
4. **Freeze.** The audience is evaluated once and written as `campaign_recipient` rows: everyone
   in, everyone left out, the condition or system exclusion that decided it, and the chosen
   channel. A `campaign.launched` event names the audience version, template versions and counts.
5. **Schedule.** One `scheduled_action` per included recipient, due times spread to respect the
   channel's pace (5.4). From here the existing worker takes over.

### 5.4 Pace and caps

- **Email** shares the tenant's `daily_cap` (1,500 for PureMed) with the automated series. A
  campaign may use at most 80% of the cap in any 24 hours, so the guide series and clinic alerts
  are never starved (C-10). A 490-person campaign goes out in one day; a larger one spreads, and
  the confirm screen says when the last message goes.
- **WhatsApp** follows Meta's messaging limit tier for the number (a new, unverified number
  starts low; the tier rises with verified business status and quality). The connection screen
  shows the current tier; the scheduler stays under it.
- **Quiet hours** (20:00 to 08:00, released at 09:00 for PureMed) apply to both channels.
- **Frequency cap.** Counted across campaigns and series, per person, marketing messages only.

### 5.5 Pause and cancel

Pause stops claiming the campaign's pending steps; resume carries on. Cancel marks every pending
step skipped with `campaign.cancelled`. Both are owner only and evented, matching how series pause
works today.

### 5.6 Results (CMP-005)

| Figure | Source | Honest limit, stated on screen |
|---|---|---|
| Sent, failed, per channel | `message` | |
| Delivered, read (WhatsApp) | Meta status webhooks | Read only if the person has read receipts on (C-4) |
| Clicked | Signed redirect links | **Not built yet** for email either (MSG-007 is Designed, not built). Slice 8 adds it |
| Unsubscribed or STOP | `consent.withdrawn` caused by this campaign | |
| Replies | `reply.received`, `whatsapp.message_received` | Email replies not yet read from care@ (MSG-010 not built) |
| Bookings | `booking.*` events within the attribution window | Until Phase 2, bookings exist only when staff record them manually, so this undercounts. Say so |

Every figure opens the people behind it.

## 6. WhatsApp

### 6.1 How it connects

**WhatsApp Business Platform, Cloud API, direct with Meta** (C-3), not a reseller and not
automation of a personal WhatsApp. Reasons: no extra processor holding patient numbers, Meta's
rates without a markup, and it is the route `clinical-platform/technical-design.md` §7.1 already
chose for aftercare.

What the clinic needs, as an onboarding checklist in Settings (owned by MSS, like the Google
connection):

1. Meta Business account for PureMed, with **business verification** (raises the messaging limit
   and is needed for a display name).
2. A **WhatsApp Business Account** on the clinic's **existing number**. PureMed already uses the
   WhatsApp Business app (C-2, decided), so the number joins the Cloud API through Meta's
   coexistence mode: patients keep the number they know, Nafisa keeps her chats and the app, and
   the platform sends from the same number. Check coexistence eligibility and its limits for the
   number during onboarding, and confirm that platform-sent messages show in her app.
3. Display name approved by Meta ("PureMed Aesthetics").
4. A **system user token** with the WhatsApp messaging permissions, stored encrypted in the
   database exactly like the Google token.
5. **Webhook** subscribed to messages and statuses, pointing at the platform.
6. Payment method on the WhatsApp Business Account (Meta bills per delivered template message;
   current UK marketing rates to be checked against Meta's rate card before the first campaign).

The connection screen shows: number, display name status, quality rating, messaging limit tier,
last webhook received, last successful send.

### 6.2 Templates, and why WhatsApp content differs from email

A business can only start a WhatsApp conversation with a **Meta-approved template**. Free text is
only allowed within 24 hours of the person's last message to the clinic. So campaign WhatsApp
content is always a template, and every template goes through two approvals:

1. **Nafisa approves** it in the console (same draft and approve split as email).
2. **Meta approves** it. The console submits it on Nafisa's approval, then shows Pending, Approved
   or Rejected (with Meta's reason). Approval usually takes minutes to a day; it is outside our
   control, so the console says so and lets her build the email meanwhile.

Template shape, constrained by Meta and shown as a phone-bubble preview:

| Part | Allowed | Platform rule |
|---|---|---|
| Category | Marketing, Utility | Follows the purpose: marketing submits as Marketing, service as Utility (G4 if Meta reclassifies) |
| Header | Optional text or image | Image from the tenant's brand assets |
| Body | Text with variables | Variables come from the same merge-field whitelist as email (MSG-003), mapped to Meta's numbered `{{1}}` slots by the platform, never typed by the author |
| Footer | Optional short text | Pre-filled "Reply STOP to opt out" (C-5) |
| Buttons | Up to two: link (with a fixed or variable URL) or quick reply | Booking link resolves from `links.booking_url`; quick reply "Stop promotions" always present |

A template, once Meta approves it, is immutable on our side too: an edit is a new template version
and a new Meta submission. The `message` row snapshots the template version and its Meta name and
language, so what was sent is always known.

### 6.3 Consent and phone numbers

This section is about **marketing**. Service messages need no marketing consent; they need a care
record and the `service_whatsapp` agreement (section 3.1).

This is the gap that matters most. **The platform holds no phone numbers today** and no consent
to WhatsApp marketing. WhatsApp marketing is "electronic mail" under PECR, so it needs consent or
the soft opt-in for existing customers (C-11), and Meta's policy also requires opt-in before
business-initiated messages.

- New consent purpose **`marketing_whatsapp`**, separate from `marketing_email`, with its own
  wording file (`tenants/puremed/consent/marketing-whatsapp.v1.md`) and the same ledger, hash and
  evidence model.
- Forms gain an optional **mobile number** field (normalised to E.164, stored as a `phone`
  identifier) and an optional, unticked **WhatsApp tick**. The tick is only recorded if a number
  was given.
- **No inferred consent.** A number collected for a booking, a number in Faces, or Nafisa's
  existing WhatsApp chats is not consent to WhatsApp marketing (peer review 15 Aug, finding 8).
  The importer must never write `marketing_whatsapp` from Faces or any other export.
- **Getting consent from existing people** is a campaign in its own right: an email campaign to
  people with email consent, inviting them to add a number and tick WhatsApp on a short page.
  This is the first campaign PureMed would run with this build.
- **Withdrawal.** A STOP reply, the "Stop promotions" button, or Meta's own marketing opt-out
  signal records `marketing_whatsapp` withdrawn with the inbound message ID as evidence, and stops
  any further WhatsApp marketing at the next send check. A free-text STOP also pauses automated
  service messages to that person and alerts staff, so Nafisa can check by hand whether they still
  want aftercare (C-12). The button stops marketing only. The email unsubscribe page gets a second
  tick for WhatsApp; `unsubscribe_withdraws` already lets the tenant choose which purposes one
  unsubscribe covers.

### 6.4 Webhook and inbound messages

`POST /wa/:tenant/webhook` (and the `GET` verification handshake):

- Signature checked against the app secret (`X-Hub-Signature-256`) before anything is read.
  Unsigned or mismatched requests are refused and logged.
- **Statuses** (sent, delivered, read, failed) update the `message` row and append
  `message.delivered` / `message.read` / `message.failed`. A permanent failure (number not on
  WhatsApp, blocked) marks the number undeliverable for WhatsApp; it is not an email suppression.
- **Inbound messages** are matched to a person by number. A match appends
  `whatsapp.message_received` (payload: message ID and type, **not the text**, same rule as the
  event log today), pauses that person's marketing, and alerts care@ that they replied (MSG-010
  pattern). STOP-family words and the opt-out button withdraw consent first.
- **Where the reply text lives** (C-6): version 1 keeps inbound text in a separate
  `inbound_message` table with a retention period, shown on the person's page, so staff can read
  it. Replying stays in WhatsApp Business on the phone or a later console inbox; this build does
  not send free-text replies.

## 7. Data model (migration 008)

All tables tenant-scoped, RLS forced, grants to `app_runtime`, as migrations 003 to 007.

```sql
create table audience (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id),
  name text not null,
  description text,
  active_version_id uuid,            -- set after first version
  archived_at timestamptz,
  created_by text not null,
  created_at timestamptz not null
);

create table audience_version (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id),
  audience_id uuid not null references audience(id),
  content_hash text not null,
  rules jsonb not null,              -- section 4.1
  created_by text not null,
  created_at timestamptz not null,
  unique (audience_id, content_hash)
);

create table campaign (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id),
  name text not null,
  purpose text not null check (purpose in ('service', 'marketing')),
  goal text not null check (goal in ('bookings', 'signups', 'attendance', 'information', 'care_follow_up', 'safety_notice')),
  audience_version_id uuid references audience_version(id),
  channels text[] not null,          -- {'email'}, {'whatsapp'}, or both
  channel_rule text not null check (channel_rule in ('whatsapp_first', 'email_first', 'both')),
  email_template_key text,           -- template_version / template_draft key, 'cmp-<id>-email'
  whatsapp_template_key text,
  send_at timestamptz,               -- null = send now
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'sending', 'paused', 'sent', 'cancelled')),
  launched_at timestamptz,
  launched_by text,
  config_version_id uuid references config_version(id),
  created_by text not null,
  created_at timestamptz not null
);

-- Everyone the audience matched at launch, in or out, and why (DET-004).
create table campaign_recipient (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id),
  campaign_id uuid not null references campaign(id),
  person_id uuid not null references person(id),
  included boolean not null,
  channel text check (channel in ('email', 'whatsapp')),
  decided_by text[] not null,        -- condition / system exclusion / channel rule IDs
  unique (campaign_id, person_id, channel)
);

-- WhatsApp templates: our version plus Meta's review state.
create table wa_template_version (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id),
  key text not null,
  content_hash text not null,
  category text not null check (category in ('marketing', 'utility')),
  language text not null default 'en_GB',
  components jsonb not null,         -- header, body, footer, buttons, variable map
  approved boolean not null,         -- clinic approval
  approved_by text, approved_on date,
  meta_name text,                    -- name submitted to Meta
  meta_status text check (meta_status in ('not_submitted', 'pending', 'approved', 'rejected', 'paused', 'disabled')),
  meta_reason text,
  created_at timestamptz not null,
  unique (tenant_id, key, content_hash)
);

-- What treatment someone had: health data, so never in the event log
-- (the event carries only this row's id) and clearable by erasure.
create table care_record (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id),
  person_id uuid not null references person(id),
  treatment_key text not null,       -- pack catalogue key
  treated_on date not null,
  practitioner text,
  service_whatsapp boolean not null, -- patient agreed to aftercare on WhatsApp
  source text not null,              -- 'console' now, 'booking' from Phase 2
  recorded_by text not null,
  recorded_at timestamptz not null
);

create table inbound_message (       -- WhatsApp reply text, retained, not in event
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenant(id),
  person_id uuid references person(id),
  channel text not null check (channel in ('whatsapp')),
  provider_message_id text not null unique,
  body_text text,
  received_at timestamptz not null,
  purge_after timestamptz not null
);
```

Changes to existing tables:

- **Purpose everywhere:** `purpose text not null check (purpose in ('service', 'marketing'))` on
  `campaign` (shown in the sketch above), `template_version`, `wa_template_version` and `message`, and `purpose` in the
  workflow definition (existing workflows default to marketing; steps already flagged
  `transactional` keep that flag). Workflow triggers widen from `tag.added` to also allow
  `care.recorded` with a treatment key, for aftercare series.
- **Service stop:** a `care_messages_stopped_at` / `_by` pair on `person` (C-12), evented.
- `scheduled_action`: `enrolment_id` becomes nullable; add `campaign_recipient_id`; check that
  exactly one is set. Campaign steps reuse the claim, retry, stale-claim and idempotency logic
  as they are.
- `message`: `channel` check widens to `('email', 'whatsapp')`; `template_version_id` becomes
  nullable and `wa_template_version_id` is added, with a check that the one matching the channel
  is set; add `delivered_at`, `read_at`; `to_address` holds the E.164 number for WhatsApp.
- `workflow` claim query: joins either the enrolment's workflow (state `on`) or the recipient's
  campaign (status `sending`).
- Tenant config: `whatsapp` block (phone number ID, WABA ID, display name, `daily_limit` mirror,
  `test_allowlist_numbers`), credentials in the database, not in config.

## 8. Console screens

Mobile first (UXC-005). Each screen below states its single primary action.

| Screen | Shows | Primary action |
|---|---|---|
| **Campaigns** | Two sections: Campaigns (status pill, audience, channels, sent / delivered / booked) and Automated series (today's cards) | New campaign |
| **New campaign: 1 Purpose and goal** | Service or marketing (decides everything after it), name, goal | Next |
| **2 Audience** | Pick a saved audience or build one inline; live preview (4.4) | Next |
| **3 Channels** | Email, WhatsApp, both; channel rule; per-channel count. WhatsApp greyed with the reason if the connection or consent count is zero | Next |
| **4 Content** | Email editor (reused from series emails, same draft / approve / placeholder guard) and WhatsApp editor with phone-bubble preview, variable picker, Meta status | Approve |
| **5 Schedule** | Now or a time; when the last message will go, given caps and quiet hours | Next |
| **6 Review** | Everything above on one page, test-send buttons, the consequence sentence | Send to 291 people |
| **Campaign page** | Status, progress bar, results (5.6), recipients and left-out lists, pause / cancel, "why" per person | Pause |
| **Audiences** | List with live counts and where each is used | New audience |
| **Audience builder** | Include / exclude conditions as sentences ("People who **have the tag** guide sign-up"), preview, versions | Save |
| **Settings: WhatsApp** | Onboarding checklist (6.1), connection health, tier, quality rating | Connect |
| **Person page** | Consent per channel, WhatsApp number, care records, campaign messages on the timeline (service and marketing labelled), WhatsApp reply text, "Stop care messages" | Record treatment |
| **Record treatment** | Treatment, date, practitioner, "happy to get aftercare on WhatsApp", which aftercare series will start and its first message time | Save and start aftercare |
| **Automated series** | Gains a purpose label, and aftercare series per treatment (from the pack library) alongside the guide series | (existing) |

## 9. Data protection

The DP onboarding build (d034ffc) generates the ROPA and DPIA footprint from the config. This
build changes that footprint, so its own review triggers must fire, and D11's default treats both
of these as blocking for a hard-gate tenant:

- **New recipient:** Meta Platforms (WhatsApp Business Platform) as a processor, with a
  restricted transfer outside the UK to assess. Sub-processor register entry (CON-011).
- **New data category:** mobile numbers, WhatsApp delivery and read status, inbound message text.
- **Health data in messaging:** `care_record` holds treatments, and service messages that name a
  treatment send health data to Meta (WhatsApp) and Google (email). This needs an Article 9
  condition and its own DPIA section. "Needs a qualified decision": whether aftercare messages may
  name the treatment, or should stay general ("your treatment on Tuesday").
- **Retention:** inbound message text (proposed 400 days, matching consultation answers), audience
  and recipient records (kept with the campaign as evidence of who was sent what and why).

**Asked in advance (1 Oct 2026).** PureMed's DPIA journey now carries four optional questions
(B8.1 to B8.4, `tenants/puremed/dp/extra-questions.json`) on this build's qualified decisions, so
Nafisa's adviser can answer them in the same round as the current DPIA: aftercare as service
without marketing consent and whether guards G1 to G5 suffice (D-1); naming the treatment in
aftercare messages and its Article 9 condition; the WhatsApp soft opt-in (C-11); Meta as the
route and the transfer outside the UK (C-3). They don't hold up approval of today's DPIA. The
review trigger below still fires when the build lands, and the answers carry into that version.

PureMed is on the soft gate, so sending carries on, but the console will flag the DPIA as needing
review once WhatsApp is configured. Run `make datamap` and the data-protection reviewer on the
migration before slice 5 ships.

## 10. Build slices

Each slice ships with tests, an SOP update, and goes through the determinism gate. Email value
lands first so PureMed can run a campaign before any Meta setup is done.

| # | Slice | Done when |
|---|---|---|
| 1 | **Audiences**: tables, closed condition set, pure evaluator, system exclusions, preview, versions, console list + builder | Same inputs always give the same members (property test); every exclusion carries an ID; health tables unreachable from the evaluator (test) |
| 2 | **Email campaigns**: campaign tables, wizard, content draft / approve, test send, launch freeze, recipient rows, worker path via `campaign_recipient_id`, pace under 80% of cap, pause / cancel, results (sent / failed / unsubscribed) | A campaign to a test audience sends once per person under a crash mid-send (existing DET-009 tests extended); live-mode launch refuses unapproved content |
| 3 | **Phone and WhatsApp consent capture**: `phone` identifiers, form field, `marketing_whatsapp` purpose and wording, unsubscribe page second tick, "add your number" consent page | Consent rows carry wording hash and evidence; no importer can write `marketing_whatsapp` (test) |
| 4 | **WhatsApp connection**: Settings checklist, encrypted token, webhook with signature check, health | Webhook refuses a bad signature (test); health shows last webhook |
| 5 | **WhatsApp templates and sending**: editor, Meta submission and status sync, transport, statuses, STOP handling, inbound matching, reply alert, `inbound_message` | A STOP withdraws consent and the next scheduled WhatsApp skips with `SYS-NO-CONSENT-whatsapp` (test) |
| 6 | **Service messages and aftercare**: purpose on everything, guards G1 to G5, `care_record` and Record treatment, `care.recorded` trigger, aftercare series by email and WhatsApp (Utility templates), service campaigns, Stop care messages. Email aftercare can ship straight after slice 2; WhatsApp aftercare needs slice 5 | A service send skips the marketing consent check and a marketing send never does (test); a service audience without a care condition can't be saved (test); a lint hit blocks approval (test); no treatment key in any event payload (test) |
| 7 | **Both channels**: channel rules, per-recipient channel decision, combined results | Each rule's choice reproduces from the recipient's state at launch (test) |
| 8 | **Clicks**: signed redirect links for both channels (closes MSG-007), click figures in results | No open pixel anywhere (test kept) |

## 11. Decisions for Osman

| # | Decision | Recommended default (what this spec builds to) |
|---|---|---|
| C-1 | Rename today's "Campaigns" to "Automated series"? | Yes. Campaigns = sent to an audience; series = started by an action. One word, one meaning |
| C-2 | Which WhatsApp number | **Decided 1 Oct:** the clinic's existing WhatsApp Business number, through coexistence (6.1) |
| C-3 | Cloud API direct with Meta, or a reseller (Twilio, 360dialog, etc.) | **Direct.** One fewer processor, no markup, already the clinical-platform choice. A reseller only if Meta's onboarding stalls |
| C-4 | Record WhatsApp **read** status for marketing? | Record delivered for all; record read, but show it only as a campaign total, never per person in the console (no per-person "she read it" for marketing, in the spirit of the no-pixel rule) |
| C-5 | Opt-out wording | Footer "Reply STOP to opt out" plus the "Stop promotions" quick-reply button on every marketing template |
| C-6 | WhatsApp replies in version 1 | Store and show the text on the person page, alert care@, no replying from the console. A console inbox is a later piece of work |
| C-7 | The 458 Mailchimp **list uploads** (no opt-in of their own) | The audience builder offers "consent came from a Mailchimp list upload" as a condition, and new audiences **exclude it by default** until the qualified soft opt-in call is made. The owner can remove the exclusion; doing so is evented |
| C-8 | Default channel rule when both are picked | WhatsApp first, then email |
| C-9 | Frequency cap | 2 marketing messages per person per 7 days, across campaigns and series, per tenant setting |
| C-10 | Campaign share of the email daily cap | 80%, leaving 20% for series and alerts |
| C-11 | WhatsApp **marketing** to existing patients whose numbers came from their care | Rely on PECR's soft opt-in for patients and genuine enquiries, with the basis and evidence (first booking or enquiry date) on the consent row and opt-out in every message; explicit opt-in for everyone else. Needs a qualified check first: the soft opt-in also requires a chance to refuse when the number was collected, which historic numbers may not have had |
| C-12 | What a free-text STOP does to service messages | Pauses automated service messages too and alerts staff, so Nafisa confirms by hand whether to carry on with aftercare. The "Stop promotions" button stops marketing only |
| D-1 | Service vs marketing boundary | **Decided 1 Oct:** both purposes can be a campaign or a series; aftercare is service and sends without marketing consent (3.1) |

## 12. Not in this build

A visual workflow builder (D6 stands), SMS, posts or landing pages inside the campaign object
(CMP-001's wider scope, Phase 4), offer codes (CMP-008), AI drafting of campaign copy (CMP-007),
replying to WhatsApp from the console, and attribution beyond a stated window on recorded bookings.

## 13. Build state, 2 October 2026

Built to the recommended default for every open decision. 162 tests pass locally (2 Oct, after the UX review fixes B-7, B-13, B-14; review: `campaigns-ux-review-2026-10-02.md`) (50 new across
`audiences`, `campaigns`, `whatsapp-care` and `campaign-console`). Operator SOP:
`studio-platform/sops/SOP-PLAT-003-campaigns-whatsapp-care.md`.

**Where the build differs from this spec**

| # | Spec said | Built | Why |
|---|---|---|---|
| B-1 | A six-step wizard | One draft page with six numbered sections and one Save | Fewer screens, same steps; the confirm button still states the consequence |
| B-2 | Webhook at `/wa/:tenant/webhook` | One URL, `/wa/webhook`, routed by the number's `phone_number_id` | Meta gives one webhook per app, not per clinic |
| B-3 | An event per recipient included or left out | One `campaign.launched` event with counts; the frozen `campaign_recipient` rows hold each person's rule ids | 500 events per campaign added nothing the rows don't already say |
| B-4 | `whatsapp.message_received` event | `reply.received` with `channel: whatsapp` | The series' existing "replied" stop rules read it with no change |
| B-5 | Store WhatsApp reply text | Stored only for a reply within 7 days of a platform message, a reply to one, or a STOP | With coexistence every chat on the clinic's number reaches the webhook; the rest is ignored and nothing about it is kept |
| B-6 | WhatsApp versions pinned like email | A series step uses the newest version approved by the clinic and Meta at send time; the message row records which | WhatsApp templates are edited in the console, not published with the series |
| B-7 | Click tracking (slice 7 in the spec's order) | Built, slice 8, behind a per-tenant `campaigns.link_tracking` (`off` / `campaigns` / `all`, default `off`); **off for PureMed** | The 2 Oct UX review: with it on, every link in every live email becomes an `app.puremed.uk/c/…` redirect, and recording clicks isn't in the DPIA or the privacy notice. Turn on once both cover it. WhatsApp button links always use `/c/` |
| B-8 | Person page "existing" | A minimal People search and person page added (agreements, care messages, Record treatment, replies, what happened) | Record treatment needed somewhere to live; the console had no People screen |
| B-9 | Template header text or image | Text only | Image headers need media upload to Meta; not needed for v1 |
| B-10 | (not in spec) | Hard data protection gate checked at launch for hard tenants | Same rule as live publishing |
| B-12 | (not in spec) | A **Guide** page in the console menu: a step-by-step user guide for clinic staff covering every screen, adapting to role and WhatsApp setup (studio-platform c8a005d) | Asked for by Osman, 2 Oct |
| B-13 | Bookings marked by staff (`booking.recorded_manually`) | A **Mark as booked** button on the person page, any staff, optional note | It's the default "didn't do something" condition and drives the series' booked stop rules and campaign results, but only the admin API could set it (2 Oct UX review) |
| B-14 | CON-009: no care record in a marketing audience | Also refused as an event: `care.recorded` and the care-messages events can't be a marketing `event_since`/`no_event_since` condition, and the builder doesn't offer them | The 2 Oct UX review found "had a treatment recorded" offered in marketing audiences |
| B-11 | (not in spec) | Data protection Part A and the footprint now name care messages, health data in messages, mobile numbers, WhatsApp replies and Meta | The DPIA review trigger fires on deploy for PureMed (soft gate: flagged, not blocked) |

**Open**

- **Deployed 2 Oct 2026** (studio-platform 49cf53f, live on `app.puremed.uk` after about 100 s): migration
  008 ran, the aftercare series is published paused, and link tracking is off for PureMed (B-7), so
  live email links are unchanged. Checked from outside only; no console section run on production yet.
- C-1, C-3 to C-12 stand at their defaults; C-2 and D-1 are decided.
- `list_upload_sources: ["Import"]` (C-7) is Mailchimp's usual value, not read from PureMed's
  export. Check it first (SOP-PLAT-003 section 1).
- Aftercare copy is placeholder; the series stays paused until Nafisa writes, approves and turns it on.
- WhatsApp was exercised against a stand-in for Meta's API only. Nothing has been sent to Meta.
- Not run: the design review at 390/768/1440 (only a desktop look), the data-protection
  reviewer. `make datamap` has no new kind of failure; the open lawful-basis, retention,
  processor-terms and DPIA items now include the two new purposes and Meta.
- The webhook finds a clinic by checking each tenant's config in turn; fine for a handful of
  tenants, worth an index table later.

## Resume prompt

> Read `main-stage-studio/01_mss/product/aesthetics-studio/campaigns-audiences-build-spec.md`,
> section 13. Deployed 2 Oct. Before Nafisa sends a first campaign: check the Mailchimp list-upload
> source value on the DO console (SOP-PLAT-003 section 1). Then the P1 items in
> `campaigns-ux-review-2026-10-02.md`, and start Meta business verification and the coexistence
> check (SOP-PLAT-003 section 2).
