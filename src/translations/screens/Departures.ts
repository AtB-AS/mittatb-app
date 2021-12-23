import {translation as _} from '../commons';

const DeparturesTexts = {
  header: {
    title: _('Avganger', 'Departures'),
  },
  stopPlaceList: {
    stopPlace: _('Holdeplass', 'Stop'),
  },
  quayChips: {
    allStops: _('Alle stopp', 'All stops'),
  },
  stopPlaceScreen: {
    dateNavigation: {
      prevDay: _('Forrige dag', 'Previous day'),
      nextDay: _('Neste dag', 'Next day'),
      today: _('I dag', 'Today'),
    },
    noDepartures: _(
      'Ingen avganger i nærmeste fremtid',
      'No departures in the near future',
    ),
  },
};
export default DeparturesTexts;
