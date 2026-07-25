# Vera Aesthetics — Content Compliance Rules

**Hard rules for all public social content. Human-authored — agents never edit this file. Every generated post must pass this checklist before entering review, and `content-lint.js` enforces the machine-checkable subset (`lint-rules.json`).**

Context: Vera Aesthetics is an openly-labelled **demonstration** brand built by Main Stage Studio to prove the content engine, modelled as a UK nurse-prescriber-led aesthetics clinic. It is held to the same UK advertising rules (ASA/CAP Code) and MHRA regulations as a real clinic — an organic Instagram post from a clinic account counts as advertising. Demonstrating the POM-grade compliance layer as a working feature is a core purpose of the POC, so these rules are enforced for real, not simulated.

## 0. Demonstration guardrails (POC-specific)

- Every public surface is labelled a Main Stage Studio demonstration brand. Never present Vera as a real, patient-taking business.
- **No fabricated real-patient results.** All results and testimonial content is illustrative and labelled as such. In a real clinic each would require documented, consented wording.
- No real practitioner identity is invented or depicted. Practitioner authority is text-forward (quote cards), never a fake face presented as "the Vera nurse".

## 1. Prescription-only medicines (POMs) — the big one

**It is illegal to advertise POMs to the public (CAP Code 12.12 / Human Medicines Regulations 2012).** Botulinum toxin is a POM.

- **Never** name botulinum toxin brands in any post: Botox, Bocouture, Azzalure, Dysport, Xeomin, Vistabel, Letybo — nor "botulinum toxin" itself as a promoted product.
- Wrinkle-softening content is allowed but must be **consultation-led** and **product-free**: frame as "wrinkle-softening treatment" or "anti-wrinkle treatment", discuss the concern and the consultation process — never the drug, its price, or an offer on it.
- Never attach a price, discount, or availability claim to wrinkle-softening treatment.
- The `wrinkle-softening` service is flagged `pomSensitive: true` in client.json — the generator applies these constraints automatically, and lint treats violations as errors.

Non-POM services (dermal filler as a medical device, skin health/boosters/polynucleotides, medical-grade skincare and facials, the consultation itself) may be named and discussed, subject to the rules below. If any new service involves a POM, add it here and flag it in client.json before any content is generated for it.

## 2. Claims

- No efficacy claims beyond what a nurse-led natural-results clinic could honestly stand behind. "Natural results" is a promise the whole brand keeps, so copy never overpromises.
- No "guaranteed", "permanent", "painless", "risk-free", "no downtime", "clinically proven" (unless we hold the specific evidence), "erase/eliminate".
- Where results are discussed, use realistic framing — results vary by individual; state timelines only as honest ranges.
- No superlatives about the clinic ("best in…", "#1").

## 3. Imagery

- **Before/after is never the hero.** Real before/afters need documented consent per image and platform-policy review — out of scope for pipeline content, manual one-off approval only.
- Reused AI-generated imagery is **scene-setting only** (skin texture, clinic room, treatment b-roll). No imagery that depicts or implies a specific treatment result on an identifiable face.
- Excluded from the asset bank entirely: any real practitioner (Nafisa) images, identity-preserved reference shots, and other clients' branding.
- Nothing that could appeal to or target under-18s; no imagery sexualising or shaming the subject. Cosmetic-procedure content respects Meta's 18+ norms.

## 4. Tone-level compliance

- No pressure or urgency tactics ("last chance", countdowns) — both off-brand and an ASA sore spot for cosmetic procedures.
- No trivialising language about injectable or medical procedures ("lunchtime tweakment", "quick jab").
- No manufactured hype ("amazing", "flawless", "transformation") — the brand sells restraint and judgment.
- Financial inducements (competitions, referral rewards) are out of scope for the pipeline — manual, case-by-case only.

## 5. Escalation

If a calendar slot or brief can't be fulfilled without breaching a rule, the post is written to comply or the slot is dropped — never "soften" a rule. Ambiguity = flag for Osman. Because Vera is a demonstration, the accountable-advertiser role is played by MSS, and the rules are applied as if a real prescriber were accountable.
