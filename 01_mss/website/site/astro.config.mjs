import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Intake case study renamed to /work/booking-engine/ 9 Aug 2026. Old path
  // may already be indexed or shared, so redirect rather than 404.
  redirects: {
    '/work/intake': '/work/booking-engine',
    '/work/intake/prototype': '/work/booking-engine/prototype',
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Single-file HTML pages, matching the puremed pipeline convention —
    // keeps CSS inline so the page works whether served by Cloudways or
    // previewed standalone by the Stage review tool.
    inlineStylesheets: 'always',
  },
});
