import {translation as _} from '../commons';
import {orgSpecificTranslations} from '../orgSpecificTranslations';

const OnboardingTexts = {
  welcome: {
    title: _(
      'Velkommen til appen AtB',
      'Welcome to the AtB app',
      'Velkommen til appen AtB',
    ),
    titleA11yLabel: _(
      'Velkommen til appen AtB',
      'Welcome to the ATB app',
      'Velkommen til appen AtB',
    ),
    description: {
      part1: _(
        'Her kan du planlegge reiser og sjekke avgangstider i hele Trøndelag. Du kan også kjøpe billetter, alt i samme app. Flere tjenester og billettyper er på vei!',
        'Plan trips and check departure times throughout Trøndelag. You can also buy tickets, all in the same app. More services and ticket types are also on the way!',
        'Her kan du planlegge reiser og sjekke avgangstider i hele Trøndelag. Du kan også kjøpe billetter, alt i same app. Fleire tenester og billettypar er på veg!',
      ),
    },
    mainButton: _('Neste', 'Next', 'Neste'),
  },
  intercom: {
    title: _(
      'Bidra til å gjøre appen bedre',
      'Help us make the app better',
      'Bidra til å gjere appen betre',
    ),
    description: _(
      'Vi ønsker dine tilbakemeldinger for å gjøre appen bedre. Dette gjør du enklest i chatten i høyre hjørne. Chatten er anonym.',
      'We appreciate your feedback to make the app better. Use the chat in the upper right corner. The chat is anonymous.',
      'Vi ønskjer tilbakemeldinga di for å gjere appen betre. Du gjer dette enklast ved å bruke chatten i høgre hjørne. Chatten er anonym.',
    ),
    mainButton: _('Neste', 'Next', 'Neste'),
  },
  goodToKnow: {
    title: _('Greit å vite', 'Good to know', 'Greit å vite'),
    description: _(
      'Når du gjør et reisesøk får du opp forslag til hvordan du kan reise. En korrespondanse som er garantert, er merket med korrespondanse.',
      'When you perform a travel search, you will receive suggestions on how to travel. A guaranteed connection is marked with correspondance.',
      'Når du gjer eit reisesøk får du opp forslag til korleis du kan reise. Ein korrespondanse som er garantert er merka med korrespondanse.',
    ),
    mainButton: _('Neste', 'Next', 'Neste'),
  },
  alsoGoodToKnow: {
    title: _('Også greit å vite', 'Also good to know', 'Også greit å vite'),
    description: _(
      'Billetten du kjøper blir gyldig med én gang eller til avgangen du velger. Du kan kjøpe billett til mer enn 48 timer frem i tid. Husk at kjøpet av billetten ikke er en reservasjon på avgangen.',
      'The ticket you purchase becomes valid immediately or for the departure time you choose. Therefore, you can buy a ticket for more than 48 hours in advance. Please note that purchasing the ticket does not reserve your spot on the departure.',
      'Billetten du kjøper blir gyldig med ein gong eller til avgangen du vel. Du kan kjøpe billett til meir enn 48 timer fram i tid. Husk at kjøpet av billetten ikkje er ein reservasjon på avgangen.',
    ),
    mainButton: _('Neste', 'Next', 'Neste'),
  },
};
export default orgSpecificTranslations(OnboardingTexts, {
  nfk: {
    welcome: {
      title: _(
        'Velkommen til Reis-appen',
        'Welcome to the Reis app',
        'Velkommen til Reis-appen',
      ),
      titleA11yLabel: _(
        'Velkommen til Reis appen',
        'Welcome to the Reis app',
        'Velkommen til Reis-appen',
      ),
      description: {
        part1: _(
          'Her kan du planlegge, betale og gjennomføre reisen din i en og samme app. Appen oppdateres jevnlig med flere billettyper og innovative funksjoner!',
          'Plan trips and buy tickets throughout Nordland. The app will be continuously updated with more products and new functionality.',
          'Her kan du planlegge, betale og gjennomføre reisa di i ein og same app. Appen vert oppdatert jevnleg med fleire billettypar og innovative funksjonar!',
        ),
      },
    },
    intercom: {
      title: _(
        'Bidra til å gjøre appen bedre',
        'Help us make the app better',
        'Bidra til å gjere appen betre',
      ),
      description: _(
        'Vi ønsker dine innspill for å gjøre appen bedre. Trykk på snakkeboblen oppe til høyre for å gi tilbakemelding.',
        'We appreciate your feedback to make the app better. Press the speech bubble in the upper right corner to give feedback.',
        'Vi ønsker dine innspel for å gjere appen betre. Trykk på snakkebobla oppe til høgre for å gi tilbakemelding.',
      ),
      mainButton: _(
        'Begynn å bruk appen',
        'Start using the app',
        'Start å bruke appen',
      ),
    },
  },
  fram: {
    welcome: {
      title: _(
        'Velkommen til FRAM-appen',
        'Welcome to the FRAM app',
        'Velkommen til FRAM-appen',
      ),
      titleA11yLabel: _(
        'Velkommen til FRAM appen',
        'Welcome to the FRAM app',
        'Velkommen til FRAM-appen',
      ),
      description: {
        part1: _(
          'I appen kan du planlegge reisen, sjekke avganger og betale for billetten i én og samme app. Flere funksjoner blir lagt til jevnlig!',
          'In the app, you can plan your journey, check departures and pay for the ticket, all in the same app. More features are regularly added!',
          'I appen kan du planlegge reisa, sjekke avgangar og betale for billetten i ein og same app. Fleire funksjonar vert lagt til jamleg!',
        ),
      },
    },
    intercom: {
      description: _(
        'Vi ønsker tilbakemeldingen din for å gjøre appen bedre. Oppe til høyre i appen finner du snakkeboblen for å ta kontakt.',
        'We appreciate your feedback to make the app better. Press the speech bubble in the upper right corner to give feedback.',
        'Vi ønsker tilbakemeldinga di for å gjere appen betre. Oppe til høgre i appen finn du snakkeebobla for å ta kontakt.',
      ),
    },
  },
});
