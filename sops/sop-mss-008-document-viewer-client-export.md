# SOP-MSS-008: Document viewer and client exports

| | |
|---|---|
| **Purpose** | Read any .md, .csv or .json file in the workspace, and export it as an internal copy or an official client-facing PDF, Word or XLS document |
| **Operator** | Os |
| **Verified** | Not yet run by hand. 2026-10-18: automated run in headless Chrome (Playwright) exported the sauna-plunge discovery notes as client PDF and Word, and a CSV as client XLS; contents checked, PDF checked by eye. Still to do: one real "Save as PDF" from Chrome's print dialog and one client .docx opened in Word |
| **Systems touched** | Chrome (or Edge), the single file `~/workspace/main-stage-studio/03_resources/tools/md-viewer.html`, Google Fonts and the jsdelivr/cdnjs CDNs (needs internet) |
| **Canon doc** | The file itself (comments at each section); brand rules `~/workspace/main-stage-studio/.claude/mss-brand-identity.md` |

## When this runs

- Any time you want to read a workspace doc rendered rather than as raw markdown.
- Before sending a doc to a client (discovery notes, options papers, analyses, schedules): use **Client export**.

## Prerequisites

- Chrome or Edge. Folder browsing needs the File System Access API, so Safari can only open single files.
- Internet access for the fonts and the export libraries (marked, DOMPurify, docx, SheetJS).
- The doc is written client-facing already (standing rule). Client export changes the presentation, not the words.

## Routine operation

1. Open `~/workspace/main-stage-studio/03_resources/tools/md-viewer.html` in Chrome.
2. Load content: drop a file on the page, or **Open file**, or **Open folder** (pick e.g. `~/workspace/main-stage-studio/02_clients/<client>/`).
3. Check the brand dropdown in the header. **Main Stage Studio** is the default; it switches to FightStar for FSC folders on its own.
4. Internal copy: **Export PDF**, **Export Word**, or **Export XLS** (CSV only). These show the file name in the footer.
5. Client copy: click **Client export** (the Tungsten button), then **Client PDF**, **Client Word** or **Client XLS** (CSV only).
6. In the **Client document** form, check each field:
   - **Document title**: defaults to the doc's first heading.
   - **Prepared for**: the client. It remembers what you typed last for that client folder.
   - **Prepared by**, **Date** (today), **Version** (defaults to 1.0; remembered per file).
   - **Mark as confidential**: on by default.
   - A red note appears if the file says `**Status:** internal`. Read it before going on.
7. Click **Export PDF / Word / XLS**.
   - PDF: Chrome's print dialog opens. Set Destination to **Save as PDF**, leave Headers and footers **off** (the document has its own), and save. The suggested name is the title plus version.
   - Word and XLS download straight away, named `<title>-v<version>`.

What a client copy contains:
- PDF and Word: the MSS letterhead (Spike and wordmark, the site on the right) on every page; a title block (Confidential, title, Prepared for, Prepared by, Date, Version); footer with Main Stage Studio, "Prepared for <client> · Confidential", and Page n of m.
- Left out: the file name and path, the `**Status:**` line, the doc's own first heading (the title block replaces it), and the "Grouped by" note on CSVs.
- XLS: title and details rows above the data, a filter on the header row, sized columns, a closing Main Stage Studio row, and the title, author and client in the file properties. The free spreadsheet library can't colour or bold cells.

## Checks

- Header shows the Spike in Tungsten with MAIN STAGE STUDIO on Stage Black; the page is House Lights.
- In the PDF print preview, the title block shows on page 1 and the footer says "Page 1 of N".
- Open a client .docx in Word once per change to this tool: letterhead in the page header, footer fields fill in when Word updates them.

## When it breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Plain system fonts on screen or in the PDF | Offline, or Google Fonts blocked | Reconnect and reload the page before exporting |
| Letterhead shows a plainer wordmark | Fonts hadn't loaded when the page drew the lockup | Reload with internet on, wait a second, export again |
| Word or XLS export does nothing | CDN script didn't load | Reload; check the browser console for the failed URL |
| Browser headers (date, file URL) on the PDF | Chrome's own "Headers and footers" option is on | Untick it under More settings in the print dialog |
| "Page 1 of" with no total in Word | Word hasn't updated the fields | Print preview, or select all and press F9 |
| Wrong client name prefilled | Remembered from an earlier export in that folder | Type the right one; it is remembered from then on |

Escalation: the viewer is a single HTML file under git in `main-stage-studio`. `git log -- 03_resources/tools/md-viewer.html` shows recent changes; revert the file if an edit broke it.

## Boundaries

- Client export does not rewrite content. Internal notes in the body (anything other than the Status line) go to the client as written. Keep internal notes in plan docs, not client docs.
- Nothing leaves the machine: exports are built in the browser and saved locally. Sending is a separate, deliberate step.
- The client's own brand is not applied. Brands available: MSS and FightStar.

## Change log

- 2026-10-18: created. Viewer rebranded to v6 (Stage), Client export added for PDF, Word and XLS.
