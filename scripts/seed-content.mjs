// Run this ONCE, locally, after logging in as admin, to push this project's
// local content (site texts, hero slides, AND portfolio projects) into your
// live Firestore database.
//
// Why this is needed: every build pulls fresh content from Firestore (see
// scripts/fetch-content.mjs) and overwrites the local src/data/*.json files
// with it. That means any copy or project changes made only in this
// project's local files never reach your live site until they also exist in
// Firestore. This script does that sync. After running it, you can keep
// editing everything from /beheerder as normal.
//
// Usage:
//   SEED_ADMIN_EMAIL="you@example.com" SEED_ADMIN_PASSWORD="yourpassword" node scripts/seed-content.mjs
//
// Requirements before running:
//   1. You've created your admin login in Firebase Console -> Authentication
//      -> Users (see README.md, "Login werkt niet? Checklist").
//   2. npm install has been run in this project.
//
// This script pushes site_settings, hero_slides, AND projects. For
// `projects` specifically, it does a full sync: every project in this
// project's src/data/projects.json is pushed, and any project that exists
// in your live Firestore database but is NOT in that local file (for
// example, an old test project) is deleted from Firestore. This is the only
// way project changes (new projects, renamed projects, deleted projects)
// reach your live site, the admin dashboard's own Projecten panel and this
// script are the two ways to change what's live; editing local files alone
// never does.
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
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

function fileToDataUri(filePath) {
  const buf = readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  const mime = ext === 'jpg' ? 'jpeg' : ext;
  return `data:image/${mime};base64,${buf.toString('base64')}`;
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      '\nMissing credentials.\n\nUsage:\n  SEED_ADMIN_EMAIL="you@example.com" SEED_ADMIN_PASSWORD="yourpassword" node scripts/seed-content.mjs\n'
    );
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('Signed in as', email);
  } catch (err) {
    console.error(
      '\nCould not sign in:',
      err.message,
      '\n\nIf you have not created your admin login yet, do that first in Firebase Console -> Authentication -> Users, then re-run this script.\n'
    );
    process.exit(1);
  }

  // ---- Site settings (all the new hero/vision/services/disclaimer copy) ----
  const settingsPath = path.join(ROOT, 'src', 'data', 'site_settings.json');
  const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
  await setDoc(doc(db, 'site_settings', 'homeTexts'), settings, { merge: true });
  console.log(`Pushed ${Object.keys(settings).length} site setting fields to Firestore.`);

  // ---- Default hero slide (so the homepage hero is never empty) ----
  const heroSlidesPath = path.join(ROOT, 'src', 'data', 'hero_slides.json');
  const slides = JSON.parse(readFileSync(heroSlidesPath, 'utf-8'));
  for (const slide of slides) {
    let image = slide.image;
    if (typeof image === 'string' && image.startsWith('/')) {
      const localPath = path.join(ROOT, 'public', image);
      if (existsSync(localPath)) {
        image = fileToDataUri(localPath);
      } else {
        console.warn(`  Skipping slide "${slide.id}": local image not found at ${localPath}`);
        continue;
      }
    }
    const { id, ...data } = slide;
    await setDoc(doc(db, 'hero_slides', id), { ...data, image }, { merge: true });
    console.log(`Pushed hero slide "${id}".`);
  }

  // ---- Portfolio projects: full sync (push local, delete orphans) ----
  const projectsPath = path.join(ROOT, 'src', 'data', 'projects.json');
  const localProjects = JSON.parse(readFileSync(projectsPath, 'utf-8'));
  const localIds = new Set(localProjects.map((p) => p.id));

  const failedProjects = [];

  for (const project of localProjects) {
    const { id, ...data } = project;

    try {
      if (typeof data.image === 'string' && data.image.startsWith('/')) {
        const localPath = path.join(ROOT, 'public', data.image);
        if (existsSync(localPath)) {
          data.image = fileToDataUri(localPath);
        } else {
          console.warn(`  Warning: main image not found for project "${id}" at ${localPath}, leaving as-is.`);
        }
      }

      if (Array.isArray(data.images)) {
        data.images = data.images.map((img) => {
          if (typeof img === 'string' && img.startsWith('/')) {
            const localPath = path.join(ROOT, 'public', img);
            if (existsSync(localPath)) return fileToDataUri(localPath);
            console.warn(`  Warning: gallery image not found for project "${id}" at ${localPath}, leaving as-is.`);
          }
          return img;
        });
      }

      // Firestore hard-limits any single document to 1MB. A project with
      // several large photos embedded as base64 can exceed that easily.
      // Check before writing, not after a failed write, so the error message
      // actually says what to do about it instead of a raw gRPC error.
      const approxSize = Buffer.byteLength(JSON.stringify(data), 'utf-8');
      if (approxSize > 1_000_000) {
        throw new Error(
          `document would be ~${Math.round(approxSize / 1024)}KB, over Firestore's 1MB-per-document limit. ` +
          `Reduce the number of images on this project, or compress them further, then try again.`
        );
      }

      await setDoc(doc(db, 'projects', id), data, { merge: false });
      console.log(`Pushed project "${data.title || id}".`);
    } catch (err) {
      // Never let one bad project take down the rest of the sync: log it
      // clearly, keep going with the next project, and still report it at
      // the end so it's impossible to miss.
      console.error(`  FAILED to push project "${data.title || id}": ${err.message}`);
      failedProjects.push(data.title || id);
    }
  }

  // Delete any project that exists live but not locally (e.g. an old test project).
  const liveProjectsSnap = await getDocs(collection(db, 'projects'));
  for (const d of liveProjectsSnap.docs) {
    if (!localIds.has(d.id)) {
      await deleteDoc(doc(db, 'projects', d.id));
      console.log(`Deleted project "${d.id}" (no longer in local projects.json).`);
    }
  }

  if (failedProjects.length > 0) {
    console.log(`\nFinished, but ${failedProjects.length} project(s) could NOT be pushed: ${failedProjects.join(', ')}. See the FAILED lines above for why. Everything else succeeded.`);
  }
  console.log('\nDone. Rebuild and redeploy (or hit "Publiceren" in /beheerder) to see this live.');
  process.exit(0);
}

main();
