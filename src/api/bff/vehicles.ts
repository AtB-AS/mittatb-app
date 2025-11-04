import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import {useIsLoading} from '@atb/utils/use-is-loading';
import {WS_API_BASE_URL} from '@env';
import {AxiosRequestConfig} from 'axios';
import qs from 'query-string';
import {useCallback, useState} from 'react';
import {
  GetServiceJourneyVehicles,
  VehicleWithPosition,
} from '../types/vehicles';
import {useSubscription} from '../use-subscription';

const WEBSOCKET_BASE_URL = WS_API_BASE_URL;

export const getServiceJourneyVehicles = async (
  serviceJourneyIds?: string[],
  opts?: AxiosRequestConfig,
): Promise<GetServiceJourneyVehicles | null> => {
  if (!serviceJourneyIds?.length) {
    return null;
  }
  const url = '/bff/v2/vehicles/service-journeys';
  const query = qs.stringify({
    serviceJourneyIds,
  });
  const result = await client.get<GetServiceJourneyVehicles>(
    stringifyUrl(url, query),
    {
      ...opts,
    },
  );

  return result.data;
};

export const useLiveVehicleSubscription = ({
  serviceJourneyId,
  vehicleWithPosition,
  enabled,
  // No need to show disconnect indicator if able to reconnect within 3 seconds
  connectionIndicatorDebounceTimeInMs = 3_000,
}: {
  serviceJourneyId?: string;
  vehicleWithPosition: VehicleWithPosition | undefined;
  enabled: boolean;

  connectionIndicatorDebounceTimeInMs?: number;
}) => {
  const [liveVehicle, setLiveVehicle] = useState<
    VehicleWithPosition | undefined
  >(vehicleWithPosition);
  const [isConnected, setIsConnected] = useIsLoading(
    false,
    connectionIndicatorDebounceTimeInMs,
  );

  const query = qs.stringify({serviceJourneyId});

  const url = stringifyUrl(
    `${WEBSOCKET_BASE_URL}ws/v2/vehicles/service-journey/subscription`,
    query,
  );

  // Create listener handles that is "stable" but updated
  // when any state function setters updates
  const onMessageHandler = useCallback(
    (event: WebSocketMessageEvent) => {
      // set as false every time, React will not update if the value is the same.
      setIsConnected(false);
      const vehicle = JSON.parse(event.data) as VehicleWithPosition;
      setLiveVehicle(vehicle);
    },
    [setLiveVehicle, setIsConnected],
  );

  const onCloseHandler = useCallback(
    () => setIsConnected(true),
    [setIsConnected],
  );

  useSubscription({
    url: serviceJourneyId ? url : null,
    onMessage: onMessageHandler,
    onClose: onCloseHandler,
    enabled,
  });

  return [liveVehicle, isConnected] as const;
};
