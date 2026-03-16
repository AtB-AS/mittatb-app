import {useQuery} from '@tanstack/react-query';
import {getEnrollments} from './api/api';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const GET_ENROLLMENTS_KEY = 'GET_ENROLLMENTS';

export const useGetEnrollmentsQuery = () => {
  return useQuery({
    queryKey: [GET_ENROLLMENTS_KEY],
    queryFn: getEnrollments,
    staleTime: 5 * ONE_HOUR_MS,
    gcTime: 5 * ONE_HOUR_MS,
  });
};
