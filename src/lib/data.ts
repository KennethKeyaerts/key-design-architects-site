import siteSettingsRaw from '../data/site_settings.json';
import projectsRaw from '../data/projects.json';
import heroSlidesRaw from '../data/hero_slides.json';

export interface TimelineStep {
  id: string;
  phase: string;
  title: string;
  date: string;
  description: string;
  images?: string[];
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  description: string;
  concept?: string;
  materials?: string[];
  specs?: Record<string, string>;
  image: string;
  images?: string[];
  video?: string;
  quote?: string;
  starred?: boolean;
  order?: number;
  timeline?: TimelineStep[];
  attributionNote?: string; // for projects designed by a different firm (e.g. experience gained during prior employment): rendered as a prominent, unmissable notice on the project's own page, never silently omitted
  en?: Record<string, any>; // English translations of this project's text fields, used by the /en/ pages
  statusNote?: string; // for self-initiated studies/unbuilt concepts (e.g. a feasibility study): rendered as its own prominent, unmissable notice, distinct in tone from attributionNote since it's a different kind of caveat (not-yet-realized, not authorship)
}

export type SiteSettings = Record<string, any>;

// Every editable text/setting from the original CMS lives here, keyed exactly
// the same way as before, so the admin dashboard can keep editing the same
// fields without a data migration on the content side.
export const siteSettings: SiteSettings = siteSettingsRaw as SiteSettings;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// High-resolution originals live as files in /public/images/hq (responsive
// variants are generated from them). Firestore documents are capped at 1 MB,
// so images stored there are heavily compressed; for the known projects and
// hero slides we swap in the high-quality files, matched by id and position.
const HQ_PROJECT_IMAGES: Record<string, string[]> = {
  proj_herbestemming_herenhuizen: [
    'kwartier14_01_straatbeeld', 'kwartier14_02_nieuwbouw', 'kwartier14_03_tuin',
    'kwartier14_04_avond', 'kwartier14_05_keuken', 'kwartier14_06_living',
  ],
  proj_vandalis_watergroep: ['vandalis_interieur'],
};
const HQ_SLIDE_IMAGES: Record<string, string> = {
  seed_hero_1: 'kwartier14_01_straatbeeld',
  seed_hero_2: 'kwartier14_02_nieuwbouw',
  seed_hero_3: 'kwartier14_03_tuin',
  seed_hero_4: 'kwartier14_04_avond',
};
const hqPath = (stem: string) => `/images/hq/${stem}.jpg`;

function applyHq(p: Project): Project {
  const list = HQ_PROJECT_IMAGES[p.id];
  if (!list) return p;
  const images = [...(p.images ?? [])];
  list.forEach((stem, i) => { images[i] = hqPath(stem); });
  return { ...p, image: hqPath(list[0]), images };
}

export const projects: Project[] = (projectsRaw as Project[])
  .map((p) => applyHq({ ...p, slug: p.slug || slugify(p.title) }))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export interface HeroSlide {
  id: string;
  image: string;
  title?: string;
  location?: string;
  year?: string;
  description?: string;
  order?: number;
  titleEn?: string; // English caption, shown on the /en/ pages
  focusX?: number; focusY?: number; focusMobileX?: number | null; focusMobileY?: number | null; // chosen focal point of the photo (percent) for computer/tablet and phone
  projectSlug?: string; // the project this slide shows; drives the hero's "View this project" button
}

export const heroSlides: HeroSlide[] = (heroSlidesRaw as HeroSlide[])
  .map((sl) => (HQ_SLIDE_IMAGES[sl.id] ? { ...sl, image: hqPath(HQ_SLIDE_IMAGES[sl.id]) } : sl))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

/**
 * Resolved hero configuration for the homepage's full-bleed hero section.
 * mode 'video' needs at least one of heroVideoUrlDesktop / heroVideoUrlMobile
 * set (in /beheerder → Hero); otherwise falls back to slides even if 'video'
 * was selected, so the hero never renders empty.
 */
export function getHeroConfig() {
  const mode = siteSettings.heroBgMode === 'video' ? 'video' : 'slides';
  const videoDesktop = siteSettings.heroVideoUrlDesktop || siteSettings.heroVideoUrl || '';
  const videoMobile = siteSettings.heroVideoUrlMobile || videoDesktop;
  const hasVideo = Boolean(videoDesktop || videoMobile);
  // Fallback so the hero is never visually empty if Firestore has no slides
  // yet (e.g. before scripts/seed-content.mjs has been run).
  const slides = heroSlides.length
    ? heroSlides
    : [{ id: 'fallback', image: '/images/brand/hero-foto.jpg', title: '', location: '', year: '' }];
  return {
    mode: mode === 'video' && hasVideo ? 'video' : 'slides',
    videoDesktop,
    videoMobile,
    slides,
  };
}

/** Small helper so templates can do settings.get('heroTitle', 'fallback') */
export function s(key: string, fallback = ''): string {
  const val = siteSettings[key];
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}
