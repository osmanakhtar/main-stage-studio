#!/bin/bash
# Product stills for the v6 prototype, cut from the real tool recordings (out-v6) and the
# Sable brand files. Images stand in for the clips until the final recordings are made
# (media-plan.md). Frames were picked by eye to avoid the burned-in caption cards.
#   bash make-stills.sh && python3 build-site.py
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CLIPS="$HERE/../tools/clips/out-v6"
SABLE="$HERE/../../portfolio/sable/brand"
OUT="$HERE/assets"  # flat: Stage serves /assets/<engagement>/<file> and rewrites img src to the bare filename
mkdir -p "$OUT"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT  # ffmpeg here has no WebP encoder, so cwebp does the encode

# name clip seconds [crop w:h:x:y]
cut() {
  local vf="scale=1440:-2"
  [ -n "${4:-}" ] && vf="crop=$4,scale=1440:-2"
  ffmpeg -v error -y -ss "$3" -i "$CLIPS/$2.mp4" -frames:v 1 -vf "$vf" "$TMP/$1.png"
  cwebp -quiet -q 82 "$TMP/$1.png" -o "$OUT/still-$1.webp"
}
cut website-hero    website 2
cut website-edit    website 17
cut website-phone   website 33
cut campaign-form   campaign 8
cut campaign-series campaign 25
cut campaign-sent   campaign 30
cut content-builder content 18
cut content-slides  content 18 "800:450:330:40"
cut platform-dash   console 8
cut platform-email  console 30
cut platform-preview console 36
cut content-checks  pipeline 17
cut identity-book   identity 1

# Sable (self-initiated identity)
img() {
  ffmpeg -v error -y -i "$SABLE/$2" -vf "scale='min(1440,iw)':-2" "$TMP/$1.png"
  cwebp -quiet -q 82 "$TMP/$1.png" -o "$OUT/still-$1.webp"
}
img sable-cover     sable-album-cover-01.webp
img sable-home      sable-homepage-image-01.webp
img sable-presented sable-arrival-presented-01.png
img sable-portrait  sable-hero-arrival-01.webp
# Work page cards: live demo journeys, puremed.uk and Ayesha's v3 room (needs network)
node "$HERE/work-shots.js" "$TMP"
for n in work-thackray work-marbury work-vera work-puremed work-ayesha; do
  ffmpeg -v error -y -i "$TMP/$n.png" -vf "scale=1440:-2" "$TMP/$n-s.png"
  cwebp -quiet -q 82 "$TMP/$n-s.png" -o "$OUT/still-$n.webp"
done
ls "$OUT"/still-*
