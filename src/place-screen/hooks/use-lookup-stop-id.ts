import { getStopPlaceLookupId } from "@atb/api/stop-places";
import { useQuery } from "@tanstack/react-query";

const ONE_HOUR_MS = 1000 * 60 * 60;

export const useStopIdLookupQuery = (fromStopPlaceId: string) =>
  useQuery({
    queryKey: ['stopPlaceIdLookup', {fromStopPlaceId: fromStopPlaceId}],
    queryFn: () =>
      getStopPlaceLookupId(fromStopPlaceId),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });