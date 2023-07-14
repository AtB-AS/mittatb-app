import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const TravelTokenBoxTexts = {
  tcard: {
    title: _('t:kort', 't:card', 't:kort'),
    description: _(
      'Ta med deg t:kortet når du er ute og reiser.',
      'Remember to bring your t:card when you travel.',
      'Ta med deg t:kortet når du er ute og reiser.',
    ),
    a11yLabel: _(
      'Du bruker nå t:kort. Ta med deg t:kortet når du er ute og reiser.',
      'You are using t:card. Bring your t:card when you are travelling',
      'Du bruker no t:kort. Ta med deg t:kortet når du er ute og reiser.',
    ),
  },
  mobile: {
    description: _(
      'Ta med deg mobilen når du er ute og reiser.',
      'Remember to bring your phone while travelling.',
      'Ta med deg mobilen når du er ute og reiser.',
    ),
    a11yLabel: (deviceName: string) =>
      _(
        `Du bruker nå mobilen ${deviceName}. Ta med deg mobilen når du er ute og reiser.`,
        `You are now using the phone ${deviceName}. Bring your phone when you are travelling`,
        `Du bruker no mobilen ${deviceName}. Ta med deg mobilen når du er ute og reiser.`,
      ),
    unnamedDevice: _('Enhet uten navn', 'Unnamed device', 'Enhet utan namn'),
  },
  howToChange: _(
    'Du kan bytte hvor du bruker billetten din fra **Min profil**.',
    'Switch where you are using your ticket at **My profile** ',
    'Du kan bytte kor du brukar billetten din frå **Mi profil**.',
  ),
  errorMessages: {
    tokensNotLoadedTitle: _(
      'Klarer ikke hente informasjon om t:kort / mobil.',
      'Unable to retrieve information about your t:card / phone.',
      'Klarer ikkje hente informasjon om t:kort / mobil.',
    ),
    tokensNotLoaded: _(
      'Billetter må brukes på enten et t:kort eller en mobil, men akkurat nå klarer vi ikke finne ut hvor den er i bruk. Sjekk at du har tilgang på nett der du er.',
      `Tickets must be used on either a t:card or phone, but right now we are unable to find where the ticket is in use. Check that you have internet access.`,
      `Billettar må brukast på enten eit t:kort eller ein mobil, men akkurat no kan vi ikkje finne ut kvar billetten blir brukt. Sjekk at du har tilgang på nett der du er.`,
    ),
    noInspectableTokenTitle: _(
      'Velg hvor du vil bruke billettene dine',
      'Choose where your tickets are used',
      'Vel kor du vil bruke billettane dine',
    ),
    noInspectableToken: _(
      'Billetter må brukes på enten et t:kort eller en mobil, og det ser ikke ut som du har valgt en av dem.\n\nGå til **Min profil, Bytt mellom t:kort / mobil** for å velge.',
      `Tickets must be used on either a t:card or a phone, and it looks like you haven't chosen one. Go to **My profile, switch between t:card / phone** to select`,
      `Billettar må brukast på enten eit t:kort eller ein mobil, og det ser ikkje ut som du har valt ein av dei.\n\nGå til **Mi profil, Bytt mellom t:kort / mobil** for å velje.`,
    ),
  },
};

export default orgSpecificTranslations(TravelTokenBoxTexts, {
  nfk: {
    tcard: {
      title: _('Reisekort', 'Travelcard', 'Reisekort'),
      description: _(
        `Ta med deg reisekortet når du er ute og reiser`,
        `Remember to bring your travel card when you travel`,
        `Ta med deg reisekortet når du er ute og reiser`,
      ),

      a11yLabel: _(
        'Du bruker nå reisekort. Ta med deg reisekortet når du er ute og reiser',
        'You are using travel card. Remember to bring your travel card when you travel',
        'Du bruker no reisekort. Ta med deg reisekortet når du er ute og reiser',
      ),
    },
    errorMessages: {
      tokensNotLoadedTitle: _(
        'Klarer ikke hente informasjon om reisekort / mobil.',
        'Unable to retrieve information about your travel card / phone.',
        'Klarer ikkje hente informasjon om reisekort / mobil.',
      ),
      tokensNotLoaded: _(
        'Billetter må brukes på enten et reisekort eller en mobil, men akkurat nå klarer vi ikke finne ut hvor den er i bruk. Sjekk at du har tilgang på nett der du er.',
        `Tickets must be used on either a travel card or phone, but right now we are unable to find where the ticket is in use. Check that you have internet access.`,
        `Billettar må brukast på enten eit reisekort eller ein mobil, men akkurat no kan vi ikkje finne ut kvar billetten blir brukt. Sjekk at du har tilgang på nett der du er.`,
      ),
      noInspectableToken: _(
        'Billetter må brukes på enten et reisekort eller en mobil, og det ser ikke ut som du har valgt en av dem.\n\nGå til **Min profil, Bytt mellom reisekort / mobil** for å velge.',
        `Tickets must be used on either a travel card or a phone, and it looks like you haven't chosen one. Go to **My profile, switch between travel card / phone** to select`,
        `Billettar må brukast på enten eit reisekort eller ein mobil, og det ser ikkje ut som du har valt ein av dei.\n\nGå til **Mi profil, Bytt mellom reisekort / mobil** for å velje.`,
      ),
    },
  },
  fram: {
    tcard: {
      title: _('Reisekort', 'Travelcard', 'Reisekort'),
      description: _(
        `Ta med deg reisekortet når du er ute og reiser`,
        `Remember to bring your travel card when you travel`,
        `Ta med deg reisekortet når du er ute og reiser`,
      ),

      a11yLabel: _(
        'Du bruker nå reisekort. Ta med deg reisekortet når du er ute og reiser',
        'You are using travel card. Remember to bring your travel card when you travel',
        'Du bruker no reisekort. Ta med deg reisekortet når du er ute og reiser',
      ),
    },
    errorMessages: {
      tokensNotLoadedTitle: _(
        'Klarer ikke hente informasjon om reisekort / mobil.',
        'Unable to retrieve information about your travel card / phone.',
        'Klarer ikkje hente informasjon om reisekort / mobil.',
      ),
      tokensNotLoaded: _(
        'Billetter må brukes på enten et reisekort eller en mobil, men akkurat nå klarer vi ikke finne ut hvor den er i bruk. Sjekk at du har tilgang på nett der du er.',
        `Tickets must be used on either a travel card or phone, but right now we are unable to find where the ticket is in use. Check that you have internet access.`,
        'Billettar må brukast på enten eit reisekort eller ein mobil, men nett no klarar vi ikkje finne ut kvar den er i bruk. Sjekk at du har tilgang på nett der du er.',
      ),
      noInspectableToken: _(
        'Billetter må brukes på enten et reisekort eller en mobil, og det ser ikke ut som du har valgt en av dem.\n\nGå til **Min bruker, Bytt mellom reisekort / mobil** for å velge.',
        `Tickets must be used on either a travel card or a phone, and it looks like you haven't chosen one. Go to **My user, switch between travel card / phone** to select`,
        'Billettar må brukast på enten eit reisekort eller ein mobil, og det ser ikkje ut som du har valgt ein av dei.\n\nGå til **Min brukar, Bytt mellom reisekort / mobil** for å velge.',
      ),
    },
  },
});
