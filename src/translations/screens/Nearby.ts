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
