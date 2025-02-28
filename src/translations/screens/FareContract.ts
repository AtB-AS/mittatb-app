import {TransportModeType, TransportSubmodeType} from '@atb/configuration';
import {TransportMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const FareContractTexts = {
  organizationName: _('AtB', 'AtB', 'AtB'),
  detailsLink: {
    valid: _(
      'Vis detaljer / kontroll',
      'Show details / inspection',
      'Vis detaljer / kontroll',
    ),
    notValid: _('Vis detaljer', 'Show details', 'Vis detaljar'),
  },
  validityHeader: {
    valid: (duration: string) =>
      _(`${duration} igjen`, `${duration} left`, `${duration} igjen`),
    recentlyExpired: (duration: string) =>
      _(
        `Utløpt for ${duration} siden`,
        `Expired since ${duration}`,
        `Utgått for ${duration} sidan`,
      ),
    expired: (dateTime: string) =>
      _(`Utløpt ${dateTime}`, `Expired ${dateTime}`, `Utgått ${dateTime}`),
    refunded: _(`Refundert`, 'Refunded', `Refundert`),
    cancelled: _(`Kansellert`, 'Cancelled', `Kansellert`),
    upcoming: (duration: string) =>
      _(
        `Blir gyldig om ${duration}`,
        `Becomes valid in ${duration}`,
        `Blir gyldig om ${duration}`,
      ),
    reserving: _(`Reserverer…`, `Reserving…`, `Reserverar…`),
    sent: (dateTime: string) =>
      _(`Sendt ${dateTime}`, `Sent ${dateTime}`, `Sendt ${dateTime}`),
    unknown: _(`Ukjent`, `Unknown`, `Ukjent`),
    inactive: _(`Inaktiv`, `Inactive`, `Inaktiv`),
    inactiveCarnet: _(
      `Ingen aktive klipp`,
      `No active ticket`,
      `Ingen aktive klipp`,
    ),
    uninspectable: (duration: string) =>
      _(`Utløper ${duration}`, `Expires ${duration}`, `Går ut ${duration}`),
    durationDelimiter: _(' og ', ' and ', ' og '),
  },
  usedAccessValidityIcon: {
    valid: _(`Gyldig billett`, `Valid ticket`, `Gyldig billett`),
    upcoming: _(`Kommende klipp`, `Upcoming ticket`, `Kommande klipp`),
    inactive: _(`Ingen aktive klipp`, `No active ticket`, `Ingen aktive klipp`),
  },
  shmoDetails: {
    tripStarted: (dateTime: string) =>
      _(
        `Tur startet ${dateTime}`,
        `Trip started ${dateTime}`,
        `Tur startet ${dateTime}`,
      ),
    tripEnded: (dateTime: string) =>
      _(
        `Tur avsluttet ${dateTime}`,
        `Trip ended ${dateTime}`,
        `Tur avsluttet ${dateTime}`,
      ),
  },
  details: {
    header: {
      title: _('Billettdetaljer', 'Ticket details', 'Billettdetaljar'),
    },
    paymentMethod: _(
      'Betalingsmetode: ',
      'Payment Method: ',
      'Betalingsmetode: ',
    ),
    orderId: (orderId: string) =>
      _(`Ordre-ID: ${orderId}`, `Order ID: ${orderId}`, `Ordre-ID: ${orderId}`),
    bookingId: (bookingId: string) =>
      _(
        `Booking-ID: ${bookingId}`,
        `Booking ID: ${bookingId}`,
        `Booking-ID: ${bookingId}`,
      ),
    purchaseTime: (dateTime: string) =>
      _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`, `Kjøpt ${dateTime}`),
    validFrom: (dateTime: string) =>
      _(
        `Gyldig fra ${dateTime}`,
        `Valid from ${dateTime}`,
        `Gyldig frå ${dateTime}`,
      ),
    validTo: (dateTime: string) =>
      _(
        `Gyldig til ${dateTime}`,
        `Valid to ${dateTime}`,
        `Gyldig til ${dateTime}`,
      ),
    sentTo: (phoneNumber: string) =>
      _(
        `Denne billetten ble sendt til ${phoneNumber}`,
        `This ticket was sent to ${phoneNumber}`,
        `Denne billetten vart sendt til ${phoneNumber}`,
      ),
    purchasedBy: (phoneNumber: string) =>
      _(
        `Denne billetten ble kjøpt av ${phoneNumber}`,
        `This ticket was purchased by ${phoneNumber}`,
        `Denne billetten vart kjøpt av ${phoneNumber}`,
      ),
    totalPrice: (priceString: string) =>
      _(
        `Totalt: ${priceString} kr`,
        `Total: ${priceString} kr`,
        `Totalt: ${priceString} kr`,
      ),
    askForReceipt: _(
      'Få kvittering tilsendt',
      'Get receipt sent',
      'Få kvittering tilsendt',
    ),
    barcodeA11yLabel: _(
      'QR-kode. Vis frem denne koden ved billettkontroll.',
      'QR code. Show this code in case of inspection.',
      'QR-kode. Vis denne koden ved billettkontroll.',
    ),
    barcodeA11yLabelWithActivation: _(
      'QR-kode. Vis frem denne koden ved billettkontroll. Aktivér for å vise større QR-kode.',
      'QR code. Show this code in case of inspection. Activate for to show larger QR code.',
      'QR-kode. Vis denne koden ved billettkontroll. Aktivér for større QR-kode.',
    ),
    barcodeBottomSheetA11yLabel: _(
      'Stor QR-kode. Vis frem denne koden ved billettkontroll. Aktivér for å lukke dialog med stor QR-kode.',
      'Large QR code. Show this code in case of inspection. Activate to close dialog with small QR code',
      'Stor QR-kode. Vis denne koden ved billettkontroll. Aktivér for å late att dialog med stor QR-kode.',
    ),
    bottomSheetTitle: _('QR-kode', 'QR code', 'QR-kode'),
    barcodeErrors: {
      notInspectableDevice: {
        title: _('QR-kode', 'QR code', 'QR-kode'),
        wrongDevice: (deviceName: string) =>
          _(
            `Du bruker billetter på din mobil, "${deviceName}". Husk å ta den med deg når du reiser.\nDu kan alltid bytte til t:kort eller en annen mobil ved å gå til **Min profil**.`,
            `Seems like you\'re using your ticket on your phone, "${deviceName}". Remember to bring it with you while traveling.\nYou can always switch to a t:card or a different phone by heading over to **My profile**.`,
            `Du bruker billettar på mobilen din, "${deviceName}". Husk å ta den med deg når du reiser. Du kan alltid bytte til t:kort eller ein annan mobil ved å gå til **Min profil**.`,
          ),
        unnamedDevice: _(
          'Enhet uten navn',
          'Unnamed device',
          'Eining utan namn',
        ),
        tCard: _(
          'Du bruker billetten på ditt t:kort. Husk å ta det med deg når du reiser.\nDu kan alltid bytte til en mobil ved å gå til **Min profil**.',
          `Seems like you\'re using your ticket on your t:card. Remember to bring it with you while traveling.\nYou can always switch to your phone by heading over to **My profile**.`,
          'Du bruker billetten på t:kortet ditt. Husk å ta det med deg når du reiser. Du kan alltid bytte til ein mobil ved å gå til **Min profil**.',
        ),
      },
      generic: {
        title: _(
          'En feil har oppstått',
          'An error has occurred',
          'Ein feil har oppstått',
        ),
        text: _(
          'Får ikke generert QR-kode.',
          'Cannot generate a QR code.',
          'Får ikkje generert QR-kode.',
        ),
        retry: _('Prøv på nytt.', 'Try again.', 'Prøv på nytt.'),
      },
    },
    harbors: {
      error: _(
        'Kunne ikke laste kaier.',
        'Could not load harbors.',
        'Kunne ikkje laste kaier.',
      ),
    },
    fromTo: (from: string, to: string, isTwoWay: boolean) =>
      isTwoWay
        ? _(
            `Mellom ${from} og ${to}, i begge retninger`,
            `Between ${from} and ${to}, in both directions`,
            `Mellom ${from} og ${to}, i begge retningar`,
          )
        : _(
            `Fra ${from}, til ${to},`,
            `From ${from}, to ${to}`,
            `Frå ${from}, til ${to}`,
          ),
    validIn: (zone: string) =>
      _(`Gyldig i ${zone}`, `Valid in ${zone}`, `Gyldig i ${zone}`),
    infoButtonA11yHint: _(
      'Aktivér for å gå til billettinformasjon',
      'Activate to go to ticket information',
      'Aktivér for å gå til billetinformasjon',
    ),
    usedAccesses: _('Brukte klipp', 'Used tickets', 'Brukte klipp'),
  },
  activateNow: {
    startNow: _('Start billett nå', 'Start ticket now', 'Start billett no'),
    bottomSheetTitle: _(
      'Vil du starte billetten?',
      'Do you want to start the ticket?',
      'Vil du starte billetten?',
    ),
    bottomSheetDescription: _(
      'Billetten starter med en gang du bekrefter. Dette valget kan ikke angres.',
      'The ticket will start as soon as you confirm. This choice cannot be undone.',
      'Billetten startar med ein gong du bekreftar. Dette valet kan ikkje gjerast om på.',
    ),
    confirm: _('Bekreft og start', 'Confirm and start', 'Bekreft og start'),
    genericError: _(
      'En feil har oppstått under aktivering av billetten. Vennligst prøv igjen.',
      'An error occurred while activating the ticket. Please try again.',
      'Ein feil har oppstått under aktivering av billetten. Ver venleg og prøv igjen.',
    ),
  },
  carnet: {
    numberOfUsedAccessesRemaining: (count: number) =>
      _(
        `${count} enkeltbilletter gjenstår`,
        `${count} single ticket(s) left`,
        `${count} enkeltbillettar att`,
      ),
    activateCarnet: _(
      'Aktiver enkeltbillett',
      'Activate single ticket',
      'Aktiver enkeltbillett',
    ),
    bottomSheetTitle: _(
      'Aktiver én enkeltbillett',
      'Activate a single ticket',
      'Aktiver ein enkeltbillett',
    ),
    bottomSheetDescription: _(
      'Billetten blir gyldig med en gang. Man kan bare aktivere én enkeltbillett fra klippekortet om gangen.',
      'The ticket becomes valid immediately. You can only activate one single ticket from the punch card at a time.',
      'Billetten blir gyldig med ein gong. Du kan berre aktivere ein enkeltbillett frå klippekortet om gongen.',
    ),
    genericError: _(
      'En feil har oppstått under aktivering av billetten. Vennligst prøv igjen.',
      'An error occurred while activating the ticket. Please try again.',
      'Ein feil har oppstått under aktivering av billetten. Ver venleg og prøv igjen.',
    ),
  },
  school: {
    home: _('Hjem', 'Home', 'Heim'),
  },
  receipt: {
    header: {
      title: _('Send kvittering', 'Send receipt', 'Send kvittering'),
    },
    inputLabel: _('E-post', 'E-mail', 'E-post'),
    sendButton: _('Send', 'Send', 'Send'),
    messages: {
      loading: _(
        'Sender kvittering...',
        'Sending receipt',
        'Sender kvittering...',
      ),
      error: _(
        'Oops! Noe feilet under sending av kvittering, kan du prøve igjen? 🤞',
        'Whops, something failed during the transfer of receipt. Please try again 🤞',
        'Oops! Noko gjekk gale under sending av kvittering, kan du prøve igjen? 🤞',
      ),
      success: (email: string, reference: string) =>
        _(
          `Din kvittering ble sendt til ${email} med referansen: ${reference}.`,
          `Your receipt was sent to ${email} with reference number: ${reference}.`,
          `Di kvittering vart sendt til ${email} med referansen: ${reference}.`,
        ),
      invalidField: _(
        'E-postadressen er ikke gyldig. fyll inn en gyldig e-postadresse og trykk "Send".',
        'The e-mail address is invalid. Enter a valid e-mail address and press "Send"',
        'E-postadressen er ikkje gyldig. Fyll inn ei gyldig e-postadresse og trykk «Send».',
      ),
      defaultFallback: _(
        'Du kan få tilsendt kvittering på e-post. Fyll inn din e-postadresse under, og trykk "Send".',
        'To receive your receipt, enter your e-mail address below',
        'Her kan du få tilsendt kvittering på e-post. Fyll inn di e-postadresse under, og trykk «Send».',
      ),
    },
  },
  fareContractInfo: {
    noInspectionIcon: _(
      'Ikke bruk i\nkontroll',
      'Do not use in\ninspection',
      'Ikkje bruk i\nkontroll',
    ),
    noInspectionIconA11yLabel: _(
      'Ugyldig i kontroll',
      'Invalid in inspection',
      'Ugyldig i kontroll',
    ),
  },
  label: {
    travellers: _('Reisende', 'Travellers', 'Reisande'),
    zone: _('Sone', 'Zone', 'Sone'),
    transportModes: _(
      'Transportmiddel',
      'Means of transport',
      'Transportmiddel',
    ),
    includedBenefits: _(
      'Inkludert i billetten',
      'Included in the ticket',
      'Inkludert i billetten',
    ),
  },
  warning: {
    errorWithToken: _(
      'Feil ved uthenting av t:kort / mobil',
      'Error retrieving t:card / phone',
      'Feil ved uthenting av t:kort / mobil',
    ),
    travelCardAsToken: _(
      'Bruk t:kort når du reiser',
      'Bring your t:card when you travel',
      'Bruk t:kort når du reiser',
    ),
    anotherMobileAsToken: (deviceName?: string) =>
      _(
        `Bruk ${deviceName} når du reiser`,
        `Bring ${deviceName} when you travel`,
        `Bruk ${deviceName} når du reiser`,
      ),
    anotherPhoneIsInspectableWarning: (deviceName: string) =>
      _(
        `Merk at billetter du kjøper nå vil være tilknyttet ${deviceName}. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min profil**.`,
        `This ticket will be connected to ${deviceName}. If you would rather use tickets on this phone, you can switch to this device from **My profile**.`,
        `Merk at billettar du kjøper no vil være tilknytt ${deviceName}. Om du heller vil bruke billett på denne mobilen kan du endre det frå **Min profil**.`,
      ),
    tcardIsInspectableWarning: _(
      'Merk at billetter du kjøper nå vil være tilknyttet ditt t:kort. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min profil**.',
      'This ticket will be connected to your t:card. If you would rather use tickets on this phone, you can switch to this device from **My profile**.',
      'Merk at billettar du kjøper no vil vere tilknytt ditt t:kort. Om du heller vil bruke billett på denne mobilen kan du endre det frå **Min profil**.',
    ),
    unnamedDevice: _('Enhet uten navn', 'Unnamed device', 'Ukjent eining'),
  },
  transportModes: {
    more: _('Flere', 'More', 'Fleire'),
    a11yLabel: (transportModes: string) =>
      _(
        `Billetten gjelder ${transportModes}`,
        `Ticket is valid on ${transportModes}`,
        `Billetten gjeld ${transportModes}`,
      ),
    a11yLabelWithCustomText: (transportModes: string, customText: string) =>
      _(
        `Billetten gjelder ${transportModes}, produktgruppen heter ${customText}`,
        `Ticket is valid on ${transportModes}, product group is called ${customText}`,
        `Billetten gjeld ${transportModes}, produktgruppa heiter ${customText}`,
      ),
    concatListWord: _('og', 'and', 'og'),
  },
  transportMode: (mode: TransportModeType, subMode?: TransportSubmodeType) => {
    switch (mode) {
      case TransportMode.Bus:
      case TransportMode.Coach:
        return _('buss', 'bus', 'buss');
      case TransportMode.Rail:
        return _('tog', 'train', 'tog');
      case TransportMode.Tram:
        return _('trikk', 'tram', 'trikk');
      case TransportMode.Water:
        if (subMode === 'highSpeedPassengerService') {
          return _('hurtigbåt', 'express boat', 'hurtigbåt');
        } else if (subMode === 'highSpeedVehicleService') {
          // https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/825393529/Norwegian+submodes+and+their+definitions
          // -> "A high-speed boat service with car carrying capacity. The ship type is usually a catamaran."
          return _('hurtigbåt', 'express boat', 'hurtigbåt');
        } else {
          return _('båt', 'boat', 'båt');
        }
      case TransportMode.Air:
        return _('fly', 'plane', 'fly');
      case TransportMode.Metro:
        return _('T-bane', 'metro', 'T-bane');
      default:
        return _(
          'ukjent transportmiddel',
          'unknown transport',
          'ukjent transportmiddel',
        );
    }
  },
  otherFareContracts: _('Andre billetter', 'Other tickets', 'Andre billettar'),
};

export default orgSpecificTranslations(FareContractTexts, {
  nfk: {
    details: {
      barcodeErrors: {
        notInspectableDevice: {
          wrongDevice: (deviceName: string) =>
            _(
              `Du bruker billetter på din mobil, "${deviceName}". Husk å ta den med deg når du reiser.\nDu kan alltid bytte til reisekort eller en annen mobil ved å gå til **Min profil**.`,
              `Seems like you\'re using your ticket on your phone, "${deviceName}". Remember to bring it with you while traveling.\nYou can always switch to a travel card or a different phone by heading over to **My profile**.`,
              `Du brukar billettar på mobilen din, "${deviceName}". Husk å ha den med deg når du reiser.\nDu kan til ei kvar tid bytte til eit reisekort eller ein annan mobil ved å gå til **Min profil**.`,
            ),
          tCard: _(
            'Du bruker billetten på ditt reisekort. Husk å ta det med deg når du reiser.\nDu kan alltid bytte til en mobil ved å gå til **Min profil**.',
            `Seems like you\'re using your ticket on your travel card. Remember to bring it with you while traveling.\nYou can always switch to your phone by heading over to **My profile**.`,
            `Du brukar billetten på reisekortet ditt. Husk å ha det med deg når du reiser.\nDu kan til ei kvar tid bytte til mobil ved å gå til **Min profil**.`,
          ),
        },
      },
    },
    warning: {
      errorWithToken: _(
        'Feil ved uthenting av reisekort / mobil',
        'Error retrieving travel card / phone',
        'Feil ved uthenting av reisekort / mobil',
      ),
      travelCardAsToken: _(
        'Bruk reisekort når du reiser',
        'Bring your travel card when you travel',
        'Ta med deg reisekortet når du reiser',
      ),
      tcardIsInspectableWarning: _(
        'Merk at billetter du kjøper nå vil være tilknyttet ditt reisekort. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min profil**.',
        'This ticket will be connected to your travel card. If you would rather use tickets on this phone, you can switch to this device from **My profile**.',
        'Merk at billettar du kjøper no vil vere knytt til ditt reisekort. Om du heller vil bruke billettar på denne mobilen, kan du bytte til denne eininga frå **Min profil**.',
      ),
    },
  },
  fram: {
    details: {
      barcodeErrors: {
        notInspectableDevice: {
          wrongDevice: (deviceName: string) =>
            _(
              `Du bruker billetter på din mobil, "${deviceName}". Husk å ta den med deg når du reiser.\nDu kan alltid bytte til reisekort eller en annen mobil ved å gå til **Min bruker**.`,
              `Seems like you\'re using your ticket on your phone, "${deviceName}". Remember to bring it with you while traveling.\nYou can always switch to a travel card or a different phone by heading over to **My user**.`,
              `Du brukar billettar på mobilen din, "${deviceName}". Husk å ha den med deg når du reiser.\nDu kan til ei kvar tid bytte til eit reisekort eller ein annan mobil ved å gå til **Min brukar**.`,
            ),
          tCard: _(
            'Du bruker billetten på ditt reisekort. Husk å ta det med deg når du reiser.\nDu kan alltid bytte til en mobil ved å gå til **Min bruker**.',
            `Seems like you\'re using your ticket on your travel card. Remember to bring it with you while traveling.\nYou can always switch to your phone by heading over to **My user**.`,
            `Du brukar billetten på reisekortet ditt. Husk å ha det med deg når du reiser.\nDu kan til ei kvar tid bytte til mobil ved å gå til **Min brukar**.`,
          ),
        },
      },
    },
    warning: {
      errorWithToken: _(
        'Feil ved uthenting av reisekort / mobil',
        'Error retrieving travel card / phone',
        'Feil ved uthenting av reisekort / mobil',
      ),
      travelCardAsToken: _(
        'Bruk reisekort når du reiser',
        'Bring your travel card when you travel',
        'Ta med deg reisekortet når du reiser',
      ),
      tcardIsInspectableWarning: _(
        'Merk at billetter du kjøper nå vil være tilknyttet ditt reisekort. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min bruker**.',
        'This ticket will be connected to your travel card. If you would rather use tickets on this phone, you can switch to this device from **My user**.',
        'Merk at billettar du kjøper no vil vere tilknytt ditt reisekort. Om du heller vil bruke billettar på denne mobilen, kan du bytte til denne eininga frå **Min brukar**.',
      ),
    },
  },
});
