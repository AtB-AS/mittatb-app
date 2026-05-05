import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {z} from 'zod';

export const BonusProductTypeEnum = z.enum([
  'VOUCHER',
  'TICKET',
  'SHARED_MOBILITY',
]);

export const BonusProductSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  operatorIds: z.array(z.string()),
  formFactors: z.array(
    z.enum(Object.values(FormFactor) as [FormFactor, ...FormFactor[]]),
  ),
  price: z.number(),
  productType: BonusProductTypeEnum,
  description: LanguageAndTextTypeArray,
  paymentDescription: LanguageAndTextTypeArray,
});

export type BonusProductType = z.infer<typeof BonusProductSchema>;
