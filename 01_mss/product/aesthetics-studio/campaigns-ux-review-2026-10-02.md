# Campaigns, WhatsApp, care messages and Guide: UX review

| | |
|---|---|
| **Date** | 2 Oct 2026 |
| **Build reviewed** | `studio-platform` c8a005d (committed, not pushed), local demo tenant at `localhost:3411/console/demo` |
| **How** | Every new screen walked as the clinic owner in Chrome: campaigns list, new campaign, email editor, audience builder, check and send, a real (outbox-only) launch to one test address, results, People, record a treatment, aftercare series and email, WhatsApp editor, Settings, the patient unsubscribe page, and the Guide at desktop and 390px. Findings marked *code* were confirmed in source as well as on screen. |
| **Spec** | `campaigns-audiences-build-spec.md` section 13 |

## Push decision

**Recommendation: don't push yet.** Fix P0-1 to P0-3 first (about half a day), then push.

**Update, same day: P0-1 to P0-3 fixed and pushed** (spec section 13, B-7, B-13, B-14). Link tracking is now a per-clinic setting, `campaigns.link_tracking`, which defaults to off and is off for PureMed, so PureMed's live email links don't change. Marketing audiences refuse treatment events. A **Mark as booked** button is on the person page. 162 tests pass. P1 and P2 are still open.

The push changes PureMed's live emails. `trackLinks` (`worker.ts:444`) rewrites **every** link in every patient email, the live guide series included, to `https://app.puremed.uk/c/<token>`. That covers the guide download, booking links and footer links (Visit puremed.uk, Privacy Policy, Instagram, Facebook). The unsubscribe link is the only one left alone. Three things follow:

1. **Links depend on the platform for good.** Once an email is sent, its links only work while `app.puremed.uk` is up and the `message` row still exists. If the service is down, or a message is erased or purged, the link shows "Link not recognised".
2. **Click recording is new processing that isn't declared anywhere.** `platform-facts.json` doesn't mention it, and neither does the puremed.uk privacy policy. Each first click is stored per person (`message.clicked_at` and a `message.clicked` event), and audiences can then filter on "clicked a link". This is a DPIA question for the clinic's adviser, not something to decide here. It belongs alongside B8.
3. **Deliverability.** Wrapping every link in another domain is a known spam and Promotions signal, and the guide email already lands in Gmail Promotions.

Options, cheapest first: (a) push with link tracking switched off per tenant until the DPIA covers it, (b) track only links in audience campaigns and leave series emails as they are, (c) push as is once the adviser has signed it off. Option (a) or (b) removes the live-email change from this push completely.

## P0: fix before push (all fixed 2 Oct)

| # | Finding | Evidence | Fix |
|---|---|---|---|
| P0-1 | **Treatments can reach a marketing audience.** The "did something / didn't do something" conditions offer "had a treatment recorded" (`care.recorded`) in a marketing audience, and `validateRules` only blocks `has_care_record`. So "had a treatment recorded in the last 30 days" works as a marketing segment. That breaks CON-009 and the Guide's promise that treatments never go into marketing. | *code* `rules.ts:205-220`, `campaign-views.ts:318` | Refuse `care.recorded` in `event_since`/`no_event_since` when purpose is marketing, and drop it from that list in the builder. Add a test. |
| P0-2 | **Link tracking changes live emails** (above). | *code* `worker.ts:444-497` | A per-tenant switch, off for PureMed until the DPIA covers it, or campaigns-only. |
| P0-3 | **"Booked (marked by you)" can't be marked.** It is the **default** condition when you add "didn't do something", and "Booked" in campaign results depends on it, but no console screen can mark a booking. Only `POST /admin/.../booked` can. So "haven't booked" matches everyone, and "Booked" always reads 0. | *code* `campaign-routes.ts:88`, `server.ts:236` | Add a **Mark as booked** button on the person page, or remove the option and the results row until bookings exist. |

## P1: fix soon (confusing, or the Guide is wrong)

| # | Finding | Where |
|---|---|---|
| P1-1 | **Recording a treatment while aftercare is paused fails silently.** The button says "Save and start aftercare" and the message says "Their aftercare series has started (if it's turned on)", yet nothing starts. The person page still says "Care messages: On", and the timeline shows the raw `workflow.enrolment_skipped because aftercare/paused`. The treatment never gets aftercare later, even after the series is turned on. | People, person page |
| P1-2 | **Test mode blocks sending a campaign with no hint why.** The owner's own address isn't on the demo test list (it is on PureMed's), so every audience shows "Will receive 0" and Check and send says only "Nobody in this audience can receive it." It should say this is test mode and who the test addresses are. | Campaign page |
| P1-3 | **Raw ids in "What happened"**, the screen the Guide sends staff to for "why did they get this": `because SEND-TEST-ALLOWLIST`, `because why-do-i-look-tired/trigger`, `workflow.enrolment_skipped because aftercare/paused`. Agreements show `(form:guide-opt-in)`. | Person page |
| P1-4 | **Tag slugs shown to staff.** Audience cards and the builder show `why-do-i-look-tired`, not "Why do I look tired? guide". | Audiences |
| P1-5 | **The care tick is below the Approve button.** Owners press Approve, get an error, then find the tick. Move it above the buttons. | Aftercare email editor |
| P1-6 | **The care email editor offers links it will then refuse:** booking link, guide link, unsubscribe link, result booking link, add-your-number link, plus consultation fields. The campaign editor already filters these by purpose; the series editor doesn't. | Aftercare email editor |
| P1-7 | **Wrong reason on the send box.** It said "The last message goes 2 Oct, 09:00, to stay inside the daily sending limit" for one person at 07:51. The real reason is quiet hours, and the button still says "Send to 1 person **now**". | Check and send |
| P1-8 | **Sending is one click with no confirmation.** It can't be undone and could go to hundreds of people. The label is clear, but a confirm step that repeats the count costs little. | Check and send |
| P1-9 | **Placeholder rendering.** The series list and the editor H1 show "How are you feeling after your their treatment?". The browser tab title shows the raw `{{treatment_name}}`. | Aftercare series |
| P1-10 | **The aftercare series page contradicts itself.** "Timing: ... except the first, which always goes straight away" sits next to "a check-in the next day". The editor note "people who sign up from now on" is wrong for care, where it's "people whose treatment you record". | Aftercare series and email |
| P1-11 | **The add-your-number and unsubscribe pages are unbranded.** They are plain serif HTML with no clinic name or logo, on `app.puremed.uk`. The add-your-number page asks for a mobile and consent, so it looks like phishing. The Guide also says the unsubscribe page offers "emails, WhatsApp, or both", but only one button showed for an email-only person. | `/n/:token`, `/u/:token` |
| P1-12 | **No way to add someone, or to fix a wrong treatment.** People only finds people who came through a form, so a walk-in patient can't be recorded for aftercare. A treatment recorded by mistake can't be removed, and it is health data. | People |

## P2: polish

- Campaigns page: the Data protection card sits above Campaigns, pushing New campaign below the fold under two banners.
- Series cards say **Open campaign**, while the Guide and section heading call them series.
- Audience counts only appear after pressing Save. The campaign doesn't preview when you change the dropdown.
- The "If you pick both" channel choice shows even when WhatsApp isn't available. "Send me a test email" shows before there is an approved email.
- Builder number inputs are tiny (about 45px, smaller font). "have not ... in the last 180 days" wraps badly. Nothing tells you conditions are combined with AND.
- People shows nothing until you search. Treatment dates appear as `2026-10-02`, while every other date reads `2 Oct 2026`.
- The WhatsApp tick on Record a treatment works while WhatsApp isn't set up. The WhatsApp preview greets the signed-in owner ("Hi Nafisa") where the email preview uses "Jane".
- Settings says "MSS sets this up" and "coexistence". The Guide says Main Stage Studio.
- Results show WhatsApp-only notes (read receipts) for an email-only campaign. The heading says "Who it went to" before anything has gone.
- Leftover demo data ("test care followup") shows in the Guide's Campaigns picture. Clean the demo and re-run the capture.

## What works well

Plain-language copy throughout. Marketing and care are fixed at creation and explained at the point of choice. The email preview with the real branded shell. The audience preview, with a line for each reason someone is left out. Check and send lists exactly what is missing. A test send is required before launch. Pause, resume and cancel are clear, and so is "This can't be unsent". The send button carries the count. The care-word lint. No horizontal scroll at 390px.

## Guide changes made in this session (uncommitted)

- **Media:** 4 images and 3 silent clips (6 to 11 s, about 100 to 250 KB each), each placed beside the step it shows, with alt text and a caption. Clips have controls and don't autoplay. They live in `service/assets/guide/` and are served by `GET /console/guide-media/:file` (strict filename whitelist, byte ranges for Safari). They are made by `service/scripts/guide-media.cjs` from the demo tenant, so they can be re-captured whenever a screen changes. Confirmed playing in Chromium; Safari playback isn't tested yet (WebKit isn't installed here).
- **Text corrections:** "Approve and use" (the real button label). The audience example no longer relies on "haven't booked" (P0-3). The test-mode caption explains the small counts. A new note that sending has no second question. On aftercare: where the care tick is, and that treatments recorded while the series is off never get aftercare. The Data protection link in Getting started.
- **Not changed:** the Guide still says treatments can't be used in marketing audiences. That is the intended rule, and P0-1 makes it true.

Typecheck is clean and 160 of 160 tests pass. The 3411 demo server runs without watch, so it still serves the old Guide until it's restarted.
