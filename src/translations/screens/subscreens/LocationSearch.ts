import {translation as _} from '../../commons';

const LocationSearchTexts = {
  searchField: {
    placeholder: _('Søk etter adresse eller sted', 'Search for a place'),
  },
  header: {
    title: _('Søk', 'Search'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  results: {
    previousResults: {
      heading: _('Siste steder'),
    },
    searchResults: {
      heading: _('Søkeresultater'),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
    ),
    defaultError: _('Oops - vi feila med søket. Supert om du prøver igjen 🤞'),
    emptyResult: _('Fant ingen søkeresultat'),
  },
  mapSelection: {
    header: {
      title: _('Søk', 'Search'),
      leftButton: {
        a11yLabel: _('Gå tilbake'),
      },
    },
    messages: {
      noResult: {
        title: _('Akkurat her finner vi ikke noe reisetilbud.'),
        message: _('Er du i nærheten av en adresse, vei eller stoppested?'),
      },
      networkError: {
        title: _('Vi kan ikke oppdatere kartet.'),
        message: _('Nettforbindelsen din mangler eller er ustabil.'),
      },
      updateError: {
        title: _('Oops - vi feila med å oppdatere kartet.'),
        message: _('Supert om du prøver igjen 🤞'),
      },
    },
  },
};
export default LocationSearchTexts;
