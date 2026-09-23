import {z} from 'zod';
import {LanguageAndTextTypeArray} from '@atb-as/config-specs/lib/common';
import {PriceAdjustmentSchema} from './price-adjustment';

export type {PriceAdjustmentType} from './price-adjustment';

// The backend resolves a single benefit for the vehicle (kind, eligibility,
// vehicle/system filtering all happen server-side), so the app only models the
// display payload.
export const BenefitSchema = z.object({
  title: LanguageAndTextTypeArray.nullish().transform((v) => v ?? undefined),
  description: LanguageAndTextTypeArray.nullish().transform(
    (v) => v ?? undefined,
  ),
  illustrationName: z.string().optional(),
  priceAdjustments: z.array(PriceAdjustmentSchema),
});

export type BenefitType = z.infer<typeof BenefitSchema>;
