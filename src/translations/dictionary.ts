import {Platform} from 'react-native';
import {translation as _} from './utils';

const softhyphen = Platform.OS === 'ios' ? '\u00AD' : '\u200B';

const dictionary = {
  fromPlace: _('Avreisested'),
  toPlace: _('Destinasjon'),
  navigation: {
    assistant: _(`Reise${softhyphen}søk`),
    nearby: _(`Av${softhyphen}ganger`),
    ticketing: _('Billetter', 'Tickets'),
    profile: _('Mitt AtB'),
  },
  missingRealTime: _('ca.'),
  travel: {
    legModes: {
      bus: _('Buss'),
      rail: _('Tog'),
      tram: _('Trikk'),
      water: _('Båt'),
      air: _('Fly'),
      foot: _('Gange'),
      unknown: _('Ukjent transportmiddel'),
    },
    quay: {
      defaultName: _(''),
    },
    line: {
      defaultName: _(''),
    },
  },
  date: {
    units: {
      now: _('Nå', 'Now'),
      short: {
        year: _('år', 'y'),
        month: _('m'),
        week: _('u'),
        day: _('d'),
        hour: _('t', 'h'),
        minute: _('min'),
        second: _('sek', 'sec'),
        ms: _('ms'),
      },
      long: {},
    },
  },
};
export default dictionary;
