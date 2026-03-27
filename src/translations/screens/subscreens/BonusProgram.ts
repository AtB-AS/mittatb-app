import {translation as _} from '../../commons';

export type BonusFaqContext = {
  endDate: string;
  pointsPerTicket: number;
};

const BonusProgramTexts = {
  points: _('poeng', 'points', 'poeng'),
  costA11yLabel: (amount: number) =>
    _(
      `Koster ${amount} poeng`,
      `Costs ${amount} points`,
      `Kostar ${amount} poeng`,
    ),

  youHave: _('Du har', 'You have', 'Du har'),

  yourBonusBalanceA11yLabel: (bonusBalance: number | null) => {
    return _(
      `Du har ${bonusBalance ?? 'ukjent antall'} bonuspoeng`,
      `You have ${bonusBalance ?? 'unknown number of'} bonus points`,
      `Du har ${bonusBalance ?? 'ukjent mengde'} bonuspoeng`,
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
        'Vil du samle Poeng?',
        'Do you want to earn Points?',
        'Vil du samle Poeng?',
      ),
      description: _(
        'Kjøp enkeltbilletter for voksen eller student i sone A og få Poeng. Bruk Poeng på turer med bysykkel og Hyre-biler.',
        'Buy single tickets for adults or students in zone A and earn Points. Use the Points on trips with city bikes and Hyre cars.',
        'Kjøp enkeltbilletter for vaksen eller student i sone A og få Poeng. Bruk Poeng på turer med bysykkel og Hyre-biler.',
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

    yourPoints: _('Dine poeng', 'Your points', 'Poenga dine'),

    mapButton: {
      text: _(
        'Bruk poeng i kartet',
        'Spend points in the map',
        'Bruk poeng i kartet',
      ),
      a11yHint: _(
        'Kartet er ikke tilgjengelig med skjermleser.',
        'The map is not accessible with screen reader.',
        'Kartet er ikkje tilgjengeleg med skjermlesar.',
      ),
    },
    spendPoints: {
      heading: _(
        'Dette kan du få for poeng',
        'This is what you can get for points',
        'Dette kan du få for poeng',
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
      'Vi klarer ikke vise poengene dine akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to display your points right now. You will still earn points as usual.',
      'Me klarer ikkje visa poenga dine akkurat no. Du vil framleis tena poeng som vanleg.',
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
      'Vi klarer ikke vise fordelene akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to display the benefits right now. You will still earn points as usual.',
      'Me klarer ikkje visa fordelane akkurat no. Du vil framleis tene poeng som vanleg.',
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
          'Du må laste ned og logge inn i appene til Hyre og Trondheim Bysykkel før du bruker Poeng.',
          'You need to download and log in to the apps for Hyre and Trondheim City Bike before using Points.',
          'Du må lasta ned og logga inn i appane til Hyre og Trondheim Bysykkel før du brukar Poeng.',
        ),
      },
      earnPoints: {
        title: _('Samle Poeng', 'Earn Points', 'Samle Poeng'),
        description: _(
          'Kjøp enkeltbilletter for voksen eller student i sone A og få Poeng.',
          'Buy single tickets for adults or students in zone A and earn Points.',
          'Kjøp enkeltbilletter for vaksen eller student i sone A og få Poeng.',
        ),
      },
      spendPoints: {
        title: _('Bruk poeng', 'Spend Points', 'Bruk poeng'),
        description: _(
          'Bruk Poeng på turer med bysykkel og Hyre-biler.',
          'You can spend points on trips with city bikes and Hyre cars.',
          'Du kan bruke poenga på turar med bysykkel og Hyre-bilar.',
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
            'Hvilke billetter tjener jeg Poeng på?',
            'Which tickets do I earn Points on?',
            'Kva billettar tener eg Poeng på?',
          ),
          answer: () =>
            _(
              'Du får Poeng når du kjøper enkeltbilletter for voksen eller student i sone A.',
              'You earn Points when you buy single tickets for adults or students in zone A.',
              'Du får Poeng når du kjøper enkeltbilletter for vaksen eller student i sone A.',
            ),
        },
        {
          question: _(
            'Hvor mange Poeng får jeg?',
            'How many Points do I get?',
            'Kor mange Poeng får eg?',
          ),
          answer: ({pointsPerTicket}: BonusFaqContext) =>
            _(
              `Du får ${pointsPerTicket} Poeng hver gang du kjøper en enkeltbillett for voksen eller student i sone A.`,
              `You earn ${pointsPerTicket} Points each time you buy a single ticket for adults or students in zone A.`,
              `Du får ${pointsPerTicket} Poeng kvar gong du kjøper ein enkeltbillett for vaksen eller student i sone A.`,
            ),
        },
        {
          question: _(
            'Hvordan bruker jeg Poengene?',
            'How do I use the Points?',
            'Korleis brukar eg Poenga?',
          ),
          answer: () =>
            _(
              'Når du har samlet nok Poeng kan du bruke dem på turer med bysykkel og Hyre-biler. Du kan velge å bruke Poeng der du vanligvis betaler.',
              'When you have collected enough Points, you can use them on trips with city bikes and Hyre cars. You can choose to use Points where you usually pay.',
              'Når du har samla nok Poeng kan du bruke dei på turar med bysykkel og Hyre-bilar. Du kan velje å bruke Poeng der du vanlegvis betalar.',
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

  onboarding: {
    welcome: {
      title: _(
        'Velkommen til Bonus!',
        'Welcome to Bonus!',
        'Velkommen til Bonus!',
      ),
      description: _(
        'Takk for at du deltar i prøveprosjektet! Vi er i testfasen av Bonus og lærer underveis. Del gjerne tilbakemeldinger via Bonus-siden under Profil.',
        "Thank you for taking part in the pilot! We're currently testing Bonus and learning as we go. Feel free to share your feedback via the Bonus page under Profile.",
        'Takk for at du deltek i prøveprosjektet! Me er i testfasen av Bonus og lærer undervegs. Del gjerne tilbakemeldingar via Bonus-sida under Profil.',
      ),
      buttonText: _('Få poeng', 'Earn points', 'Få poeng'),
    },
    buyTickets: {
      title: _(
        'Kjøp billett, få poeng',
        'Buy tickets, earn points',
        'Kjøp billett, få poeng',
      ),
      description: _(
        'Med Bonus får du poeng når du kjøper enkeltbillett for buss eller trikk i sone A - som voksen eller student.\n\nDu må være logget inn for å få tilgang til Bonus.',
        'With Bonus, you earn points when you buy a single ticket for bus or tram in Zone A - whether you travel as an adult or a student.\n\nYou need to be logged in to access Bonus.',
        'Med Bonus får du poeng når du kjøper enkeltbillett for buss eller trikk i sone A - som vaksen eller student.\n\nDu må vera logga inn for å få tilgang til Bonus.',
      ),
      buttonText: _(
        'Flere reisemåter',
        'More ways to ride',
        'Fleire reisemåtar',
      ),
    },
    moreTravelMethods: {
      title: _(
        'Flere reisemåter - gratis!',
        'More ways to travel - for free!',
        'Fleire reisemåtar - gratis!',
      ),
      description: _(
        'Poengene kan brukes på turer med Trondheim bysykkel og Hyre leiebil.',
        'You can use the points for trips with Trondheim City Bike and Hyre car rental.',
        'Poenga kan brukast på turar med Trondheim bysykkel og Hyre leigebil.',
      ),
      buttonText: _('Før du starter', 'Before you start', 'Før du startar'),
    },
    download: {
      title: _(
        'Last ned Hyre og Trondheim Bysykkel!',
        'Download Hyre and Trondheim City Bike!',
        'Last ned Hyre og Trondheim Bysykkel!',
      ),
      description: _(
        'For at Bonus skal fungere med Hyre og Trondheim Bysykkel, må du først laste ned og logge inn i appene deres.\n\nLast ned og logg inn:',
        'To use Bonus with Hyre and Trondheim City Bike, you need to download and log in to their apps.\n\nDownload and log in:',
        'For at Bonus skal fungera med Hyre og Trondheim Bysykkel, må du først lasta ned og logga inn i appane deira.\n\n Last ned og logg inn:',
      ),
      buttonText: _('Skjønner', 'Got it!', 'Skjønner'),
    },
  },
};
export default BonusProgramTexts;
