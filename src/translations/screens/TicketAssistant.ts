import {translation as _} from '../commons';

const TicketAssistantTexts = {
  welcome: {
    title: _(
      'Velkommen til billettveilederen',
      'Welcome to the ticket assistant',
      'Velkomen til billettrettleiaren',
    ),
    titleA11yLabel: _(
      'Velkommen til billettveilederen',
      'Welcome to the ticket assistant',
      'Velkomen til billettrettleiaren',
    ),
    description: _(
      'Få hjelp til å velge billetten som passer deg.',
      'Get help choosing the ticket that suits you.',
      'Få hjelp til å velje billetten som passar deg.',
    ),

    boatInfo: _(
      'Akkurat nå gjelder veilederen kun for reiser med buss & trikk, og ikke båt.',
      'Right now, the assistant applies only to travel by bus & tram, and not by boat.',
      'Akkurat no gjeld rettleiaren berre for reiser med buss og trikk, og ikkje båt. ',
    ),
    mainButton: _('Start', 'Start', 'Start'),
    a11yStartHint: _(
      'Aktiver for å starte billettveilederen',
      'Activate to start the ticket assistant',
      'Aktiver for å starte billettvegleiaren',
    ),
  },
  closeButton: _('Lukk', 'Close', 'Lukk'),
  categoryPicker: {
    title: _('Hvem er du?', 'Who are you?', 'Kven er du?'),
    chooseButton: _('Velg', 'Choose', 'Vel'),
    chosen: _('Valgt', 'Chosen', 'Valt'),
    a11yChooseButtonHint: (category: {value: string}) =>
      _(
        `Aktiver for å velge ${category.value} som kategori, og gå videre`,
        `Activate to choose ${category.value} as category and navigate to next page`,
        `Aktiver for å velje ${category.value} som kategori, og gå vidare`,
      ),
  },
  frequency: {
    title: _(
      'Hvor ofte reiser du i uka? ',
      'How often do you travel per week?',
      'Kor ofte reiser du i veka?',
    ),
    titleA11yLabel: _(
      'Hvor ofte reiser du i uka? ',
      'How often do you travel per week?',
      'Kor ofte reiser du i veka?',
    ),
    description: _(
      'Tur-retur teller som 2 reiser. \n' +
        'Eksempel: Til og fra jobb 3 ganger i uka, er 6 reiser.',
      'Round trip counts as 2 trips. \n' +
        'Example: To and from work 3 times a week, is 6 trips.',
      'Fram og tilbake tel som 2 reiser. \n' +
        'Døme: Til og frå jobb 3 gonger i veka, er 6 reiser.',
    ),
    result: (amount: {value: number}) =>
      _(
        `Du har ${amount.value} reiser i uka`,
        `You have ${amount.value} trips per week`,
        `Du har ${amount.value} reiser i veka`,
      ),
    resultMoreThanMax: (max: {value: number}) =>
      _(
        `Du har ${max.value} reiser eller mer i uka`,
        `You have ${max.value} trips or more per week`,
        `Du har ${max.value} reiser eller meir i veka`,
      ),
    mainButton: _('Neste', 'Next', 'Neste'),
    a11yNextPageHint: _(
      'Aktiver for å gå til neste side',
      'Activate to go to next page',
      'Aktiver for å gå til neste side',
    ),
    a11yFrequencySelectionHint(amount: {value: number}) {
      return _(
        `Aktiver om du reiser ${amount.value} ganger i uken`,
        `Activate if you travel ${amount.value} times a week`,
        `Aktiver om du reiser ${amount.value} gonger i veka`,
      );
    },
  },
  zonesSelector: {
    title: _(
      'Hvor skal du reise?',
      'Where are you traveling?',
      'Kvar skal du reise?',
    ),
    titleA11yLabel: _(
      'Hvor skal du reise?',
      'Where are you traveling',
      'Kvar skal du reise?',
    ),
    a11yNextHint: _(
      'Aktiver for å gå videre',
      'Activate to go to next page',
      'Aktiver for å gå vidare',
    ),
  },
  duration: {
    title: (amount: {value: number}) =>
      _(
        `Hvor lenge skal du ha ${amount.value} reiser i uka?`,
        `For how long are you planning to have ${amount.value} trips per week?`,
        `Kor lenge skal du ha ${amount.value} reiser i veka?`,
      ),
    titleA11yLabel: (amount: {value: number}) =>
      _(
        `Hvor lenge skal du ha ${amount.value} reiser i uka?`,
        `For how long are you planning to have ${amount.value} trips per week?`,
        `Kor lenge skal du ha ${amount.value} reiser i veka?`,
      ),
    datePickerHeader: _('Frem til', 'Until', 'Fram til'),
    datePickerHeaderA11yLabel: _('Frem til', 'Until', 'Fram til'),
    a11yDatePickerHint: _(
      'Aktiver for å åpne kalenderen',
      'Activate to open calendar',
      'Aktiver for å opne kalenderen',
    ),
    minLimit: (days: number) => {
      if (days === 1) {
        return _('1 dag', '1 day', '1 dag');
      } else {
        return _(`${days} dager`, `${days} days`, `${days} dagar`);
      }
    },
    minLimitA11yLabel: _(
      'Minstegrensen er 1 dag',
      'Minimum limit is 1 day',
      'Minstegrensa er 1 dag',
    ),
    maxLimit: _('6 mnd. +', '6 months +', '6 mnd. +'),
    maxLimitA11yLabel: _(
      'Maksgrensen er 6 måneder pluss',
      'Max limit is 6 months plus',
      'Maksgrensa er 6 månadar pluss',
    ),
    resultMonths: (amount: {value: number}) =>
      _(
        `Du skal reise i ${amount.value} ${
          amount.value == 1 ? 'måned' : 'måneder'
        }.`,
        `You will travel for ${amount.value} ${
          amount.value == 1 ? 'month' : 'months'
        }.`,
        `Du skal reise i ${amount.value} ${
          amount.value == 1 ? 'månad' : 'månadar'
        }.`,
      ),
    resultWeeks: (amount: {value: number}) =>
      _(
        `Du skal reise i ${amount.value} ${
          amount.value == 1 ? 'uke' : 'uker'
        }.`,
        `You will travel for ${amount.value} ${
          amount.value == 1 ? 'week' : 'weeks'
        }.`,
        `Du skal reise i ${amount.value} ${
          amount.value == 1 ? 'veke' : 'veker'
        }.`,
      ),
    resultDays: (amount: {value: number}) =>
      _(
        `Du skal reise i ${amount.value} ${
          amount.value == 1 ? 'dag' : 'dager'
        }.`,
        `You will travel for ${amount.value} ${
          amount.value == 1 ? 'day' : 'days'
        }.`,
        `Du skal reise i ${amount.value} ${
          amount.value == 1 ? 'dag' : 'dagar'
        }.`,
      ),
    resultMoreThan180Days: _(
      'Du skal reise i mer enn 6 måneder.',
      'You will travel for more than 6 months.',
      'Du skal reise i meir enn 6 månader.',
    ),
    mainButton: _('Neste', 'Next', 'Neste'),
    a11yNextPageHint: _(
      'Aktiver for å gå til neste side',
      'Activate to go to next page',
      'Aktiver for å gå til neste side',
    ),
    a11ySliderHint(amount: {value: number}) {
      return _(
        `Du skal reise i ${amount.value} dager`,
        `You will travel for ${amount.value} days`,
        `Du skal reise i ${amount.value} dagar`,
      );
    },
  },
  summary: {
    title: _('Anbefalt for', 'Recommended for', 'Anbefalt for'),
    titleA11yLabel: _('Anbefalt for', 'Recommended for', 'Anbefalt for'),
    description: (data: {frequency: number; date: string}) =>
      _(
        `${data.frequency} turer i uka fram til ${data.date}`,
        `${data.frequency} trips per week until ${data.date}`,
        `${data.frequency} turar i veka fram til ${data.date}`,
      ),
    savings: (data: {
      totalSavings: string;
      perTripSavings: string;
      alternative: string;
    }) =>
      _(
        `Da sparer du ${data.totalSavings} kr totalt (${data.perTripSavings} kr per tur) sammenlignet med ${data.alternative} enkeltbilletter`,
        `You save ${data.totalSavings} kr in total (${data.perTripSavings} kr per trip) \n compared to ${data.alternative} single tickets`,
        `Då sparar du ${data.totalSavings} kr totalt (${data.perTripSavings} kr per tur) samanlikna med ${data.alternative} enkeltbillettar`,
      ),
    savingsA11yLabel: (data: {
      totalSavings: number;
      perTripSavings: string;
      alternative: string;
    }) =>
      _(
        `Da sparer du ${data.totalSavings} kr totalt (${data.perTripSavings} kr per tur) sammenlignet med ${data.alternative} enkeltbilletter`,
        `You save ${data.totalSavings} kr in total (${data.perTripSavings} kr per trip) compared to ${data.alternative} single tickets`,
        `Då sparar du ${data.totalSavings} kr totalt (${data.perTripSavings} kr per tur) samanlikna med ${data.alternative} enkeltbillettar`,
      ),
    traveller: _('Reisende', 'Traveller', 'Reisande'),
    zones: _('Soner', 'Zones', 'Soner'),
    price: _('Pris', 'Price', 'Pris'),
    pricePerTrip: _('Pris per tur:', 'Price per trip:', 'Pris per tur:'),
    resultMoreThan180Days: _(
      'Du skal reise i mer enn et halvt år.',
      'You will travel for more than half a year.',
      'Du skal reise i meir enn eit halvt år.',
    ),
    mainButton: _('Lukk', 'Close', 'Lukk'),
    buyButton: _(
      'Kjøp denne billetten',
      'Buy this ticket',
      'Kjøp denne billetten',
    ),
    a11yBuyButtonHint: _(
      'Aktiver for å gå til siden hvor du kan kjøpe denne billetten',
      'Activate to go to the page where you can buy this ticket',
      'Aktiver for å gå til sida der du kan kjøpe denne billetten',
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
        `Du har valt ${data.ticket}. \n Reisande: ${data.traveller}. \n Sonar: ${data.tariffZones}. \n Pris: ${data.price} kr. \n Pris per tur: ${data.pricePerTrip} kr.`,
      ),
    durationNotice: _(
      'Merk deg: Denne billetten dekker ikke hele den valgte perioden. Ta veilederen på nytt når denne billetten utløper.',
      'Please note: This ticket does not cover the entire selected period. Take the assistant again when this ticket expires.',
      'Ver merksam: Denne billetten dekker ikkje heile perioden du har valgt. Bruk rettleiaren på nytt når billetten går ut.',
    ),
    a11yDurationNoticeLabel: _(
      'NB: denne veilederen fungerer kun for reise med buss og trikk, ikke båt. ',
      'NB: this guide only works for travel by bus and tram, not boat.',
      'NB: denne veileiaren fungerer berre for reise med buss og trikk, ikkje båt. ',
    ),
    singleTicketNotice: _(
      'Siden du ikke reiser så ofte, anbefaler vi deg å kjøpe enkeltbilletter.',
      'Since you do not travel so often, we recommend that you buy single tickets.',
      'Sidan du ikkje reiser så ofte, anbefaler vi deg å kjøpe enkeltbillettar.',
    ),
    a11ySingleTicketNoticeLabel: _(
      'Siden du ikke reiser så ofte, anbefaler vi deg å kjøpe enkeltbilletter.',
      'Since you do not travel so often, we recommend that you buy single tickets.',
      'Sidan du ikkje reiser så ofte, anbefaler vi deg å kjøpe enkeltbillettar.',
    ),
    equalPriceNotice: _(
      'Denne billetten koster like mye som enkeltbilletter, men en periodebillett er anbefalt fordi den er mer fleksibel.',
      'This ticket costs the same as single tickets, but a period ticket is recommended because it is more flexible.',
      'Denne billetten kostar like mykje som enkeltbillettar, men eit periodekort er anbefalt fordi det er meir fleksibelt.',
    ),
    feedback: _('Gi tilbakemelding', 'Give feedback', 'Gi tilbakemelding'),
    crashedHeader: _('Oisann!', 'Oops!', 'Oi'),
    crashedDescription: _(
      'Det skjedde en feil. Kunne ikke hente billetten for deg.',
      'An error occurred. Could not get the ticket for you.',
      'Det skjedde ein feil. Kunne ikkje hente billetten for deg.',
    ),
  },
};
export default TicketAssistantTexts;
