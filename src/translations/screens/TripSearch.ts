import {translation as _} from '../commons';

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
  results: {
    fetchMore: _('Last inn flere reiseforslag', 'Load more results'),
    fetchingMore: _('Søker etter flere reiseforslag', 'Loading more results'),
  },
};

export default TripSearchTexts;
