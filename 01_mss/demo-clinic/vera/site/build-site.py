#!/usr/bin/env python3
"""Vera Aesthetics demo site: five pages for the v6 Website and Campaign clips.

Vera is a fictional clinic (see ../vera-brand-identity.md). This site exists so MSS can
film its tools on a client-shaped site without touching a real client. Every page says so
in the footer.

    python3 build-site.py [--platform http://localhost:3451]

Writes *.html beside this script and copies the Vera photos into assets/. The guide form
posts to the studio-platform form endpoint for tenant vera (forms/guide-opt-in.json);
its tick-box wording is read from the tenant's consent files so the page and the consent
record can never disagree. Edit this script, not the HTML.
"""
import html, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
VERA = os.path.dirname(HERE)
TENANT = '/Users/osmanakhtar/workspace/studio-platform/tenants/vera'
PLATFORM = sys.argv[sys.argv.index('--platform') + 1] if '--platform' in sys.argv else 'http://localhost:3451'
e = html.escape

def consent(name):
    return open(os.path.join(TENANT, 'consent', name), encoding='utf-8').read().strip()

# photos
os.makedirs(os.path.join(HERE, 'assets'), exist_ok=True)
for f in os.listdir(os.path.join(VERA, 'assets/webp')):
    shutil.copy(os.path.join(VERA, 'assets/webp', f), os.path.join(HERE, 'assets', f))
shutil.copy(os.path.join(VERA, 'assets/vera-mark.svg'), os.path.join(HERE, 'assets/vera-mark.svg'))

MARK = '<svg width="30" height="30" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M12 34 C12 20, 24 10, 36 12 C36 26, 24 36, 12 34 Z" stroke="currentColor" stroke-width="2.2"/><path d="M18 30 C24 24, 30 20, 34 16" stroke="#C6A667" stroke-width="2.2" stroke-linecap="round"/></svg>'

CSS = """
:root{--bone:#F5F2EC;--navy:#1E2B4D;--ink:#141A2B;--stone:#DCD9D2;--gold:#C6A667;--muted:#4E5568;
  --serif:"Fraunces",Georgia,serif;--sans:"Hanken Grotesk",system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bone);color:var(--ink);font:17px/1.65 var(--sans)}
a{color:inherit}
img{display:block;max-width:100%}
.wrap{max-width:1160px;margin:0 auto;padding:0 24px}
:focus-visible{outline:2px solid var(--navy);outline-offset:3px}
header{border-bottom:1px solid var(--stone);background:var(--bone)}
header .wrap{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:76px}
.brand{display:flex;align-items:center;gap:10px;min-height:44px;text-decoration:none;color:var(--navy)}
.brand b{font:500 28px/1 var(--serif);letter-spacing:-.01em}
nav{display:flex;gap:26px;align-items:center;flex-wrap:wrap;font-size:15px}
nav a{display:inline-flex;align-items:center;min-height:44px;text-decoration:none;color:var(--muted)}
nav a:hover,nav a[aria-current]{color:var(--navy)}
.btn{display:inline-flex;align-items:center;min-height:48px;padding:0 24px;background:var(--navy);color:var(--bone);text-decoration:none;border:1px solid var(--navy);font:500 15px/1 var(--sans);cursor:pointer}
.btn:hover{background:var(--ink)}
.btn.ghost{background:transparent;color:var(--navy)}
.btn.ghost:hover{background:var(--navy);color:var(--bone)}
nav .btn{min-height:44px;padding:0 18px;color:var(--bone)}
.eyebrow{display:flex;align-items:center;gap:12px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:18px}
.eyebrow::before{content:"";width:28px;height:1px;background:var(--gold)}
h1{font:400 clamp(40px,5.4vw,68px)/1.04 var(--serif);color:var(--navy);letter-spacing:-.015em}
h2{font:400 clamp(30px,3.6vw,44px)/1.1 var(--serif);color:var(--navy);letter-spacing:-.01em}
h3{font:500 22px/1.25 var(--serif);color:var(--navy)}
.lede{font-size:19px;color:var(--muted);max-width:52ch;margin-top:20px}
section{padding:88px 0}
.hero{padding:72px 0 96px}
.hero .wrap{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:56px;align-items:center}
.hero img{aspect-ratio:4/5;object-fit:cover;border-radius:180px 180px 4px 4px}
.ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}
.three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px;margin-top:44px}
.three p{color:var(--muted);margin-top:10px}
.card{background:#fff;border:1px solid var(--stone)}
.card img{aspect-ratio:3/4;object-fit:cover}
.card .in{padding:22px 22px 26px}
.card .in p{color:var(--muted);margin-top:8px;font-size:16px}
.navy{background:var(--navy);color:var(--bone)}
.navy h2,.navy h3{color:var(--bone)}
.navy .lede,.navy p{color:#C9CDD8}
.split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:56px;align-items:center}
.split img{aspect-ratio:4/5;object-fit:cover}
.list{list-style:none;margin-top:26px;display:grid;gap:14px}
.list li{padding-left:22px;position:relative}
.list li::before{content:"";position:absolute;left:0;top:12px;width:10px;height:1px;background:var(--gold)}
.rows{margin-top:40px;border-top:1px solid var(--stone)}
.row{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.6fr);gap:32px;padding:28px 0;border-bottom:1px solid var(--stone)}
.row p{color:var(--muted)}
.price{font:400 44px/1 var(--serif);color:var(--navy);margin:18px 0 6px}
form{background:#fff;border:1px solid var(--stone);padding:34px;display:grid;gap:18px;max-width:560px}
label{display:grid;gap:7px;font-size:15px;font-weight:500;color:var(--ink)}
input[type=text],input[type=email],input[type=tel]{min-height:48px;padding:0 14px;border:1px solid var(--stone);background:var(--bone);font:16px var(--sans);color:var(--ink)}
.tick{grid-template-columns:26px 1fr;align-items:start;gap:12px;font-weight:400;color:var(--muted);font-size:15px}
.tick{min-height:44px}
.tick input{width:24px;height:24px;margin-top:2px;accent-color:var(--navy)}
.hp{position:absolute;left:-9999px}
.small{font-size:14px;color:var(--muted)}
footer{border-top:1px solid var(--stone);padding:44px 0 56px;font-size:14px;color:var(--muted)}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px}
.demo{color:var(--navy);font-weight:500}
@media(max-width:860px){.hero .wrap,.split{grid-template-columns:1fr}.three{grid-template-columns:1fr}.row{grid-template-columns:1fr;gap:8px}nav{gap:14px;font-size:14px}header .wrap{padding-top:12px;padding-bottom:12px}}
"""

PAGES = [('index', 'Home'), ('treatments', 'Treatments'), ('fresh-face-assessment', 'Fresh-Face Assessment'), ('guide-opt-in', 'Free guide')]

def page(slug, title, body):
    nav = ''.join(f'<a href="{s}.html"{" aria-current=\"page\"" if s == slug else ""}>{e(l)}</a>' for s, l in PAGES[1:3])
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} | Vera Aesthetics</title>
<meta name="description" content="Vera Aesthetics is a fictional, nurse-led clinic used by Main Stage Studio to demonstrate its tools.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>
<header data-stage-section="header"><div class="wrap">
<a class="brand" href="index.html">{MARK}<b>vera</b></a>
<nav aria-label="Main">{nav}<a href="guide-opt-in.html"{' aria-current="page"' if slug == 'guide-opt-in' else ''}>Free guide</a><a class="btn" href="fresh-face-assessment.html">Book an assessment</a></nav>
</div></header>
<main>{body}</main>
<footer data-stage-section="footer"><div class="wrap">
<div><b class="demo">Vera Aesthetics is a fictional clinic.</b> It takes no patients. Main Stage Studio uses it to demonstrate its tools.</div>
<div>1 Example Street, Exampleton</div>
</div></footer>
</body></html>
"""

HOME = """
<section class="hero" data-stage-section="hero"><div class="wrap">
<div>
<p class="eyebrow">Nurse-led aesthetics</p>
<h1>Look like yourself, on a good day.</h1>
<p class="lede">Careful, consultation-led treatment from one nurse prescriber. We would rather talk you out of something than sell you something you don't need.</p>
<div class="ctas"><a class="btn" href="fresh-face-assessment.html">Book a Fresh-Face Assessment</a><a class="btn ghost" href="guide-opt-in.html">Read the free guide</a></div>
</div>
<img src="assets/experience-consult-4x5.webp" alt="A consultation at Vera: the practitioner talks a client through her plan at a desk">
</div></section>

<section data-stage-section="how" style="padding-top:24px"><div class="wrap">
<p class="eyebrow">How we work</p>
<h2>A plan, not a menu.</h2>
<div class="three">
<div><h3>We listen first</h3><p>Every treatment starts with a conversation about what you've noticed and what you want to keep.</p></div>
<div><h3>We explain everything</h3><p>What each option can and can't do, what it costs, and what recovery really looks like.</p></div>
<div><h3>No pressure, ever</h3><p>You leave with a written plan and time to think. Nothing is booked on the day unless you want it.</p></div>
</div></div></section>

<section data-stage-section="treatments-preview" style="padding-top:24px"><div class="wrap">
<p class="eyebrow">Treatments</p>
<h2>Small changes, chosen carefully.</h2>
<div class="three">
<a class="card" href="treatments.html" style="text-decoration:none"><img src="assets/results-skin-macro-2k.webp" alt="Close-up of healthy skin texture"><div class="in"><h3>Skin quality</h3><p>Boosters and polynucleotides for skin that looks rested and hydrated.</p></div></a>
<a class="card" href="treatments.html" style="text-decoration:none"><img src="assets/treatment-marking-3x4.webp" alt="The practitioner marks a treatment plan on the skin"><div class="in"><h3>Lines and volume</h3><p>Wrinkle-softening treatment and dermal filler, used sparingly.</p></div></a>
<a class="card" href="treatments.html" style="text-decoration:none"><img src="assets/treatment-rf-handpiece-3x4.webp" alt="A radiofrequency handpiece used for skin tightening"><div class="in"><h3>Firming</h3><p>Radiofrequency and laser for gradual, natural-looking tightening.</p></div></a>
</div></div></section>

<section class="navy" data-stage-section="guide-promo"><div class="wrap split">
<div>
<p class="eyebrow" style="color:#C9CDD8">Free guide</p>
<h2>Why do I look tired?</h2>
<p class="lede">The short guide we wish everyone read before booking anything. Five common reasons a face looks tired, and what actually helps.</p>
<div class="ctas"><a class="btn" href="guide-opt-in.html" style="background:var(--bone);color:var(--navy);border-color:var(--bone)">Get the guide</a></div>
</div>
<img src="assets/results-skin-jawline-4x5.webp" alt="Side profile showing a natural jawline">
</div></section>
"""

TREATMENTS = """
<section class="hero" data-stage-section="treatments-intro" style="padding-bottom:40px"><div class="wrap" style="display:block">
<p class="eyebrow">Treatments</p>
<h1>What we offer, and what it can't do.</h1>
<p class="lede">Everything starts with a Fresh-Face Assessment. These are the treatments we most often recommend afterwards.</p>
</div></section>
<section data-stage-section="treatments-list" style="padding-top:0"><div class="wrap"><div class="rows">
<div class="row"><h3>Skin quality</h3><p>Skin boosters and polynucleotides improve hydration, texture and bounce over a course of treatments. Best for skin that looks tired rather than lined.</p></div>
<div class="row"><h3>Wrinkle-softening treatment</h3><p>Relaxes the muscles that cause expression lines on the forehead and around the eyes. Used lightly, so you still look like you.</p></div>
<div class="row"><h3>Dermal filler</h3><p>Restores volume where it has been lost, usually the cheeks or under the eyes. We use less than you might expect, and say so when it isn't the answer.</p></div>
<div class="row"><h3>Radiofrequency and laser</h3><p>Gradual tightening and resurfacing for skin that has lost firmness. Results build over weeks rather than appearing overnight.</p></div>
<div class="row"><h3>Medical-grade skincare</h3><p>The quiet foundation for everything else. We'll suggest a simple routine and tell you what to skip.</p></div>
</div></div></section>
"""

ASSESS = """
<section class="hero" data-stage-section="assessment"><div class="wrap">
<div>
<p class="eyebrow">Fresh-Face Assessment</p>
<h1>Find out what's actually behind the change.</h1>
<p class="lede">An unhurried appointment to look at your skin, your concerns and your options. You leave with a written plan and no obligation.</p>
<p class="price">£25</p>
<p class="small">Taken off your first treatment if you go ahead.</p>
<ul class="list">
<li>A conversation about what you've noticed and what you want to keep</li>
<li>A close look at skin quality, volume and lines</li>
<li>Honest advice, including when to do nothing</li>
<li>A written plan with prices, to take home and think about</li>
</ul>
<div class="ctas"><a class="btn" href="#">Book your assessment</a></div>
</div>
<img src="assets/experience-laser-room-4x5.webp" alt="Vera's treatment room, calm and light">
</div></section>
"""

def guide_form():
    return f"""
<section class="hero" data-stage-section="guide-form"><div class="wrap">
<div>
<p class="eyebrow">Free guide</p>
<h1>Why do I look tired?</h1>
<p class="lede">Five common reasons a face looks tired, and what actually helps. Written by our nurse prescriber, in plain English.</p>
</div>
<form method="post" action="{e(PLATFORM)}/f/vera/guide-opt-in">
<label>First name <input type="text" name="first_name" autocomplete="given-name" maxlength="80"></label>
<label>Email <input type="email" name="email" autocomplete="email" required></label>
<label class="hp" aria-hidden="true">Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
<label class="tick"><input type="checkbox" name="consent_marketing" value="yes" required><span>{e(consent('marketing-email.v1.md'))}</span></label>
<label class="tick"><input type="checkbox" name="age_18" value="yes" required><span>{e(consent('age-18.v1.md'))}</span></label>
<button class="btn" type="submit">Send me the guide</button>
<p class="small">We use your details only to send what you asked for. You can unsubscribe from any email.</p>
</form>
</div></section>
"""

THANKS = """
<section class="hero" data-stage-section="guide-thanks"><div class="wrap" style="display:block">
<p class="eyebrow">Free guide</p>
<h1>It's on its way.</h1>
<p class="lede">Check your inbox for the guide. Over the next week we'll send a few short notes on why faces look tired. You can stop them at any time.</p>
<div class="ctas"><a class="btn ghost" href="index.html">Back to the home page</a></div>
</div></section>
"""

out = {'index': ('Home', HOME), 'treatments': ('Treatments', TREATMENTS), 'fresh-face-assessment': ('Fresh-Face Assessment', ASSESS),
       'guide-opt-in': ('Free guide', guide_form()), 'guide-thank-you': ('Thank you', THANKS)}
for slug, (title, body) in out.items():
    s = page(slug, title, body)
    assert chr(0x2014) not in s, slug + ': em dash'
    open(os.path.join(HERE, slug + '.html'), 'w', encoding='utf-8').write(s)
# the platform redirects to /guide-thank-you/ (a folder), so serve the page there too
os.makedirs(os.path.join(HERE, 'guide-thank-you'), exist_ok=True)
t = open(os.path.join(HERE, 'guide-thank-you.html'), encoding='utf-8').read().replace('<head>', '<head><base href="../">', 1)
open(os.path.join(HERE, 'guide-thank-you', 'index.html'), 'w', encoding='utf-8').write(t)
print('built', ', '.join(out), '| form posts to', PLATFORM + '/f/vera/guide-opt-in')
