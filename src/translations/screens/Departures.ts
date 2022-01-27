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
  a11yEstimatedCallItem: (
    time: string,
    publicCode?: string,
    frontText?: string,
  ) =>
    _(
      `Linje ${publicCode}, ${frontText}. ${time}`,
      `Line ${publicCode}, ${frontText}. ${time}`,
    ),
};
export default DeparturesTexts;
