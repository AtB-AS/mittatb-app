import {translation as _} from '../commons';
import orgSpecificTranslations from '@atb/translations/utils';
const TravelTokenBoxTexts = {
  tcard: {
    title: _('T:kort', 'T:card'),
    description: _(
      'Ta med deg t:kortet når du er ute og reiser.',
      'Remember to bring your t:card when you travel.',
    ),
    a11yLabel: _(
      'Du bruker nå t:kort. Ta med deg t:kortet når du er ute og reiser.',
      'You are using t:card. Bring your t:card when you are travelling',
    ),
  },
  mobile: {
    description: _(
      'Ta med deg mobilen når du er ute og reiser.',
      'Remember to bring your phone while travelling.',
    ),
    a11yLabel: (deviceName: string) =>
      _(
        `Du bruker nå mobilen ${deviceName}. Ta med deg mobilen når du er ute og reiser.`,
        `You are now using the mobile phone ${deviceName}. Bring your phone when you are travelling`,
      ),
  },
  howToChange: _(
    'Du kan bytte hvor du bruker billetten din fra Min profil',
    'TODO', // TODO
  ),
  errorMessages: {
    tokensNotLoadedTitle: _(
      'Klarer ikke hente informasjon om mobil / t:kort',
      'TODO', // TODO
    ),
    tokensNotLoaded: _(
      'Billetter må brukes på enten et t:kort eller en mobil, men akkurat nå klarer vi ikke finne ut hvor den er i bruk. Sjekk at du har tilgang på nett der du er.',
      'TODO', // TODO
    ),
    emptyTokensTitle: _(
      'Vi finner ingen t:kort eller mobiler tilknyttet profilen din',
      'TODO', // TODO
    ),
    emptyTokens: _(
      'Sjekk at du har tilgang på nett. Hvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.' +
        '\n\n' +
        'Om problemet vedvarer kan du ta kontakt med AtB kundesenter.',
      'TODO', // TODO
    ),
    noInspectableTokenTitle: _(
      'Velg hvor du vil bruke billettene dine',
      'TODO', // TODO
    ),
    noInspectableToken: _(
      'Billetter må brukes på enten et t:kort eller en mobil, og det ser ikke ut som du har valgt en av dem. Gå til Min profil > Bytt mellom mobil / t:kort for å velge.',
      'TODO', // TODO
    ),
  },
};

export default orgSpecificTranslations(TravelTokenBoxTexts, {
  nfk: {
    tcard: {
      title: _('Reisekort', 'Travelcard'),
      description: _(
        `Ta med deg reisekortet når du er ute og reiser`,
        `Remember to bring your travel card when you travel`,
      ),

      a11yLabel: _(
        'Du bruker nå reisekort. Ta med deg reisekortet når du er ute og reiser',
        'Yoú are using travelcard. Remember to bring your travel card when you travel',
      ),
    },
  },
});
