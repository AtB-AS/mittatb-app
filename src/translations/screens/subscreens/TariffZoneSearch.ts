import {translation as _} from '../../commons';

const TariffZoneSearchTexts = {
  searchField: {
    placeholder: _('Søk etter holdeplass', 'Search for a stop place'),
  },
  header: {
    title: _('Søk etter holdeplass/sone', 'Search for stop/zone'),
  },
  zones: {
    heading: _('Soner', 'Zones'),
    item: {
      a11yLabel: (zoneName: string) =>
        _(`Sone ${zoneName}`, `Zone ${zoneName}`),
      a11yHint: _(
        'Aktivér for å velge denne sonen.',
        'Activate to select this zone',
      ),
    },
  },
  results: {
    heading: _('Søkeresultater', 'Search results'),
    item: {
      a11yLabel: (venueName: string, zoneName: string) =>
        _(
          `Stoppested ${venueName} i sone ${zoneName}`,
          `Stop place ${venueName} in zone ${zoneName}`,
        ),
      a11yHint: _(
        'Aktivér for å velge dette stoppestedet.',
        'Activate to select this stop place.',
      ),
      zoneLabel: (zoneName: string) =>
        _(`Sone ${zoneName}`, `Zone ${zoneName}`),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
      'Hi, are you connected? We are unable to conduct a search, since your connection is missing or unstable',
    ),
    defaultError: _(
      'Oops - vi feila med søket. Supert om du prøver igjen 🤞',
      'Whoops – our search failed. Please try again 🤞',
    ),
    emptyResult: _('Fant ingen søkeresultat', 'No search results to display'),
  },
};
export default TariffZoneSearchTexts;
