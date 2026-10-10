import React, { useMemo, useState } from 'react';

interface Props {
  settings: Record<string, any>;
  lang?: 'nl' | 'en';
}

const TYPES_NL = [
  { key: 'nieuwbouw', label: 'Nieuwbouw', desc: 'Woningbouw, utiliteit & industrie' },
  { key: 'renovatie', label: 'Totaalrenovatie', desc: 'Sloop & structuur (+15-25%/m²)' },
  { key: 'interieur', label: 'Interieur & Maatwerk', desc: 'Interieur & maatwerkinrichting' },
];
const TYPES_EN = [
  { key: 'nieuwbouw', label: 'New-build', desc: 'Residential, commercial & industrial' },
  { key: 'renovatie', label: 'Full Renovation', desc: 'Demolition & structure (+15-25%/m²)' },
  { key: 'interieur', label: 'Interior & Custom Work', desc: 'Interior & bespoke fit-out' },
];

const QUALITIES_NL = [
  { key: 'basis', label: 'Basis', desc: 'Standaard opties zonder extra\u2019s.' },
  { key: 'comfort', label: 'Comfort', desc: 'Extra gemak en kwaliteit.' },
  { key: 'luxe', label: 'Luxe', desc: 'Exclusief en hoogwaardig afgewerkt.' },
];
const QUALITIES_EN = [
  { key: 'basis', label: 'Basic', desc: 'Standard options without extras.' },
  { key: 'comfort', label: 'Comfort', desc: 'Extra convenience and quality.' },
  { key: 'luxe', label: 'Luxury', desc: 'Exclusive, high-end finish.' },
];

function makeFormatCurrency(locale: string) {
  return (val: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
}
function roundTo2500(val: number) {
  return Math.round(val / 2500) * 2500;
}

// This tool gives a prospective client a rough, own-orientation estimate of
// construction cost only. It deliberately does not calculate or display
// architect fees, engineering, or study costs, those are discussed
// personally and depend on the specifics of a project.
export default function FeasibilityAssessor({ settings: t, lang = 'nl' }: Props) {
  const en = lang === 'en';
  const TYPES = en ? TYPES_EN : TYPES_NL;
  const QUALITIES = en ? QUALITIES_EN : QUALITIES_NL;
  const formatCurrency = makeFormatCurrency(en ? 'en-BE' : 'nl-BE');
  const [projectType, setProjectType] = useState('nieuwbouw');
  const [projectSize, setProjectSize] = useState(180);
  const [qualityClass, setQualityClass] = useState('comfort');
  const [expanded, setExpanded] = useState(false);

  const baseRate = useMemo(() => {
    const g = (key: string, fb: number) => Number(t[key] ?? fb);
    if (projectType === 'nieuwbouw') {
      if (qualityClass === 'basis') return g('feasibility_nieuwbouw_std_rate', 1950);
      if (qualityClass === 'comfort') return g('feasibility_nieuwbouw_high_rate', 2450);
      return g('feasibility_nieuwbouw_elite_rate', 3200);
    } else if (projectType === 'renovatie') {
      if (qualityClass === 'basis') return g('feasibility_renovatie_std_rate', 2400);
      if (qualityClass === 'comfort') return g('feasibility_renovatie_high_rate', 2950);
      return g('feasibility_renovatie_elite_rate', 3850);
    } else {
      if (qualityClass === 'basis') return g('feasibility_interieur_std_rate', 1100);
      if (qualityClass === 'comfort') return g('feasibility_interieur_high_rate', 1650);
      return g('feasibility_interieur_elite_rate', 2400);
    }
  }, [projectType, qualityClass, t]);

  const rawConstructionCost = projectSize * baseRate;
  const constructionMin = roundTo2500(rawConstructionCost * 0.92);
  const constructionMax = roundTo2500(rawConstructionCost * 1.08);

  const budgetSplit = useMemo(() => {
    const pct1 = Number(t.budget_pct_cat1 ?? 45);
    const pct2 = Number(t.budget_pct_cat2 ?? 30);
    const pct3 = Number(t.budget_pct_cat3 ?? 25);
    return [
      { label: en ? 'Shell & Structure' : (t.budget_cat1_label || 'Ruwbouw & Structuur'), pct: pct1, value: roundTo2500(constructionMin * (pct1 / 100)), color: 'bg-earth-dark' },
      { label: en ? 'Services & HVAC' : (t.budget_cat2_label || 'Technieken & HVAC'), pct: pct2, value: roundTo2500(constructionMin * (pct2 / 100)), color: 'bg-terracotta' },
      { label: en ? 'Finishing & Custom Work' : (t.budget_cat3_label || 'Afwerking & Maatwerk'), pct: pct3, value: roundTo2500(constructionMin * (pct3 / 100)), color: 'bg-terracotta-soft' },
    ];
  }, [t, constructionMin]);

  const phases = [1, 2, 3, 4].map((n) => ({
    name: en ? [
      'Phase 1: Initial idea & preliminary design',
      'Phase 2: Permit (submission & approval)',
      'Phase 3: Technical file & pricing',
      'Phase 4: Site follow-up & handover',
    ][n - 1] : t[`feasibility_phase${n}_name`] || ['Fase 1: Eerste idee & voorontwerp', 'Fase 2: Vergunning (indienen & bekomen)', 'Fase 3: Technisch dossier & prijzen', 'Fase 4: Werfopvolging & oplevering'][n - 1],
    desc: en ? [
      'We translate your wishes and budget into a first, clear concept.',
      'I compile the file, submit it, and follow the procedure until the permit is granted.',
      'The plans are developed in detail so you can compare contractor quotes objectively.',
      'I follow the execution on site and guide you through to handover.',
    ][n - 1] : t[`feasibility_phase${n}_desc`] || [
      'We vertalen jouw wensen en budget naar een eerste, helder concept.',
      'Ik stel het dossier samen, dien in en volg de procedure op tot de vergunning binnen is.',
      'De plannen worden tot in detail uitgewerkt zodat je aannemersoffertes objectief kan vergelijken.',
      'Ik volg de uitvoering op de werf op en begeleid je tot de oplevering.',
    ][n - 1],
  }));

  const included = en ? [] : [1, 2, 3].map((n) => t[`feasibility_included_${n}`]).filter(Boolean);
  const includedFallback = en
    ? ['Shell, facade and roofing', 'Services (plumbing, HVAC and electrical)', 'Interior finishing & custom work']
    : ['Ruwbouw, gevel en dakwerk', 'Technieken (sanitair, HVAC en elektriciteit)', 'Binnenafwerking & maatwerk'];
  const excluded = en ? [] : [1, 2, 3, 4].map((n) => t[`feasibility_excluded_${n}`]).filter(Boolean);
  const excludedFallback = en
    ? ['Architect & engineer fees', 'Study costs (soil survey, EPB)', 'VAT (6% or 21%)', 'Levies & land costs']
    : ['Erelonen architect & ingenieurs', 'Studiekosten (bodemonderzoek, EPB)', 'BTW (6% of 21%)', 'Leges & grondkosten'];
  const includedList = included.length ? included : includedFallback;
  const excludedList = excluded.length ? excluded : excludedFallback;

  const typeInfo = TYPES.find((x) => x.key === projectType)!;
  const qualityInfo = QUALITIES.find((q) => q.key === qualityClass)!;

  const contactHref = en
    ? `/en/contact?type=${encodeURIComponent(typeInfo.label)}&message=${encodeURIComponent(
        `FEASIBILITY CHECK INTAKE:\nProject type: ${typeInfo.label}\nSurface area: ${projectSize}m2\nFinish level: ${qualityInfo.label}\nIndicative construction cost: ${formatCurrency(constructionMin)} to ${formatCurrency(constructionMax)}`
      )}`
    : `/contact?type=${encodeURIComponent(typeInfo.label)}&message=${encodeURIComponent(
        `INTAKE HAALBAARHEIDSCHECK:\nProjecttype: ${typeInfo.label}\nOppervlakte: ${projectSize}m2\nAfwerkingsniveau: ${qualityInfo.label}\nIndicatieve bouwkost: ${formatCurrency(constructionMin)} tot ${formatCurrency(constructionMax)}`
      )}`;

  return (
    <div className="card-cartoon overflow-hidden">
      {/* ---- Inputs ---- */}
      <div className="p-6 sm:p-8 space-y-6 bg-sun/25 border-b-2 border-earth-dark">
        <div>
          <label className="block text-xs font-bold text-earth-dark mb-2">{en ? '1. Project type & complexity' : '1. Projecttype & complexiteit'}</label>
          <div className="space-y-2">
            {TYPES.map((x) => (
              <button
                key={x.key}
                onClick={() => setProjectType(x.key)}
                className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-colors ${
                  projectType === x.key ? 'bg-orangePastel border-earth-dark' : 'bg-white border-sand-dark/50 hover:border-earth-dark'
                }`}
              >
                <p className="text-sm font-bold text-earth-dark">{x.label}</p>
                <p className="text-[11px] text-earth-muted">{x.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="fa-size" className="block text-xs font-bold text-earth-dark mb-2">
            {en ? '2. Desired surface area:' : '2. Gewenste oppervlakte:'} <span className="text-terracotta">{projectSize} m²</span>
          </label>
          <input id="fa-size" type="range" min={10} max={5000} step={10} value={projectSize} onChange={(e) => setProjectSize(Number(e.target.value))} className="w-full accent-terracotta" />
        </div>

        <div>
          <label className="block text-xs font-bold text-earth-dark mb-2">
            {en ? '3. Finish level & guide price per m²' : '3. Afwerkingsniveau & richtprijs per m²'} <span className="text-terracotta font-normal">({en ? 'current guide value' : 'huidige richtwaarde'}: {formatCurrency(baseRate)}/m², {en ? 'excl. VAT' : 'excl. btw'})</span>
          </label>
          <div className="space-y-2">
            {QUALITIES.map((q) => (
              <button
                key={q.key}
                onClick={() => setQualityClass(q.key)}
                className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-colors ${
                  qualityClass === q.key ? 'bg-orangePastel border-earth-dark' : 'bg-white border-sand-dark/50 hover:border-earth-dark'
                }`}
              >
                <p className="text-sm font-bold text-earth-dark">{q.label}</p>
                <p className="text-[11px] text-earth-muted">{q.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Results ---- */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta">{en ? 'Dynamic calculation' : 'Dynamische calculatie'}</span>
            <h3 aria-level={2} className="font-bold text-xl text-earth-dark">{en ? 'Indicative Budget Estimate' : 'Indicatieve Budget Raming'}</h3>
          </div>
          <div className="flex rounded-full border-2 border-earth-dark overflow-hidden text-xs font-bold shrink-0">
            <button onClick={() => setExpanded(false)} className={`px-3 py-1.5 ${!expanded ? 'bg-earth-dark text-white' : 'bg-white text-earth-dark'}`}>Compact</button>
            <button onClick={() => setExpanded(true)} className={`px-3 py-1.5 ${expanded ? 'bg-earth-dark text-white' : 'bg-white text-earth-dark'}`}>{en ? 'Extended' : 'Uitgebreid'}</button>
          </div>
        </div>

        <div className="badge-cartoon inline-flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 text-xs font-bold text-earth-dark mb-4">
          <span>{en ? 'Project parameters' : 'Project parameters'} ({projectSize} m²):</span>
          <span className="text-terracotta">{en ? 'Base rate' : 'Basistarief'} {formatCurrency(baseRate)}/m²</span>
          <span>·</span>
          <span>{typeInfo.label}</span>
          <span>·</span>
          <span>{qualityInfo.label}</span>
        </div>

        {!expanded && (
          <p className="text-xs font-bold text-earth-dark mb-4 flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-green-700">{en ? '✓ Shell, services & finishing included' : '✓ Ruwbouw, technieken & afwerking inbegrepen'}</span>
            <span className="text-amber-700">{en ? 'Excl. fees, EPB & VAT' : 'Excl. ereloon, EPB & btw'}</span>
          </p>
        )}

        {expanded && (
          <div className="space-y-6 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-earth-muted mb-2">{en ? 'Structure of the journey' : 'Opbouw van het traject'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {phases.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl bg-sand-light border border-sand-dark/40">
                    <p className="text-[11px] font-bold text-earth-dark">{p.name}</p>
                    <p className="text-[11px] text-earth-muted mt-1 leading-snug">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-earth-muted mb-2">{en ? 'Indicative breakdown of construction cost' : 'Indicatieve budgetverdeling bouwkost'}</p>
              <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex p-0.5 border border-sand-dark/40">
                {budgetSplit.map((b) => (
                  <div key={b.label} className={`h-full ${b.color}`} style={{ width: `${Math.min(100, Math.max(0, b.pct))}%` }} title={`${b.label} (${b.pct}%)`} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-1.5 mt-2">
                {budgetSplit.map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 text-[11px] text-earth-muted">
                    <span className={`w-2 h-2 rounded-full ${b.color} shrink-0`} />
                    <span>{b.label} ({b.pct}%): <strong className="text-earth-dark">{formatCurrency(b.value)}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-earth-muted mb-2">{en ? 'Included vs. excluded' : 'Inbegrepen vs. exclusief'}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-green-50 border-2 border-green-700/30">
                  <p className="text-[11px] font-bold text-green-800 mb-1.5">{en ? '✓ Included in construction cost:' : '✓ Inbegrepen in bouwkost:'}</p>
                  <ul className="space-y-1">
                    {includedList.map((item, i) => (
                      <li key={i} className="text-[11px] text-green-900 leading-snug">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-700/30">
                  <p className="text-[11px] font-bold text-amber-800 mb-1.5">{en ? 'Excluded (not included):' : 'Exclusief (niet inbegrepen):'}</p>
                  <ul className="space-y-1">
                    {excludedList.map((item, i) => (
                      <li key={i} className="text-[11px] text-amber-900 leading-snug">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card-cartoon p-5 mb-4 bg-sand-light">
          <p className="text-[11px] font-bold uppercase tracking-wider text-terracotta">{en ? 'Indicative construction cost (contractor)' : 'Indicatieve bouwkost aanneming'}</p>
          <p className="text-[10px] text-earth-muted">{en ? '(contractor costs only, excluding VAT, levies, studies & architect fees)' : '(loutere aannemingskosten, exclusief btw, leges, studie & ereloon architect)'}</p>
          <p className="text-2xl font-bold text-earth-dark mt-1">{formatCurrency(constructionMin)} - {formatCurrency(constructionMax)}</p>
        </div>

        <button onClick={() => setExpanded((v) => !v)} className="w-full text-center text-xs font-bold text-terracotta hover:text-terracotta-dark mb-4">
          {expanded ? (en ? 'Show compact overview ↑' : 'Toon compact overzicht ↑') : (en ? 'Show extended breakdown (journey, budget split & details) →' : 'Toon uitgebreide onderbouwing (traject, budgetverdeling & details) →')}
        </button>

        <div className="p-4 rounded-xl bg-sand-light border border-sand-dark/40 mb-6">
          <p className="text-[11px] font-bold text-earth-dark mb-1">Disclaimer</p>
          <p className="text-[11px] text-earth-muted leading-relaxed">
            {(en
              ? 'This calculation is a first, indicative simulation based on current market averages. However, the construction industry is subject to fluctuations in material and labour costs. This overview is a handy guideline for exploring your budget, but is not a binding price quote. Architect fees, studies, safety coordination, EPB/BEN guidance and other professional costs are not included. Real prices are finalised through actual contractor quotes.'
              : null) || t.feasibility_disclaimer_text ||
              'Deze berekening is een eerste, indicatieve simulatie op basis van de huidige marktgemiddelden. De bouwwereld is echter onderhevig aan schommelingen in materiaal- en loonkosten. Dit overzicht is een handige richtlijn om je budget te verkennen, maar vormt geen bindende prijsofferte. Architectenereloon, studies, veiligheidscoördinatie, EPB/BEN-begeleiding en andere professionele kosten zijn hier niet in inbegrepen. Echte prijzen worden definitief vastgelegd via de reële offertes van aannemers.'}
          </p>
        </div>

        <a href={contactHref} className="btn-cartoon-primary block w-full text-center py-3.5 text-sm font-bold uppercase tracking-wider">
          {en ? 'Discuss this result with Kenneth →' : 'Bespreek dit resultaat met Kenneth →'}
        </a>
      </div>
    </div>
  );
}
