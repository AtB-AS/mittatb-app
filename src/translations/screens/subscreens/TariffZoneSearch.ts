import {translation as _} from '../../commons';

const TariffZoneSearchTexts = {
  searchField: {
    placeholder: _('Søk etter holdeplass', 'Search for a venue'),
  },
  header: {
    title: _('Søk', 'Search'),
    leftButton: {
      a11yLabel: _('Gå tilbake'),
    },
  },
  zones: {
    heading: _('Soner'),
    item: {
      a11yLabel: (zoneName: string) => _(`Sone ${zoneName}`),
      a11yHint: _('Aktivér for å velge denne sonen.'),
    },
  },
  results: {
    heading: _('Søkeresultater'),
    item: {
      a11yLabel: (venueName: string, zoneName: string) =>
        _(`Stoppested ${venueName} i sone ${zoneName}`),
      a11yHint: _('Aktivér for å velge dette stoppestedet.'),
      zoneLabel: (zoneName: string) => _(`Sone ${zoneName}`),
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
