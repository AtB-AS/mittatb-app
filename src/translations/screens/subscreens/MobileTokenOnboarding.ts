import {translation as _} from '../../commons';
import orgSpecificTranslations from "@atb/translations/utils";

const MobileTokenOnboardingTexts = {
  flexibilityInfo: {
    heading: _('En mer fleksibel reisehverdag', 'More flexibility'),
    description: _(
      'Du velger selv hvordan du vil bruke og vise frem billetten din.',
      'Choose how to use and show your ticket.',
    ),
  },
  optionsInfo: {
    heading: _(
      'Velg mellom t:kort eller mobil',
      'Choose between t:card or phone',
    ),
    description: _(
      'Du kan bruke billetten din på et t:kort eller en mobil med appen AtB installert — men kun en av gangen.',
      'You can use your ticket on a t:card or a phone with the app AtB installed — but only one at a time.',
    ),
    or: _('eller', 'or'),
  },
  ticketSafetyInfo: {
    heading: _('Vi tar vare på billetten din', 'Your ticket is safe with us'),
    description: _(
      'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister t:kortet eller bytter mobil.',
      "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose your t:card or switch phones.",
    ),
  },
  tCard: {
    label: _('T:kort', 'T:card'),
    heading: _('Du bruker nå **t:kort**', 'You are now using your **t:card**'),
    description: _(
      'Du kan alltid bytte til en mobil ved å logge inn og gå til **Min profil**.',
      'You can always switch to a phone by logging in, and heading over to **My profile**.',
    ),
    button: _('Bytt til mobil', 'Switch to phone'),
    reminder: _(
      'Ta med deg t:kortet når du er ute og reiser.',
      'Remember to bring your t:card while travelling.',
    ),
  },
  phone: {
    heading: _('Du bruker nå **mobil**', 'You are now using your **phone**'),
    description: _(
      'Du kan alltid bytte til t:kort eller en annen mobil ved logge inn og gå til **Min profil**.',
      'You can always switch to a t:card or a different phone by logging in, and heading over to **My profile**.',
    ),
    button: _('Bytt til t:kort eller annen mobil', 'Switch to t:card or phone'),
    reminder: _(
      'Ta med deg mobilen når du er ute og reiser.',
      'Remember to bring your phone while travelling. ',
    ),
  },
  error: {
    heading: _(
      'Det ser ut som det tar litt tid...',
      "It looks like it's taking a while...",
    ),
    description: _(
      'Vi får ikke knyttet et t:kort eller en mobil til profilen din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nOm problemet vedvarer kan du ta kontakt med AtB kundesenter.',
      "We can't connect a t:card or phone to your profile. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact AtB service center.",
    ),
  },
  next: _('Neste', 'Next'),
  ok: _('OK', 'OK'),
  or: _('eller', 'or'),
  a11yNextPageHint: _(
    'Aktiver for å gå til neste side',
    'Activate to go to next page',
  ),
};
export default orgSpecificTranslations(MobileTokenOnboardingTexts, {
  nfk: {
    optionsInfo: {
      heading: _(
        'Velg mellom reisekort eller mobil',
        'Choose between travel card or phone',
      ),
      description: _(
        'Du kan bruke billetten din på et reisekort eller en mobil med appen AtB installert — men kun en av gangen.',
        'You can use your ticket on a travel card or a phone with the app AtB installed — but only one at a time.',
      ),
    }
    ,
    ticketSafetyInfo: {
      description: _(
        'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister reisekortet eller bytter mobil.',
        "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose your travel card or switch phones.",
      ),
    },
    tCard: {
      label: _('Reisekort', 'Travel card'),
      heading: _('Du bruker nå **reisekort**', 'You are now using your **travel card**'),
      reminder: _(
        'Ta med deg reisekortet når du er ute og reiser.',
        'Remember to bring your travel card while travelling.',
      ),
    },
    phone: {
      description: _(
        'Du kan alltid bytte til reisekort eller en annen mobil ved logge inn og gå til **Min profil**.',
        'You can always switch to a travel card or a different phone by logging in, and heading over to **My profile**.',
      ),
      button: _('Bytt til reisekort eller annen mobil', 'Switch to travel card or phone'),
    },
    error: {
      description: _(
        'Vi får ikke knyttet et reisekort eller en mobil til profilen din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nOm problemet vedvarer kan du ta kontakt med AtB kundesenter.',
        "We can't connect a travel card or phone to your profile. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact AtB service center.",
      ),
    },
  }
})

