import {translation as _} from '../commons';

const ProfileTexts = {
  header: {
    title: _('Mitt AtB', 'Profile'),
    logo: {
      a11yLabel: _('Gå til startside', 'Go to start page'),
    },
    backButton: {
      a11yLabel: _('Gå tilbake', 'Go back'),
    },
  },
  sections: {
    settings: {
      heading: _('Innstillinger', 'Settings'),
      linkItems: {
        appearance: {
          label: _('Utseende', 'Appearance'),
        },
        startScreen: {
          label: _('Startside', 'Start page'),
        },
        language: {
          label: _('Språk', 'Language'),
        },
      },
    },
    favorites: {
      heading: _('Favoritter', 'Favourites'),
      linkItems: {
        places: {
          label: _('Steder', 'Locations'),
        },
        departures: {
          label: _('Avganger', 'Departures'),
        },
      },
    },
    privacy: {
      heading: _('Personvern', 'Privacy'),
      linkItems: {
        privacy: {
          label: _('Personvernerklæring', 'Privacy statement'),
          a11yHint: _('Aktivér for å lese personvernerklæring på ekstern side', 'Activate to read our privacy statement (external content)'),
        },
      },
    },
  },
};
export default ProfileTexts;
