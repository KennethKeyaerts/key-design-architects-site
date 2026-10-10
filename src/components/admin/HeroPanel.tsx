import React, { useState } from 'react';
import { saveSiteSettings, saveHeroSlide, deleteHeroSlide } from '../../lib/firebase';
import ImageField, { ImagePicker, Preview, usePreviewSrc } from './ImageField';

interface Props {
  settings: Record<string, any>;
  onSettingsSaved: (updated: Record<string, any>) => void;
  slides: any[];
  onSlidesChanged: (slides: any[]) => void;
  projects?: any[];
}

function slugify(input: string): string {
  return (input || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Click on the photo to choose which part must stay in view when it is cropped.
function FocusPicker({ image: imageRef, x, y, aspect, label, onPick }: { image: string; x: number; y: number; aspect: string; label: string; onPick: (x: number, y: number) => void }) {
  const image = usePreviewSrc(imageRef);
  const pick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onPick(Math.round(((e.clientX - r.left) / r.width) * 100), Math.round(((e.clientY - r.top) / r.height) * 100));
  };
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
      <div>
        <p className="text-[11px] font-bold text-earth-dark mb-1">{label}: klik op het belangrijkste punt</p>
        <div onClick={pick} className="relative cursor-crosshair rounded-xl overflow-hidden border border-sand-dark/40">
          <img src={image} alt="" className="w-full block select-none" draggable={false} />
          <span className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white bg-terracotta/70 shadow" style={{ left: `${x}%`, top: `${y}%` }} />
        </div>
      </div>
      <div>
        <p className="text-[11px] text-earth-muted mb-1">Zo ziet het eruit</p>
        <div className="w-28 overflow-hidden rounded-lg border border-sand-dark/40" style={{ aspectRatio: aspect }}>
          <img src={image} alt="" className="w-full h-full object-cover" style={{ objectPosition: `${x}% ${y}%` }} />
        </div>
      </div>
    </div>
  );
}

export default function HeroPanel({ settings, onSettingsSaved, slides, onSlidesChanged, projects = [] }: Props) {
  const [mode, setMode] = useState<'slides' | 'video'>(settings.heroBgMode === 'video' ? 'video' : 'slides');
  const [videoDesktop, setVideoDesktop] = useState(settings.heroVideoUrlDesktop || settings.heroVideoUrl || '');
  const [videoMobile, setVideoMobile] = useState(settings.heroVideoUrlMobile || '');
  const [savingMode, setSavingMode] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [savingSlide, setSavingSlide] = useState(false);

  const saveModeSettings = async () => {
    setSavingMode(true);
    try {
      const updated = {
        ...settings,
        heroBgMode: mode,
        heroVideoUrlDesktop: videoDesktop,
        heroVideoUrlMobile: videoMobile,
      };
      await saveSiteSettings(updated);
      onSettingsSaved(updated);
    } catch (err) {
      console.error(err);
      alert('Opslaan mislukt.');
    } finally {
      setSavingMode(false);
    }
  };

  const startNewSlide = () => setEditingSlide({ id: null, projectId: '', image: '', title: '', location: '', year: '', description: '', order: slides.length });
  // Older slides only stored the project's web address; map that back to the project.
  const linkedProject = (slide: any) =>
    projects.find((p) => p.id === slide.projectId) ||
    (!slide.projectId && slide.projectSlug ? projects.find((p) => (p.slug || slugify(p.title)) === slide.projectSlug) : undefined);
  const startEditSlide = (slide: any) => setEditingSlide({ ...slide, projectId: slide.projectId || linkedProject(slide)?.id || '' });

  const handleSaveSlide = async () => {
    if (!editingSlide.image) {
      alert('Voeg een foto toe voor deze slide.');
      return;
    }
    setSavingSlide(true);
    try {
      const { id, ...rest } = editingSlide;
      const linked = projects.find((p) => p.id === rest.projectId);
      const data = { ...rest, projectSlug: linked ? (linked.slug || slugify(linked.title)) : '' };
      const newId = await saveHeroSlide(id, data);
      const updated = id ? slides.map((s) => (s.id === id ? { ...editingSlide, ...data } : s)) : [...slides, { ...editingSlide, ...data, id: newId }];
      onSlidesChanged(updated.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      setEditingSlide(null);
    } catch (err) {
      console.error(err);
      alert('Opslaan mislukt.');
    } finally {
      setSavingSlide(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Deze hero-foto verwijderen?')) return;
    await deleteHeroSlide(id);
    onSlidesChanged(slides.filter((s) => s.id !== id));
  };

  const moveSlide = async (slide: any, direction: -1 | 1) => {
    const sorted = [...slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idx = sorted.findIndex((s) => s.id === slide.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([saveHeroSlide(a.id, { order: b.order ?? swapIdx }), saveHeroSlide(b.id, { order: a.order ?? idx })]);
    const updated = sorted.map((s, i) => (s.id === a.id ? { ...s, order: b.order ?? swapIdx } : s.id === b.id ? { ...s, order: a.order ?? idx } : s));
    onSlidesChanged(updated.sort((x, y) => (x.order ?? 0) - (y.order ?? 0)));
  };

  if (editingSlide) {
    return (
      <div className="max-w-xl space-y-4">
        <button onClick={() => setEditingSlide(null)} className="text-xs text-earth-muted hover:text-terracotta">← Terug naar overzicht</button>
        <h3 className="font-serif text-lg font-bold text-earth-dark">{editingSlide.id ? 'Hero-foto bewerken' : 'Nieuwe hero-foto'}</h3>

        <div className="p-4 rounded-xl bg-sand-light border border-sand-dark/40 space-y-2">
          <p className="text-xs font-bold text-earth-dark">Stap 1: kies het project</p>
          <select
            value={editingSlide.projectId || ''}
            onChange={(e) => {
              const proj = projects.find((p) => p.id === e.target.value);
              setEditingSlide({
                ...editingSlide,
                projectId: e.target.value,
                // Selecting a project suggests its main photo, which can still be changed below.
                image: editingSlide.image || proj?.image || '',
              });
            }}
            className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm bg-white"
          >
            <option value="">Geen project (de knop gaat naar het overzicht van alle projecten)</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <p className="text-[11px] text-earth-muted">De knop "Bekijk dit project" opent dit project. Het project bestaat nog niet? Maak het eerst aan bij "Projecten" en kom dan terug.</p>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-earth-dark">Stap 2: kies de foto</p>
          {(() => {
            const proj = projects.find((p) => p.id === editingSlide.projectId);
            const own: string[] = proj ? Array.from(new Set([proj.image, ...(proj.images || [])].filter(Boolean))) : [];
            return own.length ? (
              <ImagePicker label="Een foto van dit project" images={own} value={editingSlide.image} onChange={(v: string) => setEditingSlide({ ...editingSlide, image: v })} />
            ) : null;
          })()}
          <ImageField
            label="Of upload een andere, speciale hero-foto"
            value={editingSlide.image}
            onChange={(ref) => setEditingSlide({ ...editingSlide, image: ref })}
            previewClass="w-44 h-28 object-cover"
            help="Gebruik een brede foto, het liefst minstens 2000px breed. Ze wordt automatisch tot 2400px breed in hoge kwaliteit bewaard en voor telefoon en tablet verkleind, zodat de website snel blijft."
          />
        </div>

        {editingSlide.image && (
          <div className="space-y-4 p-4 rounded-xl bg-sand-light border border-sand-dark/40">
            <p className="text-xs font-bold text-earth-dark">Positie van de foto</p>
            <p className="text-[11px] text-earth-muted -mt-2">Op een brede computer en een smalle telefoon wordt dezelfde foto anders bijgesneden. Klik op het deel dat altijd zichtbaar moet blijven (bv. het gebouw).</p>
            <FocusPicker image={editingSlide.image} x={editingSlide.focusX ?? 50} y={editingSlide.focusY ?? 50} aspect="16 / 9" label="Computer en tablet" onPick={(x, y) => setEditingSlide({ ...editingSlide, focusX: x, focusY: y })} />
            <label className="flex items-center gap-2 text-xs text-earth-dark">
              <input type="checkbox" checked={editingSlide.focusMobileX != null} onChange={(e) => setEditingSlide(e.target.checked ? { ...editingSlide, focusMobileX: editingSlide.focusX ?? 50, focusMobileY: editingSlide.focusY ?? 50 } : { ...editingSlide, focusMobileX: null, focusMobileY: null })} />
              Andere positie voor telefoon
            </label>
            {editingSlide.focusMobileX != null && (
              <FocusPicker image={editingSlide.image} x={editingSlide.focusMobileX} y={editingSlide.focusMobileY ?? 50} aspect="9 / 16" label="Telefoon" onPick={(x, y) => setEditingSlide({ ...editingSlide, focusMobileX: x, focusMobileY: y })} />
            )}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-earth-dark mb-1">Titel (leeg laten = naam van het project)</label>
          <input value={editingSlide.title} onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-earth-dark mb-1">Locatie (leeg = van het project)</label>
            <input value={editingSlide.location} onChange={(e) => setEditingSlide({ ...editingSlide, location: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-earth-dark mb-1">Jaar</label>
            <input value={editingSlide.year} onChange={(e) => setEditingSlide({ ...editingSlide, year: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
          </div>
        </div>

        <button onClick={handleSaveSlide} disabled={savingSlide} className="py-3 px-8 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-sm font-bold uppercase tracking-wider rounded-xl">
          {savingSlide ? 'Bezig met opslaan…' : 'Foto opslaan'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h3 className="font-serif text-lg font-bold text-earth-dark mb-1">Weergave</h3>
        <p className="text-xs text-earth-muted mb-3">Kies of de hero bovenaan de homepagina een fotoslideshow of een achtergrondvideo toont.</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={() => setMode('slides')} className={`py-3 rounded-xl text-sm font-bold border transition-colors ${mode === 'slides' ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-earth-dark border-sand-dark/50'}`}>
            Fotoslideshow
          </button>
          <button onClick={() => setMode('video')} className={`py-3 rounded-xl text-sm font-bold border transition-colors ${mode === 'video' ? 'bg-terracotta text-white border-terracotta' : 'bg-white text-earth-dark border-sand-dark/50'}`}>
            Video
          </button>
        </div>

        {mode === 'video' && (
          <div className="space-y-3 p-4 rounded-xl bg-sand-light border border-sand-dark/40 mb-4">
            <div>
              <label className="block text-xs font-bold text-earth-dark mb-1">Video-URL (desktop)</label>
              <input value={videoDesktop} onChange={(e) => setVideoDesktop(e.target.value)} placeholder="https://.../hero.mp4" className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-earth-dark mb-1">Video-URL (mobiel, optioneel)</label>
              <input value={videoMobile} onChange={(e) => setVideoMobile(e.target.value)} placeholder="Laat leeg om dezelfde video te gebruiken" className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
            </div>
            <p className="text-[11px] text-earth-muted leading-relaxed">
              Video's zijn te groot om hier te uploaden. Plak een link naar een reeds gehost .mp4-bestand (bv. via Firebase
              Storage, Cloudinary, of een videohost). Zie README.md, sectie "Hero-video toevoegen" voor een stap-voor-stap uitleg.
            </p>
          </div>
        )}

        <button onClick={saveModeSettings} disabled={savingMode} className="py-2.5 px-6 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider rounded-xl">
          {savingMode ? 'Bezig…' : 'Weergave opslaan'}
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-lg font-bold text-earth-dark">Hero-foto's (slideshow)</h3>
          <button onClick={startNewSlide} className="py-2 px-4 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full">+ Foto toevoegen</button>
        </div>
        <p className="text-xs text-earth-muted mb-3">
          Deze foto's worden gebruikt wanneer "Fotoslideshow" hierboven is geselecteerd, ongeacht hoeveel er zijn. Met
          twee of meer foto's wisselt de hero automatisch elke 6 seconden.
        </p>
        <div className="space-y-2">
          {slides.length === 0 && <p className="text-sm text-earth-muted">Nog geen hero-foto's toegevoegd.</p>}
          {slides.map((slide, i) => (
            <div key={slide.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-sand-dark/40">
              <Preview value={slide.image} className="w-16 h-12 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                {(() => {
                  const proj = linkedProject(slide);
                  const missing = (slide.projectId || slide.projectSlug) && !proj;
                  return (
                    <>
                      <p className="text-sm font-medium text-earth-dark truncate">{slide.title || proj?.title || '(zonder titel)'}</p>
                      <p className={`text-[11px] truncate ${missing ? 'text-red-600 font-bold' : 'text-earth-muted'}`}>
                        {missing ? 'Het gekoppelde project bestaat niet meer: de knop gaat naar het overzicht.' : proj ? `Knop opent: ${proj.title}` : 'Geen project gekoppeld: de knop gaat naar het overzicht.'}
                      </p>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-1.5 text-xs shrink-0">
                <button onClick={() => moveSlide(slide, -1)} disabled={i === 0} className="disabled:opacity-30 text-earth-muted" aria-label="Naar boven">↑</button>
                <button onClick={() => moveSlide(slide, 1)} disabled={i === slides.length - 1} className="disabled:opacity-30 text-earth-muted" aria-label="Naar onder">↓</button>
                <button onClick={() => startEditSlide(slide)} className="text-terracotta font-bold ml-2">Bewerken</button>
                <button onClick={() => handleDeleteSlide(slide.id)} className="text-red-500 font-bold">Verwijderen</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
