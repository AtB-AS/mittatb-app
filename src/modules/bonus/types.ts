import {LanguageAndTextTypeArray} from '@atb/modules/configuration';
import {MobilityPriceAdjustmentTypeEnum} from '@atb/api/types/benefit';
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
    adjustmentType: MobilityPriceAdjustmentTypeEnum,
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
  vehicleTypeIds: z.array(z.string()),
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
});

export type BonusProductGroupType = z.infer<typeof BonusProductGroupSchema>;
