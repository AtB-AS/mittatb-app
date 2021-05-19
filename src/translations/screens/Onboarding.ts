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
};
export default OnboardingTexts;
