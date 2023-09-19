import {translation as _} from '../commons';

const NearbyTexts = {
  search: {
    label: _('Fra', 'From', 'Frå'),
  },
  location: {
    departurePicker: {
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
    lines: {
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
