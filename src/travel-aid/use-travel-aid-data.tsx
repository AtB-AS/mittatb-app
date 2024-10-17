import {useQuery} from '@tanstack/react-query';
import {getServiceJourneyWithEstimatedCalls} from '@atb/api/serviceJourney';

export const useTravelAidDataQuery = (id: string, date: Date) =>
  useQuery({
    queryKey: ['travelAidData', id],
    queryFn: () => getServiceJourneyWithEstimatedCalls(id, date),
    refetchInterval: 10000,
  });
