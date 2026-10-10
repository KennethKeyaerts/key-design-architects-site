import React, { useState } from 'react';
import { saveSiteSettings } from '../../lib/firebase';
import ImageField from './ImageField';

interface Props {
  settings: Record<string, any>;
  onSaved: (updated: Record<string, any>) => void;
}

const FIELDS: { key: string; label: string; kind: 'photo' | 'logo'; help: string; previewClass?: string }[] = [
  { key: 'brandLogo', label: 'Logo voor lichte achtergronden', kind: 'logo', help: 'Wordt gebruikt in de balk bovenaan de pagina\'s (behalve op de homepage-foto). PNG met doorzichtige achtergrond of SVG geeft de beste kwaliteit. Leeg laten = het huidige logo blijft.' },
  { key: 'brandLogoLight', label: 'Logo voor donkere achtergronden en foto\'s', kind: 'logo', help: 'Wit of licht logo, gebruikt over de hero-foto, in het menu en in de donkere footer. Alleen één logo geüpload? Dan wordt dat overal gebruikt.' },
  { key: 'brandPortrait', label: 'Profielfoto van Kenneth', kind: 'photo', previewClass: 'w-32 h-40 object-cover', help: 'Een staande foto (verhouding 4 op 5) werkt het best. Ze verschijnt op de homepage en op "Over Kenneth". De foto wordt scherp bewaard en voor elke schermgrootte automatisch verkleind.' },
  { key: 'brandThroughRenders', label: 'Logo van Through Renders', kind: 'logo', help: 'Verschijnt bij de visualisatiepartner op de homepage en in de footer.' },
  { key: 'brandShareImage', label: 'Afbeelding bij delen (WhatsApp, LinkedIn, Google)', kind: 'photo', previewClass: 'w-48 h-28 object-cover', help: 'De afbeelding die zichtbaar is wanneer iemand een link naar je website deelt. Een brede foto (1200 x 630) werkt het best.' },
];

export default function BrandPanel({ settings, onSaved }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.key, typeof settings[f.key] === 'string' ? settings[f.key] : '']))
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteSettings(values);
      onSaved({ ...settings, ...values });
      setSavedAt(Date.now());
    } catch (e) {
      console.error(e);
      alert('Opslaan mislukt. Controleer je internetverbinding en probeer opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="font-serif text-xl font-bold text-earth-dark">Logo en foto's</h2>
        <p className="text-xs text-earth-muted mt-1">
          Upload hier je eigen logo's en foto's. Alles wordt in hoge kwaliteit bewaard en bij het publiceren automatisch in
          meerdere formaten klaargezet, zodat de website scherp blijft op groot scherm en snel op telefoon. Na het opslaan
          klik je op "Publiceren" om het live te zetten.
        </p>
      </div>

      {FIELDS.map((f) => (
        <ImageField
          key={f.key}
          label={f.label}
          kind={f.kind}
          value={values[f.key]}
          onChange={(ref) => setValues((v) => ({ ...v, [f.key]: ref }))}
          previewClass={f.previewClass}
          help={f.help}
        />
      ))}

      <p className="text-[11px] text-earth-muted">Het kleine icoontje in het browsertabblad (favicon) wijzig je niet hier: vraag dat aan wie de website onderhoudt.</p>

      <div className="sticky bottom-4 pt-2">
        <button onClick={save} disabled={saving} className="py-3 px-8 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg">
          {saving ? 'Bezig met opslaan…' : 'Wijzigingen opslaan'}
        </button>
        {savedAt && <span className="ml-4 text-xs text-earth-muted">Opgeslagen ✓. Publiceer hierna om live te zetten.</span>}
      </div>
    </div>
  );
}
