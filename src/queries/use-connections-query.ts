import {useQuery} from '@tanstack/react-query';
import {
  getStopPlaceConnections,
  getStopPlaceDistances,
} from '@atb/api/bff/stop-places';

import {ONE_HOUR_MS} from '@atb/utils/durations';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

export const useConnectionsQuery = (fromHarborId?: string) => {
  const {isHarborDistancesApiEnabled} = useFeatureTogglesContext();
  const queryFn = isHarborDistancesApiEnabled
    ? getStopPlaceDistances
    : getStopPlaceConnections;
  return useQuery({
    queryKey: ['connections', {connectionFrom: fromHarborId}],
    enabled: !!fromHarborId,
    queryFn: () => (!!fromHarborId ? queryFn(fromHarborId) : []),
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
  });
};
