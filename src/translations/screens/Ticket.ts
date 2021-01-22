import {translation as _} from '../commons';

const TicketTexts = {
  ticketsSummary: (n: number) => _(n > 1 ? `${n} billetter, 'tickets'` : '1 billett', '1 ticket'),
  zone: (zoneName: string) => _(`Sone ${zoneName}`, `Zone ${zoneName}`),
  controlLink: _('Vis for kontroll', 'Show for inspection'),
  validityHeader: {
    valid: (duration: string) => _(`Gyldig i ${duration}`, `Valid through ${duration}`),
    recentlyExpired: (duration: string) => _(`Utløpt for ${duration} siden`, `Expired since ${duration}`),
    expired: (dateTime: string) => _(`Utløpt ${dateTime}`, `Expired ${dateTime}`),
    durationDelimiter: _(' og ', ' and '),
  },
  details: {
    header: {
      leftButton: {
        a11yLabel: _('Gå tilbake', 'Go back'),
      },
      title: _('Billettdetaljer', 'Ticket details'),
    },
    orderId: (orderId: string) => _(`Ordre-id: ${orderId}`, `Order ID: ${orderId}`),
    purchaseTime: (dateTime: string) => _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`),
    askForRefund: _('Be om refusjon', 'Request refund '),
    askForReceipt: _('Be om kvittering', 'Request receipt'),
  },
  receipt: {
    header: {
      leftButton: {
        a11yLabel: _('Gå tilbake', 'Go back'),
      },
      title: _('Send kvittering', 'Send receipt'),
    },
    inputLabel: _('E-post', 'E-mail'),
    sendButton: _('Send', 'Send'),
    messages: {
      loading: _('Sender kvittering...', 'Sending receipt'),
      error: _(
        'Oops! Noe feilet under sending av kvittering, kan du prøve igjen? 🤞', 'Whops, something failed during the transfer of receipt. Please try again 🤞',
      ),
      success: (email: string, reference: string) =>
        _(
          `Din kvittering ble sendt til ${email} med referansen: ${reference}.`, 'Your receipt was sent to ${email} with refernce number: ${reference}.'
        ),
      defaultFallback: _(
        'Du kan få tilsendt kvittering på e-post. Fyll inn din e-postadresse under, og trykk "Send".', 'To receive your receipt, enter your e-mail adress below',
      ),
    },
  },
};
export default TicketTexts;
