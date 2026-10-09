import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';

// Same Firebase project as before. Only the API key ships to the browser,
// which is expected/safe for Firebase web apps — real protection comes from
// firestore.rules + Firebase Authentication, not from hiding this config.
const firebaseConfig = {
  projectId: 'key-design-architects',
  appId: '1:898830519155:web:0b5298167b1fc566fa5306',
  apiKey: 'AIzaSyB5AunSdowb02zeF9vhjbofL7jzQpIYYj4',
  authDomain: 'key-design-architects.firebaseapp.com',
  storageBucket: 'key-design-architects.firebasestorage.app',
  messagingSenderId: '898830519155',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

// ---------- Admin authentication ----------
// Replaces the old "passcode stored in a public Firestore doc" scheme.
// Kenneth signs in with a real email + password managed in the Firebase
// console (Authentication tab) — nothing secret ever touches Firestore or
// the client bundle, and firestore.rules can now check request.auth.
export function adminSignIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function adminSignOut() {
  return fbSignOut(auth);
}

export function onAdminAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

// ---------- Site settings (single document) ----------
const SITE_SETTINGS_REF = doc(db, 'site_settings', 'homeTexts');

export async function fetchSiteSettings(): Promise<Record<string, any>> {
  const snap = await getDoc(SITE_SETTINGS_REF);
  return snap.exists() ? snap.data() : {};
}

export async function saveSiteSettings(data: Record<string, any>) {
  await setDoc(SITE_SETTINGS_REF, data, { merge: true });
}

// ---------- Portfolio projects ----------
const PROJECTS_COLL = collection(db, 'projects');

export async function fetchProjects() {
  const snap = await getDocs(query(PROJECTS_COLL, orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveProject(id: string | null, data: Record<string, any>) {
  if (id) {
    await updateDoc(doc(db, 'projects', id), data);
    return id;
  }
  const ref = await addDoc(PROJECTS_COLL, data);
  return ref.id;
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, 'projects', id));
}

// ---------- Homepage hero slides ----------
const HERO_SLIDES_COLL = collection(db, 'hero_slides');

export async function fetchHeroSlides() {
  const snap = await getDocs(query(HERO_SLIDES_COLL, orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveHeroSlide(id: string | null, data: Record<string, any>) {
  if (id) {
    await updateDoc(doc(db, 'hero_slides', id), data);
    return id;
  }
  const ref = await addDoc(HERO_SLIDES_COLL, data);
  return ref.id;
}

export async function deleteHeroSlide(id: string) {
  await deleteDoc(doc(db, 'hero_slides', id));
}

// ---------- Inquiries (leads from the contact form) ----------
// Note: the public contact form no longer writes to Firestore directly for
// notification purposes — EmailJS handles that (see ContactForm.tsx) so a
// lead reaches Kenneth's inbox even if Firestore is briefly unavailable. We
// still store a copy here so the admin dashboard has a record of every
// inquiry. Only signed-in admins can read this collection (see firestore.rules).
const INQUIRIES_COLL = collection(db, 'inquiries');

export async function fetchInquiries() {
  const snap = await getDocs(query(INQUIRIES_COLL, orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveInquiry(data: Record<string, any>) {
  await addDoc(INQUIRIES_COLL, { ...data, createdAt: new Date().toISOString(), status: 'Nieuw' });
}

export async function updateInquiry(id: string, data: Record<string, any>) {
  await updateDoc(doc(db, 'inquiries', id), data);
}

export async function deleteInquiry(id: string) {
  await deleteDoc(doc(db, 'inquiries', id));
}
