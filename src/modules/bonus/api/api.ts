import {client} from '@atb/api';

export const getBonusBalance = (isLoggedIn: boolean): Promise<number> => {
  if (!isLoggedIn) {
    return Promise.resolve(0);
  }

  return client
    .get(`/bonus/v1/balance`, {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 404,
    })
    .then((response) => {
      return Number(response.data.balance);
    });
};
