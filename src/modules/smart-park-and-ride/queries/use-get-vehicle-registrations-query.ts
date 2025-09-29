import {useAuthContext} from '@atb/modules/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useQuery} from '@tanstack/react-query';
import {getVehicleRegistrations} from '../api/api';
import {ONE_HOUR_MS} from '@atb/utils/durations';

export const getVehicleRegistrationsQueryKey = (userId: string | undefined) => {
  return ['getVehicleRegistrations', userId];
};

export const useVehicleRegistrationsQuery = (disabled: boolean = false) => {
  const {userId} = useAuthContext();
  const {isSmartParkAndRideEnabled} = useFeatureTogglesContext();

  return useQuery({
    queryKey: getVehicleRegistrationsQueryKey(userId),
    queryFn: getVehicleRegistrations,
    retry: 3,
    cacheTime: ONE_HOUR_MS,
    staleTime: ONE_HOUR_MS,
    enabled: isSmartParkAndRideEnabled && !disabled,
  });
};
