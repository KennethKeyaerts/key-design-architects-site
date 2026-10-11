// Knowledge pages (answers to the questions Flemish home owners actually search for).
// Every page follows the same shape so Google and readers find the answer fast:
//   h1  ->  short direct answer  ->  sections  ->  FAQ  ->  one call to action.
// Edit the text here. Keep the answer under ~55 words, and keep claims general
// unless you have checked the current rules (see `updated`).

export interface KennisSection {
  h2: string;
  p?: string[];
  list?: string[];
  steps?: string[];
}
export interface KennisFaq { q: string; a: string }
export interface KennisPage {
  path: string;            // full URL path, no trailing slash
  theme: 'regularisatie' | 'vergunning' | 'bouwen' | 'kosten';
  title: string;           // H1
  metaTitle: string;       // <title>, under ~60 characters including the brand
  description: string;     // meta description, under ~155 characters
  answer: string;          // the direct answer shown right under the H1
  sections: KennisSection[];
  faq: KennisFaq[];
  related: string[];       // other paths
  cta: 'haalbaarheid' | 'contact';
  ctaType: string;         // pre-selected subject on the contact form
}

export const KENNIS_UPDATED = '2026-10-11';
export const KENNIS_UPDATED_LABEL = 'oktober 2026';

export const THEMES: Record<KennisPage['theme'], { label: string; intro: string }> = {
  regularisatie: { label: 'Bouwovertreding en regularisatie', intro: 'Iets gebouwd zonder vergunning, of een woning gekocht met een afwijking? Zo gaat u er rustig mee om.' },
  vergunning: { label: 'Vergunningen en architect', intro: 'Wanneer heeft u een omgevingsvergunning nodig, en wanneer een architect?' },
  bouwen: { label: 'Wat mag u bouwen?', intro: 'Perceelsgrens, bouwvolume, zonevreemd: de regels die uw plannen bepalen.' },
  kosten: { label: 'Kosten en energie', intro: 'Wat kost een architect, wat kost bouwen, en wat vraagt de overheid van uw renovatie?' },
};

export const kennis: KennisPage[] = [
  // ---------- REGULARISATIE ----------
  {
    path: '/regularisatie/kostprijs',
    theme: 'regularisatie',
    title: 'Wat kost het om een bouwovertreding te regulariseren?',
    metaTitle: 'Bouwovertreding regulariseren: wat kost het? | Key-Design Architects',
    description: 'Wat bepaalt de kostprijs van een regularisatie van een bouwovertreding in Vlaanderen? Uitleg per kostenpost, zonder verrassingen.',
    answer: 'De kostprijs van een regularisatie hangt af van de omvang van de afwijking, de nodige studies en de eventuele aanpassingswerken. Een vaste prijs bestaat niet. Wat wel kan: vooraf onderzoeken of regulariseren haalbaar is, zodat u geen dossier betaalt dat toch geweigerd wordt.',
    sections: [
      { h2: 'Waaruit bestaat de kost?', list: [
        'Opmeten en tekenen van de bestaande toestand: dit is de basis van elk dossier.',
        'Het dossier zelf: plannen, motivatienota en eventuele bijkomende documenten of studies.',
        'Leges of dossierkosten bij de gemeente.',
        'Aanpassingswerken: soms vraagt de overheid dat een deel wordt gewijzigd of teruggebracht om te kunnen vergunnen.',
        'Ereloon van de architect voor opvolging van de procedure.'] },
      { h2: 'Wat maakt het goedkoper of duurder?', p: ['Een kleine afwijking in een gebied waar bouwen is toegestaan is meestal eenvoudig. Een grote uitbreiding, een constructie in een ander bestemmingsgebied of een afwijking van het verkavelingsvoorschrift vraagt meer onderzoek en meer zekerheid over de kans op een goede uitkomst.'] },
      { h2: 'Hoe vermijdt u onnodige kosten?', steps: [
        'Laat eerst de vergunde toestand en het geldende kader nakijken, voor er een dossier wordt opgesteld.',
        'Vraag een eerlijke inschatting van de slaagkans.',
        'Vraag een offerte met de kosten per stap, zodat u kan stoppen als regulariseren niet haalbaar blijkt.'] },
    ],
    faq: [
      { q: 'Moet ik de bouwovertreding eerst afbreken?', a: 'Nee, niet altijd. Afbraak is een mogelijke herstelmaatregel, maar regularisatie of een aanpassing kan een alternatief zijn. Dat hangt af van wat er is gebouwd en waar.' },
      { q: 'Kan ik een prijs krijgen voor ik beslis?', a: 'Ja. Bij Key-Design krijgt u eerst een eerste inschatting en een voorstel per stap, zodat u kosten en kansen kent voor u verder gaat.' },
    ],
    related: ['/regularisatie/architect-nodig', '/regularisatie/geweigerd', '/kennis/wat-kost-een-architect'],
    cta: 'contact', ctaType: 'Regularisatie',
  },
  {
    path: '/regularisatie/architect-nodig',
    theme: 'regularisatie',
    title: 'Heeft u een architect nodig om te regulariseren?',
    metaTitle: 'Regularisatie zonder architect: kan dat? | Key-Design Architects',
    description: 'Wanneer is een architect nodig bij een regularisatie van een bouwovertreding en wanneer niet? Heldere uitleg voor Vlaamse eigenaars.',
    answer: 'Voor de meeste regularisaties waarvoor een omgevingsvergunning nodig is, moet een architect het dossier opstellen. Voor bepaalde kleine werken bestaan uitzonderingen. Ook wanneer het wettelijk niet verplicht is, vermijdt een architect fouten die een weigering kunnen veroorzaken.',
    sections: [
      { h2: 'Wanneer is een architect verplicht?', p: ['De wet legt een architect op voor vergunningsplichtige werken, met uitzonderingen voor kleinere ingrepen die de stabiliteit niet raken en beperkt zijn in omvang. De precieze drempels hangen af van het soort werk en kunnen wijzigen. Controleer ze steeds in het Omgevingsloket of bij de gemeente, of vraag het ons.'] },
      { h2: 'Wat doet een architect bij regularisatie?', list: [
        'De bestaande toestand opmeten en vergelijken met wat vergund werd.',
        'Onderzoeken of het geldende kader regularisatie toelaat.',
        'Het dossier samenstellen en indienen in het Omgevingsloket.',
        'Het overleg met de gemeente voeren en de procedure opvolgen.'] },
      { h2: 'Wat als u het zelf wil proberen?', p: ['Voor een kleine, duidelijke afwijking kan het kloppen dat u het zelf indient. Het risico zit in de motivering: een onvolledig of slecht onderbouwd dossier wordt sneller geweigerd, en dat maakt een tweede poging moeilijker.'] },
    ],
    faq: [
      { q: 'Kan ik eerst alleen advies vragen?', a: 'Ja. Een eerste onderzoek van de situatie is een aparte stap. Daarna beslist u of u een volledig dossier wil laten opstellen.' },
      { q: 'Geldt dit ook voor een tuinhuis of veranda?', a: 'Kleine constructies hebben eigen regels. Lees daarvoor onze pagina over tuinhuis, veranda en loods.' },
    ],
    related: ['/regularisatie/kostprijs', '/kennis/omgevingsvergunning-zonder-architect', '/regularisatie/tuinhuis-veranda-loods'],
    cta: 'contact', ctaType: 'Regularisatie',
  },
  {
    path: '/regularisatie/verjaring-boete-afbreken',
    theme: 'regularisatie',
    title: 'Bouwovertreding: verjaring, boete en afbreken',
    metaTitle: 'Bouwovertreding: verjaring, boete, afbreken | Key-Design Architects',
    description: 'Wat zijn de gevolgen van een bouwovertreding in Vlaanderen? Verjaring, boete en afbraak uitgelegd, en wat u er zelf aan kan doen.',
    answer: 'Een bouwovertreding kan leiden tot een boete, een herstelmaatregel of in uiterste gevallen afbraak. Verjaring bestaat, maar een verjaarde overtreding is daarom niet vergund. Voor het bedrag en de termijnen in uw situatie raadpleegt u best een jurist of architect.',
    sections: [
      { h2: 'Wat zijn de mogelijke gevolgen?', list: [
        'Een proces-verbaal door de bevoegde ambtenaar.',
        'Een boete of bestuurlijke maatregel.',
        'Een herstelvordering: het aanpassen of terugbrengen in vergunde staat.',
        'Afbraak, als laatste middel en niet in elk dossier.'] },
      { h2: 'Wat betekent verjaring?', p: ['Er bestaan verjaringstermijnen voor strafvervolging en voor herstelvorderingen. Ze lopen niet gelijk en hangen af van de datum en de aard van de overtreding. Een belangrijk punt: een constructie die verjaard is, wordt daardoor niet automatisch vergund. Dat speelt bij verkoop, verbouwing en verzekering.', 'In principe worden constructies van voor 22 april 1962 vergund geacht. Voor latere constructies is bewijs nodig.'] },
      { h2: 'Wat kan u zelf doen?', steps: [
        'Zoek de vergunningstoestand van uw woning op via de gemeente en het stedenbouwkundig uittreksel.',
        'Laat de bestaande toestand opmeten en vergelijk met de vergunde plannen.',
        'Beslis met die informatie of regulariseren, aanpassen of niets doen het beste is.'] },
    ],
    faq: [
      { q: 'Moet ik mijn woning laten regulariseren voor ik verkoop?', a: 'Dat is niet altijd verplicht, maar een afwijking kan de verkoop of financiering bemoeilijken. Bespreek het liefst vooraf.' },
      { q: 'Is dit juridisch advies?', a: 'Nee. Dit is algemene informatie. Voor het bedrag van een boete of de verjaring in uw dossier raadpleegt u best een jurist.' },
    ],
    related: ['/regularisatie', '/regularisatie/geweigerd', '/regularisatie/kostprijs'],
    cta: 'contact', ctaType: 'Regularisatie',
  },
  {
    path: '/regularisatie/geweigerd',
    theme: 'regularisatie',
    title: 'Regularisatie geweigerd: wat nu?',
    metaTitle: 'Regularisatie geweigerd: wat nu? | Key-Design Architects',
    description: 'Is uw regularisatie van een bouwovertreding geweigerd? Wat zijn de mogelijkheden: beroep, aanpassing van het dossier of een andere oplossing.',
    answer: 'Bij een geweigerde regularisatie is er meestal nog een weg: beroep aantekenen, het dossier aanpassen en opnieuw indienen, of de afwijking gedeeltelijk herstellen. Welke weg past, hangt af van de motivering van de weigering en de termijnen. Handel snel, want beroepstermijnen zijn kort.',
    sections: [
      { h2: 'Waarom wordt een regularisatie geweigerd?', list: [
        'De constructie past niet in het bestemmingsgebied of in het verkavelingsvoorschrift.',
        'Het dossier was onvolledig of onvoldoende gemotiveerd.',
        'De afwijking veroorzaakt hinder voor de omgeving of de buren.',
        'Een advies van een bevoegde instantie was negatief.'] },
      { h2: 'Welke mogelijkheden zijn er?', steps: [
        'Lees de motivering van de weigering zorgvuldig en zet de termijn voor beroep in uw agenda.',
        'Laat onderzoeken of het dossier kan worden aangepast, bijvoorbeeld door de constructie te verkleinen of te verplaatsen.',
        'Dien een aangepast dossier opnieuw in, of teken beroep aan als de weigering onterecht lijkt.',
        'Overleg met de gemeente over een herstelmaatregel die haalbaar en proportioneel is.'] },
    ],
    faq: [
      { q: 'Mag ik de constructie laten staan tijdens het beroep?', a: 'Dat hangt af van de beslissing en eventuele herstelmaatregelen. Vraag dit na voor u iets onderneemt.' },
      { q: 'Kan ik meteen een nieuwe aanvraag indienen?', a: 'Soms wel, maar alleen met een echt aangepast dossier. Dezelfde aanvraag opnieuw indienen heeft weinig zin.' },
    ],
    related: ['/regularisatie', '/regularisatie/verjaring-boete-afbreken', '/regularisatie/architect-nodig'],
    cta: 'contact', ctaType: 'Regularisatie',
  },
  {
    path: '/regularisatie/tuinhuis-veranda-loods',
    theme: 'regularisatie',
    title: 'Tuinhuis, veranda of loods zonder vergunning',
    metaTitle: 'Tuinhuis, veranda, loods zonder vergunning | Key-Design Architects',
    description: 'Wanneer heeft u een vergunning nodig voor een tuinhuis, veranda of loods, en hoe regulariseert u er een? Praktische uitleg voor Vlaanderen.',
    answer: 'Kleine tuinconstructies zijn soms vergunningsvrij, soms meldingsplichtig en soms vergunningsplichtig. Dat hangt af van de afmetingen, de afstand tot de perceelsgrens en de bestemming. Een veranda tegen de woning is bijna altijd vergunningsplichtig. Controleer eerst de situatie voor u bouwt of regulariseert.',
    sections: [
      { h2: 'Waar hangt het van af?', list: [
        'De oppervlakte en hoogte van de constructie.',
        'De afstand tot de perceelsgrens en tot de woning.',
        'Of de constructie vrijstaat of vastgebouwd is aan de woning.',
        'Het bestemmingsgebied en eventuele verkavelingsvoorschriften.'] },
      { h2: 'Wat met een veranda?', p: ['Een veranda tegen de woning verandert het bouwvolume en de energieprestatie van de woning en is daarom in de regel vergunningsplichtig. Dat geldt ook als ze er al jaren staat en nooit werd vergund.'] },
      { h2: 'Zo pakt u een regularisatie aan', steps: [
        'Meet de constructie op en noteer afstanden tot de perceelsgrenzen.',
        'Zoek op welk voorschrift geldt voor uw perceel.',
        'Laat onderzoeken of het binnen het kader past, of dat een aanpassing nodig is.',
        'Dien het dossier in via het Omgevingsloket.'] },
    ],
    faq: [
      { q: 'Heb ik een vergunning nodig voor een tuinhuis?', a: 'Dat hangt af van de afmetingen en de plaats. Een klein tuinhuis kan vergunningsvrij zijn. Controleer steeds de huidige regels voor u bouwt.' },
      { q: 'Wat met een zwembad of een loods?', a: 'Beide kunnen vergunning of melding vragen, afhankelijk van afmetingen en bestemming. Vraag het vooraf na.' },
    ],
    related: ['/kennis/vergunningvrij-bouwen', '/regularisatie', '/kennis/bouwen-op-perceelsgrens'],
    cta: 'contact', ctaType: 'Regularisatie',
  },

  // ---------- VERGUNNING ----------
  {
    path: '/kennis/omgevingsvergunning-zonder-architect',
    theme: 'vergunning',
    title: 'Omgevingsvergunning zonder architect: wanneer mag het?',
    metaTitle: 'Omgevingsvergunning zonder architect | Key-Design Architects',
    description: 'Wanneer is een architect verplicht voor uw omgevingsvergunning (vroeger bouwvergunning) en wanneer niet? Duidelijk antwoord voor Vlaanderen.',
    answer: 'Voor de meeste vergunningsplichtige verbouwingen en voor nieuwbouw is een architect verplicht. Voor bepaalde kleine werken, zoals ingrepen die de stabiliteit niet raken en beperkt blijven in omvang, bestaan uitzonderingen. Voor u iets zonder architect indient, controleert u de actuele regels.',
    sections: [
      { h2: 'Wanneer is een architect verplicht?', p: ['Een omgevingsvergunning heette vroeger een bouwvergunning. Wie bouwt of verbouwt op een manier die een vergunning vraagt, moet in de regel een architect inschakelen. De architect staat in voor het ontwerp en het dossier.'] },
      { h2: 'Wanneer mag het zonder?', p: ['Voor bepaalde kleine werken is een architect niet verplicht, bijvoorbeeld ingrepen van beperkte omvang die geen invloed hebben op de stabiliteit. De drempels verschillen per soort werk en kunnen wijzigen. Het Omgevingsloket en de gemeentelijke dienst kunnen u zeggen wat voor uw situatie geldt.'] },
      { h2: 'Waarom toch een architect?', list: [
        'Een architect kent het geldende kader en voorkomt een weigering.',
        'Een goed dossier is sneller beoordeeld.',
        'Het ontwerp en de uitvoering blijven op elkaar afgestemd.',
        'Bij problemen op de werf heeft u een aanspreekpunt.'] },
    ],
    faq: [
      { q: 'Is een architect verplicht voor een kleine verbouwing?', a: 'Dat hangt af van wat u precies verandert. Raakt het de stabiliteit of de buitenschil, dan is dat meestal wel zo.' },
      { q: 'Wat kost een architect?', a: 'Dat verschilt per project. Lees onze pagina over wat een architect kost.' },
    ],
    related: ['/kennis/omgevingsvergunning-aanvragen', '/kennis/wat-kost-een-architect', '/regularisatie/architect-nodig'],
    cta: 'haalbaarheid', ctaType: 'Verbouwen',
  },
  {
    path: '/kennis/omgevingsvergunning-aanvragen',
    theme: 'vergunning',
    title: 'Hoe vraagt u een omgevingsvergunning aan?',
    metaTitle: 'Omgevingsvergunning aanvragen in Vlaanderen | Key-Design Architects',
    description: 'Stappenplan om een omgevingsvergunning aan te vragen in Vlaanderen via het Omgevingsloket: wat u nodig heeft en wat er daarna gebeurt.',
    answer: 'Een omgevingsvergunning vraagt u digitaal aan via het Omgevingsloket. U bereidt de plannen en documenten voor, dient het dossier in, wacht op de volledigheidscontrole en de beoordeling door de gemeente. In sommige gevallen volgt een openbaar onderzoek. Het gaat sneller met een volledig dossier.',
    sections: [
      { h2: 'Stappen in het Omgevingsloket', steps: [
        'Kijk na of uw werken een vergunning, een melding of niets vragen.',
        'Verzamel de plannen, foto\'s en eventuele studies.',
        'Maak een dossier aan in het Omgevingsloket en vul de gegevens in.',
        'Voeg de plannen en documenten toe en dien het dossier in.',
        'Het dossier wordt gecontroleerd op volledigheid en daarna beoordeeld.',
        'U ontvangt een beslissing. Bij een gunstige beslissing start u pas na de nodige termijnen.'] },
      { h2: 'Wat heeft u nodig?', list: [
        'Plannen van de bestaande toestand en van het ontwerp.',
        'Een beschrijving van de werken en een motivatienota.',
        'Foto\'s van de bestaande toestand en de omgeving.',
        'Gegevens van het perceel en eventueel bijkomende studies of attesten.'] },
      { h2: 'Hoe lang duurt het?', p: ['De duur hangt af van de procedure en de complexiteit van het dossier. Een volledig en goed onderbouwd dossier voorkomt aanvullingen die tijd kosten.'] },
    ],
    faq: [
      { q: 'Is het Omgevingsloket de plaats voor alle aanvragen?', a: 'Voor vergunningen en meldingen in Vlaanderen is het Omgevingsloket de plaats waar u indient. Uw gemeente behandelt de aanvraag.' },
      { q: 'Kan ik het dossier laten indienen?', a: 'Ja. Een architect stelt het dossier op, dient het in en volgt het op.' },
    ],
    related: ['/kennis/omgevingsvergunning-zonder-architect', '/kennis/vergunningvrij-bouwen', '/kennis/hoeveel-mag-ik-bouwen'],
    cta: 'contact', ctaType: 'Verbouwen',
  },
  {
    path: '/kennis/vergunningvrij-bouwen',
    theme: 'vergunning',
    title: 'Vergunningvrij bouwen in Vlaanderen',
    metaTitle: 'Vergunningvrij bouwen: wat mag zonder vergunning | Key-Design Architects',
    description: 'Welke werken zijn vergunningvrij of meldingsplichtig in Vlaanderen? Uitleg met voorbeelden zoals tuinhuis, zwembad, zonnepanelen en carport.',
    answer: 'Sommige kleine werken zijn vergunningvrij, andere meldingsplichtig, de meeste ingrepen aan het uiterlijk of de structuur van een woning vragen een omgevingsvergunning. Vergunningvrij betekent niet regelvrij: afstanden, hoogtes en verkavelingsvoorschriften blijven gelden. Controleer uw situatie steeds voor u bouwt.',
    sections: [
      { h2: 'Drie categorieën', list: [
        'Vergunningvrij: kleine werken die u zonder aanvraag mag uitvoeren, binnen de voorwaarden.',
        'Meldingsplichtig: werken die u moet melden bij de gemeente, zonder volledige vergunningsprocedure.',
        'Vergunningsplichtig: alle andere ingrepen met een grotere invloed op de woning of de omgeving.'] },
      { h2: 'Vaak gestelde voorbeelden', p: ['Tuinhuis, carport, pergola, zonnepanelen, airco, dakvenster, dakkapel, afsluiting, oprit en zwembad komen regelmatig voor. Voor elk bestaan eigen voorwaarden. Een zwembad in de tuin vraagt bijvoorbeeld meestal aandacht voor afmetingen, afstand tot de perceelsgrens en bestemming.'] },
      { h2: 'Wat u altijd moet nakijken', list: [
        'Het bestemmingsgebied en het verkavelingsvoorschrift van uw perceel.',
        'De afstand tot de perceelsgrenzen en de buren.',
        'De maximale hoogte en oppervlakte van de constructie.',
        'Of uw woning in een beschermd gebied of dorpsgezicht ligt.'] },
    ],
    faq: [
      { q: 'Moet ik mijn buren op de hoogte brengen?', a: 'Bij een vergunningsvrije constructie is dat niet verplicht, maar een goed gesprek vooraf voorkomt later gedoe.' },
      { q: 'Wat als ik toch iets bouw dat vergunning vraagt?', a: 'Dan spreken we van een bouwovertreding. Bekijk onze pagina over regularisatie.' },
    ],
    related: ['/regularisatie/tuinhuis-veranda-loods', '/kennis/bouwen-op-perceelsgrens', '/kennis/omgevingsvergunning-aanvragen'],
    cta: 'contact', ctaType: 'Verbouwen',
  },

  // ---------- BOUWEN ----------
  {
    path: '/kennis/hoeveel-mag-ik-bouwen',
    theme: 'bouwen',
    title: 'Hoeveel mag u bouwen op uw grond?',
    metaTitle: 'Hoeveel mag ik bouwen op mijn grond? | Key-Design Architects',
    description: 'Hoeveel mag u bouwen op uw perceel in Vlaanderen? Uitleg over bouwvolume, bebouwingspercentage, verkavelingsvoorschriften en gewestplan.',
    answer: 'Hoeveel u mag bouwen, staat in het plan dat voor uw perceel geldt: een verkavelingsvoorschrift, een gemeentelijk of gewestelijk plan, of het gewestplan. Daarin staan onder meer de bestemming, het bebouwbaar deel en de hoogte. Zoek eerst uw voorschriften op, voor u gaat tekenen.',
    sections: [
      { h2: 'Waar vindt u de regels?', steps: [
        'Vraag een stedenbouwkundig uittreksel of een planinfo-attest aan bij uw gemeente.',
        'Kijk of uw perceel in een verkaveling ligt en lees het verkavelingsvoorschrift.',
        'Controleer het bestemmingsplan (gewestplan of ruimtelijk uitvoeringsplan).',
        'Laat een architect de regels vertalen naar wat dat concreet voor uw plannen betekent.'] },
      { h2: 'Welke begrippen spelen?', list: [
        'Bebouwbaar deel: waar op het perceel u mag bouwen.',
        'Bouwdiepte en bouwhoogte: hoe diep en hoog.',
        'Afstanden tot de perceelsgrenzen.',
        'Bestemming: wonen, landbouw of iets anders.'] },
      { h2: 'En als uw plan afwijkt?', p: ['Soms kan een beperkte afwijking toegestaan worden, mits een goede motivering. Dat is maatwerk. Een haalbaarheidsonderzoek toont wat realistisch is, voor u aan het ontwerp begint.'] },
    ],
    faq: [
      { q: 'Wat is een bebouwingspercentage?', a: 'Het aandeel van het perceel dat u mag bebouwen. Het staat in het voorschrift dat voor uw perceel geldt.' },
      { q: 'Kan ik dit zelf opzoeken?', a: 'Ja, via de gemeente en de online planinformatie. Voor de vertaling naar uw project helpt een architect.' },
    ],
    related: ['/kennis/bouwen-op-perceelsgrens', '/kennis/zonevreemde-woning', '/haalbaarheid'],
    cta: 'haalbaarheid', ctaType: 'Haalbaarheid',
  },
  {
    path: '/kennis/bouwen-op-perceelsgrens',
    theme: 'bouwen',
    title: 'Bouwen op de perceelsgrens: wat mag?',
    metaTitle: 'Garage of bijgebouw op de perceelsgrens | Key-Design Architects',
    description: 'Mag u een garage of bijgebouw op de perceelsgrens bouwen? Uitleg over afstanden, hoogte, gemene muur en het akkoord met de buren in Vlaanderen.',
    answer: 'Bouwen tot op de perceelsgrens kan in bepaalde gevallen, bijvoorbeeld als het voorschrift dat toelaat of als de buur akkoord gaat. Voor een garage of bijgebouw spelen afstand, hoogte en brandveiligheid een rol. Controleer het voorschrift van uw perceel en bespreek het met de buren.',
    sections: [
      { h2: 'Waar let u op?', list: [
        'Het voorschrift van uw perceel: afstanden tot de grens staan vaak vast.',
        'De hoogte van de constructie aan de perceelsgrens.',
        'Brandveiligheid: een muur op de grens heeft vaak eigen eisen.',
        'Ramen en zichten naar de buren: meestal gelden minimale afstanden voor rechtstreekse zichten, vaak ongeveer 1,90 meter.'] },
      { h2: 'Gemene muur', p: ['Een scheidingsmuur kan van beide buren zijn. Wie er tegenaan bouwt of de muur wil verhogen of overnemen, volgt best de regels voor een gemene muur en regelt dit schriftelijk met de buur.'] },
      { h2: 'Zo pakt u het aan', steps: [
        'Controleer de afstands- en hoogteregels in het voorschrift van uw perceel.',
        'Bespreek uw plan met de buur voor u aan het ontwerp begint.',
        'Laat een architect nagaan of een vergunning of melding nodig is.',
        'Leg afspraken met de buur schriftelijk vast.'] },
    ],
    faq: [
      { q: 'Hoe hoog mag ik bouwen op de erfgrens?', a: 'Dat hangt af van het voorschrift en de situatie. Er bestaan vaak hoogtegrenzen voor bijgebouwen. Controleer ze steeds voor uw perceel.' },
      { q: 'Moet de buur akkoord gaan?', a: 'Soms is dat nodig, soms niet. Een akkoord voorkomt in elk geval later problemen.' },
    ],
    related: ['/kennis/hoeveel-mag-ik-bouwen', '/kennis/vergunningvrij-bouwen', '/regularisatie/tuinhuis-veranda-loods'],
    cta: 'contact', ctaType: 'Verbouwen',
  },
  {
    path: '/kennis/zonevreemde-woning',
    theme: 'bouwen',
    title: 'Een zonevreemde woning verbouwen: wat kan?',
    metaTitle: 'Zonevreemde woning verbouwen | Key-Design Architects',
    description: 'Mag u een zonevreemde woning verbouwen of uitbreiden in Vlaanderen? Uitleg over de basisrechten voor zonevreemde constructies en hun grenzen.',
    answer: 'Een zonevreemde woning staat in een gebied waar wonen niet de bestemming is, bijvoorbeeld agrarisch gebied. Voor bestaande vergunde woningen bestaan basisrechten om te verbouwen en beperkt uit te breiden. De grenzen hangen af van de situatie. Laat uw vergunningstoestand eerst onderzoeken.',
    sections: [
      { h2: 'Wat is zonevreemd?', p: ['Een constructie is zonevreemd als haar functie niet past bij de bestemming van het gebied waarin ze staat. Dat komt vaak voor bij oudere woningen en hoeves in landelijke gebieden.'] },
      { h2: 'Wat kan er wel?', list: [
        'Onderhoud en herstel van een bestaande vergunde woning.',
        'Verbouwen binnen het bestaande volume.',
        'Een beperkte uitbreiding onder voorwaarden.',
        'In sommige gevallen een functiewijziging.'] },
      { h2: 'Waar moet u mee beginnen?', steps: [
        'Controleer of de woning vergund of vergund geacht is.',
        'Bepaal het bestemmingsgebied van het perceel.',
        'Laat de mogelijkheden onderzoeken voor u een ontwerp laat opstellen.'] },
    ],
    faq: [
      { q: 'Kan ik een zonevreemde woning afbreken en herbouwen?', a: 'Soms, onder voorwaarden. Dat is maatwerk dat u best vooraf laat onderzoeken.' },
      { q: 'Wat als de woning niet vergund is?', a: 'Dan eerst de vergunningstoestand uitklaren. Bekijk onze pagina over regularisatie.' },
    ],
    related: ['/kennis/hoeveel-mag-ik-bouwen', '/regularisatie', '/haalbaarheid'],
    cta: 'haalbaarheid', ctaType: 'Haalbaarheid',
  },

  // ---------- KOSTEN ----------
  {
    path: '/kennis/wat-kost-een-architect',
    theme: 'kosten',
    title: 'Wat kost een architect voor een verbouwing?',
    metaTitle: 'Wat kost een architect? | Key-Design Architects',
    description: 'Hoe berekent een architect zijn ereloon in Vlaanderen? Percentage, forfait of uurtarief: uitleg over wat er inbegrepen is.',
    answer: 'Een architect rekent zijn ereloon meestal aan als percentage van de bouwsom, als forfait of per uur. Het bedrag hangt af van de omvang en complexiteit van het project en van wat er is inbegrepen: ontwerp, vergunning, aanbesteding en werfopvolging. Vraag steeds een schriftelijke offerte.',
    sections: [
      { h2: 'Hoe wordt het berekend?', list: [
        'Percentage van de bouwsom: de meest gebruikte formule bij volledige opdrachten.',
        'Forfait: een vaste prijs voor een afgebakende opdracht, bijvoorbeeld een haalbaarheidsstudie of regularisatie.',
        'Uurtarief: voor advies of kleine opdrachten.'] },
      { h2: 'Wat zit er in een volledige opdracht?', list: [
        'Schetsontwerp en voorontwerp.',
        'Het vergunningsdossier.',
        'Technische plannen en lastenboek.',
        'Aanbesteding en vergelijking van offertes.',
        'Opvolging van de werf en oplevering.'] },
      { h2: 'Hoe vergelijkt u offertes?', p: ['Kijk niet alleen naar het percentage maar naar wat het omvat. Een lager percentage zonder werfopvolging is niet hetzelfde als een volledige opdracht.'] },
    ],
    faq: [
      { q: 'Kan ik een architect alleen voor een deel van het werk inschakelen?', a: 'Ja, bijvoorbeeld enkel voor het vergunningsdossier of een haalbaarheidsstudie.' },
      { q: 'Is een eerste gesprek gratis?', a: 'Bij Key-Design krijgt u eerst een eerste inschatting zonder verplichting.' },
    ],
    related: ['/kennis/bouwkosten-per-m2', '/haalbaarheid', '/kennis/omgevingsvergunning-zonder-architect'],
    cta: 'haalbaarheid', ctaType: 'Haalbaarheid',
  },
  {
    path: '/kennis/bouwkosten-per-m2',
    theme: 'kosten',
    title: 'Bouwkosten per m2: waar hangt het van af?',
    metaTitle: 'Bouwkosten per m2: wat bepaalt de prijs? | Key-Design Architects',
    description: 'Wat bepaalt de bouwkost per m2 bij nieuwbouw of renovatie? Uitleg over de factoren en hoe u een eerste inschatting maakt.',
    answer: 'De bouwkost per m2 hangt af van het type project, de afwerkingsgraad, de grondslag en de energieprestatie. Nieuwbouw en renovatie verschillen sterk, en elke prijs per m2 is maar een grove richtlijn. Een eerste haalbaarheidsonderzoek geeft een eerlijker beeld dan een gemiddelde.',
    sections: [
      { h2: 'Wat beïnvloedt de prijs?', list: [
        'Nieuwbouw of renovatie, en de toestand van het bestaande.',
        'De keuze van materialen en afwerking.',
        'De complexiteit van de vorm, de funderingen en de technische installaties.',
        'De energieprestatie en de gewenste isolatie.',
        'Het moment: bouwprijzen veranderen in de tijd.'] },
      { h2: 'Waarom een gemiddelde misleidt', p: ['Een gemiddelde prijs per m2 verbergt grote verschillen. Een eenvoudige rijwoning en een hoekwoning met uitbouw kosten per m2 niet hetzelfde. Gebruik een gemiddelde enkel als eerste richting.'] },
      { h2: 'Hoe maakt u een eerste inschatting?', steps: [
        'Bepaal de omvang van uw project en het niveau van afwerking.',
        'Gebruik onze haalbaarheidstool voor een eerste indicatie.',
        'Laat de inschatting bevestigen door een architect met een eerste schets en een raming.'] },
    ],
    faq: [
      { q: 'Is de architect in de bouwkost inbegrepen?', a: 'Nee, ereloon en andere bijkomende kosten komen er meestal bij. Vraag ze apart na.' },
      { q: 'Kan ik de prijs vooraf vastleggen?', a: 'Pas na een volledig ontwerp en een aanbesteding krijgt u echte prijzen. Daarvoor werkt een raming.' },
    ],
    related: ['/kennis/wat-kost-een-architect', '/haalbaarheid', '/kennis/renovatieverplichting'],
    cta: 'haalbaarheid', ctaType: 'Haalbaarheid',
  },
  {
    path: '/kennis/renovatieverplichting',
    theme: 'kosten',
    title: 'Renovatieverplichting in Vlaanderen: wat moet u doen?',
    metaTitle: 'Renovatieverplichting Vlaanderen en architect | Key-Design Architects',
    description: 'Wat is de renovatieverplichting in Vlaanderen en wat betekent ze voor uw woning? Uitleg over EPC, termijnen en de rol van de architect.',
    answer: 'In Vlaanderen moeten eigenaars van bepaalde woningen met een slecht EPC-label na aankoop renoveren tot een beter label binnen een vaste termijn. De exacte voorwaarden en termijnen veranderen. Controleer ze bij de overheid en laat uw woning vooraf doorrekenen.',
    sections: [
      { h2: 'Waar gaat het om?', p: ['De overheid wil dat woningen met een slechte energieprestatie sneller verbeteren. Wie zo\'n woning koopt, krijgt een termijn om ze energetisch te renoveren naar een minimum label. De regels hangen af van het label en de aard van de woning.'] },
      { h2: 'Wat doet een architect hierbij?', list: [
        'De woning doorlichten en een renovatiepad opstellen.',
        'De werken in logische fasen plannen, zodat u niets dubbel doet.',
        'De nodige vergunningen voorbereiden.',
        'Offertes vergelijken en de uitvoering opvolgen.'] },
      { h2: 'Waar begint u?', steps: [
        'Vraag het EPC van de woning op.',
        'Controleer bij de overheid wat in uw situatie geldt.',
        'Laat een haalbaarheidsonderzoek maken, zodat u budget en volgorde kent.'] },
    ],
    faq: [
      { q: 'Moet ik meteen renoveren na aankoop?', a: 'Er geldt een termijn. Controleer de actuele voorwaarden bij de overheid.' },
      { q: 'Zijn er premies?', a: 'Er bestaan premies en voordelen voor energetisch renoveren. Controleer de actuele voorwaarden op vlaanderen.be.' },
    ],
    related: ['/kennis/bouwkosten-per-m2', '/haalbaarheid', '/kennis/wat-kost-een-architect'],
    cta: 'haalbaarheid', ctaType: 'Haalbaarheid',
  },
];

export const bySlugPath = (path: string) => kennis.find((k) => k.path === path);
