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
    description: {
      part1: _(
        'Få hjelp til å velge billetten som passer deg.',
        'Get help choosing the ticket that suits you.',
      ),
    },
    mainButton: _('Start', 'Start'),
  },
  closeButton: _('Lukk', 'Close'),
  categoryPicker: {
    title: _('Hvem er du?', 'Who are you?'),
    chooseButton: _('Velg', 'Choose'),
  },
  frequency: {
    title: _(
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
    mainButton: _('Neste', 'Next'),
  },
  zonesSelector: {
    title: _('Hvor skal du reise?', 'Where do you travel?'),
  },
  duration: {
    title: (amount: {value: number}) =>
      _(
        `Hvor langt frem i tid skal du reise ${amount.value} ganger i uka?`,
        `How far in advance do you want to travel ${amount.value} times a week?`,
      ),
    datePickerHeader: _('Frem til', 'Until'),
    minLimit: _('1 dag', '1 day'),
    maxLimit: _('180 dager +', '180 days +'),
    resultMonths: (amount: {value: number}) =>
      _(
        `Du skal reise i ${amount.value} mnd.`,
        `You will travel for ${amount.value} months.`,
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
  },
  summary: {
    title: _('Anbefalt for', 'Recommended for'),
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
        `Da sparer du ${data.totalSavings} kr totalt (${data.perTripSavings} kr per tur) \n sammenlignet med ${data.alternative} enkeltbilletter`,
        `You save ${data.totalSavings} kr in total (${data.perTripSavings} kr per trip) \n compared to ${data.alternative} single tickets`,
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
  },
};
export default TicketAssistantTexts;
