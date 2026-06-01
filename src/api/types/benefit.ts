import {z} from 'zod';

export const MobilityPriceAdjustmentSchema = z
  .object({
    amount: z.number(),
    adjustmentType: z.enum(['FREE_UNLOCK', 'FREE_MINUTES']),
    description: z.string(),
  })
  .transform((x) => ({
    amount: x.amount,
    type: x.adjustmentType,
    description: x.description,
  }));

export const MobilityPriceAdjustmentBenefitSchema = z.object({
  kind: z.literal('MOBILITY_PRICE_ADJUSTMENT'),
  vehicleTypeIds: z.array(z.string()),
  systemIds: z.array(z.string()).default([]),
  priceAdjustments: z.array(MobilityPriceAdjustmentSchema),
});

export type MobilityPriceAdjustmentType = z.infer<
  typeof MobilityPriceAdjustmentSchema
>;
export type MobilityPriceAdjustmentBenefitType = z.infer<
  typeof MobilityPriceAdjustmentBenefitSchema
>;
