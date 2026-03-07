import {translation as _} from '../../commons';
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
      'Logg inn for å tjene og bruke poeng',
      'Log in to earn and spend points',
      'Logg inn for å tene og bruke poeng',
    ),
    noBonusBalance: _(
      'Vi klarer ikke vise poengene dine akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to display your points right now. You will still earn points as usual.',
      'Me klarer ikkje visa poenga dine akkurat no. Du vil framleis tena poeng som vanleg.',
    ),
    noBonusProducts: _(
      'Vi klarer ikke vise fordelene akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to display the benefits right now. You will still earn points as usual.',
      'Me klarer ikkje visa fordelane akkurat no. Du vil framleis tene poeng som vanleg.',
    ),
    readMore: {
      heading: _(
        'Slik fungerer poeng',
        'How points work',
        'Slik fungerer poeng',
      ),
      download: {
        title: _(
          '1. Last ned appene først',
          '1. Download the apps first',
          '1. Last ned appane fyrst',
        ),
        description: _(
          'Du må laste ned og logge inn i appene til Hyre og Trondheim Bysykkel før du bruker Poeng.',
          'You need to download and log in to the apps for Hyre and Trondheim City Bike before using Points.',
          'Du må lasta ned og logga inn i appane til Hyre og Trondheim Bysykkel før du brukar Poeng.',
        ),
      },
      earnPoints: {
        title: _(
          '2. Kjøp billett, tjen poeng',
          '2. Buy tickets, earn points',
          '2. Kjøp billett, tjen poeng',
        ),
        description: _(
          'Du tjener poeng hver gang du kjøper enkeltbillett i sone A - for voksen eller student.',
          'You earn points each time you buy a single ticket in Zone A - for adults or students.',
          'Du tener poeng kvar gong du kjøper enkeltbillett i sone A - for vaksen eller student.',
        ),
      },
      spendPoints: {
        title: _(
          '3. Bruk poeng i kartet',
          '3. Spend points in the map',
          '3. Bruk poeng i kartet',
        ),
        description: _(
          'Du kan bruke poengene i kartet når du velger stasjoner fra Hyre eller Trondheim Bysykkel.',
          'You can spend points in the map when selecting stations from Hyre or Trondheim City Bike.',
          'Du kan bruke poenga i kartet når du vel å vel stasjonar frå Hyre eller Trondheim Bysykkel.',
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
      heading: _('Chat', 'Chat', 'Chat'),
      button: _(
        'Har du tilbakemelding?',
        'Do you have feedback?',
        'Har du tilbakemelding?',
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
