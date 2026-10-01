import {Coordinates} from '@atb/utils/coordinates';
import {autocomplete} from '@atb/api';
import {useQuery} from '@tanstack/react-query';

export function useGeocoderQuery(
  text: string | null,
  coords: Coordinates | null,
  onlyLocalFareZoneAuthority?: boolean,
  onlyStopPlaces?: boolean,
) {
  return useQuery({
    queryKey: [
      'geocoder',
      text,
      coords,
      onlyLocalFareZoneAuthority,
      onlyStopPlaces,
    ],
    queryFn: ({signal}) =>
      autocomplete(
        text ?? '',
        coords,
        onlyLocalFareZoneAuthority,
        onlyStopPlaces,
        {signal},
      ),
    enabled: !!text,
  });
}
