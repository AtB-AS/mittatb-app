import {translation as _} from '../../commons';

export type BonusFaqContext = {
  endDate: string;
};

const BonusProgramTexts = {
  points: _('Poeng', 'Points', 'Poeng'),
  costA11yLabel: (amount: number) =>
    _(
      `Koster ${amount} Poeng`,
      `Costs ${amount} Points`,
      `Kostar ${amount} Poeng`,
    ),
  spend: _('Bruk', 'Use', 'Bruk'),
  amountPoints: (amount: number) =>
    _(`${amount} Poeng`, `${amount} Points`, `${amount} Poeng`),

  youHave: _('Du har', 'You have', 'Du har'),

  yourBonusBalanceA11yLabel: (bonusBalance: number | null) => {
    return _(
      `Du har ${bonusBalance == null ? 'ukjent antall' : bonusBalance} Poeng`,
      `You have ${bonusBalance == null ? 'unknown number of' : bonusBalance} Points`,
      `Du har ${bonusBalance == null ? 'ukjent mengde' : bonusBalance} Poeng`,
    );
  },

  fareContract: {
    youEarned: (bonusPointsEarned: number) =>
      _(
        `Du tjente **${bonusPointsEarned} Poeng**!`,
        `You earned **${bonusPointsEarned} Point${bonusPointsEarned === 1 ? '' : 's'}**!`,
        `Du tente **${bonusPointsEarned} Poeng**!`,
      ),

    youEarnedA11yLabel: (bonusPointsEarned: number) =>
      _(
        `Du tjente ${bonusPointsEarned} Poeng!`,
        `You earned ${bonusPointsEarned} Point${bonusPointsEarned === 1 ? '' : 's'}!`,
        `Du tente ${bonusPointsEarned} Poeng!`,
      ),
  },

  log_in_operator_app_warning: (operatorName: string) =>
    _(
      `Du må være logget inn i ${operatorName}-appen før du bruker bonusen.`,
      `You must be logged in to the ${operatorName} app before using the bonus.`,
      `Du må vera logga inn i ${operatorName}-appen før du brukar bonusen.`,
    ),

  bonusProfile: {
    header: {
      title: _('Poeng', 'Points', 'Poeng'),
    },

    joinProgram: {
      title: _(
        'Tjen poeng på enkeltbilletter!',
        'Earn Points on single tickets!',
        'Tjen poeng på enkeltbilletter!',
      ),
      description: _(
        'Du tjener Poeng hver gang du kjøper en enkeltbillett for voksen eller student i sone A. Bruk Poeng på turer med bysykler og Hyre-biler.',
        'You earn Points every time you buy a single ticket for adults or students in zone A. Use the Points on trips with city bikes and Hyre cars.',
        'Du tener Poeng kvar gong du kjøper ein enkeltbillett for vaksen eller student i sone A. Bruk Poeng på turer med bysykkler og Hyre-biler.',
      ),
      footer: (endDate: string) =>
        _(
          `Dette er et prøveprosjekt som varer til ${endDate}.`,
          `This is a pilot project that runs until ${endDate}.`,
          `Dette er eit prøveprosjekt som varer til ${endDate}.`,
        ),
      button: {
        text: _('Bli med', 'Join', 'Bli med'),
      },
    },

    yourPoints: _('Dine Poeng', 'Your Points', 'Poenga dine'),

    mapButton: {
      a11yLabel: _('Vis i kart', 'Show in map', 'Vis i kart'),
      a11yHint: _(
        'Kartet er ikke tilgjengelig med skjermleser.',
        'The map is not accessible with screen reader.',
        'Kartet er ikkje tilgjengeleg med skjermlesar.',
      ),
    },
    spendPoints: {
      heading: _(
        'Dette kan du bruke Poeng på',
        'This is what you can use Points for',
        'Dette kan du bruke Poeng på',
      ),
    },
    noData: _(
      'Vi klarer ikke hente informasjon om Poeng. Sjekk om du har internett og prøv på nytt.',
      'We are unable to fetch information about Points. Check your internet connection and try again.',
      'Me klarar ikkje hente informasjon om Poeng. Sjekk om du har internett og prøv på nytt.',
    ),

    noProfile: _(
      'Du må logge inn før du kan bli med i Poeng',
      'You need to log in before you can join Points',
      'Du må logga inn før du kan bli med i Poeng',
    ),
    noBonusBalance: _(
      'Vi klarer ikke vise Poengene dine akkurat nå. Du vil fortsatt tjene Poeng som vanlig.',
      'We are unable to display your Points right now. You will still earn Points as usual.',
      'Me klarer ikkje visa Poenga dine akkurat no. Du vil framleis tena Poeng som vanleg.',
    ),
    joined: {
      title: _(
        'Du er med i Poeng!',
        'You have joined Points!',
        'Du er med i Poeng!',
      ),
      welcomeGiftDescription: (points: number) =>
        _(
          `Du har fått ${points} Poeng i velkomstgave!`,
          `You have received ${points} Points as a welcome gift!`,
          `Du har fått ${points} Poeng i velkomstgåve!`,
        ),
    },
    noBonusProducts: _(
      'Vi klarer ikke vise fordelene akkurat nå. Du vil fortsatt tjene Poeng som vanlig.',
      'We are unable to display the benefits right now. You will still earn Points as usual.',
      'Me klarer ikkje visa fordelane akkurat no. Du vil framleis tene Poeng som vanleg.',
    ),
    readMore: {
      heading: _('Slik funker det', 'How it works', 'Slik funkar det'),
      download: {
        title: _(
          'Last ned appene først',
          'Download the apps first',
          'Last ned appane fyrst',
        ),
        description: _(
          'Du må laste ned og logge inn i appene til Trondheim Bysykkel og Hyre før du bruker Poeng.',
          'You need to download and log in to the apps for Trondheim City Bike and Hyre before using Points.',
          'Du må lasta ned og logga inn i appane til Trondheim Bysykkel og Hyre før du brukar Poeng.',
        ),
      },
      earnPoints: {
        title: _('Tjen Poeng', 'Earn Points', 'Tjen Poeng'),
        description: (pointsPerProduct: string) =>
          pointsPerProduct
            ? _(
                `Du tjener ${pointsPerProduct} for voksen eller student i sone A.`,
                `You earn ${pointsPerProduct} for adults or students in zone A.`,
                `Du tjener ${pointsPerProduct} for vaksen eller student i sone A.`,
              )
            : _(
                'Du tjener Poeng hver gang du kjøper en enkeltbillett for voksen eller student i sone A.',
                'You earn Points every time you buy a single ticket for adults or students in zone A.',
                'Du tener Poeng kvar gong du kjøper ein enkeltbillett for vaksen eller student i sone A.',
              ),
      },
      spendPoints: {
        title: _('Bruk Poeng', 'Spend Points', 'Bruk Poeng'),
        description: _(
          'Du kan bruke Poeng på turer med bysykler og Hyre-biler.',
          'You may use Points on trips with city bikes and Hyre cars.',
          'Du kan bruke Poeng på turer med bysykler og Hyre-biler.',
        ),
      },
      downloadOperator: (operator: string) =>
        _(
          `Last ned ${operator}`,
          `Download ${operator}`,
          `Last ned ${operator}`,
        ),
    },
    feedback: {
      heading: _('Tilbakemelding', 'Feedback', 'Tilbakemelding'),
      button: _(
        'Har du noe på hjertet?',
        'Do you have something on your mind?',
        'Har du noko på hjartet?',
      ),
    },
    faq: {
      heading: _(
        'Spørsmål og svar',
        'Questions and answers',
        'Spørsmål og svar',
      ),
      faqs: [
        {
          question: _(
            'Hvordan bruker jeg Poeng?',
            'How do I use Points?',
            'Korleis brukar eg Poeng?',
          ),
          answer: () =>
            _(
              'Når du har samlet nok Poeng, kan du bruke dem på turer med bysykler og Hyre-biler som du finner i kartet. For å bruke Poeng i kartet, trykker du på ikonet for bysykkel eller Hyre-bil, og krysser av for at du vil bruke Poeng før du starter turen.',
              'When you have collected enough Points, you can use them on trips with city bikes and Hyre cars that you find in the map. To use Points in the map, tap on the icon for city bike or Hyre car, and check the box that you want to use Points before you start the trip.',
              'Når du har samla nok Poeng, kan du bruke dem på turer med bysykler og Hyre-biler som du finn i kartet. For å bruke Poeng i kartet, trykker du på ikonet for bysykkel eller Hyre-bil, og krysser av for at du vil bruke Poeng før du startar turen.',
            ),
        },
        {
          question: _(
            'Hvor lenge varer prøveprosjektet?',
            'How long does the pilot project last?',
            'Kor lenge varer prøveprosjektet?',
          ),
          answer: ({endDate}: BonusFaqContext) =>
            _(
              `Prøveprosjektet varer frem til ${endDate}. Etter dette slettes resten av Poengene dine.`,
              `The pilot project lasts until ${endDate}. After this, the remaining Points will be deleted.`,
              `Prøveprosjektet varer fram til ${endDate}. Etter dette slettes resten av Poenga dine.`,
            ),
        },
      ],
      pointsPerProductLabel: (value: number, productName: string) =>
        _(
          `${value} Poeng hver gang du kjøper en ${productName}`,
          `${value} Points every time you buy a ${productName}`,
          `${value} Poeng kvar gong du kjøper ein ${productName}`,
        ),
    },
  },

  terms: {
    title: _(
      'Vilkår for Poeng',
      'Terms and conditions for Points',
      'Vilkår for Poeng',
    ),
    term1: _(
      'Du kan kun bruke Poeng i AtB-appen.',
      'You can only use Points in the AtB app.',
      'Du kan kun bruke Poeng i AtB-appen.',
    ),
    term2: _(
      'Gjenværende Poeng slettes etter testperioden.',
      'Remaining Points will be deleted after the test period.',
      'Gjenværende Poeng slettes etter testperioden.',
    ),
    term3: _(
      'AtB kan kontakte deg for å be om tilbakemeldinger underveis i testen.',
      'AtB may contact you to ask for feedback during the test.',
      'AtB kan kontakta deg for å be om tilbakemelding undervegs i testen.',
    ),
    error: {
      title: _('Noe gikk galt', 'Something went wrong', 'Noe gikk galt'),
      description: _(
        'Du ble ikke innmeldt i Poeng. Prøv igjen senere.',
        'You were not enrolled in Points. Please try again later.',
        'Du ble ikkje innmeldt i Poeng. Prøv igjen seinare.',
      ),
    },

    button: {
      text: _('Godta', 'Accept', 'Godta'),
      a11yLabel: _(
        'Godta vilkårene og bli med',
        'Accept the terms and join',
        'Godta vilkårene og bli med',
      ),
    },
  },
};
export default BonusProgramTexts;
