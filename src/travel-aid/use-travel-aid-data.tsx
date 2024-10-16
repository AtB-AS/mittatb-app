import {useQuery} from '@tanstack/react-query';
import {ONE_HOUR_MS} from '@atb/utils/durations.ts';
import {getServiceJourneyWithEstimatedCalls} from '@atb/api/serviceJourney';
import {formatISO} from 'date-fns';

export const useTravelAidDataQuery = (id: string, date: Date) =>
  useQuery({
    queryKey: ['travelAidData', id, formatISO(date, {representation: 'date'})],
    queryFn: () => getServiceJourneyWithEstimatedCalls(id, date),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
