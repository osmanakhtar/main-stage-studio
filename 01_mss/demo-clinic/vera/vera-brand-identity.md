# Vera Aesthetics — Brand Identity

*Created: 24 July 2026*
*Status: DEMONSTRATION BRAND. Vera Aesthetics is a fictional clinic built by Main Stage Studio to prove the content engine end to end. It is not a real business and takes no patients. Every public surface labels it as an MSS demonstration.*
*Purpose: give the clinic content POC a real, coherent world to run through the engine, deliberately distinct from the MSS house identity.*

---

## 1. The clinic in one line

> A nurse-prescriber-led aesthetics clinic for people who want to look like themselves, on a good day, not like they had work done.

## 2. Positioning

**Who it is:** owner-operated, led by an aesthetic nurse prescriber. One accountable practitioner, not a chain. Consultation-led, unhurried, safety-first.

**What it stands against:** the overdone, hard-sell end of aesthetics. No trends pushed, no pressure, no "while you're here." The clinic sells restraint and judgment, not volume.

**The patient:** 30-55, wants subtle enhancement, is quietly nervous about looking "done," and values honesty and expertise over the newest thing. They have researched, they are cautious, and they will choose the practitioner they trust, not the cheapest syringe.

**Why this positioning was chosen (POC logic):** "natural results, education-first, no pressure" is the most content-rich and most compliance-safe angle available. It generates near-infinite education and authority content, it sells trust rather than named prescription products, and it demonstrates the POM-grade compliance layer as a feature, not a constraint.

## 3. Service pillars

Real-shaped services for a nurse-led natural-results clinic. These map straight onto the content pillars in `mss-clinic-content-model.md`.

| Service | Public framing (compliance-safe) |
|---|---|
| Wrinkle-softening treatments | Prescription-only, so **never named as a product**. Framed as "wrinkle-softening" / "anti-wrinkle treatment" |
| Dermal filler | A medical device, so nameable. Framed around subtlety: restoring, not changing |
| Skin health (boosters, polynucleotides) | Skin quality and longevity, the "no-one-can-tell" category |
| Medical-grade skincare and facials | The entry point; trust-building, low-commitment |
| Consultation-led planning | The differentiator: a plan, not a menu. The consult is the product |

## 4. Aesthetic direction

Calm, clinical, warm. Editorial rather than salesy. The feeling of a quiet, light-filled room, not a promotional grid.

**Three words for the world:** calm, honest, considered.

**Off-limits (hard):**
- No electric or cyan "medical-tech" blue, no teal. Vera's navy is deep and warm, not clinical.
- No gradient backgrounds, no glow effects.
- No stock "woman admiring herself in a mirror" or "gloved hands with syringe" imagery.
- Before/after is never the hero. Results are shown quietly and compliantly, never as the loud opener.

## 5. Palette

Deliberately separated from the MSS terracotta/parchment system. Deep navy, warm bone, and champagne gold: calm, premium, clinically credible. Chosen to sit natively with the clinic's existing photography.

```css
--vera-bone:  #F5F2EC;  /* warm off-white — primary background */
--vera-navy:  #1E2B4D;  /* deep navy — primary brand, dark sections */
--vera-ink:   #141A2B;  /* near-black navy — text */
--vera-stone: #DCD9D2;  /* soft neutral greige — secondary */
--vera-gold:  #C6A667;  /* champagne gold — accent only (rules, frames, small marks) */
```

Usage: bone and navy carry the work; navy is the signature; stone is the soft neutral; gold is a thin accent (rules, frames, small marks), never a fill.

## 6. Typography

Google Fonts, so the POC site and posts are buildable immediately. Chosen to feel unlike the MSS pairing.

- **Display:** Fraunces — a soft, high-contrast serif with an organic, natural character. Headlines, the wordmark feel.
- **Body:** Hanken Grotesk — a clean, humanist sans. Calm and legible for captions and body.

Rules: generous line-height, real negative space, left-aligned. No condensed all-caps, no tight tracking.

## 7. Logo direction

A lowercase wordmark, "vera," set in Fraunces, paired with a single quiet mark: a simple leaf/petal arc that reads as growth and naturalness without being literal. Restraint is the point.

Minimal mark concept (placeholder, refine or regenerate before use):

```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 34 C12 20, 24 10, 36 12 C36 26, 24 36, 12 34 Z" fill="none" stroke="#1E2B4D" stroke-width="2"/>
  <path d="M18 30 C24 24, 30 20, 34 16" fill="none" stroke="#C6A667" stroke-width="2" stroke-linecap="round"/>
</svg>
```

A single leaf outline in navy with a champagne-gold vein: natural results, clinically framed. Wordmark sits to its right in Fraunces, lowercase. The real mark can be generated cleanly later; this fixes the direction.

## 8. Compliance notes (carried into every post)

- **Nurse prescriber** is the trust anchor and can be stated.
- **Prescription-only medicines are never named or promoted** to the public (this covers wrinkle-softening treatments). Copy uses non-product framing.
- **Before/after** content requires consent, must not mislead or trivialise, and never targets under-18s. For the POC demo, results are illustrative and labelled, never fabricated real patients.
- **Claims are honest and substantiated.** "Natural results" is a promise the whole brand keeps, so the copy never overpromises.

## 9. Voice

See `vera-tone-of-voice.md`. In one line: honest, calm, expert. The reassuring voice of a practitioner who would rather talk you out of a treatment than sell you one you do not need.
