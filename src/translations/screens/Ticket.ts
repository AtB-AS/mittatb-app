import {translation as _} from '../commons';

const TicketTexts = {
  ticketsSummary: (n: number) => _(n > 1 ? `${n} billetter` : '1 billett'),
  zone: {
    single: (zoneName: string) => _(`Sone ${zoneName}`, `Zone ${zoneName}`),
    multiple: (zoneNameFrom: string, zoneNameTo: string) =>
      _(
        `Sone ${zoneNameFrom} til sone ${zoneNameTo}`,
        `Zone ${zoneNameFrom} to zone ${zoneNameTo}`,
      ),
  },
  controlLink: _('Vis for kontroll'),
  validityHeader: {
    valid: (duration: string) => _(`Gyldig i ${duration}`),
    refunded: _(`Refundert`),
    recentlyExpired: (duration: string) => _(`Utløpt for ${duration} siden`),
    expired: (dateTime: string) => _(`Utløpt ${dateTime}`),
    durationDelimiter: _(' og ', ' and '),
  },
  details: {
    header: {
      leftButton: {
        a11yLabel: _('Gå tilbake'),
      },
      title: _('Billettdetaljer'),
    },
    orderId: (orderId: string) => _(`Ordre-id: ${orderId}`),
    purchaseTime: (dateTime: string) => _(`Kjøpt ${dateTime}`),
    askForRefund: _('Be om refusjon'),
    askForReceipt: _('Be om kvittering'),
  },
  receipt: {
    header: {
      leftButton: {
        a11yLabel: _('Gå tilbake'),
      },
      title: _('Send kvittering'),
    },
    inputLabel: _('E-post'),
    sendButton: _('Send'),
    messages: {
      loading: _('Sender kvittering...'),
      error: _(
        'Oops! Noe feilet under sending av kvittering, kan du prøve igjen? 🤞',
      ),
      success: (email: string, reference: string) =>
        _(
          `Din kvittering ble sendt til ${email} med referansen: ${reference}.`,
        ),
      defaultFallback: _(
        'Du kan få tilsendt kvittering på e-post. Fyll inn din e-postadresse under, og trykk "Send".',
      ),
    },
  },
};
export default TicketTexts;
