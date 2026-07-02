import {z} from 'zod';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';
import {LanguageAndTextTypeArray} from '@atb-as/config-specs/lib/common';

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

export const MobilityBenefitSourceSchema = z.enum([
  'campaign',
  'mobility-benefit',
]);

export type MobilityBenefitSource = z.infer<typeof MobilityBenefitSourceSchema>;

export const MobilityPriceAdjustmentBenefitSchema = z.object({
  kind: z.literal('MOBILITY_PRICE_ADJUSTMENT'),
  source: MobilityBenefitSourceSchema.optional(),
  title: LanguageAndTextTypeArray.default([]),
  description: LanguageAndTextTypeArray.default([]),
  illustration: z.string().optional(),
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
