#!/usr/bin/env python3
"""Soft grade of the About portrait: calmer wall, slight vignette (13 Oct 2026, Os's call).

    python3 grade-portrait.py

In:  osman-mono-4x5.png (the mono 4:5 crop of the Oct studio shot)
Out: osman-mono-4x5-soft.png / .webp

The pale wall fought the black jumper on a Stage Black page. Highlights are pulled down and the
edges fall off gently, while the face keeps its light: a soft radial lift sits over it.
"""
import os, subprocess
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'osman-mono-4x5.png')
OUT = os.path.join(HERE, 'osman-mono-4x5-soft')

im = np.asarray(Image.open(SRC).convert('L'), dtype=np.float32) / 255
h, w = im.shape
yy, xx = np.mgrid[0:h, 0:w]

# 1. highlight compression: shadows untouched, the wall (about 0.85) comes down to about 0.66
knee = 0.45
graded = np.where(im < knee, im, knee + (im - knee) * 0.52)

# 2. keep the face's light: blend back towards the original inside a soft ellipse over the head
fx, fy = 0.54 * w, 0.20 * h
face = np.exp(-(((xx - fx) / (0.17 * w)) ** 2 + ((yy - fy) / (0.16 * h)) ** 2))
graded = graded * (1 - 0.75 * face) + im * (0.75 * face)

# 3. vignette: centred on the upper body, up to about 30% darker in the corners
cx, cy = 0.52 * w, 0.42 * h
r = np.sqrt(((xx - cx) / (0.62 * w)) ** 2 + ((yy - cy) / (0.70 * h)) ** 2)
graded *= 1 - 0.30 * np.clip((r - 0.45) / 0.55, 0, 1) ** 1.6

Image.fromarray((np.clip(graded, 0, 1) * 255).round().astype(np.uint8)).save(OUT + '.png')
subprocess.run(['cwebp', '-quiet', '-q', '86', OUT + '.png', '-o', OUT + '.webp'], check=True)
print('wrote', OUT + '.png', OUT + '.webp')
