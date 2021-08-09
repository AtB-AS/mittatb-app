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
    reactivateSplash: {
      message: _(
        'I en periode gjelder enkelte vilkår for billettkjøp i appen.',
        'For a period, some conditions apply for ticket purchase in the app.',
      ),
      linkText: _('Les mer her', 'Read more here'),
      linkA11yHint: _(
        'Les mer om betingelser for billettkjøp her',
        'Read more about conditions for buying tickets here',
      ),
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
    title: _('Kjøp på nytt', 'Purchase again'),
    loading: _('Laster tidligere kjøp', 'Loading recent purchases'),
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
      'Payment successful. Fetching ticket...',
    ),
    orderId: (orderId: string) =>
      _(`Ordre-id ${orderId}`, `Order ID ${orderId}`),
    paymentType: {
      vipps: _('Vipps', 'Vipps'),
      creditcard: _('kredittkort', 'credit card'),
    },
    paymentStage: {
      processing: (type: string) =>
        _(`Betales med ${type}`, `Payment using ${type}`),
      approved: (type: string) => _(`Betalt med ${type}`, `Payed with ${type}`),
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
    title: _('Prøv billettkjøp', 'Try buying tickets'),
    description: _(
      'Les og godta vilkårene for å kjøpe billetter. Flere billetter og betalingsmåter kommer!',
      'Read and accept these terms to buy tickets. More tickets and payment methods are coming.',
    ),
    paragraphHeading: _('Akkurat nå kan du:', 'Right now you can:'),
    bullet1: _(
      `${bulletPoint} Kjøpe enkeltbillett for buss og trikk.`,
      `${bulletPoint} Buy single tickets for bus and tram.`,
    ),
    bullet2: _(
      `${bulletPoint} Betale med Vipps.`,
      `${bulletPoint} Payment with Vipps.`,
    ),
    bullet3: _(
      `${bulletPoint} Kun bruke billetten på den telefonen du har gjennomført kjøpet med.`,
      `${bulletPoint} Only use the ticket on the phone you made the purchase with.`,
    ),
    bullet4: _(
      `${bulletPoint} Be om kvittering på e-post fra “billettdetaljer”.`,
      `${bulletPoint} Request an e-mail receipt from “Ticket details”`,
    ),
    button: _('Godta', 'Accept'),
  },
};

export default TicketsTexts;
