import client from './client';
import {TripPattern} from '@atb/sdk';

type DeleteProfileResponse = {
  available: boolean;
};

export default async function deleteProfile() {
  const url = 'webshop/v1/available-email?email=tor';
  const result = client.get<DeleteProfileResponse>(url);
  return result;
}
