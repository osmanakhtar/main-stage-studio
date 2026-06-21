#!/bin/bash

FFMPEG="/opt/homebrew/bin/ffmpeg"

for f in "$@"; do
  dir=$(dirname "$f")
  base=$(basename "$f" | sed 's/\.[^.]*$//')
  out="$dir/${base}.webm"

  "$FFMPEG" -i "$f" \
    -vf "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1080,ih))'" \
    -c:v libvpx-vp9 \
    -crf 33 \
    -b:v 0 \
    -c:a libopus \
    -b:a 128k \
    -y \
    "$out"
done
