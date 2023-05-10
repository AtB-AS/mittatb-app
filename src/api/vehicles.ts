import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {WS_API_BASE_URL} from '@env';
import {GetServiceJourneyVehicles} from './types/vehicles';
import Bugsnag from '@bugsnag/react-native';

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

export const getLiveVehicleSubscription = (serviceJourneyId: string) => {
  const baseUrl = WS_API_BASE_URL;
  Bugsnag.notify(`WebSocket URL was ${baseUrl}`);

  const url = `${WS_API_BASE_URL}ws/v2/vehicles/service-journey/subscription`;
  const query = qs.stringify({serviceJourneyId});

  return new WebSocket(stringifyUrl(url, query));
};
