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
    profile: _('Profil', 'Profile', `Profil`),
    profile_a11y: _('Profil', 'Profile', `Profil`),
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
    legSubModes: {
      nightBus: _('Nattbuss', 'Night bus', `Nattbuss`),
    },
    line: _('Linje', 'Line', 'Linje'),
    time: {
      aimedPrefix: _('Rutetid', 'Route time', `Rutetid`),
      expectedPrefix: _('Sanntid', 'Realtime', `Sanntid`),
    },
  },
  appNavigation: {
    close: {
      text: _('Lukk', 'Close', 'Lukk'),
      a11yHint: _(
        'Aktivér for å lukke',
        'Activate to close',
        'Aktivér for å lukke',
      ),
    },
  },
  date: {
    units: {
      now: _('Nå', 'Now', `No`),
      later: _('Senere', 'Later', `Seinare`),
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
      long: {
        minutes: _('minutter', 'minutes', `minuttar`),
        minute: _('minutt', 'minute', `minutt`),
      },
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
          if (daysDifference < 0) {
            return _(
              `for ${daysDifference} dager siden`,
              `${daysDifference} days ago`,
              `for ${daysDifference} dagar sidan`,
            );
          } else {
            return _(
              `om ${daysDifference} dager`,
              `in ${daysDifference} days`,
              `om ${daysDifference} dagar`,
            );
          }
      }
    },
    atTime: _(`kl.`, `at`, `kl.`),
  },
  distance: {
    km: _('km', 'km', `km`),
    m: _('m', 'm', `m`),
  },
  currency: {
    nok: {
      short: _('kr', 'kr', `kr`),
      long: _('kroner', 'kroner', `kroner`),
    },
  },
  messageActions: {
    positiveButton: _('OK', 'OK', 'OK'),
  },
  messageTypes: {
    info: _('Til info', 'Info', `Til info`),
    warning: _('Advarsel', 'Warning', `Åtvaring`),
    valid: _('Suksess', 'Success', `Suksess`),
    error: _('Feil', 'Error', `Feil`),
  },
  confirm: _('Bekreft', 'Confirm', `Bekreft`),
  retry: _('Prøv på nytt', 'Try again', `Prøv på nytt`),
  cancel: _('Avbryt', 'Cancel', `Avbryt`),
  remove: _('Fjern', 'Remove', `Fjern`),
  seeMore: _('Vis mer', 'See more', `Vis meir`),
  readMore: _('Les mer', 'Read more', `Les meir`),
  loading: _('Laster…', 'Loading…', `Lastar…`),
  listConcatWord: _('og', 'and', 'og'),
  via: _('via', 'via', 'via'),
  checked: _('avhuket', 'checked', 'avhuket'),
  unchecked: _('ikke avhuket', 'unchecked', 'Ikkje avhuket'),
  selected: _('Valgt', 'selected', 'Valgt'),
  unselected: _('Ikke valgt', 'Unselected', 'Ikkje valgt'),
  genericErrorMsg: _(
    'Noe gikk galt',
    'Something went wrong',
    `Noko gjekk gale`,
  ),
  zone: _('Sone', 'Zone', 'Sone'),
};

export default orgSpecificTranslations(dictionary, {
  fram: {
    navigation: {
      profile: _('Min bruker', 'My user', 'Min brukar'),
      profile_a11y: _('Min bruker', 'My user', 'Min brukar'),
    },
  },
});
