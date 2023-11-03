import {getServiceJourneyVehicles} from '@atb/api/vehicles';
import {useCallback} from 'react';
import {usePollableResource} from '@atb/utils/use-pollable-resource';
import {AxiosError} from 'axios';
import {GetServiceJourneyVehicles} from '@atb/api/types/vehicles';

export const useGetServiceJourneyVehicles = (serviceJourneyIds?: string[]) => {
  const fetchVehicles = useCallback(
    (signal?: AbortSignal) =>
      getServiceJourneyVehicles(serviceJourneyIds, {
        signal,
      }),
    // Disabling as this works, and no quick fix in sight without causing havoc
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(serviceJourneyIds)],
  );

  const [updatedVehicles, , , error] = usePollableResource<
    GetServiceJourneyVehicles | undefined,
    AxiosError
  >(fetchVehicles, {
    initialValue: undefined,
    pollingTimeInSeconds: 20,
    pollOnFocus: true,
  });

  return {
    vehiclePositions: updatedVehicles ?? undefined,
    error: error,
  };
};
