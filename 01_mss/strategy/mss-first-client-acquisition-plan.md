---
project: main-stage-studio
status: building
next: "Direct outreach to AML-supervised solicitors and accountants, booking-engine prototype as proof"
blocked_on: ""
owner: osman
updated: 2026-08-17
---

# MSS first-client acquisition plan

Canon doc. Version 1.2, 17 August 2026. Owner: Osman Akhtar / Main Stage Studio.

*v1.1 adds §8, an engagement playbook running from outreach through to
upsell, and revises §5's offer structure. Both draw on concepts pulled from
five outreach/sales videos reviewed the same day (source: a "Maker School"
YouTube channel, notes captured, not reproduced verbatim). Two tactics from
that source (borrowing credibility via "worked with members of [Big
Company]," and manufacturing a false team roster via a lead-sharing side
deal) are deliberately excluded, see §8.4, they conflict with the
founder-credential-led trust basis this positioning depends on.*

*v1.2 adds §9, the LinkedIn channel: which account to send from, the two
prerequisite gaps that need closing before any LinkedIn outreach goes out
(no Founder title on the personal profile, zero posts/followers on the
company page), and how it runs alongside email rather than as a substitute
for it.*

Goal: land the first paying client under the v5 repositioning (regulated
professional services, founder-credential-led, Presence + Systems), using the
booking-engine prototype as proof of work. Channel: direct outreach. Offer: a
paid pilot at a discounted fixed fee, structured to convert into a recurring
engagement (§8.3).

---

## 1. Starting position

- Positioning is locked (v5): regulated professional services, two lines,
  Presence (site, brand, content) and Systems (the booking-engine class of
  build). See `mss-positioning-v5-regulated-services.md`.
- ICP is locked (7 August): small AML-supervised professional practices,
  specifically conveyancing solicitors and accountants. Deliberately not IFAs.
  See `[[project-booking-engine]]` §13.
- Proof of work exists: `booking-engine-prototype-v1.4.html`, a public,
  three-tenant clickable prototype (Thackray Vane solicitors, Marbury Hale
  accountants, Vera Aesthetics), demonstrating the exact regulated-intake
  problem this ICP has: consent, screening, evidence, payment, audit trail,
  in one deterministic system.
- Gap: the MSS case study copy for the booking engine still needs rewriting
  (flagged in memory as outstanding), and it is not yet confirmed the
  prototype is linked from the live MSS site.

This plan does not wait for the case study to be perfect. It gets a minimum
viable version live, then starts outreach in parallel, because outreach is
the rate-limiting step and copy can be tightened while conversations are
running.

---

## 2. Week 0: make the proof of work outreach-ready

**Checked live 16 August 2026: items 1 and 2 below are already done.**
`https://mainstagestudio.co.uk/work/booking-engine/` (the case study page)
and `https://mainstagestudio.co.uk/work/booking-engine/prototype/` (the
working prototype, Thackray Vane and Marbury Hale tenants confirmed
rendering) both return 200 on production. The Astro static site is live on
the primary domain, the WordPress-to-Astro DNS cutover that
`mss-astro-cloudways-setup.md` still lists as pending has in fact completed
and that doc should be updated to reflect it. This removes the item 3 to 8
Aug 2026 memory note ("case study copy still needs rewriting") as a blocker,
the page exists and is presentable; further copy tightening can happen in
parallel with outreach, not before it.

1. ~~A single URL to send.~~ Done: `mainstagestudio.co.uk/work/booking-engine/`.
2. ~~A one-screen framing page around it.~~ Done: the case study page carries
   the framing (five build highlights, the "same engine, different practice"
   point) above the prototype link.
3. **A one-line, non-generic reason to write to each named contact.** Still
   outstanding. Prepared per firm in step 3 below, not written from scratch
   each time.

Outreach is not blocked on anything in this section. Proceed to list-building.

---

## 3. Week 0 to 1: build the target list

Direct outreach only works if the list is specific. Generic "solicitors in
London" outreach will underperform badly against this ICP.

**Target profile**, in priority order:

1. **Sole-practitioner or small (2 to 8 partner) conveyancing solicitors.**
   Reasoning: highest volume of repetitive, consent-and-document-heavy
   client intake, smallest existing tech budget, most likely to still run
   intake over email and phone, most exposed to the exact failure mode
   Thackray Vane demonstrates (client care letter, ID and source-of-funds,
   disbursements, all manual).
2. **Small (2 to 6 partner) accountancy practices doing personal tax /
   small business, not Big 4 adjacent.** Reasoning: AML-supervised, engagement
   letter and due-diligence heavy, Marbury Hale is a direct mirror of their
   actual onboarding.
3. Any practice that already visibly does online booking or forms badly:
   a Calendly link with no consent step, a PDF form emailed as an
   attachment, no online intake at all. This is the tell that they are
   living the exact problem, and it is checkable from their existing
   website before any contact is made.

**Sourcing method:**
- Law Society / ICAEW / ACCA "find a firm" directories, filtered to firm
  size and locality (start local: firms Osman could plausibly meet in
  person, which strengthens the pitch and removes a trust barrier).
- LinkedIn search for "conveyancing solicitor" / "practice manager" /
  "managing partner" at firms under ~10 people.
- Cross-check each firm's live site for the "tell" above before adding them
  to the list, so every name on the list already has a specific, true,
  checkable observation attached to it (not a guess).

**Target list size:** 25 to 30 firms for the first outreach wave. Direct
outreach at this scale needs to be individually true per firm, not a mail
merge; 25 to 30 is the ceiling for that without diluting quality.

---

## 4. Week 1: outreach

**Format:** short, individually-true email (or LinkedIn message where email
is not published), not a pitch deck, not an attachment. Structure:

1. One sentence naming the specific, observed thing about their current
   intake (from the directory/site check in step 3).
2. One sentence naming what MSS built and for whom (aesthetics clinic +
   solicitor + accountant prototype, not vague "we build software").
3. A single link to the live prototype, framed as "here's what it looks
   like," not "please review our capabilities."
4. One low-commitment ask: a 15-minute call, not a proposal, not a meeting
   with an agenda attached.

No case study PDF, no deck, in the first message. The prototype link is the
proof; anything heavier raises the reply cost and lowers response rate.

**Cadence:** send in small batches (5 to 8 per day) rather than all at once,
so early replies can inform and correct the message before the list is
exhausted. One follow-up after 5 to 7 days of silence, then stop; do not
chase past a second message.

**Target:** from 25 to 30 firms, expect roughly 3 to 6 replies and 1 to 3
calls. That is enough to find one pilot client if the offer in section 5
holds.

---

## 5. The offer: paid pilot

On the call, the offer is a **scoped, fixed-fee pilot at a discounted rate**,
not free work and not a full-rate engagement. Structure, using the SOLVE
shape (§8.2) as the checklist:

- **Scope is narrow and named up front, and it is the revenue-adjacent
  slice, not the admin slice** (§8.1): not "a booking system," but the
  specific first step that determines whether a prospective client becomes
  a paying one, their new-client intake and engagement flow (the equivalent
  of what Thackray Vane / Marbury Hale demonstrate), built to their actual
  process rather than a generic template. This is the pain point (SOLVE's
  "S") and the specific outcome (SOLVE's "O": fewer dropped inquiries
  between "interested" and "signed," not "a nicer booking form").
- **Price is below MSS's normal rate, stated as a pilot rate**, in exchange
  for: a real logo, a real testimonial, and permission to use the
  (anonymised, if needed) build as the next case study. Say this explicitly
  rather than leaving the trade implicit, professional-services buyers
  respond well to a named, honest exchange.
- **State a guarantee** (SOLVE's "L", limit risk): a concrete, low-risk
  condition on the pilot, e.g. the firm doesn't pay the balance until the
  system is live and passing a real client through it, or a defined revision
  window if the first build doesn't match their process. This ICP procures
  cautiously by habit (compliance-minded, used to slow legal/practice-
  management vendors); a stated guarantee is what makes a pilot with an
  unproven vendor feel low-risk rather than a leap of faith.
- **Timebox it** (SOLVE's "V", urgency through a real deadline, not
  artificial scarcity). A defined delivery window (weeks, not months)
  matters more to this ICP than scope size, and a fast, fixed date is
  itself a differentiator against slow incumbent vendors.
- **Close on the call or within 48 hours** (SOLVE's "E") with a one-page
  written scope and price, not a formal proposal process. Speed is part of
  the pitch: MSS builds fast, the sales process should demonstrate that,
  not contradict it.

---

## 6. What "done" looks like

The plan succeeds when one of the 25 to 30 firms signs the pilot. At that
point:

1. Update this doc and `[[project-booking-engine]]` / the case study plan
   with the outcome, win or no-win from this wave.
2. If no signature from wave 1, diagnose before running wave 2: was it the
   list (wrong firms), the message (wrong framing), or the offer (wrong
   price/scope), and change exactly one variable before the next batch,
   not all three.
3. Once signed, treat the pilot delivery itself as the next case study
   input, the same way the booking-engine prototype became this plan's
   proof of work.

---

## 7. Sequencing note

This plan is direct-outreach-led by decision, not because content/inbound
(the existing LinkedIn founder-POV plan, `project-mss-social-content-plan`)
is wrong, it is slower to produce a first client but compounds for the
second and third. Once the first client is signed, that plan's content
motion becomes higher-priority: a real, named (or anonymised-if-required)
regulated-practice client is a materially stronger LinkedIn post than the
fictional prototype tenants.

---

## 8. Engagement playbook: outreach through upsell

This section is the through-line the rest of the plan sits inside: how a
contact becomes a lead, a lead becomes a paid pilot, and a pilot becomes
recurring revenue. Concepts below are pulled from five outreach/sales videos
reviewed 16 August 2026 (a "Maker School" channel), filtered for what
actually fits a founder-credential-led firm selling to AML-supervised
professional practices. Two of the source's tactics are named and excluded
in §8.4.

### 8.1 What to lead with: revenue-adjacency, not admin

The strongest pattern across the source material (backed, in one video, by
data across 900+ closed deals) is that the same build effort commands
multiples-higher price and easier buy-in when it is positioned against a
problem close to the client's own revenue, rather than a back-office
efficiency saving. A system that visibly reduces dropped or delayed new-client
inquiries is worth far more to a solicitor or accountant, in their own
terms, than one that saves their admin team a few hours a week, even if the
two are comparably difficult to build.

This is already how the booking-engine prototype is framed (closing the gap
between "interested" and "signed"), and it is why §3's target profile leads
with conveyancing intake specifically: it is the point in a small practice's
funnel where a slow or manual process most visibly costs them a client, not
just time. Keep every pitch, scope conversation, and case study framed
against that gap, not against process tidiness.

### 8.2 SOLVE as the offer-writing checklist

Before any outreach message or pilot scope is written, run it through:
**S**pot the specific pain point, **O**utline a specific outcome (not a
feature list), **L**imit risk with a guarantee, **V**alue-pack with a real
urgency (a genuine timebox, not artificial scarcity), **E**xecute with one
clear, low-commitment call to action. §4's outreach structure and §5's pilot
offer are both already shaped this way; this is the check to run before each
wave goes out, and before adapting the offer for a different micro-niche
(e.g. if wave 2 moves from conveyancing to accountancy).

### 8.3 After the pilot: recurring conversion and upselling

A one-off fixed-fee pilot is a foot in the door, not the target state. The
source material's clearest data point is that recurring revenue compounds
fast (a modest monthly retainer outperforms a much larger one-off within a
year) and that once a vendor is running a piece of a practice's client
intake, they become embedded, sticky infrastructure that the firm asks
first rather than re-tendering. Two implications for delivery, not just
sales:

- **Design the pilot scope so a recurring component is a natural next step,
  not a separate pitch.** For a booking-engine-class build, this is
  maintenance, monitoring, iteration as their rules or documents change, and
  ongoing configuration as a natural retainer, not an add-on that has to be
  justified from scratch after delivery.
- **Bundle perceived value without expanding the core build.** Documentation
  handed over as a short recorded walkthrough, a defined monthly check-in,
  a direct line for questions, are all low-marginal-cost additions to a
  pilot that materially change how substantial the engagement feels to the
  client and support pricing the retainer well above bare hosting-and-fixes
  rate. This only works if it is real and used, not decorative, don't add
  scope theatre to a regulated-services relationship.
- **Once one pilot converts to a retainer, that client is the reference for
  the next wave.** A named, real (or anonymised where compliance requires)
  regulated-practice client materially outperforms the fictional prototype
  tenants as case-study evidence, this is the trigger referenced in §7 to
  prioritise the LinkedIn content motion.

### 8.4 What was deliberately left out

The source material also proposes two credibility tactics not used here:
borrowing a large company's name by doing free work for one of its
employees and then describing the work as having been delivered to "members
of [Company]'s team," and manufacturing a false team roster by arranging to
resell a competitor's client work as one's own. Both are built for a
founder with no real, verifiable work to point to yet. MSS already has real
client work (PureMed, FSC, the booking-engine build itself) and a
positioning built specifically on founder-credential-led trust with a
compliance-minded, professionally regulated buyer. Anything that could later
read as an inflated or misleading claim to that buyer is a direct threat to
the thing being sold, not a shortcut to it. This plan uses only the honest
version of the source's monetary-framing point: lead outreach and case-study
copy with the real, concrete outcome delivered, not the deliverable
description, exactly as §4 and the live case study page already do.

---

## 9. LinkedIn channel

Added 17 August 2026. LinkedIn runs alongside email as a second outreach
surface, not a replacement: some of the wave 1 list has a confirmed personal
profile but no working email (Ashley Wilson, Gregsons, Oliver Fisher, Hill
Johnson & Leo, ESDG, Clarkwell, Passman Leonard's three directors, Liburd
Gallagher), so LinkedIn is already load-bearing for reaching them at all.

### 9.1 Personal profile vs the Main Stage Studio company page

**Use Osman's personal LinkedIn profile as the outreach account, not the
Main Stage Studio company page.** Reasoning:

- **Connection requests and DMs are a personal-profile mechanic.** A
  company page cannot send a connection request or a personalised first
  message to a named prospect, only a personal profile can, so the choice
  is not really optional for the outreach motion itself, whichever account
  "leads," the actual message has to come from a person.
- **The positioning is founder-credential-led** (locked, [[project-mss-repositioning]]),
  and a message from Osman personally is a direct match for that: a named
  founder reaching out is the credibility signal, not a company account
  doing outbound.
- **The company page is not ready to be the front door yet.** It currently
  has no posts and no followers, and if a prospect clicks through from an
  outreach message to check credibility (which a compliance-minded buyer
  in this ICP will do) an empty company page reads as a red flag, a
  founder profile with real experience listed reads as a person, which is
  what this ICP is being asked to trust in the first place.

**What this means the company page is for instead:** a passive credibility
backstop, not an outreach channel. It should exist, be linked from Osman's
profile as current company, and carry the same case study content that's
live on the site, but it is not where outreach messages originate from, and
it does not need to reach any follower threshold before outreach starts,
because outreach never routes through it.

### 9.2 Two prerequisite gaps to close before sending anything

Both need fixing before the first LinkedIn message goes out, not after,
because a prospect who clicks through mid-conversation will see whichever
state the profile is in at that moment:

1. **Osman is not currently listed as Founder of Main Stage Studio on his
   personal profile.** Add the current position (title: Founder, company:
   Main Stage Studio, linked to the company page) before sending a single
   LinkedIn message. A message that says "I build client-onboarding
   systems" from a profile with no matching current role is a mismatch a
   compliance-minded reader will notice.
2. **The company page has no posts and no followers.** It does not need a
   content history to function as a backstop (§9.1), but it should not be
   completely empty either. Minimum bar before wave 1 LinkedIn messages go
   out: the page exists, has the logo and a one-line description matching
   the site positioning, and is linked from Osman's profile. A handful of
   posts (even just the case study going live, and one or two build
   highlights) is worth doing in the same session as the Founder-title fix,
   both are quick and remove the "is this real" doubt in one pass, but the
   page being non-empty matters more than the page having many followers,
   which will not exist yet regardless.

### 9.3 Message format

Same SOLVE-checked shape as §4's email structure, compressed to fit
LinkedIn's mechanics:

- **Connection request note** (300 character limit): one sentence naming
  the specific observed thing about their intake, one sentence on what MSS
  built, no link (links in connection notes read as spam and can suppress
  acceptance rates). Example, for a firm with the Calendly-no-consent tell:
  "Hi Amir, noticed Clarkwell's booking is a bare Calendly link with no
  AML step before a slot's taken. I build onboarding systems for regulated
  practices, would like to connect."
- **Follow-up message after acceptance**: the full §4-shape message
  (observed tell, what MSS built and for whom, the prototype link, the
  15-minute-call ask), sent once the connection is accepted rather than
  packed into the request note. This keeps the acceptance step free of a
  pitch, which raises acceptance rate, and means the actual offer only
  reaches someone who has already signalled some openness by accepting.

### 9.4 Cadence and overlap with email

Run LinkedIn as a second track on the same 24-firm list, not a separate
list: for firms with both a working email and a confirmed profile, email is
still the first message (per §4), LinkedIn connection requests go out
afterwards, spaced by a day or two, so a firm is never hit by both channels
in the same sitting. For firms with a profile but no working email, LinkedIn
is the only route in and should go out on the same batch cadence as email
(5 to 8 per day, §4). Track replies per channel per firm in the wave list so
§6's post-wave diagnosis (list, message, or offer) can also account for
which channel actually produced the reply.
