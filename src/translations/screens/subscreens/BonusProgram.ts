import {translation as _} from '../../commons';
const BonusProgramTexts = {
  bonusPoints: _('bonuspoeng', 'bonus points', 'bonuspoeng'),
  points: _('poeng', 'points', 'poeng'),
  costA11yLabel: (amount: number) =>
    _(
      `Koster ${amount} bonuspoeng`,
      `Costs ${amount} bonus points`,
      `Kostar ${amount} bonuspoeng`,
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
    youEarned: {
      intro: _('Du tjente ', 'You earned ', 'Du tente '),
      earned: (bonusPointsEarned: number) =>
        _(
          `${bonusPointsEarned} poeng`,
          `${bonusPointsEarned} point${bonusPointsEarned === 1 ? '' : 's'}`,
          `${bonusPointsEarned} poeng`,
        ),
      ending: _(' på dette kjøpet!', ' on this purchase!', ' på dette kjøpet!'),
    },
  },

  bonusProfile: {
    header: {
      title: _('Bonus', 'Bonus', 'Bonus'),
    },
    yourBonusPoints: _('Dine poeng', 'Your points', 'Poenga dine'),

    spendPoints: {
      heading: _('Våre bonuser', 'Our bonuses', 'Bonusane våre'),
    },
    noData: _(
      'Vi klarer ikke hente informasjon om Bonus. Sjekk om du har internett og prøv på nytt.',
      'We are unable to fetch information about Bonus. Check your internet connection and try again.',
      'Me klarar ikkje hente informasjon om Bonus. Sjekk om du har internett og prøv på nytt.',
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
      heading: _('Les mer', 'Read more', 'Les meir'),
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
  onBoarding: {
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
      buttonText: _('Skjønner', 'Got it!', 'SKjønner'),
    },
  },
};
export default BonusProgramTexts;
