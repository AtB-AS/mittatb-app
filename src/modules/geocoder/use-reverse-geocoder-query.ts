import {Coordinates} from '@atb/utils/coordinates';
import {reverse, reverseV3} from '@atb/api';
import {useQuery} from '@tanstack/react-query';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export function useReverseGeocoderQuery(coords: Coordinates | null) {
  const {isGeocoderV3Enabled} = useFeatureTogglesContext();
  return useQuery({
    queryKey: ['reverseGeocoder', isGeocoderV3Enabled, coords],
    queryFn: ({signal}) =>
      isGeocoderV3Enabled
        ? reverseV3(coords, {signal})
        : reverse(coords, {signal}),
    enabled: !!coords,
  });
}
