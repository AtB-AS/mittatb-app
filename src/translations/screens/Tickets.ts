import orgSpecificTranslations from '@atb/translations/utils';
import {translation as _} from '../commons';

const bulletPoint = '\u2022';

const TicketsTexts = {
  header: {
    title: _('Billetter', 'Tickets'),
  },
  buyTicketsTab: {
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
  activeTicketsTab: {
    label: _('Aktive', 'Valid'),
    a11yLabel: _('Aktive billetter', 'Active tickets'),
    noTickets: _('Du har ingen aktive billetter', 'No valid tickets right now'),
    noTicketsExpiredHelpText: _(
      'Du har ingen aktive billetter. Utløpte billetter finner du under Min profil-fanen.',
      'You have no valid tickets right now. Expired tickets can be found under the My profile tab.',
    ),
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
  availableTickets: {
    allTickets: _('Alle billetter', 'All products'),
    navigateToBuy: _(
      'Aktivér for å gå til kjøp',
      'Activate to go to purchasing',
    ),
    singleTicket: {
      title: _('Enkeltbillett', 'Single ticket'),
      description: _(
        'Når du skal reise av og til',
        'When you travel occasionally',
      ),
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
    periodTicket: {
      title: _('Periodebillett', 'Periodic ticket'),
      description: _(
        'Når du reiser litt oftere',
        'When you travel more frequently',
      ),
      pilot_description: _('', ''),
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
    hour24: {
      title: _('24-timersbillett', '24 hour pass'),
      description: _(
        'Når du vil reise flere ganger på et døgn',
        'For travelling several times in 24 hours',
      ),
      pilot_description: _('', ''),
      transportModes: _('Buss/trikk', 'Bus/tram'),
    },
    summerPass: {
      title: _('AtB SommerPass', 'Summer pass'),
      description: _(
        'Utforsk Trøndelag med buss, tog, hurtigbåt, ferge og trikk i sju dager. Reis så mye du vil! ',
        'Explore Trøndelag by bus, train, tram, passenger boat or ferry, for 7 days. Travel as much as you like!',
      ),
      transportModes: _('Flere reisemåter', 'Several travel modes'),
    },
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
      approved: (type: string) => _(`Betalt med ${type}`, `Paid with ${type}`),
    },
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

export default orgSpecificTranslations(TicketsTexts, {
  nfk: {
    travelCardInformation: {
      illustrationa11yLabel: (travelCardId: string) =>
        _(
          `Illustrasjon av reisekort med kortnummer som inneholder ${travelCardId}`,
          `Illustration of travelcard with card number that contains ${travelCardId}`,
        ),
      cardType: _('reisekort', 'travelcard'),
      onInspection: _(
        'I billettkontroll må du vise reisekortet ditt',
        'In the event of an inspection, please present your travelcard',
      ),
    },
  },
});
