import {z} from 'zod';
import {PriceAdjustmentEnum} from '@atb-as/config-specs/lib/mobility';

// Shared between operator benefits, bonus offers, and booking price adjustments.
// The backend only ever includes an item here when it resolved to a known
// adjustmentType, so callers can rely on it always being present.
export const PriceAdjustmentSchema = z.object({
  amount: z.number(),
  adjustmentType: PriceAdjustmentEnum,
});

export type PriceAdjustmentType = z.infer<typeof PriceAdjustmentSchema>;
