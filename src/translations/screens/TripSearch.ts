import {translation as _} from '../commons';
import {StreetMode} from '@atb/api/types/generated/journey_planner_v3_types';

const TripSearchTexts = {
  header: {
    title: _('Reisesøk', 'Travel search'),
    accessibility: {
      logo: _('Nullstill reisesøk', 'Reset search'),
    },
  },
  searchState: {
    searching: _('Laster søkeresultater…', 'Loading search results…'),
    searchSuccess: _(
      'Søkeresultater er lastet inn',
      'Search results are loaded',
    ),
    searchEmptyResult: _(
      'Fikk ingen søkeresultater',
      'We could not find any search results',
    ),
    noResultReason: {
      IdenticalLocations: _(
        'Fra- og til-sted er identiske',
        'From- and to-place are identical',
      ),
      CloseLocations: _(
        'Det er veldig kort avstand mellom fra- og til-sted',
        'The distance between to- and from-place is very short',
      ),
      PastArrivalTime: _('Ankomsttid har passert', 'Arrival time has passed'),
      PastDepartureTime: _(
        'Avreisetid har passert',
        'Departure time has passed',
      ),
      MissingLocation: _(
        'Fyll inn begge felter for å utføre et reisesøk',
        'Fill in both fields to perform a travel search',
      ),
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
        use: _('Bruk min posisjon', 'Use my location'),
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
      a11yHint: _('Aktivér for å bruke som', 'Activate to use as'),
    },
  },
  dateInput: {
    departureNow: (time: string) =>
      _(`Avreise nå (${time})`, `Departing now (${time})`),
    departure: (time: string) => _(`Avreise ${time}`, `Departure ${time}`),
    arrival: (time: string) => _(`Ankomst ${time}`, `Arrival ${time}`),
    a11yHint: _(
      'Aktivér for å endre reisetidspunkt',
      'Activate to change time of travel',
    ),
  },
  filterButton: {
    text: _(`Filter`, `Filter`),
    a11yHint: _(
      'Aktivér for å velge filtere for reisesøket',
      'Activate to select filters for the travel search',
    ),
  },
  results: {
    fetchMore: _('Last inn flere reiseforslag', 'Load more results'),
    fetchingMore: _('Søker etter flere reiseforslag', 'Loading more results'),
    unableToFetchMore: _(
      'Finner ikke flere reiseforslag. Forsøk å endre dato og søketidspunkt',
      'Unable to load more results. Please try a different date and time.',
    ),
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
        'Vi fant dessverre ingen reiseruter som passer til ditt søk. ',
        'We could not find any travel routes matching your search criteria.',
      ),
      reasonsTitle: _('Mulige årsaker: ', 'Possible causes:'),
      genericHint: _(
        'Prøv å justere på sted eller tidspunkt.',
        'Try adjusting your time or location input.',
      ),
      genericHintWithFilters: _(
        'Prøv å justere sted, filter eller tidspunkt.',
        'Try adjusting your time, filters or location input.',
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
    dayHeader: {
      today: () => _('I dag', 'Today'),
      tomorrow: (date: string) => _(`I morgen - ${date}`, `Tomorrow - ${date}`),
      dayAfterTomorrow: (date: string) =>
        _(`I overmorgen - ${date}`, `Day after tomorrow - ${date}`),
    },
    resultItem: {
      passedTrip: _('Passert reise, ', 'Passed trip, '),
      header: {
        title: (mode: string, placeName: string) =>
          _(`${mode} fra ${placeName}`, `${mode} from ${placeName}`),
        totalDuration: _('Reisetid', 'Trip duration'),
        time: (startTime: string, endTime: string) =>
          _(
            `Fra klokken ${startTime}, til klokken ${endTime}`,
            `From ${startTime}, to ${endTime}`,
          ),
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
        walkToStopLabel: (distance: string, stopPlace: string) =>
          _(`Gå til ${stopPlace}`, `Walk ${distance} to ${stopPlace}`),
        waitLabel: (time: string) => _(`Vent ${time}`, `Wait ${time}`),
      },
      destination: {
        a11yLabel: _('Destinasjon', 'Destination'),
      },
      waitRow: {
        label: _('Vent', 'Wait'),
      },
      footer: {
        fromPlace: (place: string) => _(`Fra ${place}`, `From ${place}`),
        fromPlaceWithTime: (place: string, time: string) =>
          _(`Fra ${place} ${time}`, `From ${place} ${time}`),
        detailsLabel: _('Detaljer', 'Details'),
        detailsHint: _(
          'Aktivér for å vise flere reisedetaljer',
          'Activate to show more trip details',
        ),
      },
      journeySummary: {
        resultNumber: (number: number) =>
          _(`Reiseresultat ${number}`, `Result number ${number}`),
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
        travelTimes: (startTime: string, endTime: string, duration: string) =>
          _(
            `Start klokken ${startTime}, ankomst klokken ${endTime}. Total reisetid ${duration}.`,
            `Start time ${startTime}, arrival time ${endTime}. Total travel time ${duration}`,
          ),
        realtime: (
          fromPlace: string,
          realtimeDepartureTime: string,
          scheduledDepartureTime: string,
        ) =>
          _(
            `Klokken ${realtimeDepartureTime} sanntid, klokken ${scheduledDepartureTime} rutetid`,
            `At ${realtimeDepartureTime} realtime, at ${scheduledDepartureTime} scheduled time`,
          ),
        noRealTime: (placeName: string, aimedTime: string) =>
          _(`Klokken ${aimedTime}`, `At ${aimedTime}`),
      },
    },
  },
  onboarding: {
    title: _('Filter i reisesøk 🎉', 'Filters in travel search 🎉'),
    body: {
      part1: _(
        'Nå kan du bruke filter i reisesøk og få reiseforslag tilpasset dine behov.',
        'You can now use filters in travel searches and get travel suggestions adapted to your needs.',
      ),
      part2: _(
        'Velg hvilke transportmiddel du ønsker å reise med.',
        'Select the means of transport you want to use for your trip.',
      ),
    },
    button: _('Den er grei!', 'Sounds good!'),
    a11yLabel: _(
      'Filter i reisesøk! Nå kan du bruke filter i reisesøk og få reiseforslag tilpasset dine behov. Velg hvilke transportmiddel du ønsker å reise med.',
      'Filters in travel search! You can now use filters in travel searches and get travel suggestions adapted to your needs. Select the means of transport you want to use for your trip.',
    ),
  },
  filters: {
    bottomSheet: {
      heading: _('Filter', 'Filter'),
      modes: {
        heading: _('Hva vil du reise med?', 'What do you want to travel with?'),
        all: _('Alle', 'All'),
      },
      use: _('Bruk', 'Use'),
      saveFilters: {
        text: _(
          'Lagre valg for fremtidige reisesøk',
          'Save selection for future travel searches',
        ),
        a11yHint: {
          save: _(
            'Aktiver for å lagre valg for fremtidige reisesøk',
            'Activate to save selection for future travel searches',
          ),
          notSave: _(
            'Aktiver for å ikke lagre valg for fremtidige reisesøk',
            'Activate to not save selection for future travel searches',
          ),
        },
      },
    },
    selection: {
      transportModes: (selected: number, total: number) =>
        _(
          `${selected} av ${total} transportmidler er valgt`,
          `${selected} of ${total} transportation modes are selected`,
        ),
      a11yLabelPrefix: _('Filter: ', 'Filter: '),
      a11yHint: _('Aktiver for å fjerne filter.', 'Activate to remove filter.'),
    },
  },
  nonTransit: {
    travelMode: (mode: StreetMode) => {
      switch (mode) {
        case StreetMode.Bicycle:
          return _('Sykkel', 'Bike');
        case StreetMode.BikeRental:
          return _('Bysykkel', 'City bike');
        case StreetMode.Foot:
          return _('Gå', 'Walk');
        case StreetMode.ScooterRental:
          return _('Sparkesykkel', 'E-scooter');
        default:
          return _('', '');
      }
    },
  },
};

export default TripSearchTexts;
