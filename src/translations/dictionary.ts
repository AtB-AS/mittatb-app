import {translation as _} from './utils';

const dictionary = {
  fromPlace: _('Avreisested'),
  toPlace: _('Destinasjon'),
  navigation: {
    assistant: _('Reisesøk'),
    nearby: _('Avganger'),
    ticketing: _('Billetter', 'Tickets'),
    profile: _('Mitt AtB'),
  },
  date: {
    units: {
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
