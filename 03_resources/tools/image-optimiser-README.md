# Image Optimiser

*Local browser tool for converting and compressing images to WebP.*
*Last reviewed: 13 June 2026*

---

## What it is

A self-contained HTML file that runs in your browser. No install, no dependencies, no data leaving your machine. Drop images in, convert to WebP, download.

The tool lives at: `03_resources/tools/image-optimiser.html`

---

## How to use it

1. Open `image-optimiser.html` in Chrome or Safari (double-click or drag onto the browser)
2. Drop one or more images onto the drop zone, or click "Choose files"
3. Set quality and resize options if needed (defaults are fine for most use)
4. Click "Convert all"
5. Download individual files or click "Download all" for a zip

---

## Settings

**Quality**
Default is 80%. This is the right setting for web assets. The slider goes from 50% (smallest file, visible compression) to 100% (lossless, no meaningful size reduction). Leave it at 80% unless there's a reason to change it.

**Resize**
Off by default. Use this when you need to cap the output dimensions:

| Option | When to use |
|--------|-------------|
| No resize | Image dimensions are already correct |
| Max 1920px | Full-width hero images |
| Max 1440px | Wide section images |
| Max 1280px | Standard content images |
| Max 800px | Card thumbnails, previews |
| Max 600px | Small UI images, icons |

The tool scales proportionally — it respects the original aspect ratio.

---

## Accepted input formats

PNG, JPG/JPEG, GIF, BMP, AVIF, TIFF, WebP

---

## Output

All files are output as `.webp` at the quality setting chosen. File names are preserved with the extension swapped. A file called `hero-image.jpg` becomes `hero-image.webp`.

The tool shows size savings per file and total savings across the batch once conversion is complete.

---

## When to use it

Run any image through this before it goes into a web project:

- Client site photography
- Case study images
- MSS website assets
- Social media exports going onto a site (not for the social platforms themselves)
- Any image being added to WordPress via the media library

The exception: SVG files do not need conversion. Keep them as SVG.

---

## Limitations

- Runs in the browser using the Canvas API, so very large batches (50+ images) may be slow on older hardware. For heavy batch work, note this in the MSS decisions log and flag for a CLI-based alternative.
- Does not process SVG files.
- The "Download all" zip function requires a live internet connection the first time it runs (it loads a small library from a CDN). Individual downloads always work offline.

---

## Notes

The tool was built for MSS internal use and is not client-facing. It produces no output beyond the converted files — nothing is logged, stored, or transmitted.

For bulk processing as part of a client handover (large asset libraries, design system exports), consider whether the CLI alternative using Node.js and `sharp` is more appropriate. Flag in the decisions log if that need arises.
