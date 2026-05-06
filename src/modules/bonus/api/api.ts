import {client} from '@atb/api';
import {BonusProductSchema, BonusProductType} from '../types';
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

const ClaimBonusVoucherResponseSchema = z.object({
  code: z.string(),
});

export const claimBonusProductVoucher = async (
  productId: string,
  operatorId: string,
): Promise<string> => {
  const response = await client.post(
    `/bonus/v2/claim/voucher`,
    {productId, operatorId},
    {authWithIdToken: true},
  );

  return ClaimBonusVoucherResponseSchema.parse(response.data).code;
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

const ProductPointsItemSchema = z.object({
  fareProduct: z.string(),
  value: z.number(),
});

const ProductPointsResponseSchema = z.object({
  data: z.array(ProductPointsItemSchema),
});

export type ProductPointsItem = z.infer<typeof ProductPointsItemSchema>;

export const getProductPoints = async (): Promise<ProductPointsItem[]> => {
  const response = await client.get(`/bonus/v2/product-points`, {
    authWithIdToken: true,
  });

  return ProductPointsResponseSchema.parse(response.data).data;
};

export const getActiveBonusProducts = async (): Promise<BonusProductType[]> => {
  const response = await client.get(`/bonus/v2/products`, {
    params: {isActive: true},
    authWithIdToken: true,
  });

  return z.array(BonusProductSchema).parse(response.data);
};
