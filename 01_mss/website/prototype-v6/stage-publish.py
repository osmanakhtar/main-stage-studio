#!/usr/bin/env python3
"""Publish the MSS v6 site prototype to Stage (engagement mss-v6-site).

    python3 build-site.py && python3 stage-publish.py [--dry-run]

Internal engagement: client "Main Stage Studio", no client login has it, so only the admin
(pi) sees it. Modelled on 01_mss/demo-clinic/vera/site/stage-publish.py.
1. Tags new text/images in the pages (stage-autotag, insertion only).
2. Builds the Stage copy: assets/ -> /assets/mss-v6-site/, page links -> /prototype/mss-v6-site/<id>.
3. Pulls the live manifest if it exists and APPENDS new copy/image ids (never removes any:
   comments hang off them), or creates it on first publish.
4. Backs up the live manifest and prototype folder on the Pi, then rsyncs pages, assets, manifest.
"""
import html, json, os, re, subprocess, sys, tempfile
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
AUTOTAG = os.path.expanduser("~/workspace/scripts/stage-autotag.js")
PI = "pi@192.168.1.106"
ENG = "mss-v6-site"
REMOTE = f"stage/engagements/{ENG}"
DRY = "--dry-run" in sys.argv
PAGES = [("index.html", "index", "Home"), ("review.html", "review", "Review"), ("identity.html", "identity", "Identity"),
         ("website.html", "website", "Website"), ("campaign.html", "campaign", "Campaign"), ("content.html", "content", "Content"),
         ("platform.html", "platform", "Platform"), ("care.html", "care", "Care"), ("pricing.html", "pricing", "Pricing"),
         ("how-it-works.html", "how-it-works", "How it works"), ("work.html", "work", "Work"),
         ("work-puremed.html", "work-puremed", "Work: PureMed"), ("about.html", "about", "About"), ("start.html", "start", "Start")]
IDS = {f[:-5]: pid for f, pid, _ in PAGES}


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


tmp = tempfile.mkdtemp(prefix="mss-site-stage-"); os.makedirs(f"{tmp}/prototype")
if not DRY:
    run(["node", AUTOTAG, "--site", HERE, "--files", ",".join(os.path.join(HERE, f) for f, _, _ in PAGES), "--relroot", HERE])

def link(m):
    name, query = m.group(1), m.group(2) or ""
    return f'href="/prototype/{ENG}/{IDS[name]}{query}"' if name in IDS else m.group(0)

srcs = {}
for f, pid, _ in PAGES:
    src = open(os.path.join(HERE, f), encoding="utf-8").read(); srcs[pid] = src
    out = re.sub(r'(src|poster)="assets/', rf'\1="/assets/{ENG}/', src)
    out = out.replace("'assets/' + n", f"'/assets/{ENG}/' + n")  # narrated-cut swap in the inline script
    out = re.sub(r'href="([a-z0-9-]+)\.html(\?[^"]*)?"', link, out)
    open(f"{tmp}/prototype/{pid}.html", "w", encoding="utf-8").write(out)
    left = re.findall(r'(?:href|src|poster)="(?!/|#|https?:|mailto:|data:)([^"]+)"', out)
    if left: print(f"WARNING {pid}: relative links left: {sorted(set(left))[:5]}")

exists = subprocess.run(["ssh", PI, f"test -f {REMOTE}/manifest.json"]).returncode == 0
if exists:
    live = json.loads(run(["ssh", PI, f"cat {REMOTE}/manifest.json"], capture_output=True).stdout)
else:
    live = {"engagement": "Main Stage Studio: v6 site prototype", "client": "Main Stage Studio", "liveEditable": True,
            "allowNavigation": True, "hiddenFromClient": False, "modes": ["prototype", "copy"],
            "copy": {"sections": []}, "images": {"fields": []}}
live.pop("autoPublish", None)
have_copy = {s["id"] for s in live["copy"]["sections"]}; have_img = {f["id"] for f in live["images"]["fields"]}
added_c = added_i = 0
for f, pid, label in PAGES:
    p = Texts(); p.feed(srcs[pid])
    for i, raw in p.text.items():
        if i in have_copy: continue
        txt = re.sub(r"\s+", " ", html.unescape(raw)).strip()
        live["copy"]["sections"].append({"id": i, "label": txt[:60] or i, "location": label, "copy": txt, "sourceFile": f"{pid}.html"})
        have_copy.add(i); added_c += 1
    for i in re.findall(r'data-stage-img="([^"]+)"', srcs[pid]):
        if i in have_img: continue
        live["images"]["fields"].append({"id": i, "label": i, "location": label, "sourceFile": f"{pid}.html"})
        have_img.add(i); added_i += 1
live["prototype"] = {"file": "prototype/index.html", "pages": [{"id": pid, "label": label, "file": f"prototype/{pid}.html"} for _, pid, label in PAGES]}
print(f"manifest: {'updated' if exists else 'new'}, +{added_c} copy, +{added_i} images; kept all existing ids")
json.dump(live, open(f"{tmp}/manifest.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)

if DRY:
    print("dry run: nothing uploaded. Staged files in", tmp); sys.exit(0)

if exists:
    run(["ssh", PI, f"cd {REMOTE} && s=$(date +%Y%m%d-%H%M%S) && cp manifest.json manifest.json.bak-$s && tar czf prototype.bak-$s.tgz prototype"])
else:
    run(["ssh", PI, f"mkdir -p {REMOTE}/prototype {REMOTE}/assets {REMOTE}/output"])
run(["rsync", "-a", f"{tmp}/prototype/", f"{PI}:{REMOTE}/prototype/"])
run(["rsync", "-a", "--include=*/", "--include=*.webp", "--include=*.webm", "--include=*.mp4", "--include=*.svg", "--exclude=*", f"{HERE}/assets/", f"{PI}:{REMOTE}/assets/"])
run(["rsync", "-a", f"{tmp}/manifest.json", f"{PI}:{REMOTE}/manifest.json"])
print(f"published: https://mss-review.duckdns.org/prototype/{ENG}")
