import {client} from '@atb/api/index';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {
  GetBikeStationQuery,
  GetCarStationQuery,
  GetStationsQuery,
  GetStationsQueryVariables,
} from '@atb/api/types/generated/StationsQuery';
import {
  BikeStationFragment,
  CarStationFragment,
} from '@atb/api/types/generated/fragments/stations';

export const getStations = (
  {lat, lon, range, availableFormFactors}: GetStationsQueryVariables,
  opts?: AxiosRequestConfig,
) => {
  const url = '/bff/v2/mobility/stations';
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

export const getBikeStation = (
  id: string,
  opts?: AxiosRequestConfig,
): Promise<BikeStationFragment | undefined> => {
  const url = '/bff/v2/mobility/station/bike';
  const query = qs.stringify({ids: id});
  return client
    .get<GetBikeStationQuery>(stringifyUrl(url, query), {
      ...opts,
    })
    .then((res) => (res.data.stations ? res.data.stations[0] : undefined));
};

export const getCarStation = (
  id: string,
  opts?: AxiosRequestConfig,
): Promise<CarStationFragment | undefined> => {
  const url = '/bff/v2/mobility/station/car';
  const query = qs.stringify({ids: id});
  return client
    .get<GetCarStationQuery>(stringifyUrl(url, query), {
      ...opts,
    })
    .then((res) => (res.data.stations ? res.data.stations[0] : undefined));
};
