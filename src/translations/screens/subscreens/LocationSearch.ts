import {translation as _} from '../../commons';

const LocationSearchTexts = {
  searchField: {
    placeholder: _(
      'Sted eller adresse',
      'Place or address',
      'Stad eller adresse',
    ),
  },
  header: {
    title: _('Søk', 'Search', 'Søk'),
  },
  results: {
    previousResults: {
      heading: _(
        'Sist brukte steder',
        'Most recent locations',
        'Sist brukte stadar',
      ),
    },
    searchResults: {
      heading: _('Søkeresultater', 'Search results', 'Søkeresultat'),
    },
  },
  journeySearch: {
    previousJourneyResults: {
      heading: _(
        'Sist brukte reisesøk',
        'Most recent journeys',
        'Sist brukte reisesøk',
      ),
    },
    result: {
      a11yLabel: (fromName: string, toName: string) =>
        _(
          `Reise fra ${fromName} til ${toName}.`,
          `Journey from ${fromName} to ${toName}.`,
          `Reise frå ${fromName} til ${toName}.`,
        ),
      a11yHint: _(
        'Aktivér for å søke etter reiser for disse stedene.',
        'Activate to search for trips for these locations.',
        'Aktivér for å søke etter reiser for desse stadene.',
      ),
    },
  },
  locationResults: {
    a11y: {
      activateToUse: _(
        'Aktivér for å bruke dette stedet',
        'Activate to use this location',
        'Aktivér for å bruke denne staden',
      ),
    },
    category: {
      bus: _('Bussholdeplass', 'Bus stop', 'Busshaldeplass'),
      tram: _('Trikkeholdeplass', 'Tram stop', 'Trikkehaldeplass'),
      rail: _('Togstasjon', 'Train station', 'Togstasjon'),
      metro: _('T-banestasjon', 'Metro station', 'T-banestasjon'),
      airport: _('Flyplass', 'Airport', 'Flyplass'),
      boat: _('Fergeleie', 'Ferry stop', 'Ferjekai'),
      unknown: _('Lokasjon', 'Location', 'Stad'),
      location: _('Lokasjon', 'Location', 'Stad'),
    },
  },
  messages: {
    networkError: _(
      'Klarte ikke å søke. Nettforbindelsen din mangler eller er ustabil.',
      `Couldn't complete the search. Your device seems to be offline or the connection is unstable.`,
      `Klarte ikkje å søke. Tilkoplinga til internett manglar eller er ustabil.`,
    ),
    defaultError: _(
      'Klarte ikke å fullføre søket. Prøv igjen, eller kontakt kundeservice for hjelp.',
      "Couldn't complete the search. Please try again or contact customer service for assistance.",
      'Klarte ikkje å fullføre søket. Prøv igjen, eller kontakt kundeservice for hjelp.',
    ),
    emptyResult: _(
      'Fant ingen søkeresultat.',
      'No search results found.',
      `Fann ingen søkeresultat.`,
    ),
  },
  mapSelection: {
    header: {
      title: _('Søk', 'Search', 'Søk'),
    },
    messages: {
      loading: {
        title: _('Laster…', 'Loading…', 'Lastar…'),
      },
      noResult: {
        title: _(
          'Fant ikke noe reisetilbud akkurat her',
          'No mobility service found at this location',
          'Fann ikkje noko reisetilbod her akkurat no',
        ),
        message: _(
          'Er du i nærheten av en adresse, vei eller stoppested?',
          'Are you nearby an address, public road or stop place?',
          'Er du nær ei gateadresse, veg eller holdeplass?',
        ),
      },
      networkError: {
        title: _(
          'Klarte ikke å oppdatere kartet',
          "Couldn't update your map",
          'Klarte ikkje å oppdatere kartet',
        ),
        message: _(
          'Nettforbindelsen din mangler eller er ustabil.',
          'Your network connection is missing or unstable',
          'Tilkoplinga di til internett manglar eller er ustabil.',
        ),
      },
      updateError: {
        title: _(
          'Klarte ikke å oppdatere kartet',
          "Couldn't update the map",
          'Klarte ikkje å oppdatere kartet',
        ),
        message: _(
          'Prøv igjen, eller kontakt kundeservice for hjelp.',
          'Please try again or contact customer service for assistance.',
          'Prøv igjen, eller kontakt kundeservice for hjelp.',
        ),
      },
    },
  },
  onlyStopPlacesCheckbox: _(
    'Vis kun holdeplasser',
    'Show only stop places',
    'Vis berre haldeplassar',
  ),
};
export default LocationSearchTexts;
