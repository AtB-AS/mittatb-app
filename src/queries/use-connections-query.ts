import {useQuery} from '@tanstack/react-query';
import {getStopPlaceConnections} from '@atb/api/bff/stop-places';

import {ONE_HOUR_MS} from '@atb/utils/durations';

export const useConnectionsQuery = (fromHarborId?: string) => {
  return useQuery({
    queryKey: ['connections', {connectionFrom: fromHarborId}],
    enabled: !!fromHarborId,
    queryFn: () =>
      !!fromHarborId ? getStopPlaceConnections(fromHarborId) : [],
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
};
