import {client} from '@atb/api';
import {
  SvvVehicleInfo,
  SvvVehicleInfoSchema,
  VehicleRegistration,
} from '../types';

export const addVehicleRegistration = (
  licensePlate: string,
  nickname?: string,
): Promise<void> => {
  return client.post(
    `/spar/v1/vehicle-registrations`,
    {licensePlate, nickname},
    {authWithIdToken: true},
  );
};

export const getVehicleRegistrations = (): Promise<VehicleRegistration[]> => {
  return client
    .get(`/spar/v1/vehicle-registrations`, {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 404,
    })
    .then((response) => response.data.vehicles);
};

export const editVehicleRegistration = (
  id: string,
  licensePlate: string,
  nickname?: string,
): Promise<void> => {
  return client.put(
    `/spar/v1/vehicle-registrations/${id}`,
    {licensePlate, nickname},
    {authWithIdToken: true},
  );
};

export const deleteVehicleRegistration = (id: string): Promise<void> => {
  return client.delete(`/spar/v1/vehicle-registrations/${id}`, {
    authWithIdToken: true,
  });
};

export const searchVehicleInformation = (
  licensePlate: string,
): Promise<SvvVehicleInfo> => {
  return client
    .get(`/spar/v1/search-vehicle/${licensePlate}`, {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 400,
    })
    .then((response) => SvvVehicleInfoSchema.parse(response.data));
};
