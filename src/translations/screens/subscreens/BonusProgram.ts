import {translation as _} from '../../commons';
const BonusProgramTexts = {
  bonuspoints: _('Bonuspoeng', 'Bonus points', 'Bonuspoeng'),
  costA11yLabel: (price: number) =>
    _(`Koster ${price}`, `Costs ${price}`, `Kostar ${price}`),

  bonusProfile: {
    header: {
      title: _('Bonus', 'Bonus', 'Bonus'),
    },
    yourBonusPoints: _(
      'Dine bonuspoeng',
      'Your bonus points',
      'Bonuspoenga dine',
    ),
    yourBonusPointsA11yLabel: (bonuspoints: number) =>
      _(
        `Du har ${bonuspoints}`,
        `You have ${bonuspoints}`,
        `Du har ${bonuspoints}`,
      ),

    spendPoints: {
      heading: _('Våre bonuser', 'Our bonuses', 'Bonusane våre'),
    },
    noData: _(
      'Vi klarer ikke hente informasjon om Bonus. Sjekk om du har internett din og prøv på nytt.',
      'We are unable to fetch information about Bonus. Check your internet connection and try again.',
      'Me klarar ikkje hente informasjon om Bonus. Sjekk om du har internett og prøv på nytt.',
    ),

    noProfile: _(
      'Logg inn for å tjene og bruke poeng',
      'Log in to earn and spend points',
      'Logg inn for å tene og bruke poeng',
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
  youHave: _('Du har ', 'You have ', 'Du har '),
  checkbox: {
    a11yLabel: _('Bruk bonuspoeng', 'Use bonus points', 'Bruk bonuspoeng'),
    a11yHint: _(
      'Aktiver for å bruke bonuspoeng',
      'Activate to use bonus points',
      'Aktiver for å bruke bonuspoeng',
    ),
  },
};
export default BonusProgramTexts;
