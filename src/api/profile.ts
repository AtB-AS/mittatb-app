import {client} from '@atb/api/client';
import {AxiosRequestConfig} from 'axios';

export type CustomerProfileUpdate = Partial<{
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}>;

export const getProfile = async () => {
  const url = '/webshop/v1/profile/get'; // ??
  const response = await client.get(url, {
    authWithIdToken: true,
  });
  return response.data;
};

export const updateProfile = async (profile: CustomerProfileUpdate) => {
  const url = '/webshop/v1/profile'; // change to /webshop/v1/profile/update?
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
  const url = `/webshop/v1/available-email?email=${encodeURIComponent(email)}`; // https://github.com/AtB-AS/webshop2/blob/3fdbec83f9cb7368b519c3efd98531dc23dc777b/src/server-api-service/unauth-client.ts
  const response = await client.get<EmailAvailableResponse>(url, opts);
  return response.data;
};
