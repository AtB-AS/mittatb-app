import {getStopPlaceParentId} from '@atb/api/stop-places';
import {useQuery} from '@tanstack/react-query';

const ONE_HOUR_MS = 1000 * 60 * 60;

export const useStopPlaceParentIdQuery = (id: string) =>
  useQuery({
    queryKey: ['stopPlaceParentId', {id: id}],
    queryFn: () => getStopPlaceParentId(id),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
