import {
  CustomerProfile,
  CustomerProfileUpdate,
  OnBehalfOfAccountsResponse,
} from '@atb/api/types/profile';
import Bugsnag from '@bugsnag/react-native';
import {AxiosRequestConfig} from 'axios';
import {client} from './client';
import {HttpErrorResponse} from './utils';

export const getProfile = async () => {
  const response = await client.get<CustomerProfile>('/profile/v1', {
    authWithIdToken: true,
  });
  return response.data;
};

export const updateProfile = async (profile: CustomerProfileUpdate) => {
  const response = await client.patch('/profile/v1', profile, {
    authWithIdToken: true,
  });
  return response.data;
};

export async function deleteProfile(opts?: AxiosRequestConfig) {
  const query = {expirationDate: new Date().toISOString()};
  const deleteOK = await client
    .delete('/profile/v1', {
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

/**
 * Function to get customer account ID based on phone number
 *
 * @param phoneNumber phone number with prefix
 * @returns {string | undefined}
 *  - customer_account_id as string if successful
 *  - undefined if account ID not found
 * @throws error from server
 */
export const getCustomerAccountId = async (
  phoneNumber: string,
): Promise<string | undefined> => {
  return await client
    .post(
      `/profile/v1/search`,
      {phoneNumber: phoneNumber},
      {
        authWithIdToken: true,
        skipErrorLogging: (error) =>
          error.response?.status === 404 || error.response?.status === 400,
      },
    )
    .then((response) => response.data.customerAccountId as string)
    .catch((error: HttpErrorResponse) => {
      if (error.http.code === 404 || error.http.code === 400) {
        return undefined;
      }
      throw error;
    });
};

/**
 * Function to fetch saved recipients
 */
export const fetchOnBehalfOfAccounts =
  (): Promise<OnBehalfOfAccountsResponse> =>
    client
      .get(`/profile/v1/on-behalf-of/accounts`, {
        authWithIdToken: true,
      })
      .then((response) => response.data);

/**
 * Function to get phone number from an account ID
 *
 * @param {string} accountId customer account ID
 * @returns {string} phone number as string if successful
 * @throws error from server
 */
export const getPhoneNumberFromId = async (
  accountId?: string,
): Promise<string> => {
  return await client
    .post<CustomerProfile>(
      `/profile/v1/lookup`,
      {customerAccountId: accountId},
      {
        authWithIdToken: true,
        skipErrorLogging: (error) => error.response?.status === 400,
      },
    )
    .then((response) => response.data.phone);
};

export const deleteOnBehalfOfAccount = async (accountId: string) => {
  await client.patch(
    `/profile/v1/on-behalf-of/${accountId}`,
    {customerAlias: undefined, phoneNumber: undefined},
    {authWithIdToken: true},
  );
};
