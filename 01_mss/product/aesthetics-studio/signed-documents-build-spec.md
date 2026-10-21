# Build spec: signed clinical documents (treatment forms, medical history, sign-offs)

*Build spec, v0.2, 20 October 2026 (v0.1 on 14 Oct). Nothing built. Implements `booking-engine/booking-engine-plan.md`
§8 (templates, in-flight signature, evidence, rendering) and the clinical platform's S4 requirements
(`02_clients/puremed/clinical-platform/requirements-register.md` CONS-001 to CONS-009) inside the live platform.
Parent canon: `platform-design.md`. Sister spec: `booking-payments-build-spec.md` (same cutover). Repo:
`~/workspace/studio-platform`. Client-facing call notes and action list:
`02_clients/puremed/clinical-platform/signed-documents-call-notes-2026-10-20.md`.*

## v0.2 change note: what the discovery call changed

The call with Nafisa (20 Oct 2026, questions in `clinical-platform/signed-documents-discovery-call.md`) changed six
things in v0.1:

1. **One form per treatment, every visit.** Medical history and consent in one form, filled in for every treatment
   visit, replacing Faces' separate medical form plus consent form (which repeat each other). Exception: a **course**
   (chemical peels, for example six sessions two weeks apart) signs once, then each later session is a short
   "nothing has changed / something has changed" confirmation.
2. **The client's own phone is the main way to sign.** The iPad is a backup only, and the clinic has none, so the
   paired-device slice is deferred. In the clinic, a client who hasn't signed does it on their own phone there and
   then (QR code or resent link). A client with no phone signs a printed form, photographed into their record
   (decided 20 Oct, Osman: the easiest contingency to build; handing over the practitioner's phone was dropped).
3. **Reminders matter more than the first send.** Clients ignore the forms link in the booking email, often months
   ahead. Forms go out at booking, then a reminder 7 days before and 48 hours before. The reminders always go
   (they are the appointment reminder too, Osman 20 Oct) and carry the forms link only while forms are unsigned.
   Email from care@ and WhatsApp (WhatsApp setup is parked and has to be restarted).
4. **No treatment-by-treatment switchover.** Everything moves at once at cutover, over the Christmas closure (last
   clinic day Fri 18 Dec 2026, cutover D9 about 31 Dec), with a final Faces catch-up. Signed documents go live with
   booking, not before it. This reverses v0.1's D7 and the 18 Oct "run in parallel first" note.
5. **Everything in Faces is kept:** signed PDFs, clinical photos (the batch label photo included), client notes and
   attachments. Photos make the file store worth having (S1 now recommends option B, below).
6. **Prescriber sign-off is recorded at the true time, by the prescriber.** Which forms need the prescriber, the
   practitioner or both is Nafisa's list to send. See section 7: the platform records the real time of every
   signature and cannot do otherwise.

## 1. What this builds

One module for every document a patient signs, wherever they sign it:

1. **Form templates** the clinic writes and publishes, one per treatment (or per treatment group: toxin one, two
   and three areas share one form). Each holds the shared medical history section, the treatment's own questions,
   consent clauses and the sign-offs it needs. Photography and marketing consent stays a separate template. Versioned,
   locked once published.
2. **Signing requests** tied to an appointment, sent at booking with two reminders, signed on the client's phone.
3. **Signing in the clinic** for anyone who arrives unsigned: QR code on the practitioner's phone for the client's
   own phone; with no phone, a printed form signed on paper and photographed into the record.
4. **Staff sign-offs**: practitioner and prescriber sign in the console with their own logins, at the time.
5. **The signed record**: a PDF rendered on the server, hashed, stored so it can't be changed, with the evidence
   that gives an electronic signature its weight (section 8).
6. **The person page** lists signed documents and attachments; Record treatment says whether this visit's form and
   sign-offs are in place, and offers "Sign now".
7. **Attachments**: a photo or file added to a person or a treatment record (the interim paper prescribing log,
   anything else the clinic photographs), with the upload time recorded.
8. **Faces' records** come in through the legacy import as historical: signed PDFs, form answers, clinical photos,
   client notes and attachments. Never counted as consent for a future treatment.

The platform gives no legal or clinical advice. Form wording is the clinic's.

## 2. Decisions this spec rests on

| Id | Decision | Who, when |
|---|---|---|
| D1 | One module for booking documents, future forms and migrated Faces records | Osman, 14 Oct |
| D3 | Built in the platform, no third-party e-signature service | booking-engine plan §8.2; existing supplier preferred (Osman, 18 Oct) |
| D4 | Faces forms are historical: shown, never counted as consent for a future treatment | DPIA B10.4 wording |
| D10 | One combined form (medical history plus consent) per treatment, filled in every treatment visit | Nafisa, 20 Oct |
| D11 | Consent covers one visit; a course signs once, then a short confirmation per session | Nafisa, 20 Oct |
| D12 | A review (follow-up) visit asks only "has anything changed since your treatment?" | Nafisa, 20 Oct |
| D13 | The client signs on their own device; iPad is a backup only, deferred | Nafisa, 20 Oct |
| D14 | Sent at booking; appointment reminders 7 days and 48 hours before always go, with the forms link while unsigned; email and WhatsApp | Nafisa, 20 Oct; always-send Osman, 20 Oct |
| D2 | Arriving unsigned: the client signs in the clinic there and then; Record treatment warns and offers Sign now, never blocks | Nafisa, 20 Oct |
| D15 | Every form is rewritten by Nafisa, insurer wording included; nothing moves word for word from Faces | Nafisa, 20 Oct |
| D16 | Signed forms kept 11 years (the clinic's general retention); erasure makes the person inactive, records kept | Nafisa, 20 Oct (adviser still to confirm, DPIA) |
| D17 | Faces signed PDFs, photos, client notes and attachments are all saved before switch-off | Nafisa, 20 Oct |
| D18 | Nafisa is a **super user**: she can override any rule herself, with a reason, logged. She can't change signed records, server times or the event log | Nafisa, 20 Oct (WhatsApp) |
| D19 | Prescriber sign-off as today: he pops into the room during the appointment and signs then on his phone; new clients always seen at the time | Nafisa, 20 Oct (WhatsApp) |
| D7 | No partial running: forms go live with booking at cutover over the Christmas closure, then a final catch-up | Nafisa, 20 Oct (supersedes v0.1 D7) |

Still open: section 12.

## 3. What exists to build on, and what doesn't

**Exists:** people and identifiers; staff identity with an owner login and a shared mailbox login that can't sign;
the event log; `care_record` (Record treatment, by `treatment_key`); immutable signed records with a content hash
and a trigger against change (`dp_document`, migration 007); email through care@; the legacy import with its
bundle, manifest and DPIA gate (SOP-PLAT-005); erasure and inactive status (migration 012); the DPIA footprint.

**Doesn't exist yet:** appointments (booking spec, same cutover), file storage, PDF rendering, a patient-facing
page that isn't a form post, scheduled service messages tied to an appointment (booking spec slice 6), WhatsApp
service messages (campaigns spec, parked), staff roles beyond owner (the prescriber needs his own login).

**Naming:** the existing `consent` table is marketing consent. Everything here is a "clinical document" in tables
and code, never "consent".

## 4. The design: how it works for each person

### The client, before the visit

1. Books (or is booked by staff). The confirmation carries "Complete your forms" with their link.
2. Opens the link on their phone. If the record holds a date of birth, they confirm it first; otherwise they enter
   it (it feeds the under-18 check, open item S3).
3. One page per form, in order: **About your health** (the shared medical history, pre-filled from their last
   answers, each section confirmed or changed), **About this treatment** (the treatment's own questions), **Your
   consent** (each clause its own tick), **Photos and marketing** (separate, "saying no doesn't affect your
   treatment"), then **Sign** (drawn, or typed name as the accessible fallback).
4. Done screen, and a copy by email if D8 says so.
5. Appointment reminder 7 days before, then 48 hours before, by WhatsApp and email, whatever the forms' state.
   One message, not two: booking's reminder (booking spec section 9) with a forms block added. Unsigned: "Your
   forms aren't done yet" and the link. Signed: "Your forms are done, thank you". A reminder whose time has
   already passed when the booking is made is skipped.

For a **course session after the first**: one screen, "Since your last session, has anything changed?" with
"Nothing has changed" or "Something has changed" (a box to say what). "Something has changed" opens the full health
section and flags the record for the practitioner. Wording is Nafisa's.

For a **review visit**: the same one-screen check, against the treatment it follows.

### The practitioner, in the clinic

- **Today** view (console, phone width): today's appointments with a form status each: signed, partly done, not
  started, needs sign-off.
- **Arrived unsigned:** on the appointment, "Sign now". Shows a QR code the client scans with their own phone
  (one use, 15 minutes), with "Send to their phone instead" (WhatsApp or email on record).
- **No phone: sign on paper.** "Print form" gives the treatment's current template version as a blank PDF (same
  renderer as signed PDFs, version id printed on it). The client fills it in and signs; the practitioner photographs
  it on the appointment ("Add paper form"). That saves a `clinical_document` with method `paper`, the photo as its
  file, no structured answers, and the upload time from the server. It counts as current for that appointment.
  The paper original is kept by the clinic. Their next form is not pre-filled from it (no structured answers).
- **Something has changed** answers are shown on the appointment before treatment.
- **Record treatment** shows whether this visit's form and every sign-off it needs are in place, and when each was
  signed. Missing ones warn, with Sign now; they never block (D2). The record keeps what was in place at the time.

### The prescriber

- Own login, prescriber role (no access beyond his patients' forms and sign-off).
- **To sign off** list: appointments for prescribed treatments today, the client in the chair now at the top,
  each with the client's form answers and "new client" marked. He opens it when he pops into the room.
- Signs off at the time he sees the client: his assessment notes (if the form asks for them) and signature,
  server-timed. Booking already limits toxin to his clinic days (booking spec), so he is there when it happens.

### The clinic owner

- **Settings, Forms:** write, preview and publish templates; mark which need practitioner and prescriber sign-off;
  set a course (sessions, longest gap between sessions).
- **Person page, Documents:** every signed document, attachment and Faces record, with dates, version and PDF.

## 5. Data model (migration 013)

| Table | Holds | Rules |
|---|---|---|
| `document_template` | key, kind (`treatment_form`, `review_check`, `course_session_check`, `photo_consent`, `policy`), title, treatment keys it covers | |
| `document_template_version` | sections, clauses, questions (each with a stable `question_key` from a shared bank, so health answers carry across forms), sign-offs required (`practitioner`, `prescriber`), course settings, `is_live`, `source` (`platform` / `faces`) | immutable once published; a change is a new version |
| `signing_request` | person, appointment (or treatment key and visit date before booking exists), template versions, channel (`link` / `qr`), token hash, expires at, status, sent by, reminders sent | token hashed, one use; link expires the day after the visit, QR in 15 minutes |
| `clinical_document` | template version, person, request, appointment, signer name, method (`drawn` / `typed` / `paper`), signature, server signed-at, IP and user agent, view time, clause events, answers (structured), `changed_since_last` flag, file key, PDF SHA-256, `source`, `supersedes_id` | immutable (trigger); a correction is a new document that supersedes |
| `document_signoff` | document, role (`practitioner` / `prescriber`), staff id, signed-at (server), notes | immutable; one per role per document |
| `course` | person, treatment key, opening document, sessions allowed, sessions used, longest gap, closed at | a course closes when its sessions are used, the gap is exceeded, or a "something has changed" answer needs a new full form (Nafisa's rule, open item S4) |
| `attachment` | person, optional care record or document, file key, SHA-256, kind (`photo`, `scan`, `file`), uploaded by, uploaded at (server), caption, `source` (`platform` / `faces`) | immutable; never shown at a public URL |

Every table is tenant-locked with row-level security. **What counts as current** (one pure function, tested, in the
rule trace): an appointment is covered when a live `treatment_form` for its treatment key was signed for that
appointment, or an open course for that treatment key has a `course_session_check` signed for it; and every
sign-off its template version requires exists. Faces documents never count.

## 6. Storage and rendering

- **File store (S1).** v0.1 leaned to the database. Faces' photos and attachments, and new attachments, now come
  in, so **option B is recommended: DigitalOcean Spaces in London**, private bucket, versioning on, the app's key
  unable to delete, about $5 a month for 250 GB. Fallback if London isn't offered: files in the London Postgres,
  watching its disk. Either way, read only through the console with an access event, never a public URL.
- **PDF rendering** with `pdf-lib` in the service, not a headless browser (1 GiB container; same input, same bytes,
  so the hash means something). The PDF holds the text as shown, each clause and its tick time, the answers, every
  signature with its signer and server time, and the template version id.

## 7. Sign-off timing and the prescriber

The platform stamps every signature with the server's time, and nothing can change it afterwards. It cannot
backdate a sign-off or make a later one look as if it happened in the chair, and it must not try.

**How it works today (Nafisa, 20 Oct, WhatsApp):** the prescriber pops into the room while the client is there.
New clients are always seen at the time. When he isn't available, Nafisa sometimes treats clients she has seen
before without him, and she books returning clients on a Friday (not his day) when they ask.

**What the platform does:**
- Online toxin booking only on his day (Wednesday). Nafisa can book any day as super user (D18), with a reason.
- No prescriber time is reserved in the diary (booking spec B10): he pops in, opens To sign off, signs on his phone.
- Record treatment shows the prescriber sign-off and its time next to the treatment time. With none, it says so,
  more prominently for a new client. It warns, never blocks (D2).
- The paper prescribing log, photographed at the time, stays as a fallback (attachment slice).
- A remote link with a video call is ruled out (Osman, 20 Oct).

**Risk, stated plainly:** a toxin treatment with no prescriber sign-off, or one signed after the treatment, shows
in the record exactly as it happened. The platform won't hide or backdate it, and that also protects the clinic.
**Open question for the insurer (S6):** can a prescriber's face-to-face assessment at an earlier visit cover a
repeat treatment, and for how long? If yes, the sign-off gets a "valid until" date and covers Friday treatments
within it (small build in slice 5). If no, those treatments stay unsigned in the record.

## 8. Evidence captured with every signature

Method (drawn or typed); signature path and image; signer name; signed-at from the server; IP and user agent; the
exact template version; SHA-256 of the PDF; each clause's tick with its own time; time from showing to signing; the
text shown, verbatim; the channel (link or QR) and, for QR, the staff member who started it. For a paper form: the
photo, its SHA-256, the template version printed on it, the staff member who added it and the server upload time.

## 9. Faces records

Everything Nafisa wants kept (D17) is read by the extraction tool (a script; no AI reads `~/puremed-data`) and
comes in through the legacy import as historical:

- **Bundle format 4** adds per person: `documents` (historical template versions, signed-at, form name, file hash,
  answers), `attachments` (clinical photos with their dates and any labels, the batch label photo, note
  attachments) and the client-level note.
- Files are uploaded by an admin command from `~/puremed-data/`, each checked against the bundle hash, then deleted
  locally (deletion recorded).
- reconcile.py reads `PureMed_Faces_ConsentForms.csv` and `PureMed_Faces_MedicalHistory.csv` and cross-checks the
  consent export; photo and attachment counts are checked per person, Faces count = imported count.
- First capture as early as possible (Faces changes daily), then the final catch-up at cutover picks up the rest.
  The photo count and total size are measured on the first capture; they confirm S1.

## 10. Plan: build to the Christmas cutover

Cutover (D9) is about 31 Dec; the clinic closes after Fri 18 Dec. Signed documents must be ready with booking, and
the 30 Nov backstop on the Faces data files still has to move before 30 Nov (decisions log, 18 Oct).

| Week of | Signed documents (this spec) | Needs from Nafisa (call notes) |
|---|---|---|
| 26 Oct | Slice 1: file store (check Spaces London, S1) and PDF rendering. Extraction tool: list photos, notes and attachments, measure size | List of treatments and forms; which need her sign-off, the prescriber's, or both |
| 2 Nov | Slice 2: templates, shared question bank, sign-off settings, courses, in Settings, Forms | Course list (which treatments, sessions, gap) |
| 9 Nov | Slice 3: signing page (link, QR), printable blank form, paper form upload, review and course checks | Rewritten forms, insurer wording, course and review wording (by 13 Nov) |
| 16 Nov | Slice 4: requests and reminders on the appointment (with booking slice 6), email first | Approve the request and reminder messages |
| 23 Nov | Slice 5: staff sign-offs, prescriber login and To sign off, Today view, Record treatment check, attachments, super user overrides on form rules. WhatsApp service templates submitted to Meta | Prescriber's details for his login; confirm the prescriber question with insurer |
| 30 Nov | Slice 6: Faces documents, photos, notes and attachments through bundle format 4; first full capture | Backstop on data files moved (Osman) |
| 7 Dec | Slice 7: data protection (platform facts, file store, retention, SOP-PLAT-006); reviews (determinism, data protection, design at 390, 768, 1024, 1440) | Sign the updated DPIA |
| 14 Dec | Nafisa approves every live template; end-to-end run on the sandbox, then on PureMed with a test person; WhatsApp switched on if Meta has approved | Approve each form in the console; run the test |
| 19 Dec to cutover | Go live with booking (booking spec section 10), final Faces catch-up, then Faces switch-off once PDFs, photos and attachments are verified | Be available for the test booking and first real signing |

**Biggest risk:** booking and payments (nine slices) and this spec (seven) land in the same eight weeks, and the
reminders need booking's appointments. If booking slips, cutover slips: forms do not go live alone (D7). Fallbacks,
in order: WhatsApp reminders after cutover, email only at first; slice 4 can run on a typed visit date for testing;
the iPad device slice stays deferred.

**Deferred:** paired clinic iPad (v0.1 slice 5, kept as written there if ever needed); new clinical photography
capture beyond attachments (clinical platform S10).

## 11. Before it is called done

- `npm test` for every slice on made-up people; immutability triggers; the "what counts as current" function
  across visits, courses (sessions used up, gap exceeded, changed answer), review visits and Faces records.
- `rule-trace.json` entries for the current-consent function and reminder timing (booking slice 1 ratifies the file).
- Determinism, data-protection and design reviews; Nafisa approves every template's wording before it goes live.
- End-to-end on the sandbox (Vera), then PureMed with a test person, on a real phone.

## 12. Open decisions

| Id | Question | Recommendation | Who |
|---|---|---|---|
| S1 | Where files are stored | Option B, Spaces in London (photos now in scope); fallback the London Postgres | Osman, w/c 26 Oct |
| D5 | Which forms the practitioner signs, which the prescriber, which both | Nafisa's list (action from the call) | Nafisa |
| D8 | Copy of the signed form emailed to the client | **Decided 20 Oct (Nafisa): yes**, from care@, PDF attached | Nafisa |
| S2 | Health section pre-filled from last answers, or blank each visit | **Decided 20 Oct (Nafisa): pre-filled**, each section confirmed or changed | Nafisa |
| S3 | Under-18s: refuse forms for treatments the law restricts | **Decided 20 Oct (Nafisa): yes**, from date of birth, matching booking's under-18 block | Nafisa |
| S4 | Course rules: which treatments, sessions, longest gap, what a changed answer does | Nafisa's wording and numbers | Nafisa |
| S5 | Who in the clinic sends forms and sees signed forms | **Decided 20 Oct (Nafisa):** owner sends and sees all; prescriber sees the forms of clients he signs off; care@ login sends only | Nafisa |
| S6 | Can an earlier face-to-face prescriber assessment cover a repeat toxin treatment, and for how long | Ask the insurer; if yes, a "valid until" on the sign-off | Nafisa, insurer |
| S7 | Clinic reopening date after Christmas | **Decided 20 Oct (Nafisa): Wed 6 Jan 2027.** Cutover window Sat 19 Dec to Tue 5 Jan, planned about 31 Dec | Nafisa |

## Resume prompt

Signed documents, build. Read `01_mss/product/aesthetics-studio/signed-documents-build-spec.md` (v0.2) and the call
notes it links, settle S1 (check Spaces London), then build slice 1 in a studio-platform worktree.
