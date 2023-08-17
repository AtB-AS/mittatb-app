import {Platform} from 'react-native';
import {translation as _} from './commons';
import {orgSpecificTranslations} from '@atb/translations/orgSpecificTranslations';

const softhyphen = Platform.OS === 'ios' ? '\u00AD' : '\u200B';

const dictionary = {
  myPosition: _('Min posisjon', 'My position', 'Min posisjon'),
  fromPlace: _('Avreisested', 'Place of departure', 'Avreisestad'),
  toPlace: _('Destinasjon', 'Destination', 'Destinasjon'),
  navigation: {
    assistant: _(`Reise${softhyphen}søk`, 'Assistant', `Reisesøk`),
    assistant_a11y: _(
      `Aktiver for reisesøk. Aktiver to ganger for å nullstille søket.`,
      'Activate for search assistant. Activate twice to reset search.',
      `Aktiver for reisesøk. Aktiver to gonger for å nullstille søket.`,
    ),
    map: _(`Kart`, 'Map', `Kart`),
    nearby: _(`Av${softhyphen}ganger`, 'Departures', `Avgangar`),
    ticketing: _('Billetter', 'Tickets', `Billettar`),
    profile: _('Min profil', 'My profile', `Min profil`),
    profile_a11y: _('Min profil', 'My profile', `Min profil`),
  },
  missingRealTimePrefix: _('ca. ', 'ca. ', `ca. `),
  a11yRouteTimePrefix: _('rutetid ', 'route time ', `rutetid `),
  a11yRealTimePrefix: _('sanntid ', 'realtime ', `sanntid `),
  travel: {
    legModes: {
      bus: _('Buss', 'Bus', `Buss`),
      rail: _('Tog', 'Train', `Tog`),
      tram: _('Trikk', 'Tram', `Trikk`),
      water: _('Båt', 'Boat', `Båt`),
      air: _('Fly', 'Plane', `Fly`),
      foot: _('Gange', 'Walk', `Gange`),
      metro: _('T-bane', 'Metro', `T-bane`),
      bicycle: _('Sykkel', 'Bicycle', `Sykkel`),
      unknown: _(
        'Ukjent transportmiddel',
        'Unknown transport',
        `Ukjent transportmiddel`,
      ),
    },
    quay: {
      defaultName: _(
        'Ukjent stoppestedsnavn',
        'Unknown name of stop place',
        `Ukjent namn på stoppestad`,
      ),
    },
    line: {
      defaultName: _(
        'Ukjent linjenavn',
        'Unknown line name',
        `Ukjent namn på linje`,
      ),
    },
    time: {
      aimedPrefix: _('Rutetid', 'Route time', `Rutetid`),
      expectedPrefix: _('Sanntid', 'Realtime', `Sanntid`),
    },
  },
  date: {
    units: {
      now: _('Nå', 'Now', `No`),
      short: {
        year: _('år', 'y', `år`),
        month: _('m', 'm', `mnd`),
        week: _('u', 'w', `v`),
        day: _('d', 'd', `dag`),
        hour: _('t', 'h', `t`),
        minute: _('min', 'min', `min`),
        second: _('sek', 'sec', `s`),
        ms: _('ms', 'msec', `ms`),
      },
      long: {},
    },
    relativeDayNames: (daysDifference: number) => {
      switch (daysDifference) {
        case -2:
          return _('i forgårs', 'the day before yesterday', 'i forgårs');
        case -1:
          return _('i går', 'yesterday', 'i går');
        case 0:
          return _('i dag', 'today', 'i dag');
        case 1:
          return _('i morgen', 'tomorrow', 'i morgon');
        case 2:
          return _('i overmorgen', 'the day after tomorrow', 'i overmorgon');
        default:
          return _('', '', '');
      }
    },
    atTime: _(`kl.`, `at`, `kl.`),
  },
  distance: {
    km: _('km', 'km', `km`),
    m: _('m', 'm', `m`),
  },
  messageTypes: {
    info: _('Til info', 'Info', `Til info`),
    warning: _('Advarsel', 'Warning', `Åtvaring`),
    valid: _('Suksess', 'Success', `Suksess`),
    error: _('Feil', 'Error', `Feil`),
  },
  retry: _('Prøv på nytt', 'Try again', `Prøv på nytt`),
  seeMore: _('Vis mer', 'See more', `Vis meir`),
  readMore: _('Les mer', 'Read more', `Les meir`),
};

export default orgSpecificTranslations(dictionary, {
  fram: {
    navigation: {
      profile: _('Min bruker', 'My user', 'Min brukar'),
      profile_a11y: _('Min bruker', 'My user', 'Min brukar'),
    },
  },
});
