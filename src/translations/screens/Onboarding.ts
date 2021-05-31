import {translation as _} from '../commons';

const OnboardingTexts = {
  welcome: {
    title: _('Velkommen til AtB-appen', 'Welcome to the AtB app'),
    description: {
      part1: _(
        'Her kan du planlegge reiser og sjekke avgangstider i hele Trøndelag. Snart kan du også kjøpe dine billetter i appen. Følg med!',
        'Plan trips and check departure times throughout Trøndelag. Soon you can also buy tickets in the app. Stay tuned!',
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
    title: _('Bidra til å gjøre appen bedre', 'Help us make the app better'),
    description: _(
      'Vi ønsker dine tilbakemeldinger for å gjøre appen bedre. Dette gjør du enklest i chatten i høyre hjørne. Chatten er anonym.',
      'We appreciate your feedback to make the app better. Use the chat in the upper right corner. The chat is anonymous.',
    ),
    mainButton: _('Begynn å bruk appen', 'Start using the app'),
  },
};
export default OnboardingTexts;
