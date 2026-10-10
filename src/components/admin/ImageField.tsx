import React, { useEffect, useRef, useState } from 'react';
import { uploadImage, previewSrc } from '../../lib/imageStore';

/** Shows a stored image (blob reference, file path or legacy data URL). */
export function usePreviewSrc(value?: string) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let alive = true;
    previewSrc(value).then((s) => alive && setSrc(s)).catch(() => alive && setSrc(''));
    return () => { alive = false; };
  }, [value]);
  return src;
}

export function Preview({ value, className = '', alt = '' }: { value?: string; className?: string; alt?: string }) {
  const src = usePreviewSrc(value);
  if (!value) return <div className={`bg-sand-medium flex items-center justify-center text-[11px] text-earth-muted ${className}`}>geen beeld</div>;
  if (!src) return <div className={`bg-sand-medium animate-pulse ${className}`} />;
  return <img src={src} alt={alt} className={className} />;
}

interface FieldProps {
  label: string;
  value?: string;
  onChange: (ref: string) => void;
  kind?: 'photo' | 'logo';
  help?: string;
  previewClass?: string;
  allowRemove?: boolean;
}

/** One image: upload, replace, remove. */
export default function ImageField({ label, value, onChange, kind = 'photo', help, previewClass = 'w-44 h-28 object-cover', allowRemove = true }: FieldProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true); setError('');
    try {
      const ref = await uploadImage(file, kind);
      onChange(ref);
    } catch (e: any) {
      setError(e?.message || 'Uploaden mislukt. Probeer opnieuw.');
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-earth-dark mb-1">{label}</label>
      <div className="flex items-start gap-4">
        <div className={`rounded-lg border border-sand-dark/40 overflow-hidden bg-white ${kind === 'logo' ? 'p-2 bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:16px_16px]' : ''}`}>
          <Preview value={value} className={kind === 'logo' ? 'w-44 h-24 object-contain' : previewClass} />
        </div>
        <div className="space-y-2 text-sm">
          <input ref={input} type="file" accept={kind === 'logo' ? 'image/png,image/svg+xml,image/webp,image/jpeg' : 'image/*'} onChange={(e) => pick(e.target.files?.[0])} className="text-xs" disabled={busy} />
          {busy && <p className="text-xs text-earth-muted">Bezig met uploaden in hoge kwaliteit…</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
          {allowRemove && value && !busy && (
            <button type="button" onClick={() => onChange('')} className="text-xs text-red-500 font-bold">Beeld verwijderen</button>
          )}
          {help && <p className="text-[11px] text-earth-muted max-w-xs leading-snug">{help}</p>}
        </div>
      </div>
    </div>
  );
}

interface ListProps {
  label: string;
  values: string[];
  onChange: (refs: string[]) => void;
  help?: string;
}

/** A row of images: add several at once, reorder, remove. */
export function ImageListField({ label, values, onChange, help }: ListProps) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<string>('');
  const [error, setError] = useState('');

  const addFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setError('');
    const added: string[] = [];
    const list = Array.from(files);
    for (let i = 0; i < list.length; i++) {
      setBusy(`Foto ${i + 1} van ${list.length} uploaden…`);
      try { added.push(await uploadImage(list[i], 'photo')); }
      catch (e: any) { setError(`${list[i].name}: ${e?.message || 'mislukt'}`); }
    }
    setBusy('');
    if (added.length) onChange([...values, ...added]);
    if (input.current) input.current.value = '';
  };

  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= values.length) return;
    const next = [...values];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, k) => k !== i));

  return (
    <div>
      <label className="block text-xs font-bold text-earth-dark mb-1">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {values.map((v, i) => (
          <div key={v + i} className="rounded-xl border border-sand-dark/40 bg-white overflow-hidden">
            <Preview value={v} className="w-full h-24 object-cover" />
            <div className="flex items-center justify-between px-2 py-1.5 text-[11px]">
              <span className="text-earth-muted">#{i + 1}{i === 0 ? ' (hoofdfoto)' : ''}</span>
              <span className="flex gap-1.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-1 disabled:opacity-30" aria-label="Naar voren">←</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === values.length - 1} className="px-1 disabled:opacity-30" aria-label="Naar achteren">→</button>
                <button type="button" onClick={() => remove(i)} className="px-1 text-red-500 font-bold" aria-label="Verwijderen">✕</button>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        <input ref={input} type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} className="text-xs" disabled={!!busy} />
        {busy && <p className="text-xs text-earth-muted">{busy}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
        {help && <p className="text-[11px] text-earth-muted leading-snug">{help}</p>}
      </div>
    </div>
  );
}

/** Pick one of the project's own photos (used by layout blocks, timeline steps and the hero). */
export function ImagePicker({ images, value, onChange, multiple = false, label }: {
  images: string[]; value: string | string[]; onChange: (v: any) => void; multiple?: boolean; label?: string;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const toggle = (img: string) => {
    if (!multiple) return onChange(selected[0] === img ? '' : img);
    onChange(selected.includes(img) ? selected.filter((x) => x !== img) : [...selected, img]);
  };
  if (!images.length) return <p className="text-[11px] text-earth-muted">Voeg eerst foto's toe aan het project (bij "Foto's").</p>;
  return (
    <div>
      {label && <p className="text-[11px] font-bold text-earth-dark mb-1">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {images.map((img, i) => {
          const on = selected.includes(img);
          return (
            <button type="button" key={img + i} onClick={() => toggle(img)} className={`relative rounded-lg overflow-hidden border-2 ${on ? 'border-terracotta' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <Preview value={img} className="w-16 h-12 object-cover" />
              {on && <span className="absolute top-0.5 right-0.5 bg-terracotta text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{multiple ? selected.indexOf(img) + 1 : '✓'}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
