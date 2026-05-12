import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {GeofencingZones} from '@atb/api/types/generated/mobility-types_v2';
import {GetGeofencingZonesQuery} from '@atb/api/types/generated/GeofencingZonesQuery';

export const getGeofencingZones = (
  systemIds: string[],
  opts?: AxiosRequestConfig,
): Promise<GeofencingZones[] | null> => {
  if (systemIds.length < 1) return Promise.resolve(null);
  const url = '/bff/v2/mobility/geofencing-zones';
  const query = qs.stringify({systemIds});
  return client
    .get<GetGeofencingZonesQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data.geofencingZones ?? null);
};
