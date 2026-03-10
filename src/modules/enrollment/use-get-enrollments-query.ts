import {useQuery} from '@tanstack/react-query';
import {getEnrollments} from './api/api';

export const GET_ENROLLMENTS_KEY = 'GET_ENROLLMENTS';

export const useGetEnrollmentsQuery = () => {
  return useQuery({
    queryKey: [GET_ENROLLMENTS_KEY],
    queryFn: getEnrollments,
  });
};
