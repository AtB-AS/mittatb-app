import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const MobileTokenWithoutTravelcardOnboardingTexts = {
  flexibilityInfo: {
    heading: _('En mer fleksibel reisehverdag', 'More flexibility'),
    description: _(
      'Du velger selv hvordan du vil bruke og vise frem billetten din.',
      'Choose how to use and show your ticket.',
    ),
  },
  optionsInfo: {
    heading: _('Bruk din mobil', 'Use your phone'),
    description: _(
      'Du kan bruke billetten din på en mobil med appen AtB installert — men kun en av gangen.',
      'You can use your ticket on a phone with the app AtB installed — but only one at a time.',
    ),
  },
  ticketSafetyInfo: {
    heading: _('Vi tar vare på billetten din', 'Your ticket is safe with us'),
    description: _(
      'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister eller bytter mobil.',
      "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose or switch phones.",
    ),
  },
  phone: {
    heading: _('Du bruker nå **mobil**', 'You are now using your **phone**'),
    description: _(
      'Du kan alltid bytte til en annen mobil ved logge inn og gå til **Min profil**.',
      'You can always switch to a different phone by logging in, and heading over to **My profile**.',
    ),
    button: _('Bytt til en annen mobil', 'Switch to a different phone'),
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
      'Vi får ikke knyttet en mobil til brukeren din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med AtB kundesenter.',
      "We can't connect a phone to your user. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact AtB service center.",
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
export default orgSpecificTranslations(
  MobileTokenWithoutTravelcardOnboardingTexts,
  {
    nfk: {
      optionsInfo: {
        heading: _('Bruk din mobil', 'Use your phone'),
        description: _(
          'Du kan bruke billetten din på en mobil med Reis-appen installert — men kun en av gangen.',
          'You can use your ticket on a phone with the Reis app installed — but only one at a time.',
        ),
      },
      ticketSafetyInfo: {
        description: _(
          'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister eller bytter mobil.',
          "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose or switch phones.",
        ),
      },
      phone: {
        description: _(
          'Du kan alltid bytte til en annen mobil ved logge inn og gå til **Min profil**.',
          'You can always switch to a different phone by logging in, and heading over to **My profile**.',
        ),
        button: _('Bytt til en annen mobil', 'Switch to a different phone'),
      },
      error: {
        description: _(
          'Vi får ikke knyttet en mobil til profilen din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med Reis Nordland kundeservice om problemet vedvarer.',
          "We can't connect a phone to your profile. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact Reis Nordland customer service.",
        ),
      },
    },
    fram: {
      optionsInfo: {
        heading: _('Bruk din mobil', 'Use your phone'),
        description: _(
          'Du kan bruke billetten din på en mobil med FRAM-appen installert — men kun en av gangen.',
          'You can use your ticket on a phone with the FRAM app installed — but only one at a time.',
        ),
      },
      ticketSafetyInfo: {
        description: _(
          'Billetten din er trygt lagret på **Min bruker**. Dermed vil du aldri miste den — selv om du mister eller bytter mobil.',
          "Your ticket is safely stored on **My user**. That way you won't lose your ticket even if you lose or switch phones.",
        ),
      },
      phone: {
        description: _(
          'Du kan alltid bytte til en annen mobil ved logge inn og gå til **Min bruker**.',
          'You can always switch to a different phone by logging in, and heading over to **My user**.',
        ),
        button: _('Bytt til en annen mobil', 'Switch to a different phone'),
      },
      error: {
        description: _(
          'Vi får ikke knyttet en mobil til brukeren din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med FRAM kundeservice om problemet vedvarer.',
          "We can't connect a phone to your user. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact FRAM customer service.",
        ),
      },
    },
  },
);
