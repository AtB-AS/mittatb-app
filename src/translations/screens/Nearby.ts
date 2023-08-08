import {translation as _} from '../commons';

const NearbyTexts = {
  header: {
    title: _('Avganger', 'Departures', 'Avgangar'),
    altTitle: {
      a11yPrefix: _('Avganger fra', 'Departures from', 'Avgangar frå'),
    },
    logo: {
      a11yLabel: _(
        'Gå til startskjerm',
        'Back to start screen',
        'Gå til startskjerm',
      ),
    },
    departureFuture: (name: string, time: string) =>
      _(`${name} (${time})`, `${name} (${time})`, `${name} (${time})`),
  },
  search: {
    label: _('Fra', 'From', 'Frå'),
    later: {
      label: _('Senere', 'Later', 'Seinare'),
      a11yLabel: _(
        'Velg senere avreisetidspunkt',
        'Choose later departure time',
        'Vel seinare avgangstidspunkt',
      ),
      a11yHint: _(
        'Aktiver for å velge et senere avreisetidspunkt',
        'Activate to choose a later departure time',
        'Aktivér for å velje eit seinare avgangstidspunkt',
      ),
    },
    now: {
      label: _('Nå', 'Now', 'No'),
      a11yLabel: _(
        'Velg avreisetidspunkt nå',
        'Choose departure time now',
        'Vel avgangstidspunkt no',
      ),
      a11yHint: _(
        'Aktiver for å sette avreisetidspunkt til nå',
        'Activate to set later departure time to now',
        'Aktiver for å setje avgangstidspunkt til no',
      ),
    },
  },
  favorites: {
    toggle: _(
      'Vis kun favorittavganger',
      'View favourite departures only',
      'Vis berre favorittavgangar',
    ),
  },
  location: {
    departurePicker: {
      placeholder: _(
        'Søk etter adresse eller sted',
        'Search for an address or location',
        'Søk etter adresse eller stad',
      ),
      label: _('Fra', 'From', 'Frå'),
      a11yLabel: _(
        'Velg avreisested',
        'Choose place of departure',
        'Vel stad for avgang',
      ),
      a11yHint: _(
        'Aktivér for å søke etter adresse eller sted',
        'Activate to search for an address or location',
        'Aktivér for å søke etter adresse eller stad',
      ),
    },
    locationButton: {
      a11yLabel: _('Bruk min posisjon', 'Use my location', 'Bruk min posisjon'),
    },
    updatingLocation: _(
      'Oppdaterer posisjon',
      'Updating location',
      'Oppdaterer posisjon',
    ),
  },
  dateInput: {
    departureNow: (time: string) =>
      _(
        `Avganger nå (${time})`,
        `Departing now (${time})`,
        `Avgangar no (${time})`,
      ),
    departure: (time: string) =>
      _(
        `Avganger fra ${time}`,
        `Departures from ${time}`,
        `Avgangar frå ${time}`,
      ),
    a11yHint: _(
      'Aktivér for å endre avgangstidspunkt',
      'Activate to change time of departures',
      'Aktivér for å endre avgangstidspunkt',
    ),
    confirm: _('Bekreft', 'Confirm', 'Bekreft'),
    header: _('Velg dato og tid', 'Select date and time', 'Vel dato og tid'),
    a11yInPastHint: _(
      'Aktivér for å bekrefte tidsvalg.',
      'Activate to confirm time and date.',
      'Aktivér for å bekrefte tidspunktet.',
    ),
  },
  messages: {
    networkError: _(
      'Hei, er du på nett? Vi kan ikke oppdatere avgangene siden nettforbindelsen din mangler eller er ustabil.',
      `Are you online? We're unable to conduct a search since your device seems to be offline or the connection is unstable`,
      'Hei, er du på nett? Vi kan ikkje oppdatere avgangene då tilkoplinga di til interett manglar eller er ustabil.',
    ),
    defaultFetchError: _(
      'Oops - vi klarte ikke hente avganger. Supert om du prøver igjen 🤞',
      'We failed at fetching departures – please retry 🤞',
      'Oops - vi klarte ikkje å hente avgangar. Prøv igjen 🤞',
    ),
  },
  stateAnnouncements: {
    updatingLocation: _(
      'Oppdaterer posisjon for å finne avganger i nærheten.',
      'Updating your location to find nearby departures',
      'Oppdaterar posisjon for å finne avgangar i nærleiken.',
    ),
    loadingFromCurrentLocation: _(
      'Laster avganger i nærheten av gjeldende posisjon',
      'Loading departures near your current location',
      'Lastar avgangar nær gjeldande posisjon',
    ),
    loadingFromGivenLocation: (locationName: string) =>
      _(
        `Laster avganger i nærheten av ${locationName}`,
        `Loading departures near ${locationName}`,
        `Lastar avgangar nær ${locationName}`,
      ),
  },
  results: {
    stops: {
      header: {
        hintShow: _(
          'Aktiver for å vise',
          'Activate to show',
          'Aktivér for å vise',
        ),
        hintHide: _(
          'Aktiver for å skjule',
          'Activate to hide',
          'Aktivér for å skjule',
        ),
      },
    },

    lines: {
      a11y: {
        line: _(`Linje:`, 'Line', 'Linje:'),
      },
      lineNameAccessibilityHint: _(
        'Aktiver for detaljer om avgang og oversikt over kommende avganger.',
        'Activate for departure details, and to review future departures',
        'Trykk for detaljar om avgang og oversikt over komande avgangar',
      ),
      favorite: {
        addFavorite: (name: string, place: string) =>
          _(
            `Legg til favorittavgang: ${name} frå ${place}`,
            `Add favourite departure: ${name} from ${place}.`,
            `Legg til favorittavgang: ${name} frå ${place}`,
          ),
        removeFavorite: (name: string, place: string) =>
          _(
            `Fjern favorittavgang: ${name} frå ${place}`,
            `Delete favourite departure: ${name} from ${place}.`,
            `Fjern favorittavgang: ${name} frå ${place}`,
          ),
        delete: {
          label: _('Fjerne avgang?', 'Delete departure?', 'Slette avgang?'),
          confirmWarning: _(
            'Sikker på at du vil fjerne favorittavgang?',
            'Sure you want to delete this favourite?',
            'Er du sikker på at du vil slette denne favorittavgangen?',
          ),
          cancel: _('Avbryt', 'Cancel', 'Avbryt'),
          delete: _('Slett', 'Delete', 'Slett'),
        },
        a11yMarkFavouriteHint: _(
          'Aktiver for å markere som favoritt',
          'Activate to mark as favourite',
          'Trykk her for å markere som favoritt',
        ),
        message: {
          saved: _(`Lagt til.`, 'Added', `Lagt til.`),
          removed: _(`Fjernet.`, 'Removed', `Fjerna.`),
        },
      },
    },
    messages: {
      initial: _(
        'Søk etter avganger fra holdeplasser eller i nærheten av steder.',
        'Search for departures from nearby stops or locations',
        'Søk etter avgangar frå haldeplassar eller i nærleiken av stadar.',
      ),
      emptyResultFavorites: _(
        'Fant ingen favorittavganger på valgt plass.',
        'No favourite departures found at the specified location',
        'Ingen favorittavgangar funne på valt stad.',
      ),
    },
    relativeTime: (time: string) => _(`om ${time}`, `in ${time}`, `om ${time}`),

    quayResult: {
      platformHeader: {
        accessibilityLabel: (name: string, publicCode: string) =>
          _(
            `Avganger fra plattform ${name} ${publicCode}.`,
            `Departures from platform ${name} ${publicCode}.`,
            `Avgangar frå plattform ${name} ${publicCode}.`,
          ),
        accessibilityLabelNoPublicCode: (name: string) =>
          _(
            `Avganger fra plattform på holdeplassen ${name}.`,
            `Departures from stop place platform ${name}.`,
            `Avgangar frå plattform på haldeplassen ${name}.`,
          ),
        distance: {
          label: (distance: string) =>
            _(
              `Det er rundt ${distance} til plattform.`,
              `About ${distance} to platform.`,
              `Det er omtrent ${distance} til plattformen.`,
            ),
        },
      },

      showMoreToggler: {
        text: _(
          'Vis flere avganger',
          'Show more departures',
          'Vis fleire avgangar',
        ),
      },
    },

    departure: {
      hasPassedAccessibilityLabel: (time: string) =>
        _(
          `Avgangen ${time} har trolig passert plattformen.`,
          `Departure ${time} has likely left the platform.`,
          `Avgangen ${time} har truleg passert plattformen.`,
        ),
      upcomingRealtimeAccessibilityLabel: (time: string) =>
        _(
          `Kommende avgang sanntid ${time} `,
          `Next departure realtime ${time} `,
          `Neste avgang sanntid ${time}`,
        ),
      upcomingAccessibilityLabel: (time: string) =>
        _(
          `Kommende avgang ${time} `,
          `Next departure ${time} `,
          `Neste avgang ${time}`,
        ),
      nextAccessibilityLabel: (time: string) =>
        _(
          `Neste avganger: ${time} `,
          `Next departures: ${time} `,
          `Neste avgangar: ${time}`,
        ),
      nextAccessibilityRealtime: (time: string) =>
        _(`sanntid ${time}`, `realtime: ${time}`, `Sanntid: ${time}`),
    },
  },
  favoriteDialogSheet: {
    title: _(
      'Velg favorittavgang',
      'Select favourite departure',
      'Vel favorittavgang',
    ),
    description: (lineNumber: string, lineName: string) =>
      _(
        `Vil du favorittmarkere kun '${lineNumber} ${lineName}' eller alle variasjoner av linje ${lineNumber}?`,
        `Do you want to favourite mark only '${lineNumber} ${lineName}' or all variations of line ${lineNumber}?`,
        `Vil du kun merke '${lineNumber} ${lineName}' som favoritt eller alle variasjonane av linje ${lineNumber}?`,
      ),
    buttons: {
      specific: (lineNumber: string, lineName: string) =>
        _(
          `Kun '${lineNumber} ${lineName}'`,
          `Only '${lineNumber} ${lineName}'`,
          `Berre '${lineNumber} ${lineName}'`,
        ),
      all: (lineNumber: string) =>
        _(
          `Alle variasjoner av linje ${lineNumber}`,
          `All variations of line ${lineNumber}`,
          `Alle variasjonar av linje ${lineNumber}`,
        ),
    },
  },
};
export default NearbyTexts;
