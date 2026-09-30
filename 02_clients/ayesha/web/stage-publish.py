#!/usr/bin/env python3
"""Publish the Ayesha prototype to Stage (engagement ayesha-johar-site).

    python3 stage-publish.py [--dry-run]

1. Tags any new text/images in ayesha-johar-v2.html (stage-autotag, insertion only).
2. Builds the Stage copy: assets/art/ becomes /assets/ayesha-johar-site/, because
   Stage only rewrites src/href image paths, not CSS url() or data-* attributes.
3. Pulls the live manifest from the Pi and APPENDS any new copy/image ids.
   Existing ids are never removed or renamed: her edits and comments hang off them.
4. Backs up the live manifest + page on the Pi, then rsyncs page, assets, manifest.
See sops/SOP-AYESHA-001-stage-publish.md.
"""
import html, json, os, re, subprocess, sys, tempfile
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "ayesha-johar-v2.html")
ART = os.path.join(HERE, "assets", "art")
AUTOTAG = os.path.expanduser("~/workspace/scripts/stage-autotag.js")
PI = "pi@192.168.1.106"
ENG = "ayesha-johar-site"
REMOTE = f"stage/engagements/{ENG}"
DRY = "--dry-run" in sys.argv
LOC = "Home (single page)"


def run(cmd, **kw):
    print("+", cmd if isinstance(cmd, str) else " ".join(cmd))
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


tmp = tempfile.mkdtemp(prefix="ayesha-stage-")

# 1. tag new elements in the source (no-op when everything is already tagged)
if not DRY:
    run(["node", AUTOTAG, "--site", HERE, "--files", SRC, "--relroot", HERE])

src = open(SRC, encoding="utf-8").read()

# 2. Stage copy of the page
os.makedirs(f"{tmp}/prototype")
stage_html = src.replace("assets/art/", f"/assets/{ENG}/")
open(f"{tmp}/prototype/index.html", "w", encoding="utf-8").write(stage_html)

# 3. merge new ids into the live manifest
live = json.loads(run(["ssh", PI, f"cat {REMOTE}/manifest.json"], capture_output=True).stdout)
p = Texts(); p.feed(src)
have_copy = {s["id"] for s in live["copy"]["sections"]}
have_img = {f["id"] for f in live["images"]["fields"]}
new_copy = [i for i in p.text if i not in have_copy]
img_ids = re.findall(r'data-stage-img="([^"]+)"', src)
new_img = [i for i in img_ids if i not in have_img]
for i in new_copy:
    txt = re.sub(r"\s+", " ", html.unescape(p.text[i])).strip()
    live["copy"]["sections"].append({"id": i, "label": txt[:60] or i, "location": LOC, "copy": txt, "sourceFile": "index.html"})
for i in new_img:
    live["images"]["fields"].append({"id": i, "label": i, "location": LOC, "sourceFile": "index.html"})
gone = sorted((have_copy - set(p.text)) | (have_img - set(img_ids)))
print(f"manifest: +{len(new_copy)} copy, +{len(new_img)} images; kept all existing ids")
if gone:
    print("WARNING: ids in the live manifest no longer on the page (kept, not removed):", ", ".join(gone))
json.dump(live, open(f"{tmp}/manifest.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)

if DRY:
    print("dry run: nothing uploaded. Staged files in", tmp); sys.exit(0)

# 4. back up, then upload
run(["ssh", PI, f"cd {REMOTE} && s=$(date +%Y%m%d-%H%M%S) && cp manifest.json manifest.json.bak-$s && cp prototype/index.html prototype/index.html.bak-$s"])
run(["rsync", "-a", f"{tmp}/prototype/index.html", f"{PI}:{REMOTE}/prototype/index.html"])
run(["rsync", "-a", f"{tmp}/manifest.json", f"{PI}:{REMOTE}/manifest.json"])
run(["rsync", "-a", "--include=*.webp", "--exclude=*", f"{ART}/", f"{PI}:{REMOTE}/assets/"])
print("published: https://mss-review.duckdns.org/prototype/" + ENG)
