import {UserProfile, SupplementProduct} from '@atb/modules/configuration';
import type {Unit} from 'humanize-duration';
import {UniqueWithCount} from '@atb/utils/array-map-unique-with-count';

export type UserProfileWithCount = UniqueWithCount<UserProfile>;
export type SupplementProductWithCount = UniqueWithCount<SupplementProduct>;
export type Range = {low: number; high: number};
export type UnitMapType = {range: Range; units: Unit[]}[];
