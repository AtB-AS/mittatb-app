import {Platform} from 'react-native';
import {translation as _} from './commons';
import orgSpecificTranslations from './utils';

const softhyphen = Platform.OS === 'ios' ? '\u00AD' : '\u200B';

const dictionary = {
  myPosition: _('Min posisjon', 'My current position'),
  fromPlace: _('Avreisested', 'Place of departure'),
  toPlace: _('Destinasjon', 'Destination'),
  navigation: {
    assistant: _(`Reise${softhyphen}søk`, 'Assistant'),
    assistant_a11y: _(
      `Aktiver for reisesøk. Aktiver to ganger for å nullstille søket.`,
      'Activate for search assistant. Activate twice to reset search.',
    ),
    nearby: _(`Av${softhyphen}ganger`, 'Departures'),
    ticketing: _('Billetter', 'Tickets'),
    profile: _('Min profil', 'My profile'),
    profile_a11y: _('Min profil', 'My profile'),
  },
  missingRealTimePrefix: _('ca. ', 'ca. '),
  a11yMissingRealTimePrefix: _('cirka ', 'circa '),
  travel: {
    legModes: {
      bus: _('Buss', 'Bus'),
      rail: _('Tog', 'Train'),
      tram: _('Trikk', 'Tram'),
      water: _('Båt', 'Boat'),
      air: _('Fly', 'Plain'),
      foot: _('Gange', 'Walk'),
      metro: _('T-bane', 'Metro'),
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
