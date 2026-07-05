import {z} from 'zod';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';
import {LanguageAndTextTypeArray} from '@atb-as/config-specs/lib/common';

export const PriceAdjustmentSchema = z
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

// The backend resolves a single benefit for the vehicle (kind, eligibility,
// vehicle/system filtering all happen server-side), so the app only models the
// display payload.
export const BenefitSchema = z.object({
  title: LanguageAndTextTypeArray.default([]),
  description: LanguageAndTextTypeArray.default([]),
  illustrationName: z.string().optional(),
  priceAdjustments: z.array(PriceAdjustmentSchema),
});

export type PriceAdjustmentType = z.infer<typeof PriceAdjustmentSchema>;
export type BenefitType = z.infer<typeof BenefitSchema>;
