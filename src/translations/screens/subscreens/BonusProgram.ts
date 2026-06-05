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
      `Du må være logget inn i ${operatorName}-appen for å få kampanjeprisen.`,
      `You must be logged in to the ${operatorName} app to get the campaign price.`,
      `Du må vera logga inn i ${operatorName}-appen for å få kampanjeprisen.`,
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
        'Bli med og tjen poeng hver gang du kjøper en enkeltbillett (voksen/student, sone A). Bruk poengene dine og få kampanjepris på ulike transportmidler i AtB-appen.',
        'Join and earn points every time you buy a single ticket (adult/student, zone A). Use your points and get campaign prices on various means of transport in the AtB app.',
        'Bli med og ten poeng kvar gong du kjøper ein enkeltbillett (vaksen/student, sone A). Bruk poenga dine og få kampanjepris på ulike transportmiddel i AtB-appen.',
      ),
      footer: _(
        'Dette er et prøveprosjekt som varer til slutten av året.',
        'This is a pilot project that will last until the end of the year.',
        'Dette er eit prøveprosjekt som varer til slutten av året.',
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
          'Du kan bruke poeng på turer med ulike transportmidler. Se listen under.',
          'You may use points on trips with different transport modes. See the list below.',
          'Du kan bruka poeng på turar med ulike transportmiddel. Sjå lista under.',
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
            'Hvordan bruker jeg poengene mine?',
            'How do I use my points?',
            'Korleis brukar eg poenga mine?',
          ),
          answer: () =>
            _(
              'Når du er inne på et transportmiddel som støtter poeng, kan du velge å bruke poengene dine og få kampanjepris.',
              'When you are on a mode of transportation that supports points, you can choose to use your points and get campaign price.',
              'Når du er inne på eit transportmiddel som støttar poeng, kan du velja å bruka poenga dine og få kampanjepris.',
            ),
        },
        {
          question: _(
            'Hvor lenge varer prøveprosjektet?',
            'How long does the pilot project last?',
            'Kor lenge varer prøveprosjektet?',
          ),
          answer: () =>
            _(
              `Prøveprosjektet varer frem til slutten av året. Etter dette slettes resten av poengene dine.`,
              `The pilot project lasts until the end of the year. After this, the remaining points will be deleted.`,
              `Prøveprosjektet varer fram til slutten av året. Etter dette slettes resten av poenga dine.`,
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
};
export default BonusProgramTexts;
