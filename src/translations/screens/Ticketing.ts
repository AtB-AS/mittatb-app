import {orgSpecificTranslations} from '../orgSpecificTranslations';
import {translation as _} from '../commons';

const bulletPoint = '\u2022';

const TicketingTexts = {
  header: {
    title: _('Billetter', 'Tickets', 'Billettar'),
  },
  purchaseTab: {
    label: _('Kjøp', 'Buy', 'Kjøp'),
    a11yLabel: _('Kjøp billetter', 'Buy tickets', 'Kjøp billettar'),
    button: {
      single: {
        text: _('Ny enkeltbillett', 'New single ticket', 'Ny enkeltbillett'),
        a11yHint: _(
          'Aktivér for å kjøpe ny enkeltbillett',
          'Activate to buy a new single ticket',
          'Aktiver for å kjøpe ny enkeltbillett',
        ),
      },
      period: {
        text: _(
          'Ny periodebillett',
          'New periodic ticket',
          'Ny periodebillett',
        ),
        a11yHint: _(
          'Aktivér for å kjøpe ny periodebillett',
          'Activate to buy a new periodic ticket',
          'Aktiver for å kjøpe ny periodebillett',
        ),
      },
    },
    reactivateSplash: {
      message: _(
        'Foreløpig kan du kjøpe **enkeltbillett** for buss/trikk i appen. Andre billettyper finner du i appen **AtB Mobilett**.\n\n',
        'Right now, the app offers **single tickets** for bus/tram only. Use the app **AtB Mobilett** to purchase other ticket types.\n\n',
        'Foreløpig kan du kjøpe **enkeltbillett** for buss/trikk i appen. Andre billettypar finn du i appen **AtB Mobilett**.\n\n',
      ),
      linkText: _('Les mer her', 'Read more', 'Les meir her'),
      linkA11yHint: _(
        'Les mer om betingelser for billettkjøp her',
        'Read more about conditions for buying tickets here',
        'Les meir om vilkåra for billettkjøp her',
      ),
    },
  },
  activeFareProductsAndReservationsTab: {
    label: _('Aktive', 'Active', 'Aktive'),
    a11yLabel: _('Aktive billetter', 'Active tickets', 'Aktive billettar'),
    noItems: _(
      'Du har ingen aktive billetter.',
      'You have no active tickets.',
      'Du har ingen aktive billettar.',
    ),
    noItemsHistoryHelpText: _(
      'Du har ingen aktive billetter. Billetthistorikk finner du under Min profil-fanen.',
      'You have no active tickets right now. Ticket history can be found under the My profile tab.',
      'Du har ingen aktive billettar. Billetthistorikk finn du under Min profil-fanen',
    ),
  },
  ticketHistoryTab: {
    noItems: _(
      'Fant ingen billetthistorikk.',
      'Nothing to show here until you have purchased a ticket.',
      'Fann ingen billetthistorikk.',
    ),
  },
  ticket: {
    valid: {
      a11yLabel: _('Gyldig billett', 'Valid ticket', 'Gyldig billett'),
      text: (duration: string) =>
        _(
          `Gyldig i ${duration}`,
          `Valid for ${duration}`,
          `Gyldig i ${duration}`,
        ),
      durationDelimiter: _(` og `, 'and', 'og'),
    },
    expired: {
      a11yLabel: _('Utløpt billett', 'Expired ticket', 'Utløpt billett'),
      text: (dateTime: string) =>
        _(`Kjøpt ${dateTime}`, `Purchased ${dateTime}`, `Kjøpt ${dateTime}`),
    },
  },
  recentFareContracts: {
    title: _('Kjøp på nytt', 'Purchase again', 'Kjøp på nytt'),
    loading: _(
      'Laster tidligere kjøp',
      'Loading recent purchases',
      'Lastar tidlegare kjøp',
    ),
    a11yHint: _(
      'Aktivér for å kjøpe denne billetten',
      'Activate to purchase this ticket',
      'Aktivér for å kjøpe denne billetten',
    ),
  },
  availableFareProducts: {
    allTickets: _('Alle billetter', 'All products', 'Alle billettar'),
    navigateToBuy: _(
      'Aktivér for å gå til kjøp',
      'Activate to go to purchasing',
      'Aktivér for å gå til kjøp',
    ),
    single: {
      transportModes: _('Buss/trikk', 'Bus/tram', 'Buss/trikk'),
    },
    night: {
      transportModes: _('Buss/trikk', 'Bus/tram', 'Buss/trikk'),
    },
    period: {
      transportModes: _('Buss/trikk', 'Bus/tram', 'Buss/trikk'),
    },
    hour24: {
      transportModes: _('Buss/trikk', 'Bus/tram', 'Buss/trikk'),
    },
    summerPass: {
      transportModes: _(
        'Flere reisemåter',
        'Several travel modes',
        'Fleire reisemåtar',
      ),
    },
    carnet: {
      transportModes: _('Buss/trikk', 'Bus/tram', 'Buss/trikk'),
    },
  },
  reservation: {
    reserving: _(
      'Prosesseres... ikke gyldig enda',
      'Processing... not yet valid',
      'Prosesseres... ikkje gyldig enda',
    ),
    approved: _(
      'Betaling godkjent. Henter billett...',
      'Payment successful. Fetching ticket...',
      'Betaling godkjent. Hentar billett...',
    ),
    rejected: _(
      'Billetten er ikke gyldig. Betaling avvist.',
      'Ticket is not valid. Payment rejected',
      'Billetten er ikkje gyldig. Betaling avvist.',
    ),
    orderId: (orderId: string) =>
      _(`Ordre-ID: ${orderId}`, `Order ID: ${orderId}`, `Ordre-ID: ${orderId}`),
    orderDate: (orderDate: string) =>
      _(
        `Bestillingsdato: ${orderDate}`,
        `Order date: ${orderDate}`,
        `Bestillingsdato: ${orderDate}`,
      ),
    paymentMethod: (paymentMethod: string) =>
      _(
        `Betalingsmetode: ${paymentMethod}`,
        `Payment Method: ${paymentMethod}`,
        `Betalingsmetode: ${paymentMethod}`,
      ),
    goToVipps: _(
      'Gå til Vipps for betaling',
      'Go to Vipps for payment',
      'Gå til Vipps for betaling',
    ),
  },
  scrollView: {
    errorLoadingTicket: (orderId: string) =>
      _(
        `Noe gikk galt da vi prøvde å laste inn billett med ordre-id ${orderId}`,
        `Something went wrong when we tried to load ticket with order id ${orderId}`,
        `Noko gjekk gale då vi prøvde å laste inn billett med ordre-id ${orderId}`,
      ),
    paymentError: _(
      'Betalingen mislyktes. Sjekk om du har tilstrekkelige midler på konto eller prøv et annet betalingsmiddel.',
      'Payment failed. Please check that you have sufficient funds on your account or try a different payment option.',
      'Betaling feila. Sjekk at du har tilstrekkeleg midlar på konto eller prøv ein anna betalingsmetode.',
    ),
    paymentErrorButton: _('Lukk', 'Close', 'Lukk'),
  },
  travelCardInformation: {
    reisebevis: _('Reisebevis', 'Travel token', 'Reisebevis'),
    onInspection: _(
      'I billettkontroll må du vise t:kortet ditt',
      'In the event of an inspection, please present your t:card',
      'I billettkontrollen må du vise t:kortet ditt',
    ),
    changeInstructions: _(
      'Kan endres fra "Min profil"',
      'Can be changed from "My profile"',
      'Kan endrast frå "Min profil"',
    ),
    cardType: _('t:kort', 't:card', 't:kort'),
    illustrationa11yLabel: (travelCardId: string) =>
      _(
        `Illustrasjon av t kort med kortnummer som inneholder ${travelCardId}`,
        `Illustration of t card with card number that contains ${travelCardId}`,
        `Illustrasjon av t kort med kortnummer som inneheld ${travelCardId}`,
      ),
  },
  informational: {
    title: _('Prøv billettkjøp', 'Try buying tickets', 'Prøv billettkjøp'),
    description: _(
      'For å kjøpe billett må du lese og godta vilkårene. Flere billettyper er på vei!',
      'To buy a ticket, you must read and accept the terms. More ticket types are on the way!',
      'For å kjøpe billett må du lese og godta vilkåra. Fleire billettypar er på veg!',
    ),
    paragraphHeading: _(
      'Akkurat nå kan du:',
      'Right now you can:',
      'Akkurat no kan du:',
    ),
    bullet1: _(
      `${bulletPoint} Kjøpe enkeltbillett for buss og trikk.`,
      `${bulletPoint} Buy single tickets for bus and tram.`,
      `${bulletPoint} Kjøpe enkeltbillett for buss og trikk.`,
    ),
    bullet2: _(
      `${bulletPoint} Betale med Vipps og betalingskort.`,
      `${bulletPoint} Payment with Vipps and debit card.`,
      `${bulletPoint} Betale med Vipps og betalingskort.`,
    ),
    bullet3: _(
      `${bulletPoint} Få tilsendt kvittering på epost fra billettdetaljer.`,
      `${bulletPoint} Receive a receipt by email from ticket details.`,
      `${bulletPoint} Få tilsendt kvittering på e-post frå billettdetaljar.`,
    ),
    button: _('Godta', 'Accept', 'Godta'),
  },
  ticketStatusSymbolA11yLabel: {
    refunded: _(
      'Tilbakebetalt billett',
      'Refunded ticket',
      'Tilbakebetalt billett',
    ),
    expired: _('Utløpt billett', 'Expired ticket', 'Utløpt billett'),
    rejected: _('Avvist billett', 'Rejected ticket', 'Avvist billett'),
    upcoming: _('Kommende billett', 'Upcoming ticket', 'Kommende billett'),
    approved: _('Godkjent billett', 'Approved ticket', 'Godkjent billett'),
  },
  ticketAssistantTile: {
    title: _('Billettveileder', 'Ticket assistant', 'Billettveileder'),
    description: _(
      'Få hjelp til å velge billetten som passer deg best.',
      'Get help choosing the ticket that suits you the best.',
      'Få hjelp til å velje billetten som passar deg best.',
    ),
    a11yHint: _(
      'Aktiver for å åpne billettveilederen',
      'Activate to open the ticket assistant',
      'Aktiver for å opne billettrettleiaren',
    ),
    label: _('FORSLAG', 'SUGGESTIONS', 'FORSLAG'),
  },
  tipsAndInformationTile: {
    title: _(
      'Tips og informasjon',
      'Tips and information',
      'Tips og informasjon',
    ),
    a11yHint: _(
      'Aktiver for å få tips og informasjon om biletter',
      'Activate to get tips and information about tickets',
      'Aktiver for å få tips og informasjon om billettar',
    ),
  },
};

export default orgSpecificTranslations(TicketingTexts, {
  nfk: {
    travelCardInformation: {
      illustrationa11yLabel: (travelCardId: string) =>
        _(
          `Illustrasjon av reisekort med kortnummer som inneholder ${travelCardId}`,
          `Illustration of travel card with card number that contains ${travelCardId}`,
          `Illustrasjon av reisekort med kortnummer som inneheld ${travelCardId}`,
        ),
      cardType: _('reisekort', 'travel card', 'reisekort'),
      onInspection: _(
        'I billettkontroll må du vise reisekortet ditt',
        'In the event of an inspection, please present your travel card',
        'I billettkontrollen må du vise reisekortet ditt',
      ),
    },
  },
  fram: {
    activeFareProductsAndReservationsTab: {
      noItemsHistoryHelpText: _(
        'Du har ingen aktive billetter. Billetthistorikk finner du under Min bruker-fanen.',
        'You have no active tickets right now. Ticket history can be found under the My user tab.',
        'Du har ingen aktive billettar. Billetthistorikk finn du under Min brukar-fana.',
      ),
    },
    travelCardInformation: {
      illustrationa11yLabel: (travelCardId: string) =>
        _(
          `Illustrasjon av reisekort med kortnummer som inneholder ${travelCardId}`,
          `Illustration of travel card with card number that contains ${travelCardId}`,
          `Illustrasjon av reisekort med kortnummer som inneheld ${travelCardId}`,
        ),
      cardType: _('reisekort', 'travel card', 'reisekort'),
      onInspection: _(
        'I billettkontroll må du vise reisekortet ditt',
        'In the event of an inspection, please present your travel card',
        'I billettkontroll må du vise reisekortet ditt',
      ),
      changeInstructions: _(
        'Kan endres fra "Min bruker"',
        'Can be changed from "My user"',
        'Kan endrast frå "Min brukar"',
      ),
    },
  },
});
