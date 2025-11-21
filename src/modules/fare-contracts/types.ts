import {UserProfile, SupplementProduct} from '@atb/modules/configuration';
import type {Unit} from 'humanize-duration';
import {UniqueWithCount} from '@atb/utils/array-map-unique-with-count';

export type UserProfileWithCount = UniqueWithCount<UserProfile>;

// BaggageProduct is a SupplementProduct where isBaggageProduct is true and baggageType is not null.
export type BaggageProduct = Omit<
  SupplementProduct,
  'isBaggageProduct' | 'baggageType'
> & {
  baggageType: string;
  isBaggageProduct: true;
};

export type BaggageProductWithCount = UniqueWithCount<BaggageProduct>;
export type Range = {low: number; high: number};
export type UnitMapType = {range: Range; units: Unit[]}[];
