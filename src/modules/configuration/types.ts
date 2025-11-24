import {SupplementProduct} from '@atb-as/config-specs';
import {z} from 'zod';

export * from '@atb-as/config-specs';
export * from '@atb-as/config-specs/lib/mobility';

export type FirestoreConfigStatus = 'loading' | 'success';

export type PointToPointValidity = {
  fromPlace: string;
  toPlace: string;
};

// BaggageProduct is a SupplementProduct where isBaggageProduct is true and baggageType is not null.
export const BaggageProduct = SupplementProduct.extend({
  isBaggageProduct: z.literal(true),
  baggageType: z.string(),
});
export type BaggageProduct = z.infer<typeof BaggageProduct>;
