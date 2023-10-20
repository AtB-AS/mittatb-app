import {useUserLocation} from './use-user-location';
import {useInitQuery} from './use-init-query';

export const useParkingViolations = () => {
  const {position, error: locationError} = useUserLocation();
  const {
    isLoading,
    error: loadingError,
    data,
  } = useInitQuery(position ?? {latitude: 0, longitude: 0});

  const isError = !!(loadingError || locationError);

  return {
    position,
    isLoading: isLoading && !isError,
    isError,
    // If both errors are present, the locationError is most relevant
    // and should be shown rather than the loadingError
    error: locationError ?? loadingError,
    violations: data?.violations ?? [],
    providers: data?.providers ?? [],
  };
};
