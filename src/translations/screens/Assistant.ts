import {translation as _} from '../commons';

const AssistantTexts = {
  header: {
    title: _('Reisesøk', 'Travel assistant'),
    accessibility: {
      logo: _('Nullstill reisesøk', 'Reset search'),
    },
  },
  location: {
    departurePicker: {
      label: _('Fra', 'From'),
      a11yLabel: _('Velg avreisested', 'Select place of departure'),
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an address or location',
      ),
    },
    destinationPicker: {
      label: _('Til', 'To'),
      a11yLabel: _('Velg ankomststed', 'Select place of arrival'),
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an address or location',
      ),
    },
    locationButton: {
      a11yLabel: {
        update: _('Oppdater posisjon', 'Update position'),
        use: _('Bruk min posisjon', 'Use my current location'),
      },
    },
    swapButton: {
      a11yLabel: _(
        'Bytt avreisested og ankomststed',
        'Swap place of departure/arrival',
      ),
    },
    updatingLocation: _('Oppdaterer posisjon', 'Updating location'),
  },
  favorites: {
    favoriteChip: {
      a11yHint: _('Aktiver for å bruke som', 'Activate to use as'),
    },
  },
  searchState: {
    searching: _('Laster søkeresultater', 'Loading search results'),
    searchSuccess: _(
      'Søkeresultater er lastet inn',
      'Search results are loaded',
    ),
    searchEmptyResult: _(
      'Fikk ingen søkeresultater',
      'We could not find any search results',
    ),
  },
  results: {
    error: {
      network: _(
        'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil',
        `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
      ),
      generic: _(
        'Oops - vi feila med søket. Supert om du prøver igjen 🤞',
        'Woops – our search engine failed. Please try again 🤞',
      ),
    },
    info: {
      emptyResult: _(
        'Vi fant dessverre ingen reiseruter som passer til ditt søk.',
        'We could not find any travel routes matching your search criteria',
      ),
      reasonsTitle: _('Mulige årsaker: ', 'Possible causes:'),
      genericHint: _(
        'Prøv å justere på sted eller tidspunkt',
        'Try adjusting your time or location input',
      ),
    },
    resultList: {
      listPositionExplanation: (
        resultPosition: number,
        totalResultCount: number,
      ) =>
        _(
          `Reiseforslag ${resultPosition} av ${totalResultCount}`,
          `Trip suggestion ${resultPosition} of ${totalResultCount}`,
        ),
    },
    resultItem: {
      header: {
        time: (startTime: string, endTime: string) =>
          _(
            `Fra klokken ${startTime}, til klokken ${endTime}`,
            `From ${startTime}, to ${endTime}`,
          ),
        totalDuration: _('Reisetid', 'Trip duration'),
      },
      hasSituationsTip: _(
        'Denne reisen har driftsmeldinger. Se detaljer for mer info',
        'There are service messages affecting your journey. See details for more info ',
      ),
      footLeg: {
        walkandWaitLabel: (walkTime: string, waitTime: string) =>
          _(
            `Gå ${walkTime}. Vent ${waitTime}`,
            `Walk ${walkTime}. Wait ${waitTime}`,
          ),
        walkLabel: (time: string) => _(`Gå ${time}`, `Walk ${time}`),
      },
      destination: {
        a11yLabel: _('Destinasjon', 'Destination'),
      },
      waitRow: {
        label: _('Vent', 'Wait'),
      },
      footer: {
        fromLabel: (place: string, time: string) => _(`Fra ${place} ${time}`),
        detailsLabel: _('Detaljer', 'Details'),
        detailsHint: _(
          'Aktivér for å vise flere reisedetaljer',
          'Activate to show more trip details',
        ),
      },
      journeySummary: {
        duration: (duration: string) =>
          _(`Reisetid: ${duration}`, `Travel time: ${duration}`),
        legsDescription: {
          footLegsOnly: _('Hele reisen til fots', 'Foot legs only'),
          noSwitching: _('Ingen bytter', 'No transfers'),
          oneSwitch: _('Ett bytte', 'One transfer'),
          someSwitches: (switchCount: number) =>
            _(`${switchCount} bytter`, `${switchCount} transfers`),
        },
        prefixedLineNumber: (number: string) =>
          _(`nummer ${number}`, `number ${number}`),
        totalWalkDistance: (meters: string) =>
          _(`Totalt ${meters} meter å gå`, `Total of ${meters} meters to walk`),
        departureInfo: (fromPlace: string, fromPlaceDepartureTime: string) =>
          _(
            `Fra ${fromPlace}, klokken ${fromPlaceDepartureTime}`,
            `From ${fromPlace}, at ${fromPlaceDepartureTime}`,
          ),
      },
    },
  },
};

export default AssistantTexts;
