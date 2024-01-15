import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const ProfileTexts = {
  header: {
    title: _('Min profil', 'My profile', 'Min profil'),
  },
  sections: {
    account: {
      heading: _('Min konto', 'My account', 'Min konto'),
      linkSectionItems: {
        login: {
          label: _('Logg inn', 'Log in', 'Logg inn'),
        },
        logout: {
          label: _('Logg ut', 'Log out', 'Logg ut'),
          confirmTitle: _(
            'Er du sikker på at du vil logge ut?',
            'Are you sure you want to log out?',
            'Er du sikker på at du vil logge ut?',
          ),
          confirmMessage: _(
            'Billettene dine vil ikke være tilgjengelig i appen hvis du logger ut. De blir tilgjengelige igjen hvis du logger inn.',
            'Your tickets will be inaccessible in the app after logging out. You can access them again by logging in.',
            'Billettane dine vil ikkje vere tilgjengeleg i appen hvis du loggar ut. Dei blir tilgjengelege igjen når du loggar inn.',
          ),
          alert: {
            cancel: _('Avbryt', 'Cancel', 'Avbryt'),
            confirm: _('Logg ut', 'Log out', 'Logg ut'),
          },
        },
        ticketHistory: {
          label: _('Billetthistorikk', 'Ticket history', 'Billetthistorikk'),
        },
        paymentOptions: {
          label: _('Betalingsmåter', 'Payment options', 'Betalingsmåtar'),
        },
        editProfile: {
          label: _(
            'Rediger Min profil',
            'Edit My profile',
            'Rediger Min profil',
          ),
        },
      },
      infoItems: {
        customerNumber: _('Kundenummer', 'Customer number', 'Kundenummer'),
        phoneNumber: _('Telefonnummer', 'Phone number', 'Telefonnummer'),
      },
    },
    newFeatures: {
      heading: _('Ny funksjonalitet', 'New features', 'Ny funksjonalitet'),
      departures: _(
        'Prøv ny avganger-visning',
        'Try the new departure view',
        'Prøv ny visning av avgangar',
      ),
      assistant: _(
        'Prøv ny reisesøkmotor',
        'Try the new travel search engine',
        'Prøv ny reisesøkemotor',
      ),
      map: _('Prøv ny kartside', 'Try the new map page', 'Prøv ny kartside'),
    },
    settings: {
      heading: _('Innstillinger', 'Settings', 'Innstillingar'),
      linkSectionItems: {
        userProfile: {
          label: _(
            'Standard reisende',
            'Default traveller',
            'Standard reisande',
          ),
        },
        travelToken: {
          label: _(
            'Bruk billett på t:kort / mobil',
            'Use ticket on t:card / phone',
            'Bruk billett på t:kort / mobil',
          ),
          labelWithoutTravelcard: _(
            'Bruk billett på mobil',
            'Use ticket on phone',
            'Bruk billett på mobil',
          ),
        },
        appearance: {
          label: _('Utseende', 'Appearance', 'Utsjånad'),
        },
        startScreen: {
          label: _('Startside', 'Start page', 'Startside'),
        },
        language: {
          label: _('Språk', 'Language', 'Språk'),
        },
        privacy: {
          label: _('Personvern', 'Privacy', 'Personvern'),
        },
        notifications: {
          label: _('Varslinger', 'Notifications', 'Varslingar'),
          heading: _('Varslinger', 'Notifications', 'Varslingar'),
          modesHeading: _('Type varsel', 'Notification type', 'Type varsel'),
          groupsHeading: _('Varslinger', 'Notifications', 'Varslingar'),
          pushToggle: {
            text: _('Push-varsel', 'Push notifications', 'Push-varsel'),
            subText: _(
              'Tillat at AtB sender varslinger til denne telefonen.',
              'Allow AtB to send notifications to this phone.',
              'Gi AtB løyve til å sende varslingar til denne telefonen.',
            ),
          },
          emailToggle: {
            text: _('E-post', 'E-mail', 'E-post'),
            subText: (email: string) =>
              _(
                `Tillat at AtB sender varslinger til ${email}`,
                `Allow AtB to send notifications to ${email}`,
                `Gi AtB løyve til å sende varslingar til ${email}`,
              ),
            noEmailPlaceholder: _(
              'Tillat at AtB sender varslinger til e-posten din.',
              'Allow AtB to send notifications to your e-mail.',
              'Gi AtB løyve til å sende varslingar til e-posten din.',
            ),
          },
          button: _('Legg til e-post', 'Add e-mail address', 'Legg til e-post'),
          loginRequired: {
            title: _('Krever innlogging', 'Login required', 'Krev innlogging'),
            message: _(
              'Logg inn for å for å benytte e-postvarsel.',
              'Log in to use e-mail notifications.',
              'Logg inn for å nytte deg av e-postvarslingar.',
            ),
          },
          emailRequired: {
            title: _('E-post mangler', 'E-mail missing', 'E-post manglar'),
            message: _(
              'Legg til e-post i min profil for å benytte e-postvarsel.',
              'Add e-mail to my profile to use e-mail notifications.',
              'Legg til e-post i min profil for å bruke e-postvarsel.',
            ),
            action: _(
              'Legg til e-post',
              'Add e-mail address',
              'Legg til e-post',
            ),
          },
          permissionRequired: {
            title: _(
              'Tillatelse kreves',
              'Permission required',
              'Løyve krevjast',
            ),
            message: _(
              'Skru på varslinger i telefoninnstillingene for å motta varslinger fra AtB.',
              'Enable notifications in Settings to receive notifications from AtB.',
              'Skru på varslingar i telefoninnstillingane for å få varslingar frå AtB.',
            ),
            action: _(
              'Åpne telefoninnstillinger',
              'Open Settings',
              'Opne telefoninnstillingar',
            ),
          },
          promptRequired: {
            title: _(
              'Tillatelse kreves',
              'Permission required',
              'Løyve krevjast',
            ),
            message: _(
              'Du må tillate appen å sende deg varslinger for å få beskjed før billettene dine utløper.',
              'You have to allow the app to send you notifications to be informed before your tickets expire.',
              'Du må tillate appen å sende deg varsel for å bli informert før billettane dine går ut.',
            ),
            action: _('Velg tillatelser', 'Choose permissions', 'Vel løyve'),
          },
          permissionError: {
            title: _('Oops!', 'Whoops!', 'Oops!'),
            message: _(
              'Det har oppstått en feil. Prøv igjen senere 🤞',
              'An error ocurred. Please try again later 🤞',
              'Det har skjedd ein feil. Prøv igjen seinare 🤞',
            ),
          },
        },
        enrollment: {
          label: _('Invitasjonskode', 'Invitation code', 'Invitasjonskode'),
        },
      },
    },
    favorites: {
      heading: _('Favoritter', 'Favourites', 'Favorittar'),
      linkSectionItems: {
        places: {
          label: _('Steder', 'Locations', 'Stadar'),
          a11yHint: _(
            'Aktivér for å endre favorittsteder',
            'Activate to edit locations',
            'Klikk for å endre favorittstadar',
          ),
        },
        departures: {
          label: _('Avganger', 'Departures', 'Avgangar'),
          a11yHint: _(
            'Aktivér for å endre favoritt-avganger',
            'Activate to edit favourite departures',
            'Klikk for å endre favorittavgangar',
          ),
        },
        frontpageFavourites: {
          label: _(
            'Avganger på forside',
            'Dashboard departures',
            'Avgangar på framside',
          ),
          a11yHint: _(
            'Aktivér for å endre favoritt-avganger på forsiden',
            'Activate to edit front page favourite departures',
            'Klikk for å endre favorittavgangar på framside',
          ),
        },
      },
    },
    privacy: {
      heading: _('Personvern', 'Privacy', 'Personvern'),
      linkSectionItems: {
        privacy: {
          label: _(
            'Personvernerklæring',
            'Privacy statement',
            'Personvernerklæring',
          ),
          a11yHint: _(
            'Aktivér for å lese personvernerklæring på ekstern side',
            'Activate to read our privacy statement (external content)',
            'Aktiver for å lese personvernerklæring på ekstern side',
          ),
        },
        permissionRequired: {
          title: _(
            'Tillatelse kreves',
            'Permission required',
            'Løyve krevjast',
          ),
          message: _(
            'Gi tilgang til Bluetooth for å dele dine reisevaner.',
            'Enable Bluetooth to share your travel habits.',
            'Gi løyve til Bluetooth for å dele dine reisevanar.',
          ),
          action: _(
            'Åpne telefoninnstillinger',
            'Open Settings',
            'Opne telefoninnstillingar',
          ),
        },
        clearHistory: {
          label: _(
            'Tøm søkehistorikk',
            'Clear search history',
            'Tøm søkehistorikk',
          ),
          a11yHint: _(
            'Aktivér for å tømme tidligere søk',
            'Activate to clear previous searches',
            'Klikk for å tømme tidlegare søk',
          ),
          confirmTitle: _(
            'Er du sikker på at du vil slette søkehistorikk?',
            'Are you sure you want to delete your search history?',
            'Er du sikker på at du vil slette søkehistorikk?',
          ),
          alert: {
            cancel: _('Avbryt', 'Cancel', 'Avbryt'),
            confirm: _('Tøm historikk', 'Clear history', 'Tøm historikk'),
          },
        },
      },
    },
    information: {
      heading: _('Info og priser', 'Info and prices', 'Info og prisar'),
      linkSectionItems: {
        ticketing: {
          label: _('Billettkjøp', 'Ticketing', 'Billettkjøp'),
        },
        terms: {
          label: _('Betingelser', 'Terms', 'Vilkår'),
        },
        inspection: {
          label: _('Billettkontroll', 'Ticket inspection', 'Billettkontroll'),
        },
        refund: {
          label: _('Refusjon', 'Refund', 'Refusjon'),
        },
      },
    },
  },
  installId: {
    label: _('ID', 'ID', 'ID'),
    wasCopiedAlert: _(
      'ID ble kopiert!',
      'ID was copied to clipboard!',
      'ID vart kopiert!',
    ),
    a11yHint: _(
      'Klikk for å kopiere id. Denne brukes til teknisk feilsøk.',
      'Press to copy the id. This is used for technical debugging',
      'Klikk for å kopiere id. Denne blir brukt til teknisk feilsøk.',
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
              'Bruk billett på reisekort / mobil',
            ),
          },
        },
      },
    },
  },
  fram: {
    header: {
      title: _('Min bruker', 'My user', 'Min brukar'),
    },
    sections: {
      settings: {
        linkSectionItems: {
          travelToken: {
            label: _(
              'Bruk billett på reisekort / mobil',
              'Use ticket on travel card / phone',
              'Bruk billett på reisekort / mobil',
            ),
          },
        },
      },
    },
  },
});
