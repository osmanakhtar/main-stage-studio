#!/usr/bin/env python3
"""Publish the Ayesha prototypes to Stage (engagement ayesha-johar-site).

    python3 stage-publish.py [--dry-run]

Publishes every direction as pages of one engagement, with a Directions page
as the front door:
  directions                 the client-facing chooser (ayesha-johar-v3-choose.html)
  index                      version 2, single page (ayesha-johar-v2.html), id kept for her earlier comments
  ayesha-johar-v3a*, v3b*, v3c*, v4*   the four multi-page directions (8 pages each)

1. Tags any new text/images in every page (stage-autotag, insertion only, ids unique across all pages).
2. Builds the Stage copy of each page: assets/art/ becomes /assets/ayesha-johar-site/, and every link
   to another page becomes /prototype/ayesha-johar-site/<page id> (live-edit only follows /prototype/ links).
3. Pulls the live manifest from the Pi, APPENDS new copy/image ids (never removes or renames any:
   her edits and comments hang off them), and sets the page list, the front door and allowNavigation.
4. Backs up the live manifest and prototype folder on the Pi, then rsyncs pages, assets, manifest.
Run build-v3.py and build-v4.py first. See sops/SOP-AYESHA-001-stage-publish.md.
"""
import glob
import html
import json
import os
import re
import subprocess
import sys
import tempfile
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
ART = os.path.join(HERE, "assets", "art")
AUTOTAG = os.path.expanduser("~/workspace/scripts/stage-autotag.js")
PI = "pi@192.168.1.106"
ENG = "ayesha-johar-site"
REMOTE = f"stage/engagements/{ENG}"
DRY = "--dry-run" in sys.argv
NAME = "Art by Ayesha Johar: Website directions"

DIRECTIONS = [("v3a", "A The Walk"), ("v3b", "B Colour Field"), ("v3c", "C Hidden Colours"), ("v4", "D Colour in Motion")]
ROOMS = [("sacred", "Room I The Sacred"), ("nature", "Room II Nature"), ("world", "Room III World"), ("witness", "Room IV Witness"), ("love", "Room V Love")]


def pages():
    """(source file, page id, label) in the order the Stage page list shows them."""
    out = [("ayesha-johar-v3-choose.html", "directions", "Start here: the directions"),
           ("ayesha-johar-v2.html", "index", "Version 2 (single page)")]
    for d, label in DIRECTIONS:
        p = f"ayesha-johar-{d}"
        out.append((f"{p}.html", p, f"{label}: Home"))
        out += [(f"{p}-room-{k}.html", f"{p}-room-{k}", f"{label}: {rl}") for k, rl in ROOMS]
        out.append((f"{p}-about.html", f"{p}-about", f"{label}: Who I am"))
        out.append((f"{p}-collect.html", f"{p}-collect", f"{label}: Collect"))
    return out


def run(cmd, **kw):
    print("+", cmd if isinstance(cmd, str) else " ".join(cmd[:4]) + (" ..." if len(cmd) > 4 else ""))
    return subprocess.run(cmd, check=True, text=True, **kw)


class Texts(HTMLParser):
    """Inner text for every data-stage-id element."""
    VOID = {"img", "br", "meta", "link", "input", "source", "hr"}

    def __init__(self):
        super().__init__(); self.stack = []; self.text = {}

    def handle_starttag(self, tag, attrs):
        if tag in self.VOID: return
        sid = dict(attrs).get("data-stage-id")
        self.stack.append(sid)
        if sid: self.text.setdefault(sid, "")

    def handle_endtag(self, tag):
        if self.stack: self.stack.pop()

    def handle_data(self, data):
        for sid in self.stack:
            if sid: self.text[sid] += data


PAGES = pages()
missing = [f for f, _, _ in PAGES if not os.path.exists(os.path.join(HERE, f))]
if missing:
    sys.exit("missing pages (run build-v3.py and build-v4.py first): " + ", ".join(missing))
extra = sorted(set(os.path.basename(p) for p in glob.glob(os.path.join(HERE, "ayesha-johar-v[34]*.html"))) - {f for f, _, _ in PAGES})
if extra:
    print("note: not published (not in the page list):", ", ".join(extra))

tmp = tempfile.mkdtemp(prefix="ayesha-stage-")
os.makedirs(f"{tmp}/prototype")

# 1. tag new elements in every page (ids unique across the whole set)
if not DRY:
    run(["node", AUTOTAG, "--site", HERE, "--files", ",".join(os.path.join(HERE, f) for f, _, _ in PAGES), "--relroot", HERE])

# 2. Stage copies: asset paths and page links
links = sorted(((f, f"/prototype/{ENG}/{pid}") for f, pid, _ in PAGES), key=lambda x: -len(x[0]))
srcs = {}
for f, pid, _ in PAGES:
    src = open(os.path.join(HERE, f), encoding="utf-8").read()
    srcs[pid] = src
    out = src.replace("assets/art/", f"/assets/{ENG}/")
    for name, url in links:
        out = out.replace(name, url)
    open(f"{tmp}/prototype/{pid}.html", "w", encoding="utf-8").write(out)
    left = re.findall(r'(?:href|src)="(?!/|#|https?:|mailto:|data:)([^"]+)"', out)
    if left:
        print(f"WARNING {pid}: relative links left: {sorted(set(left))[:5]}")

# 3. merge into the live manifest
live = json.loads(run(["ssh", PI, f"cat {REMOTE}/manifest.json"], capture_output=True).stdout)
have_copy = {s["id"] for s in live["copy"]["sections"]}
have_img = {f["id"] for f in live["images"]["fields"]}
on_pages_copy, on_pages_img, added_c, added_i = set(), set(), 0, 0
for f, pid, label in PAGES:
    p = Texts(); p.feed(srcs[pid])
    imgs = re.findall(r'data-stage-img="([^"]+)"', srcs[pid])
    on_pages_copy |= set(p.text); on_pages_img |= set(imgs)
    for i in p.text:
        if i in have_copy: continue
        txt = re.sub(r"\s+", " ", html.unescape(p.text[i])).strip()
        live["copy"]["sections"].append({"id": i, "label": txt[:60] or i, "location": label, "copy": txt, "sourceFile": f"{pid}.html"})
        have_copy.add(i); added_c += 1
    for i in imgs:
        if i in have_img: continue
        live["images"]["fields"].append({"id": i, "label": i, "location": label, "sourceFile": f"{pid}.html"})
        have_img.add(i); added_i += 1
known = {pg["id"] for pg in live.get("prototype", {}).get("pages", [])}
page_list = [{"id": pid, "label": label, "file": f"prototype/{pid}.html"} for _, pid, label in PAGES]
page_list += [pg for pg in live.get("prototype", {}).get("pages", []) if pg["id"] not in {x["id"] for x in page_list}]
live["prototype"] = {"file": "prototype/directions.html", "pages": page_list}
live["engagement"] = NAME
live["allowNavigation"] = True
gone = sorted((have_copy - on_pages_copy) | (have_img - on_pages_img))
print(f"manifest: {len(page_list)} pages (+{len({p['id'] for p in page_list} - known)} new), +{added_c} copy, +{added_i} images; kept all existing ids")
if gone:
    print(f"note: {len(gone)} ids in the manifest are no longer on any page (kept, not removed)")
json.dump(live, open(f"{tmp}/manifest.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)

if DRY:
    print("dry run: nothing uploaded. Staged files in", tmp); sys.exit(0)

# 4. back up, then upload (pages are added or replaced; nothing on the Pi is deleted)
run(["ssh", PI, f"cd {REMOTE} && s=$(date +%Y%m%d-%H%M%S) && cp manifest.json manifest.json.bak-$s && tar czf prototype.bak-$s.tgz prototype"])
run(["rsync", "-a", f"{tmp}/prototype/", f"{PI}:{REMOTE}/prototype/"])
run(["rsync", "-a", "--include=*.webp", "--exclude=*", f"{ART}/", f"{PI}:{REMOTE}/assets/"])
run(["rsync", "-a", f"{tmp}/manifest.json", f"{PI}:{REMOTE}/manifest.json"])
print(f"published: https://mss-review.duckdns.org/prototype/{ENG}  (front door: Directions)")
