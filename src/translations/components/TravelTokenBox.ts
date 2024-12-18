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
    noInspectableToken: _(
      'Billetter må brukes på enten t:kort eller mobil. Vennligst gjør en endring.',
      'Tickets must be used on either a t:card or phone. Please make a change.',
      'Billettar må brukast på enten eit t:kort eller ein mobil. Ver venleg og gjer ein endring.',
    ),
  },
  change: _('Endre', 'Change', 'Endre'),
};

export default orgSpecificTranslations(TravelTokenBoxTexts, {
  nfk: {
    tcardName: _('reisekort', 'travel card', 'reisekort'),
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
        'Billetter må brukes på enten reisekort eller mobil. Vennligst gjør en endring.',
        'Tickets must be used on either a travel card or phone. Please make a change.',
        'Billettar må brukast på enten eit reisekort eller ein mobil. Ver venleg og gjer ein endring.',
      ),
    },
  },
  fram: {
    tcardName: _('reisekort', 'travel card', 'reisekort'),
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
        'Billetter må brukes på enten reisekort eller mobil. Vennligst gjør en endring.',
        'Tickets must be used on either a travel card or phone. Please make a change.',
        'Billettar må brukast på enten eit reisekort eller ein mobil. Ver venleg og gjer ein endring.',
      ),
    },
  },
  troms: {
    tcardName: _('reisekort', 'travel card', 'reisekort'),
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
        'Billetter må brukes på enten reisekort eller mobil. Vennligst gjør en endring.',
        'Tickets must be used on either a travel card or phone. Please make a change.',
        'Billettar må brukast på enten eit reisekort eller ein mobil. Ver venleg og gjer ein endring.',
      ),
    },
  },
});
