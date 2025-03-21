import {translation as _} from '../../commons';
const BonusProgramTexts = {
  bonusPoints: _('bonuspoeng', 'bonus points', 'bonuspoeng'),
  costA11yLabel: (amount: number) =>
    _(
      `Koster ${amount} bonuspoeng`,
      `Costs ${amount} bonus points`,
      `Kostar ${amount} bonuspoeng`,
    ),

  youHave: _('Du har ', 'You have ', 'Du har '),

  bonusProfile: {
    header: {
      title: _('Bonus', 'Bonus', 'Bonus'),
    },
    yourBonusPoints: _(
      'Dine bonuspoeng',
      'Your bonus points',
      'Bonuspoenga dine',
    ),
    yourBonusBalanceA11yLabel: (bonusBalance: number | null | undefined) =>
      _(
        `Du har ${bonusBalance ?? 'ukjent antall'} bonuspoeng`,
        `You have ${bonusBalance ?? 'unknown number of'} bonus points`,
        `Du har ${bonusBalance ?? 'ukjent tal på'} bonuspoeng`,
      ),

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
      'Vi klarer ikke hente bonuspoengene dine akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to fetch your bonus points right now. You will still earn points as usual.',
      'Me klarer ikkje henta bonuspoenga dine akkurat no. Du vil framleis tena poeng som vanleg.',
    ),
    noBonusProducts: _(
      'Vi klarer ikke hente fordelene akkurat nå. Du vil fortsatt tjene poeng som vanlig.',
      'We are unable to fetch the benefits right now. You will still earn points as usual.',
      'Me klarer ikkje hente fordelane akkurat no. Du vil framleis tene poeng som vanleg.',
    ),
    readMore: {
      heading: _('Les mer', 'Read more', 'Les meir'),
    },
  },
};
export default BonusProgramTexts;
