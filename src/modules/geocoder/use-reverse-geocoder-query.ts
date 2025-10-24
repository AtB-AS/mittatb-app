import {Coordinates} from '@atb/utils/coordinates';
import {reverse} from '@atb/api';
import {useQuery} from '@tanstack/react-query';

export function useReverseGeocoderQuery(coords: Coordinates | null) {
  return useQuery({
    queryKey: ['reverseGeocoder', coords],
    queryFn: ({signal}) => reverse(coords, {signal}),
    enabled: !!coords,
  });
}
