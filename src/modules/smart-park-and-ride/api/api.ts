import {client} from '@atb/api';
import {
  SvvVehicleInfo,
  SvvVehicleInfoSchema,
  VehicleRegistration,
} from '../types';
import {getErrorResponse} from '@atb/api/utils';
import {isAxiosError} from 'axios';

export const addVehicleRegistration = async (
  licensePlate: string,
  nickname?: string,
): Promise<void> => {
  try {
    await client.post(
      `/spar/v1/vehicle-registrations`,
      {licensePlate, nickname},
      {authWithIdToken: true},
    );
  } catch (error) {
    if (isAxiosError(error)) {
      throw getErrorResponse(error);
    }
    throw error;
  }
};

export const getVehicleRegistrations = async (): Promise<
  VehicleRegistration[]
> => {
  const response = await client.get(`/spar/v1/vehicle-registrations`, {
    authWithIdToken: true,
    skipErrorLogging: (error_1) => error_1.response?.status === 404,
  });
  return response.data.vehicles;
};

export const editVehicleRegistration = async (
  id: string,
  licensePlate: string,
  nickname?: string,
): Promise<void> => {
  try {
    await client.put(
      `/spar/v1/vehicle-registrations/${id}`,
      {licensePlate, nickname},
      {authWithIdToken: true},
    );
  } catch (error) {
    if (isAxiosError(error)) {
      throw getErrorResponse(error);
    }
    throw error;
  }
};

export const deleteVehicleRegistration = (id: string): Promise<void> => {
  return client.delete(`/spar/v1/vehicle-registrations/${id}`, {
    authWithIdToken: true,
  });
};

export const searchVehicleInformation = async (
  licensePlate: string,
): Promise<SvvVehicleInfo> => {
  const response = await client.get(`/spar/v1/search-vehicle/${licensePlate}`, {
    authWithIdToken: true,
    skipErrorLogging: (error_1) => error_1.response?.status === 400,
  });
  return SvvVehicleInfoSchema.parse(response.data);
};
