import {client} from '@atb/api';

export const addVehicle = (licensePlate: string): Promise<void> => {
  return client.post(
    `/spar/v1/vehicle-registration`,
    {licensePlate},
    {authWithIdToken: true},
  );
};
