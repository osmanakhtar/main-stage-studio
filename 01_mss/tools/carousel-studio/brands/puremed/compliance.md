# PureMed — Content Compliance Rules

**Hard rules for all public social content. Human-authored — agents never edit this file. Every generated post must pass this checklist before entering review, and `content-lint.js` enforces the machine-checkable subset (`lint-rules.json`).**

Context: PureMed is a UK medically-led aesthetics clinic. UK advertising rules (ASA/CAP Code) and MHRA regulations apply to social media posts exactly as they do to paid ads — an organic Instagram post from the clinic account counts as advertising.

## 1. Prescription-only medicines (POMs) — the big one

**It is illegal to advertise POMs to the public (CAP Code 12.12 / Human Medicines Regulations 2012).** Botulinum toxin is a POM.

- **Never** name botulinum toxin brands in any post: Botox, Bocouture, Azzalure, Dysport, Xeomin, Vistabel, Letybo — nor "botulinum toxin" itself as a promoted product.
- Anti-wrinkle content is allowed but must be **consultation-led**: promote "a consultation for lines and wrinkles", discuss the concern and the consultation process — not the drug, its price, or an offer on it.
- Never attach a price, discount, or availability claim to anti-wrinkle treatment.
- The `anti-wrinkle` treatment is flagged `pomSensitive: true` in client.json — the generator applies these constraints automatically, and lint treats violations as errors.

Non-POM treatments (Laser Lift, RF Microneedling, Polynucleotides, Skin Boosters as CE-marked devices, dermal fillers in Liquid Facelift) may be named and promoted, subject to the rules below. If any new treatment involves a POM, add it here and flag it in client.json before any content is generated for it.

## 2. Claims

- No efficacy claims beyond what the approved treatments page copy states. The website copy Nafisa signed off is the outer boundary of every claim.
- No "guaranteed", "permanent", "painless", "risk-free", "no downtime", "clinically proven" (unless we hold the specific evidence), "erase/eliminate wrinkles".
- Where results are discussed, use realistic framing — results vary by individual; state typical timelines only as ranges the site already states.
- No superlatives about the clinic ("best in Buckinghamshire", "#1").

## 3. Imagery

- **No before/after imagery in generated posts for now** — real before/afters need the client's documented consent per image and platform-policy review; treat each as a one-off manual approval with Nafisa, never pipeline-generated.
- No AI-generated imagery that depicts or implies treatment results on a face/body. Generated imagery is scene-setting only (clinic, texture, lifestyle).
- Nothing that could appeal to or target under-18s; no imagery sexualising or shaming the subject. Cosmetic-procedure content must respect Meta's 18+ targeting norms.
- No imagery implying medical outcomes ("her skin after one session…" over a stock-style face).

## 4. Tone-level compliance

- No pressure or urgency tactics ("last chance", countdowns) — both off-brand and an ASA sore spot for cosmetic procedures.
- No trivialising language about injectable or medical procedures ("lunchtime tweakment", "quick jab").
- Financial inducements (competitions, referral rewards) are out of scope for the pipeline — manual, case-by-case only.

## 5. Escalation

If a calendar slot or brief can't be fulfilled without breaching a rule, the post is written to comply or the slot is dropped — never "soften" a rule. Ambiguity = flag for Osman, who checks with Nafisa (she is the medical professional and accountable advertiser).
