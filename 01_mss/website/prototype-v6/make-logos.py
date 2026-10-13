#!/usr/bin/env python3
"""Career logos for the About page: one tone, trimmed, flat in assets/ (as Stage needs).

    python3 make-logos.py && python3 build-site.py

Sources and where they came from: 01_mss/brand/career-logos/SOURCES.md.
Each logo is rendered with rsvg-convert, then every coloured pixel becomes Rigging and every
white or near-white pixel drops out, so knock-outs (the Virgin script, the Universal globe lines)
stay knocked out instead of filling in. Output: assets/logo-<name>.webp, trimmed to the ink.
"""
import os, subprocess, tempfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(os.path.dirname(HERE)), 'brand/career-logos')
OUT = os.path.join(HERE, 'assets')
INK = (0x8C, 0x89, 0x81)  # --rig, secondary text on Stage Black
HEIGHT = 240  # render height; trimmed and scaled to 96px tall (2x a 48px slot)

with tempfile.TemporaryDirectory() as tmp:
    for f in sorted(os.listdir(SRC)):
        if not f.endswith('.svg'):
            continue
        name = f[:-4]
        png = os.path.join(tmp, name + '.png')
        subprocess.run(['rsvg-convert', '-h', str(HEIGHT), '-b', 'none', '-o', png, os.path.join(SRC, f)], check=True)
        im = Image.open(png).convert('RGBA')
        out = Image.new('RGBA', im.size, INK + (0,))
        px, po = im.load(), out.load()
        for y in range(im.height):
            for x in range(im.width):
                r, g, b, a = px[x, y]
                # whiteness 0..1: how close the lightest-dark channel is to white
                ink = 1 - min(r, g, b) / 255
                po[x, y] = INK + (round(a * min(1.0, ink * 1.6)),)
        out = out.crop(out.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox())
        out = out.resize((max(1, round(out.width * 96 / out.height)), 96), Image.LANCZOS)
        tmp_png = os.path.join(tmp, name + '-ink.png')
        out.save(tmp_png)
        subprocess.run(['cwebp', '-quiet', '-lossless', '-exact', tmp_png, '-o', os.path.join(OUT, f'logo-{name}.webp')], check=True)
        print(f'logo-{name}.webp {out.width}x{out.height}')
