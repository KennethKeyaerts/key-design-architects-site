import React, { useMemo, useState } from 'react';
import { saveSiteSettings } from '../../lib/firebase';

interface Props {
  settings: Record<string, any>;
  onSaved: (updated: Record<string, any>) => void;
}

// Human-readable section headers for known key prefixes. Any key that
// doesn't match a known prefix still shows up under "Overige teksten" — new
// fields never get silently hidden.
const SECTIONS: { label: string; match: (key: string) => boolean }[] = [
  { label: 'Topbalk & Navigatie', match: (k) => k.startsWith('topBar') || k.startsWith('nav') },
  { label: 'Hero (bovenaan de homepagina)', match: (k) => k.startsWith('hero') },
  { label: 'Visie-sectie', match: (k) => k.startsWith('vision') },
  { label: 'Portfolio-sectie', match: (k) => k.startsWith('portfolio') },
  { label: 'Through Renders-sectie', match: (k) => k.toLowerCase().startsWith('throughrenders') },
  { label: 'Haalbaarheidscheck', match: (k) => k.startsWith('feasibility') },
  { label: 'Over Kenneth', match: (k) => k.startsWith('about') },
  { label: 'Traject', match: (k) => k.startsWith('trajectory') },
  { label: 'Contactpagina', match: (k) => k.startsWith('contact') },
  { label: 'Footer', match: (k) => k.startsWith('footer') },
  { label: 'Statistieken', match: (k) => k.startsWith('stat') },
];

function isFormattingKey(key: string) {
  return key.endsWith('_formatting');
}

function labelFor(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase()).trim();
}

export default function SiteTextsPanel({ settings, onSaved }: Props) {
  const [values, setValues] = useState<Record<string, any>>(settings);
  const [activeSection, setActiveSection] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const editableKeys = useMemo(
    () => Object.keys(values).filter((k) => typeof values[k] === 'string' && !isFormattingKey(k)),
    [values]
  );

  const grouped = useMemo(() => {
    const groups = SECTIONS.map((sec) => ({ ...sec, keys: editableKeys.filter(sec.match) }));
    const used = new Set(groups.flatMap((g) => g.keys));
    const rest = editableKeys.filter((k) => !used.has(k));
    return [...groups.filter((g) => g.keys.length), { label: 'Overige teksten', match: () => false, keys: rest }].filter(
      (g) => g.keys.length
    );
  }, [editableKeys]);

  const update = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveSiteSettings(values);
      onSaved(values);
      setSavedAt(Date.now());
    } catch (err) {
      console.error(err);
      alert('Opslaan mislukt. Controleer uw internetverbinding en probeer opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  const section = grouped[activeSection];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <nav className="lg:w-56 shrink-0">
        <div className="lg:sticky lg:top-24 space-y-1">
          {grouped.map((g, i) => (
            <button
              key={g.label}
              onClick={() => setActiveSection(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                i === activeSection ? 'bg-terracotta text-white' : 'text-earth-muted hover:bg-sand-medium'
              }`}
            >
              {g.label} <span className="opacity-60">({g.keys.length})</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 space-y-4">
        {section?.keys.map((key) => {
          const val = values[key] ?? '';
          const long = val.length > 90;
          return (
            <div key={key}>
              <label className="block text-xs font-bold text-earth-dark mb-1">{labelFor(key)}</label>
              {long ? (
                <textarea
                  value={val}
                  onChange={(e) => update(key, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 focus:border-terracotta focus:outline-none text-sm resize-y"
                />
              ) : (
                <input
                  value={val}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sand-dark/60 focus:border-terracotta focus:outline-none text-sm"
                />
              )}
            </div>
          );
        })}

        <div className="sticky bottom-4 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="py-3 px-8 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg"
          >
            {saving ? 'Bezig met opslaan…' : 'Wijzigingen opslaan'}
          </button>
          {savedAt && <span className="ml-4 text-xs text-earth-muted">Opgeslagen ✓. Publiceer hierna om live te zetten.</span>}
        </div>
      </div>
    </div>
  );
}
