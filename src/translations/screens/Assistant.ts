import {translation as _} from '../utils';
import {LocationSearchTexts} from '..';

const AssistantTexts = {
  header: {
    title: _('Reiseassistent', 'Travel assistant'),
    accessibility: {
      logo: _('Nullstill reisesøk'),
    },
  },
  location: {
    departurePicker: {
      ...LocationSearchTexts.searchField,
      label: _('Fra', 'From'),
      a11yLabel: _('Velg avreisested'),
      a11yHint: _('Aktivér for å søke etter adresse eller sted'),
    },
    destinationPicker: {
      ...LocationSearchTexts.searchField,
      label: _('Til', 'To'),
      a11yLabel: _('Velg ankomststed'),
      a11yHint: _('Aktivér for å søke etter adresse eller sted'),
    },
    locationButton: {
      a11yLabel: {
        update: _('Oppdater posisjon'),
        use: _('Bruk min posisjon'),
      },
    },
    swapButton: {
      a11yLabel: _('Bytt avreisested og ankomststed'),
    },
    updatingLocation: _('Oppdaterer posisjon'),
  },
  favorites: {
    favoriteChip: {
      a11yHint: _('Aktiver for å bruke som'),
    },
  },
  searchState: {
    searching: _('Laster søkeresultater'),
    searchSuccess: _('Søkeresultater er lastet inn'),
    searchEmptyResult: _('Fikk ingen søkeresultater'),
  },
};

export default AssistantTexts;
