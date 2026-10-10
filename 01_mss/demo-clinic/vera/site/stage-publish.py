#!/usr/bin/env python3
"""Publish the Vera demo site to Stage (engagement vera-demo-site) for the v6 Website clip.

    python3 build-site.py && python3 stage-publish.py [--dry-run]

Admin-only: no client login is given this engagement. Live-editable, page links work.
1. Tags new text/images in every page (stage-autotag, insertion only, ids unique across pages).
2. Builds the Stage copy: assets/ -> /assets/vera-demo-site/, page links -> /prototype/vera-demo-site/<id>.
3. Pulls the live manifest if there is one and APPENDS new copy/image ids (never removes any),
   or creates it on first publish. Never sets autoPublish: nothing here ever goes anywhere.
4. Backs up the live manifest and prototype folder on the Pi, then rsyncs pages, assets, manifest.
Modelled on 02_clients/ayesha/web/stage-publish.py and 01_mss/brand/stage-publish.py.
"""
import html, json, os, re, subprocess, sys, tempfile
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
AUTOTAG = os.path.expanduser("~/workspace/scripts/stage-autotag.js")
PI = "pi@192.168.1.106"
ENG = "vera-demo-site"
REMOTE = f"stage/engagements/{ENG}"
DRY = "--dry-run" in sys.argv
PAGES = [("index.html", "index", "Home"), ("treatments.html", "treatments", "Treatments"),
         ("fresh-face-assessment.html", "fresh-face-assessment", "Fresh-Face Assessment"),
         ("guide-opt-in.html", "guide-opt-in", "Free guide"), ("guide-thank-you.html", "guide-thank-you", "Guide: thank you")]

def run(cmd, **kw):
    print("+", " ".join(cmd[:4]) + (" ..." if len(cmd) > 4 else ""))
    return subprocess.run(cmd, check=True, text=True, **kw)

class Texts(HTMLParser):
    VOID = {"img", "br", "meta", "link", "input", "source", "hr"}
    def __init__(self): super().__init__(); self.stack = []; self.text = {}
    def handle_starttag(self, tag, attrs):
        if tag in self.VOID: return
        sid = dict(attrs).get("data-stage-id"); self.stack.append(sid)
        if sid: self.text.setdefault(sid, "")
    def handle_endtag(self, tag):
        if self.stack: self.stack.pop()
    def handle_data(self, data):
        for sid in self.stack:
            if sid: self.text[sid] += data

tmp = tempfile.mkdtemp(prefix="vera-stage-"); os.makedirs(f"{tmp}/prototype")
if not DRY:
    run(["node", AUTOTAG, "--site", HERE, "--files", ",".join(os.path.join(HERE, f) for f, _, _ in PAGES), "--relroot", HERE])

srcs = {}
for f, pid, _ in PAGES:
    src = open(os.path.join(HERE, f), encoding="utf-8").read(); srcs[pid] = src
    out = src.replace('src="assets/', f'src="/assets/{ENG}/')
    for name, p2, _ in PAGES:
        out = out.replace(f'href="{name}"', f'href="/prototype/{ENG}/{p2}"')
    open(f"{tmp}/prototype/{pid}.html", "w", encoding="utf-8").write(out)
    left = re.findall(r'(?:href|src)="(?!/|#|https?:|mailto:|data:)([^"]+)"', out)
    if left: print(f"WARNING {pid}: relative links left: {sorted(set(left))[:5]}")

exists = subprocess.run(["ssh", PI, f"test -f {REMOTE}/manifest.json"]).returncode == 0
if exists:
    live = json.loads(run(["ssh", PI, f"cat {REMOTE}/manifest.json"], capture_output=True).stdout)
else:
    live = {"engagement": "Vera Aesthetics (demo): Website", "client": "Vera Aesthetics (demo)", "liveEditable": True,
            "allowNavigation": True, "hiddenFromClient": False, "modes": ["prototype", "copy"],
            "copy": {"sections": []}, "images": {"fields": []}}
live.pop("autoPublish", None)
have_copy = {s["id"] for s in live["copy"]["sections"]}; have_img = {f["id"] for f in live["images"]["fields"]}
ac = ai = 0
for f, pid, label in PAGES:
    p = Texts(); p.feed(srcs[pid])
    for i, raw in p.text.items():
        if i in have_copy: continue
        txt = re.sub(r"\s+", " ", html.unescape(raw)).strip()
        live["copy"]["sections"].append({"id": i, "label": txt[:60] or i, "location": label, "copy": txt, "sourceFile": f"{pid}.html"}); have_copy.add(i); ac += 1
    for i in re.findall(r'data-stage-img="([^"]+)"', srcs[pid]):
        if i in have_img: continue
        live["images"]["fields"].append({"id": i, "label": i, "location": label, "sourceFile": f"{pid}.html"}); have_img.add(i); ai += 1
live["prototype"] = {"file": "prototype/index.html", "pages": [{"id": pid, "label": label, "file": f"prototype/{pid}.html"} for _, pid, label in PAGES]}
print(f"manifest: {'updated' if exists else 'new'}, +{ac} copy, +{ai} images; kept all existing ids")
json.dump(live, open(f"{tmp}/manifest.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
if DRY: print("dry run: nothing uploaded. Staged files in", tmp); sys.exit(0)

if exists:
    run(["ssh", PI, f"cd {REMOTE} && s=$(date +%Y%m%d-%H%M%S) && cp manifest.json manifest.json.bak-$s && tar czf prototype.bak-$s.tgz prototype"])
else:
    run(["ssh", PI, f"mkdir -p {REMOTE}/prototype {REMOTE}/assets {REMOTE}/output"])
run(["rsync", "-a", f"{tmp}/prototype/", f"{PI}:{REMOTE}/prototype/"])
run(["rsync", "-a", "--include=*.webp", "--include=*.svg", "--exclude=*", f"{HERE}/assets/", f"{PI}:{REMOTE}/assets/"])
run(["rsync", "-a", f"{tmp}/manifest.json", f"{PI}:{REMOTE}/manifest.json"])
# Stage's photo library is per client (clients/<slug>/assets, slug from manifest.client):
# give Vera's library her own photos so "Choose from library" has something to choose.
run(["ssh", PI, "mkdir -p stage/clients/vera-aesthetics-demo/assets"])
run(["rsync", "-a", "--include=*-4x5.webp", "--include=*-3x4.webp", "--include=*macro*.webp", "--exclude=*", f"{HERE}/assets/", f"{PI}:stage/clients/vera-aesthetics-demo/assets/"])
print(f"published: https://mss-review.duckdns.org/prototype/{ENG}")
