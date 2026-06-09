import {FormFactorSchema} from '@atb/api/types/mobility';
import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';
import {
  TransportModeType,
  TransportSubmodeType,
} from '@atb-as/config-specs/lib/common';
import {z} from 'zod';
import {optionalNullish} from '@atb-as/config-specs/lib/utils/nullish';

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

const TicketRuleSchema = z.object({
  preassignedFareProductIds: z.array(z.string()).nullish(),
  userProfiles: z.array(z.string()).nullish(),
  zoneIds: z.array(z.string()).nullish(),
});

export type TicketRuleType = z.infer<typeof TicketRuleSchema>;

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
  priceAdjustments: optionalNullish(z.array(BonusPriceAdjustmentSchema)),
  ticketRule: optionalNullish(TicketRuleSchema),
});

export type BonusProductType = z.infer<typeof BonusProductSchema>;

export const BonusProductGroupSchema = z.object({
  id: z.string(),
  description: LanguageAndTextTypeArray,
  price: PriceSchema,
  transportMode: TransportModeType,
  transportSubMode: optionalNullish(TransportSubmodeType),
});

export type BonusProductGroupType = z.infer<typeof BonusProductGroupSchema>;

export const BonusVoucherSchema = z.object({
  operator: z.string(),
  code: z.string(),
  claimDate: z.string(),
});

export type BonusVoucher = z.infer<typeof BonusVoucherSchema>;
