#!/usr/bin/env python3
"""MSS brand book (v6 A), built from specimen A: the identity sections only (hero, mark,
colour, type, voice, imagery), without the proposal labels or the pricing and process
sections. Also the page the Identity clip scrolls through.
    python3 build-brand-book.py   (mss-v6-specimen.html -> mss-brand-book.html)
Edit specimen A or this script, never the output."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(HERE, 'mss-v6-specimen.html'), encoding='utf-8').read()
s = re.sub(r'\sdata-stage-id="[^"]*"', '', s)  # the book is not a Stage page; ids belong to A
def drop(section):
    global s
    m = re.search(r'(<!-- [^>]*-->\s*)?<(section|div)[^>]*data-stage-section="' + section + r'"', s)
    if not m: raise SystemExit('missing section ' + section)
    start = m.start(); tag = m.group(2)
    depth, i = 0, m.start(2) - 1
    pat = re.compile(r'<(/?)' + tag + r'\b[^>]*>')
    for t in pat.finditer(s, i):
        depth += -1 if t.group(1) else 1
        if depth == 0: s = s[:start] + s[t.end():]; return
    raise SystemExit('unclosed ' + section)
for sec in ('lineup', 'process', 'case'):
    drop(sec)
rep = [
  ('<title>MSS Brand Specimen</title>', '<title>MSS Brand Book</title>'),
  ('Main Stage Studio v6 brand specimen: Run the show. Proposal, not locked.', 'Main Stage Studio brand book, v6: the Stage identity.'),
  ('<span class="hide-sm">Brand specimen </span>v0.1<span class="hide-sm"> · proposal, not locked</span>', '<span class="hide-sm">Brand book </span>v6'),
  ('Main Stage Studio · Positioning v6', 'Main Stage Studio · Brand book'),
  ('Specimen v0.1 · 10 Oct 2026<br>Source: mss-positioning-v6-proposal.md', 'Brand book v6 · October 2026<br>mainstagestudio.co.uk'),
  ('href="#mark">Read the specimen</a>', 'href="#mark">Read the book</a>'),
  ('href="#lineup">See what I build', 'href="#mark">The mark'),
  ('>08 · Imagery<', '>05 · Imagery<'),
  ('>Now (v6)<', '>Line<'),
  # the specimen's script also drives the pricing calculators removed above; hidden stand-ins
  # let it run on to the contrast table
  ('</main>', '<div hidden aria-hidden="true"><div id="bento"></div><span id="pages-n"></span><input id="pages" type="range" min="1" max="30" value="10"><div id="pages-breakdown"></div><div id="opts"></div><div id="sum-oneoff"></div><div id="sum-monthly"></div><div id="bundle-hit"></div><p id="sum-note"></p></div></main>'),
  ('</style>', '.v-row{grid-template-columns:160px minmax(0,1fr)!important}.v-row .was,.v-row.headrow>div:nth-child(2){display:none}</style>'),
  ('These frames are direction placeholders; generated still life and real screenshots replace them in the build.', 'Real screens first, client work in its own colours second; still life later.'),
]
for a, b in rep:
    if a not in s: raise SystemExit('not found: ' + a[:60])
    s = s.replace(a, b)
assert chr(0x2014) not in s
open(os.path.join(HERE, 'mss-brand-book.html'), 'w', encoding='utf-8').write(s)
print('built mss-brand-book.html')
