import {translation as _} from '../../commons';
import {orgSpecificTranslations} from '../../orgSpecificTranslations';

const MobileTokenOnboardingTexts = {
  flexibilityInfo: {
    heading: _(
      'En mer fleksibel reisehverdag',
      'More flexibility',
      'Ein meir fleksibel reisekvardag',
    ),
    description: _(
      'Du velger selv hvordan du vil bruke og vise frem billetten din.',
      'Choose how to use and show your ticket.',
      'Du vel sjølv korleis du vil bruke og vise fram billetten din.',
    ),
  },
  optionsInfo: {
    heading: _(
      'Velg mellom t:kort eller mobil',
      'Choose between t:card or phone',
      'Vel mellom t:kort eller mobil',
    ),
    description: _(
      'Du kan bruke billetten din på et t:kort eller en mobil med appen AtB installert — men kun én av gangen.',
      'You can use your ticket on a t:card or a phone with the app AtB installed — but only one at a time.',
      'Du kan bruke billetten din på eit t:kort eller ein mobil med appen AtB installert — men berre éin av gangen.',
    ),
    or: _('eller', 'or', 'eller'),
  },
  ticketSafetyInfo: {
    heading: _(
      'Vi tar vare på billetten din',
      'Your ticket is safe with us',
      'Vi tek vare på billetten din',
    ),
    description: _(
      'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister t:kortet eller bytter mobil.',
      "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose your t:card or switch phones.",
      'Billetten din er trygt lagra på **Min profil**. Difor vil du aldri miste han - sjølv om du mistar t:kortet eller byter mobil.',
    ),
  },
  tCard: {
    label: _('T:kort', 'T:card', 'T:kort'),
    heading: _(
      'Du bruker nå **t:kort**',
      'You are now using your **t:card**',
      'Du brukar no **t:kort**',
    ),
    description: _(
      'Du kan alltid bytte til en mobil ved å logge inn og gå til **Min profil**.',
      'You can always switch to a phone by logging in, and heading over to **My profile**.',
      'Du kan alltid byte til ein mobil ved å logge inn og gå til **Min profil**.',
    ),
    button: _('Bytt til mobil', 'Switch to phone', 'Byt til mobil'),
    reminder: _(
      'Ta med deg t:kortet når du er ute og reiser.',
      'Remember to bring your t:card while travelling.',
      'Ta med deg t:kortet når du er ute og reiser.',
    ),
  },
  phone: {
    heading: _(
      'Du bruker nå **mobil**',
      'You are now using your **phone**',
      'Du brukar no **mobil**',
    ),
    description: _(
      'Du kan alltid bytte til t:kort eller en annen mobil ved logge inn og gå til **Min profil**.',
      'You can always switch to a t:card or a different phone by logging in, and heading over to **My profile**.',
      'Du kan alltid byte til t:kort eller ein annan mobil ved logge inn og gå til **Min profil**.',
    ),
    button: _(
      'Bytt til t:kort eller annen mobil',
      'Switch to t:card or phone',
      'Byt til t:kort eller annan mobil',
    ),
    reminder: _(
      'Ta med deg mobilen når du er ute og reiser.',
      'Remember to bring your phone while travelling. ',
      'Ta med deg mobilen når du er ute og reiser.',
    ),
  },
  error: {
    heading: _(
      'Det ser ut som det tar litt tid...',
      "It looks like it's taking a while...",
      'Ser ut som det kan ta litt tid...',
    ),
    description: _(
      'Vi får ikke knyttet et t:kort eller en mobil til profilen din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nOm problemet vedvarer kan du ta kontakt med AtB kundesenter.',
      "We can't connect a t:card or phone to your profile. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact AtB service center.",
      'Vi får ikkje kopla eit t:kort eller ein mobil til profilen din. Sjekk at du har tilgong til nett.\n\nOm du ikkje har nettilgang vil appen prøve på nytt når du er kobla til igjen.\n\nOm problemet held fram, kan du kontakte AtB kundesenter.',
    ),
  },
  next: _('Neste', 'Next', 'Neste'),
  ok: _('OK', 'OK', 'OK'),
  or: _('eller', 'or', 'eller'),
  a11yNextPageHint: _(
    'Aktiver for å gå til neste side',
    'Activate to go to next page',
    'Aktiver for å gå til neste side',
  ),
  withoutTravelcard: {
    optionsInfo: {
      heading: _('Bruk din mobil', 'Use your phone', 'Bruk mobilen din'),
      description: _(
        'Du kan bruke billetten din på en mobil med appen AtB installert — men kun én av gangen.',
        'You can use your ticket on a phone with the app AtB installed — but only one at a time.',
        'Du kan bruke billetten din på ein mobil med appen AtB installert - men berre éin av gangen.',
      ),
    },
    ticketSafetyInfo: {
      description: _(
        'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister eller bytter mobil.',
        "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose or switch phones.",
        'Billetten din er trygt lagra på **Min profil**. Difor vil du aldri miste han - sjølv om du mistar eller byter mobil.',
      ),
    },
    phone: {
      description: _(
        'Du kan alltid bytte til en annen mobil ved logge inn og gå til **Min profil**.',
        'You can always switch to a different phone by logging in, and heading over to **My profile**.',
        'Du kan alltid bytte til ein annan mobil ved logge inn og gå til **Min profil**.',
      ),
      button: _(
        'Bytt til en annen mobil',
        'Switch to a different phone',
        'Byt til ein annan mobil',
      ),
    },
    error: {
      description: _(
        'Vi får ikke knyttet en mobil til brukeren din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med AtB kundesenter.',
        "We can't connect a phone to your user. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact AtB service center.",
        'Vi får ikkje knytt ein mobil til brukaren din. Sjekk at du har tilgong til nett.\n\nOm du ikkje har nettilgang vil appen prøve på nytt når du er kobla til igjen.\n\nTa kontakt med AtB kundesenter.',
      ),
    },
  },
};
export default orgSpecificTranslations(MobileTokenOnboardingTexts, {
  nfk: {
    optionsInfo: {
      heading: _(
        'Velg mellom reisekort eller mobil',
        'Choose between travel card or phone',
        'Vel mellom reisekort eller mobil',
      ),
      description: _(
        'Du kan bruke billetten din på et reisekort eller en mobil med Reis-appen installert — men kun én av gangen.',
        'You can use your ticket on a travel card or a phone with the Reis app installed — but only one at a time.',
        'Du kan bruke billetten din på eit reisekort eller ein mobil med Reis-appen installert - men berre éin av gongen.',
      ),
    },
    ticketSafetyInfo: {
      description: _(
        'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister reisekortet eller bytter mobil.',
        "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose your travel card or switch phones.",
        'Billetten din er trygt lagra på **Min profil**. Då vil du aldri miste den - sjølv om du mistar reisekortet eller bytar mobil.',
      ),
    },
    tCard: {
      label: _('Reisekort', 'Travel card', 'Reisekort'),
      heading: _(
        'Du bruker nå **reisekort**',
        'You are now using your **travel card**',
        'Du nyttar no **reisekort**',
      ),
      reminder: _(
        'Ta med deg reisekortet når du er ute og reiser.',
        'Remember to bring your travel card while travelling.',
        'Ta med deg reisekortet når du er ute og reiser.',
      ),
    },
    phone: {
      description: _(
        'Du kan alltid bytte til reisekort eller en annen mobil ved logge inn og gå til **Min profil**.',
        'You can always switch to a travel card or a different phone by logging in, and heading over to **My profile**.',
        'Du kan alltid byte til reisekort eller ein annan mobil ved å logga inn og gå til **Min profil**.',
      ),
      button: _(
        'Bytt til reisekort eller annen mobil',
        'Switch to travel card or phone',
        'Byt til reisekort eller annan mobil',
      ),
    },
    error: {
      description: _(
        'Vi får ikke knyttet et reisekort eller en mobil til profilen din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med Reis Nordland kundeservice om problemet vedvarer.',
        "We can't connect a travel card or phone to your profile. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact Reis Nordland customer service.",
        'Vi får ikkje knytt eit reisekort eller ein mobil til profilen din. Sjekk om du har tilgang til internett. Hvis du ikkje er på nett, vil appen prøve på nytt når du blir kobla opp igjen.\n\nKontakt kundeservice hjå Reis Nordland dersom problemet held fram.',
      ),
    },
    withoutTravelcard: {
      optionsInfo: {
        description: _(
          'Du kan bruke billetten din på en mobil med Reis-appen installert — men kun én av gangen.',
          'You can use your ticket on a phone with the Reis app installed — but only one at a time.',
          'Du kan bruke billetten din på ein mobil med Reis-appen installert - men berre éin av gongen.',
        ),
      },
      ticketSafetyInfo: {
        description: _(
          'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du mister eller bytter mobil.',
          "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you lose or switch phones.",
          'Billetten din er trygt lagra på **Min profil**. Då vil du aldri mista den - sjølv om du mistar eller bytar mobil.',
        ),
      },
      phone: {
        description: _(
          'Du kan alltid bytte til en annen mobil ved logge inn og gå til **Min profil**.',
          'You can always switch to a different phone by logging in, and heading over to **My profile**.',
          'Du kan alltid byte til ein annan mobil ved å logga inn og gå til **Min profil**.',
        ),
      },
      error: {
        description: _(
          'Vi får ikke knyttet en mobil til profilen din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med Reis Nordland kundeservice om problemet vedvarer.',
          "We can't connect a phone to your profile. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact Reis Nordland customer service.",
          'Vi får ikkje knytt ein mobil til profilen din. Sjekk at du har tilgang til internett. Hvis du ikkje er på nett, vil appen prøve på nytt når du blir kobla opp igjen.\n\nKontakt Reis Nordland kundeservice om problemet held fram.',
        ),
      },
    },
  },
  fram: {
    optionsInfo: {
      heading: _(
        'Velg mellom reisekort eller mobil',
        'Choose between travel card or phone',
        'Vel mellom reisekort eller mobil',
      ),
      description: _(
        'Du kan bruke billetten din på et reisekort eller en mobil med FRAM-appen installert — men kun én av gangen.',
        'You can use your ticket on a travel card or a phone with the FRAM app installed — but only one at a time.',
        'Du kan bruke billetten din på eit reisekort eller ein mobil med FRAM-appen installert — men berre ein om gangen.',
      ),
    },
    ticketSafetyInfo: {
      description: _(
        'Billetten din er trygt lagret på din konto i skyen. Dermed vil du aldri miste den — selv om du mister reisekortet eller bytter mobil.',
        "Your ticket is safely stored on your account in the cloud. That way you won't lose your ticket even if you lose your travel card or switch phones.",
        'Billetten din er trygt lagra på kontoen din i skya. Då vil du aldri miste den — sjølv om du mistar reisekortet eller byter mobil.',
      ),
    },
    tCard: {
      label: _('Reisekort', 'Travel card', 'Reisekort'),
      heading: _(
        'Du bruker nå **reisekort**',
        'You are now using your **travel card**',
        'Du brukar no **reisekort**',
      ),
      description: _(
        'Du kan alltid bytte til en mobil ved å logge inn og gå til **Min bruker**.',
        'You can always switch to a phone by logging in, and heading over to **My user**.',
        'Du kan alltid byte til ein mobil ved å logge inn og gå til **Min brukar**.',
      ),

      reminder: _(
        'Ta med deg reisekortet når du er ute og reiser.',
        'Remember to bring your travel card while travelling.',
        'Ta med deg reisekortet når du er ute og reiser.',
      ),
    },
    phone: {
      description: _(
        'Du kan alltid bytte til reisekort eller en annen mobil ved logge inn og gå til **Min bruker**.',
        'You can always switch to a travel card or a different phone by logging in, and heading over to **My user**.',
        'Du kan alltid byte til reisekort eller ein annan mobil ved å logge inn og gå til **Min brukar**.',
      ),
      button: _(
        'Bytt til reisekort eller annen mobil',
        'Switch to travel card or phone',
        'Byt til reisekort eller annan mobil',
      ),
    },
    error: {
      description: _(
        'Vi får ikke knyttet et reisekort eller en mobil til brukeren din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med FRAM Kundesenter om problemet vedvarer.',
        "We can't connect a travel card or phone to your user. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact FRAM Customer Centre.",
        'Vi får ikkje knytt eit reisekort eller ein mobil til brukaren din. Sjekk at du har tilgang til nett.\n\nHvis du ikkje er på nett, vil appen prøve på nytt når du er kopla på igjen.\n\nTa kontakt med FRAM Kundesenter om problema vedvarar.',
      ),
    },
    withoutTravelcard: {
      optionsInfo: {
        description: _(
          'Du kan bruke billetten din på en mobil med FRAM-appen installert — men kun én av gangen.',
          'You can use your ticket on a phone with the FRAM app installed — but only one at a time.',
          'Du kan bruke billetten din på ein mobil med FRAM-appen installert — men berre ein om gangen.',
        ),
      },
      ticketSafetyInfo: {
        description: _(
          'Billetten din er trygt lagret på din konto i skyen. Dermed vil du aldri miste den — selv om du mister eller bytter mobil.',
          "Your ticket is safely stored on your account in the cloud. That way you won't lose your ticket even if you lose or switch phones.",
          'Billetten din er trygt lagra på kontoen din i skya. Då vil du aldri miste den — sjølv om du mistar eller byter mobil.',
        ),
      },
      phone: {
        description: _(
          'Du kan alltid bytte til en annen mobil ved logge inn og gå til **Min bruker**.',
          'You can always switch to a different phone by logging in, and heading over to **My user**.',
          'Du kan alltid byte til ein annan mobil ved å logge inn og gå til **Min brukar**.',
        ),
      },
      error: {
        description: _(
          'Vi får ikke knyttet en mobil til brukeren din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med FRAM Kundesenter om problemet vedvarer.',
          "We can't connect a phone to your user. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact FRAM Customer Centre.",
          'Vi får ikkje knytt ein mobil til brukaren din. Sjekk at du har tilgang til nett.\n\nHvis du ikkje er på nett, vil appen prøve på nytt når du er kopla på igjen.\n\nTa kontakt med FRAM Kundesenter om problema vedvarar.',
        ),
      },
    },
  },
  troms: {
    ticketSafetyInfo: {
      description: _(
        'Billetten din er trygt lagret på **Min profil**. Dermed vil du aldri miste den — selv om du bytter mobil.',
        "Your ticket is safely stored on **My profile**. That way you won't lose your ticket even if you switch phones.",
        'Billetten din er trygt lagra på **Min profil**. Difor vil du aldri miste han - sjølv om du byter mobil.',
      ),
    },
    withoutTravelcard: {
      optionsInfo: {
        description: _(
          'Du kan bruke billetten din på en mobil med appen Svipper installert — men kun på én mobil av gangen.',
          'You can use your ticket on a phone with the app Svipper installed — but only on one phone at a time.',
          'Du kan bruke billetten din på ein mobil med appen Svipper installert - men berre på éin mobil av gangen.',
        ),
      },
      error: {
        description: _(
          'Vi får ikke knyttet en mobil til brukeren din. Sjekk at du har tilgang på nett.\n\nHvis du ikke er på nett, vil appen prøve på nytt når du er koblet på igjen.\n\nTa kontakt med Svipper kundeservice.',
          "We can't connect a phone to your user. Check your internet connection.\n\nIf you are not online, the app will try again when you are connected.\n\nIf the problem persists, please contact Svipper customer service.",
          'Vi får ikkje knytt ein mobil til brukaren din. Sjekk at du har tilgong til nett.\n\nOm du ikkje har nettilgang vil appen prøve på nytt når du er kobla til igjen.\n\nTa kontakt med Svipper kundeservice.',
        ),
      },
    },
  },
});
