import {client} from './client';
import {AxiosRequestConfig} from 'axios';
import Bugsnag from '@bugsnag/react-native';

type CustomerProfileUpdate = Partial<{
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}>;

export const getProfile = async () => {
  const url = '/profile/v1';
  const response = await client.get(url, {
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
type EmailAvailableResponse = {available: boolean};

export const emailAvailable = async (
  email: string,
  opts?: AxiosRequestConfig,
): Promise<EmailAvailableResponse> => {
  const url = `/profile/v1/available-email?email=${encodeURIComponent(email)}`; // https://github.com/AtB-AS/webshop2/blob/3fdbec83f9cb7368b519c3efd98531dc23dc777b/src/server-api-service/unauth-client.ts
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
