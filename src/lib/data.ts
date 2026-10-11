import siteSettingsRaw from '../data/site_settings.json';
import projectsRaw from '../data/projects.json';
import heroSlidesRaw from '../data/hero_slides.json';
import demoOverlay from '../data/demo-overlay.json';

export interface TimelineStep {
  id: string;
  phase: string;
  title: string;
  date: string;
  description: string;
  images?: string[];
}

export interface ProjectBlock {
  id: string;
  type: 'heading' | 'text' | 'image' | 'images2' | 'images3' | 'quote' | 'video';
  text?: string;       // heading / text / quote / video url
  images?: string[];   // image paths taken from the project's own photos
  caption?: string;
  en?: { text?: string; caption?: string }; // English version of the texts
}

/** Project phases, in order. Used for the badge on cards and the progress bar on a project page. */
export const PHASES: { key: string; nl: string; en: string }[] = [
  { key: 'voorstudie', nl: 'Voorstudie', en: 'Preliminary study' },
  { key: 'haalbaarheid', nl: 'Haalbaarheid', en: 'Feasibility' },
  { key: 'ontwerp', nl: 'Ontwerp', en: 'Design' },
  { key: 'vergunning', nl: 'Vergunningstraject', en: 'Permit procedure' },
  { key: 'werf', nl: 'Op de werf', en: 'Under construction' },
  { key: 'opgeleverd', nl: 'Opgeleverd', en: 'Completed' },
];
export const phaseLabel = (key: string | undefined, en = false) => {
  const ph = PHASES.find((p) => p.key === key);
  return ph ? (en ? ph.en : ph.nl) : '';
};

export interface ProjectSchema {
  image: string;
  caption?: string;
  en?: { caption?: string };
}
export interface ImageInfo {
  type?: string;     // key of IMAGE_TYPES
  caption?: string;
  en?: { caption?: string };
}
export interface Contribution { nl: string; en?: string; }

/** Labels that can be put on a photo in the "Beeldmateriaal" zone of a project. */
export const IMAGE_TYPES: { key: string; nl: string; en: string }[] = [
  { key: 'oplevering', nl: 'Oplevering', en: 'Completed' },
  { key: 'werf', nl: 'Werffoto', en: 'Site photo' },
  { key: 'render', nl: '3D-beeld', en: '3D render' },
  { key: 'plan', nl: 'Plan', en: 'Plan' },
  { key: 'schets', nl: 'Schets', en: 'Sketch' },
  { key: 'detail', nl: 'Detail', en: 'Detail' },
];
export const imageTypeLabel = (key: string | undefined, en = false) => {
  const t = IMAGE_TYPES.find((x) => x.key === key);
  return t ? (en ? t.en : t.nl) : '';
};

/** Ready-made contribution labels; the owner can also type his own in /beheerder. */
export const CONTRIBUTION_PRESETS: Contribution[] = [
  { nl: 'Ontwerp', en: 'Design' },
  { nl: 'Haalbaarheidsstudie', en: 'Feasibility study' },
  { nl: 'Vergunningsdossier', en: 'Permit application' },
  { nl: 'Aanbestedingsdossier', en: 'Tender documents' },
  { nl: 'Uitvoeringsdossier', en: 'Execution documents' },
  { nl: 'Opvolging van de werf', en: 'Site supervision' },
  { nl: 'Verslaggeving', en: 'Site reports' },
  { nl: 'Coördinatie met aannemers en studiebureaus', en: 'Coordination with contractors and engineers' },
  { nl: 'Technische tekeningen', en: 'Technical drawings' },
  { nl: 'Interieurontwerp', en: 'Interior design' },
  { nl: '3D-visualisatie', en: '3D visualisation' },
  { nl: 'Oplevering', en: 'Handover' },
];

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
  role?: 'own' | 'collaborated'; // own = designed by Key-Design; collaborated = worked on it for another firm/employer (attributionNote explains)
  phase?: string; // one of PHASES[].key
  schemas?: ProjectSchema[]; // sketches, axonometries, diagrams shown in the swipeable zone under the title
  imageInfo?: Record<string, ImageInfo>; // label + caption per photo, keyed by the photo's path
  contributions?: Contribution[]; // what the owner contributed to this project (design, tender file, site supervision, ...)
  blocks?: ProjectBlock[]; // free page layout built in /beheerder; when absent the classic layout is used
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

// Images re-uploaded through /beheerder live under /images/uploads/ and are already full quality:
// those are never overridden. Only the old, heavily compressed copies are swapped for the HQ files.
const isUpload = (src?: string) => typeof src === 'string' && src.startsWith('/images/uploads/');
function applyHq(p: Project): Project {
  const list = HQ_PROJECT_IMAGES[p.id];
  if (!list) return p;
  const before = [...(p.images ?? [])];
  const images = [...before];
  list.forEach((stem, i) => { if (!isUpload(images[i])) images[i] = hqPath(stem); });
  // keep labels/captions attached to the same photo when a path is swapped for its HQ file
  let imageInfo = p.imageInfo;
  if (imageInfo) {
    imageInfo = { ...imageInfo };
    images.forEach((path, i) => { if (before[i] && before[i] !== path && imageInfo![before[i]]) imageInfo![path] = imageInfo![before[i]]; });
  }
  return { ...p, image: isUpload(p.image) ? p.image : hqPath(list[0]), images, imageInfo };
}

// Temporary example content (src/data/demo-overlay.json): fills ONLY what is still empty on a project,
// so everything entered in /beheerder always wins. Delete that file's contents ({}) to remove all examples.
const isEmpty = (v: any) => v == null || v === '' || (Array.isArray(v) && v.length === 0) || (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0);
function applyDemo(p: Project): Project {
  const ov: any = (demoOverlay as any)[p.id];
  if (!ov) return p;
  const out: any = { ...p };
  for (const [k, v] of Object.entries(ov)) {
    if (k === '_entl') continue;
    if (k === 'images') { if ((out.images?.length ?? 0) < (v as any[]).length) out.images = v; continue; }
    if (isEmpty(out[k])) out[k] = v;
  }
  if (ov._entl && isEmpty(out.en?.timeline) && isEmpty(p.timeline)) out.en = { ...(out.en || {}), timeline: ov._entl };
  delete out.statusNote; // the phase bar replaces the old status box
  return out as Project;
}

export const projects: Project[] = (projectsRaw as Project[])
  .map((p) => applyDemo(p))
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
  projectId?: string; // id of the linked project (preferred: survives a renamed project)
  projectSlug?: string; // the project this slide shows; drives the hero's "View this project" button
}

export const heroSlides: HeroSlide[] = (heroSlidesRaw as HeroSlide[])
  .map((sl) => (HQ_SLIDE_IMAGES[sl.id] && !isUpload(sl.image) ? { ...sl, image: hqPath(HQ_SLIDE_IMAGES[sl.id]) } : sl))
  // A slide linked to a project (projectId) always follows that project: its link,
  // and, unless the slide has its own text, its title, place and year. A deleted
  // project simply loses the link instead of breaking the page.
  .map((sl) => {
    const proj = sl.projectId ? projects.find((p) => p.id === sl.projectId) : sl.projectSlug ? projects.find((p) => p.slug === sl.projectSlug) : undefined;
    if (!proj) return { ...sl, projectSlug: sl.projectId ? undefined : sl.projectSlug };
    return {
      ...sl,
      projectSlug: proj.slug,
      image: sl.image || proj.image,
      title: sl.title || proj.title,
      location: sl.location || proj.location,
      year: sl.year || proj.year,
    };
  })
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

/** A branding image (logo, portrait, ...) the owner can replace in /beheerder; falls back to the built-in file. */
export function brandImg(key: string, fallback: string): string {
  const val = siteSettings[key];
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}

/** Small helper so templates can do settings.get('heroTitle', 'fallback') */
export function s(key: string, fallback = ''): string {
  const val = siteSettings[key];
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}


// ---------- Project filters, homepage selection, display options (all editable in /beheerder) ----------
export interface FilterItem { key: string; nl: string; en: string; }
export interface FilterConfig { all: { nl: string; en: string }; items: FilterItem[]; }

const DEFAULT_FILTERS: FilterConfig = {
  all: { nl: 'Alle projecten', en: 'All projects' },
  items: [
    { key: 'nieuwbouw', nl: 'Nieuwbouw', en: 'New-build' },
    { key: 'renovatie', nl: 'Totaalrenovatie', en: 'Full Renovation' },
    { key: 'interieur', nl: 'Interieur & Maatwerk', en: 'Interior & Custom Work' },
  ],
};

export const defaultFilterConfig = DEFAULT_FILTERS;
export function resolveFilterConfig(c?: Partial<FilterConfig> | null): FilterConfig {
  if (!c || !Array.isArray(c.items)) return DEFAULT_FILTERS;
  return {
    all: { nl: c.all?.nl || DEFAULT_FILTERS.all.nl, en: c.all?.en || DEFAULT_FILTERS.all.en },
    items: c.items.filter((i) => i && i.key).map((i) => ({ key: i.key, nl: i.nl || i.key, en: i.en || i.nl || i.key })),
  };
}
export function getFilterConfig(): FilterConfig {
  return resolveFilterConfig(siteSettings.projectFilterConfig as Partial<FilterConfig> | undefined);
}

/** Label of a project category (filter), in Dutch or English. Unknown keys are shown as written. */
export function categoryLabel(key: string | undefined, en = false): string {
  if (!key) return '';
  const f = getFilterConfig().items.find((i) => i.key === key);
  if (f) return en ? f.en : f.nl;
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/** Black-and-white project photos that turn to colour on hover (owner can switch it off). */

export interface FeaturedEntry { projectId: string; label?: string; labelEn?: string; text?: string; textEn?: string; }
export interface FeaturedItem { project: Project; label: string; labelEn: string; text: string; textEn: string; link: string; linkEn: string; }

/** The 2 or 3 projects shown on the homepage, with the label the owner wrote for each. */
export function getFeatured(): FeaturedItem[] {
  const cfg = Array.isArray(siteSettings.featuredProjects) ? (siteSettings.featuredProjects as FeaturedEntry[]) : [];
  const fromCfg = cfg
    .map((e) => ({ e, project: projects.find((p) => p.id === e.projectId) }))
    .filter((x): x is { e: FeaturedEntry; project: Project } => Boolean(x.project))
    .slice(0, 2)
    .map(({ e, project }) => ({ project, label: e.label ?? '', labelEn: e.labelEn ?? e.label ?? '', text: e.text ?? '', textEn: e.textEn ?? e.text ?? '', link: 'Bekijk dit project', linkEn: 'View this project' }));
  if (fromCfg.length) return fromCfg;
  // No selection made yet: starred projects, then the classic pair, then whatever exists.
  const pool = [
    ...projects.filter((p) => p.starred),
    getProjectBySlug('woning-lookstraat'),
    getProjectBySlug('kwartier-xiv'),
    ...projects,
  ].filter((p, i, a): p is Project => Boolean(p) && a.indexOf(p) === i).slice(0, 2);
  const defaults = [
    { label: 'Voor particulieren', labelEn: 'For private clients', text: 'Uw eigen woning, van eerste idee tot een verbouwing die klopt tot in de details.', textEn: 'Your own home, from first idea to a renovation that holds up to the smallest detail.', link: 'Bekijk deze verbouwing', linkEn: 'View this renovation' },
    { label: 'Voor ontwikkelaars & vastgoed', labelEn: 'For developers & real estate', text: 'Haalbaarheid, ruimtelijk rendement en architecturale meerwaarde voor uw vastgoedproject.', textEn: 'Feasibility, spatial yield and architectural added value for your real estate project.', link: 'Ontdek dit ontwikkelingsproject', linkEn: 'Discover this development' },
  ];
  return pool.map((project, i) => ({ project, ...defaults[i] }));
}
