import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Fully static output: every public page is pre-rendered to real HTML at build
// time (no client-side rendering needed to see content -> readable by any
// crawler, no loading screen). Only the /beheerder admin dashboard and a
// handful of interactive widgets (contact form, feasibility calculator) hydrate
// React on the client ("islands") — the rest of each page is plain HTML/CSS.
export default defineConfig({
  site: 'https://www.keydesignarchitects.be',
  output: 'static',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap({ filter: (page) => !page.includes('/beheerder') }),
  ],
});
