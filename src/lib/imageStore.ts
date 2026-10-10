// Browser-side image pipeline for the admin dashboard.
//  1. The chosen file is scaled to a sensible maximum (2400px for photos),
//     which is sharp on every screen yet small enough to keep the site fast.
//  2. It is encoded once (JPEG for photos, PNG/SVG kept for logos).
//  3. The result is split into chunks and stored with saveBlob().
// The website itself never downloads these chunks: the build turns them into
// optimised files (several sizes, WebP) that phones and large screens pick from.
import { saveBlob, fetchBlobManifest, deleteBlob, type BlobManifest } from './firebase';

const CHUNK_CHARS = 800_000;          // safely below the 1 MB document limit
const MAX_TOTAL_CHARS = 4_400_000;    // about 3.2 MB of image data in total
export const BLOB_PREFIX = 'blob:';

export const isBlobRef = (v: unknown): v is string => typeof v === 'string' && v.startsWith(BLOB_PREFIX);
export const blobId = (ref: string) => ref.slice(BLOB_PREFIX.length);

const newId = () => `img_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Afbeelding kon niet gelezen worden'));
    img.src = src;
  });
}

function draw(img: HTMLImageElement, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, width, height };
}

export interface PreparedImage { dataUrl: string; mime: string; width: number; height: number; thumb: string }

/** Scales and encodes a file. Photos: JPEG, as sharp as fits. Logos: PNG/SVG, transparency kept. */
export async function prepareImage(file: File, kind: 'photo' | 'logo'): Promise<PreparedImage> {
  const original = await readAsDataUrl(file);
  const isSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name);

  if (isSvg) {
    if (original.length > 400_000) throw new Error('Dit SVG-bestand is te groot (max. ongeveer 300 KB).');
    const img = await loadImage(original).catch(() => null);
    return { dataUrl: original, mime: 'image/svg+xml', width: img?.naturalWidth || 400, height: img?.naturalHeight || 400, thumb: original };
  }

  const img = await loadImage(original);
  const thumbCanvas = draw(img, 800).canvas;
  const thumb = thumbCanvas.toDataURL(kind === 'logo' ? 'image/png' : 'image/jpeg', 0.72);

  if (kind === 'logo') {
    // Logos keep transparency: PNG, scaled down in steps until it fits.
    let edge = Math.min(1600, Math.max(img.naturalWidth, img.naturalHeight));
    for (let i = 0; i < 6; i++) {
      const { canvas, width, height } = draw(img, edge);
      const out = canvas.toDataURL('image/png');
      if (out.length <= MAX_TOTAL_CHARS) return { dataUrl: out, mime: 'image/png', width, height, thumb };
      edge = Math.round(edge * 0.8);
    }
    throw new Error('Dit logo is te groot om op te slaan.');
  }

  // Photos: start at 2400px / quality 0.88 and only reduce if it does not fit.
  let edge = 2400;
  for (let attempt = 0; attempt < 6; attempt++) {
    const { canvas, width, height } = draw(img, edge);
    for (const q of [0.88, 0.84, 0.8, 0.75]) {
      const out = canvas.toDataURL('image/jpeg', q);
      if (out.length <= MAX_TOTAL_CHARS) return { dataUrl: out, mime: 'image/jpeg', width, height, thumb };
    }
    edge = Math.round(edge * 0.85);
  }
  throw new Error('Deze foto is te zwaar om op te slaan.');
}

/** Uploads a file and returns its reference ("blob:<id>"). */
export async function uploadImage(file: File, kind: 'photo' | 'logo' = 'photo'): Promise<string> {
  const p = await prepareImage(file, kind);
  const id = newId();
  const chunks: string[] = [];
  for (let i = 0; i < p.dataUrl.length; i += CHUNK_CHARS) chunks.push(p.dataUrl.slice(i, i + CHUNK_CHARS));
  const manifest: BlobManifest = {
    id, mime: p.mime, width: p.width, height: p.height, chunks: chunks.length, kind,
    thumb: p.thumb, createdAt: new Date().toISOString(),
  };
  await saveBlob(manifest, chunks);
  thumbCache.set(id, p.thumb);
  return BLOB_PREFIX + id;
}

// ---------- Previews inside the dashboard ----------
const thumbCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

/** Returns something an <img> can show for any stored image value. */
export async function previewSrc(value: string | undefined | null): Promise<string> {
  if (!value) return '';
  if (!isBlobRef(value)) return value;
  const id = blobId(value);
  const hit = thumbCache.get(id);
  if (hit) return hit;
  let p = inflight.get(id);
  if (!p) {
    p = fetchBlobManifest(id).then((m) => {
      const t = m?.thumb || '';
      if (t) thumbCache.set(id, t);
      return t;
    });
    inflight.set(id, p);
  }
  return p;
}

/** Removes a stored image. Only touches uploads made with this system. */
export async function removeImage(value: string | undefined | null) {
  if (!isBlobRef(value)) return;
  try { await deleteBlob(blobId(value)); } catch (e) { console.warn('Kon afbeelding niet verwijderen', e); }
}
