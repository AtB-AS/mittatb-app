import {Coordinates} from '@atb/utils/coordinates';
import {autocomplete, autocompleteV3} from '@atb/api';
import {useQuery} from '@tanstack/react-query';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export function useGeocoderQuery(
  text: string | null,
  coords: Coordinates | null,
  onlyLocalTariffZoneAuthority?: boolean,
  onlyStopPlaces?: boolean,
) {
  const {isGeocoderV3Enabled} = useFeatureTogglesContext();
  return useQuery({
    queryKey: [
      'geocoder',
      isGeocoderV3Enabled,
      text,
      coords,
      onlyLocalTariffZoneAuthority,
      onlyStopPlaces,
    ],
    queryFn: ({signal}) =>
      isGeocoderV3Enabled
        ? autocompleteV3(
            text ?? '',
            coords,
            onlyLocalTariffZoneAuthority,
            onlyStopPlaces,
            {signal},
          )
        : autocomplete(
            text ?? '',
            coords,
            onlyLocalTariffZoneAuthority,
            onlyStopPlaces,
            {signal},
          ),
    enabled: !!text,
  });
}
