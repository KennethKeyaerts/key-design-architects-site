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


// ---------- Full-quality uploads ("blob:<id>" references) ----------
// Photos and logos uploaded in /beheerder are stored as a manifest document
// plus chunk documents in the "image_blobs" collection (see src/lib/imageStore.ts).
// Here every reference found in the content is turned into a real file under
// /images/uploads/ (and, for photos, into several WebP sizes), then replaced
// by that file's path, so the public site never talks to Firestore for images.
function collectBlobIds(node, out = new Set()) {
  if (typeof node === 'string') { if (node.startsWith('blob:')) out.add(node.slice(5)); }
  else if (Array.isArray(node)) node.forEach((n) => collectBlobIds(n, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) { if (k.startsWith('blob:')) out.add(k.slice(5)); collectBlobIds(v, out); }
  }
  return out;
}
function replaceBlobRefs(node, map) {
  if (typeof node === 'string') return node.startsWith('blob:') ? (map.get(node.slice(5)) ?? '') : node;
  if (Array.isArray(node)) return node.map((n) => replaceBlobRefs(n, map));
  if (node && typeof node === 'object') {
    const o = {};
    for (const [k, v] of Object.entries(node)) {
      const key = k.startsWith('blob:') ? (map.get(k.slice(5)) || k) : k; // photo labels are keyed by the photo's reference
      o[key] = replaceBlobRefs(v, map);
    }
    return o;
  }
  return node;
}
async function resolveBlobs(db, ids, outDir) {
  const map = new Map();
  for (const id of ids) {
    try {
      const mSnap = await getDoc(doc(db, 'image_blobs', id));
      if (!mSnap.exists()) { console.warn(`[fetch-content] image ${id} not found in image_blobs, skipping`); continue; }
      const m = mSnap.data();
      const parts = await Promise.all(
        Array.from({ length: m.chunks }, (_, i) => getDoc(doc(db, 'image_blobs', `${id}_c${i}`)))
      );
      if (parts.some((p) => !p.exists())) { console.warn(`[fetch-content] image ${id} is incomplete, skipping`); continue; }
      const dataUrl = parts.map((p) => p.data().data).join('');
      const mm = /^data:image\/([\w+.-]+);base64,(.*)$/s.exec(dataUrl);
      if (!mm) continue;
      const ext = mm[1] === 'svg+xml' ? 'svg' : mm[1] === 'jpeg' ? 'jpg' : mm[1];
      const file = path.join(outDir, `${id}.${ext}`);
      writeFileSync(file, Buffer.from(mm[2], 'base64'));
      if (m.kind !== 'logo' && ext !== 'svg') pendingVariants.push(file);
      map.set(id, `/images/uploads/${id}.${ext}`);
    } catch (e) {
      console.warn(`[fetch-content] could not load image ${id}:`, e.message);
    }
  }
  return map;
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
  const uploadsDir = path.join(ROOT, 'public', 'images', 'uploads');
  mkdirSync(uploadsDir, { recursive: true });

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const settingsSnap = await getDoc(doc(db, 'site_settings', 'homeTexts'));
    const settingsRaw = settingsSnap.exists() ? settingsSnap.data() : {};

    const projectsSnap = await getDocs(query(collection(db, 'projects'), orderBy('order', 'asc')));
    const projectsRaw = projectsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    const heroSnap = await getDocs(query(collection(db, 'hero_slides'), orderBy('order', 'asc')));
    const heroRaw = heroSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Resolve full-quality uploads first, so the rest of the pipeline only ever sees real file paths.
    const blobIds = collectBlobIds([settingsRaw, projectsRaw, heroRaw]);
    const blobMap = blobIds.size ? await resolveBlobs(db, [...blobIds], uploadsDir) : new Map();
    const settings = replaceBlobRefs(settingsRaw, blobMap);

    const projects = replaceBlobRefs(projectsRaw, blobMap)
      .map((p) => extractImages(p, imagesDir))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const heroSlides = replaceBlobRefs(heroRaw, blobMap)
      .map((slide) => {
        if (typeof slide.image === 'string' && slide.image.startsWith('data:image')) {
          slide.image = saveDataUri(slide.image, heroImagesDir, `slide_${slide.id}`);
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
