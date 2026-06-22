import type {LegFragment} from '@atb/api/types/generated/fragments/legs';

export type TripFragment = {
  nextPageCursor?: string;
  previousPageCursor?: string;
  metadata?: {nextDateTime?: any; prevDateTime?: any; searchWindowUsed: number};
  tripPatterns: Array<TripPatternFragment>;
};

export type TripPatternFragment = {
  expectedStartTime: any;
  expectedEndTime: any;
  duration?: any;
  walkDistance?: number;
  legs: Array<LegFragment>;
};
