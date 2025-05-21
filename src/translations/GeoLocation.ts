import {translation as _} from './commons';

const GeoLocationTexts = {
  locationPermission: {
    title: (isPrecise: boolean) =>
      isPrecise
        ? _(
            'Endre telefoninnstillinger for å bruke presis posisjon.',
            'Change phone settings to use precise location.',
            'Endra telefoninnstillingar for å bruka presis posisjon.',
          )
        : _(
            'Endre telefoninnstillinger for å bruke din posisjon.',
            'Change phone settings to use your location.',
            'Endra telefoninnstillingar for å bruka di posisjon.',
          ),
    message: (isPrecise: boolean) =>
      isPrecise
        ? _(
            'Vi bruker presis posisjon til å vise din posisjon i kart og reisesøk, til å finne holdeplasser og steder i nærheten, og til å bekrefte din posisjon når du bruker sparkesykler. For å bruke presis posisjon må du endre innstillingene for appen.',
            'We use precise location to show your location on the map and in travel search, to find stops and places nearby, and to confirm your location when using scooters. To use precise location, you must change the app settings.',
            'Vi brukar presis posisjon for å vise posisjonen din i kart og reisesøk, til å finne haldeplassar og stader i nærleiken, og til å bekrefte posisjonen din når du brukar sparkesyklar. For å bruke presis posisjon må du endre innstillingane for appen.',
          )
        : _(
            'Vi bruker posisjon til å vise din posisjon i kart og reisesøk, til å finne holdeplasser og steder i nærheten, og til å bekrefte din posisjon når du bruker sparkesykler.',
            'We use location to show your location on the map and in travel search, to find stops and places nearby, and to confirm your location when using scooters.',
            'Vi brukar posisjon for å vise posisjonen din i kart og reisesøk, til å finne holdeplassar og stader i nærleiken, og til å bekrefte posisjonen din når du brukar sparkesyklar.',
          ),
    goToSettings: _(
      'Gå til innstillinger',
      'Go to settings',
      'Gå til innstillingar',
    ),
    cancel: _('Avbryt', 'Cancel', 'Avbryt'),
  },

  blockedLocation: {
    title: _(
      'Du har blokkert posisjonsdeling',
      'Location is blocked',
      'Du har blokkert posisjonsdeling',
    ),
    message: (isPrecise: boolean) =>
      isPrecise
        ? _(
            'For å kunne bruke posisjonen din må du aktivere presis lokasjonstjeneste på telefonen din.',
            'To use your location, you must enable precise location service on your phone.',
            'For å kunne bruke posisjonen din må du aktivere presis lokasjonstjeneste på telefonen din.',
          )
        : _(
            'For å kunne bruke posisjonen din må du aktivere lokasjonstjenester på telefonen din.',
            'To use your location, you must enable location services on your phone.',
            'For å kunne bruke posisjonen din må du aktivere lokasjonstjenester på telefonen din.',
          ),
  },
};

export default GeoLocationTexts;
