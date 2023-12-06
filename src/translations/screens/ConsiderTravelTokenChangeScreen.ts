import {translation as _} from '../commons';

const ConsiderTravelTokenChangeTexts = {
  title: _(
    'Endre hvor billettene er tilgjengelige fra',
    'Change where the tickets are available from',
    'Endre kvar billettane er tilgjengelege frå',
  ),
  description: _(
    'Billettene dine vil alltid ligge trygt lagret på denne brukerkontoen.',
    'Your tickets will always be safely stored on this user account.',
    'Billettane dine vil alltid ligge trygt lagra på denne brukarkontoen.',
  ),
  activeTravelTokenInfoBox: {
    title: (isTravelCard: boolean) =>
      _(
        `Dine billetter er tilgjengelige fra ${
          isTravelCard ? 't:kort' : 'mobil'
        }:`,
        `Your tickets are available from ${
          isTravelCard ? 't:card' : 'mobile'
        }:`,
        `Billettane dine er tilgjengelege frå ${
          isTravelCard ? 't:kort' : 'mobil'
        }:`,
      ),
    change: _('Endre', 'Change', 'Endre'),
  },
  nextButton: _('Neste', 'Next', 'Neste'),
};

export default ConsiderTravelTokenChangeTexts;
