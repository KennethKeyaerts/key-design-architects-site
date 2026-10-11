// English knowledge pages for people in Flanders who search in English (expats, foreign buyers,
// owners of a second home). These are written for that reader, not translated from the Dutch.
import type { KennisPage } from './kennis';

export const THEMES_EN: Record<KennisPage['theme'], { label: string; intro: string }> = {
  regularisatie: { label: 'Buying and unpermitted work', intro: 'Found a house with unpermitted work? What to check and what your options are.' },
  vergunning: { label: 'Permits and architects', intro: 'How the permit system in Flanders works, and when you need an architect.' },
  bouwen: { label: 'What you can build', intro: 'The rules that decide what is possible on your plot.' },
  kosten: { label: 'Costs and energy', intro: 'What the energy renovation rule means for you.' },
};

export const kennisEn: (KennisPage & { altPath?: string })[] = [
  {
    path: '/en/knowledge/building-permit-flanders',
    altPath: '/kennis/omgevingsvergunning-aanvragen',
    theme: 'vergunning',
    title: 'Building permit in Flanders: how it works',
    metaTitle: 'Building permit in Flanders explained | Key-Design Architects',
    description: 'How to get a building permit (omgevingsvergunning) in Flanders, Belgium: when you need one, how to apply online and what changed in 2026.',
    answer: 'In Flanders a building permit is called an omgevingsvergunning. You apply for it online through the Omgevingsloket, and your municipality decides. Small works may need only a notification or nothing at all. Since 1 March 2026 more facade, roof and interior works are exempt, as long as the volume does not grow.',
    sections: [
      { h2: 'Permit, notification or nothing?', list: [
        'A permit (omgevingsvergunning) for most new builds, extensions and larger changes.',
        'A notification (melding) for certain smaller works.',
        'No permit for a growing list of small works. Since 1 March 2026 this includes more facade, roof and interior works that do not increase the building volume.'] },
      { h2: 'How you apply', steps: [
        'Check on the Omgevingsloket whether your works need a permit, a notification or neither.',
        'Gather plans, photographs and a description of the works. An architect can prepare all of this.',
        'Submit the application online at the Omgevingsloket. In a few municipalities with language facilities the application is still on paper.',
        'The municipality checks completeness, may hold a public inquiry, and then decides.'] },
      { h2: 'What is different from other countries', p: ['The rules depend on the municipality and on the zoning of your plot as well as on national rules. Your plot may also sit in an allotment (verkaveling) with its own rules. A plan that is allowed in the next street can be refused in yours.'] },
    ],
    faq: [
      { q: 'Does my architect submit the application?', a: 'Yes. An architect usually prepares the file, submits it and follows it up with the municipality.' },
      { q: 'Can I apply in English?', a: 'The Omgevingsloket and the municipality work in Dutch. We handle the Dutch side and keep you informed in English.' },
    ],
    related: ['/en/knowledge/architect-required-belgium', '/en/knowledge/buying-house-flanders-unpermitted-work', '/en/knowledge/renovation-obligation-flanders'],
    cta: 'contact', ctaType: 'Building permit',
  },
  {
    path: '/en/knowledge/architect-required-belgium',
    altPath: '/kennis/omgevingsvergunning-zonder-architect',
    theme: 'vergunning',
    title: 'Do you need an architect in Belgium?',
    metaTitle: 'Is an architect required in Belgium? | Key-Design Architects',
    description: 'Is an architect mandatory for a building permit in Belgium? When the law requires one in Flanders, when it does not, and what changed in 2026.',
    answer: 'In Belgium the law requires an architect for most works that need a building permit, including new builds and most renovations. Some small works are exempt, and since 1 March 2026 more works need no permit at all. Permit-free does not mean architect-free: since 5 September 2026, exempt works that affect stability need an architect for design and supervision.',
    sections: [
      { h2: 'The general rule', p: ['Belgian law (the Architects Act of 1939) says that works needing a permit must be designed and followed up by a registered architect. In many other countries a homeowner can draw their own plans. In Belgium that is the exception.'] },
      { h2: 'What changed in 2026', p: ['Since 1 March 2026 more facade, roof and interior works that do not increase the volume are exempt from a permit. Since 5 September 2026 the exemption for works that affect stability only applies if an architect is appointed for both the design and the supervision of the works. Check this before you start any renovation.'] },
      { h2: 'Where an architect is practically unavoidable', p: ['In practice you need one for a habitable extension, an additional storey, an opening in a load-bearing wall or a terrace on a flat roof. For a permit-free non-habitable outbuilding or a light, freestanding veranda an architect is usually not required.'] },
      { h2: 'Why it is worth it even when optional', list: [
        'Contractors\' ten-year liability insurance normally covers only work that needed a permit.',
        'A structural change without a stability check is a real risk.',
        'A complete file avoids a refusal and extra delay.'] },
    ],
    faq: [
      { q: 'Can I draw the plans myself?', a: 'For most permit-required works no. For certain small works the law allows it. Ask us or your municipality first.' },
      { q: 'What does an architect cost?', a: 'It depends on the project. A first conversation tells you what to expect.' },
    ],
    related: ['/en/knowledge/building-permit-flanders', '/en/knowledge/renovation-obligation-flanders', '/en/knowledge/working-with-an-architect-in-flanders'],
    cta: 'contact', ctaType: 'Architect',
  },
  {
    path: '/en/knowledge/buying-house-flanders-unpermitted-work',
    altPath: '/regularisatie/verjaring-boete-afbreken',
    theme: 'regularisatie',
    title: 'Buying a house in Flanders with unpermitted work',
    metaTitle: 'Buying a house in Flanders without a permit | Key-Design Architects',
    description: 'Buying a house in Flanders with an extension or change that has no permit? What to check before you sign and how regularisation works.',
    answer: 'Many Flemish houses have extensions or changes that were never permitted. Before you sign, check the permit status with the municipality and ask for a planning certificate. An unpermitted part can often be regularised, but not always. Get the situation checked by an architect before you buy.',
    sections: [
      { h2: 'What to check before you buy', steps: [
        'Ask the seller for the permit history and the plans that were approved.',
        'Ask the municipality for the planning information on the plot and the permit status.',
        'Have the actual house compared with the approved plans. Extensions, verandas, attics and changed use are the usual differences.',
        'Check the energy label, because it triggers a separate renovation rule.'] },
      { h2: 'What are the consequences?', p: ['An unpermitted structure can lead to a fine, an order to restore the situation or, in extreme cases, demolition. Time limits exist for enforcement, but a structure that is no longer pursued is still not permitted. That matters when you sell, finance or renovate.', 'Buildings from before 22 April 1962 are always deemed permitted. For buildings between 1962 and the first zoning plan there is a presumption of a permit, unless the authority proves otherwise. You must be able to show when it was built and that it looked the same then.'] },
      { h2: 'Can it be regularised?', p: ['Often yes, if the structure fits the zoning and the local rules. Sometimes a part has to be adapted or removed. Checking this before you sign gives you a stronger position when negotiating the price.'] },
    ],
    faq: [
      { q: 'Does the notary check this?', a: 'The notary asks for planning information, but does not compare the building with the plans. That check is up to you.' },
      { q: 'Is this legal advice?', a: 'No. For the legal side, ask a lawyer. We check the technical and planning side.' },
    ],
    related: ['/en/regularisatie', '/en/knowledge/building-permit-flanders', '/en/knowledge/renovation-obligation-flanders'],
    cta: 'contact', ctaType: 'Regularisation',
  },
  {
    path: '/en/knowledge/renovation-obligation-flanders',
    altPath: '/kennis/renovatieverplichting',
    theme: 'kosten',
    title: 'Renovation obligation in Flanders: what buyers must do',
    metaTitle: 'Renovation obligation Flanders (EPC E and F) | Key-Design Architects',
    description: 'If you buy a home in Flanders with EPC label E or F you must renovate it to label D within 6 years. How the rule works and where to start.',
    answer: 'Since 1 January 2023, buyers in Flanders of a home with energy label E or F must renovate it to at least label D within 6 years after the notarial deed. You prove it with a new EPC. The rules can change, so check vlaanderen.be before you buy.',
    sections: [
      { h2: 'How the rule works', list: [
        'It applies to houses and apartments with EPC label E or F at the time of the deed.',
        'The target is label D or better.',
        'The deadline is 6 years after the deed. It was recently extended from 5 years.',
        'You prove it with a new EPC from a certified energy expert.'] },
      { h2: 'When it does not apply', list: [
        'Inheritance.',
        'Demolition within 6 years of the purchase.',
        'Protected heritage buildings.'] },
      { h2: 'Where to start', steps: [
        'Ask for the EPC before you make an offer.',
        'Have the house assessed for what it takes to reach label D.',
        'Plan the works in a logical order so that you do not redo anything.',
        'Look into the renovation loan with interest grant that exists for buyers of E and F homes.'] },
    ],
    faq: [
      { q: 'What if I miss the deadline?', a: 'A fine is possible and a new deadline is set. The obligation does not disappear.' },
      { q: 'Do I need a permit for energy works?', a: 'Often not, since more works became permit-free in 2026, but structural changes and extensions still need one. Ask first.' },
    ],
    related: ['/en/knowledge/building-permit-flanders', '/en/knowledge/architect-required-belgium', '/en/knowledge/working-with-an-architect-in-flanders'],
    cta: 'contact', ctaType: 'Renovation',
  },
  {
    path: '/en/knowledge/working-with-an-architect-in-flanders',
    theme: 'kosten',
    title: 'Working with an English-speaking architect in Antwerp, Mechelen and Lier',
    metaTitle: 'English-speaking architect in Antwerp | Key-Design Architects',
    description: 'How an architect works in Flanders, step by step: feasibility, design, permit, tender and site supervision. For English-speaking clients.',
    answer: 'A Flemish architect guides you from feasibility to handover: study, design, permit file, contractor prices and site supervision. We handle the Dutch paperwork and keep you informed in English. We work in Antwerp, the Kempen, Mechelen and Lier.',
    sections: [
      { h2: 'What the steps look like', steps: [
        'Feasibility: what is allowed on your plot and what it could cost.',
        'Design: sketches and a plan that fits your life and your budget.',
        'Permit: the file, the submission and the follow-up with the municipality.',
        'Technical plans and tender: contractor prices that you can compare.',
        'Site supervision and handover: someone on your side while the work is done.'] },
      { h2: 'Why it helps to have a local architect', p: ['Local rules differ between municipalities. An architect who works in your area already knows how they apply them, which saves time and avoids refusals.'] },
      { h2: 'How fees work', p: ['Fees are usually a percentage of the construction cost, a fixed fee for a defined task, or an hourly rate for advice. Ask for a written offer that shows what is included.'] },
    ],
    faq: [
      { q: 'Can we meet by video call?', a: 'Yes. A first call is a good way to see what is possible.' },
      { q: 'Do you only do big projects?', a: 'No. We also help with feasibility studies, regularisation and renovations.' },
    ],
    related: ['/en/knowledge/architect-required-belgium', '/en/knowledge/building-permit-flanders', '/en/knowledge/buying-house-flanders-unpermitted-work'],
    cta: 'contact', ctaType: 'Architect',
  },
];

export const bySlugPathEn = (path: string) => kennisEn.find((k) => k.path === path);
