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
      airport: _('Flyplass', 'Airport', 'Flyplass'),
      boat: _('Fergeleie', 'Ferry stop', 'Ferjekai'),
      unknown: _('Lokasjon', 'Location', 'Stad'),
      location: _('Lokasjon', 'Location', 'Stad'),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
      `Hei, er du på nett? Vi klarar ikkje søke sidan tilkoplinga til internett manglar eller er ustabil.`,
    ),
    defaultError: _(
      'Oops - vi feila med søket. Supert om du prøver igjen 🤞',
      'Oops - our search engine failed. Please try again 🤞',
      `Oops - det oppstod ein feil med søket. Ver venleg og prøv igjen 🤞`,
    ),
    emptyResult: _(
      'Fant ingen søkeresultat',
      'We could not find any search results',
      `Fann ingen søkeresultat`,
    ),
  },
  mapSelection: {
    header: {
      title: _('Søk', 'Search', 'Søk'),
    },
    messages: {
      noResult: {
        title: _(
          'Akkurat her finner vi ikke noe reisetilbud.',
          'We could not find any available mobility service at this location',
          'Her finn vi ikkje noko reisetilbod akkurat no.',
        ),
        message: _(
          'Er du i nærheten av en adresse, vei eller stoppested?',
          'Are you nearby an address, public road or stop place?',
          'Er du nær ei gateadresse, veg eller holdeplass?',
        ),
      },
      networkError: {
        title: _(
          'Vi kan ikke oppdatere kartet.',
          'We failed to update your map',
          'Vi kan ikkje oppdatere kartet.',
        ),
        message: _(
          'Nettforbindelsen din mangler eller er ustabil.',
          'Your network connection is missing or unstable',
          'Tilkoplinga di til internett manglar eller er ustabil.',
        ),
      },
      updateError: {
        title: _(
          'Oops - vi feila med å oppdatere kartet.',
          'Oops - we failed to update your map',
          'Oops - det oppstod ein feil med å oppdatere kartet ditt.',
        ),
        message: _(
          'Supert om du prøver igjen 🤞',
          'Please try again 🤞',
          'Ver venleg og prøv igjen 🤞',
        ),
      },
    },
  },
};
export default LocationSearchTexts;
