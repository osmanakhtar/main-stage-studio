# MSS — New Client Checklist

*Run through this in order for every new engagement. Do not start build work until sections 1–3 are complete.*

---

## 1. Scoping

- [ ] Initial conversation had — understand the client, their audience, their ambition
- [ ] Engagement type defined — Brand only / Web only / Full (Discovery → Brand → Design system → Web)
- [ ] Hosting model agreed — Option A (MSS Cloudways) or Option B (client's own)
- [ ] Rough timeline agreed
- [ ] Rough budget agreed
- [ ] Proposal / scope of work sent
- [ ] Scope signed off — verbal or written

---

## 2. Setup

- [ ] Client folder created at `~/projects/clients/[client-name]/` — **not inside MSS directory**
- [ ] Folder structure copied from `~/projects/clients/_template/`
- [ ] `discovery/constraints.md` opened and filled in before any design work
- [ ] `CLAUDE.md` written at project root — references constraints doc, sets session context
- [ ] iTerm2 tab created, named, opened from Clients profile
- [ ] `cd ~/projects/clients/[client-name]/` confirmed as working directory

---

## 3. Discovery

- [ ] `discovery/brief.md` written — client, audience, differentiator, goals
- [ ] `discovery/constraints.md` complete:
  - [ ] Spatial character defined
  - [ ] Off-limits layout conventions named (minimum two)
  - [ ] Emotional register — three words
  - [ ] References outside the web identified
  - [ ] What this brand is not — visual, emotional, structural
- [ ] Competitor and reference research documented in `discovery/`
- [ ] Discovery signed off with client before moving to brand

---

## 4. Brand

- [ ] Logo concepts developed in `brand/`
- [ ] Colour palette defined and documented
- [ ] Typography selected and documented
- [ ] Tone of voice notes in `brand/`
- [ ] Key messages drafted
- [ ] Brand presented to client
- [ ] Brand signed off before moving to design system

---

## 5. Design system

- [ ] Component library started in `design-system/`
- [ ] Spacing and sizing tokens documented
- [ ] Asset exports organised
- [ ] Design system reviewed — consistent with brand

---

## 6. Web

- [ ] HTML prototype built in Claude Code
- [ ] Prototype reviewed and locked
- [ ] LocalWP environment set up
- [ ] WordPress + Bricks Builder installed
- [ ] Bricks licence activated on staging domain
- [ ] Prototype migrated to Bricks
- [ ] Content populated
- [ ] Client review — feedback captured
- [ ] Revisions complete
- [ ] Go-live checklist run (see `mss-build-guide.html`)

---

## 7. Handover

- [ ] All client-facing files collected in `deliverables/`
- [ ] Access credentials documented securely
- [ ] Handover document written
- [ ] DNS transferred / pointed if relevant
- [ ] Client signed off on live site
- [ ] Invoice raised

---

## 8. Portfolio

- [ ] Case study folder created at `~/projects/mss/portfolio/case-studies/[client-name]/`
- [ ] Case study written — story, insight, outcomes (not raw working files)
- [ ] Case study design has its own creative identity — not MSS aesthetic
- [ ] Screenshots / visuals collected
- [ ] Case study added to MSS website work section

---

## Hosting model reference

| Option | When to use |
|--------|-------------|
| A — MSS Cloudways | Early-stage clients, family/low-overhead projects, retainer relationships |
| B — Client's own hosting | Established clients with technical resource, clean separation preferred |
