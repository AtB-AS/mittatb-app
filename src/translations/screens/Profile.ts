import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const ProfileTexts = {
  header: {
    title: _('Min profil', 'My profile'),
  },
  sections: {
    account: {
      heading: _('Min konto', 'My account'),
      linkSectionItems: {
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
        ticketHistory: {
          label: _('Billetthistorikk', 'Ticket history'),
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
      ticketAssistant: _(
        'Vis ny billettveileder',
        'Show the new ticket assistant',
      ),
      map: _('Prøv ny kartside', 'Try the new map page'),
    },
    settings: {
      heading: _('Innstillinger', 'Settings'),
      linkSectionItems: {
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
      linkSectionItems: {
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
          label: _('Avganger på forside', 'Dashboard departures'),
          a11yHint: _(
            'Aktivér for å endre favoritt-avganger på forsiden',
            'Activate to edit front page favourite departures',
          ),
        },
      },
    },
    privacy: {
      heading: _('Personvern', 'Privacy'),
      linkSectionItems: {
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
      linkSectionItems: {
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
export default orgSpecificTranslations(ProfileTexts, {
  nfk: {
    sections: {
      settings: {
        linkSectionItems: {
          travelToken: {
            label: _(
              'Bruk billett på reisekort / mobil',
              'Use ticket on travel card / phone',
            ),
          },
        },
      },
    },
  },
  fram: {
    header: {
      title: _('Min bruker', 'My user'),
    },
    sections: {
      settings: {
        linkSectionItems: {
          travelToken: {
            label: _(
              'Bruk billett på reisekort / mobil',
              'Use ticket on travel card / phone',
            ),
          },
        },
      },
    },
  },
});
