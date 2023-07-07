import {getServiceJourneyVehicles} from '@atb/api/vehicles';
import {useCallback, useEffect} from 'react';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {AxiosError} from 'axios';
import {GetServiceJourneyVehicles} from '@atb/api/types/vehicles';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';

export const useGetServiceJourneyVehicles = (serviceJourneyIds?: string[]) => {
  const isFocused = useIsFocusedAndActive();
  const fetchVehicles = useCallback(
    (signal?: AbortSignal) =>
      getServiceJourneyVehicles(serviceJourneyIds, {
        signal,
      }),
    [JSON.stringify(serviceJourneyIds)],
  );

  const [updatedVehicles, reload, , error] = usePollableResource<
    GetServiceJourneyVehicles | undefined,
    AxiosError
  >(fetchVehicles, {
    initialValue: undefined,
    pollingTimeInSeconds: 20,
    reloadOnFocus: true,
  });

  useEffect(() => {
    if (!isFocused) return;
    const abortController = new AbortController();
    reload('WITH_LOADING', abortController);
    return () => abortController.abort();
  }, [isFocused]);

  return {
    vehiclePositions: updatedVehicles ?? undefined,
    error: error,
  };
};
