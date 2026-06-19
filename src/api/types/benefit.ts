import {z} from 'zod';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';

export const MobilityPriceAdjustmentSchema = z
  .object({
    amount: z.number(),
    adjustmentType: PriceAdjustmentEnum,
    description: z.string().default(''),
  })
  .transform((x) => ({
    amount: x.amount,
    type: x.adjustmentType,
    description: x.description,
  }));

export const MobilityPriceAdjustmentBenefitSchema = z.object({
  kind: z.literal('MOBILITY_PRICE_ADJUSTMENT'),
  vehicleTypeIds: z.array(z.string()).default([]),
  systemIds: z.array(z.string()).default([]),
  priceAdjustments: z.array(MobilityPriceAdjustmentSchema),
});

export type MobilityPriceAdjustmentType = z.infer<
  typeof MobilityPriceAdjustmentSchema
>;
export type MobilityPriceAdjustmentBenefitType = z.infer<
  typeof MobilityPriceAdjustmentBenefitSchema
>;
