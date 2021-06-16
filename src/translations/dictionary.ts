import {Platform} from 'react-native';
import {translation as _} from './commons';

const softhyphen = Platform.OS === 'ios' ? '\u00AD' : '\u200B';

const dictionary = {
  fromPlace: _('Avreisested', 'Place of departure'),
  toPlace: _('Destinasjon', 'Destination'),
  navigation: {
    assistant: _(`Reise${softhyphen}søk`, 'Assistant'),
    nearby: _(`Av${softhyphen}ganger`, 'Departures'),
    ticketing: _('Billetter', 'Tickets'),
    profile: _('Mitt AtB', 'My AtB'),
    profile_a11y: _('Mitt ATB', 'My ATB'),
  },
  missingRealTimePrefix: _('ca. ', 'ca. '),
  travel: {
    legModes: {
      bus: _('Buss', 'Bus'),
      rail: _('Tog', 'Train'),
      tram: _('Trikk', 'Tram'),
      water: _('Båt', 'Boat'),
      air: _('Fly', 'Plain'),
      foot: _('Gange', 'Walk'),
      unknown: _('Ukjent transportmiddel', 'Unknown transport'),
    },
    quay: {
      defaultName: _('Ukjent stoppestedsnavn', 'Unknown name of stop place'),
    },
    line: {
      defaultName: _('Ukjent linjenavn', 'Unknown line name'),
    },
    time: {
      aimedPrefix: _('Rutetid', 'Route time'),
      expectedPrefix: _('Forventet tid', 'Time expected'),
    },
  },
  date: {
    units: {
      now: _('Nå', 'Now'),
      short: {
        year: _('år', 'y'),
        month: _('m', 'm'),
        week: _('u', 'w'),
        day: _('d', 'd'),
        hour: _('t', 'h'),
        minute: _('min', 'min'),
        second: _('sek', 'sec'),
        ms: _('ms', 'msec'),
      },
      long: {},
    },
  },
  distance: {
    km: _('km', 'km'),
    m: _('m', 'm'),
  },
};
export default dictionary;
