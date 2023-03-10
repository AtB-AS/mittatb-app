import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {
  GetStationsQuery,
  GetStationsQueryVariables,
} from '@atb/api/types/generated/StationsQuery';

export const getStations = (
  {lat, lon, range, availableFormFactors}: GetStationsQueryVariables,
  opts?: AxiosRequestConfig,
) => {
  const url = '/bff/v2/mobility/vehicles';
  const query = qs.stringify({
    lat,
    lon,
    range: Math.ceil(range),
    availableFormFactors,
  });
  return client
    .get<GetStationsQuery>(stringifyUrl(url, query), {
      ...opts,
    })
    .then((res) => res.data.stations ?? []);
};
