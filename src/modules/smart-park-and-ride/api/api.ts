import {client} from '@atb/api';
import {
  SvvVehicleInfo,
  SvvVehicleInfoSchema,
  VehicleRegistration,
  VehicleRegistrationSchema,
} from '../types';

export const addVehicleRegistration = async (
  licensePlate: string,
  nickname?: string,
): Promise<void> => {
  await client.post(
    `/spar/v1/vehicle-registrations`,
    {licensePlate, nickname},
    {authWithIdToken: true},
  );
};

export const getVehicleRegistrations = async (): Promise<
  VehicleRegistration[]
> => {
  const response = await client.get(`/spar/v1/vehicle-registrations`, {
    authWithIdToken: true,
    skipErrorLogging: (error) => error.response?.status === 404,
  });
  return VehicleRegistrationSchema.array().parse(response?.data?.vehicles);
};

export const editVehicleRegistration = async (
  id: string,
  licensePlate: string,
  nickname?: string,
): Promise<void> => {
  await client.put(
    `/spar/v1/vehicle-registrations/${id}`,
    {licensePlate, nickname},
    {authWithIdToken: true},
  );
};

export const deleteVehicleRegistration = async (id: string): Promise<void> => {
  await client.delete(`/spar/v1/vehicle-registrations/${id}`, {
    authWithIdToken: true,
  });
};

export const searchVehicleInformation = async (
  licensePlate: string,
): Promise<SvvVehicleInfo> => {
  const response = await client.get(`/spar/v1/search-vehicle/${licensePlate}`, {
    authWithIdToken: true,
    skipErrorLogging: (error) => error.response?.status === 400,
  });
  return SvvVehicleInfoSchema.parse(response?.data);
};
