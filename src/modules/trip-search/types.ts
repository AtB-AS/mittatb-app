import type {DateOptionAndValue} from '@atb/components/date-selection';

export type TripSearchTime = DateOptionAndValue<
  'now' | 'departure' | 'arrival'
>;

export type TimeSearch = {
  searchTime: TripSearchTime;
  cursor?: never;
};

export type CursorSearch = {
  searchTime?: never;
  cursor: string;
};

export type SearchInput = TimeSearch | CursorSearch;

export type SearchStateType =
  | 'idle'
  | 'searching'
  | 'search-success'
  | 'search-empty-result';
