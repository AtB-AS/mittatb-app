import {getServiceJourneyVehicles} from '@atb/api/vehicles';
import {useCallback} from 'react';
import usePollableResource from '@atb/utils/use-pollable-resource';
import {AxiosError} from 'axios';
import {GetServiceJourneyVehicles} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';

export const useGetServiceJourneyVehicles = (serviceJourneyIds?: string[]) => {
  const fetchVehicles = useCallback(
    (signal?: AbortSignal) =>
      getServiceJourneyVehicles(serviceJourneyIds, {
        signal,
      }),
    [JSON.stringify(serviceJourneyIds)],
  );

  const [updatedVehicles, , , error] = usePollableResource<
    GetServiceJourneyVehicles | undefined,
    AxiosError
  >(fetchVehicles, {
    initialValue: undefined,
    pollingTimeInSeconds: 20,
  });

  return {
    vehiclePositions: updatedVehicles ?? undefined,
    error: error,
  };
};
