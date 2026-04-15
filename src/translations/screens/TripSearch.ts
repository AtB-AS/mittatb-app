import {translation as _} from '../commons';

const TripSearchTexts = {
  header: {
    title: _('Reisesøk', 'Travel search', 'Reisesøk'),
    accessibility: {
      logo: _('Nullstill reisesøk', 'Reset search', 'Nullstill reisesøk'),
    },
  },
  searchState: {
    searching: _(
      'Laster søkeresultater…',
      'Loading search results…',
      'Lastar søkeresultata…',
    ),
    searchSuccess: _(
      'Søkeresultater er lastet inn',
      'Search results are loaded',
      'Søkeresultat er lasta inn',
    ),
    searchEmptyResult: _(
      'Fikk ingen søkeresultater',
      'We could not find any search results',
      'Ingen søkeresultat vart funne',
    ),
    noResultReason: {
      IdenticalLocations: _(
        'Fra- og til-sted er identiske',
        'From- and to-place are identical',
        'Frå- og til-stad er identiske',
      ),
      CloseLocations: _(
        'Det er veldig kort avstand mellom fra- og til-sted',
        'The distance between to- and from-place is very short',
        'Det er veldig kort avstand mellom frå- og til-stad',
      ),
      PastArrivalTime: _(
        'Ankomsttid har passert',
        'Arrival time has passed',
        'Framkomsttid er passert',
      ),
      PastDepartureTime: _(
        'Avreisetid har passert',
        'Departure time has passed',
        'Avreisetidspunktet er passert',
      ),
      MissingLocation: _(
        'Fyll inn begge felter for å utføre et reisesøk',
        'Fill in both fields to perform a travel search',
        'Fyll ut begge felta for å utføre eit reisesøk',
      ),
    },
  },
  location: {
    departurePicker: {
      a11yLabel: _(
        'Velg avreisested',
        'Select place of departure',
        'Vel avreisestad',
      ),
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an address or location',
        'Aktivér for å søke etter adresse eller stad',
      ),
    },
    destinationPicker: {
      a11yLabel: _(
        'Velg ankomststed',
        'Select place of arrival',
        'Vel framkomststad',
      ),
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an address or location',
        'Aktivér for å søke etter adresse eller stad',
      ),
    },
    locationButton: {
      a11yLabel: {
        update: _('Oppdater posisjon', 'Update position', 'Oppdater posisjon'),
        use: _('Bruk min posisjon', 'Use my location', 'Bruk min posisjon'),
      },
    },
    swapButton: {
      a11yLabel: _(
        'Bytt avreisested og ankomststed',
        'Swap place of departure/arrival',
        'Byt avreisestad og framkomststad',
      ),
    },
    updatingLocation: _(
      'Oppdaterer posisjon',
      'Updating location',
      'Oppdaterer posisjon',
    ),
  },
  favorites: {
    favoriteChip: {
      a11yHint: _(
        'Aktivér for å bruke som',
        'Activate to use as',
        'Aktivér for å bruke som',
      ),
    },
  },
  dateInput: {
    options: {
      now: _('Dra nå', 'Leave now', 'Dra no'),
      departure: _('Avreise', 'Leave at', 'Avreise'),
      arrival: _('Ankomst', 'Arrive by', 'Ankomst'),
    },
    departureNow: (time: string) =>
      _(`Dra nå (${time})`, `Leave now (${time})`, `Dra no (${time})`),
    departure: (time: string) =>
      _(`Avreise ${time}`, `Leave at ${time}`, `Avreise ${time}`),
    arrival: (time: string) =>
      _(`Ankomst ${time}`, `Arrive by ${time}`, `Framkomst ${time}`),
    a11yHint: _(
      'Aktivér for å endre reisetidspunkt',
      'Activate to change time of travel',
      'Aktivér for å endre tidspunkt for reise',
    ),
  },
  filterButton: {
    text: _('Filter', 'Filter', 'Filter'),
    a11yHint: _(
      'Aktivér for å velge filtere for reisesøket',
      'Activate to select filters for the travel search',
      'Aktivér for å velje filter for søket',
    ),
  },
  results: {
    fetchMore: _(
      'Last inn flere reiseforslag',
      'Load more results',
      'Last inn fleire reiseforslag',
    ),
    fetchingMore: _(
      'Søker etter flere reiseforslag',
      'Loading more results',
      'Søker etter fleire reiseforslag',
    ),
    unableToFetchMore: _(
      'Finner ikke flere reiseforslag. Forsøk å endre dato og søketidspunkt',
      'Unable to load more results. Please try a different date and time.',
      'Fann ikkje fleire reiseforslag. Prøv å endre dato og søketidspunkt.',
    ),
    error: {
      network: _(
        'Hei, er du på nett? Vi kan ikke hente reiseforslag siden nettforbindelsen din mangler eller er ustabil',
        `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
        `Er du på nett? Vi klarar ikkje hente reiseforslag då tilkopling til internett manglar eller er ustabil`,
      ),
      generic: _(
        'Noe gikk galt med søket. Prøv igjen, eller kontakt kundeservice for hjelp.',
        'Something went wrong with the search. Please try again or contact customer service for assistance.',
        'Noko gjekk gale med søket. Prøv igjen, eller kontakt kundeservice for hjelp.',
      ),
    },

    info: {
      emptySearchResultsTitle: _(
        'Ingen kollektivreiser passer til ditt søk',
        'No public transportation routes match your search criteria',
        'Ingen kollektivreiser passar til søket ditt',
      ),
      emptySearchResultsDetails: _(
        'Prøv å justere på sted eller tidspunkt.',
        'Try adjusting your time or location input.',
        'Prøv å justere på stad eller tidspunkt.',
      ),
      emptySearchResultsDetailsWithFilters: _(
        'Prøv å justere på sted, filter eller tidspunkt.',
        'Try adjusting your time, filters or location input.',
        'Prøv å justere på stad, filter eller tidspunkt.',
      ),
      reasonsTitle: _(
        'Mulige årsaker:',
        'Possible causes:',
        'Moglege årsaker:',
      ),
      resultList: {
        listPositionExplanation: (
          resultPosition: number,
          totalResultCount: number,
        ) =>
          _(
            `Reiseforslag ${resultPosition} av ${totalResultCount}`,
            `Trip suggestion ${resultPosition} of ${totalResultCount}`,
            `Reiseforslag ${resultPosition} av ${totalResultCount}`,
          ),
      },
    },
    resultItem: {
      passedTrip: _(
        'Avgangstid passert',
        'Departure time passed',
        'Avgangstid passert',
      ),
      header: {
        title: (mode: string, placeName: string) =>
          _(
            `${mode} fra ${placeName}`,
            `${mode} from ${placeName}`,
            `${mode} frå ${placeName}`,
          ),
        flexTransportTitle: (publicCode: string) =>
          _(
            `Henting med ${publicCode}`,
            `Pickup with ${publicCode}`,
            `Henting med ${publicCode}`,
          ),
        totalDuration: _('Reisetid', 'Trip duration', 'Reisetid'),
        time: (startTime: string, endTime: string) =>
          _(
            `Fra klokken ${startTime}, til klokken ${endTime}`,
            `From ${startTime}, to ${endTime}`,
            `Frå klokka ${startTime}, til klokka ${endTime}`,
          ),
      },
      tripCancelled: _('Reisen innstilt', 'Trip cancelled', 'Reisa innstilt'),
      hasSituationsTip: _(
        'Denne reisen har driftsmeldinger. Se detaljer for mer info',
        'There are service messages affecting your journey. See details for more info ',
        'Denne reisa har driftsmeldingar. Sjå detaljar for meir informasjon.',
      ),
      footLeg: {
        walkAndWaitLabel: (walkTime: string, waitTime: string) =>
          _(
            `Gå ${walkTime}. Vent ${waitTime}`,
            `Walk ${walkTime}. Wait ${waitTime}`,
            `Gå ${walkTime}. Vent ${waitTime}`,
          ),
        walkLabel: (time: string) =>
          _(`Gå ${time}`, `Walk ${time}`, `Gå ${time}`),
        walkToStopLabel: (distance: string, stopPlace: string) =>
          _(
            `Gå til ${stopPlace}`,
            `Walk ${distance} to ${stopPlace}`,
            `Gå ${distance} til ${stopPlace}`,
          ),
        waitLabel: (time: string) =>
          _(`Vent ${time}`, `Wait ${time}`, `Vent ${time}`),
      },
      destination: {
        a11yLabel: _('Destinasjon', 'Destination', 'Destinasjon'),
      },
      waitRow: {
        label: _('Vent', 'Wait', 'Vent'),
      },
      footer: {
        fromPlace: (place: string) =>
          _(`Fra ${place}`, `From ${place}`, `Frå ${place}`),
        fromPlaceWithTime: (place: string, time: string) =>
          _(
            `Fra ${place} ${time}`,
            `From ${place} ${time}`,
            `Frå ${place} ${time}`,
          ),
        detailsLabel: _('Detaljer', 'Details', 'Detaljar'),
        detailsHint: _(
          'Aktivér for å vise flere reisedetaljer',
          'Activate to show more trip details',
          'Trykk for meir informasjon om reisa.',
        ),
        requiresBooking: _(
          `Krever reservasjon`,
          `Requires booking`,
          `Krev reservasjon`,
        ),
        toLateForBooking: _(
          `Reservasjonsfrist utløpt`,
          `Reservation deadline expired`,
          `Reservasjonsfrist utgått`,
        ),
      },
      journeySummary: {
        resultNumber: (number: number) =>
          _(
            `Reiseresultat ${number}`,
            `Result number ${number}`,
            `Reiseresultat ${number}`,
          ),
        duration: (duration: string) =>
          _(
            `Reisetid: ${duration}`,
            `Travel time: ${duration}`,
            `Reisetid: ${duration}`,
          ),
        legsDescription: {
          footLegsOnly: _(
            'Hele reisen til fots',
            'Foot legs only',
            'Heile reisa til fots',
          ),
          noSwitching: _('Ingen bytter', 'No transfers', 'Ingen bytter'),
          oneSwitch: _('Ett bytte', 'One transfer', 'Eitt bytte'),
          someSwitches: (switchCount: number) =>
            _(
              `${switchCount} bytter`,
              `${switchCount} transfers`,
              `${switchCount} bytte`,
            ),
        },
        prefixedLineNumber: (number: string) =>
          _(`nummer ${number}`, `number ${number}`, `nummer ${number}`),
        totalWalkDistance: (meters: string) =>
          _(
            `Totalt ${meters} meter å gå`,
            `Total of ${meters} meters to walk`,
            `Totalt ${meters} meter å gå`,
          ),
        travelTimes: (
          startTime: string,
          endTime: string,
          duration: string,
          startTimeIsApproximation: boolean,
          endTimeIsApproximation: boolean,
        ) => {
          const circaPrefix = 'ca. ';
          const startTimeCircaPrefix = startTimeIsApproximation
            ? circaPrefix
            : '';
          const endTimeCircaPrefix = endTimeIsApproximation ? circaPrefix : '';
          const totalTimeCircaPrefix =
            startTimeIsApproximation || endTimeIsApproximation
              ? circaPrefix
              : '';
          return _(
            `Start ${startTimeCircaPrefix}klokken ${startTime}, ankomst ${endTimeCircaPrefix}klokken ${endTime}. Total reisetid ${
              totalTimeCircaPrefix + duration
            }.`,
            `Start time ${startTimeCircaPrefix + startTime}, arrival time ${
              endTimeCircaPrefix + endTime
            }. Total travel time ${totalTimeCircaPrefix + duration}`,
            `Start ${startTimeCircaPrefix}klokka ${startTime}, framkomst ${endTimeCircaPrefix}klokka ${endTime}. Total reisetid ${
              totalTimeCircaPrefix + duration
            }.`,
          );
        },
        realtime: (
          fromPlace: string,
          realtimeDepartureTime: string,
          scheduledDepartureTime: string,
        ) =>
          _(
            `Klokken ${realtimeDepartureTime} sanntid, klokken ${scheduledDepartureTime} rutetid`,
            `At ${realtimeDepartureTime} realtime, at ${scheduledDepartureTime} scheduled time`,
            `Klokka ${realtimeDepartureTime} sanntid, klokka ${scheduledDepartureTime} rutetid`,
          ),
        noRealTime: (placeName: string, aimedTime: string) =>
          _(`Klokken ${aimedTime}`, `At ${aimedTime}`, `Klokka ${aimedTime}`),
      },
    },
    dayHeader: {
      today: () => _('I dag', 'Today', 'I dag'),
      tomorrow: (date: string) =>
        _(`I morgen - ${date}`, `Tomorrow - ${date}`, `I morgon - ${date}`),
      dayAfterTomorrow: (date: string) =>
        _(
          `I overmorgen - ${date}`,
          `Day after tomorrow - ${date}`,
          `I overmorgon - ${date}`,
        ),
    },
  },
  onboarding: {
    title: _(
      'Filter i reisesøk 🎉',
      'Filters in travel search 🎉',
      'Filter i reisesøk 🎉',
    ),
    body: {
      part1: _(
        'Nå kan du bruke filter i reisesøk og få reiseforslag tilpasset dine behov.',
        'You can now use filters in travel searches and get travel suggestions adapted to your needs.',
        'No kan du bruke filter i reisesøk og få reiseforslag tilpassa dine behov.',
      ),
      part2: _(
        'Velg hvilke transportmiddel du ønsker å reise med.',
        'Select the means of transport you want to use for your trip.',
        'Vel kva transportmiddel du ønskjer å reise med.',
      ),
    },
    button: _('Den er grei!', 'Sounds good!', 'Den er grei!'),
    a11yLabel: _(
      'Filter i reisesøk! Nå kan du bruke filter i reisesøk og få reiseforslag tilpasset dine behov. Velg hvilke transportmiddel du ønsker å reise med.',
      'Filters in travel search! You can now use filters in travel searches and get travel suggestions adapted to your needs. Select the means of transport you want to use for your trip.',
      'Filter i reisesøk! No kan du bruke filter i reisesøk og få reiseforslag tilpassa dine behov. Vel kva transportmiddel du ønskjer å reise med.',
    ),
  },
  filters: {
    bottomSheet: {
      title: _('Filter', 'Filter', 'Filter'),
      heading: _('Transportmidler', 'Transport modes', 'Transportmiddel'),
      modesAll: _(
        'Alle transportmidler',
        'All transport modes',
        'Alle transportmiddel',
      ),
      use: _('Bruk', 'Use', 'Bruk'),
    },
    selection: {
      transportModes: (selected: number, total: number) =>
        _(
          `${selected} av ${total} transportmidler er valgt`,
          `${selected} of ${total} transportation modes are selected`,
          `${selected} av ${total} transportmiddel er valt ut`,
        ),
      a11yLabelPrefix: _('Filter: ', 'Filter: ', 'Filter: '),
      a11yHint: _(
        'Aktiver for å fjerne filter.',
        'Activate to remove filter.',
        'Aktiver for å fjerne filter.',
      ),
    },
  },
  nonTransit: {
    foot: _('Gå', 'Walk', 'Gå'),
    bicycle: _('Sykkel', 'Bike', 'Sykkel'),
    bikeRental: _('Bysykkel', 'City bike', 'Bysykkel'),
    unknown: _('Ukjent', 'Unknown', 'Ukjent'),
  },
};

export default TripSearchTexts;
