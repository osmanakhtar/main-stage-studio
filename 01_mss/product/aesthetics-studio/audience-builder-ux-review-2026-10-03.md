# Audience builder: UX review

| | |
|---|---|
| **Date** | 3 Oct 2026 |
| **Build reviewed** | `studio-platform` 3df1c40 (committed, not pushed), local sandbox, tenant `vera`, `localhost:3450/console/vera/audiences` |
| **How** | Raised by Osman: condition rows wrap badly ("had the treatment [any treatment] in the last [30] days", with Remove floating mid-row). The builder was rendered in five states (new care audience, editing a marketing audience with a leave-out rule, editing a care audience with two treatments, a preview, a save error) at 390, 768 and 1440 with the workspace viewport audit, and checked against the ui-ux-pro-max guidance (form labels, field grouping, error placement, touch targets, empty states, destructive actions). Findings marked *code* were confirmed in source as well as on screen. |
| **Screen** | `service/src/console/campaign-views.ts` `conditionRow` and `audienceBuilderPage`; parser `campaign-routes.ts` `parseRules` |

## Push decision

**Don't push 3df1c40 until P0-1 is fixed.** It isn't caused by the dashboard work, but this screen is live for PureMed today, and the fix belongs in the same push.

**Update, same day: P0 and all P1 and P2 findings fixed** in studio-platform 5c3504d (committed, not pushed), with tests for the P0 and the builder changes (182 pass). See "What changed".

## P0: fix before push

| # | Finding | Evidence | Fix |
|---|---|---|---|
| P0-1 | **Saving an audience silently drops conditions' extra values.** "Had the treatment", "did / didn't do something" and "are still in / finished the series" each hold a list, but the builder shows a single dropdown with only the first value selected, and the parser reads one value back. Opening "Skin booster and polynucleotide course" and pressing Save (even just to rename it) turns it into "Skin boosters" only. No warning, and the new version becomes the one campaigns use. | *code* `conditionRow` (`x.treatments?.[0]`, `x.event_types[0]`, `x.series[0]`), `parseRules` (`[g("treatment")]`). On screen: the skin booster audience opens with only Skin Boosters selected. | Show every value: tick boxes for treatments, events and series, read back as lists. |

## P1: fix with it

| # | Finding | Where |
|---|---|---|
| P1-1 | **Condition rows wrap mid-phrase** (the raised issue). The row is one flex line of loose words and controls, so it breaks wherever it runs out of room: "in" and "the last" split at 390px, the days box drops under the dropdown at 1440, and Remove floats vertically centred against two lines. The lead words are inconsistent too: "have the tag" sits on its own line above its control, while a leave-out "did something" row has no lead words and is indented differently. | Builder, every condition |
| P1-2 | **Conditions don't read as and/or.** Rows are separated by a hairline only; the "every condition" / "any one of these" rule is a grey note above the list, so a list of three reads as three separate things. | Builder |
| P1-3 | **The add control looks like a condition.** It defaults to "have the tag" with a bare "Add" button, so at a glance it reads as a fourth, unfinished condition (the pre-filled select under the treatment row in the reported screenshot). | Builder, both lists |
| P1-4 | **Internal ids and codes shown to staff.** The preview says "Left out: left out by this audience's rule X1"; audience cards and the campaign page say "had the treatment **skin-boosters, polynucleotides**" (keys, not the treatment names). Same class of problem as 2 Oct P1-3 and P1-4. | Preview, Audiences list, campaign page |

## P2: polish

| # | Finding | Where |
|---|---|---|
| P2-1 | The days box is styled inline without the shared border and radius, so it's the only black-bordered field on the page, and 42px tall against 44px dropdowns. | Builder |
| P2-2 | A save error ("Give the audience a name.") is shown only in the banner at the top, not at the Name field, and the field isn't marked invalid. | Builder |
| P2-3 | "Remove" is red, the colour reserved for destructive actions; removing an unsaved condition is not destructive. | Builder |
| P2-4 | The preview's empty state is "Press **Preview**." with the button out of sight at the bottom of a long form. | Preview panel |

## What changed

- **P0-1:** treatments, events and series are tick boxes; every saved value comes back ticked and is saved again. "Any treatment" is no ticks. A test opens a two-treatment audience, saves it, and checks both treatments survive.
- **P1-1:** each condition is a bordered block: its lead words as a heading with Remove on the same line, then its controls below in groups that never split ("in the last [30] days" stays together). Every condition type follows the same pattern, include and leave-out alike.
- **P1-2:** an "and" (people who) or "or" (leave out) marker sits between conditions.
- **P1-3:** the add control starts on "Choose a condition…" and the button says "Add condition" / "Add rule"; adding with nothing chosen is refused with a message.
- **P1-4:** the preview names the rule (Left out: the rule "booked (marked by you) in the last 365 days"); sentences use treatment names ("Skin Boosters or Polynucleotides").
- **P2-1 to P2-4:** shared number-field style at 44px; the name error is shown at the field with `aria-invalid` and `aria-describedby`; Remove is a quiet button; the empty preview says what to do and has its own Preview button.

## Left as it is

- The viewport audit still flags small targets at 390px: the tick boxes themselves (18px, inside a 44px label that is the real target) and the header's Sign out and Open data protection buttons (40px), which predate this review and sit on every console page.
- A long tag name is shortened inside the closed dropdown on a phone; the full name shows when it opens.
- Test-suite note found while verifying: `test/whatsapp-care.test.ts` sits near its 15 second limit and failed once. The local test database holds 3,600+ leftover test tenants, the WhatsApp webhook looks a tenant up by looping over all of them, and three local dev servers (3400, 3401, 3411) run workers against that same database during test runs. Not caused by this change; worth its own fix (an indexed lookup by phone number id, and tests on their own database). **Fixed 3 Oct 2026** (studio-platform fdcac24): tests run in `studio_platform_test`, recreated each run; migration 009 routes the webhook by an indexed number on the tenant row; the dev database was cleaned of 3,803 test tenants.
