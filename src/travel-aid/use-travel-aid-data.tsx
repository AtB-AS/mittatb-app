import {useQuery} from '@tanstack/react-query';
import {getServiceJourneyWithEstimatedCalls} from '@atb/api/serviceJourney';

export const useTravelAidDataQuery = (id: string, isoDate: string) =>
  useQuery({
    queryKey: ['travelAidData', id, isoDate],
    queryFn: () => getServiceJourneyWithEstimatedCalls(id, isoDate),
    refetchInterval: 10000,
  });
