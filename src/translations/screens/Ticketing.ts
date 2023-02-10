import {orgSpecificTranslations} from '@atb/translations';
import {translation as _} from '../commons';

const bulletPoint = '\u2022';

const TicketingTexts = {
  header: {
    title: _('Billetter', 'Tickets'),
  },
  purchaseTab: {
    label: _('Kjøp', 'Buy'),
    a11yLabel: _('Kjøp billetter', 'Buy tickets'),
    button: {
      single: {
        text: _('Ny enkeltbillett', 'New single ticket'),
        a11yHint: _(
          'Aktivér for å kjøpe ny enkeltbillett',
          'Activate to buy a new single ticket',
        ),
      },
      period: {
        text: _('Ny periodebillett', 'New periodic ticket'),
        a11yHint: _(
          'Aktivér for å kjøpe ny periodebillett',
          'Activate to buy a new periodic ticket',
        ),
      },
    },
    reactivateSplash: {
      message: _(
        'Foreløpig kan du kjøpe **enkeltbillett** for buss/trikk i appen. Andre billettyper finner du i appen **AtB Mobilett**.\n\n',
        'Right now, the app offers **single tickets** for bus/tram only. Use the app **AtB Mobilett** to purchase other ticket types.\n\n',
      ),
      linkText: _('Les mer her', 'Read more'),
      linkA11yHint: _(
        'Les mer om betingelser for billettkjøp her',
        'Read more about conditions for buying tickets here',
      ),
    },
  },
  activeFareProductsAndReservationsTab: {
    label: _('Aktive', 'Active'),
    a11yLabel: _('Aktive billetter', 'Active tickets'),
    noItems: _('Du har ingen aktive billetter.', 'You have no active tickets.'),
    noItemsHistoryHelpText: _(
      'Du har ingen aktive billetter. Billetthistorikk finner du under Min profil-fanen.',
      'You have no active tickets right now. Ticket history can be found under the My profile tab.',
    ),
  },
  ticketHistoryTab: {
    noItems: _(
      'Fant ingen billetthistorikk.',
      'Nothing to show here until you have purchased a ticket.',
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
  recentFareContracts: {
    title: _('Kjøp på nytt', 'Purchase again'),
    loading: _('Laster tidligere kjøp', 'Loading recent purchases'),
    a11yHint: _(
      'Aktivér for å kjøpe denne billetten',
      'Activate to purchase this ticket',
    ),
  },
  availableFareProducts: {
    allTickets: _('Alle billetter', 'All products'),
    navigateToBuy: _(
      'Aktivér for å gå til kjøp',
      'Activate to go to purchasing',
    ),
    single: {
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
    night: {
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
    period: {
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
    hour24: {
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
    summerPass: {
      transportModes: _('Flere reisemåter', 'Several travel modes'),
    },
    carnet: {
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
  },
  reservation: {
    reserving: _(
      'Prosesseres... ikke gyldig enda',
      'Processing... not yet valid',
    ),
    approved: _(
      'Betaling godkjent. Henter billett...',
      'Payment successful. Fetching ticket...',
    ),
    rejected: _(
      'Billetten er ikke gyldig. Betaling avvist.',
      'Ticket is not valid. Payment rejected',
    ),
    orderId: (orderId: string) =>
      _(`Ordre-ID: ${orderId}`, `Order ID: ${orderId}`),
    orderDate: (orderDate: string) =>
      _(`Bestillingsdato: ${orderDate}`, `Order date: ${orderDate}`),
    paymentMethod: (paymentMethod: string) =>
      _(
        `Betalingsmetode: ${paymentMethod}`,
        `Payment Method: ${paymentMethod}`,
      ),
    goToVipps: _('Gå til Vipps for betaling', 'Go to Vipps for payment'),
  },
  scrollView: {
    errorLoadingTicket: (orderId: string) =>
      _(
        `Noe gikk feil når vi prøvde å laste inn billett med ordre-id ${orderId}`,
        `Something went wrong when we tried to load ticket with order id ${orderId}`,
      ),
    paymentError: _(
      'Betalingen mislyktes. Sjekk om du har tilstrekkelige midler på konto eller prøv et annet betalingsmiddel.',
      'Payment failed. Please check that you have sufficient funds on your account or try a different payment option.',
    ),
    paymentErrorButton: _('Lukk', 'Close'),
  },
  travelCardInformation: {
    reisebevis: _('Reisebevis', 'Travel token'),
    onInspection: _(
      'I billettkontroll må du vise t:kortet ditt',
      'In the event of an inspection, please present your t:card',
    ),
    changeInstructions: _(
      'Kan endres fra "Min profil"',
      'Can be changed from "My profile"',
    ),
    cardType: _('t:kort', 't:card'),
    illustrationa11yLabel: (travelCardId: string) =>
      _(
        `Illustrasjon av t kort med kortnummer som inneholder ${travelCardId}`,
        `Illustration of t card with card number that contains ${travelCardId}`,
      ),
  },
  informational: {
    title: _('Prøv billettkjøp', 'Try buying tickets'),
    description: _(
      'For å kjøpe billett må du lese og godta vilkårene. Flere billettyper er på vei!',
      'To buy a ticket, you must read and accept the terms. More ticket types are on the way!',
    ),
    paragraphHeading: _('Akkurat nå kan du:', 'Right now you can:'),
    bullet1: _(
      `${bulletPoint} Kjøpe enkeltbillett for buss og trikk.`,
      `${bulletPoint} Buy single tickets for bus and tram.`,
    ),
    bullet2: _(
      `${bulletPoint} Betale med Vipps og betalingskort.`,
      `${bulletPoint} Payment with Vipps and debit card.`,
    ),
    bullet3: _(
      `${bulletPoint} Få tilsendt kvittering på epost fra billettdetaljer.`,
      `${bulletPoint} Receive a receipt by email from ticket details.`,
    ),
    button: _('Godta', 'Accept'),
  },
  ticketStatusSymbolA11yLabel: {
    refunded: _('Tilbakebetalt billett', 'Refunded ticket'),
    expired: _('Utløpt billett', 'Expired ticket'),
    rejected: _('Avvist billett', 'Rejected ticket'),
    upcoming: _('Kommende billett', 'Upcoming ticket'),
    approved: _('Godkjent billett', 'Approved ticket'),
  },
};

export default orgSpecificTranslations(TicketingTexts, {
  nfk: {
    travelCardInformation: {
      illustrationa11yLabel: (travelCardId: string) =>
        _(
          `Illustrasjon av reisekort med kortnummer som inneholder ${travelCardId}`,
          `Illustration of travel card with card number that contains ${travelCardId}`,
        ),
      cardType: _('reisekort', 'travel card'),
      onInspection: _(
        'I billettkontroll må du vise reisekortet ditt',
        'In the event of an inspection, please present your travel card',
      ),
    },
  },
});
