import {useQuery} from '@tanstack/react-query';
import {getActiveShmoBooking} from '@atb/api/mobility';
import {ONE_MINUTE_MS} from '@atb/utils/durations.ts';

export const useActiveShmoBookingQuery = () => {
  return useQuery({
    queryKey: ['getActiveShmoBooking'],
    queryFn: ({signal}) => getActiveShmoBooking({signal}),
    staleTime: ONE_MINUTE_MS,
    cacheTime: ONE_MINUTE_MS,
  });
};
