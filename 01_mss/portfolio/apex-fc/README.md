# acs-assets

Static assets for the **Apex Combat Series** prototype, hosted via GitHub Pages.

## Base URL
```
https://[your-username].github.io/acs-assets/
```

## Asset inventory

### Logo suite

| File | Usage | Background |
|---|---|---|
| `Logo-full-text-navy.svg` | Nav (default) | White / light |
| `Logo-full-text-blue.svg` | Nav (hover) · Homepage default | White / light |
| `Logo-full-text-white.svg` | Footer | Dark / navy |
| `Logo-icon-navy.svg` | Icon mark | White / light |
| `Logo-icon-white.svg` | Icon mark | Dark / navy |

### Meta / SEO

| File | Usage |
|---|---|
| `acs-og-image.svg` | OG / social share image (1200×630) |
| `favicon.svg` | Browser tab favicon (SVG) |
| `favicon-32.png` | Browser tab favicon (PNG fallback) |

## Usage in HTML

```html
<!-- Nav logo (default: navy) -->
<img id="nav-logo-img" src="https://[your-username].github.io/acs-assets/Logo-full-text-navy.svg" 
     style="height:32px"
     onmouseover="this.src='https://[your-username].github.io/acs-assets/Logo-full-text-blue.svg'"
     onmouseout="this.src='https://[your-username].github.io/acs-assets/Logo-full-text-navy.svg'">

<!-- Nav logo (homepage: always blue) -->
<img src="https://[your-username].github.io/acs-assets/Logo-full-text-blue.svg" style="height:32px">

<!-- Footer logo -->
<img src="https://[your-username].github.io/acs-assets/Logo-full-text-white.svg" style="height:28px">

<!-- Favicon in <head> -->
<link rel="icon" type="image/svg+xml" href="https://[your-username].github.io/acs-assets/favicon.svg">
<link rel="icon" type="image/png" href="https://[your-username].github.io/acs-assets/favicon-32.png">

<!-- OG meta in <head> -->
<meta property="og:image" content="https://[your-username].github.io/acs-assets/acs-og-image.svg">
```

## How to deploy

1. Create a new GitHub repo named `acs-assets`
2. Upload all files from this folder to the repo root
3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. Wait ~60 seconds, then assets are live at the base URL above
5. Replace `[your-username]` throughout with your actual GitHub username

## Placeholder slots in prototype

The prototype contains these image placeholder slots that require real photography:

| Slot | Count | Location |
|---|---|---|
| Event posters (ACS 20–24) | 5 | Hero sections, event cards, past event cards |
| Fighter photos | 19 | Fighters page carousel |
| News / article images | 9 | News cards, article hero images |
| YouTube thumbnails | 9 | YT card sections across pages |
| Instagram tiles | 6 | Homepage Instagram grid |

To replace: swap the placeholder `<div class="[x]-ph">` elements with `<img>` tags pointing to your GitHub-hosted photography.
