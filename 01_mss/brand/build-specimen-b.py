#!/usr/bin/env python3
"""Build specimen B ("Curtain") from specimen A.

    python3 build-specimen-b.py

A (mss-v6-specimen.html) is the source of truth for layout, type, mark and pricing.
B swaps the palette only: A's dark/light roles are inverted (paper base, ink sections)
and Tungsten becomes Curtain red. Edit A, then rerun this; never edit B by hand.
Stage ids are prefixed b- so the two pages never share a comment anchor.
"""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, "mss-v6-specimen.html")
B = os.path.join(HERE, "mss-v6-specimen-b.html")

# A colour -> B colour. Stage Black and House Lights swap roles, so every
# "dark on light" pairing in A stays readable as "light on dark" in B.
HEX = {
    "#12110F": "#F4EFE6",  # Stage Black -> Paper
    "#F3F1EC": "#1A1311",  # House Lights -> Ink
    "#1F1D1A": "#EAE3D7",  # Riser -> Raised paper
    "#2E2B27": "#D6CCBC",  # rule lines
    "#8C8981": "#655D54",  # secondary text on the base
    "#5E5B55": "#B3A99B",  # secondary text on the inverted sections
    "#FFB21A": "#B3202B",  # Tungsten -> Curtain red
    "#FFC54D": "#8F1821",  # primary hover
    "#E5402A": "#276B43",  # Cue Red -> Cue Green (live, signals)
    "#FF6B55": "#B3202B",  # "fail" verdict text
    "#9BD48A": "#2E6B3F",  # "ok" text on the base
    "#2F6B2A": "#8FCB9A",  # "live" badge on the inverted section
    "#171613": "#EFE8DC",  # card hover
    "#E9E4DA": "#2A211D",  # case visual surround
    "#D9D4CA": "#3A2F2A",  # facts grid lines
}
RGBA = {
    "rgba(255,178,26,": "rgba(179,32,43,",
    "rgba(18,17,15,": "rgba(244,239,230,",
    "rgba(229,64,42,": "rgba(39,107,67,",
    "rgba(18,17,15,.35)": "rgba(0,0,0,.5)",
}

s = open(A, encoding="utf-8").read()
for a, b in RGBA.items():
    s = s.replace(a, b)
for a, b in HEX.items():
    s = re.sub(re.escape(a), b, s, flags=re.I)

# Stage anchors must be unique per page
s = re.sub(r'data-stage-id="(?!b-)', 'data-stage-id="b-', s)
s = s.replace("data-stage-id=\"price-' + p.id", "data-stage-id=\"b-price-' + p.id")

TEXT = [
    ("<title>MSS Brand Specimen</title>", "<title>MSS Specimen B</title>"),
    ("v6 brand specimen: Run the show. Proposal, not locked.", "v6 brand specimen B (Curtain palette). Proposal, not locked."),
    (">v0.1<", ">B<"),
    (">Main Stage Studio · Positioning v6<", ">Main Stage Studio · Positioning v6 · Palette B<"),
    (">Primary · on Stage Black<", ">Primary · on Paper<"),
    (">Documents · on House Lights (mark goes black)<", ">Dark sections · on Ink (mark goes paper)<"),
    (">One light. <", ">House lights up. <"),
    (">Use it once.<", ">Curtain red, once.<"),
    ("A stage is dark so the thing on it can be seen. Black and house-light white do the work. Tungsten lands on the one thing that matters in each view: a price, a call to action, the client's work.",
     "Front of house, before the show: warm paper, ink type, and the curtain. Red is the theatre's own colour, and it lands on the one thing that matters in each view: a price, a call to action, the moment it goes live."),
    (">One Tungsten moment per view.<", ">One red moment per view.<"),
    (">Tungsten is never text on light.<", ">Curtain red is never text on Ink.<"),
    (">It fails contrast on House Lights. On light pages it becomes a fill with black type on top, or the mark turns black.<",
     ">It fails contrast on dark sections. There the mark and links turn paper. On paper, red works as text, a fill or the mark.<"),
    (">Cue Red means live or wrong.<", ">Cue Green means live.<"),
    ('>Dots, borders and fills for "live now" and errors. Never small text (only 4.6:1 on black, less on raised surfaces), never decoration, never a second accent.<',
     '>Dots and badges for "live now" and done. Red is already the accent, so errors use red with an icon and words, never colour alone.<'),
    (">07 · Applied: proof on House Lights<", ">07 · Applied: proof on Ink<"),
    ("Long reads and case studies sit on House Lights.", "Case studies open on Ink to set them apart from the paper pages."),
    ("Specimen v0.1 · 10 Oct 2026", "Specimen B · 10 Oct 2026"),
]
for a, b in TEXT:
    assert a in s, "missing in A: " + a[:60]
    s = s.replace(a, b)

# Swatches: rename and re-describe (hexes were already mapped above)
SW = [
    (">Background, type on light<", ">Base, type on Ink<"), (">Stage Black<", ">Paper<"),
    (">Riser<", ">Raised Paper<"),
    (">Reading<", ">Dark sections<"), (">House Lights<", ">Ink<"),
    (">Rigging Grey<", ">Stone<"), (" on light<", " on Ink<"),
    (">The spotlight<", ">The curtain<"), (">Tungsten<", ">Curtain<"),
    (">Cue Red<", ">Cue Green<"),
]
for a, b in SW:
    s = s.replace(a, b, 1)

# Contrast table: B's own pairs
pairs_a = s[s.index("  var pairs = ["):s.index("  ];", s.index("  var pairs = [")) + 4]
pairs_b = """  var pairs = [
    ["#1A1311","#F4EFE6","Ink on Paper"],
    ["#655D54","#F4EFE6","Stone on Paper"],
    ["#B3202B","#F4EFE6","Curtain on Paper"],
    ["#F4EFE6","#B3202B","Paper on Curtain"],
    ["#276B43","#F4EFE6","Cue Green on Paper"],
    ["#B3A99B","#1A1311","Stone Light on Ink"],
    ["#F4EFE6","#1A1311","Paper on Ink"],
    ["#B3202B","#1A1311","Curtain on Ink"]
  ];"""
s = s.replace(pairs_a, pairs_b)

# Fixes where an inverted role lands on a fixed colour
s = s.replace("</style>", """/* B only */
.case-visual .pg .edit{color:#1A1311}
.case-visual .pg .edit b{color:#F4EFE6}
.img.still{background:radial-gradient(ellipse 45% 38% at 50% 34%,rgba(255,221,160,.42),rgba(255,178,26,.08) 60%,transparent 75%),#1A1311}
.img.still .cap b{color:#F4EFE6}.img.still .cap span{color:#B3A99B}
.lk-tung .label{opacity:1}
.case-visual .bar span{color:#655D54}
.img.client .cap b{color:#F4EFE6}
</style>""", 1)

open(B, "w", encoding="utf-8").write(s)
left = [h for h in HEX if h.lower() in s.lower() and h not in HEX.values()]
print("wrote", os.path.basename(B), "| A colours left:", left or "none")
