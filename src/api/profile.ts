import {CustomerProfile, CustomerProfileUpdate} from '@atb/api/types/profile';
import Bugsnag from '@bugsnag/react-native';
import {AxiosRequestConfig} from 'axios';
import {client} from './client';
import {getAxiosErrorMetadata} from './utils';
import {GetAccountByPhoneErrorCode} from '@atb/on-behalf-of/types';

const profileEndpoint = '/profile/v1';

export const getProfile = async () => {
  const response = await client.get<CustomerProfile>(profileEndpoint, {
    authWithIdToken: true,
  });
  return response.data;
};

export const updateProfile = async (profile: CustomerProfileUpdate) => {
  const response = await client.patch(profileEndpoint, profile, {
    authWithIdToken: true,
  });
  return response.data;
};

export async function deleteProfile(opts?: AxiosRequestConfig) {
  const query = {expirationDate: new Date().toISOString()};
  const deleteOK = await client
    .delete(profileEndpoint, {
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
 * @returns {string | GetAccountByPhoneErrorCode}
 *  - customer_account_id as string if successful,
 *  - "no_associated_account" if account ID not found,
 *  - "unknown_error" if there's other error
 *
 */
export const getCustomerAccountId = async (
  phoneNumber: string,
): Promise<string | GetAccountByPhoneErrorCode> => {
  return await client
    .post(
      `${profileEndpoint}/search`,
      {phoneNumber: phoneNumber},
      {
        authWithIdToken: true,
        skipErrorLogging: (error) =>
          error.response?.status === 404 || error.response?.status === 400,
      },
    )
    .then((response) => response.data.customerAccountId as string)
    .catch((error) => {
      const metadata = getAxiosErrorMetadata(error);
      const responseStatus = metadata.responseStatus;
      if (responseStatus === 404 || responseStatus === 400) {
        return 'no_associated_account';
      }
      return 'unknown_error';
    });
};
