import React, { useState } from 'react';
import { saveProject, deleteProject, saveHeroSlide } from '../../lib/firebase';
import ImageField, { ImageListField, ImagePicker, Preview } from './ImageField';
import { PHASES } from '../../lib/data';

interface Props {
  projects: any[];
  onChanged: (projects: any[]) => void;
  slides?: any[];
  onSlidesChanged?: (slides: any[]) => void;
}

const BLANK: any = {
  title: '',
  category: 'nieuwbouw',
  location: '',
  year: String(new Date().getFullYear()),
  area: '',
  description: '',
  concept: '',
  image: '',
  images: [],
  materials: [],
  specs: {},
  starred: false,
  order: 0,
  role: 'own',
  phase: '',
  attributionNote: '',
  statusNote: '',
  quote: '',
  blocks: [],
  timeline: [],
  en: {},
};

const DEFAULT_COLLAB_NOTE =
  'Dit project werd ontworpen door een ander architectenkantoor. Kenneth werkte eraan mee als projectarchitect voor een vorige werkgever. Het staat hier als referentie van zijn ervaring, niet als eigen ontwerp van Key-Design.';

const BLOCK_TYPES: { type: string; label: string }[] = [
  { type: 'heading', label: '+ Kop' },
  { type: 'text', label: '+ Tekst' },
  { type: 'image', label: '+ Foto breed' },
  { type: 'images2', label: '+ Twee foto\'s' },
  { type: 'images3', label: '+ Drie foto\'s' },
  { type: 'quote', label: '+ Citaat' },
  { type: 'video', label: '+ Video' },
];

function slugify(input: string): string {
  return (input || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
const uid = () => Math.random().toString(36).slice(2, 9);
const input = 'w-full px-3 py-2 rounded-xl border border-sand-dark/60 focus:border-terracotta focus:outline-none text-sm bg-white';
const lbl = 'block text-xs font-bold text-earth-dark mb-1';

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-sand-dark/40 p-5 space-y-4">
      <div>
        <h3 className="font-serif text-base font-bold text-earth-dark">{title}</h3>
        {hint && <p className="text-[11px] text-earth-muted mt-0.5">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

// Normalises how photos are stored: `images` holds all photos, `image` is always the first one.
const galleryOf = (p: any): string[] => {
  const list = [p.image, ...(p.images || [])].filter(Boolean);
  return Array.from(new Set(list));
};

export default function ProjectsPanel({ projects, onChanged, slides = [], onSlidesChanged }: Props) {
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');

  const sorted = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const startNew = () => setEditing({ ...BLANK, id: null, order: projects.length, gallery: [] });
  const startEdit = (p: any) =>
    setEditing({
      ...BLANK,
      ...p,
      role: p.role || (p.attributionNote ? 'collaborated' : 'own'),
      gallery: galleryOf(p),
      materials: p.materials || [],
      specs: p.specs || {},
      blocks: p.blocks || [],
      timeline: p.timeline || [],
      en: p.en || {},
    });

  const set = (patch: any) => setEditing((prev: any) => ({ ...prev, ...patch }));
  const setEn = (patch: any) => setEditing((prev: any) => ({ ...prev, en: { ...(prev.en || {}), ...patch } }));

  const handleSave = async () => {
    if (!editing.title.trim()) { alert('Geef het project een titel.'); return; }
    setSaving(true);
    try {
      const { id, gallery, ...rest } = editing;
      const takenSlugs = new Set(projects.filter((p) => p.id !== id).map((p) => p.slug).filter(Boolean));
      let slug = rest.slug || slugify(rest.title);
      if (!rest.slug) { let n = 2; const base = slug; while (takenSlugs.has(slug)) slug = `${base}-${n++}`; }
      const clean = {
        ...rest,
        slug,
        image: gallery[0] || '',
        images: gallery,
        attributionNote: rest.role === 'collaborated' ? (rest.attributionNote || DEFAULT_COLLAB_NOTE) : '',
        materials: (rest.materials || []).filter((m: string) => m.trim()),
        specs: Object.fromEntries(Object.entries(rest.specs || {}).filter(([k]) => k.trim())),
      };
      const newId = await saveProject(id, clean);
      const saved = { ...clean, id: id || newId };
      onChanged(id ? projects.map((p) => (p.id === id ? saved : p)) : [...projects, saved]);
      setEditing(null);
      setNotice('Project opgeslagen. Klik bij "Publiceren" op "Publiceer wijzigingen" om het live te zetten.');
    } catch (err) {
      console.error(err);
      alert('Opslaan mislukt. Controleer je internetverbinding en probeer opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: any) => {
    const inHero = slides.filter((s) => s.projectId === p.id);
    const extra = inHero.length ? `\n\nLet op: dit project staat ook in de hero (${inHero.length} foto). Die foto blijft staan, maar de knop gaat dan naar het overzicht.` : '';
    if (!confirm(`"${p.title}" definitief verwijderen?${extra}`)) return;
    await deleteProject(p.id);
    onChanged(projects.filter((x) => x.id !== p.id));
  };

  const toggleStar = async (p: any) => {
    await saveProject(p.id, { starred: !p.starred });
    onChanged(projects.map((x) => (x.id === p.id ? { ...x, starred: !p.starred } : x)));
  };

  const move = async (p: any, dir: -1 | 1) => {
    const idx = sorted.findIndex((x) => x.id === p.id);
    const other = sorted[idx + dir];
    if (!other) return;
    const a = idx, b = idx + dir;
    await Promise.all([saveProject(p.id, { order: b }), saveProject(other.id, { order: a })]);
    onChanged(projects.map((x) => (x.id === p.id ? { ...x, order: b } : x.id === other.id ? { ...x, order: a } : x)));
  };

  const addToHero = async (p: any) => {
    if (!onSlidesChanged) return;
    if (slides.some((s) => s.projectId === p.id)) { alert('Dit project staat al in de hero.'); return; }
    const img = p.image || p.images?.[0];
    if (!img) { alert('Voeg eerst een foto toe aan dit project.'); return; }
    const data = { projectId: p.id, projectSlug: p.slug || slugify(p.title), image: img, title: '', location: '', year: '', order: slides.length };
    const id = await saveHeroSlide(null, data);
    onSlidesChanged([...slides, { ...data, id }]);
    setNotice(`"${p.title}" staat nu in de hero. Pas het uitgesneden stuk aan bij het tabblad "Hero". Publiceer om het live te zetten.`);
  };

  // ---------------------------------------------------------------- editor
  if (editing) {
    const gallery: string[] = editing.gallery || [];
    const blocks: any[] = editing.blocks || [];
    const timeline: any[] = editing.timeline || [];
    const specs: [string, string][] = Object.entries(editing.specs || {}) as [string, string][];
    const updateBlock = (i: number, patch: any) => set({ blocks: blocks.map((b, k) => (k === i ? { ...b, ...patch } : b)) });
    const moveBlock = (i: number, d: number) => {
      const j = i + d; if (j < 0 || j >= blocks.length) return;
      const next = [...blocks]; [next[i], next[j]] = [next[j], next[i]]; set({ blocks: next });
    };
    const updateStep = (i: number, patch: any) => set({ timeline: timeline.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
    const moveStep = (i: number, d: number) => {
      const j = i + d; if (j < 0 || j >= timeline.length) return;
      const next = [...timeline]; [next[i], next[j]] = [next[j], next[i]]; set({ timeline: next });
    };
    const imageCount = (t: string) => (t === 'images2' ? 2 : t === 'images3' ? 3 : 1);

    return (
      <div className="max-w-3xl space-y-5 pb-24">
        <button onClick={() => setEditing(null)} className="text-xs text-earth-muted hover:text-terracotta">← Terug naar overzicht</button>
        <h2 className="font-serif text-xl font-bold text-earth-dark">{editing.id ? `Project bewerken: ${editing.title || ''}` : 'Nieuw project'}</h2>

        <Card title="1. Basis">
          <div><label className={lbl}>Titel</label><input className={input} value={editing.title} onChange={(e) => set({ title: e.target.value })} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Categorie</label>
              <select className={input} value={editing.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="nieuwbouw">Nieuwbouw</option>
                <option value="renovatie">Totaalrenovatie</option>
                <option value="interieur">Interieur & maatwerk</option>
              </select>
            </div>
            <div><label className={lbl}>Jaar</label><input className={input} value={editing.year} onChange={(e) => set({ year: e.target.value })} /></div>
            <div><label className={lbl}>Locatie</label><input className={input} value={editing.location} onChange={(e) => set({ location: e.target.value })} placeholder="bv. Lier of Locatie vertrouwelijk" /></div>
            <div><label className={lbl}>Oppervlakte</label><input className={input} value={editing.area} onChange={(e) => set({ area: e.target.value })} placeholder="bv. 180 m²" /></div>
          </div>
          <div><label className={lbl}>Korte beschrijving (ook op de projectkaart)</label><textarea className={input} rows={3} value={editing.description} onChange={(e) => set({ description: e.target.value })} /></div>
          <div><label className={lbl}>Concept / verhaal (optioneel)</label><textarea className={input} rows={4} value={editing.concept || ''} onChange={(e) => set({ concept: e.target.value })} /></div>
          <div><label className={lbl}>Citaat (optioneel)</label><input className={input} value={editing.quote || ''} onChange={(e) => set({ quote: e.target.value })} /></div>
        </Card>

        <Card title="2. Rol en fase" hint="Wees eerlijk over wie het project ontwierp. Bezoekers en de Orde van Architecten waarderen dat.">
          <div>
            <label className={lbl}>Wat is jouw rol bij dit project?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { v: 'own', t: 'Eigen project van Key-Design', d: 'Ik ontwierp en begeleidde dit project.' },
                { v: 'collaborated', t: 'Meegewerkt, niet mijn ontwerp', d: 'Ontworpen door een ander kantoor; ik werkte eraan mee (bv. bij een vorige werkgever).' },
              ].map((o) => (
                <button type="button" key={o.v} onClick={() => set({ role: o.v, attributionNote: o.v === 'collaborated' ? (editing.attributionNote || DEFAULT_COLLAB_NOTE) : editing.attributionNote })}
                  className={`text-left p-3 rounded-xl border-2 ${editing.role === o.v ? 'border-terracotta bg-sand-light' : 'border-sand-dark/40 bg-white'}`}>
                  <p className="text-sm font-bold text-earth-dark">{o.t}</p>
                  <p className="text-[11px] text-earth-muted mt-0.5">{o.d}</p>
                </button>
              ))}
            </div>
          </div>
          {editing.role === 'collaborated' && (
            <div>
              <label className={lbl}>Toelichting die bezoekers op de projectpagina zien</label>
              <textarea className={input} rows={4} value={editing.attributionNote || ''} onChange={(e) => set({ attributionNote: e.target.value })} />
              <p className="text-[11px] text-earth-muted mt-1">Zo voorkom je dat het lijkt alsof het project van Key-Design is. Pas de tekst aan naar jouw situatie.</p>
            </div>
          )}
          <div>
            <label className={lbl}>In welke fase zit dit project?</label>
            <select className={input} value={editing.phase || ''} onChange={(e) => set({ phase: e.target.value })}>
              <option value="">Geen fase tonen</option>
              {PHASES.map((p) => <option key={p.key} value={p.key}>{p.nl}</option>)}
            </select>
            <p className="text-[11px] text-earth-muted mt-1">De fase verschijnt als label op de projectkaart en als voortgangsbalk op de projectpagina.</p>
          </div>
          <div>
            <label className={lbl}>Extra toelichting bij de status (optioneel)</label>
            <textarea className={input} rows={2} value={editing.statusNote || ''} onChange={(e) => set({ statusNote: e.target.value })} placeholder="bv. Dit is een haalbaarheidsstudie, nog niet uitgevoerd." />
          </div>
        </Card>

        <Card title="3. Foto's" hint="Upload zoveel foto's als je wilt, ook meerdere tegelijk. De eerste foto is de hoofdfoto. Alles wordt scherp bewaard en voor elk scherm automatisch verkleind.">
          <ImageListField label="Alle foto's van dit project" values={gallery} onChange={(v) => set({ gallery: v })} />
        </Card>

        <Card title="4. Opbouw van de projectpagina" hint="Bouw de pagina zoals jij wilt: voeg koppen, tekst, foto's en citaten toe in de volgorde die je wilt. Laat dit leeg voor de standaardindeling (tekst, daarna alle foto's).">
          <div className="space-y-3">
            {blocks.map((b, i) => (
              <div key={b.id} className="rounded-xl border border-sand-dark/50 bg-sand-light/50 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-terracotta">
                  <span>{BLOCK_TYPES.find((t) => t.type === b.type)?.label.replace('+ ', '')}</span>
                  <span className="flex gap-2 text-sm normal-case">
                    <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="disabled:opacity-30">↓</button>
                    <button type="button" onClick={() => set({ blocks: blocks.filter((_, k) => k !== i) })} className="text-red-500">✕</button>
                  </span>
                </div>
                {['heading', 'text', 'quote', 'video'].includes(b.type) && (
                  <>
                    {b.type === 'text' ? (
                      <textarea className={input} rows={4} value={b.text || ''} onChange={(e) => updateBlock(i, { text: e.target.value })} placeholder="Tekst…" />
                    ) : (
                      <input className={input} value={b.text || ''} onChange={(e) => updateBlock(i, { text: e.target.value })} placeholder={b.type === 'video' ? 'Link naar een YouTube- of Vimeo-video' : b.type === 'quote' ? 'Citaat…' : 'Kop…'} />
                    )}
                    {b.type !== 'video' && (
                      b.type === 'text'
                        ? <textarea className={input} rows={2} value={b.en?.text || ''} onChange={(e) => updateBlock(i, { en: { ...(b.en || {}), text: e.target.value } })} placeholder="Engelse versie (optioneel)" />
                        : <input className={input} value={b.en?.text || ''} onChange={(e) => updateBlock(i, { en: { ...(b.en || {}), text: e.target.value } })} placeholder="Engelse versie (optioneel)" />
                    )}
                  </>
                )}
                {['image', 'images2', 'images3'].includes(b.type) && (
                  <>
                    <ImagePicker
                      label={`Kies ${imageCount(b.type) === 1 ? 'een foto' : `${imageCount(b.type)} foto's (in de volgorde van aanklikken)`} uit de foto's van dit project`}
                      images={gallery}
                      value={b.images || []}
                      multiple
                      onChange={(v: string[]) => updateBlock(i, { images: v.slice(0, imageCount(b.type)) })}
                    />
                    <input className={input} value={b.caption || ''} onChange={(e) => updateBlock(i, { caption: e.target.value })} placeholder="Bijschrift (optioneel)" />
                    <input className={input} value={b.en?.caption || ''} onChange={(e) => updateBlock(i, { en: { ...(b.en || {}), caption: e.target.value } })} placeholder="Engels bijschrift (optioneel)" />
                  </>
                )}
              </div>
            ))}
            {blocks.length === 0 && <p className="text-xs text-earth-muted">Nog geen onderdelen: de pagina gebruikt de standaardindeling.</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {BLOCK_TYPES.map((t) => (
              <button type="button" key={t.type} onClick={() => set({ blocks: [...blocks, { id: uid(), type: t.type, text: '', images: [], caption: '' }] })}
                className="py-1.5 px-3 rounded-full border-2 border-earth-dark text-[11px] font-bold uppercase tracking-wider bg-white hover:bg-sand-medium">
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        <Card title="5. Tijdlijn" hint="Toon het traject van het project in stappen, met foto's per stap (bv. voorstudie, vergunning, werf, oplevering).">
          <div className="space-y-3">
            {timeline.map((st, i) => (
              <div key={st.id || i} className="rounded-xl border border-sand-dark/50 bg-sand-light/50 p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-terracotta">
                  <span>Stap {i + 1}</span>
                  <span className="flex gap-2 text-sm normal-case">
                    <button type="button" onClick={() => moveStep(i, -1)} disabled={i === 0} className="disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => moveStep(i, 1)} disabled={i === timeline.length - 1} className="disabled:opacity-30">↓</button>
                    <button type="button" onClick={() => set({ timeline: timeline.filter((_, k) => k !== i) })} className="text-red-500">✕</button>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select className={input} value={st.phase || ''} onChange={(e) => updateStep(i, { phase: e.target.value })}>
                    <option value="">Fase…</option>
                    {PHASES.map((p) => <option key={p.key} value={p.nl}>{p.nl}</option>)}
                  </select>
                  <input className={input} value={st.title || ''} onChange={(e) => updateStep(i, { title: e.target.value })} placeholder="Titel van de stap" />
                  <input className={input} value={st.date || ''} onChange={(e) => updateStep(i, { date: e.target.value })} placeholder="Datum, bv. maart 2025" />
                </div>
                <textarea className={input} rows={2} value={st.description || ''} onChange={(e) => updateStep(i, { description: e.target.value })} placeholder="Wat gebeurde er in deze stap?" />
                <input className={input} value={st.en?.title || ''} onChange={(e) => updateStep(i, { en: { ...(st.en || {}), title: e.target.value } })} placeholder="Engelse titel (optioneel)" />
                <textarea className={input} rows={2} value={st.en?.description || ''} onChange={(e) => updateStep(i, { en: { ...(st.en || {}), description: e.target.value } })} placeholder="Engelse beschrijving (optioneel)" />
                <ImagePicker label="Foto's bij deze stap" images={gallery} value={st.images || []} multiple onChange={(v: string[]) => updateStep(i, { images: v })} />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => set({ timeline: [...timeline, { id: uid(), phase: '', title: '', date: '', description: '', images: [] }] })}
            className="py-1.5 px-3 rounded-full border-2 border-earth-dark text-[11px] font-bold uppercase tracking-wider bg-white hover:bg-sand-medium">
            + Stap toevoegen
          </button>
        </Card>

        <Card title="6. Materialen en gegevens (optioneel)">
          <div>
            <label className={lbl}>Materialen (één per regel)</label>
            <textarea className={input} rows={3} value={(editing.materials || []).join('\n')} onChange={(e) => set({ materials: e.target.value.split('\n') })} />
          </div>
          <div>
            <label className={lbl}>Gegevens (bv. Bouwheer, Fase, Budget)</label>
            <div className="space-y-2">
              {specs.map(([k, v], i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input className={input} value={k} placeholder="Naam" onChange={(e) => { const n = [...specs]; n[i] = [e.target.value, v]; set({ specs: Object.fromEntries(n) }); }} />
                  <input className={input} value={v} placeholder="Waarde" onChange={(e) => { const n = [...specs]; n[i] = [k, e.target.value]; set({ specs: Object.fromEntries(n) }); }} />
                  <button type="button" className="text-red-500 px-2" onClick={() => set({ specs: Object.fromEntries(specs.filter((_, x) => x !== i)) })}>✕</button>
                </div>
              ))}
              <button type="button" onClick={() => set({ specs: { ...(editing.specs || {}), [`Nieuw ${specs.length + 1}`]: '' } })} className="text-xs font-bold text-terracotta">+ Gegeven toevoegen</button>
            </div>
          </div>
        </Card>

        <Card title="7. Engelse versie (optioneel)" hint="Leeg laten = de Engelse pagina toont de Nederlandse tekst.">
          <div><label className={lbl}>Korte beschrijving</label><textarea className={input} rows={3} value={editing.en?.description || ''} onChange={(e) => setEn({ description: e.target.value })} /></div>
          <div><label className={lbl}>Concept / verhaal</label><textarea className={input} rows={3} value={editing.en?.concept || ''} onChange={(e) => setEn({ concept: e.target.value })} /></div>
          <div><label className={lbl}>Locatie</label><input className={input} value={editing.en?.location || ''} onChange={(e) => setEn({ location: e.target.value })} /></div>
          <div><label className={lbl}>Citaat</label><input className={input} value={editing.en?.quote || ''} onChange={(e) => setEn({ quote: e.target.value })} /></div>
          {editing.role === 'collaborated' && <div><label className={lbl}>Toelichting over de rol</label><textarea className={input} rows={3} value={editing.en?.attributionNote || ''} onChange={(e) => setEn({ attributionNote: e.target.value })} /></div>}
          {editing.statusNote && <div><label className={lbl}>Toelichting bij de status</label><textarea className={input} rows={2} value={editing.en?.statusNote || ''} onChange={(e) => setEn({ statusNote: e.target.value })} /></div>}
        </Card>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!editing.starred} onChange={(e) => set({ starred: e.target.checked })} />
          Uitgelicht op de homepage (de eerste twee uitgelichte projecten verschijnen daar)
        </label>

        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-sand-dark/40 px-6 py-3 flex items-center gap-4 z-30">
          <button onClick={handleSave} disabled={saving} className="py-2.5 px-8 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-sm font-bold uppercase tracking-wider rounded-xl">
            {saving ? 'Bezig met opslaan…' : 'Project opslaan'}
          </button>
          <button onClick={() => setEditing(null)} className="text-xs text-earth-muted">Annuleren</button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------- overview
  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button onClick={startNew} className="py-2.5 px-5 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full">+ Nieuw project</button>
        {notice && <p className="text-xs text-earth-muted">{notice}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((p, i) => {
          const inHero = slides.some((s) => s.projectId === p.id);
          const phase = PHASES.find((x) => x.key === p.phase)?.nl;
          return (
            <div key={p.id} className="rounded-2xl overflow-hidden bg-white border border-sand-dark/40 flex flex-col">
              <Preview value={p.image || p.images?.[0]} alt={p.title} className="w-full h-32 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <p className="font-serif font-bold text-earth-dark">{p.title || '(zonder titel)'}</p>
                <p className="text-xs text-earth-muted">{p.category} · {p.year}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {phase && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand-medium text-earth-dark">{phase}</span>}
                  {(p.role === 'collaborated' || p.attributionNote) && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Meegewerkt</span>}
                  {inHero && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-terracotta text-white">In hero</span>}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
                  <button onClick={() => startEdit(p)} className="text-terracotta font-bold">Bewerken</button>
                  <button onClick={() => toggleStar(p)} className={`font-bold ${p.starred ? 'text-terracotta' : 'text-earth-muted'}`}>{p.starred ? '★ Uitgelicht' : '☆ Uitlichten'}</button>
                  {onSlidesChanged && !inHero && <button onClick={() => addToHero(p)} className="text-earth-dark font-bold">+ Zet in hero</button>}
                  <button onClick={() => move(p, -1)} disabled={i === 0} className="disabled:opacity-30 text-earth-muted" aria-label="Eerder">↑</button>
                  <button onClick={() => move(p, 1)} disabled={i === sorted.length - 1} className="disabled:opacity-30 text-earth-muted" aria-label="Later">↓</button>
                  <button onClick={() => handleDelete(p)} className="text-red-500 font-bold ml-auto">Verwijderen</button>
                </div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && <p className="text-sm text-earth-muted">Nog geen projecten. Klik op "+ Nieuw project" om te starten.</p>}
      </div>
    </div>
  );
}
