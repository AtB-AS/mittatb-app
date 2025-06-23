import {client} from '@atb/api';
import {VehicleRegistration} from '../types';

export const addVehicleRegistration = (licensePlate: string): Promise<void> => {
  return client.post(
    `/spar/v1/vehicle-registration`,
    {licensePlate},
    {authWithIdToken: true},
  );
};

export const listVehicleRegistrations = (): Promise<VehicleRegistration[]> => {
  return client
    .get(`/spar/v1/vehicle-registration`, {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 404,
    })
    .then((response) => response.data.vehicles);
};
