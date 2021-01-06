import {translation as _} from '../commons';

const ProfileTexts = {
  header: {
    title: _('Mitt AtB'),
    logo: {
      a11yLabel: _('Gå til startside'),
    },
    backButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  sections: {
    settings: {
      heading: _('Innstillinger', 'Settings'),
      linkItems: {
        appearance: {
          label: _('Utseende'),
        },
        startScreen: {
          label: _('Startside'),
        },
        language: {
          label: _('Språk'),
        },
      },
    },
    favorites: {
      heading: _('Favoritter'),
      linkItems: {
        places: {
          label: _('Steder'),
        },
        departures: {
          label: _('Avganger'),
        },
      },
    },
    privacy: {
      heading: _('Personvern', 'Privacy'),
      linkItems: {
        privacy: {
          label: _('Personvernerklæring'),
          a11yHint: _('Aktivér for å lese personvernerklæring på ekstern side'),
        },
      },
    },
  },
};
export default ProfileTexts;
