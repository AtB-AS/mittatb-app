import {TransportModeType, TransportSubmodeType} from '@atb-as/config-specs';
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
      _(
        `Gyldig i ${duration}`,
        `Valid through ${duration}`,
        `Gyldig i ${duration}`,
      ),
    recentlyExpired: (duration: string) =>
      _(
        `Utløpt for ${duration} siden`,
        `Expired since ${duration}`,
        `Utgått for ${duration} sidan`,
      ),
    expired: (dateTime: string) =>
      _(`Utløpt ${dateTime}`, `Expired ${dateTime}`, `Utgått ${dateTime}`),
    refunded: _(`Refundert`, 'Refunded', `Refundert`),
    upcoming: (duration: string) =>
      _(
        `Blir gyldig om ${duration}`,
        `Becomes valid in ${duration}`,
        `Blir gyldig om ${duration}`,
      ),
    reserving: _(`Reserverer…`, `Reserving…`, `Reserverar…`),
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
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`, `Ordre-id: ${orderId}`),
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
    askForReceipt: _(
      'Få kvittering tilsendt',
      'Get receipt sent',
      'Få kvittering tilsendt',
    ),
    barcodeA11yLabel: _(
      'Barkode. Vis frem denne koden ved billettkontroll',
      'Barcode. Show this code in case of inspection. ',
      'Barkode. Vis denne koden ved billettkontroll.',
    ),
    barcodeErrors: {
      notInspectableDevice: {
        title: _('Barkode', 'Barcode', 'Barkode'),
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
          'Får ikke generert barkode.',
          'Cannot generate a barcode.',
          'Får ikkje generert barkode.',
        ),
        retry: _('Prøv på nytt.', 'Try again.', 'Prøv på nytt.'),
      },
    },
    harbors: {
      directions: (from: string, to: string) =>
        _(
          `Fra ${from}, til ${to}`,
          `From ${from}, to ${to}`,
          `Frå ${from}, til ${to}`,
        ),
      error: _(
        'Kunne ikke laste kaier.',
        'Could not load harbors.',
        'Kunne ikkje laste kaier.',
      ),
    },
  },
  carnet: {
    numberOfUsedAccessesRemaining: (count: number) =>
      _(
        `${count} klipp gjenstår`,
        `${count} tickets left`,
        `${count} klipp att`,
      ),
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
  unknownFareContract: {
    message: _('Ukjent billett', 'Unknown ticket', 'Ukjent billett'),
    orderId: (orderId: string) =>
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`, `Ordre-id: ${orderId}`),
  },
  fareContractInfo: {
    noInspectionIcon: _(
      'Ugyldig\ni kontroll',
      'Invalid in\ninspection',
      'Ugyldig\ni kontroll',
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
  },
  warning: {
    unableToRetrieveToken: _(
      'Feil ved uthenting av t:kort / mobil',
      'Error retrieving t:card / phone',
      'Feil ved uthenting av t:kort / mobil',
    ),
    noInspectableTokenFound: _(
      'Du må bruke billett på t:kort eller mobil',
      'You must use a ticket on t:card or phone',
      'Du må bruke billett på t:kort eller mobil',
    ),
    travelCardAstoken: _(
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
    carnetWarning: _(
      'Vennligst bytt til t:kort for å kunne bruke dette klippekortet.',
      'Please switch to t:card to be able to use this punch card.',
      'Ver venleg og byt til t:kort for å kunne bruke dette klippekortet.',
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
    multipleTravelModes: _(
      'Flere reisemåter',
      'Several travel modes',
      'Fleire reisemåtar',
    ),
    a11yLabel: (transportModes: string) =>
      _(
        `Billetten gjelder ${transportModes}`,
        `Ticket is valid on ${transportModes}`,
        `Billetten gjeld ${transportModes}`,
      ),
    a11yLabelMultipleTravelModes: (count: number) =>
      _(
        `Totalt ${count} reisemåter`,
        `In total ${count} travel modes`,
        `Totalt ${count} reisemåtar`,
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
          return _('hurtigbåt', 'passenger boat', 'hurtigbåt');
        } else if (subMode === 'highSpeedVehicleService') {
          // https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/825393529/Norwegian+submodes+and+their+definitions
          // -> "A high-speed boat service with car carrying capacity. The ship type is usually a catamaran."
          return _('hurtigbåt', 'passenger boat', 'hurtigbåt');
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
  otherFareContracts: _(
    'Andre billettyper',
    'Other tickets',
    'Andre billettypar',
  ),
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
      unableToRetrieveToken: _(
        'Feil ved uthenting av reisekort / mobil',
        'Error retrieving travel card / phone',
        'Feil ved uthenting av reisekort / mobil',
      ),
      noInspectableTokenFound: _(
        'Du må bruke billett på reisekort eller mobil',
        'You must use a ticket on travel card or phone',
        'Du må bruke billett på reisekort eller mobil',
      ),
      travelCardAstoken: _(
        'Bruk reisekort når du reiser',
        'Bring your travel card when you travel',
        'Ta med deg reisekortet når du reiser',
      ),
      carnetWarning: _(
        'Vennligst bytt til reisekort for å kunne bruke dette klippekortet.',
        'Please switch to travel card to be able to use this punch card.',
        'Ver venleg og byt til reisekort for å kunne bruke dette klippekortet.',
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
      unableToRetrieveToken: _(
        'Feil ved uthenting av reisekort / mobil',
        'Error retrieving travel card / phone',
        'Feil ved uthenting av reisekort / mobil',
      ),
      noInspectableTokenFound: _(
        'Du må bruke billett på reisekort eller mobil',
        'You must use a ticket on travel card or phone',
        'Du må bruke billett på reisekort eller mobil',
      ),
      travelCardAstoken: _(
        'Bruk reisekort når du reiser',
        'Bring your travel card when you travel',
        'Ta med deg reisekortet når du reiser',
      ),
      carnetWarning: _(
        'Vennligst bytt til reisekort for å kunne bruke dette klippekortet.',
        'Please switch to travel card to be able to use this punch card.',
        'Ver venleg og byt til reisekort for å bruke dette klippekortet.',
      ),
      tcardIsInspectableWarning: _(
        'Merk at billetter du kjøper nå vil være tilknyttet ditt reisekort. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min bruker**.',
        'This ticket will be connected to your travel card. If you would rather use tickets on this phone, you can switch to this device from **My user**.',
        'Merk at billettar du kjøper no vil vere tilknytt ditt reisekort. Om du heller vil bruke billettar på denne mobilen, kan du bytte til denne eininga frå **Min brukar**.',
      ),
    },
  },
});
