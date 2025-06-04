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
      const value =
        response.data.balance === null ? NaN : Number(response.data.balance);
      return value;
    });
};

export const buyValueCodeWithBonusPoints = (
  bonusProductId: string | undefined,
): Promise<string | null> => {
  if (!bonusProductId) return Promise.resolve(null);
  return client
    .get(`/bonus/v1/buy-product/value-code/${bonusProductId}`, {
      authWithIdToken: true,
    })
    .then((response) => String(response.data.code));
};

export const getBonusAmountEarned = (isLoggedIn: boolean, isBonusProgramEnabled: boolean, fareContractId: string | undefined, disabled: boolean): Promise<number> => {
  if (!isLoggedIn || !isBonusProgramEnabled || fareContractId === undefined || disabled) {
    return Promise.resolve(0);
  }

  return client
    .get(`/bonus/v1/fare-contract/${fareContractId}/amount`, {
      authWithIdToken: true,
    })
    .then((response) => {
      const value =
        response.data.amount === null ? 0 : Number(response.data.amount);
      if (value == 0){
        throw new Error()
      }
      return value;
    });
};