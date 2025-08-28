import {useAuthContext} from '@atb/modules/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useQuery} from '@tanstack/react-query';
import {getVehicleRegistrations} from '../api/api';

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
    enabled: isSmartParkAndRideEnabled && !disabled,
  });
};
