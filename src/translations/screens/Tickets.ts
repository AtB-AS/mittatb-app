import {translation as _} from '../commons';

const bulletPoint = '\u2022';

const TicketsTexts = {
  header: {
    title: _('Billetter', 'Tickets'),
  },
  buyTicketsTab: {
    label: _('Kjøp', 'Buy'),
    a11yLabel: _('Kjøp billetter', 'Buy tickets'),
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
    a11yLabel: _('Aktive billetter', 'Active tickets'),
    noTickets: _('Du har ingen aktive billetter', 'No valid tickets right now'),
  },
  expiredTicketsTab: {
    label: _('Utløpte', 'Expired'),
    a11yLabel: _('Utløpte billetter', 'Expired tickets'),
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
      vipps: _('Vipps', 'Vipps'),
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
  informational: {
    title: _('Prøv billettkjøp', 'Try ticket purchasing'),
    description: _(
      'Les og godta vilkårene nedenfor, så kan du kjøpe billetter fra appen. Flere billettyper og betalingsmåter vil komme på plass snarlig!',
      'Please accept the following terms to unlock app ticketing. More ticket categories and payment services will be added shortly.',
    ),
    paragraphHeading: _(
      'Akkurat nå kan vi tilby:',
      'Currently we are offering:',
    ),
    bullet1: _(
      `${bulletPoint} Kjøp av enkeltbilletter for buss og trikk.`,
      `${bulletPoint} Single tickets – bus and tram.`,
    ),
    bullet2: _(
      `${bulletPoint} Betaling med Vipps.`,
      `${bulletPoint} Payment by Vipps app.`,
    ),
    bullet3: _(
      `${bulletPoint} Anonyme kjøp: Billetten er kun tilgjengelig fra den telefonen du har brukt til billettkjøpet.`,
      `${bulletPoint} Anonymous purchases: Tickets are exclusive for the device used to purchase the ticket.`,
    ),
    bullet4: _(
      `${bulletPoint} Kvittering kan sendes til e-post fra “billettdetaljer”.`,
      `${bulletPoint} Receipts on-demand – sent to your specified e-mail via “ticket details”.`,
    ),
    button: _('Godta', 'Accept'),
  },
};

export default TicketsTexts;
