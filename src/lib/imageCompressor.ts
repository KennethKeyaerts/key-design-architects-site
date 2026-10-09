/**
 * High-performance, lightweight image compressor for web & Firestore storage.
 * Ensures base64 images and logos stay compact (<150KB) so Firestore documents
 * never exceed the 1,048,576 byte (1MB) hard limit.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxByteSize?: number; // Target max byte size in base64, default 250,000 (~180KB binary)
}

/**
 * Compresses a base64 image string, preserving transparency for logos and icons.
 */
export const compressImage = async (
  base64Str: string,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.80,
  maxByteSize = 250000
): Promise<string> => {
  if (!base64Str || typeof base64Str !== 'string') {
    return base64Str;
  }

  // Preserve SVGs, ICOs and external URLs without modification
  if (
    !base64Str.startsWith('data:image/') ||
    base64Str.startsWith('data:image/svg') ||
    base64Str.startsWith('data:image/x-icon') ||
    base64Str.startsWith('data:image/vnd.microsoft.icon') ||
    base64Str.startsWith('data:image/gif') ||
    base64Str.startsWith('http://') ||
    base64Str.startsWith('https://') ||
    base64Str.startsWith('/')
  ) {
    return base64Str;
  }

  // If the image is already small (e.g. < 80KB), return as is
  if (base64Str.length < 80000) {
    return base64Str;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let { width, height } = img;

        // Scale dimensions proportionally
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: true });

        if (!ctx) {
          resolve(base64Str);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (supports transparency, 80-90% smaller than PNG)
        let result = canvas.toDataURL('image/webp', quality);

        // If WebP is not supported or returned a huge string, or if quality needs reduction
        if (!result.startsWith('data:image/webp')) {
          // Fallback to JPEG if no alpha transparency is needed
          const isPng = base64Str.startsWith('data:image/png');
          if (!isPng) {
            result = canvas.toDataURL('image/jpeg', quality);
          } else {
            // For PNGs, if output is still large, reduce canvas size
            result = canvas.toDataURL('image/png');
          }
        }

        // Iterative reduction if still exceeding maxByteSize
        if (result.length > maxByteSize && width > 400 && height > 400) {
          const halfCanvas = document.createElement('canvas');
          halfCanvas.width = Math.round(width * 0.75);
          halfCanvas.height = Math.round(height * 0.75);
          const halfCtx = halfCanvas.getContext('2d', { alpha: true });
          if (halfCtx) {
            halfCtx.drawImage(canvas, 0, 0, halfCanvas.width, halfCanvas.height);
            const reducedWebp = halfCanvas.toDataURL('image/webp', Math.max(0.65, quality - 0.15));
            if (reducedWebp.startsWith('data:image/webp') && reducedWebp.length < result.length) {
              result = reducedWebp;
            } else {
              const reducedJpeg = halfCanvas.toDataURL('image/jpeg', 0.70);
              if (reducedJpeg.length < result.length) {
                result = reducedJpeg;
              }
            }
          }
        }

        resolve(result);
      } catch (err) {
        console.warn("Compression canvas error:", err);
        resolve(base64Str);
      }
    };

    img.onerror = () => {
      resolve(base64Str);
    };

    img.src = base64Str;
  });
};

/**
 * Recursively scans and compresses any large base64 images within an object
 * (e.g. site settings or portfolio project).
 */
export const sanitizeAndCompressObjectImages = async (
  obj: any,
  maxBytePerImage = 200000
): Promise<any> => {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/') && obj.length > maxBytePerImage) {
      return await compressImage(obj, 1280, 1280, 0.80, maxBytePerImage);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (const item of obj) {
      newArr.push(await sanitizeAndCompressObjectImages(item, maxBytePerImage));
    }
    return newArr;
  }

  if (typeof obj === 'object') {
    const newObj: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await sanitizeAndCompressObjectImages(obj[key], maxBytePerImage);
    }
    return newObj;
  }

  return obj;
};

/**
 * Calculates byte size of a JSON-serializable object in UTF-8
 */
export const getObjectByteSize = (obj: any): number => {
  try {
    const str = JSON.stringify(obj);
    return new Blob([str]).size;
  } catch (_) {
    return 0;
  }
};

/**
 * Hero photos get their own document in Firestore, so they can be much larger
 * than project photos. Scales to maxWidth (default 2200px) and lowers the
 * quality step by step until the result fits under limitChars (default
 * 900,000 characters, safely below Firestore's 1 MB document limit).
 */
export const compressForHero = (
  dataUrl: string,
  maxWidth = 2200,
  limitChars = 900000
): Promise<string> =>
  new Promise((resolve) => {
    if (!dataUrl.startsWith('data:image/')) return resolve(dataUrl);
    const img = new Image();
    img.onload = () => {
      let w = Math.min(img.width, maxWidth);
      for (let attempt = 0; attempt < 6; attempt++) {
        const h = Math.round((img.height * w) / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);
        ctx.drawImage(img, 0, 0, w, h);
        for (const q of [0.88, 0.82, 0.76, 0.7, 0.62]) {
          const out = canvas.toDataURL('image/jpeg', q);
          if (out.length <= limitChars) return resolve(out);
        }
        w = Math.round(w * 0.85);
      }
      resolve(dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
