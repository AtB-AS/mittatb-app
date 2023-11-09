import {AxiosRequestConfig} from 'axios';
import {client} from '@atb/api/client';

export const emailAvailable = async (
  email: string,
  opts?: AxiosRequestConfig,
): Promise<boolean> => {
  const url = `/webshop/v1/available-email?email=${encodeURIComponent(email)}`; // https://github.com/AtB-AS/webshop2/blob/3fdbec83f9cb7368b519c3efd98531dc23dc777b/src/server-api-service/unauth-client.ts
  const response = await client.get<boolean>(url, opts);
  return response.data;
};
