import {useQuery} from '@tanstack/react-query';
import {getServiceJourneyWithEstimatedCalls} from '@atb/api/serviceJourney';

export const useTravelAidDataQuery = (id: string, serviceDate: string) =>
  useQuery({
    queryKey: ['travelAidData', id, serviceDate],
    queryFn: () => getServiceJourneyWithEstimatedCalls(id, serviceDate),
    refetchInterval: 5000,
  });
