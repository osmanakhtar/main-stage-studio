# MSS Clinic Content Engine — End-to-End POC Plan

*Created: 24 July 2026*
*Status: PROPOSAL — supports `mss-positioning-v4-vertical.md`, `mss-clinic-content-model.md`, `mss-clinic-case-study-and-metrics.md`. Nothing here is canon until the founder signs it off and the decisions log is updated.*

**Purpose:** stand up a working proof that the content engine runs a scheduled campaign end to end and publishes to Instagram, so "See the machine" is a live, clickable thing rather than a claim.

**Decisions taken (24 Jul):**
- **Account:** an MSS-owned reference account (not a live client), so the proof is unblocked by consent or compliance risk.
- **Publish step:** manual now, Meta auto-publish deferred to Phase 2. The claim stays "reviewed, approved, published," which is true regardless of mechanism.

---

## 1. What the POC proves, and what it deliberately does not

**It proves (the pipeline machine):**
1. Campaign intent becomes a scheduled calendar across the six pillars. *(campaign builder)*
2. The calendar becomes produced posts: designed, clipped, captioned in voice, compliance-linted. *(Studio pipeline)*
3. Every post is reviewed and approved in Stage before it goes anywhere. *(Stage, live)*
4. Approved posts publish to a real Instagram feed on the scheduled dates. *(manual for the POC)*
5. Output is tracked: cadence held, volume, compliance pass rate, reach. *(metrics tracker)*

**It does not prove (needs a real clinic, i.e. PureMed):**
- **A real content day.** A reference clinic has no real practitioner or patients, so the capture-dependent pillars are produced from illustrative/generated assets, not a live half-day shoot. The content-day capture link is *simulated* here.
- **Business outcomes (metrics Tier 1-2).** No real patients means no real consults or bookings to attribute. The demo proves the machine and reach (Tiers 3-4), not revenue.

This boundary is why the reference POC and the PureMed case study are **complementary, not redundant**: the POC is the always-available proof that the machine runs; PureMed is the proof that it worked for a named business. Build the POC now (unblocked); keep PureMed as the outcome proof.

---

## 2. The reference account — honest framing (guardrails)

A demo account must not deceive. It is built as an openly labelled demonstration brand, never as a real practice.

- **Bio labels it plainly:** "A demonstration clinic brand by Main Stage Studio — showing how we run clinic content." No pretence of being a real business taking patients.
- **No fabricated real-patient results.** The Results pillar is demonstrated with clearly *illustrative* imagery (labelled as such, generated or stock), never fake before/afters passed off as real people's outcomes.
- **POM-safe by design.** The demo deliberately shows compliant handling (no prescription-medicine naming/promotion, substantiated claims), because demonstrating the compliance layer is part of the proof, not an obstacle.
- **A plausible but clearly-demo identity:** one fictional clinic name + brand + voice, built through the normal MSS discovery-lite process so the voice is real, not generic.

If any of these guardrails feels off once it's live, stop and reframe before posting.

---

## 3. POC campaign scope

One time-boxed campaign, sized to be real but finishable.

- **Shape:** a 3-week launch-style campaign for the demo clinic (mirrors a real Clinic Monthly cycle).
- **Volume:** ~12 posts across the six pillars, weighted per `mss-clinic-content-model.md` §3 (Education 4, Results 2 illustrative, Practitioner 2 illustrative, Experience 1, Patient voice 1 illustrative, Offers 2).
- **Cadence:** 4 posts/week on defined dates, so "held the schedule" is a checkable fact.
- **Voice + compliance:** captions in the demo clinic's voice file; every post through the POM-grade lint before Stage.

---

## 4. The end-to-end run

| Link | Tool (built) | POC action |
|---|---|---|
| 1. Intent → schedule | Campaign builder | Enter campaign intent, generate the dated calendar across pillars |
| 2. Schedule → posts | Studio pipeline (design, clip, caption, finishing) | Produce all 12; capture-dependent pillars use labelled illustrative assets |
| 3. Posts → approval | Stage (`mss-review.duckdns.org`) | Every post reviewed and approved per section, sign-off logged |
| 4. Approval → live | **Manual publish** | Approved posts published to the reference IG on the scheduled dates |
| 5. Live → tracked | Metrics tracker | Log cadence, volume, compliance pass rate, reach weekly |

---

## 5. Deliverables (the proof itself)

1. **The live reference IG feed** — a real, on-brand, on-schedule grid a buyer can open.
2. **A recorded machine walk-through** — screen capture of the flow: campaign builder → calendar → Studio production → lint → Stage approval → scheduled publish. This is the raw material for the site's "See the machine" section.
3. **The metrics tracker** — the operational (Tier 4) + reach (Tier 3) run, proving cadence held and compliance passed. Schema per `mss-clinic-case-study-and-metrics.md` Part B, minus the business-outcome columns (N/A for a demo).
4. **A one-page proof summary** — "one operator, one campaign, 12 compliant posts, published on schedule, every post reviewed," with links to the feed and the recording.

---

## 6. Metrics for the demo

Only the tiers a demo can honestly fill:
- **Tier 4 — Operational (the headline for the machine proof):** posts published, weeks missed (target zero), compliance pass rate, sign-off cycle time, one-operator throughput.
- **Tier 3 — Reach:** impressions, reach, engagement on the demo feed (context, weak alone, honest about the audience being cold).
- **Tiers 1-2 (business outcome / demand) stay empty here** and are explicitly deferred to PureMed. Do not manufacture them for a demo.

---

## 7. Phase 2 — true auto-publish (deferred)

Upgrades link 4 from manual to automated, turning "reviewed, approved, published" into "and it publishes itself." Scoped already in `fightstar-championship/fsc-ig-publishing-plan.md` + the P0 runbook: Business account, Facebook Page link, Meta app + review, `instagram_content_publish` via the Graph API. Trigger this when a paying clinic needs it or when the FSC publishing work forces it, not before. The POC does not wait on it.

---

## 8. Sequencing

1. Founder sign-off on this plan + the reference-account framing (§2).
2. Build the demo clinic identity (name, brand, voice file) via discovery-lite.
3. Create the reference IG account with the labelled demo bio.
4. Run the campaign through links 1-3 (build + Stage approval), recording the walk-through as you go.
5. Publish links 4 on schedule over 3 weeks; log Tier 3-4 metrics weekly.
6. Assemble the proof summary + walk-through recording; feed into the "See the machine" site section.
7. Decisions log updated with whatever locks (standing rule).

---

## 9. Open decisions

| # | Decision | Recommendation |
|---|---|---|
| 1 | Reference-account honest framing (§2) | Adopt as written; demo, labelled, no fabricated results |
| 2 | Demo clinic identity | Build one fictional clinic via discovery-lite so the voice is real |
| 3 | Campaign size | 3 weeks, ~12 posts, 4/week on fixed dates |
| 4 | Metrics scope for the demo | Tier 3-4 only; business outcomes deferred to PureMed |
| 5 | Phase 2 auto-publish trigger | First paying clinic or FSC publishing work; not before |

---

## 10. Resume prompt

`Read 01_mss/strategy/mss-clinic-poc-plan.md, take my verdicts on §9, build the demo clinic identity + reference IG, then run the 12-post campaign end to end through the engine and Stage with manual publish, recording the machine walk-through.`
