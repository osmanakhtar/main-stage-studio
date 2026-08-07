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
