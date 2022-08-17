import {translation as _} from '../commons';

const TicketTexts = {
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
    askForReceipt: _('Få kvittering tilsendt', 'Get receipt sent'),
    qrCodeA11yLabel: _(
      'QR kode. Vis frem denne koden ved billett kontroll',
      'QR code. Show this code in case of inspection. ',
    ),
    qrCodeCountdown: (secondsLeft: number) =>
      _(
        `QR-kode oppdateres om ${secondsLeft} sek.`,
        `QR-code will update in ${secondsLeft} sec.`,
      ),
    qrCodeErrors: {
      notInspectableDevice: {
        title: _('QR-kode', 'QR code'),
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
        text: _('Får ikke generert QR-kode.', 'Cannot generate a QR-code.'),
        retry: _('Prøv på nytt.', 'Try again.'),
      },
      missingNetwork: {
        title: _('Mangler nettilgang', 'Missing network access'),
        text: _(
          'Får ikke hentet QR-kode uten tilgang på nett. Sjekk om du har skrudd på mobildata.',
          `Cannot generate a QR-code without network access. Check if you've enabled mobile data`,
        ),
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
  unknownTicket: {
    message: _('Ukjent billett', 'Unknown ticket'),
    orderId: (orderId: string) =>
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`),
  },
  ticketInfo: {
    noInspectionIcon: _('Ikke bruk\ni kontroll', 'Not for\ninspection'),
    noInspectionIconA11yLabel: _('Ikke bruk i kontroll', 'Not for inspection'),
  },
  label: {
    travellers: _('Reisende', 'Travellers'),
    zone: _('Sone', 'Zone'),
  },
  warning: {
    unableToRetrieveToken: _(
      'Feil ved uthenting av t:kort / mobil',
      'Error retrieving  t:card / phone',
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
      'Vennligst bytt til t:card for å kunne bruke dette hullkortet.',
      'Please switch to t:card to be able to use this punch card.',
    ),
    unnamedDevice: _('Enhet uten navn', 'Unnamed device'),
  },
};
export default TicketTexts;
