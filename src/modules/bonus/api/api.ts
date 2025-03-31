import {client} from '@atb/api';

export const getBonusBalance = (): Promise<number> => {
  return client
    .get(`/bonus/v1/balance`, {
      authWithIdToken: true,
      skipErrorLogging: (error) => error.response?.status === 404,
    })
    .then((response) => {
      return Number(response.data.balance);
    });
};
