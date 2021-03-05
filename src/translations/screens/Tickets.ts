import {translation as _} from '../commons';

const TicketsTexts = {
  header: {
    title: _('Billetter', 'Tickets'),
  },
  buyTicketsTab: {
    label: _('Kjøp', 'Buy'),
    loginReason: _(
      'For å kjøpe periodebillett må du være logget inn.',
      'To buy a period ticket you have to be signed in.',
    ),
    button: {
      single: {
        text: _('Ny enkeltbillett', 'New single ticket'),
        a11yHint: _(
          'Aktivér for å kjøpe ny enkeltbillett',
          'Activate to buy a new single ticket',
        ),
      },
      period: {
        text: _('Ny periodebillett', 'New period ticket'),
        a11yHint: _(
          'Aktivér for å kjøpe ny periodebillett',
          'Activate to buy a new period ticket',
        ),
      },
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
  recentTickets: {
    title: _('Sist kjøpte billetter', 'Recently purchased tickets'),
    loading: _('Laster siste kjøp…', 'Loading recent purchases'),
    a11yHint: _(
      'Aktivér for å kjøpe denne billetten',
      'Activate to purchase this ticket',
    ),
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
  scrollView: {
    errorLoadingTicket: (orderId: string) =>
      _(
        `Noe gikk feil når vi prøvde å laste inn billett med ordre-id ${orderId}`,
        `Something went wrong when we tried to load ticket with order id ${orderId}`,
      ),
  },
};
export default TicketsTexts;
