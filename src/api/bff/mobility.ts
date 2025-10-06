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

import {GeofencingZones} from '@atb/api/types/generated/mobility-types_v2';
import {GetGeofencingZonesQuery} from '@atb/api/types/generated/GeofencingZonesQuery';

import {
  BikeStationFragment,
  CarStationFragment,
} from '@atb/api/types/generated/fragments/stations';
import {
  ViolationsReportQuery,
  ViolationsReportQueryResult,
  ViolationsReportingInitQuery,
  ViolationsReportingInitQueryResult,
  ViolationsVehicleLookupQuery,
  ViolationsVehicleLookupQueryResult,
} from '../types/mobility';

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
): Promise<GetVehiclesQuery> => {
  if (!includeBicycles && !includeScooters) return Promise.resolve({});
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
): Promise<VehicleExtendedFragment | null> => {
  if (!id || id === '') return Promise.resolve(null);
  const url = '/bff/v2/mobility/vehicle';
  const query = qs.stringify({ids: id});
  return client
    .get<GetVehicleQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data.vehicles?.[0] || null);
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
): Promise<GetStationsQuery> => {
  if (!includeBicycles && !includeCars) return Promise.resolve({});
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
): Promise<BikeStationFragment | null> => {
  const url = '/bff/v2/mobility/station/bike';
  const query = qs.stringify({ids: id});
  return client
    .get<GetBikeStationQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data.stations?.[0] ?? null);
};

export const getCarStation = (
  id: string,
  opts?: AxiosRequestConfig,
): Promise<CarStationFragment | null> => {
  const url = '/bff/v2/mobility/station/car';
  const query = qs.stringify({ids: id});
  return client
    .get<GetCarStationQuery>(stringifyUrl(url, query), opts)
    .then((res) => res.data.stations?.[0] ?? null);
};

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

export const initViolationsReporting = (
  params: ViolationsReportingInitQuery,
  opts?: AxiosRequestConfig,
): Promise<ViolationsReportingInitQueryResult> => {
  const url = '/bff/v2/mobility/violations-reporting/init';
  const query = qs.stringify(params);
  return client
    .get<ViolationsReportingInitQueryResult>(stringifyUrl(url, query), opts)
    .then((res) => res.data);
};

export const lookupVehicleByQr = (
  params: ViolationsVehicleLookupQuery,
  opts?: AxiosRequestConfig,
): Promise<ViolationsVehicleLookupQueryResult> => {
  const url = '/bff/v2/mobility/violations-reporting/vehicle';
  const query = qs.stringify(params);
  return client
    .get<ViolationsVehicleLookupQueryResult>(stringifyUrl(url, query), opts)
    .then((res) => res.data);
};

export const sendViolationsReport = (
  data: ViolationsReportQuery,
  opts?: AxiosRequestConfig,
): Promise<ViolationsReportQueryResult> => {
  const url = '/bff/v2/mobility/violations-reporting/report';
  return client
    .post<ViolationsReportQueryResult>(url, data, opts)
    .then((res) => res.data);
};
