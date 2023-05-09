import {translation as _} from '../commons';

const TicketAssistantTexts = {
  welcome: {
    title: _(
      'Velkommen til billettveilederen',
      'Welcome to the ticket assistant',
    ),
    titleA11yLabel: _(
      'Velkommen til billettveilederen',
      'Welcome to the ticket assistant',
    ),
    description: _(
      'Få hjelp til å velge billetten som passer deg.',
      'Get help choosing the ticket that suits you.',
    ),

    boatInfo: _(
      'Akkurat nå gjelder veilederen kun for reiser med buss & trikk, og ikke båt.',
      'Right now, the assistant applies only to travel by bus & tram, and not by boat.',
    ),
    mainButton: _('Start', 'Start'),
    a11yStartHint: _(
      'Aktiver for å starte billettveilederen',
      'Activate to start the ticket assistant',
    ),
  },
  closeButton: _('Lukk', 'Close'),
  categoryPicker: {
    title: _('Hvem er du?', 'Who are you?'),
    chooseButton: _('Velg', 'Choose'),
    chosen: _('Valgt', 'Chosen'),
    a11yChooseButtonHint: (category: {value: string}) =>
      _(
        `Aktiver for å velge ${category.value} som kategori, og gå videre`,
        `Activate to choose ${category.value} as category and navigate to next page`,
      ),
  },
  frequency: {
    title: _(
      'Hvor ofte reiser du i uka? ',
      'How often do you travel per week?',
    ),
    titleA11yLabel: _(
      'Hvor ofte reiser du i uka? ',
      'How often do you travel per week?',
    ),
    description: _(
      'Tur-retur teller som 2 ganger. \n' +
        'Eksempel: Til og fra jobb 3 ganger i uka, er 6 reiser.',
      'Round trip counts as 2 times. \n' +
        'Example: To and from work 3 times a week, is 6 trips.',
    ),
    result: (amount: {value: number}) =>
      _(
        `Du reiser ${amount.value} ganger i uka`,
        `You travel ${amount.value} times a week`,
      ),
    resultMoreThanMax: (max: {value: number}) =>
      _(
        `Du reiser ${max.value} ganger eller mer i uka`,
        `You travel ${max.value} times or more per week`,
      ),
    mainButton: _('Neste', 'Next'),
    a11yNextPageHint: _(
      'Aktiver for å gå til neste side',
      'Activate to go to next page',
    ),
    a11yFrequencySelectionHint(amount: {value: number}) {
      return _(
        `Aktiver om du reiser ${amount.value} ganer i uken`,
        `Activate if you travel ${amount.value} times a week`,
      );
    },
  },
  zonesSelector: {
    title: _('Hvor skal du reise?', 'Where are you traveling to?'),
    titleA11yLabel: _('Hvor skal du reise?', 'Where do you travel?'),
    a11yNextHint: _('Aktiver for å gå videre', 'Activate to go to next page'),
  },
  duration: {
    title: (amount: {value: number}) =>
      _(
        `Hvor langt frem i tid skal du reise ${amount.value} ganger i uka?`,
        `How far ahead in time do you want to travel ${amount.value} times a week?`,
      ),
    titleA11yLabel: (amount: {value: number}) =>
      _(
        `Hvor langt frem i tid skal du reise ${amount.value} ganger i uka?`,
        `How far in advance do you want to travel ${amount.value} times a week?`,
      ),
    datePickerHeader: _('Frem til', 'Until'),
    datePickerHeaderA11yLabel: _('Frem til', 'Until'),
    a11yDatePickerHint: _(
      'Aktiver for å åpne kalenderen',
      'Activate to open calendar',
    ),
    minLimit: (days: number) => {
      if (days === 1) {
        return _('1 dag', '1 day');
      } else {
        return _(`${days} dager`, `${days} days`);
      }
    },
    minLimitA11yLabel: _('Minstegrensen er 1 dag', 'Minimum limit is 1 day'),
    maxLimit: _('6 mnd. +', '6 months +'),
    maxLimitA11yLabel: _(
      'Maksgrensen er 6 måneder pluss',
      'Max limit is 6 months plus',
    ),
    resultMonths: (amount: {value: number}) =>
      _(
        `Du skal reise i ${amount.value} mnd.`,
        `You will travel for ${amount.value} month(s).`,
      ),
    resultWeeks: (amount: {value: number}) =>
      _(
        `Du skal reise i ${amount.value} uke(r).`,
        `You will travel for ${amount.value} week(s).`,
      ),
    resultDays: (amount: {value: number}) =>
      _(
        `Du skal reise i ${amount.value} dag(er).`,
        `You will travel for ${amount.value} day(s).`,
      ),
    resultMoreThan180Days: _(
      'Du skal reise i mer enn et halvt år.',
      'You will travel for more than half a year.',
    ),
    mainButton: _('Neste', 'Next'),
    a11yNextPageHint: _(
      'Aktiver for å gå til neste side',
      'Activate to go to next page',
    ),
    a11ySliderHint(amount: {value: number}) {
      return _(
        `Du skal reise i ${amount.value} dager`,
        `You will travel for ${amount.value} days`,
      );
    },
  },
  summary: {
    title: _('Anbefalt for', 'Recommended for'),
    titleA11yLabel: _('Anbefalt for', 'Recommended for'),
    description: (data: {frequency: number; date: string}) =>
      _(
        `${data.frequency} turer i uka fram til ${data.date}`,
        `${data.frequency} trips per week until ${data.date}`,
      ),
    savings: (data: {
      totalSavings: number;
      perTripSavings: string;
      alternative: string;
    }) =>
      _(
        `Da sparer du ${data.totalSavings} kr totalt (${data.perTripSavings} kr per tur) sammenlignet med ${data.alternative} enkeltbilletter`,
        `You save ${data.totalSavings} kr in total (${data.perTripSavings} kr per trip) \n compared to ${data.alternative} single tickets`,
      ),
    savingsA11yLabel: (data: {
      totalSavings: number;
      perTripSavings: string;
      alternative: string;
    }) =>
      _(
        `Da sparer du ${data.totalSavings} kr totalt (${data.perTripSavings} kr per tur) sammenlignet med ${data.alternative} enkeltbilletter`,
        `You save ${data.totalSavings} kr in total (${data.perTripSavings} kr per trip) compared to ${data.alternative} single tickets`,
      ),
    traveller: _('Reisende', 'Traveller'),
    zones: _('Soner', 'Zones'),
    price: _('Pris', 'Price'),
    pricePerTrip: _('Pris per tur:', 'Price per trip:'),
    resultMoreThan180Days: _(
      'Du skal reise i mer enn et halvt år.',
      'You will travel for more than half a year.',
    ),
    mainButton: _('Lukk', 'Close'),
    buyButton: _('Kjøp denne billetten', 'Buy this ticket'),
    a11yBuyButtonHint: _(
      'Aktiver for å gå til siden hvor du kan kjøpe denne billetten',
      'Activate to go to the page where you can buy this ticket',
    ),
    ticketSummaryA11yLabel: (data: {
      ticket: string;
      traveller: string;
      tariffZones: string;
      price: string;
      pricePerTrip: string;
    }) =>
      _(
        `Du har valgt ${data.ticket}. \n Reisende: ${data.traveller}. \n Soner: ${data.tariffZones}. \n Pris: ${data.price} kr. \n Pris per tur: ${data.pricePerTrip} kr.`,
        `You have selected ${data.ticket}. \n Traveller: ${data.traveller}. \n Zones: ${data.tariffZones}. \n Price: ${data.price} kr. \n Price per trip: ${data.pricePerTrip} kr.`,
      ),
    durationNotice: _(
      'NB: denne billetten dekker ikke hele perioden du har satt. Ta veilederen på nytt når denne billetten utløper.',
      'NB: this ticket does not cover the entire period you have set. Take the assistant again when this ticket expires.',
    ),
    a11yDurationNoticeLabel: _(
      'NB: denne veilederen fungerer kun for reise med buss og trikk, ikke båt. ',
      'NB: this guide only works for travel by bus and tram, not boat.',
    ),
    singleTicketNotice: _(
      'Siden du ikke reiser så ofte, anbefaler vi deg å kjøpe enkeltbilletter.',
      'Since you do not travel so often, we recommend that you buy single tickets.',
    ),
    a11ySingleTicketNoticeLabel: _(
      'Siden du ikke reiser så ofte, anbefaler vi deg å kjøpe enkeltbilletter.',
      'Since you do not travel so often, we recommend that you buy single tickets.',
    ),
    equalPriceNotice: _(
      'Denne billetten koster like mye som enkeltbilletter, men en periodebillett er anbefalt fordi den er mer fleksibel.',
      'This ticket costs the same as single tickets, but a period ticket is recommended because it is more flexible.',
    ),
    feedback: _('Gi tilbakemelding', 'Give feedback'),
    crashedHeader: _('Oisann!', 'Oops!'),
    crashedDescription: _(
      'Det skjedde en feil. Kunne ikke hente billetten for deg.',
      'An error occurred. Could not get the ticket for you.',
    ),
  },
};
export default TicketAssistantTexts;
