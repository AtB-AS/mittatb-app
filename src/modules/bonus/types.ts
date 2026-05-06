import {FormFactorSchema} from '@atb/api/types/mobility';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {z} from 'zod';

export enum BonusProductTypeEnum {
  VOUCHER = 'VOUCHER',
  TICKET = 'TICKET',
  SHARED_MOBILITY = 'SHARED_MOBILITY',
}

export const BonusProductSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  operatorIds: z.array(z.string()),
  formFactors: z.array(FormFactorSchema),
  price: z.number(),
  productType: z.enum(BonusProductTypeEnum),
  description: LanguageAndTextTypeArray,
  paymentDescription: LanguageAndTextTypeArray,
});

export type BonusProductType = z.infer<typeof BonusProductSchema>;
