import {Coordinates} from '@atb/utils/coordinates';
import {reverse, reverseV3} from '@atb/api';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useCallback} from 'react';

const getReverseGeocoderQueryOptions = (
  coords: Coordinates | null,
  isGeocoderV3Enabled: boolean,
) => ({
  queryKey: ['reverseGeocoder', isGeocoderV3Enabled, coords],
  queryFn: ({signal}: {signal?: AbortSignal}) =>
    isGeocoderV3Enabled
      ? reverseV3(coords, {signal})
      : reverse(coords, {signal}),
});

export function useReverseGeocoderQuery(coords: Coordinates | null) {
  const {isGeocoderV3Enabled} = useFeatureTogglesContext();
  return useQuery({
    ...getReverseGeocoderQueryOptions(coords, isGeocoderV3Enabled),
    enabled: !!coords,
  });
}

export function useFetchReverseGeocoder() {
  const {isGeocoderV3Enabled} = useFeatureTogglesContext();
  const queryClient = useQueryClient();
  return useCallback(
    (coords: Coordinates) =>
      queryClient.fetchQuery(
        getReverseGeocoderQueryOptions(coords, isGeocoderV3Enabled),
      ),
    [queryClient, isGeocoderV3Enabled],
  );
}
