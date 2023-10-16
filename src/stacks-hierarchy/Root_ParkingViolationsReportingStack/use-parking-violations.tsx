import {useUserLocation} from '@atb/stacks-hierarchy/Root_ParkingViolationsReportingStack/use-user-location';
import {useInitQuery} from '@atb/stacks-hierarchy/Root_ParkingViolationsReportingStack/use-init-query';
import {isDefined} from '@atb/utils/presence';

export const useParkingViolations = () => {
  const {position, error: locationError} = useUserLocation();
  const {
    isLoading,
    error: loadingError,
    data,
  } = useInitQuery(position ?? {latitude: 0, longitude: 0});

  return {
    position,
    isLoading,
    isError: !!(loadingError || locationError),
    errors: [locationError, loadingError].filter(isDefined),
    violations: data?.violations ?? [],
    providers: data?.providers ?? [],
  };
};
