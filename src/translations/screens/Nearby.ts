import {translation as _} from '../commons';

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
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke oppdatere avgangene siden nettforbindelsen din mangler eller er ustabil.',
    ),
    defaultFetchError: _(
      'Oops - vi klarte ikke hente avganger. Supert om du prøver igjen 🤞',
    ),
  },
  stateAnnouncements: {
    updatingLocation: _('Oppdaterer posisjon for å finne avganger i nærheten.'),
    loadingFromCurrentLocation: _(
      'Laster avganger i nærheten av gjeldende posisjon',
    ),
    loadingFromGivenLocation: (locationName: string) =>
      _(`Laster avganger i nærheten av ${locationName}`),
  },
  results: {
    messages: {
      initial: _(
        'Søk etter avganger fra holdeplasser eller i nærheten av steder.',
      ),
      emptyResult: _('Fant ingen avganger i nærheten'),
    },
    quayResult: {
      platformHeader: {
        title: _('Plattform', 'Platform'),
      },
      showMoreToggler: {
        text: _('Vis flere avganger'),
      },
    },
  },
};
export default NearbyTexts;
