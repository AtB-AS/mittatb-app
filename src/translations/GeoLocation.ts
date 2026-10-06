import {translation as _} from './commons';

const GeoLocationTexts = {
  locationPermission: {
    title: (isPrecise: boolean) =>
      isPrecise
        ? _(
            'Del presis posisjon med AtB-appen',
            'Share your precise location with AtB',
            'Del presis posisjon med AtB-appen',
          )
        : _(
            'Del posisjon med AtB-appen',
            'Share your location with AtB',
            'Del posisjon med AtB-appen',
          ),
    message: (isPrecise: boolean) =>
      isPrecise
        ? _(
            'Presis posisjon brukes i kart og søk for å finne steder i nærheten og er nødvendig for å bruke elsparkesykler og bysykler.',
            'Precise location is used to find places nearby in map and search and is required to use e-scooters and city bikes.',
            'Presis posisjonen vert brukt i kart og søk for å finne stader i nærleiken og er nødvendig for å bruke elsparkesyklar og bysyklar.',
          )
        : _(
            'Din posisjon brukes i kart og søk for å finne steder i nærheten og er nødvendig for å bruke elsparkesykler og bysykler.',
            'Your location is used to find places nearby in map and search and is required to use e-scooters and city bikes.',
            'Posisjonen din vert brukt i kart og søk for å finne stader i nærleiken og er nødvendig for å bruke elsparkesyklar og bysyklar.',
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
