import {UserProfile} from '@atb/modules/configuration';
import type {Unit} from 'humanize-duration';

export type UserProfileWithCount = UserProfile & {count: number};
export type Range = {low: number; high: number};
export type UnitMapType = {range: Range; units: Unit[]}[];
