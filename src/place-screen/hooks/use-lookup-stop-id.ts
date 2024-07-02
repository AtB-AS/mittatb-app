import { getStopPlaceLookupId } from "@atb/api/stop-places";
import { useQuery } from "@tanstack/react-query";

const ONE_HOUR_MS = 1000 * 60 * 60;

export const useStopIdLookupQuery = (id: string) =>
  useQuery({
    queryKey: ['stopPlaceIdLookup', {id: id}],
    queryFn: () =>
      getStopPlaceLookupId(id),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });