export * from '@atb-as/config-specs';
export * from '@atb-as/config-specs/lib/mobility';

export type FirestoreConfigStatus = 'loading' | 'success';

export type PointToPointValidity = {
  fromPlace: string;
  toPlace: string;
};

import type {SupplementProduct} from './types';
// BaggageProduct is a SupplementProduct where isBaggageProduct is true and baggageType is not null.
export type BaggageProduct = Omit<
  SupplementProduct,
  'isBaggageProduct' | 'baggageType'
> & {
  baggageType: string;
  isBaggageProduct: true;
};
