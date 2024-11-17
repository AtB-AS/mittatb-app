import {translation as _} from '../../commons';

const HarborSearchTexts = {
  searchField: {
    placeholder: _('Søk etter kai', 'Search for a harbor', 'Søk etter kai'),
  },
  header: {
    titleFrom: _(
      'Velg kai for avreise',
      'Search for departure harbor',
      'Vel kai for avreise',
    ),
    titleTo: _(
      'Velg kai for ankomst',
      'Search for destination harbor',
      'Vel kai for framkomst',
    ),
  },
  stopPlaces: {
    from: _(`Fra`, `From`, `Frå`),
    to: _(`Til`, `To`, `Til`),
  },
  results: {
    resultsHeading: _('Søkeresultater', 'Search results', 'Søkeresultat'),
    nearestHeading: _('Nærmest deg', 'Nearest', 'Nærast deg'),
    departureHeading: _('Avreisekaier', 'Departure harbors', 'Avreisekaier'),
    arrivalHeading: (fromHarborName: string) =>
      _(
        `Ankomststeder fra ${fromHarborName}`,
        `Destination harbors from ${fromHarborName}`,
        `Framkomststader frå ${fromHarborName}`,
      ),
    item: {
      a11yLabel: (venueName: string) =>
        _(`Kai ${venueName}`, `Harbor ${venueName}`, `Kai ${venueName}`),
      a11yHint: _(
        'Aktivér for å velge denne kaia.',
        'Activate to select this this harbor.',
        'Aktivér for å velje denne kaia.',
      ),
    },
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.',
      'Hi, are you connected? We are unable to conduct a search, since your connection is missing or unstable',
      'Hei, er du på nett? Vi kan ikkje hente reiseforslag sidan tilkoplinga di til internett manglar eller er ustabil.',
    ),
    defaultError: _(
      'Oops - vi feila med søket. Supert om du prøver igjen 🤞',
      'Whoops – our search failed. Please try again 🤞',
      'Oops - noko gjekk gale. Supert om du prøver på nytt 🤞',
    ),
    emptyResult: _(
      'Fant ingen søkeresultat',
      'No search results to display',
      'Fann ingen søkeresultat',
    ),
  },
};
export default HarborSearchTexts;
