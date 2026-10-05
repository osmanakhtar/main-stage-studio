// claude.js — the optional writing add-on. With an Anthropic API key saved in
// Settings, "Draft with Claude" turns a campaign brief into carousel slides
// and both captions, written to the brand's voice and compliance rules.
// Without a key the app works exactly the same; this button just stays off.
//
// The draft goes back through the same compliance check as hand-written copy,
// so a draft that breaks a rule is flagged and blocked from export like any
// other.
'use strict';

const Anthropic = require('@anthropic-ai/sdk');
const store = require('./store');

const MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5 (best writing)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5 (about half the cost)' },
];

const TEMPLATE_IDS = ['cover', 'light', 'split', 'brand', 'fact', 'quote', 'cta'];

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'slides', 'instagram', 'facebook'],
  properties: {
    title: { type: 'string' },
    slides: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['template', 'numeral', 'kicker', 'headline', 'body'],
        properties: {
          template: { type: 'string', enum: TEMPLATE_IDS },
          numeral: { type: 'string' },
          kicker: { type: 'string' },
          headline: { type: 'string' },
          body: { type: 'string' },
        },
      },
    },
    instagram: { type: 'string' },
    facebook: { type: 'string' },
  },
};

function systemPrompt() {
  const b = store.brand;
  const rules = store.lintRules;
  const ruleLines = [
    ...rules.errors.map((r) => `- NEVER: ${r.reason} (pattern /${r.pattern}/i)`),
    ...rules.warnings.map((r) => `- AVOID: ${r.reason} (pattern /${r.pattern}/i)`),
  ].join('\n');
  const files = (b.promptFiles || []).map((f) => `<file name="${f}">\n${store.readBrandFile(f)}\n</file>`).join('\n\n');
  return `You write Instagram and Facebook carousel posts for ${b.name}, ${b.location}.

Voice: ${b.voiceSummary}

The brand's own social voice and compliance rules follow. They are binding: an organic post from the clinic account is advertising under UK ASA/CAP rules, and the practitioner is the accountable advertiser.

${files}

Machine-checked rules. Any NEVER match blocks the post from export, so do not write them at all:
${ruleLines}

Slide templates you can use:
- cover: first slide. A short hook headline (ideally under 8 words) that earns the swipe. Optional kicker. Body optional and short.
- light: one point per slide. numeral "01", "02"... in order, a short kicker, headline under 50 characters, body under 200 characters.
- brand: a key message or summary in a contrasting colour. No numeral.
- fact: one figure shown large. numeral is the figure, kept short (for example "18–24" or "1–2"), headline says what it measures (for example "Months results typically last"). Only figures stated in the brief or the brand files; never estimate one.
- quote: headline is the quote, kicker is who said it. Only use for a quote the brief actually provides; never invent testimonials.
- cta: last slide. One consultation-led ask, never urgency. Body points to the link in bio.
Do not use "split" or "photos"; she adds photos herself.
Leave numeral, kicker or body as an empty string when a template doesn't use them.

Captions: follow the Instagram and Facebook rules in the voice file (hook in the first 125 characters, one CTA at the end, hashtags as specified, booking link ${b.bookingUrl} only on Facebook). British English. No em dashes anywhere.`;
}

async function draft({ brief, topic, pillar, slideCount }) {
  const settings = store.getSettings();
  if (!settings.apiKey) throw new Error('Add an Anthropic API key in Settings to use drafting.');
  const client = new Anthropic({ apiKey: settings.apiKey });
  const topicObj = store.brand.topics.find((t) => t.id === topic);
  const pillarObj = store.pillars.find((p) => p.id === pillar);
  const n = Math.max(3, Math.min(10, Number(slideCount) || 6));

  const user = [
    `Write one carousel post of exactly ${n} slides, starting with a cover slide and ending with a cta slide, plus the Instagram and Facebook captions.`,
    topicObj ? `${store.brand.topicLabel}: ${topicObj.name}${topicObj.pomSensitive ? ' (prescription-only medicine involved: consultation-led framing only, never name or promote the drug, no price)' : ''}` : '',
    pillarObj ? `Content pillar: ${pillarObj.name}. ${pillarObj.guidance}` : '',
    `Campaign brief from the clinic:\n<brief>\n${String(brief || '').trim()}\n</brief>`,
    'Use only facts in the brief or the brand files. If the brief makes a claim the rules forbid, leave it out rather than soften it.',
  ].filter(Boolean).join('\n\n');

  let response;
  try {
    response = await client.beta.messages.create({
      model: settings.model,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
      system: systemPrompt(),
      messages: [{ role: 'user', content: user }],
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new Error('The API key was not accepted. Check it in Settings.');
    if (err instanceof Anthropic.RateLimitError) throw new Error('Anthropic is busy or the account has hit its limit. Try again in a minute.');
    if (err instanceof Anthropic.APIConnectionError) throw new Error('Could not reach Anthropic. Check the internet connection.');
    if (err instanceof Anthropic.APIError) throw new Error(`Anthropic returned an error (${err.status}). Try again, or write the slides by hand.`);
    throw err;
  }

  if (response.stop_reason === 'refusal') {
    throw new Error('Claude declined this brief. Try rewording it, or write the slides by hand.');
  }
  if (response.stop_reason === 'max_tokens') {
    throw new Error('The draft was cut off. Try fewer slides.');
  }
  const text = response.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
  let out;
  try { out = JSON.parse(text); } catch { throw new Error('Claude returned something that was not a draft. Please try again.'); }

  const slides = out.slides.map((s) => {
    const slide = { template: s.template };
    for (const k of ['numeral', 'kicker', 'headline', 'body']) if (s[k]) slide[k] = s[k];
    return slide;
  });
  return { title: out.title, slides, caption: { instagram: out.instagram, facebook: out.facebook } };
}

module.exports = { draft, MODELS };
