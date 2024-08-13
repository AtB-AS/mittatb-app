import {getStopPlaceParentId} from '@atb/api/stop-places';
import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from "@atb/utils/durations.ts";

export const useStopPlaceParentIdQuery = (id: string) =>
  useQuery({
    queryKey: ['stopPlaceParentId', {id: id}],
    queryFn: () => getStopPlaceParentId(id),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
