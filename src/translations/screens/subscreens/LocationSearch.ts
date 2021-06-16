import {translation as _} from '../../commons';

const LocationSearchTexts = {
  searchField: {
    placeholder: _(
      'Søk etter adresse eller sted,',
      'Search for an address or location',
    ),
  },
  header: {
    title: _('Søk', 'Search'),
  },
  results: {
    previousResults: {
      heading: _('Sist brukte steder', 'Most recent locations'),
    },
    searchResults: {
      heading: _('Søkeresultater', 'Search results'),
    },
  },
  journeySearch: {
    previousJourneyResults: {
      heading: _('Sist brukte reisesøk', 'Most recent journeys'),
    },
    result: {
      a11yLabel: (fromName: string, toName: string) =>
        _(
          `Reise fra ${fromName} til ${toName}.`,
          `Journey from ${fromName} to ${toName}.`,
        ),
      a11yHint: _(
        'Aktivér for å søke etter reiser for disse stedene.',
        'Activate to search for trips for these locations.',
      ),
    },
  },
  locationResults: {
    a11y: {
      activateToUse: _(
        'Aktivér for å bruke dette stedet',
        'Activate to use this location',
      ),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
    ),
    defaultError: _(
      'Oops - vi feila med søket. Supert om du prøver igjen 🤞',
      'Oops - our search engine failed. Please try again 🤞',
    ),
    emptyResult: _(
      'Fant ingen søkeresultat',
      'We could not find any search results',
    ),
  },
  mapSelection: {
    header: {
      title: _('Søk', 'Search'),
    },
    messages: {
      noResult: {
        title: _(
          'Akkurat her finner vi ikke noe reisetilbud.',
          'We could not find any available mobility service at this location',
        ),
        message: _(
          'Er du i nærheten av en adresse, vei eller stoppested?',
          'Are you nearby an address, public road or stop place?',
        ),
      },
      networkError: {
        title: _(
          'Vi kan ikke oppdatere kartet.',
          'We failed to update your map',
        ),
        message: _(
          'Nettforbindelsen din mangler eller er ustabil.',
          'Your network connection is missing or unstable',
        ),
      },
      updateError: {
        title: _(
          'Oops - vi feila med å oppdatere kartet.',
          'Oops – we failed to update your map',
        ),
        message: _('Supert om du prøver igjen 🤞', 'Please try again 🤞'),
      },
    },
  },
};
export default LocationSearchTexts;
