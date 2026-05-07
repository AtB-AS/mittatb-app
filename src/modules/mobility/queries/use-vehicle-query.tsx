import {useQuery} from '@tanstack/react-query';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {getVehicle} from '@atb/api/mobility';
import {useMapContext} from '@atb/modules/map';

export const MOCK_VEHICLE_ID = 'mock-vehicle-id';

export const getVehicleQueryKey = (id?: string) => ['GET_VEHICLE', id];

export const useVehicleQuery = (id?: string) => {
  const {mapState} = useMapContext();
  return useQuery({
    queryKey: getVehicleQueryKey(id),
    queryFn: ({signal}) => getVehicle(id, {signal}),
    gcTime: ONE_MINUTE_MS,
    refetchOnMount: mapState.isStationBasedBooking ? false : 'always',
    enabled: !mapState.isStationBasedBooking,
    retry: 5,
  });
};
