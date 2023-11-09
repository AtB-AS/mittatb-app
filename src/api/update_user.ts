import {client} from '@atb/api/client';

type ProfileParams = {
  email?: string;
  firstName?: string;
  id?: string;
  surname?: string;
  phone?: string;
  tcard?: string;
};

export const updateProfile = async (profileParams: ProfileParams) => {
  const url = '';
  const response = await client.post(url, profileParams, {
    authWithIdToken: true,
  });
  return response.data;
};
