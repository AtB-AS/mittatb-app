import {translation as _} from '../commons';

const NearbyTexts = {
  location: {
    departurePicker: {
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
    noAccessToLocationTitle: _(
      'Holdeplasser i nærheten er ikke tilgjengelig.',
      'Nearby departures are not available.',
      'Haldeplassar i nærleiken er ikkje tilgjengeleg.',
    ),
    noAccessToLocation: _(
      'Del din posisjon for å finne holdeplasser i nærheten. Bruk søkefeltet for å finne andre holdeplasser.',
      'Share your location to find nearby stops. Use the search field to find other stops.',
      'Del posisjonen din for å finne haldeplassar i nærleiken. Bruk søkjefeltet for å finne andre haldeplassar.',
    ),
    sharePositionButton: {
      title: _('Del din posisjon', 'Share your position', 'Del posisjonen din'),
    },
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
    emptyNearbyLocationsTitle: _(
      'Finner ingen holdeplasser i nærheten',
      'No nearby stop places found',
      'Finn ingen haldeplassar i nærleiken',
    ),
    emptyNearbyLocationsDetails: _(
      'Prøv å søke på et annet navn eller bruk et annet stoppested for å finne avganger i nærheten.',
      'Try to search for another name or use another stop place to find departures nearby.',
      'Prøv å søkje på eit anna namn eller bruk ein annan stoppestad for å finne avgangar i nærleiken.',
    ),
  },
};
export default NearbyTexts;
