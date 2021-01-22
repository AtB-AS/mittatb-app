import {translation as _} from '../commons';

const TicketsTexts = {
  header: {
    title: _('Billetter', 'Tickets'),
    leftButton: {
      a11yLabel: _('Gå til startside', 'Go to start page'),
    },
  },
  activeTicketsTab: {
    label: _('Aktive', 'Valid'),
    noTickets: _('Du har ingen aktive billetter', 'No valid tickets'),
  },
  expiredTicketsTab: {
    label: _('Utløpte', 'Expired'),
    noTickets: _('Fant ingen billetthistorikk', 'Could not find any expired tickets'),
  },
  ticket: {
    valid: {
      a11yLabel: _('Gyldig billett', 'Valid ticket'),
      text: (duration: string) => _(`Gyldig i ${duration}`, `Valid for ${duration}`),
      durationDelimiter: _(` og `, 'and'),
    },
    expired: {
      a11yLabel: _('Utløpt billett', 'Expired ticket'),
      text: (dateTime: string) => _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`),
    },
  },
  reservation: {
    processing: _('Prosesseres... ikke gyldig enda', 'Processing... not yet valid'),
    approved: _('Betaling godkjent. Henter billett...', 'Payment succeessful. Fetching ticket...'),
    orderId: (orderId: string) => _(`Ordre-id ${orderId}`, `Order ID ${orderId}`),
    paymentType: {
      vipps: _('Vipps'),
      creditcard: _('kredittkort', 'credit card'),
    },
    goToVipps: _('Gå til Vipps for betaling', 'Go to Vipps for payment'),
  },
};
export default TicketsTexts;
