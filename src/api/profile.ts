import {client} from './client';
import {AxiosRequestConfig} from 'axios';
import Bugsnag from '@bugsnag/react-native';
import {
  CustomerProfile,
  CustomerProfileUpdate,
  EmailAvailableResponse,
} from '@atb/api/types/profile';

export const getProfile = async () => {
  const url = '/profile/v1';
  const response = await client.get<CustomerProfile>(url, {
    authWithIdToken: true,
  });
  return response.data;
};

export const updateProfile = async (profile: CustomerProfileUpdate) => {
  const url = '/profile/v1';
  const response = await client.patch(url, profile, {
    authWithIdToken: true,
  });
  return response.data;
};

export const emailAvailable = async (
  email: string,
  opts?: AxiosRequestConfig,
): Promise<EmailAvailableResponse> => {
  const url = `/profile/v1/available-email?email=${encodeURIComponent(email)}`;
  const response = await client.get<EmailAvailableResponse>(url, opts);
  return response.data;
};

export async function deleteProfile(opts?: AxiosRequestConfig) {
  const url = '/profile/v1';
  const query = {expirationDate: new Date().toISOString()};
  const deleteOK = await client
    .delete(url, {
      ...opts,
      authWithIdToken: true,
      data: query,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      Bugsnag.notify(error);
      return false;
    });

  return deleteOK;
}
