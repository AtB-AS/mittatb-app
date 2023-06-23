import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const OnboardingTexts = {
  welcome: {
    title: _('Velkommen til appen AtB', 'Welcome to the AtB app'),
    titleA11yLabel: _('Velkommen til appen AtB', 'Welcome to the ATB app'),
    description: {
      part1: _(
        'Her kan du planlegge reiser og sjekke avgangstider i hele Trøndelag. Du kan også kjøpe billetter, alt i samme app. Flere tjenester og billettyper er også på vei!',
        'Plan trips and check departure times throughout Trøndelag. You can also buy tickets, all in the same app. More services and ticket types are also on the way!',
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
    mainButton: _('Neste', 'Next'),
  },
  goodToKnow: {
    title: _('Greit å vite', 'Good to know'),
    description: _(
      'Når du gjør et reisesøk får du opp forslag til hvordan du kan reise. En korrespondanse som er garantert er merket med korrespondanse.',
      'When you perform a travel search, you will receive suggestions on how to travel. A guaranteed connection is marked with correspondance.',
    ),
    mainButton: _('Neste', 'Next'),
  },
  alsoGoodToKnow: {
    title: _('Også greit å vite', 'Also good to know'),
    description: _(
      'Billetten du kjøper blir gyldig med en gang eller til avgangen du velger. Du kan kjøpe billett til mer enn 48 timer frem i tid. Husk at kjøpet av billetten ikke er en reservasjon på avgangen.',
      'The ticket you purchase becomes valid immediately or for the departure time you choose. Therefore, you can buy a ticket for more than 48 hours in advance. Please note that purchasing the ticket does not reserve your spot on the departure.',
    ),
    mainButton: _('Neste', 'Next'),
  },
};
export default orgSpecificTranslations(OnboardingTexts, {
  nfk: {
    welcome: {
      title: _('Velkommen til Reis-appen', 'Welcome to the Reis app'),
      titleA11yLabel: _('Velkommen til Reis appen', 'Welcome to the Reis app'),
      description: {
        part1: _(
          'Her kan du planlegge, betale og gjennomføre reisen din i en og samme app. Appen oppdateres jevnlig med flere billettyper og innovative funksjoner!',
          'Plan trips and buy tickets throughout Nordland. The app will be continuously updated with more products and new functionality.',
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
  fram: {
    welcome: {
      title: _('Velkommen til FRAM-appen', 'Welcome to the FRAM app'),
      titleA11yLabel: _('Velkommen til FRAM appen', 'Welcome to the FRAM app'),
      description: {
        part1: _(
          'I appen kan du planlegge reisen, sjekke avganger og betale for billetten i en og samme app. Flere funksjoner blir lagt til jevnlig!',
          'In the app, you can plan your journey, check departures and pay for the ticket, all in the same app. More features are regularly added!',
        ),
      },
    },
    intercom: {
      description: _(
        'Vi ønsker tilbakemeldingen din for å gjøre appen bedre. Oppe til høyre i appen finner du snakkeboblen for å ta kontakt.',
        'We appreciate your feedback to make the app better. Press the speech bubble in the upper right corner to give feedback.',
      ),
    },
  },
});
