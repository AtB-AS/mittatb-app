import {Coordinates} from '@atb/utils/coordinates';
import {autocomplete} from '@atb/api';
import {useQuery} from '@tanstack/react-query';

export function useGeocoderQuery(
  text: string | null,
  coords: Coordinates | null,
  onlyLocalTariffZoneAuthority?: boolean,
  onlyStopPlaces?: boolean,
) {
  return useQuery({
    queryKey: [
      'geocoder',
      text,
      coords,
      onlyLocalTariffZoneAuthority,
      onlyStopPlaces,
    ],
    queryFn: ({signal}) =>
      autocomplete(
        text ?? '',
        coords,
        onlyLocalTariffZoneAuthority,
        onlyStopPlaces,
        {signal},
      ),
    enabled: !!text,
  });
}
