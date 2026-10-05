// lint.js — the compliance check. Same rules and same matching as Studio's
// content-lint.js (scripts/content-lint.js in the workspace repo): the brand
// pack's lint-rules.json, case-insensitive regex. Errors block export;
// warnings are shown for a human look and do not block.
(function (root) {
  'use strict';

  function lintText(rules, text, where) {
    const out = [];
    if (!text) return out;
    for (const level of ['errors', 'warnings']) {
      for (const rule of rules[level] || []) {
        const re = new RegExp(rule.pattern, 'gi');
        let m;
        while ((m = re.exec(text)) !== null) {
          out.push({ level: level === 'errors' ? 'error' : 'warning', match: m[0], reason: rule.reason, where });
          if (m[0] === '') re.lastIndex++;
        }
      }
    }
    return out;
  }

  // Every public word in a post: each slide plus both captions.
  function lintPost(rules, post, slideText) {
    const issues = [];
    (post.slides || []).forEach((s, i) => issues.push(...lintText(rules, slideText(s), `Slide ${i + 1}`)));
    const cap = post.caption || {};
    issues.push(...lintText(rules, cap.instagram, 'Instagram caption'));
    issues.push(...lintText(rules, cap.facebook, 'Facebook caption'));
    return issues;
  }

  const api = { lintText, lintPost };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Lint = api;
})(typeof self !== 'undefined' ? self : this);
