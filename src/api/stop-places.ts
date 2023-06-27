import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {AUTHORITY} from '@env';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {StopPlaces} from '@atb/api/types/stopPlaces';

export const getStopPlaces = async (
  transportModes?: TransportMode[],
  transportSubmodes?: TransportSubmode[],
  opts?: AxiosRequestConfig,
): Promise<StopPlaces | undefined> => {
  const url = '/bff/v2/stop-places';
  const query = qs.stringify({
    authorities: AUTHORITY,
    transportModes,
    transportSubmodes,
  });
  const result = await client.get<StopPlaces>(stringifyUrl(url, query), {
    ...opts,
  });

  return result.data;
};

export const getStopPlaceConnections = async (
  fromHarborId: string,
  opts?: AxiosRequestConfig,
): Promise<StopPlaces | undefined> => {
  const url = '/bff/v2/stop-places/connections';
  const query = qs.stringify({
    fromHarborId,
  });
  const result = await client.get<StopPlaces>(stringifyUrl(url, query), {
    ...opts,
  });

  return result.data;
};
