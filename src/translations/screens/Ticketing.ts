import {TranslatedString, translation as _} from '../commons';
import {TicketHistoryMode} from '@atb/ticket-history';

const bulletPoint = '\u2022';

type TicketHistoryModeText = {
  title: TranslatedString;
  titleA11y: TranslatedString;
  emptyDetail: TranslatedString;
};

export const TicketHistoryModeTexts: {
  [key in TicketHistoryMode]: TicketHistoryModeText;
} = {
  historical: {
    title: _('Utløpte billetter', 'Expired tickets', 'Utgåtte billettar'),
    titleA11y: _(
      'Aktiver for å vise dine utløpte billetter',
      'Activate to show your expired tickets',
      'Aktiver for å vise billettane dine som har gått ut',
    ),
    emptyDetail: _(
      'Dine utløpte billetter vil dukke opp her. Dra ned for å oppdatere om du ikke finner billetten din.',
      "Your expired tickets will show here. Pull down to refresh if you can't find your ticket.",
      'Billettane dine som har gått ut vil dukke opp her. Drag ned for å oppdatere om du ikkje finn billetten din.',
    ),
  },
  sent: {
    title: _(
      'Billetter sendt til andre',
      'Tickets sent to others',
      'Billettar sendt til andre',
    ),
    titleA11y: _(
      'Aktiver for å vise billetter sendt til andre',
      'Activate to show tickets sent to other',
      'Aktiver for å vise billettar sendt til andre',
    ),
    emptyDetail: _(
      'Billetter sendt til andre vil dukke opp her. Dra ned for å oppdatere om du ikke finner billetten din.',
      "Tickets sent to others will show here. Pull down to refresh if you can't find your ticket.",
      'Billettar sendt til andre vil dukke opp her. Drag ned for å oppdatere om du ikkje finn billetten din.',
    ),
  },
};

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
  availableFareProductsAndReservationsTab: {
    label: _('Mine billetter', 'My tickets', 'Mine billettar'),
    noActiveTicketsTitle: _(
      'Ingen aktive billetter',
      'No active tickets',
      'Ingen aktive billettar',
    ),
    noActiveTicketsDetails: _(
      'Når du kjøper billetter vil de dukke opp her. Dra ned for å oppdatere hvis billetten din ikke vises.',
      'When you buy tickets, they will show up here. Pull down to refresh if your ticket is not showing.',
      'Når du kjøper billettar vil dei dukke opp her. Drag ned for å oppdatere dersom billetten din ikkje visast.',
    ),
  },
  ticketHistoryTab: {
    noItems: _(
      'Fant ingen billetthistorikk.',
      'Nothing to show here until you have purchased a ticket.',
      'Fann ingen billetthistorikk.',
    ),
  },
  ticketHistory: {
    title: _('Billetthistorikk', 'Ticket history', 'Billetthistorikk'),
    emptyState: _('Ingen billetter', 'No tickets', 'Ingen billettar'),
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
      a11yLabel: _('Utløpt billett', 'Expired ticket', 'Utgått billett'),
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
  },
  reservation: {
    reserving: _(
      'Prosesseres... ikke gyldig enda',
      'Processing... not yet valid',
      'Prosesserer... ikkje gyldig enda',
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
    cancelled: _(
      'Kansellert billett',
      'Cancelled ticket',
      'Kansellert billett',
    ),
    expired: _('Utløpt billett', 'Expired ticket', 'Utgått billett'),
    rejected: _('Avvist billett', 'Rejected ticket', 'Avvist billett'),
    upcoming: _('Kommende billett', 'Upcoming ticket', 'Kommende billett'),
    approved: _('Godkjent billett', 'Approved ticket', 'Godkjent billett'),
    sent: _(
      'Billett sendt til andre',
      'Ticket sent to someone else',
      'Billett sendt til andre',
    ),
  },
  tipsAndInformationTile: {
    title: _(
      'Tips og informasjon',
      'Tips and information',
      'Tips og informasjon',
    ),
    a11yHint: _(
      'Aktiver for å få tips og informasjon om billetter',
      'Activate to get tips and information about tickets',
      'Aktiver for å få tips og informasjon om billettar',
    ),
  },
  accountError: {
    title: _(
      'Billettkjøp fungerer ikke på din mobil',
      'Your device is not able to buy tickets',
      'Billettkjøp fungerer ikkje på mobilen din',
    ),
    message: _(
      'Sjekk din internett-tilkobling og last inn appen på nytt. Hvis dette ikke hjelper, kontakt kundeservice.',
      'Check your internet connection and reload the app. If this does not help, contact customer service.',
      'Sjekk internett-tilkoplinga di og last inn appen på nytt. Om dette ikkje hjelp, kontakt kundeservice.',
    ),
    actionText: _(
      'Last inn appen på nytt',
      'Reload app',
      'Last inn appen på nytt',
    ),
  },
};

export default TicketingTexts;
