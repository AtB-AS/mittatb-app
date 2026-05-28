import {z} from 'zod';

export const MobilityPriceAdjustmentSchema = z
  .object({
    amount: z.number(),
    adjustmentType: z.enum(['FREE_UNLOCK', 'FREE_MINUTES']),
    systemIds: z.array(z.string()).default([]),
  })
  .transform((x) => ({
    amount: x.amount,
    type: x.adjustmentType,
    systemIds: x.systemIds,
  }));

export const MobilityPriceAdjustmentBenefitSchema = z.object({
  kind: z.literal('MOBILITY_PRICE_ADJUSTMENT'),
  vehicleTypeId: z.string(),
  description: z.string(),
  priceAdjustments: z.array(MobilityPriceAdjustmentSchema),
});

export type MobilityPriceAdjustmentType = z.infer<
  typeof MobilityPriceAdjustmentSchema
>;
export type MobilityPriceAdjustmentBenefitType = z.infer<
  typeof MobilityPriceAdjustmentBenefitSchema
>;
