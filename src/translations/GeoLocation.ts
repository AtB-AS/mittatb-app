import {translation as _} from './commons';

const GeoLocationTexts = {
  locationPermission: {
    title: _(
      'Endre telefoninnstillinger for å bruke din posisjon.',
      'Change phone settings to use your location.',
      'Endra telefoninnstillingar for å bruka di posisjon.',
    ),
    message: _(
      'Vi bruker posisjon til å vise din posisjon i kart og reisesøk, og til å finne holdeplasser og steder i nærheten.',
      'We use location to display your position on the map and in travel searches, and to find stops and places nearby.',
      'Vi brukar posisjon for å vise posisjonen din i kart og reisesøk, og for å finne holdeplassar og stader i nærleiken.',
    ),
    goToSettings: _(
      'Gå til instillinger',
      'Go to settings',
      'Gå til instillingar',
    ),
    cancel: _('Avbryt', 'Cancel', 'Avbryt'),
  },

  blockedLocation: {
    title: _(
      'Du har blokkert posisjonsdeling',
      'Location is blocked',
      'Du har blokkert posisjonsdeling',
    ),
    message: _(
      'For å kunne bruke posisjonen din må du aktivere lokasjonstjenester på telefonen din.',
      'To use your location, you must enable location services on your phone.',
      'For å kunne bruke posisjonen din må du aktivere lokasjonstjenester på telefonen din.',
    ),
  },
};

export default GeoLocationTexts;
