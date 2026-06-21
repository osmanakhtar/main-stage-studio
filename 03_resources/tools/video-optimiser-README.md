# Video Optimiser

*Automator workflow for converting video files to WebM for web use.*
*Last reviewed: 13 June 2026*

---

## What it does

Drag one or more video files onto the app in Finder. It converts them to WebM (VP9) capped at 1080p and saves the output file alongside the original. No Terminal required after setup.

**Input formats:** MP4, MOV, AVI, MKV, M4V — anything FFmpeg can read, which is almost everything.
**Output:** `.webm` at VP9, max 1080p, audio at 128k Opus. File is saved in the same folder as the source.

---

## Prerequisites

FFmpeg must be installed at `/opt/homebrew/bin/ffmpeg`. If you followed the install steps, it is. Confirm with:

```bash
which ffmpeg
```

Expected output: `/opt/homebrew/bin/ffmpeg`

---

## One-time setup: build the Automator app

Do this once. The result is a drag-and-drop app you keep in your tools folder.

### Step 1: Open Automator

Open Spotlight (Cmd + Space), type `Automator`, hit Enter.

### Step 2: Create a new document

When prompted to choose a document type, select **Application**. Click Choose.

### Step 3: Add the Run Shell Script action

In the search bar on the left, type `Run Shell Script`. Double-click it to add it to the workflow, or drag it into the right-hand panel.

### Step 4: Configure the action

In the Run Shell Script block:

- Set **Shell** to `/bin/bash`
- Set **Pass input** to `as arguments`
- Delete any placeholder text in the script area
- Paste the following script exactly:

```bash
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
```

### Step 5: Save the app

File > Save. Name it `Video Optimiser`. Save it to:

```
~/workspace/main-stage-studio/03_resources/tools/
```

Automator saves it as `Video Optimiser.app`.

---

## How to use it

1. Find the video file you want to convert in Finder
2. Drag it onto `Video Optimiser.app`
3. A spinning cog appears in the Dock while it runs
4. When it finishes, the `.webm` file appears in the same folder as the source

You can drag multiple files at once. Each converts in sequence.

Conversion time depends on file size and length. A 30-second 1080p clip takes roughly 1-3 minutes. FFmpeg will use VP9 constant quality mode, so the output size varies by content — motion-heavy footage will be larger than talking head video.

---

## Output settings

| Setting | Value | Notes |
|---------|-------|-------|
| Format | WebM (VP9) | Best compression for web |
| Max resolution | 1080p | Downscales if source is larger, preserves if smaller |
| Quality | CRF 33 | Good balance of quality and file size. Lower = better quality, larger file. |
| Audio | Opus 128k | Standard quality for web audio |

To adjust quality, open the app in Automator (right-click > Open With > Automator) and change the `-crf` value. Range is 0-63. 28-36 is the practical range for web video.

---

## When to use it

- Higgsfield video exports before adding to a web project
- Client-supplied video footage for case study pages
- Any `.mov` or `.mp4` going into a WordPress media library
- MSS website hero or ambient video assets

The exception: if a video is also being shared directly with a client as a deliverable (not just used on a website), keep the original format. Convert to WebM for the web layer only.

---

## Troubleshooting

**The app opens and closes immediately with no output**
FFmpeg path is wrong or FFmpeg is not installed. Run `which ffmpeg` in Terminal to confirm the path, then open the app in Automator and update the `FFMPEG=` line.

**The output file is very large**
Lower the `-crf` value (try 36 or 40). Alternatively, check whether the source file is unusually high resolution or bitrate.

**Audio is missing from the output**
The source file may have no audio track. FFmpeg will still complete successfully. If audio was expected, check the source in QuickTime first.

**Nothing happens when I drag a file onto the app**
Make sure you are dragging a video file. The script does not filter by extension — it will attempt to convert anything dropped on it, but non-video files will fail silently.

---

## Files in this folder

```
03_resources/tools/
├── image-optimiser.html       Image to WebP — browser-based
├── image-optimiser-README.md  Instructions for the above
├── Video Optimiser.app        Video to WebM — drag and drop (Automator)
└── video-optimiser-README.md  This file
```
