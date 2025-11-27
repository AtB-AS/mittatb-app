import {SupplementProduct} from '@atb-as/config-specs';
import {z} from 'zod';

export * from '@atb-as/config-specs';
export * from '@atb-as/config-specs/lib/mobility';

export type FirestoreConfigStatus = 'loading' | 'success';

export type PointToPointValidity = {
  fromPlace: string;
  toPlace: string;
};

export const BaggageType = z.enum(['BICYCLE']);
export type BaggageType = z.infer<typeof BaggageType>;

// BaggageProduct is a SupplementProduct where isBaggageProduct is true and baggageType is not null.
export const BaggageProduct = SupplementProduct.extend({
  isBaggageProduct: z.literal(true),
  baggageType: BaggageType,
});
export type BaggageProduct = z.infer<typeof BaggageProduct>;
