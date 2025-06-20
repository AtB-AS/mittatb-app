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
  },
};
export default BonusProgramTexts;
