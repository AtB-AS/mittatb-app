import {translation as _} from '../commons';
import orgSpecificTranslations from '../utils';

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
    inactiveCarnet: _(`Ingen aktive klipp`, `No active ticket`),
    uninspectable: (duration: string) =>
      _(`Utløper ${duration}`, `Expires ${duration}`),
    durationDelimiter: _(' og ', ' and '),
  },
  validityIcon: {
    valid: _(`Gyldig billett`, `Valid ticket`),
    reserving: _(`Reserverer billett`, `Reserving ticket`),
    expired: _(`Utløpt billett`, `Expired ticket`),
    refunded: _(`Refundert billett`, 'Refunded ticket'),
    upcoming: _(`Kommende billett`, `Upcoming ticket`),
    unknown: _(`Ukjent billett`, `Unknown ticket`),
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
    orderId: (orderId: string) =>
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`),
    purchaseTime: (dateTime: string) =>
      _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`),
    askForReceipt: _('Be om kvittering', 'Request receipt'),
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
      notInspectable: {
        title: _(
          'Ikke tillatt å generere QR-kode',
          'Not allowed to generate QR-code',
        ),
        text: _(
          'Kan ikke generere en QR-kode siden denne telefonen ikke er satt som aktivt reisebevis.',
          'Cannot generate a QR-code because this device is not set as the active travel token.',
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
    travelcardIsActive: _(
      'Du har valgt **t:kort** som gyldig reisebevis',
      'You have specified **t:card** as valid travel token',
    ),
    noInspectionIcon: _('Ikke bruk\ni kontroll', 'Not for\ninspection'),
    noInspectionIconA11yLabel: _('Ikke bruk i kontroll', 'Not for inspection'),
  },
};

export default orgSpecificTranslations(TicketTexts, {
  atb: {},
  nfk: {
    ticketInfo: {
      travelcardIsActive: _(
        'Du har valgt **reisekort** som gyldig reisebevis',
        'You have specified **travelcard** as valid travel token',
      ),
    },
  },
});
