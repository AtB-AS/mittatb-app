import {translation as _} from '../commons';

const ProfileTexts = {
  header: {
    title: _('Min profil', 'My profile'),
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
          confirmTitle: _(
            'Er du sikker på at du vil logge ut?',
            'Are you sure you want to log out?',
          ),
          confirmMessage: _(
            'Billettene dine vil ikke være tilgjengelig i appen hvis du logger ut. De blir tilgjengelige igjen hvis du logger inn.',
            'Your tickets will be inaccessible in the app after logging out. You can access them again by logging in.',
          ),
          alert: {
            cancel: _('Avbryt', 'Cancel'),
            confirm: _('Logg ut', 'Log out'),
          },
        },
        expiredTickets: {
          label: _('Utløpte billetter', 'Expired tickets'),
        },
        paymentOptions: {
          label: _('Betalingsmåter', 'Payment options'),
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
      frontPage: _('Prøv ny forside', 'Try the new Front Page'),
    },
    settings: {
      heading: _('Innstillinger', 'Settings'),
      linkItems: {
        userProfile: {
          label: _('Standard reisende', 'Default traveller'),
        },
        travelToken: {
          label: _(
            'Bruk billett på t:kort / mobil',
            'Use ticket on t:card / phone',
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
        frontpageFavourites: {
          label: _('Forside-favoritter', 'Frontpage favourites'),
          a11yHint: _(
            'Aktivér for å endre favoritt-avganger på forsiden',
            'Activate to edit front page favourite departures',
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
          confirmTitle: _(
            'Er du sikker på at du vil slette søkehistorikk?',
            'Are you sure you want to delete your search history?',
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
export default ProfileTexts;
