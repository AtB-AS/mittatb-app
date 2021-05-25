import {translation as _} from '../commons';

const OnboardingTexts = {
  welcome: {
    title: _('Velkommen til AtB appen!', 'Welcome to the AtB app!'),
    description: {
      part1: _(
        'Her kan du planlegge reiser, sjekke avgangstider, og kjøpe billetter for dine kollektivreiser i hele Trøndelag.',
        'You can use this app to plan your journeys, look up departure times, and buy tickets for your public transport in all of Trøndelag.',
      ),
      part2: _(
        'Hvis du logger inn vil du alltid ha tilgang til billettene dine, selv om du bytter eller mister telefonen din.',
        'If you sign in you will always have access to your tickets, even if you switch or lose your phone.',
      ),
      part3: _(
        'Du vil også kunne administrere billetter og eventuelle t:kort på den nye nettbutikken med samme konto.',
        'You will also be able to manage your tickets and t:kort on the webshop with the same account',
      ),
    },
    mainButton: _('Neste', 'Next'),
  },
  intercom: {
    title: _('Bidra til å gjøre appen bedre', 'Help us improve the app'),
    description: _(
      'Vi trenger dine idéer og tilbakemeldinger for å gjøre appen bedre. Disse deler du enklest ved å velge chatikonet oppe i høyre hjørne av appen. Chatten er anonym.',
      'Your feedback is critical for improving the app experience. Share your ideas or report bugs/errors by initiating a chat with the development team. Simply use the chat icon in the upper right corner. The chat is anonymous.',
    ),
    mainButton: _('Begynn å bruk appen', 'Start using the app'),
  },
};
export default OnboardingTexts;
