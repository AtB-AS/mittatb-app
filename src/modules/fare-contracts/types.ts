import {UserProfile, BaggageProduct} from '@atb/modules/configuration';
import type {Unit} from 'humanize-duration';
import {UniqueWithCount} from '@atb/utils/unique-with-count';
import type {SupplementProduct} from '@atb-as/config-specs';

export type UserProfileWithCount = UniqueWithCount<UserProfile>;

export type BaggageProductWithCount = UniqueWithCount<BaggageProduct>;
export type SupplementProductWithCount = UniqueWithCount<SupplementProduct>;
export type Range = {low: number; high: number};
export type UnitMapType = {range: Range; units: Unit[]}[];
