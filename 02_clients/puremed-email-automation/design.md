# PureMed: "Why Do I Look Tired" email sequence

**Status:** Design, for founder review. 24 September 2026.
**Home once approved:** `osmanakhtar/puremed-aesthetics` (the PureMed repo). This file sits in the Studio repo only because that repo is not attached to this session. `02_clients/puremed/` is gitignored here, so move it into the PureMed repo before building.

---

## 1. What it has to do

| Step | When (after opt-in) | Email | Job |
|---|---|---|---|
| Trigger | Form submitted on `/guide-opt-in` | | Contact gets the tag `why-do-i-look-tired` |
| 1 | Immediately | Guide delivery | Send the guide. Nothing else. |
| 2 | Day 1 | Why you may look tired | Help her work out which cause fits her |
| 3 | Day 3 | Why more filler is not always the answer | Reframe: assess before you treat |
| 4 | Day 5 | The £25 Fresh-Face Assessment | Introduce the offer properly |
| 5 | Day 7 | Objections and reassurance | Price, pain, "will I look done", "is it a sales pitch" |
| 6 | Day 9 | Final reminder | Close the series, one last invitation |

Emails 2 to 6 each end on the same single CTA: book the £25 Fresh-Face Assessment. The pull gets firmer as the series goes on, but it never uses pressure (see section 7).

The sequence stops early if she books, unsubscribes, or her address bounces.

---

## 2. Recommendation

**Build it as a small PHP service on PureMed's existing Cloudways app, run by Cloudways cron, sending through PureMed's own mailbox over SMTP.**

The extra cost is nothing: Cloudways and the mailbox are already paid for. It adds no new vendor, and it runs on the same server as the site that collects the leads.

### Why this and not the alternatives

| Option | Verdict |
|---|---|
| **Cloudways PHP + MySQL + cron** (recommended) | Cloudways apps run PHP and MySQL, and the panel has cron built in. No new infrastructure, and it's already covered by Cloudways backups. The site stays static and only the form endpoint is dynamic. |
| The Pi (next to Stage) | No. It runs on a home connection with a residential IP, and its uptime is whatever the house's is. A live clinic's lead pipeline should not depend on it. |
| Self-hosted n8n | Works, but it adds a Node runtime, a database and upgrades to look after, all for one six-step linear sequence. Worth it only if PureMed ends up with many flows. |
| Cloudflare Workers + D1 | Free, but DNS would have to move to Cloudflare, and Workers have no simple free way to send mail now. More moving parts than the Cloudways route. |
| Brevo / MailerLite free tiers | These are the honest fallback if deliverability from the clinic mailbox turns out poor. Free up to roughly 300 emails a day or 1,000 contacts. They are third-party, though, and the free tiers add their own branding. Keep them in reserve. |

**The tag model is kept on purpose.** "Tag added" is how CRMs think, and it's the right abstraction. The form adds a tag, and a sequence is bound to a tag. The next lead magnet is then a new tag plus a new sequence config file, with no new code.

---

## 3. Architecture

```
 puremed.uk/guide-opt-in  (Astro, static)
        │  POST first_name, email, consent, age_18, honeypot
        ▼
 /api/optin.php ──────────────────────────────────────────────┐
   1. validate, honeypot, rate limit per IP                    │
   2. upsert contact, record consent (text version, time, IP)  │
   3. add tag "why-do-i-look-tired"                            │
   4. tag trigger → enrol in sequence → write 6 scheduled sends│
   5. send Email 1 inline (don't wait for cron)                │
   6. 303 redirect → /guide-thank-you                          │
        │                                                      │
        ▼                                                      ▼
   MySQL (Cloudways app DB)                     SMTP (PureMed mailbox)
   contacts · tags · enrolments · sends                ▲
        ▲                                              │
        │   every 10 min                               │
 Cloudways cron → worker.php                           │
        │   1. check care@ for new booking emails (IMAP, read-only)
        │      → matched lead: stop sequence, reason "booked"
        │   2. due sends ──render─────────────────────►send
        │   (lock, batch ≤ 20, retry with backoff, quiet hours)
        │
 /api/unsubscribe.php?t=…   → stop all, one-click (RFC 8058)
 /api/booked.php?t=…        → manual stop (signed link, fallback only)
 Daily digest to clinic     → new sign-ups, auto-stopped bookings,
                              unmatched bookings to confirm by hand
```

### Where the code lives

- PHP endpoints go in the Astro project's `public/api/`. They then deploy with the site on every run of the existing GitHub Actions workflow. **This is a known trap:** the deploy uses rsync, and if it runs with `--delete`, any PHP dropped onto the server by hand would be wiped on the next deploy. Keeping the PHP in the repo avoids that.
- Secrets (SMTP password, DB credentials, token signing key) go in `private/config.php`, **outside the webroot**, created once over SFTP and never committed. This follows the same rule the old `mss-contact.php` followed.
- Templates and sequence definitions sit in the repo next to the PHP. They are plain files, reviewed through PRs like any other copy change.

### Data model

```
contacts     id, email (unique), first_name, status (active|unsubscribed|bounced),
             consent_at, consent_version, consent_ip, age_confirmed,
             token (random, for unsubscribe/booked links), created_at

contact_tags contact_id, tag, added_at            (unique contact_id+tag)

enrolments   id, contact_id, sequence, enrolled_at,
             status (active|completed|stopped), stop_reason (booked|unsubscribed|bounced|manual)

sends        id, enrolment_id, step, due_at, sent_at,
             status (pending|sent|failed|skipped), attempts, last_error, message_id

booking_emails uidvalidity, uid (unique pair), received_at, parsed_email, parsed_name,
             service, appointment_at, is_cancellation, parse_method (regex|ai|failed),
             matched_contact_id, outcome (stopped|possible_match|no_match|unparsed)
```

### Sequence definition (config, not code)

```php
// sequences/why-do-i-look-tired.php
return [
  'trigger_tag' => 'why-do-i-look-tired',
  'steps' => [
    ['step' => 1, 'day' => 0, 'template' => '01-guide',          'send_now' => true],
    ['step' => 2, 'day' => 1, 'template' => '02-why-tired'],
    ['step' => 3, 'day' => 3, 'template' => '03-not-more-filler'],
    ['step' => 4, 'day' => 5, 'template' => '04-assessment'],
    ['step' => 5, 'day' => 7, 'template' => '05-reassurance'],
    ['step' => 6, 'day' => 9, 'template' => '06-final-reminder'],
  ],
];
```

`day` counts from opt-in, so the gaps are 1, 2, 2, 2 and 2 days as specified. Each template is an HTML file plus a plain-text file with merge fields: `{{first_name}}`, `{{guide_url}}`, `{{booking_url}}`, `{{unsubscribe_url}}`.

### Worker rules

- **Quiet hours:** a send that falls due between 20:00 and 08:00 UK time is held until 09:00. Nobody gets a clinic email at 2am just because she signed up at 2am. Email 1 is the exception and always goes out immediately.
- **Checks at send time, not only at enrolment:** before each send, re-check that the contact is still active and the enrolment is still active. Stopping is then just a status change.
- **Locking:** the worker claims rows with `UPDATE … SET status='sending' WHERE status='pending' AND due_at<=NOW() LIMIT 20` and then processes only its own claimed rows, so two overlapping cron runs can't double-send.
- **Retries:** up to 3 attempts, 30 minutes apart. A hard bounce or a 5xx SMTP rejection marks the contact `bounced` and stops everything.
- **Re-submission:** if the same email opts in again while enrolled, resend the guide only. If they finished or were stopped more than 90 days ago, re-enrol them. If they unsubscribed, resend the guide only (it's a transactional request) and do not re-enrol.

### Knowing she has booked

Every booking already sends a notification email to `care@puremed.uk`. That inbox is the booking signal, so there's no booking-system integration to build.

**How it works**

1. **Filter in the mailbox (one-off setup).** A mail rule on `care@` puts booking notifications into their own folder or label, e.g. `Bookings/Auto`, matched on the booking system's sender address and subject. Everything else in `care@` is untouched.
2. **The worker reads only that folder.** At the start of every cron run, before any sends, `worker.php` connects over IMAP, opens `Bookings/Auto` only, and fetches messages it hasn't processed yet. It uses `BODY.PEEK`, so nothing is marked as read and staff see the inbox exactly as before. It tracks processed messages by their IMAP UID and folder UIDVALIDITY in a small `booking_emails` table.
3. **Parse.** It pulls out the patient's email, name, the service booked and the appointment time. Booking systems send a fixed template, so a template parser (regex against known fields) is the primary route: it's deterministic, testable and free.
4. **Match and stop.**
   - The email matches a lead exactly (case-insensitive) → stop the enrolment with reason `booked`. This covers any booking, not only the £25 assessment: a woman who booked a treatment directly shouldn't be asked to book an assessment either.
   - No email match but the name matches an active lead → **don't auto-stop.** It goes into the daily digest as "Possible match: booked as jane.doe@work.com, lead is jane@gmail.com. [Mark booked]". A wrong auto-stop silently loses a lead, so a person confirms this one.
   - No match at all → ignore it. That's an existing patient or a booking from another source.
5. **Cancellations** are logged and shown in the digest, but the sequence is **not** restarted. Someone who booked and cancelled needs a personal follow-up from the clinic, not Email 4.

**Timing.** Checking bookings at the start of each run, before sending, means the worst case is a booking made in the 10 minutes before a send. In that window one more email can go out. That's acceptable. Quiet hours make it rarer, because most sends happen at 09:00.

**Where AI fits here.** If `care@` gets notifications in more than one format (two booking tools, or staff forwarding bookings by hand), the regex parser will miss some. Anything the parser can't read goes to a small Claude model. It returns structured fields (`email`, `name`, `service`, `appointment_at`, `is_cancellation`) or "not a booking". Its output feeds the same matching rules above, so AI never stops a sequence on a fuzzy match. It costs pennies a month at clinic volumes. Build the regex parser first and add this only if unparsed notifications actually show up in the digest.

**Access to `care@`: flagging this honestly.** IMAP needs a credential for that mailbox, and `care@` will hold patient correspondence. Keep the exposure small:
- Google Workspace: an app password, stored in `private/config.php` outside the webroot. Microsoft 365: IMAP basic auth is off in most tenants, so this needs an app registration with OAuth instead (more setup, same result).
- The code opens one folder, read-only (`EXAMINE`, not `SELECT`), and never deletes, moves or flags anything.
- It stores only the parsed fields, never the email body.
- If the clinic isn't comfortable giving the server `care@` access, the alternative is a mail rule that forwards booking notifications to a separate mailbox the worker owns. That is cleaner on access, but it may cost one mailbox licence.

**Manual fallback stays.** The signed **Mark booked** link in the digest still exists for phone and walk-in bookings, which never generate an email.

---

## 4. Sending and deliverability

- **Send through PureMed's own mailbox over SMTP**, using PHPMailer (free, the standard choice). Send from a named person, e.g. "Dr X at PureMed". A named sender gets far better engagement than `noreply@`, and replies go to a real inbox.
  - Google Workspace: use an app password on a dedicated mailbox. The daily limit is about 2,000, far above this volume.
  - Microsoft 365: check first that SMTP AUTH is still allowed on the tenant, because Microsoft has been retiring basic-auth SMTP. If it's blocked, sending needs OAuth, or this is where the Brevo fallback comes in.
- **DNS on puremed.uk:** SPF including the mail provider, DKIM signing on, and DMARC at `p=none` at first, tightening to `quarantine` once reports come back clean. Without all three, Gmail will junk these.
- **Headers on every email from 2 to 6:** `List-Unsubscribe` (both mailto and https) plus `List-Unsubscribe-Post: List-Unsubscribe=One-Click`, and a visible unsubscribe link in the footer.
- **Guide as a link, not an attachment.** Host the PDF at an unlisted URL on the site. Attachments hurt inbox placement, and a link also shows whether she opened it.
- **Light HTML:** one column, mostly text, one button, a real plain-text part. These should read like a letter from the clinic, not a newsletter.
- **No open-tracking pixel in v1.** Apple Mail Privacy Protection makes open rates meaningless anyway. Track booking-link clicks through the token instead: that's the only number that matters here.

---

## 5. Where AI earns its place

**At authoring time, yes. At send time, no.**

- **Drafting the six emails:** Claude drafts against PureMed's tone of voice file and the guide's content. A clinician then reviews every claim before anything ships. The approved text is frozen into the templates. This is where AI saves real time.
- **Why not generate or personalise at send time:** this is regulated aesthetic-medicine content. Every word a prospective patient receives has to be something a clinician approved. Copy generated at runtime can't be approved in advance, and it creates advertising-compliance risk for almost no conversion gain in a six-email flow.
- **Optional phase 2: reply triage.** The worker polls the sending mailbox over IMAP. A small Claude model classifies each reply to a sequence email as a question, booking intent, not interested, or an out-of-office. It pauses her sequence on anything but an out-of-office and alerts the clinic. That costs pennies a month and stops the next email landing while a reply sits unanswered. Build it only once there's volume to justify it.

**Optional segmentation without AI:** one optional form question, "What bothers you most?" (under-eyes / dull skin / looking hollow / not sure). Email 2 then leads with the matching section. It's cheap and needs no runtime AI. Treat the answer carefully: it's close to health information, so collect it only if Email 2 actually uses it.

---

## 6. Email briefs

The copy is drafted separately, against PureMed's tone of voice, using the `copywriting` skill. These briefs fix what each email must do.

| # | Subject direction | Must do | CTA |
|---|---|---|---|
| 1 | Your guide: why do I look tired? | Deliver the guide link in the first line. Say what the next few emails will cover, so the rest of the series is expected. | Read the guide |
| 2 | It's usually not just one thing | Walk through the common causes (volume loss, under-eye hollows, skin quality, pigmentation, sleep and lifestyle) and help her recognise her own. Make her think "that's me". | Soft: "An assessment tells you which one it is for you" |
| 3 | Why more filler isn't always the answer | The overfilled look, and treating the wrong cause. Position PureMed as the clinic that assesses before it treats. Builds trust by saying what not to do. | Soft: link to assessment |
| 4 | The £25 Fresh-Face Assessment | Exactly what happens, how long it takes, who she sees, what she leaves with (a plan, not a sales pitch). Whether the £25 comes off treatment, if it does. | Primary: book |
| 5 | "Will I look done?" and other fair questions | Four or five real objections, answered plainly: price, pain, looking natural, being upsold, "I'm not ready for treatment yet". Reassure without promising results. | Primary: book |
| 6 | Last one from me on this | Say honestly that the series is ending. Recap the value in two lines, one invitation, and leave the door open. No invented deadline. | Primary: book |

---

## 7. Compliance: must-haves, not nice-to-haves

- **PECR consent.** A marketing series to an individual needs consent. The form must say plainly that signing up means receiving the guide plus a short email series from PureMed, with the option to unsubscribe at any time. Store the exact wording version, the timestamp and the IP against the contact.
- **18+ confirmation on the form.** Fillers are illegal for under-18s in England (Botulinum Toxin and Cosmetic Fillers (Children) Act 2021). The ASA also bars aesthetic advertising aimed at under-18s. Add a required checkbox, and don't enrol without it.
- **No prescription-only medicines by name.** UK advertising rules ban promoting botulinum toxin to the public. The emails can talk about the assessment, filler, skin treatments and causes, but must never name or imply "Botox" as the answer.
- **No pressure selling.** CAP guidance on cosmetic interventions warns against time-limited offers and urgency. Email 6 is a "final reminder" because the series is ending. It must not pretend a price or slot is expiring.
- **Right to erasure.** A one-line admin script to delete a contact and all their rows. Retention: purge contacts with no booking 12 months after the sequence ends, unless they are still subscribed to something else.
- **Privacy policy:** add a line covering this processing (purpose, retention, the mail provider as processor).

---

## 8. Open questions before build

1. **A sample booking notification email** from `care@` (patient details redacted is fine), plus a cancellation if one exists. The parser is written against these. Also: does every booking notification come from one system and one sender address?
2. **Which mailbox provider does PureMed use:** Google Workspace or Microsoft 365? That decides the SMTP setup and whether there's a Microsoft auth issue.
3. **What does the current form post to?** If it already feeds a CRM or form service, we swap its action to `/api/optin.php` and retire the old path. I couldn't load puremed.uk from this environment to check.
4. **Is the guide PDF final,** and where should it live?
5. **Who is the named sender?**

---

## 9. Build plan

About 2.5 days to a tested v1 (the extra half day is the booking-inbox check), then a week of watching real sends.

1. **DNS and mailboxes:** SPF, DKIM and DMARC, plus the sending mailbox and app password. On `care@`: enable IMAP, create the `Bookings/Auto` rule, and issue the read credential. Send a test to mail-tester.com and Gmail, aiming for a score of 9/10 or better.
2. **Schema and config:** create the MySQL tables, `private/config.php`, and the sequence file.
3. **`optin.php`:** validation, honeypot, per-IP rate limit, consent capture, tag, enrolment, immediate Email 1, redirect.
4. **`worker.php` plus Cloudways cron** every 10 minutes: booking check (IMAP, parser, matching), then sends with locking, quiet hours, retries and bounce handling.
5. **Unsubscribe (one-click), manual Mark booked link, daily digest** (sign-ups, auto-stopped bookings, possible matches to confirm).
6. **Templates:** the six emails, drafted, clinician-approved, then built in HTML and plain text.
7. **Test with time compression:** a `TEST_DAY_SECONDS=60` config flag turns "1 day" into 1 minute. The whole nine-day sequence then runs in about 10 minutes against a seeded test address. Check the order, the stop-on-unsubscribe, and the stop-on-booked: drop a copy of the sample booking email into `Bookings/Auto` mid-sequence and confirm the next send is skipped.
8. **Form change on the Astro page:** post to `/api/optin.php`, add the consent and 18+ lines, and add a thank-you page. Ship through the normal PR, staging, production path.
9. **First week:** read the `sends` table daily to check for failures and delays, and check that the digest arrives.
