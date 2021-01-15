import {translation as _} from '../commons';

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
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an adress or a location',
      ),
    },
    destinationPicker: {
      label: _('Til', 'To'),
      a11yLabel: _('Velg ankomststed', 'Select place of arrival'),
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an adress or a location',
      ),

      locationButton: {
        a11yLabel: {
          update: _('Oppdater posisjon', 'Update position'),
          use: _('Bruk min posisjon', 'Use my current position'),
        },
      },
      swapButton: {
        a11yLabel: _(
          'Bytt avreisested og ankomststed',
          'Swap place of departure/arrival',
        ),
      },
      updatingLocation: _('Oppdaterer posisjon', 'Updating position'),
    },
    favorites: {
      favoriteChip: {
        a11yHint: _('Aktiver for å bruke som'),
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
          'Are you online? We´re unable to conduct a search since your device seems to be offline or the connection is unstable',
        ),
        generic: _(
          'Oops - vi feila med søket. Supert om du prøver igjen 🤞',
          'Oops – our search engine failed. Please try again 🤞',
        ),
      },
      info: {
        emptyResult: _(
          'Vi fant dessverre ingen reiseruter som passer til ditt søk.',
          'We could not find any travel routes matching your search criteria',
        ),
        reasonsTitle: _('Mulige årsaker: ', 'Potential causes:'),
        genericHint: _(
          'Prøv å justere på sted eller tidspunkt',
          'Try adjusting your time or location input',
        ),
      },
      resultList: {
        listPositionExplanation: (
          resultPosition: number,
          totalResultCount: number,
        ) => _(`Reiseforslag ${resultPosition} av ${totalResultCount}`),
      },
      resultItem: {
        header: {
          time: (startTime: string, endTime: string) =>
            _(`Fra klokken ${startTime}, til klokken ${endTime}`),
          totalDuration: _('Reisetid'),
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
            'Aktivér for å vise flere detaljer om reisen',
            'Activate to show more journey details',
          ),
        },
        journeySummary: {
          duration: (duration: string) => _(`Reisetid: ${duration}`),
          legsDescription: {
            footLegsOnly: _('Hele reisen til fots'),
            noSwitching: _('Ingen bytter'),
            oneSwitch: _('Ett bytte'),
            someSwitches: (switchCount: number) => _(`${switchCount} bytter`),
          },
          prefixedLineNumber: (number: string) => _(`nummer ${number}`),
          totalWalkDistance: (meters: string) =>
            _(`Totalt ${meters} meter å gå`),
          departureInfo: (fromPlace: string, fromPlaceDepartureTime: string) =>
            _(`Fra ${fromPlace}, klokken ${fromPlaceDepartureTime}`),
        },
      },
    },
  },
};

export default AssistantTexts;
