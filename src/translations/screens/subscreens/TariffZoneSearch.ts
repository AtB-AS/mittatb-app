import {translation as _} from '../../commons';

const TariffZoneSearchTexts = {
  searchField: {
    placeholder: _('Søk etter sone', 'Search for a zone'),
  },
  header: {
    title: _('Søk', 'Search'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  results: {
    searchResults: {
      heading: _('Søkeresultater'),
    },
    item: {
      a11yLabelPrefix: _('Sone '),
      a11yHint: _('Aktivér for å bruke dette resultatet.'),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
    ),
    defaultError: _('Oops - vi feila med søket. Supert om du prøver igjen 🤞'),
    emptyResult: _('Fant ingen søkeresultat'),
  },
};
export default TariffZoneSearchTexts;
