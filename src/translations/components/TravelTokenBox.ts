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
        `You are now using the phone ${deviceName}. Bring your phone when you are travelling`,
      ),
    unnamedDevice: _('Enhet uten navn', 'Unnamed device'),
  },
  howToChange: _(
    'Du kan bytte hvor du bruker billetten din fra **Min profil**.',
    'Switch where you are using your ticket at **My profile** ',
  ),
  errorMessages: {
    tokensNotLoadedTitle: _(
      'Klarer ikke hente informasjon om mobil / t:kort.',
      'Unable to get information about your phones or t:card.',
    ),
    tokensNotLoaded: _(
      'Billetter må brukes på enten et t:kort eller en mobil, men akkurat nå klarer vi ikke finne ut hvor den er i bruk. Sjekk at du har tilgang på nett der du er.',
      `Tickets must be used on either a t:card or a phone, but right now we are unable to determine where your tickets are used. Make sure you're online.`,
    ),
    emptyTokensTitle: _(
      'Vi finner ingen t:kort eller mobiler tilknyttet profilen din.',
      `We can't find any phones or t:card on your account.`,
    ),
    emptyTokens: _(
      'Sjekk at du har tilgang på nett. Hvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.' +
        '\n\n' +
        'Om problemet vedvarer kan du ta kontakt med AtB kundesenter.',
      `Make sure you're online. We'll keep trying but if the problem persists, please get in touch with AtB service center. `,
    ),
    noInspectableTokenTitle: _(
      'Velg hvor du vil bruke billettene dine',
      'Choose where your tickets are used',
    ),
    noInspectableToken: _(
      'Billetter må brukes på enten et t:kort eller en mobil, og det ser ikke ut som du har valgt en av dem. Gå til Min profil > Bytt mellom mobil / t:kort for å velge.',
      'Tickets must be used on either a t:card or a phone, but it seems none are chosen. Go to settings in **My profile** and make a choice.',
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
