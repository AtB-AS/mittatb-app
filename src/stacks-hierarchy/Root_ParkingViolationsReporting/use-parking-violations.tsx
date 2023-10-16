import {isDefined} from '@atb/utils/presence';
import {useUserLocation} from './use-user-location';
import {useInitQuery} from './use-init-query';

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
