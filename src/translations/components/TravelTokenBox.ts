import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const TravelTokenBoxTexts = {
  title: _(
    'Dine billetter er tilgjengelige fra ',
    'Your tickets are available from ',
    'Billettane dine er tilgjengelege frå ',
  ),
  thisDeviceSuffix: _('denne enheten', 'this device', 'denne eininga'),
  otherDeviceSuffix: _('en annen enhet', 'another device', 'ei anna eining'),
  tcardName: _('t:kort', 't:card', 't:kort'),
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
  change: _('Endre', 'Change', 'Endre'),
};

export default orgSpecificTranslations(TravelTokenBoxTexts, {
  nfk: {
    tcardName: _('reisekort', 'travelcard', 'reisekort'),
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
    tcardName: _('reisekort', 'travelcard', 'reisekort'),
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
        'Billettar må brukast på enten eit reisekort eller ein mobil, og det ser ikkje ut som du har valgt ein av dei.\n\nGå til **Min brukar, Bytt mellom reisekort / mobil** for å velje.',
      ),
    },
  },
});
