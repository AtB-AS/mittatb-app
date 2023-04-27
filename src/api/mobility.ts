import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
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

type VehicleRequestOpts = Pick<AxiosRequestConfig, 'signal'>;

export const getVehicles = (
  {lat, lon, range}: GetVehiclesQueryVariables,
  opts?: VehicleRequestOpts,
) => {
  const url = '/bff/v2/mobility/vehicles';
  const query = qs.stringify({
    lat,
    lon,
    range: Math.ceil(range),
    formFactors: FormFactor.Scooter, //TODO: Read from variables
  });
  return client
    .get<GetVehiclesQuery>(stringifyUrl(url, query), {
      ...opts,
    })
    .then((res) => res.data.vehicles ?? []);
};

export const getVehicle = (
  id: string,
  opts?: VehicleRequestOpts,
): Promise<VehicleExtendedFragment | undefined> => {
  const url = '/bff/v2/mobility/vehicle';
  const query = qs.stringify({ids: id});
  return client
    .get<GetVehicleQuery>(stringifyUrl(url, query), {
      ...opts,
    })
    .then((res) => res.data.vehicles?.[0]);
};
