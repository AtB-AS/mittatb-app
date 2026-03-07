import {client} from '@atb/api';
import {z} from 'zod';

export const getBonusBalance = async (): Promise<number> => {
  const response = await client.get(`/bonus/v2/balance`, {
    authWithIdToken: true,
    skipErrorLogging: (error) => error.response?.status === 404,
  });

  const value =
    response.data.balance === null ? NaN : Number(response.data.balance);

  return value;
};

export const buyValueCodeWithBonusPoints = async (
  bonusProductId: string | undefined,
): Promise<string | null> => {
  if (!bonusProductId) return null;
  const response = await client.post(
    `/bonus/v2/buy-product/value-code/${bonusProductId}`,
    undefined,
    {
      authWithIdToken: true,
    },
  );

  return String(response.data.code);
};

const BonusAmountEarnedSchema = z.object({
  amount: z.number(),
});

export type BonusAmountEarned = z.infer<typeof BonusAmountEarnedSchema>;

export const getBonusAmountEarned = async (
  orderId: string | undefined,
): Promise<BonusAmountEarned> => {
  const response = await client.get(`/bonus/v2/orders/${orderId}/amount`, {
    authWithIdToken: true,
  });

  return BonusAmountEarnedSchema.parse(response.data);
};
