// Municipality pages. Every text here is real: facts about the municipality that are
// generally known, plus Kenneth's own, true local links (`personal`). Nothing in this
// file claims projects, clients or experience that do not exist. Adding a municipality
// means adding one entry with its own NL and EN text; the quality gate in regions.ts
// refuses to build entries that are thin or copied.
import type { Region, RegionGroup, RegionFaq } from './regions';

const faqNl = (place: string): RegionFaq[] => [
  { q: 'Heb ik een architect nodig voor mijn bouw- of verbouwproject?', a: 'Voor de meeste bouw- en verbouwwerken waarvoor een vergunning nodig is, is in Vlaanderen een architect verplicht. Voor kleine werken bestaan er uitzonderingen. We bekijken dat graag samen met u, vrijblijvend.' },
  { q: `Werkt u ook in ${place}?`, a: `Ja. Ons kantoor zit in Lier en ${place} valt binnen ons werkgebied. Neem contact op voor een vrijblijvend kennismakingsgesprek.` },
  { q: 'Hoe begin ik?', a: 'Met een kennismakingsgesprek. We bekijken uw idee, het perceel of de woning, en wat stedenbouwkundig en technisch mogelijk is, nog voor er een ontwerp op papier staat.' },
];
const faqEn = (place: string): RegionFaq[] => [
  { q: 'Do I need an architect for my building or renovation project?', a: 'For most building and renovation works that require a permit, an architect is mandatory in Flanders. Exceptions exist for small works. We are happy to check this together with you, without obligation.' },
  { q: `Do you also work in ${place}?`, a: `Yes. Our office is in Lier and ${place} falls within our working area. Get in touch for a no-obligation introductory conversation.` },
  { q: 'How do I get started?', a: 'With an introductory conversation. We look at your idea, the plot or the house, and what is possible in planning and technical terms, before a design is put on paper.' },
];

type Txt = { intro: string; a: [string, string]; b: [string, string] };
function m(slug: string, name: string, group: RegionGroup, nl: Txt, en: Txt, personal?: { nl: string; en: string }, enName = name): Region {
  const first = (s: string) => s.split('. ')[0].replace(/\.$/, '') + '.';
  return {
    slug, name, group, placeType: 'City', personal,
    nl: {
      label: name,
      title: `Architect ${name} | Key-Design Architects, Kenneth Keyaerts`,
      description: `${first(nl.intro)} Key-Design Architects, Lier.`,
      h1: `Architect in ${name}`,
      intro: nl.intro,
      localTitle: `Bouwen en verbouwen in ${name}`,
      local: [{ h: nl.a[0], p: nl.a[1] }, { h: nl.b[0], p: nl.b[1] }],
      faq: faqNl(name),
    },
    en: {
      label: enName,
      title: `Architect in ${enName} | Key-Design Architects, Kenneth Keyaerts`,
      description: `${first(en.intro)} Key-Design Architects, Lier.`,
      h1: `Architect in ${enName}`,
      intro: en.intro,
      localTitle: `Building and renovating in ${enName}`,
      local: [{ h: en.a[0], p: en.a[1] }, { h: en.b[0], p: en.b[1] }],
      faq: faqEn(enName),
    },
  };
}

export const municipalityRegions: Region[] = [
  // ---------- Rond Lier ----------
  m('berlaar', 'Berlaar', 'thuis',
    { intro: 'Berlaar ligt aan de Nete, op een tiental minuten van ons kantoor in Lier. Kenneth Keyaerts begeleidt er bouw- en verbouwprojecten van het eerste idee tot de oplevering.',
      a: ['Aan de Nete', 'Berlaar ligt in de vallei van de Nete, tussen Lier en Heist-op-den-Berg. Bij bouwen in een vallei kunnen de bodem en de nabijheid van water mee bepalen wat en waar u kunt bouwen, en dat onderzoeken we vooraf.'],
      b: ['Dichtbij en vertrouwd', 'Omdat Berlaar zo dicht bij Lier ligt, zijn plaatsbezoeken en overleg met het gemeentebestuur snel geregeld. Dat houdt de opvolging van uw dossier kort en persoonlijk.'] },
    { intro: 'Berlaar lies on the river Nete, about ten minutes from our office in Lier. Kenneth Keyaerts guides building and renovation projects there from the first idea to handover.',
      a: ['On the Nete', 'Berlaar lies in the Nete valley, between Lier and Heist-op-den-Berg. When building in a valley, the soil and the proximity of water can help determine what and where you can build, and we investigate that in advance.'],
      b: ['Close and familiar', 'Because Berlaar is so close to Lier, site visits and talks with the municipality are quickly arranged. That keeps the follow-up of your file short and personal.'] }),

  m('nijlen', 'Nijlen', 'thuis',
    { intro: 'Nijlen ligt op ongeveer tien minuten van Lier en omvat ook Kessel en Bevel. Kenneth Keyaerts begeleidt er verbouwingen en nieuwbouw, van haalbaarheid tot oplevering.',
      a: ['Drie dorpskernen', 'Nijlen bestaat uit Nijlen, Bevel en Kessel. Elke kern heeft een eigen karakter, en dat bepaalt mee wat er in een bepaalde straat stedenbouwkundig mogelijk is. Dat gaan we vooraf na.'],
      b: ['Renoveren met oog voor wat er staat', 'Veel woningen in kleinere gemeenten zoals Nijlen zijn al een tijd oud. We bekijken wat een grondige renovatie kan opleveren voor isolatie, indeling en licht voor we aan nieuwbouw denken.'] },
    { intro: 'Nijlen lies about ten minutes from Lier and also includes Kessel and Bevel. Kenneth Keyaerts guides renovations and new builds there, from feasibility to handover.',
      a: ['Three village centres', 'Nijlen consists of Nijlen, Bevel and Kessel. Each centre has its own character, which helps determine what is possible in a given street in planning terms. We check that in advance.'],
      b: ['Renovating with respect for what stands', 'Many homes in smaller municipalities like Nijlen have been around for a while. We look at what a thorough renovation can deliver in insulation, layout and light before we think of a new build.'] }),

  m('duffel', 'Duffel', 'thuis',
    { intro: 'Duffel ligt tussen Lier en Mechelen, aan de Nete. Kenneth Keyaerts ontwerpt en begeleidt er verbouwingen, uitbreidingen en nieuwbouw, als architect uit de buurt.',
      a: ['Tussen Lier en Mechelen', 'Duffel ligt centraal tussen twee steden, wat het een praktische woonplaats maakt. Daardoor gaan veel projecten er over de renovatie van een bestaande woning of over een uitbreiding op een bestaand perceel.'],
      b: ['Een architect uit de buurt', 'Wie in Duffel een architect zoekt, vindt in Kenneth iemand die op korte afstand werkt. Plaatsbezoeken, overleg met de gemeente en werfopvolging zijn zo snel geregeld.'] },
    { intro: 'Duffel lies between Lier and Mechelen, on the river Nete. Kenneth Keyaerts designs and guides renovations, extensions and new builds there, as an architect from the neighbourhood.',
      a: ['Between Lier and Mechelen', 'Duffel lies centrally between two cities, which makes it a practical place to live. As a result, many projects there concern the renovation of an existing home or an extension on an existing plot.'],
      b: ['An architect from nearby', 'Anyone looking for an architect in Duffel finds in Kenneth someone who works close by. Site visits, talks with the municipality and site supervision are quickly arranged.'] }),

  m('rumst', 'Rumst', 'thuis',
    { intro: 'Rumst ligt in de Rupelstreek, een streek die lang bekend stond om haar baksteenindustrie. Kenneth Keyaerts kent Rumst uit eigen ervaring en begeleidt er bouw- en verbouwprojecten.',
      a: ['Rupelstreek en bakstenen verleden', 'In Rumst en omgeving zijn veel gebouwen opgetrokken uit baksteen. Dat verleden is nog zichtbaar in het straatbeeld en geeft een materiaal en sfeer om mee te werken bij een verbouwing of aanbouw.'],
      b: ['Ervaring op een groot project', 'Kenneth werkte eerder in Rumst mee aan een grootschalig project, als uitvoerend projectarchitect voor een vorige werkgever. Die ervaring met bouwplaatsen, planning en coördinatie neemt hij mee naar elk project.'] },
    { intro: 'Rumst lies in the Rupel region, an area long known for its brick industry. Kenneth Keyaerts knows Rumst from his own experience and guides building and renovation projects there.',
      a: ['The Rupel region and its brick past', 'In Rumst and its surroundings many buildings are made of brick. That past is still visible in the streetscape and offers a material and atmosphere to work with in a renovation or extension.'],
      b: ['Experience on a large project', 'Kenneth previously worked on a large-scale project in Rumst, as executing project architect for a former employer. He brings that experience of building sites, planning and coordination to every project.'] }),

  m('sint-katelijne-waver', 'Sint-Katelijne-Waver', 'thuis',
    { intro: 'Sint-Katelijne-Waver grenst aan Mechelen en ligt op korte afstand van Lier. Kenneth Keyaerts begeleidt er bouw- en verbouwprojecten van woningen, van het eerste idee tot de oplevering.',
      a: ['Tussen stad en groen', 'De gemeente ligt tegen Mechelen aan en combineert woonwijken met open ruimte. Bij uitbreidingen of nieuwbouw is het belangrijk om vooraf te onderzoeken wat de omgeving en de bestemming van het perceel toelaten.'],
      b: ['Kleine afstand, korte lijnen', 'Vanuit Lier is Sint-Katelijne-Waver snel bereikbaar. Plaatsbezoeken, opmetingen en afspraken op de werf zijn daardoor eenvoudig te plannen.'] },
    { intro: 'Sint-Katelijne-Waver borders Mechelen and lies a short distance from Lier. Kenneth Keyaerts guides building and renovation projects for homes there, from the first idea to handover.',
      a: ['Between city and green', 'The municipality lies next to Mechelen and combines residential areas with open space. For extensions or new builds it is important to investigate beforehand what the surroundings and the zoning of the plot allow.'],
      b: ['Short distance, short lines', 'From Lier, Sint-Katelijne-Waver is quickly reached. Site visits, surveys and appointments on site are therefore easy to plan.'] }),

  m('heist-op-den-berg', 'Heist-op-den-Berg', 'thuis',
    { intro: 'Heist-op-den-Berg ligt in de Zuiderkempen, vlak bij Lier. Kenneth Keyaerts begeleidt er bouw- en verbouwprojecten van woningen, van het eerste idee tot de oplevering.',
      a: ['Meerdere dorpen, één gemeente', 'De gemeente bestaat uit meerdere dorpen, zoals Itegem, Booischot en Hallaar. Wat stedenbouwkundig en bouwtechnisch kan, verschilt per kern en per perceel, en dat onderzoeken we steeds eerst.'],
      b: ['Wonen in de Zuiderkempen', 'Met bos en groen in de omgeving is Heist-op-den-Berg een rustige woonplaats. Bij een ontwerp spelen de inplanting op het perceel, het zonlicht en de verhouding tussen huis en tuin een grote rol.'] },
    { intro: 'Heist-op-den-Berg lies in the southern Kempen, right next to Lier. Kenneth Keyaerts guides building and renovation projects for homes there, from the first idea to handover.',
      a: ['Several villages, one municipality', 'The municipality consists of several villages, such as Itegem, Booischot and Hallaar. What is possible in planning and technical terms differs per village and per plot, and we always investigate that first.'],
      b: ['Living in the southern Kempen', 'With woods and greenery in the area, Heist-op-den-Berg is a quiet place to live. In a design, the placement on the plot, sunlight and the relation between house and garden play a big role.'] }),

  m('willebroek', 'Willebroek', 'thuis',
    { intro: 'Willebroek ligt aan het kanaal Brussel-Schelde, tussen Mechelen en Antwerpen. Kenneth Keyaerts begeleidt er bouw- en verbouwprojecten van woningen.',
      a: ['Een gemeente aan het kanaal', 'Het kanaal Brussel-Schelde loopt door Willebroek en heeft de gemeente mee gevormd. In de buurt van water en oudere industriële sites vragen bodem en bestemming extra aandacht, en die controleren we vooraf.'],
      b: ['Woningen met een geschiedenis', 'In oudere straten staan woningen die aan een nieuwe indeling, betere isolatie of een uitbreiding toe zijn. We bekijken eerst wat u kunt behouden en wat beter vervangen wordt.'] },
    { intro: 'Willebroek lies on the Brussels-Scheldt canal, between Mechelen and Antwerp. Kenneth Keyaerts guides building and renovation projects for homes there.',
      a: ['A municipality on the canal', 'The Brussels-Scheldt canal runs through Willebroek and has helped shape the municipality. Near water and older industrial sites, the soil and zoning need extra attention, and we check those in advance.'],
      b: ['Homes with a history', 'In older streets there are homes that are ready for a new layout, better insulation or an extension. We first look at what you can keep and what is better replaced.'] }),

  // ---------- Antwerpse rand ----------
  m('schilde', 'Schilde', 'antwerpse-rand',
    { intro: 'Schilde is een groene gemeente in het oosten van de provincie Antwerpen, met veel bos en ruime woonpercelen. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Bos, groen en ruime percelen', 'In Schilde liggen veel woningen in een bosrijke omgeving. Bij een ontwerp op zo een perceel draait het om inplanting, oriëntatie op de zon, privacy en de verhouding tussen huis en tuin.'],
      b: ['Kasteel van \'s-Gravenwezel', 'Op het grondgebied van Schilde ligt het kasteeldomein van \'s-Gravenwezel. Waar erfgoed en parkomgeving meespelen liggen straten gevoeliger, en dat onderzoeken we bij een ontwerp vooraf.'] },
    { intro: 'Schilde is a green municipality in the east of the province of Antwerp, with plenty of woodland and generous residential plots. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['Woods, greenery and generous plots', 'In Schilde many homes lie in a wooded setting. A design on such a plot is about placement, orientation to the sun, privacy and the relation between house and garden.'],
      b: ["'s-Gravenwezel castle", "Within Schilde lies the castle estate of 's-Gravenwezel. Where heritage and parkland play a part, streets are more sensitive, and we investigate that in advance of a design."] }),

  m('brasschaat', 'Brasschaat', 'antwerpse-rand',
    { intro: 'Brasschaat ligt aan de noordrand van Antwerpen en staat bekend om zijn bosrijke woonwijken. Kenneth Keyaerts begeleidt er woningprojecten van haalbaarheid tot oplevering.',
      a: ['Bos en villawijken', 'Veel wijken in Brasschaat zijn groen en bosrijk. Bij een nieuwe woning of verbouwing zoeken we een goede inplanting tussen de bomen, met respect voor wat er al staat.'],
      b: ['Naast de stad', 'Brasschaat grenst aan Antwerpen, waardoor stedelijke en landelijke situaties naast elkaar bestaan. Een goed vooronderzoek voorkomt dat uw project later vastloopt.'] },
    { intro: 'Brasschaat lies on the northern edge of Antwerp and is known for its wooded residential areas. Kenneth Keyaerts guides home projects there from feasibility to handover.',
      a: ['Woods and villa districts', 'Many neighbourhoods in Brasschaat are green and wooded. For a new home or renovation we look for a good placement among the trees, with respect for what is already there.'],
      b: ['Next to the city', 'Brasschaat borders Antwerp, so urban and rural situations exist side by side. A good preliminary study prevents your project from getting stuck later.'] }),

  m('kapellen', 'Kapellen', 'antwerpse-rand',
    { intro: 'Kapellen ligt aan de noordrand van Antwerpen, in de buurt van de Kalmthoutse Heide. Kenneth Keyaerts begeleidt er bouw- en verbouwprojecten van woningen.',
      a: ['Dicht bij de natuur', 'Het Kapellenbos en de heide in de buurt geven de gemeente een groen karakter. Op sommige percelen gelden daardoor bijzondere regels voor natuur en bomen, en die gaan we vooraf na.'],
      b: ['Woningen uit verschillende periodes', 'In Kapellen staan woningen uit zeer uiteenlopende bouwperiodes. Elke periode vraagt een andere aanpak voor isolatie, stabiliteit en indeling, en we kijken eerst wat de bestaande woning nog aankan.'] },
    { intro: 'Kapellen lies on the northern edge of Antwerp, near the Kalmthoutse Heide. Kenneth Keyaerts guides building and renovation projects for homes there.',
      a: ['Close to nature', 'The Kapellenbos and the heath nearby give the municipality a green character. On some plots special rules for nature and trees therefore apply, and we check those in advance.'],
      b: ['Homes from different periods', 'In Kapellen there are homes from very different building periods. Each period calls for a different approach to insulation, stability and layout, and we first look at what the existing home can still handle.'] }),

  m('hove', 'Hove', 'antwerpse-rand',
    { intro: 'Hove is een kleine, rustige gemeente ten zuiden van Antwerpen, tussen Edegem, Boechout en Mortsel. Kenneth Keyaerts begeleidt er verbouwingen en nieuwbouw van woningen.',
      a: ['Klein en woonlijk', 'Hove is een kleine gemeente met veel residentiële straten. Een project draait er vaak om zorgvuldig inpassen in een bestaand straatbeeld, met oog voor de buren.'],
      b: ['Vlot bereikbaar', 'Hove ligt vlak bij Antwerpen en is vanuit Lier vlot bereikbaar voor plaatsbezoeken en overleg.'] },
    { intro: 'Hove is a small, quiet municipality south of Antwerp, between Edegem, Boechout and Mortsel. Kenneth Keyaerts guides renovations and new builds of homes there.',
      a: ['Small and residential', 'Hove is a small municipality with many residential streets. A project there is often about fitting carefully into an existing streetscape, with attention for the neighbours.'],
      b: ['Easy to reach', 'Hove lies right next to Antwerp and is easily reached from Lier for site visits and consultation.'] }),

  m('boechout', 'Boechout', 'antwerpse-rand',
    { intro: 'Boechout ligt tussen Antwerpen en Lier, en omvat ook Vremde. Kenneth Keyaerts begeleidt er woningprojecten van de eerste schets tot de oplevering.',
      a: ['Tussen Antwerpen en Lier', 'Boechout ligt op weg tussen Antwerpen en Lier en dus niet ver van ons kantoor. Plaatsbezoeken en overleg met de gemeente zijn snel te regelen.'],
      b: ['Boechout en Vremde', 'De twee kernen hebben een ander karakter. Wat u op een perceel mag bouwen verschilt van straat tot straat, en dat onderzoeken we voor het eerste ontwerp.'] },
    { intro: 'Boechout lies between Antwerp and Lier, and also includes Vremde. Kenneth Keyaerts guides home projects there from the first sketch to handover.',
      a: ['Between Antwerp and Lier', 'Boechout lies on the way between Antwerp and Lier, and so not far from our office. Site visits and talks with the municipality are quickly arranged.'],
      b: ['Boechout and Vremde', 'The two centres have a different character. What you may build on a plot differs from street to street, and we investigate that before the first design.'] }),

  m('ranst', 'Ranst', 'antwerpse-rand',
    { intro: 'Ranst bestaat uit Broechem, Emblem, Oelegem en Ranst zelf, en ligt ten oosten van Antwerpen. Kenneth Keyaerts begeleidt er bouw- en verbouwprojecten van woningen.',
      a: ['Vier dorpen, vier karakters', 'Elk van de vier dorpen heeft een eigen sfeer, van landelijk tot residentieel. Een ontwerp moet daarbij aansluiten, in schaal en materiaalkeuze.'],
      b: ['Landelijk wonen, dicht bij de stad', 'Ranst combineert open ruimte met een korte afstand tot Antwerpen en Lier. Voor wie uitbreidt of nieuw bouwt, speelt de inplanting op het perceel daardoor een grote rol.'] },
    { intro: 'Ranst consists of Broechem, Emblem, Oelegem and Ranst itself, and lies east of Antwerp. Kenneth Keyaerts guides building and renovation projects for homes there.',
      a: ['Four villages, four characters', 'Each of the four villages has its own atmosphere, from rural to residential. A design has to fit in with that, in scale and choice of materials.'],
      b: ['Rural living, close to the city', 'Ranst combines open space with a short distance to Antwerp and Lier. For those extending or building new, the placement on the plot therefore plays a big role.'] }),

  m('schoten', 'Schoten', 'antwerpse-rand',
    { intro: 'Schoten ligt aan de noordrand van Antwerpen en is vooral residentieel. Kenneth Keyaerts begeleidt er bouw- en verbouwprojecten van woningen, van haalbaarheid tot oplevering.',
      a: ['Residentieel en dicht bij de stad', 'In Schoten wonen veel mensen vlak bij Antwerpen, in straten met rijwoningen, halfopen woningen en villa\'s. Een verbouwing moet er vaak rekening houden met buren en het bestaande straatbeeld.'],
      b: ['Verbouwen en uitbreiden', 'Veel projecten in Schoten gaan over een uitbreiding of een grondige renovatie van een bestaande woning. We kijken eerst wat de bestaande bouw nog aankan.'] },
    { intro: 'Schoten lies on the northern edge of Antwerp and is mostly residential. Kenneth Keyaerts guides building and renovation projects for homes there, from feasibility to handover.',
      a: ['Residential and close to the city', 'In Schoten many people live right next to Antwerp, in streets of terraced, semi-detached and detached homes. A renovation often has to take neighbours and the existing streetscape into account.'],
      b: ['Renovating and extending', 'Many projects in Schoten are about an extension or a thorough renovation of an existing home. We first look at what the existing building can still handle.'] }),

  // ---------- Leuven, Hageland, Vlaamse Rand ----------
  m('leuven', 'Leuven', 'rand-leuven',
    { intro: 'Leuven is een historische universiteitsstad met een compact centrum. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Een stad met erfgoed', 'Het centrum van Leuven heeft veel beschermd erfgoed, met onder meer het stadhuis en het Groot Begijnhof. Verbouwen in een historische omgeving vraagt een zorgvuldig onderzoek vooraf.'],
      b: ['Studentenstad en woonstad', 'De universiteit zorgt voor een gemengde stad met studentenhuizen, gezinswoningen en kleinere rijhuizen. Elk type vraagt een andere aanpak bij een verbouwing.'] },
    { intro: 'Leuven is a historic university city with a compact centre. Kenneth Keyaerts guides home projects in Leuven, from feasibility to handover.',
      a: ['A city with heritage', 'The centre of Leuven has a lot of protected heritage, including the town hall and the Groot Begijnhof. Renovating in a historic setting calls for careful research in advance.'],
      b: ['Student city and home city', 'The university makes for a mixed city with student houses, family homes and smaller terraced houses. Each type calls for a different approach in a renovation.'] }),

  m('oud-heverlee', 'Oud-Heverlee', 'rand-leuven',
    { intro: 'Oud-Heverlee ligt tegen Leuven aan en grenst aan het Meerdaalwoud en het Heverleebos. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Naast het bos', 'Het Heverleebos en het Meerdaalwoud liggen vlakbij. Een woning in zo een omgeving vraagt een sobere inplanting en materialen die in het landschap passen, en soms gelden extra regels voor bos en natuur.'],
      b: ['Dorpskernen rond Leuven', 'Oud-Heverlee bestaat uit meerdere kernen, zoals Blanden, Haasrode, Sint-Joris-Weert en Vaalbeek. Elke kern heeft een eigen schaal waarbij een ontwerp moet aansluiten.'] },
    { intro: 'Oud-Heverlee lies right next to Leuven and borders the Meerdaalwoud and the Heverleebos. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['Next to the forest', 'The Heverleebos and the Meerdaalwoud are close by. A home in such a setting calls for a restrained placement and materials that fit the landscape, and sometimes extra rules for woods and nature apply.'],
      b: ['Village centres around Leuven', 'Oud-Heverlee consists of several centres, such as Blanden, Haasrode, Sint-Joris-Weert and Vaalbeek. Each centre has its own scale that a design needs to fit.'] }),

  m('bierbeek', 'Bierbeek', 'rand-leuven',
    { intro: 'Bierbeek ligt ten zuidoosten van Leuven, in een landelijke omgeving. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Landelijk, vlak bij Leuven', 'Bierbeek combineert een landelijk karakter met de nabijheid van Leuven. Veel woningen liggen in een open omgeving, waar landschap en oriëntatie mee het ontwerp bepalen.'],
      b: ['Meerdere dorpen', 'Naast Bierbeek zelf horen ook Lovenjoel, Opvelp en Korbeek-Lo bij de gemeente. Wat er in elk dorp stedenbouwkundig kan, kan verschillen, en dat nemen we mee in het vooronderzoek.'] },
    { intro: 'Bierbeek lies southeast of Leuven, in a rural setting. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['Rural, right next to Leuven', 'Bierbeek combines a rural character with the proximity of Leuven. Many homes lie in an open setting, where landscape and orientation help determine the design.'],
      b: ['Several villages', 'Besides Bierbeek itself, Lovenjoel, Opvelp and Korbeek-Lo also belong to the municipality. What is possible in planning terms can differ in each village, and we include that in the preliminary study.'] }),

  m('keerbergen', 'Keerbergen', 'rand-leuven',
    { intro: 'Keerbergen is een bosrijke gemeente tussen Mechelen en Leuven. Kenneth Keyaerts werkte er drie jaar en kent de gemeente en haar omgeving goed.',
      a: ['Wonen in het bos', 'Keerbergen staat bekend om zijn bossen en villawijken. Bij nieuwbouw of verbouwing draait het om inplanting tussen de bomen, zonlicht en privacy.'],
      b: ['Een gemeente die we kennen', 'Doordat Kenneth er drie jaar werkte, kent hij de gemeente en haar omgeving uit eigen ervaring. Dat helpt om snel in te schatten wat op een bepaald perceel realistisch is.'] },
    { intro: 'Keerbergen is a wooded municipality between Mechelen and Leuven. Kenneth Keyaerts worked there for three years and knows the municipality and its surroundings well.',
      a: ['Living in the woods', 'Keerbergen is known for its woods and villa districts. For a new build or renovation it is about placement among the trees, sunlight and privacy.'],
      b: ['A municipality we know', 'Because Kenneth worked there for three years, he knows the municipality and its surroundings from his own experience. That helps to quickly judge what is realistic on a given plot.'] },
    { nl: 'Kenneth werkte drie jaar in Keerbergen.', en: 'Kenneth worked in Keerbergen for three years.' }),

  m('zaventem', 'Zaventem', 'rand-leuven',
    { intro: 'Zaventem ligt aan de oostrand van Brussel en omvat onder meer Sterrebeek, Nossegem en Sint-Stevens-Woluwe. Kenneth Keyaerts begeleidt er woningprojecten in het Nederlands, van haalbaarheid tot oplevering.',
      a: ['Luchthavenregio en woonkernen', 'Naast de luchthaven en de bedrijvigheid bestaat Zaventem uit woonkernen zoals Sterrebeek, Nossegem en Sint-Stevens-Woluwe. In die kernen draait het vaak om renovatie van bestaande woningen.'],
      b: ['Een dichtbebouwde rand', 'Dicht bij Brussel is de ruimte schaars en liggen woningen vaak dicht bij elkaar. Zorgvuldig ontwerpen, met oog voor buren, licht en privacy, is daar extra belangrijk.'] },
    { intro: 'Zaventem lies on the eastern edge of Brussels and includes Sterrebeek, Nossegem and Sint-Stevens-Woluwe, among others. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['Airport region and residential centres', 'Besides the airport and business activity, Zaventem consists of residential centres such as Sterrebeek, Nossegem and Sint-Stevens-Woluwe. In those centres it is often about renovating existing homes.'],
      b: ['A densely built edge', 'Close to Brussels space is scarce and homes often stand close together. Careful design, with attention for neighbours, light and privacy, is extra important there.'] }),

  m('kortenberg', 'Kortenberg', 'rand-leuven',
    { intro: 'Kortenberg ligt tussen Leuven en Brussel en omvat onder meer Everberg, Erps-Kwerps en Meerbeek. Kenneth Keyaerts begeleidt er woningprojecten van haalbaarheid tot oplevering.',
      a: ['Historisch Kortenberg', 'Kortenberg staat bekend om het Charter van Kortenberg uit 1312, een stuk geschiedenis van Brabant. De gemeente heeft nog steeds oudere kernen waarin verbouwen zorgvuldig moet gebeuren.'],
      b: ['Tussen twee steden', 'Door de ligging tussen Leuven en Brussel is Kortenberg een praktische woonplaats voor wie in de buurt werkt. Voor renovaties en uitbreidingen is die ligging een gegeven om rekening mee te houden.'] },
    { intro: 'Kortenberg lies between Leuven and Brussels and includes Everberg, Erps-Kwerps and Meerbeek, among others. Kenneth Keyaerts guides home projects there from feasibility to handover.',
      a: ['Historic Kortenberg', 'Kortenberg is known for the Charter of Kortenberg of 1312, a piece of Brabant history. The municipality still has older centres in which renovating must be done carefully.'],
      b: ['Between two cities', 'Because of its position between Leuven and Brussels, Kortenberg is a practical place to live for those working nearby. For renovations and extensions that location is something to take into account.'] }),

  m('tervuren', 'Tervuren', 'rand-leuven',
    { intro: 'Tervuren staat bekend om zijn park, het Zoniënwoud en het Afrikamuseum. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Park en Zoniënwoud', 'Tervuren ligt tegen het Zoniënwoud aan, met het grote park en het Afrikamuseum als bekendste plekken. In zo een groene, beschermde omgeving kunnen bij bouwen en verbouwen extra regels gelden.'],
      b: ['Villa\'s en dorpskern', 'In Tervuren staan zowel oudere woningen in de dorpskern als vrijstaande woningen op ruimere percelen. Een goed ontwerp stemt schaal, materialen en groen op elkaar af.'] },
    { intro: 'Tervuren is known for its park, the Sonian Forest and the Africa Museum. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['Park and Sonian Forest', 'Tervuren lies against the Sonian Forest, with the large park and the Africa Museum as best-known places. In such a green, protected setting extra rules can apply to building and renovating.'],
      b: ['Villas and village centre', 'In Tervuren there are both older homes in the village centre and detached homes on larger plots. A good design matches scale, materials and greenery to each other.'] }),

  m('bertem', 'Bertem', 'rand-leuven',
    { intro: 'Bertem ligt tussen Leuven en Brussel, in een groene omgeving. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Groene rand tussen twee steden', 'Bertem combineert landelijke dorpen met een korte afstand tot Leuven en Brussel. Veel woningen liggen aan landelijke wegen, en inplanting en toegang bepalen er mee wat mogelijk is.'],
      b: ['Renoveren en uitbreiden', 'Voor oudere woningen in Bertem is energetische renovatie vaak het eerste doel. We starten met te bekijken wat de bestaande woning nog aankan, voor we aan een uitbreiding denken.'] },
    { intro: 'Bertem lies between Leuven and Brussels, in a green setting. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['Green edge between two cities', 'Bertem combines rural villages with a short distance to Leuven and Brussels. Many homes lie on rural roads, and placement and access help determine what is possible.'],
      b: ['Renovating and extending', 'For older homes in Bertem, energy renovation is often the first goal. We start by looking at what the existing home can still handle, before we think of an extension.'] }),

  // ---------- Kempen en Limburg ----------
  m('herentals', 'Herentals', 'kempen',
    { intro: 'Herentals is een Kempense stad aan de Kleine Nete en het Albertkanaal. Kenneth Keyaerts begeleidt er verbouwingen en nieuwbouw van woningen, van haalbaarheid tot oplevering.',
      a: ['Een stad in de Kempen', 'Herentals heeft een eigen stadscentrum met oudere woningen en daarrond ruimere woonwijken. Dat levert uiteenlopende projecten op, van stadsrenovatie tot nieuwbouw op een ruimer perceel.'],
      b: ['Vlot bereikbaar vanuit Lier', 'Herentals ligt in de Kempen en is vanuit Lier vlot bereikbaar voor plaatsbezoeken en overleg.'] },
    { intro: 'Herentals is a Kempen town on the Kleine Nete and the Albert Canal. Kenneth Keyaerts guides renovations and new builds of homes there, from feasibility to handover.',
      a: ['A town in the Kempen', 'Herentals has its own town centre with older homes and, around it, more spacious residential areas. That leads to varied projects, from town renovation to new builds on a larger plot.'],
      b: ['Easy to reach from Lier', 'Herentals lies in the Kempen and is easily reached from Lier for site visits and consultation.'] }),

  m('geel', 'Geel', 'kempen',
    { intro: 'Geel is een grote Kempense gemeente met een eigen geschiedenis rond Sint-Dimpna. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Een uitgestrekte gemeente', 'Geel is uitgestrekt en heeft naast het centrum veel landelijke deelgemeenten en verspreide woningen. Bij elke locatie moeten we nagaan welke bestemming en regels gelden.'],
      b: ['Stadskern en buitengebied', 'Rond het centrum staan veel oudere woningen die in aanmerking komen voor renovatie, terwijl in de buitengebieden ruimere kavels liggen die meer ontwerpvrijheid geven.'] },
    { intro: 'Geel is a large Kempen municipality with its own history around Saint Dymphna. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['A sprawling municipality', 'Geel is extensive and has, besides the centre, many rural districts and scattered homes. For each location we have to check which zoning and rules apply.'],
      b: ['Town centre and countryside', 'Around the centre there are many older homes that qualify for renovation, while in the outlying areas there are larger plots that give more design freedom.'] }),

  m('mol', 'Mol', 'kempen',
    { intro: 'Mol ligt in de Antwerpse Kempen en staat bekend om zijn bossen, vennen en het Zilvermeer. Kenneth Keyaerts begeleidt er woningprojecten, van haalbaarheid tot oplevering.',
      a: ['Zandgronden en groen', 'Mol ligt op de Kempische zandgronden, met veel bos en water in de omgeving. Dat geeft een mooie woonomgeving en vraagt aandacht voor bodem, grondwater en bomen bij het ontwerp.'],
      b: ['Verder weg, wel bereikbaar', 'Mol ligt verder van Lier dan onze kernregio, maar blijft bereikbaar voor plaatsbezoeken. We maken bij de start duidelijke afspraken over de planning.'] },
    { intro: 'Mol lies in the Antwerp Kempen and is known for its woods, fens and the Zilvermeer. Kenneth Keyaerts guides home projects there, from feasibility to handover.',
      a: ['Sandy soil and greenery', 'Mol lies on the sandy soils of the Kempen, with plenty of woods and water around. That gives a beautiful living environment and calls for attention to soil, groundwater and trees in the design.'],
      b: ['Further away, still reachable', 'Mol lies further from Lier than our core area, but remains reachable for site visits. At the start we make clear agreements about the planning.'] }),
];
