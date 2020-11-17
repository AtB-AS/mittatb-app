import {translateable as _} from '../utils';

const assistant = {
  header: {
    title: _('Reiseassistent', 'Travel assistant'),
    accessibility: {
      logo: _('Nullstill reisesøk'),
    },
  },
  location: {
    departurePicker: {
      label: _('Fra', 'From'),
      placeholder: _('Søk etter adresse eller sted'),
      a11yLabel: _('Velg avreisested'),
      a11yHint: _('Aktivér for å søke etter adresse eller sted'),
    },
    destinationPicker: {
      label: _('Til', 'To'),
      placeholder: _('Søk etter adresse eller sted'),
      a11yLabel: _('Velg ankomststed'),
      a11yHint: _('Aktivér for å søke etter adresse eller sted'),
    },
    locationButton: {
      a11yLabel: {
        update: _('Oppdater posisjon'),
        use: _('Bruk posisjon som avreisested'),
      },
    },
    swapButton: {
      a11yLabel: _('Bytt avreisested og ankomststed'),
    },
    updatingLocation: _('Oppdaterer posisjon'),
  },
};
export default assistant;
