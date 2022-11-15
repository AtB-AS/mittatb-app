import {translation as _} from '../commons';

const NearbyTexts = {
  header: {
    title: _('Avganger', 'Departures'),
    altTitle: {
      a11yPrefix: _('Avganger fra', 'Departures from'),
    },
    logo: {
      a11yLabel: _('Gå til startskjerm', 'Back to start screen'),
    },
    departureFuture: (name: string, time: string) =>
      _(`${name} (${time})`, `${name} (${time})`),
  },
  search: {
    label: _('Fra', 'From'),
    later: {
      label: _('Senere', 'Later'),
      a11yLabel: _(
        'Velg senere avreisetidspunkt',
        'Choose later departure time',
      ),
      a11yHint: _(
        'Aktiver for å velge et senere avreisetidspunkt',
        'Activate to choose a later departure time',
      ),
    },
    now: {
      label: _('Nå', 'Now'),
      a11yLabel: _('Velg avreisetidspunkt nå', 'Choose departure time now'),
      a11yHint: _(
        'Aktiver for å sette avreisetidspunkt til nå',
        'Activate to set later departure time to now',
      ),
    },
  },
  favorites: {
    toggle: _('Vis kun favorittavganger', 'View favourite departures only'),
  },
  location: {
    departurePicker: {
      placeholder: _(
        'Søk etter adresse eller sted',
        'Search for an address or location',
      ),
      label: _('Fra', 'From'),
      a11yLabel: _('Velg avreisested', 'Choose place of departure'),
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an address or location',
      ),
    },
    locationButton: {
      a11yLabel: _('Bruk min posisjon', 'Use my current location'),
    },
    updatingLocation: _('Oppdaterer posisjon', 'Updating current location'),
  },
  dateInput: {
    departureNow: (time: string) =>
      _(`Avganger nå (${time})`, `Departing now (${time})`),
    departure: (time: string) =>
      _(`Avganger fra ${time}`, `Departures from ${time}`),
    a11yHint: _(
      'Aktivér for å endre avgangstidspunkt',
      'Activate to change time of departures',
    ),
    confirm: _('Bekreft', 'Confirm'),
    header: _('Velg dato og tid', 'Select date and time'),
    a11yInPastHint: _(
      'Aktivér for å bekrefte tidsvalg.',
      'Activate to confirm time and date.',
    ),
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke oppdatere avgangene siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
    ),
    defaultFetchError: _(
      'Oops - vi klarte ikke hente avganger. Supert om du prøver igjen 🤞',
      'We failed at fetching departures – please retry 🤞',
    ),
  },
  stateAnnouncements: {
    updatingLocation: _(
      'Oppdaterer posisjon for å finne avganger i nærheten.',
      'Updating your current location to find nearby departures',
    ),
    loadingFromCurrentLocation: _(
      'Laster avganger i nærheten av gjeldende posisjon',
      'Loading departures near your current location',
    ),
    loadingFromGivenLocation: (locationName: string) =>
      _(
        `Laster avganger i nærheten av ${locationName}`,
        `Loading departures near ${locationName}`,
      ),
  },
  results: {
    stops: {
      header: {
        hintShow: _('Aktiver for å vise', 'Activate to show'),
        hintHide: _('Aktiver for å skjule', 'Activate to hide'),
      },
    },
    messages: {
      initial: _(
        'Søk etter avganger fra holdeplasser eller i nærheten av steder.',
        'Search for departures from nearby stops or locations',
      ),
      emptyResultFavorites: _(
        'Fant ingen favorittavganger på valgt plass.',
        'No favourite departures found at the specified location',
      ),
    },
    quayResult: {
      platformHeader: {
        accessibilityLabel: (name: string, publicCode: string) =>
          _(
            `Avganger fra plattform ${name} ${publicCode}.`,
            `Departures from platform ${name} ${publicCode}.`,
          ),
        accessibilityLabelNoPublicCode: (name: string) =>
          _(
            `Avganger fra plattform på holdeplassen ${name}.`,
            `Departures from stop place platform ${name}.`,
          ),
        distance: {
          label: (distance: string) =>
            _(
              `Det er rundt ${distance} til plattform.,`,
              `About ${distance} to platform.`,
            ),
        },
      },
      showMoreToggler: {
        text: _('Vis flere avganger', 'Show more departures'),
      },
    },
    relativeTime: (time: string) => _(`om ${time}`, `in ${time}`),
    lines: {
      a11y: {
        line: _(`Linje:`, 'Line'),
      },
      lineNameAccessibilityHint: _(
        'Aktiver for detaljer om avgang og oversikt over kommende avganger.',
        'Activate for departure details, and to review future departures',
      ),
      favorite: {
        addFavorite: (name: string, place: string) =>
          _(
            `Legg til favorittavgang: ${name} fra ${place}`,
            `Add favourite departure: ${name} from ${place}`,
          ),
        removeFavorite: (name: string, place: string) =>
          _(
            `Fjern favorittavgang: ${name} fra ${place}`,
            `Delete favourite departure: ${name} from ${place}`,
          ),
        message: {
          saved: _(`Lagt til.`, 'Added'),
          removed: _(`Fjernet.`, 'Removed'),
        },
      },
    },
    departure: {
      hasPassedAccessibilityLabel: (time: string) =>
        _(
          `Avgangen ${time} har trolig passert plattformen.`,
          `Departure ${time} has likely left the plattform.`,
        ),
      upcomingRealtimeAccessibilityLabel: (time: string) =>
        _(
          `Kommende avgang estimert til ${time}.`,
          `Next departure estimated in ${time}.`,
        ),
      upcomingAccessibilityLabel: (time: string) =>
        _(
          `Kommende avgang har rutetid på ${time}.`,
          `Next departures route time ${time}.`,
        ),
      nextAccessibilityLabel: (time: string) =>
        _(`Neste avganger: ${time}`, `Next departures: ${time}`),
      nextAccessibilityNotRealtime: (time: string) =>
        _(`rutetid: ${time}`, `route time: ${time}`),
    },
  },
  favoriteDialogSheet: {
    title: _('Velg favorittavgang', 'Select favourite departure'),
    description: (lineNumber: string, lineName: string) =>
      _(
        `Vil du favorittmarkere kun '${lineNumber} ${lineName}' eller alle variasjoner av linje ${lineNumber}?`,
        `Do you want to favourite mark only '${lineNumber} ${lineName}' or all variations of line ${lineNumber}?`,
      ),
    buttons: {
      specific: (lineNumber: string, lineName: string) =>
        _(
          `Kun '${lineNumber} ${lineName}'`,
          `Only '${lineNumber} ${lineName}'`,
        ),
      all: (lineNumber: string) =>
        _(
          `Alle variasjoner av linje ${lineNumber}`,
          `All variations of line ${lineNumber}`,
        ),
    },
  },
};
export default NearbyTexts;
