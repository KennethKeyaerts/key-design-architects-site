// Runs before `astro build`. Pulls the current CMS content from Firestore and
// writes it into src/data/*.json + public/images/projects/*, so the static
// pages built by Astro always reflect whatever was last saved in /beheerder.
//
// If Firestore is unreachable (offline build, no credentials, etc.) this
// script leaves the existing src/data/*.json files untouched instead of
// failing the build, so a bad network never takes the whole site down.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const firebaseConfig = {
  projectId: 'key-design-architects',
  appId: '1:898830519155:web:0b5298167b1fc566fa5306',
  apiKey: 'AIzaSyB5AunSdowb02zeF9vhjbofL7jzQpIYYj4',
  authDomain: 'key-design-architects.firebaseapp.com',
  storageBucket: 'key-design-architects.firebasestorage.app',
  messagingSenderId: '898830519155',
};

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Responsive webp variants (640 to 2400px) so phones fetch small files and
// large screens still get sharp ones. Silently skipped if sharp is missing.
const pendingVariants = [];
let sharpMod = null;
try { sharpMod = (await import('sharp')).default; } catch { /* optional */ }
async function makeVariants(file) {
  if (!sharpMod) return;
  try {
    const stem = file.replace(/\.[^.]+$/, '');
    const meta = await sharpMod(file).metadata();
    for (const w of [640, 1024, 1600, 2400]) {
      if (meta.width && w > meta.width) continue;
      await sharpMod(file).resize({ width: w }).webp({ quality: 82 }).toFile(`${stem}-${w}.webp`);
    }
  } catch (e) { console.warn('[fetch-content] variants skipped for', file, e.message); }
}

function saveDataUri(dataUri, outDir, baseName) {
  const m = /^data:image\/([\w+.-]+);base64,(.*)$/s.exec(dataUri);
  if (!m) return dataUri;
  let ext = m[1] === 'svg+xml' ? 'svg' : m[1];
  const buf = Buffer.from(m[2], 'base64');
  const fname = `${baseName}.${ext}`;
  writeFileSync(path.join(outDir, fname), buf);
  pendingVariants.push(path.join(outDir, fname));
  // The returned URL must reflect wherever the file was actually written,
  // not a hardcoded folder — this was silently broken for hero slides
  // before (file saved to /images/hero/, but the URL always said
  // /images/projects/ regardless), so the caption/order metadata worked
  // (pure text, no file needed) while the photo itself 404'd.
  const publicDir = path.join(ROOT, 'public');
  const urlPath = '/' + path.relative(publicDir, path.join(outDir, fname)).split(path.sep).join('/');
  return urlPath;
}

function extractImages(project, outDir) {
  const p = { ...project };
  if (typeof p.image === 'string' && p.image.startsWith('data:image')) {
    p.image = saveDataUri(p.image, outDir, `${p.id}_main`);
  }
  if (Array.isArray(p.images)) {
    p.images = p.images.map((img, i) =>
      typeof img === 'string' && img.startsWith('data:image') ? saveDataUri(img, outDir, `${p.id}_img${i}`) : img
    );
  }
  if (Array.isArray(p.timeline)) {
    p.timeline = p.timeline.map((step) => {
      if (!Array.isArray(step.images)) return step;
      return {
        ...step,
        images: step.images.map((img, j) =>
          typeof img === 'string' && img.startsWith('data:image')
            ? saveDataUri(img, outDir, `${p.id}_${step.id || 'step'}_${j}`)
            : img
        ),
      };
    });
  }
  p.slug = p.slug || slugify(p.title || p.id);
  return p;
}

async function main() {
  // Temporary switch: while the Firebase/Google account access for this
  // project is still being sorted out, Firestore holds stale/incomplete
  // content (missing projects, an old test project, etc). Rather than let a
  // broken database silently make the live site wrong, setting
  // SKIP_FIRESTORE_FETCH=true (as a Netlify environment variable) makes the
  // build skip this fetch entirely and use whatever is already committed in
  // src/data/*.json, exactly what was tested locally, instead. Remove that
  // environment variable later, once /beheerder logins work again, to
  // resume pulling live content from Firestore on every build.
  if (process.env.SKIP_FIRESTORE_FETCH === 'true') {
    console.log('[fetch-content] SKIP_FIRESTORE_FETCH is set: using the committed src/data/*.json files as-is, not touching Firestore.');
    process.exit(0);
  }

  const dataDir = path.join(ROOT, 'src', 'data');
  const imagesDir = path.join(ROOT, 'public', 'images', 'projects');
  const heroImagesDir = path.join(ROOT, 'public', 'images', 'hero');
  mkdirSync(dataDir, { recursive: true });
  mkdirSync(imagesDir, { recursive: true });
  mkdirSync(heroImagesDir, { recursive: true });

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const settingsSnap = await getDoc(doc(db, 'site_settings', 'homeTexts'));
    const settings = settingsSnap.exists() ? settingsSnap.data() : {};

    const projectsSnap = await getDocs(query(collection(db, 'projects'), orderBy('order', 'asc')));
    const projects = projectsSnap.docs
      .map((d) => extractImages({ id: d.id, ...d.data() }, imagesDir))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const heroSnap = await getDocs(query(collection(db, 'hero_slides'), orderBy('order', 'asc')));
    const heroSlides = heroSnap.docs
      .map((d) => {
        const slide = { id: d.id, ...d.data() };
        if (typeof slide.image === 'string' && slide.image.startsWith('data:image')) {
          slide.image = saveDataUri(slide.image, heroImagesDir, `slide_${d.id}`);
        }
        return slide;
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    for (const f of pendingVariants) await makeVariants(f);
    writeFileSync(path.join(dataDir, 'site_settings.json'), JSON.stringify(settings, null, 2));
    writeFileSync(path.join(dataDir, 'projects.json'), JSON.stringify(projects, null, 2));
    writeFileSync(path.join(dataDir, 'hero_slides.json'), JSON.stringify(heroSlides, null, 2));

    console.log(`[fetch-content] Synced ${projects.length} project(s), ${heroSlides.length} hero slide(s), and site settings from Firestore.`);
  } catch (err) {
    if (existsSync(path.join(dataDir, 'site_settings.json')) && existsSync(path.join(dataDir, 'projects.json'))) {
      console.warn('[fetch-content] Could not reach Firestore, building with last-known content instead:', err.message);
    } else {
      console.error('[fetch-content] Could not reach Firestore and no cached content exists. Failing build.');
      throw err;
    }
  }
}

main();
