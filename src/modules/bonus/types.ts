import {FormFactorSchema} from '@atb/api/types/mobility';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';
import {z} from 'zod';

export enum BonusProductTypeEnum {
  VOUCHER = 'VOUCHER',
  TICKET = 'TICKET',
  SHARED_MOBILITY = 'SHARED_MOBILITY',
}

const PriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

const BonusPriceAdjustmentSchema = z
  .object({
    amount: z.number(),
    description: z.string(),
    adjustmentType: PriceAdjustmentEnum,
    systemIds: z.array(z.string()),
  })
  .transform(({adjustmentType, ...rest}) => ({
    ...rest,
    type: adjustmentType,
  }));

export const BonusProductSchema = z.object({
  id: z.string(),
  isActive: z.boolean(),
  bonusProductGroupId: z.string(),
  operatorId: z.string(),
  formFactors: z.array(FormFactorSchema),
  price: PriceSchema,
  productType: z.enum(BonusProductTypeEnum),
  description: LanguageAndTextTypeArray,
  paymentDescription: LanguageAndTextTypeArray,
  priceAdjustments: z.array(BonusPriceAdjustmentSchema).optional(),
});

export type BonusProductType = z.infer<typeof BonusProductSchema>;

export const BonusProductGroupSchema = z.object({
  id: z.string(),
  description: LanguageAndTextTypeArray,
  price: PriceSchema,
});

export type BonusProductGroupType = z.infer<typeof BonusProductGroupSchema>;
