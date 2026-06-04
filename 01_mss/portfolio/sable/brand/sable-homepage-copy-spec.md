# Sable — Homepage Copy and Layout Spec

*Client document. Built by Main Stage Studio, 31 May 2026.*
*Read alongside sable-brand-brief.md and sable-tone-of-voice.md.*
*This document is the build brief for Claude Code.*

---

## How to read this document

Each section has three parts:

- Copy: the exact words, exactly as they appear on the page
- Layout notes: structural decisions for the build
- What it's doing: the intent, so nothing gets changed without understanding what would be lost

Do not add copy. Do not expand sections. Do not introduce headings or labels that aren't here.
Sparse is the point.

---

## Section 01 — Arrival

*Full viewport height. This is the only thing on screen before the user scrolls.*

### Copy

```
sable

london

born in london. made nowhere.

listen
```

### Layout notes

- Full viewport: min-h-[100dvh]
- Background: bone #F0E8D8
- Left-aligned, always. No centred type.
- `sable`: display serif, large, tracked wide, near-black #0D0C0B. Dominant element.
- `london`: beneath the wordmark, small, tracked very wide, gold #C89442. Same left edge as wordmark.
- Gap between wordmark block and the copy line: generous. The space is intentional.
- `born in london. made nowhere.`: serif, medium scale, near-black. Not a headline size. Not body size. Between the two. Left-aligned.
- `listen`: single word CTA. Small, tracked wide, near-black. Sits below the copy line with breathing room. Subtle underline on hover, no button, no border, no fill.
- Photography: right half of the viewport or full bleed behind left-aligned type with dark overlay. Intimate and cinematic register. Warm, low light. Her face or detail, never full performance shot.
- Navigation: wordmark only top-left at small scale. Three nav items top-right: music, shows, connect. All lowercase, tracked, no decoration.

### What it's doing

The arrival says everything and explains nothing. The wordmark is the subject. The descriptor places her. The copy line claims origin and refuses category in the same breath. The CTA is the only action available. One word. No pressure. The page trusts the visitor to choose.

---

## Section 02 — Music

*The work. Nothing describes it. It just exists here.*

### Copy

```
the music

some things don't have a name yet.
this does.

[track or EP listing]

listen
```

### Layout notes

- Background: transitions to night #0D0C0B as section enters viewport. Scroll-triggered, not instant.
- `the music`: section label, small, tracked wide, gold #C89442. Not a heading. A marker.
- The two copy lines: serif, medium scale, bone #F0E8D8. Left-aligned. Line break exactly as shown.
- Track or EP listing: minimal. Track name in bone serif. Duration or release date in ash #3D3530, small. No genre labels. No descriptions. No play count.
- `listen`: links to streaming platform. Same treatment as arrival CTA. Bone on dark.
- Photography or visual: one image per track or one section image. Dark, atmospheric. The otherworldly register starts to emerge here.
- No album art in the conventional sense. The photography is the art direction.

### What it's doing

The copy acknowledges the genre question without answering it. It positions the music as something that exists on its own terms. The listing is purely functional: name and time. Nothing editorialises the work. The listener decides.

---

## Section 03 — Connect

*The only place she speaks directly. One line. One action.*

### Copy

```
stay close.

[email input]

write
```

### Layout notes

- Background: returns to bone #F0E8D8 or stays dark, designer's call based on visual rhythm of the full page.
- `stay close.`: serif, medium scale, near-black on bone or bone on dark. Left-aligned.
- Email input: minimal. No label, no placeholder text beyond a thin cursor. 1px bottom border only, no box. Near-black on bone or bone on dark.
- `write`: submit CTA. Single word. Same treatment as listen throughout.
- No privacy policy copy on the page itself. Handle in footer or on submit.
- Section is short. It doesn't need to do more than this.

### What it's doing

Stay close is the warmest thing on the site and it still doesn't explain itself. It's an invitation without a sales pitch. The input and CTA are so minimal they don't feel like a form. It feels like leaving a note.

---

## Footer

### Copy

```
sable
london

c. 2026
```

### Layout notes

- Background: night #0D0C0B
- Wordmark and descriptor repeated small, left-aligned, bone.
- Copyright line: very small, ash #3D3530. Right-aligned or left-aligned, consistent with overall grid.
- No links. No social icons in the footer. If social is needed, it lives in the navigation.
- No legal copy in the footer at this stage.

---

## Navigation

### Copy

```
sable          music   shows   connect
```

### Layout notes

- Position: fixed top, full width.
- Background: transparent over photography, bone or dark depending on section in view.
- `sable`: wordmark at small scale, top-left. Links back to top of page.
- Nav items: top-right, lowercase, tracked, small. No active state decoration beyond a subtle gold underline on current section.
- No hamburger menu at this stage. Three items fit inline.
- On mobile: wordmark left, single menu icon right. Nav items drop as a full-screen overlay, bone background, large type, centred.

---

## Motion notes

These are the only motion moments on the page. Nothing else moves.

- Section 02 background transition: bone to night on scroll entry. Smooth, approximately 600ms, opacity and background colour via CSS transition.
- Photography reveal: single image per section fades in on scroll entry. Opacity 0 to 1, 800ms, no movement.
- CTA hover: underline draws left to right on hover. 300ms. No other state change.
- Navigation: transparent to solid background as user scrolls past the first viewport. 400ms opacity transition.

Everything else is still. The stillness is part of the voice.

---

## What Claude Code needs to build this

Attach to every Claude Code session for this project:

- sable-brand-brief.md
- sable-tone-of-voice.md
- this document: sable-homepage-copy-spec.md

Stack: HTML, CSS, Tailwind. Single page. No framework.
Fonts: Cormorant Garamond and Plus Jakarta Sans via Google Fonts.
Photography: placeholder for now. Dimensions and crop noted per section above.
No JavaScript framework. Vanilla JS for scroll triggers only.

