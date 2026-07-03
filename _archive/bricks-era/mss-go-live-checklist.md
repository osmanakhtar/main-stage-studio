# MSS — Go-Live Checklist

*The deployment sequence: LocalWP build through to a live WordPress + Bricks site on Cloudways.*
*Companion to `mss-bricks-build-guide.md`, which covers building the page itself.*
*Version 0.1 — scaffold. Refine after the first real go-live (PureMed is the first test case).*
*Last reviewed: 20 June 2026*

---

## Status of this file

This is a working scaffold built from the studio's known stack, not yet validated against a
completed deployment. Items marked **[confirm]** depend on the specific host, domain, and
client and need checking on the first live run. After PureMed goes live, replace this note and
lock the steps that actually worked.

---

## 0. Pre-flight

- [ ] Prototype reviewed and locked — no open copy or design questions
- [ ] All copy on the page matches the locked prototype exactly
- [ ] Bricks page build checklist passed (see `mss-bricks-build-guide.md`)
- [ ] Client has signed off on the staging build
- [ ] Hosting model confirmed — Option A (MSS Cloudways) or Option B (client's own)

---

## 1. LocalWP build complete

- [ ] WordPress core, Bricks, and required plugins all up to date
- [ ] All pages built and saved as published (not draft) in LocalWP
- [ ] Header and footer templates assigned site-wide
- [ ] Permalinks set and working
- [ ] Favicon and site title set (flat SVG mark — see `mss-brand-identity.md`)
- [ ] No placeholder or lorem content left anywhere
- [ ] Media library cleaned — no rejected or working assets
- [ ] Admin username is not "admin"
- [ ] Admin password is strong and unique
- [ ] WP debug mode is OFF (`WP_DEBUG false` in `wp-config.php`)
- [ ] File editor disabled in production (`DISALLOW_FILE_EDIT true` in `wp-config.php`)
- [ ] Unused plugins deleted, not just deactivated

---

## 2. Pre-migration checks

- [ ] mp4 / large assets accounted for — local only, route through Bunny.net DAM (not the WP media library)
- [ ] Image sizes optimised — no full-resolution exports shipping to production
- [ ] All images have alt text
- [ ] Internal links use relative paths or will be search-replaced for the live domain
- [ ] Forms tested locally (MSS: mu-plugin contact form; client sites: confirm SMTP relay is configured)
- [ ] Privacy Policy page published
- [ ] Cookie consent banner active if the site collects personal data
- [ ] A full LocalWP backup / export taken before touching anything live

---

## 3. Cloudways setup

- [ ] Cloudways application created on the correct server and plan **[confirm plan]**
- [ ] PHP version matches the LocalWP environment
- [ ] Redis object cache ENABLED in Cloudways Application Settings
- [ ] Varnish cache is OFF during build — turn ON at go-live (see post-go-live verification below)
- [ ] SSL certificate provisioned
- [ ] Staging domain or temporary URL available for verification before DNS cutover

---

## 4. Migration

- [ ] Site pushed from LocalWP to Cloudways (Local "Connect to Cloudways" flow or migration plugin) **[confirm method]**
- [ ] Database search-replace run: local URL replaced with live domain
- [ ] Bricks licence activated on the live domain (licence is per domain)
- [ ] Permalinks re-saved on the live site
- [ ] Media and DAM-hosted assets all resolving on the live URL

---

## 5. Domain and DNS

- [ ] Domain DNS pointed to Cloudways **[confirm registrar and records]**
- [ ] SSL forced — all traffic redirects to https
- [ ] www / non-www redirect set to the preferred version
- [ ] Propagation confirmed before announcing the site

---

## 6. Post-go-live verification

- [ ] Every page loads on the live domain with no broken links or assets
- [ ] Scroll animations and dark-section reveals fire correctly in production
- [ ] Forms submit and deliver to the right inbox
- [ ] Mobile and tablet layouts checked on real devices
- [ ] Varnish cache ENABLED in Cloudways Application Settings (was OFF during build)
- [ ] No console errors in browser dev tools
- [ ] Google PageSpeed score checked — target 80+ mobile
- [ ] Settings → Reading: "Discourage search engines" is UNCHECKED (site is now indexable) — confirm this is intended
- [ ] SEO plugin installed (Rank Math or Yoast)
- [ ] Meta title and description set on homepage
- [ ] XML sitemap generated and submitted to Google Search Console
- [ ] Google Search Console property verified
- [ ] Pre-launch snapshot backup taken in Cloudways (label: "Pre-launch — [date]")
- [ ] Bot protection enabled (Cloudways or Cloudflare)
- [ ] WP login URL optionally changed (WPS Hide Login plugin) — not required, consider for client sites
- [ ] Analytics in place if required **[confirm whether tracking is wanted]**

---

## 7. Handover and close

- [ ] Access credentials documented securely and passed to the client if Option B
- [ ] Backup schedule confirmed on Cloudways
- [ ] Handover document written (see new client checklist, section 7)
- [ ] Client signed off on the live site
- [ ] Invoice raised
- [ ] Case study opened if the work warrants it (see `mss-new-case-study-checklist.md`)

---

## Updating this file

After each go-live, bring what actually happened back to Claude desktop. Lock the steps that
worked, delete the ones that did not apply, and resolve the **[confirm]** items into real
instructions. The first validated run replaces version 0.1.
