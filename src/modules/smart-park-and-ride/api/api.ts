import {client} from '@atb/api';
import {VehicleRegistration} from '../types';

export const addVehicleRegistration = (licensePlate: string): Promise<void> => {
  return client.post(
    `/spar/v1/vehicle-registrations`,
    {licensePlate},
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
): Promise<void> => {
  return client.put(
    `/spar/v1/vehicle-registrations/${id}`,
    {licensePlate},
    {authWithIdToken: true},
  );
};

export const deleteVehicleRegistration = (id: string): Promise<void> => {
  return client.delete(`/spar/v1/vehicle-registrations/${id}`, {
    authWithIdToken: true,
  });
};
