// Regional landing pages ("architect in <region>"). Each one has its own genuine
// text (what is specific about building there) so Google sees useful local pages,
// not copies with only the place name swapped. NL and EN are authored separately.

export interface RegionFaq { q: string; a: string }
export interface RegionCopy {
  label: string;          // short name used in links, e.g. "Lier"
  title: string;          // <title>
  description: string;    // meta description
  h1: string;
  intro: string;
  localTitle: string;
  local: { h: string; p: string }[];
  faq: RegionFaq[];
}
export type RegionGroup = 'thuis' | 'antwerpse-rand' | 'rand-leuven' | 'kempen' | 'overig';
export const groupLabels: Record<RegionGroup, { nl: string; en: string }> = {
  thuis: { nl: 'Rond Lier', en: 'Around Lier' },
  'antwerpse-rand': { nl: 'Antwerpen en de Antwerpse rand', en: 'Antwerp and its surroundings' },
  'rand-leuven': { nl: 'Leuven, Hageland en de Vlaamse Rand', en: 'Leuven, Hageland and the Flemish Rand' },
  kempen: { nl: 'Kempen en Limburg', en: 'Kempen and Limburg' },
  overig: { nl: 'Overige regio', en: 'Other areas' },
};

export interface Region {
  group: RegionGroup;     // where it appears on the Werkgebied overview
  personal?: { nl: string; en: string }; // a true, personal local link written by Kenneth (e.g. born here, built here); shown as a highlighted note
  slug: string;           // key, page lives at /architect-<slug>
  name: string;           // place name for schema
  placeType: 'City' | 'AdministrativeArea';
  featuredProjectTitle?: string; // title of a real project of Kenneth in this area
  nl: RegionCopy;
  en: RegionCopy;
}

const sharedFaqNl = (place: string): RegionFaq[] => [
  {
    q: 'Heb ik een architect nodig voor mijn bouw- of verbouwproject?',
    a: 'Voor de meeste bouw- en verbouwwerken waarvoor een vergunning nodig is, is in Vlaanderen een architect verplicht. Voor kleine werken bestaan er uitzonderingen. We bekijken dat graag samen met u, vrijblijvend.',
  },
  {
    q: `Werkt u ook buiten ${place}?`,
    a: 'Ja. Ons kantoor zit in Lier en we werken in de provincie Antwerpen en de ruimere regio. Vraag gerust of uw project binnen ons werkgebied valt.',
  },
  {
    q: 'Hoe begin ik?',
    a: 'Met een kennismakingsgesprek. Daarin bekijken we uw idee, het perceel of de woning, en wat stedenbouwkundig en technisch mogelijk is, nog voor er een ontwerp op papier staat.',
  },
];
const sharedFaqEn = (place: string): RegionFaq[] => [
  {
    q: 'Do I need an architect for my building or renovation project?',
    a: 'For most building and renovation works that require a permit, an architect is mandatory in Flanders. Exceptions exist for small works. We are happy to check this together with you, without obligation.',
  },
  {
    q: `Do you also work outside ${place}?`,
    a: 'Yes. Our office is in Lier and we work across the province of Antwerp and the wider region. Feel free to ask whether your project falls within our area.',
  },
  {
    q: 'How do I get started?',
    a: 'With an introductory conversation. We look at your idea, the plot or the house, and what is possible in planning and technical terms, before a design is put on paper.',
  },
];

export const coreRegions: Region[] = [
  {
    slug: 'lier',
    group: 'thuis',
    name: 'Lier',
    placeType: 'City',
    featuredProjectTitle: 'Woning Lookstraat',
    nl: {
      label: 'Lier',
      title: 'Architect Lier | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect in Lier: erkend architect Kenneth Keyaerts ontwerpt woningen, verbouwingen en nieuwbouw in Lier en omgeving, van haalbaarheid tot oplevering.',
      h1: 'Architect in Lier',
      intro: 'Ons kantoor zit in Lier. Wie hier bouwt of verbouwt, kent de stad als compact, historisch en vaak met een duidelijke eigen sfeer per straat. Kenneth Keyaerts begeleidt uw project van het eerste idee tot de sleuteloverdracht.',
      localTitle: 'Bouwen en verbouwen in Lier',
      local: [
        { h: 'Een stad met erfgoed', p: 'In en rond het centrum van Lier staan veel waardevolle gebouwen. Bij een verbouwing in een historische omgeving onderzoeken we vooraf wat de omgeving en de regelgeving toelaten, zodat uw plannen later geen onaangename verrassing krijgen.' },
        { h: 'Woningen die een tweede leven verdienen', p: 'Veel woningen in en rond Lier zijn aan een grondige renovatie toe: betere isolatie, een logischere indeling, meer licht. We kijken wat u kunt behouden en wat beter vervangen wordt, met oog voor uw budget.' },
        { h: 'Dichtbij', p: 'Omdat ons kantoor in Lier zit, zijn plaatsbezoeken, werfopvolging en overleg met gemeentelijke diensten kort bij. Dat scheelt tijd en maakt opvolging eenvoudiger.' },
      ],
      faq: sharedFaqNl('Lier'),
    },
    en: {
      label: 'Lier',
      title: 'Architect in Lier | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect in Lier: licensed architect Kenneth Keyaerts designs homes, renovations and new builds in Lier and the surrounding area, from feasibility to handover.',
      h1: 'Architect in Lier',
      intro: 'Our office is in Lier. Anyone building or renovating here knows a compact, historic city where every street has its own character. Kenneth Keyaerts guides your project from first idea to handover of the keys.',
      localTitle: 'Building and renovating in Lier',
      local: [
        { h: 'A city with heritage', p: 'In and around the centre of Lier there are many valuable buildings. For a renovation in a historic setting we first investigate what the surroundings and regulations allow, so your plans hold no unpleasant surprises later on.' },
        { h: 'Homes that deserve a second life', p: 'Many homes in and around Lier are ready for a thorough renovation: better insulation, a more logical layout, more light. We look at what you can keep and what is better replaced, with your budget in mind.' },
        { h: 'Close by', p: 'Because our office is in Lier, site visits, supervision and talks with municipal services are close at hand. That saves time and makes follow-up simpler.' },
      ],
      faq: sharedFaqEn('Lier'),
    },
  },
  {
    slug: 'antwerpen',
    group: 'antwerpse-rand',
    name: 'Antwerpen',
    placeType: 'City',
    nl: {
      label: 'Antwerpen',
      title: 'Architect Antwerpen | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect voor Antwerpen en omgeving: renovatie van herenhuizen en stadswoningen, nieuwbouw en uitbreidingen door erkend architect Kenneth Keyaerts.',
      h1: 'Architect voor Antwerpen',
      intro: 'Bouwen in Antwerpen betekent vaak werken op een smal perceel, met buren aan beide kanten en een woning met geschiedenis. Kenneth Keyaerts ontwerpt en begeleidt verbouwingen en nieuwbouw in en rond Antwerpen.',
      localTitle: 'Bouwen en verbouwen in Antwerpen',
      local: [
        { h: 'Herenhuizen en stadswoningen', p: 'Diepe, smalle woningen vragen slimme oplossingen voor licht, indeling en buitenruimte. We zoeken hoe u de kwaliteiten van een bestaand huis behoudt en tegelijk comfort en energieprestatie verbetert.' },
        { h: 'Gedeelde muren en buren', p: 'Bij stadswoningen werkt u zelden alleen op uw perceel. Stabiliteit, gemene muren en werfhinder vragen vooraf goed overleg, en we plannen daar bewust tijd voor in.' },
        { h: 'Vergunningen in de stad', p: 'In sommige wijken gelden bijkomende regels voor erfgoed of uitzicht. We onderzoeken die vooraf, zodat uw dossier de juiste vorm heeft vanaf de eerste indiening.' },
      ],
      faq: sharedFaqNl('Antwerpen'),
    },
    en: {
      label: 'Antwerp',
      title: 'Architect in Antwerp | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect for Antwerp and surroundings: renovation of townhouses and city homes, new builds and extensions by licensed architect Kenneth Keyaerts.',
      h1: 'Architect for Antwerp',
      intro: 'Building in Antwerp often means working on a narrow plot, with neighbours on both sides and a house with a history. Kenneth Keyaerts designs and guides renovations and new builds in and around Antwerp.',
      localTitle: 'Building and renovating in Antwerp',
      local: [
        { h: 'Townhouses and city homes', p: 'Deep, narrow homes call for clever solutions for light, layout and outdoor space. We look at how you keep the qualities of an existing house while improving comfort and energy performance.' },
        { h: 'Shared walls and neighbours', p: 'In a city home you rarely work on your plot alone. Stability, party walls and site disturbance need good consultation in advance, and we deliberately plan time for that.' },
        { h: 'Permits in the city', p: 'In some neighbourhoods extra rules apply for heritage or appearance. We investigate those in advance, so your file has the right shape from the first submission.' },
      ],
      faq: sharedFaqEn('Antwerp'),
    },
  },
  {
    slug: 'mechelen',
    group: 'thuis',
    name: 'Mechelen',
    placeType: 'City',
    nl: {
      label: 'Mechelen',
      title: 'Architect Mechelen | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect voor Mechelen en omgeving: verbouwing, renovatie en nieuwbouw van woningen door erkend architect Kenneth Keyaerts, van haalbaarheid tot oplevering.',
      h1: 'Architect voor Mechelen',
      intro: 'Mechelen combineert een historische binnenstad met rustige woonwijken en groene rand. Kenneth Keyaerts begeleidt uw bouw- of verbouwproject in Mechelen en omgeving, met één vast aanspreekpunt van idee tot oplevering.',
      localTitle: 'Bouwen en verbouwen in Mechelen',
      local: [
        { h: 'Binnenstad en erfgoed', p: 'Wie in of rond de historische binnenstad verbouwt, krijgt vaak met extra aandachtspunten te maken. We bekijken die vóór het ontwerp, zodat uw plannen realistisch zijn.' },
        { h: 'Woonwijken en uitbreidingen', p: 'In de woonwijken draait het vaak om een uitbreiding, een extra verdieping of een betere verbinding met de tuin. We zoeken wat stedenbouwkundig kan en wat het meeste oplevert voor uw woning.' },
        { h: 'Eén aanspreekpunt', p: 'U werkt met één architect voor onderzoek, ontwerp, vergunning en opvolging van de werf. Dat houdt de communicatie kort en het dossier overzichtelijk.' },
      ],
      faq: sharedFaqNl('Mechelen'),
    },
    en: {
      label: 'Mechelen',
      title: 'Architect in Mechelen | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect for Mechelen and surroundings: renovation, extension and new-build homes by licensed architect Kenneth Keyaerts, from feasibility to handover.',
      h1: 'Architect for Mechelen',
      intro: 'Mechelen combines a historic centre with quiet residential districts and a green fringe. Kenneth Keyaerts guides your building or renovation project in Mechelen and the surrounding area, with one fixed point of contact from idea to handover.',
      localTitle: 'Building and renovating in Mechelen',
      local: [
        { h: 'Historic centre and heritage', p: 'Anyone renovating in or near the historic centre often meets extra points of attention. We look at those before the design, so your plans are realistic.' },
        { h: 'Residential districts and extensions', p: 'In the residential districts it is often about an extension, an extra storey or a better link with the garden. We look at what planning rules allow and what adds the most to your home.' },
        { h: 'One point of contact', p: 'You work with one architect for research, design, permit and site supervision. That keeps communication short and the file clear.' },
      ],
      faq: sharedFaqEn('Mechelen'),
    },
  },
  {
    slug: 'kempen',
    group: 'kempen',
    name: 'Kempen',
    placeType: 'AdministrativeArea',
    nl: {
      label: 'Kempen',
      title: 'Architect Kempen | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect in de Kempen: villa\'s, nieuwbouw en renovatie van woningen op ruime percelen door erkend architect Kenneth Keyaerts uit Lier.',
      h1: 'Architect in de Kempen',
      intro: 'In de Kempen bouwt u vaak op een ruimer perceel, met bos, velden of tuin als decor. Kenneth Keyaerts ontwerpt woningen die daar rustig in thuishoren, en begeleidt u van haalbaarheid tot oplevering.',
      localTitle: 'Bouwen en verbouwen in de Kempen',
      local: [
        { h: 'Ruime percelen, rustige ligging', p: 'Meer ruimte geeft meer keuze, maar ook meer afwegingen: oriëntatie, inplanting, licht, privacy en de verhouding tussen woning en tuin. We ontwerpen vanuit het perceel, niet vanuit een standaardplan.' },
        { h: 'Landelijke en groene omgeving', p: 'Op sommige plaatsen gelden bijzondere regels, bijvoorbeeld voor woningen buiten de woonzone. We onderzoeken dat vooraf, zodat u weet wat kan voor u investeert.' },
        { h: 'Duurzaam en comfortabel', p: 'Een goed geïsoleerde, compacte woning met doordachte raamopeningen houdt het comfort hoog en de energiekost laag. We nemen dat mee van het eerste schetsontwerp.' },
      ],
      faq: sharedFaqNl('de Kempen'),
    },
    en: {
      label: 'Kempen',
      title: 'Architect in the Kempen | Key-Design Architects, Kenneth Keyaerts',
      description: 'Architect in the Kempen region: villas, new builds and renovations on generous plots by licensed architect Kenneth Keyaerts from Lier.',
      h1: 'Architect in the Kempen',
      intro: 'In the Kempen you often build on a larger plot, with woods, fields or garden as a backdrop. Kenneth Keyaerts designs homes that sit quietly in that setting, and guides you from feasibility to handover.',
      localTitle: 'Building and renovating in the Kempen',
      local: [
        { h: 'Generous plots, quiet setting', p: 'More space gives more choice, but also more decisions: orientation, placement, light, privacy and the relation between house and garden. We design from the plot, not from a standard plan.' },
        { h: 'Rural and green surroundings', p: 'In some places special rules apply, for instance for homes outside the residential zone. We investigate that in advance, so you know what is possible before you invest.' },
        { h: 'Sustainable and comfortable', p: 'A well-insulated, compact home with carefully considered window openings keeps comfort high and energy costs low. We build that in from the first sketch design.' },
      ],
      faq: sharedFaqEn('the Kempen'),
    },
  },
];

import { municipalityRegions } from './municipalities';
export const regions: Region[] = [...coreRegions, ...municipalityRegions];

export const regionBySlug = (slug: string) => regions.find((r) => r.slug === slug)!;

// Quality gate: a municipality page only builds when it has genuinely its own text.
// A page with fewer than 2 local sections, missing English copy or a copy-pasted
// intro stops the build, so thin "doorway" pages can never go live by accident.
function assertRegionQuality() {
  const seen = new Set<string>();
  for (const r of regions) {
    for (const lang of ['nl', 'en'] as const) {
      const c = r[lang];
      if (!c || !c.intro || c.intro.length < 120) throw new Error(`[regions] ${r.slug}/${lang}: intro ontbreekt of is te kort (min. 120 tekens)`);
      if (!c.local || c.local.length < 2) throw new Error(`[regions] ${r.slug}/${lang}: minstens 2 eigen lokale tekstblokken nodig`);
      for (const b of c.local) {
        const k = b.p.trim();
        if (k.length < 80) throw new Error(`[regions] ${r.slug}/${lang}: tekstblok "${b.h}" is te kort`);
        if (seen.has(k)) throw new Error(`[regions] ${r.slug}/${lang}: tekstblok "${b.h}" komt dubbel voor op een andere pagina`);
        seen.add(k);
      }
    }
  }
}
assertRegionQuality();

// Municipalities Kenneth wants to add next. They stay OFFLINE until a full entry
// (own text, NL + EN) is moved into `regions` above. `ask` is what we still need
// from him to make the page genuine.
export interface PlannedMunicipality { slug: string; name: string; group: RegionGroup; ask: string }
export const plannedMunicipalities: PlannedMunicipality[] = [];
