# PureMed — Social Voice Layer

**Canonical voice lives in `.claude/puremed-brand-identity.md` (Voice and Tone section). Read it first — this file only adds the social-specific layer on top. If anything here conflicts with the brand identity file, the brand identity file wins.**

Brand character in one line: expert, warm, honest, confident, reassuring — a one-to-one clinic run by a medical professional, never corporate, never salesy.

## Social-specific rules

**Structure**
- First line is the hook — it must earn the tap on "more". No throat-clearing ("At PureMed we believe…").
- Short paragraphs, generous line breaks. One idea per post.
- Exactly one CTA per post, at the end. Consultation-led: "Book a consultation", "Send a photo for honest advice", "Ask me about it". Never "Don't miss out" / urgency tactics.
- British English throughout.

**Instagram captions**
- Hook within the first 125 characters (before truncation).
- 3–6 hashtags, at the end, on their own block. Mix local + treatment: #WinslowAesthetics #BuckinghamshireAesthetics #SkinTightening #LaserLift #MedicalAesthetics — never hashtag walls, never #beauty-tier generic tags.
- Emoji: 0–3 per post, functional not decorative. No sparkles-spam.
- No link in caption (IG doesn't link) — CTA points to "link in bio" or DM.

**Facebook captions**
- Slightly shorter and more conversational than IG. Reads like Nafisa talking to a local community group.
- 0–2 hashtags max.
- Booking link included directly (FB links work): use the bookingUrl from client.json.

**Humanise pass (mandatory before a post is marked drafted)**
Read every caption aloud once and fix anything that sounds like a language model:
- **No em dashes (—), ever.** Use a comma, colon, or full stop. En dashes in ranges (3–6 months) are fine.
- No "isn't just X, it's Y" constructions, no "Here's the truth/thing" openers. Say the thing.
- Vary sentence rhythm — not every paragraph gets a short punchy fragment, and lists of three are a tell when every post has one.
- Contractions everywhere a person would use them.
- If a sentence would survive on any clinic's account, cut or sharpen it until it's Nafisa's.
`content-lint.js` enforces the mechanical subset (em dash is a blocking error); the rest is judgement.

**Never**
- Price as the hook, discounts, flash offers.
- "Results guaranteed", "erase your wrinkles", transformation-promise language — results-focused but realistic, "results vary" framing where results are discussed.
- Prescription-only medicine brand names (see compliance.md — hard rule).
- Vague wellness filler ("your natural beauty journey").
- Overcomplicated medical jargon — explain like a trusted expert friend.

**Always**
- The reader is the subject ("your skin", "you'll notice"), not the treatment.
- Empowerment and confidence, ageing well naturally — never anti-ageing shame.
- Nafisa's first-person voice where natural ("I often get asked…") — it's her clinic and her face on the account.
