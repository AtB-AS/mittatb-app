import {useQuery} from '@tanstack/react-query';
import {getEnrollments} from './api/api';

export const GET_ENROLLMENTS_KEY = 'getEnrollments';

export const useGetEnrollmentsQuery = () => {
  return useQuery({
    queryKey: [GET_ENROLLMENTS_KEY],
    queryFn: getEnrollments,
  });
};
