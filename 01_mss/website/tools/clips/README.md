# Tooling clips

How the screen recordings on the case study pages are captured. Written 6 Aug 2026
for the PureMed page; the process is client-agnostic.

The point of these clips is evidence. A case study that claims a review gate exists
should show the gate. So every clip has to be the real tool running against the real
client's content, captured rather than mocked up.

## What is here

| File | What it does |
|---|---|
| `pipeline-terminal.html` | Terminal replay page. Verbatim captured stdout, typed back at readable speed, with narration |
| `record-both.js` | Records the pipeline and content-preview clips in one pass |
| `record-review.js` | Records the content preview alone, at a viewport that fits the feed column |
| `stage-auth.js` | Opens a headed browser so a human can sign in to Stage. Saves the session, records nothing |
| `stage-record.js` | Records the Stage review tool using that session. Strictly read-only |
| `shoot-site.js` | Screenshots the shipped client pages, desktop and mobile |
| `record-onboarding.js` | Records the Booking Engine clip on the MSS home page, and the still that posters the Work card |

Playwright comes from `~/workspace/scripts/node_modules` rather than a local install,
because that is where it already lives.

## Recording Stage

Stage is behind a login and the session cookie is httpOnly, so it cannot be lifted
out of a browser you are already signed into. Two steps:

```
node stage-auth.js     # sign in by hand in the window that opens
node stage-record.js   # records; never sees a credential
rm stage-state.json    # it is a live session token, delete it when done
```

**`stage-record.js` must stay read-only.** It drives a live engagement holding a
real client's saved decisions. It navigates, scrolls, switches tabs and opens the
per-element panel, which displays the decision already saved rather than recording
a new one. It never clicks Approve as written, I have made changes, Flag for
discussion, Approve all, Sign off, Done with images, or an image tile. There is a
`FORBIDDEN` regex and a `safeClick` wrapper that throws rather than clicking any of
them. Keep that property if you extend the script. A case study is not worth
overwriting a client's actual feedback.

It also starts at `/review/<client>` rather than `/reviews`. The reviews list shows
every engagement on the account, other clients included, and these clips go on a
public page.

## Screenshotting a client site

`shoot-site.js` serves nothing itself. Start a server in the directory that holds
the pages first:

```
cd ~/workspace/main-stage-studio/02_clients/puremed/web && python3 -m http.server 8901
node shoot-site.js
```

Check the first shot before trusting the rest. PureMed's pages reference
`assets/web/...` as a sibling path, but the assets live one level up, so every
image rendered as alt text until `web/assets` was symlinked to `../assets`. Broken
images are easy to miss in a thumbnail grid and fatal in a portfolio piece.

## Capturing a pipeline clip

1. Run the real commands and keep the output:

   ```
   cd ~/workspace/scripts
   node content-state.js   --client <slug> --list
   node content-lint.js    --client <slug>
   node content-preview.js --client <slug>
   ```

2. Paste that output verbatim into the `script` array in `pipeline-terminal.html`.
   Do not tidy it, do not invent a cleaner run. If the output is dull, the honest fix
   is to pick a client and a moment where the tool actually does something, not to
   write better output. The PureMed clip works because the lint genuinely catches a
   prescription-only-medicine topic and a post with no copy.

3. Record it. The page sets `window.__done` when the replay finishes, which is what
   the recorder waits on.

## Capturing a review clip

1. Regenerate the preview so it reflects current content:

   ```
   node content-preview.js --client <slug>
   ```

2. Serve it and record:

   ```
   cd ~/workspace/other-projects/<slug>/content/preview && python3 -m http.server 8899
   node record-review.js
   ```

`record-review.js` applies `body { zoom: 1.45 }` at a 940x780 viewport so the feed
column fills the frame. Without it the clip is a narrow strip floating in two thirds
of empty page background.

## Capturing the Booking Engine clip

This is the one clip on the home page, and the only one with an overlay. Both
outputs come from the same script driving the published prototype over HTTP:

```
cd ~/workspace/main-stage-studio/01_mss/website/site && npx astro build
npx serve dist -l 4321                    # or: npx astro dev

cd ../tools/clips
node record-onboarding.js --shot          # thumbnail -> shots/intake-rule-trace.png
node record-onboarding.js                 # clip      -> raw-onboarding/*.webm
```

Re-run it after **any** edit to
`site/public/work/booking-engine/prototype/index.html`, which is the file that
ships (the copy in `booking-engine/prototype/` is a version snapshot taken from
it, not the source). The whole reason the clip
is scripted rather than screen-captured by hand is that the prototype moves, and
a case-study video showing a UI the visitor will not find when they click through
is worse than no video.

Three things it adds over a plain capture:

- **A cursor.** Every click is a cursor move, a pause, a ripple, then the real
  click, so the UI is visibly being operated rather than changing on its own.
- **A narrative panel.** The widget is 720px centred, so with the rule trace
  docked there is ~575px of empty page down the left of every step. That is
  where the commentary goes, in the same place every time. The prose is
  authored (see the `N` map): the trace rows are written for a compliance
  reader, and this clip is someone's first thirty seconds with the idea.
  **What is not authored is the claim that a rule fired.** Every beat names a
  rule, looks it up in the live trace, and `note()` throws if that rule is
  absent, so the commentary cannot describe a check the engine did not run.
  The panel footer prints the engine's own condition string verbatim.
- **Pace.** `PACE` scales every beat, and each panel's hold is derived from its
  own word count rather than a fixed number, so a long line is not on screen
  for the same time as a short one. 0.7 was tried and read as rushed; the
  shipped cut is 0.92, about 78s. Drop `PACE` only to preview a cut quickly,
  never to ship one.

**The rule trace stays docked for the whole clip.** It is the compliance
artefact and it belongs in the prototype, but on an introduction it is a wall
of small type competing with the journey, and the left panel is making the same
point in a form a stranger can read.

**The clip opens on the accountancy practice, with no tenant toggle.** It loads
`?tenant=marbury&coach=0`. The switch from the conveyancer used to be the first
thing on screen, and it is a point about the engine rather than about this
journey. `?coach=0` suppresses the prototype's own first-run tips, which exist
for someone driving it by hand and would fight the narrative panel. Both flags
live in the prototype itself, so this still records the shipped file rather than
a special build of it.

The journey is Marbury Hale, Year End Accounts: the one service that exercises
screening, three signed documents and a deposit in a single run. Captured and
delivered at 1920x1080. An earlier cut recorded at 1080 and wrote down to 720,
which put a resample on top of VP8's own loss and left the widget copy soft;
recording 1:1 removes one of those two steps. 1080 is also the height the
documents step needs in order to fit without scrolling.

The still is the same journey on the documents step, with the same panel beside
it, cropped to panel-plus-widget at ~1.45:1 (roughly the shape the Work card
renders, so `object-cover` has almost nothing to trim). A thumbnail showing a
different journey to the one that plays is advertising the wrong product.

If it throws `never reached payment`, the message carries the step and the
document tabs it stalled on. The usual cause is a document whose clause count
changed: `sign()` ticks every `[data-clause]` it finds, so a new clause is
handled, but a new *required* document that is not signed leaves the Continue
button disabled.

The still is cropped to the widget plus the inspector rather than captured at a
narrower viewport, because below ~1300px the widget reflows and the same drive
cannot be trusted to reach the documents step.

## Encoding

Playwright writes VP8 webm. Convert to mp4 so it plays everywhere, and pad anything
that is not 16:10 so both clips sit in identically-shaped frames on the page:

```
# 16:10 source, straight through
ffmpeg -ss <in> -t <dur> -i raw.webm -an \
  -vf "scale=1280:800:flags=lanczos,fps=25" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 -preset slow \
  -movflags +faststart out.mp4

# narrower source, padded onto warm white (#F8F8F6, and the preview page's own
# background is #F8F8F8, so the seam does not show)
ffmpeg -ss <in> -t <dur> -i raw.webm -an \
  -vf "scale=-2:800:flags=lanczos,pad=1280:800:(ow-iw)/2:0:0xF8F8F6,fps=25" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 27 -preset slow \
  -movflags +faststart out.mp4
```

The Booking Engine clip is dense with small UI type, so it ships at native
1920x1080 and CRF 20, with no scaling pass at all:

```
# -ss 3 drops the lead-in: the load settle and the click that puts the studio
# dock away. Useful to have on the capture (it proves the dock is the
# prototype's own behaviour, not something the recorder faked) and dead air on
# the clip. Trim at encode time from the raw capture, never by re-encoding the
# shipped mp4, so it costs no quality.
ffmpeg -ss 3 -i raw-onboarding/*.webm -an \
  -vf "fps=25" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 20 -preset slow \
  -movflags +faststart site/public/assets/intake-onboarding.mp4

# Poster is frame 0 of the file that ships, so the still and the clip's first
# frame are the same image by construction rather than by a matching timestamp
# that drifts the next time the cut is retimed.
ffmpeg -i site/public/assets/intake-onboarding.mp4 -frames:v 1 poster.png
cwebp -q 82 poster.png -o site/public/assets/intake-onboarding.webp
```

That is 4.8MB for the 74.5s that ship (77.5s captured, 3s trimmed). Measured alternatives: CRF 23 at 1080p is 4.1MB, and
1600x900 at CRF 21 is 3.7MB. Neither saving is worth softening the thing the
clip exists to show, and the clip is `preload="none"` click-to-play, so nobody
pays for it unless they ask to watch it. The poster is the clip's own first frame, so the static
screen cannot show a moment the video does not open on.

`+faststart` is not optional. The homepage hero video shipped without it and the
moov atom landed after 2.68MB of payload, so the browser had to pull the whole file
before it could draw a frame. See `mss-site-ux-review.md`, finding 0.3.

Posters: `ffmpeg -ss <t> -i out.mp4 -frames:v 1 poster.png` then `cwebp -q 80`.
This build of ffmpeg has no webp encoder, hence the two steps. Pick a frame that
carries the clip on its own, and check the play control does not land on top of the
one line worth reading.

## Where the files go

`site/public/assets/`, not `src/assets/`. Astro's image pipeline does not process
video, and a `poster` attribute needs a plain URL.

Clips are `preload="none"` with click-to-play. A page arguing for a fast static site
should not spend 1.3MB on visitors who never press play.
