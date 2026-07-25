# Vera Aesthetics — Asset Placement Manifest

*Created: 24 July 2026*
*Source: reused from Osman's existing Higgsfield generations (1 + 4 July, originally PureMed-direction). Person-free / generic-face subset only. No real client (Nafisa) images, no PureMed branding.*
*Status: DEMONSTRATION assets for the Vera POC. Results imagery is illustrative, never fabricated real patients.*

**Palette flag:** Vera's palette is navy + bone + gold (decided 24 Jul, see `../vera-brand-identity.md`), which these images were generated in, so every row is native. "neutral" rows are palette-flexible skin shots; "navy" rows carry the deep-navy/gold environment on-brand.

**Face flag:** "none" = no person. "anon" = partial/cropped, unidentifiable. "generic" = a full AI-generated face with no real identity; usable as ambience only, never as a recurring "Vera practitioner."

| File | Scene | Pillar | Aspect | Palette | Face | Suggested post use |
|---|---|---|---|---|---|---|
| results-skin-neck-4x5.png | Lower face + neck, hydrated glow | Results / skin-health | 4:5 | neutral | anon | Hero skin-quality post; "your skin, better rested" |
| results-skin-neck-3x4.png | Same scene | Results | 3:4 | neutral | anon | Web/story crop variant |
| results-skin-jawline-4x5.png | Cheekbone + jawline luminous | Results | 4:5 | neutral | anon | Skin-health education carousel cover |
| results-skin-jawline-3x4.png | Same scene | Results | 3:4 | neutral | anon | Crop variant |
| results-skin-macro-2k.png | Cheek / upper-lip macro texture | Education / Results | ~4:3 | neutral | skin only | "What healthy skin actually looks like" education |
| results-skin-macro-alt.png | Same scene, alt model | Education | ~4:3 | neutral | skin only | Carousel inner slide |
| treatment-rf-handpiece-4x5.png | Gloved hand, RF handpiece near jaw | Experience / treatment b-roll | 4:5 | slight navy | generic | "What to expect" treatment walkthrough |
| treatment-rf-handpiece-3x4.png | Same scene | Experience | 3:4 | slight navy | generic | Crop variant |
| treatment-marking-4x5.png | Gloved hands marking guide dots | Treatment b-roll | 4:5 | neutral | anon | Process/precision education |
| treatment-marking-3x4.png | Same scene | Treatment | 3:4 | neutral | anon | Crop variant |
| experience-laser-room-4x5.png | Device on trolley, empty chair, clinic room | Experience / BTS | 4:5 | navy | none | "Inside the clinic" tour post |
| experience-laser-room-3x4.png | Same scene | Experience | 3:4 | navy | none | Crop variant |
| experience-consult-4x5.png | Practitioner + patient at consult desk | Experience / patient-journey | 4:5 | navy | generic | "The consultation is the product" post |
| experience-consult-3x4.png | Same scene | Experience | 3:4 | navy | generic | Crop variant |

## Pillar coverage from this bank

- **Results / skin-health:** fully covered (6 skin assets).
- **Experience / BTS / treatment b-roll:** fully covered (8 assets).
- **Education:** partly covered via skin macro; the rest are typographic/graphic (built from the brand system, no photography needed).
- **Offers:** typographic/graphic, no photography needed.
- **Practitioner authority:** deliberately NOT covered by photography, handled as text-forward quote cards. No usable real practitioner exists for a fictional clinic.
- **Patient voice:** typographic testimonial treatment + optional generic ambience; no fabricated real patients.

## Notes

- **WebP conversion DONE (24 Jul).** `webp/` holds q=90 derivatives of all 14: **177M of PNG became 7.4M, a 95.8% saving**, with dimensions preserved and no visible loss (SSIM 0.95-0.98; PNG, q=90 and q=80 were indistinguishable at 100% zoom on skin macro, the hardest content in the bank). Two things make this safe: the masters are 1.7x to 4x larger than the 1080x1350 IG target, and Instagram re-encodes to its own lossy format regardless.
- **`webp/` is the working set.** Studio, the slide renderer and publishing all read from it, and it is what gets committed. The PNGs in this folder are the archival originals, kept local and in Dropbox and **git-excluded** (the Higgsfield sub is lapsed, so they are not cheaply regenerated). Each `image-library.json` entry carries both: `source` (WebP) and `master` (PNG).
- Lossless WebP was measured too, at 84M (a 48% saving with mathematically zero loss). It was not chosen because q=90 is already visually transparent at 7.4M, but it is the option if a true lossless working copy is ever wanted.
- 4:5 versions are the IG-native crops; 3:4 are web/story alternates. The six 3:4 files are 3456x4608 and were 122M of the original 177M, so they carry most of the saving.
- Excluded from this bank and NOT downloaded: all "Nafisa" images, all identity-preserved "reference photo" shots, PureMed-signage shots, and the FSC/MMA branding plates.
