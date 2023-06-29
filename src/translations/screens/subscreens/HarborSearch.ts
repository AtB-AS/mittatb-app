import {translation as _} from '../../commons';

const HarborSearchTexts = {
  searchField: {
    placeholder: _('Søk etter kai', 'Search for a harbor'),
  },
  header: {
    titleFrom: _('Velg kai for avreise', 'Search for harbor'),
    titleTo: _('Velg kai for ankomst', 'Search for harbor'),
  },
  stopPlaces: {
    from: _(`Fra`, `From`),
    to: _(`Til`, `To`),
    item: {
      a11yLabel: (zoneName: string) =>
        _(`Kai ${zoneName}`, `Harbor ${zoneName}`),
      a11yHint: _(
        'Aktivér for å velge denne kaia.',
        'Activate to select this harbor.',
      ),
    },
  },
  results: {
    resultsHeading: _('Søkeresultater', 'Search results'),
    nearestHeading: _('Nærmest deg', 'Nearest'),
    departureHeading: _('Avreisekaier', 'Departure harbors'),
    arrivalHeading: (fromHarborName: string) =>
      _(
        `Ankomststeder fra ${fromHarborName}`,
        `Arrival harbors from ${fromHarborName}`,
      ),
    item: {
      a11yLabel: (venueName: string) =>
        _(`Kai ${venueName}`, `Harbor ${venueName}`),
      a11yHint: _(
        'Aktivér for å velge denne kaia.',
        'Activate to select this this harbor.',
      ),
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
export default HarborSearchTexts;
