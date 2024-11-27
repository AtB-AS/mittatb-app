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
        paymentMethods: {
          label: _('Betalingskort', 'Payment cards', 'Betalingskort'),
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
        claimsError: _(
          'Det oppstod et problem ved lasting av kontoen din.',
          'There was a problem loading your account.',
          'Det oppstod eit problem ved lasting av kontoen din.',
        ),
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
              'Tillet AtB å sende varslingar til denne telefonen.',
            ),
          },
          emailToggle: {
            text: _('E-post', 'E-mail', 'E-post'),
            subText: (email: string) =>
              _(
                `Tillat at AtB sender varslinger til ${email}`,
                `Allow AtB to send notifications to ${email}`,
                `Tillet AtB å sende varslingar til ${email}`,
              ),
            noEmailPlaceholder: _(
              'Tillat at AtB sender varslinger til e-posten din.',
              'Allow AtB to send notifications to your e-mail.',
              'Tillet AtB å sende varslingar til e-posten din.',
            ),
          },
          button: _('Legg til e-post', 'Add e-mail address', 'Legg til e-post'),
          loginRequired: {
            title: _('Krever innlogging', 'Login required', 'Krev innlogging'),
            message: _(
              'Logg inn for å benytte e-postvarsel.',
              'Log in to use e-mail notifications.',
              'Logg inn for å nytte e-postvarslingar.',
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
              'Tillating krevjast',
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
              'Tillating krevjast',
            ),
            message: _(
              'Du må tillate appen å sende deg varslinger for å få beskjed før billettene dine utløper.',
              'You have to allow the app to send you notifications to be informed before your tickets expire.',
              'Du må tillate appen å sende deg varsel for å bli informert før billettane dine går ut.',
            ),
            action: _(
              'Velg tillatelser',
              'Choose permissions',
              'Vel tillating',
            ),
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
        travelAid: {
          label: _('Tilgjengelighet', 'Accessibility', 'Tilgjengelegheit'),
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
            'Tillating krevjast',
          ),
          message: _(
            'Gi tilgang til Bluetooth for å dele dine reisevaner.',
            'Enable Bluetooth to share your travel habits.',
            'Gi tilgang til Bluetooth for å dele dine reisevanar.',
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
          a11yLabel: _(
            'Billettkjøp, åpner side i nettleser',
            'Ticketing, opens page in browser',
            'Billettkjøp, åpner side i nettlesar',
          ),
        },
        terms: {
          label: _('Betingelser', 'Terms', 'Vilkår'),
          a11yLabel: _(
            'Betingelser, åpner side i nettleser',
            'Terms, opens page in browser',
            'Vilkår, åpner side i nettlesar',
          ),
        },
        inspection: {
          label: _('Billettkontroll', 'Ticket inspection', 'Billettkontroll'),
          a11yLabel: _(
            'Billettkontroll, åpner side i nettleser',
            'Ticket inspection, opens page in browser',
            'Billettkontroll, åpner side i nettlesar',
          ),
        },
        refund: {
          label: _('Refusjon', 'Refund', 'Refusjon'),
          a11yLabel: _(
            'Refusjon, åpner side i nettleser',
            'Refund, opens page in browser',
            'Refusjon, åpner side i nettlesar',
          ),
        },
        accessibilityStatement: {
          label: _(
            'Tilgjengelighetserklæring',
            'Accessibility statement',
            'Tilgjengelegheitserklæring',
          ),
          a11yLabel: _(
            'Tilgjengelighetserklæring, åpner side i nettleser',
            'Accessibility statement, opens page in browser',
            'Tilgjengelegheitserklæring, åpner side i nettlesar',
          ),
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
  orgNumber: (orgNr: string) =>
    _(`Org.nr: ${orgNr}`, `Org.no: ${orgNr}`, `Org.nr: ${orgNr}`),
  orgNumberA11yLabel: (orgNr: string) =>
    _(
      `Organisasjonsnummer ${orgNr}`,
      `Organisation number ${orgNr}`,
      `Organisasjonsnummer ${orgNr}`,
    ),
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
          notifications: {
            pushToggle: {
              subText: _(
                'Tillat at Reis Nordland sender varslinger til denne telefonen.',
                'Allow Reis Nordland to send notifications to this phone.',
                'Tillet Reis Nordland å sende varslingar til denne telefonen.',
              ),
            },
            emailToggle: {
              subText: (email: string) =>
                _(
                  `Tillat at Reis Nordland sender varslinger til ${email}`,
                  `Allow Reis Nordland to send notifications to ${email}`,
                  `Tillet Reis Nordland å sende varslingar til ${email}`,
                ),
              noEmailPlaceholder: _(
                'Tillat at Reis Nordland sender varslinger til e-posten din.',
                'Allow Reis Nordland to send notifications to your e-mail.',
                'Tillet Reis Nordland å sende varslingar til e-posten din.',
              ),
            },
            permissionRequired: {
              message: _(
                'Skru på varslinger i telefoninnstillingene for å motta varslinger fra Reis Nordland.',
                'Enable notifications in Settings to receive notifications from Reis Nordland.',
                'Skru på varslingar i telefoninnstillingane for å få varslingar frå Reis Nordland.',
              ),
            },
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
          notifications: {
            pushToggle: {
              subText: _(
                'Tillat at FRAM sender varslinger til denne telefonen.',
                'Allow FRAM to send notifications to this phone.',
                'Tillet FRAM å sende varslingar til denne telefonen.',
              ),
            },
            emailToggle: {
              subText: (email: string) =>
                _(
                  `Tillat at FRAM sender varslinger til ${email}`,
                  `Allow FRAM to send notifications to ${email}`,
                  `Tillet FRAM å sende varslingar til ${email}`,
                ),
              noEmailPlaceholder: _(
                'Tillat at FRAM sender varslinger til e-posten din.',
                'Allow FRAM to send notifications to your e-mail.',
                'Tillet FRAM å sende varslingar til e-posten din.',
              ),
            },
            permissionRequired: {
              message: _(
                'Skru på varslinger i telefoninnstillingene for å motta varslinger fra FRAM.',
                'Enable notifications in Settings to receive notifications from FRAM.',
                'Skru på varslingar i telefoninnstillingane for å få varslingar frå FRAM.',
              ),
            },
          },
        },
      },
    },
  },
  troms: {
    sections: {
      settings: {
        linkSectionItems: {
          userProfile: {
            label: _(
              'Standard billettkategori',
              'Default ticket category',
              'Standard billettkategori',
            ),
          },
          travelToken: {
            label: _(
              'Bruk billett på reisekort / telefon',
              'Use ticket on travel card / phone',
              'Bruk billett på reisekort / telefon',
            ),
            labelWithoutTravelcard: _(
              'Bruk billett på telefon',
              'Use ticket on phone',
              'Bruk billett på telefon',
            ),
          },
          notifications: {
            pushToggle: {
              subText: _(
                'Tillat at Svipper sender varslinger til denne telefonen.',
                'Allow Svipper to send notifications to this phone.',
                'Tillet Svipper å sende varslingar til denne telefonen.',
              ),
            },
            emailToggle: {
              subText: (email: string) =>
                _(
                  `Tillat at Svipper sender varslinger til ${email}`,
                  `Allow Svipper to send notifications to ${email}`,
                  `Tillet Svipper å sende varslingar til ${email}`,
                ),
              noEmailPlaceholder: _(
                'Tillat at Svipper sender varslinger til e-posten din.',
                'Allow Svipper to send notifications to your e-mail.',
                'Tillet Svipper å sende varslingar til e-posten din.',
              ),
            },
            permissionRequired: {
              message: _(
                'Skru på varslinger i telefoninnstillingene for å motta varslinger fra Svipper.',
                'Enable notifications in Settings to receive notifications from Svipper.',
                'Skru på varslingar i telefoninnstillingane for å få varslingar frå Svipper.',
              ),
            },
          },
        },
      },
    },
  },
});
