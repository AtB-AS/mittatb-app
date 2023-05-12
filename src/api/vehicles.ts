import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {WS_API_BASE_URL} from '@env';
import {GetServiceJourneyVehicles} from './types/vehicles';
import {useWebSocket, WebSocketEventProps} from './use-websocket';

const WEBSOCKET_BASE_URL = WS_API_BASE_URL;

export const getServiceJourneyVehicles = async (
  serviceJourneyIds?: string[],
  opts?: AxiosRequestConfig,
): Promise<GetServiceJourneyVehicles | undefined> => {
  if (!serviceJourneyIds?.length) {
    return;
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
  onClose,
  onError,
  onMessage,
  onOpen,
}: {serviceJourneyId?: string} & WebSocketEventProps) => {
  const query = qs.stringify({serviceJourneyId});

  const url = stringifyUrl(
    `${WEBSOCKET_BASE_URL}ws/v2/vehicles/service-journey/subscription`,
    query,
  );

  return useWebSocket({
    url: serviceJourneyId ? url : null,
    onMessage,
    onError,
    onOpen,
    onClose,
  });
};
