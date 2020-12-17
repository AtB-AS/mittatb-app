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
  favorites: {
    toggle: _('Vis kun favorittavganger'),
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
    stops: {
      header: {
        hintShow: _('Aktiver for å vise'),
        hintHide: _('Aktiver for å skjul'),
      },
    },
    messages: {
      initial: _(
        'Søk etter avganger fra holdeplasser eller i nærheten av steder.',
      ),
      emptyResult: _('Fant ingen avganger på valgt plass'),
      emptyResultFavorites: _('Fant ingen favorittavganger på valgt plass.'),
    },
    quayResult: {
      platformHeader: {
        accessibilityLabel: (name: string, publicCode: string) =>
          _(`Avganger fra plattform ${name} ${publicCode}`),
        accessibilityLabelNoPublicCode: (name: string) =>
          _(`Avganger fra plattform på holdeplassen ${name}`),
        distance: {
          label: (distance: string) =>
            _(`Det er rundt ${distance} til plattform`),
        },
      },
      showMoreToggler: {
        text: _('Vis flere avganger'),
      },
    },
    relativeTime: (time: string) => _(`om ${time}`),
    lines: {
      a11y: {
        line: _(`Linje:`),
      },
      lineNameAccessibilityHint: _(
        'Aktiver for detaljer om avgang og oversikt over kommende avganger.',
      ),
      favorite: {
        addFavorite: (name: string, place: string) =>
          _(`Legg til favorittavgang: ${name} fra ${place}`),
        removeFavorite: (name: string, place: string) =>
          _(`Fjern favorittavgang: ${name} fra ${place}`),
        message: {
          saved: _(`Lagt til.`),
          removed: _(`Fjernet.`),
        },
      },
    },
    departure: {
      hasPassedAccessibilityLabel: (time: string) =>
        _(`Avgangen ${time} har trolig passert plattformen.`),
      upcomingRealtimeAccessibilityLabel: (time: string) =>
        _(`Kommende avgang estimert til ${time}.`),
      upcomingAccessibilityLabel: (time: string) =>
        _(`Kommende avgang har rutetid på ${time}.`),
      nextAccessibilityLabel: (time: string) => _(`Neste avganger: ${time}`),
      nextAccessibilityNotRealtime: (time: string) => _(`rutetid: ${time}`),
    },
  },
};
export default NearbyTexts;
