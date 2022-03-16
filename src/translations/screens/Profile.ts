import {translation as _} from '../commons';
import orgSpecificTranslations from '../utils';

const ProfileTexts = {
  header: {
    title: _('Min profil', 'My profile'),
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
        expiredTickets: {
          label: _('Utløpte billetter', 'Expired tickets'),
        },
      },
      infoItems: {
        customerNumber: _('Kundenummer', 'Customer number'),
        phoneNumber: _('Telefonnummer', 'Phone number'),
      },
    },
    newFeatures: {
      heading: _('Ny funksjonalitet', 'New features'),
      departures: _('Prøv ny avganger-visning', 'Try the new departure view'),
      assistant: _('Prøv ny reisesøkmotor', 'Try the new travel search engine'),
    },
    settings: {
      heading: _('Innstillinger', 'Settings'),
      linkItems: {
        userProfile: {
          label: _('Standard reisende', 'Default traveller'),
        },
        travelToken: {
          label: _(
            'Bruk billett på mobil / t:kort',
            'Use ticket on phone / t:card',
          ),
          flag: _('Ny', 'New'),
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
          label: _('Invitasjonskode', 'Invitation code'),
        },
      },
    },
    favorites: {
      heading: _('Favoritter', 'Favourites'),
      linkItems: {
        places: {
          label: _('Steder', 'Locations'),
          a11yHint: _(
            'Aktivér for å endre favorittsteder',
            'Activate to edit locations',
          ),
        },
        departures: {
          label: _('Avganger', 'Departures'),
          a11yHint: _(
            'Aktivér for å endre favoritt-avganger',
            'Activate to edit favourite departures',
          ),
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
    information: {
      heading: _('Info og priser', 'Info and prices'),
      linkItems: {
        ticketing: {
          label: _('Billettkjøp', 'Ticketing'),
        },
        payment: {
          label: _('Betaling', 'Payment'),
        },
        terms: {
          label: _('Betingelser', 'Terms'),
        },
        inspection: {
          label: _('Billettkontroll', 'Ticket inspection'),
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
export default orgSpecificTranslations(ProfileTexts, {
  nfk: {
    header: {
      title: _('Mitt Reis', 'My Reis'),
    },
  },
});
