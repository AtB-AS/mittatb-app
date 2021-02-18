import {translation as _} from '../commons';

const ProfileTexts = {
  header: {
    title: _('Mitt AtB', 'Profile'),
  },
  sections: {
    account: {
      heading: _('Min konto', 'My account'),
      linkItems: {
        login: {
          label: _('Logg inn', 'Log in'),
        },
        logout: {
          label: _('Logg ut', 'Log out'),
        },
      },
    },
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
          a11yHint: _(
            'Aktivér for å lese personvernerklæring på ekstern side',
            'Activate to read our privacy statement (external content)',
          ),
        },
      },
    },
  },
};
export default ProfileTexts;
