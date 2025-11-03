import {UserProfile} from '@atb/modules/configuration';
import type {Unit} from 'humanize-duration';
import type {SupplementProduct} from '@atb-as/config-specs';

export type UserProfileWithCount = UserProfile & {count: number};
export type SupplementProductsWithCount = Record<
  string,
  SupplementProduct & {count: number}
>;
export type Range = {low: number; high: number};
export type UnitMapType = {range: Range; units: Unit[]}[];
