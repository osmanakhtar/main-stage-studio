#!/bin/bash
# Favicons from the v6 Spike: Tungsten strokes on a Stage Black square (13 Oct 2026).
#   bash make-favicons.sh
# Writes favicon.svg, favicon.ico (16/32/48), favicon-16x16.png, favicon-32x32.png and
# apple-touch-icon.png (180) into favicons/. build-site.py copies them into the prototype,
# and export-site.py puts them at the production site root.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/favicons"; mkdir -p "$OUT"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

# The mark sits inside a square with a margin, so the corners read at 16px.
cat > "$OUT/favicon.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#12110F"/><g transform="translate(12 12)"><path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/><path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></g></svg>
SVG
# apple-touch: full-bleed square (iOS rounds the corners itself)
cat > "$TMP/touch.svg" <<'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#12110F"/><g transform="translate(14 14) scale(.9)"><path d="M5 17V5H17" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/><path d="M35 23V35H23" stroke="#FFB21A" stroke-width="5" stroke-linecap="square" fill="none"/></g></svg>
SVG
for s in 16 32 48; do rsvg-convert -w $s -h $s "$OUT/favicon.svg" -o "$TMP/f$s.png"; done
cp "$TMP/f16.png" "$OUT/favicon-16x16.png"; cp "$TMP/f32.png" "$OUT/favicon-32x32.png"
magick "$TMP/f16.png" "$TMP/f32.png" "$TMP/f48.png" "$OUT/favicon.ico"
rsvg-convert -w 180 -h 180 "$TMP/touch.svg" -o "$OUT/apple-touch-icon.png"
ls -la "$OUT"
