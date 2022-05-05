import client from './client';
import {TripPattern} from '@atb/sdk';
import {AxiosRequestConfig} from 'axios';

type DeleteProfileResponse = {
  available: boolean;
};

export default async function deleteProfile(opts?: AxiosRequestConfig) {
  /*
  DELETE webshop/v1/profile
  parameters:
        - in: body
          name: request
          required: false

  CustomerProfileDeleteRequest:
    type: object
    properties:
      expirationDate:
        type: string
        example: 2022-02-22T15:00:00+01:00
        pattern: '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+,-]\d{2}:\d{2}$'


   */
  const url = 'webshop/v1/available-email?email=tor';
  const result = client.get<DeleteProfileResponse>(url, {
    ...opts,
    authWithIdToken: true,
  });
  return result;
}
