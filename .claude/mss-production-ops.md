# MSS — Production Operations Reference

*What's safe to do directly against a live WordPress/Bricks site, and what isn't.*
*Written after a real incident: direct database edits created content that existed
in the database but never rendered on the page, a silent, hard-to-diagnose
disconnect between data and what Bricks actually outputs.*
*Last reviewed: 19 June 2026*

---

## The rule

**Never query or edit the WordPress database directly to create or change page
content.** Use Bricks MCP tools only.

This isn't a style preference, it's a correctness rule. Bricks' content layer and
its underlying database storage are not guaranteed to stay in sync when content is
written by anything other than Bricks itself, the builder, or the MCP tools that
talk to it properly. A direct database write can succeed completely, the row exists,
the content is there, and still never appear on the live page, because Bricks has
its own rendering and caching logic sitting between the database and what a visitor
sees. The MSS build hit this directly: PHP scripts read and wrote element data, the
data was correct in the database, and the elements simply weren't on the page.

If an MCP tool fails or can't do something, **report the error and stop**. Don't
fall back to direct database access as a workaround. A failed MCP call is a signal
to investigate or ask, not a reason to route around the tool.

This is now codified as Rule 4 in the `bricks-html-importer` skill. This document
exists to explain *why*, and to draw the line clearly between the banned general
pattern and the narrow, confirmed exceptions below.

---

## Confirmed exceptions

These are not a fallback for "MCP didn't work." Each one below is a specific,
understood Bricks platform quirk where direct intervention is the only fix,
verified through real sessions, not a workaround invented in the moment. If you
hit something direct-DB-shaped that isn't on this list, treat it as Rule 4 territory:
stop, report, don't act.

### 1. Header template meta-key sync

**The quirk:** Bricks header templates render the front end from
`_bricks_page_header_2`, but the Bricks editor and MCP tools both read and write
`_bricks_page_content_2`. Build a header via MCP and it looks correct in the editor,
but nothing appears on the live front end, because the key the front end actually
reads was never touched.

**The fix**, run as a one-shot PHP script after every MCP build on a header
template:

```php
$content = get_post_meta(TEMPLATE_ID, '_bricks_page_content_2', true);
update_post_meta(TEMPLATE_ID, '_bricks_page_header_2', $content);
```

Replace `TEMPLATE_ID` with the actual template post ID. Both keys must be kept in
sync, any further PHP fix that touches element data on a header template must write
to both.

### 2. `bricks_global_settings` repair

**The quirk:** If `bricks_global_settings` goes missing from `wp_options`, Bricks
stops executing any code element site-wide, they render as empty divs or raw `<pre>`
text. This row can be accidentally deleted by cache-clear SQL using a `LIKE
'bricks_global_settings%'` pattern, which matches the settings row as well as the
transients it was meant to target.

**The fix:**

```php
update_option('bricks_global_settings', ['executeCodeEnabled' => true]);
$val = get_option('bricks_global_settings');
echo json_encode($val);
```

Confirm `executeCodeEnabled` is `true` in the output.

**Prevention:** never use `LIKE 'bricks_global_settings%'` in cache-clear SQL.
Target transients only:

```sql
DELETE FROM wp_options
WHERE option_name LIKE '_transient_bricks%'
OR option_name LIKE '_transient_timeout_bricks%'
```

### 3. Cache-layer clearing via SSH

**The quirk:** Cloudways runs two separate cache layers, Varnish (server-level,
sits in front of WordPress entirely) and Breeze (WordPress-level file cache).
Clearing one without the other means a change can be confirmed correct in the
database and still show stale on the live site.

**The default fix** is the wp-admin Breeze "Purge All" button, this clears both
layers correctly and should be used in every normal case. Full detail and the two
fallback methods (SSH PURGE command, manual file cache clear) are in
`mss-new-site-deployment-guide.md`, under "Caching — Architecture and Operational
Management." That document is the source of truth for cache handling; this entry
just confirms cache-layer access is the third confirmed exception to the
no-direct-database rule.

---

## mu-plugins deploy constraint

`wp-content/mu-plugins/mss-contact.php` (the contact form SMTP handler) is **SFTP
deploy only, never git.** It contains SMTP configuration that shouldn't live in a
public repo, and mu-plugins aren't part of the standard Git deployment path Cloudways
uses for the rest of the site. If the contact form needs changing, edit it locally,
test, then transfer the file directly via SFTP, don't expect a `git push` to update
it.

This constraint currently lives only in the Claude Code auto-memory
(`project-mss-infra.md`). It's repeated here so it's visible in a document someone
would actually think to check, and so it survives if the memory file is ever cleared.

---

## What this document is not

This is not a general "how to fix WordPress" reference, and it's not permission to
reach for the database whenever something's awkward. It's a short, closed list of
specific, understood exceptions to a rule that exists because the alternative
already caused a real, silent bug. If a new situation comes up that feels like it
needs direct database access and it isn't one of the three confirmed exceptions
above, that's a sign to stop and think it through properly, in Claude desktop,
before acting, not a reason to add a fourth exception on the spot.

If a genuinely new, confirmed exception is found through real session work, add it
here with the same structure: what the quirk is, why MCP can't reach it, and the
exact fix. Don't add a pattern here speculatively, only after it's been hit and
understood.
