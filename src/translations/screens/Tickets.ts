import {translation as _} from '../commons';

const TicketsTexts = {
  header: {
    title: _('Billetter', 'Tickets'),
    leftButton: {
      a11yLabel: _('Gå til startside', 'Go to start page'),
    },
  },
  buyTicketsTab: {
    label: _('Kjøp', 'Buy'),
    button: {
      text: _('Kjøp ny billett', 'Buy new ticket'),
      a11yHint: _(
        'Aktivér for å kjøpe ny billett',
        'Activate to buy a new ticket',
      ),
    },
  },
  activeTicketsTab: {
    label: _('Aktive', 'Valid'),
    noTickets: _('Du har ingen aktive billetter', 'No valid tickets right now'),
  },
  expiredTicketsTab: {
    label: _('Utløpte', 'Expired'),
    noTickets: _(
      'Fant ingen billetthistorikk',
      'Nothing to show here until you have purchased a ticket',
    ),
  },
  ticket: {
    valid: {
      a11yLabel: _('Gyldig billett', 'Valid ticket'),
      text: (duration: string) =>
        _(`Gyldig i ${duration}`, `Valid for ${duration}`),
      durationDelimiter: _(` og `, 'and'),
    },
    expired: {
      a11yLabel: _('Utløpt billett', 'Expired ticket'),
      text: (dateTime: string) =>
        _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`),
    },
  },
  reservation: {
    processing: _(
      'Prosesseres... ikke gyldig enda',
      'Processing... not yet valid',
    ),
    approved: _(
      'Betaling godkjent. Henter billett...',
      'Payment succeessful. Fetching ticket...',
    ),
    orderId: (orderId: string) =>
      _(`Ordre-id ${orderId}`, `Order ID ${orderId}`),
    paymentType: {
      vipps: _('Vipps'),
      creditcard: _('kredittkort', 'credit card'),
    },
    goToVipps: _('Gå til Vipps for betaling', 'Go to Vipps for payment'),
  },
};
export default TicketsTexts;
