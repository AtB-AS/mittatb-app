import {client} from '@atb/api';
import {z} from 'zod';

export const getBonusBalance = async (): Promise<number> => {
  const response = await client.get(`/bonus/v1/balance`, {
    authWithIdToken: true,
    skipErrorLogging: (error) => error.response?.status === 404,
  });
  const value =
    response.data.balance === null ? NaN : Number(response.data.balance);
  return value;
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

const BonusAmountEarnedSchema = z.object({
  amount: z.number(),
});

export type BonusAmountEarned = z.infer<typeof BonusAmountEarnedSchema>;

export const getBonusAmountEarned = (
  fareContractId: string | undefined,
): Promise<BonusAmountEarned> => {
  return client
    .get(`/bonus/v1/fare-contract/${fareContractId}/amount`, {
      authWithIdToken: true,
    })
    .then((response) => BonusAmountEarnedSchema.parse(response.data));
};
