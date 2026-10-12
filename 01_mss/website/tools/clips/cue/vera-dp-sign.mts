// Filming database only (studio_film_sandbox): Vera's owner completes and signs the DPIA and accepts the DPA,
// through the platform's own write paths (the functions the console's data protection pages call), so the
// legacy importer's DPIA gate is met the real way before the Platform film's import. Vera is fictional and
// so are these answers. Refuses to run against any database without "film_sandbox" in its name.
//   cd <studio-platform worktree>/service && npx tsx --env-file=.env.sandbox <this file> (vera-dp-sign.mts: an ES module, for the top-level awaits)
const SVC = process.cwd();
const { tenantBySlug, withTenant } = await import(`${SVC}/src/db/pool.ts`);
const { activeConfig } = await import(`${SVC}/src/spine/spine.ts`);
const { saveDpiaDraft, signDpia, acceptDpa, dpContext, tenantDpStatus } = await import(`${SVC}/src/dp/store.ts`);
const { partA } = await import(`${SVC}/src/dp/render.ts`);
const { sha256 } = await import(`${SVC}/src/lib/identity.ts`);
const { ARTICLE9_CONDITIONS } = await import(`${SVC}/src/dp/types.ts`);

if (!/film_sandbox/.test(process.env.DATABASE_URL ?? "")) throw new Error("refusing: DATABASE_URL is not the filming database");
const t = await tenantBySlug("vera");
if (!t) throw new Error("no vera tenant");
const at = new Date();
const owner = { email: "owner@vera-aesthetics.example", name: "Vera Hale", role: "owner", kind: "person" } as const;
const NOTE = "Vera is a fictional demonstration clinic: answered for the sandbox, holds no real people.";

const ctx = await withTenant(t.id, async (db: any) => dpContext(db, await activeConfig(db)));
if (!ctx) throw new Error("Vera's config has no data protection content (republish the kit beside the packs)");

const basis: Record<string, string> = { "B1.1": "Consent", "B1.2": "Consent", "B1.3": "Consent", "B1.4": "Consent", "B1.5": "Legitimate interests", "B1.7": "Legal obligation", "B1.8": "Legitimate interests" };
const periods: Record<string, [string, string]> = { "B10.2": ["8", "years"], "B5.1": ["2", "years"], "B5.2": ["2", "years"], "B5.3": ["6", "years"], "B5.4": ["2", "years"], "B5.5": ["6", "years"], "B5.6": ["1", "years"], "B5.7": ["permanently", ""] };
const texts: Record<string, string> = {
  "B2.3": "No. Names, emails and what someone agreed to don't reveal health on their own.",
  "B3.1": "A starting point for a conversation. It decides nothing: the practitioner recommends in the room.",
  "B7.3": "Vera Hale, owner.",
  "B7.4": "Fictional clinic: not registered (ZB000000 used as a placeholder in the sandbox).",
  "B9.1": "No.",
};
const ynu: Record<string, string> = { "B10.1": "yes", "B10.3": "no", "B2.1": "yes", "B3.3": "yes", "B3.4": "yes", "B4.3": "no", "B4.4": "no", C7: "no" };
const art9 = ARTICLE9_CONDITIONS.find((c: string) => c.includes("9(2)(h)")) ?? ARTICLE9_CONDITIONS[0];

await saveDpiaDraft(t.id, owner as any, "film", at, (d: any) => {
  for (const s of partA(ctx)) d.facts[s.id] = { verdict: "right", text_hash: sha256(s.md), by: `staff:${owner.email}`, at: at.toISOString() };
  for (const q of ctx.dp.questions) {
    if (q.type === "lawful_basis") d.answers[q.id] = { status: "answered", value: basis[q.id] ?? "Consent", note: NOTE };
    else if (q.type === "article9_condition") d.answers[q.id] = { status: "answered", value: art9, note: NOTE };
    else if (q.type === "period") { const [v, u] = periods[q.id] ?? ["2", "years"]; d.answers[q.id] = { status: "answered", value: v, ...(u ? { unit: u } : {}), note: NOTE }; }
    else if (q.type === "yes_no_unsure") d.answers[q.id] = { status: "answered", value: ynu[q.id] ?? "no", note: NOTE };
    else if (q.type === "choice") d.answers[q.id] = { status: "answered", value: q.options?.[0] ?? "", note: NOTE };
    else d.answers[q.id] = { status: "answered", value: texts[q.id] ?? "Not applicable to a fictional clinic." };
  }
  for (const r of ctx.dp.risks) d.risks[r.id] = { agree: "yes", likelihood: "low", severity: "medium", measures: r.measures };
});

const dpia = await signDpia(t.id, owner as any, { name: "Vera Hale", role: "Owner" }, at);
if (!dpia.ok) throw new Error("DPIA not signed:\n  " + dpia.problems.join("\n  "));
const dpa = await acceptDpa(t.id, owner as any, { name: "Vera Hale", role: "Owner", icoRegistered: true, icoNumber: "ZB000000 (fictional)" }, at);
if (!dpa.ok) throw new Error("DPA not accepted:\n  " + dpa.problems.join("\n  "));
const st = await tenantDpStatus(t.id);
console.log(`DPIA v${dpia.version} signed and DPA accepted by Vera Hale; current: ${st?.current}`);
process.exit(0);
