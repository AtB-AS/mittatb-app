import {z} from 'zod';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';

export const MobilityPriceAdjustmentSchema = z
  .object({
    amount: z.number(),
    adjustmentType: PriceAdjustmentEnum,
    description: z.string().default(''),
    // `systemIds` lives at the benefit level for mobility benefits; it is only
    // present per-adjustment on the bonus-product path (see modules/bonus).
    systemIds: z.array(z.string()).optional(),
  })
  .transform((x) => ({
    amount: x.amount,
    type: x.adjustmentType,
    description: x.description,
    systemIds: x.systemIds,
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
