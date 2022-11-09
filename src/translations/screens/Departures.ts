import {translation as _} from '../commons';

const DeparturesTexts = {
  header: {
    title: _('Avganger', 'Departures'),
  },
  stopPlaceList: {
    stopPlace: _('Holdeplass', 'Stop'),
    listDescription: {
      geoLoc: _('I nærheten', 'Nearby'),
      address: _(`Holdeplasser nær `, `Stops near `),
    },
    a11yStopPlaceItemHint: _(
      'Aktiver for å se avganger',
      'Activate to view departures',
    ),
  },
  quayChips: {
    allStops: _('Alle stopp', 'All stops'),
    a11yHint: _(
      'Aktiver for å vise avganger fra plattform ',
      'Activate to show departures from platform ',
    ),
    a11yAllStopsHint: _(
      'Aktiver for å vise avganger fra alle plattformer',
      'Activate to show departures from all platforms',
    ),
  },
  dateNavigation: {
    prevDay: _('Forrige dag', 'Previous day'),
    nextDay: _('Neste dag', 'Next day'),
    a11yNextDayHint: _(
      'Aktiver for å gå til neste dag',
      'Activate to go to next day',
    ),
    a11yPreviousDayHint: _(
      'Aktiver for å gå til forrige dag',
      'Activate to go to previous day',
    ),
    today: _('I dag', 'Today'),
    a11yDisabled: _('Deaktivert', 'Disabled'),
    a11yChangeDateHint: _(
      'Aktiver for å forandre dato',
      'Activate to change date',
    ),
    a11ySelectedLabel: (dateTime: string) =>
      _(`Valgt dato: ${dateTime}`, `Selected date, ${dateTime}`),
  },
  noDepartures: _(
    'Ingen avganger i dette tidsrommet.',
    'No departures in the selected period of time.',
  ),
  noDeparturesForFavorites: _(
    'Fant ingen avganger blant favorittene dine. Deaktiver "Vis kun favorittavganger" for å se alle avganger.',
    'We found no departures among your favourites. Disable "View favourite departures only" to show all departures.',
  ),
  quaySection: {
    a11yExpand: _('Aktiver for å utvide', 'Activate to expand'),
    a11yMinimize: _('Aktiver for å minimere', 'Activate to minimize'),
    a11yToQuayHint: _(
      'Aktiver for å vise flere avganger',
      'Activate to show more departures',
    ),
  },
  line: _('Linje', 'Line'),
  a11yEstimatedCallItemHint: _(
    'Aktiver for å se detaljer',
    'Activate to view details',
  ),
  favorites: {
    toggle: _('Vis kun favorittavganger', 'View favourite departures only'),
  },
  widget: {
    heading: _('Favorittavganger', 'Favourite departures'),
  },
  message: {
    noFavourites: _(
      'Det er ingen avganger som skal vises, da du ikke har noen stopp merket som favoritter.',
      'There are no departures to be shown, as you have no stops marked as favourites.',
    ),
    noFavouritesWidget: _(
      'Du har ingen favorittavganger. Trykk på stjernesymbolet i Avganger-visningen for å lagre en avgang du bruker ofte.',
      'You have no favorite departures. Tap a star in the Departures view to save a frequently used departure.',
    ),
    readMoreUrl: _(
      'Les mer og se flere nyttige tips',
      'Read more and find other useful tips',
    ),
  },
  button: {
    text: _('Velg favorittavganger', 'Select favourite departures'),
  },
  onboarding: {
    title: _('Avganger i ny drakt 🎉', 'Departures with new design 🎉'),
    body: {
      part1: _(
        'Det har nå kommet en ny visning av avganger i appen.',
        'There is now a new design of departures in the app.',
      ),
      part2: _(
        'Endringene er basert på tilbakemeldinger fra våre brukere. Foreløpig er det fortsatt mulig å bruke den gamle visningen ved å gå til *Min profil*.',
        'The changes are based on feedback from our users. For the time being it is still possible to use the old design by changing it in *My profile*.',
      ),
    },
    button: _('Den er grei!', 'Sounds good!'),
    a11yLabel: _(
      'Avganger i ny drakt! Det har nå kommet en ny visning av avganger i appen. Endringene er basert på tilbakemeldinger fra våre brukere. Foreløpig er det fortsatt mulig å bruke den gamle visningen ved å gå til Min profil.',
      'Departures with new design! There is now a new design of departures in the app. The changes are based on feedback from our users. For the time being it is still possible to use the old design by changing it in My profile.',
    ),
  },
};
export default DeparturesTexts;
