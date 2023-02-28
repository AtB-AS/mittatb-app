import {TransportMode} from '@atb/api/types/generated/journey_planner_v3_types';
import {translation as _} from '../commons';
import {orgSpecificTranslations} from '@atb/translations';

const FareContractTexts = {
  organizationName: _('AtB', 'AtB'),
  detailsLink: {
    valid: _('Vis detaljer / kontroll', 'Show details / inspection'),
    notValid: _('Vis detaljer', 'Show details'),
  },
  validityHeader: {
    valid: (duration: string) =>
      _(`Gyldig i ${duration}`, `Valid through ${duration}`),
    recentlyExpired: (duration: string) =>
      _(`Utløpt for ${duration} siden`, `Expired since ${duration}`),
    expired: (dateTime: string) =>
      _(`Utløpt ${dateTime}`, `Expired ${dateTime}`),
    refunded: _(`Refundert`, 'Refunded'),
    upcoming: (duration: string) =>
      _(`Blir gyldig om ${duration}`, `Becomes valid in ${duration}`),
    reserving: _(`Reserverer…`, `Reserving…`),
    unknown: _(`Ukjent`, `Unknown`),
    inactive: _(`Inaktiv`, `Inactive`),
    inactiveCarnet: _(`Ingen aktive klipp`, `No active ticket`),
    uninspectable: (duration: string) =>
      _(`Utløper ${duration}`, `Expires ${duration}`),
    durationDelimiter: _(' og ', ' and '),
  },
  usedAccessValidityIcon: {
    valid: _(`Gyldig billett`, `Valid ticket`),
    upcoming: _(`Kommende klipp`, `Upcoming ticket`),
    inactive: _(`Ingen aktive klipp`, `No active ticket`),
  },
  details: {
    header: {
      title: _('Billettdetaljer', 'Ticket details'),
    },
    paymentMethod: _('Betalingsmetode: ', 'Payment Method: '),
    orderId: (orderId: string) =>
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`),
    purchaseTime: (dateTime: string) =>
      _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`),
    validFrom: (dateTime: string) =>
      _(`Gyldig fra ${dateTime}`, `Valid from ${dateTime}`),
    validTo: (dateTime: string) =>
      _(`Gyldig til ${dateTime}`, `Valid to ${dateTime}`),
    askForReceipt: _('Få kvittering tilsendt', 'Get receipt sent'),
    barcodeA11yLabel: _(
      'Barkode. Vis frem denne koden ved billettkontroll',
      'Barcode. Show this code in case of inspection. ',
    ),
    barcodeErrors: {
      notInspectableDevice: {
        title: _('Barkode', 'Barcode'),
        wrongDevice: (deviceName: string) =>
          _(
            `Du bruker billetter på din mobil, "${deviceName}". Husk å ta den med deg når du reiser.\nDu kan alltid bytte til t:kort eller en annen mobil ved å gå til **Min profil**.`,
            `Seems like you\'re using your ticket on your phone, "${deviceName}". Remember to bring it with you while traveling.\nYou can always switch to a t:card or a different phone by heading over to **My profile**.`,
          ),
        unnamedDevice: _('Enhet uten navn', 'Unnamed device'),
        tCard: _(
          'Du bruker billetten på ditt t:kort. Husk å ta det med deg når du reiser.\nDu kan alltid bytte til en mobil ved å gå til **Min profil**.',
          `Seems like you\'re using your ticket on your t:card. Remember to bring it with you while traveling.\nYou can always switch to your phone by heading over to **My profile**.`,
        ),
      },
      generic: {
        title: _('En feil har oppstått', 'An error has ocurred'),
        text: _('Får ikke generert barkode.', 'Cannot generate a barcode.'),
        retry: _('Prøv på nytt.', 'Try again.'),
      },
    },
  },
  carnet: {
    numberOfUsedAccessesRemaining: (count: number) =>
      _(`${count} klipp gjenstår`, `${count} tickets left`),
  },
  receipt: {
    header: {
      title: _('Send kvittering', 'Send receipt'),
    },
    inputLabel: _('E-post', 'E-mail'),
    sendButton: _('Send', 'Send'),
    messages: {
      loading: _('Sender kvittering...', 'Sending receipt'),
      error: _(
        'Oops! Noe feilet under sending av kvittering, kan du prøve igjen? 🤞',
        'Whops, something failed during the transfer of receipt. Please try again 🤞',
      ),
      success: (email: string, reference: string) =>
        _(
          `Din kvittering ble sendt til ${email} med referansen: ${reference}.`,
          `Your receipt was sent to ${email} with reference number: ${reference}.`,
        ),
      invalidField: _(
        'E-post adressen er ikke gyldig. fyll inn en gyldig e-postadresse og trykk "Send".',
        'The e-mail address is invalid. Enter a valid e-mail address and press "Send"',
      ),
      defaultFallback: _(
        'Du kan få tilsendt kvittering på e-post. Fyll inn din e-postadresse under, og trykk "Send".',
        'To receive your receipt, enter your e-mail address below',
      ),
    },
  },
  unknownFareContract: {
    message: _('Ukjent billett', 'Unknown ticket'),
    orderId: (orderId: string) =>
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`),
  },
  fareContractInfo: {
    noInspectionIcon: _('Ugyldig\ni kontroll', 'Invalid in\ninspection'),
    noInspectionIconA11yLabel: _('Ugyldig i kontroll', 'Invalid in inspection'),
  },
  label: {
    travellers: _('Reisende', 'Travellers'),
    zone: _('Sone', 'Zone'),
  },
  warning: {
    unableToRetrieveToken: _(
      'Feil ved uthenting av t:kort / mobil',
      'Error retrieving t:card / phone',
    ),
    noInspectableTokenFound: _(
      'Du må bruke billett på t:kort eller mobil',
      'You must use a ticket on t:card or phone',
    ),
    travelCardAstoken: _(
      'Bruk t:kort når du reiser',
      'Bring your t:card when you travel',
    ),
    anotherMobileAsToken: (deviceName?: string) =>
      _(
        `Bruk ${deviceName} når du reiser`,
        `Bring ${deviceName} when you travel`,
      ),
    carnetWarning: _(
      'Vennligst bytt til t:kort for å kunne bruke dette klippekortet.',
      'Please switch to t:card to be able to use this punch card.',
    ),
    anotherPhoneIsInspectableWarning: (deviceName: string) =>
      _(
        `Merk at billetter du kjøper nå vil være tilknyttet ${deviceName}. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min profil**.`,
        `This ticket will be connected to ${deviceName}. If you would rather use tickets on this phone, you can switch to this device from **My profile**.`,
      ),
    tcardIsInspectableWarning: _(
      'Merk at billetter du kjøper nå vil være tilknyttet ditt t:kort. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min profil**.',
      'This ticket will be connected to your t:card. If you would rather use tickets on this phone, you can switch to this device from **My profile**.',
    ),
    unnamedDevice: _('Enhet uten navn', 'Unnamed device'),
  },
  transportMode: (mode: TransportMode) => {
    switch (mode) {
      case TransportMode.Bus:
      case TransportMode.Coach:
        return _('buss', 'bus');
      case TransportMode.Rail:
        return _('tog', 'train');
      case TransportMode.Tram:
        return _('trikk', 'tram');
      case TransportMode.Water:
        return _('båt', 'boat');
      case TransportMode.Air:
        return _('fly', 'plane');
      case TransportMode.Metro:
        return _('T-bane', 'metro');
      default:
        return _('ukjent transportmiddel', 'unknown transport');
    }
  },
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
            ),
          tCard: _(
            'Du bruker billetten på ditt reisekort. Husk å ta det med deg når du reiser.\nDu kan alltid bytte til en mobil ved å gå til **Min profil**.',
            `Seems like you\'re using your ticket on your travel card. Remember to bring it with you while traveling.\nYou can always switch to your phone by heading over to **My profile**.`,
          ),
        },
      },
    },
    warning: {
      unableToRetrieveToken: _(
        'Feil ved uthenting av reisekort / mobil',
        'Error retrieving travel card / phone',
      ),
      noInspectableTokenFound: _(
        'Du må bruke billett på reisekort eller mobil',
        'You must use a ticket on travel card or phone',
      ),
      travelCardAstoken: _(
        'Bruk reisekort når du reiser',
        'Bring your travel card when you travel',
      ),
      carnetWarning: _(
        'Vennligst bytt til reisekort for å kunne bruke dette klippekortet.',
        'Please switch to travel card to be able to use this punch card.',
      ),
      tcardIsInspectableWarning: _(
        'Merk at billetter du kjøper nå vil være tilknyttet ditt reisekort. Om du heller vil bruke billett på denne mobilen kan du endre det fra **Min profil**.',
        'This ticket will be connected to your travel card. If you would rather use tickets on this phone, you can switch to this device from **My profile**.',
      ),
    },
  },
});
