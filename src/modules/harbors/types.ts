import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';

export type StopPlaceFragmentWithIsFree = StopPlaceFragment & {
  isFree?: boolean;
};
