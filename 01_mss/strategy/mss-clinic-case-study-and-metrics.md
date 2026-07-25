# MSS Clinic Case Study — PureMed Structure + Metrics to Track Now

*Created: 24 July 2026*
*Status: PROPOSAL — supports `mss-positioning-v4-vertical.md` (the clinic bet) and `mss-clinic-content-model.md`. Nothing here is canon until the founder signs it off and the decisions log is updated.*
*Companion docs: `mss-positioning-v4-vertical.md`, `mss-clinic-content-model.md`. Structure aligns to `.claude/mss-new-case-study-checklist.md` (locked).*

**Purpose:** two things, so the named clinic case study is ready the moment it can truthfully be published. (1) The case-study structure, PureMed-specific, inside the locked framing+full format. (2) The metrics to start capturing on PureMed *now*, because a case study without an outcome number undersells at £2-4k/mo, and every week without a baseline loses fidelity.

**The gate (from `mss-clinic-content-model.md` §9.6):** publish only when there is a *name* (PureMed consent) AND a *number* (a defensible outcome). This doc is how the number becomes available.

---

## Part A — Case-study structure

### Format is locked, not reinvented
Follows `mss-new-case-study-checklist.md`: a **framing page** (the invitation) and a **full case study** (the story), both written before anything is designed, both in PureMed's creative identity, never the MSS house look. This doc only fills that structure with PureMed-specific content and adds the one dimension the checklist (written for build engagements) does not cover: **an ongoing content-operation, not a one-off build**.

### What makes this case different from Sable/Apex
Sable and Apex are build stories: strategy, identity, a site. PureMed is a **Run** story: a machine that keeps producing, compliantly, week after week. So:
- "What was built" becomes "**what was built and what keeps running**" — the site *and* the operating system behind the content.
- "Outcomes" carries **two layers**: the operational proof (the machine works) and the business proof (it moved the numbers). Part B feeds this section.
- This is the case study that proves the *entire v4 offer*, not just a craft sample.

### Framing page (3-4 sentences)
Opens in PureMed's world, not MSS's process. The felt problem of an owner-operated clinic: the work is good, the presence can't keep up, and hiring is the wrong-shaped fix. Makes a clinic owner recognise themselves and want the full story. Does not summarise the outcome.

### Full case study — sections (locked list, PureMed content)

| Section | What it holds for PureMed |
|---|---|
| **Client and context** | Who PureMed is, what they treat, the kind of patient they serve, why the work matters beyond the commercial |
| **The challenge** | Good clinic, thin/inconsistent presence; recurring, compliance-sensitive content demand with no sane in-house way to run it; the staffing trap |
| **The strategic insight** (one sentence) | The unlock. Candidate: *a clinic does not need a content creator, it needs a system that turns one morning every six weeks into a month of compliant, on-voice content.* Confirm as one clean sentence before design |
| **What was built and what keeps running** | The Astro site + the operating system: the pillar model, the content-day capture, the finish-and-schedule pipeline, Stage sign-off, POM-grade compliance on every post. Told as capability, not a deliverable list |
| **Outcomes** | Two layers (see Part B): operational proof always available; business proof from the best attribution tier reached. The headline number lives here |
| **Reflection** | One honest paragraph: what worked, what you would do differently. Room to name the ramp (banks compound over the first months) honestly |

### Design brief (per locked rule)
PureMed's world in three words; references outside the web; minimum two off-limits conventions. Typography/colour/layout chosen independently. If it starts looking like the MSS site, stop and restart. (PureMed brand already exists in `other-projects/puremed/` working files — pull the identity from there, keep working files in place, copy only presentable material into `01_mss/portfolio/puremed/`.)

### Dependencies before publish
1. **Consent to be named.** The whole value is the name. Reverse the current off-site lock (v3 §9 item 6 already recommends this once live) and get explicit PureMed sign-off to appear as a named case.
2. **A defensible outcome number** (Part B).
3. **Compliance scope clause** in place if the case study claims compliance as a safety promise (carries from v4 §9.6).
If consent is refused, this becomes an anonymised "a private medical aesthetics clinic" case, which is weaker; do not rush it in that form.

---

## Part B — PureMed metrics to track now

### The principle
The case study lives or dies on **one clear headline number**. Everything below exists to make at least one defensible headline available in 2-3 months. Track across four tiers, strongest to weakest, and capture a **baseline now** so the story can show a delta, not just a level.

### The four tiers of proof

| Tier | Evidence | Source | Strength | Depends on |
|---|---|---|---|---|
| **1 — Business outcome** | New-patient consults / enquiries / bookings attributable to social | Clinic booking system + attribution mechanism | Strongest (revenue-adjacent) | PureMed sharing data + an attribution method in place |
| **2 — Demand signals** | Profile visits, website/link clicks, "book" taps, DM enquiries, offer-post saves | Meta native insights (IG/FB) | Strong mid-funnel proxy | Access to the account insights (MSS runs the account) |
| **3 — Reach / growth** | Follower growth, reach, impressions, engagement rate, video views/retention | Meta native insights | Context, weak alone | Same as Tier 2 |
| **4 — Operational proof** | Assets produced/month, turnaround, consistency (weeks not missed), compliance pass rate, sign-off cycle time | Studio pipeline + Stage logs | The differentiator; uniquely ownable | Nothing external — always available |

**The move:** the Outcomes section pairs **Tier 4 (always available, proves the machine)** with **the best of Tiers 1-3 (proves it worked)**. Tier 4 alone still makes a real case ("40 compliant assets a month, one operator, zero missed weeks, every post reviewed"), so the case study is never fully blocked on the clinic's business data. Tier 1 is the prize; chase it, but don't be hostage to it.

### Attribution mechanisms to put in place now (unlocks Tier 1)
Without one of these, Tier 1 is unprovable. Cheapest first:
- **"How did you hear about us?"** field at booking, with a social option. Ask PureMed to add it. Lowest effort, decent signal.
- **Trackable link** (UTM) in bio and offer posts pointing at the booking page or a dedicated landing. Attributes clicks to social precisely.
- **Social-only promo code** on offer posts. Any redemption is unambiguous social-driven revenue.
- **Instagram "book" action button** + native insights on taps.
Recommend all four; they compound and cross-check.

### Baseline (do this first, it decays weekly)
Record the state *before* consistent MSS posting for every metric that has history:
- Meta insights: pull the 60 days prior to MSS taking over (followers, reach, profile visits, link clicks). If that window is already gone, capture the earliest available point now and note it as the baseline.
- Booking/enquiry volume: ask PureMed for the prior 1-3 months if they will share, even a rough monthly figure.
- Note the start date of consistent posting precisely; the whole delta hangs off it.

### Cadence and tracker
Monthly snapshot into an internal CSV (working data, not client-facing, so CSV is fine; if it ever goes into a client report, export via `csv-to-xlsx.py` per the XLS-only rule). Suggested schema:

```
month, posts_published, assets_produced, weeks_missed, compliance_pass_rate,
followers, follower_delta, reach, profile_visits, link_clicks, book_taps,
dm_enquiries, offer_saves, consults_attributed_social, notes
```

One row per month, starting with a `baseline` row. Store at `01_mss/portfolio/puremed/metrics/puremed-metrics.csv` when the portfolio folder is opened, or in the PureMed working folder until then.

### The headline you are hunting for
In priority order, whichever becomes true first and is defensible:
1. *N new-patient consults attributable to social over [period]* (Tier 1 — best).
2. *X% growth in social-driven booking-page clicks / book taps since [start]* (Tier 2 — strong, likely reachable).
3. *Follower/reach growth + the operational proof* (Tier 3+4 — the floor; always available).

Aim the tracking at (1); (2) is the realistic near-term win; (3) guarantees the case study is never empty.

### Honest risk
If PureMed will not share any booking or attribution data, Tier 1 is off the table and the headline is a demand-signal, not revenue. That still works, but set the expectation: the case study proves *momentum and machine*, and revenue is inferred, not claimed. Better an honest Tier 2 number than an invented Tier 1 one.

---

## Open decisions

| # | Decision | Recommendation |
|---|---|---|
| 1 | PureMed as the named clinic case | Yes, priority Work asset; gate on consent + number |
| 2 | Reverse the off-site lock on PureMed | Yes once live (carries from v3 §9.6); needs client comfort |
| 3 | Start metrics tracking now | Yes — capture baseline this week before it decays |
| 4 | Attribution mechanisms | Add all four (how-heard field, UTM link, promo code, book button) |
| 5 | Fallback if no attribution data | Publish on Tier 2+4; frame revenue as inferred, not claimed |

---

## Resume prompt

`Read 01_mss/strategy/mss-clinic-case-study-and-metrics.md, confirm PureMed consent + off-site-lock reversal, set up the metrics tracker and attribution mechanisms, and open the PureMed case-study folder per the locked framing+full structure.`
