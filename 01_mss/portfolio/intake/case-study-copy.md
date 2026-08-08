# Intake, case study copy

*Written 7 August 2026, before any design, per the checklist.*
*Rewritten 8 August 2026 to lead on legal and accountancy, per the three-tenant
pivot in `case-study-plan.md` §11.*
*Voice: MSS (`mss-tone-of-voice.md`). Person: "we", matching Sable and PureMed.*
*Checked against the copywriting skill quality checklist, see §12.*

**Decisions taken to proceed** (the four open items in `case-study-plan.md` §9).
Name is **Intake**; structure follows Sable, so the artefact route is the second
page and there is no separate framing page; the rules table shows six rules, see
the deviation note below; **the copy leads on the two professional practices, with
the clinic used only where range is being argued.**

**Two deviations from the plan, both deliberate, say if either should change:**

1. **Six rules in the table, not five.** The plan recommended five, to protect a
   non-technical reader. The legal tenant brought the single most legible rule on
   the page, the conflict check, and a lay reader understands "a firm cannot act
   for both sides" faster than anything else here. Six short rows do not cost what
   a fifth-to-sixth row usually costs.
2. **Four prompts under the prototype, not three.** Same reason. The conflict stop
   is worth its own instruction because it is the only place a reader can watch the
   system refuse outright.

Copy is liftable as written. Craft notes are indented and marked, and do not ship.

---

## 1. Card, on `/#work`

**Eyebrow:** Case Study · Systems &nbsp;·&nbsp; *Self-initiated*
**Headline:** Intake
**Body:**

> Three regulated practices, one engine. A client journey where every question the
> system asks can be traced to a numbered rule, and the rule is stored on the
> record next to the answer. Built to be taken apart, because that is the only
> honest way to show this kind of work.

**Sector:** Regulated Professional Services
**Scope:** Journey Architecture · Rules Design · Prototype
**CTA:** Read the case study

> *Note: the section heading above this card, "Built and signed off.", does not
> cover a self-initiated piece. Recommended replacement in the plan is "Built,
> and shown working." The standfirst below it also needs to go from two
> engagements to three.*

---

## 2. Hero

**Eyebrow:** Case Study · Systems &nbsp;·&nbsp; Self-initiated, 2026

**H1:**

> Show your working.

**Standfirst:**

> Any regulated firm can tell you what its intake process does. Far fewer can tell
> you why it asked a particular client for a particular thing, on a particular
> day, and produce what the client signed. That is fine, right up until somebody
> asks.

> *Note: unchanged from the first draft. It opens on the reader's exposure rather
> than the studio's capability, and it is sector-neutral, which it has to be. The
> last sentence is the whole page in seven words and should not be softened.*

---

## 3. The problem

**Section label:** 01 · The problem

> You have a form builder, an e-signature service, something that checks identity,
> and an inbox. Each of them works. None of them knows about the others.
>
> So when a client asks why they were sent a particular form, or a supervisor asks
> how a risk was assessed, or a complaint arrives eighteen months later, the answer
> is assembled by hand. It lives across four systems and one person's memory,
> usually the person who set it all up.
>
> Most of the time this is invisible. It stays invisible until the day it matters,
> and on that day the firm is not judged on whether it did the right thing. It is
> judged on whether it can show it did.

> *Note: the tool list now names the professional-practice stack rather than
> opening on a booking tool. Still no sector named. This has to land equally for a
> solicitor, an accountant and a broker. The third paragraph is the pivot from
> inconvenience to risk, and "show it" sets up the hero line's echo.*

---

## 4. The insight

**Section label:** 02 · The insight

**Pull quote, largest type on the page after the hero:**

> A regulated journey is not software with compliance bolted on. It is a rules
> table with an interface attached, and if a non-technical reviewer cannot read
> that table, the system cannot be trusted however well it is built.

**Body:**

> Once you accept that, the build inverts. The rules stop being something you
> encode and start being the thing you design, in language a compliance reviewer
> can argue with. The interface becomes a way of presenting them.
>
> It also gives you a hard test. Every question the system asks a client has to be
> explained by a numbered rule. If a step exists that no rule produced, that step
> is either a defect or an undocumented policy, and both are worth finding.

> *Note: unchanged. The checklist requires the insight in one sentence. The pull
> quote is that sentence. The body earns it rather than restating it.*

---

## 5. The translation

**Section label:** 03 · What it runs on

> The prototype below is configured for three practices. A firm of solicitors
> opening a conveyancing file. A chartered accountancy practice taking on a new
> client. And, to make the point properly, a nurse-led aesthetics clinic booking a
> treatment.
>
> The first two are the same kind of business. Small, regulated, supervised for
> money laundering, and required to know who they are acting for before they act.
> The third is nothing like them, which is exactly why it is there. It runs on the
> same engine, with no forked code.
>
> Underneath, all three are four things: a gate that decides whether the client can
> proceed, a set of questions the gate needs answered, documents the answers
> determine, and a record that proves what happened.
>
> Swap the property for a pension transfer and the architecture does not change.
> The vocabulary changes, the regulator changes, the documents change. The shape
> of the problem does not.

> *Note: legal is named first, accountancy second, and the clinic is introduced
> with its job stated out loud rather than pretending to be a third equal buyer.
> "Which is exactly why it is there" is doing the work that a paragraph of
> explanation would otherwise do. The last paragraph is the bridge for a reader in
> none of the three sectors, and it should sit as its own line with space around
> it.*

---

## 6. What was built

**Section label:** 04 · What was built

> **A rules engine.** Fifteen numbered rules. Every requirement a client sees comes
> from one of them, and the rule's number is stored on the record next to the
> answer it produced. Nothing is asked for that cannot be pointed at afterwards.
>
> **An availability engine.** A pure function of the working pattern, the busy time
> imported from the fee earner's own calendar, the appointment length, the buffers
> and the notice period. No floating start times, no randomness. The same inputs
> return the same slots on any machine, on any day, which is the only way a
> scheduling bug can ever be reproduced.
>
> **An evidence layer.** Signature captured in the page, each clause acknowledged
> separately with its own timestamp, and a SHA-256 hash taken over the rendered
> document. The firm and the client hold the same file, and can prove it is the
> same file. A signature on its own proves very little. The record around it is
> what carries weight.
>
> **A tenant record.** Everything a client sees is data: the palette, the
> catalogue, the documents, the questions, the words on the buttons, the layout
> of the page itself, the rules. The solicitors get a stage-led editorial page
> with a photograph. The accountants get a ledger, no photography and no boxes.
> The clinic gets an airy asymmetric gallery. Three practices in three different
> regulated sectors, one engine, no forked code.

> *Note: four things, each with the reason it exists. Not a deliverable list. The
> line about reproducing a scheduling bug is the one an engineer will trust.
> "Practitioner" became "fee earner" because the lead tenant is a law firm, and
> "the words on the buttons" is a small addition that sets up the confession in
> §9.*

---

## 7. The rules

**Section label:** 05 · Six of the fifteen

**Intro:**

> These are the actual rules, in the words the system uses. Read them and you know
> what the system will do, without reading any code.

**Table:** (six rows, monospace IDs, plain-language conditions)

| Rule | What it does |
|---|---|
| `RULE-002` | Every practice has a disclosure it cannot afford to forget. The solicitors itemise the full cost of a matter, disbursements and VAT included, so a quote is never a headline fee with the searches, the Land Registry fees and the bank transfer left to turn up later. The accountants attach a scope statement excluding regulated investment advice. The clinic never names a prescription-only medicine publicly. One rule slot, three constraints, none of them left to whoever writes the copy that week. |
| `RULE-004` | Some work cannot be taken on cold. A leasehold purchase reroutes to a free quote call, because the fees that decide the answer sit in a lease the firm has not read, and they are not the firm's to guess. Advisory work at the accountants reroutes to a scoping call. If the prerequisite is missing, the journey changes and says why. |
| `RULE-011` | A hard stop. Tell the solicitors that the other side has already approached them and the journey ends there, with the reason on the screen. A firm cannot act for both parties in a conflict, and it cannot ask a client to waive one. There is no continue button, because in a real firm there is no continue. |
| `RULE-006` | A minimum age, checked against date of birth. It applies at the clinic. It does not exist at either professional practice, so the field is never rendered and the data is never collected. |
| `RULE-010` | Risk assessment before a time is offered, so nobody picks a slot they will not be allowed to keep. Conflict, sanctions and source of funds at the solicitors. Money-laundering risk at the accountants. Contraindications at the clinic. |
| `RULE-022` | Marketing consent is always a separate, optional document, and it can never block the work. Agreeing to marketing cannot be a condition of being acted for, and at the clinic consent to treatment is not freely given if refusing means not being treated. |

**Kicker under the table:**

> RULE-006 is the one worth pausing on. A shared engine that quietly collected a
> date of birth from a client whose firm has no reason to hold it would be a
> defect, not a feature. The rule does not fire, so the field does not exist.

> *Note: six chosen for spread, not for importance: a constraint, a gate, a hard
> stop, a rule that is absent for two of the three tenants, a sequencing decision,
> and a point of consent law. Four of the six now lead on the legal tenant.
> RULE-011 is the row a non-technical reader will understand fastest and the
> reason for the deviation from five. The kicker stays on RULE-006, which is still
> the most quietly impressive thing on the page.*

---

## 8. The prototype

**Section label:** 06 · Take it apart

**Intro:**

> It is easier to show this than describe it. Everything below is live. Nothing is
> a video, nothing is a screenshot, and the panel on the right is not a mock-up of
> a log, it is the log.

**Embedded prototype, full bleed.**

**Under it, four prompts:**

> **Watch a firm refuse to quote.** Choose a Leasehold Purchase at Thackray Vane.
> RULE-004 fires and routes you to a free quote call, because the fees that matter
> are sitting in a lease nobody has read yet. Change one setting in the admin panel
> and the same choice instructs directly.
>
> **Watch a firm refuse the work.** In the risk questions, say yes to the other
> side having approached them. The journey stops. No continue, no workaround, and
> the reason is on the screen.
>
> **Change sector.** Switch tenant. The rules keep their numbers and change their
> meaning. The engine does not know it moved.
>
> **Unplug the calendar.** Turn off "read the fee earner's calendar" and the
> blocked time reappears as bookable. That is what a calendar integration actually
> does, made visible for a second.

> *Note: a reader who will not explore still gets the argument from these four.
> Each is an instruction with a payoff, not a feature description. The first two
> both start with "watch a firm refuse", which is deliberate: the most persuasive
> thing this system does is decline work for a stated reason.*

---

## 9. What it proves

**Section label:** 07 · What it proves

**Intro, and this paragraph is not optional:**

> There are no outcomes to report. No client has used this, no revenue moved, no
> hours were saved. It is a system built to be examined, and a case study that
> invented results for it would fail the only test that matters to the people it
> is written for.

**What can be checked instead, in the browser, now:**

> Every requirement shown to a client is explained by a numbered rule, live, as it
> happens.
>
> Availability is reproducible. Same inputs, same slots, every time, on any machine.
>
> The hashes are real, computed in the page as you sign.
>
> Three sectors run on one engine, with the rules, the documents and the vocabulary
> coming from configuration rather than from code.
>
> One rule that exists for one practice does not exist for the other two, and the
> data collection disappears along with it.
>
> And one rule ends a journey outright, for a reason the client can read.

**Then, set apart:**

> One more thing, and it is a confession rather than a proof. The third practice
> was added after the other two were finished, and adding it found seven places
> where the sector was still written into the code. A conveyancing client would
> have been told their appointment was booked. Two practices had been enough to
> make the claim and not enough to test it.
>
> That is worth knowing about any system that says it is configurable, including
> this one. It is also the reason the third practice is a clinic and not a third
> professional firm. Something has to be far enough away to break it.
>
> The same thing happened again, one level up. The three practices had their own
> palettes and their own words and still came out looking like one website in
> three colours, because the layout was the one thing the tenant record did not
> control. It does now. A claim about configuration is only worth as much as the
> part of the page you were willing to let configuration reach.

> *Note: the checklist's Outcomes section, honestly substituted. Leading with the
> absence is stronger than burying it. The confession is new in this draft and it
> is the strongest paragraph on the page: it is the case study auditing its own
> artefact in public and then explaining a design decision through the failure.
> It also retro-justifies keeping the clinic, which a sharp reader will otherwise
> ask about. Set it apart visually, it should not read as a bullet.*

---

## 10. What is not real

**Section label:** 08 · What is not real

> All three practices are invented. Thackray Vane, Marbury Hale and Vera Aesthetics
> are demonstration brands with their own palettes, fee structures and policies, and
> none of them takes clients.
>
> The retainer, the letter of engagement and the clinical consent forms are
> deliberately blank, marked as placeholders. Those documents are written by a
> firm's own advisers, by clinicians, and by their insurers. A convincing-looking
> version here would be worse than an empty one, because it is exactly the kind of
> thing someone lifts.
>
> Costs information, terms of business, booking policy and marketing consent are
> written in full, because those are commercial documents a firm genuinely owns,
> and a fictional firm owns its own. The solicitors' costs information carries the
> most weight of the four: it is where the itemisation rule is either honoured or
> it is not, so leaving it blank would have hollowed out the point.
>
> There is no server, no database, no calendar connection and no payment provider.
> Availability is computed in the browser from a fixed working pattern.
>
> Nothing here has had legal or compliance review. It demonstrates a method. It is
> not a compliance assurance, and no supplier should ever sell one.

> *Note: designed section, not a footnote. In front of a regulated buyer this is
> the most credible copy on the page. The third paragraph is new and it closes a
> gap a careful reader would find: if RULE-002 is about itemising costs, the costs
> document had better not be a placeholder. The last line is a boundary the studio
> needs on the record anyway, per positioning v5 §5.2.*

---

## 11. Close

**Section label:** 09

> Most of this kind of work never gets shown. Onboarding flows, intake processes
> and the decision logic underneath them belong to the firms that paid for them,
> and the ones we have built professionally are not ours to publish.
>
> So we built one that is. Three practices, fifteen rules, and every one of them
> visible.
>
> If your intake runs across four systems and one person's memory, that is the
> conversation.

**CTA:** Start a conversation → `#contact`

> *Note: closes forward, hands straight to the CTA, no price. The middle paragraph
> is the whole case study in eleven words. The last line calls back to §3 so the
> page shuts cleanly. No mention of the founder's CV: the credential section on the
> homepage does that job and repeating it here would weaken both.*

---

## 12. Quality checklist

Run against the copywriting skill.

- [x] First sentence starts on the thing. "Any regulated firm can tell you what its intake process does."
- [x] Every sentence earns its place. Three passes now. This draft cut a hedge from §5 and tightened the RULE-002 row, which had grown too long with three tenants in it.
- [x] Active voice throughout.
- [x] Hedges cut. No "we think", no "in our experience", no "perhaps".
- [x] Leads with the reader's world. §3 is entirely their situation, no studio, no capability.
- [x] Ends with weight. "That is the conversation."
- [x] Sounds like MSS, not generic. Considered, direct, distinctive. The honesty in §9 and §10 is the distinctive part, and the confession in §9 is the most distinctive thing in the piece.
- [x] Empathy before capability. §3 before §6.
- [x] Read aloud. The insight pull quote is long and holds on its commas. The RULE-002 row is the longest thing on the page and is a table cell, which is the right place for it. Everything else is short.
- [x] Does not open with "We were approached by".
- [x] No deliverable list dressed as achievement. §6 gives four things with reasons.
- [x] No vague outcomes. §9 states there are none.
- [x] No em dashes.

**Known deviations, all recorded rather than worked around silently:**

1. The checklist asks for a framing page plus a full case study. This ships as one
   case study plus the live artefact, following Sable. Recorded in
   `case-study-plan.md` §9.
2. Six rules in the table rather than the five recommended in `case-study-plan.md`
   §9, and four prompts under the prototype rather than three. Reasons at the head
   of this file.

**A counting error found and fixed in this draft, worth recording.** The 7 August
copy claimed "twelve numbered rules" in §6, §7 and §11. The prototype has
**fifteen** distinct numbered rules, and it had fifteen in v1.2 as well, so the
claim was wrong when it was first written and the third tenant did not cause it.
On a page whose entire argument is "count it yourself", a reader who counts and
gets a different number costs more than any other error here could. Corrected
throughout. `case-study-plan.md` and `booking-engine-plan.md` carried the same
wrong figure and have been corrected too.

Four of the fifteen (`RULE-011` to `RULE-014`) are rule slots filled differently by
each tenant, in the same way `RULE-002` is. They are still fifteen numbered rules
in the engine, so the figure is defensible as written, but do not let it drift into
"fifteen rules per practice", which would not be true.

**Still to check before this is designed:**

- Confirm that neither Thackray Vane nor Marbury Hale collides with a live UK
  practice. The copy names both repeatedly and a collision is a real problem.
- Verify the six rows in §7 against the live prototype once more at design stage.
  Every figure and quoted behaviour on this page has to survive a reader checking
  it in the browser, which is the whole premise.
</content>
</invoke>
