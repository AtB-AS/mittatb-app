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
  resultType: {
    all: _('Alle holdeplasser', 'All Stops'),
    favourites: _('Favoritter', 'Favourites'),
  },
  message: {
    noFavourites: _(
      'Det er ingen avganger som skal vises, da du ikke har noen stopp merket som favoritter.',
      'There are no departures to be shown, as you have no stops marked as favourites.',
    ),
    noFavouritesWidget: _(
      'For å vise dine favoritter på forsiden må du først legge til noen favoritter. Du kan legge til en favoritt ved å klikke på stjernen ved avganger i Avganger-visningen.',
      'To show your favourites in this widget, you will need to add one or more favourite departures. You may add a favourite by clicking the star next to a departure in the Departure view.',
    ),
    noFrontpageFavouritesWidget: _(
      'Du kan vise favorittavganger på denne siden. Du kan velge hvilke avganger du vil vise med knappen under.',
      'You can now show your favourite departures in this section. You may select the favourites you would like to display, using the button below.',
    ),
  },
  button: {
    text: _('Velg favorittavganger', 'Select favourite departures'),
  },
};
export default DeparturesTexts;
