import {translation as _} from '../../commons';

const FareZoneSearchTexts = {
  searchField: {
    placeholder: _(
      'Søk etter holdeplass',
      'Search for a stop place',
      'Søk etter haldeplass',
    ),
  },
  header: {
    title: _(
      'Søk etter holdeplass/sone',
      'Search for stop/zone',
      'Søk etter haldeplass/sone',
    ),
  },
  zones: {
    heading: _('Soner', 'Zones', 'Soner'),
    item: {
      a11yLabel: (zoneName: string) =>
        _(`Sone ${zoneName}`, `Zone ${zoneName}`, `Sone ${zoneName}`),
      a11yHint: _(
        'Aktivér for å velge denne sonen.',
        'Activate to select this zone.',
        'Aktiver for å velje denne sona.',
      ),
    },
  },
  results: {
    heading: _('Søkeresultater', 'Search results', 'Søkeresultat'),
    item: {
      a11yLabel: (venueName: string, zoneName: string) =>
        _(
          `Stoppested ${venueName} i sone ${zoneName}`,
          `Stop place ${venueName} in zone ${zoneName}`,
          `Stoppestad ${venueName} i sone ${zoneName}`,
        ),
      a11yHint: _(
        'Aktivér for å velge dette stoppestedet.',
        'Activate to select this stop place.',
        'Aktivér for å velje denne stoppestaden.',
      ),
      zoneLabel: (zoneName: string) =>
        _(`Sone ${zoneName}`, `Zone ${zoneName}`, `Sone ${zoneName}`),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
      'Hi, are you connected? We are unable to conduct a search, since your connection is missing or unstable',
      'Hei, er du på nett? Vi klarar ikkje søke då du har manglande eller ustabil tilkoping til internett.',
    ),
    defaultError: _(
      'Noe gikk galt med søket. Prøv igjen, eller kontakt kundeservice for hjelp.',
      'Something went wrong with the search. Please try again or contact customer service for assistance.',
      'Noko gjekk gale med søket. Prøv igjen, eller kontakt kundeservice for hjelp.',
    ),
    emptyResult: _(
      'Fant ingen søkeresultat',
      'No search results to display',
      'Fant ingen søkeresultat',
    ),
  },
};
export default FareZoneSearchTexts;
