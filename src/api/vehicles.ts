import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {client} from '@atb/api/index';
import {
  GetVehiclesQuery,
  GetVehiclesQueryVariables,
} from '@atb/api/types/generated/VehiclesQuery';
import {stringifyUrl} from '@atb/api/utils';
import qs from 'query-string';

export const getVehicles = ({lat, lon, range}: GetVehiclesQueryVariables) => {
  const url = '/bff/v2/mobility/vehicles';
  const query = qs.stringify({
    lat,
    lon,
    range,
    formFactors: FormFactor.Scooter, //TODO: Read from variables
  });
  return client
    .get<GetVehiclesQuery>(stringifyUrl(url, query), {
      baseURL: 'http://localhost:8080', // TODO: Remove
    })
    .then((res) => {
      console.log(`${res.data.vehicles?.length ?? 0} vehicles loaded`); // TODO: Remove
      return res;
    })
    .then((res) => res.data.vehicles ?? []);
};
