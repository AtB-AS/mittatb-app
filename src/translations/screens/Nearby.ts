import {translation as _} from '../utils';

const NearbyTexts = {
  header: {
    title: _('Avganger', 'Departures'),
    altTitle: {
      a11yPrefix: _('Avganger fra'),
    },
    logo: {
      a11yLabel: _('Gå til startskjerm'),
    },
  },
  location: {
    departurePicker: {
      placeholder: _('Søk etter adresse eller sted', 'Search for a place'),
      label: _('Fra', 'From'),
      a11yLabel: _('Velg avreisested'),
      a11yHint: _('Aktivér for å søke etter adresse eller sted'),
    },
    locationButton: {
      a11yLabel: _('Bruk min posisjon'),
    },
    updatingLocation: _('Oppdaterer posisjon'),
  },
};
export default NearbyTexts;
