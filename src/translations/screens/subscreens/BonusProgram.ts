import {translation as _} from '../../commons';

export type BonusFaqContext = {
  endDate: string;
};

const BonusProgramTexts = {
  points: _('poeng', 'points', 'poeng'),
  costA11yLabel: (amount: number) =>
    _(`Bruk ${amount} poeng`, `Bruk ${amount} points`, `Bruk ${amount} poeng`),
  spend: _('Bruk', 'Use', 'Bruk'),
  amountPoints: (amount: number) =>
    _(`${amount} poeng`, `${amount} points`, `${amount} poeng`),

  youHave: _('Du har', 'You have', 'Du har'),

  yourBonusBalanceA11yLabel: (bonusBalance: number | null) => {
    return _(
      `Du har ${bonusBalance == null ? 'ukjent antall' : bonusBalance} poeng`,
      `You have ${bonusBalance == null ? 'unknown number of' : bonusBalance} points`,
      `Du har ${bonusBalance == null ? 'ukjent mengde' : bonusBalance} poeng`,
    );
  },

  fareContract: {
    youEarned: (bonusPointsEarned: number) =>
      _(
        `Du tjente **${bonusPointsEarned} poeng**!`,
        `You earned **${bonusPointsEarned} point${bonusPointsEarned === 1 ? '' : 's'}**!`,
        `Du tente **${bonusPointsEarned} poeng**!`,
      ),

    youEarnedA11yLabel: (bonusPointsEarned: number) =>
      _(
        `Du tjente ${bonusPointsEarned} poeng!`,
        `You earned ${bonusPointsEarned} point${bonusPointsEarned === 1 ? '' : 's'}!`,
        `Du tente ${bonusPointsEarned} poeng!`,
      ),
  },

  getCampaignPriceAt: (operatorName: string) =>
    _(
      `Få kampanjepris hos ${operatorName}`,
      `Get campaign price at ${operatorName}`,
      `Få kampanjepris hos ${operatorName}`,
    ),

  notEnoughPoints: _(
    'Du har ikke nok poeng',
    "You don't have enough points",
    'Du har ikkje nok poeng',
  ),

  log_in_operator_app_warning: (operatorName: string) =>
    _(
      `Du må være logget inn i ${operatorName}-appen før du bruker kampanjeprisen.`,
      `You must be logged in to the ${operatorName} app before using the campaign price.`,
      `Du må vera logga inn i ${operatorName}-appen før du brukar kampanjeprisen.`,
    ),

  bonusProfile: {
    header: {
      title: _('AtB Bonus', 'AtB Bonus', 'AtB Bonus'),
    },

    joinProgram: {
      title: _(
        'Reis billigere med AtB Bonus!',
        'Travel cheaper with AtB Bonus!',
        'Reis billegare med AtB Bonus!',
      ),
      description: _(
        'Bli med og tjen poeng hver gang du kjøper en enkeltbillett (voksen/student, sone A). Bruk poengene dine og få kampanjepris på enkeltbilletter, bysykler, elsparkesykler og Hyrebiler.',
        'Sign up and earn points every time you buy a single ticket (adult/student, zone A). Use your points and get campaign prices on single tickets, city bikes, electric scooters and Hyre cars.',
        'Bli med og ten poeng kvar gong du kjøper ein enkeltbillett (vaksen/student, sone A). Bruk poenga dine og få kampanjepris på enkeltbillettar, bysyklar, elsparkesyklar og Hyrebilar.',
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

    yourPoints: _('Dine poeng', 'Your points', 'poenga dine'),

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
        'Dette får du for poeng',
        'This is what you get for points',
        'Dette får du for poeng',
      ),
    },
    noData: _(
      'Vi klarer ikke hente informasjon om AtB Bonus. Sjekk om du har internett og prøv på nytt.',
      'We are unable to fetch information about AtB Bonus. Check your internet connection and try again.',
      'Me klarar ikkje hente informasjon om AtB Bonus. Sjekk om du har internett og prøv på nytt.',
    ),

    noProfile: _(
      'Du må logge inn før du kan bli med i AtB Bonus',
      'You need to log in before you can join AtB Bonus',
      'Du må logga inn før du kan bli med i AtB Bonus',
    ),
    noBonusBalance: _(
      'Vi klarer ikke vise poengene dine akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to display your points right now. You will still earn points as usual.',
      'Me klarer ikkje visa poenga dine akkurat no. Du vil framleis tena poeng som vanleg.',
    ),
    joined: {
      title: _(
        'Du er med i AtB Bonus!',
        'You have joined AtB Bonus!',
        'Du er med i AtB Bonus!',
      ),
      welcomeGiftDescription: (points: number) =>
        _(
          `Du har fått ${points} p i velkomstgave!`,
          `You have received ${points} points as a welcome gift!`,
          `Du har fått ${points} poeng i velkomstgåve!`,
        ),
    },
    noBonusProducts: _(
      'Vi klarer ikke dette akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to display this right now. You will still earn points as usual.',
      'Me klarer ikkje visa dette akkurat no. Du vil framleis tene poeng som vanleg.',
    ),
    readMore: {
      heading: _('Slik funker det', 'How it works', 'Slik funkar det'),
      download: {
        title: _('Last ned appene', 'Download the apps', 'Last ned appane'),
        description: _(
          'Du må laste ned og logge inn i appene til Trondheim Bysykkel og Hyre før du bruker poeng på deres tjenester.',
          'You need to download and log in to the apps for Trondheim City Bike and Hyre before using points on their services.',
          'Du må lasta ned og logga inn i appane til Trondheim Bysykkel og Hyre før du brukar poeng på tenestene deira.',
        ),
      },
      earnPoints: {
        title: _('Tjen poeng', 'Earn points', 'Tjen poeng'),
        description: (pointsPerProduct: string) =>
          pointsPerProduct
            ? _(
                `Du tjener ${pointsPerProduct} (voksen/student, sone A).`,
                `You earn ${pointsPerProduct} (adult/student, zone A).`,
                `Du tjener ${pointsPerProduct} (vaksen/student, sone A).`,
              )
            : _(
                'Du tjener poeng hver gang du kjøper en enkeltbillett (voksen/student, sone A).',
                'You earn points every time you buy a single ticket (adult/student, zone A).',
                'Du tener poeng kvar gong du kjøper ein enkeltbillett (vaksen/student, sone A).',
              ),
      },
      spendPoints: {
        title: _('Bruk poeng', 'Spend points', 'Bruk poeng'),
        description: _(
          'Du kan bruke poeng på turer med bysykler og Hyre-biler.',
          'You may use points on trips with city bikes and Hyre cars.',
          'Du kan bruke poeng på turer med bysykler og Hyre-biler.',
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
            'Hvordan bruker jeg poengene?',
            'How do I use the points?',
            'Korleis brukar eg poenga?',
          ),
          answer: () =>
            _(
              'På bysykkel, elsparkesykkel eller Hyrebil:\nFinn kjøretøyet i kartet, trykk på ikonet og huk av for at du vil bruke poeng før du starter turen.',
              'On city bikes, electric scooters, or Hyre cars:\nFind the vehicle on the map, tap the icon, and check the box to use points before starting the trip.',
              'På bysykkel, elsparkesykkel eller Hyrebil:\nFinn kjøretøyet i kartet, trykk på ikonet og huk av for at du vil bruke poeng før du starter turen.',
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
              `Prøveprosjektet varer frem til ${endDate}. Etter dette slettes resten av poengene dine.`,
              `The pilot project lasts until ${endDate}. After this, the remaining points will be deleted.`,
              `Prøveprosjektet varer fram til ${endDate}. Etter dette slettes resten av poenga dine.`,
            ),
        },
      ],
      pointsPerProductLabel: (value: number, productName: string) =>
        _(
          `${value} poeng hver gang du kjøper en ${productName}`,
          `${value} points every time you buy a ${productName}`,
          `${value} poeng kvar gong du kjøper ein ${productName}`,
        ),
    },
  },

  terms: {
    title: _(
      'Vilkår for AtB Bonus',
      'Terms and conditions for AtB Bonus',
      'Vilkår for AtB Bonus',
    ),
    term1: _(
      'Poeng brukes kun i AtB-appen.',
      'Points can only be used in the AtB app.',
      'Poeng kan kun brukast i AtB-appen.',
    ),
    term2: _(
      'Ubrukte poeng slettes når prøveperioden er over.',
      'Unused points will be deleted when the pilot period is over.',
      'Ubrukte poeng slettes når prøveperioden er over.',
    ),
    term3: _(
      'Vi kan kontakte deg for tilbakemeldinger i prøveperioden.',
      'We may contact you to ask for feedback during the pilot period.',
      'Vi kan kontakta deg for tilbakemeldingar i prøveperioden.',
    ),
    error: {
      title: _('Noe gikk galt', 'Something went wrong', 'Noe gikk galt'),
      description: _(
        'Du ble ikke innmeldt i AtB Bonus. Prøv igjen senere.',
        'You were not enrolled in AtB Bonus. Please try again later.',
        'Du ble ikkje innmeldt i AtB Bonus. Prøv igjen seinare.',
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

  myCouponCodes: {
    linkText: _('Mine kampanjekoder', 'My coupon codes', 'Mine kampanjekodar'),
    title: _('Mine kampanjekoder', 'My coupon codes', 'Mine kampanjekodar'),
    emptyState: _(
      'Du har ingen kampanjekoder enda. Bruk poengene dine for å få en kampanjekode.',
      "You don't have any coupon codes yet. Use your points to get a coupon code.",
      'Du har ingen kampanjekodar enno. Bruk poenga dine for å få ein kampanjekode.',
    ),
    copy: _('Kopier', 'Copy', 'Kopier'),
    copied: _('Kopiert!', 'Copied!', 'Kopiert!'),
    errorMessage: _(
      'Vi klarte ikke å hente kampanjekodene dine. Prøv igjen senere.',
      'We could not load your coupon codes. Please try again later.',
      'Vi klarte ikkje å hente kampanjekodane dine. Prøv igjen seinare.',
    ),
    retry: _('Prøv igjen', 'Try again', 'Prøv igjen'),
  },
};
export default BonusProgramTexts;
