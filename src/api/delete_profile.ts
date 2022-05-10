import client from './client';
import {AxiosRequestConfig} from 'axios';
import Bugsnag from '@bugsnag/react-native';

export default async function deleteProfile(opts?: AxiosRequestConfig) {
  const url = 'webshop/v1/profile';
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
