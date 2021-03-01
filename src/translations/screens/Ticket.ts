import {translation as _} from '../commons';

const TicketTexts = {
  zone: {
    single: (zoneName: string) => _(`Sone ${zoneName}`, `Zone ${zoneName}`),
    multiple: (zoneNameFrom: string, zoneNameTo: string) =>
      _(
        `Sone ${zoneNameFrom} til sone ${zoneNameTo}`,
        `Zone ${zoneNameFrom} to zone ${zoneNameTo}`,
      ),
  },
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
    durationDelimiter: _(' og ', ' and '),
  },
  details: {
    header: {
      title: _('Billettdetaljer', 'Ticket details'),
    },
    orderId: (orderId: string) =>
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`),
    purchaseTime: (dateTime: string) =>
      _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`),
    askForRefund: _('Be om refusjon', 'Request refund '),
    askForReceipt: _('Be om kvittering', 'Request receipt'),
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
      defaultFallback: _(
        'Du kan få tilsendt kvittering på e-post. Fyll inn din e-postadresse under, og trykk "Send".',
        'To receive your receipt, enter your e-mail adress below',
      ),
    },
  },
  unknownTicket: {
    message: _('Ukjent billett', 'Unknown ticket'),
    orderId: (orderId: string) =>
      _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`),
  },
};
export default TicketTexts;
