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
          label: _('Logg inn', 'Sign in'),
        },
        logout: {
          label: _('Logg ut', 'Sign out'),
        },
      },
    },
    settings: {
      heading: _('Innstillinger', 'Settings'),
      linkItems: {
        userProfile: {
          label: _('Standard reisende', 'Default traveller'),
        },
        appearance: {
          label: _('Utseende', 'Appearance'),
        },
        startScreen: {
          label: _('Startside', 'Start page'),
        },
        language: {
          label: _('Språk', 'Language'),
        },
        enrollment: {
          label: _('Ny funksjonalitet', 'New features'),
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
        clearHistory: {
          label: _('Tøm søkehistorikk', 'Clear search history'),
          a11yHint: _(
            'Aktivér for å tømme tidligere søk',
            'Activate to clear previous searches',
          ),
          confirm: _(
            'Dette vil fjerne søkehistorikk.',
            'This will permanently clear search history.',
          ),
          alert: {
            cancel: _('Avbryt', 'Cancel'),
            confirm: _('Tøm historikk', 'Clear history'),
          },
        },
      },
    },
  },
  installId: {
    label: _('ID', 'ID'),
    wasCopiedAlert: _('ID ble kopiert!', 'ID was copied to clipboard!'),
    a11yHint: _(
      'Klikk for å kopiere id. Denne brukes til teknisk feilsøk.',
      'Press to copy the id. This is used for technical debugging',
    ),
  },
};
export default ProfileTexts;
