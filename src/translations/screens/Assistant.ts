import {translation as _} from '../utils';

const AssistantTexts = {
  header: {
    title: _('Reiseassistent', 'Travel assistant'),
    accessibility: {
      logo: _('Nullstill reisesøk'),
    },
  },
  location: {
    departurePicker: {
      label: _('Fra', 'From'),
      a11yLabel: _('Velg avreisested'),
      a11yHint: _('Aktivér for å søke etter adresse eller sted'),
    },
    destinationPicker: {
      label: _('Til', 'To'),
      a11yLabel: _('Velg ankomststed'),
      a11yHint: _('Aktivér for å søke etter adresse eller sted'),
    },
    locationButton: {
      a11yLabel: {
        update: _('Oppdater posisjon'),
        use: _('Bruk min posisjon'),
      },
    },
    swapButton: {
      a11yLabel: _('Bytt avreisested og ankomststed'),
    },
    updatingLocation: _('Oppdaterer posisjon'),
  },
  favorites: {
    favoriteChip: {
      a11yHint: _('Aktiver for å bruke som'),
    },
  },
  searchState: {
    searching: _('Laster søkeresultater'),
    searchSuccess: _('Søkeresultater er lastet inn'),
    searchEmptyResult: _('Fikk ingen søkeresultater'),
  },
  results: {
    error: {
      network: _(
        'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil',
      ),
      generic: _('Oops - vi feila med søket. Supert om du prøver igjen 🤞'),
    },
    info: {
      emptyResult: _(
        'Vi fant dessverre ingen reiseruter som passer til ditt søk.',
      ),
      reasonsTitle: _('Mulige årsaker: '),
      genericHint: _('Prøv å justere på sted eller tidspunkt'),
    },
    resultList: {
      listPositionExplanation: (
        resultPosition: number,
        totalResultCount: number,
      ) =>
        _(`Reiseforslag ${resultPosition} av ${totalResultCount}
      }.`),
    },
    resultItem: {
      details: {
        totalDuration: _('Reisetid'),
      },
      hasSituationsTip: _(
        'Denne reisen har driftsmeldinger. Se detaljer for mer info',
      ),
      a11yHint: _('Aktiver for å vise detaljert reiserute'),
      footLeg: {
        walkandWaitLabel: (walkTime: string, waitTime: string) =>
          _(
            `Gå ${walkTime}. Vent ${waitTime}`,
            `Walk ${walkTime}. Wait ${waitTime}`,
          ),
        walkLabel: (time: string) => _(`Gå ${time}`, `Walk ${time}`),
      },
      waitRow: {
        label: _('Vent'),
      },
      journeySummary: {
        situationsWarning: _('Driftsmeldinger gjelder for dette forslaget.'),
        time: (startTime: string, endTime: string) =>
          _(`Fra klokken ${startTime}, til klokken ${endTime}`),
        duration: (duration: string) => _(`Reisetid: ${duration}`),
        legsDescription: {
          footLegsOnly: _('Hele reisen til fots'),
          noSwitching: _('Ingen bytter'),
          oneSwitch: _('Ett bytte'),
          someSwitches: (switchCount: number) => _(`${switchCount} bytter`),
        },
        prefixedLineNumber: (number: string) => _(`nummer ${number}`),
        totalWalkDistance: (meters: string) => _(`Totalt ${meters} meter å`),
        departureInfo: (fromPlace: string, fromPlaceDepartureTime: string) =>
          _(`Fra ${fromPlace}, klokken ${fromPlaceDepartureTime}`),
      },
    },
  },
};

export default AssistantTexts;
