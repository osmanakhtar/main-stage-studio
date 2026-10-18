# Vera Aesthetics: Brand Identity

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
--vera-bone:  #F5F2EC;  /* warm off-white: primary background */
--vera-navy:  #1E2B4D;  /* deep navy: primary brand, dark sections */
--vera-ink:   #141A2B;  /* near-black navy: text */
--vera-stone: #DCD9D2;  /* soft neutral greige: secondary */
--vera-gold:  #C6A667;  /* champagne gold: accent only (rules, frames, small marks) */
```

Usage: bone and navy carry the work; navy is the signature; stone is the soft neutral; gold is a thin accent (rules, frames, small marks), never a fill.

## 6. Typography

Google Fonts, so the POC site and posts are buildable immediately. Chosen to feel unlike the MSS pairing.

- **Display:** Fraunces: a soft, high-contrast serif with an organic, natural character. Headlines, and the outlined source of the wordmark.
- **Body:** Hanken Grotesk: a clean, humanist sans. Calm and legible for captions and body.

Rules: generous line-height, real negative space, left-aligned. No condensed all-caps, no tight tracking.

## 7. Logo: "vera." (the full stop)

*Replaced the placeholder leaf on 18 Oct 2026. A leaf is the most worn trope in aesthetics and wellness; it said "template", which is the wrong thing for a brand that shows off MSS's brand work.*

**The idea.** The wordmark ends on a single champagne-gold point. One dot, three readings:
- **The planning mark.** Before treating, the practitioner marks the face with small dots. The plan is the product, and the point is that mark.
- **Truth, full stop.** *Vera* is Latin for "true". The point closes the statement: honest, nothing added.
- **The end of the sell.** No "while you're here". The sentence stops where it should.

**Construction.** Lowercase "vera" in Fraunces, outlined (not live type) at a tuned instance: opsz 144, wght 320 (the light touch), SOFT 100 (warmth), WONK 0 (calm). Hand-kerned (v-e, r-a tightened). The point is a true circle about one stem wide, sitting on the baseline, so it reads as a deliberate mark rather than punctuation. Navy word, gold point; on navy the word turns bone and the point stays gold.

**The set** (all in `brand/logo/`, generated by `build-logo.py`; edit the script, never the SVGs):

| File | Use |
|---|---|
| `vera-logo.svg` / `.png` | Primary. On bone, white, stone |
| `vera-logo-light.svg` / `.png` | On navy and on photography |
| `vera-monogram(-light).svg` / `.png` | "v." for the logo bug, stamps, small marks |
| `vera-avatar.svg` / `.png` | Social avatar and app icon (bone "v." on navy) |
| `vera-favicon.svg` / `.png` | 16 to 48px; the point is optically enlarged so it survives |

The script also writes the copies other surfaces read: Content Studio `assets/vera-mark(-light).png` + `vera-mark.svg` (now the monogram), and the studio-platform tenant `brand/logo-header.png` (bone, console navy bar), `logo-email.png` (navy, white email header), `logo-footer.png` (bone, navy email footer).

**Rules.**
- The point is always gold and never removed: without it the mark is just a typeset word.
- Clear space: the width of the point's diameter times two on every side.
- Minimum size: wordmark 72px wide on screen; below that use the monogram, below 48px the favicon.
- Never recolour the word gold, never outline it, never set "vera" in live Fraunces as a stand-in for the logo.
- The point can travel as a brand device on its own (bullets, frame markers, a loading state), but only in gold and only one per view.

## 8. Compliance notes (carried into every post)

- **Nurse prescriber** is the trust anchor and can be stated.
- **Prescription-only medicines are never named or promoted** to the public (this covers wrinkle-softening treatments). Copy uses non-product framing.
- **Before/after** content requires consent, must not mislead or trivialise, and never targets under-18s. For the POC demo, results are illustrative and labelled, never fabricated real patients.
- **Claims are honest and substantiated.** "Natural results" is a promise the whole brand keeps, so the copy never overpromises.

## 9. Voice

See `vera-tone-of-voice.md`. In one line: honest, calm, expert. The reassuring voice of a practitioner who would rather talk you out of a treatment than sell you one you do not need.
