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
    'Ingen avganger i nærmeste fremtid',
    'No departures in the near future',
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
  resultType: {
    all: _('Alle holdeplasser', 'All Stops'),
    favourites: _('Favoritter', 'Favourites'),
  },
  message: {
    noFavourites: _(
      'Det er ingen avganger som skal vises, da du ikke har noen stopp merket som favoritter.',
      'There are no departures to be shown, as you have no stops marked as favorites.',
    ),
  },
};
export default DeparturesTexts;
