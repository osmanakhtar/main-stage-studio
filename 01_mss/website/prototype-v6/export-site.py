#!/usr/bin/env python3
"""Build plan step 12: the v6 prototype into the production Astro site (13 Oct 2026).

    python3 build-site.py && python3 export-site.py

Each built page goes into 01_mss/website/site/public/<route>/index.html, so Astro ships it byte for
byte: the prototype Os approved on Stage is the page that goes live, with three changes only:
  - Stage's tagging attributes (data-stage-*) are stripped
  - links become clean routes (review.html -> /review/, work-clinic.html -> /work/clinic-booking/)
  - assets/x -> /assets/v6/x, only the files the pages use; favicons go to the site root
The v5 pages these replace are removed from src/pages. Kept: /work/sable/site (Sable's own site),
/work/booking-engine/prototype/ (public/, the working demo the case studies link to) and the
redirects in astro.config.mjs. Deploy: make ship TARGET=mss-prod CONFIRM=deploy.
"""
import os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(os.path.dirname(HERE), 'site')
PUB = os.path.join(SITE, 'public')
A_OUT = os.path.join(PUB, 'assets', 'v6')

# prototype file -> production route. The old /work/ URLs are kept for the demo case studies.
ROUTES = {
    'index': '/', 'review': '/review/', 'identity': '/identity/', 'website': '/website/', 'campaign': '/campaign/',
    'content': '/content/', 'platform': '/platform/', 'care': '/care/', 'pricing': '/pricing/',
    'how-it-works': '/how-it-works/', 'work': '/work/', 'about': '/about/', 'start': '/start/',
    'work-puremed': '/work/puremed/', 'work-ayesha': '/work/ayesha/', 'work-sable': '/work/sable/',
    'work-conveyancing': '/work/conveyancing-onboarding/', 'work-accountancy': '/work/accountancy-intake/',
    'work-clinic': '/work/clinic-booking/',
}
# v5 pages replaced by the routes above (src/pages); work/sable/site.astro stays
RETIRED = ['index.astro', 'work/puremed.astro', 'work/conveyancing-onboarding/index.astro',
           'work/accountancy-intake/index.astro', 'work/clinic-booking/index.astro', 'work/sable/index.astro']
FAVICONS = ['favicon.svg', 'favicon.ico', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png']


def link(m):
    attr, page, rest = m.group(1), m.group(2), m.group(3) or ''
    return f'{attr}="{ROUTES[page]}{rest}"'


def convert(html):
    html = re.sub(r'\s+data-stage-(?:id|img|section)="[^"]*"', '', html)
    html = re.sub(r'(href)="([a-z0-9-]+)\.html([?#][^"]*)?"', link, html)
    for f in FAVICONS:
        html = html.replace(f'"assets/{f}"', f'"/{f}"')
    used = set(re.findall(r'"assets/([^"/]+)"', html))
    html = re.sub(r'"assets/([^"/]+)"', r'"/assets/v6/\1"', html)
    return html, used


os.makedirs(A_OUT, exist_ok=True)
used_all = set()
for page, route in ROUTES.items():
    html, used = convert(open(os.path.join(HERE, page + '.html'), encoding='utf-8').read())
    if 'href="#"' in html or '.html"' in re.sub(r'https?://[^"]+', '', html):
        raise SystemExit(f'{page}: a dead or unconverted link is left in the page')
    used_all |= used
    out = os.path.join(PUB, route.strip('/'), 'index.html')
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(html)

for f in sorted(used_all):
    shutil.copy(os.path.join(HERE, 'assets', f), os.path.join(A_OUT, f))
for f in os.listdir(A_OUT):  # drop files no page uses any more (old film hashes)
    if f not in used_all:
        os.remove(os.path.join(A_OUT, f))
for f in FAVICONS:
    shutil.copy(os.path.join(HERE, 'assets', f), os.path.join(PUB, f))
for f in RETIRED:
    p = os.path.join(SITE, 'src', 'pages', f)
    if os.path.exists(p):
        os.remove(p)
print(f'exported {len(ROUTES)} pages, {len(used_all)} assets to {os.path.relpath(PUB, HERE)}')
