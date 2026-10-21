# Build spec: booking and Stripe deposits

*Build spec, v0.1, 18 October 2026. **Status 21 Oct 2026:** slices 1 to 3 built on branch `booking-slice-1` (worktree
`.worktrees/sp-booking-1`), not pushed; next is slice 4, blocked on B1 (Osman). Implements requirements BKG-001 to BKG-012 and PAY-001 to PAY-005
(`requirements-register.py`) and `booking-engine/booking-engine-plan.md` §3 to §9 inside the live platform, per D3
(customer records and bookings in house, Faces replaced). Parent canon: `platform-design.md`. Repo:
`~/workspace/studio-platform`, built in the sandbox first (SOP-PLAT-004, tenant Vera, Stripe test mode). Sits beside
`signed-documents-build-spec.md`, which owns every form a patient signs; this spec owns the diary, the booking and the
money.*

## 1. What this builds

1. **A treatment catalogue with rules**: duration, buffers, price, deposit, cancellation policy and what each
   treatment requires before it can be booked, as versioned tenant config with a stable id on every rule.
2. **Availability** as a pure function over practitioners' working patterns, exceptions and existing bookings.
3. **The diary in the console**: day and week by practitioner, staff bookings, attended, no-show, cancel with reason.
4. **Online booking** for patients, deep-linkable per treatment from puremed.uk, campaigns and emails, with a
   deposit taken by Stripe.
5. **Self-serve manage**: cancel or move a booking from a link in the confirmation, inside the policy.
6. **Booking messages** from care@: confirmation, reminder, change, cancellation.
7. **The clinic's Google Calendar** gets every booking written to it; the platform becomes its only writer.
8. **Cutover from Faces**: the forward diary moved appointment by appointment, Faces closed to new bookings, then
   the final Faces catch-up and switch-off.

The platform gives no tax or legal advice. Prices, deposits and policies are the clinic's.

## 2. Decisions this spec rests on

| Id | Decision | Who, when |
|---|---|---|
| D3 | Customer records and bookings in house; Faces replaced, not integrated (BKG-008) | Osman, 26 Sep 2026 |
| P1 | Determinism as booking-engine §2: every requirement traces to a rule row, availability is pure, state changes only through events, no LLM in the decision path | booking-engine plan |
| P2 | Stripe first, Payment Intents with Stripe's own payment form, so card details never reach the platform (PCI SAQ A) | booking-engine §9.2 |
| P3 | Faces is switched off once booking, payments and signed documents have replaced it; 30 Nov is only the data-file backstop | Osman, 18 Oct 2026 |
| P4 | Build and test in the local sandbox (Vera, `sk_test_` keys only) before anything reaches PureMed | Osman, 2 Oct 2026 (v0.11) |

Open decisions are in section 13.

## 3. What exists to build on, and what doesn't

**In studio-platform:** people and identifiers (`findOrCreateByEmail`); the append-only event log (`appendEvent`);
config as files published into immutable config versions (`activeConfig`); a treatment list per tenant
(`tenants/*/treatments.json`, keys and names only); care@ sending through Gmail (scope `gmail.send` only, no calendar);
workflows with stop checks, including "stopped because they booked"; `care_record` (Record treatment); the legacy
import, which holds Faces and Acuity appointment history (migration 011); the sandbox guard that refuses a live Stripe
key (`service/src/lib/sandbox.ts`); optional DPIA questions B8.5 to B8.10 on booking and Stripe, answered or not.

**In booking-engine (not live, ported where it is sound):** the availability function (`domain/availability.ts`),
deposit arithmetic (`domain/payment.ts`), cancellation and refund policy (`domain/self-serve-policy.ts`), the Stripe
client and webhook signature check (`payments/`), the exclusion constraint against double booking, and the concurrent
commit test (`test/paid-booking.test.ts`). The patient journey's look and order from the booking prototype and its
15 Aug UX review (`02_clients/puremed/booking-journey-ux-review-2026-08-15.md`, `web/book-laser-facelift.html`).

**Not ported, because the 18 Aug determinism review failed them** (`booking-engine/determinism-review-2026-08-18.md`),
and designed out here: no event log (the spine has one); bookings that snapshot nothing (section 4); a mutable service
row (the catalogue is versioned config); `active` flags never read; a £0 booking recorded as a Stripe capture; a
refund whose amount and actor the caller asserts; journey order enforced only by the front end.

**Doesn't exist anywhere:** a forward diary, practitioners and working patterns, a patient-facing booking page on the
platform, Stripe on the platform, calendar access.

## 4. Data model (one migration, the next free number after signed documents' 013)

The **catalogue lives in tenant config**, not in tables: `treatments.json` grows into the catalogue (section 5), and
`rules/booking.json` holds the rule table. Both are published as a config version like everything else, so a price
change is a new version and every booking can point at the version it was made under. The console edits them and
publishes, the same way Nafisa's emails work.

| Table | Holds | Rules |
|---|---|---|
| ~~`practitioner`, `working_pattern`~~ | **Config, not tables (slice 1, 20 Oct 2026):** practitioners and their working hours live in `tenants/<slug>/booking.json` with the rule table, so every booking points at the config version whose hours applied, and a change is a new version like a price change | |
| `diary_exception` | per practitioner: closed or extra time, start, end, reason | holidays, training |
| `booking` | person, treatment key, practitioner, location, `tstzrange` start to end, status (`held`, `confirmed`, `attended`, `no_show`, `cancelled`), source (`online`, `staff`, `faces`), config version id, **snapshot** (price, deposit, policy, rule ids fired, documents required, as they were), cancellation reason and actor | exclusion constraint: no two `held` or `confirmed` bookings overlap for one practitioner; a hold expires after 10 minutes |
| `payment` | booking, kind (`deposit`, `fee`, `refund`), amount in pence, currency, Stripe payment intent or refund id, status mirrored from Stripe, rule id that set the amount, actor | never `captured` without a Stripe id; a £0 deposit writes no payment row at all |
| `stripe_event` | tenant, Stripe event id (unique), type, received at, processed at, outcome | idempotency for webhooks; tenant id and row-level security (the booking engine's version had neither) |
| `booking_link` | booking, token hash, purpose (`manage`), expires at, used at | self-serve cancel and move; one-use for each action |

Every table is tenant-locked with row-level security. Every state change writes an event (`booking.held`,
`booking.confirmed`, `booking.moved`, `booking.cancelled`, `booking.attended`, `booking.no_show`, `payment.succeeded`,
`payment.failed`, `payment.refunded`, `payment.disputed`) with actor, cause and the rule ids involved.
`person_facts` gains next booking and last attended from those events (PPL-005).

**Snapshot, don't reference** (booking-engine §4): a booking made in October still shows and proves October's price,
deposit, policy and requirements after the clinic changes them in November.

## 5. The catalogue and the rule table

Per treatment, in `treatments.json`: key and name (as now), duration, buffer before and after, minimum notice,
furthest bookable ahead, price, VAT treatment (section 13, B8), deposit (`none`, fixed pence, percent, full),
practitioners who deliver it, public (bookable online) or staff only, the Faces treatment ids it replaces (for the
cutover, section 10), and the puremed.uk deep link key.

`rules/booking.json`, one row per rule, each with a stable id that is stored on every booking it fires for:

```
REQ-001  treatment = anti-wrinkle            -> require a consultation attended within 12 months
REQ-002  treatment in injectables            -> require medical history (signed documents module)
REQ-003  any treatment                       -> age 18 or over (asked at booking)
DEP-001  treatment = laser-lift              -> deposit £50
DEP-002  person has 2 late cancellations     -> full prepayment (PAY-003)
CXL-001  cancelled 48 hours or more ahead    -> deposit refunded in full
CXL-002  cancelled under 48 hours ahead      -> deposit kept
NSF-001  no-show                             -> deposit kept; fee only if a card is kept (B8.8)
```

The numbers above are placeholders to show the shape; every value comes from Nafisa (section 13). Rules are
evaluated by a pure function of (config version, treatment, person's booking history, now passed in), which returns
the requirements, the deposit and the rule ids. Staff bookings go through the same function (BKG-003); staff can
override a requirement only with a reason, recorded as an event naming the rule overridden. **Super user (Nafisa,
20 Oct):** the owner can override any booking rule herself (days, hours, slots, buffers, deposits, requirements),
always with a reason and an event; no call to MSS needed. Example: online toxin booking only on the prescriber's
day (Wednesday); Nafisa books a returning client on a Friday.

## 6. Availability

Ported from booking-engine §7.3, pure: working patterns, minus exceptions, minus held and confirmed bookings with
their buffers, minus minimum notice from `now` (passed in), beyond the furthest bookable date, for practitioners who
deliver the treatment, sliced on a fixed 15-minute grid, in Europe/London, stored in UTC. Clock-change days (29 Mar,
25 Oct) are explicit test cases. A practitioner or treatment set inactive is never offered (the booking engine read
neither flag).

Version 1 does not read the practitioners' own calendars for busy time: the diary in the platform is the truth and
staff block time in it. Reading Google free/busy is a later slice if the clinic wants it (section 13, B11).

## 7. Payments with Stripe

**Account.** The clinic is the merchant: the money goes to PureMed's own Stripe account, and Stripe's fees are the
clinic's. How the platform reaches that account is decision B1 (recommendation: Stripe Connect with a Standard
account, so the clinic owns its account and dashboard, MSS never holds the clinic's secret key, and the second clinic
onboards the same way).

**Taking a deposit.**
1. The patient picks a slot; the platform writes a `held` booking (10 minutes) and creates a Payment Intent for the
   deposit the rules set, with the hold id as Stripe's idempotency key and the booking id in its metadata.
2. Stripe's Payment Element takes the card, Apple Pay or Google Pay (PAY-001) and handles 3D Secure on the page.
3. The webhook `payment_intent.succeeded`, signature checked and deduplicated through `stripe_event`, confirms the
   booking in one transaction. The browser's own "it worked" is shown but never trusted to confirm.
4. If the hold expired and the slot was taken in the meantime, the exclusion constraint refuses the confirm, the
   payment is refunded at once, the patient is told, and staff get a task. Nobody is charged for a slot they don't get.

Deposits are **taken**, not held: a card authorisation lapses after about 7 days, and most bookings are further ahead.

**Keeping a card for no-show fees** is built only if the clinic chooses it (DPIA B8.8). Then the booking saves the
card with Stripe for later use, the patient ticks a policy clause that states the fee, and the tick is a signed
policy acknowledgement in the signed documents module. A fee is charged only by staff, from the diary, for a booking
marked no-show, for the amount the rule sets, never typed in.

**Refunds** (PAY-005) are worked out from the policy rule against the time of cancelling, bounded by what was taken,
and done by a signed-in staff member (the actor comes from the session, never from the request). A staff refund
outside the policy needs a reason. Partial refunds are refunds of a set amount, not a percentage typed in.

**Mirroring** (PAY-002): payment state comes only from Stripe's events. A nightly job compares every payment from the
last 35 days with Stripe and opens a task for any difference; it never corrects silently. Disputes open a task.

**Money from before.** Deposits paid through Faces for bookings moved at cutover are recorded as `paid in Faces`
with the amount the clinic confirms, no Stripe id, and are refunded through Faces' processor if the booking is
cancelled. The balance on the day is taken on the clinic's card terminal as now; staff can mark it paid (no amount
taken by the platform) so reporting sees revenue (PAY-004).

## 8. The patient journey and the console

**Public booking page** at `app.puremed.uk/book` (decision B9), deep-linkable as `/book/<treatment key>` (BKG-004).
The order is enforced by the server, not the page: treatment, the questions the rules ask (age, consultation, medical
history through signed documents), slot, name, email and mobile (matched to the person record, never a second
person), policy clauses, deposit, confirmation. Nothing is committed before the deposit succeeds. It follows the
booking prototype's look and the 15 Aug UX review (deep link skips the picker; a bare open shows consultations first).
PureMed's brand, phone width first, no third-party scripts but Stripe's.

On cutover day every "Book" link on puremed.uk (now Faces `treatmentId` links, mapping in
`02_clients/puremed/CLAUDE.md`) moves to `/book/<treatment key>`; the catalogue holds the Faces id each key replaces.

**Console:**
- **Diary**: day and week by practitioner (BKG-005). Book for someone (same rules, BKG-003), move, cancel with a
  reason, mark attended or no-show (BKG-007), charge a no-show fee where allowed, refund.
- **Person page**: bookings past and future, payments, and the booking events on the timeline.
- **Settings, Treatments**: catalogue and rules; **Settings, Diary**: practitioners, working patterns, exceptions;
  **Settings, Payments**: connect Stripe, see its state.
- **Today**: the existing figures gain real bookings and diary fill (no more "bookings" from elsewhere).

**Workflows.** `booking.confirmed` stops the guide series ("they booked"), and `booking.attended` and
`booking.no_show` are triggers for recall and no-show workflows from the template library.

## 9. Messages and the calendar

**Messages** from care@ through the existing Gmail sending: confirmation (with the manage link and, if needed, the
signing link), reminders 7 days and 48 hours before (always sent; while forms are unsigned they carry the forms
link, signed documents spec section 4), moved, cancelled, deposit refunded. They are service messages, not marketing
(DPIA B8.5): sent regardless of marketing consent, never to a suppressed address, never carrying marketing content.
Whether they name the treatment is the clinic's B8.6 answer, held as a tenant setting. Nafisa approves each template
in the console, as with campaign emails.

**Calendar** (BKG-006, BKG-012): every confirmed booking is written to the clinic's Google Calendar as an event with
a link back to the booking, and changed or removed with it. Deleting it in Google changes nothing in the platform.
This needs the `calendar.events` scope added to care@'s Google connection, a reconnect in Settings, and a DPIA
footprint change (the calendar shows names and, if B8.6 allows, treatments). On cutover day the platform becomes the
calendar's only writer: Faces' own sync and the inbox automation that writes to it are switched off the same day.

## 10. Cutover from Faces

The order matters, because the final Faces catch-up must run after the last visit recorded in Faces, and the forward
diary must move without losing or doubling a booking (BKG-011).

1. **Ready:** slices 1 to 7 done and reviewed; signed documents live for at least the first treatment; DPIA B8 answers
   on record and signed; Nafisa has run the whole journey on the sandbox and on PureMed with a test person.
2. **Cutover day (D9), morning:** Faces closed to new bookings (online link off; staff stop booking there).
   puremed.uk's book links switch to the platform. The platform's diary is open.
3. **Forward diary read:** every Faces booking from cutover day on, read once by the Faces extraction tool in a new
   mode (the Upcoming tab; today it reads only Previous) into `~/puremed-data`, with the same no-AI-reads rule. Faces
   bookings made after the 13 Oct capture are read by nothing today, so this is their only route in.
4. **Forward diary import:** each becomes a platform booking (`source: faces`, deposit `paid in Faces` where Faces
   shows one), matched to its person through the reconciliation key; any that can't be placed (person unmatched,
   practitioner or treatment unmapped, slot clash) goes to a review list the clinic settles by hand before its date.
   Counts are checked appointment by appointment both ways (Faces count = imported + reviewed).
5. **Calendar:** Faces' sync and the inbox automation off; the platform writes the forward diary into Google Calendar.
6. **Last Faces visits:** visits up to cutover day finish in Faces. Then the final catch-up runs
   (SOP-PUREMED-005, after the fixes in `02_clients/puremed/clinical-platform/faces-catch-up-determinism-review-2026-10-18.md`;
   its `--as-of` date is cutover day, so captured Upcoming bookings split cleanly into happened, moved by step 4, and
   did not happen).
7. **Switch-off:** Faces account closed once the catch-up import is verified and the PDFs and photos it holds are
   saved (extraction plan section 7).

## 11. Slices, in build order

1. **Catalogue and diary config** (**started 20 Oct 2026**, branch `booking-slice-1`, worktree `.worktrees/sp-booking-1`, not pushed: catalogue fields on `treatments.json`, `booking.json` with practitioners, hours and rules, publish validation, the pure evaluator `src/modules/booking/rules.ts` with owner overrides (super user) and a never-overridable age rule, 18 tests on Vera, draft `service/rule-trace.json` for Osman to ratify, `make trace` 0 fail 4 warn. Console **Settings, Booking** built the same day (880107b): owner edits treatments, practitioners with weekly hours, and rules; each save publishes a config version and logs `booking.settings_changed`; editors view only; rule ids never reused; 16 HTTP tests, 390 and 1440 checked. **Still to do:** Osman ratifies `rule-trace.json`; merge and ship; PureMed's values (B3 to B5, B10)): `treatments.json` schema, `rules/booking.json`, practitioners, working patterns,
   exceptions, console Settings to edit and publish; the rule evaluator as a pure function with tests. Write and
   ratify a `rule-trace.json` for studio-platform here, so `make trace` can check every later slice.
2. **Availability and the staff diary** (**built 20 Oct 2026** on `booking-slice-1` in `.worktrees/sp-booking-1`,
   uncommitted at close of build, not pushed): the pure availability function, day and week views, staff booking with no
   payment, move, cancel, attended, no-show; events and `person_facts`.
   What landed: `src/modules/booking/availability.ts` (pure: weekly hours plus open exceptions minus closed ones, buffers,
   the 15-minute grid from local midnight, notice, horizon, allowed-days rules, inactive practitioners never offered;
   `slotProblems` explains a refused start with a traceable id), `diary.ts` (book, move, cancel, outcome, time off; an
   override is an event naming the rule; a per-practitioner advisory lock, now alongside slice 3's exclusion constraint),
   `facts.ts` (next booking, last visit, folded from booking events, computed on read: no table), migration
   `014_booking.sql` (`booking`, `diary_exception`; 013 left for signed documents), console **Diary** (nav item once
   practitioners exist), book, booking page, time off, and bookings on the person page; `npm run sandbox:diary`.
   Tests: 31 availability (both clock-change days), 25 diary over the database and HTTP; full suite 328 pass
   (`consultation.test.ts` can't load from a worktree: it reads the PureMed site by a relative path). `make trace` on the
   draft contract, now covering slices 1 and 2: 0 fail, 4 warn. Checked at 390 and 1440 on the Vera sandbox.
   **Calls made here, for Osman to confirm:** (a) buffers keep appointments apart but needn't fit inside working hours;
   (b) the owner can book over hours, a closed exception, a buffer or the grid with a reason; nobody can book over another
   appointment, an inactive practitioner or one who doesn't deliver the treatment; editors override only rules marked
   staff-overridable; (c) a late cancellation is one the client asked for, at a notice whose policy row refunds under
   100%; it is counted all-time, because the rule table has no window (B5 suggests 12 months: add a field if wanted);
   (d) attended and no-show can only be marked once the start time has passed, and can't be undone yet; (e) moving
   re-runs the rules at the new time (so an earlier override must be given again), keeps price, deposit and policy;
   (f) "seen before" counts attended bookings and recorded treatments, not Faces or Acuity history (staff override).
   **Before it ships:** `platform-facts.json` and the DPIA footprint don't yet describe `booking` and `diary_exception`
   (slice 9, but rule 4 of the repo says re-read at a new migration); PureMed's workflow files still stop series only on
   `booking.created` and `booking.recorded_manually` (Vera's now include `booking.confirmed`, as do campaign results);
   min notice applies to staff bookings too, so the desk can't book a same-day consultation without the owner.
3. **Holds and commit**: `held` bookings, expiry, the exclusion constraint, the concurrent-commit test ported.
   (**Built 20 Oct 2026** on `booking-slice-1`, uncommitted at close of build, not pushed.) What landed: folded into
   migration `014_booking.sql` (still one booking migration, never shipped): `btree_gist`, `hold_expires_at`, a generated
   `during tstzrange` (start inclusive, end exclusive), status `expired`, and `booking_no_overlap`, an exclusion
   constraint so no two `held` or `confirmed` bookings overlap for one practitioner. `diary.ts`: `holdSlot` (online rules,
   nothing overridable, lapses after the config's `hold_minutes`, event `booking.held` naming `booking.hold_minutes`),
   `confirmHold` (the payment's step 3; safe to call twice; a payment after the hold lapsed confirms only if no booking or
   buffer has taken the time since, otherwise `booking.confirm_refused` and `slot_taken` for slice 4 to refund),
   `releaseHold`, and `expireHolds`, run by the worker each pass (`booking.hold_expired`). Booking or moving for a
   practitioner expires that practitioner's lapsed holds first, in the same transaction. Availability ignores a hold
   past its expiry before the sweep. The console shows "Held, paying" and "Hold lapsed". Tests: 15 in
   `test/booking-holds.test.ts`, including two patients holding one slot at once, a patient and the desk at once, two raw
   overlapping inserts in concurrent transactions (the database refuses the second with no booking code involved), a
   hold that lapses mid-payment with the slot free and with it taken, and a buffer taken after the lapse. Full suite 343
   pass. `make trace`: 0 fail, 4 warn (unchanged), with a `holds` decision area. The shared sandbox's existing 014 was
   altered by hand to match (the constraint went on cleanly over the 41 seeded bookings).
   **Calls made here, for Osman to confirm:** (g) a sixth status, `expired`, for a hold that ended unpaid (lapsed or given
   up), so it is never confused with a cancellation; (h) the constraint covers the appointment itself, not its buffers,
   because the owner can book into a buffer with a reason; buffers stay the code's job, so the per-practitioner lock
   stays alongside the constraint; (i) a late payment for a lapsed hold still confirms if the time is free, even if hours
   or rules changed in the ten minutes; (j) the hold length comes from `booking.json` `hold_minutes` (10 on Vera), not a
   constant.
4. **Stripe in the sandbox**: connect (B1), Payment Intents, the Payment Element, webhooks into `stripe_event`,
   refunds from policy, the nightly comparison; Stripe test cards including a 3D Secure one and a decline.
5. **Public booking page and self-serve manage**: the journey in section 8, the manage link, the requirement checks
   on the server.
6. **Messages and calendar**: booking templates, reminders as scheduled actions, the Google Calendar writer.
7. **No-show fees with a kept card**: only if B8.8 says so.
8. **Forward diary**: the extraction tool's Upcoming mode, the import with its review list and count check, a
   rehearsal on a copy in the sandbox (made-up rows only).
9. **Data protection**: platform facts (Stripe as a recipient, the calendar, booking and payment tables), retention
   from B8.9 and B8.10 with an expiry job, erasure (a booking with a payment is kept for the payment record's period
   and its person made inactive, as for old notes), `service/data-protection.json`, and SOP-PLAT-007 (booking and
   payments), SOP-PLAT-008 (cutover).

## 12. Before it is called done

- `npm test` covering every slice on made-up people, including clock-change days, a hold that expires mid-payment,
  two patients paying for one slot at once, a webhook delivered twice and out of order, and a refund under each rule.
- Determinism review with `make trace` on the ratified contract: requirements, deposit, refund and availability each
  traced to rule ids and snapshotted on the booking.
- Data-protection review (`make datamap`), with Stripe's role and transfer answered (B8.7).
- Design review of the booking page at 390, 768 and 1440, and of the diary.
- Figures review of anything the console reports as money.
- Stripe test mode end to end in the sandbox, then one real low-value booking on PureMed refunded the same day.
- Nafisa approves prices, deposits, policies, clauses and message wording, and signs the DPIA with B8 answered.

## 13. Open decisions

| Id | Question | Recommendation | Who |
|---|---|---|---|
| B1 | How the platform reaches PureMed's Stripe | Stripe Connect, Standard account: the clinic owns it, no secret keys held, repeatable for the next clinic. Fallback: PureMed's restricted key stored encrypted like the Gmail token | Osman |
| B2 | Deposit at booking only, or also keep the card for no-show fees (DPIA B8.8) | Deposit only to start; add the kept card if no-shows stay a problem | Nafisa |
| B3 | Deposit per treatment, and whether consultations take one | From Nafisa's current Faces settings, unchanged at cutover | Nafisa |
| B4 | Cancellation window and refund rule | Keep Faces' current policy at cutover; change later as a new config version | Nafisa |
| B5 | Late cancellation and no-show: what is kept or charged; the PAY-003 escalation | Deposit kept; full prepayment after two late cancellations in 12 months | Nafisa |
| B6 | Do booking messages name the treatment (DPIA B8.6) | Keep it general | Nafisa, adviser |
| B7 | How long booking and payment records are kept (B8.9, B8.10) | Bookings with the clinical records; payments 6 years for the accounts | Nafisa, accountant |
| B8 | VAT on treatments (booking-engine §9.1) | The accountant's answer, set per treatment | Nafisa, accountant |
| B9 | Where the booking page lives | `app.puremed.uk/book` first (no change to the static site's hosting); an embed on puremed.uk later | Osman |
| B10 | Who is bookable, rooms, and whether toxin needs a prescriber's time alongside (BKG-009) | **Decided 20 Oct (Nafisa):** no prescriber time reserved; online toxin only on his day (Wednesday); other days by super user override | Nafisa |
| B11 | Read practitioners' Google free/busy into availability | Not in v1; the platform diary is the truth | Osman |
| B12 | Cutover date (D9) | **Decided 18 Oct 2026: about 31 Dec 2026** (Osman). Later than the 30 Nov backstop on the Faces data files (extraction plan section 7), which the catch-up needs; that backstop has to move first | Osman, Nafisa |

## 14. What this does not do

No packages, courses or memberships; no gift cards; no waitlist (BKG-010, later); no taking the balance through the
platform; no patient accounts or logins; no second payment provider; no reading of practitioners' private calendars;
no clinical records beyond the signed documents module and the existing Record treatment.

## Resume prompt

Booking slice 4. In `~/workspace/.worktrees/sp-booking-1`, read this spec's sections 7 and 11 and get B1 from Osman
(Stripe Connect Standard recommended), then build Stripe in the sandbox on top of `holdSlot` and `confirmHold`. Before
that, or alongside: Osman confirms calls (a) to (j) in section 11 and ratifies `service/rule-trace.json`; before
shipping, re-read `platform-facts.json` for migration 014 and add `booking.confirmed` to PureMed's workflows.
