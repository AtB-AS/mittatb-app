import {useAuthContext} from '@atb/modules/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useQuery} from '@tanstack/react-query';
import {listVehicleRegistrations} from '../api/api';

export const getListVehicleRegistrationsQueryKey = (
  userId: string | undefined,
) => {
  return ['smartParkAndRideVehicleRegistrations', userId];
};

export const useListVehicleRegistrationsQuery = (disabled: boolean = false) => {
  const {userId, authStatus} = useAuthContext();
  const {isSmartParkAndRideEnabled} = useFeatureTogglesContext();
  const {authenticationType} = useAuthContext();
  const isLoggedIn = authenticationType === 'phone';

  return useQuery({
    queryKey: getListVehicleRegistrationsQueryKey(userId),
    queryFn: listVehicleRegistrations,
    retry: 3,
    enabled:
      authStatus === 'authenticated' &&
      isSmartParkAndRideEnabled &&
      isLoggedIn &&
      !disabled,
  });
};
