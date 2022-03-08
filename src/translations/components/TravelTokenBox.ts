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
