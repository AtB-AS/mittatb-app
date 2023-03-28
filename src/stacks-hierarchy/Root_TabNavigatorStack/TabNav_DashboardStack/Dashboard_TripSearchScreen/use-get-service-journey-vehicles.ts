import {getServiceJourneyVehicles} from '@atb/api/vehicles';
import {useCallback, useEffect, useState} from 'react';
import usePollableResource from '@atb/utils/use-pollable-resource';
import {AxiosError} from 'axios';
import {GetServiceJourneyVehicles} from '@atb/api/types/generated/ServiceJourneyVehiclesQuery';

export const useGetServiceJourneyVehicles = (serviceJourneyIds?: string[]) => {
  const [vehicleUpdates, setVehicleUpdates] = useState<{
    serviceJourneyVehicles?: GetServiceJourneyVehicles;
    error?: AxiosError;
  }>();

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

  useEffect(
    () =>
      setVehicleUpdates({
        serviceJourneyVehicles: updatedVehicles,
        error: error,
      }),
    [updatedVehicles, error],
  );

  return {
    vehiclePositions: vehicleUpdates?.serviceJourneyVehicles ?? undefined,
    error: vehicleUpdates?.error,
  };
};
