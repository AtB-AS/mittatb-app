import {translation as _} from '../../utils';

const LocationSearchTexts = {
  searchField: {
    placeholder: _('Søk etter adresse eller sted', 'Search for a place'),
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
