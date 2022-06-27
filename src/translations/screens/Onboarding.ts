import {TranslatedString, translation as _} from '../commons';
import orgSpecificTranslations from '../utils';
const OnboardingTexts = {
  welcome: {
    title: _('Velkommen til AtB-appen', 'Welcome to the AtB app'),
    titleA11yLabel: _('Velkommen til ATB appen', 'Welcome to the ATB app'),
    description: {
      part1: _(
        'Her kan du planlegge reiser og sjekke avgangstider i hele Trøndelag. Du kan også prøve kjøp av enkeltbilletter med Vipps. Flere tjenester og billettyper kommer!',
        'Plan trips and check departure times throughout Trøndelag. You may also purchase single tickets with Vipps. More features and ticket products are coming soon!',
      ),
      part2: _(
        'Hvis du logger inn vil du alltid ha tilgang til billettene dine, selv om du bytter eller mister telefonen din.',
        'If you log in you will always have access to your tickets, even if you switch or lose your phone.',
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
export default orgSpecificTranslations(OnboardingTexts, {
  nfk: {
    welcome: {
      title: _('Velkommen til Reis-appen', 'Welcome to the Reis app'),
      titleA11yLabel: _('Velkommen til Reis appen', 'Welcome to the Reis app'),
      description: {
        part1: _(
          'Her kan du planlegge reiser og sjekke avgangstider i hele Nordland. Snart kommer også billettkjøp, slik at du kan planlegge, betale og gjennomføre reisen din i en og samme app!',
          'Plan trips and check departure times throughout Nordland. App ticketing is coming soon, so that you may plan and buy tickets for your trip using only one app!',
        ),
        part3: _(
          'Du vil også kunne administrere billetter og eventuelle reisekort på den nye nettbutikken med samme konto.',
          'You will also be able to manage your tickets and travelcards on the webshop with the same account',
        ),
      },
    },
    intercom: {
      title: _('Bidra til å gjøre appen bedre', 'Help us make the app better'),
      description: _(
        'Vi ønsker dine innspill for å gjøre appen bedre. Trykk på snakkeboblen oppe til høyre for å gi tilbakemelding.',
        'We appreciate your feedback to make the app better. Press the speech bubble in the upper right corner to give feedback.',
      ),
      mainButton: _('Begynn å bruk appen', 'Start using the app'),
    },
  },
});
