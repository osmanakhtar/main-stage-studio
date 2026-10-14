# Build spec: signed clinical documents (consent, medical history, booking documents)

*Build spec, v0.1, 14 October 2026. Nothing built. Implements `booking-engine/booking-engine-plan.md` §8
(templates, in-flight signature, evidence, rendering) and the clinical platform's S4 requirements
(`02_clients/puremed/clinical-platform/requirements-register.md` CONS-001 to CONS-009) inside the live
platform. Parent canon: `platform-design.md`. Repo: `~/workspace/studio-platform`. Also settles where the
signed forms and medical history answers read from Faces go (`faces-screen-extraction-plan.md` sections 3, 4).*

## 1. What this builds

One module for every document a patient signs, wherever they sign it:

1. **Form templates** the clinic writes and publishes: treatment consent, medical history, photography and
   marketing consent (always separate), policy acknowledgements. Versioned, locked once published.
2. **Signing**, two ways, same page and same record:
   - **Before the visit, by link:** staff send a signing request from the person's page; the person signs on
     their own phone. Later, the booking system sends it at booking.
   - **In the clinic, on the practice iPad:** staff press "Sign on the clinic iPad"; the iPad shows that one
     person's forms and nothing else, then goes blank.
3. **The signed record:** a PDF rendered on the server, hashed, stored so it can't be changed, with the
   evidence that gives an electronic signature its weight (section 6).
4. **The person page** lists their signed documents, and Record treatment says when a treatment has no
   current signed consent.
5. **Faces' old forms** come in through the legacy import as historical records, never live, with their
   PDFs in the same store and their medical history answers as historical answers.

The platform gives no legal advice. Form wording is the clinic's.

## 2. Decisions this spec rests on

| Id | Decision | Who, when |
|---|---|---|
| D1 | One module for booking documents, future consent and migrated Faces forms | Osman, 14 Oct 2026 |
| D2 | In-clinic signing on a practice iPad | Osman, 14 Oct 2026 |
| D3 | Built in the platform, no third-party e-signature service (booking-engine §8.2) | booking-engine plan |
| D4 | Faces forms are historical: shown, never counted as consent for a future treatment (DPIA B10.4) | B10.4 wording |

Open decisions are in section 10.

## 3. What exists to build on, and what doesn't

**Exists:** people and identifiers; staff identity with an owner login and a shared mailbox login that
can't sign (dp-onboarding spec slice 1); the event log; `care_record` (Record treatment, by `treatment_key`
from the tenant's `treatments` config); immutable signed records with a content hash and a database trigger
against change (`dp_document`, migration 007); email through the clinic's Gmail (care@); the legacy import
with its bundle, manifest and DPIA gate (SOP-PLAT-005); erasure and inactive status with the B10.2 period
(migration 012); the DPIA footprint, which reopens the assessment when what the platform collects changes.

**Doesn't exist:** appointments (Faces is still the booking system), file storage, PDF rendering, any
patient-facing page that isn't a form post, devices.

So until booking moves to the platform, a signing request hangs off a **person, a treatment and a visit
date** typed by staff, not an appointment. The booking module, when built, creates the same request.

**Naming:** the existing `consent` table is marketing consent. Everything here is called a clinical
document, never "consent", in tables and code, so the two can't be confused.

## 4. Data model (migration 013)

| Table | Holds | Rules |
|---|---|---|
| `document_template` | one row per form: key, kind (`treatment_consent`, `medical_history`, `photo_consent`, `policy`), title, treatment keys it covers | |
| `document_template_version` | the published content: body, clauses (each its own tick), questions (medical history), validity in months, whether a practitioner countersigns, `is_live`, `source` (`platform` / `faces`) | immutable once published (trigger); a change is a new version |
| `signing_request` | person, treatment key, visit date, the template versions asked for, channel (`link` / `clinic_device`), device id, token hash, expires at, status, who sent it | token stored hashed; one use; link expiry 7 days, device request 30 minutes |
| `clinical_document` | the signed record: template version, person, request, signer name, method (`drawn` / `typed`), signature path and image, server signed-at, IP and user agent, view time, clause events, answers (medical history, structured), file key, PDF SHA-256, countersign (staff, time), `source` (`platform` / `faces`), `supersedes_id` | immutable (trigger), like `dp_document`; a correction is a new document that supersedes |
| `clinic_device` | paired iPads: name, token hash, paired by, paired at, last seen, revoked at | |

Answers are kept structured as well as in the PDF, so the next medical history arrives pre-filled for the
patient to confirm or amend (CONS-007), and no question is asked twice for one visit (CONS-008).

Every table is tenant-locked with row-level security like the rest of the platform.

## 5. Slices, in build order

### Slice 1: storage and rendering
- **File store** (decision S1, section 10): DigitalOcean Spaces, private bucket, versioning on, the app's
  key unable to delete; or the PDFs in Postgres. Either way: written once, read only through the console
  with an access event, never a public URL.
- **PDF rendering** in the service with a pure JavaScript library (`pdf-lib`), not a headless browser: the
  app runs in 1 GiB, and the same input must give the same bytes so the hash means something. The PDF holds
  the form text as shown, each clause and its tick time, the answers, the signature image, signer name,
  signed-at, and the template version id.

### Slice 2: templates in the console
- Owner writes and publishes templates under Settings, Forms. Preview before publishing. Publishing a
  version is an event; the old version stays for documents signed on it.
- A publish that adds a question that may be special category data reopens the DPIA (existing footprint).
- Starting content: the clinic's current Faces forms (`clinical-platform/faces-templates/` holds the filler
  consent and aftercare), rewritten by Nafisa. Photography and marketing consent is its own template with
  "saying no doesn't affect your treatment" (booking-engine §8.1).

### Slice 3: the signing page
- One patient-facing page, `/s/<token>`, used by both channels. Shows the forms in order, medical history
  first, pre-filled from the last answers; each clause ticked separately; signature drawn on a canvas, or a
  typed name as the accessible fallback (recorded as such).
- On submit the server stamps the time, renders, hashes, stores, writes `clinical_document` and an event,
  and spends the token. Nothing is trusted from the device clock.
- Works at phone width and at iPad width in both orientations. No third-party scripts or fonts.

### Slice 4: by link, before the visit
- Person page: "Send forms" (treatment, visit date). The platform picks the templates for that treatment,
  leaves out any still within their validity window, and emails the link from care@.
- Only to an email on the person's record, so a link never goes to an address nobody confirmed (ACCT-004).
- Staff see the request's state: sent, opened, signed, expired.

### Slice 5: the clinic iPad
- **Pairing:** the owner opens Settings, Devices, Pair a device, and gets a six-digit code valid 10 minutes.
  On the iPad, Safari opens `/device` and the code is entered once; the device gets a long-lived, httpOnly
  token. Revoking it in the console stops it at once.
- **Idle screen:** the clinic's name and nothing else. No list, no search, no patient name.
- **Use:** on the person's page, "Sign on the clinic iPad" (treatment, today) picks the device. The iPad shows
  that request within a few seconds (polling every 3 s, no push service). After submit, or 10 minutes idle,
  it returns to the idle screen and the request's data is cleared from the page.
- **Countersign:** the practitioner countersigns on the iPad after the patient, or later in the console,
  for templates that need it (D5).
- **Lock-down (SOP, not code):** iPad Guided Access on Safari at `/device`, auto-lock on, a passcode only
  staff know, no saved logins, Safari history off. An iPad model with current iOS updates.

### Slice 6: the person page and Record treatment
- A Documents section: each signed document, date, form and version, valid until, open the PDF (logged as
  `document.viewed`), and Faces documents marked "From Faces, historical".
- Record treatment shows whether a current signed consent covers that treatment. Warn or block is D2.

### Slice 7: Faces forms through the legacy import
- Bundle format 4 adds `documents` per person: historical template versions (`source: faces`, never live),
  signed-at, form name, file hash, and medical history answers as structured historical answers.
- The PDFs are uploaded by an admin command from `~/puremed-data/consent-pdfs/`, each checked against the
  hash in the bundle, then deleted locally (the deletion recorded). This replaces the Google Drive plan.
- reconcile.py reads `PureMed_Faces_ConsentForms.csv` and `PureMed_Faces_MedicalHistory.csv` (new rule,
  technical design §5.4) and cross-checks the 129-record consent export.
- A Faces document never satisfies the slice 6 check.

### Slice 8: data protection
- Platform facts: clinical documents, the file store (and its region), devices; Part A shows them, which
  reopens the DPIA for the clinic to recheck and sign.
- Retention: a signed clinical document is a clinical record. It follows the clinic's clinical retention
  period (D4), and an erasure request makes the person inactive rather than deleting it, as for old notes.
- `service/data-protection.json` entries; a new SOP (SOP-PLAT-006, signed documents and the clinic iPad).

## 6. Evidence captured with every signature

From booking-engine §8.2: method (drawn or typed); signature path and image; signer name as entered;
signed-at from the server; IP and user agent; the exact template version; SHA-256 of the PDF bytes; each
clause's tick with its own time; time from showing to signing; the text shown, verbatim. For a device
signing, also the device id and the staff member who sent it.

## 7. Parallel running with Faces

Faces sends its own forms with its bookings until booking moves. Two systems asking the same patient for
the same form is the risk. So templates go live **one treatment at a time** (D7): when a treatment's forms
are live on the platform, the clinic stops sending Faces' form for it. The Documents section shows both.

## 8. Before it is called done

- `npm test` with cases for every slice, on made-up people; the immutability triggers tested.
- Determinism review: which forms a treatment requires, validity windows, what "current consent" means.
- Data-protection review, including the device flow and the file store.
- Design review of the signing page at 390, 768, 1024 (iPad) and 1440.
- Nafisa approves every template's wording before it goes live.
- One end-to-end run on the sandbox (Vera) and on a real iPad before PureMed.

## 9. What this does not do

No third-party e-signature, no qualified electronic signatures, no clinical photos, no booking or payment,
no treatment records beyond the existing Record treatment, no patient accounts.

## 10. Open decisions

| Id | Question | Recommendation | Who |
|---|---|---|---|
| S1 | Where the PDFs are stored | DigitalOcean Spaces if it is offered in the London region (not yet checked); if not, Postgres in the London database, rather than a new country for patient files | Osman |
| D2 | Record treatment with no current consent: warn or block | Block for toxin (prescription), warn for the rest | Nafisa |
| D4 | How long signed clinical documents are kept | Same period as the old notes (B10.2, 11 years from last visit), confirmed by the clinic's adviser | Nafisa, adviser |
| D5 | Which forms the practitioner countersigns | Toxin consent and prescribing record (NOTE-005) | Nafisa |
| D6 | Which iPad, and who keeps it | Any iPad on current iOS, used only for this, kept at reception | Nafisa |
| D7 | Order treatments move off Faces' forms | Toxin first (highest risk), then filler | Nafisa |
| D8 | Does the clinic want a copy emailed to the patient after signing | Yes, from care@, the PDF attached | Nafisa |

## Resume prompt

Signed documents, build. Read `01_mss/product/aesthetics-studio/signed-documents-build-spec.md` and
`booking-engine/booking-engine-plan.md` §8, settle S1 (check Spaces regions), then build slice 1 in a
studio-platform worktree.
