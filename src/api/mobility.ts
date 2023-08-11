import {client} from '@atb/api/index';
import {
  GetVehicleQuery,
  GetVehiclesQuery,
  GetVehiclesQueryVariables,
} from '@atb/api/types/generated/VehiclesQuery';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';
import {AxiosRequestConfig} from 'axios';
import {VehicleExtendedFragment} from '@atb/api/types/generated/fragments/vehicles';
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

type VehicleRequestOpts = Pick<AxiosRequestConfig, 'signal'>;

export const getVehicles = (
  {
    lat,
    lon,
    range,
    includeBicycles,
    bicycleOperators,
    includeScooters,
    scooterOperators,
  }: GetVehiclesQueryVariables,
  opts?: VehicleRequestOpts,
) => {
  const url = '/bff/v2/mobility/vehicles_v2';
  const query = qs.stringify({
    lat,
    lon,
    range: Math.ceil(range),
    includeBicycles,
    bicycleOperators,
    includeScooters,
    scooterOperators,
  });
  return client
    .get<GetVehiclesQuery>(stringifyUrl(url, query), {
      ...opts,
    })
    .then((res) => res.data ?? []);
};

export const getVehicle = (
  id: string,
  opts?: VehicleRequestOpts,
): Promise<VehicleExtendedFragment | undefined> => {
  const url = '/bff/v2/mobility/vehicle';
  const query = qs.stringify({ids: id});
  return client
    .get<GetVehicleQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data.vehicles?.[0]);
};

export const getStations = (
  {
    lat,
    lon,
    range,
    includeBicycles,
    includeCars,
    bicycleOperators,
    carOperators,
  }: GetStationsQueryVariables,
  opts?: AxiosRequestConfig,
) => {
  const url = '/bff/v2/mobility/stations_v2';
  const query = qs.stringify({
    lat,
    lon,
    range: Math.ceil(range),
    includeBicycles,
    includeCars,
    bicycleOperators,
    carOperators,
  });
  return client
    .get<GetStationsQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data ?? []);
};

export const getBikeStation = (
  id: string,
  opts?: AxiosRequestConfig,
): Promise<BikeStationFragment | undefined> => {
  const url = '/bff/v2/mobility/station/bike';
  const query = qs.stringify({ids: id});
  return client
    .get<GetBikeStationQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data.stations?.[0]);
};

export const getCarStation = (
  id: string,
  opts?: AxiosRequestConfig,
): Promise<CarStationFragment | undefined> => {
  const url = '/bff/v2/mobility/station/car';
  const query = qs.stringify({ids: id});
  return client
    .get<GetCarStationQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data.stations?.[0]);
};
