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
      'Klarte ikke å søke. Nettforbindelsen din mangler eller er ustabil.',
      "Couldn't complete the search. Your connection is missing or unstable.",
      'Klarte ikkje å søke. Tilkoplinga di til internett manglar eller er ustabil.',
    ),
    loadingError: _(
      'Klarte ikke å hente kaier.',
      "Couldn't load harbors.",
      'Klarte ikkje å hente kaiar.',
    ),
    emptyResult: _(
      'Fant ingen søkeresultat',
      'No search results to display',
      'Fann ingen søkeresultat',
    ),
  },
};
export default HarborSearchTexts;
