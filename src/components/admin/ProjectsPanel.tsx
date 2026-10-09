import React, { useState } from 'react';
import { saveProject, deleteProject } from '../../lib/firebase';
import { compressImage } from '../../lib/imageCompressor';

interface Props {
  projects: any[];
  onChanged: (projects: any[]) => void;
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
};

export default function ProjectsPanel({ projects, onChanged }: Props) {
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const startNew = () => setEditing({ ...BLANK, id: null });
  const startEdit = (p: any) => setEditing({ ...p });

  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const compressed = await compressImage(reader.result as string);
      setEditing((prev: any) => ({ ...prev, image: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!editing.title) {
      alert('Geef het project een titel.');
      return;
    }
    setSaving(true);
    try {
      const { id, ...data } = editing;
      const newId = await saveProject(id, data);
      const updated = id
        ? projects.map((p) => (p.id === id ? { ...editing } : p))
        : [...projects, { ...editing, id: newId }];
      onChanged(updated);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert('Opslaan mislukt.');
    } finally {
      setSaving(false);
    }
  };

  const toggleStar = async (p: any) => {
    const updated = { ...p, starred: !p.starred };
    await saveProject(p.id, { starred: updated.starred });
    onChanged(projects.map((x) => (x.id === p.id ? updated : x)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Dit project definitief verwijderen?')) return;
    await deleteProject(id);
    onChanged(projects.filter((p) => p.id !== id));
  };

  if (editing) {
    return (
      <div className="max-w-2xl space-y-4">
        <button onClick={() => setEditing(null)} className="text-xs text-earth-muted hover:text-terracotta">← Terug naar overzicht</button>
        <h2 className="font-serif text-xl font-bold text-earth-dark">{editing.id ? 'Project bewerken' : 'Nieuw project'}</h2>

        <div>
          <label className="block text-xs font-bold text-earth-dark mb-1">Titel</label>
          <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-earth-dark mb-1">Categorie</label>
            <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm bg-white">
              <option value="nieuwbouw">Nieuwbouw</option>
              <option value="renovatie">Renovatie</option>
              <option value="interieur">Interieur</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-earth-dark mb-1">Jaar</label>
            <input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-earth-dark mb-1">Locatie</label>
            <input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-earth-dark mb-1">Oppervlakte</label>
            <input value={editing.area} onChange={(e) => setEditing({ ...editing, area: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-earth-dark mb-1">Beschrijving</label>
          <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 text-sm" />
        </div>

        <div>
          <label className="block text-xs font-bold text-earth-dark mb-1">Hoofdfoto</label>
          {editing.image && <img src={editing.image} alt="" className="w-40 h-28 object-cover rounded-lg mb-2 border border-sand-dark/40" />}
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="text-sm" />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!editing.starred} onChange={(e) => setEditing({ ...editing, starred: e.target.checked })} />
          Uitgelicht op de homepagina
        </label>

        <button onClick={handleSave} disabled={saving} className="py-3 px-8 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-sm font-bold uppercase tracking-wider rounded-xl">
          {saving ? 'Bezig met opslaan…' : 'Project opslaan'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={startNew} className="mb-6 py-2.5 px-5 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full">
        + Nieuw project
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl overflow-hidden bg-white border border-sand-dark/40">
            {p.image && <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />}
            <div className="p-4">
              <p className="font-serif font-bold text-earth-dark">{p.title || '(zonder titel)'}</p>
              <p className="text-xs text-earth-muted">{p.category} · {p.year}</p>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <button onClick={() => startEdit(p)} className="text-terracotta font-bold">Bewerken</button>
                <button onClick={() => toggleStar(p)} className={`font-bold ${p.starred ? 'text-terracotta' : 'text-earth-muted'}`}>
                  {p.starred ? '★ Vastgepind' : '☆ Vastpinnen'}
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 font-bold">Verwijderen</button>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-sm text-earth-muted">Nog geen projecten. Klik op "+ Nieuw project" om te starten.</p>}
      </div>
    </div>
  );
}
