import {useQuery} from '@tanstack/react-query';
import {getServiceJourneyWithEstimatedCalls} from '@atb/api/bff/servicejourney';

export const useTravelAidDataQuery = (
  enabled: boolean,
  id: string,
  serviceDate: string,
) =>
  useQuery({
    queryKey: ['travelAidData', id, serviceDate],
    queryFn: () => getServiceJourneyWithEstimatedCalls(id, serviceDate),
    enabled: enabled,
    refetchInterval: 5000,
  });
